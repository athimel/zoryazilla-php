<?php 
ignore_user_abort(True);
require_once("../Config/_sqlconf.php");


//$srcfile = 'http://ftp.mountyhall.com/Public_Diplomatie.txt';
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
	
		if ($_FOPEN_EXTERNAL)	// si pas d'accès externe, on suppose le fichier copié dans repertoire ftp par script externe
			$fds=@fopen("http://ftp.mountyhall.com/Public_Diplomatie.txt", "r");
		else
			$fds=@fopen("ftp/Public_Diplomatie.txt", "r");

	  	if ($fds) {
			$query =  "UPDATE  MZ_Cron set Value='0' WHERE Field='diplo_step'";		// indiquer que la base diplo est obsolète
			$result = @MySQL_QUERY($query);

			$query =  "TRUNCATE TABLE MH_Diplo";									// on vide l'ancienne table
  			#echo "$query<BR>";
	  		$result = @MySQL_QUERY($query);

			while(!feof($fds)) {
				$buffer=fgets($fds);												// et on remplit avec les nouvelles valeurs
				///fputs($fdd, $buffer);
				$diplo = explode(";", $buffer);
			    $query =  "INSERT INTO `MH_Diplo` VALUES ('$diplo[0]','$diplo[1]','$diplo[2]','".mysql_real_escape_string($diplo[3])."','".$diplo[sizeof($diplo)-2]."')";
  				//echo "$query<BR>";
	  			$result = @MySQL_QUERY($query);
			}
			fclose($fds);
			///fclose($fdd);

			$query =  "UPDATE  MZ_Cron set Value='$today' WHERE Field='diplo_update'";		// indiquer que la base diplo est nouvellement chargée
			$result = @MySQL_QUERY($query);
		} 
	//==============================================================================
	} else {
	  	$query =  "SELECT Value as diplo_step from MZ_Cron where Field='diplo_step'";
	  	$result = @MySQL_QUERY($query);
		$diplo_step=1*mysql_result($result,0,"diplo_step"); 
		
		if ($diplo_step==0) {		// calculer la table diplo inversé
			$query =  "TRUNCATE TABLE TMP_Diplo_inv";									// on vide l'ancienne table (tempo)
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
  				if ($Diplo=="AMI") $Color="#AAFFAA";  else $Color="#FFAAAA";				//rose monstre=>#FFD3D3   (guilde perso=BBBBFF)
  				if ($Type=="T") $IdCible=-$IdCible;										// Pour la diplo d'un troll

			    $query =  "INSERT INTO `TMP_Diplo_inv` VALUES ('$IdCible','$ID','$Color','G')";
			    //$query =  "INSERT INTO `TMP_Diplo_Inv` VALUES ('$ID','$IdCible','#FFFFFF','$Type')";
  				//echo "$i => $query<BR>";
		  		$insert = @MySQL_QUERY($query);
		  	}
		  	
			$query =  "UPDATE  MZ_Cron set Value='1' WHERE Field='diplo_step'";			// terminer le script!
			$result = @MySQL_QUERY($query);
		} else if ($diplo_step==1) {													// ccopie de la table tempo en définitivie

			$query =  "TRUNCATE TABLE MZ_Diplo_inv";									// on vide l'ancienne table (tempo)
  			#echo "$query<BR>";
	  		$result = @MySQL_QUERY($query);

			$query =  "INSERT INTO MZ_Diplo_inv SELECT * from TMP_Diplo_inv";			// terminer le script!
			$result = @MySQL_QUERY($query);

			$query =  "UPDATE MZ_User U inner join MZ_Trolls T on U.Tid=T.TiD SET U.GiD=T.GiD WHERE U.GiD <>T.GiD";			// mise à jour de la table users.
			$result = @MySQL_QUERY($query);
  
			$query =  "UPDATE  MZ_Cron set Value='2' WHERE Field='diplo_step'";			// terminer le script!
			$result = @MySQL_QUERY($query);
		} else {		// le travail quotidien est terminé
			//-----------------------------------------------------------------------------------------------------------------
			if (! $_FOPEN_EXTERNAL ) @unlink("ftp/Public_Diplomatie.txt");

			$next_fire=date("Y-m-d H:i:s",mktime(0,0,0,date("m"),date("d")+1,date("Y")));	// Plus de mise à jour avant demain
	  		$query="UPDATE MZ_Crontab SET next_fire='$next_fire' WHERE id='$_cron_id'";		
	  		@MySQL_QUERY($query);			
		}
	}

  	_sqlclose();		# -------------- Fermeture DB  
  

?>