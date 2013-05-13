<?php 
	require_once("../Config/_sqlconf.php");
  
  	//include("cron_troll.php");
  	//die(0);			/// debug

	$mysql=_sqlconnect();	# -------------- Ouverture DB  
	
	$now=date("Y-m-d H:i:s");
	$query =  "SELECT id, scriptpath, time_interval  from MZ_Crontab where job_active=1 and next_fire<'$now' order by rand() ";
	//echo $query;
	$result = @MySQL_QUERY($query);
  
  
	$scripts_to_run = array();
	$scripts_id = array();
	if (@mysql_num_rows($result))  // check has got some
	{
	 	$i = 0;
		//while ($i < mysql_num_rows($result))  // Un seul script à la fois... c'est déjà bien !!!
	 	//{
	  		$id=mysql_result($result,$i, 'id');
	  		$scriptpath=mysql_result($result,$i, 'scriptpath');
	  		$time_interval=mysql_result($result,$i, 'time_interval');
	  		$next_fire=date("Y-m-d H:i:s",mktime(date("H"),date("i")+$time_interval,date("s"),date("m"),date("d"),date("Y")));
	
	  		$scripts_to_run[$i]="$scriptpath";
	  		$scripts_id[$i]=$id;
	  		$query="UPDATE MZ_Crontab SET next_fire='$next_fire' WHERE id='$id'";
			//echo $query;
	  		@MySQL_QUERY($query);
	  	//	$i++;
	 	//}
	}

	_sqlclose();		# -------------- Fermeture DB  
  

	for ($i = 0; $i < count($scripts_to_run); $i++) {
			// utilisation d'une variable glbal, si le script à besoin de reprogramer le cron
			$_cron_id=$scripts_id[$i];
			include($scripts_to_run[$i]);		/// fire script!
	}
    
    
?>