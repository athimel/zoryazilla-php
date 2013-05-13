// Script qui decoche la case "ramasser" par defaut lorsqu'on utilise Telek
function isPage(url) {
	return currentURL.indexOf(MHURL + url) == 0;
}

function jveuxpasramasserca() {
	ramassbox = document.evaluate("//input[@name='ab_PickUp']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if (ramassbox) ramassbox.checked = false;
}


if(isPage("MH_Play/Actions/Sorts/Play_a_Sort24.php")) {
	jveuxpasramasserca();
}