<?session_cache_limiter("nocache");
#-----------------------------------------------------------------------------------
require("_global.php"); 
require_once("./Config/_sqlconf.php");
require_once("Lib/libcurlemu.inc.php");
$__MAX=32767;


#-----------------------------------------------------------------------------------
#http://localhost/FZZ/mzCdM.php?&TimeStamp=03/07/2012_13:10:46&TiD=28468&cdm=Le%20Monstre%20Cibl%E9%20fait%20partie%20des%20%3A%20Monstre%20%28Gorgone%20%5BAdulte%5D%20-%20N%B04278661%29%0ANiveau%20%3A%20%20Fort%20%28entre%2010%20et%2014%29%0APoints%20de%20Vie%20%3A%20Moyen%20%28entre%2080%20et%20120%29%0ABlessure%20%28Approximatif%29%20%3A%200%20%25%0AD%E9s%20d%27Attaque%20%3A%20Moyen%20%28entre%208%20et%2012%29%0AD%E9s%20d%27Esquive%20%3A%20%20Moyen%20%28entre%209%20et%2013%29%0AD%E9s%20de%20D%E9gat%20%3A%20Moyen%20%28entre%207%20et%2011%29%0AD%E9s%20de%20R%E9g%E9n%E9ration%20%3A%20%20Fort%20%28entre%205%20et%207%29%0AArmure%20%3A%20%20Moyen%20%28entre%207%20et%2011%29%0AVue%20%3A%20Faible%20%28entre%202%20et%206%29%0ACapacit%E9%20sp%E9ciale%20%3A%20%20P%E9trification%20-%20Affecte%20%3A%20Attaque%20%7C%20Esquive%20%7C%20DLA%20%7C%20Dur%E9e%202%20tour%28s%29%0A
#-----------------------------------------------------------------------------------
#$mysql=_sqlconnect();

#-----------------------------------------------------------------------------------
# Pour Debuggage 
#$self=$_SERVER["REQUEST_URI"];
#$refer=$_SERVER["HTTP_REFERER"];
#$fd=fopen("zzcdmurl.txt", "a");
#fputs($fd, "MZ: Self=[$self]\n refer=[$refer]\n");
#fclose($fd);
$debug=false;

#-----------------------------------------------------------------------------------
/*

#-----------------------------------------------------------------------------------
function GROUP_SPLIT($str){
	$exp=@split('#', $str);
	if ($exp[0]<>"") return $exp[0]; else return $exp[1];
}


=============================================================
mise en place initiale du nouveau Bestaire II 
=============================================================
INSERT into MZ_Beast2

 SELECT 
  GROUP_CONCAT(DISTINCT Famille ORDER BY Famille ASC SEPARATOR '#') Famille
 ,Nom, Age
 ,Min(NivMin) as NivMinInf, Max(NivMin) as NivMinSup
 ,MIN(if (NivMax=0, 32767, NivMax)) as NivMaxInf, if(Max(NivMax)=0, 32767, Max(NivMax)) as NivMaxSup
 ,Min(PdVMin) as PdVMinInf, Max(PdVMin) as PdVMinSup
 ,MIN(if (PdVMax=0, 32767, PdVMax)) as PdVMaxInf, if(Max(PdVMax)=0, 32767, Max(PdVMax)) as PdVMaxSup
 ,Min(AttMin) as AttMinInf, Max(AttMin) as AttMinSup
 ,MIN(if (AttMax=0, 32767, AttMax)) as AttMaxInf, if(Max(AttMax)=0, 32767, Max(AttMax)) as AttMaxSup
 ,Min(EsqMin) as EsqMinInf, Max(EsqMin) as EsqMinSup
 ,MIN(if (EsqMax=0, 32767, EsqMax)) as EsqMaxInf, if(Max(EsqMax)=0, 32767, Max(EsqMax)) as EsqMaxSup
 ,Min(DegMin) as DegMinInf, Max(DegMin) as DegMinSup
 ,MIN(if (DegMax=0, 32767, DegMax)) as DegMaxInf, if(Max(DegMax)=0, 32767, Max(DegMax)) as DegMaxSup
 ,Min(RegMin) as RegMinInf, Max(RegMin) as RegMinSup
 ,MIN(if (RegMax=0, 32767, RegMax)) as RegMaxInf, if(Max(RegMax)=0, 32767, Max(RegMax)) as RegMaxSup
 ,Min(ArmMin) as ArmMinInf, Max(ArmMin) as ArmMinSup
 ,MIN(if (ArmMax=0, 32767, ArmMax)) as ArmMaxInf, if(Max(ArmMax)=0, 32767, Max(ArmMax)) as ArmMaxSup
 ,Min(ArmMagMin) as ArmMagMinInf, Max(ArmMagMin) as ArmMagMinSup
 ,MIN(if (ArmMagMax=0, 32767, ArmMagMax)) as ArmMagMaxInf, if(Max(ArmMagMax)=0, 32767, Max(ArmMagMax)) as ArmMagMaxSup
 ,Min(VueMin) as VueMinInf, Max(VueMin) as VueMinSup
 ,MIN(if (VueMax=0, 32767, VueMax)) as VueMaxInf, if(Max(VueMax)=0, 32767, Max(VueMax)) as VueMaxSup
 ,GROUP_CONCAT(DISTINCT Pouvoir ORDER BY Pouvoir ASC SEPARATOR '#') Pouvoir 
 ,Min(MMMin) as MMMinInf, Max(MMMin) as MMMinSup
 ,MIN(if (MMMax=0, 32767, MMMax)) as MMMaxInf, if(Max(MMMax)=0, 32767, Max(MMMax)) as MMMaxSup
 ,Min(RMMin) as RMMinInf, Max(RMMin) as RMMinSup
 ,MIN(if (RMMax=0, 32767, RMMax)) as RMMaxInf, if(Max(RMMax)=0, 32767, Max(RMMax)) as RMMaxSup
 ,GROUP_CONCAT(DISTINCT nbATT ORDER BY TimeStamp ASC SEPARATOR '#') nbATT 
 ,GROUP_CONCAT(DISTINCT Vitesse ORDER BY TimeStamp ASC SEPARATOR '#') Vitesse 
 ,GROUP_CONCAT(DISTINCT VlC ORDER BY TimeStamp ASC SEPARATOR '#') VlC 
 ,GROUP_CONCAT(DISTINCT AttDist ORDER BY TimeStamp ASC SEPARATOR '#') AttDist 
 ,GROUP_CONCAT(DISTINCT AttMag ORDER BY TimeStamp ASC SEPARATOR '#') AttMag 
 ,GROUP_CONCAT(DISTINCT Vole ORDER BY TimeStamp ASC SEPARATOR '#') Vole 
 ,GROUP_CONCAT(DISTINCT SangFroid ORDER BY TimeStamp ASC SEPARATOR '#') SangFroid 
 ,'' as DLA
 ,Min(DLAMin) as DLAMinInf, Max(DLAMin) as DLAMinSup
 ,MIN(if (DLAMax=0, 32767, DLAMax)) as DLAMaxInf, if(Max(DLAMax)=0, 32767, Max(DLAMax)) as DLAMaxSup
 ,'' as Chargement, '' as `Bonus/Malus`
 ,GROUP_CONCAT(DISTINCT CapaRange ORDER BY TimeStamp ASC SEPARATOR '#') CapaRange
 FROM `MZ_CdM` as C WHERE ID>4000000
  GROUP BY Nom, Age;

update `MZ_Beast2` set Pouvoir=if (trim(substring_index(Pouvoir, '#', 1))='' , trim(substring(trim(substring_index(Pouvoir, '#', 2)), 2)), trim(substring_index(Pouvoir, '#', 1)))  WHERE `Pouvoir` LIKE '%#%';
update `MZ_Beast2` set nbAtt =if (trim(substring_index(nbAtt , '#', 1))='' , trim(substring(trim(substring_index(nbAtt , '#', 2)), 2)), trim(substring_index(nbAtt , '#', 1)))  WHERE `nbAtt` LIKE '%#%';
update `MZ_Beast2` set Vitesse =if (trim(substring_index(Vitesse , '#', 1))='' , trim(substring(trim(substring_index(Vitesse , '#', 2)), 2)), trim(substring_index(Vitesse , '#', 1)))  WHERE `Vitesse` LIKE '%#%';
update `MZ_Beast2` set VlC =if (trim(substring_index(VlC , '#', 1))='' , trim(substring(trim(substring_index(VlC , '#', 2)), 2)), trim(substring_index(VlC , '#', 1)))  WHERE `VlC` LIKE '%#%';
update `MZ_Beast2` set AttDist =if (trim(substring_index(AttDist , '#', 1))='' , trim(substring(trim(substring_index(AttDist , '#', 2)), 2)), trim(substring_index(AttDist , '#', 1)))  WHERE `AttDist` LIKE '%#%';
update `MZ_Beast2` set CapaRange =if (trim(substring_index(CapaRange , '#', 1))='' , trim(substring(trim(substring_index(CapaRange , '#', 2)), 2)), trim(substring_index(CapaRange , '#', 1)))  WHERE `CapaRange` LIKE '%#%';
update `MZ_Beast2` set AttMag =if (trim(substring_index(AttMag , '#', 1))='' , trim(substring(trim(substring_index(AttMag , '#', 2)), 2)), trim(substring_index(AttMag , '#', 1)))  WHERE `AttMag` LIKE '%#%';
update `MZ_Beast2` set Vole =if (trim(substring_index(Vole , '#', 1))='' , trim(substring(trim(substring_index(Vole , '#', 2)), 2)), trim(substring_index(Vole , '#', 1)))  WHERE `Vole` LIKE '%#%';
update `MZ_Beast2` set SangFroid =if (trim(substring_index(SangFroid , '#', 1))='' , trim(substring(trim(substring_index(SangFroid , '#', 2)), 2)), trim(substring_index(SangFroid , '#', 1)))  WHERE `SangFroid` LIKE '%#%';

update `MZ_Beast2` set VlC='Oui' where VlC='Ou' or 	VlC='Ou)'; update `MZ_Beast2` set VlC='Non' where VlC='No';
update `MZ_Beast2` set AttDist='Oui' where AttDist='Ou'; update `MZ_Beast2` set AttDist='Non' where AttDist='No';
update `MZ_Beast2` set AttMag='Oui' where AttMag='Ou'; update `MZ_Beast2` set AttMag='Non' where AttMag='No';
update `MZ_Beast2` set Vole='Oui' where Vole='Ou'; update `MZ_Beast2` set Vole='Non' where Vole='No';

*/
#-----------------------------------------------------------------------------------



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
function impMinMax($str, $Min, $Max) {
    $str=substr($str, 0, strpos($str, '('));
	if ($Max==0) {
	    $str.="(supérieur à $Min) "; 
	} else if ($Min==0) {
	    $str.="(inférieur à $Max) "; 
	} else {
	    $str.="(entre $Min et $Max)"; 
	}
    return($str);
} 

#-----------------------------------------------------------------------------------
function extMin($str) {
	$str=trim(substr($str, strpos($str, '(')-strlen($str)));
    if (strpos($str, 'sup')>0) {
      return (substr($str, 13, strlen($str)-14));
	}
    else if (strpos($str, 'inf')>0) {
      return ("0");
	}
	else if (strpos($str, 'gal ')>0) {
      return (substr($str, 8, strlen($str)-9));
	}
	else {
        return (substr($str, 7, strpos($str, "et")-8));   
	}
} 

#-----------------------------------------------------------------------------------
function extMax($str) {
	$str=trim(substr($str, strpos($str, '(')-strlen($str)));
    if (strpos($str, 'inf')>0) {
      return (substr($str, 13, strlen($str)-14));
	}
    else if (strpos($str, 'sup')>0) {
      return ("0");
	}
	else if (strpos($str, 'gal ')>0) {
      return (substr($str, 8, strlen($str)-9));
	}
	else {
        return (substr(substr($str, strpos($str, "et")),3,-1));   
	}	
} 

#-----------------------------------------------------------------------------------
function CheckValue($Var, $cdmVarValue, $VarValue) {	// constante, CdMGroup, CdmBestiaire
	if ($cdmVarValue=="") return "";	// on a pas trouvé mieux
	if (trim($cdmVarValue)<>$VarValue) return "$Var=\"".trim($cdmVarValue)."\",";
}

#-----------------------------------------------------------------------------------
function CheckLimite($Var, $cdmVarMin, $cdmVarMax, $VarMinInf, $VarMinSup, $VarMaxInf, $VarMaxSup ) {	// constante, CdM Min et Max, CdmBestiaire Min&Max et Inf&Sup
	global $__MAX;

 	$set="";
 	if ($cdmVarMin<$VarMinInf) 	$set.=$Var."MinInf=$cdmVarMin, ";
 	if ($cdmVarMin>$VarMinSup) 	$set.=$Var."MinSup=$cdmVarMin, ";
 	if (($cdmVarMax>$VarMaxSup) || (($cdmVarMax>0)&&($VarMaxSup==$__MAX)&&($cdmVarMax!=$__MAX)))	$set.=$Var."MaxSup=$cdmVarMax, ";
 	if (($cdmVarMax<$VarMaxInf) || (($cdmVarMax>0)&&($VarMaxInf==$__MAX)&&($cdmVarMax!=$__MAX)))	$set.=$Var."MaxInf=$cdmVarMax, ";
 	return $set;
}


#-----------------------------------------------------------------------------------
function MAJBestiaire2($cdmFamille,$cdmNom,$cdmAge,$cdmNivMin,$cdmNivMax,$cdmPdVMin,$cdmPdVMax,$cdmBlessure,$cdmAttMin,$cdmAttMax,$cdmEsqMin,$cdmEsqMax,$cdmDegMin,$cdmDegMax,$cdmRegMin,$cdmRegMax,$cdmArmMin,$cdmArmMax,$cdmArmMagMin, $cdmArmMagMax, $cdmVueMin,$cdmVueMax,$cdmPouvoir,$cdmMMMin,$cdmMMMax,$cdmRMMin,$cdmRMMax,$cdmNbAtt,$cdmVitesse,$cdmVlC,$cdmAttDist, $cdmAttMag, $cdmVole, $cdmSangFroid, $cdmDLA,$cdmDLAMin,$cdmDLAMax,$cdmChargement,$cdmBonusMalus,$cdmCapaRange)
{
	global $__MAX;

	# BORNE SUP DU BESTIARE ------------------------------------------------------ 
	if ($cdmNivMax==0) $cdmNivMax=$__MAX;
	if ($cdmPdVMax==0) $cdmPdVMax=$__MAX;
	if ($cdmAttMax==0) $cdmAttMax=$__MAX;
	if ($cdmEsqMax==0) $cdmEsqMax=$__MAX;
	if ($cdmDegMax==0) $cdmDegMax=$__MAX;
	if ($cdmRegMax==0) $cdmRegMax=$__MAX;
	if ($cdmArmMax==0) $cdmArmMax=$__MAX;	
	if ($cdmArmMagMax==0) $cdmArmMagMax=$__MAX;	
	if ($cdmVueMax==0) $cdmVueMax=$__MAX;			
	if ($cdmMMMax==0)  $cdmMMMax=$__MAX;	
	if ($cdmRMMax==0)  $cdmRMMax=$__MAX;	
	if ($cdmDLAMax==0) $cdmDLAMax=$__MAX;	

	
	# Mise à jour du BESTIAIRE ------------------------------------------------------ 
	$query =  "SELECT * FROM `MZ_Beast2` where (Nom=\"$cdmNom\") and (Age=\"$cdmAge\")";     
	//echo "$query<BR>";
	$result = MySQL_QUERY($query);
  	$nData = @MySQL_NUM_ROWS($result);
	if ($nData==0) {
		$query =  "INSERT INTO `MZ_Beast2` VALUES ('$cdmFamille','$cdmNom','$cdmAge',$cdmNivMin,$cdmNivMin,$cdmNivMax,$cdmNivMax,$cdmPdVMin,$cdmPdVMin,$cdmPdVMax,$cdmPdVMax,$cdmAttMin,$cdmAttMin,$cdmAttMax,$cdmAttMax,$cdmEsqMin,$cdmEsqMin,$cdmEsqMax,$cdmEsqMax,$cdmDegMin,$cdmDegMin,$cdmDegMax,$cdmDegMax,$cdmRegMin,$cdmRegMin,$cdmRegMax,$cdmRegMax,$cdmArmMin,$cdmArmMin,$cdmArmMax,$cdmArmMax,$cdmArmMagMin,$cdmArmMagMin,$cdmArmMagMax,$cdmArmMagMax,$cdmVueMin,$cdmVueMin,$cdmVueMax,$cdmVueMax,'$cdmPouvoir',$cdmMMMin,$cdmMMMin,$cdmMMMax,$cdmMMMax,$cdmRMMin,$cdmRMMin,$cdmRMMax,$cdmRMMax,\"$cdmnbATT\",\"$cdmVitesse\",\"$cdmVlC\",\"$cdmAttDist\",\"$cdmAttMag\",\"$cdmVole\",\"$cdmSangFroid\",\"$cdmDLA\",$cdmDLAMin,$cdmDLAMin,$cdmDLAMax,$cdmDLAMax,\"$cdmChargement\",\"$cdmBonusMalus\",\"$cdmCapaRange\" )";
		//echo "$query<BR>";
		$result = MySQL_QUERY($query);
		return;
	}	    

	$query =  "";
	$NivMinInf=mysql_result($result,0,"NivMinInf");		
	$NivMinSup=mysql_result($result,0,"NivMinSup");		
	$NivMaxInf=mysql_result($result,0,"NivMaxInf");		
	$NivMaxSup=mysql_result($result,0,"NivMaxSup");		
	$query .=  CheckLimite('Niv', $cdmNivMin, $cdmNivMax, $NivMinInf, $NivMinSup, $NivMaxInf, $NivMaxSup );

	$PdVMinInf=mysql_result($result,0,"PdVMinInf");		
	$PdVMinSup=mysql_result($result,0,"PdVMinSup");		
	$PdVMaxInf=mysql_result($result,0,"PdVMaxInf");		
	$PdVMaxSup=mysql_result($result,0,"PdVMaxSup");		
	$query .=  CheckLimite('PdV', $cdmPdVMin, $cdmPdVMax, $PdVMinInf, $PdVMinSup, $PdVMaxInf, $PdVMaxSup );
	
	$AttMinInf=mysql_result($result,0,"AttMinInf");		
	$AttMinSup=mysql_result($result,0,"AttMinSup");		
	$AttMaxInf=mysql_result($result,0,"AttMaxInf");		
	$AttMaxSup=mysql_result($result,0,"AttMaxSup");		
	$query .=  CheckLimite('Att', $cdmAttMin, $cdmAttMax, $AttMinInf, $AttMinSup, $AttMaxInf, $AttMaxSup );

	$EsqMinInf=mysql_result($result,0,"EsqMinInf");		
	$EsqMinSup=mysql_result($result,0,"EsqMinSup");		
	$EsqMaxInf=mysql_result($result,0,"EsqMaxInf");		
	$EsqMaxSup=mysql_result($result,0,"EsqMaxSup");		
	$query .=  CheckLimite('Esq', $cdmEsqMin, $cdmEsqMax, $EsqMinInf, $EsqMinSup, $EsqMaxInf, $EsqMaxSup );
	
	$DegMinInf=mysql_result($result,0,"DegMinInf");		
	$DegMinSup=mysql_result($result,0,"DegMinSup");		
	$DegMaxInf=mysql_result($result,0,"DegMaxInf");		
	$DegMaxSup=mysql_result($result,0,"DegMaxSup");		
	$query .=  CheckLimite('Deg', $cdmDegMin, $cdmDegMax, $DegMinInf, $DegMinSup, $DegMaxInf, $DegMaxSup );

	$RegMinInf=mysql_result($result,0,"RegMinInf");		
	$RegMinSup=mysql_result($result,0,"RegMinSup");		
	$RegMaxInf=mysql_result($result,0,"RegMaxInf");		
	$RegMaxSup=mysql_result($result,0,"RegMaxSup");		
	$query .=  CheckLimite('Reg', $cdmRegMin, $cdmRegMax, $RegMinInf, $RegMinSup, $RegMaxInf, $RegMaxSup );

	$ArmMinInf=mysql_result($result,0,"ArmMinInf");		
	$ArmMinSup=mysql_result($result,0,"ArmMinSup");		
	$ArmMaxInf=mysql_result($result,0,"ArmMaxInf");		
	$ArmMaxSup=mysql_result($result,0,"ArmMaxSup");		
	$query .=  CheckLimite('Arm', $cdmArmMin, $cdmArmMax, $ArmMinInf, $ArmMinSup, $ArmMaxInf, $ArmMaxSup );

	$ArmMagMinInf=mysql_result($result,0,"ArmMagMinInf");		
	$ArmMagMinSup=mysql_result($result,0,"ArmMagMinSup");		
	$ArmMagMaxInf=mysql_result($result,0,"ArmMagMaxInf");		
	$ArmMagMaxSup=mysql_result($result,0,"ArmMagMaxSup");		
	$query .=  CheckLimite('ArmMag', $cdmArmMagMin, $cdmArmMagMax, $ArmMagMinInf, $ArmMagMinSup, $ArmMagMaxInf, $ArmMagMaxSup );

	
	$VueMinInf=mysql_result($result,0,"VueMinInf");		
	$VueMinSup=mysql_result($result,0,"VueMinSup");		
	$VueMaxInf=mysql_result($result,0,"VueMaxInf");		
	$VueMaxSup=mysql_result($result,0,"VueMaxSup");		
	$query .=  CheckLimite('Vue', $cdmVueMin, $cdmVueMax, $VueMinInf, $VueMinSup, $VueMaxInf, $VueMaxSup );
		
	$MMMinInf=mysql_result($result,0,"MMMinInf");		
	$MMMinSup=mysql_result($result,0,"MMMinSup");		
	$MMMaxInf=mysql_result($result,0,"MMMaxInf");		
	$MMMaxSup=mysql_result($result,0,"MMMaxSup");		
	$query .=  CheckLimite('MM', $cdmMMMin, $cdmMMMax, $MMMinInf, $MMMinSup, $MMMaxInf, $MMMaxSup );	

	$RMMinInf=mysql_result($result,0,"RMMinInf");		
	$RMMinSup=mysql_result($result,0,"RMMinSup");		
	$RMMaxInf=mysql_result($result,0,"RMMaxInf");		
	$RMMaxSup=mysql_result($result,0,"RMMaxSup");		
	$query .=  CheckLimite('RM', $cdmRMMin, $cdmRMMax, $RMMinInf, $RMMinSup, $RMMaxInf, $RMMaxSup );	
	
	$DLAMinInf=mysql_result($result,0,"DLAMinInf");		
	$DLAMinSup=mysql_result($result,0,"DLAMinSup");		
	$DLAMaxInf=mysql_result($result,0,"DLAMaxInf");		
	$DLAMaxSup=mysql_result($result,0,"DLAMaxSup");		
	$query .=  CheckLimite('DLA', $cdmDLAMin, $cdmDLAMax, $DLAMinInf, $DLAMinSup, $DLAMaxInf, $DLAMaxSup );
			
    $query .=  CheckValue('Pouvoir',$cdmPouvoir, mysql_result($result,0,"Pouvoir"));
    $query .=  CheckValue('nbATT',$cdmNbAtt, mysql_result($result,0,"nbATT"));
    $query .=  CheckValue('Vitesse',$cdmVitesse,  mysql_result($result,0,"Vitesse"));
    $query .=  CheckValue('VlC',$cdmVlC,  mysql_result($result,0,"VlC"));
    $query .=  CheckValue('AttDist',$cdmAttDist,  mysql_result($result,0,"AttDist"));
    $query .=  CheckValue('AttMag',$cdmAttMag,  mysql_result($result,0,"AttMag"));
    $query .=  CheckValue('Vole',$cdmVole,  mysql_result($result,0,"Vole"));
    $query .=  CheckValue('SangFroid',$cdmSangFroid,  mysql_result($result,0,"SangFroid"));
    $query .=  CheckValue('CapaRange',$cdmCapaRange,  mysql_result($result,0,"CapaRange"));	

	if ($query!="") {			
		$query =  "UPDATE `MZ_Beast2` SET $query Age=\"$cdmAge\" where (Nom=\"$cdmNom\") and (Age=\"$cdmAge\")";
		//echo "$query<BR>";
		$result = MySQL_QUERY($query); 		
	}
	
	return;								
}	// Fin MAJ Bestiaire


#-----------------------------------------------------------------------------------
#Main
#-----------------------------------------------------------------------------------
$cdm="";
if ($cdm=="") { //contournement variable trop longue sur ironie
	$cdm=substr($_SERVER["QUERY_STRING"], strpos($_SERVER["QUERY_STRING"], "cdm")+4);
	if (strpos($cdm, "&")>0) $cdm=substr($cdm, 0, strpos($cdm, "&"));	
}
   
If (!isset($TiD)) { Die("// Données imcomplètes (TiD)!"); }
If (!isset($cdm)) { Die("// Données imcomplètes (cdm)!"); }
//If (!isset($cdme)) { Die("// Données imcomplètes (cdme)!"); }


#-----------------------------------------------------------------------------------
# Décodage de la trame reçu
$cdm=str_replace("\'", "'", urldecode($cdm.$cdme));
$eCdm=preg_split( "/\n|:/", $cdm);
//print_r ($eCdm) ;
$pos1=strpos($eCdm[1], '(');
$pos2=strpos($eCdm[1], '[');
$pos3=strpos($eCdm[1], ']');
$pos4=strpos($eCdm[1], '°');

$cdmFamille=trim(substr($eCdm[1],0, $pos1));
$cdmNom=trim(substr($eCdm[1],$pos1+1, $pos2-$pos1-1));
$cdmAge=trim(substr($eCdm[1],$pos2+1, $pos3-$pos2-1));
$cdmID=trim(substr($eCdm[1],$pos4+1, strlen($eCdm[1])-$pos4-2));
$cdmNivMin=extMin($eCdm[3]);
$cdmNivMax=extMax($eCdm[3]);
$cdmPdVMin=extMin($eCdm[5]);
$cdmPdVMax=extMax($eCdm[5]);
$cdmBlessure=trim(substr(trim($eCdm[7]), 0, -1));

# Default values
$cdmAttMin=0; $cdmAttMax=0; $cdmEsqMin=0; $cdmEsqMax=0; $cdmDegMin=0; $cdmDegMax=0; $cdmRegMin=0; $cdmRegMax=0; $cdmArmMin=0; $cdmArmMax=0; $cdmVueMin=0; $cdmVueMax=0;
$cdmPouvoir=""; $cdmMMMin=0; $cdmMMMax=0; $cdmRMMin=0; $cdmRMMax=0; $cdmNbAtt=""; $cdmVitesse="";  $cdmVlC="";  $cdmAttDist=""; $cdmDLA="";  $cdmDLAMin=0; $cdmDLAMax=0; $cdmChargement="";  $cdmBonusMalus="";  $cdmCapaRange=""; 
$cdmSangFroid=""; $cdmVole=""; $cdmAttMag=""; $cdmArmPhyMin=0; $cdmArmPhyMax=0; $cdmArmMagMin=0; $cdmArmMagMax=0;

## Suivant les CdM1, 2, 3 et 4 les champs sont présents ou manquants
for ($i=8; $i<(sizeof($eCdm)-1); $i=$i+2) {

 	//echo $eCdm[$i]."<br>";
 	
	if ($eCdm[$i]=="Dés d'Attaque ") { $cdmAttMin=extMin($eCdm[$i+1]); $cdmAttMax=extMax($eCdm[$i+1]); }
 	if ($eCdm[$i]=="Dés d'Esquive ") { $cdmEsqMin=extMin($eCdm[$i+1]); $cdmEsqMax=extMax($eCdm[$i+1]); }
 	if ($eCdm[$i]=="Dés de Dégat ") { $cdmDegMin=extMin($eCdm[$i+1]); $cdmDegMax=extMax($eCdm[$i+1]); }
 	if ($eCdm[$i]=="Dés de Dégât ") { $cdmDegMin=extMin($eCdm[$i+1]); $cdmDegMax=extMax($eCdm[$i+1]); }
 	if ($eCdm[$i]=="Dés de Régénération ") { $cdmRegMin=extMin($eCdm[$i+1]); $cdmRegMax=extMax($eCdm[$i+1]); }
 	if ($eCdm[$i]=="Dés de Régén. ") { $cdmRegMin=extMin($eCdm[$i+1]); $cdmRegMax=extMax($eCdm[$i+1]); }
 	if ($eCdm[$i]=="Armure ") {  $cdmArmMin=extMin($eCdm[$i+1]);	$cdmArmMax=extMax($eCdm[$i+1]); }
 	if ($eCdm[$i]=="Armure Physique ") { $cdmArmPhyMin=extMin($eCdm[$i+1]);	$cdmArmPhyMax=extMax($eCdm[$i+1]); }
 	if ($eCdm[$i]=="Armure Magique ") { $cdmArmMagMin=extMin($eCdm[$i+1]);	$cdmArmMagMax=extMax($eCdm[$i+1]); }
  	if ($eCdm[$i]=="Vue ") { $cdmVueMin=extMin($eCdm[$i+1]); $cdmVueMax=extMax($eCdm[$i+1]); }
	if ($eCdm[$i]=="Capacité spéciale ") { $cdmPouvoir=trim($eCdm[$i+1].':'.$eCdm[$i+2]);  $i=$i+1;} //$eCdm.=$eCdm[$i].': '.$eCdm[$i+1].":".$eCdm[$i+2]."\n";
	if ($eCdm[$i]=="Maitrise Magique ") { $cdmMMMin=extMin($eCdm[$i+1]); $cdmMMMax=extMax($eCdm[$i+1]); }
	if ($eCdm[$i]=="Résistance Magique ") { $cdmRMMin=extMin($eCdm[$i+1]); $cdmRMMax=extMax($eCdm[$i+1]); }
	if ($eCdm[$i]=="Nombre d'attaques ") { $cdmNbAtt=trim($eCdm[$i+1]); }
	if ($eCdm[$i]=="Vitesse de Déplacement ") { $cdmVitesse=trim($eCdm[$i+1]); }
	if ($eCdm[$i]=="Voir le Caché ") { $cdmVlC=trim($eCdm[$i+1]); }
	if ($eCdm[$i]=="Attaque à distance ") { $cdmAttDist=trim($eCdm[$i+1]); }
	if ($eCdm[$i]=="DLA ") { $cdmDLA=trim($eCdm[$i+1]); }
	if ($eCdm[$i]=="Durée Tour ") { $cdmDLAMin=extMin($eCdm[$i+1]); $cdmDLAMax=extMax($eCdm[$i+1]); }
	if ($eCdm[$i]=="Chargement ") { $cdmChargement=trim($eCdm[$i+1]); }
	if ($eCdm[$i]=="Bonus Malus ") { $cdmBonusMalus=trim($eCdm[$i+1]); }
	if ($eCdm[$i]=="Portée du Pouvoir ") { $cdmCapaRange=trim($eCdm[$i+1]); }
	if ($eCdm[$i]=="Attaque magique ") { $cdmAttMag=trim($eCdm[$i+1]); }
	if ($eCdm[$i]=="Vole ") { $cdmVole=trim($eCdm[$i+1]); }
	if ($eCdm[$i]=="Sang froid ") { $cdmSangFroid=trim($eCdm[$i+1]); }

}

// mise à jour de l'armure si on a l'armure physique la magique!
//if (($cdmArmMin==0) && (($cdmArmPhyMin+$cdmArmMagMin)>0)) $cdmArmMin=$cdmArmPhyMin+$cdmArmMagMin;
//if (($cdmArmMax==0) && (($cdmArmPhyMax+$cdmArmMagMax)>0)) $cdmArmMax=$cdmArmPhyMax+$cdmArmMagMax;
if (($cdmArmMin==0) && ($cdmArmPhyMin>0)) $cdmArmMin=$cdmArmPhyMin;
if (($cdmArmMax==0) && ($cdmArmPhyMax>0)) $cdmArmMax=$cdmArmPhyMax;


If (!isset($TimeStamp)) $TimeStamp=date("Y-m-d H:i:s"); else $TimeStamp=_StringToDate($TimeStamp);

if ($debug) print("<BR>
    * Famille : [$cdmFamille]<BR>
    * Nom : [$cdmNom]<BR>
    * Age : [$cdmAge]<BR>
    * ID dans Mountyhall : [$cdmID]<BR>
    * niveau minimum : [$cdmNivMin]<BR>
    * niveau maximum : [$cdmNivMax]<BR>
    * PDV minimum : [$cdmPdVMin]<BR>
    * PDV maximum : [$cdmPdVMax]<BR>
    * Blessure en % : [$cdmBlessure]<BR>
    * Attaque minimum :  [$cdmAttMin]<BR>
    * Attaque maximum : [$cdmAttMax]<BR>
    * Esquive minimum :  [$cdmEsqMin]<BR>
    * Esquive maximum :  [$cdmEsqMax]<BR>
    * Dégats minimum :  [$cdmDegMin]<BR>
    * Dégats maximum :  [$cdmDegMax]<BR>
    * Régénération minimum :  [$cdmRegMin]<BR>
    * Régénération maximum :  [$cdmRegMax]<BR>
    * Armure minimum :  [$cdmArmMin]<BR>
    * Armure maximum :  [$cdmArmMax]<BR>
    * Vue minimum :  [$cdmVueMin]<BR>
    * Vue maximum :  [$cdmVueMax]<BR>
    * Type de pouvoir : [$cdmPouvoir]<BR>

    * Maitrise Magique Min : [$cdmMMMin]<BR>
    * Maitrise Magique Max : [$cdmMMMax]<BR>
    * Résistance Magique Min : [$cdmRMMin]<BR>
    * Résistance Magique Max : [$cdmRMMax]<BR>
    * Nombre d'attaques : [$cdmNbAtt]<BR>
    * Vitesse de Déplacement : [$cdmVitesse]<BR>
    * Voir le Caché : [$cdmVlC]<BR>
    * Attaque à distance : [$cdmAttDist]<BR>
    * Attaque magique : [$cdmAttMag]<BR>
    * Vole : [$cdmVole]<BR>
    * Sang froid : [$cdmSangFroid]<BR>	    
    * DLA : [$cdmDLA]<BR>	
    * Durée DLA minimum :  [$cdmDLAMin]<BR>
    * Durée DLA maximum :  [$cdmDLAMax]<BR>		    
    * Chargement : [$cdmChargement]<BR>		   	   
    * Bonus Malus : [$cdmBonusMalus]<BR>		   
    * Portée du Pouvoir : [$cdmCapaRange]<BR>		   	

");


#-----------------------------------------------------------------------------------
# Dans le CdM collector (pour les events)
if ($cdmID!="") {

	$mysql=_sqlconnect();	# -------------- Ouverture DB  
	
	// On vérifie que la CdM n'est pas déjà saisi
	$query =  "select distinct TimeStamp from `MZ_CdM` where TiD=$TiD and Famille=\"$cdmFamille\" and Nom=\"$cdmNom\" and Age=\"$cdmAge\" and ID=$cdmID and NivMin=$cdmNivMin and NivMax=$cdmNivMax and PdVMin=$cdmPdVMin and PdVMax=$cdmPdVMax and Blessure=$cdmBlessure and AttMin=$cdmAttMin and AttMax=$cdmAttMax and EsqMin=$cdmEsqMin and EsqMax=$cdmEsqMax and DegMin=$cdmDegMin and DegMax=$cdmDegMax and RegMin=$cdmRegMin and RegMax=$cdmRegMax and ArmMin=$cdmArmMin and ArmMax=$cdmArmMax and VueMin=$cdmVueMin and VueMax=$cdmVueMax and MMMin=$cdmMMMin and MMMAx=$cdmMMMax and RMMin=$cdmRMMin and RMMax=$cdmRMMax and nbATT=\"$cdmNbAtt\" and Vitesse=\"$cdmVitesse\" and Vlc=\"$cdmVlC\" and AttDist=\"$cdmAttDist\" and DLA=\"$cdmDLA\" and DLAMin=$cdmDLAMin and DLAMax=$cdmDLAMax and Chargement=\"$cdmChargement\" and `Bonus/Malus`=\"$cdmBonusMalus\" and CapaRange=\"$cdmCapaRange\"";
	//echo "$query<BR>";
	$result = MySQL_QUERY($query);
	$n=@MySQL_NUM_ROWS($result);
	if ($debug) $n=0;	// pour débug, on force l'ajout dans la base.
  	for ($i=0; $i<$n; $i++) {
  		$CdmStamp=mysql_result($result,$i,"TimeStamp"); 
  		if (abs(strtotime($CdmStamp)-strtotime($TimeStamp))<15) die("delBoutonBestiaire(); setDBMsgZZ('CdM déjà dans la DB de ZoryaZilla!'); ");		// à 15 seconde près (différence entre date MH et capture de la page
	}
  	
	//$query =  "INSERT INTO `MZ_CdM` Values('$TimeStamp',$TiD, \"$cdmFamille\",\"$cdmNom\",\"$cdmAge\",$cdmID,$cdmNivMin,$cdmNivMax,$cdmPdVMin,$cdmPdVMax,$cdmBlessure,$cdmAttMin,$cdmAttMax,$cdmEsqMin,$cdmEsqMax,$cdmDegMin,$cdmDegMax,$cdmRegMin,$cdmRegMax,$cdmArmMin,$cdmArmMax,$cdmVueMin,$cdmVueMax, \"$cdmPouvoir\", $cdmMMMin, $cdmMMMax, $cdmRMMin, $cdmRMMax, \"$cdmNbAtt\", \"$cdmVitesse\", \"$cdmVlC\", \"$cdmAttDist\", \"$cdmDLA\", $cdmDLAMin, $cdmDLAMax,\"$cdmChargement\", \"$cdmBonusMalus\", \"$cdmCapaRange\")";
	$query =  "INSERT INTO `MZ_CdM` Values('$TimeStamp',$TiD, \"$cdmFamille\",\"$cdmNom\",\"$cdmAge\",$cdmID,$cdmNivMin,$cdmNivMax,$cdmPdVMin,$cdmPdVMax,$cdmBlessure,$cdmAttMin,$cdmAttMax,$cdmEsqMin,$cdmEsqMax,$cdmDegMin,$cdmDegMax,$cdmRegMin,$cdmRegMax,$cdmArmMin,$cdmArmMax,$cdmArmMagMin,$cdmArmMagMax,$cdmVueMin,$cdmVueMax, \"$cdmPouvoir\", $cdmMMMin, $cdmMMMax, $cdmRMMin, $cdmRMMax, \"$cdmNbAtt\", \"$cdmVitesse\", \"$cdmVlC\", \"$cdmAttDist\", \"$cdmAttMag\", \"$cdmVole\", \"$cdmSangFroid\", \"$cdmDLA\", $cdmDLAMin, $cdmDLAMax,\"$cdmChargement\", \"$cdmBonusMalus\", \"$cdmCapaRange\")";
	//echo "$query<BR>";
	$result = MySQL_QUERY($query);
	$query =  "INSERT INTO `MZ_CdMLIVE` Values('$TimeStamp',$TiD, \"$cdmFamille\",\"$cdmNom\",\"$cdmAge\",$cdmID,$cdmNivMin,$cdmNivMax,$cdmPdVMin,$cdmPdVMax,$cdmBlessure,$cdmAttMin,$cdmAttMax,$cdmEsqMin,$cdmEsqMax,$cdmDegMin,$cdmDegMax,$cdmRegMin,$cdmRegMax,$cdmArmMin,$cdmArmMax,$cdmArmMagMin,$cdmArmMagMax,$cdmVueMin,$cdmVueMax, \"$cdmPouvoir\", $cdmMMMin, $cdmMMMax, $cdmRMMin, $cdmRMMax, \"$cdmNbAtt\", \"$cdmVitesse\", \"$cdmVlC\", \"$cdmAttDist\", \"$cdmAttMag\", \"$cdmVole\", \"$cdmSangFroid\", \"$cdmDLA\", $cdmDLAMin, $cdmDLAMax,\"$cdmChargement\", \"$cdmBonusMalus\", \"$cdmCapaRange\")";
	//echo "$query<BR>";
	$result = MySQL_QUERY($query);

	//MAJBestiaire($cdmNom, $cdmAge);			// mise à jour du bestaire pour un monstre du même type!
	// Bestiaire version 2 avec les monstre id 4000000+  
	if ($cdmID>4000000)	MAJBestiaire2($cdmFamille,$cdmNom,$cdmAge,$cdmNivMin,$cdmNivMax,$cdmPdVMin,$cdmPdVMax,$cdmBlessure,$cdmAttMin,$cdmAttMax,$cdmEsqMin,$cdmEsqMax,$cdmDegMin,$cdmDegMax,$cdmRegMin,$cdmRegMax,$cdmArmMin,$cdmArmMax,$cdmArmMagMin, $cdmArmMagMax, $cdmVueMin,$cdmVueMax,$cdmPouvoir,$cdmMMMin,$cdmMMMax,$cdmRMMin,$cdmRMMax,$cdmNbAtt,$cdmVitesse,$cdmVlC,$cdmAttDist, $cdmAttMag, $cdmVole, $cdmSangFroid, $cdmDLA,$cdmDLAMin,$cdmDLAMax,$cdmChargement,$cdmBonusMalus,$cdmCapaRange);

	_sqlclose();		# -------------- Fermeture DB  


	#----------------------------------------------------------------------------
	# Auto-emission de la CdM dans le Collector Mouthypedia
	#----------------------------------------------------------------------------
	$bles1=strpos($cdm, "(Approximatif)");
	$bles2=strpos($cdm, "%");
	if (($bles1>0) && ($bles2>0)) {$bles1+=17; $cdm=substr($cdm, 0,$bles1)."XX".substr($cdm, $bles2-strlen($cdm)-1); }
	$aCdm=urlencode($cdm);  
	$mhbase="http://games.mountyhall.com/mountyhall/MH_Play/Actions/Competences/Play_a_Competence16b.php";
	$curl="http://mountypedia.free.fr/mz/cdmdispatcher.php?cdm=$aCdm";
	
	//echo "[$curl]";
	@$ch = curl_init();
	@curl_setopt($ch, CURLOPT_URL, $curl);
	@curl_setopt($ch, CURLOPT_USERAGENT, "ZZCdmBot : Fusion ZoryaZilla CdM Bot");
	@curl_setopt($ch, CURLOPT_REFERER, $mhbase);
	@curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
	if (!$debug) $result = @curl_exec ($ch); else $result='Merci';		// en debug on n'envoi pas dnas le collector pour ne pas le poluer
	if (strpos("+$result", 'Merci')>0) echo "delBoutonBestiaire(); ";
	@curl_close ($ch);
	//echo "[$result]";


	echo "setDBMsgZZ('CdM envoyée dans la DB de ZoryaZilla!'); ";

}

//_sqlTLog();	#Log des consommations de temps SQL et PHP

?>
