<?
session_cache_limiter("nocache");
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1		pour empecher la mise en cache (cache trop important avec ironie ou FF8) !!!
header('<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">'); 		// pour les caractère accentué

//echo 'eventCdM[0]=new Array("11/10/2008 09:09:49","70","100","0","17203","");eventInsulte[0]=new Array("11/10/2008 09:08:36","0","10","<1522","17203","");eventInsulte[1]=new Array("11/10/2008 20:31:12","1","10","<1522","17203","");eventAttaque[0]=new Array("11/10/2008 22:34:18","28468","59","Rafale Psy.","2x25","10","<1230","0","0","-1","");eventAttaque[1]=new Array("11/10/2008 22:34:18","28468","59","Rafale Psy.","2x25","10","<1230","0","0","-1","");eventAttaque[2]=new Array("11/10/2008 22:34:18","28468","59","Rafale Psy.","2x25","10","<1230","0","0","-1","");eventAttaque[3]=new Array("11/10/2008 22:34:18","28468","59","Rafale Psy.","2x25","10","<1230","0","0","-1","");eventAttaque[4]=new Array("11/10/2008 22:34:18","28468","59","Rafale Psy.","2x25","10","<1230","0","0","-1","");eventAttaque[5]=new Array("11/10/2008 22:34:18","28468","59","Rafale Psy.","2x25","10","<1230","0","0","-1","");eventAttaque[6]=new Array("11/10/2008 22:34:18","28468","59","Rafale Psy.","2x25","10","<1230","0","0","-1","");';
//die();


session_start();
require("_global.php");
require_once("./Config/_sqlconf.php");

#-----------------------------------------------------------------------------------
if (!empty($_SESSION['login'])) { #Recupération de l'ID de Session
	$ZZ_TID=$_SESSION['login'] ;
} else die();
if ($num!=$ZZ_TID) {
  //$_SESSION['login']="";
  die();
}

  $mysql=_sqlconnect();	# -------------- Ouverture DB  

  if ($MatosId=="") {
	$MatosId=substr($_SERVER["QUERY_STRING"], strpos($_SERVER["QUERY_STRING"], "MatosId")+8);
	if (strpos($MatosId, "&")>0) $MatosId=substr($MatosId, 0, strpos($MatosId, "&"));	
   }
	
  if (substr($MatosId, -1)==',') $MatosId=substr($MatosId, 0, strlen($MatosId)-1);
  $query = "SELECT M.MiD, DATE_FORMAT(M.TimeStamp, '%d/%m/%Y %H:%i:%s') as TimeStamp,  M.TiD,  M.Matos, M.`Desc`, M.Etat, M.Vu, P.Troll FROM `MZ_Tresor` as M INNER JOIN `MZ_Share` as S ON (M.TiD=S.SHRiD) INNER JOIN `MZ_Profil` as P ON (P.TiD=S.SHRiD) where (S.TiD=$num) and (S.link='S') and (M.MiD in ($MatosId)) order by M.MiD, M.TimeStamp DESC";
  //echo "//$query<BR>";
  $result1 = @MySQL_QUERY($query);

  _sqlclose();		# -------------- Fermeture DB   

  $lastMiD=0;
  $nData = @MySQL_NUM_ROWS($result1);
  if ($nData>0) {
      for ($i=0; $i<$nData; $i++) { 
        $MiD=mysql_result($result1,$i,"MiD");
		if ($lastMiD<>$MiD) {
			$lastMiD=$MiD;
	        $TimeStamp=mysql_result($result1,$i,"TimeStamp"); #'2006-10-24 10:37:57'
    	    $TiD=mysql_result($result1,$i,"TiD");			_sqlAddLogId($TiD);			// ajout d'une log pour ce troll 
        	$Matos=utf8_encode(mysql_result($result1,$i,"Matos"));
	        $Desc=utf8_encode(mysql_result($result1,$i,"Desc"));
    	    $Etat=utf8_encode(mysql_result($result1,$i,"Etat"));
        	$Vu=mysql_result($result1,$i,"Vu");
    	    $Troll=utf8_encode(mysql_result($result1,$i,"Troll"));	
        	print("tresorInfo[$MiD]=new Array(\"$TimeStamp\",\"$TiD\",\"$Matos\",\"$Desc\",\"$Etat\",\"$Vu\",\"$Troll\",\"\");");
        }
      }
  }

  
#----------------------------------------------------------------------------------- 
_sqllogTiD($_SESSION['login'], "mzTresor.php");		// log sur les trolls
  
?>