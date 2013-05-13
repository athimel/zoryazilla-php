<?php
session_cache_limiter("nocache");
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1		pour empecher la mise en cache (cache trop important avec ironie ou FF8) !!!
$TimeStartPHPCode=microtime();			// on démarre le timer....
#========================================================================================
session_start();

#header('Content-Type: text/html; charset=iso-8859-1'); 		// pour les caractère accentué
require_once("./Config/_sqlconf.php");
require("_global.php");

if (!empty($_SESSION['login'])) { #Recupération de l'ID de Session
	$ZZ_TID=$_SESSION['login'] ;
}
$num=$ZZ_TID;

#========================================================================================
# lecture des paramèetres d'entrées
if (strpos($VueId, ",")) { // agréga de vue
	$simpleVue=false;
	$WhereVueId="";
	$arr_VueId=explode(",", $VueId);
	foreach ($arr_VueId as $tv) if ($tv!="") {
		$tab_VueId=explode("*", $tv);
		$TiD=$tab_VueId[0];
		_sqlAddLogId($TiD);			// ajout d'une log pour ce troll 
		$VueId=$tab_VueId[1];
		if ($WhereVueId!="")  $WhereVueId.=" or ";
		$WhereVueId.=" (V.TiD=$TiD and VueId=$VueId) ";
	}
} else {
	$simpleVue=true;
	$tab_VueId=explode("*", $VueId);
	$TiD=$tab_VueId[0];
	_sqlAddLogId($TiD);			// ajout d'une log pour ce troll 
	$VueId=$tab_VueId[1];
	$WhereVueId=" (V.TiD=$TiD and VueId=$VueId) ";
}

#========================================================================================
# Log ZZ
$mysql=_sqlconnect();	# -------------- Ouverture DB  
if ($TiD>0) {
 	_sqllogTiD($_SESSION['login'], "Play_vue.php");		// log sur les trolls
}

//============ Variable de la vue
if ($PG=="") $PG="/MH/MH_Packs/packMH_parchemin";		// Gestion du pack Graphoique!
if ($MaVue=="") $MaVue="http://games.mountyhall.com/mountyhall/MH_Play/Play_vue.php";
if (strpos($MaVue, "/", 9)>0) $ROOTMH=substr($MaVue, 0, strpos($MaVue, "/", 9)+1); else $ROOTMH=substr($MaVue, 0, strpos($MaVue, "\\", 9)+1);



$mysql=_sqlconnect();	# -------------- Ouverture DB  
if ($simpleVue)
	$query =  "SELECT V.*, T.* FROM `MZ_VueManager` as V LEFT JOIN MZ_Trolls as T on T.TiD=V.TiD INNER JOIN `MZ_Share` as S ON (V.TiD=S.SHRiD) WHERE (S.TiD=$num) and (S.link='S') and $WhereVueId";
else
	$query =  "SELECT Max(TimeStamp) as TimeStamp, Avg(PosX) as PosX, Avg(PosY) as PosY, Avg(PosN) as PosN, Max(VueH) as VueH, Max(VueV) as VueV FROM `MZ_VueManager` as V LEFT JOIN MZ_Trolls as T on T.TiD=V.TiD INNER JOIN `MZ_Share` as S ON (V.TiD=S.SHRiD) WHERE (S.TiD=$num) and (S.link='S') and $WhereVueId";
#echo "$query<BR>";     
$result = MySQL_QUERY($query);    
_sqlclose();		# -------------- Fermeture DB  

// valeurs par défaut!
$ZZPosX=0;
$ZZPosY=0;
$ZZPosN=0;
$ZZVueV=0;
$ZZVueH=0;
if (@MySQL_NUM_ROWS($result)>=1) {	// valeur de la vue ou moyenne des vues!
	$TimeStamp=mysql_result($result,0,"TimeStamp"); 
	$ZZPosX=mysql_result($result,0,"PosX"); 
	$ZZPosY=mysql_result($result,0,"PosY"); 
	$ZZPosN=mysql_result($result,0,"PosN"); 
	$ZZVueV=mysql_result($result,0,"VueV"); 
	$ZZVueH=mysql_result($result,0,"VueH"); 
}

if ($PosX=="") $PosX=$ZZPosX;
if ($PosY=="") $PosY=$ZZPosY;
if ($PosN=="") $PosN=$ZZPosN;
if ($VueV=="") $VueV=$ZZVueV;
if ($VueH=="") $VueH=$ZZVueH;
$PosX=round($PosX);
$PosY=round($PosY);
$PosN=round($PosN);
$VueV=round($VueV);
$VueH=round($VueH);

$TimeStampMH=date("d/m/Y h:i:s", strtotime($TimeStamp));

#==================================================================== header ====================================================
echo "
<HTML>
<HEAD>
<TITLE>MountyHall - La Terre des Trõlls</TITLE>
<META HTTP-EQUIV=\"Content-Type\" CONTENT=\"text/html; charset=iso-8859-1\">
<SCRIPT LANGUAGE=\"JavaScript\" SRC=\"scripts/JavaScripts/MH_Enter.js\"></SCRIPT>
<SCRIPT LANGUAGE=\"JavaScript\" SRC=\"scripts/JavaScripts/MH_Utils.js\"></SCRIPT>
<SCRIPT LANGUAGE=\"JavaScript\" TYPE=\"text/JavaScript\">
	function CheckView()
	{
		if (!isNaN(document.LimitViewForm.ai_MaxVue.value))
		{
			if (document.LimitViewForm.ai_MaxVue.value > 0)
			{
				if (document.LimitViewForm.ai_MaxVue.value > 8)
				{
					document.LimitViewForm.ai_MaxVue.value = 8;
					alert(\"La limitation de votre vue ne peut pas dépasser celle-ci!\");
					return false;
				}
				else
				{
					return true;
					//document.LimitViewForm.submit();
				}
			}
			else
			{
				document.LimitViewForm.ai_MaxVue.value = 0;
				alert(\"La limitation de votre vue ne peut pas être négative ou nulle!\");
				return false;
			}
		}
		else
		{
			document.LimitViewForm.ai_MaxVue.value = 0;
			alert(\"Vous devez entrer une valeur numérique!\");
			return false;
		}
	}
</SCRIPT>
<SCRIPT LANGUAGE=\"JavaScript\" SRC=\"/mountyhall/JavaScripts/MH_Utils.js\"></SCRIPT>
<LINK REL=\"stylesheet\" HREF=\"$PG/css/MH_Style_Play.css\" TYPE=\"text/css\">
</HEAD>

<BODY >

<!-- Debut HeaderPlay -->
<noframes>
<DIV CLASS=\"titreMenu\" ALIGN=center><a href=\"/mountyhall/MH_Play/Play_profil.php\">Profil</a> | <a href=\"/mountyhall/MH_Play/Play_vue.php\">Vue</a> | <a href=\"/mountyhall/MH_Play/Play_equipement.php\">Equipement</a> | <a href=\"/mountyhall/MH_Play/Play_mouche.php\">Mouches</a> | <a href=\"/mountyhall/MH_Play/Play_BM.php\">Bonus-Malus</a> | <a href=\"/mountyhall/MH_Play/Play_evenement.php\">Ev&eacute;nements</a> | <a href=\"/mountyhall/Messagerie/MH_Messagerie.php\">Messages</a> | <a href=\"/mountyhall/MH_Play/Play_option.php\">Options</a> | <a href=\"/mountyhall/MH_Guildes/Guilde.php\">Guilde</a> | <a href=\"/mountyhall/MH_Lieux/Lieu_Description.php\">Lieu</a> | <a href=\"/mountyhall/MH_Missions/Mission_Description.php\">Mission</a></DIV>
<DIV CLASS=\"titreMenu\" ALIGN=center><a href=\"/mountyhall/MH_Play/Play_action.php\">** ACTIONS **</a></DIV>
</noframes>
<DIV CLASS=\"actionTitre\" ALIGN=center>
</DIV>
<TABLE CELLSPACING=0 CELLPADDING=0 WIDTH=\"100%\" ALIGN=left BORDER=0>
  <TBODY>
  <TR>
    <TD VALIGN=top ALIGN=LEFT><A HREF=\"http://www.mountyhall.com\" TARGET=\"_blank\">
<IMG SRC=\"$PG/contenu/header.jpg\" WIDTH=780 BORDER=\"0\" ALIGN=top>
</A> </TD></TR>
<TR><TD>
      <TABLE CELLSPACING=0 CELLPADDING=0 WIDTH=100% ALIGN=center BORDER=0>

        <TBODY>
        <TR>
          <TD WIDTH=\"55\" BACKGROUND=\"$PG/fond/fond.jpg\">&nbsp;</TD>
		  <TD VALIGN=top ALIGN=middle HEIGHT=1000>
		  	<DIV ALIGN=\"right\"><A HREF=\"$ROOTMH/mountyhall/Play.php\" CLASS=\"AllLinks\" TARGET=\"_top\">[Refresh]</A><A HREF=\"$ROOTMH/mountyhall/Logout.php\" CLASS=\"AllLinks\" TARGET=\"_top\">[Logout]</A> 
              <!-- Fin HeaderPlay -->
              <!-- Debut Contenu -->
  

  
          </DIV>

<TABLE WIDTH='98%' CELLSPACING='0' BORDER='0' CELLPADDING='2' ALIGN='center'><TR><TD ALIGN='center'><DIV CLASS='Titre2'><b>MA VUE</b></DIV></TD></TR></TABLE><CENTER>
  <A NAME=\"top\"></A>
  <A HREF=\"#monstres\" CLASS=\"AllLinks\">Monstres</A> | <A HREF=\"#trolls\" CLASS=\"AllLinks\">Trõlls</A> | <A HREF=\"#tresors\" CLASS=\"AllLinks\">Trésors</A>  | <A HREF=\"#champignons\" CLASS=\"AllLinks\">Champignons</A> | <A HREF=\"#lieux\" CLASS=\"AllLinks\">Lieux</A> | <A HREF=\"#cadavre\" CLASS=\"AllLinks\">C&eacute;notaphes</A>

</CENTER>
<INPUT TYPE=\"hidden\" NAME=\"ai_IdPJ\" VALUE=\"$ZZ_TID\">
<INPUT TYPE=\"hidden\" NAME=\"ai_Niveau\" VALUE=\"\">
<INPUT TYPE=\"hidden\" NAME=\"as_Nom\" VALUE=\"\">
<FORM ACTION=\"Play_vue.php?monstres=1&trolls=1&tresors=1&champignons=1&lieux=1\" METHOD=\"post\" NAME=\"LimitViewForm\">
  <TABLE WIDTH=\"98%\" BORDER=\"0\" ALIGN=\"CENTER\" CELLPADDING=\"4\" CELLSPACING=\"1\" CLASS=\"mh_tdborder\">
    <TR CLASS=\"mh_tdtitre\"> 
      <TD ALIGN=\"left\" VALIGN=\"MIDDLE\"> <UL>
        <LI><B>Ma Position Actuelle</B> est :<B> X = $PosX, 
            Y = $PosY, N = $PosN</B></LI>

        <LI><B> Ma Vue</B> porte actuellement à<B> $VueH cases horizontalement</B> et<B> $VueV verticalement.</B></LI>
        <LI><B> L'affichage </B>est limité à<B> $VueH cases horizontalement</B> et<B> $VueV verticalement.</B> </LI>

        <LI><B> Ma Vue affiche : </B>  les <B>PNJ</B> les <B>Trolls Intangibles</B> les <B>Gowaps</B>        <LI><B> Mais n'affiche pas : </B> 		</LI>

      </UL></TD>
      <TD WIDTH=\"175\" ALIGN=\"left\"> 
        <INPUT NAME=\"bLimitView\" TYPE=\"submit\" VALUE=\"Limiter la Vue à\" onClick=\"CheckView();\" CLASS=\"mh_form_submit\" onMouseOver=\"this.style.cursor='hand';\">
        <BR>        
		<INPUT NAME=\"ai_MaxVue\" TYPE=\"text\" CLASS=\"TextboxV2\" VALUE=\"$VueH\" SIZE=\"5\" MAXLENGTH=\"3\">
        cases Horizontales
		<BR>        
		<INPUT NAME=\"ai_MaxVueVert\" TYPE=\"text\" CLASS=\"TextboxV2\" VALUE=\"$VueV\" SIZE=\"5\" MAXLENGTH=\"3\">
        cases Verticales 
	  </TD>
    </TR>

  </TABLE>
</FORM>
<P>


<TABLE WIDTH=\"98%\" BORDER=0 CELLSPACING=1 CELLPADDING=2 class=\"mh_tdborder\" ALIGN=\"center\">
<TR class=\"mh_tdtitre\"><TD>
<table width=\"100%\"><tr><td width=\"25\"><a href=\"javascript:afficheDetailTrPlus('mh_vue_hidden_monstres','mh_vue_plus_monstres');\"  CLASS=\"AllLinks\" id=\"mh_vue_plus_monstres\">[-]</a></td>
<td><A NAME=\"monstres\"><B>MONSTRES ERRANTS</B></a></td><td width=\"400\" align=\"right\">Monstres | <A HREF=\"#trolls\" CLASS=\"AllLinks\">Trõlls</A> | <A HREF=\"#tresors\" CLASS=\"AllLinks\">Trésors</A> | <A HREF=\"#champignons\" CLASS=\"AllLinks\">Champignons</A> | <A HREF=\"#lieux\" CLASS=\"AllLinks\">Lieux</A> | <A HREF=\"#cadavres\" CLASS=\"AllLinks\">C&eacute;notaphes</A></td></tr></table>

</TD></TR>
</TABLE>

<TABLE WIDTH=\"98%\" BORDER=0 CELLSPACING=0 CELLPADDING=0 ALIGN=\"center\">
<TR class=\"mh_tdtitre\" id=\"mh_vue_hidden_monstres\"><TD>
<table width=\"100%\" BORDER=0 CELLSPACING=1 CELLPADDING=2 class=\"mh_tdborder\">
<TR class=\"mh_tdtitre\"><TD WIDTH=\"30\"><B>Dist.</B></TD><TD WIDTH=\"50\"><B>Réf.</B></TD><TD><B>Nom</B></TD><TD WIDTH=\"30\" align=\"center\"><B>X</B></TD><TD WIDTH=\"30\" align=\"center\"><B>Y</B></TD><TD WIDTH=\"30\" align=\"center\"><B>N</B></TD></TR>
";
#==================================================================== MONSTRES ====================================================
#<TR class=\"mh_tdpage\"><TD>0</TD><TD>3195849</TD><TD><A HREF='javascript:EMV(3195849,750,550)' CLASS='mh_monstres'>Familier [Nouveau]</A></TD><TD align=\"center\">-65</TD><TD align=\"center\">-77</TD><TD align=\"center\">-47</TD></TR>

$mysql=_sqlconnect();	# -------------- Ouverture DB  
$query =  "SELECT if(abs(X-$PosX)>abs(Y-$PosY), if(abs(X-$PosX)>abs(N-$PosN), abs(X-$PosX), abs(N-$PosN)), if(abs(N-$PosN)>abs(Y-$PosY), abs(N-$PosN), abs(Y-$PosY))) as dist, Id, nom, Description, Niveau, X, Y, N ";
$query .= "FROM `MZ_Vue` as V INNER JOIN `MZ_Share` as S ON (V.TiD=S.SHRiD) WHERE (S.TiD=$num) and (S.link='S') and  TypeElement=1 and ($WhereVueId) order by dist";
//echo "$query<BR>";     
$result = MySQL_QUERY($query);    
_sqlclose();		# -------------- Fermeture DB  
$nrow=@MySQL_NUM_ROWS($result);
for ($i=0; $i<$nrow; $i++) 
{
	$dist=mysql_result($result,$i,"dist"); 
	$Id=mysql_result($result,$i,"Id"); 
	$nom=mysql_result($result,$i,"Nom"); 
	$age=mysql_result($result,$i,"Description"); 
	$X=mysql_result($result,$i,"X"); 
	$Y=mysql_result($result,$i,"Y"); 
	$N=mysql_result($result,$i,"N");  
	echo "<TR class=\"mh_tdpage\"><TD>$dist</TD><TD>$Id</TD><TD><A HREF='javascript:EMV($Id,750,550)' CLASS='mh_monstres'>$nom [$age]</A></TD><TD align=\"center\">$X</TD><TD align=\"center\">$Y</TD><TD align=\"center\">$N</TD></TR>";
	
}


echo "
</table>
</td></tr></table>
&nbsp;

<TABLE WIDTH=\"98%\" BORDER=0 CELLSPACING=1 CELLPADDING=2 class=\"mh_tdborder\" ALIGN=\"center\">
<TR class=\"mh_tdtitre\"><TD>
<table width=\"100%\"><tr><td width=\"25\"><a href=\"javascript:afficheDetailTrPlus('mh_vue_hidden_trolls','mh_vue_plus_trolls');\"  CLASS=\"AllLinks\" id=\"mh_vue_plus_trolls\">[-]</a></td>
<td><A NAME=\"trolls\"><B>TR&Otilde;LLS</B></a></td><td width=\"400\" align=\"right\"><A HREF=\"#monstres\" CLASS=\"AllLinks\">Monstres</A> | Trõlls | <A HREF=\"#tresors\" CLASS=\"AllLinks\">Trésors</A> | <A HREF=\"#champignons\" CLASS=\"AllLinks\">Champignons</A> | <A HREF=\"#lieux\" CLASS=\"AllLinks\">Lieux</A> | <A HREF=\"#cadavres\" CLASS=\"AllLinks\">C&eacute;notaphes</A></td></tr></table>

</TD></TR>
</TABLE>

<TABLE WIDTH=\"98%\" BORDER=0 CELLSPACING=0 CELLPADDING=0 ALIGN=\"center\">
<TR class=\"mh_tdtitre\" id=\"mh_vue_hidden_trolls\"><TD>
<table width=\"100%\" BORDER=0 CELLSPACING=1 CELLPADDING=2 class=\"mh_tdborder\">
<TR class=\"mh_tdtitre\"><TD WIDTH=\"30\"><B>Dist.</B></TD><TD WIDTH=\"50\"><B>Réf.</B></TD><TD><B>Nom</B></TD><TD WIDTH=\"30\" align=\"center\"><B>Niveau</B></TD><TD><B>Race</B></TD><TD><B>Guilde </B></TD><TD WIDTH=\"30\" align=\"center\"><B>X</B></TD><TD WIDTH=\"30\" align=\"center\"><B>Y</B></TD><TD WIDTH=\"30\" align=\"center\"><B>N</B></TD></TR>
";
#==================================================================== TROLLS ====================================================
#<TR class=\"mh_tdpage\"><TD>1</TD><TD>17203</TD><TD><A HREF=\"javascript:EPV(17203)\" CLASS='mh_trolls_1'>Beuarghh</A></TD><TD>59</TD><TD>Kastar</TD><TD><A HREF='javascript:EAV(1605,750,550)' CLASS='mh_links'>Les Trolls mousquetaires</a></TD><TD align=\"center\">-64</TD><TD align=\"center\">-78</TD><TD align=\"center\">-47</TD></TR>

$mysql=_sqlconnect();	# -------------- Ouverture DB  
$query =  "SELECT distinct if(abs(X-$PosX)>abs(Y-$PosY), if(abs(X-$PosX)>abs(N-$PosN), abs(X-$PosX), abs(N-$PosN)), if(abs(N-$PosN)>abs(Y-$PosY), abs(N-$PosN), abs(Y-$PosY))) as dist, Id, nom, Description, V.Niveau, X, Y, N, G.GiD, G.Guilde ";
$query .= "FROM `MZ_Vue` as V INNER JOIN `MZ_Share` as S ON (V.TiD=S.SHRiD) ";
$query .= "LEFT JOIN MZ_Trolls as T on T.TiD=V.Id ";
$query .= "LEFT JOIN MZ_Guildes as G on G.GiD=T.GiD "; 
$query .= "WHERE (S.TiD=$num) and (S.link='S') and TypeElement=2 and ($WhereVueId) order by dist";
//echo "$query<BR>";     
$result = MySQL_QUERY($query);    
_sqlclose();		# -------------- Fermeture DB  
$nrow=@MySQL_NUM_ROWS($result);
for ($i=0; $i<$nrow; $i++) 
{
	$dist=mysql_result($result,$i,"dist"); 
	$Id=mysql_result($result,$i,"Id"); 
	$nom=mysql_result($result,$i,"Nom"); 
	$race=mysql_result($result,$i,"Description"); 
	$Niveau=mysql_result($result,$i,"Niveau"); 
	$X=mysql_result($result,$i,"X"); 
	$Y=mysql_result($result,$i,"Y"); 
	$N=mysql_result($result,$i,"N");  
	$GiD=mysql_result($result,$i,"GiD");  
	$Guilde=mysql_result($result,$i,"Guilde");  
	echo "<TR class=\"mh_tdpage\"><TD>$dist</TD><TD>$Id</TD><TD><A HREF=\"javascript:EPV($Id)\" CLASS='mh_trolls_1'>$nom</A></TD><TD>$Niveau</TD><TD>$race</TD><TD><A HREF='javascript:EAV($GiD,750,550)' CLASS='mh_links'>$Guilde</a></TD><TD align=\"center\">$X</TD><TD align=\"center\">$Y</TD><TD align=\"center\">$N</TD></TR>";
}

echo "
</table>
</td></tr></table>
&nbsp;

<TABLE WIDTH=\"98%\" BORDER=0 CELLSPACING=1 CELLPADDING=2 class=\"mh_tdborder\" ALIGN=\"center\">
<TR class=\"mh_tdtitre\"><TD>
<table width=\"100%\"><tr><td width=\"25\"><a href=\"javascript:afficheDetailTrPlus('mh_vue_hidden_tresors','mh_vue_plus_tresors');\"  CLASS=\"AllLinks\" id=\"mh_vue_plus_tresors\">[-]</a></td>

<td><A NAME=\"tresors\"><B>TR&Eacute;SORS</B></a></td><td width=\"400\" align=\"right\"><A HREF=\"#monstres\" CLASS=\"AllLinks\">Monstres</A> | <A HREF=\"#trolls\" CLASS=\"AllLinks\">Trõlls</A> | Trésors | <A HREF=\"#champignons\" CLASS=\"AllLinks\">Champignons</A> | <A HREF=\"#lieux\" CLASS=\"AllLinks\">Lieux</A> | <A HREF=\"#cadavres\" CLASS=\"AllLinks\">C&eacute;notaphes</A></td></tr></table>

</TD></TR>
</TABLE>

<TABLE WIDTH=\"98%\" BORDER=0 CELLSPACING=0 CELLPADDING=0 ALIGN=\"center\">
<TR class=\"mh_tdtitre\" id=\"mh_vue_hidden_tresors\"><TD>
<table width=\"100%\" BORDER=0 CELLSPACING=1 CELLPADDING=2 class=\"mh_tdborder\">
<TR class=\"mh_tdtitre\"><TD WIDTH=\"30\"><B>Dist.</B></TD><TD WIDTH=\"50\"><B>Réf.</B></TD><TD><B>Type</B></TD><TD WIDTH=\"30\" align=\"center\"><B>X</B></TD><TD WIDTH=\"30\" align=\"center\"><B>Y</B></TD><TD WIDTH=\"30\" align=\"center\"><B>N</B></TD></TR>
";
#==================================================================== TRESORS ====================================================
#<TR class=\"mh_tdpage\"><TD>1</TD><TD>4689127</TD><TD><b> Potion</b></TD><TD align=\"center\">-65</TD><TD align=\"center\">-77</TD><TD align=\"center\">-46</TD></TR>
$mysql=_sqlconnect();	# -------------- Ouverture DB  
$query =  "SELECT if(abs(X-$PosX)>abs(Y-$PosY), if(abs(X-$PosX)>abs(N-$PosN), abs(X-$PosX), abs(N-$PosN)), if(abs(N-$PosN)>abs(Y-$PosY), abs(N-$PosN), abs(Y-$PosY))) as dist, Id, nom, Description, Niveau, X, Y, N ";
$query .= "FROM `MZ_Vue` as V INNER JOIN `MZ_Share` as S ON (V.TiD=S.SHRiD) WHERE (S.TiD=$num) and (S.link='S') and TypeElement=3 and ($WhereVueId) order by dist";
//echo "$query<BR>";     
$result = MySQL_QUERY($query);    
_sqlclose();		# -------------- Fermeture DB  
$nrow=@MySQL_NUM_ROWS($result);
for ($i=0; $i<$nrow; $i++) 
{
	$dist=mysql_result($result,$i,"dist"); 
	$Id=mysql_result($result,$i,"Id"); 
	$nom=mysql_result($result,$i,"Nom"); 
	$X=mysql_result($result,$i,"X"); 
	$Y=mysql_result($result,$i,"Y"); 
	$N=mysql_result($result,$i,"N");  
	echo "<TR class=\"mh_tdpage\"><TD>$dist</TD><TD>$Id</TD><TD><b> $nom</b></TD><TD align=\"center\">$X</TD><TD align=\"center\">$Y</TD><TD align=\"center\">$N</TD></TR>";
}


echo "
</table>
</td></tr></table>
&nbsp;

<TABLE WIDTH=\"98%\" BORDER=0 CELLSPACING=1 CELLPADDING=2 class=\"mh_tdborder\" ALIGN=\"center\">
<TR class=\"mh_tdtitre\"><TD>
<table width=\"100%\"><tr><td width=\"25\"><a href=\"javascript:afficheDetailTrPlus('mh_vue_hidden_champignons','mh_vue_plus_champignons');\"  CLASS=\"AllLinks\" id=\"mh_vue_plus_champignons\">[-]</a></td>
<td><A NAME=\"champignons\"><B>CHAMPIGNONS</B></a></td><td width=\"400\" align=\"right\"><A HREF=\"#monstres\" CLASS=\"AllLinks\">Monstres</A> | <A HREF=\"#trolls\" CLASS=\"AllLinks\">Trõlls</A> | <A HREF=\"#tresors\" CLASS=\"AllLinks\">Trésors</A> | Champignons | <A HREF=\"#lieux\" CLASS=\"AllLinks\">Lieux</A> | <A HREF=\"#cadavres\" CLASS=\"AllLinks\">C&eacute;notaphes</A></td></tr></table>

</TD></TR>
</TABLE>

<TABLE WIDTH=\"98%\" BORDER=0 CELLSPACING=0 CELLPADDING=0 ALIGN=\"center\">
<TR class=\"mh_tdtitre\" id=\"mh_vue_hidden_champignons\"><TD>
<table width=\"100%\" BORDER=0 CELLSPACING=1 CELLPADDING=2 class=\"mh_tdborder\">
<TR class=\"mh_tdtitre\"><TD WIDTH=\"30\"><B>Dist.</B></TD><TD><B>-</B></TD><TD WIDTH=\"30\" align=\"center\"><B>X</B></TD><TD WIDTH=\"30\" align=\"center\"><B>Y</B></TD><TD WIDTH=\"30\" align=\"center\"><B>N</B></TD></TR>
";
#==================================================================== CHAMPIS ====================================================
$mysql=_sqlconnect();	# -------------- Ouverture DB  
$query =  "SELECT if(abs(X-$PosX)>abs(Y-$PosY), if(abs(X-$PosX)>abs(N-$PosN), abs(X-$PosX), abs(N-$PosN)), if(abs(N-$PosN)>abs(Y-$PosY), abs(N-$PosN), abs(Y-$PosY))) as dist, Id, nom, Description, Niveau, X, Y, N ";
$query .= "FROM `MZ_Vue` as V INNER JOIN `MZ_Share` as S ON (V.TiD=S.SHRiD) WHERE (S.TiD=$num) and (S.link='S') and TypeElement=4 and ($WhereVueId) order by dist";
//echo "$query<BR>";     
$result = MySQL_QUERY($query);    
_sqlclose();		# -------------- Fermeture DB  
$nrow=@MySQL_NUM_ROWS($result);
for ($i=0; $i<$nrow; $i++) 
{
	$dist=mysql_result($result,$i,"dist"); 
	//$Id=mysql_result($result,$i,"Id"); 
	$nom=mysql_result($result,$i,"Nom"); 
	$X=mysql_result($result,$i,"X"); 
	$Y=mysql_result($result,$i,"Y"); 
	$N=mysql_result($result,$i,"N");  
	echo "<TR class=\"mh_tdpage\"><TD>$dist</TD><TD><b> $nom</b></TD><TD align=\"center\">$X</TD><TD align=\"center\">$Y</TD><TD align=\"center\">$N</TD></TR>";
}


echo "
</table>
</td></tr></table>
&nbsp;

<TABLE WIDTH=\"98%\" BORDER=0 CELLSPACING=1 CELLPADDING=2 class=\"mh_tdborder\" ALIGN=\"center\">

<TR class=\"mh_tdtitre\"><TD>
<table width=\"100%\"><tr><td width=\"25\"><a href=\"javascript:afficheDetailTrPlus('mh_vue_hidden_lieux','mh_vue_plus_lieux');\"  CLASS=\"AllLinks\" id=\"mh_vue_plus_lieux\">[-]</a></td>
<td><A NAME=\"lieux\"><B>LIEUX</B></a></td><td width=\"400\" align=\"right\"><A HREF=\"#monstres\" CLASS=\"AllLinks\">Monstres</A> | <A HREF=\"#trolls\" CLASS=\"AllLinks\">Trõlls</A> | <A HREF=\"#tresors\" CLASS=\"AllLinks\">Trésors</A> | <A HREF=\"#champignons\" CLASS=\"AllLinks\">Champignons</A> | Lieux | <A HREF=\"#cadavres\" CLASS=\"AllLinks\">C&eacute;notaphes</A></td></tr></table>

</TD></TR>
</TABLE>

<TABLE WIDTH=\"98%\" BORDER=0 CELLSPACING=0 CELLPADDING=0 ALIGN=\"center\">
<TR class=\"mh_tdtitre\" id=\"mh_vue_hidden_lieux\"><TD>
<table width=\"100%\" BORDER=0 CELLSPACING=1 CELLPADDING=2 class=\"mh_tdborder\">
<TR class=\"mh_tdtitre\"><TD WIDTH=\"30\"><B>Dist.</B></TD><TD WIDTH=\"50\"><B>Réf.</B></TD><TD><B>Nom</B></TD><TD WIDTH=\"30\" align=\"center\"><B>X</B></TD><TD WIDTH=\"30\" align=\"center\"><B>Y</B></TD><TD WIDTH=\"30\" align=\"center\"><B>N</B></TD></TR>
";
#==================================================================== LIEUX ====================================================
#<TR class=\"mh_tdpage\"><TD WIDTH=\"75\"> 1</TD><TD>11974</TD><TD> <b>Sortie de Portail</b> </TD><TD ALIGN=\"center\">-66</TD><TD ALIGN=\"center\">-78</TD><TD ALIGN=\"center\">-47</TD></TR>
$mysql=_sqlconnect();	# -------------- Ouverture DB  
$query =  "SELECT if(abs(X-$PosX)>abs(Y-$PosY), if(abs(X-$PosX)>abs(N-$PosN), abs(X-$PosX), abs(N-$PosN)), if(abs(N-$PosN)>abs(Y-$PosY), abs(N-$PosN), abs(Y-$PosY))) as dist, Id, nom, Description, Niveau, X, Y, N ";
$query .= "FROM `MZ_Vue` as V INNER JOIN `MZ_Share` as S ON (V.TiD=S.SHRiD) WHERE (S.TiD=$num) and (S.link='S') and TypeElement=5 and ($WhereVueId) order by dist";
//echo "$query<BR>";     
$result = MySQL_QUERY($query);    
_sqlclose();		# -------------- Fermeture DB  
$nrow=@MySQL_NUM_ROWS($result);
for ($i=0; $i<$nrow; $i++) 
{
	$dist=mysql_result($result,$i,"dist"); 
	$Id=mysql_result($result,$i,"Id"); 
	$nom=mysql_result($result,$i,"Nom"); 
	$X=mysql_result($result,$i,"X"); 
	$Y=mysql_result($result,$i,"Y"); 
	$N=mysql_result($result,$i,"N");  
	echo "<TR class=\"mh_tdpage\"><TD WIDTH=\"75\"> $dist</TD><TD>$Id</TD><TD> <b>$nom</b> </TD><TD ALIGN=\"center\">$X</TD><TD ALIGN=\"center\">$Y</TD><TD ALIGN=\"center\">$N</TD></TR>";
}


// Calcul du nombre de troll connecté à ZZ
$countSession = 0;
if ( $d = opendir( session_save_path() ) ) {
	$session_timeout = 5*60;	// en 5 minutes!
	while ( false !== ( $file = readdir( $d ) ) ) {
		if ( $file != '.' && $file != '..' ) {
			if ( time()- fileatime(session_save_path() . '/' . $file) < $session_timeout ) {
				$countSession++;
			}
		}
	}	
}


// calcul du temps de la requête!
$xT1 = explode(" ",$TimeStartPHPCode);	
$xT2 = explode(" ",microtime());
$TimePHPCode=round(($xT2[1]-$xT1[1])+($xT2[0]-$xT1[0]), 3);

#==================================================================== CENOTAPHES ====================================================
# => pas pris en compte!!!
#
echo "
</table>
</td></tr></table>
&nbsp;

<TABLE WIDTH=\"98%\" BORDER=0 CELLSPACING=1 CELLPADDING=2 class=\"mh_tdborder\" ALIGN=\"center\">
<TR class=\"mh_tdtitre\"><TD>
<table width=\"100%\"><tr><td width=\"25\"><a href=\"javascript:afficheDetailTrPlus('mh_vue_hidden_cadavres','mh_vue_plus_cadavres');\"  CLASS=\"AllLinks\" id=\"mh_vue_plus_cadavres\">[-]</a></td>
<td><A NAME=\"cadavres\"><B>C&Eacute;NOTAPHES</B></a></td><td width=\"400\" align=\"right\"><A HREF=\"#monstres\" CLASS=\"AllLinks\">Monstres</A> | <A HREF=\"#trolls\" CLASS=\"AllLinks\">Trõlls</A> | <A HREF=\"#tresors\" CLASS=\"AllLinks\">Trésors</A> | <A HREF=\"#champignons\" CLASS=\"AllLinks\">Champignons</A> | <A HREF=\"#lieux\" CLASS=\"AllLinks\">Lieux</A> | C&eacute;notaphes</td></tr></table>

</TD></TR>
</TABLE>

<TABLE WIDTH=\"98%\" BORDER=0 CELLSPACING=0 CELLPADDING=0 ALIGN=\"center\">
<TR class=\"mh_tdtitre\" id=\"mh_vue_hidden_cadavres\"><TD>
<table width=\"100%\" BORDER=0 CELLSPACING=1 CELLPADDING=2 class=\"mh_tdborder\">
<TR class=\"mh_tdtitre\"><TD WIDTH=\"30\"><B>Dist.</B></TD><TD WIDTH=\"50\"><B>Réf.</B></TD><TD><B>Type</B></TD><TD WIDTH=\"30\" align=\"center\"><B>X</B></TD><TD WIDTH=\"30\" align=\"center\"><B>Y</B></TD><TD WIDTH=\"30\" align=\"center\"><B>N</B></TD></TR>
</table>
</td></tr></table>
&nbsp;<!-- Fin Contenu -->
<p>

<!-- Debut FooterPlay -->

<table width=\"98%\" cellspacing=\"1\" border=\"0\" cellpadding=\"1\" class=\"mh_tdborder\" align=\"center\">
	<tr class=\"mh_tdtitre\"> 
	  	  <td align=\"CENTER\"> 

[Contact : <script language=\"JavaScript\" type=\"text/javascript\">
<!--
var ls_arobase=\"@\";
var ls_protocole=\"mailto:\";
//-->
document.write('<a href=\"' + ls_protocole + 'dm' + ls_arobase + 'mountyhall.com\" CLASS=\"mh_links\">dm' + ls_arobase + 'mountyhall.com</A>');
</script>] 
		- [Heure Serveur : 
		$TimeStampMH GMT+0100		] - [Page g&eacute;n&eacute;r&eacute;e en $TimePHPCode sec.]
	<br /> - Il y a actuellement <b>$countSession
 Tr&otilde;lls</b> connect&eacute;s -</td>

	  <td align=\"CENTER\" valign=\"middle\">
<a href=\"/mountyhall/MH_Play/Options/Play_o_recordBug.php\" onclick=\"return confirm('Cette icone vous permet d\'enregistrer les paramètres de la page actuelle pour détailler un bug sur les forums. N\'utilisez cette fonctionalité que si vous pensez que l\'action réalisée a fourni un résultat incorrect et buggé.\n\nVoulez-vous enregistrer les paramètres de cette page ?');\"><img src=\"$PG/mouches/mouche1.jpg\" alt=\"Enregistrer un bug\"></a>
	</td>
	
	</tr>
</table>

</TD></TR>
</TBODY>
</TABLE>
</TD></TR>
</TBODY>
</TABLE>
<!-- Fin FooterPlay -->



</BODY>
</HTML>
";

?>