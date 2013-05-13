<?php 
ignore_user_abort(True);
require_once("../Config/_sqlconf.php");


$keep3J=date("Y-m-d H:i:s",mktime(date("H"),date("i"),date("s"),date("m"),date("d")-3,date("Y")));
$keep2SEM=date("Y-m-d H:i:s",mktime(date("H"),date("i"),date("s"),date("m"),date("d")-14,date("Y")));
$keep1AN=date("Y-m-d H:i:s",mktime(date("H"),date("i"),date("s"),date("m")-12,date("d"),date("Y")));
$keep1MOIS=date("Y-m-d H:i:s",mktime(date("H"),date("i"),date("s"),date("m")-1,date("d"),date("Y")));
$today=date("Y-m-d");
 	
$mysql=_sqlconnect();	# -------------- Ouverture DB  

#$cleanquery =  "DELETE from `MZ_CdM` where (TimeStamp<'$keep1AN')";
#$cleanresult = MySQL_QUERY($cleanquery);  
#echo "$cleanquery<BR>";
#$nData = @MySQL_AFFECTED_ROWS(); if ($nData=="") $nData=0;
#echo "Nettoyage de la table des CdM: $nData row(s)<br>";  

$cleanquery =  "DELETE from `MZ_CdMLIVE` where (TimeStamp<'$keep1MOIS')";
$cleanresult = MySQL_QUERY($cleanquery);  
//echo "$cleanquery<BR>";
$nData = @MySQL_AFFECTED_ROWS(); if ($nData=="") $nData=0;
echo "Nettoyage de la table des CdM (live): $nData row(s)<br>";  

$cleanquery =  "DELETE from `MZ_Insulte` where (TimeStamp<'$keep1MOIS')";
//echo "$cleanquery<BR>";
$cleanresult = MySQL_QUERY($cleanquery);  
$nData = @MySQL_AFFECTED_ROWS(); if ($nData=="") $nData=0;
echo "Nettoyage de la table des Insultes: $nData row(s)<br>";

$cleanquery =  "DELETE from `MZ_Attaque` where (TimeStamp<'$keep1MOIS')";
//echo "$cleanquery<BR>";
$cleanresult = MySQL_QUERY($cleanquery);    
$nData = @MySQL_AFFECTED_ROWS(); if ($nData=="") $nData=0;
echo "Nettoyage de la table des Attaques: $nData row(s)<br>";

$cleanquery =  "DELETE from `MZ_VueManager` where (TimeStamp<'$keep3J')";
//echo "$cleanquery<BR>";
$cleanresult = MySQL_QUERY($cleanquery);    
$nData = @MySQL_AFFECTED_ROWS(); if ($nData=="") $nData=0;
echo "Nettoyage de la table du gestionnaire de vue: $nData row(s)<br>";

$cleanquery =  "DELETE from `MZ_Vue` where (TimeStamp<'$keep3J')";
//echo "$cleanquery<BR>";
$cleanresult = MySQL_QUERY($cleanquery);    
$nData = @MySQL_AFFECTED_ROWS(); if ($nData=="") $nData=0;
echo "Nettoyage de la table des vues: $nData row(s)<br>";

$cleanquery =  "DELETE from `MZ_Vue_ext` where (TimeStamp<'$keep2SEM')";
//echo "$cleanquery<BR>";
$cleanresult = MySQL_QUERY($cleanquery);    
$nData = @MySQL_AFFECTED_ROWS(); if ($nData=="") $nData=0;
echo "Nettoyage de la table des vues remarquables: $nData row(s)<br>";


$cleanquery =  "DELETE from `MZ_Log` where (TimeStamp<'$keep3J')";
//echo "$cleanquery<BR>";
$cleanresult = MySQL_QUERY($cleanquery);  
$nData = @MySQL_AFFECTED_ROWS(); if ($nData=="") $nData=0;
echo "Nettoyage de la table des Logs: $nData row(s)<br>";

$query =  "REPLACE INTO MZ_Share  select u.TiD, u.TiD, 'S' FROM `MZ_User` u left join MZ_Share s on s.Tid=u.TiD where (s.SHRiD is null) or (s.SHRiD = u.tid and link<>'S') ";
$result = @MySQL_QUERY($query);
$nData = @MySQL_AFFECTED_ROWS(); if ($nData=="") $nData=0;
echo "Nettoyage de la table des partages: $nData row(s)<br>";

$query =  "OPTIMIZE TABLE `MZ_Vue`, `MZ_Log`, `MZ_Vue_ext`, `MZ_Attaque`, `MZ_CdMLIVE`, `MZ_Events_mort`, `MZ_VueManager`, `MZ_Insulte`  ";
$result = @MySQL_QUERY($query);
echo "Optimization des tables (économie de place)<br>";

$query =  "UPDATE  MZ_Cron set Value='$today' WHERE Field='cleanDB_update'";		// indiquer que la base diplo est nouvellement chargée
$result = @MySQL_QUERY($query);

//-----------------------------------------------------------------------------------------------------------------
$next_fire=date("Y-m-d H:i:s",mktime(0,0,0,date("m"),date("d")+1,date("Y")));	// Plus de mise à jour avant demain
$query="UPDATE MZ_Crontab SET next_fire='$next_fire' WHERE id='$_cron_id'";		
@MySQL_QUERY($query);
			
_sqlclose();		# -------------- Fermeture DB  


  

?>