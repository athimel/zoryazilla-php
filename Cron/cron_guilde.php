<?php 
ignore_user_abort(True);
require_once("../Config/_sqlconf.php");


//$srcfile = 'http://ftp.mountyhall.com/ftp/Public_Trolls.txt';
//$dstfile = 'ftp/Public_Trolls.txt';
//if (!copy($srcfile, $dstfile))    echo "La copie $file du fichier a échoué...\n";

//** Public_Diplomatie.txt **
//Id ; Nom ; Race ; Niveau ; Nb de Kills ; Nb de Morts ; Id Guilde ; Nb de Mouches

#-----------------------------------------------------------------------------------
  	$mysql=_sqlconnect();	# -------------- Ouverture DB  
  	

  	$query =  "SELECT Value as guilde_update from MZ_Cron where Field='guilde_update'";
  	//echo "$query<BR>";
  	$result = @MySQL_QUERY($query);
  	if (@MySQL_NUM_ROWS($result)<>1) die(-1);
  	$guilde_update=mysql_result($result,0,"guilde_update"); 
  
 	$today=date("Y-m-d");
	//==============================================================================
	if ($guilde_update<>$today) { // télécharger le nouveau fichier
		if ($_FOPEN_EXTERNAL)	// si pas d'accès externe, on suppose le fichier copié dans repertoire ftp par script externe
			$fds=@fopen("http://ftp.mountyhall.com/Public_Guildes.txt", "r");
		else
			$fds=@fopen("ftp/Public_Guildes.txt", "r");

			
	  	//$fds=fopen("ftp/Public_Guildes.txt", "r");
	  	//$fdd=fopen("ftp/Public_Guildes.txt", "w+");
	  	
	  	if ($fds) {
			$query =  "UPDATE  MZ_Cron set Value='0' WHERE Field='guilde_step'";		// indiquer que la base diplo est obsolète
			$result = @MySQL_QUERY($query);

			$query =  "TRUNCATE TABLE MH_Guildes";									// on vide l'ancienne table
  			//echo "$query<BR>";
	  		$result = @MySQL_QUERY($query);

			while(!feof($fds)) {
				$buffer=fgets($fds);												// et on remplit avec les nouvelles valeurs
				///fputs($fdd, $buffer);
				$guilde = explode(";", $buffer);
				$l=sizeof($guilde);
			    $query =  "INSERT INTO `MH_Guildes` VALUES ('$guilde[0]','".mysql_real_escape_string($guilde[1])."','".$guilde[$l-2]."')";
  				//echo "$query<BR>";
	  			$result = @MySQL_QUERY($query);
			}
			fclose($fds);
			///fclose($fdd);
	
			$query =  "UPDATE  MZ_Cron set Value='$today' WHERE Field='guilde_update'";		// indiquer que la base diplo est nouvellement chargée
			$result = @MySQL_QUERY($query);
		}
	//==============================================================================
	} else {
	  	$query =  "SELECT Value as guilde_step from MZ_Cron where Field='guilde_step'";
	  	$result = @MySQL_QUERY($query);
		$guilde_step=1*mysql_result($result,0,"guilde_step"); 
		
		if ($guilde_step==0) {		// calculer la table diplo inversé
			$query =  "REPLACE INTO MZ_Guildes SELECT * from MH_Guildes";					// récupérer les datas
			$result = @MySQL_QUERY($query);

			$query =  "UPDATE  MZ_Cron set Value='1' WHERE Field='guilde_step'";			// terminer le script!
			$result = @MySQL_QUERY($query);

		} else {		// le travail quotidien est terminé
			//-----------------------------------------------------------------------------------------------------------------
			if (! $_FOPEN_EXTERNAL ) @unlink("ftp/Public_Guildes.txt");

			$next_fire=date("Y-m-d H:i:s",mktime(0,0,0,date("m"),date("d")+1,date("Y")));	// Plus de mise à jour avant demain
	  		$query="UPDATE MZ_Crontab SET next_fire='$next_fire' WHERE id='$_cron_id'";		
	  		@MySQL_QUERY($query);			
		}
	}

  	_sqlclose();		# -------------- Fermeture DB  
  

?>