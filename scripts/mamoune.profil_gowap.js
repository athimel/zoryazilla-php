var nodes = document.evaluate("//text()[contains(.,'Profil')]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
if (nodes.snapshotLength != 0) {
	var nodes = document.evaluate("//text()[contains(.,'] Gowap Apprivoisé')]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	for (var i = 0; i < nodes.snapshotLength; i++) {
		var node = nodes.snapshotItem(i);
		var gowap = node
			.parentNode/*B*/
			.parentNode/*DIV*/
			.parentNode/*TD*/
			.parentNode/*TR*/
			.parentNode/*TBODY*/;
		var id_gowap = trim(gowap
			.childNodes[2]/*TR*/
			.childNodes[3]/*TD*/
			.childNodes[1]/*A*/
			.childNodes[0]/*text*/
			.nodeValue);
		var gowap_dla = trim(gowap
			.childNodes[4]/*TR*/
			.childNodes[3]/*TD*/
			.childNodes[1]/*B*/
			.childNodes[0]/*text*/
			.nodeValue);
		var gowap_pa = parseInt(gowap
			.childNodes[4]/*TR*/
			.childNodes[3]/*TD*/
			.childNodes[5]/*B*/
			.childNodes[0]/*text*/
			.nodeValue);
		var gowap_dla_duree = trim(gowap
			.childNodes[4]/*TR*/
			.childNodes[3]/*TD*/
			.childNodes[7]/*P*/
			.childNodes[0]/*text*/
			.nodeValue);
		var dla =
			Number(
				gowap_dla_duree.slice(
					gowap_dla_duree.indexOf(":")+2,
					gowap_dla_duree.indexOf("heures")-1))
			*
			60
			+
			Number(
				gowap_dla_duree.slice(
					gowap_dla_duree.indexOf("et")+3,
					gowap_dla_duree.indexOf("minutes")-1));

		//alert('//'+id_gowap+'/'+gowap_dla+'/'+dla+'min');

		var expdate = new Date();
		expdate.setTime (expdate.getTime() + (24 * 60 * 60 * 1000 * 7));
		setCookie("GOWAP_"+id_gowap+'_dla',gowap_dla,expdate,"/");
		setCookie("GOWAP_"+id_gowap+'_min',dla,expdate,"/");
		setCookie("GOWAP_"+id_gowap+'_pa',gowap_pa,expdate,"/");

		var em = document.createElement('em');
		gowap.childNodes[4] // TR
			.childNodes[3]  // TD
			.appendChild(em);

		var form = document.createElement('form');
		em.appendChild(form);
		form.appendChild(document.createTextNode('Gowap à '));

		var label6 = document.createElement('LABEL');
		form.appendChild(label6);
		var input6 = document.createElement('INPUT');
		input6.setAttribute('type', 'radio');
		input6.setAttribute('name', 'gowap_pa_dla');
		input6.setAttribute('value', 6);
		if (MZ_getValue('GOWAP_'+id_gowap+'_PA_DLA') == 6) input6.checked = true;
		input6.addEventListener("click", function () { MZ_setValue('GOWAP_'+id_gowap+'_PA_DLA', 6); }, true);
		label6.appendChild(input6);
		label6.appendChild(document.createTextNode('6PA/DLA'));

		var label4 = document.createElement('LABEL');
		form.appendChild(label4);
		var input4 = document.createElement('INPUT');
		input4.setAttribute('type', 'radio');
		input4.setAttribute('name', 'gowap_pa_dla');
		input4.setAttribute('value', 4);
		if (MZ_getValue('GOWAP_'+id_gowap+'_PA_DLA') == 4) input4.checked = true;
		input4.addEventListener("click", function () { MZ_setValue('GOWAP_'+id_gowap+'_PA_DLA', 4); }, true);
		label4.appendChild(input4);
		label4.appendChild(document.createTextNode('4PA/DLA'));

		var label3 = document.createElement('LABEL');
		form.appendChild(label3);
		var input3 = document.createElement('INPUT');
		input3.setAttribute('type', 'radio');
		input3.setAttribute('name', 'gowap_pa_dla');
		input3.setAttribute('value', 3);
		if (MZ_getValue('GOWAP_'+id_gowap+'_PA_DLA') == 3) input3.checked = true;
		input3.addEventListener("click", function () { MZ_setValue('GOWAP_'+id_gowap+'_PA_DLA', 3); }, true);
		label3.appendChild(input3);
		label3.appendChild(document.createTextNode('3PA/DLA'));
	}
}