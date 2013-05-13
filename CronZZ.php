<?php
session_cache_limiter("nocache");
//header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1		pour empecher la mise en cache (cache trop important avec ironie ou FF8) !!!
require_once("Lib/libutf8.inc.php"); 

$mysql=_sqlconnect();	# -------------- Ouverture DB  
$query =  "SELECT IdNews FROM `MZ_InfoZZ`";
$result = @MySQL_QUERY($query);
_sqlclose();		# -------------- Fermeture DB  

if  (@MySQL_NUM_ROWS($result)>0) {
	$IdNews=mysql_result($result,0,"IdNews");
	_print("<INPUT TYPE=hidden Name=NewsID Value='$IdNews'>");
}


#<B>Salut,</B> 
_print("<TABLE width=600><TR><TD>");
//<TABLE width=100><TR><TD>
//<I><b><u>Le forum:</I></b></u> <a target=_blank href=http://zorya.ironie.org/forum><font size=+1>http://zorya.ironie.org/forum/</font></a><BR>
//<br>Zorya.<BR>
//</TD></TR></TABLE>


	$mysql=_sqlconnect();	# -------------- Ouverture DB  
	
	$now=date("Y-m-d H:i:s");
	$query =  "SELECT * from MZ_Crontab where job_active=1 order by id";
	$result = @MySQL_QUERY($query);
  
	if (@mysql_num_rows($result))  // check has got some
	{
	 	$i = 0;
		_print("<TABLE width=600><tr><td><b>Status</b></td><td><b>Id</b></td><td><b>Script</b></td><td><b>Next Fire</b></td><td width=50%><b>Etat du script</b></td></tr>");
		while ($i < mysql_num_rows($result))  // Un seul script à la fois... c'est déjà bien !!!
	 	{
	  		$id=mysql_result($result,$i, 'id');
	  		$scriptpath=mysql_result($result,$i, 'scriptpath');
	  		$next_fire=mysql_result($result,$i, 'next_fire');
	  		$ball=0;
	  		if ($next_fire<$now) { $ball++; $next_fire="<font color=purple><b>$next_fire</b</font>"; }
	  		
	  		$Etat="";
			switch ($scriptpath) {
			case "cron_bestiaire.php":
				$query =  "SELECT Value as cursor_bestiaire from MZ_Cron where Field='cursor_bestiaire'";
				$res = @MySQL_QUERY($query);
				if (@mysql_num_rows($res)) $Etat="Dernier monstre mis à jour: #".mysql_result($res,0, 'cursor_bestiaire');
			break;
			case "cron_troll.php":
				$query =  "SELECT Value as troll_update from MZ_Cron where Field='troll_update'";
				$res = @MySQL_QUERY($query);
				if (@mysql_num_rows($res)) {
					$update=mysql_result($res,0, 'troll_update');
					if ($update<>date("Y-m-d")) { $ball++; $update="<font color=red><b>$update</b</font>";} else $update="<font color=green><b>$update</b</font>";
					$Etat="Dernier chargement le: $update";
				}
			break;
			case "cron_guilde.php":
				$query =  "SELECT Value as guilde_update from MZ_Cron where Field='guilde_update'";
				$res = @MySQL_QUERY($query);
				if (@mysql_num_rows($res)) {
					$update=mysql_result($res,0, 'guilde_update');
					if ($update<>date("Y-m-d")) { $ball++; $update="<font color=red><b>$update</b</font>";} else $update="<font color=green><b>$update</b</font>";
					$Etat="Dernier chargement le: $update";
				}
			break;			
			case "cron_diplo.php":
				$query =  "SELECT Value as diplo_update from MZ_Cron where Field='diplo_update'";
				$res = @MySQL_QUERY($query);
				if (@mysql_num_rows($res)) {
					$update=mysql_result($res,0, 'diplo_update');
					if ($update<>date("Y-m-d")) { $ball++; $update="<font color=red><b>$update</b</font>";} else $update="<font color=green><b>$update</b</font>";
					$Etat="Dernier chargement le: $update";
				}
			break;
			case "cron_karma.php":
				$query =  "SELECT Value as karma_update from MZ_Cron where Field='karma_update'";
				$res = @MySQL_QUERY($query);
				if (@mysql_num_rows($res)) {
					$update=mysql_result($res,0, 'karma_update');
				 	$yesterday=date("Y-m-d",mktime(date("H"),date("i"),date("s"),date("m"),date("d")-1,date("Y")));
					if ($update<>$yesterday) { $ball++; $update="<font color=red><b>$update</b</font>";}  else $update="<font color=green><b>$update</b</font>";
					$Etat="Dernier chargement le: $update"; 
				}
			break;
			case "cron_cleanDB.php":
				$query =  "SELECT Value as cleanDB_update from MZ_Cron where Field='cleanDB_update'";
				$res = @MySQL_QUERY($query);
				if (@mysql_num_rows($res)) {
					$update=mysql_result($res,0, 'cleanDB_update');
				 	$yesterday=date("Y-m-d",mktime(date("H"),date("i"),date("s"),date("m"),date("d")-1,date("Y")));
					if ($update<$yesterday) { $ball++; $update="<font color=red><b>$update</b</font>";} else $update="<font color=green><b>$update</b</font>";
					$Etat="Dernier nettoyage le: $update";
				}
			break;
			}	  
			$con_name=substr($scriptpath, 0, -4);
	  		if ($ball==0) $bullet="bullet_green.jpg"; else if ($ball==1) $bullet="bullet_orange.jpg"; else $bullet="bullet_red.jpg";
	  		_print("<tr><td><img src=MH/Images/$bullet></td><td>$id</td><td>$con_name</td><td>$next_fire</td><td>$Etat</td></tr>");
	  		$i++;
	 	}
		_print("</TABLE>");
	} else {
		_print("Il n'y a pas de scripts scheduler!");
	}

	_sqlclose();		# -------------- Fermeture DB  


_print("</TD></TR></TABLE>");


?>