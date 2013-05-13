<? 
session_cache_limiter("nocache");
session_start();

require("_global.php"); 
require_once("./Config/_sqlconf.php");
ignore_user_abort(True);

#-----------------------------------------------------------------------------------
# Gestion des cas particulier
if ($TypeData == "DIPLO") $TiD=$num;

#-----------------------------------------------------------------------------------
$ZZ_TID=0 ;
if (!empty($_SESSION['login'])) { #Recupération de l'ID de Session
	$ZZ_TID=$_SESSION['login'] ;
	if (isset($TiD)) {
		if (($ZZ_TID!=$TiD) && ($TypeData != "DLA") && ($TypeData != "Karma")) { #qq cas particulier DLA (on a le nom du troll), Karma (on regarde l'id d'un autre)
			$_SESSION['login']=""; // on force la déco car corruption
			$ZZ_TID=0 ;
		}
	}
} 

#-----------------------------------------------------------------------------------
function roundtime($Field, $strTime) {
	$t=strtotime($strTime);
	$avant=date("Y-m-d H:i:s", mktime(date("H", $t),date("i", $t),date("s", $t)-15,date("m", $t),date("d", $t),date("Y", $t)));
	$apres=date("Y-m-d H:i:s", mktime(date("H", $t),date("i", $t),date("s", $t)+15,date("m", $t),date("d", $t),date("Y", $t)));
	return "($Field>='$avant') and ($Field<='$apres')";
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

function _StringUKToDate($str){
    # StringToDate : 10/20/2006_15:59:40  => 2006-10-20 15:59:40
    if (strlen($str)<19) {
        $d=$str;
    } else {
        $d=substr($str,6,4).'-'.substr($str,0,2).'-'.substr($str,3,2).' '.substr($str,11,8);
    }
    return $d;
}


function showKarma($kList, $TimeStamp, $fFrag, $Tk, $Mk, $regime) {
 	#$regime="";
	$Today=date("Y-m-d H:i:s");
	$nbjours = round((strtotime($Today) - strtotime($fFrag))/(60*60*24)+2);
	if ($nbjours>0) {
		$rateTK=(100*$Tk)/$nbjours;
		$rateMK=(100*$Mk)/$nbjours;
	} 
	#mensualisation
	$rateTK=round(30*$Tk/$nbjours);  $rateMK=round(30*$Mk/$nbjours);  
	$rate='&nbsp;&nbsp;<i><u><b>Alimentation mensuelle:</b></i></u><br>&nbsp;&nbsp;'.$rateMK.' Monstre(s)<br>&nbsp;&nbsp;'.$rateTK.' Troll(s)<br><br><i>&nbsp;<i><u><b>Depuis le:</i></u></b> '.$fFrag.'</i><br>&nbsp;'.$Mk.' Monstre(s)<br>&nbsp;'.$Tk.' Troll(s)';
	$rate.='<br>'.$kList;
	$regime="<SPAN onmouseover=ShowInfos(rate); onmouseout=HideInfos(); class=mh_tdtitre >&nbsp;&nbsp;&nbsp;Alimentation: $regime &nbsp;<font size=-2>(éval ZZ)</font></SPAN>";
	return (array($regime, $rate));
}
#-----------------------------------------------------------------------------------
# Pour Debuggage 
#  $self=$_SERVER["REQUEST_URI"];
#  $fd=fopen("tst.txt", "a");
#  fputs($fd, "MZ: $self");
#  fclose($fd);
  
#Purge des grosses tables des evenements de plus d'un an
#$cleanOutOfDate=date("Y-m-d H:i:s",mktime(date("H"),date("i"),date("s"),date("m")-12,date("d"),date("Y")));

#-----------------------------------------------------------------------------------
#Main
#-----------------------------------------------------------------------------------
if ($TypeData == "DLA") {
#-----------------------------------------------------------------------------------
	  If (!isset($Troll))  { Die("// Données imcomplètes!"); }
	  If (!isset($PA))  { Die("// Données imcomplètes!"); }
	  If (!isset($DLA))  { Die("// Données imcomplètes!"); }


	  $DLA=_StringToDate($DLA);

      # Mise à jour du profil d'un troll
	  $mysql=_sqlconnect();	# -------------- Ouverture DB  
      $query =  "UPDATE `MZ_Profil` SET PA=$PA, DLA='$DLA'";
	  If (isset($PV)) $query .= ", PV=$PV";
	  if (is_numeric($Troll)) $query .= " where TiD=$Troll"; else $query .= " where Troll=\"$Troll\"";
      #echo "$query<BR>";     
      $result = MySQL_QUERY($query);    
      _sqlclose();		# -------------- Fermeture DB  
#-----------------------------------------------------------------------------------
} else if ($TypeData == "PA") {
#-----------------------------------------------------------------------------------
	  If (!isset($TiD))  { Die("// Données imcomplètes!"); }
	  If (!isset($PA))  { Die("// Données imcomplètes!"); }

      # Mise à jour du profil d'un troll
	  $mysql=_sqlconnect();	# -------------- Ouverture DB  
      $query =  "UPDATE `MZ_Profil` SET PA=$PA where TiD=$TiD";
      #echo "$query<BR>";     
      $result = MySQL_QUERY($query);    
      _sqlclose();		# -------------- Fermeture DB  
#-----------------------------------------------------------------------------------
} else if ($TypeData == "Profil") {
#-----------------------------------------------------------------------------------
	  If (!isset($TimeStamp))  { Die("// Données imcomplètes!"); }
	  If (!isset($TiD)) { Die("// Données imcomplètes!"); }
	  If (!isset($Troll)) { Die("// Données imcomplètes!"); }
	  If (!isset($Race)) { Die("// Données imcomplètes!"); }
	  If (!isset($Niveau)) { Die("// Données imcomplètes!"); }
	  If (!isset($DLA)) { Die("// Données imcomplètes!"); }
	  If (!isset($PA)) { Die("// Données imcomplètes!"); }
	  If (!isset($PV)) { Die("// Données imcomplètes!"); }
	  If (!isset($PVMax)) { Die("// Données imcomplètes!"); }
	  If (!isset($X)) { Die("// Données imcomplètes!"); }
	  If (!isset($Y)) { Die("// Données imcomplètes!"); }
	  If (!isset($N)) { Die("// Données imcomplètes!"); }
	  If (!isset($Camoufle)) { Die("// Données imcomplètes!"); }

	  #Conversion de Date
	  $TimeStamp=_StringToDate($TimeStamp);
	  $DLA=_StringToDate($DLA);

	  if (strpos($N, "[")>0) $N=substr($N, 0, strpos($N, "["));		// cas particuliers: de la MB ou zone protégés, etc...
	  
	  $mysql=_sqlconnect();	# -------------- Ouverture DB  

      # petit control pour éviter les probleme de sitting/partage de session
      $query =  "SELECT TiD FROM `MZ_Profil` where Troll=\"$Troll\" ";
      //echo "$query<BR>";
      $result = MySQL_QUERY($query);
	  if (@MySQL_NUM_ROWS($result)>0) if (mysql_result($result,0,"TiD")!=$TiD) {
			$_SESSION['login']=""; // on force la déco car corruption
			die();	  
	  } 	  

      # Mise à jour du profil d'un troll
      $query =  "DELETE FROM `MZ_Profil` where TiD=$TiD";
      #echo "$query<BR>";
      $result = MySQL_QUERY($query);

      $query =  "INSERT INTO `MZ_Profil` Values('$TimeStamp', $TiD, \"$Troll\", '$Race', $Niveau, '$DLA' , $PA, $PV, $PVMax, $X, $Y, $N, $Camoufle)";
      //echo "$query<BR>";
      $result = MySQL_QUERY($query);

	  $query2 =  "SELECT TiD FROM `MZ_Share` WHERE SHRiD=$ZZ_TID and link='I' and TiD!=$ZZ_TID";
	  $result2 = @MySQL_QUERY($query2);

	  $query =  "SELECT IdNews FROM `MZ_InfoZZ`";
      #echo "$query<BR>";
	  $result = @MySQL_QUERY($query);
      _sqlclose();		# -------------- Fermeture DB  

	  $nData = @MySQL_NUM_ROWS($result);
      if ($nData>0){
	      	$IdNews=mysql_result($result,0,"IdNews");
		   	$nData = @MySQL_NUM_ROWS($result2);
			if (($nData>0)||	($ZZ_TID==0)) $IdNews = -$IdNews;
		   	echo "setNewsZZ($IdNews);";  
	  } 
      
#-----------------------------------------------------------------------------------
} else if ($TypeData == "Diplo") {
#----------------------------------------------------------------------------------- 
	  If (!isset($num)) { Die("// Données imcomplètes!"); }
/*	  If (isset($login)) { #Verification coterie
		  $mysql=_sqlconnect();	# -------------- Ouverture DB  
		  #Vérification de la Coterie
		  $query =  "SELECT Nom FROM `MZ_Groupe` WHERE (Nom=\"$login\") and (Pwd='$password')";
	      #echo "$query<BR>";
		  $result = MySQL_QUERY($query);
	      _sqlclose();		# -------------- Fermeture DB  
		  $nData = MySQL_NUM_ROWS($result);
	      if ($nData<=0) die("alert(\"Mauvais password de Coterie ($login)\");"); 
	  }*/

	  # Dans le cas des grosses coteries,  les tableaux de variables $ta, $ga, $te et $ge sont tronqués (problème d'hébergeur)
	  #il faut les reconstituer à partir de l'URL
	  $url=$_SERVER["QUERY_STRING"];
      $aTab = explode ('&', $url);
	  $ta= array(); $te= array(); $ga= array(); $ge= array();
	  foreach ($aTab as $clef => $val) {
		$aTmp = explode ('=', $val);
		if ($aTmp[0]=="ga[]") $ga[]=$aTmp[1];
		else if ($aTmp[0]=="ge[]") $ge[]=$aTmp[1];
		else if ($aTmp[0]=="ta[]") $ta[]=$aTmp[1];
		else if ($aTmp[0]=="te[]") $te[]=$aTmp[1];
      }	  

/*	  ===> le fichier de troll ne nous impose plus la connexion à MH.
	  #Détection de la guilde via MH	  
      $handle = @fopen("http://games.mountyhall.com/mountyhall/View/PJView.php?ai_IDPJ=$num", "r");
	  $buffer="";
      while (!feof ($handle)) {
       	     $buffer .= fgets($handle, 4096);
      }
      @fclose($handle);
	  $Tag="javascript:EnterAllianceView(";
      $gPos=strpos($buffer, $Tag);
	  if ($gPos<=0) die("alert('La guilde du troll $num est introuvable!');"); 	  

	  $buffer=substr($buffer, $gPos+strlen($Tag));
	  $Guilde=substr($buffer, 0, strpos($buffer, ","));

	  If (isset($login)) { #Joueur en guilde
		  $idGuilde=$Guilde;
	  } else { #Joueur en Stand-Alone 
		  $idGuilde=-$num;
		  if ($idGuilde>=0) die("alert('Le troll Id=$num est introuvable!');"); 	  
	  }	  
*/

	  $mysql=_sqlconnect();	# -------------- Ouverture DB  
	  $query = "SELECT GiD FROM `MZ_Trolls` WHERE TiD=$num; "; 
	  $result = MySQL_QUERY($query);
	  if (@MySQL_NUM_ROWS($result)==1) $idGuilde=mysql_result($result,0,"GiD"); else $idGuilde=-$num;

	  $query = "DELETE FROM `MZ_Diplo` WHERE GiD=$idGuilde; "; 
	  $result = MySQL_QUERY($query);
	  
	  $query =  "INSERT INTO `MZ_Diplo` Values($idGuilde, $idGuilde, '#BBBBFF', 'G'); ";			// la propre guilde du troll en bleu
	  $result = MySQL_QUERY($query);

	  //if ($idGuilde>0) {
	      //$query =  "INSERT INTO `MZ_Diplo` Values($idGuilde, $idGuilde, '#BBBBFF', 'G'); ";
	      //$result = MySQL_QUERY($query);
		  //$query =  "UPDATE `MZ_Groupe` SET GiD=$idGuilde WHERE TiD=$num; ";
		  //$result = MySQL_QUERY($query);
	  //} else {
	  //    $query =  "INSERT INTO `MZ_Diplo` Values($idGuilde, $Guilde, '#BBBBFF', 'G'); ";
	  //    $result = MySQL_QUERY($query);
	  //}

	  for ($i=0; $i<sizeof($ta); $i++) {$query =  "INSERT INTO `MZ_Diplo` Values($idGuilde, $ta[$i], '#AAFFAA', 'T'); "; $result = MySQL_QUERY($query); }
	  for ($i=0; $i<sizeof($ga); $i++) {$query =  "INSERT INTO `MZ_Diplo` Values($idGuilde, $ga[$i], '#AAFFAA', 'G'); "; $result = MySQL_QUERY($query); }
	  for ($i=0; $i<sizeof($te); $i++) {$query =  "INSERT INTO `MZ_Diplo` Values($idGuilde, $te[$i], '#FFAAAA', 'T'); "; $result = MySQL_QUERY($query); }
	  for ($i=0; $i<sizeof($ge); $i++) {$query =  "INSERT INTO `MZ_Diplo` Values($idGuilde, $ge[$i], '#FFAAAA', 'G'); "; $result = MySQL_QUERY($query); }

      _sqlclose();		# -------------- Fermeture DB  

	  if ($idGuilde>0) 
	  	print("alert('La Diplomatie de La guilde Id=$idGuilde: OK!');"); 	  
	  else 
	  	print("alert('La Diplomatie du Troll Id=$num: OK!');"); 	  	
#-----------------------------------------------------------------------------------
} else if ($TypeData == "Matos") {
#-----------------------------------------------------------------------------------
	  If (!isset($TiD)) { Die("// Données imcomplètes!"); }
	  If (!isset($MiD)) { Die("// Données imcomplètes!"); }
	  If (!isset($Matos)) { Die("// Données imcomplètes!"); }
	  If (!isset($Desc)) { Die("// Données imcomplètes!"); }
	  If (!isset($Etat)) { Die("// Données imcomplètes!"); }
  	  If (!isset($TimeStamp)) $TimeStamp=date("Y-m-d H:i:s"); else $TimeStamp=_StringToDate($TimeStamp);

	  $mysql=_sqlconnect();	# -------------- Ouverture DB  

      # Mise à jour du profil d'un troll
      $query =  "DELETE FROM `MZ_Matos` where TiD=$TiD";
      #echo "$query<BR>";
      $result = MySQL_QUERY($query);

      for ($i=0; $i<sizeof($MiD);$i++) {
	      $query =  "INSERT INTO `MZ_Matos` Values($TiD, $MiD[$i], \"$Matos[$i]\", \"$Desc[$i]\", \"$Etat[$i]\")";
	      #echo "$query<BR>";
	      $result = MySQL_QUERY($query);
	      $query =  "REPLACE  `MZ_Tresor` Values($TiD, $MiD[$i], \"$Matos[$i]\", \"$Desc[$i]\", \"$Etat[$i]\", \"\", \"$TimeStamp\")";
	      #echo "$query<BR>";
	      $result = MySQL_QUERY($query);
	  }
      _sqlclose();		# -------------- Fermeture DB  	
	  echo "setDBMsgZZ('Matos envoyé dans la DB de ZoryaZilla!');";      
#-----------------------------------------------------------------------------------
} else if ($TypeData == "Insulte") {
#-----------------------------------------------------------------------------------
	  If (!isset($Insulte)) { Die("// Données imcomplètes!"); }
	  If (!isset($TiD)) { Die("// Données imcomplètes!"); }
	  If (!isset($MeID)) { Die("// Données imcomplètes!"); }
	  If (!isset($SR)) { Die("// Données imcomplètes!"); }
	  If (!isset($RM)) { Die("// Données imcomplètes!"); }
  	  If (!isset($TimeStamp)) $TimeStamp=date("Y-m-d H:i:s"); else $TimeStamp=_StringToDate($TimeStamp);

  	  if (strpos($RM, "u") >0) {  // remplacement de l'unicode généré par MZ
		 $RM=str_replace("%u2264 ", "<",$RM);
		 $RM=str_replace("%u2265 ", ">",$RM);
	  } else {
 	 	 $RM="=$RM";
 	  }
  	  
	  $mysql=_sqlconnect();	# -------------- Ouverture DB  

	  // ==-- On vérifie que la donnée n'est pas déjà saisie --===================
	  $query =  "select distinct TimeStamp from `MZ_Insulte` where ".roundTime("TimeStamp", $TimeStamp)." and Insulte=$Insulte and TiD=$TiD and MeID=$MeID and SR=$SR";
	  //echo "$query<BR>";
	  $result = MySQL_QUERY($query);
	  if (@MySQL_NUM_ROWS($result)>0)  die("setDBMsgZZ('Insulte déjà dans la DB de ZoryaZilla!'); ");		// à 15 seconde près (différence entre date MH et capture de la page
	  // ==-- fin de vérification de la donnée n'est pas déjà saisie --===========
  	  
	  $query =  "INSERT INTO `MZ_Insulte` Values('$TimeStamp', $Insulte, $TiD, $MeID, $SR, '$RM')";
	  #echo "$query<BR>";
	  $result = MySQL_QUERY($query);
      _sqlclose();		# -------------- Fermeture DB  	
	  echo "setDBMsgZZ('Insulte envoyée dans la DB de ZoryaZilla!');";

#	  $cleanquery =  "DELETE from `MZ_Insulte` where (TiD=$TiD) and (TimeStamp<'$cleanOutOfDate')";
	  #echo "$cleanquery<BR>";
#	  $cleanresult = MySQL_QUERY($cleanquery);  
#-----------------------------------------------------------------------------------
} else if ($TypeData == "Attaque") {
#-----------------------------------------------------------------------------------
	  If (!isset($TiD)) { Die("// 1Données imcomplètes!"); }
	  If (!isset($Attaque)) { Die("// 2Données imcomplètes!"); }
	  If (!isset($MeID)) { Die("// 3Données imcomplètes!"); }
	  If (!isset($SR)) { Die("// 4Données imcomplètes!"); }
	  If (!isset($RM)) { Die("// 5Données imcomplètes!"); }
	  If (!isset($DEG)) { Die("// 6Données imcomplètes!"); }
	  If (!isset($REG)) { Die("// 7Données imcomplètes!"); }
	  If (!isset($ARM)) { Die("// 8Données imcomplètes!"); }
	  If (!isset($NIV)) { Die("// 9Données imcomplètes!"); }
	  If (!isset($ESQ)) { Die("// 10Données imcomplètes!"); }
  	  If (!isset($TimeStamp)) $TimeStamp=date("Y-m-d H:i:s"); else $TimeStamp=_StringToDate($TimeStamp);
  	  //$Stamp=strtotime($TimeStamp);
  	  
	//http://localhost/FZZ/mzData.php?&TypeData=Attaque&TimeStamp=06/05/2007_22:00:02&TiD=28468&Attaque=0&MeID=1479841&DEG=140&REG=0&SR=0&RM=0&ARM=3&NIV=0&ESQ=15&AGE=Nouvelle&CODE=%0AVous%20avez%20%3Cb%3ER%C9USSI%3C/b%3E%20%E0%20utiliser%20cette%20comp%E9tence%20%3Cb%3E%2818%20sur%2086%20%25%29%3C/b%3E.%3Cp%3EVotre%20%3Cb%3EJet%20d%27am%E9lioration%3C/b%3E%20est%20de%20%3Cb%3E34%3C/b%3E.%3Cbr%3EVous%20n%27avez%20donc%20%3Cb%3Epas%20r%E9ussi%20%E0%20am%E9liorer%3C/b%3E%20cette%20comp%E9tence.%3C/p%3E%3Cp%3EVous%20avez%20attaqu%E9%20une%20Manticore%20Gargantuesque%20%5BNouvelle%5D%20%281479841%29%3Cbr%3E%3C/p%3E%3Cp%3EVotre%20Jet%20d%27Attaque%20est%20de............................%3A%2067%3Cbr%3ELe%20Jet%20d%27Esquive%20de%20votre%20adversaire%20est%20de...%3A%2017%3C/p%3E%3Cp%3EVous%20avez%20donc%20%3Cb%3ETOUCH%C9%3C/b%3E%20votre%20adversaire%20par%20un%20coup%20critique%3C/p%3E%3Cp%3EVous%20lui%20avez%20inflig%E9%20%3Cb%3E78%20points%20de%20d%E9g%E2ts%3C/b%3E.%3Cbr%3ESon%20Armure%20le%20prot%E8ge%20et%20il%20ne%20perdra%20que%20%3Cb%3E75%20points%20de%20vie%3C/b%3E.%3Cbr%3EIl%20sera%2C%20de%20plus%2C%20fragilis%E9%20lors%20des%20prochaines%20esquives.%3C/p%3E%3Cp%3EPour%20cette%20action%2C%20vous%20avez%20gagn%E9%20un%20total%20de%20%3Cb%3E2%20PX%3C/b%3E.%3C/p%3E%3Cp%3EVous%20avez%20attaqu%E9%20une%20Manticore%20Gargantuesque%20%5BNouvelle%5D%20%281479841%29%3Cbr%3E%3C/p%3E%3Cp%3EVotre%20Jet%20d%27Attaque%20est%20de............................%3A%2056%3Cbr%3ELe%20Jet%20d%27Esquive%20de%20votre%20adversaire%20est%20de...%3A%2015%3C/p%3E%3Cp%3EVous%20avez%20donc%20%3Cb%3ETOUCH%C9%3C/b%3E%20votre%20adversaire%20par%20un%20coup%20critique%3C/p%3E%3Cp%3EVous%20lui%20avez%20inflig%E9%20%3Cb%3E68%20points%20de%20d%E9g%E2ts%3C/b%3E.%3Cbr%3ESon%20Armure%20le%20prot%E8ge%20et%20il%20ne%20perdra%20que%20%3Cb%3E65%20points%20de%20vie%3C/b%3E.%3Cbr%3EVous%20l%27avez%20%3Cb%3ETU%C9%3C/b%3E%20d%E9barrass%E9%20le%20Monde%20Souterrain%20de%20sa%20pr%E9sence%20mal%E9fique.%3Cbr%3E%3Cbr%3EIl%20a%2C%20de%20plus%2C%20laiss%E9%20tomber%20un%20tr%E9sor%20et%20%3Cstrong%3E2%20centaines%20de%20Gigots%20de%20Gob%27%3C/strong%3E.%3C/p%3E%3Cp%3EVous%20n%27avez%20gagn%E9%20%3Cb%3Eaucun%20PX%3C/b%3E%20pour%20cette%20action.%20%3C/p%3E%3Cp%3E%0A%0A
	

	  $mysql=_sqlconnect();	# -------------- Ouverture DB  
	  for ($i=0; $i<sizeof($MeID); $i++) {

		// ==-- On vérifie que la donnée n'est pas déjà saisie --===================
		$Filter_Att="Attaque='$Attaque'";
		if (($Attaque=='IdSort') || ($Attaque=='IdComp')) $Filter_Att="Attaque like '$Attaque%'"; 	// sur message du bot, elargir le critère
		
		//$query =  "select distinct TimeStamp from `MZ_Attaque` where ".roundTime("TimeStamp", $TimeStamp)." and Tid=$TiD and $Filter_Att and MeID=$MeID[$i] and DEG=$DEG[$i] and REG='$REG' and SR=$SR[$i] and RM='$RM[$i]' and ARM=$ARM[$i] and NIV=$NIV and ESQ=$ESQ[$i]";
		// reduction du filtre car Attaque pas toujours bien saisie et le SR a put changer. 		
		$query =  "select distinct TimeStamp from `MZ_Attaque` where ".roundTime("TimeStamp", $TimeStamp)." and Tid=$TiD and MeID=$MeID[$i] and DEG=$DEG[$i] and REG='$REG' and RM='$RM[$i]' and ARM=$ARM[$i] and NIV=$NIV and ESQ=$ESQ[$i]";
		//echo "$query<BR>";
		$result = MySQL_QUERY($query);
		if (@MySQL_NUM_ROWS($result)>0)  die("setDBMsgZZ('Attaque déjà dans la DB de ZoryaZilla!'); ");		// à 15 seconde près (différence entre date MH et capture de la page
		// ==-- fin de vérification de la donnée n'est pas déjà saisie --===========
  	  	  
	  	  //$TimeStamp=date("Y-m-d H:i:s",mktime(date("H",$Stamp),date("i",$Stamp),date("s",$Stamp)+$i,date("m",$Stamp),date("d",$Stamp),date("Y",$Stamp)));
		  $query =  "INSERT INTO `MZ_Attaque` Values('$TimeStamp', $TiD, '$Attaque', $MeID[$i], $DEG[$i], '$REG', $SR[$i], '$RM[$i]', $ARM[$i], $NIV, $ESQ[$i])";
		  //echo "//$query<BR>";
	  	  $result = MySQL_QUERY($query);
	  }
      #$UpdateCDM="";	# Mise à jour de la DB avec niveau et RM s'il y a les infos.
	  #if ($NIV>0) $UpdateCDM.="NivMin=$NIV, NivMax=$NIV, ";
	  #if (substr($RM,0,1)=="=") $UpdateCDM.="RMMin=".substr($RM,1).", RMMax=".substr($RM,1).", ";
	  #if ((isset($AGE)) && ($UpdateCDM!="")) {
	  #   $query =  "UPDATE `MZ_CdmPUB` SET $UpdateCDM Id=$MeID where (Id=$MeID) and (Age=\"$AGE\")";
	  #	  //echo "//$query<BR>";
	  #	  $result = @MySQL_QUERY($query);
	  # }
	  
      _sqlclose();		# -------------- Fermeture DB  	
	  echo "setDBMsgZZ('Attaque envoyée dans la DB de ZoryaZilla!');";

#	  $cleanquery =  "DELETE from `MZ_Attaque` where (TiD=$TiD) and (TimeStamp<'$cleanOutOfDate')";
	  #echo "$cleanquery<BR>";
#	  $cleanresult = MySQL_QUERY($cleanquery);    
#-----------------------------------------------------------------------------------
} else if ($TypeData == "Gogo") {
#-----------------------------------------------------------------------------------
	  If (!isset($TiD)) { Die("// Données imcomplètes!"); }
  	  
	  $mysql=_sqlconnect();	# -------------- Ouverture DB  
      # Mise à jour des gogos/Fams d'un troll
      $query =  "DELETE FROM `MZ_Gogo` where TiD=$TiD";
	  #echo "$query<BR>";
      $result = MySQL_QUERY($query);
      $query =  "DELETE FROM `MZ_Fam` where TiD=$TiD";
	  #echo "$query<BR>";
      $result = MySQL_QUERY($query);

      for ($i=0; $i<sizeof($IdGogo);$i++) {
	      $query =  "INSERT INTO `MZ_Gogo` Values($IdGogo[$i], $TiD)";
	      #echo "$query<BR>";
	      $result = MySQL_QUERY($query);
      }
      for ($i=0; $i<sizeof($IdFam);$i++) {
	      $query =  "INSERT INTO `MZ_Fam` Values($IdFam[$i], $TiD)";
	      #echo "$query<BR>";
	      $result = MySQL_QUERY($query);
      }
      for ($i=0; $i<sizeof($IdGolem);$i++) {		// Golem dans les Fams!
	      $query =  "INSERT INTO `MZ_Fam` Values($IdGolem[$i], $TiD)";
	      #echo "$query<BR>";
	      $result = MySQL_QUERY($query);
      }      
  	  If (!isset($TimeStamp)) $TimeStamp=date("Y-m-d H:i:s"); else $TimeStamp=_StringToDate($TimeStamp);
	  for ($i=0; $i<sizeof($MiD);$i++) {	// on memorise le matos du gogo
	      $query =  "REPLACE  `MZ_Tresor` Values($TiD, $MiD[$i], \"$Matos[$i]\", \"$Desc[$i]\", \"$Etat[$i]\", \"$Vu[$i]\", \"$TimeStamp\")";
	      #echo "$query<BR>";
	      $result = MySQL_QUERY($query);
	  }

      _sqlclose();		# -------------- Fermeture DB  	
	  print(utf8_encode("Equipements des Gowaps envoyés dans la DB de ZoryaZilla"));
#-----------------------------------------------------------------------------------
} else if ($TypeData == "IdT") {
#-----------------------------------------------------------------------------------
	  If (!isset($TiD)) { Die("// Données imcomplètes!"); }

	  $mysql=_sqlconnect();	# -------------- Ouverture DB  
	  
  	  #if (!isset($TimeStamp)) $TimeStamp=date("Y-m-d H:i:s"); else $TimeStamp=_StringToDate($TimeStamp);
  	  
	  for ($i=0; $i<sizeof($MiD);$i++) {	// on memorise le matos 
	  	  If (!isset($TimeStamp[$i])) $TimeStamp[$i]=date("Y-m-d H:i:s"); else $TimeStamp[$i]=_StringToDate($TimeStamp[$i]);	#Probleme UK/EU time => on prend l'heure locale
	      $query =  "REPLACE  `MZ_Tresor` Values($TiD, $MiD[$i], \"$Matos[$i]\", \"$Desc[$i]\", \"$Etat[$i]\", \"$Vu[$i]\", \"$TimeStamp[$i]\")";
	      //echo "$query<BR>";
	      $result = MySQL_QUERY($query);
	  }
      _sqlclose();		# -------------- Fermeture DB  	
	  echo "setDBMsgZZ('Identification envoyée dans la DB de ZoryaZilla');";	  
      
#-----------------------------------------------------------------------------------
} else if ($TypeData == "oGogo") {
#-----------------------------------------------------------------------------------
	  If (!isset($TiD)) { Die("// Données imcomplètes!"); }
	  If (!isset($Gogo)) { Die("// Données imcomplètes!"); }
  	  #If (!isset($TimeStamp)) $TimeStamp=date("Y-m-d H:i:s"); else $TimeStamp=_StringUKToDate($TimeStamp);
  	  #TimeStamp uniquement pour la charge du gogo

	  $mysql=_sqlconnect();	# -------------- Ouverture DB  
	  $query =  "SELECT Gogo FROM `MZ_iGogo` WHERE Gogo=$Gogo";
      #echo "$query<BR>";
	  $result = MySQL_QUERY($query);
	  $nData = MySQL_NUM_ROWS($result);
      if ($nData<=0) {
	      $query =  "INSERT INTO `MZ_iGogo` Values('$TimeStamp', $Gogo, '', 0, 0, 0, 0, 0, 0)";
	      #echo "$query<BR>";
	      $result = MySQL_QUERY($query);
      }
	  	  
	  If (isset($X) && isset($Y) && isset($N)) { #mise à jour de la destination
	      $query =  "UPDATE `MZ_iGogo` SET goX=$X,goY=$Y,goN=$N where Gogo=$Gogo";
	  } else {
	      $query =  "UPDATE `MZ_iGogo` SET goX=0,goY=0,goN=0 where Gogo=$Gogo";
	  } 
      #echo "$query<BR>";     
      $result = MySQL_QUERY($query);    

	  If (isset($Tresor)) { #mise à jour du trésor à ramasser
	      $query =  "UPDATE `MZ_iGogo` SET IdTresor=$Tresor where Gogo=$Gogo";
	  } else {
	      $query =  "UPDATE `MZ_iGogo` SET IdTresor=0 where Gogo=$Gogo";
	  } 
      #echo "$query<BR>";     
      $result = MySQL_QUERY($query);    
      _sqlclose();		# -------------- Fermeture DB  	

	  echo "setDBMsgZZ('Ordre du gowap envoyé dans la DB de ZoryaZilla!');";

#-----------------------------------------------------------------------------------
} else if ($TypeData == "pGogo") {
#-----------------------------------------------------------------------------------
	  If (!isset($TiD)) { Die("// Données imcomplètes!"); }
	  If (!isset($Gogo)) { Die("// Données imcomplètes!"); }
	  If (!isset($Poids)) { Die("// Données imcomplètes!"); }
  	  //If (!isset($TimeStamp)) $TimeStamp=date("Y-m-d H:i:s"); else $TimeStamp=_StringToDate($TimeStamp);
  	  $TimeStamp=date("Y-m-d H:i:s"); 
  	  
	  $mysql=_sqlconnect();	# -------------- Ouverture DB  
	  $query =  "SELECT Gogo FROM `MZ_iGogo` WHERE Gogo=$Gogo";
      #echo "$query<BR>";
	  $result = MySQL_QUERY($query);
	  $nData = MySQL_NUM_ROWS($result);
      if ($nData<=0) {
	      $query =  "INSERT INTO `MZ_iGogo` Values('$TimeStamp', $Gogo, '', 0, 0, 0, 0, 0, 0)";
	      #echo "$query<BR>";
	      $result = MySQL_QUERY($query);
      }
	  	  
      $query =  "UPDATE `MZ_iGogo` SET TimeStamp='$TimeStamp', Poids=$Poids ";
	  If (isset($DLA)) $query.=  ", DLA=$DLA";
      $query.=  "where Gogo=$Gogo";

      //echo "$query<BR>";     
      //$query =  "UPDATE `MZ_iGogo` SET TimeStamp='$TimeStamp', DLA=$DLA, Poids=$Poids where Gogo=$Gogo";
      //$result = MySQL_QUERY($query);    
      _sqlclose();		# -------------- Fermeture DB  	

	  echo "setDBMsgZZ('Profil du gowap envoyé dans la DB de ZoryaZilla!');";
	  
#-----------------------------------------------------------------------------------
} else if ($TypeData == "p2Gogo") {
#-----------------------------------------------------------------------------------
	  If (!isset($TiD)) { Die("// Données imcomplètes!"); }
	  If (!isset($Gogo)) { Die("// Données imcomplètes!"); }
	  If (!isset($Poids)) { Die("// Données imcomplètes!"); }
  	  //If (!isset($TimeStamp)) $TimeStamp=date("Y-m-d H:i:s"); else $TimeStamp=_StringToDate($TimeStamp);
  	  $TimeStamp=date("Y-m-d H:i:s"); 
  	  
	  $mysql=_sqlconnect();	# -------------- Ouverture DB  

	  $nGogo=sizeof($Gogo);
	  for ($i=0; $i<$nGogo;$i++) {
	  
		  $query =  "SELECT Gogo FROM `MZ_iGogo` WHERE Gogo=".$Gogo[$i];
	      //echo "$query<BR>";
		  $result = MySQL_QUERY($query);
		  $nData = MySQL_NUM_ROWS($result);
	      if ($nData<=0) {
		      $query =  "INSERT INTO `MZ_iGogo` Values('$TimeStamp', ".$Gogo[$i].", '', 0, 0, 0, 0, 0, 0)";
		      //echo "$query<BR>";
		      $result = MySQL_QUERY($query);
	      }
	  	  
	      $query =  "UPDATE `MZ_iGogo` SET TimeStamp='$TimeStamp', Poids=".$Poids[$i]." where Gogo=".$Gogo[$i];
      	  //echo "$query<BR>";    
	 } 
     _sqlclose();		# -------------- Fermeture DB  	

	 echo "setDBMsgZZ('Profils des gowaps envoyés dans la DB de ZoryaZilla!');";

#-----------------------------------------------------------------------------------
} else if ($TypeData == "Piege") {
#-----------------------------------------------------------------------------------
	  If (!isset($TiD)) { Die("// Données imcomplètes!"); }
	  If (!isset($X)) { Die("// Données imcomplètes!"); }
	  If (!isset($Y)) { Die("// Données imcomplètes!"); }
	  If (!isset($N)) { Die("// Données imcomplètes!"); }
	  If (!isset($MM)) { Die("// Données imcomplètes!"); }
	  If (!isset($Piege)) { Die("// Données imcomplètes!"); }
  	  If (!isset($TimeStamp)) $TimeStamp=date("Y-m-d H:i:s"); else $TimeStamp=_StringToDate($TimeStamp);
	  
	  $mysql=_sqlconnect();	# -------------- Ouverture DB  
      # Supression du piege s'il exite déjà
      $query =  "DELETE FROM `MZ_Piege` where TimeStamp='$TimeStamp'";
      #echo "$query<BR>";
      $result = MySQL_QUERY($query);
	  
      $query =  "INSERT INTO `MZ_Piege` Values('$TimeStamp', $TiD, $X, $Y, $N, $MM, \"$Piege\")";
      $result = MySQL_QUERY($query);
      _sqlclose();		# -------------- Fermeture DB  	
	  echo "setDBMsgZZ('Piege ajouté dans la DB de ZoryaZilla!');";
#-----------------------------------------------------------------------------------
} else if ($TypeData == "PiegeX") {
#-----------------------------------------------------------------------------------
	  If (!isset($TiD)) { Die("// Données imcomplètes!"); }
	  If (!isset($TimeStamp)) { Die("// Données imcomplètes!"); }
	  If (!isset($X)) { Die("// Données imcomplètes!"); }
	  If (!isset($Y)) { Die("// Données imcomplètes!"); }
	  If (!isset($N)) { Die("// Données imcomplètes!"); }
	  
	  $mysql=_sqlconnect();	# -------------- Ouverture DB  
      for ($i=0; $i<sizeof($TimeStamp);$i++) {
	      $eXplose=_StringToDate($TimeStamp[$i]);
	      $query =  "DELETE FROM `MZ_Piege` where (TiD=$TiD) and (TimeStamp<='$eXplose') and (X=$X[$i]) and (Y=$Y[$i]) and (N=$N[$i])";
	      $result = MySQL_QUERY($query);
      }      
      _sqlclose();		# -------------- Fermeture DB  	
	  echo "setDBMsgZZ('Pieges(s) supprimés(s) de la DB de ZoryaZilla!');";
#-----------------------------------------------------------------------------------
} else if ($TypeData == "Karma") {
#-----------------------------------------------------------------------------------
	  	//If (!isset($Karma))  { Die("// Données imcomplètes!"); }
	  	If (!isset($TiD)) { Die("// Données imcomplètes!"); }
		  
		$SkinZZ="http://".$_SERVER["HTTP_HOST"]."/FZZ/skin/";

		$mysql=_sqlconnect();	# -------------- Ouverture DB  
		
	    $query =  "SELECT E.TimeStamp, E.MortID, T.Troll, K.Karma FROM `MZ_Events_mort` E LEFT JOIN MZ_Trolls T ON T.TiD = E.MortID left join MZ_Karma K on K.Tid=E.MortID WHERE MortType='Troll' and killerid=$TiD";
		$result = MySQL_QUERY($query);
		$nData = @MySQL_NUM_ROWS($result);
		$kList=""; if ($nData>0) $kList="<table>";
		for ($i=0; $i<$nData; $i++) {
              $TimeStamp=mysql_result($result,$i,"TimeStamp");
              $MortID=mysql_result($result,$i,"MortID");
              $Troll=mysql_result($result,$i,"Troll");
              $Troll=mysql_real_escape_string($Troll); //$Troll=str_replace("'", "\'", $Troll);
              $Karma=mysql_result($result,$i,"Karma");
			  if ($Karma=="O") $Karma="<img src=\"$SkinZZ/ok.png\">"; else if ($Karma=="T") $Karma="<img src=\"$SkinZZ/tk.png\">"; else if ($Karma=="A") $Karma="<img src=\"$SkinZZ/ak.png\">"; else $Karma="";
              $kList.="<tr><td>$TimeStamp</td><td><b>$MortID</b></td><td>$Troll&nbsp;$Karma</td></tr>";
			  	
		}
		 if ($nData>0) $kList.="</table>";

	    $query =  "SELECT * from `MZ_Karma` where TiD=$TiD";
		$result = MySQL_QUERY($query);

		_sqlclose();		# -------------- Fermeture DB  	*/
		  
  		$nData = @MySQL_NUM_ROWS($result);
  		if ($nData==1) {		  
              $firstFrag=mysql_result($result,0,"firstFrag");
              $lastFrag=mysql_result($result,0,"lastFrag");
              $Tk=mysql_result($result,0,"Tk");
              $Mk=mysql_result($result,0,"Mk");
              $Mk=mysql_result($result,0,"Mk");
              $Karma=mysql_result($result,0,"Karma");
			  if ($Karma=="O") $regime="Omnivore&nbsp;<img src=\"$SkinZZ/ok.png\">"; else if ($Karma=="T") $regime="Troll&nbsp;<img src=\"$SkinZZ/tk.png\">"; else if ($Karma=="A") $regime="Monstre&nbsp;et&nbsp;TK&nbsp;<img src=\"$SkinZZ/ak.png\">"; else  if ($Karma=="M") $regime="Monstre"; else $regime="inconnu";
			  $kt=showKarma($kList, $lastFrag, $firstFrag, $Tk, $Mk, $regime);
       	      echo "setDBMsgZZ('$kt[0]','$kt[1]');";	
		}  
#-----------------------------------------------------------------------------------
} else if ($TypeData == "Glandouille") {
#-----------------------------------------------------------------------------------
	  If (!isset($TiD)) { Die("// Données imcomplètes!"); }
	  If (!isset($PA))  { Die("// Données imcomplètes!"); }
  	  If (!isset($TimeStamp)) $TimeStamp=date("Y-m-d H:i:s"); else $TimeStamp=_StringToDate($TimeStamp);
	  $mysql=_sqlconnect();	# -------------- Ouverture DB  
      $query =  "DELETE FROM `MZ_Glandouille` where (TiD=$TiD) and (TimeStamp='$TimeStamp')";
      $result = MySQL_QUERY($query);
      $query =  "INSERT INTO `MZ_Glandouille` Values('$TimeStamp', $TiD, $PA)";
      $result = MySQL_QUERY($query);
      _sqlclose();		# -------------- Fermeture DB  	
	  echo "setDBMsgZZ('Glandouille de ".$PA."PA ajoutée dans la DB de ZoryaZilla!');";	  
#-----------------------------------------------------------------------------------
}

#----------------------------------------------------------------------------------- 
_sqlTLog();	#Log des consommations de temps SQL et PHP
?>