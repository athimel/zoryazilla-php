<?
session_cache_limiter("nocache");
header('Content-Type: text/html; charset=iso-8859-1'); 		// pour les caractère accentué
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1		pour empecher la mise en cache (cache trop important avec ironie ou FF8) !!!

session_start();
require("_global.php");
require_once("./Config/_sqlconf.php");
$__MAX=32767;

#-----------------------------------------------------------------------------------
#http://localhost/FZZ/mzMonstres.php?begin=2&idcdm=1&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$3136464&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$1037871&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$2832702&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$1661041&nom[]=Gowap%20Apprivois%E9%20%5BAnc%EAtre%5D$495099&nom[]=Gowap%20Apprivois%E9%20%5BAnc%EAtre%5D$487539&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$836822&nom[]=Diablotin%20%5BNovice%5D$4325378&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$2577745&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$870354&nom[]=Pititabeille%20%5BLarve%5D$4341776&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$1825783&nom[]=Gowap%20Apprivois%E9%20%5BAnc%EAtre%5D$477446&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$784581&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$-3100433&nom[]=Gowap%20Apprivois%E9%20%5BAnc%EAtre%5D$-452416&nom[]=Hellrot%20%5BInitial%5D$-4341619&nom[]=Gowap%20Apprivois%E9%20%5BAnc%EAtre%5D$-495816&nom[]=Pititabeille%20%5BLarve%5D$-4341786&nom[]=Mouch%27oo%20Sauvage%20%5BNouveau%5D$-4345139&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$-3131258&nom[]=Ver%20Carnivore%20G%E9ant%20%5BNouveau%5D$-4344179&nom[]=Gowap%20Apprivois%E9%20%5BAncien%5D$-1464079&
#-----------------------------------------------------------------------------------


#-----------------------------------------------------------------------------------
if (!empty($_SESSION['login'])) { #Recupération de l'ID de Session
	$ZZ_TID=$_SESSION['login'] ;
}
#if ($num!=$ZZ_TID) {
#  $_SESSION['login']="";
#  die();	//tentative de corruption
#}

$TiD=$ZZ_TID;

#-----------------------------------------------------------------------------------
function GROUP_SPLIT($str){
	$exp=@split('#', $str);
	if ($exp[0]<>"") return $exp[0]; else return $exp[1];
}


#-----------------------------------------------------------------------------------
function LimiteMini($Var, $cdmVarMin, $cdmVarMax, $VarMinInf, $VarMinSup, $VarMaxInf, $VarMaxSup ) {	// constante, CdM Min et Max, CdmBestiaire Min&Max et Inf&Sup
	global $__MAX;
	
	if (($cdmVarMin==$cdmVarMax) && ($cdmVarMin>0)) return $cdmVarMin;
	if ($cdmVarMax==0) $cdmVarMax=$__MAX;
	$VarMin=Min($VarMaxInf, $VarMinSup);
	if ($cdmVarMin<>$cdmVarMax) $VarMin=Max($VarMin, $cdmVarMin);
	if ($VarMin==$__MAX) $VarMin=0;
 	return $VarMin;
}

#-----------------------------------------------------------------------------------
function LimiteMaxi($Var, $cdmVarMin, $cdmVarMax, $VarMinInf, $VarMinSup, $VarMaxInf, $VarMaxSup ) {	// constante, CdM Min et Max, CdmBestiaire Min&Max et Inf&Sup
	global $__MAX;
	
	if (($cdmVarMin==$cdmVarMax) && ($cdmVarMax>0)) return $cdmVarMax;
	if ($cdmVarMax==0) $cdmVarMax=$__MAX;
	$VarMax=Max($VarMaxInf, $VarMinSup);
	$VarMax=Min($VarMax, $cdmVarMax);
	if ($VarMax==$__MAX) $VarMax=0;
 	return $VarMax;
}


//print_r($nom);
//print("/* */ ");
$IdList=$AgeNameList="";
$nMonstres=sizeof($nom);

for ($i=0; $i<$nMonstres;$i++) {	# On explose chaque monstres en tableau id/age/nom
	$monstre=preg_split( "/\[|\]|\\$/", $nom[$i]);
	$name[$i]=str_replace("\\\\'", "\'", str_replace("'", "\\'", trim($monstre[0]))); 
	$age[$i]=$monstre[1]; 
	$id[$i]=abs(1*$monstre[3]); 
	$IdList.="$id[$i],";
	$AgeNameList.="'$name[$i]*$age[$i]',";
	$AgeIdList.="'$id[$i]*$age[$i]',";
}

if ((strlen($IdList)<=0)||(strlen($AgeNameList)<=0)||(strlen($AgeIdList)<=0)) die();
$IdList=substr($IdList, 0, strlen($IdList)-1);
$AgeNameList=substr($AgeNameList, 0, strlen($AgeNameList)-1);
#$AgeNameList=str_replace("\'", "''", $AgeNameList);
$AgeIdList=substr($AgeIdList, 0, strlen($AgeIdList)-1);
#$AgeIdList=str_replace("\'", "''", $AgeIdList);

#-----------------------------------------------------------------------------------
  $mysql=_sqlconnect();	# -------------- Ouverture DB  


  /*=============== Recherche d'info dans les dernières CdM (fraiche d'un mois) ===========================================*/
  // CdM => partie publiques des CdM 
  $query =  "select CdM.Id, CdM.Famille, GC.NivMin, GC.NivMax, GC.PdVMin, GC.PdVMax";
  $query.=  ",GC.AttMin, GC.AttMax, GC.EsqMin, GC.EsqMax, GC.DegMin, GC.DegMax, GC.RegMin, GC.RegMax";
  $query.=  ",GC.ArmMin, GC.ArmMax, GC.ArmMagMin, GC.ArmMagMax, GC.VueMin, GC.VueMax, CdM.Pouvoir, CdM.CapaRange, GC.MMMin, GC.MMMax, GC.RMMin, GC.RMMax, GC.DLAMin, GC.DLAMax";
  $query.=  ",GC.AttDist, GC.VlC, GC.nbATT, GC.Vitesse, GC.AttMag, GC.Vole, GC.SangFroid";
  $query.=  " FROM ( SELECT Id, Max(TimeStamp) as TimeStamp";
  $query.=  " ,Max(NivMin) as NivMin, MIN(if (NivMax=0, $__MAX, NivMax)) as NivMax";
  $query.=  " ,Max(PdVMin) as PdVMin, MIN(if (PdVMax=0, $__MAX, PdVMax)) as PdVMax";
  $query.=  " ,Max(AttMin) as AttMin, MIN(if (AttMax=0, $__MAX, AttMax)) as AttMax";
  $query.=  " ,Max(EsqMin) as EsqMin, MIN(if (EsqMax=0, $__MAX, EsqMax)) as EsqMax";
  $query.=  " ,Max(DegMin) as DegMin, MIN(if (DegMax=0, $__MAX, DegMax)) as DegMax";
  $query.=  " ,Max(RegMin) as RegMin, MIN(if (RegMax=0, $__MAX, RegMax)) as RegMax";  
  $query.=  " ,Max(ArmMin) as ArmMin, MIN(if (ArmMax=0, $__MAX, ArmMax)) as ArmMax";    
  $query.=  " ,Max(ArmMagMin) as ArmMagMin, MIN(if (ArmMagMax=0, $__MAX, ArmMagMax)) as ArmMagMax";    
  $query.=  " ,Max(VueMin) as VueMin, MIN(if (VueMax=0, $__MAX, VueMax)) as VueMax";    
  $query.=  " ,Max(MMMin) as MMMin, MIN(if (MMMax=0, $__MAX, MMMax)) as MMMax";    
  $query.=  " ,Max(RMMin) as RMMin, MIN(if (RMMax=0, $__MAX, RMMax)) as RMMax";    
  $query.=  " ,Max(DLAMin) as DLAMin, MIN(if (DLAMax=0, $__MAX, DLAMax)) as DLAMax";  
  $query.=  " ,GROUP_CONCAT(DISTINCT AttDist ORDER BY TimeStamp ASC SEPARATOR '#') AttDist"; 
  $query.=  " ,GROUP_CONCAT(DISTINCT VlC ORDER BY TimeStamp ASC SEPARATOR '#') VlC"; 
  $query.=  " ,GROUP_CONCAT(DISTINCT nbATT ORDER BY TimeStamp ASC SEPARATOR '#') nbATT"; 
  $query.=  " ,GROUP_CONCAT(DISTINCT Vitesse ORDER BY TimeStamp ASC SEPARATOR '#') Vitesse"; 
  $query.=  " ,GROUP_CONCAT(DISTINCT AttMag ORDER BY TimeStamp ASC SEPARATOR '#') AttMag"; 
  $query.=  " ,GROUP_CONCAT(DISTINCT Vole ORDER BY TimeStamp ASC SEPARATOR '#') Vole"; 
  $query.=  " ,GROUP_CONCAT(DISTINCT SangFroid ORDER BY TimeStamp ASC SEPARATOR '#') SangFroid"; 
  $query.=  " FROM `MZ_CdMLIVE` as C ";
  $query.=  " WHERE CONCAT(Id, '*', Age) in ($AgeIdList) group by Id";
  $query.=  ") as GC INNER JOIN `MZ_CdMLIVE` as CdM on CdM.Id=GC.Id ";
  $query.=  " WHERE CdM.TimeStamp=GC.TimeStamp";
  //echo "$query<BR>";  
  $result1 = @MySQL_QUERY($query);			
 


  /*=============== Recherche d'info dans les dernières CdM (fraiche d'un mois) ===========================================*/
  // CdM => partie Private :  Blessure,Chargement,Bonus/Malus,DLA (uniquement dans les CdM de la coterie
  $query =  "select CdM.Id, CdM.TimeStamp, CdM.Blessure, GC.DLA, GC.Chargement, GC.BonusMalus";
  $query.=  " FROM ( SELECT Id, Max(TimeStamp) as TimeStamp";
  $query.=  " ,GROUP_CONCAT(DISTINCT DLA ORDER BY TimeStamp ASC SEPARATOR '#') DLA"; 
  $query.=  " ,GROUP_CONCAT(DISTINCT Chargement ORDER BY TimeStamp ASC SEPARATOR '#') Chargement"; 
  $query.=  " ,GROUP_CONCAT(DISTINCT `Bonus/Malus` ORDER BY TimeStamp ASC SEPARATOR '#') BonusMalus"; 
  $query.=  " FROM `MZ_CdMLIVE` as C INNER JOIN `MZ_Share` as S ON C.TiD=S.SHRiD";
  $query.=  " WHERE (S.TiD=$TiD) and (S.link='S') and CONCAT(Id, '*', Age) in ($AgeIdList) group by Id";
  $query.=  ") as GC INNER JOIN `MZ_CdMLIVE` as CdM on CdM.Id=GC.Id ";
  $query.=  " WHERE CdM.TimeStamp=GC.TimeStamp";
  $result2 = @MySQL_QUERY($query);
  //echo "$query<br>";
 

 
  #On prend le BESTIAIRE version II pour combler les données inconnues ou affiner celles trouvées
  $query =  "SELECT *, CONCAT(Nom, '*', Age) as Id from `MZ_Beast2` where CONCAT(Nom, '*', Age) in ($AgeNameList)";
  //echo "$query<BR>";
  $result3 = @MySQL_QUERY($query);
  
  _sqlclose();		# -------------- Fermeture DB  


#-----------------------------------------------------------------------------------
# Tableau des recherches inversées
$nData = @MySQL_NUM_ROWS($result1);
for ($i=0; $i<$nData;$i++) { $Id=mysql_result($result1,$i,"Id"); $CdmPUB[$Id]=$i+1; } 
$nData = @MySQL_NUM_ROWS($result2);
for ($i=0; $i<$nData;$i++) { $Id=mysql_result($result2,$i,"Id"); $CdmPRIV[$Id]=$i+1; } 
$nData = @MySQL_NUM_ROWS($result3);
for ($i=0; $i<$nData;$i++) { $Id=mysql_result($result3,$i,"Id"); $Bestiaire[$Id]=$i+1; } 
#-----------------------------------------------------------------------------------

#-----------------------------------------------------------------------------------
 
for ($i=0; $i<$nMonstres;$i++) { 	
	$j=$begin+$i;
	$fData=false;

	$Id=$id[$i];
	$AgeName=str_replace("\'", "'", $name[$i])."*".$age[$i];
	//echo "<br>$Id*$AgeName=====>";
	
	#Default Values 
    $TimeStamp="0000-00-00 00:00:00"; $Famille=''; $Blessure="???";   $DLA='';	$Chargement='';    $BonusMalus='';
    $NivMin=0; $NivMax=0; $NivMoy=0; $PdVMin=0; $PdVMax=0; $PdVMoy=0; $AttMin=0; $AttMax=0; $AttMoy=0; $EsqMin=0; $EsqMax=0; $EsqMoy=0;
    $DegMin=0; $DegMax=0; $DegMoy=0; $RegMin=0; $RegMax=0; $RegMoy=0; $ArmMin=0; $ArmMax=0; $ArmMoy=0; $VueMin=0; $VueMax=0; $VueMoy=0; 
	$MMMin=0;  $MMMax=0;  $MMMoy=0;  $RMMin=0;  $RMMax=0;  $RMMoy=0;  $DLAMin=0; $DLAMax=0; $DLAMoy=0;
	$Pouvoir=''; $nbATT=''; $Vitesse=''; $VlC=''; $AttDist=''; $CapaRange='';
	$ArmMagMin=0; $ArmMagMax=0;  $AttMag='';  $Vole='';  $SangFroid=''; 			// extension bestiaire V2

	/*=============== Aggloméra des CdM publique======================================================================*/
	#On commence par chercher si on a pas des CdMs du Monstre dans la DB PUBlic
	$idx=$CdmPUB[$Id]-1;
	if ($idx>=0) {
       $fData=true;
       #$TimeStamp=mysql_result($result1,$idx,"TimeStamp");		// TimeStamp indique s'il s'agit d'une CdM réel ou du bestaire, l'agloméra public est considéré comme bestaire.
       $Famille=mysql_result($result1,$idx,"Famille"); 
       $NivMin=mysql_result($result1,$idx,"NivMin"); 
	   $NivMax=mysql_result($result1,$idx,"NivMax"); 			
       $PdVMin=mysql_result($result1,$idx,"PdVMin"); 
       $PdVMax=mysql_result($result1,$idx,"PdVMax"); 		
       $AttMin=mysql_result($result1,$idx,"AttMin"); 
       $AttMax=mysql_result($result1,$idx,"AttMax"); 			
       $EsqMin=mysql_result($result1,$idx,"EsqMin"); 
       $EsqMax=mysql_result($result1,$idx,"EsqMax"); 		
       $DegMin=mysql_result($result1,$idx,"DegMin"); 
       $DegMax=mysql_result($result1,$idx,"DegMax"); 	
       $RegMin=mysql_result($result1,$idx,"RegMin"); 
       $RegMax=mysql_result($result1,$idx,"RegMax"); 		
       $ArmMin=mysql_result($result1,$idx,"ArmMin"); 
       $ArmMax=mysql_result($result1,$idx,"ArmMax"); 		
       $ArmMagMin=mysql_result($result1,$idx,"ArmMagMin"); 
       $ArmMagMax=mysql_result($result1,$idx,"ArmMagMax"); 		
       $VueMin=mysql_result($result1,$idx,"VueMin"); 
       $VueMax=mysql_result($result1,$idx,"VueMax"); 		
       $Pouvoir=mysql_result($result1,$idx,"Pouvoir");
       $MMMin=mysql_result($result1,$idx,"MMMin"); 
	   $MMMax=mysql_result($result1,$idx,"MMMax"); 				
	   $RMMin=mysql_result($result1,$idx,"RMMin"); 	
	   $RMMax=mysql_result($result1,$idx,"RMMax"); 				
	   $Vitesse=GROUP_SPLIT(mysql_result($result1,$idx,"Vitesse"));
	   $VlC=GROUP_SPLIT(mysql_result($result1,$idx,"VlC")); 
	   $AttDist=GROUP_SPLIT(mysql_result($result1,$idx,"AttDist"));
	   $DLAMin=mysql_result($result1,$idx,"DLAMin"); 
	   $DLAMax=mysql_result($result1,$idx,"DLAMax"); 		
	   $nbATT=GROUP_SPLIT(mysql_result($result1,$idx,"nbATT"));
	   $CapaRange=mysql_result($result1,$idx,"CapaRange"); 	
	   $AttMag=GROUP_SPLIT(mysql_result($result1,$idx,"AttMag"));
	   $Vole=GROUP_SPLIT(mysql_result($result1,$idx,"Vole"));
	   $SangFroid=GROUP_SPLIT(mysql_result($result1,$idx,"SangFroid"));
	}	

	/*=============== Aggloméra des CdM Privé======================================================================*/
	#On affine le résultat avec la DB PRIVée
	$idx=$CdmPRIV[$Id]-1;
	if ($idx>=0) {
		  $TimeStamp=mysql_result($result2,$idx,"TimeStamp");
		  $Blessure=mysql_result($result2,$idx,"Blessure");
		  $DLA=mysql_result($result2,$idx,"DLA");
		  $Chargement=mysql_result($result2,$idx,"Chargement");
		  $BonusMalus=mysql_result($result2,$idx,"BonusMalus");
	}	
	

	/*=============== Aggloméra du Bestiaire ======================================================================*/
	#On prend le BESTIAIRE pour combler les données inconnues
	#$query =  "SELECT * from `MZ_Bestiaire` where Nom=\"$name\" and age=\"$age\"";
    $idx=$Bestiaire[$AgeName]-1;
    if ($idx>=0) {
    	$fData=true;
       	if ($Famille=="") $Famille=mysql_result($result3,$idx,"Famille");       

		$NivMinInf=mysql_result($result3,$idx,"NivMinInf");		
		$NivMinSup=mysql_result($result3,$idx,"NivMinSup");		
		$NivMaxInf=mysql_result($result3,$idx,"NivMaxInf");		
		$NivMaxSup=mysql_result($result3,$idx,"NivMaxSup");		

		$Min = LimiteMini('Niv', $NivMin, $NivMax, $NivMinInf, $NivMinSup, $NivMaxInf, $NivMaxSup );
		$Max = LimiteMaxi('Niv', $NivMin, $NivMax, $NivMinInf, $NivMinSup, $NivMaxInf, $NivMaxSup );
		#echo "<br>LimiteMini(['$AgeName]/Niv', $NivMin, $NivMax, $NivMinInf, $NivMinSup, $NivMaxInf, $NivMaxSup ); => $Min à $Max<br>";
		$NivMin=$Min; $NivMax=$Max;

		$PdVMinInf=mysql_result($result3,$idx,"PdVMinInf");		
		$PdVMinSup=mysql_result($result3,$idx,"PdVMinSup");		
		$PdVMaxInf=mysql_result($result3,$idx,"PdVMaxInf");		
		$PdVMaxSup=mysql_result($result3,$idx,"PdVMaxSup");		
		$Min = LimiteMini('PdV', $PdVMin, $PdVMax, $PdVMinInf, $PdVMinSup, $PdVMaxInf, $PdVMaxSup );
		$Max = LimiteMaxi('PdV', $PdVMin, $PdVMax, $PdVMinInf, $PdVMinSup, $PdVMaxInf, $PdVMaxSup );
		$PdVMin=$Min; $PdVMax=$Max;

		$AttMinInf=mysql_result($result3,$idx,"AttMinInf");		
		$AttMinSup=mysql_result($result3,$idx,"AttMinSup");		
		$AttMaxInf=mysql_result($result3,$idx,"AttMaxInf");		
		$AttMaxSup=mysql_result($result3,$idx,"AttMaxSup");		
		$Min = LimiteMini('Att', $AttMin, $AttMax, $AttMinInf, $AttMinSup, $AttMaxInf, $AttMaxSup );
		$Max = LimiteMaxi('Att', $AttMin, $AttMax, $AttMinInf, $AttMinSup, $AttMaxInf, $AttMaxSup );
		$AttMin=$Min; $AttMax=$Max;
		
		$EsqMinInf=mysql_result($result3,$idx,"EsqMinInf");		
		$EsqMinSup=mysql_result($result3,$idx,"EsqMinSup");		
		$EsqMaxInf=mysql_result($result3,$idx,"EsqMaxInf");		
		$EsqMaxSup=mysql_result($result3,$idx,"EsqMaxSup");		
		$Min = LimiteMini('Esq', $EsqMin, $EsqMax, $EsqMinInf, $EsqMinSup, $EsqMaxInf, $EsqMaxSup );
		$Max = LimiteMaxi('Esq', $EsqMin, $EsqMax, $EsqMinInf, $EsqMinSup, $EsqMaxInf, $EsqMaxSup );
		$EsqMin=$Min; $EsqMax=$Max;
		
		$DegMinInf=mysql_result($result3,$idx,"DegMinInf");		
		$DegMinSup=mysql_result($result3,$idx,"DegMinSup");		
		$DegMaxInf=mysql_result($result3,$idx,"DegMaxInf");		
		$DegMaxSup=mysql_result($result3,$idx,"DegMaxSup");		
		$Min = LimiteMini('Deg', $DegMin, $DegMax, $DegMinInf, $DegMinSup, $DegMaxInf, $DegMaxSup );
		$Max = LimiteMaxi('Deg', $DegMin, $DegMax, $DegMinInf, $DegMinSup, $DegMaxInf, $DegMaxSup );
		$DegMin=$Min; $DegMax=$Max;
			
		$RegMinInf=mysql_result($result3,$idx,"RegMinInf");		
		$RegMinSup=mysql_result($result3,$idx,"RegMinSup");		
		$RegMaxInf=mysql_result($result3,$idx,"RegMaxInf");		
		$RegMaxSup=mysql_result($result3,$idx,"RegMaxSup");		
		$Min = LimiteMini('Reg', $RegMin, $RegMax, $RegMinInf, $RegMinSup, $RegMaxInf, $RegMaxSup );
		$Max = LimiteMaxi('Reg', $RegMin, $RegMax, $RegMinInf, $RegMinSup, $RegMaxInf, $RegMaxSup );
		$RegMin=$Min; $RegMax=$Max;
		
		$ArmMinInf=mysql_result($result3,$idx,"ArmMinInf");		
		$ArmMinSup=mysql_result($result3,$idx,"ArmMinSup");		
		$ArmMaxInf=mysql_result($result3,$idx,"ArmMaxInf");		
		$ArmMaxSup=mysql_result($result3,$idx,"ArmMaxSup");		
		$Min = LimiteMini('Arm', $ArmMin, $ArmMax, $ArmMinInf, $ArmMinSup, $ArmMaxInf, $ArmMaxSup );
		$Max = LimiteMaxi('Arm', $ArmMin, $ArmMax, $ArmMinInf, $ArmMinSup, $ArmMaxInf, $ArmMaxSup );
		$ArmMin=$Min; $ArmMax=$Max;

		$ArmMagMinInf=mysql_result($result3,$idx,"ArmMagMinInf");		
		$ArmMagMinSup=mysql_result($result3,$idx,"ArmMagMinSup");		
		$ArmMagMaxInf=mysql_result($result3,$idx,"ArmMagMaxInf");		
		$ArmMagMaxSup=mysql_result($result3,$idx,"ArmMagMaxSup");		
		$Min = LimiteMini('ArmMag', $ArmMagMin, $ArmMagMax, $ArmMagMinInf, $ArmMagMinSup, $ArmMagMaxInf, $ArmMagMaxSup );
		$Max = LimiteMaxi('ArmMag', $ArmMagMin, $ArmMagMax, $ArmMagMinInf, $ArmMagMinSup, $ArmMagMaxInf, $ArmMagMaxSup );
		$ArmMagMin=$Min; $ArmMagMax=$Max;		

		$VueMinInf=mysql_result($result3,$idx,"VueMinInf");		
		$VueMinSup=mysql_result($result3,$idx,"VueMinSup");		
		$VueMaxInf=mysql_result($result3,$idx,"VueMaxInf");		
		$VueMaxSup=mysql_result($result3,$idx,"VueMaxSup");		
		$Min = LimiteMini('Vue', $VueMin, $VueMax, $VueMinInf, $VueMinSup, $VueMaxInf, $VueMaxSup );
		$Max = LimiteMaxi('Vue', $VueMin, $VueMax, $VueMinInf, $VueMinSup, $VueMaxInf, $VueMaxSup );
		$VueMin=$Min; $VueMax=$Max;
	
		$MMMinInf=mysql_result($result3,$idx,"MMMinInf");		
		$MMMinSup=mysql_result($result3,$idx,"MMMinSup");		
		$MMMaxInf=mysql_result($result3,$idx,"MMMaxInf");		
		$MMMaxSup=mysql_result($result3,$idx,"MMMaxSup");		
		$Min = LimiteMini('MM', $MMMin, $MMMax, $MMMinInf, $MMMinSup, $MMMaxInf, $MMMaxSup );
		$Max = LimiteMaxi('MM', $MMMin, $MMMax, $MMMinInf, $MMMinSup, $MMMaxInf, $MMMaxSup );
		$MMMin=$Min; $MMMax=$Max;
			
		$RMMinInf=mysql_result($result3,$idx,"RMMinInf");		
		$RMMinSup=mysql_result($result3,$idx,"RMMinSup");		
		$RMMaxInf=mysql_result($result3,$idx,"RMMaxInf");		
		$RMMaxSup=mysql_result($result3,$idx,"RMMaxSup");		
		$Min = LimiteMini('RM', $RMMin, $RMMax, $RMMinInf, $RMMinSup, $RMMaxInf, $RMMaxSup );
		$Max = LimiteMaxi('RM', $RMMin, $RMMax, $RMMinInf, $RMMinSup, $RMMaxInf, $RMMaxSup );
		$RMMin=$Min; $RMMax=$Max;
		
		$DLAMinInf=mysql_result($result3,$idx,"DLAMinInf");		
		$DLAMinSup=mysql_result($result3,$idx,"DLAMinSup");		
		$DLAMaxInf=mysql_result($result3,$idx,"DLAMaxInf");		
		$DLAMaxSup=mysql_result($result3,$idx,"DLAMaxSup");		
		$Min = LimiteMini('DLA', $DLAMin, $DLAMax, $DLAMinInf, $DLAMinSup, $DLAMaxInf, $DLAMaxSup );
		$Max = LimiteMaxi('DLA', $DLAMin, $DLAMax, $DLAMinInf, $DLAMinSup, $DLAMaxInf, $DLAMaxSup );
		$DLAMin=$Min; $DLAMax=$Max;

       	if ($Pouvoir=="") $Pouvoir=mysql_result($result3,$idx,"Pouvoir");
       	if ($nbATT=="") $nbATT=mysql_result($result3,$idx,"nbATT");
       	if ($Vitesse=="") $Vitesse=mysql_result($result3,$idx,"Vitesse");
       	if ($VlC=="") $VlC=mysql_result($result3,$idx,"VlC");
       	if ($AttDist=="") $AttDist=mysql_result($result3,$idx,"AttDist");
       	if ($DLA=="") $DLA=mysql_result($result3,$idx,"DLA"); 
       	if ($Chargement=="") $Chargement=mysql_result($result3,$idx,"Chargement");	
       	if ($CapaRange=="") $CapaRange=mysql_result($result3,$idx,"CapaRange"); 		   
       	if ($AttMag=="") $AttMag=mysql_result($result3,$idx,"AttMag"); 		   
       	if ($Vole=="") $Vole=mysql_result($result3,$idx,"Vole"); 		   
       	if ($SangFroid=="") $SangFroid=mysql_result($result3,$idx,"SangFroid"); 		   
	}

	// Calcul des valeurs moyène
    $NivMoy=($NivMax+$NivMin)/2;   
    $PdVMoy=($PdVMax+$PdVMin)/2;   
    $AttMoy=($AttMax+$AttMin)/2;   
    $EsqMoy=($EsqMax+$EsqMin)/2;   
    $DegMoy=($DegMax+$DegMin)/2;   
    $RegMoy=($RegMax+$RegMin)/2;   
    $ArmMoy=($ArmMax+$ArmMin)/2;   
    $ArmMagMoy=($ArmMagMax+$ArmMagMin)/2;   
    $VueMoy=($VueMax+$VueMin)/2;   
    $MMMoy=($MMMax+$MMMin)/2;   
    $RMMoy=($RMMax+$RMMin)/2;   
    $DLAMoy=($DLAMax+$DLAMin)/2;   


	#var listeTitres = new Array('Niveau', 'Famille', 'Points de Vie', 'Blessure', 'Attaque', 'Esquive', 'Dégâts','Régénération', 'Armure', 'Vue', 'Capacité spéciale', 'Résistance Magique', 'Autres');
		
	#Ex: 2961182;0;3;5;Monstre;10-50 --> [b]30[/b] PV;2-7 --> [b]4.5[/b] D6;2-5 --> [b]3.5[/b] D6;2-7 --> [b]4.5[/b] D3;[b]3[/b] D3;1-6 --> [b]3.5[/b];2-100 --> [b]51[/b] Cases;17-173 --> [b]95[/b];; 80%;-1;0;1;Rapide;;
	#Id, IsCdm, Index, [0]=Level [1]=Famille [2]=PV 'Attaque', 'Esquive', 'Dégâts','Régénération', 'Armure', 'Vue', [9]=RM  [10]=pouvoir [11]=Blessure [12]=VlC, [13]=attDist [14]=nbAtt [15]=Vitesse [16]=Caparange [17]=Equipement
	#Maintenant: affichage du résultat!
    if ($fData==true) {
    	if ($TimeStamp<>"0000-00-00 00:00:00") $isCdm=1; else $isCdm=1;
	    $TimeStamp="le ".substr($TimeStamp, 8,2).'/'.substr($TimeStamp, 5,2).'/'.substr($TimeStamp, 2,2)." à ".substr($TimeStamp, 11,2).":".substr($TimeStamp, 14,2).":".substr($TimeStamp, 17,2);
		if ($NivMin==$NivMax) $Niv="$NivMin"; else if ($NivMax==0) $Niv="$NivMin+"; else $Niv="$NivMin-$NivMax";
		if ($PdVMin==$PdVMax) $PdV="[b]".$PdVMin."[/b] PV"; else if ($PdVMax==0) $PdV="[b]".$PdVMin."[/b]+ "; else $PdV="$PdVMin-$PdVMax --> [b]".$PdVMoy."[/b] PV";
		if ($AttMin==$AttMax) $Att="[b]".$AttMin."[/b] D6"; else if ($AttMax==0) $Att="[b]".$AttMin."[/b] D6+"; else $Att="$AttMin-$AttMax --> [b]".$AttMoy."[/b] D6";
		if ($EsqMin==$EsqMax) $Esq="[b]".$EsqMin."[/b] D6"; else if ($EsqMax==0) $Esq="[b]".$EsqMin."[/b] D6+"; else $Esq="$EsqMin-$EsqMax --> [b]".$EsqMoy."[/b] D6";
		if ($DegMin==$DegMax) $Deg="[b]".$DegMin."[/b] D3"; else if ($DegMax==0) $Deg="[b]".$DegMin."[/b] D3+"; else $Deg="$DegMin-$DegMax --> [b]".$DegMoy."[/b] D3";
		if ($RegMin==$RegMax) $Reg="[b]".$RegMin."[/b] D3"; else if ($RegMax==0) $Reg="[b]".$RegMin."[/b] D3+"; else $Reg="$RegMin-$RegMax --> [b]".$RegMoy."[/b] D3";
		if ($ArmMin==$ArmMax) $Arm="[b]".$ArmMin."[/b]"; else if ($ArmMax==0) $Arm="[b]".$ArmMin."[/b]+"; else $Arm="$ArmMin-$ArmMax --> [b]".$ArmMoy."[/b]";
		if (($ArmMagMin==0)&&($ArmMagMax==0)) $ArmMag=""; else if ($ArmMagMin==$ArmMagMax) $ArmMag="[b]".$ArmMagMin."[/b]"; else if ($ArmMagMax==0) $ArmMag="[b]".$ArmMagMin."[/b]+"; else $ArmMag="$ArmMagMin-$ArmMagMax --> [b]".$ArmMagMoy."[/b]";
		if ($VueMin==$VueMax) $Vue="[b]".$VueMin."[/b] case(s)"; else if ($VueMax==0) $Vue="[b]".$VueMin."[/b] case(s+)"; else $Vue="$VueMin-$VueMax --> [b]".$VueMoy."[/b] case(s)";
		if ($MMMin==$MMMax) {if ($MMMin==0) $MM=""; else $MM="[b]".$MMMin."[/b]";} else if ($MMMax==0) $MM="[b]".$MMMin."[/b]"; else $MM="$MMMin-$MMMax --> [b]".$MMMoy."[/b]";
		if ($RMMin==$RMMax) {if ($RMMin==0) $RM=""; else $RM="[b]".$RMMin."[/b]";} else if ($RMMax==0) $RM="[b]".$RMMin."[/b]"; else $RM="$RMMin-$RMMax --> [b]".$RMMoy."[/b]";
		if ($DLAMin==$DLAMax) {if ($DLAMin==0) $Tour=""; else $Tour="[b]".$DLAMin."[/b]"; }else if ($DLAMax==0) $Tour="[b]".$DLAMin."[/b]+"; else $Tour="$DLAMin-$DLAMax --> [b]".$DLAMoy."[/b]";
		if ($VlC=="Oui") $VlC=1; else if ($VlC=="Non") $VlC=0; else $VlC=-1;
		if ($AttDist=="Oui") $AttDist=1; else if ($AttDist=="Non") $AttDist=0; else $AttDist=-1;
		if ($AttMag=="Oui") $AttMag=1; else if ($AttMag=="Non") $AttMag=0; else $AttMag=-1;
		if ($Vole=="Oui") $Vole=1; else if ($Vole=="Non") $Vole=0; else $Vole=-1;
		
		if ($Blessure!="???") $Blessure="[b]$Blessure %[/b] $TimeStamp";

		if (strpos("*$name[$i]", "Gowap")>0) $Niv=0;   // cas du Gowap
		// MZ Additinnal DATA
		if ($begin<0) {		// =================cas d'une capture d'info hors-vue
			$j=$j+1; 
			print("listeCDM[$Id]=new Array(\"$Niv\",\"$Famille\",\"$PdV\",\"$Att\",\"$Esq\",\"$Deg\",\"$Reg\",\"$Arm\",\"$Vue\",\"$RM\",\"$Pouvoir\",\"$Blessure\",\"$VlC\",\"$AttDist\",\"$nbATT\",\"$Vitesse\",\"$CapaRange\",\"$Chargement\",\"$MM\",\"$DLA\",\"$BonusMalus\",\"$Tour\",\"$ArmMag\",\"$Vole\",\"$SangFroid\",\"$AttMag\",\"\");");	
		} else {
			print("$Id;$isCdm;$j;$Niv;$Famille;$PdV;$Att;$Esq;$Deg;$Reg;$Arm;$Vue;$RM;$Pouvoir;$Blessure;$VlC;$AttDist;$nbATT;$Vitesse;$CapaRange;$Chargement;");
			// ZZ Additinnal DATA: [18]=MM, [19]=DLA, [20]=BonusMalus, [21]=Tour, [22]=ArmMag, [23]=Vole, [24]=SangFroid, [25]=AttMag
			print("$MM;$DLA;$BonusMalus;$Tour;$ArmMag;$Vole;$SangFroid;$AttMag\n");							
		}
    	#if ($begin>0) print("x_monstres[$j].childNodes[2].innerHTML='$Niv'; ");
    } else { #Monstre inconnue dans toute les Tables
        
		if ($begin<0) {		// =================cas d'une capture d'info hors-vue
			$j=$j+1; 
			print("listeCDM[$Id]=new Array(\"0\",\"-\",\"-\",\"-\",\"-\",\"-\",\"-\",\"-\",\"-\",\"-\",\"-\",\"-\",\"-\",\"-\",\"-\",\"-\",\"-\",\"-\",\"-\",\"-\",\"-\",\"-\",\"-\",\"-\",\"-\",\"-\",\"\");");	
		} else {
			print("$Id;0;$j;0;-;-;-;-;-;-;-;-;-;-;-;-;-;-;-;-;");
			// ZZ Additinnal DATA [18]=MM, [19]=DLA, [20]=BonusMalus, [21]=Tour, [22]=ArmMag, [23]=Vole, [24]=SangFroid
			print("-;-;-;-;-;-;-;\n");
		}
	    #print("listeCDM['$Id']= new Array('-','-','-','-','-','-','-','-','-','-','-','???','-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', 0); ");
    	#if ($begin>0) print("x_monstres[$j].childNodes[2].innerHTML='-'; ");
    }
}	
#----------------------------------------------------------------------------------- 
//_sqlTLog();	#Log des consommations de temps SQL et PHP

?>