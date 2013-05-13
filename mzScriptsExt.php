<?php
session_cache_limiter("nocache");
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1		pour empecher la mise en cache (cache trop important avec ironie ou FF8) !!!

session_start();
require("_global.php");
require_once("./Config/_sqlconf.php");

#-----------------------------------------------------------------------------------
$ZZ_TID=$_SESSION['login'] ;
if ($ZZ_TID=="") die();				// pas loggé = pas de script
#-----------------------------------------------------------------------------------

	
  $mysql=_sqlconnect();	# -------------- Ouverture DB  

  $query = "SELECT SCRIPTS_COMP from MZ_User_prefs where TiD=$ZZ_TID";
  $result = MySQL_QUERY($query);
  if (@MySQL_NUM_ROWS($result)<=0) die();
  
  $SCRIPTS_COMP=mysql_result($result,0,"SCRIPTS_COMP");
		
		
  $query = "SELECT CopieZZ  from MZ_Scripts_ext where id in (".substr($SCRIPTS_COMP, 0, -1).") order by Id";
  $result = @MySQL_QUERY($query);
  _sqlclose();		# -------------- Fermeture DB   
  $n=@MySQL_NUM_ROWS($result);
  if ($n<=0) die(	);

  $ZZDB="http://".$_SERVER["HTTP_HOST"].substr($_SERVER["REQUEST_URI"], 0, strrpos($_SERVER["REQUEST_URI"], "/"));

  header('Content-Type: text/javascript');
  for ($i=0; $i<$n; $i++) {
  	$CopieZZ=@mysql_result($result,$i,"CopieZZ");
  	@readfile("scripts/$CopieZZ");
	//echo "MZ_appendNewScript(\"$ZZDB/scripts/$CopieZZ\");";	
		
  }

?>