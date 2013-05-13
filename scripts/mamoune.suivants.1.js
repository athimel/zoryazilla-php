var nodes = document.evaluate("//text()[contains(.,'MES SUIVANTS')]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
if (nodes.snapshotLength != 0) {
	var nodes = document.evaluate("//text()[contains(.,'. Gowap Apprivoisé')]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	for (var i = 0; i < nodes.snapshotLength; i++) {
		var node = nodes.snapshotItem(i);
		var id_gowap = trim(
			node.nodeValue.slice(
				1,
				node.nodeValue.indexOf(". Gowap")));
		gowap_ordre1 = getCookie('GOWAP_'+id_gowap+'_ordre1');

		if (gowap_ordre1 != '') {
			//alert(id_gowap +' Ordre = '+gowap_ordre1);

			var ajout = document.createElement('span');
			ajout.appendChild(document.createElement('br'));
			var em = document.createElement('em');
			ajout.appendChild(em);
			var t = document.createTextNode('Premier ordre connu : ');
			em.appendChild(t);
			var strong = document.createElement('strong');
			em.appendChild(strong);
			var o = document.createTextNode(gowap_ordre1);
			strong.appendChild(o);

			gowap_td = node.parentNode /*A*/
				.parentNode; /*TD*/
			//alert(gowap_td.nodeType);
			gowap_td.appendChild(ajout);
		}
	}
}