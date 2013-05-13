<?
session_cache_limiter("nocache");
session_start();
require("_global.php"); 
#require_once("Lib/libutf8.inc.php"); 
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1		pour empecher la mise en cache (cache trop important avec ironie ou FF8) !!!
header('Content-Type: text/html; charset=iso-8859-1'); 								// pour les caractère accentué
require_once("./Config/_sqlconf.php");

//==============================================================================
if ($PG=="") $PG="MH/packMH_parchemin";
iF ((substr($PG, 1, 1)==":")||(substr($PG, 0, 1)=="/")) $PG="FILE://".$PG;
$PG=mb_eregi_replace("\\\'", "'", $PG);       #caractere protégé \'
$PG=mb_eregi_replace('\\\"', '"', $PG);       #caractere protégé \"
$PG=str_replace('\\\\', '\\', $PG);			  #caractere protégé \\

print('<LINK REL="stylesheet" HREF="'.$PG.'/css/MH_Style_Play.css" TYPE="text/css">');
print("<TABLE><TR><TD width=10></TD><TD>");

//==============================================================================
$_SESSION['login']=""; 		// on ferme la session courante si elle était ouverte

If (!isset($ZZ_TID))  { Die("Erreur accès à ZoryaZilla: Mauvais identifiant Troll!"); }
If (!isset($ZZ_PWD))  { Die("Erreur accès à ZoryaZilla: Mauvais password"); }

$TiD=$ZZ_TID;

if ($action=="Autologout") {
	print("Password de <i><b>$TiD</b></i> effacé de Firefox!!");  
	print("<FORM name=FormDlgBox><INPUT TYPE=hidden Name=ZZSession Value=\"\"></FORM>");
	die();
}

$mysql=_sqlconnect();	# -------------- Ouverture DB  
if ((strlen($ZZ_PWD)<30) && (strlen($ZZ_PWD)>0)) $ZZ_PWD=md5("$ZZ_PWD");

$query =  "SELECT TiD FROM `MZ_User` where (TiD=$TiD) and (Pwd='$ZZ_PWD')";
#echo "$query<BR>";     
$result = MySQL_QUERY($query);   
$nData = @MySQL_NUM_ROWS($result);
if ($nData>0) { #autologon ZZ interface
	$_SESSION['login']=$TiD; 
}	else $TiD=0;

$query =  "SELECT Troll FROM `MZ_Trolls` where (TiD=$TiD)";
#echo "$query<BR>";     
$result = MySQL_QUERY($query);   
$nData = @MySQL_NUM_ROWS($result);
if ($nData>0) { #autologon ZZ interface
	$Troll=mysql_result($result,0,"Troll");
}	else $Troll="";

_sqlclose();		# -------------- Fermeture DB  

If ($TiD<=0)  Die("Erreur accès à ZoryaZilla: Mauvais identifiant Troll!"); 

print("Le password du Troll <b>$Troll</b> (Id=#<i><b>$TiD</b></i>) a été sauvegardé dans Firefox!!");  
print("<FORM name=FormDlgBox><INPUT TYPE=hidden Name=ZZSession Value=\"$ZZ_PWD\"><INPUT TYPE=hidden Name=TiD Value=\"$TiD\">");
if ($Troll!="") print("<INPUT TYPE=hidden Name=Troll Value=\"$Troll\">");
print("</FORM>");
if ($Source!="") print("Retour au jeu: <A HREF='$Source'>$Source</A>");


#========================================================================================
print("</TD></TR></TABLE>");

?>