// Script d'affichage des unit�s de mithril (UM) des tr�sors et minerais

// TODO
// Gowaps (minerai + tr�sors)
// Gestion du taill�
// Gestion non identifi� en tani�re et GT et gowap


// Renvoie le nombre d'UM d'un minerai
function getMineraiUm(texte) {

	if (mineraiParts = texte.match(/Mithril \(taille (\d+)\)\s+de Qualit� (.+)/)) {	
		// Est un minerai
		var mineraiTaille = mineraiParts[1];
		var mineraiQualite = mineraiParts[2];
		var mineraiUM = mineraiTaille * getMineraiUmRatio(mineraiQualite);
		mineraiUM = Math.round(mineraiUM); // Arrondi au plus proche
		return mineraiUM;		
	}
	
	return false;
}

// Renvoie le ratio UM/taille d'une qualit� de minerai
function getMineraiUmRatio(qualite) {
	if (qualite == "M�diocre") return 0.2;
	else if (qualite == "Moyenne") return 0.4;
	else if (qualite == "Normale") return 0.6;
	else if (qualite == "Bonne") return 0.8;
	else if (qualite == "Exceptionnelle") return 1;
	else return 0;
}

// Renvoie le nombre d'UM d'un �quipement
function getTresorUm(tresor) {
	var mapping = {
		"Armure d'anneaux" : 64,
		"Armure de Plates" : 80,
		"Bouclier � Pointes" : 28,
		"Boulet et cha�ne" : 12,
		"Casque � cornes" : 8,
		"Casque � Pointes" : 10,
		"Casque en m�tal" : 8,
		"Cha�ne Clout�e" : 28,
		"Collier � Pointes" : 2,
		"Cotte de Mailles" : 56,
		"Crochet" : 10,
		"Cuirasse d'�cailles" : 48,
		"Dague" : 4,
		"Ep�e Courte" : 8,
		"Ep�e Longue" : 16,
		"Espadon" : 32,
		"Gantelet" : 6,
		"Gorgeron en m�tal" : 4,
		"Gros'Porte" : 40,
		"Hache de Bataille" : 24,
		"Hallebarde" : 48,
		"Haubert d'�cailles" : 64,
		"Haubert de mailles" : 72,
		"Heaume" : 16,
		"Jambi�res en maille" : 16,
		"Jambi�res en m�tal" : 20,
		"Machette" : 16,
		"Masse d'Arme" : 12,
		"Pagne de Mailles" : 6,
		"Rondache en m�tal" : 24,
		"Targe" : 4
	};
	for (var oneTresor in mapping) {
		if (oneTresor.toLowerCase() === tresor.substr(0, oneTresor.length).toLowerCase()) {
			return mapping[oneTresor];
		}
	}
	return 0;
}

// G�re le minerai de la page Petits �quipements
function treateMineraiEquip() {

	var nodes = document.evaluate("//img[@alt = 'Minerai - Sp�cial']/../a/text()",
			document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			
	if (nodes.snapshotLength == 0)
		return false;

	var total = 0;
	for (var i = 0; i < nodes.snapshotLength; i++) {
		var node = nodes.snapshotItem(i);
		var texte = trim(node.nodeValue.replace(/\240/g, " "));
		
		var um = getMineraiUm(texte);
		if (um !== false) {
			total += um;
			appendText(node.parentNode.parentNode, "[" + um + " UM]");
		}

	}
	
	// Total
	var nodes = document.evaluate("//p[.='Minerais']",
		document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var node = nodes.snapshotItem(0);
	totalNode = document.createElement('span');
	totalNode.setAttribute('style', 'font-size: 12px;');
	appendText(totalNode, " - Total : " + total + " UM");
	node.appendChild(totalNode);
	
	return total;
}

// G�re le minerai en tani�re / GT
function treateMineraiTaniere() {

	var nodes = document.evaluate("//th[.='Minerai']/following::a",
		document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

	if (nodes.snapshotLength == 0)
		return false;

	var total = 0;
	for (var i = 0; i < nodes.snapshotLength; i++) {
		var node = nodes.snapshotItem(i);
		try {
			var texte = node.childNodes[0].nodeValue + node.childNodes[1].innerHTML; // Car la qualit� est en gras
			texte = trim(texte.replace(/\240/g, " "));
	
			var um = getMineraiUm(texte);
			if (um !== false) {
				total += um;
				appendText(node.parentNode, "[" + um + " UM]");
			}
		} catch (e) {}
	}
	
	// Total
	var nodes = document.evaluate("//th[.='Minerai']",
		document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var node = nodes.snapshotItem(0);
	totalNode = document.createElement('span');
	totalNode.setAttribute('style', 'font-size: 12px;');
	appendText(totalNode, " - Total : " + total + " UM");
	node.appendChild(totalNode);
	
	return total;
}

// G�re le minerai dans la page d'historique d'un tr�sor
function treateMineraiHisto() {

	var nodes = document.evaluate("//p//div[contains(.,'Mithril') and contains(.,'Qualit�')]",
			document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength == 0)
		return false;
		
	var node = nodes.snapshotItem(0);
	var texte = trim(node.innerHTML.replace(/\240/g, " ")).replace(/^[0-9\.\s]*/, '');
	var um = getMineraiUm(texte);
	if (um !== false) {
		var caracNode = document.evaluate("//p[1]/table[2]/tbody/tr/td/b",
			document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
			.snapshotItem(0);
		var text = document.createTextNode("Mithril r�cup�rable : " + um + " UM");
		caracNode.insertBefore(text, caracNode.childNodes[3]);
		var br = document.createElement('br');
		caracNode.insertBefore(br, text);
	}

	return um;
}

// G�re les �quipements de la page d'�quipement ou tani�re/GT
function treateTresorEquipTaniere() {

	var nodes = document.evaluate("//a[contains(.,' Mithril')]",
			document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			
	if (nodes.snapshotLength == 0)
		return false;

	var total = 0;
	for (var i = 0; i < nodes.snapshotLength; i++) {
		var node = nodes.snapshotItem(i);
		var texte = trim(node.innerHTML.replace(/\240/g, " "));
		var um = getTresorUm(texte);
		if (um > 0) {
			total += um;
			appendText(node.parentNode, " [" + um + " UM]");
		}
	}

	return total;
}

// G�re les �quipements dans la page d'historique d'un tr�sor
function treateTresorHisto() {

	var nodes = document.evaluate("//p//div[contains(.,' Mithril')]",
			document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength == 0)
		return false;
		
	var node = nodes.snapshotItem(0);
	var texte = trim(node.innerHTML.replace(/\240/g, " ")).replace(/^[0-9\.\s]*/, '');
	var um = getTresorUm(texte);
	if (um > 0) {
		var caracNode = document.evaluate("//p[1]/table[2]/tbody/tr/td/b",
			document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
			.snapshotItem(0);
		var text = document.createTextNode("Mithril r�cup�rable : " + um + " UM");
		caracNode.insertBefore(text, caracNode.childNodes[3]);
		var br = document.createElement('br');
		caracNode.insertBefore(br, text);
	}

	return um;
}

// Ecrit le total d'um pour la taniere
function writeTaniereTotal(um) {
	var nodes = document.evaluate("//div[@class = 'titre3']",
		document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var node = nodes.snapshotItem(0);
	totalNode = document.createElement('span');
	totalNode.setAttribute('style', 'font-size: 13px;');
	appendText(totalNode, " - Total : " + um + " UM");
	node.appendChild(totalNode);
}


// GO
if (isPage("MH_Play/Play_equipement.php")) {
	treateTresorEquipTaniere();
} else if (isPage("MH_Play/Play_e_ChampComp.php")) {
	treateMineraiEquip();
} else if (isPage("MH_Taniere/TanierePJ_o_Stock.php") || isPage("MH_Comptoirs/Comptoir_o_Stock.php")) {
	var um = 0;
	um += treateMineraiTaniere();
	um += treateTresorEquipTaniere();
	if (um > 0) {
		writeTaniereTotal(um);
	}
} else if (isPage("View/TresorHistory.php")) {
	treateTresorHisto();
	treateMineraiHisto();
}
