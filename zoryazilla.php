<? 
session_cache_limiter("nocache");
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1		pour empecher la mise en cache (cache trop important avec ironie ou FF8) !!!

#========================================================================================
session_start();
#========================================================================================
#require("_global.php");   #=> fait par la lib UTF-8
require_once("Lib/libutf8.inc.php"); 
require_once("./Config/_sqlconf.php");
#require_once("XPI/ZZversion.php"); 
#========================================================================================
#Gestion de la Session de Login
if (!empty($_SESSION['login'])) { #Recupération de l'ID de Session
	$ZZ_TID=$_SESSION['login'] ;
	#echo "Session $ZZ_TID<br>";
}


#========================================================================================
$HTTP_REFERER=$_SERVER["HTTP_REFERER"];
$ZZ_HOME="http://".$_SERVER["HTTP_HOST"].substr($_SERVER["PHP_SELF"], 0,strrpos($_SERVER["PHP_SELF"], "/"));
$ZZ_REMOTE_HOST="http://zorya.olympe.in/FZZ/Olympe";
//$ZZ_REMOTE_HOST="http://localhost/FZZ/Olympe";
#========================================================================================



#========================================================================================
/*if (isset($HTTP_GET_VARS["TiD"])) {#Securisation du TiD => GET restreint au site MH
	$refer=substr($_SERVER["HTTP_REFERER"], 7);
	$spos=strpos($refer, "/");
	if ($spos>0) $refer=substr($refer, 0, $spos);
	$self=$_SERVER["SERVER_NAME"];
	if (($refer=="")||($refer==$self)) $TiD="";	
	else if (($refer!="games.mountyhall.com")&&($refer!="m0lka.free.fr")&&($refer!="z0rya.free.fr")) $TiD="";			
}

if (isset($_POST["TiD"])) {#Securisation du TiD  => POST authorisé seulement à partir de localhost
	$refer=substr($_SERVER["HTTP_REFERER"], 7);
	$spos=strpos($refer, "/");
	if ($spos>0) $refer=substr($refer, 0, $spos);
	$self=$_SERVER["SERVER_NAME"];
	if (($refer=="")||($refer!=$self)) $TiD="";	
} */

#========================================================================================
#Conversion des caractères UTF-8 et Spéciaux
#========================================================================================
//$CoterieName=_strc($CoterieName);
$Source=_strc($Source);
if ($Source!="") {
 	if (substr($Source, 0, 8) == "https://"){
	 	$MHPRotocole="https://";
 		$MHRoot=substr($Source, 8); 
	} else {
	 	$MHPRotocole="http://";
 		$MHRoot=substr($Source, 7); 
	}
} else {
 	if ($HTTP_REFERER<>"") $MHPRotocole="http://"; else $MHPRotocole="https://";
	$MHRoot="games.mountyhall.com/";
}

$MHRoot=$MHPRotocole.substr($MHRoot, 0, strpos($MHRoot, '/'));
$MHPJView=$MHRoot."/mountyhall/View/PJView.php?ai_IDPJ=";
$MHGDView=$MHRoot."/mountyhall/View/AllianceView.php?ai_IDAlliance=";
$MHMEView=$MHRoot."/mountyhall/View/MonsterView.php?ai_IDPJ=";

$byPassMH=false;		#Pour débug en local => $byPassMH=true;

if ($PG=="") $PG="MH/packMH_parchemin";
iF ((substr($PG, 1, 1)==":")||(substr($PG, 0, 1)=="/")) $PG="FILE://".$PG;
$PG=_strc($PG);

#========================================================================================
_print('
<SCRIPT LANGUAGE="JavaScript" TYPE="text/JavaScript">
function onClick1() { 	 FormDlgBox.action.value="DlgBoxResetMDP";			FormDlgBox.submit(); }
function onClick2() {	 FormMenu.action.value="Login";						FormMenu.submit(); }
function onClick3() {	 FormMenu.action.value="Logout";					FormMenu.submit(); }
function onClick4() {  	 FormDlgBox.action.value="Autologout";	 			FormMenu.submit(); }
function onClick5() { 	 FormMenu.action.value="MonZZ";		 				FormMenu.submit(); }
function onClick6() { 	 FormMenu.action.value="Newzz";	 					FormMenu.submit(); }
function onClick7() {  	 FormMenu.action.value="StatZ";	 					FormMenu.submit(); }
function onClick8() {	 FormMenu2.action.value="MyShare";					FormMenu2.submit(); }
function onClick9() {	 FormMenu2.action.value="DlgBoxPiege";				FormMenu2.submit(); }
function onClick10() {	 FormMenu2.action.value="Prefs";					FormMenu2.submit(); }
function onClick11() {	 FormMenu2.action.value="showCarac";				FormMenu2.submit(); }
function onClick12() {	 FormMenu2.action.value="Coterie";					FormMenu2.submit(); }
function onClick13() {   FormMenu.action.value="CronZZ";	 				FormMenu.submit(); }
function onClick14() {   FormMenu.action.value="LogZZ";	 					FormMenu.submit(); }
function onClick15() {	 FormMenu2.action.value="DlgBoxDiplo";				FormMenu2.submit(); }
function onClick16() {	 FormMenu2.action.value="showGowap";				FormMenu2.submit(); }
function onClick17() {	 FormMenu.action.value="Script";					FormMenu.submit(); }
function onClick18() {	 FormMenu2.action.value="DlgBoxMap";				FormMenu2.submit(); }
function onClick19() {	 FormMenu2.action.value="DlgBoxVue";				FormMenu2.submit(); }
</SCRIPT>
<LINK REL="stylesheet" HREF="'.$PG.'/css/MH_Style_Play.css" TYPE="text/css">
<link rel="shortcut icon" href="skin/zorya.jpg" type="image/gif">
');

#========================================================================================
  if ($Source!="") {
  if ($Source=="MH") if ($HTTP_REFERER<>"") $Source=$HTTP_REFERER; else $Source="https://games.mountyhall.com/";
  _print("
 	<A href=http://www.mountyhall.com TARGET=_blank>
 	<IMG SRC=\"$PG/contenu/header.jpg\" WIDTH=780 BORDER=0 ALIGN=top></A> 
    <TABLE CELLSPACING=0 CELLPADDING=0 WIDTH=100% ALIGN=center BORDER=0>
    <TR>
    <TD WIDTH=55 BACKGROUND=\"$PG/fond/fond.jpg\">&nbsp;</TD>
	<TD VALIGN=top ALIGN=LEFT HEIGHT=1000>");
	if (substr($Source,0, 10)!="MH_Profil$") {#Cas particulier du Profil
	    _print("	<DIV ALIGN=right><A target=Contenu href=$Source CLASS=AllLinks TARGET=_top>[Retour]</A></DIV> ");
	}
}
_print("<TABLE><TR><TD width=10></TD><TD>");


#========================================================================================
# Affichage du Menu
#if ((strlen($ZZ_PWD)<30) && (strlen($ZZ_PWD)>0)) $ZZ_PWD=md5(_strc("$ZZ_PWD"));

#========================================================================================
# Vérification du mot de passe ZZ
#========================================================================================
if ($action=="") $action="MonZZ";
$fErrLogin=false;
if ($action=="openSession") {
    $mysql=_sqlconnect();	# -------------- Ouverture DB  
    $query =  "SELECT TiD FROM `MZ_User` WHERE (TiD=$ZZ_TID) and (Pwd='".md5(_strc("$ZZ_PWD"))."') ";
  	$result = @MySQL_QUERY($query);
  	$nData = @MySQL_NUM_ROWS($result);
  	if ($nData>0) {
		$_SESSION['login']=$ZZ_TID ; #on clos la session en cours
		$action="Newzz";
 	} else {
		$fErrLogin=true;
		$action="Login";
		$_SESSION['login']="" ; #on clos la session en cours
	}
}

#========================================================================================
if ((strlen($ZZ_PWD)<30) && (strlen($ZZ_PWD)>0)) $ZZ_PWD=md5(_strc("$ZZ_PWD"));


#========================================================================================
# MENU PRINCIPAL
#========================================================================================
$today=date("Y-m-d");
$yesterday=date("Y-m-d",mktime(date("H"),date("i"),date("s"),date("m"),date("d")-1,date("Y")));		
$mysql=_sqlconnect();	# -------------- Ouverture DB  
$query =  "select * from MZ_Cron where (Field in ('diplo_update', 'troll_update', 'guilde_update') and Value<>'$today') or (Field = 'karma_update' and Value<>'$yesterday') ";
$result = MySQL_QUERY($query);
_sqlclose();		# -------------- Fermeture DB  
$nData = @MySQL_NUM_ROWS($result);	

if ($nData>0) $SCHE_IMG="<IMG src=MH/redball.gif>&nbsp;"; else $SCHE_IMG="";

_print("
<FORM name=FormMenu method=post action=zoryazilla.php class=thin>
<INPUT TYPE=hidden Name=Page Value=\"$action\">
<INPUT TYPE=hidden Name=action>
<INPUT TYPE=hidden Name=Source Value=\"$Source\">
<INPUT TYPE=hidden Name=PG Value=\"$PG\">
<TABLE WIDTH=600 CELLSPACING=1 BORDER=0 CELLPADDING=0 CLASS=mh_tdborder><TR class=mh_tdtitre align=center><TD>
<TABLE WIDTH=100% CELLSPACING=0 BORDER=0 CELLPADDING=2><TR align=center>

<TD width=100><a CLASS=mh_links href=javascript:onClick6();>Newzz</A></TD>");

if ((!empty($_SESSION['login']))&&($action!="Logout")) {
	_print("<TD width=150><a CLASS=mh_links href=javascript:onClick5();>[Mon ZZ]</A></TD>");
	_print("<TD width=150><a CLASS=mh_links href=javascript:onClick14();>LogZZ</A></TD>");
	_print("<TD width=150><a CLASS=mh_links href=javascript:onClick17();>Scripts</A></TD>");
}else {
	_print("<TD width=150><a CLASS=mh_links></A></TD>");
	_print("<TD width=150><a CLASS=mh_links></A></TD>");
	_print("<TD width=150><a CLASS=mh_links></A></TD>");
}

_print("<TD width=100><a CLASS=mh_links></A></TD>
        <TD width=100><a CLASS=mh_links></A></TD>");
_print("<TD width=100><a CLASS=mh_links href=javascript:onClick13();>$SCHE_IMG"."Scheduler</A></TD>");
_print("<TD width=100><a CLASS=mh_links href=javascript:onClick7();>Les stats</A></TD>");

if ((empty($_SESSION['login']))||($action=="Logout")) _print("<TD width=150><a CLASS=mh_links href=javascript:onClick2();>Login</A></TD>");
else if ($Source!="") _print("<TD CLASS=mh_links width=150>".$_SESSION['login']."</TD>");
else _print("<TD width=150><a CLASS=mh_links href=javascript:onClick3();>Logout</A></TD>");

_print("</TR></TABLE></TD></TR></TABLE>
</FORM>
");

#========================================================================================
if ($byPassMH) _print("Page:[$action]<FONT SIZE=+2 COLOR=RED><BLINK>TESTING... TESTING... TESTING... TESTING...</BLINK></FONT>");


#========================================================================================
# Mauvais mot de passe pas de session en cours!
#========================================================================================
if ($fErrLogin) {
	_print("<BR>&nbsp<B>Erreur: Mot de passe pour <FONT COLOR=BLUE>$ZZ_TID</FONT> non valide!</B>");
	_print("
			<FORM method=post action=zoryazilla.php class=thin>
			<INPUT TYPE=hidden Name=Source Value=\"$Source\">
			<INPUT TYPE=hidden Name=ZZ_TID Value=\"$ZZ_TID\">
			<INPUT TYPE=hidden Name=PG Value=\"$PG\">
			<INPUT TYPE=hidden Name=action Value=\"Login\">
			<input class=mh_form_submit type=submit value=\"           Ok           \">
			</FORM>");
}
#========================================================================================
# Affichage de la boite de login
#========================================================================================
else if ($action=="Login") {
	if (empty($_SESSION['login'])) $Icone="login.png"; else  $Icone="logon.png"; 
	_print("<TABLE WIDTH=98% CELLSPACING=0 BORDER=0 CELLPADDING=2 ALIGN=center><TR><TD ALIGN=center><DIV CLASS=Titre2><b>Accès à ZoryaZilla</b></DIV></TD><TD align=right><img height=30 width=30 src=MH/$Icone></TD></TR></TABLE> 
		<FORM name=FormDlgBox method=post action=zoryazilla.php DefaultButton=\"id_login\" class=thin>
		
	<TABLE WIDTH=100% CELLSPACING=1 BORDER=0 CELLPADDING=0 CLASS=mh_tdborder><TR class=mh_tdtitre align=left><TD>
	<TABLE WIDTH=100% CELLSPACING=0 BORDER=0 CELLPADDING=2><TR align=left><TD>
		<TABLE><TR><INPUT TYPE=hidden Name=action Value=\"openSession\">
					<INPUT TYPE=hidden Name=PG Value=\"$PG\">
            	    <INPUT TYPE=hidden Name=Source Value=\"$Source\">
					<TD>ID de votre Troll : </TD><TD><INPUT type=text size=15 name=ZZ_TID value=\"$ZZ_TID\"></TD></TR><TR>
					<TD>Votre password d'accès à ZZ : </TD><TD><INPUT type=password size=15 name=ZZ_PWD value=\"$ZZ_PWD\"></TD></TR><TR>
					<TD align=left colspan=></TD>
					<TD align=center><input class=mh_form_submit id=\"id_login\" type=submit value=\"             Login            \">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input class=mh_form_submit type=submit value=\" Créer un compte \" onClick=javascript:onClick1();>&nbsp;&nbsp;<input class=mh_form_submit type=submit value=\" Mot de passe perdu \" onClick=javascript:onClick1();>&nbsp;&nbsp;&nbsp;&nbsp;
		</TD></TR></TABLE></FORM> 
		</TD></TR></TABLE></TD></TR></TABLE>
		");
#========================================================================================
# Affichage de la boite de auto-login
#========================================================================================
} else if ($action=="Autologon") {

	if (empty($_SESSION['login'])) $Icone="login.png"; else  $Icone="logon.png"; 
	_print("<TABLE WIDTH=98% CELLSPACING=0 BORDER=0 CELLPADDING=2 ALIGN=center><TR><TD ALIGN=center><DIV CLASS=Titre2><b>ZoryaZilla - Autologon</b></DIV></TD><TD align=right><img height=30 width=30 src=MH/$Icone></TD></TR></TABLE> 
		<FORM name=FormDlgBox method=post action=mzAutologon.php class=thin>
		
	<TABLE WIDTH=100% CELLSPACING=1 BORDER=0 CELLPADDING=0 CLASS=mh_tdborder><TR class=mh_tdtitre align=left><TD>
	<TABLE WIDTH=100% CELLSPACING=0 BORDER=0 CELLPADDING=2><TR align=left><TD>
		<TABLE><TR><INPUT TYPE=hidden Name=action Value=\"autoSession\">
					<INPUT TYPE=hidden Name=PG Value=\"$PG\">
            	    <INPUT TYPE=hidden Name=Source Value=\"$Source\">
		&nbsp;&nbsp;Pour pouvoir utiliser ZoryaZilla avec une connexion automatique à la database,<br>
		&nbsp;&nbsp;il faut sauvegarder le password une première fois dans firefox:<br><br>
					<TD>ID de votre Troll : </TD><TD><INPUT type=text size=15 name=ZZ_TID value=\"$ZZ_TID\"></TD></TR><TR>
					<TD>Votre password d'accès à ZZ : </TD><TD><INPUT type=password size=15 name=ZZ_PWD value=\"$ZZ_PWD\"></TD></TR>
					<TR><TD colspan=2 align=center>
					&nbsp;&nbsp;<input class=mh_form_submit type=submit value=\"  Sauver Mon Password  \">
					&nbsp;&nbsp;<input class=mh_form_submit type=submit value=\"  Effacer Mon Password  \" onClick=javascript:onClick4();>
					<br><br>&nbsp;&nbsp;&nbsp;&nbsp;<a href=zoryazilla.php?action=DlgBoxResetMDP>[Créer un compte]</a>
					</TD></TR></TABLE>
		<br><FONT COLOR=RED>Le mot de passe d'accès à ZoryaZilla sera crypté en md5 et sauvegardé dans cette instance de Firefox.<BR></FONT>
		<I><FONT COLOR=RED><U><B><FONT SIZE=+1>ATTENTION :</FONT></B></U><br><FONT SIZE=+1> Ne sauvegardez pas votre mot de passe sur un ordinateur public</FONT>
		</FORM>
		</TD></TR></TABLE></TD></TR></TABLE>

		");
#========================================================================================
# Deconnexion de la session
#========================================================================================
} else if ($action=="Logout") {

	$_SESSION['login']="" ; #on clos la session en cours

	_print("<TABLE WIDTH=98% CELLSPACING=0 BORDER=0 CELLPADDING=2 ALIGN=center><TR><TD ALIGN=center><DIV CLASS=Titre2><b>Accès à ZoryaZilla</b></DIV></TD><TD align=right><img height=30 width=30 src=MH/logout.png></TD></TR></TABLE> 
		<FORM name=FormDlgBox method=post action=zoryazilla.php class=thin>
		
	<TABLE WIDTH=100% CELLSPACING=1 BORDER=0 CELLPADDING=0 CLASS=mh_tdborder><TR class=mh_tdtitre align=left><TD>
	<TABLE WIDTH=100% CELLSPACING=0 BORDER=0 CELLPADDING=2><TR align=left><TD>
		<br>A bientôt!<br><br>
		</FORM>
		</TD></TR></TABLE></TD></TR></TABLE>
		");
}

if (empty($_SESSION['login'])) {
 	if ( 	($action!="DlgBoxResetMDP") && 
		 	($action!="DlgBoxChangeMDP") && 
		 	($action!="ResetMDP") && 
		 	($action!="ChangeMDP") && 
			($action!="Login") &&
			($action!="Autologon") &&
			($action!="Logout") &&
			($action!="Newzz") &&
			($action!="cronZZ") &&
		 	($action!="StatZ")) {  #tentative de bybass, on force sur saisie nouveau compte !!!!!! Tricheur?

		_print("<TABLE WIDTH=98% CELLSPACING=0 BORDER=0 CELLPADDING=2 ALIGN=center><TR><TD ALIGN=center><DIV CLASS=Titre2><b>Vous n'êtes pas authentifié à ZZ</b></DIV></TD><TD align=right><img height=30 width=30 src=MH/logout.png></TD></TR></TABLE> 
			<FORM name=FormDlgBox method=post action=zoryazilla.php class=thin>
			<TABLE WIDTH=100% CELLSPACING=1 BORDER=0 CELLPADDING=0 CLASS=mh_tdborder><TR class=mh_tdtitre align=left><TD>
			<TABLE WIDTH=100% CELLSPACING=0 BORDER=0 CELLPADDING=2><TR align=left><TD>
			<TABLE><TR><INPUT TYPE=hidden Name=action Value=\"openSession\">
					<INPUT TYPE=hidden Name=PG Value=\"$PG\">
            	    <INPUT TYPE=hidden Name=Source Value=\"$Source\">
					<TD>ID de votre Troll : </TD><TD><INPUT type=text size=15 name=ZZ_TID value=\"$ZZ_TID\"></TD></TR><TR>
					<TD>Votre password d'accès à ZZ : </TD><TD><INPUT type=password size=15 name=ZZ_PWD value=\"$ZZ_PWD\"></TD></TR><TR>
					<TD align=left colspan=></TD>
					<TD align=center><input class=mh_form_submit id=\"id_login\" type=submit value=\"             Login            \">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input class=mh_form_submit type=submit value=\" Créer un compte \" onClick=javascript:onClick1();>&nbsp;&nbsp;<input class=mh_form_submit type=submit value=\" Mot de passe perdu \" onClick=javascript:onClick1();>&nbsp;&nbsp;&nbsp;&nbsp;
			</TD></TR></TABLE></FORM>
			</TD></TR></TABLE></TD></TR></TABLE>");
	    die();  // On ne fait rien sans être authetifié!
    }
}

#========================================================================================
#sous menu 
#========================================================================================
if  (($action=="MonZZ")||($action=="DlgBoxPiege")||($action=="DlgBoxDiplo")||($action=="Prefs")||($action=="showCarac")||($action=="showGowap")||($action=="MyShare")||($action=="DlgBoxMap")||($action=="DlgBoxVue")) {
_print("
<FORM name=FormMenu2 method=post action=zoryazilla.php class=thin>
<INPUT TYPE=hidden Name=Page Value=\"$action\">
<INPUT TYPE=hidden Name=action>
<INPUT TYPE=hidden Name=Source Value=\"$Source\">
<INPUT TYPE=hidden Name=PG Value=\"$PG\">
<TABLE WIDTH=600 CELLSPACING=1 BORDER=0 CELLPADDING=0 CLASS=mh_tdborder><TR class=mh_tdtitre align=center><TD>
<TABLE WIDTH=100% CELLSPACING=0 BORDER=0 CELLPADDING=2><TR align=center>

<TD width=100><a CLASS=mh_links href=javascript:onClick11();>Amis</A></TD>
<TD width=100><a CLASS=mh_links href=javascript:onClick8();>Partages</A></TD>
<TD width=100><a CLASS=mh_links href=javascript:onClick19();>Vues</A></TD>
<TD width=100><a CLASS=mh_links href=javascript:onClick16();>Gowap&Co</A></TD>
<TD width=100><a CLASS=mh_links href=javascript:onClick9();>Pièges</A></TD>
<!--<TD width=100><a CLASS=mh_links href=javascript:onClick18();>Map</A></TD>-->
<TD width=100><a CLASS=mh_links href=javascript:onClick15();>Diplo</A></TD>
<TD width=100><a CLASS=mh_links href=javascript:onClick10();>Préférences</A></TD>
</TR></TABLE></TD></TR></TABLE></FORM>");


}

#<TD width=100><a CLASS=mh_links href=javascript:onClick12();>Ma Coterie</A></TD>



#========================================================================================
# Affichage de la boite de dialogue de Saisie Coterie
#========================================================================================
# Page de Creation de compte
if ($action=="DlgBoxResetMDP") {
	// Cycle => DlgBoxResetMDP => ResetMDP 
	$DialogBox="ResetMDP";
	
	if ($TiD!="") {
		$mysql=_sqlconnect();	# -------------- Ouverture DB  
	 	$query =  "SELECT Nom FROM `MZ_Groupe` WHERE TiD=$TiD";
		$result = @MySQL_QUERY($query);
	    _sqlclose();		# -------------- Fermeture DB  
		$nData = @MySQL_NUM_ROWS($result);
		if ($nData>0) {  # Password Coterie Pas Ok, saisie de Coterie/password
		 	$CoterieName=mysql_result($result,0,"Nom");
		}
	}

	_print("<TABLE WIDTH=98% CELLSPACING=0 BORDER=0 CELLPADDING=2 ALIGN=center><TR><TD ALIGN=center><DIV CLASS=Titre2><b>Changer/Définir le MdP d'authentification ZZ</b></DIV></TD></TR></TABLE> 
		<FORM name=FormDlgBox method=post action=zoryazilla.php class=thin>
		
	<TABLE WIDTH=100% CELLSPACING=1 BORDER=0 CELLPADDING=0 CLASS=mh_tdborder><TR class=mh_tdtitre align=left><TD>
	<TABLE WIDTH=100% CELLSPACING=0 BORDER=0 CELLPADDING=2><TR align=left><TD>
		
		<TABLE><TR><INPUT TYPE=hidden Name=action Value=$DialogBox>
				<INPUT TYPE=hidden Name=TiD Value=\"$TiD\">
				<INPUT TYPE=hidden Name=PG Value=\"$PG\">
                <INPUT TYPE=hidden Name=Source Value=\"$Source\">
		<TD>Saisir un Password d'accès à ZZ : </TD><TD><INPUT type=password size=15 name=ZZ_PWD1 value=\"\"></TD></TR><TR>
		<TD>Vérification du Password ZZ : </TD><TD><INPUT type=password size=15 name=ZZ_PWD2 value=\"\"></TD></TR><TR>
		<TD>ID de mon Troll : </TD><TD><INPUT type=text size=15 name=ZZ_TID value=\"$TiD\"></TD></TR><TR>
		<TD>Password MH de mon Troll<sup><font color=RED><b>*</b></FONT></sup> : </TD><TD><INPUT type=password size=15 name=TrollPWD></TD></TR><TR>
		<TD colspan=2 align=center>
		<input class=mh_form_submit type=submit value=\"      Valider      \">
		&nbsp;&nbsp;&nbsp;&nbsp;<input class=mh_form_submit type=submit value=\"       Annuler       \" onClick=javascript:onClickRetour();>
		</TD></TR></TABLE>
		</FORM>
		
		<BR><FONT SIZE=+1 COLOR=RED><B><I><sup>*</sup><U>PS</I></U></B> : Le mot de passe du Troll n'est pas stock&eacute;! </FONT><FONT COLOR=RED><I>(voir ci-dessous)</I></FONT>
		<BR><FONT SIZE=+1 COLOR=RED><U><B><I>ATTENTION</I></U></B> : </FONT><FONT COLOR=RED>
		<BR>!!! Il y aura un appel au script public de Mountyhall (donc, attention si vous utilisez d'autres interfaces) !!!</FONT>
		<BR>
	</TD></TR></TABLE></TD></TR></TABLE>
		
		<BR><BR>
		<I><FONT COLOR=BLUE><U><B><FONT SIZE=+1>Password du Troll</FONT></B></U> : Vous devez saisir un mot de passe 'sp&eacute;cifique' qui sera utilis&eacute; une seule fois.<BR>
	    PS:	Ce mot de passe ne sera pas stock&eacute;, il sert juste pour une premi&egrave;re authentification <BR>(v&eacute;rification par scripts public MH)<BR><BR>

		Tous savoir sur les scripts publics: <a target=_blank href=http://sp.mountyhall.com>http://sp.mountyhall.com</A><BR>
		Tous savoir sur le MdP restreint: <a target=_blank href=http://sp.mountyhall.com/hashing.php>http://sp.mountyhall.com/hashing.php</A>	    
		</FONT>
		");
#========================================================================================
# change Password Compte
} else if ($action=="DlgBoxChangeMDP") {
	if ($TiD!="") {
		$mysql=_sqlconnect();	# -------------- Ouverture DB  
	 	$query =  "SELECT Nom FROM `MZ_Groupe` WHERE TiD=$TiD";
		$result = @MySQL_QUERY($query);
	    _sqlclose();		# -------------- Fermeture DB  
		$nData = @MySQL_NUM_ROWS($result);
		if ($nData>0) {  # Password Coterie Pas Ok, saisie de Coterie/password
		 	$CoterieName=mysql_result($result,0,"Nom");
		}
	}

	_print("<TABLE WIDTH=98% CELLSPACING=0 BORDER=0 CELLPADDING=2 ALIGN=center><TR><TD ALIGN=center><DIV CLASS=Titre2><b>Changer le MdP d'authentification ZZ</b></DIV></TD></TR></TABLE> 
		<FORM name=FormDlgBox method=post action=zoryazilla.php class=thin>
		
	<TABLE WIDTH=100% CELLSPACING=1 BORDER=0 CELLPADDING=0 CLASS=mh_tdborder><TR class=mh_tdtitre align=left><TD>
	<TABLE WIDTH=100% CELLSPACING=0 BORDER=0 CELLPADDING=2><TR align=left><TD>
		
		<TABLE><TR><INPUT TYPE=hidden Name=action Value=ChangeMDP>
				<INPUT TYPE=hidden Name=TiD Value=\"$TiD\">
				<INPUT TYPE=hidden Name=PG Value=\"$PG\">
                <INPUT TYPE=hidden Name=Source Value=\"$Source\">
		<TD>ID de mon Troll : </TD><TD><INPUT type=text size=15 name=ZZ_TID value=\"$TiD\"></TD></TR><TR>
		<TD>Saisir l'ancien Password ZZ : </TD><TD><INPUT type=password size=15 name=ZZ_PWD0 value=\"\"></TD></TR><TR>
		<TD>Saisir un Password d'accès à ZZ : </TD><TD><INPUT type=password size=15 name=ZZ_PWD1 value=\"\"></TD></TR><TR>
		<TD>Vérification du Password ZZ : </TD><TD><INPUT type=password size=15 name=ZZ_PWD2 value=\"\"></TD></TR><TR>
		<TD colspan=2 align=center>
		<input class=mh_form_submit type=submit value=\"      Valider      \">
		&nbsp;&nbsp;&nbsp;&nbsp;<input class=mh_form_submit type=submit value=\"       Annuler       \" onClick=javascript:onClickRetour();>
		</TD></TR></TABLE>
		</FORM>
		<BR>
	</TD></TR></TABLE></TD></TR></TABLE>
		
		");

#========================================================================================
# reset Password Compte
} else if ($action=="ResetMDP") {
  $flgError=false;
  $idGuilde=0;

  $ZZ_PWD=$ZZ_PWD1;
  if($ZZ_PWD1!=$ZZ_PWD2) { #Erreur de saisie
      _print("<BR>&nbsp<B>Erreur: <FONT COLOR=BLUE>Les Passwords saisis son différents</FONT>!</B>");
      $flgError=true;
  } else {
	  if ((strlen($ZZ_PWD)<30) && (strlen($ZZ_PWD)>0)) $ZZ_PWD=md5("$ZZ_PWD");     

	  if($ZZ_PWD=="") { #coterie sans PWD
	      _print("<BR>&nbsp<B>Erreur: <FONT COLOR=BLUE>Un Troll sans Password n'est pas authorisée</FONT>!</B>");
	      $flgError=true;
	  } else if($ZZ_TID=="") { #oublis du num de troll
	      _print("<BR>&nbsp<B>Erreur: <FONT COLOR=BLUE>Id de Troll non renseigné</FONT>!</B>");
	      $flgError=true;
	  } else if($TrollPWD=="") { #oublis du pwd du troll
	      _print("<BR>&nbsp<B>Erreur: <FONT COLOR=BLUE>Password du troll non renseigné</FONT>!</B>");
	      $flgError=true;
	  } else {
		  $mysql=_sqlconnect();	# -------------- Ouverture DB  
		  $query =  "SELECT * FROM `MZ_User` WHERE (TiD=$ZZ_TID) and (Pwd='$ZZ_PWD')";
	  	  $result = @MySQL_QUERY($query);
	  	  $nData = @MySQL_NUM_ROWS($result);
	  	  if ($nData>0) {  # Même password? alors on change rien!
		    _print("<BR>&nbsp<B>Erreur : C'est le password original de <FONT COLOR=BLUE>$ZZ_TID</FONT>?</B><BR>");
	  		$flgError=true;
	   	  }
		  _sqlclose();		# -------------- Fermeture DB  
	  }
  }

  if (($flgError==false) && (!$byPassMH)) {
	# Verification MH, On capture le n° de guilde.
	$handle = @fopen("http://games.mountyhall.com/mountyhall/View/PJView.php?ai_IDPJ=$ZZ_TID", "r");
	$buffer="";
	while (!feof ($handle)) {
	   	$buffer .= fgets($handle, 4096);
	}
	@fclose($handle);
	$Tag="javascript:EnterAllianceView(";
	$gPos=strpos($buffer, $Tag);
	if ($gPos>0){
		$buffer=substr($buffer, $gPos+strlen($Tag));
		$idGuilde=substr($buffer, 0, strpos($buffer, ","));
	}
   
    #on crypte format md5 si le gus ne l'a pas fait!
    //if (strlen($TrollPWD)<30) $pwd=md5("$TrollPWD"); else 
	$pwd=$TrollPWD;
    //$SP_Profil="http://games.mountyhall.com/mountyhall/ScriptPublic/SP_Profil2.php";
    $SP_Profil="http://sp.mountyhall.com/SP_Profil2.php?";
    $Url="$SP_Profil?&Numero=$ZZ_TID&Motdepasse=$pwd";  
    if ($byPassMH==false) $handle = @fopen("$Url", "r"); else $handle=true;
    if ($handle==false) {
	  $mysql=_sqlconnect();	# -------------- Ouverture DB  
      _print("<BR>&nbsp<B>Erreur d'authentification MH: <FONT COLOR=BLUE>Le Site mountyhall est inaccessible</FONT>!</B><BR>");
	  _sqlclose();		# -------------- Fermeture DB  
      $flgError=true;
    } else {
      if ($byPassMH==false) {
	      $buffer=@fgets($handle, 4096);
	      fclose($handle);
		  $eBuffer = explode(";", $buffer);
	  } else {
		  $buffer="OK";
		  $eBuffer[0] = $ZZ_TID;
	  } 
      if ($eBuffer[0]!=$ZZ_TID) $buffer="Erreur: $buffer";
      if (substr($buffer, 0, 6) == "Erreur") {
		  $mysql=_sqlconnect();	# -------------- Ouverture DB  
		  _sqlclose();		# -------------- Fermeture DB  
	      _print("<BR>&nbsp<B>Erreur d'authentification MH: <FONT COLOR=BLUE>$buffer</FONT>!</B>");
          $flgError=true;
      } else {
	      _print("<BR>&nbsp<B>MH : Authentification réussi de <FONT COLOR=BLUE>$ZZ_TID</FONT>!</B>");      
      }     
    }
  }

  if ($flgError==true) { #Gestion des erreurs, sinon ajouter dans la databse
	_print("
			<FORM method=post action=zoryazilla.php class=thin>
			<INPUT TYPE=hidden Name=Source Value=\"$Source\">
			<INPUT TYPE=hidden Name=PG Value=\"$PG\">
			<INPUT TYPE=hidden Name=action Value=DlgBoxResetMDP>
			<input class=mh_form_submit type=submit value=\"           Ok           \">
			</FORM>");
  } else {
    $mysql=_sqlconnect();	# -------------- Ouverture DB  
    $query =  "SELECT TiD FROM `MZ_User` WHERE (TiD=$ZZ_TID) ";
  	$result = @MySQL_QUERY($query);
  	$nData = @MySQL_NUM_ROWS($result);

	// On prépare une entrée dans le share, car le troll doit partager avec lui même.
	$query =  "DELETE FROM MZ_Share` WHERE TiD=$ZZ_TID and SHRiD=$ZZ_TID";
	#echo "$query<BR>";
	$result = @MySQL_QUERY($query);
	$query =  "INSERT INTO `MZ_Share` Value($ZZ_TID, $ZZ_TID, 'S')";
	#echo "$query<BR>";
	$result = @MySQL_QUERY($query);

  	if ($nData<=0) {  #  1er password
	    $query =  "INSERT INTO `MZ_User` Value($ZZ_TID, '$ZZ_PWD', $idGuilde, FALSE)";
	    #echo "$query<BR>";
	  	$result = @MySQL_QUERY($query);
  	} else {
		$query =  "UPDATE `MZ_User` SET Pwd='$ZZ_PWD' Where TiD=$ZZ_TID";
	    #echo "$query<BR>";
	    $result = MySQL_QUERY($query);
	}
    _sqlclose();		# -------------- Fermeture DB  

	$_SESSION['login'] =$ZZ_TID;

	_print("<BR>&nbsp<B>Le mot de passe d'accès à ZZ du Trõll <FONT COLOR=BLUE>$ZZ_TID</FONT> a été Changé!</B><BR><BR>");
	_print("
		<FORM name=FormDlgBox method=post action=zoryazilla.php class=thin>
		<INPUT TYPE=hidden Name=action Value=\"\">
		<INPUT TYPE=hidden Name=PG Value=\"$PG\">
		<INPUT TYPE=hidden Name=Source Value=\"$Source\">
		<INPUT TYPE=hidden Name=CoterieName Value=\"$CoterieName\">
		<input class=mh_form_submit type=submit value=\"           Ok           \" onClick=javascript:onClickRetour();>
		</FORM>");
  }
#========================================================================================
# Chnage Password Compte
} else if ($action=="ChangeMDP") {
  $flgError=false;

  $ZZ_PWD=$ZZ_PWD1;
  if($ZZ_PWD1!=$ZZ_PWD2) { #Erreur de saisie
      _print("<BR>&nbsp<B>Erreur: <FONT COLOR=BLUE>Les Passwords saisis son différents</FONT>!</B>");
      $flgError=true;
  } else {
	  if ((strlen($ZZ_PWD)<30) && (strlen($ZZ_PWD)>0)) $ZZ_PWD=md5("$ZZ_PWD");     
	  if ((strlen($ZZ_PWD0)<30) && (strlen($ZZ_PWD0)>0)) $ZZ_PWD0=md5("$ZZ_PWD0");     

	  if($ZZ_PWD=="") { #coterie sans PWD
	      _print("<BR>&nbsp<B>Erreur: <FONT COLOR=BLUE>Un Troll sans Password n'est pas authorisée</FONT>!</B>");
	      $flgError=true;
	  } else if($ZZ_TID=="") { #oublis du num de troll
	      _print("<BR>&nbsp<B>Erreur: <FONT COLOR=BLUE>Id de Troll non renseigné</FONT>!</B>");
	      $flgError=true;
	  } else {
		  $mysql=_sqlconnect();	# -------------- Ouverture DB  
		  $query =  "SELECT * FROM `MZ_User` WHERE (TiD=$ZZ_TID) and (Pwd='$ZZ_PWD0')";
		  //echo "$query<BR>";			  
	  	  $result = @MySQL_QUERY($query);
	  	  $nData = @MySQL_NUM_ROWS($result);
	  	  if ($nData<=0) {  # Même password? alors on change rien!
		    _print("<BR>&nbsp<B>Erreur : l'ancien mot de passe  de <FONT COLOR=BLUE>$ZZ_TID</FONT> n'est pas correct.</B><BR>");
	  		$flgError=true;
	   	  }
		  _sqlclose();		# -------------- Fermeture DB  
	  }
  }

  if ($flgError==false)  {
   
    $mysql=_sqlconnect();	# -------------- Ouverture DB  

	// On prépare une entrée dans le share, car le troll doit partager avec lui même.
	$query =  "DELETE FROM MZ_Share` WHERE TiD=$ZZ_TID and SHRiD=$ZZ_TID";
	//echo "$query<BR>";
	$result = @MySQL_QUERY($query);
	$query =  "INSERT INTO `MZ_Share` Value($ZZ_TID, $ZZ_TID, 'S')";
	//echo "$query<BR>";
	$result = @MySQL_QUERY($query);

	$query =  "UPDATE `MZ_User` SET Pwd='$ZZ_PWD' Where TiD=$ZZ_TID";
    //echo "$query<BR>";
    $result = MySQL_QUERY($query);

    _sqlclose();		# -------------- Fermeture DB  

	$_SESSION['login'] =$ZZ_TID;

	_print("<BR>&nbsp<B>Le mot de passe d'accès à ZZ du Trõll <FONT COLOR=BLUE>$ZZ_TID</FONT> a été Changé!</B><BR><BR>");
	_print("
		<FORM name=FormDlgBox method=post action=zoryazilla.php class=thin>
		<INPUT TYPE=hidden Name=action Value=\"\">
		<INPUT TYPE=hidden Name=PG Value=\"$PG\">
		<INPUT TYPE=hidden Name=Source Value=\"$Source\">
		<INPUT TYPE=hidden Name=CoterieName Value=\"$CoterieName\">
		<input class=mh_form_submit type=submit value=\"           Ok           \" onClick=javascript:onClickRetour();>
		</FORM>");
  }
  
#========================================================================================
# Affichage des logs du troll
} else if ($action=="LogZZ") {
        _print("<TABLE WIDTH=98% CELLSPACING=0 BORDER=0 CELLPADDING=2 ALIGN=center><TR><TD ALIGN=center><DIV CLASS=Titre2><b>Qui a regardé sous ma jupe?</b></DIV></TD><TD align=right><img height=30 width=30 src=MH/logzz.png></TD></TR></TABLE>");
	    _print("
		<TABLE WIDTH=100% CELLSPACING=1 BORDER=0 CELLPADDING=0 CLASS=mh_tdborder><TR class=mh_tdtitre align=left><TD>
		<TABLE WIDTH=100% CELLSPACING=0 BORDER=0 CELLPADDING=2><TR align=left><TD>");	

		#Affichage des caracs des autres trolls
	   	_print("<TABLE WIDTH=100%><TR><TD><BR><U><I><B>Trolls qui ont vu mes infos avec Fusion ZZ : </U></I></B><BR><BR>");
	    _print("
		<TABLE WIDTH=100% CELLSPACING=1 BORDER=0 CELLPADDING=0 CLASS=mh_tdborder><TR class=mh_tdtitre align=left><TD>
		<TABLE WIDTH=100% CELLSPACING=1 BORDER=1 CELLPADDING=1>");		   
		   
		_print("<TR align=center><TD width=50 align=left><B>Date</B></TD><TD width=100><B>la dernière fois à</B></TD><TD width=70><B>par Troll Id</B></TD><TD align=left><B>Troll</B></TD><TD width=100><B>à partir de l'ip<sup>*</sup></B></TD><TD align=left><B>dernier script</B></TD></TR>");

	 	$yesterday=date("Y-m-d",mktime(date("H"),date("i"),date("s"),date("m"),date("d")-1,date("Y")));		
	 	$today=date("Y-m-d");

		$mysql=_sqlconnect();	# -------------- Ouverture DB  
	 	$query =  "SELECT DateStamp, TimeStamp,lookId, ip, comment, T.Troll FROM `MZ_Log` as L LEFT JOIN `MZ_Trolls` as T on T.TiD=L.lookId WHERE (L.TiD=$ZZ_TID) and (DateStamp='$yesterday' or DateStamp='$today') order by DateStamp desc, lookId Desc";
		$result = MySQL_QUERY($query);
	    _sqlclose();		# -------------- Fermeture DB  
	   	$nData = @MySQL_NUM_ROWS($result);
	   	for ($i=0; $i<$nData; $i++) {
		   	$TrollID=mysql_result($result,$i,"lookId");		if ($TrollID=="") $TrollID="<i>?</i>";
		   	$Troll=mysql_result($result,$i,"Troll");  		if ($Troll=="") $Troll="<i>inconnu</i>";
		   	$TimeStamp=substr(mysql_result($result,$i,"TimeStamp"), 11);
		   	$DateStamp=mysql_result($result,$i,"DateStamp");
		   	if ($DateStamp==$yesterday)$DateStamp="hier"; else if ($DateStamp==$today) $DateStamp="aujourd'hui"; else $DateStamp="un aut'jour"; 
		   	$ip=mysql_result($result,$i,"ip");	if ($ip=="") $ip="xx.xx.xx.xx";
		   	$comment=mysql_result($result,$i,"comment");	
		   	if (strrpos($ip, ".")>0) $ip=substr($ip, 0, strrpos($ip, ".")).".xx";
			_print("<TR align=center><TD align=left><I><FONT SIZE=-2>$DateStamp</FONT></I></TD><TD>$TimeStamp</TD><TD>$TrollID</TD><TD align=left><B><A target=_blank HREF='$MHPJView$TrollID'>$Troll</A></B></TD><TD>$ip</TD><TD width=80 align=left>$comment</TD></tr>");

	   	}	   	
		_print("</TABLE></TD></TR></TABLE></TD></TR></TABLE><BR>");
	    _print("<sup>*</sup> Afin de protéger la vie privé de nos amis et ainsi éviter de retrouver sur des forums<br> des copies d'écrans avec leurs IP, le dernier octet est masqué.<BR><BR>");
	    
	    _print("</TD></TR></TABLE></TD></TR></TABLE>");  
#========================================================================================
} else if ($action=="Newzz"){
        _print("<TABLE WIDTH=98% CELLSPACING=0 BORDER=0 CELLPADDING=2 ALIGN=center><TR><TD ALIGN=center><DIV CLASS=Titre2><b>NewZZ Board</b></DIV></TD><TD align=right><img height=30 width=30 src=MH/newzz.png></TD></TR></TABLE>
		<TABLE WIDTH=100% CELLSPACING=1 BORDER=0 CELLPADDING=0 CLASS=mh_tdborder><TR class=mh_tdtitre align=left><TD>
		<TABLE WIDTH=100% CELLSPACING=0 BORDER=0 CELLPADDING=2><TR align=left><TD>	
		");
 		require("Newzz.php");
        _print("</TD></TR></TABLE></TD></TR></TABLE>");

		if (!empty($_SESSION['login'])) {
        	_print("<TABLE WIDTH=98% CELLSPACING=0 BORDER=0 CELLPADDING=2 ALIGN=center><TR><TD ALIGN=center><DIV CLASS=Titre2><b>Votre Extension ZZ</b></DIV></TD><TD align=right><img height=30 width=30 src=MH/extension.png></TD></TR></TABLE>
				<TABLE WIDTH=100% CELLSPACING=1 BORDER=0 CELLPADDING=0 CLASS=mh_tdborder><TR class=mh_tdtitre align=left><TD>
				<TABLE WIDTH=100% CELLSPACING=0 BORDER=0 CELLPADDING=2><TR align=left><TD>");
		 	require("InfoZZ.php");
		    _print("</TD></TR></TABLE></TD></TR></TABLE>");
		}
#========================================================================================
} else if ($action=="Script"){
		_print('<SCRIPT LANGUAGE="JavaScript" TYPE="text/JavaScript">
			function onClickScript(type, id) {FormDlgBox.TypeScript.value=type;	FormDlgBox.IdScript.value=id; FormDlgBox.submit(); }
			</SCRIPT>');
			
        _print("<TABLE WIDTH=98% CELLSPACING=0 BORDER=0 CELLPADDING=2 ALIGN=center><TR><TD ALIGN=center><DIV CLASS=Titre2><b>Scripts Externes</b></DIV></TD><TD align=right><img height=30 width=30 src=MH/scripts.png></TD></TR></TABLE>

		<FORM name=FormDlgBox method=post action=zoryazilla.php class=thin>
		<INPUT TYPE=hidden Name=PG Value=\"$PG\">
		<INPUT TYPE=hidden Name=Source Value=\"$Source\">
		<INPUT TYPE=hidden Name=action Value='Script'>
		<INPUT TYPE=hidden Name=TypeScript Value=\"$TypeScript\">
		<INPUT TYPE=hidden Name=IdScript Value=\"$IdScript\">

		<TABLE WIDTH=100% CELLSPACING=1 BORDER=0 CELLPADDING=0 CLASS=mh_tdborder><TR class=mh_tdtitre align=left><TD>
		<TABLE WIDTH=100% CELLSPACING=0 BORDER=0 CELLPADDING=2><TR align=left><TD>	
		");


			
		$ZZDB="http://".$_SERVER["HTTP_HOST"].substr($_SERVER["REQUEST_URI"], 0, strrpos($_SERVER["REQUEST_URI"], "/"));
		
		_print("<tr><br><b><i><u><font color=red>ATTENTION</font></u></i>:</b> Les scripts externes peuvent-être <b><font color=red>potentiellement dangereux</font></b>. Installer un script,<br>
		 signifie faire <b><font color=green>CONFIANCE à son auteur </font></b> et au site sur lequel il est hébergé. Les scripts présentés ici ont<br> 
		 été développés pour MZ et ne sont pas certifiés pour ZZ.<br>
		 <b><font color=red>La copie proposée ici, a put être adapté ou modifié pour fonctionner sur ZZ</font></b>. Néanmoins, <br>
		 elle peut ne pas avoir suivi les évolutions de version du script original.<br><br></tr>");
		_print("<TR align=left><td></td><TD><B>Createur</B></TD><TD><B>Scripts Externe</B></TD><TD><B>Maj ZZ</B></TD><TD><B>Copie sur ZZ</B></TD></TR>");

		$mysql=_sqlconnect();	# -------------- Ouverture DB  

	 	$query =  "SELECT S.Id, S.TiD, S.Script, S.Statut, S.CopieZZ, S.DateCopie, S.Description, T.Troll FROM `MZ_Scripts_ext` as S LEFT JOIN `MZ_Trolls` as T on T.TiD=S.TiD WHERE S.Statut='O' order by Id $ScriptOrder";
		$result = MySQL_QUERY($query);
	   	$nData = @MySQL_NUM_ROWS($result);
	 	_print("<INPUT TYPE=hidden Name=SCRIPT_COMP_NB Value=\"$nData\">"); 
	   	for ($i=0; $i<$nData; $i++) {

		   	$Id=mysql_result($result,$i,"Id");	
		   	$CopieZZ=mysql_result($result,$i,"CopieZZ");
		   	$Script=mysql_result($result,$i,"Script");
			$arr_TabId[$Id]=$i;
	 		_print("<INPUT TYPE=hidden Name=SCRIPT_COMP_$i Value=\"$Script\">"); 
	 		_print("<INPUT TYPE=hidden Name=SCRIPT_COMP_ZZ$i Value=\"$CopieZZ\">"); 
		}		

/*		$query = "SELECT SCRIPTS_COMP from MZ_User_prefs where TiD=$ZZ_TID";
		$result = MySQL_QUERY($query);
	   	$fScriptExt = @MySQL_NUM_ROWS($result);
	   	$ScriptExt=array();
	   	$SCRIPTS_COMP="";
	   	$ScriptOrder="";
	   	if ($fScriptExt==1) {

			$SCRIPTS_COMP=mysql_result($result,0,"SCRIPTS_COMP");
			$ScriptExt=explode(",", $SCRIPTS_COMP);
			//$ScriptOrder="(".substr($ScriptIdList, 0, -1).")";
		}
		
		if ($TypeScript=='ActiveScript') {
 			if ($fScriptExt<1)
				$query = "REPLACE MZ_User_prefs values($ZZ_TID, '$ZZDB/skin/', 5, 0, 5, 15, 'oui', 'oui', '$IdScript,')";
 			else		
				$query = "UPDATE MZ_User_prefs SET SCRIPTS_COMP='$SCRIPTS_COMP$IdScript,' where TiD=$ZZ_TID";
			$void = MySQL_QUERY($query);
			$ScriptExt[]=$IdScript;
		} else if ($TypeScript=='DesactiveScript') {
			$SCRIPTS_COMP=""; foreach ($ScriptExt as $key =>$value) if (($value<>$IdScript)&&($value<>"")) $SCRIPTS_COMP.="$value,"; 
			$query = "UPDATE MZ_User_prefs SET SCRIPTS_COMP='$SCRIPTS_COMP' where TiD=$ZZ_TID";
			$void = MySQL_QUERY($query);
			$ScriptExt=explode(",", $SCRIPTS_COMP);
		}
*/


	 	$query =  "SELECT S.Id, S.TiD, S.Script, S.Statut, S.CopieZZ, S.DateCopie, S.Description, T.Troll FROM `MZ_Scripts_ext` as S LEFT JOIN `MZ_Trolls` as T on T.TiD=S.TiD WHERE S.Statut in ('N', 'I', 'O') order by Id $ScriptOrder";
		$result = MySQL_QUERY($query);
	    _sqlclose();		# -------------- Fermeture DB  
	   	$nData = @MySQL_NUM_ROWS($result);
	   	for ($i=0; $i<$nData; $i++) {
		   	$Id=mysql_result($result,$i,"Id");	
		   	$Statut=mysql_result($result,$i,"Statut");	
		   	$Script=mysql_result($result,$i,"Script");	
		   	$CopieZZ=mysql_result($result,$i,"CopieZZ");	
		   	$TrollID=mysql_result($result,$i,"TiD");
		   	$Troll=mysql_result($result,$i,"Troll");  		if ($Troll=="") $Troll=$TrollID;
		   	$Desc=mysql_result($result,$i,"Description");
		   	$DateCopie=mysql_result($result,$i,"DateCopie");
		   	
			if (strrpos($Script, "/")>0) $ScriptName=substr($Script, strrpos($Script, "/")+1);
			$linkScript="<A target=_blank HREF='$Script'>$ScriptName</A>";
			$linkCopie="<A target=_blank HREF='$ZZDB/scripts/$CopieZZ'><span title=\"copie du $DateCopie\">$CopieZZ</span></A>";
		   	$Createur="<A target=_blank HREF='$MHPJView$TrollID'><SPAN TITLE='$TrollID'>$Troll</SPAN></A>";

		   	if ($Statut=='I') { $RunIMG="<img src=MH/Images/bullet_green.jpg>"; } 
		   	else if ($Statut<>'O') { $RunIMG="<img src=MH/Images/bullet_red.jpg>"; } else {
/*			   	if (in_array($Id, $ScriptExt)) 
					$RunIMG="<input type=checkbox CHECKED onClick=\"javascript:onClickScript('DesactiveScript', $Id);\" onmouseover=\"this.style.cursor='pointer';\">"; 
					//$RunIMG="<img onClick=\"javascript:onClickScript('DesactiveScript', $Id);\" onmouseover=\"this.style.cursor='pointer';\" src=MH/Images/bullet_green.jpg>"; 
				else 
				    $RunIMG="<input type=checkbox onClick=\"javascript:onClickScript('ActiveScript', $Id);\" onmouseover=\"this.style.cursor='pointer';\">"; 
				    //$RunIMG="<img onClick=\"javascript:onClickScript('ActiveScript', $Id);\" onmouseover=\"this.style.cursor='pointer';\" src=MH/Images/bullet_orange.jpg>"; 
*/
					$RunIMG="<input name=CHECKBOX_SCRIPT_COMP_".$arr_TabId[$Id]." type=checkbox onClick=\"javascript:onClickScript('Switch', ".$arr_TabId[$Id].");\" onmouseover=\"this.style.cursor='pointer';\">"; 

			}
			
			_print("<TR align=left><td colspan=5><b><i>".($i+1)."-$Desc</b></i></td></tr>");
			_print("<TR align=left><td>$RunIMG</td><TD>$Createur</TD><TD>$linkScript</TD><TD><i>$DateCopie</i>&nbsp;=></td><TD>$linkCopie</td></tr>");
			_print("<TR align=left><td height=5px colspan=5></td></tr>");

	   	}
	   	
		_print("</TD></TR></TABLE>");
		_print("<i><u>Autre Scripts atifs:</u></i><br>&nbsp;&nbsp;<TEXTAREA ROWS=3 COLS=70 type=text name=AUTRES_SCRIPTS_COMP READONLY></TEXTAREA><br>");
		_print("<i><u>Encore d'autre ?</u></i><br>Si vous avez développé un Script Complémentaire et que vous souhaitez le voir ici, 
		        <br>allez poster sur le <a target=_blank href=http://zorya.ironie.org/forum/viewtopic.php?f=12&t=210><b>forum</b></a>.<br><br>	
				<i><u>Légendes:</u></i><br>
				&nbsp;<img width=12px src=MH/Images/bullet_green.jpg> : Script intégré en natif à ZZ<br>
				&nbsp;<img width=12px src=MH/Images/bullet_red.jpg> : Script ne fonctionnant pas avec ZZ <i>(à étudier)</i>.<br>
				<input type=checkbox disabled='disabled'>: Script activable<br>
				<input type=checkbox disabled='disabled' checked>: Script activé<br>
				<br><br><br>
				");
		_print("</TD></TR></TABLE>");
			
#========================================================================================
} else if ($action=="CronZZ"){

        _print("<TABLE WIDTH=98% CELLSPACING=0 BORDER=0 CELLPADDING=2 ALIGN=center><TR><TD ALIGN=center><DIV CLASS=Titre2><b>Scheduler</b></DIV></TD><TD align=right><img height=30 width=30 src=Cron/zzcron.php?return_image=2></TD></TR></TABLE>
		<TABLE WIDTH=100% CELLSPACING=1 BORDER=0 CELLPADDING=0 CLASS=mh_tdborder><TR class=mh_tdtitre align=left><TD>
		<TABLE WIDTH=100% CELLSPACING=0 BORDER=0 CELLPADDING=2><TR align=left><TD>	
		");
 		require("CronZZ.php");
        _print("</TD></TR></TABLE></TD></TR></TABLE>");


#========================================================================================
} else if ($action=="StatZ"){
        _print("<TABLE WIDTH=98% CELLSPACING=0 BORDER=0 CELLPADDING=2 ALIGN=center><TR><TD ALIGN=center><DIV CLASS=Titre2><b>Statistiques ");
		if ($_SESSION['login']=="28468") _print("<a target=_blank href=zzCleanDB.php><font size=-2>(nettoyage de la base)</font></a>");
		_print("</b></DIV></TD><TD align=right><img height=30 width=30 src=MH/stats.png></TD></TR></TABLE><TABLE WIDTH=100% CELLSPACING=1 BORDER=0 CELLPADDING=0 CLASS=mh_tdborder><TR class=mh_tdtitre align=left><TD>
		<TABLE WIDTH=100% CELLSPACING=0 BORDER=0 CELLPADDING=2><TR align=left><TD>	
		");
 		require("StatZ.php");
        _print("</TD></TR></TABLE></TD></TR></TABLE>");
#========================================================================================
} else if ($action=="MyShare"){
 
		_print('<SCRIPT LANGUAGE="JavaScript" TYPE="text/JavaScript">
			function onClickMail(id) { alert(id); }
			function onClickShr(type, id) {FormDlgBox.TypeShr.value=type;	FormDlgBox.User.value=id;	FormDlgBox.submit(); }
			</SCRIPT>');

        _print("<TABLE WIDTH=98% CELLSPACING=0 BORDER=0 CELLPADDING=2 ALIGN=center><TR><TD ALIGN=center><DIV CLASS=Titre2><b>Mes Partages ZZ</b></DIV></TD><TD align=right><img height=30 width=30 src=MH/partage.png></TD></TR></TABLE>

		<FORM name=FormDlgBox method=post action=zoryazilla.php class=thin>
		<INPUT TYPE=hidden Name=PG Value=\"$PG\">
		<INPUT TYPE=hidden Name=Source Value=\"$Source\">
		<INPUT TYPE=hidden Name=action Value='MyShare'>
		<INPUT TYPE=hidden Name=TypeShr>
		<INPUT TYPE=hidden Name=User>

		<TABLE WIDTH=100% CELLSPACING=1 BORDER=0 CELLPADDING=0 CLASS=mh_tdborder><TR class=mh_tdtitre align=left><TD>
		<TABLE WIDTH=100% CELLSPACING=0 BORDER=0 CELLPADDING=2><TR align=left><TD>	
		");

		#echo $TypeShr." ".$User."<br>";
		$mysql=_sqlconnect();	# -------------- Ouverture DB  

		if ($TypeShr=='GrantShr') {
 			$tabUser=explode(",", $User);
			foreach ($tabUser as $Key) if ($Key!="") {
			 	$query =  "UPDATE `MZ_Share` SET link='S' WHERE TiD=$Key and SHRiD=$ZZ_TID";
				$result = @MySQL_QUERY($query);
			 	$query =  "DELETE FROM `MZ_Share` where TiD=$ZZ_TID and SHRiD=$Key";
				$result = @MySQL_QUERY($query);
		 		$query =  "INSERT `MZ_Share` VALUES($ZZ_TID,  $Key, 'S')";
				$result = @MySQL_QUERY($query);
			}
		} if ($TypeShr=='RevokeShr') {
		 	$query =  "UPDATE `MZ_Share` SET link='I' WHERE TiD=$User and SHRiD=$ZZ_TID";
			$result = @MySQL_QUERY($query);
		 	$query =  "DELETE FROM `MZ_Share` where TiD=$ZZ_TID and SHRiD=$User";
			$result = @MySQL_QUERY($query);
		} else if ($TypeShr=='RemoveShr') {
 			$tabUser=explode(",", $User);
			foreach ($tabUser as $Key) if ($Key!="") {
			 	$query =  "DELETE FROM `MZ_Share` where TiD=$Key and SHRiD=$ZZ_TID";
				$result = @MySQL_QUERY($query);
			}
		} else if ($TypeShr=='NewShr') {
 			$tabUser=explode(",", $User);
			foreach ($tabUser as $Key) if ($Key!="") {
//			 	$query =  "DELETE FROM `MZ_Share` where TiD=$ZZ_TID and SHRiD=$Key";
//				$result = @MySQL_QUERY($query);
			 	$query =  "SELECT link FROM `MZ_Share` where SHRiD=$ZZ_TID and TiD=$Key";
				$result = @MySQL_QUERY($query);
				$nData = @MySQL_NUM_ROWS($result);
				if ($nData>0) { // On crer un share avec quelqu'un qui avait déjà fais la demande => auto-validation
				 	$query =  "UPDATE `MZ_Share` SET link='S' WHERE TiD=$Key and SHRiD=$ZZ_TID";
					$result = @MySQL_QUERY($query);
				 	$query =  "DELETE FROM `MZ_Share` where TiD=$ZZ_TID and SHRiD=$Key";
					$result = @MySQL_QUERY($query);
		 			$query =  "INSERT `MZ_Share` VALUES($ZZ_TID,  $Key, 'S')";
					$result = @MySQL_QUERY($query);
 				} else {	
				 	$query =  "SELECT link FROM `MZ_Share` where TiD=$ZZ_TID and SHRiD=$Key";
					$result = @MySQL_QUERY($query);
					$nData = @MySQL_NUM_ROWS($result);
					if ($nData<=0) {
					 	$query =  "INSERT `MZ_Share` VALUES($ZZ_TID,  $Key, 'I')";
						$result = @MySQL_QUERY($query);
					}
 				}		
			}
		} else if ($TypeShr=='CancelShr') {
		 	$query =  "DELETE FROM `MZ_Share` where TiD=$ZZ_TID and SHRiD=$User";
			$result = @MySQL_QUERY($query);
		}
	
		// Je partage avec EUX!
	 	//$query1 =  "SELECT S.SHRiD, S.link, P.Troll FROM `MZ_Share` as S LEFT JOIN MZ_Profil as P ON S.SHRiD=P.TiD WHERE S.TiD=$ZZ_TID and S.link='S' and S.SHRiD!=$ZZ_TID order by S.SHRiD";
	 	$query1 =  "SELECT S.SHRiD, S.link, P.Troll FROM `MZ_Share` as S LEFT JOIN MZ_Trolls as P ON S.SHRiD=P.TiD WHERE S.TiD=$ZZ_TID and S.link='S' and S.SHRiD!=$ZZ_TID order by S.SHRiD";
		$result1 = @MySQL_QUERY($query1);

		$nData = @MySQL_NUM_ROWS($result1);
		$ShareList="''";
		for ($i=0; $i<$nData; $i++) {#Tableau des partages
		 	$SHRiD=mysql_result($result1,$i,"SHRiD");
			$ShareList.=",$SHRiD";
		}

		// Ils ont demandé à partager avec moi!
	 	//$query2 =  "SELECT S.TiD, S.link, P.Troll FROM `MZ_Share` as S LEFT JOIN MZ_Profil as P ON S.TiD=P.TiD WHERE S.SHRiD=$ZZ_TID and S.link='I' and S.TiD not in ($ShareList) order by S.TiD";
	 	$query2 =  "SELECT S.TiD, S.link, P.Troll FROM `MZ_Share` as S LEFT JOIN MZ_Trolls as P ON S.TiD=P.TiD WHERE S.SHRiD=$ZZ_TID and S.link='I' and S.TiD not in ($ShareList) order by S.TiD";
		$result2 = @MySQL_QUERY($query2);

		// J'ai demandé à partager avec eux!
	 	//$query3 =  "SELECT S.SHRiD, S.link, P.Troll FROM `MZ_Share` as S LEFT JOIN MZ_Profil as P ON S.SHRiD=P.TiD WHERE S.TiD=$ZZ_TID and S.link='I' order by S.SHRiD";
	 	$query3 =  "SELECT S.SHRiD, S.link, P.Troll FROM `MZ_Share` as S LEFT JOIN MZ_Trolls as P ON S.SHRiD=P.TiD WHERE S.TiD=$ZZ_TID and S.link='I' order by S.SHRiD";
		$result3 = @MySQL_QUERY($query3);
	    _sqlclose();		# -------------- Fermeture DB  

		

	   	_print("<TABLE WIDTH=100% CELLSPACING=10 ><TR><TD valign=top><U><I><B>Ils ont sollicité le partage: </U></I></B><BR><BR>");
		#Affichage des demandes de partage ==================================
		$nData = @MySQL_NUM_ROWS($result2);
	    _print("
		<TABLE WIDTH=100% CELLSPACING=1 BORDER=0 CELLPADDING=0 CLASS=mh_tdborder><TR class=mh_tdtitre align=left><TD>
		<TABLE WIDTH=100% CELLSPACING=1 BORDER=1 CELLPADDING=1>");		   
		_print("<TR><TD><B>Id</B></TD><TD align=center><B>Troll</B></TD><TD align=center><B>Partage</B></TD></TR>");
		for ($i=0; $i<$nData; $i++) {
		 	$SHRiD=mysql_result($result2,$i,"TiD");
		 	$link=mysql_result($result2,$i,"link");
		 	$Troll=mysql_result($result2,$i,"Troll");
			$Partage ="<SPAN TITLE='Accepter le partage'><IMG onClick=\"javascript:onClickShr('GrantShr', $SHRiD);\" onmouseover=\"this.style.cursor='pointer';\" SRC=skin/tete.gif></span>&nbsp;&nbsp;";
			$Partage.="<SPAN TITLE='Supprimer le partage'><IMG onClick=\"javascript:onClickShr('RemoveShr', $SHRiD);\" onmouseover=\"this.style.cursor='pointer';\" SRC=skin/b_drop.png></span>";
			_print("<TR><TD>$SHRiD</TD><TD align=left>$Troll</TD><TD align=center>$Partage</TD></TR>");
		}
		_print("</TABLE></TD></TR></TABLE>");		

		#Affichage de mes attentes de validation ==================================
		$nData = @MySQL_NUM_ROWS($result3);
	   	_print("</TD><TD valign=top><U><I><B>J'attends qu'ils valident: </U></I></B><BR><BR>");
	    _print("
		<TABLE WIDTH=100% CELLSPACING=1 BORDER=0 CELLPADDING=0 CLASS=mh_tdborder><TR class=mh_tdtitre align=left><TD>
		<TABLE WIDTH=100% CELLSPACING=1 BORDER=1 CELLPADDING=1>");		   
		_print("<TR><TD><B>Id</B></TD><TD align=center><B>Troll</B></TD><TD align=center><B>Partage</B></TD></TR>");
		for ($i=0; $i<$nData; $i++) {
		 	$SHRiD=mysql_result($result3,$i,"SHRiD");
		 	$link=mysql_result($result3,$i,"link");
		 	$Troll=mysql_result($result3,$i,"Troll");
		 	$sendMP=$MHRoot."/mountyhall/Messagerie/MH_Messagerie.php?cat=3&title=Pourrais-tu%20valider%20ma%20demande%20de%20partage%20ZZ?&dest=+$SHRiD,";
			$Partage="<a target=_blank href=\"$sendMP\"><SPAN TITLE='Envoyer un MP'><IMG border=0 onmouseover=\"this.style.cursor='pointer';\" SRC=skin/lettre.gif></span></a>&nbsp;&nbsp;";
			$Partage.="<SPAN TITLE='Supprimer le partage'><IMG onClick=\"javascript:onClickShr('CancelShr', $SHRiD);\" onmouseover=\"this.style.cursor='pointer';\" SRC=skin/b_drop.png></span>";
			_print("<TR><TD>$SHRiD</TD><TD align=left>$Troll</TD><TD align=center>$Partage</TD></TR>");
		}
		_print("<tr><td colspan=3>&nbsp;&nbsp;<b>Id:</b>&nbsp;<INPUT type=text size=8 name=SHRiD>&nbsp;&nbsp;<input onClick=\"javascript:onClickShr('NewShr', FormDlgBox.SHRiD.value);\" class=mh_form_submit type=submit value='Demander'></td></tr>");

		_print("</TABLE></TD></TR></TABLE></TD></TR></TABLE>");


		#Affichage des partages bilatéraux ==================================
		$nData = @MySQL_NUM_ROWS($result1);
	   	_print("<TABLE WIDTH=50%><TR><TD><U><I><B>Je partage avec: </U></I></B><BR><BR>");
	    _print("
		<TABLE WIDTH=100% CELLSPACING=1 BORDER=0 CELLPADDING=0 CLASS=mh_tdborder><TR class=mh_tdtitre align=left><TD>
		<TABLE WIDTH=100% CELLSPACING=1 BORDER=1 CELLPADDING=1>");		   
		_print("<TR><TD><B>Id</B></TD><TD align=center><B>Troll</B></TD><TD align=center><B>Partage</B></TD></TR>");
		for ($i=0; $i<$nData; $i++) {
		 	$SHRiD=mysql_result($result1,$i,"SHRiD");
		 	$link=mysql_result($result1,$i,"link");
		 	$Troll=mysql_result($result1,$i,"Troll");
			$Partage="<SPAN TITLE='Renoncer au partage'><IMG onClick=\"javascript:onClickShr('RevokeShr', $SHRiD);\" onmouseover=\"this.style.cursor='pointer';\" SRC=skin/b_drop.png></span>";
			_print("<TR><TD>$SHRiD</TD><TD align=left>$Troll</TD><TD align=center>$Partage</TD></TR>");
		}
		_print("</TABLE></TD></TR></TABLE></TD></TR></TABLE><BR><BR>");

		_print("</FORM>");
        _print("</TD></TR></TABLE></TD></TR></TABLE>");
#========================================================================================
# Affichage des infos Coteries/Gogo   
} else if (($action=="showCarac")||($action=="MonZZ")) {
        _print("<TABLE WIDTH=98% CELLSPACING=0 BORDER=0 CELLPADDING=2 ALIGN=center><TR><TD ALIGN=center><DIV CLASS=Titre2><b>Mes Amis</b></DIV></TD><TD align=right><img height=30 width=30 src=MH/amis.png></TD></TR></TABLE>");
	    _print("
		<TABLE WIDTH=100% CELLSPACING=1 BORDER=0 CELLPADDING=0 CLASS=mh_tdborder><TR class=mh_tdtitre align=left><TD>
		<TABLE WIDTH=100% CELLSPACING=0 BORDER=0 CELLPADDING=2><TR align=left><TD>");	

		#Affichage des caracs des autres trolls
	   	_print("<TABLE WIDTH=100%><TR><TD><BR><U><I><B>Caractéristiques de mes amis : </U></I></B><BR><BR>");
	    _print("
		<TABLE WIDTH=100% CELLSPACING=1 BORDER=0 CELLPADDING=0 CLASS=mh_tdborder><TR class=mh_tdtitre align=left><TD>
		<TABLE WIDTH=100% CELLSPACING=1 BORDER=1 CELLPADDING=1>");		   
		   
		_print("<TR><TD></TD><TD></TD><TD><B>Race</B></TD><TD align=center><B>Niv</B></TD><TD align=center><B>DLA</B></TD align=center><TD><B>X</B></TD><TD align=center><B>Y</B></TD><TD align=center><B>N</B></TD><TD align=center><B>PV</B></TD><TD align=center><B>Caché</B></TD></TR>");

		$mysql=_sqlconnect();	# -------------- Ouverture DB  
	 	#$query =  "SELECT P.TimeStamp, P.Troll, P.DLA, P.X, P.Y, P.N, P.Race, P.Niveau, P.PV, P.PVMax, P.Camoufle FROM `MZ_Groupe` as G RIGHT JOIN `MZ_Profil` as P on P.TiD=G.TiD WHERE (G.Admin!='W') and (G.Nom='"._strs($CoterieName)."') and (G.Pwd='$ZZ_PWD') order by P.Niveau Desc, P.Troll";
	 	//$query =  "SELECT P.TimeStamp, P.Troll, P.DLA, P.X, P.Y, P.N, P.Race, P.Niveau, P.PV, P.PVMax, P.Camoufle FROM `MZ_Groupe` as G RIGHT JOIN `MZ_Profil` as P on P.TiD=G.TiD WHERE (G.Admin!='W') and (G.Nom='"._strs($CoterieName)."') order by P.Niveau Desc, P.Troll";
	 	$query =  "SELECT P.TimeStamp, P.TiD, P.Troll, P.DLA, P.X, P.Y, P.N, P.Race, P.Niveau, P.PV, P.PVMax, P.Camoufle FROM `MZ_Groupe` as G RIGHT JOIN `MZ_Profil` as P on P.TiD=G.TiD INNER JOIN `MZ_Share` as S ON P.TiD=S.TiD WHERE (S.SHRiD=$ZZ_TID) and (S.link='S') order by P.Niveau Desc, P.Troll";
		$result = MySQL_QUERY($query);
	    _sqlclose();		# -------------- Fermeture DB  
	   	$nData = @MySQL_NUM_ROWS($result);
	   	for ($i=0; $i<$nData; $i++) {
		   	$TrollID=mysql_result($result,$i,"TiD");	_sqlAddLogId($TrollID);			// ajout d'une log pour ce troll 
		   	$Troll=mysql_result($result,$i,"Troll");
		   	$DLA=mysql_result($result,$i,"DLA");
		   	$X=mysql_result($result,$i,"X");
		   	$Y=mysql_result($result,$i,"Y");
		   	$N=mysql_result($result,$i,"N");
		   	$Race=mysql_result($result,$i,"Race");
		   	$Niveau=mysql_result($result,$i,"Niveau");
		   	$PV=mysql_result($result,$i,"PV");
		   	$PVMax=mysql_result($result,$i,"PVMax");
		   	$TimeStamp=substr(mysql_result($result,$i,"TimeStamp"), 0, 16);
		   	if (mysql_result($result,$i,"Camoufle")==0) $Camoufle='Non'; else $Camoufle='Oui';
			_print("<TR><TD><I><FONT SIZE=-2>$TimeStamp</FONT></I></TD><TD><B><A target=_blank HREF='$MHPJView$TrollID'><SPAN TITLE='$TrollID'>$Troll</SPAN></A></B></TD><TD>$Race</TD><TD align=center>$Niveau</TD><TD>$DLA</TD><TD align=center>$X</TD><TD align=center>$Y</TD><TD align=center>$N</TD><TD align=center>");
			# $PV/$PVMax => Barre de PV
			$lSize=round((50*$PV)/$PVMax); if (($lSize<50) && ($lSize>48)) $lSize=48;   // pour rendre plus joli
			$rSize=50-$lSize;			
			_print("<SPAN TITLE=\"$PV/$PVMax\"><TABLE width=50 border=0 cellspacing=1 cellpadding=0 bgcolor=#000000><TR><TD bgcolor=#FF0000 height=10 width=$lSize border=0 cellspacing=0 cellpadding=0></TD>");
			if ($rSize>0) _print("<TD bgcolor=#FFFFFF height=10 width=$rSize border=0 cellspacing=0 cellpadding=0></TD>");
			_print("</TR></TABLE></SPAN>");

		 	_print("</TD><TD align=center>$Camoufle</TD></TR>");
	   	}	   	
		_print("</TABLE></TD></TR></TABLE></TD></TR></TABLE><BR><BR>");
	    
	    _print("</TD></TR></TABLE></TD></TR></TABLE>");
#========================================================================================
# Affichage des infos Gogos, fa, golem   
} else if ($action=="showGowap") {
        _print("<TABLE WIDTH=98% CELLSPACING=0 BORDER=0 CELLPADDING=2 ALIGN=center><TR><TD ALIGN=center><DIV CLASS=Titre2><b>Gowaps, Familiers & Golems</b></DIV></TD><TD align=right><img height=30 width=30 src=MH/gowap.png></TD></TR></TABLE>");
	    _print("
		<TABLE WIDTH=100% CELLSPACING=1 BORDER=0 CELLPADDING=0 CLASS=mh_tdborder><TR class=mh_tdtitre align=left><TD>
		<TABLE WIDTH=100% CELLSPACING=0 BORDER=0 CELLPADDING=2><TR align=left><TD>");	


		#Affichage des gowaps des autres trolls===========================================
	   	_print("<TABLE WIDTH=100%><TR><TD><BR><U><I><B>Les gowaps : </U></I></B><BR><BR>");
	    _print("
		<TABLE WIDTH=100% CELLSPACING=1 BORDER=0 CELLPADDING=0 CLASS=mh_tdborder><TR class=mh_tdtitre align=left><TD>
		<TABLE WIDTH=100% CELLSPACING=1 BORDER=1 CELLPADDING=1>");		   
		   
		_print("<TR><TD align=right colspan=2><b>Propriétaire</b></TD><TD><B>Gogo</B></TD><TD><B>Charge</B></TD><TD><b>Commentaires</b></td></TR>");

		$mysql=_sqlconnect();	# -------------- Ouverture DB  
	 	$query =  "SELECT P.TiD, P.Troll, G.Gogo, IG.TimeStamp, IG.DLA, IG.Poids, IG.goX, IG.goY, IG.goN, IG.IdTresor FROM `MZ_Profil` as P INNER JOIN `MZ_Gogo` as G on P.TiD=G.TiD LEFT JOIN MZ_iGogo IG on IG.Gogo=G.Gogo INNER JOIN `MZ_Share` as S ON P.TiD=S.TiD WHERE (S.SHRiD=$ZZ_TID) and (S.link='S') order by P.Troll, G.Gogo";
	 	//echo $query;
		$result = MySQL_QUERY($query);
	    _sqlclose();		# -------------- Fermeture DB  
	   	$nData = @MySQL_NUM_ROWS($result);
	   	for ($i=0; $i<$nData; $i++) {
		   	$TrollID=mysql_result($result,$i,"TiD");	_sqlAddLogId($TrollID);			// ajout d'une log pour ce troll 
		   	$Troll=mysql_result($result,$i,"Troll");
		   	$Gogo=mysql_result($result,$i,"Gogo");
		   	$DLA=mysql_result($result,$i,"DLA");
		   	$Poids=mysql_result($result,$i,"Poids");
		   	$goX=mysql_result($result,$i,"goX");
		   	$goY=mysql_result($result,$i,"goY");
		   	$goN=mysql_result($result,$i,"goN");
		   	$IdTresor=mysql_result($result,$i,"IdTresor");
		   	$TimeStamp=substr(mysql_result($result,$i,"TimeStamp"), 0, 16);
			_print("<TR><TD><I><FONT SIZE=-2>$TimeStamp</FONT></I></TD><TD><B><A target=_blank HREF='$MHPJView$TrollID'><SPAN TITLE='$TrollID'>$Troll</SPAN></A></B></TD><TD><A target=_blank HREF='$MHMEView$Gogo'>$Gogo</a></TD><TD>");
			# $PV/$PVMax => Barre de PV

			if ($DLA>0) {
		         $charge=round((($Poids*2)/$DLA)*100, 2);	
 		       	 $poids_dispo=round(($DLA-2*$Poids)/2, 2);
				 $span_txt="Reste: $poids_dispo min";	
			
				$PV=2*$Poids; $PVMax=$DLA;
				$lSize=round((50*$PV)/$PVMax); if (($lSize<50) && ($lSize>48)) $lSize=48;   // pour rendre plus joli
				$rSize=50-$lSize;			
				_print("<SPAN TITLE=\"$span_txt\"><TABLE width=50 border=0 cellspacing=1 cellpadding=0 bgcolor=#000000><TR><TD bgcolor=#FFFFFF height=10 width=$lSize border=0 cellspacing=0 cellpadding=0></TD>");
				if ($rSize>0) _print("<TD bgcolor=#00FF00 height=10 width=$rSize border=0 cellspacing=0 cellpadding=0></TD>");
				_print("</TR></TABLE></SPAN>");
			} else {
				_print("&nbsp;");
			}

			$rem="";
			if ($goN<0) {
				$rem="Va en X=<B>$goX</B> Y=<B>$goY</B> N=<B>$goN</B>";
			}
			if ($IdTresor>0) {
				if ($rem==="") $rem="Va chercher Id<b>#$IdTresor</b>"; else $rem.=", chercher Id<B>#$IdTresor</B>";
			}
		 	_print("</TD><TD>&nbsp;$rem</TD></TR>");
	   	}	   	
		_print("</TABLE></TD></TR></TABLE></TD></TR></TABLE>");
	    


		#Affichage des fams des autres trolls===========================================
	   	_print("<TABLE WIDTH=100%><TR><TD><BR><U><I><B>Les autres suivants: </U></I></B><BR><BR>");
	    _print("
		<TABLE WIDTH=100% CELLSPACING=1 BORDER=0 CELLPADDING=0 CLASS=mh_tdborder><TR class=mh_tdtitre align=left><TD>
		<TABLE WIDTH=100% CELLSPACING=1 BORDER=1 CELLPADDING=1>");		   
		   
		_print("<TR><TD align=right colspan=2><b>Propriétaire</b></TD><TD><B>N° Suivant</B></TD><TD ><b>Commentaires</b></td></TR>");

		$mysql=_sqlconnect();	# -------------- Ouverture DB  
	 	$query =  "SELECT P.TiD, P.Troll, F.Fam FROM `MZ_Profil` as P INNER JOIN `MZ_Fam` as F on P.TiD=F.TiD INNER JOIN `MZ_Share` as S ON P.TiD=S.TiD WHERE (S.SHRiD=$ZZ_TID) and (S.link='S') order by P.Troll, F.Fam";
	 	//echo $query;
		$result = MySQL_QUERY($query);
	    _sqlclose();		# -------------- Fermeture DB  
	   	$nData = @MySQL_NUM_ROWS($result);
	   	for ($i=0; $i<$nData; $i++) {
		   	$TrollID=mysql_result($result,$i,"TiD");	_sqlAddLogId($TrollID);			// ajout d'une log pour ce troll 
		   	$Troll=mysql_result($result,$i,"Troll");
		   	$Fam=mysql_result($result,$i,"Fam");
			_print("<TR><TD colspan=2><B><A target=_blank HREF='$MHPJView$TrollID'><SPAN TITLE='$TrollID'>$Troll</SPAN></A></B></TD><TD><A target=_blank HREF='$MHMEView$Fam'>$Fam</a></TD><TD>&nbsp;</TD></TR>");
	   	}	   	
		_print("</TABLE></TD></TR></TABLE></TD></TR></TABLE>");


	    _print("<BR><BR></TD></TR></TABLE></TD></TR></TABLE>");
#========================================================================================	    
#========================================================================================
# Affichage de la boite de dialogue gerer les pieges
} else if ($action=="DlgBoxPiege") {

	_print('
		<SCRIPT LANGUAGE="JavaScript" TYPE="text/JavaScript">
		function onClickSuppPiege(id) {FormDlgBox.action.value="DlgBoxPiege";	FormDlgBox.Piege.value=id; 	FormDlgBox.submit(); }
		function onClickAddPiege() { FormDlgBox.action.value="DlgBoxPiege";	FormDlgBox.Piege.value="ADD|"+FormDlgBox.X.value+"|"+FormDlgBox.Y.value+"|"+FormDlgBox.N.value+"|"+FormDlgBox.TypePiege.value;  FormDlgBox.submit(); }
		</SCRIPT>');
 
	_print("<TABLE WIDTH=98% CELLSPACING=0 BORDER=0 CELLPADDING=2 ALIGN=center><TR><TD ALIGN=center><DIV CLASS=Titre2><b>Gestion des Pieges</b></DIV></TD><TD align=right><img height=30 width=30 src=MH/construire_un_piege.png></TD></TR></TABLE> ");
    _print("
		<TABLE WIDTH=100% CELLSPACING=1 BORDER=0 CELLPADDING=0 CLASS=mh_tdborder><TR class=mh_tdtitre align=left><TD>
		<TABLE WIDTH=100% CELLSPACING=0 BORDER=0 CELLPADDING=2><TR align=left><TD>	");		

		if($Piege!="") {
			$aPiege = explode("|", $Piege);
			if( $aPiege[0]=="ADD") {
			 	$TimeStamp=date("Y-m-d H:i:s");	
			 	if ($aPiege[3]>0) $aPiege[3]="+/-$aPiege[3]";

				#$query = "SELECT X.* FROM `MZ_Piege` as X, `MZ_Groupe` as G where (X.X=$aPiege[1]) and (X.Y=$aPiege[2]) and (X.N=$aPiege[3]) and (X.TiD=$TiD) and (X.TiD=G.TiD) and (G.Nom='"._strs($CoterieName)."') and (G.Pwd='$ZZ_PWD')";
				$mysql=_sqlconnect();	# -------------- Ouverture DB  
				#$query = "SELECT X.* FROM `MZ_Piege` as X INNER JOIN `MZ_Groupe` as G ON (X.TiD=G.TiD) where (X.X=$aPiege[1]) and (X.Y=$aPiege[2]) and (X.N=$aPiege[3]) and (X.TiD=$TiD) and (G.Nom='"._strs($CoterieName)."') and (G.Pwd='$ZZ_PWD')";
				$query = "SELECT X.* FROM `MZ_Piege` as X where (X.X=$aPiege[1]) and (X.Y=$aPiege[2]) and (X.N=$aPiege[3]) and (X.TiD=$ZZ_TID) ";
				$result = @MySQL_QUERY($query);
		  		$nData = @MySQL_NUM_ROWS($result);
		  		if ($nData>0) {
					 	_print("<BR>Il y a déjà un piege en: X=<B>$aPiege[1]</B>, Y=<B>$aPiege[2]</B> et N=<B>$aPiege[3]</B><BR><BR>");
				} else {
					$query = "INSERT `MZ_Piege` values('$TimeStamp', $ZZ_TID, $aPiege[1], $aPiege[2], $aPiege[3], 0, \"$aPiege[4]\")";
					$result = @MySQL_QUERY($query);
					$result = @MySQL_QUERY("SELECT ROW_COUNT() as count;");				
					$nData=mysql_result($result,0,"count");
			  		if ($nData>0) {
					 	_print("<BR>Le piege à $aPiege[4] en X=<B>$aPiege[1]</B>, Y=<B>$aPiege[2]</B> et N=<B>$aPiege[3]</B> a été ajouté le '<B>$TimeStamp</B>!<BR><BR>");
			  		} else {
					 	_print("<BR>Le piege n'a pas été ajouté (erreur de format): X=<B>$aPiege[1]</B>, Y=<B>$aPiege[2]</B> et N=<B>$aPiege[3]</B>?<BR><BR>");
			  	    }
			  	}
			    _sqlclose();		# -------------- Fermeture DB  
			} else if( $aPiege[0]=="DEL") {
				$mysql=_sqlconnect();	# -------------- Ouverture DB  
				$query = "DELETE X FROM `MZ_Piege` as X where (X.TimeStamp='$aPiege[1]') and (X.X=$aPiege[2]) and (X.Y=$aPiege[3]) and (X.N=$aPiege[4]) and (X.TiD=$ZZ_TID) ";
				$result = @MySQL_QUERY($query);
		  		$nData = @MySQL_NUM_ROWS($result);				 
				$result = @MySQL_QUERY("SELECT ROW_COUNT() as count;");				
				$nData=mysql_result($result,0,"count");
			    _sqlclose();		# -------------- Fermeture DB  
		  		if ($nData>0) {
				 	_print("<BR>Le piege du '<B>$aPiege[1]</B>' en X=<B>$aPiege[2]</B>, Y=<B>$aPiege[3]</B> et N=<B>$aPiege[4]</B> a été supprimé!<BR><BR>");
		  		}
			}
		} else {
			_print("<BR>");		 
		}
	 
		_print("<FORM name=FormDlgBox method=post action=zoryazilla.php class=thin> 
				<INPUT TYPE=hidden Name=Piege Value=\"\">
				<INPUT TYPE=hidden Name=action Value=\"\">
				<INPUT TYPE=hidden Name=TiD Value=\"$TiD\">
				<INPUT TYPE=hidden Name=PG Value=\"$PG\">
				<INPUT TYPE=hidden Name=Source Value=\"$Source\">
				<INPUT TYPE=hidden Name=CoterieName Value=\"$CoterieName\">
				<INPUT TYPE=hidden Name=ZZ_PWD Value=\"$ZZ_PWD\">");

		_print("<U><I><B>Ajouter un piege:</B></I></U>");
		_print(" en : X=&nbsp;<INPUT type=text size=2 name=X value=\"\">&nbsp;&nbsp;Y=&nbsp;<INPUT type=text size=2 name=Y value=\"\">&nbsp;&nbsp;N=&nbsp;<INPUT type=text size=2 name=N value=\"\">&nbsp;&nbsp;<select NAME=TypePiege><OPTION VALUE='Feu'>Feu<OPTION VALUE='Glue'>Glue</SELECT>&nbsp;&nbsp;");
		_print("<input class=mh_form_submit type=submit value=\" Ajouter \" onClick=javascript:onClickAddPiege();>&nbsp;&nbsp;&nbsp;");

#		_print("<BR><BR><U><I><B>Mes pieges actifs:</B></I></U><BR>");

		#Les pieges actifs
		#$query = "SELECT X.* FROM `MZ_Piege` as X, `MZ_Groupe` as G where (X.TiD=$TiD) and (X.TiD=G.TiD) and (G.Nom='"._strs($CoterieName)."') and (G.Pwd='$ZZ_PWD') order by TimeStamp DESC";
		$mysql=_sqlconnect();	# -------------- Ouverture DB  
		$query = "SELECT X.TimeStamp, X.X, X.Y, X.N, X.Type FROM `MZ_Piege` as X where X.TiD=$ZZ_TID order by TimeStamp DESC";
		#echo "//$query<BR>";  
		$result = @MySQL_QUERY($query);
	    _sqlclose();		# -------------- Fermeture DB  
  		$nData = @MySQL_NUM_ROWS($result);
		if ($nData>0) {
			_print("<BR><BR><TABLE CELLSPACING=0 BORDER=0 CELLPADDING=0><TR><TD align=LEFT><U><I><B>Mes pieges actifs:</B></I></U></TD><TD>&nbsp;&nbsp;&nbsp;</TD><TD align=CENTER> <I><B>X</I></B> </TD><TD align=CENTER> <I><B>Y</I></B> </TD><TD align=CENTER> <I><B>N</I></B> </TD><TD></TD></TR>");
	    	for ($i=0; $i<$nData; $i++) { 
   		    	$pTimeStamp=mysql_result($result,$i,"TimeStamp"); 
	        	$pX=mysql_result($result,$i,"X");
	        	$pY=mysql_result($result,$i,"Y");
	        	$pN=mysql_result($result,$i,"N");
	        	$pType=mysql_result($result,$i,"Type");
				$supp="<SPAN TITLE='Supprimer ce piege'><IMG onClick=\"javascript:onClickSuppPiege('DEL|$pTimeStamp|$pX|$pY|$pN');\" onmouseover=\"this.style.cursor='pointer';\" SRC=skin/b_drop.png></span>";
	        	_print("<TR align=CENTER><TD align=LEFT>Posé le '$pTimeStamp' à $pType en </TD><TD></TD><TD>&nbsp;$pX&nbsp;</TD><TD>&nbsp;$pY&nbsp;</TD><TD>&nbsp;$pN&nbsp;</TD><TD>&nbsp;$supp</TD></TR>");
	      	}
			_print("</TABLE>");
	  	} else {
			_print("<BR><BR><I>Il n'y a actuellement aucun piege actif.</I>");	     
	  	}
				
		_print("</FORM>");	     
		_print("<BR><I><U><FONT COLOR=RED SIZE=-2>NOTICE:</U></FONT> Normalement la gestion des pièges est automatique. Le présent menu n'est ici que pour <BR>
		 réparer les imponderables (comme par exemple: les pieges posés sur une machine ne possedant pas ZZ, <BR>
		 la messagerie du bot non-activés, etc...)</I>");	  

		_print("</TABLE>");
		_print("</TABLE>");
		_print("</TABLE>");   
#========================================================================================
# Affichage de la boite de dialogue gerer la diplo perso
} else if ($action=="DlgBoxDiplo") {

	_print('
		<SCRIPT LANGUAGE="JavaScript" TYPE="text/JavaScript">
		function onClickSuppDiplo(id) {FormDlgBox.action.value="DlgBoxDiplo"; FormDlgBox.Diplo.value=id; 	FormDlgBox.submit(); }
		function onClickAddDiplo() { FormDlgBox.action.value="DlgBoxDiplo";	FormDlgBox.Diplo.value="ADD|"+FormDlgBox.tg.value+"|"+FormDlgBox.tgId.value+"|"+FormDlgBox.color.value+"|"+FormDlgBox.memo.value;  FormDlgBox.submit(); }
		</SCRIPT>');
 
	_print("<TABLE WIDTH=98% CELLSPACING=0 BORDER=0 CELLPADDING=2 ALIGN=center><TR><TD ALIGN=center><DIV CLASS=Titre2><b>Gestion de la diplo Perso.</b></DIV></TD><TD align=right><img height=30 width=30 src=MH/diplo.png></TD></TR></TABLE> ");
    _print("
		<TABLE WIDTH=100% CELLSPACING=1 BORDER=0 CELLPADDING=0 CLASS=mh_tdborder><TR class=mh_tdtitre align=left><TD>
		<TABLE WIDTH=100% CELLSPACING=0 BORDER=0 CELLPADDING=2><TR align=left><TD>	");		

		if($Diplo!="") {
			$aDiplo = explode("|", $Diplo);
		
			if( $aDiplo[0]=="ADD") {

				$mysql=_sqlconnect();	# -------------- Ouverture DB  
				if ($aDiplo[1]=='Guilde') $tg='G'; else $tg='T';
				if ($aDiplo[3]=='Ami') $color='#AAFFAA'; else $color='#FFAAAA';
				$memo=mysql_real_escape_string($aDiplo[4]);
				$query = "REPLACE INTO `MZ_Diplo_perso` values(-$ZZ_TID, $aDiplo[2], '$color', '$tg', '$memo')";
				$result = @MySQL_QUERY($query);
				_print("<BR>Une Diplo pour <b>\"$aDiplo[1]=$aDiplo[2] => $aDiplo[3]\"</b> été ajouté/modifié  <BR><BR>");
			  	
			    _sqlclose();		# -------------- Fermeture DB  
			} else if( $aDiplo[0]=="DEL") {
				$mysql=_sqlconnect();	# -------------- Ouverture DB  
				$query = "DELETE FROM `MZ_Diplo_perso` where (tg='$aDiplo[1]') and (tgId=$aDiplo[2]) and (GiD=-$ZZ_TID) ";
				$result = @MySQL_QUERY($query);
		  		$nData = @MySQL_NUM_ROWS($result);				 
				$result = @MySQL_QUERY("SELECT ROW_COUNT() as count;");				
				$nData=mysql_result($result,0,"count");
			    _sqlclose();		# -------------- Fermeture DB  
		  		if ($nData>0) {
					if ($aDiplo[1]=='G') $aDiplo[1]='Guilde'; else $aDiplo[1]='Troll';
					_print("<BR>La Diplo pour <b>\"$aDiplo[1]=$aDiplo[2]\"</b> a été supprimé!<BR><BR>");
		  		}
			}
		} else {
			_print("<BR>");		 
		}
	 
	 	$arr_diplo_perso=array();
	 	$arr_diplo_guilde=array();
		_print("<FORM name=FormDlgBox method=post action=zoryazilla.php class=thin> 
				<INPUT TYPE=hidden Name=Diplo Value=\"\">
				<INPUT TYPE=hidden Name=action Value=\"\">
				<INPUT TYPE=hidden Name=TiD Value=\"$TiD\">
				<INPUT TYPE=hidden Name=PG Value=\"$PG\">
				<INPUT TYPE=hidden Name=Source Value=\"$Source\">
				<INPUT TYPE=hidden Name=CoterieName Value=\"$CoterieName\">
				<INPUT TYPE=hidden Name=ZZ_PWD Value=\"$ZZ_PWD\">");

		_print("<U><I><B>Ajouter une Diplo:</B></I></U>");
		_print("&nbsp;&nbsp;<select NAME=tg><OPTION VALUE='Guilde'>Guilde<OPTION VALUE='Troll'>Troll</SELECT>&nbsp;id:&nbsp;<INPUT type=text size=5 name=tgId value=\"\">&nbsp;<select NAME=color><OPTION VALUE='Ami'>Ami<OPTION VALUE='Ennemi'>Ennemi</SELECT>&nbsp;<INPUT type=text size=24 name=memo value=\"\">&nbsp;");
		_print("<input class=mh_form_submit type=submit value=\" Ajouter \" onClick=javascript:onClickAddDiplo();>&nbsp;&nbsp;&nbsp;");

#		_print("<BR><BR><U><I><B>Mes Diplos actifs:</B></I></U><BR>");

		#La Diplo active
		$mysql=_sqlconnect();	# -------------- Ouverture DB  
		$query = "SELECT distinct D.tgId, D.Color, D.TG, D.memo, T.Troll, G.Guilde  FROM MZ_Diplo_perso as D left join MZ_Trolls T on T.TiD=D.tgId left join MZ_Guildes G on G.GiD=D.tgId where D.GiD=-$ZZ_TID order by Color, TG, tgId DESC";
		//echo "//$query<BR>";  
		$result = @MySQL_QUERY($query);
	    _sqlclose();		# -------------- Fermeture DB  
  		$nData = @MySQL_NUM_ROWS($result);
		if ($nData>0) {
			_print("<br><br><TABLE CELLSPACING=0 BORDER=1 CELLPADDING=0>");
        	_print("<TR><TD colspan=7 width=580><b><i>Ma Diplo perso:</i></b>&nbsp;</TD></TR>");
	    	for ($i=0; $i<$nData; $i++) { 
   		    	$tgId=mysql_result($result,$i,"tgId");  	
	        	$Color=mysql_result($result,$i,"Color"); 	$fontColor=$Color; if ($Color=='#AAFFAA') $Color='Ami'; else $Color='Ennemi';
	        	$TG=mysql_result($result,$i,"TG");			if ($TG=='G') $tg='Guilde'; else $tg='Troll';
	        	$memo=mysql_result($result,$i,"memo");
	        	$Guilde=mysql_result($result,$i,"Guilde");	if ($tg!='Guilde') $Guilde=""; 
	        	$Troll=mysql_result($result,$i,"Troll");	
				if ($tg=='Troll') $name=$Troll; else $name=$Guilde;   
	 			$arr_diplo_perso[$TG][$tgId]=$fontColor;
				
				$supp="<SPAN TITLE='Supprimer cette Diplo'><IMG onClick=\"javascript:onClickSuppDiplo('DEL|$TG|$tgId');\" onmouseover=\"this.style.cursor='pointer';\" SRC=skin/b_drop.png></span>";
				if ($tg=='Troll')$link="<A target=_blank HREF='$MHPJView$tgId'>$name</A>"; else $link="<A target=_blank HREF='$MHGDView$tgId'>$name</A>";
	        	_print("<TR bgcolor=$fontColor  align=CENTER><TD align=RIGHT>&nbsp;$supp</TD><TD align=left>$tg</TD><TD></TD><TD align=right>&nbsp;<b>$tgId</b>&nbsp;</TD><TD align=left>&nbsp;<b>$link</b>&nbsp;</TD><TD>&nbsp;$Color&nbsp;</TD><TD align=left>&nbsp;<i>$memo</i>&nbsp;</TD></TR>");
	      	}
			_print("</TABLE>");
	  	} else {
			_print("<BR><BR><I>Il n'y a actuellement pas de Diplo perso de définie.</I>");	     
	  	}
				
		_print("</FORM>");	     


		#Diplo trivial du partage ZZ
		$mysql=_sqlconnect();	# -------------- Ouverture DB  
	  	$query = "SELECT SHRiD from `MZ_Share` as S where (S.TiD=$ZZ_TID) and (S.link='S')";				// en bleu comme la guilde, les membre avec qui on partage
  		$result = @MySQL_QUERY($query);
  		$nData = @MySQL_NUM_ROWS($result);  		
    	for ($i=0; $i<$nData; $i++) { 
   		    $tgId=mysql_result($result,$i,"SHRiD");
    		$arr_diplo_perso["T"][$tgId]="#BBBBFF";
		}   		
	    _sqlclose();		# -------------- Fermeture DB  


		#La Diplo guilde
		$mysql=_sqlconnect();	# -------------- Ouverture DB  
		$query = "SELECT distinct D.tgId, D.Color, D.TG, T.Troll, G.Guilde  FROM MZ_Diplo as D INNER JOIN MZ_User as U LEFT JOIN MZ_Trolls T on T.TiD=D.tgId LEFT JOIN MZ_Guildes G on G.GiD=D.tgId where (U.TiD=$ZZ_TID) and (D.GiD=U.GiD or D.GiD=-$ZZ_TID) order by Color, TG, tgId ASC";
		//echo "//$query<BR>";  
		$result = @MySQL_QUERY($query);
	    _sqlclose();		# -------------- Fermeture DB  
  		$nData = @MySQL_NUM_ROWS($result);
		if ($nData>0) {
			_print("<br><br><TABLE CELLSPACING=0 BORDER=1 CELLPADDING=0>");
        	_print("<TR><TD colspan=6 width=580><b><i>Ma Diplo Guilde:</i></b>&nbsp;</TD></TR>");
	    	for ($i=0; $i<$nData; $i++) { 
   		    	$tgId=mysql_result($result,$i,"tgId");  	
	        	$Color=mysql_result($result,$i,"Color"); 	$fontColor=$Color; if ($Color=='#AAFFAA') $Color='Ami'; else if ($Color=='#BBBBFF') $Color='Guilde'; else $Color='Ennemi';
	        	$TG=mysql_result($result,$i,"TG");			if ($TG=='G') $tg='Guilde'; else $tg='Troll';
	        	$Guilde=mysql_result($result,$i,"Guilde");	if ($tg!='Guilde') $Guilde=""; 
	        	$Troll=mysql_result($result,$i,"Troll");	
				if ($tg=='Troll') $name=$Troll; else $name=$Guilde;   
	 			$arr_diplo_guilde[$TG][$tgId]=$fontColor;
				if ($arr_diplo_perso[$TG][$tgId]!="") $fontColorZZ=$arr_diplo_perso[$TG][$tgId]; else $fontColorZZ=$fontColor;			
				
				if ($tg=='Troll')$link="<A target=_blank HREF='$MHPJView$tgId'>$name</A>"; else $link="<A target=_blank HREF='$MHGDView$tgId'>$name</A>";
	        	_print("<TR bgcolor=$fontColor  align=CENTER><TD align=left>$tg</TD><TD></TD><TD align=right>&nbsp;<b>$tgId</b>&nbsp;</TD><TD align=left>&nbsp;<b>$link</b>&nbsp;</TD><TD bgcolor=$fontColorZZ>&nbsp;$Color&nbsp;</TD></TR>");
	      	}
			_print("</TABLE>");
	  	} else {
			_print("<BR><BR><I>Il n'y a actuellement pas de Diplo Guilde de définie.</I>");	     
	  	}

		#La Diplo inversée
		$mysql=_sqlconnect();	# -------------- Ouverture DB  
		$query = "SELECT distinct D.GiD, D.tgId, D.Color, D.TG, T.Troll, G.Guilde  FROM MZ_Diplo_inv as D INNER JOIN MZ_User as U LEFT JOIN MZ_Trolls T on T.TiD=D.tgId LEFT JOIN MZ_Guildes G on G.GiD=D.tgId where (U.TiD=$ZZ_TID) and (D.GiD=U.GiD or D.GiD=-$ZZ_TID) order Color, TG, tgId ASC";
		//echo "//$query<BR>";  
		$result = @MySQL_QUERY($query);
	    _sqlclose();		# -------------- Fermeture DB  
  		$nData = @MySQL_NUM_ROWS($result);
		if ($nData>0) {
			_print("<br><br><TABLE CELLSPACING=0 BORDER=1 CELLPADDING=0>");
        	_print("<TR><TD colspan=6 width=580><b><i>Ma Diplo inversée:</i></b>&nbsp;</TD></TR>");
	    	for ($i=0; $i<$nData; $i++) { 
   		    	$GiD=mysql_result($result,$i,"GiD");  	
   		    	$tgId=mysql_result($result,$i,"tgId");  	
	        	$Color=mysql_result($result,$i,"Color"); 	$fontColor=$Color; if ($Color=='#AAFFAA') $Color='Ami'; else $Color='Ennemi';
	        	$TG=mysql_result($result,$i,"TG");			if ($TG=='G') $tg='Guilde'; else $tg='Troll';
	        	$Guilde=mysql_result($result,$i,"Guilde");	if ($tg!='Guilde') $Guilde=""; 
	        	$Troll=mysql_result($result,$i,"Troll");	
				if ($tg=='Troll') $name=$Troll; else $name=$Guilde;   

				if ($arr_diplo_perso[$TG][$tgId]!="") $fontColorZZ=$arr_diplo_perso[$TG][$tgId]; else if (($arr_diplo_guilde[$TG][$tgId]!="")&&($arr_diplo_guilde[$TG][$tgId]!="$fontColor")) $fontColorZZ="#FFD3D3"; else $fontColorZZ=$fontColor;			

				if ($GiD>0) $TG="Guilde"; else $TG=-$GiD;
				if ($tg=='Troll')$link="<A target=_blank HREF='$MHPJView$tgId'>$name</A>"; else $link="<A target=_blank HREF='$MHGDView$tgId'>$name</A>";
	        	_print("<TR bgcolor=$fontColor  align=CENTER><TD></TD><TD align=right>&nbsp;<b>$tgId</b>&nbsp;</TD><TD align=left>&nbsp;<b>$link</b>&nbsp;</TD><TD bgcolor=$fontColorZZ>&nbsp;$Color&nbsp;</TD><TD bgcolor=$fontColorZZ align=left>$TG</TD></TR>");
	      	}
			_print("</TABLE>");
	  	} else {
			_print("<BR><BR><I>Il n'y a actuellement pas de Diplo Inversée de définie.</I>");	     
	  	}
    
		_print("</TABLE>");
		_print("</TABLE>");
		_print("</TABLE>");   		
#========================================================================================
# Affichage de la boite de dialogue gerer les lieux remarquables sur la map!
} else if ($action=="DlgBoxMap") {

	_print('
		<SCRIPT LANGUAGE="JavaScript" TYPE="text/JavaScript">
		function onClickSuppMap(id) {FormDlgBox.action.value="DlgBoxMap"; FormDlgBox.Map.value=id; 	FormDlgBox.submit(); }
		function onClickAddMap() { FormDlgBox.action.value="DlgBoxMap";	FormDlgBox.Map.value="ADD|"+FormDlgBox.tg.value+"|"+FormDlgBox.tgId.value+"|"+FormDlgBox.color.value+"|"+FormDlgBox.memo.value;  FormDlgBox.submit(); }
		</SCRIPT>');
 
	_print("<TABLE WIDTH=98% CELLSPACING=0 BORDER=0 CELLPADDING=2 ALIGN=center><TR><TD ALIGN=center><DIV CLASS=Titre2><b>Lieux remarquables sur ma Carte.</b></DIV></TD><TD align=right><img height=30 width=30 src=MH/map.gif></TD></TR></TABLE> ");
    _print("
		<TABLE WIDTH=100% CELLSPACING=1 BORDER=0 CELLPADDING=0 CLASS=mh_tdborder><TR class=mh_tdtitre align=left><TD>
		<TABLE WIDTH=100% CELLSPACING=0 BORDER=0 CELLPADDING=2><TR align=left><TD>	");		

		if($Map!="") {
			$aMap = explode("|", $Map);
		
			if( $aMap[0]=="ADD") {

				$mysql=_sqlconnect();	# -------------- Ouverture DB  
				if ($aMap[1]=='Guilde') $tg='G'; else $tg='T';
				if ($aMap[3]=='Ami') $color='#AAFFAA'; else $color='#FFAAAA';
				$memo=mysql_real_escape_string($aMap[4]);
				$query = "REPLACE INTO `MZ_Map_perso` values(-$ZZ_TID, $aMap[2], '$color', '$tg', '$memo')";
				$result = @MySQL_QUERY($query);
				_print("<BR>Une Map pour <b>\"$aMap[1]=$aMap[2] => $aMap[3]\"</b> été ajouté/modifié  <BR><BR>");
			  	
			    _sqlclose();		# -------------- Fermeture DB  
			} else if( $aMap[0]=="DEL") {
				$mysql=_sqlconnect();	# -------------- Ouverture DB  
				$query = "DELETE FROM `MZ_Map_perso` where (tg='$aMap[1]') and (tgId=$aMap[2]) and (GiD=-$ZZ_TID) ";
				$result = @MySQL_QUERY($query);
		  		$nData = @MySQL_NUM_ROWS($result);				 
				$result = @MySQL_QUERY("SELECT ROW_COUNT() as count;");				
				$nData=mysql_result($result,0,"count");
			    _sqlclose();		# -------------- Fermeture DB  
		  		if ($nData>0) {
					if ($aMap[1]=='G') $aMap[1]='Guilde'; else $aMap[1]='Troll';
					_print("<BR>La Map pour <b>\"$aMap[1]=$aMap[2]\"</b> a été supprimé!<BR><BR>");
		  		}
			}
		} else {
			_print("<BR>");		 
		}
	 
	 	$arr_Map_perso=array();
	 	$arr_Map_guilde=array();
		_print("<FORM name=FormDlgBox method=post action=zoryazilla.php class=thin> 
				<INPUT TYPE=hidden Name=Map Value=\"\">
				<INPUT TYPE=hidden Name=action Value=\"\">
				<INPUT TYPE=hidden Name=TiD Value=\"$TiD\">
				<INPUT TYPE=hidden Name=PG Value=\"$PG\">
				<INPUT TYPE=hidden Name=Source Value=\"$Source\">
				<INPUT TYPE=hidden Name=CoterieName Value=\"$CoterieName\">
				<INPUT TYPE=hidden Name=ZZ_PWD Value=\"$ZZ_PWD\">");


		_print("<U><I><B>Ajouter un lieu:</B></I></U>");
		_print(" en X=&nbsp;<INPUT type=text size=2 name=X value=\"\">&nbsp;&nbsp;Y=&nbsp;<INPUT type=text size=2 name=Y value=\"\">&nbsp;&nbsp;N=&nbsp;<INPUT type=text size=2 name=N value=\"\">&nbsp;&nbsp;<INPUT type=text size=30 name=memo value=\"\">&nbsp;&nbsp;");
		_print("<input class=mh_form_submit type=submit value=\" Ajouter \" onClick=javascript:onClickAddMAP();>&nbsp;&nbsp;&nbsp;");


		#Mes lieux déjà défini
		$mysql=_sqlconnect();	# -------------- Ouverture DB  
		$query = "SELECT distinct D.tgId, D.Color, D.TG, D.memo, T.Troll, G.Guilde  FROM MZ_Map_perso as D left join MZ_Trolls T on T.TiD=D.tgId left join MZ_Guildes G on G.GiD=D.tgId where D.GiD=-$ZZ_TID order by Color, TG, tgId DESC";
		//echo "//$query<BR>";  
		$result = @MySQL_QUERY($query);
	    _sqlclose();		# -------------- Fermeture DB  
  		$nData = @MySQL_NUM_ROWS($result);
		if ($nData>0) {
			_print("<br><br><TABLE CELLSPACING=0 BORDER=1 CELLPADDING=0>");
        	_print("<TR><TD colspan=7 width=580><b><i>Liste de mes lieux remarquables sur la carte:</i></b>&nbsp;</TD></TR>");
	    	for ($i=0; $i<$nData; $i++) { 
   		    	$tgId=mysql_result($result,$i,"tgId");  	
	        	$Color=mysql_result($result,$i,"Color"); 	$fontColor=$Color; if ($Color=='#AAFFAA') $Color='Ami'; else $Color='Ennemi';
	        	$TG=mysql_result($result,$i,"TG");			if ($TG=='G') $tg='Guilde'; else $tg='Troll';
	        	$memo=mysql_result($result,$i,"memo");
	        	$Guilde=mysql_result($result,$i,"Guilde");	if ($tg!='Guilde') $Guilde=""; 
	        	$Troll=mysql_result($result,$i,"Troll");	
				if ($tg=='Troll') $name=$Troll; else $name=$Guilde;   
	 			$arr_Map_perso[$TG][$tgId]=$fontColor;
				
				$supp="<SPAN TITLE='Supprimer cette Map'><IMG onClick=\"javascript:onClickSuppMap('DEL|$TG|$tgId');\" onmouseover=\"this.style.cursor='pointer';\" SRC=skin/b_drop.png></span>";
				if ($tg=='Troll')$link="<A target=_blank HREF='$MHPJView$tgId'>$name</A>"; else $link="<A target=_blank HREF='$MHGDView$tgId'>$name</A>";
	        	_print("<TR bgcolor=$fontColor  align=CENTER><TD align=RIGHT>&nbsp;$supp</TD><TD align=left>$tg</TD><TD></TD><TD align=right>&nbsp;<b>$tgId</b>&nbsp;</TD><TD align=left>&nbsp;<b>$link</b>&nbsp;</TD><TD>&nbsp;$Color&nbsp;</TD><TD align=left>&nbsp;<i>$memo</i>&nbsp;</TD></TR>");
	      	}
			_print("</TABLE>");
	  	} else {
			_print("<BR><BR><I>Il n'y a actuellement pas de lieu de définie.</I>");	     
	  	}
				
		_print("</FORM>");	     



    
		_print("</TABLE>");
		_print("</TABLE>");
		_print("</TABLE>");   		
#========================================================================================
# Affichage de la boite de dialogue gerer les lieux remarquables sur la map!
} else if ($action=="DlgBoxVue") {

	_print('
		<SCRIPT LANGUAGE="JavaScript" TYPE="text/JavaScript">
		function onClickVoirVue() {
			var listVueId="";
			for (i=0; i<FormDlgBox.nrow.value; i++) {
 				var checkbox = document.getElementsByName("CHECKBOX_VUE_"+i)[0];
 				if (checkbox.checked) {
	 				var TrollID = document.getElementsByName("TrollID_"+i)[0].value;
 					var VueId = document.getElementsByName("VueId_"+i)[0].value;
 					listVueId+=TrollID+"*"+VueId+",";
				}
 			}

			var PosX = document.getElementsByName("X")[0].value;
			var PosY = document.getElementsByName("Y")[0].value;
			var PosN = document.getElementsByName("N")[0].value;
			var VueH = document.getElementsByName("VH")[0].value;
			var VueV = document.getElementsByName("VV")[0].value;
			listVueId+="&PosX="+PosX+"&PosY="+PosY+"&PosN="+PosN+"&VueH="+VueH+"&VueV="+VueV;
			var HREFVue="Play_vue.php?&PG='.$PG.'&ZZMaVue=zoryazilla.php&VueId="+listVueId;
			window.open(HREFVue);
			FormDlgBox.action.value="DlgBoxVue"; 
		}
		</SCRIPT>');


	_print("<TABLE WIDTH=98% CELLSPACING=0 BORDER=0 CELLPADDING=2 ALIGN=center><TR><TD ALIGN=center><DIV CLASS=Titre2><b>Gestionnaire de Vue</b></DIV></TD><TD align=right><img height=30 width=30 src=MH/vue.jpg></TD></TR></TABLE> ");
    _print("
		<TABLE WIDTH=100% CELLSPACING=1 BORDER=0 CELLPADDING=0 CLASS=mh_tdborder><TR class=mh_tdtitre align=left><TD>
		<TABLE WIDTH=100% CELLSPACING=0 BORDER=0 CELLPADDING=2><TR align=left><TD>	");		


	_print("<BR>");		 

	 
		_print("<FORM name=FormDlgBox method=post action=zoryazilla.php class=thin> 
				<INPUT TYPE=hidden Name=Map Value=\"\">
				<INPUT TYPE=hidden Name=action Value=\"\">
				<INPUT TYPE=hidden Name=TiD Value=\"$TiD\">
				<INPUT TYPE=hidden Name=PG Value=\"$PG\">
				<INPUT TYPE=hidden Name=Source Value=\"$Source\">
				<INPUT TYPE=hidden Name=CoterieName Value=\"$CoterieName\">
				<INPUT TYPE=hidden Name=ZZ_PWD Value=\"$ZZ_PWD\">");

		_print("<U><I><B>Liste des vues disponibles:</B></I></U><br>");
		#_print("<U><I><B>Vues groupées, centrer la vue sur:</B></I></U><br>");
		#_print("X=&nbsp;<INPUT type=text size=2 name=X value=\"\">&nbsp;&nbsp;Y=&nbsp;<INPUT type=text size=2 name=Y value=\"\">&nbsp;&nbsp;N=&nbsp;<INPUT type=text size=2 name=N value=\"\">&nbsp;&nbsp;Portée Horizontale=&nbsp;<INPUT type=text size=2 name=VH value=\"\">&nbsp;&nbsp;Portée Verticale=&nbsp;<INPUT type=text size=2 name=VV value=\"\">&nbsp;&nbsp;");
		#_print("<input class=mh_form_submit type=submit value=\"     Voir     \" onClick=javascript:onClickVoirVue();>&nbsp;&nbsp;&nbsp;");


		#Mes lieux déjà défini
		$mysql=_sqlconnect();	# -------------- Ouverture DB  

		// pour le gestionnaire de vue!
		$query = "SELECT DISTINCT P.Troll, P.TiD, V.* FROM `MZ_VueManager` as V INNER JOIN `MZ_Profil` as P ON (V.TiD=P.TiD) INNER JOIN `MZ_Share` as S ON (V.TiD=S.SHRiD) where (S.TiD=$ZZ_TID) and (S.link='S') order by V.TimeStamp desc ";
		  //echo "$query<BR>";  

		$result = @MySQL_QUERY($query);
	    _sqlclose();		# -------------- Fermeture DB  
  		$nData = @MySQL_NUM_ROWS($result);
		if ($nData>0) {
			_print("<br><br><TABLE width=580 CELLSPACING=0 BORDER=1 CELLPADDING=0><INPUT type=hidden name=nrow value=\"$nData\">");
        	_print("<TR align=center><TD align=left colspan=4 ><b><i>Liste des Vues disponibles:</i></b>&nbsp;</TD><TD><B>X</B></TD><TD><B>Y</B></TD><TD><B>N</B></TD><TD><B>H</B></TD><TD><B>V</B></TD></TR>");
	    	for ($i=0; $i<$nData; $i++) { 
   		    	$VueId=mysql_result($result,$i,"VueId");  	
   		    	$TrollID=mysql_result($result,$i,"TiD");  	
   		    	$Troll=mysql_result($result,$i,"Troll");  	
   		    	$TypeVue=mysql_result($result,$i,"TypeVue");  	
   		    	$TimeStamp=mysql_result($result,$i,"TimeStamp");  	
   		    	$PosX=mysql_result($result,$i,"PosX");  	
   		    	$PosY=mysql_result($result,$i,"PosY");  	
   		    	$PosN=mysql_result($result,$i,"PosN");  	
   		    	$VueH=mysql_result($result,$i,"VueH");  	
   		    	$VueV=mysql_result($result,$i,"VueV");  	

 				$ZZVueId="$TrollID*$VueId";
		 		$ZZMaVue="zoryazilla.php";  
 				$ZZVuePG=$PG;
				$HREFVue="Play_vue.php?&PG=$PG&ZZMaVue=$ZZMaVue&VueId=$ZZVueId";

				$CheckView ="";
				//$CheckView ="<span  TITLE='Selectionner pour réaliser une vue groupée'><input name=CHECKBOX_VUE_$i type=checkbox></span>"; 
				$CheckView.="<INPUT type=hidden name=TrollID_$i value=\"$TrollID\">"; 
				$CheckView.="<INPUT type=hidden name=VueId_$i value=\"$VueId\">"; 
				$view="<SPAN TITLE='Voir cette Vue'><IMG onClick=window.open('$HREFVue'); onmouseover=\"this.style.cursor='pointer';\" SRC=skin/lunette.gif></span>";
	        	_print("<TR align=CENTER><TD width=50px align=CENTER>$CheckView&nbsp;$view&nbsp;</TD><TD align=left><A target=_blank HREF='$MHPJView$TrollID'><SPAN TITLE='$TrollID'><b>$Troll</b></SPAN></A></TD><TD align=left>$TimeStamp</TD><TD align=Center>$TypeVue</TD><TD align=Center>$PosX</TD><TD align=Center>$PosY</TD><TD align=Center>$PosN</TD><TD align=Center>$VueH</TD><TD align=Center>$VueV</TD></TR>");
	      	}
			_print("</TABLE>");
	  	} else {
			_print("<BR><BR><I>Il n'y a actuellement pas de lieu de définie.</I>");	     
	  	}
				
		_print("</FORM>");	     



    
		_print("</TABLE>");
		_print("</TABLE>");
		_print("</TABLE>");   		
#========================================================================================
# Configuration des préférences ZZ
} else if ($action=="Prefs") {

	_print('<SCRIPT LANGUAGE="JavaScript" TYPE="text/JavaScript">
			function onClickSetPref(type) {FormDlgBox.Prefs.value=type;	FormDlgBox.submit(); }
			</SCRIPT>');

	_print("<TABLE WIDTH=98% CELLSPACING=0 BORDER=0 CELLPADDING=2 ALIGN=center><TR><TD ALIGN=center><DIV CLASS=Titre2><b>Mes préférences</b></DIV></TD><TD align=right><img height=30 width=30 src=MH/prefs.png></TD></TR></TABLE> ");
	_print("<FORM name=FormDlgBox method=post action=zoryazilla.php class=thin>
			<TABLE><TR><INPUT TYPE=hidden Name=action Value=\"Prefs\">
			<INPUT TYPE=hidden Name=Prefs>
			<INPUT TYPE=hidden Name=PG Value=\"$PG\">
			<INPUT TYPE=hidden Name=Source Value=\"$Source\">");


	//control d'intégrité=======
	if ($SkinZZ=="") $SkinZZ="http://".$_SERVER["HTTP_HOST"].substr($_SERVER["REQUEST_URI"], 0, strlen($_SERVER["REQUEST_URI"])-14)."skin/";
	if (!is_numeric($ZMON)) $ZMON=5;
	if (!is_numeric($ZTRO)) $ZTRO=0;
	if (!is_numeric($ZTRE)) $ZTRE=5;
	if (!is_numeric($ZLIE)) $ZLIE=15;
	if (($DIPLO_INV!='oui')&&($DIPLO_INV!='non')) $DIPLO_INV='oui';
	if (($DIPLO_PERSO!='oui')&&($DIPLO_PERSO!='non')) $DIPLO_PERSO='oui';
	if (($SHARE_VUE!='oui')&&($SHARE_VUE!='non')) $SHARE_VUE='oui';
	if ($Prefs=='default') { 
 		//_print("<INPUT TYPE=hidden Name=SETPREFX Value=\"default\">"); 
  		$SkinZZ="http://".$_SERVER["HTTP_HOST"].substr($_SERVER["REQUEST_URI"], 0, strrpos($_SERVER["REQUEST_URI"], "/"))."/skin/";
  		$ZMON=5;
  		$ZTRO=0;
  		$ZTRE=5;
  		$ZLIE=15;
  		$DIPLO_INV='oui'; 
  		$DIPLO_PERSO='oui'; 
  		$SHARE_VUE='oui';   		
	}	else if ($Prefs=='save') { 
 		//_print("<INPUT TYPE=hidden Name=SETPREF Value=\"save\">"); 
 		//_print("<INPUT TYPE=hidden Name=SETPREF_SkinZZ Value=\"$SkinZZ\">"); 
 		//_print("<INPUT TYPE=hidden Name=SETPREF_HandiZilla Value=\"$HandiZilla\">"); 
 		//_print("<INPUT TYPE=hidden Name=SETPREF_ZMON Value=\"$ZMON\">"); 
 		//_print("<INPUT TYPE=hidden Name=SETPREF_ZTRO Value=\"$ZTRO\">"); 
 		//_print("<INPUT TYPE=hidden Name=SETPREF_ZLIE  Value=\"$ZLIE\">"); 
 		//_print("<INPUT TYPE=hidden Name=SETPREF_ZTRE  Value=\"$ZTRE\">"); 

		$mysql=_sqlconnect();	# -------------- Ouverture DB  
		$query = "REPLACE MZ_User_prefs values($ZZ_TID, '".mysql_real_escape_string($SkinZZ)."', $ZMON, $ZTRO, $ZTRE, $ZLIE, '$DIPLO_INV', '$DIPLO_PERSO', '$SHARE_VUE', '$SCRIPTS_COMP')";
		$result = @MySQL_QUERY($query);
	    _sqlclose();		# -------------- Fermeture DB 
	} else {
		$mysql=_sqlconnect();	# -------------- Ouverture DB  
		$query = "SELECT * from MZ_User_prefs where TiD=$ZZ_TID";
		$result = @MySQL_QUERY($query);
  		if (@MySQL_NUM_ROWS($result)>0) {
  			$SkinZZ=@mysql_result($result,0,"SkinZZ");
	  		$ZMON=@mysql_result($result,0,"ZMON");
	  		$ZTRO=@mysql_result($result,0,"ZTRO");
	  		$ZTRE=@mysql_result($result,0,"ZTRE");
	  		$ZLIE=@mysql_result($result,0,"ZLIE");
	  		$DIPLO_INV=@mysql_result($result,0,"DIPLO_INV");
	  		$DIPLO_PERSO=@mysql_result($result,0,"DIPLO_PERSO");
	  		$SHARE_VUE=@mysql_result($result,0,"SHARE_VUE");	  	
	  		$SCRIPTS_COMP=@mysql_result($result,0,"SCRIPTS_COMP");
	  	}
		_sqlclose();		# -------------- Fermeture DB 
	}
	$INV_DIPLO_CN=''; $INV_DIPLO_CO='';
	$INV_DIPLO2_CN=''; $INV_DIPLO2_CO='';
	$INV_SHRVUE_CN=''; $INV_SHRVUE_C0='';	
  	if ($DIPLO_INV=='non') $INV_DIPLO_CN='checked'; else $INV_DIPLO_CO='checked';
  	if ($DIPLO_PERSO=='non') $INV_DIPLO2_CN='checked'; else $INV_DIPLO2_CO='checked';
  	if ($SHARE_VUE=='non') $INV_SHRVUE_CN='checked'; else $INV_SHRVUE_C0='checked';
	
    _print("
		<TABLE WIDTH=100% CELLSPACING=1 BORDER=0 CELLPADDING=0 CLASS=mh_tdborder><TR class=mh_tdtitre align=left><TD>
		<TABLE WIDTH=100% CELLSPACING=0 BORDER=0 CELLPADDING=2><TR align=left><TD>	");		
		
	_print( "<tr><td>&nbsp;Pack Graphique ZZ:</td><td><input size=60 type=text name=SkinZZ value=\"$SkinZZ\"></td></tr>");

//	_print( "<tr><td>&nbsp;HandiZilla:</td><td><input size=5 type=text name=HandiZilla value='' READONLY></td></tr>");
///	_print( "<tr><td>&nbsp;HandiZilla:</td><td><select NAME=HandiZilla><OPTION VALUE='non'>Non<OPTION VALUE='oui'>Oui</SELECT></td></tr>");

	_print( "<tr><td>&nbsp;Couverture Monstres:</td><td><input size=5 type=text name=ZMON value='$ZMON'> <font size=-2><i>(affichage des insultes)</i></font></td></tr>");
	_print( "<tr><td>&nbsp;Couverture Trolls:</td><td><input size=5 type=text name=ZTRO value='$ZTRO'> <font size=-2><i>(affichage des hors-vue, 0=sans limite)</i></font></td></tr>");
	_print( "<tr><td>&nbsp;Couverture Trésors:</td><td><input size=5 type=text name=ZTRE value='$ZTRE'> <font size=-2><i>(affichage des trésors identifiés, 0=sans limite)</i></td></tr>");
	_print( "<tr><td>&nbsp;Couverture Pièges:</td><td><input size=5 type=text name=ZLIE value='$ZLIE'> <font size=-2><i>(affichage des pièges, 0=sans limite)</i></td></tr>");
	_print( "<tr><td>&nbsp;Diplo Inversée:</td><td><input type=radio name=DIPLO_INV value=oui $INV_DIPLO_CO><b>O</b>ui&nbsp;<input type=radio name=DIPLO_INV value=non $INV_DIPLO_CN><b>N</b>on</td></tr>");
	_print( "<tr><td>&nbsp;Diplo Perso:</td><td><input type=radio name=DIPLO_PERSO value=oui $INV_DIPLO2_CO><b>O</b>ui&nbsp;<input type=radio name=DIPLO_PERSO value=non $INV_DIPLO2_CN><b>N</b>on</td></tr>");
	_print( "<tr><td>&nbsp;Envoi de la Vue en Auto.:</td><td><input type=radio name=SHARE_VUE value=oui $INV_SHRVUE_C0><b>O</b>ui&nbsp;<input type=radio name=SHARE_VUE value=non $INV_SHRVUE_CN><b>N</b>on</td></tr>");
	_print("<tr><td></td><td><br><input class=mh_form_submit type=submit value=\" Valider \" onClick=javascript:onClickSetPref('save');>&nbsp;&nbsp;");
	_print("<input class=mh_form_submit type=submit value=\" Par défaut \" onClick=javascript:onClickSetPref('default');>&nbsp;&nbsp;");
	_print("<input class=mh_form_submit type=submit value=\" Annuler \" onClick=javascript:onClick10();>");
	_print("<input type=hidden name=SCRIPTS_COMP value='$SCRIPTS_COMP'></td></tr>");
	_print("<tr><td colspan=2>&nbsp;&nbsp;&nbsp;<U>Mon compte utilisateur</u>:");
	_print("<tr><td colspan=2>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href=zoryazilla.php?&Source=$Source&action=DlgBoxChangeMDP>Changer mon password ZZ</a>");
	_print("<tr><td colspan=2>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href=zoryazilla.php?&Source=$Source&action=Autologon>Sauvegarder mon password ZZ</a>");

	_print("</td></tr><tr><td></td><td></td></tr>");

	_print("</TABLE>");
	_print("</FORM>");
	_print("</TABLE>");
	_print("</TABLE>");
}
#========================================================================================
#_print("<B><I>Sélectionner une option du menu!</I></B><BR><BR>");


#========================================================================================
_print("</TD></TR></TABLE>");


if ($Source!="") {
	_print("</TD></TR></TABLE>");
}


#----------------------------------------------------------------------------------- 
//_sqlTLog();	#Log des consommations de temps SQL et PHP
_sqllogTiD($_SESSION['login'], "zoryazilla.php");		// log sur les trolls
?>