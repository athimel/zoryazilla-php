<?php 
ignore_user_abort(True);
require_once("../Config/_sqlconf.php");


//$srcfile = 'http://ftp.mountyhall.com/evenements/[AAAA]/[AAMMDD]_Public_Events_MORT.txt';


#-----------------------------------------------------------------------------------
  	$mysql=_sqlconnect();	# -------------- Ouverture DB  
  	

  	$query =  "SELECT Value as karma_update from MZ_Cron where Field='karma_update'";
  	//echo "$query<BR>";
  	$result = @MySQL_QUERY($query);
  	if (@MySQL_NUM_ROWS($result)<>1) die(-1);
  	$karma_update=mysql_result($result,0,"karma_update"); 
  
 	$yesterday=date("Y-m-d",mktime(date("H"),date("i"),date("s"),date("m"),date("d")-1,date("Y")));
	//==============================================================================
	if ($karma_update<$yesterday) { // télécharger le fichier d'hier
		$nextDate=date("Y-m-d",mktime(0,0,0,substr($karma_update,5,2),substr($karma_update,8,2)+1,substr($karma_update,0,4)));

		if ($_FOPEN_EXTERNAL)	// si pas d'accès externe, on suppose le fichier copié dans repertoire ftp par script externe
			$FileName="http://ftp.mountyhall.com/evenements/".substr($nextDate, 0,4)."/".substr($nextDate,0,4).substr($nextDate,5,2).substr($nextDate,8,2)."_Public_Events_MORT.txt";
		else
			$FileName="ftp/".substr($nextDate,0,4).substr($nextDate,5,2).substr($nextDate,8,2)."_Public_Events_MORT.txt";

		// MODE DEBUG
		//$FileName="http://localhost/FZZ/Cron/ftp/".substr($nextDate,0,4).substr($nextDate,5,2).substr($nextDate,8,2)."_Public_Events_MORT.txt";			//debug


		$fds=@fopen($FileName, "r");
		///$fdd=fopen("ftp/Public_Diplomatie.txt", "w+");

	  	if ($fds) {
		  	$query =  "SELECT Value as karma_step from MZ_Cron where Field='karma_step'";
		  	$result = @MySQL_QUERY($query);
			$karma_step=1*mysql_result($result,0,"karma_step"); 
	  	
	  		if ($karma_step<>0) {
				$query =  "TRUNCATE TABLE MH_Events_mort";										// on vide l'ancienne table
  				#echo "$query<BR>";
	  			$result = @MySQL_QUERY($query);
			}
			
			while(!feof($fds)) {
				$buffer=fgets($fds);															// et on remplit avec les nouvelles valeurs
				///fputs($fdd, $buffer);
				$mort = explode(";", $buffer);
				if (sizeof($mort)>5) {
				    $query =  "INSERT INTO `MH_Events_mort` VALUES ('$mort[0]','$mort[1]','$mort[2]','$mort[3]','$mort[4]','$mort[5]')";
  					//echo "$query<BR>";
	  				$result = @MySQL_QUERY($query);
	  			}
			}
			fclose($fds);
			///fclose($fdd);

	  		if ($karma_step<>0) {
				$query =  "UPDATE  MZ_Cron set Value='0' WHERE Field='karma_step'";				// indiquer que la base diplo est obsolète
				$result = @MySQL_QUERY($query);
			}

			if (! $_FOPEN_EXTERNAL ) @unlink($FileName);
						
			$query =  "UPDATE  MZ_Cron set Value='$nextDate' WHERE Field='karma_update'";		// indiquer que la base event est nouvellement chargée
			$result = @MySQL_QUERY($query);
		} 
	//==============================================================================
	} else {

	  	$query =  "SELECT Value as karma_step from MZ_Cron where Field='karma_step'";
	  	$result = @MySQL_QUERY($query);
		$karma_step=1*mysql_result($result,0,"karma_step"); 
	
		if ($karma_step==0) {		// inserer les valeurs dans la table des évenements
			$query =  "INSERT INTO MZ_Events_mort SELECT TimeStamp, KillerID, KillerType, MortID, MortType from MH_Events_mort";		
			$result = @MySQL_QUERY($query);

		 	$SixMonth=date("Y-m-d",mktime(date("H"),date("i"),date("s"),date("m")-6,date("d"),date("Y")));
			$query =  "DELETE FROM MZ_Events_mort WHERE TimeStamp<'$SixMonth'";			
			$result = @MySQL_QUERY($query);
		  	
			$query =  "UPDATE  MZ_Cron set Value='1' WHERE Field='karma_step'";			// next step
			$result = @MySQL_QUERY($query);
		} else if ($karma_step==1) {	

			$query =  "REPLACE INTO MZ_Karma (SELECT KillerID as TiD, now() as TimeStamp, min(TimeStamp) as firstFrag, max(TimeStamp) as lastFrag, count(*) as kills, 0 as TK, 0 as ATK, 0 as MK, '' as Karma from MZ_Events_mort where KillerType='Troll' group by KillerID) ";
			$result = @MySQL_QUERY($query);

			$query =  "REPLACE INTO MZ_Karma (SELECT K.TiD,K.TimeStamp,K.firstFrag,K.lastFrag,K.Kills,count(MortID) as TK,K.ATK,K.MK,K.Karma FROM MZ_Events_mort E inner join MZ_Karma as K on E.KillerID=K.TiD WHERE (KillerType='Troll') and (MortType='Troll') and (KillerID<>MortID) group by `KillerID`) ";
			$result = @MySQL_QUERY($query);

			$query =  "UPDATE MZ_Karma SET MK=Kills-TK";
			$result = @MySQL_QUERY($query);

			$query =  "UPDATE  MZ_Cron set Value='2' WHERE Field='karma_step'";		// next step
			$result = @MySQL_QUERY($query);

		} else if ($karma_step==2) {		#(180*TK/datediff(`lastFrag`,`firstFrag`))

			#$query =  "UPDATE `MZ_Karma` set Karma='TK' WHERE ((TK>0) and (TK>=MK)) or (TK>=20) ";
			$query =  "UPDATE `MZ_Karma` set Karma='TK' WHERE ((TK>0) and (TK>=MK)) or ((180*TK/datediff(`lastFrag`,`firstFrag`))>=20) ";
			$result = @MySQL_QUERY($query);

			#$query =  "UPDATE `MZ_Karma` set Karma='OMNI' WHERE (TK<MK) and (((TK>10) and (TK<20)) or ((2*TK)>=MK)) ";
			$query =  "UPDATE `MZ_Karma` set Karma='OMNI' WHERE (TK<MK) and ((((180*TK/datediff(`lastFrag`,`firstFrag`))>10) and (Karma<>'T')) or ((2*TK)>=MK)) ";
			$result = @MySQL_QUERY($query);

			$query =  "UPDATE `MZ_Karma` set Karma='MK' WHERE  Karma='' ";
			$result = @MySQL_QUERY($query);

			$query =  "REPLACE INTO MZ_Karma (SELECT K.TiD,K.TimeStamp,K.firstFrag,K.lastFrag,K.Kills,K.TK,count(MortID) as ATK ,K.MK,K.Karma FROM MZ_Events_mort E inner join MZ_Karma as K on E.KillerID=K.TiD inner join MZ_Karma as D on D.TiD=E.MortID WHERE (KillerType='Troll') and (MortType='Troll') and (KillerID<>MortID) and ((D.Karma='T')or(D.Karma='O')) group by `KillerID`) ";
			$result = @MySQL_QUERY($query);

			$query =  "UPDATE `MZ_Karma` set Karma='A' WHERE ((Karma='T') or (Karma='O')) and ((3*ATK)>=TK) ";
			$result = @MySQL_QUERY($query);

			$query =  "REPLACE INTO MZ_Karma (select T.TiD,now() as TimeStamp, now() as firstFrag, now() as lastFrag, 0 as kills, 0 as TK, 0 as ATK, 0 as MK, 'NK' as Karma  from MZ_Trolls as T left join MZ_Karma as K on K.TiD=T.TiD where K.TiD is null) ";
			$result = @MySQL_QUERY($query);

			$query =  "UPDATE  MZ_Cron set Value='3' WHERE Field='karma_step'";			// next step
			$result = @MySQL_QUERY($query);
		} else if ($karma_step==3) {				// génération du ficheir de TAG	

		  	$TAGfile="../Tags/tmpTags.csv"; 
		    $fd = @fopen($TAGfile, "w+");
		    if ($fd) {
				fputs($fd, "I;http://$WEB_HEBERGEUR/skin/mk.png".chr(10));			
				fputs($fd, "I;http://$WEB_HEBERGEUR/skin/ok.png".chr(10));	
				fputs($fd, "I;http://$WEB_HEBERGEUR/skin/tk.png".chr(10));
				fputs($fd, "I;http://$WEB_HEBERGEUR/skin/ak.png".chr(10));
				fputs($fd, "I;http://$WEB_HEBERGEUR/skin/nk.png".chr(10));
				fputs($fd, "D;[i]Alimentation mensuelle:[/i] ".chr(10));						#+62

				fputs($fd, "D;[b]aucun[/b] troll, ".chr(10));								#+0
				fputs($fd, "D;[b]1[/b] troll, ".chr(10));									#+0
				for ($i=2; $i<30; $i++) fputs($fd, "D;[b]".$i."[/b] trolls, ".chr(10));		#+1 à #+29
				fputs($fd, "D;[b]30[/b] trolls et plus, ".chr(10));							#+30

				for ($i=1; $i<30; $i++) fputs($fd, "D;dont [b]".$i."[/b] TK, ".chr(10));			#+1 à #+29
				fputs($fd, "D;dont plus de [b]30[/b] TK, ".chr(10));						#+30

				fputs($fd, "D;[b]aucun[/b] monstre.".chr(10));										#+31
				fputs($fd, "D;[b]1[/b] monstre.".chr(10));									#+31
				for ($i=2; $i<30; $i++) fputs($fd, "D;[b]".$i."[/b] monstres.".chr(10));	#+32 à #+60
				fputs($fd, "D;[b]30[/b] monstres et plus! ".chr(10));						#+61

				$query =  "SELECT TiD, lastFrag, firstFrag, Tk, Atk, Mk, Karma from `MZ_Karma` order by TiD";
				$result = MySQL_QUERY($query);
				
				$nData=@MySQL_NUM_ROWS($result);
				for ($i=0; $i<$nData; $i++) { #gestion des égalités
					if ($_FOPEN_EXTERNAL) set_time_limit(0);				
		   			$TiD=mysql_result($result,$i,"TiD");
				   	$firstFrag=mysql_result($result,$i,"firstFrag");
				   	$lastFrag=mysql_result($result,$i,"lastFrag");
				   	$Tk=mysql_result($result,$i,"Tk");
				   	$Ak=mysql_result($result,$i,"ATk");
				   	$Mk=mysql_result($result,$i,"Mk");
				   	$Karma=mysql_result($result,$i,"Karma");

					$nbjours = round((strtotime($lastFrag) - strtotime($firstFrag))/(60*60*24)+1);
					
					switch ($Karma){
						case 'M': $regime=0; break;
						case 'O': $regime=1; break;
						case 'T': $regime=2; break;
						case 'A': $regime=3; break;
						default: $regime=4; break;
					}
					

					if ($nbjours>0) {					#Mensualisation

						$rateTK=round((30*$Tk)/$nbjours); if (($Tk>0) && ($rateTK==0)) $rateTK=1;
						$rateAK=round((30*$Ak)/$nbjours); if (($Ak>0) && ($rateAK==0)) $rateAK=1;
						$rateMK=round((30*$Mk)/$nbjours); if (($Mk>0) && ($rateMK==0)) $rateMK=1;

						$regime.=";0"; 		// Alimentation mensuelle
						if 	($rateTK>30) $tagTK=31; else $tagTK=1+$rateTK; 
						$regime.=";$tagTK"; 			
						if 	($rateAK>30) $tagAK=61; else $tagAK=$rateAK+31; 
						if 	($rateAK>0) $regime.=";$tagAK"; 			
						if 	($rateMK>30) $tagMK=92; else $tagMK=62+$rateMK; 
						$regime.=";$tagMK"; 			
					}
					
				   	$tabTag="T;$TiD;$regime".chr(10);
					fputs($fd, $tabTag);
				} 			   
				fclose($fd);
			}
	
			$query =  "UPDATE  MZ_Cron set Value='4' WHERE Field='karma_step'";			// next step
			$result = @MySQL_QUERY($query);
		} else if ($karma_step==4) {				//Mise en prod du fichier de tag

			copy("../Tags/tmpTags.csv", "../Tags/ZZTags.csv");  
			
			$query =  "UPDATE  MZ_Cron set Value='5' WHERE Field='karma_step'";			// terminer le script!
			$result = @MySQL_QUERY($query);
		} else {		// le travail quotidien est terminé
			//-----------------------------------------------------------------------------------------------------------------
			$next_fire=date("Y-m-d H:i:s",mktime(0,0,0,date("m"),date("d")+1,date("Y")));	// Plus de mise à jour avant demain
	  		$query="UPDATE MZ_Crontab SET next_fire='$next_fire' WHERE id='$_cron_id'";		
	  		@MySQL_QUERY($query);			
		}
	}

  	_sqlclose();		# -------------- Fermeture DB  
  

?>