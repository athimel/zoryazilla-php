// DESCENDANT
var nodes = document.evaluate("//text()[contains(.,'Descendant')]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
if (nodes.snapshotLength != 0) {
	for (var i = 0; i < nodes.snapshotLength; i++) {
		var node = nodes.snapshotItem(i);
		var val = node.nodeValue;
		var prefix = val.slice(
			0,
			val.indexOf("("));
		var id = val.slice(
			val.indexOf("(")+1,
			val.indexOf(")"));
		var suffix = val.slice(
			val.indexOf(")")+1);
		var elem = document.createElement('span');
		elem.appendChild(document.createTextNode(prefix));
		var link = document.createElement('a');
		link.setAttribute('href', '?ai_IDPJ='+id);
		link.appendChild(document.createTextNode('('+id+')'));
		elem.appendChild(link);
		elem.appendChild(document.createTextNode(suffix));
		node.parentNode.replaceChild(elem, node.parentNode.lastChild);
	}
}
// ASCENDANT
var nodes = document.evaluate("//text()[contains(.,'Ascendant')]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
if (nodes.snapshotLength != 0) {
	for (var i = 0; i < nodes.snapshotLength; i++) {
		var node = nodes.snapshotItem(i);
		var val = node.nodeValue;
		var prefix = val.slice(
			0,
			val.indexOf("("));
		var id = val.slice(
			val.indexOf("(")+1,
			val.indexOf(")"));
		var suffix = val.slice(
			val.indexOf(")")+1);
		var elem = document.createElement('span');
		elem.appendChild(document.createTextNode(prefix));
		var link = document.createElement('a');
		link.setAttribute('href', '?ai_IDPJ='+id);
		link.appendChild(document.createTextNode('('+id+')'));
		elem.appendChild(link);
		elem.appendChild(document.createTextNode(suffix));
		node.parentNode.replaceChild(elem, node.parentNode.lastChild);
	}
}