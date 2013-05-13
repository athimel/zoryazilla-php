<?php


require_once("../Config/_sqlconf.php");



#-----------------------------------------------------------------------------------
  	$mysql=_sqlconnect();	# -------------- Ouverture DB  



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
  				if ($Diplo=="AMI") $Color="#AAFFAA";  else $Color="#FFAAAA";				//rose monstre=>#FFD3D3
  				if ($Type=="T") $IdCible=-$IdCible;										// Pour la diplo d'un troll

			    $query =  "INSERT INTO `TMP_Diplo_Inv` VALUES ('$IdCible','$ID','$Color','G')";
			    //$query =  "INSERT INTO `TMP_Diplo_Inv` VALUES ('$ID','$IdCible','#FFFFFF','$Type')";
  				echo "$i => $query<BR>";
		  		$insert = @MySQL_QUERY($query);
		  	}
		  	
	

  	_sqlclose();		# -------------- Fermeture DB  
  		  	
?>		  	