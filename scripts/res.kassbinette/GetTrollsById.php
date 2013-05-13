<?php

	require_once("../../Config/_sqlconf.php");
	# http://www.kassbinette.net/scriptsComplementairesMH/Autosuggest/GetTrollsById.aspx?ids=%2017203,%2028373,%2014912,%2079445,%2028844&callCounter=2
	# {"callCounter":"2","trolls":[{"Id":14912,"Nom":"Elkairm"},{"Id":17203,"Nom":"Beuarghh"},{"Id":28373,"Nom":"Moon"},{"Id":28844,"Nom":"Trorelei"},{"Id":79445,"Nom":"red claw"}]}
	#{"callCounter":"1","trolls":[]}

	$ids=explode(",", $_GET['ids']);
	$callCounter=$_GET['callCounter'];

	if (($callCounter=="") || ($_GET['ids']=="")) die();

	echo '{"callCounter":"'.$callCounter.'","trolls":[';

	
	#-----------------------------------------------------------------------------------
	$mysql=_sqlconnect();	# -------------- Ouverture DB  
	$j=0;
	for ($i=0; $i<sizeof($ids); $i++) {
		$TiD=trim($ids[$i]);
		$query = "SELECT Troll from MZ_Trolls where TiD='$TiD'";
		//echo "$query<BR>";
		$result = @MySQL_QUERY($query);
		$nrow = @MySQL_NUM_ROWS($result);	
		if ($nrow>0) { $Troll=mysql_result($result,0,"Troll");
			if ($j>0) echo ",";
			echo '{"Id":'.$TiD.',"Nom":"'.$Troll.'"}';
			$j++;
		}
	}
	_sqlclose();	# -------------- Fermeture DB   
	#-----------------------------------------------------------------------------------

	
	echo ']}';
	die();
?>