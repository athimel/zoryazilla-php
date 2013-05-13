
function virevoirdonccettepetitecroix() {
	dlabox = document.evaluate("//input[@name='ab_activation']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if (dlabox) dlabox.checked = false;
}


if(isPage("MH_Play/PlayStart.php")) {
	virevoirdonccettepetitecroix();
}
