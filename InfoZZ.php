<?
session_cache_limiter("nocache");
require_once("Lib/libutf8.inc.php"); 
#========================================================================================
#Gestion de la Session de Login
if (!empty($_SESSION['login'])) { #Recupération de l'ID de Session
	$ZZ_TID=$_SESSION['login'] ;
} else {
	die();
}

#========================================================================================
  _print("<TABLE width=600><TR><TD>"); 


  $mysql=_sqlconnect();	# -------------- Ouverture DB  
  $query1 =  "SELECT SHRiD FROM `MZ_Share` WHERE TiD=$ZZ_TID and link='I'";		// Mes demande de partage pas encore acceptées
  #echo "$query1<BR>";
  $result1 = @MySQL_QUERY($query1);
  $query2 =  "SELECT TiD FROM `MZ_Share` WHERE SHRiD=$ZZ_TID and link='I'";		// Les demandes partage que je n'ai pas encore acceptées
  #echo "$query2<BR>";
  $result2 = @MySQL_QUERY($query2);
  $query3 =  "SELECT count(TiD) as count FROM `MZ_Share` WHERE TiD!=$ZZ_TID and SHRiD=$ZZ_TID and link='S'";		
  #echo "$query3<BR>";
  $result3 = @MySQL_QUERY($query3);
  _sqlclose();		# -------------- Fermeture DB   

  $nData = @MySQL_NUM_ROWS($result1);
  if ($nData>0) { #========================================= On demande validation de partage
		$waitValid="";		
	    $sendMP="http://games.mountyhall.com/mountyhall/Messagerie/MH_Messagerie.php?cat=3&title=Pourrais-tu%20valider%20ma%20demande%20de%20partage%20ZZ?&dest=";
			for ($i=0; $i<$nData; $i++) {
				$aTiD=mysql_result($result1,$i,"SHRiD");
 	 	 		$sendMP.="+$aTiD,";
		 	 	$waitValid.="#<FONT COLOR=BLUE><B>$aTiD</B></FONT> ";
	 		}
		_print("<IMG SRC=MH/Images/Bullet-yeux.gif WIDTH=61 HEIGHT=31 BORDER=0 ALIGN=TOP><FONT COLOR=RED><U><B>ATTENTION</B></U>: Vous attendez des validations de partages.");
		_print("<br>Vous attendez la validation de: $waitValid [<A HREF=$sendMP>envoyer un MP</A>]<BR><BR>");
  }

  $nData = @MySQL_NUM_ROWS($result2);
  if ($nData>0) { #========================================= On demande votre accord
		$waitValid="";	
		$User="";	
	    $sendMP="http://games.mountyhall.com/mountyhall/Messagerie/MH_Messagerie.php?cat=3&title=Pouvez-vous%20valider%20ma%20demande%20de%20partage%20ZZ?&dest=";
			for ($i=0; $i<$nData; $i++) {
				$aTiD=mysql_result($result2,$i,"TiD");
				$User.="$aTiD,";	
		 	 	$waitValid.="#<FONT COLOR=BLUE><B>$aTiD</B></FONT> ";
	 		}
		_print("<IMG SRC=MH/Images/Bullet-yeux.gif WIDTH=61 HEIGHT=31 BORDER=0 ALIGN=TOP><FONT COLOR=RED><U><B>ATTENTION</B></U>: On attend après votre validation.<BR></FONT>");
		_print("Ils attendent après votre validation: $waitValid [<A HREF=zoryazilla.php?action=MyShare&TypeShr=GrantShr&User=$User>Accepter</A>]
													       &nbsp;[<A HREF=zoryazilla.php?action=MyShare&TypeShr=RemoveShr&User=$User>Refuser</A>]
													       &nbsp;[<A HREF=zoryazilla.php?action=MyShare>Voir</A>]
															<BR><BR>");
  }


  $nData = @MySQL_NUM_ROWS($result3);
  if ($nData>0) { #========================================= On demande votre accord
		$nTiD=mysql_result($result3,0,"count");
		if ($nTiD>0) {
		   _print("Il y a <b>$nTiD</b> Troll(s) qui partage ZZ avec vous. (<A HREF=zoryazilla.php?&action=MyShare&PG=".urlencode($PG).">La console</A>)!<BR>");
		} else {
		   _print("Vous ne partagez votre ZZ avec personne. (<A HREF=zoryazilla.php?&action=MyShare&PG=".urlencode($PG).">La console</A>)!<BR>");
        }
  }


  #if ($ZZversion>$sSource[3]) _print("<IMG SRC=MH/Images/Bullet-yeux.gif WIDTH=61 HEIGHT=31 BORDER=0 ALIGN=TOP><FONT COLOR=RED><U><B>ATTENTION</B></U> : La version  <B><a href=XPI/zoryazilla.xpi onclick=\"xpi={'zoryazilla':this.href};InstallTrigger.install(xpi);return false;\">ZoryaZilla $ZZversion</a></B> est disponible!<BR></FONT>");

  _print("</TD></TR></TABLE>");
?>

