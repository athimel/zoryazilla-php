// Script d'affichage des unités de mithril (UM) des trésors et minerais

// TODO
// Gowaps (minerai + trésors)
// Gestion du taillé
// Gestion non identifié en tanière et GT et gowap


// Renvoie le nombre d'UM d'un minerai
function getMineraiUm(texte) {

	if (mineraiParts = texte.match(/Mithril \(taille (\d+)\)\s+de Qualité (.+)/)) {	
		// Est un minerai
		var mineraiTaille = mineraiParts[1];
		var mineraiQualite = mineraiParts[2];
		var mineraiUM = mineraiTaille * getMineraiUmRatio(mineraiQualite);
		mineraiUM = Math.round(mineraiUM); // Arrondi au plus proche
		return mineraiUM;		
	}
	
	return false;
}

// Renvoie le ratio UM/taille d'une qualité de minerai
function getMineraiUmRatio(qualite) {
	if (qualite == "Médiocre") return 0.2;
	else if (qualite == "Moyenne") return 0.4;
	else if (qualite == "Normale") return 0.6;
	else if (qualite == "Bonne") return 0.8;
	else if (qualite == "Exceptionnelle") return 1;
	else return 0;
}

// Renvoie le nombre d'UM d'un équipement
function getTresorUm(tresor) {
	var mapping = {
		"Armure d'anneaux" : 64,
		"Armure de Plates" : 80,
		"Bouclier à Pointes" : 28,
		"Boulet et chaîne" : 12,
		"Casque à cornes" : 8,
		"Casque à Pointes" : 10,
		"Casque en métal" : 8,
		"Chaîne Cloutée" : 28,
		"Collier à Pointes" : 2,
		"Cotte de Mailles" : 56,
		"Crochet" : 10,
		"Cuirasse d'écailles" : 48,
		"Dague" : 4,
		"Epée Courte" : 8,
		"Epée Longue" : 16,
		"Espadon" : 32,
		"Gantelet" : 6,
		"Gorgeron en métal" : 4,
		"Gros'Porte" : 40,
		"Hache de Bataille" : 24,
		"Hallebarde" : 48,
		"Haubert d'écailles" : 64,
		"Haubert de mailles" : 72,
		"Heaume" : 16,
		"Jambières en maille" : 16,
		"Jambières en métal" : 20,
		"Machette" : 16,
		"Masse d'Arme" : 12,
		"Pagne de Mailles" : 6,
		"Rondache en métal" : 24,
		"Targe" : 4
	};
	for (var oneTresor in mapping) {
		if (oneTresor.toLowerCase() === tresor.substr(0, oneTresor.length).toLowerCase()) {
			return mapping[oneTresor];
		}
	}
	return 0;
}

// Gère le minerai de la page Petits équipements
function treateMineraiEquip() {

	var nodes = document.evaluate("//img[@alt = 'Minerai - Spécial']/../a/text()",
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

// Gère le minerai en tanière / GT
function treateMineraiTaniere() {

	var nodes = document.evaluate("//th[.='Minerai']/following::a",
		document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

	if (nodes.snapshotLength == 0)
		return false;

	var total = 0;
	for (var i = 0; i < nodes.snapshotLength; i++) {
		var node = nodes.snapshotItem(i);
		try {
			var texte = node.childNodes[0].nodeValue + node.childNodes[1].innerHTML; // Car la qualité est en gras
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

// Gère le minerai dans la page d'historique d'un trésor
function treateMineraiHisto() {

	var nodes = document.evaluate("//p//div[contains(.,'Mithril') and contains(.,'Qualité')]",
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
		var text = document.createTextNode("Mithril récupérable : " + um + " UM");
		caracNode.insertBefore(text, caracNode.childNodes[3]);
		var br = document.createElement('br');
		caracNode.insertBefore(br, text);
	}

	return um;
}

// Gère les équipements de la page d'équipement ou tanière/GT
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

// Gère les équipements dans la page d'historique d'un trésor
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
		var text = document.createTextNode("Mithril récupérable : " + um + " UM");
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
