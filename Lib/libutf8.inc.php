<?
header('Content-Type: text/html; charset=utf-8'); 
header("Cache-Control: no-cache, must-revalidate");
if (!ini_get('register_globals')) {
	if ($HTTP_GET_VARS) foreach($HTTP_GET_VARS as $var => $val) { $$var=$val; }
	if ($_GET) foreach($_GET as $var => $val) { $$var=$val; }
	if ($_COOKIE) foreach($_COOKIE as $var => $val) { $$var=$val; }
	if ($_SERVER) foreach($_SERVER as $var => $val) { $$var=$val; }
	#Conversion des var Gloables en UTF-8 (en POST)
	if ($_POST) foreach($_POST as $var => $val) { $$var=utf8_decode($val); }
}

function _utf8($string) {
    #$string=eregi_replace('<form ', '<form enctype="multipart/form-data" accept-charset="utf-8" ', $string);       
    $string=eregi_replace('<form ', '<form enctype="multipart/form-data" accept-charset="utf-8" ', $string);       
 	return utf8_encode($string); 
}

function _print($string) {
# 	return print($string); 
    #$string=eregi_replace('<form ', '<form enctype="multipart/form-data" accept-charset="utf-8" ', $string);    
    $string=mb_eregi_replace('<form ', '<form enctype="multipart/form-data" accept-charset="utf-8" ', $string);    
 	return print(utf8_encode($string)); 
}

function _strc($string) {	#Conversion charactere � la con =>pour �cran
    #$string=eregi_replace("\\\'", "'", $string);       #caractere prot�g� \'
    #$string=eregi_replace('\\\"', '"', $string);       #caractere prot�g� \"
    $string=mb_eregi_replace("\\\'", "'", $string);       #caractere prot�g� \'
    $string=mb_eregi_replace('\\\"', '"', $string);       #caractere prot�g� \"
	$string=str_replace('\\\\', '\\', $string);		 #caractere prot�g� \\
 	return $string; 
}

function _strs($string) {	#Conversion charactere � la con =>pour req sql
	$string=str_replace('\\', '\\\\', $string);		 #caractere prot�g� \\
    #$string=eregi_replace("'", "\\'", $string);       #caractere prot�g� \'
    #$string=eregi_replace('"', "\\'", $string);       #caractere prot�g� \"
    $string=mb_eregi_replace("'", "\\'", $string);       #caractere prot�g� \'
    $string=mb_eregi_replace('"', "\\'", $string);       #caractere prot�g� \"
 	return $string; 
}

?>