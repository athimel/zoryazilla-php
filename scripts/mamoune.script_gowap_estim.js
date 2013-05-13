try
{
	if (isPage("MH_Follower/FO_Profil.php"))
		MZ_appendNewScript(ZZDB+"/scripts/mamoune.profil_gowap.js");
	else if (isPage("MH_Follower/FO_Ordres.php"))
		MZ_appendNewScript(ZZDB+"/scripts/mamoune.ordre_gowap.js");
	else if (isPage("MH_Play/Play_equipement.php"))
		MZ_appendNewScript(ZZDB+"/scripts/mamoune.suivants.js");
}
catch(e)
{
	alert(e);
}