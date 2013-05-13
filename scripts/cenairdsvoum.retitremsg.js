/* this script replace many "Re:" or "Re(n):" in message reply by a single 'Re(n):" where n is the number of replies*/
function tropderetuelere() {
	TitreInput = document.evaluate("//input[@name='Titre']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if (TitreInput && TitreInput.value != '') {
		myarray = TitreInput.value.match(/(Re :)/g);
		var myarray2 = TitreInput.value.match(/Re\(\d+\) :/g); /* extract the Re(n) to an array like [Re(n),Re(o),Re(p)...] */
		if (myarray2 == null ) {
			TitreInput.value = TitreInput.value.replace(/^(Re : )*/,"Re(" + myarray.length + ") : ");
			} else {
			var ctr = 0;
			myarray2 = myarray2.join(); /* transform the array to a string  in order to be able to use the match function */
			myarray2 = myarray2.match(/\d+/g); /* extract the numbers only in an array */
			for (var i = 0;i < myarray2.length; i++) {ctr = ctr + (myarray2[i] * 1)};  /* la multiplication par 1 est pour transformer la string en number */
			TitreInput.value = TitreInput.value.replace(/^Re(.*) :/,"Re(" + (myarray.length + ctr) + ") : ");
		}
	}
}


if(isPage("Messagerie/MH_Messagerie.php?cat=3")) {
	tropderetuelere();
}
