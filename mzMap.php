<?
session_cache_limiter("nocache");
session_start();
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1		pour empecher la mise en cache (cache trop important avec ironie ou FF8) !!!


#Script pour les versions antérieures à 1.0.5
require("_global.php");
require_once("./Config/_sqlconf.php");
#-----------------------------------------------------------------------------------

if (!empty($_SESSION['login'])) { #Recupération de l'ID de Session
	$ZZ_TID=$_SESSION['login'] ;
} else die();

if ($num!=$ZZ_TID) {
  //$_SESSION['login']="";
  die();	//tentative de corruption
}

  $fTInfo=false;
  $HorsDate=1;  #1 jour
  $OutOfDate=date("Y-m-d H:i:s",mktime(date("H"),date("i"),date("s"),date("m"),date("d")-$HorsDate,date("Y")));
  
#-----------------------------------------------------------------------------------
  $mysql=_sqlconnect();	# -------------- Ouverture DB  

  $query = "SELECT P.TimeStamp, P.TiD, P.Troll, P.Race, P.Niveau, P.DLA, P.PA, P.PV, P.PVMax, P.X, P.Y, P.N, P.Camoufle  FROM `MZ_Profil` as P INNER JOIN `MZ_Share` as S ON (P.TiD=S.SHRiD) where (S.TiD=$num) and (S.link='S') and (P.TimeStamp>'$OutOfDate') ";
  //echo "$query<BR>";
  $result1 = @MySQL_QUERY($query);
	
  _sqlclose();	# -------------- Fermeture DB   
#-----------------------------------------------------------------------------------


#-----------------------------------------------------------------------------------
  #result1 => "SELECT P.TimeStamp, P.TiD, P.Troll, P.Race, P.Niveau, P.DLA, P.PA, P.PV, P.PVMax, P.X, P.Y, P.N, P.Camoufle  FROM `MZ_Profil` as P INNER JOIN `MZ_Groupe` as G on (P.TiD=G.Tid) where (G.Nom='$coterie') and (G.Pwd='$password') and (P.TimeStamp>'$OutOfDate') ";
  $nData = @MySQL_NUM_ROWS($result1);
  if ($nData>0) {
	  $fTInfo=true;
      //print("infosTrolls = new Array();");
      #infosTrolls[TiD] = new Array(PV,PVMax,'TimeStamp','Nom', DLA,PA, X, Y, N, Camouflé, 'Race', Niveau); 
      for ($i=0; $i<$nData; $i++) { 
        $TimeStamp=mysql_result($result1,$i,"TimeStamp"); #'2006-10-24 10:37:57'
        $TimeStamp="le ".substr($TimeStamp, 8,2).'/'.substr($TimeStamp, 5,2)." ".substr($TimeStamp, 11,2).":".substr($TimeStamp, 14,2);
        $TiD=mysql_result($result1,$i,"TiD");			_sqlAddLogId($TiD);			// ajout d'une log pour ce troll 
        $Troll=mysql_result($result1,$i,"Troll");
        $Race=mysql_result($result1,$i,"Race");
        $Niveau=mysql_result($result1,$i,"Niveau");
        $DLA=mysql_result($result1,$i,"DLA");
        $DLA=substr($DLA, 8,2).'/'.substr($DLA, 5,2)." ".substr($DLA, 11,2).":".substr($DLA, 14,2);
        $PA=mysql_result($result1,$i,"PA");
        $PV=mysql_result($result1,$i,"PV");
        $PVMax=mysql_result($result1,$i,"PVMax");
        $tX=mysql_result($result1,$i,"X");
        $tY=mysql_result($result1,$i,"Y");
        $tN=mysql_result($result1,$i,"N");
        $Camoufle=mysql_result($result1,$i,"Camoufle");
        print("infosTrolls[$TiD]=new Array(\"$PV\",\"$PVMax\",\"$TimeStamp\",\"$DLA\",\"$PA\",\"$Troll\",\"$tX\",\"$tY\",\"$tN\",\"$Camoufle\",\"$Race\",\"$Niveau\",\"\");");
//      print("infosTrolls[$TiD]=new Array($PV,$PVMax,$TimeStamp,$DLA,$PA,$Troll,$tX,$tY,$tN,$Camoufle,$Race,$Niveau);");
      }
  }


  
#----------------------------------------------------------------------------------- 
//_sqlTLog();	#Log des consommations de temps SQL et PHP
_sqllogTiD($_SESSION['login'], "mzMap.php");		// log sur les trolls
  
?>