function isPage(url) {
	return currentURL.indexOf(MHURL + url) == 0;
}

try
{
	if (isPage("View/PJView.php"))
		MZ_appendNewScript(ZZDB+"/scripts/mamoune.profil.js");
}
catch(e)
{
	alert(e);
}