<?
session_cache_limiter("nocache");
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1		pour empecher la mise en cache (cache trop important avec ironie ou FF8) !!!
header('Content-Type: text/html; charset=iso-8859-1'); 		// pour les caractère accentué


session_start();
require("_global.php");
require_once("./Config/_sqlconf.php");

#-----------------------------------------------------------------------------------
if (!empty($_SESSION['login'])) { #Recupération de l'ID de Session
	$ZZ_TID=$_SESSION['login'] ;
}
if ($num!=$ZZ_TID) {
  $_SESSION['login']="";
  die();	//tentative de corruption
}

#-----------------------------------------------------------------------------------
function _StringToDate($str){
    # StringToDate : 20/10/2006_15:59:40  => 2006-10-20 15:59:40
    if (strlen($str)<19) {
        $d=$str;
    } else {
        $d=substr($str,6,4).'-'.substr($str,3,2).'-'.substr($str,0,2).' '.substr($str,11,8);
    }
    return $d;
}


#-----------------------------------------------------------------------------------
  # Recherche des infos du bestiaire.
  #mzMonstres.php?begin=1&idcdm=&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$1348634&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$942427&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$659370&nom[]=Gowap%20Apprivois%E9%20%5BAnc%EAtre%5D$442381&nom[]=Gowap%20Apprivois%E9%20%5BChef%20de%20harde%5D$1446677&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$1348916&nom[]=Abishaii%20Bleu%20de%20Quatri%E8me%20Cercle%20%5BInitial%5D$1682134&nom[]=Molosse%20Satanique%20%5BInitial%5D$1673609&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$1347796&nom[]=Gowap%20Apprivois%E9%20%5BAnc%EAtre%5D$446132&nom[]=Gowap%20Apprivois%E9%20%5BChef%20de%20harde%5D$1473479&nom[]=Crasc%20M%E9dius%20%5BJeune%5D$1628226&nom[]=Gorgone%20%5BNouvelle%5D$1679613&nom[]=Gowap%20Apprivois%E9%20%5BAnc%EAtre%5D$461682&nom[]=Gowap%20Apprivois%E9%20%5BAnc%EAtre%5D$478701&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$742268&nom[]=Gowap%20Apprivois%E9%20%5BAnc%EAtre%5D$445834&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$1347348&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$1346283&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$750876&nom[]=Super%20Bouffon%2C%20Gardien%20des%20Arcanes%20%5B%5D$468410&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$750793&nom[]=Gowap%20Apprivois%E9%20%5BAdulte%5D$1554896&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$1081753&nom[]=Gowap%20Apprivois%E9%20%5BMature%5D$1541478&nom[]=Bondin%20Corrompu%20%5BNouveau%5D$1667897&nom[]=Diablotin%20de%20Troisi%E8me%20Cercle%20%5BNovice%5D$1625612&nom[]=El%E9mentaire%20du%20Chaos%20%5BInitial%5D$1670421&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$1347645&nom[]=Gowap%20Apprivois%E9%20%5BChef%20de%20harde%5D$1448647&nom[]=Gowap%20Apprivois%E9%20%5BChef%20de%20harde%5D$1448648&nom[]=Gros%20G%E9ant%20de%20Pierre%20%5BNouveau%5D$1663215&nom[]=N%E9crochore%20%5BV%E9n%E9rable%5D$1591221&nom[]=Succube%20%5BInitiale%5D$1663328&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$961868&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$1260971&nom[]=Gowap%20Apprivois%E9%20%5BChef%20de%20harde%5D$1449232&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$1345500&nom[]=Gowap%20Apprivois%E9%20%5BMature%5D$1541985&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$1170139&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$1217098&nom[]=Gowap%20Apprivois%E9%20%5BAnc%EAtre%5D$533088&nom[]=Abishaii%20Vert%20%5BInitial%5D$1683340&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$837796&nom[]=Gowap%20Apprivois%E9%20%5BAnc%EAtre%5D$524303&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$1286286&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$794312&nom[]=Gowap%20Apprivois%E9%20%5BAnc%EAtre%5D$451388&nom[]=Gowap%20Apprivois%E9%20%5BAdulte%5D$1559835&nom[]=Gowap%20Apprivois%E9%20%5BB%E9b%E9%5D$1679688&http://mountypedia.free.fr/mz/monstres_FF.php?begin=51&idcdm=&nom[]=Gowap%20Apprivois%E9%20%5BAnc%EAtre%5D$532139&nom[]=Gowap%20Apprivois%E9%20%5BAnc%EAtre%5D$520661&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$1389023&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$1342498&nom[]=Gowap%20Apprivois%E9%20%5BAnc%EAtre%5D$543189&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$920286&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$1023819&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$870354&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$1020815&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$1093105&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$1348571&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$1290557&nom[]=Gowap%20Apprivois%E9%20%5BAnc%EAtre%5D$444892&nom[]=Gowap%20Apprivois%E9%20%5BAnc%EAtre%5D$491444&nom[]=Gowap%20Apprivois%E9%20%5BAnc%EAtre%5D$606246&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$796136&nom[]=Gowap%20Sauvage%20%5BAncien%5D$953611&nom[]=Gowap%20Apprivois%E9%20%5BAnc%EAtre%5D$627895&nom[]=Gowap%20Apprivois%E9%20%5BAnc%EAtre%5D$439708&nom[]=Gowap%20Apprivois%E9%20%5BAnc%EAtre%5D$520835&nom[]=Crasc%20M%E9dius%20Cracheur%20%5BV%E9t%E9ran%5D$1562208&nom[]=Effrit%20Coriace%20%5BJeune%5D$1659669&nom[]=Gowap%20Apprivois%E9%20%5BB%E9b%E9%5D$1679687&nom[]=Gowap%20Apprivois%E9%20%5BAnc%EAtre%5D$548013&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$680143&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$956810&nom[]=Gowap%20Apprivois%E9%20%5BB%E9b%E9%5D$1680726&nom[]=Gowap%20Sauvage%20%5BAncien%5D$1347347&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$1342547&nom[]=Gowap%20Apprivois%E9%20%5BAdulte%5D$1565524&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$1342162&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$1345096&nom[]=Gowap%20Apprivois%E9%20%5BAnc%EAtre%5D$534750&nom[]=Gowap%20Apprivois%E9%20%5BAnc%EAtre%5D$455878&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$692103&nom[]=Abishaii%20Bleu%20%5BInitial%5D$1659748&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$1202352&nom[]=Gowap%20Apprivois%E9%20%5BAnc%EAtre%5D$445865&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$840557&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$780248&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$864265&nom[]=Gowap%20Apprivois%E9%20%5BAnc%EAtre%5D$618860&nom[]=Gorgone%20Esculape%20%5BNouvelle%5D$1679614&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$874612&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$929785&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$955073&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$1168127
  if (isset($nom)) {
     if ((strpos("*$nom[0]", "Gowap")==0)&&(strpos("*$nom[0]", "Familier")==0)) {
	 	 $begin=-1; require("mzMonstres.php");
	 }
  }
  
#-----------------------------------------------------------------------------------
  $fMEvent=false;
  //$OutOfDate=date("Y-m-d H:i:s",mktime(date("H"),date("i"),date("s"),date("m"),date("d")-20,date("Y")));
  //$OutOfDate="2008-10-01 09:08:37";		// debug

  $fromDate=strtotime(_StringToDate($fromDate));
  $fromDate=date("Y-m-d H:i:s",mktime(date("H",$fromDate),date("i",$fromDate),date("s",$fromDate)-20,date("m",$fromDate),date("d",$fromDate),date("Y",$fromDate)));
  $toDate=strtotime(_StringToDate($toDate));
  $toDate=date("Y-m-d H:i:s",mktime(date("H",$toDate),date("i",$toDate),date("s",$toDate)+20,date("m",$toDate),date("d",$toDate),date("Y",$toDate)));

  $mysql=_sqlconnect();	# -------------- Ouverture DB  


  //$query = "SELECT DATE_FORMAT(C.TimeStamp, '%d/%m/%Y %H:%i:%s') as TimeStamp,  C.PdVMin,  C.PdVMax, C.Blessure, C.TiD FROM `MZ_CdM` as C INNER JOIN `MZ_Share` as S ON (C.TiD=S.SHRiD) where (S.TiD=$num) and (S.link='S') and (Id=$MeID) and (C.TimeStamp>'$OutOfDate') order by TimeStamp";
  $query = "SELECT DATE_FORMAT(C.TimeStamp, '%d/%m/%Y %H:%i:%s') as TimeStamp,  C.PdVMin,  C.PdVMax, C.Blessure, C.TiD FROM `MZ_CdM` as C INNER JOIN `MZ_Share` as S ON (C.TiD=S.SHRiD) where (S.TiD=$num) and (S.link='S') and (Id=$MeID) and (C.TimeStamp>'$fromDate') and (C.TimeStamp<'$toDate') order by TimeStamp";
  //echo "//$query<BR>";
  $result1 = @MySQL_QUERY($query);

  //$query = "SELECT DATE_FORMAT(I.TimeStamp, '%d/%m/%Y %H:%i:%s') as TimeStamp, I.Insulte, I.SR, I.RM, I.TiD  FROM `MZ_Insulte` as I INNER JOIN `MZ_Share` as S ON (I.TiD=S.SHRiD) where (S.TiD=$num) and (S.link='S') and (MeID=$MeID) and (I.TimeStamp>'$OutOfDate') order by TimeStamp";
  $query = "SELECT DATE_FORMAT(I.TimeStamp, '%d/%m/%Y %H:%i:%s') as TimeStamp, I.Insulte, I.SR, I.RM, I.TiD  FROM `MZ_Insulte` as I INNER JOIN `MZ_Share` as S ON (I.TiD=S.SHRiD) where (S.TiD=$num) and (S.link='S') and (MeID=$MeID) and (I.TimeStamp>'$fromDate') and (I.TimeStamp<'$toDate') order by TimeStamp";
  //echo "//$query<BR>";
  $result2 = @MySQL_QUERY($query);

  //$query = "SELECT DATE_FORMAT(A.TimeStamp, '%d/%m/%Y %H:%i:%s') as TimeStamp, A.TiD, A.DEG, A.REG, A.SR, A.RM, A.ARM, A.NIV, A.ESQ, SC.Nom FROM `MZ_Attaque` as A INNER JOIN `MZ_Share` as S ON (A.TiD=S.SHRiD) INNER JOIN `MZ_SortComp` as SC ON (A.Attaque=SC.Id) where  (S.TiD=$num) and (S.link='S') and (A.MeID=$MeID) and (A.TimeStamp>'$OutOfDate') order by TimeStamp";
  $query = "SELECT DATE_FORMAT(A.TimeStamp, '%d/%m/%Y %H:%i:%s') as TimeStamp, A.TiD, A.DEG, A.REG, A.SR, A.RM, A.ARM, A.NIV, A.ESQ, SC.Nom FROM `MZ_Attaque` as A INNER JOIN `MZ_Share` as S ON (A.TiD=S.SHRiD) INNER JOIN `MZ_SortComp` as SC ON (A.Attaque=SC.Id) where  (S.TiD=$num) and (S.link='S') and (A.MeID=$MeID) and (A.TimeStamp>'$fromDate') and (A.TimeStamp<'$toDate') order by TimeStamp";
  //echo "//$query<BR>";
  $result3 = @MySQL_QUERY($query);
  _sqlclose();		# -------------- Fermeture DB   

  #$query = "SELECT DATE_FORMAT(C.TimeStamp, '%d/%m/%Y %H:%i:%s') as TimeStamp,  C.PdVMin,  C.PdVMax, C.Blessure, C.TiD FROM `MZ_CdM` as C, `MZ_Groupe` as G where  (Id=$MeID) and (C.TiD=G.Tid) and (G.Nom='$login') and (G.Pwd='$password') and (C.TimeStamp>'$OutOfDate') order by TimeStamp";
  $nData = @MySQL_NUM_ROWS($result1);
  //print("eventCdM = new Array(); ");
  if ($nData>0) {
	  $fMEvent=true;
      for ($i=0; $i<$nData; $i++) { 
        $TimeStamp=mysql_result($result1,$i,"TimeStamp"); #'2006-10-24 10:37:57'
        $PdVMin=mysql_result($result1,$i,"PdVMin");
        $PdVMax=mysql_result($result1,$i,"PdVMax");
        $Blessure=mysql_result($result1,$i,"Blessure");
        $TiD=mysql_result($result1,$i,"TiD");			// on ne log pas sur les CdM
        print("eventCdM[$i]=new Array(\"$TimeStamp\",\"$PdVMin\",\"$PdVMax\",\"$Blessure\",\"$TiD\",\"\");");
        //print("eventCdM[$i] = new Array('$TimeStamp',$PdVMin,$PdVMax,$Blessure, $TiD); ");
      }
  }

  #$query = "SELECT DATE_FORMAT(I.TimeStamp, '%d/%m/%Y %H:%i:%s') as TimeStamp, I.Insulte, I.SR, I.RM, I.TiD  FROM `MZ_Insulte` as I, `MZ_Groupe` as G where  (MeID=$MeID) and (I.TiD=G.Tid) and (G.Nom='$login') and (G.Pwd='$password') and (I.TimeStamp>'$OutOfDate') order by TimeStamp";
  $nData = @MySQL_NUM_ROWS($result2);
  //print("eventInsulte = new Array(); ");
  if ($nData>0) {
	  $fMEvent=true;
      for ($i=0; $i<$nData; $i++) { 
        $TimeStamp=mysql_result($result2,$i,"TimeStamp"); #'2006-10-24 10:37:57'
        $Insulte=mysql_result($result2,$i,"Insulte");
        $SR=mysql_result($result2,$i,"SR");
        $RM=mysql_result($result2,$i,"RM");
        $TiD=mysql_result($result2,$i,"TiD");			_sqlAddLogId($TiD);			// ajout d'une log pour ce troll 
        print("eventInsulte[$i]=new Array(\"$TimeStamp\",\"$Insulte\",\"$SR\",\"$RM\",\"$TiD\",\"\");");
        //print("eventInsulte[$i] = new Array('$TimeStamp',$Insulte,$SR,'$RM', $TiD); ");
      }
  }

  #$query = "SELECT DATE_FORMAT(A.TimeStamp, '%d/%m/%Y %H:%i:%s') as TimeStamp, A.TiD, A.DEG, A.REG, A.SR, A.RM, A.ARM, A.NIV, A.ESQ, SC.Nom FROM `MZ_Attaque` as A, `MZ_Groupe` as G, `MZ_SortComp` as SC where (A.MeID=$MeID) and (A.Attaque=SC.Id) and (A.TiD=G.Tid) and (G.Nom='$login') and (G.Pwd='$password') and (A.TimeStamp>'$OutOfDate') order by TimeStamp";
  $nData = @MySQL_NUM_ROWS($result3);
  //print("eventAttaque = new Array(); ");
  if ($nData>0) {
	  $fMEvent=true;
      for ($i=0; $i<$nData; $i++) { 
        $TimeStamp=mysql_result($result3,$i,"TimeStamp"); #'2006-10-24 10:37:57'
        $TiD=mysql_result($result3,$i,"TiD");			_sqlAddLogId($TiD);			// ajout d'une log pour ce troll 
        $DEG=mysql_result($result3,$i,"DEG");
        $REG=mysql_result($result3,$i,"REG");
        $SR=mysql_result($result3,$i,"SR");
        $RM=mysql_result($result3,$i,"RM");
        $ARM=mysql_result($result3,$i,"ARM");
        $NIV=mysql_result($result3,$i,"NIV");
        $ESQ=mysql_result($result3,$i,"ESQ");
        $Attaque=mysql_result($result3,$i,"Nom");
        print("eventAttaque[$i]=new Array(\"$TimeStamp\",\"$TiD\",\"$DEG\",\"$Attaque\",\"$REG\",\"$SR\",\"$RM\",\"$ARM\",\"$NIV\",\"$ESQ\",\"\");");
        //print("eventAttaque[$i] = new Array('$TimeStamp', $TiD, $DEG, '$Attaque', '$REG', $SR,'$RM', $ARM, $NIV, $ESQ); ");
      }
  }
  
  //if ($fMEvent==true) print("putEventMonstre();");
  //if (isset($nom)) print("putBestiaireInfo();");
  
#----------------------------------------------------------------------------------- 
_sqllogTiD($_SESSION['login'], "mzMEvent.php");		// log sur les trolls
?>