// S'il y a des actions spéciales dans le menu des actions, on change la couleur de celui-ci

try
{
	if (currentURL.indexOf(MHURL + "MH_Play/Play_action.php") == 0) {
		var node = document.evaluate("//select/optgroup[1]",
				document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		if (node.snapshotLength == 1) {
			var optgroup = node.snapshotItem(0);
			if (optgroup.getAttribute("label") == "** Actions Spéciales **") {
				optgroup.setAttribute("style", "background-color: #99CCFF;");
				optgroup.parentNode.setAttribute("style", "background-color: #99CCFF;");
			}
		}
	}
}
catch(e)
{
	alert(e);
}