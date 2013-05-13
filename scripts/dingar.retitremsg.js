function tropderetuelere() {
	TitreInput = document.evaluate("//input[@name='Titre']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if (TitreInput && TitreInput.value != '') TitreInput.value = TitreInput.value.replace(/^(Re : )*/,"Re : ");
}


if(isPage("Messagerie/MH_Messagerie.php?cat=3")) {
	tropderetuelere();
}
