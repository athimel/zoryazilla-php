<?
session_cache_limiter("nocache");
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
_print("<TABLE width=600><TR><TD>
<TABLE width=100%><TR><TD>
<I><b><u><font size=+1>Fusion ZZ 2.0:</font></I></b></u><br>
<br><br>Comme vous l'avez remarquez l'hébergement WEB de ZoryaZilla a changé. J'ai quitté <i>ironie.org</i> <BR>
dans la précipitation, puis free.fr tout aussi rapidement. <BR>
ZZ est maintenant hébergé par <b>1&1</b> en espérant plus de stabilité!!!!<BR>
Merci de votre compréhension à tous.<br>

<br>Amicalement,
<br><A HREF=http://games.mountyhall.com/mountyhall/Messagerie/MH_Messagerie.php?cat=3&dest=28468><b>Zo</b></A>.
<br>
<!--<br><I><b><u>Le forum:</I></b></u> <a target=_blank href=http://z0rya.free.fr/forum><font size=+1>http://z0rya.free.fr/forum/</font></a><BR>!-->

</TD></TR></TABLE>
</TD></TR></TABLE>");

#<A HREF=http://games.mountyhall.com/mountyhall/Messagerie/MH_Messagerie.php?cat=3&dest=28468>Zorya.</A>
#* Pensez de temps en temps à  consulter le forum à la section <A target=_blank HREF=http://z0rya.free.fr/phpBB2/viewforum.php?f=6>ZZ à besoin de vous</A> !



?>