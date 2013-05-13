// Script d'affichage des unités de mithril (UM) des trésors et minerais

function chargerScript(script) {
	MZ_appendNewScript(script);
}
function isPage(url) {
	return currentURL.indexOf(MHURL + url) == 0;
}

try
{
	if (isPage("MH_Play/Play_equipement.php")
	 || isPage("MH_Play/Play_e_ChampComp.php")
	 || isPage("MH_Taniere/TanierePJ_o_Stock.php")
	 || isPage("MH_Comptoirs/Comptoir_o_Stock.php")
	 || isPage("View/TresorHistory.php"))
	 	MZ_appendNewScript(ZZDB+"/scripts/Mr_X.script_mithril.js");
		//chargerScript("http://localhost/mz/script_mithril.js");
		
}
catch(e)
{
	alert(e);
}