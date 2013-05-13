<?
session_cache_limiter("nocache");
session_start();
require("_global.php"); 
header('Content-Type: text/html; charset=iso-8859-1'); 								// pour les caractère accentué
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1		pour empecher la mise en cache (cache trop important avec ironie ou FF8) !!!
require_once("./Config/_sqlconf.php");
ignore_user_abort(True);


$_SESSION['login']=""; 		// on ferme la session courante si elle était ouverte
If (!isset($Troll))  { Die("0"); }
If (!isset($ZZSession))  { Die("0"); }

$TiD=$Troll;

$mysql=_sqlconnect();	# -------------- Ouverture DB  
if (!is_numeric($Troll)) { #on recherche l'ID
	$TiD=0;
	$query =  "SELECT TiD FROM `MZ_Trolls` where Troll=\"$Troll\"";
	//echo $query;
	$result = MySQL_QUERY($query);   
	$nData = @MySQL_NUM_ROWS($result);
    if ($nData>0) $TiD=mysql_result($result,0,"TiD");
 }

if ((strlen($ZZSession)<30) && (strlen($ZZSession)>0)) $ZZSession=md5("$ZZSession");
$query =  "SELECT TiD FROM `MZ_User` where (TiD=$TiD) and (Pwd='$ZZSession')";
#echo "$query<BR>";     
$result = MySQL_QUERY($query);   
$nData = @MySQL_NUM_ROWS($result);
if ($nData>0) { #autologon ZZ interface
	$_SESSION['login']=$TiD; 
}	else $TiD=0;
_sqlclose();		# -------------- Fermeture DB  

echo "$TiD";  //Retour pour MZ_xmlhttpRequest

//if ($TiD>0) {
#if ($Autologon=='O') echo "<FORM name=FormDlgBox><INPUT TYPE=hidden Name=ZZSession Value=\"$ZZSession\"></FORM>";
//}


?>