<?
#-----------------------------------------------------------------------------------
# les Variables Globales
#-----------------------------------------------------------------------------------
$SQL_SI_TimeScript=microtime();		# TimeStamp du début du script PHP
$SQL_SI_Open=false;					# Base MySQL déjà ouverte?
$SQL_SI_mysql=0;					# Descripteur de Session MySQL
$SQL_SI_TimeSQL=0;					# TimeStamp de la derniere ouverture MySQL
$SQL_SI_TimeTSQL=0;					# Consommation Total de temps MySQL
$SQL_SI_TiDViewList="";				# Liste des Id vue lors de cette requête MySQL
#-----------------------------------------------------------------------------------
# les Variables Sites
#-----------------------------------------------------------------------------------
require("_sqlsite.php"); 		

#-----------------------------------------------------------------------------------
function _sqlconnect() { #Ouverture de la DB
	global $SQL_SI_hostname, $SQL_SI_username, $SQL_SI_password, $SQL_SI_dbName, $SQL_SI_Open, $SQL_SI_mysql, $SQL_SI_TimeSQL;

    if ($SQL_SI_Open) return $SQL_SI_mysql;		// session déja ouverte

  	#1203=>User already has more than 'max_user_connections' active connections
	$i=0;
	do{ #multi-tentative si max_user_connections atteinds
	  	$mysql = @MySQL_CONNECT($SQL_SI_hostname,$SQL_SI_username,$SQL_SI_password);
	  	if (mysql_errno()==1203) {usleep(500000); $i++;} else {break;} # 1/2 seconde de pause
	}while ((!$mysql) && ($i<5));  #Connection sur 5 secondes
  	
  	if ($mysql <= 0) {DIE("SQL Serveur non disponible");}
  	$mysql = @mysql_select_db($SQL_SI_dbName) ;
  	if ($mysql <= 0) {DIE("DataBase non disponible");}

    $SQL_SI_TimeSQL=microtime();			// on démarre le timer....
  	$SQL_SI_Open=true; $SQL_SI_mysql=mysql;	// la session est maintenant ouverte  	
  	return $mysql;
}

#-----------------------------------------------------------------------------------
function _sqlclose() { #Fermeture de la DB
	global $SQL_SI_Open, $SQL_SI_TimeSQL, $SQL_SI_TimeTSQL;
	
  	@mysql_close();	
	$xT1 = explode(" ",$SQL_SI_TimeSQL);	$xT2 = explode(" ",microtime());
	$SQL_SI_TimeTSQL+=($xT2[1]-$xT1[1])+($xT2[0]-$xT1[0]);
	$SQL_SI_Open=false;	// session close	
  	return;
}

#-----------------------------------------------------------------------------------
function _sqlTLog() { #Log de la consommation de temps, et clos la DB
	if (SQL_SI_TimeTSQL<2) return;	#On ne logg que les requete qui consomme du temps mySQL

	global  $SQL_SI_hostname, $SQL_SI_username, $SQL_SI_password, $SQL_SI_dbName, $SQL_SI_Open, $SQL_SI_TimeScript, $SQL_SI_TimeTSQL;

	$TimeStamp=date("Y-m-d H:i:s"); 
	$OutOfDate=date("Y-m-d H:i:s",mktime(date("H"),date("i"),date("s"),date("m"),date("d")-7,date("Y")));
	$xT1 = explode(" ",$SQL_SI_TimeScript);	$xT2 = explode(" ",microtime());
	$TimeScript=($xT2[1]-$xT1[1])+($xT2[0]-$xT1[0]);
	
	# Ouverture DB
    if ($SQL_SI_Open==false) {		// session déja ouverte
	  	$mysql = @MySQL_CONNECT($SQL_SI_hostname,$SQL_SI_username,$SQL_SI_password);
	  	if ($mysql <= 0) { return; }
	  	$mysql = @mysql_select_db($SQL_SI_dbName) ;
	  	if ($mysql <= 0) { return; }
	}
	
	# La DB doit être ouverte pour savoir comment convertir les caractères
	$ipaddr=mysql_real_escape_string($_SERVER["REMOTE_ADDR"]);
	$self=mysql_real_escape_string($_SERVER["REQUEST_URI"]);
	$refer=mysql_real_escape_string($_SERVER["HTTP_REFERER"]);
		
 	$_sqlquery =  "INSERT INTO `MZ_TLog` VALUES('$TimeStamp', $TimeScript, $SQL_SI_TimeTSQL, '$ipaddr', '$self', '$refer')";
	#echo "$_sqlquery<BR>"; 
	$_sqlresult = @MySQL_QUERY($_sqlquery);

	#Nettoyage du log d'erreur de plus d'une semaine
 	$_sqlquery =  "DELETE from `MZ_TLog` where (TimeStamp<'$OutOfDate')";
	$_sqlresult = @MySQL_QUERY($_sqlquery);

	#Close DB
  	@mysql_close();	
		
    return;
}

#-----------------------------------------------------------------------------------
function _sqlAddLogId($Id) {
	global  $SQL_SI_TiDViewList;
	if (strpos($SQL_SI_TiDViewList, $Id)<=0) $SQL_SI_TiDViewList.=",$Id";
}


#-----------------------------------------------------------------------------------
function _sqllogTiD($TiD, $Comment) {
	global  $SQL_SI_TiDViewList;
	
	$mysql=_sqlconnect();	# -------------- Ouverture DB  

	$TimeStamp=date("Y-m-d H:i:s"); 
	$DateStamp=date("Y-m-d"); 
	if ($_SERVER["HTTP_CLIENT_IP"]!="")
		$ipaddr=mysql_real_escape_string($_SERVER["HTTP_CLIENT_IP"]);		// en cas de proxy.
	else if ($_SERVER["HTTP_X_FORWARDED_FOR"]!="")
		$ipaddr=mysql_real_escape_string($_SERVER["HTTP_X_FORWARDED_FOR"]);		// en cas de proxy.
	else 
		$ipaddr=mysql_real_escape_string($_SERVER["REMOTE_ADDR"]);

	$arr_tid=explode(",", $SQL_SI_TiDViewList);
	for ($i=1; $i<sizeof($arr_tid); $i++) {
	 	$query =  "REPLACE INTO `MZ_Log` values(".$arr_tid[$i].", '$DateStamp', '$TimeStamp', $TiD, '$ipaddr', '$Comment')";
	 	//echo "$query<br>";
		$result = @MySQL_QUERY($query);
	}
    _sqlclose();		# -------------- Fermeture DB  
	
}

#-----------------------------------------------------------------------------------
function _sqllog($err, $RW, $TiD, $Action, $Coterie, $Comment) {
    return;	#Plus de LOG pour soulager les temps de réponses
	$TimeStamp=date("Y-m-d H:i:s"); 
	$ipaddr=mysql_real_escape_string($_SERVER["REMOTE_ADDR"]);
	$host=mysql_real_escape_string($_SERVER["REMOTE_ADDR"]);
	$self=mysql_real_escape_string($_SERVER["REQUEST_URI"]);
	$refer=mysql_real_escape_string($_SERVER["HTTP_REFERER"]);
	
	$TiD=intval($TiD); #TiD en chiffre entier
	$Comment=mysql_real_escape_string($Comment);

 	$_sqlquery =  "INSERT INTO `MZ_LogZZ` VALUES('$TimeStamp', $err, '$RW', '$Action', $TiD, '$Coterie', '$Comment', '$ipaddr', '$host', '$self', '$refer')";
	#echo "$_sqlquery<BR>"; 
	$_sqlresult = @MySQL_QUERY($_sqlquery);
	
	#Nettoyage du log d'erreur de plus d'un mois et non-erreur de plus d'une semaine
	$OutOfDate=date("Y-m-d H:i:s",mktime(date("H"),date("i"),date("s"),date("m"),date("d")-30,date("Y")));
 	$_sqlquery =  "DELETE from `MZ_LogZZ` where (err!=0) and (Coterie='$Coterie') and (TimeStamp<'$OutOfDate')";
	$_sqlresult = @MySQL_QUERY($_sqlquery);
	
	$OutOfDate=date("Y-m-d H:i:s",mktime(date("H"),date("i"),date("s"),date("m"),date("d")-7,date("Y")));
 	$_sqlquery =  "DELETE from `MZ_LogZZ` where (err=0) and (Coterie='$Coterie') and (TimeStamp<'$OutOfDate')";
	$_sqlresult = @MySQL_QUERY($_sqlquery);
	
    return;
}
?>
