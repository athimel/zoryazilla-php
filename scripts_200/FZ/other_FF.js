/*********************************************************************************
*    This file is part of zoryazilla                                             *
*********************************************************************************/
function chargerZZScript(script) {
	MZ_appendNewScript(ZZDB+'/scripts_MZ/libs_FF.js');
	MZ_appendNewScript(ZZDB+'/scripts_200/'+script);
	var node = document.evaluate("//td/text()[contains(.,'Page générée en')]",
	document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if (node) node.nodeValue += " - [ZoryaZilla Database: "+ZZDB+"]";
}
function isPage(url) {
	return currentURL.indexOf(MHURL + url) == 0;
}

if (isPage("MH_Play/Play_e_follo.php")) chargerZZScript("FollowP2_FF.js");
//if (isPage("MH_Play/Play_e_follo.php")) chargerZZScript("FZ/FollowP2_FF.js");			// pour debug local


