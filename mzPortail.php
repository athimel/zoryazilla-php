<?
session_cache_limiter("nocache");
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1		pour empecher la mise en cache (cache trop important avec ironie ou FF8) !!!
header('<meta: http-equiv="Content-Type" content="text/html;charset=UTF-8">'); 		// pour les caractère accentué



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

  if ($PortailId=="") {
	$PortailId=substr($_SERVER["QUERY_STRING"], strpos($_SERVER["QUERY_STRING"], "PortailId")+10);
	if (strpos($PortailId, "&")>0) $PortailId=substr($PortailId, 0, strpos($PortailId, "&"));	
   }
	
  if (substr($PortailId, -1)==',') $PortailId=substr($PortailId, 0, strlen($PortailId)-1);
  $query =  "SELECT V.id, min(V.TimeSTamp) as TimeSTamp, P.TiD, P. Troll FROM `MZ_Vue_ext` as V INNER JOIN `MZ_Share` as S ON (V.TiD=S.SHRiD) INNER JOIN `MZ_Profil` as P ON (P.TiD=S.SHRiD) WHERE (S.TiD=$num) and (S.link='S') and (V.TypeElement=5) and V.id in ($PortailId) group by V.id order by V.TimeStamp asc ";

  //echo "//$query<BR>";
  $result1 = @MySQL_QUERY($query);

  $today=date("Y-m-d H:i:s");
  _sqlclose();		# -------------- Fermeture DB   

  $lastMiD=0;
  $nData = @MySQL_NUM_ROWS($result1);
  if ($nData>0) {
      for ($i=0; $i<$nData; $i++) { 
        $id=mysql_result($result1,$i,"id");
		if ($lastMiD<>$id) {
			$lastMiD=$id;
	        $TimeStamp=mysql_result($result1,$i,"TimeStamp"); #'2006-10-24 10:37:57'
	        if (substr($today, 0, 10)==substr($TimeStamp, 0, 10)) {
	        	$Vu="aujourd'hui";
	        } else {
	        	$nbj=floor((strtotime(substr($today, 0, 10))-strtotime(substr($TimeStamp, 0, 10)))/(60*60*24));
	        	if ($nbj==1) $Vu="hier"; else $Vu="il y a $nbj jours"; 
	        }
    	    $TiD=mysql_result($result1,$i,"TiD");			_sqlAddLogId($TiD);			// ajout d'une log pour ce troll 
    	    $Troll=utf8_encode(mysql_result($result1,$i,"Troll"));	
        	print("portailInfo[$id]=new Array(\"$TimeStamp\",\"$TiD\",\"$Troll\",\"$Vu\",\"\");");
        }
      }
  }

  
#----------------------------------------------------------------------------------- 
_sqllogTiD($_SESSION['login'], "mzPortail.php");		// log sur les trolls
  
?>