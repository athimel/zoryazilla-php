<?
session_cache_limiter("nocache");
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1		pour empecher la mise en cache (cache trop important avec ironie ou FF8) !!!
header('Content-Type: text/html; charset=iso-8859-1'); 		// pour les caractère accentué
#header('<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">'); 		// pour les caractère accentué

session_start();
require("_global.php");
require_once("./Config/_sqlconf.php");

//$Monstres=html_entity_decode($Monstres, ENT_NOQUOTES, 'ISO-8859-1');
$Monstres=utf8_decode($Monstres);
$Trolls=utf8_decode($Trolls);
$Tresors=utf8_decode($Tresors);
$Champis=utf8_decode($Champis);
$Lieux=utf8_decode($Lieux);
#echo "<br>ZZ Vue:<br> $Vue";
#echo "<br>ZZ Montres:<br> $Monstres";
#echo "<br>ZZ Trolls:<br> $Trolls";
#echo "<br>ZZ Tresors:<br> $Tresors";
#echo "<br>ZZ Champis:<br> $Champis";
#echo "<br>ZZ Lieux:<br> $Lieux";
#echo "<br>";
#-----------------------------------------------------------------------------------
if (!empty($_SESSION['login'])) { #Recupération de l'ID de Session
	$ZZ_TID=$_SESSION['login'] ;
}
#if ($num!=$ZZ_TID) {
#  $_SESSION['login']="";
#  die();	//tentative de corruption
#}

#http://localhost/FZZ/mzVision.php?Monstres=2956673;Zombie%20[Ancien];39;56;-41;|2830345;Zombie%20[Antique];39;56;-41;|&Trolls=69714;stf;24;Skrim;36;58;-41;|98601;tejeu;21;Durakuir;38;58;-41;|&Tresors=7932698;%20Potion;39;54;-42;|7952599;%2025%20centaines%20de%20Gigots%20de%20Gob%27;39;54;-42;|&Champis=&Lieux=12096;Sortie%20de%20Portail;40;50;-36;|1964260;Portail%20de%20T%E9l%E9portation;43;54;-48;|

#================= Gestion du flux si les données sont celles de la vue!

$sepLine=chr(28);
$sepField=chr(29);
$TimeStamp=date("Y-m-d H:i:s"); 
$TiD=$ZZ_TID; if (($TiD=="") || ($TiD<=0)) {
	if ($flow<>"")
		die("");		//interrompe le flux!!
	else 
		die("Vous n'êtes pas connecté à ZZ!");		// troll pas loggé à ZZ
}


$mysql=_sqlconnect();	# -------------- Ouverture DB  

if ($flow<>"") {	
 	$TypeVue="VTMP";
	if ($VueId==0) { // initier la transaction avec le gestionnaire de vue!
		$query =  "DELETE FROM `MZ_Vue` WHERE TiD=$TiD and TypeVue='VTMP' ";		// On commence par faire du ménage!
		//echo "$query<BR>";     
		$result = MySQL_QUERY($query);    

		$query =  "SELECT max(VueId) VueId FROM `MZ_VueManager` WHERE TiD=$TiD ";
		//echo "$query<BR>";     
		$result = MySQL_QUERY($query);    
		if (@MySQL_NUM_ROWS($result)==1) $VueId=mysql_result($result,0,"VueId")+1; else $VueId=1;
	} else if ($flow=="END") {
	 	$TypeVue="VUE";
		$tab_vue=explode($sepField, $Vue); 
		$query =  "INSERT INTO `MZ_VueManager` values($TiD, $VueId, \"$TimeStamp\", \"$TypeVue\", $tab_vue[0], $tab_vue[1], $tab_vue[2], $tab_vue[3], $tab_vue[4] )";
		//echo "$query<BR>";     
		$result = MySQL_QUERY($query);    

		$query =  "UPDATE `MZ_Vue` SET TypeVue='VUE' WHERE TiD=$TiD and VueId=$VueId and TypeVue='VTMP' ";		// On commence par faire du ménage!
		//echo "$query<BR>";     
		$result = MySQL_QUERY($query);  

		$query = "SELECT count(VueId) nbVue FROM `MZ_VueManager` WHERE TiD=$TiD and TypeVue='VUE' ";	// max 3 vue en stocks
		//echo "$query<BR>";     
		$result = MySQL_QUERY($query);  
		if (@MySQL_NUM_ROWS($result)==1) $nbVue=mysql_result($result,0,"nbVue");
		if ($nbVue>3) {		// dabord menage de la vue la plus ancienne aux même coordonées, sinon, de la vue la plus ancienne !

			$query =  "SELECT VueId FROM `MZ_VueManager` WHERE TiD=$TiD and TypeVue='VUE' and PosX='$tab_vue[0]' and PosY='$tab_vue[1]' and PosN='$tab_vue[2]' order by TimeStamp ";	// du plus vieux au plus récent
			//echo "$query<BR>";     
			$result = MySQL_QUERY($query);    
			if (@MySQL_NUM_ROWS($result)>=1) {
 				$vId=mysql_result($result,0,"VueId");
				$query =  "DELETE FROM `MZ_Vue` WHERE TiD=$TiD and VueId=$vId and TypeVue='VUE' and PosX='$tab_vue[0]' and PosY='$tab_vue[1]' and PosN='$tab_vue[2]' ";		// menage de la vue la plus ancienne à la même position
				//echo "$query<BR>";     
				$result = MySQL_QUERY($query);    

				$query =  "DELETE FROM `MZ_VueManager` WHERE TiD=$TiD and VueId=$vId and TypeVue='VUE' ";		// menage de la vue la plus ancienne
				//echo "$query<BR>";     
				$result = MySQL_QUERY($query);    
			} else {					
				$query =  "SELECT VueId FROM `MZ_VueManager` WHERE TiD=$TiD and TypeVue='VUE' order by TimeStamp ";		// du plus vieux au plus récent
				//echo "$query<BR>";     
				$result = MySQL_QUERY($query);    
				if (@MySQL_NUM_ROWS($result)>=1) {
	 				$vId=mysql_result($result,0,"VueId");
					$query =  "DELETE FROM `MZ_Vue` WHERE TiD=$TiD and VueId=$vId and TypeVue='VUE' ";		// menage de la vue la plus ancienne
					//echo "$query<BR>";     
					$result = MySQL_QUERY($query);    
	
					$query =  "DELETE FROM `MZ_VueManager` WHERE TiD=$TiD and VueId=$vId and TypeVue='VUE' ";		// menage de la vue la plus ancienne
					//echo "$query<BR>";     
					$result = MySQL_QUERY($query);    
				}
			}
 		}
 	}
} else {
 	if (($TypeVue<>"VL") && ($TypeVue<>"VLC")) $TypeVue="VL";		// si mauvais paramètrage alors VL par défaut
	$query =  "SELECT max(VueId) VueId FROM `MZ_VueManager` WHERE TiD=$TiD ";
	//echo "$query<BR>";     
	$result = MySQL_QUERY($query);    
	if (@MySQL_NUM_ROWS($result)==1) $VueId=mysql_result($result,0,"VueId")+1; else $VueId=1;

	$tab_vue=explode($sepField, $Vue); 
	$query =  "INSERT INTO `MZ_VueManager` values($TiD, $VueId, \"$TimeStamp\", \"$TypeVue\", $tab_vue[0], $tab_vue[1], $tab_vue[2], $tab_vue[3], $tab_vue[4] )";
	//echo "$query<BR>";     
	$result = MySQL_QUERY($query);    
}

$tab_monstres=explode($sepLine, $Monstres); 
foreach ($tab_monstres as $l_monstre) if ($l_monstre<>"") { 
	$t_monstre=explode($sepField, $l_monstre); 
	if (strpos($t_monstre[1], '[')>1) {
		$nom=trim(substr($t_monstre[1], 0, strpos($t_monstre[1], '[')-1)) ; 
		$age=trim(substr($t_monstre[1], strpos($t_monstre[1], '[')+1, strpos($t_monstre[1], ']')-strpos($t_monstre[1], '[')-1)) ; 
	} else {
		$nom=trim($t_monstre[1]) ; 
		$age=""; 
	}
	$query =  "INSERT INTO `MZ_Vue` values($TiD, $VueId, \"$TimeStamp\", \"$TypeVue\", 1, $t_monstre[0],\"$nom\",\"$age\",\"\",$t_monstre[2],$t_monstre[3],$t_monstre[4])";
    //echo "$query\n";     
    $result = MySQL_QUERY($query);    
}

$tab_trolls=explode($sepLine, $Trolls); 
foreach ($tab_trolls as $l_troll) if ($l_troll<>"") { 
	$t_troll=explode($sepField, $l_troll); 
    $query =  "INSERT INTO `MZ_Vue` values($TiD, $VueId, \"$TimeStamp\", \"$TypeVue\", 2, $t_troll[0],\"$t_troll[1]\",\"$t_troll[3]\",$t_troll[2],$t_troll[4],$t_troll[5],$t_troll[6])";
    //echo "$query<BR>";     
    $result = MySQL_QUERY($query);    
}

$tab_tresors=explode($sepLine, $Tresors); 
foreach ($tab_tresors as $l_tresor) if ($l_tresor<>"") { 
	$t_tresor=explode($sepField, $l_tresor); 
    $query =  "INSERT INTO `MZ_Vue` values($TiD, $VueId, \"$TimeStamp\", \"$TypeVue\", 3, $t_tresor[0],\"$t_tresor[1]\",\"\",\"\",$t_tresor[2],$t_tresor[3],$t_tresor[4])";
    //echo "$query<BR>";     
    $result = MySQL_QUERY($query);    
}

$tab_champis=explode($sepLine, $Champis); 
foreach ($tab_champis as $l_champi) if ($l_champi<>"") { 
	$t_champi=explode($sepField, $l_champi); 
    $query =  "INSERT INTO `MZ_Vue` values($TiD, $VueId, \"$TimeStamp\", \"$TypeVue\", 4, $t_champi[0],\"$t_champi[1]\",\"\",\"\",$t_champi[2],$t_champi[3],$t_champi[4])";
    //echo "$query<BR>";     
    $result = MySQL_QUERY($query);    
}

$tab_lieux=explode($sepLine, $Lieux); 
foreach ($tab_lieux as $l_lieu) if ($l_lieu<>"") { 
	$t_lieu=explode($sepField, $l_lieu); 
    $query =  "INSERT INTO `MZ_Vue` values($TiD, $VueId, \"$TimeStamp\", \"$TypeVue\", 5, $t_lieu[0],\"$t_lieu[1]\",\"\",\"\",$t_lieu[2],$t_lieu[3],$t_lieu[4])";
    //echo "$query<BR>";     
    $result = MySQL_QUERY($query);    

	if (strpos(strtolower($t_lieu[1]), "portail")!==false) {	// vue etendu  (conservation de ces élements plus longtemps!!!)
	    $query =  "INSERT INTO `MZ_Vue_ext` values($TiD, $VueId, \"$TimeStamp\", \"$TypeVue\", 5, $t_lieu[0],\"$t_lieu[1]\",\"\",\"\",$t_lieu[2],$t_lieu[3],$t_lieu[4])";
    	//echo "$query<BR>";     
	    $result = MySQL_QUERY($query);    
	}
}

_sqlclose();		# -------------- Fermeture DB  


if ($flow=="END") 
	die();
else if ($flow<>"") 
	die("$VueId");
else
	echo "Vision Lontaine envoyée dans la DB de ZoryaZilla!";

?>