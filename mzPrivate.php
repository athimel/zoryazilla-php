<?php
session_cache_limiter("nocache");
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1		pour empecher la mise en cache (cache trop important avec ironie ou FF8) !!!

session_start();
require("_global.php");
require_once("./Config/_sqlconf.php");

#-----------------------------------------------------------------------------------
$ZZ_TID=$_SESSION['login'] ;
if (($TiD!=$ZZ_TID) || ($ZZ_TID=="")) {	//si pas de login, pas de cryptage!
die("
__MZ_setValue=MZ_setValue;
function ZZ_setValue(Key, Val) { if (Key.indexOf('$TiD.')==0) return; else return __MZ_setValue(Key, Val); }
MZ_setValue=ZZ_setValue;
	
__MZ_getValue=MZ_getValue;
function ZZ_getValue(Key) { if (Key.indexOf('$TiD.')==0) return; else return __MZ_getValue(Key); }
MZ_getValue=ZZ_getValue;
");
}
#-----------------------------------------------------------------------------------
	
  $mysql=_sqlconnect();	# -------------- Ouverture DB  

  $query = "SELECT * from MZ_User_prefs where TiD=$ZZ_TID";
  $result = @MySQL_QUERY($query);
  if (@MySQL_NUM_ROWS($result)>0) {
  	$SkinZZ=@mysql_result($result,0,"SkinZZ");
	$ZMON=@mysql_result($result,0,"ZMON");
	$ZTRO=@mysql_result($result,0,"ZTRO");
	$ZTRE=@mysql_result($result,0,"ZTRE");
	$ZLIE=@mysql_result($result,0,"ZLIE");
  	$ShrVUE=@mysql_result($result,0,"SHARE_VUE");
	echo "var SkinZZ=\"$SkinZZ\"; var ZMON=$ZMON; var ZTRO=$ZTRO; var ZTRE=$ZTRE; var ZLIE=$ZLIE; ";			// variable de config globales
	if ($ShrVUE=="non") echo "var ShrVUE=false; "; else echo "var ShrVUE=true; ";
  }

  $query = "SELECT pwd from MZ_User where TiD=$TiD";
  //echo "//$query<BR>";
  $result = @MySQL_QUERY($query);
		  
  _sqlclose();		# -------------- Fermeture DB   

  if (@MySQL_NUM_ROWS($result)==1) $pwd=str_replace("'", "\'", @mysql_result($result,0,"pwd")); 
  
  

echo "
function codage(v) {  
	if (v==undefined) return(v);

	var c='$pwd';
    var prefType=typeof(v);
	switch (prefType) {
		case 'string': var r='S'; break;
		case 'boolean': if (v==false) return('BF'); else return('BV');
		case 'number': var r='N'; break;
	}
	var s=''+v;
	for(i=0,j=0;i<s.length;++i,++j) {
		if (j>=c.length) j=0;
		r+=String.fromCharCode((c.charCodeAt(j) & ~128)^s.charCodeAt(i));
	}
	return (encodeURI(r));
}

function decodage(v) {  
	if (v==undefined) return(v);
	
	var c='$pwd';
	var s=decodeURI(v);
    var prefType=s.substr(0,1);
	var s=s.substr(1);
	var r='';
	for(i=0,j=0;i<s.length;++i,++j) {
		if (j>=c.length) j=0;
		r+=String.fromCharCode((c.charCodeAt(j) & ~128)^s.charCodeAt(i));
	}

	switch (prefType) {
		case 'S': return(r);
		case 'B': if (v=='BV') return(true); else return(false);
		case 'N': return(1*r);
	}

}

// override des fonctions MZ_setValue et MZ_getValue pour crytage des données 
__MZ_setValue=MZ_setValue;
function ZZ_setValue(Key, Val) { if (Key.indexOf('$TiD.')==0) __MZ_setValue(Key, codage(Val)); else return __MZ_setValue(Key, Val); }
MZ_setValue=ZZ_setValue;
	
__MZ_getValue=MZ_getValue;
function ZZ_getValue(Key) { if (Key.indexOf('$TiD.')==0) return decodage(__MZ_getValue(Key)); else return __MZ_getValue(Key); }
MZ_getValue=ZZ_getValue;
	
";


?>