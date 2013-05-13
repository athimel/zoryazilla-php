<?php
require("_def_fusion.php");

function convertScript($file) {

	global $fusion_replace;	
	global $fusion_remove_func;		
	
	$script_name=$file;
	printf("Converting: ".$script_name."<br>");

	// tableau de control de la conversion du script
	$arr_check_replace=$fusion_replace["$file"];
	$arr_check_remove=$fusion_remove_func["$file"];

		
	// ============================================================== ouverture du fichier fusionné
	$fdd=fopen("FZ/$script_name", "w+");
	
	// ============================================================== Fusion du  PRE code
	if (file_exists("ZZ/$file.PRE")) {
		$fds=fopen("ZZ/$file.PRE", 'r');
    	while(!feof($fds)) {
			$buffer=fgets($fds);
			fputs($fdd, $buffer);
		}
		fclose($fds);
	}
	
	// ============================================================== Traitement du code
	$garbaging=false;
	$bracket=0;
	$fds=fopen("MZ/$script_name", 'r');
    while(!feof($fds)) {
		$buffer=fgets($fds);
		//echo "$buffer<br>";

		// ====================== traitement des supressions de portion de code (détection de la fontion)
		if 	($garbaging==false) {
			if ($fusion_remove_func["$file"]) foreach ($fusion_remove_func["$file"] as $tabFunc) if ((stripos($buffer, 'function')!==false) && (stripos($buffer, $tabFunc)!==false)) {
				if (strlen(trim(substr($buffer, stripos($buffer, "function")+8, stripos($buffer, $tabFunc)-stripos($buffer, "function")-8)))==0) {
					$garbaging=true;
					//$bracket=substr_count($buffer, "{")-substr_count($buffer, "}");
					//$buffer=substr($buffer, 0, stripos($buffer, "function"));					// on suppose qu'il n'y a pas de code avant une déclaration de fonction
					$bracket=0;																	// d'ou bracket=0, crocher pris en charge plus bas
					//echo "=============garbarging ON: $tabFunc => [$buffer]<br>";
					echo "=============== Supression de la Function $tabFunc()<br>"; 	
					fputs($fdd, "// Function $tabFunc() has been removed from MZ original code for ZZ Fusion\n"); 				// ecriture dans le nouveau fichier	
					// Pour vérifier que toutes les fonctions on bien été supprimé
					foreach ($arr_check_remove as $k => $v) if ($v==$tabFunc) { array_splice($arr_check_remove, $k, 1); }
				}			
			}
		}
		
		// ====================== traitement des supressions de portion de code (recherhce de la fin de fonction en comptant les crochets)
		if 	($garbaging==true) {
			$step1=substr_count($buffer, "{");
			$step2=substr_count($buffer, "}");
			$bracket=$bracket+$step1-$step2;
			//echo "bracket=$bracket : ".$step1."/".$step2;
			if (($bracket<=0) && ($step1+$step2>0)) {	// fin de poubelisation
				$garbaging=false; 
				$buffer=substr(strrchr($buffer, "}"), 1);
				//echo "=============garbarging OFF: [$buffer]<br>";
			} else {
				//echo "=============to garbage =======>: [$buffer]<br>";
				$buffer="";
			}
		}		
		
		// ====================== traitement du buffer s'il n'est en cours de mise au rebut
		if (strlen($buffer)>0) {
			// Pour vérifier que toutes les fonctions on bien été remplacé
			if ($arr_check_replace) foreach ($arr_check_replace as $k => $v) if (strlen($arr_check_replace[$k][0])>0) if (stripos($buffer, $arr_check_replace[$k][0])!==false) { array_splice($arr_check_replace, $k, 1); }

			if ($fusion_replace["$file"]) foreach ($fusion_replace["$file"] as $tabReplace) $buffer=str_ireplace($tabReplace[0], $tabReplace[1], $buffer);
			foreach ($fusion_replace["all"] as $tabReplace) $buffer=str_ireplace($tabReplace[0], $tabReplace[1], $buffer);

	
			fputs($fdd, $buffer); 				// ecriture dans le nouveau fichier
			
		}
		
	}
	if (sizeof($arr_check_replace)>0) { echo "Non trouvé:";  print_r($arr_check_replace); echo "<br>"; }
	fclose($fds);
	

	// ============================================================== Fusion du POST code
	if (file_exists("ZZ/$file.POST")) {
		$fds=fopen("ZZ/$file.POST", 'r');
    	while(!feof($fds)) {
			$buffer=fgets($fds);
			fputs($fdd, $buffer);
		}
		fclose($fds);
	}	
	
	// ============================================================== fermeture du fichier fusionné
	fclose($fdd);

	// ============================================================== check qu'on a rien oublié!!!!
	if (sizeof($arr_check_remove)>0) {print("=============== !!!!!!! <b>ATTENTION</b> !!!!!!!! ================ Fonctions non trouvés dans [<b>$file</b>]: "); print_r($arr_check_remove); }
	if (sizeof($arr_check_replace)>0) {print("=============== !!!!!!! <b>ATTENTION</b> !!!!!!!! ================ Code non remplacé dans [<b>$file</b>]: "); foreach ($arr_check_replace as $k => $v) echo "<br>".$arr_check_replace[$k][0]; print("<br>");}


}

/*$dh=opendir("MZ");
while (($File=readdir($dh)) !== false) {
	if ((filetype("MZ\\".$File)=="file")&&(substr($File,0,1)!="_")) {
		convertScript($File);
	}
}
closedir($dh);*/

// conversion Manuelle!!!
//news_FF.js depuis FF17 => changer responseDetails.responseXML en var responseXML 
//                          conversion auto pas faite encore (faute de temps)!!

convertScript("profil_FF.js");

echo "End of Conv!";

?>