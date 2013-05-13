<?php 
ignore_user_abort(True);
require_once("../Config/_sqlconf.php");

#-----------------------------------------------------------------------------------
function GROUP_SPLIT($str){
	$exp=@split('#', $str);
	if ($exp[0]<>"") return $exp[0]; else return $exp[1];
}


function CheckMini($_Min, $VarMin, $_VarMin) {	// constante, CdMGroup, CdmBestiaire
	//if ($VarMin==0) return "";	// on a pas trouvé mieux
	if ($VarMin>$_VarMin) return "$_Min=$VarMin,";
}

#-----------------------------------------------------------------------------------
function CheckMaxi($_Max, $VarMax, $_VarMax) {	// constante, CdMGroup, CdmBestiaire
	//if ($VarMax==0) return "";	// on a pas trouvé mieux
	if (($VarMax<$_VarMax) || ($_VarMax==0)) return "$_Max=$VarMax,";
}


function CheckValue($_Var, $VarValue, $_VarValue) {	// constante, CdMGroup, CdmBestiaire
	if ($VarValue=="") return "";	// on a pas trouvé mieux
	if (trim($VarValue)<>$_VarValue) return "$_Var=\"".trim($VarValue)."\",";
}

#-----------------------------------------------------------------------------------
  $MAXMAX=32767;
  
  $mysql=_sqlconnect();	# -------------- Ouverture DB  
#=======================================================================================================
# Looping for initial load
for ($_monstre_in_bestiaire=0; $_monstre_in_bestiaire<500; $_monstre_in_bestiaire++) {
set_time_limit ( 0 );	// reset du compteur
echo "Checkin monstre #$_monstre_in_bestiaire<br>";
#=======================================================================================================
  $query =  "SELECT Value as cursor_bestiaire from MZ_Cron where Field='cursor_bestiaire'";
  //echo "$query<BR>";
  $result = @MySQL_QUERY($query);
  if (@MySQL_NUM_ROWS($result)<>1) die(-1);
  $cursor_bestiaire=mysql_result($result,0,"cursor_bestiaire"); 
  

  $query =  "SELECT  distinct `Nom`,`Age` FROM `MZ_CdM` where Id>400000 order by Nom, age LIMIT $cursor_bestiaire , 1";
  #$query =  "SELECT  distinct `Nom`,`Age` FROM `mz_bestiaire` where (NivMin=0 and NivMax=0) or (PdVMin=0 and PdVMax=0) order by Nom, age LIMIT $cursor_bestiaire , 1";
  //echo "$query<BR>";
  $result = @MySQL_QUERY($query);
  
  if (@MySQL_NUM_ROWS($result)<>1) {		// bestiaire fait dans sa totalité... on recommence à zéro
	  $query =  "UPDATE  MZ_Cron set Value=0 WHERE Field='cursor_bestiaire'";
  	  $result = @MySQL_QUERY($query);
  	  die("");
  }
  
  $Nom=mysql_result($result,0,"Nom"); 
  $Age=mysql_result($result,0,"Age"); 
  /*$Nom="Pseudo-Dragon";
  $Age="Initial";					
  
  $Nom="Mouch'oo Majestueux Sauvage";
  $Age="Légendaire";									# pour test */
 	
  $Nom=mysql_real_escape_string($Nom);
  $Age=mysql_real_escape_string($Age);
 	
  // CdM => partie publiques
  $query =  "select distinct CdM.Id, CdM.Famille, GC.NivMin, GC.NivMax, GC.PdVMin, GC.PdVMax";
  $query.=  ",GC.AttMin, GC.AttMax, GC.EsqMin, GC.EsqMax, GC.DegMin, GC.DegMax, GC.RegMin, GC.RegMax";
  $query.=  ",GC.ArmMin, GC.ArmMax, GC.VueMin, GC.VueMax, CdM.Pouvoir, CdM.CapaRange, GC.MMMin, GC.MMMax, GC.RMMin, GC.RMMax, GC.DLAMin, GC.DLAMax";
  $query.=  ",GC.AttDist, GC.VlC, GC.nbATT, GC.Vitesse";
  $query.=  " FROM ( SELECT Max(TimeStamp) as TimeStamp";
  $query.=  " ,Max(NivMin) as NivMin, MIN(if (NivMax=0, $MAXMAX, NivMax)) as NivMax";
  $query.=  " ,Max(PdVMin) as PdVMin, MIN(if (PdVMax=0, $MAXMAX, PdVMax)) as PdVMax";
  $query.=  " ,Max(AttMin) as AttMin, MIN(if (AttMax=0, $MAXMAX, AttMax)) as AttMax";
  $query.=  " ,Max(EsqMin) as EsqMin, MIN(if (EsqMax=0, $MAXMAX, EsqMax)) as EsqMax";
  $query.=  " ,Max(DegMin) as DegMin, MIN(if (DegMax=0, $MAXMAX, DegMax)) as DegMax";
  $query.=  " ,Max(RegMin) as RegMin, MIN(if (RegMax=0, $MAXMAX, RegMax)) as RegMax";  
  $query.=  " ,Max(ArmMin) as ArmMin, MIN(if (ArmMax=0, $MAXMAX, ArmMax)) as ArmMax";    
  $query.=  " ,Max(VueMin) as VueMin, MIN(if (VueMax=0, $MAXMAX, VueMax)) as VueMax";    
  $query.=  " ,Max(MMMin) as MMMin, MIN(if (MMMax=0, $MAXMAX, MMMax)) as MMMax";    
  $query.=  " ,Max(RMMin) as RMMin, MIN(if (RMMax=0, $MAXMAX, RMMax)) as RMMax";    
  $query.=  " ,Max(DLAMin) as DLAMin, MIN(if (DLAMax=0, $MAXMAX, DLAMax)) as DLAMax";  
  $query.=  " ,GROUP_CONCAT(DISTINCT AttDist ORDER BY TimeStamp ASC SEPARATOR '#') AttDist"; 
  $query.=  " ,GROUP_CONCAT(DISTINCT VlC ORDER BY TimeStamp ASC SEPARATOR '#') VlC"; 
  $query.=  " ,GROUP_CONCAT(DISTINCT nbATT ORDER BY TimeStamp ASC SEPARATOR '#') nbATT"; 
  $query.=  " ,GROUP_CONCAT(DISTINCT Vitesse ORDER BY TimeStamp ASC SEPARATOR '#') Vitesse"; 
  $query.=  " FROM `MZ_CdM` as C ";
  $query.=  " WHERE CONCAT(Nom, '*', Age) = '$Nom*$Age' and (Id>400000) GROUP BY Nom, Age";		# bestaire des nouveaux monstres
  $query.=  ") as GC INNER JOIN `MZ_CdM` as CdM on CdM.TimeStamp=GC.TimeStamp ";
  $query.=  "order by CapaRange desc, Pouvoir ";
  //$query.=  " WHERE CdM.TimeStamp=GC.TimeStamp";
  $result = @MySQL_QUERY($query);	  
  //echo "$query<BR>";
  #if (@MySQL_NUM_ROWS($result)<1) die(-1);  

  $cursor_bestiaire++;
  $query =  "UPDATE  MZ_Cron set Value='$cursor_bestiaire' WHERE Field='cursor_bestiaire'";
  //echo "$query<BR>";
  $update = @MySQL_QUERY($query);

  if (@MySQL_NUM_ROWS($result)<1) die(-1);  
  //echo "$query<BR>";
//================================ CDM Groupées ========================================
	$Famille=mysql_result($result,0,"Famille"); 
	$NivMin=mysql_result($result,0,"NivMin"); #if ($NivMin==100000) $NivMin=0;
	$NivMax=mysql_result($result,0,"NivMax"); #if ($NivMax==100000) $NivMax=0; 
	$PdVMin=mysql_result($result,0,"PdVMin"); #if ($PdVMin==100000) $PdVMin=0;
	$PdVMax=mysql_result($result,0,"PdVMax"); #if ($PdVMax==100000) $PdVMax=0;
	$AttMin=mysql_result($result,0,"AttMin"); #if ($AttMin==100000) $AttMin=0;
	$AttMax=mysql_result($result,0,"AttMax"); #if ($AttMax==100000) $AttMax=0;
	$EsqMin=mysql_result($result,0,"EsqMin"); #if ($EsqMin==100000) $EsqMin=0;
	$EsqMax=mysql_result($result,0,"EsqMax"); #if ($EsqMax==100000) $EsqMax=0;
	$DegMin=mysql_result($result,0,"DegMin"); #if ($DegMin==100000) $DegMin=0;
	$DegMax=mysql_result($result,0,"DegMax"); #if ($DegMax==100000) $DegMax=0;
	$RegMin=mysql_result($result,0,"RegMin"); #if ($RegMin==100000) $RegMin=0;
	$RegMax=mysql_result($result,0,"RegMax"); #if ($RegMax==100000) $RegMax=0;
	$ArmMin=mysql_result($result,0,"ArmMin"); #if ($ArmMin==100000) $ArmMin=0;
	$ArmMax=mysql_result($result,0,"ArmMax"); #if ($ArmMax==100000) $ArmMax=0;
	$VueMin=mysql_result($result,0,"VueMin"); #if ($VueMin==100000) $VueMin=0;
	$VueMax=mysql_result($result,0,"VueMax"); #if ($VueMax==100000) $VueMax=0;
 	$Pouvoir=mysql_result($result,0,"Pouvoir");
	$MMMin=mysql_result($result,0,"MMMin"); #if ($MMMin==100000) $MMMin=0;
	$MMMax=mysql_result($result,0,"MMMax"); #if ($MMMax==100000) $MMMax=0;
	$RMMin=mysql_result($result,0,"RMMin"); #if ($RMMin==100000) $RMMin=0;
	$RMMax=mysql_result($result,0,"RMMax"); #if ($RMMax==100000) $RMMax=0;
	$Vitesse=GROUP_SPLIT(mysql_result($result,0,"Vitesse"));
	$VlC=GROUP_SPLIT(mysql_result($result,0,"VlC")); 
	$AttDist=GROUP_SPLIT(mysql_result($result,0,"AttDist"));
	$DLAMin=mysql_result($result,0,"DLAMin"); #if ($DLAMin==100000) $DLAMin=0;
	$DLAMax=mysql_result($result,0,"DLAMax"); #if ($DLAMax==100000) $DLAMax=0;
	$nbATT=GROUP_SPLIT(mysql_result($result,0,"nbATT"));
	$CapaRange=mysql_result($result,0,"CapaRange"); 	
	if ($NivMin>$NivMax) {$switch=$NivMax; $NivMax=$NivMin; $NivMin=$switch; }
	if ($PdVMin>$PdVMax) {$switch=$PdVMax; $PdVMax=$PdVMin; $PdVMin=$switch; }
	if ($AttMin>$AttMax) {$switch=$AttMax; $AttMax=$AttMin; $AttMin=$switch; }
	if ($EsqMin>$EsqMax) {$switch=$EsqMax; $EsqMax=$EsqMin; $EsqMin=$switch; }
	if ($DegMin>$DegMax) {$switch=$DegMax; $DegMax=$DegMin; $DegMin=$switch; }
	if ($RegMin>$RegMax) {$switch=$RegMax; $RegMax=$RegMin; $RegMin=$switch; }
	if ($ArmMin>$ArmMax) {$switch=$ArmMax; $ArmMax=$ArmMin; $ArmMin=$switch; }
	if ($VueMin>$VueMax) {$switch=$VueMax; $VueMax=$VueMin; $VueMin=$switch; }
	if ($MMMin>$MMMax) {$switch=$MMMax; $MMMax=$MMMin; $MMMin=$switch; }
	if ($RMMin>$RMMax) {$switch=$RMMax; $RMMax=$RMMin; $RMMin=$switch; }
	if ($DLAMin>$DLAMax) {$switch=$DLAMax; $DLAMax=$DLAMin; $DLAMin=$switch; }	
//======================================================================================


	#--------------------------------------------------------------------------------
	# Mise à jour du BESTIAIRE ------------------------------------------------------ 
	$query =  "SELECT * FROM `MZ_Bestiaire` where (Nom=\"$Nom\") and (Age=\"$Age\")";     
	//echo "$query<BR>";
	$result = MySQL_QUERY($query);
  	$nData = @MySQL_NUM_ROWS($result);
	if ($nData==0) {	 // valeures par défaut de 0 à 100000 si inconnue
		$query =  "INSERT INTO `MZ_Bestiaire` VALUES ('$Famille', '$Nom', '$Age', 0, $MAXMAX, 0, 0, $MAXMAX, 0, 0, $MAXMAX, 0, 0, $MAXMAX, 0, 0, $MAXMAX, 0, 0, $MAXMAX, 0, 0, $MAXMAX, 0, 0, $MAXMAX, 0, '', 0, $MAXMAX, 0, 0, $MAXMAX, 0, '', '', '', '', '', 0, $MAXMAX, 0, '', '', '')";
		//echo "$query<BR>";
		$result = MySQL_QUERY($query);
		$query =  "SELECT * FROM `MZ_Bestiaire` where (Nom=\"$Nom\") and (Age=\"$Age\")";     
		#echo "$query<BR>";
		$result = MySQL_QUERY($query);
	  	$nData = @MySQL_NUM_ROWS($result);
		#echo "$nData<br>";
	}	    

	if ($nData>0) {	 #Il y a une entrée dans le bestiaire, on ajuste si besoin.

//================================ Bestiaire ========================================
       $_Famille=mysql_result($result,0,"Famille"); 
       $_NivMin=mysql_result($result,0,"NivMin"); 
	   $_NivMax=mysql_result($result,0,"NivMax"); 
       $_PdVMin=mysql_result($result,0,"PdVMin"); 
       $_PdVMax=mysql_result($result,0,"PdVMax"); 
       $_AttMin=mysql_result($result,0,"AttMin"); 
       $_AttMax=mysql_result($result,0,"AttMax"); 
       $_EsqMin=mysql_result($result,0,"EsqMin");
       $_EsqMax=mysql_result($result,0,"EsqMax"); 
       $_DegMin=mysql_result($result,0,"DegMin");
       $_DegMax=mysql_result($result,0,"DegMax"); 
       $_RegMin=mysql_result($result,0,"RegMin"); 
       $_RegMax=mysql_result($result,0,"RegMax"); 
       $_ArmMin=mysql_result($result,0,"ArmMin"); 
       $_ArmMax=mysql_result($result,0,"ArmMax"); 
       $_VueMin=mysql_result($result,0,"VueMin"); 
       $_VueMax=mysql_result($result,0,"VueMax"); 
       $_Pouvoir=mysql_result($result,0,"Pouvoir");
       $_MMMin=mysql_result($result,0,"MMMin"); 
	   $_MMMax=mysql_result($result,0,"MMMax"); 
	   $_RMMin=mysql_result($result,0,"RMMin"); 
	   $_RMMax=mysql_result($result,0,"RMMax"); 
	   $_Vitesse=mysql_result($result,0,"Vitesse");
	   $_VlC=mysql_result($result,0,"VlC"); 
	   $_AttDist=mysql_result($result,0,"AttDist");
	   $_DLAMin=mysql_result($result,0,"DLAMin"); 
	   $_DLAMax=mysql_result($result,0,"DLAMax"); 
	   $_nbATT=mysql_result($result,0,"nbATT");
	   $_CapaRange=mysql_result($result,0,"CapaRange"); 	
//======================================================================================
	
		$query =  "";
		$query .=  CheckMini('NivMin', $NivMin, $_NivMin);
		$query .=  CheckMaxi('NivMax', $NivMax, $_NivMax);
		$query .=  CheckMini('PdVMin', $PdVMin, $_PdVMin);
		$query .=  CheckMaxi('PdVMax', $PdVMax, $_PdVMax);
		$query .=  CheckMini('AttMin', $AttMin, $_AttMin);
		$query .=  CheckMaxi('AttMax', $AttMax, $_AttMax);
		$query .=  CheckMini('EsqMin', $EsqMin, $_EsqMin);
		$query .=  CheckMaxi('EsqMax', $EsqMax, $_EsqMax);
		$query .=  CheckMini('DegMin', $DegMin, $_DegMin);
		$query .=  CheckMaxi('DegMax', $DegMax, $_DegMax);
		$query .=  CheckMini('RegMin', $RegMin, $_RegMin);
		$query .=  CheckMaxi('RegMax', $RegMax, $_RegMax);
		$query .=  CheckMini('ArmMin', $ArmMin, $_ArmMin);
		$query .=  CheckMaxi('ArmMax', $ArmMax, $_ArmMax);
		$query .=  CheckMini('VueMin', $VueMin, $_VueMin);
		$query .=  CheckMaxi('VueMax', $VueMax, $_VueMax);
       	$query .=  CheckValue('Pouvoir', $Pouvoir, $_Pouvoir);
		$query .=  CheckMini('MMMin', $MMMin, $_MMMin);
		$query .=  CheckMaxi('MMMax', $MMMax, $_MMMax);
		$query .=  CheckMini('RMMin', $RMMin, $_RMMin);
		$query .=  CheckMaxi('RMMax', $RMMax, $_RMMax);
       	$query .=  CheckValue('Vitesse', $Vitesse, $_Vitesse);
       	$query .=  CheckValue('VlC', $VlC, $_VlC);
       	$query .=  CheckValue('AttDist',$AttDist, $_AttDist);
		$query .=  CheckMini('DLAMin', $DLAMin, $_DLAMin);
		$query .=  CheckMaxi('DLAMax', $DLAMax, $_DLAMax);
       	$query .=  CheckValue('nbATT', $nbATT, $_nbATT);
       	$query .=  CheckValue('CapaRange', $CapaRange, $_CapaRange);
		

		if ($query!="") {			
			$query =  "UPDATE `MZ_Bestiaire` SET $query Age=\"$Age\" where (Nom=\"$Nom\") and (Age=\"$Age\")";
			//echo "$query<BR>";
			$result = MySQL_QUERY($query); 		
		}
	}	
	
  
#=======================================================================================================
# EOF Looping for initial load
echo "[$Nom*$Age] => Monstre checked!<br>";
}
#=======================================================================================================
  _sqlclose();		# -------------- Fermeture DB  
  

?>