<?php 


	  	$fds=fopen("http://ftp.mountyhall.com/ftp/Public_Monstres.txt", "r");
	  	///$fdd=fopen(\"ftp/Public_Diplomatie.txt\", \"w+\");

		while(!feof($fds)) {
			$buffer=fgets($fds);												// et on remplit avec les nouvelles valeurs
			///fputs($fdd, $buffer);
			$monstre = explode(";", $buffer);
  			$Filepath=explode("/", $monstre[3]);
  			
  			if ($Filepath[5]<>"") {
  				if (!file_exists("../skin/monstres/$Filepath[5]")) {
				 	if (!file_exists("monstres/$Filepath[5]")) {
					 	copy($monstre[3],"monstres/$Filepath[5]");
					 	echo "$monstre[1] => Nouveau Monstres détecté: $Filepath[5]<BR>";
					}				 	
				}
  			}
			  			
  			
		}
		fclose($fds);
		///fclose($fdd);
	


?>