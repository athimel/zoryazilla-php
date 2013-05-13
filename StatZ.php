<TABLE width=600><TR><TD>
<?
  #=======================================================
  #require_once("./Config/_sqlconf.php");
  require_once("Lib/libutf8.inc.php");  	

  #=======================================================
  $OutOfDate=date("Y-m-d H:i:s",mktime(date("H"),date("i"),date("s"),date("m")-1,date("d"),date("Y")));
  #$OutOfDateI="2008-05-29 11:30:00";	# => Migré sur Ironie.org

  #=======================================================
  #On ouvre le fichier du jour pour soulager de la DB  	
  $STATfile="Tokens/Stat.html"; #(mise à jour perpétuelle pour vérif ironie)
  if ((!is_file($STATfile)) || (date("d-m-Y")!=date("d-m-Y",filemtime($STATfile)))) {

    $mysql=_sqlconnect();	# -------------- Ouverture DB  
  	$query =  "SELECT count(TiD) as count FROM `MZ_Profil` WHERE `TimeStamp` > '$OutOfDate'";
	$result1 = @MySQL_QUERY($query);

  	$query =  "SELECT distinct nom FROM `MZ_Groupe` ";
	$result2 = @MySQL_QUERY($query);

  	$query =  "SELECT count(gogo) as count FROM `MZ_Gogo`";
	$result3 = @MySQL_QUERY($query);

  	$query =  "SELECT count(TimeStamp) as count FROM `MZ_CdM` ";
	$result4 = @MySQL_QUERY($query);
	
  	$query =  "SELECT count(MeID) as count FROM `MZ_Insulte` ";
	$result5 = @MySQL_QUERY($query);
	
  	$query =  "SELECT count(TimeStamp) as count FROM `MZ_Piege` ";
	$result6 = @MySQL_QUERY($query);

  	$query =  "SELECT count(TimeStamp) as count FROM `MZ_Attaque` ";
	$result7 = @MySQL_QUERY($query);

  	$query =  "SELECT sum(PA) as count FROM `MZ_Glandouille` ";
	$result8 = @MySQL_QUERY($query);

  	$query =  "SELECT count(P.TiD) as count, P.Troll FROM `MZ_CdM` as C INNER JOIN `MZ_Profil` as P ON (P.TiD=C.TiD) WHERE (C.TimeStamp>'$OutOfDate') group By C.TiD order by count desc";
	$result9 = @MySQL_QUERY($query);
	
  	$query =  "SELECT count(P.TiD) as count, P.Troll FROM `MZ_Insulte` as C INNER JOIN `MZ_Profil` as P ON (P.TiD=C.TiD) WHERE (C.TimeStamp>'$OutOfDate') group By C.TiD order by count desc";
	$result10 = @MySQL_QUERY($query);

  	$query =  "SELECT count(P.TiD) as count, P.Troll FROM `MZ_Piege` as C INNER JOIN `MZ_Profil` as P ON (P.TiD=C.TiD) WHERE (C.MM>0) and (C.TimeStamp>'$OutOfDate') group By C.TiD order by count desc";
	$result11 = @MySQL_QUERY($query);

  	$query =  "SELECT count(P.TiD) as count, P.Troll FROM `MZ_Attaque` as C INNER JOIN `MZ_Profil` as P ON (P.TiD=C.TiD) WHERE (C.TimeStamp>'$OutOfDate') group By C.TiD order by count desc";
	$result12 = @MySQL_QUERY($query);

  	$query =  "SELECT sum(G.PA) as count, P.Troll FROM `MZ_Glandouille` as G INNER JOIN `MZ_Profil` as P ON (P.TiD=G.TiD) WHERE (G.TimeStamp>'$OutOfDate')group By G.TiD order by count desc";
	$result13 = @MySQL_QUERY($query);

  	$query =  "SELECT count(U.TiD) as count FROM `MZ_User` as U INNER JOIN `MZ_Profil` as P ON (P.TiD=U.TiD) WHERE (P.TimeStamp>'$OutOfDate')";
	$result14 = @MySQL_QUERY($query);

    _sqlclose();		# -------------- Fermeture DB   

    $fd=fopen("$STATfile", "w+");
#***** LA Database
	fputs($fd, _utf8("<U><I>La base de données de <B>ZoryaZilla</B></I></U>:&nbsp; <I>(jusqu'hier)<TABLE CELLSPACING=0 BORDER=0 CELLPADDING=0>"));
	#=======================================================
  	#$query =  "SELECT count(TiD) as count FROM `MZ_Profil` WHERE `TimeStamp` > '$OutOfDate'";
	$nData = @MySQL_NUM_ROWS($result1);
	if ($nData>0) {  
	   	$count=mysql_result($result1,0,"count");
	   	$count2=0;
		$nData = @MySQL_NUM_ROWS($result14);
		if ($nData>0) {  
		   	$count2=mysql_result($result14,0,"count");
		}
	 	fputs($fd, _utf8("<TR><TD>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</TD><TD>Nombre de Trolls:&nbsp;</TD><TD><B>$count</B> <i>(dont $count2 en version Fusion)</i></TD></TR>"));
	}

	#=======================================================
  	#$query =  "SELECT distinct nom FROM `MZ_Groupe` ";
	$nData = @MySQL_NUM_ROWS($result2);
	if ($nData>0) {  
	 	fputs($fd, _utf8("<TR><TD></TD><TD>Nombre de Coteries:&nbsp;</TD><TD><B>$nData</B></B></TD></TR>"));
	}

	#=======================================================
  	#$query =  "SELECT count(gogo) as count FROM `MZ_Gogo`";
	$nData = @MySQL_NUM_ROWS($result3);
	if ($nData>0) {  
	   	$count=mysql_result($result3,0,"count");
	 	fputs($fd, _utf8("<TR><TD></TD><TD>Nombre de Gowaps:&nbsp;</TD><TD><B>$count</B></TD></TR>"));
	}

	#=======================================================
  	#$query =  "SELECT count(TimeStamp) as count FROM `MZ_CdM` ";
	$nData = @MySQL_NUM_ROWS($result4);
	if ($nData>0) {  
	   	$count=mysql_result($result4,0,"count");
	 	fputs($fd, _utf8("<TR><TD></TD><TD>Nombre de CdM:&nbsp;</TD><TD><B>$count</B></TD></TR>"));
	}

	#=======================================================
  	#$query =  "SELECT count(MeID) as count FROM `MZ_Insulte` ";
	$nData = @MySQL_NUM_ROWS($result5);
	if ($nData>0) {  
	   	$count=mysql_result($result5,0,"count");
	 	fputs($fd, _utf8("<TR><TD></TD><TD>Nombre d'Insultes:&nbsp;</TD><TD><B>$count</B></TD></TR>"));
	}

	#=======================================================
  	#$query =  "SELECT count(TimeStamp) as count FROM `MZ_Piege` ";
	$nData = @MySQL_NUM_ROWS($result6);
	if ($nData>0) {  
	   	$count=mysql_result($result6,0,"count");
	 	fputs($fd, _utf8("<TR><TD></TD><TD>Nombre de Pieges:&nbsp;</TD><TD><B>$count</B> <I>(actifs)</I></TD></TR>"));
	}

	#=======================================================
  	#$query =  "SELECT count(TimeStamp) as count FROM `MZ_Attaque` ";
	$nData = @MySQL_NUM_ROWS($result7);
	if ($nData>0) {  
	   	$count=mysql_result($result7,0,"count");
	 	fputs($fd, _utf8("<TR><TD></TD><TD>Nombre d'Attaques: </TD><TD><B>$count</B></TD></TR>"));
	}

	#=======================================================
  	#$query =  "SELECT sum(PA) as count FROM `MZ_Glandouille` ";
	$nData = @MySQL_NUM_ROWS($result8);
	if ($nData>0) {  
	   	$count=mysql_result($result8,0,"count");
	 	fputs($fd, _utf8("<TR><TD></TD><TD>PA dépensés à Glandouiller:&nbsp</TD><TD><B>$count</B></TD></TR>"));
	}
	fputs($fd, _utf8("</TABLE>"));

#***** Hall of Fame
	fputs($fd, _utf8("<BR><U><I><B>Hall of Fame</B></I></U>:&nbsp; <I>(des 30 derniers jours jusqu'hier)</I><TABLE>"));
	#=======================================================
  	#$query =  "SELECT count(P.TiD) as count, P.Troll FROM `MZ_CdM` as C INNER JOIN `MZ_Profil` as P ON (P.TiD=C.TiD) WHERE (C.TimeStamp>'$OutOfDate') group By C.TiD order by count desc";
	$nData = @MySQL_NUM_ROWS($result9);
	if ($nData>0) {  
	   	$fame=mysql_result($result9,0,"Troll");
	   	$count=mysql_result($result9,0,"count");
	 	fputs($fd, _utf8("<TR><TD></TD><TD>Le fou de la CdM:&nbsp;</TD><TD><B>$fame</B> <I>(avec <B>$count</B> CdM)</I></TD></TR>"));
	 	for ($i=1; $i<$nData; $i++) { #gestion des égalités
		   	$counti=mysql_result($result9,$i,"count");
		   	if ($count==$counti) {
			   	$fame=mysql_result($result9,$i,"Troll");
			 	fputs($fd, _utf8("<TR><TD></TD><TD></TD><TD><B>$fame</B> <I>(ex-aequo)</I></TD></TR>"));
		   	} else { $i=$nData ; } # on sort
	 	}
	}
	#=======================================================
  	#$query =  "SELECT count(P.TiD) as count, P.Troll FROM `MZ_Insulte` as C INNER JOIN `MZ_Profil` as P ON (P.TiD=C.TiD) WHERE (C.TimeStamp>'$OutOfDate') group By C.TiD order by count desc";
	$nData = @MySQL_NUM_ROWS($result10);
	if ($nData>0) {  
	   	$fame=mysql_result($result10,0,"Troll");
	   	$count=mysql_result($result10,0,"count");
	 	fputs($fd, _utf8("<TR valign=top><TD></TD><TD>Le roi de l'insulte:&nbsp;</TD><TD><B>$fame</B> <I>(avec <B>$count</B> Insultes... <FONT SIZE=-1>même pas peur)</FONT></I></TD></TR>"));
	 	for ($i=1; $i<$nData; $i++) { #gestion des égalités
		   	$counti=mysql_result($result10,$i,"count");
		   	if ($count==$counti) {
			   	$fame=mysql_result($result10,$i,"Troll");
			 	fputs($fd, _utf8("<TR><TD></TD><TD></TD><TD><B>$fame</B> <I>(ex-aequo)</I></TD></TR>"));
		   	} else { $i=$nData ; } # on sort
	 	}
	}
	#=======================================================
  	#$query =  "SELECT count(P.TiD) as count, P.Troll FROM `MZ_Piege` as C INNER JOIN `MZ_Profil` as P ON (P.TiD=C.TiD) WHERE (C.MM>0) and (C.TimeStamp>'$OutOfDate') group By C.TiD order by count desc";
	$nData = @MySQL_NUM_ROWS($result11);
	if ($nData>0) {  
	   	$fame=mysql_result($result11,0,"Troll");
	   	$count=mysql_result($result11,0,"count");
	 	fputs($fd, _utf8("<TR valign=top><TD></TD><TD>Le maitre des pieges:&nbsp;</TD><TD><B>$fame</B> <I>(<FONT SIZE=-1>même pas mal</FONT>)</I></TD></TR>"));
	 	for ($i=1; $i<$nData; $i++) { #gestion des égalités
		   	$counti=mysql_result($result11,$i,"count");
		   	if ($count==$counti) {
			   	$fame=mysql_result($result11,$i,"Troll");
			 	fputs($fd, _utf8("<TR><TD></TD><TD></TD><TD><B>$fame</B> <I>(ex-aequo)</I></TD></TR>"));
		   	} else { $i=$nData ; } # on sort
	 	}
	}
	#=======================================================
  	#$query =  "SELECT count(P.TiD) as count, P.Troll FROM `MZ_Attaque` as C INNER JOIN `MZ_Profil` as P ON (P.TiD=C.TiD) WHERE (C.TimeStamp>'$OutOfDate') group By C.TiD order by count desc";
	$nData = @MySQL_NUM_ROWS($result12);
	if ($nData>0) {  
	   	$fame=mysql_result($result12,0,"Troll");
	   	$count=mysql_result($result12,0,"count");
	 	fputs($fd, _utf8("<TR valign=top><TD></TD><TD>Le bourrin en chef:&nbsp;</TD><TD><B>$fame</B> <I>(avec <B>$count</B> Attaques)</I></TD></TR>"));
	 	for ($i=1; $i<$nData; $i++) { #gestion des égalités
		   	$counti=mysql_result($result12,$i,"count");
		   	if ($count==$counti) {
			   	$fame=mysql_result($result12,$i,"Troll");
			 	fputs($fd, _utf8("<TR><TD></TD><TD></TD><TD><B>$fame</B> <I>(ex-aequo)</I></TD></TR>"));
		   	} else { $i=$nData ; } # on sort
	 	}
	}

	#=======================================================
  	#$query =  "SELECT sum(G.PA) as count, P.Troll FROM `MZ_Glandouille` as G INNER JOIN `MZ_Profil` as P ON (P.TiD=G.TiD) WHERE (G.TimeStamp>'$OutOfDate')group By G.TiD order by count desc";
	$nData = @MySQL_NUM_ROWS($result13);
	if ($nData>0) {  
	   	$fame=mysql_result($result13,0,"Troll");
	   	$count=mysql_result($result13,0,"count");
	 	fputs($fd, _utf8("<TR valign=top><TD></TD><TD>Le plus gros glandouilleur:&nbsp;</TD><TD><B>$fame</B> <I>(avec <B>$count</B> PA dépensés)</I></TD></TR>"));
	 	for ($i=1; $i<$nData; $i++) { #gestion des égalités
		   	$counti=mysql_result($result13,$i,"count");
		   	if ($count==$counti) {
			   	$fame=mysql_result($result13,$i,"Troll");
			 	fputs($fd, _utf8("<TR><TD></TD><TD></TD><TD><B>$fame</B> <I>(ex-aequo)</I></TD></TR>"));
		   	} else { $i=$nData ; } # on sort
	 	}
	}
	fputs($fd, _utf8("</TABLE>"));
	fclose($fd);
  }
  # Affichage du fichier de STATistiques
  $fd=fopen("$STATfile", "r");
  while (!feof($fd)) echo fgets($fd);
  fclose($fd);
	
#***** Les data perso
	if (!empty($_SESSION['login'])) { #Recupération de l'ID de Session
	//if (isset($TiD)) {
		$TiD=$_SESSION['login'] ;
	    $mysql=_sqlconnect();	# -------------- Ouverture DB  

	  	$query =  "SELECT Troll FROM `MZ_Profil` WHERE (TiD=$TiD)";
		$result1 = @MySQL_QUERY($query);

	  	$query =  "SELECT count(TimeStamp) as count FROM `MZ_CdM` WHERE (TimeStamp>'$OutOfDate') and (TiD=$TiD)";
		$result2 = @MySQL_QUERY($query);

	  	$query =  "SELECT count(TimeStamp) as count FROM `MZ_Insulte` WHERE (TimeStamp>'$OutOfDate') and (TiD=$TiD)";
		$result3 = @MySQL_QUERY($query);

	  	$query =  "SELECT count(TimeStamp) as count FROM `MZ_Piege` WHERE (TimeStamp>'$OutOfDate') and (TiD=$TiD)";
		$result4 = @MySQL_QUERY($query);

	  	$query =  "SELECT count(TimeStamp) as count FROM `MZ_Attaque` WHERE (TimeStamp>'$OutOfDate') and (TiD=$TiD)";
		$result5 = @MySQL_QUERY($query);

	  	$query =  "SELECT sum(PA) as count FROM `MZ_Glandouille` WHERE (TimeStamp>'$OutOfDate') and (TiD=$TiD)";
		$result6 = @MySQL_QUERY($query);

	    _sqlclose();		# -------------- Fermeture DB   


		$nData = @MySQL_NUM_ROWS($result1);
		if ($nData>0) {  
		   	$fame=mysql_result($result1,0,"Troll");
			_print("<BR><U><I><B>A propos de</B></I></U>: <B>$fame</B><I> (des 30 derniers jours jusqu'aujourd'hui)<TABLE>");
			#=======================================================
		  	#$query =  "SELECT count(TimeStamp) as count FROM `MZ_CdM` WHERE (TimeStamp>'$OutOfDate') and (TiD=$TiD)";
			$nData = @MySQL_NUM_ROWS($result2);
			if ($nData>0) {  
			   	$count=mysql_result($result2,0,"count");
			 	_print("<TR><TD></TD><TD>Nombre de CdM:&nbsp;</TD><TD><B>$count</B></TD></TR>");
			}
			#=======================================================
		  	#$query =  "SELECT count(TimeStamp) as count FROM `MZ_Insulte` WHERE (TimeStamp>'$OutOfDate') and (TiD=$TiD)";
			$nData = @MySQL_NUM_ROWS($result3);
			if ($nData>0) {  
			   	$count=mysql_result($result3,0,"count");
			 	_print("<TR><TD></TD><TD>Nombre d'Insultes:&nbsp;</TD><TD><B>$count</B></TD></TR>");
			}
			#=======================================================
		  	#$query =  "SELECT count(TimeStamp) as count FROM `MZ_Piege` WHERE (TimeStamp>'$OutOfDate') and (TiD=$TiD)";
			$nData = @MySQL_NUM_ROWS($result4);
			if ($nData>0) {  
			   	$count=mysql_result($result4,0,"count");
			 	_print("<TR><TD></TD><TD>Nombre de Pieges:&nbsp;</TD><TD><B>$count</B><I> (actifs)</I></TD></TR>");
			}
			#=======================================================
		  	#$query =  "SELECT count(TimeStamp) as count FROM `MZ_Attaque` WHERE (TimeStamp>'$OutOfDate') and (TiD=$TiD)";
			$nData = @MySQL_NUM_ROWS($result5);
			if ($nData>0) {  
			   	$count=mysql_result($result5,0,"count");
			 	_print("<TR><TD></TD><TD>Nombre d'Attaques:&nbsp;</TD><TD><B>$count</B></TD></TR>");
			}

			#=======================================================
		  	#$query =  "SELECT sum(PA) as count FROM `MZ_Glandouille` WHERE (TimeStamp>'$OutOfDate') and (TiD=$TiD)";
			$nData = @MySQL_NUM_ROWS($result6);
			if ($nData>0) {  
			   	$count=mysql_result($result6,0,"count");
			   	if ($count>0) _print("<TR><TD></TD><TD>PA dépensés à Glandouiller:&nbsp</TD><TD><B>$count</B> PA dépensés</TD></TR>");
			}
			_print("</TABLE>");
		}
	}
?>
</TD></TR></TABLE>
