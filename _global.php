<?
if (!ini_get('register_globals')) {
	if ($HTTP_GET_VARS) foreach($HTTP_GET_VARS as $var => $val) { $$var=$val; }
	if ($_GET) foreach($_GET as $var => $val) { $$var=$val; }	
	if ($_POST) foreach($_POST as $var => $val) { $$var=$val; }
	if ($_COOKIE) foreach($_COOKIE as $var => $val) { $$var=$val; }
	if ($_SERVER) foreach($_SERVER as $var => $val) { $$var=$val; }
}
?>
