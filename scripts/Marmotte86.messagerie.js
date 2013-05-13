/*
 * Script MZ : Affiche un aper�u lors de l'�criture des MP
 * Auteur : Marmotte86 (93138)
 * Contributeur : disciple (62333)
 */

/* Lancement du script selon la page charg�e */
if(currentURL.indexOf("Messagerie/MH_Messagerie.php?cat=3") != -1) {
	// Ajout d'un bouton apr�s le bouton "Envoyer"
	function addButton(caption, clickFunction) {
		var sendButton = document.getElementsByName('bsSend')[0];
		var newButton = document.createElement('input');
		newButton.setAttribute('type', 'button');
		newButton.setAttribute('class', 'mh_form_submit');
		newButton.setAttribute('value', caption);
		newButton.addEventListener('click', clickFunction, true);
		sendButton.parentNode.appendChild(document.createTextNode(' '));
		sendButton.parentNode.appendChild(newButton);
	};
	// Affichage de l'aper�u
	function display() {
		tdPreview.innerHTML = messageArea.value.replace(/\r?\n/g, '<br>');
	};
	// Sauvegarde du MP
	function save() {
		if(titleInput.value != '') MZ_setValue('lastMPTitle', titleInput.value);
		if(messageArea.value != '') MZ_setValue('lastMP', messageArea.value);
	};
	// Restauration du MP sauvegard�
	function restore() {
		if(MZ_getValue('lastMPTitle')) titleInput.value = MZ_getValue('lastMPTitle');
		if(MZ_getValue('lastMP')) messageArea.value = MZ_getValue('lastMP');
		display();
	};
	// Restauration du MP sauvegard�
	function reply() {
		if(MZ_getValue('lastReply')) messageArea.value = MZ_getValue('lastReply');
		display();
	};
	/* Ajout de disciple (62333) */
	//-- Tr�lld�ct��r --
	function trollducteur() {
		messageArea.value = messageArea.value
			.replace(/�*y�*/g, '�y�')
			.replace(/a/g, '�')
			.replace(/e/g, '�')
			.replace(/i/g, '�')
			.replace(/o/g, '�')
			.replace(/u/g, '�')
			.replace(/A/g, '�')
			.replace(/E/g, '�')
			.replace(/I/g, '�')
			.replace(/O/g, '�')
			.replace(/U/g, '�');
		display();
	};

	// Titre du MP
	var titleInput = document.getElementsByName('Titre')[0];
	// Case de texte du MP
	var messageArea = document.getElementsByName('Message')[0];
	// Aper�u � la frappe
	messageArea.addEventListener('change', display, true);
	messageArea.addEventListener('keyup', display, true);

	// Ajout de la ligne d'affichage de l'aper�u
	var trPreview = document.createElement('tr');
	trPreview.setAttribute('class', 'mh_tdpage');
	var tdPreview = document.createElement('td');
	tdPreview.setAttribute('colspan', 4);
	trPreview.appendChild(tdPreview);
	document.getElementsByTagName('form')[0].getElementsByTagName('table')[2].getElementsByTagName('tbody')[0].appendChild(trPreview);

	// Enregistrement du message � l'envoi
	document.getElementsByName('bsSend')[0].addEventListener('click', save, true);
	// Ajout du bouton d'aper�u
	addButton('Aper�u', display);
	// Ajout du bouton de sauvegarde
	addButton('Sauvegarder', save);
	// Ajout du bouton de restauration
	addButton('Rappeler le dernier message', restore);
	/* Ajout de disciple (62333) */
	// Ajout du bouton de citation
	addButton('Citer en r�ponse', reply);
	// Ajout du bouton du trollducteur
	addButton('Tr�lld�ct��r', trollducteur);
}
/* Ajout de disciple (62333) */
else if(currentURL.indexOf("Messagerie/ViewMessage.php?answer=1") != -1) {
	function reply(e) {
		var reply = document.evaluate("//table/tbody/tr[5]/td", document, null, XPathResult.ANY_TYPE, null).iterateNext().innerHTML;
		reply = '> ' + reply.replace(/<br>/g, '\n> ');
		MZ_setValue('lastReply', reply + '\n\n');
	};

	document.getElementsByName('bAnswer')[0].addEventListener('click', reply, true);
	document.getElementsByName('bAnswerToAll')[0].addEventListener('click', reply, true);
}
