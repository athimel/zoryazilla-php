/*********************************************************************************
*    This file is part of Mountyzilla.                                           *
*                                                                                *
*    Mountyzilla is free software; you can redistribute it and/or modify         *
*    it under the terms of the GNU General Public License as published by        *
*    the Free Software Foundation; either version 2 of the License, or           *
*    (at your option) any later version.                                         *
*                                                                                *
*    Mountyzilla is distributed in the hope that it will be useful,              *
*    but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*    GNU General Public License for more details.                                *
*                                                                                *
*    You should have received a copy of the GNU General Public License           *
*    along with Mountyzilla; if not, write to the Free Software                  *
*    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*********************************************************************************/

/*********************************************************************************
* v0.4 by Dabihul - 2012-08-02                                                   *
* - m�n rep�rage messade de bot et insertion du texte                            *
* TODO                                                                           *
* - v�rifications pour explo                                                     *
* - voir avec Tilk pour le poissotron                                            *
*********************************************************************************/


var pageNivURL = 'http://mountypedia.free.fr/mz/niveau_monstre_combat.php';
//var idtURL = "http://mh.byethost5.com/idt_serveur.php";

/*****************
* Page de combat *
*****************/

function getLevel() {
	var divList = document.getElementsByTagName('div');
	
	if (divList.length <= 2)
		return;
	
	// On essaie de voir si cette action �tait une attaque
	var pList = document.getElementsByTagName('p');
	var nomM = '';
	// Modification pour Fr�n�sie by TetDure
	var numAtt = 0;
	for (var i = 0; i < pList.length; i++) {
		if (pList[i].firstChild) {
			nomM = pList[i].firstChild.nodeValue;
			if (nomM && nomM.indexOf('Vous avez attaqu� un') == 0)
				numAtt++;
			}
		}
	
	if (nomM == '')
		return;
	
	// Si c'est une attaque normale, un seul PX
	var comPX = 1;
	if (divList[2].firstChild.nodeValue.indexOf('Attaque Normale') == -1 && numAtt != 2)
		comPX++;

	// Extraction des infos du monstre attaqu�
	var idM;
	var male;
	if (nomM.slice(20, 21) == 'e') {
		male = false;
		idM = nomM.substring(nomM.indexOf('(') + 1, nomM.indexOf(')'));
		nomM = nomM.slice(22, nomM.indexOf('(') - 1);
		}
	else {
		male = true;
		idM = nomM.substring(nomM.indexOf('(') + 1, nomM.indexOf(')'));
		nomM = nomM.slice(21, nomM.indexOf('(') - 1);
		}
	
	if (idM == '')
		return;
	
	var bList = document.getElementsByTagName('b');
	var niveau = '';
	for (var i = 0; i < bList.length; i++) {
		var b = bList[i];
		if (b.childNodes[0].nodeValue != "TU�")
			continue;
		var nbPX = "";
		for (i++; i < bList.length; i++) {
			// Si plusieurs monstres ont �t� tu�s (par ex. explo), on ne peut pas d�duire leurs niveaux
			if (bList[i].childNodes[0].nodeValue == "TU�")
				return;
			if (bList[i].childNodes[0].nodeValue.indexOf("PX") != -1) {
				nbPX = bList[i].childNodes[0].nodeValue;
				break;
			}
		}
		if (nbPX == '')
			return;
		// Si on arrive ici c'est qu'on a trouv� un (et un seul) monstre tu� et les PX gagn�s
		nbPX = parseInt(nbPX.slice(0, nbPX.indexOf("P") - 1));
		if (!nbPX)
			nbPX = 0;
		chaine = (male ? "Il" : "Elle") + " �tait de niveau ";
		niveau = (nbPX * 1 + 2 * nivTroll - 10 - comPX) / 3;
		if (comPX > nbPX) {
			chaine += "inf�rieur ou �gal � " + Math.floor(niveau) + ".";
			niveau = "";
		} else if (Math.floor(niveau) == niveau) {
			chaine += niveau + ".";
		} else {
			chaine = "Mountyzilla n'est pas arriv� � calculer le niveau du monstre.";
			niveau = "";
		}
		insertBr(b.nextSibling.nextSibling.nextSibling);
		insertText(b.nextSibling.nextSibling.nextSibling, chaine);
	}

	if (niveau != '') {
		var button = insertButtonCdm('as_Action');
		button.setAttribute("onClick","window.open('" + pageNivURL + "?id=" + (idM * 1) + "&monstre="
				+ escape(nomM) + "&niveau=" + escape(niveau)
				+ "', 'popupCdm', 'width=400, height=240, toolbar=no, status=no, location=no, resizable=yes'); "
				+ "this.value = 'Merci de votre participation'; this.disabled = true;");
	}
}


/**************************
* Messages du bot : MM/RM *
**************************/

function insertInfoMagie(node, intitule, magie) {
	if (node.nextSibling) {
		node = node.nextSibling;
		insertBr(node);
		insertText(node, intitule);
		insertText(node, magie, true);
		}
	else {
		node = node.parentNode;
		appendBr(node);
		appendText(node, intitule);
		appendText(node, magie, true);
		}		
	}

function getMM(sr) {
	//sr = sr.slice(0, sr.indexOf('%') - 1);
	sr = parseInt(sr.match(/\d+/));
	if (sr==10)
		return '\u2265 ' + Math.round(50*rmTroll/sr);
	if (sr<=50)
		return Math.round(50*rmTroll/sr);
	if (sr<90)
		return Math.round((100-sr)*rmTroll/50);
	return '\u2264 ' + Math.round((100-sr)*rmTroll/50);
	}

function traiteMM() {
	var node = document.evaluate("//b[contains(preceding::text()[1], 'Seuil de R�sistance')]/text()[1]",
							document, null, 9, null).singleNodeValue;
	
	if (node) {
		var mm = getMM(node.nodeValue);
		node = node.parentNode.nextSibling.nextSibling.nextSibling;
		}
	else {
		var node = document.evaluate("//p/text()[contains(., 'Seuil de R�sistance')]",
								document, null, 9, null).singleNodeValue;
		if (!node)
			return;
		var mm = getMM(node.nodeValue);
		node = node.nextSibling.nextSibling;
		}
	insertInfoMagie(node, 'MM approximative de l\'Attaquant...: ', mm);
	}

function getRM(sr, tsr, i) {
	//sr = sr.slice(0, sr.indexOf('%') - 1);
	sr = parseInt(sr.match(/\d+/));
	var rm;
	if (mmTroll <= 0)
		rm = 'Inconnue (quelle id�e d\'avoir une MM valant'+mmTroll+' !)';
	else if (sr == 10)
		rm = '\u2264 ' + Math.round(sr*mmTroll/50);
	else if (sr <= 50)
		rm = Math.round(sr*mmTroll/50);
	else if (sr < 90)
		rm = Math.round(50*mmTroll/(100-sr));
	else
		rm = '\u2265 ' + Math.round(50*mmTroll/(100-sr));
	if (tsr)
		tsr[i] = (sr>10 && sr<90) ? rm : -1;
	return rm;
	}

function traiteRM() {
	var nodes = document.evaluate("//b[contains(preceding::text()[1], 'Seuil de R�sistance')]/text()[1]",
							document, null, 7, null);
	if (nodes.snapshotLength==0)
		return;
	
	var tsr = new Array();
	for (var i=0 ; i<nodes.snapshotLength ; i++) {
		var node = nodes.snapshotItem(i);
		var rm = getRM(node.nodeValue, tsr, i);
		node = node.parentNode.nextSibling.nextSibling.nextSibling;
		insertInfoMagie(node, 'RM approximative de la Cible.......: ', rm);
		}
	}


/**********************
* Fonction Poissotron *
**********************/

function sendDices() {
	var dice = MZ_getValue('POISS_'+numTroll); // = hash du mdp poissotron
	if (!dice || dice == '' || dice=='false')
		return false;
	
	//alert('sendDices ON');
	var bonus = 0;
	var seuil_base = 0;
	var seuil_tot = 0;
	var chaineDes = '';
	
	var node = document.evaluate("//td/text()[contains(., 'Page g�n�r�e en')]",
						document, null, 2, null).stringValue;
	if (node)
		chaineDes += 'temps='+node.substring(node.indexOf('g�n�r�e')+11, node.indexOf('sec')-1)+'&';
	
	node = document.evaluate("//b/text()[position()=1 and starts-with(., 'bonus')]",
						document, null, 2, null).stringValue;
	if (node)
		bonus = parseInt(node.match(/\d+/));
	
	var nodes = document.evaluate("//b/text()[position()=1 and contains(., 'jet de')]",
						document, null, 7, null);
	for (var i=0 ; i<nodes.snapshotLength ; i++) {
		var nbrs = nodes.snapshotItem(i).nodeValue.match(/\d+/g);
		var diceValue = nbrs[0];
		seuil_base = parseInt(nbrs[1]);
		seuil_tot = seuil_base+bonus;
		chaineDes += 'comp[]='+diceValue+'&comp_seuil[]='+seuil_tot+'&';
		}
	
	// � revoir d�s que j'ai une am�lio...
	node = document.evaluate("//b[descendant::text()[1]=\"Jet d'am�lioration\"]/following::b[1]/descendant::text()[1]",
						document, null, 2, null).stringValue;
	if (node)
		chaineDes += 'amel[]='+node+'&amel_seuil[]='+seuil_base+'&';
	
	nodes = document.evaluate("//b[contains(preceding::text()[1], 'Jet de R�sistance.....')]/text()[1]",
						document, null, 7, null);
	for (var i=0 ; i<nodes.snapshotLength ; i++)
		chaineDes += 'sr[]='+nodes.snapshotItem(i).nodeValue+'&';
	
	nodes = document.evaluate("//b[contains(preceding::text()[1], 'Seuil de R�sistance de la Cible')]/text()[1]",
						document, null, 7, null);
	for (var i = 0; i < nodes.snapshotLength; i++)
		chaineDes += 'sr_seuil[]='+nodes.snapshotItem(i).nodeValue.match(/\d+/)+'&';
	
	if (chaineDes == '')
		return false;
	
	var fin = currentURL.indexOf('?');
	var url = currentURL.slice(currentURL.indexOf('/Actions')+9, fin != -1 ? fin : 500);
	if (url == 'Play_a_SortResult.php') {
		url = document.referrer;
		if (url.indexOf('?') == -1)
			url = url.slice(url.indexOf('/Actions')+9);
		else
			url = url.slice(url.indexOf('/Actions')+9, url.indexOf('?'));
		if (url == 'Sorts/Play_a_SortXX.php') {
			url = document.referrer;
			url = url.slice(url.indexOf('&as_NomSort')+12);
			url = url.slice(0, url.indexOf('&'));
			url = 'Sorts/Play_a_SortXX.php/'+url;
			}
		else if (url == 'Sorts/Play_a_SortYY.php') {
			url = document.referrer;
			url = url.slice(url.indexOf('&as_NomSort')+12);
			url = url.slice(0, url.indexOf('&'));
			url = 'Sorts/Play_a_SortYY.php/'+url;
			}
		}
	else if(url == 'Play_a_Combat.php') {
		url = document.referrer;
		url = url.substring(url.indexOf('/Actions')+9);
		if (url.indexOf('ai_IdComp') != -1) {
			url = url.substring(url.indexOf('ai_IdComp')+10);
			url = url.substring(0,url.indexOf('&'));
			url = 'Competences/Play_a_Combat'+url+'.php';
			}
		else if (url.indexOf('as_NomSort') != -1) {
			url = url.substring(url.indexOf('as_NomSort')+11)
			url = url.substring(0,url.indexOf('&'));
			url = 'Sorts/'+url;
			}
		}
	
	addScript();
	MZ_xmlhttpRequest({
		method: 'GET',
		url: poissotron+'?url='+url+'&'+chaineDes+'&id='+numTroll+'&mdp='+dice,
		headers : {
			'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
			'Accept': 'application/atom+xml,application/xml,text/xml',
			},
		onload: function(responseDetails) {
				var texte = responseDetails.responseText;
				if(texte.indexOf('error: ')!=-1) {
					alert(texte.substring(texte.indexOf('error: ')+7));
					MZ_setValue('POISS_'+numTroll, false);
					}
				}
		});
	return true;
	}


/**********************************
* Fonction stats IdT par Raistlin *
**********************************/
	
/*function getIdt() {
	if (MZ_getValue("SEND_IDT") == "non")
		return false;
		
	var regExpBeginning = /^\s+/;
	var regExpEnd       = /\s+$/;

	var nomIdt = document.evaluate(
			"//tr/td[contains(p/text(),'identification a donn� le r�sultat suivant : ')]/b/text()",
			document, null, XPathResult.STRING_TYPE, null).stringValue;
	if (!nomIdt)
		return false;

	var caracIdt;
	if (nomIdt.indexOf("Mal�diction !") != -1) {
		caracIdt = "";
		nomIdt = "Mission maudite";
	} else {
		caracIdt = nomIdt.slice(nomIdt.indexOf("(") + 1, nomIdt.indexOf(")"));
		nomIdt = nomIdt.slice(nomIdt.indexOf(" - ")+3);
		nomIdt = nomIdt.slice(0, nomIdt.indexOf("(") - 1);
		nomIdt = nomIdt.replace(regExpBeginning, "").replace(regExpEnd, "");
	}
	MZ_xmlhttpRequest({
		method: 'GET',
		url: idtURL + "?item=" + escape(nomIdt) + "&descr=" + escape(caracIdt),
		headers : {
			'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
			'Accept': 'application/atom+xml,application/xml,text/xml',
		}
	});
	return true;
}*/


/**********************
* Fonction principale *
**********************/

function dispatch() {
	if (isPage('MH_Play/Actions')) {
		sendDices();
		if (document.evaluate("//form/descendant::p/text()[contains(., 'Zone Pi�g�e')]",
						document, null, 2, null).stringValue)
			traiteMM();
		else if (document.evaluate("//tr/td/descendant::p/text()[contains(., 'identification a donn�')]",
							document, null, 2, null).stringValue) {
			//getIdt();
			traiteRM();
			}
		else {
			traiteRM();
			getLevel();
			}
		}
	else { // traitement des messages du bot
		var messageTitle = document.getElementsByTagName('table')[0].childNodes[1].firstChild
								.childNodes[1].firstChild.childNodes[1].firstChild.nodeValue;
		if (messageTitle.indexOf('R�sultat de Combat') != -1 && messageTitle.indexOf('sur') != -1) {
			getLevel();
			traiteRM();
			}
		else if (messageTitle.indexOf('R�sultat du pouvoir') != -1
				|| messageTitle.indexOf('R�sultat de Combat') != -1)
			traiteMM();
		else if (messageTitle.indexOf('Identification des tr�sors') != -1)
			traiteRM();
		}
	}


start_script(31);

dispatch();

displayScriptTime();
