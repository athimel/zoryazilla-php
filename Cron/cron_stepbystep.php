<?php 

require_once("../Config/_sqlconf.php");


//$srcfile = 'http://ftp.mountyhall.com/ftp/Public_Diplomatie.txt';
//$dstfile = 'ftp/Public_Diplomatie.txt';
//if (!copy($srcfile, $dstfile))    echo "La copie $file du fichier a échoué...\n";

//** Public_Diplomatie.txt **
//Id ; Type (**) ; Id Cible ; Description ; Ami ou Ennemi

#-----------------------------------------------------------------------------------
  	$mysql=_sqlconnect();	# -------------- Ouverture DB  
  	

  	$query =  "SELECT Value as diplo_update from MZ_Cron where Field='diplo_update'";
  	//echo "$query<BR>";
  	$result = @MySQL_QUERY($query);
  	if (@MySQL_NUM_ROWS($result)<>1) die(-1);
  	$diplo_update=mysql_result($result,0,"diplo_update"); 
  
 	$today=date("Y-m-d");
	//==============================================================================
	if ($diplo_update<>$today) { // télécharger le nouveau fichier
	  	$fds=fopen("http://ftp.mountyhall.com/ftp/Public_Diplomatie.txt", "r");
	  	///$fdd=fopen("ftp/Public_Diplomatie.txt", "w+");

		$query =  "UPDATE  MZ_Cron set Value='0' WHERE Field='diplo_step'";		// indiquer que la base diplo est obsolète
		$result = @MySQL_QUERY($query);

		$query =  "TRUNCATE TABLE MH_Diplo";									// on vide l'ancienne table
  		#echo "$query<BR>";
	  	$result = @MySQL_QUERY($query);

		while(!feof($fds)) {
			$buffer=fgets($fds);												// et on remplit avec les nouvelles valeurs
			///fputs($fdd, $buffer);
			$diplo = explode(";", $buffer);
		    $query =  "INSERT INTO `MH_Diplo` VALUES ('$diplo[0]','$diplo[1]','$diplo[2]','$diplo[3]','".$diplo[sizeof($diplo)-2]."')";
  			//echo "$query<BR>";
	  		$result = @MySQL_QUERY($query);
		}
		fclose($fds);
		///fclose($fdd);
	

		$query =  "UPDATE  MZ_Cron set Value='$today' WHERE Field='diplo_update'";		// indiquer que la base diplo est nouvellement chargée
		$result = @MySQL_QUERY($query);

	//==============================================================================
	} else {
	  	$query =  "SELECT Value as diplo_step from MZ_Cron where Field='diplo_step'";
	  	$result = @MySQL_QUERY($query);
		$diplo_step=1*mysql_result($result,0,"diplo_step"); 
		
		if ($diplo_step==0) {		// calculer la table diplo inversé
			$query =  "UPDATE  MZ_Cron set Value='0' WHERE Field='diplo_cursor'";		// positionner le curseur au début
			$result = @MySQL_QUERY($query);

			$query =  "UPDATE  MZ_Cron set Value='1' WHERE Field='diplo_step'";			// se mettre en mode calcul
			$result = @MySQL_QUERY($query);
			

		} else if ($diplo_step==1) {																// calculer la table diplo inversé jusquà la fin
		  	//$query =  "SELECT Value as diplo_cursor from MZ_Cron where Field='diplo_cursor'";
		  	//$result = @MySQL_QUERY($query);
			//$diplo_cursor=1*mysql_result($result,0,"diplo_cursor"); 

			$query =  "TRUNCATE TABLE TMP_Diplo_Inv";									// on vide l'ancienne table (tempo)
  			#echo "$query<BR>";
	  		$result = @MySQL_QUERY($query);

			$query =  "SELECT  * FROM `MH_Diplo` order by ID , Type , IdCible";
  			$result = @MySQL_QUERY($query);
  			$nData = @MySQL_NUM_ROWS($result);
			for ($i=0; $i<$nData; $i++) {	 
  				$ID=mysql_result($result,$i,"ID"); 
  				$Type=mysql_result($result,$i,"Type"); 
  				$IdCible=mysql_result($result,$i,"IdCible"); 
  				$Diplo=mysql_result($result,$i,"Diplo"); 

			    $query =  "INSERT INTO `TMP_Diplo_Inv` VALUES ('$ID','$IdCible','#FFFFFF','$Type')";
  				//echo "$i => $query<BR>";
		  		$insert = @MySQL_QUERY($query);
		  	}
			
/*			==> au cas ou il faudrait vriament scindé le calcul
			$query =  "SELECT  distinct * FROM `MH_Diplo` order by ID , Type , IdCible LIMIT $diplo_cursor , 1";
  			$result = @MySQL_QUERY($query);
  			while (@MySQL_NUM_ROWS($result)==1) {
				
  				$ID=mysql_result($result,0,"ID"); 
  				$Type=mysql_result($result,0,"Type"); 
  				$IdCible=mysql_result($result,0,"IdCible"); 
  				$Diplo=mysql_result($result,0,"Diplo"); 

			    $query =  "INSERT INTO `MZ_Diplo_Inv` VALUES ('$ID','$IdCible','#FFFFFF','$Type')";
  				echo "$diplo_cursor => $query<BR>";
		  		$result = @MySQL_QUERY($query);

  				$diplo_cursor++;
	  			$query =  "UPDATE  MZ_Cron set Value='$diplo_cursor' WHERE Field='diplo_cursor'";
  	  			$result = @MySQL_QUERY($query);

				$query =  "SELECT  distinct * FROM `MH_Diplo` order by ID , Type , IdCible LIMIT $diplo_cursor , 1";
  				$result = @MySQL_QUERY($query);
  			}
*/
			$query =  "UPDATE  MZ_Cron set Value='2' WHERE Field='diplo_step'";			// terminer le script!
			$result = @MySQL_QUERY($query);
		} else if ($diplo_step==2) {																// ccopie de la table tempo en définitivie

			$query =  "TRUNCATE TABLE MZ_Diplo_inv";									// on vide l'ancienne table (tempo)
  			#echo "$query<BR>";
	  		$result = @MySQL_QUERY($query);

			$query =  "INSERT INTO MZ_Diplo_inv SELECT * from TMP_Diplo_inv";			// terminer le script!
			$result = @MySQL_QUERY($query);

			$query =  "UPDATE  MZ_Cron set Value='3' WHERE Field='diplo_step'";			// terminer le script!
			$result = @MySQL_QUERY($query);
		}
		

	}

  	_sqlclose();		# -------------- Fermeture DB  
  

?>