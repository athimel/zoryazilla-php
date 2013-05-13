<?
session_cache_limiter("nocache");
header('Content-Type: text/html; charset=iso-8859-1'); 		// pour les caractère accentué
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1		pour empecher la mise en cache (cache trop important avec ironie ou FF8) !!!


session_start();
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
  $fMEvent=false;
  //$OutOfDate=date("Y-m-d H:i:s",mktime(date("H"),date("i"),date("s"),date("m"),date("d")-20,date("Y")));
  //$OutOfDate="2008-04-10 09:08:37";		// debug

  $fromDate=strtotime(_StringToDate($fromDate));
  $fromDate=date("Y-m-d H:i:s",mktime(date("H",$fromDate),date("i",$fromDate),date("s",$fromDate)-20,date("m",$fromDate),date("d",$fromDate),date("Y",$fromDate)));
  $toDate=strtotime(_StringToDate($toDate));
  $toDate=date("Y-m-d H:i:s",mktime(date("H",$toDate),date("i",$toDate),date("s",$toDate)+20,date("m",$toDate),date("d",$toDate),date("Y",$toDate)));

  If (isset($evtTroll))  $TiD=$evtTroll; else $TiD=$num;

  $mysql=_sqlconnect();	# -------------- Ouverture DB  

  //$query = "SELECT DATE_FORMAT(C.TimeStamp, '%d/%m/%Y %H:%i:%s') as TimeStamp,  C.PdVMin,  C.PdVMax, C.Blessure, C.Id FROM `MZ_CdM` as C INNER JOIN `MZ_Share` as S ON (C.TiD=S.SHRiD) where (S.TiD=$num) and (S.link='S') and (C.TiD=$TiD) and (C.TimeStamp>'$OutOfDate') order by TimeStamp";
  $query = "SELECT DATE_FORMAT(C.TimeStamp, '%d/%m/%Y %H:%i:%s') as TimeStamp,  C.PdVMin,  C.PdVMax, C.Blessure, C.Id FROM `MZ_CdM` as C INNER JOIN `MZ_Share` as S ON (C.TiD=S.SHRiD) where (S.TiD=$num) and (S.link='S') and (C.TiD=$TiD) and (C.TimeStamp>'$fromDate') and (C.TimeStamp<'$toDate') order by TimeStamp";
  //echo "//$query<BR>";
  $result1 = @MySQL_QUERY($query);

  //$query = "SELECT DATE_FORMAT(I.TimeStamp, '%d/%m/%Y %H:%i:%s') as TimeStamp, I.Insulte, I.SR, I.RM, I.MeID, I.TiD  FROM `MZ_Insulte` as I INNER JOIN `MZ_Share` as S ON (I.TiD=S.SHRiD) where (S.TiD=$num) and (S.link='S') and (I.TiD=$TiD) and (I.TimeStamp>'$OutOfDate') order by TimeStamp";
  $query = "SELECT DATE_FORMAT(I.TimeStamp, '%d/%m/%Y %H:%i:%s') as TimeStamp, I.Insulte, I.SR, I.RM, I.MeID, I.TiD  FROM `MZ_Insulte` as I INNER JOIN `MZ_Share` as S ON (I.TiD=S.SHRiD) where (S.TiD=$num) and (S.link='S') and (I.TiD=$TiD) and (I.TimeStamp>'$fromDate') and (I.TimeStamp<'$toDate') order by TimeStamp";
  //echo "//$query<BR>";
  $result2 = @MySQL_QUERY($query);

  //$query = "SELECT DATE_FORMAT(A.TimeStamp, '%d/%m/%Y %H:%i:%s') as TimeStamp, A.MeID, A.DEG, A.REG, A.SR, A.RM, A.ARM, A.NIV, A.ESQ, SC.Nom, A.TiD FROM `MZ_Attaque` as A INNER JOIN `MZ_Share` as S ON (A.TiD=S.SHRiD) INNER JOIN `MZ_SortComp` as SC ON (A.Attaque=SC.Id) where  (S.TiD=$num) and (S.link='S') and (A.TiD=$TiD)  and (A.TimeStamp>'$OutOfDate') order by TimeStamp";
  $query = "SELECT DATE_FORMAT(A.TimeStamp, '%d/%m/%Y %H:%i:%s') as TimeStamp, A.MeID, A.DEG, A.REG, A.SR, A.RM, A.ARM, A.NIV, A.ESQ, SC.Nom, A.TiD FROM `MZ_Attaque` as A INNER JOIN `MZ_Share` as S ON (A.TiD=S.SHRiD) INNER JOIN `MZ_SortComp` as SC ON (A.Attaque=SC.Id) where  (S.TiD=$num) and (S.link='S') and (A.TiD=$TiD)  and (A.TimeStamp>'$fromDate') and (A.TimeStamp<'$toDate') order by TimeStamp";
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
        $MeID=mysql_result($result1,$i,"Id");
        print("eventCdM[$i]=new Array(\"$TimeStamp\",\"$PdVMin\",\"$PdVMax\",\"$Blessure\",\"$MeID\",\"\");");
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
        $MeID=mysql_result($result2,$i,"MeID");
        $TiD=mysql_result($result2,$i,"TiD");		_sqlAddLogId($TiD);			// ajout d'une log pour ce troll 
        print("eventInsulte[$i]=new Array(\"$TimeStamp\",\"$Insulte\",\"$SR\",\"$RM\",\"$MeID\",\"\");");
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
        $MeID=mysql_result($result3,$i,"MeID");
        $DEG=mysql_result($result3,$i,"DEG");
        $REG=mysql_result($result3,$i,"REG");
        $SR=mysql_result($result3,$i,"SR");
        $RM=mysql_result($result3,$i,"RM");
        $ARM=mysql_result($result3,$i,"ARM");
        $NIV=mysql_result($result3,$i,"NIV");
        $ESQ=mysql_result($result3,$i,"ESQ");
        $Attaque=mysql_result($result3,$i,"Nom");
        $TiD=mysql_result($result3,$i,"TiD");		_sqlAddLogId($TiD);			// ajout d'une log pour ce troll 
        print("eventAttaque[$i]=new Array(\"$TimeStamp\",\"$MeID\",\"$DEG\",\"$Attaque\",\"$REG\",\"$SR\",\"$RM\",\"$ARM\",\"$NIV\",\"$ESQ\",\"\");");
        //print("eventAttaque[$i] = new Array('$TimeStamp', $TiD, $DEG, '$Attaque', '$REG', $SR,'$RM', $ARM, $NIV, $ESQ); ");
      }
  }
  
  //if ($fMEvent==true) print("putEventMonstre();");
  //if (isset($nom)) print("putBestiaireInfo();");
  
 #----------------------------------------------------------------------------------- 
_sqllogTiD($_SESSION['login'], "mzPEvent.php");		// log sur les trolls
?>