/*********************************************************************************
*    This file is part of ZoryaZilla Fusion merged with mountyzilla              *
*********************************************************************************/
//============================ ZZ PRE CODE =======================================
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
/* v0.1.2 by Dabihul - 2012-08-02 | TODO : bin tout en fait                     */

var popup;

function initPopup() {
	popup = document.createElement('div');
	popup.setAttribute('id', 'popup');
	popup.setAttribute('class', 'mh_textbox');
	popup.setAttribute('style', 'position: absolute; border: 1px solid #000000; visibility: hidden;'
						+ 'display: inline; z-index: 3; max-width: 400px;');
	document.body.appendChild(popup);
}

function showPopup(evt) {
	var texte = this.getAttribute("texteinfo");
	popup.innerHTML = texte;
	popup.style.left = evt.pageX + 15 + 'px';
	popup.style.top = evt.pageY + 'px';
	popup.style.visibility = "visible";
}

function hidePopup() {
	popup.style.visibility = "hidden";
}

function createPopupImage(url, text)
{
	var img = document.createElement('img');
	img.setAttribute('src',url);
	img.setAttribute('align','ABSMIDDLE');
	img.setAttribute("texteinfo",text);
	img.addEventListener("mouseover", showPopup,true);
	img.addEventListener("mouseout", hidePopup,true);
	return img;
}

function formateTexte(texte)
{
	texte = texte.replace(/\n/g,"<br/>");
	texte = texte.replace(/^([^<]*) d'un/g,"<b>$1</b> d'un");
	texte = texte.replace(/<br\/>([^<]*) d'un/g,"<br/><b>$1</b> d'un");
	texte = texte.replace(/(d'une? )([^<]*) d'au/g,"$1<b>$2</b> d'au");
	texte = texte.replace(/(Qualit� )([^<]*) \[/g,"$1<b>$2</b> [");
	texte = texte.replace(/\[([^<]*)\]/g,"[<b>$1</b>]");
	return texte;
}

function arrondi(x) {
	return Math.ceil(x-0.5); // arrondi � l'entier le plus proche, valeurs inf
	}

function treateMinerai() {
	//alert('ON - currentURL = '+currentURL);
	if(currentURL.indexOf("as_type=Divers")==-1)
		return false;
	//alert('check1');
	var node = document.evaluate("//tr[@class='mh_tdtitre' and contains(./td/b/text(),'Minerai')]",
						document, null, 9, null).singleNodeValue;
	if (!node)
		return false;
	//alert('check2');
	node = node.nextSibling.nextSibling;
	while (node && node.getAttribute('class')!='mh_tdtitre') {
		var nature = node.childNodes[5].textContent;
		var caracs = node.childNodes[7].textContent;
		var taille = caracs.match(/\d+/);
		var coef = 1;
		if (caracs.indexOf('Moyen')!=-1) {coef = 2;}
		else if (caracs.indexOf('Normale')!=-1) {coef = 3;}
		else if (caracs.indexOf('Bonne')!=-1) {coef = 4;}
		else if (caracs.indexOf('Exceptionnelle')!=-1) {coef = 5;}
		if (nature.indexOf('Mithril')!=-1) {
			coef = 0.2*coef;
			node.childNodes[7].textContent += ' | UM: ' + arrondi(taille*coef) ;
			}
		else {
			coef = 0.75*coef+1.25;
			if (nature.indexOf('Taill')!=-1) coef = 1.15*coef;
			node.childNodes[7].textContent += ' | Carats: ' + arrondi(taille*coef) ;
			}
		node = node.nextSibling.nextSibling;
		}
	}

function treateComposants() {
	if(currentURL.indexOf("as_type=Compo")==-1)
		return false;
	//On r�cup�re les composants
	var nodes = document.evaluate(
			"//a[starts-with(@href,'TanierePJ_o_Stock.php?IDLieu=') or starts-with(@href,'Comptoir_o_Stock.php?IDLieu=')]"
			+ "/following::table[@width = '100%']/descendant::tr[contains(td[1]/a/b/text(),']') "
			+ "and (contains(td[3]/text()[2],'Tous les trolls') or contains(td[3]/text()[1],'Tous les trolls') ) "
			+ "and td[1]/img/@alt = 'Identifi�']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength == 0)
		return false;

	var texte = "";
	for (var i = 0; i < nodes.snapshotLength; i++) {
		var n1 = nodes.snapshotItem(i).childNodes[1];
		var n3 = nodes.snapshotItem(i).childNodes[3];
		var debut = n1.childNodes[2].nodeValue.replace(/\n/g, '');
		var prix = n3.childNodes[0].nodeValue;
		if (!prix)
			prix = n3.childNodes[3].getAttribute('value') + " GG'";
		texte += debut.substring(debut.indexOf('[') + 1, debut.indexOf(']')) + ";"
				+ n1.childNodes[3].firstChild.nodeValue.replace(/\n/g, '')
				+ n1.childNodes[3].childNodes[1].firstChild.nodeValue.replace(/\n/g, '') + ";"
				+ prix.replace(/\n/g, '') + "\n";
	}

	var c = document.evaluate("//div[@class = 'titre2']/text()",
			document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var id_taniere = c.snapshotItem(0).nodeValue;
	id_taniere = id_taniere.substring(id_taniere.lastIndexOf('(') + 1, id_taniere.lastIndexOf(')'));

	var form = getFormComboDB(currentURL.indexOf('MH_Taniere') != -1 ? 'taniere' : 'grande_taniere', id_taniere,
			texte.replace(/\240/g, " ").replace(/d'un/g, "d un"));
	if (form)
	{
		if(document.getElementsByTagName('form').length>0)
			insertBefore(document.getElementsByTagName('form')[0].nextSibling, form);
		else
		{
			var thisP = document.evaluate("//p/table/descendant::text()[contains(.,'Heure Serveur')]/../../../../..",	document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			insertBefore(thisP, form);
		}
	}
}

function treateAllComposants() {
	if(currentURL.indexOf("as_type=Compo")==-1)
		return false;
	//On r�cup�re les composants
	var categ = document.evaluate( "count(//table/descendant::text()[contains(.,'Sans cat�gorie')])",
							document, null, XPathResult.ANY_TYPE, null ).numberValue;
	var c = (categ == 0 ? 3 : 4);
	var nodes = document.evaluate("//a[starts-with(@href,'TanierePJ_o_Stock.php?IDLieu=') "
		+ "or starts-with(@href,'Comptoir_o_Stock.php?IDLieu=')]/following::table[@width = '100%']"
		+ "/descendant::tr[contains(td[1]/a/b/text(),']') and ("
			+ "td["+c+"]/text()[1] = '\240-\240' "
			+ "or contains(td["+c+"]/text()[2],'Tous les trolls') "
			+ "or contains(td["+c+"]/text()[1],'Tous les trolls') "
			+ "or (count(td["+c+"]/text()) = 1 and td["+c+"]/text()[1]='n�') ) "
		+ "and td[1]/img/@alt = 'Identifi�']",
		document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength == 0)
		return false;

	var texte = "";
	for (var i = 0; i < nodes.snapshotLength; i++) {
		var n1 = nodes.snapshotItem(i).childNodes[1];
		var n3 = nodes.snapshotItem(i).childNodes[3];
		var debut = n1.childNodes[2].nodeValue.replace(/\n/g, '');
		var prix = n3.childNodes[0].nodeValue;
		if (!prix)
		{	
			if(n3.childNodes[3].getAttribute('value') && n3.childNodes[3].getAttribute('value')!="")
				prix = n3.childNodes[3].getAttribute('value') + " GG'";
		}
		else
		{
			prix= prix.replace(/[\240 ]/g, "");
			if(prix=="-")
				prix=null;
		}
		if(prix)
			texte += debut.substring(debut.indexOf('[') + 1, debut.indexOf(']')) + ";"
				+ n1.childNodes[3].firstChild.nodeValue.replace(/\n/g, '')
				+ n1.childNodes[3].childNodes[1].firstChild.nodeValue.replace(/\n/g, '') + ";"
				+ prix.replace(/\n/g, '') + "\n";
		else
			texte += debut.substring(debut.indexOf('[') + 1, debut.indexOf(']')) + ";"
				+ n1.childNodes[3].firstChild.nodeValue.replace(/\n/g, '')
				+ n1.childNodes[3].childNodes[1].firstChild.nodeValue.replace(/\n/g, '') + ";pas d�fini\n";
	}

	var c = document.evaluate("//div[@class = 'titre2']/text()",
			document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var id_taniere = c.snapshotItem(0).nodeValue;
	id_taniere = id_taniere.substring(id_taniere.indexOf('(') + 1, id_taniere.indexOf(')'));

	var form = getFormComboDB(currentURL.indexOf('MH_Taniere') != -1 ? 'taniere' : 'grande_taniere', id_taniere,
			texte.replace(/\240/g, " ").replace(/d'un/g, "d un"),"Vendre tous les composants non r�serv�s sur le Troc de l\'Hydre");
	if (form)
	{
		if(document.getElementsByTagName('form').length>0)
			insertBefore(document.getElementsByTagName('form')[0].nextSibling, form);
		else
		{
			var thisP = document.evaluate("//p/table/descendant::text()[contains(.,'Heure Serveur')]/../../../../..",	document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			insertBefore(thisP, form);
		}
	}
}

function treateEM()
{
	if(currentURL.indexOf("as_type=Compo")==-1)
		return false;
	var urlImg = SkinZZ+"MZ/Competences/ecritureMagique.png";
	var nodes = document.evaluate("//tr[@class='mh_tdpage']"
			, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength == 0)
		return false;
	for (var i = 0; i < nodes.snapshotLength; i++) {
		var desc = nodes.snapshotItem(i).getElementsByTagName('td') ;
		var link = desc[2].firstChild ;
		var nomCompoTotal = desc[2].textContent ;
		var nomCompo = nomCompoTotal.substring(0,nomCompoTotal.indexOf(" d'un"));
		nomCompoTotal = nomCompoTotal.substring(nomCompoTotal.indexOf("d'un"),nomCompoTotal.length);
		var nomMonstre = trim(nomCompoTotal.substring(nomCompoTotal.indexOf(" ")+1,nomCompoTotal.length-1)) ;
		var locqual = desc[3].textContent ;
		var qualite = trim(locqual.substring(locqual.indexOf("Qualit�:")+9)) ;
		var localisation = trim(locqual.substring(0,locqual.indexOf("|")-1)) ;
		if(isEM(nomMonstre).length>0)
		{
			var infos = composantEM(nomMonstre, trim(nomCompo), localisation,getQualite(qualite));
			if(infos.length>0)
			{
				var shortDescr = "Variable";
				var bold = 0;
				if(infos != "Composant variable")
				{
					shortDescr = infos.substring(0,infos.indexOf(" "));
					if(parseInt(shortDescr)>=0)
						bold=1;
				}
				link.parentNode.appendChild(createImage(urlImg,infos)) ;
				appendText(link.parentNode," ["+shortDescr+"]",bold) ;
			}
		}
		
	}
}

function treateChampi() {
	if (currentURL.indexOf('as_type=Champi')==-1)
		return false;
	var nodes = document.evaluate("//img[@alt = 'Identifi�']/../a/text()[1]",
			document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength == 0)
		return false;

	for (var i = 0; i < nodes.snapshotLength; i++) {
			var node = nodes.snapshotItem(i);
			var nomChampi = trim(node.nodeValue.replace(/\240/g, ' '));
			if (moisChampi[nomChampi]) {
				appendText(node.parentNode.parentNode,' [Mois '+moisChampi[nomChampi]+']');
				}
			}
	}

function treateEnchant()
{
	if(currentURL.indexOf("as_type=Compo")==-1)
		return false;
	try
	{
		if(!listeMonstreEnchantement)
			computeCompoEnchantement();
		var nodes = document.evaluate(
			"//a[starts-with(@href,'TanierePJ_o_Stock.php?IDLieu=') or starts-with(@href,'Comptoir_o_Stock.php?IDLieu=')]"
			+ "/following::table[@width = '100%']/descendant::tr[contains(td[1]/a/b/text(),']') "
			+ "and td[1]/img/@alt = 'Identifi�']/td[1]/a", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		if (nodes.snapshotLength == 0)
			return false;
		var urlImg = SkinZZ+"MZ/enchant.png";
		for (var i = 0; i < nodes.snapshotLength; i++) {
			var link = nodes.snapshotItem(i);
			var nomCompoTotal = link.firstChild.nodeValue;
			var nomCompo = nomCompoTotal.substring(0,nomCompoTotal.indexOf(" d'un"));
			nomCompoTotal = nomCompoTotal.substring(nomCompoTotal.indexOf("d'un"),nomCompoTotal.length);
			var nomMonstre = nomCompoTotal.substring(nomCompoTotal.indexOf(" ")+1,nomCompoTotal.length);
			nomCompoTotal = link.childNodes[1].childNodes[0].nodeValue;
			var qualite = nomCompoTotal.substring(nomCompoTotal.indexOf("de Qualit�")+11,nomCompoTotal.indexOf(" ["));
			var localisation = nomCompoTotal.substring(nomCompoTotal.indexOf("[")+1,nomCompoTotal.indexOf("]"));
			if(isEnchant(nomMonstre).length>0)
			{
				var infos = composantEnchant(nomMonstre, nomCompo, localisation,getQualite(qualite));
				if(infos.length>0)
				{
					link.parentNode.appendChild(createImage(urlImg,infos));
				}
			}
		}
	}
	catch(e)
	{
		alert(e);
	}
}

function treateEquipEnchant()
{
	if(currentURL.indexOf('as_type=Arme')==-1 && currentURL.indexOf('as_type=Armure')==-1)
		return false;
	initPopup();
	computeEnchantementEquipement(createPopupImage,formateTexte);
}

start_script();

treateAllComposants();
treateComposants(); treateMinerai();
treateMinerai();
if (MZ_getValue('NOINFOEM')!='true') {
	treateChampi();
	treateEM();
	}
if (MZ_getValue(numTroll+'.enchantement.liste') && MZ_getValue(numTroll+'.enchantement.liste')!='') {
	treateEnchant();
	treateEquipEnchant();
	}

displayScriptTime();
//============================ ZZ POST CODE ======================================
