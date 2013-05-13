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
  	

  	$query =  "SELECT Value as troll_update from MZ_Cron where Field='troll_update'";
  	//echo "$query<BR>";
  	$result = @MySQL_QUERY($query);
  	if (@MySQL_NUM_ROWS($result)<>1) die(-1);
  	$troll_update=mysql_result($result,0,"troll_update"); 
  
 	$today=date("Y-m-d");
	//==============================================================================
	if ($troll_update<>$today) { // télécharger le nouveau fichier
		if ($_FOPEN_EXTERNAL )	// si pas d'accès externe, on suppose le fichier copié dans repertoire ftp par script externe
			$fds=@fopen("http://ftp.mountyhall.com/Public_Trolls.txt", "r");
		else
			$fds=@fopen("ftp/Public_Trolls.txt", "r");	
	  	
	  	if ($fds) {
			$query =  "UPDATE  MZ_Cron set Value='0' WHERE Field='troll_step'";		// indiquer que la base diplo est obsolète
			$result = @MySQL_QUERY($query);

			$query =  "TRUNCATE TABLE MH_Trolls";									// on vide l'ancienne table
  			//echo "$query<BR>";
	  		$result = @MySQL_QUERY($query);

			while(!feof($fds)) {
				$buffer=fgets($fds);												// et on remplit avec les nouvelles valeurs
				///fputs($fdd, $buffer);
				$troll = explode(";", $buffer);
				$l=sizeof($troll);
			    $query =  "INSERT INTO `MH_Trolls` VALUES ('$troll[0]','".mysql_real_escape_string($troll[1])."','".$troll[$l-7]."','".$troll[$l-6]."','".$troll[$l-5]."','".$troll[$l-4]."','".$troll[$l-2]."','".$troll[$l-3]."')";
  				//echo "$query<BR>";
	  			$result = @MySQL_QUERY($query);
			}
			fclose($fds);
			///fclose($fdd);
	
			$query =  "UPDATE  MZ_Cron set Value='$today' WHERE Field='troll_update'";		// indiquer que la base diplo est nouvellement chargée
			$result = @MySQL_QUERY($query);
		}
	//==============================================================================
	} else {
	  	$query =  "SELECT Value as troll_step from MZ_Cron where Field='troll_step'";
	  	$result = @MySQL_QUERY($query);
		$troll_step=1*mysql_result($result,0,"troll_step"); 
		
		if ($troll_step==0) {		// calculer la table diplo inversé
			$query =  "REPLACE INTO MZ_Trolls SELECT * from MH_Trolls";					// récupérer les datas
			$result = @MySQL_QUERY($query);

			$query =  "UPDATE MZ_User U, MH_Trolls T SET U.GiD=T.GiD WHERE U.TiD=T.TiD";	// Mise a jour des comptes User si la guilde a changé!
			$result = @MySQL_QUERY($query);
			
			$query =  "UPDATE  MZ_Cron set Value='1' WHERE Field='troll_step'";			// terminer le script!
			$result = @MySQL_QUERY($query);

		} else {		// le travail quotidien est terminé
			//-----------------------------------------------------------------------------------------------------------------
			if (! $_FOPEN_EXTERNAL ) @unlink("ftp/Public_Trolls.txt");
			
			$next_fire=date("Y-m-d H:i:s",mktime(0,0,0,date("m"),date("d")+1,date("Y")));	// Plus de mise à jour avant demain
	  		$query="UPDATE MZ_Crontab SET next_fire='$next_fire' WHERE id='$_cron_id'";		
	  		@MySQL_QUERY($query);			
		}
	}

  	_sqlclose();		# -------------- Fermeture DB  
  

?>