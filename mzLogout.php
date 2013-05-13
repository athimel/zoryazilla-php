<?
session_cache_limiter("nocache");
session_start();
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1		pour empecher la mise en cache (cache trop important avec ironie ou FF8) !!!

$_SESSION['login']=""; 		// on ferme la session courante si elle était ouverte
?>