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

/* v4.0 by Dabihul - 2013-04-21
 * - nouvelle gestion recherches cause jquery + ajout colonne + renommage colonne
 */

function traiteMouches() {
	var mainTab = document.getElementById('mouches');
	if (!mainTab) {return;}
	
	var theadtr = document.evaluate("./thead/tr", mainTab, null, 9, null).singleNodeValue;
	var node_etat = document.evaluate("./th[contains(./text(),'Etat')]", theadtr,
										null, 9, null).singleNodeValue;
	var td_etat = (getMyID(node_etat)+1)/2; // 6 -> 7
	var node_effet = document.evaluate("./th[contains(./text(),'Effet')]", theadtr,
										null, 9, null).singleNodeValue;
	var td_effet = (getMyID(node_effet)+1)/2; // 3 -> 3
	var node_type = document.evaluate("./th[contains(./text(),'Type')]", theadtr,
										null, 9, null).singleNodeValue;
	if (!node_type)
		{ node_type = document.evaluate("./th[contains(./text(),'Race')]", theadtr,
										null, 9, null).singleNodeValue; }
	var index_type = getMyID(node_type); // 7 -> 7	
	
	var mouchesLa = document.evaluate("./tbody/tr/td["+td_etat+"]/img[@alt='La Mouche est  là']"
										+"/../../td["+td_effet+"]/nobr[1]", mainTab, null, 7, null);

	var listePouvoirs = [], listeTypes = [];
	for (var i=0 ; i<mouchesLa.snapshotLength ; i++) {
		// pour décompte final type de mouches
		var node = mouchesLa.snapshotItem(i);
		var type = trim(node.parentNode.parentNode.childNodes[index_type].textContent);
		if (!listeTypes[type])
			{ listeTypes[type] = 1; }
		else
			{ listeTypes[type]++; }
		if (!node.textContent)
			{ continue; }
		
		// gestion bonus (multiples pour pogées)
		var texte = node.textContent;
		if (texte.indexOf('|')!=-1)
			{ var caracs = texte.split(' | '); }
		else
			{ var caracs = [ texte ]; }
		for (var j=0 ; j<caracs.length ; j++) {
			var valeur = parseInt(caracs[j].match(/-?\d+/));
			var carac = caracs[j].substring(0,caracs[j].indexOf(':')-1);
			if (!listePouvoirs[carac])
				{ listePouvoirs[carac] = valeur; }
			else
				{ listePouvoirs[carac] += valeur; }
			}
		}
	// récup Effet total et affichage variations
	var footerNode = document.getElementsByTagName('tfoot')[0];
	if (!footerNode) {return;}
	// correction du colspan MH erroné
	footerNode.childNodes[1].childNodes[1].setAttribute('colspan',7);
	var node = document.evaluate(".//b[contains(./text(),'Effet total')]", footerNode,
								null, 9, null).singleNodeValue.nextSibling;
	var effetsmax = node.nodeValue.split('|');
	var texte = ' ';
	for (var i=0 ; i<effetsmax.length ; i++) {
		if (texte.length!=1)
			texte += ' | ';
		var carac = trim(effetsmax[i].substring(0,effetsmax[i].indexOf(':')-1));
		var bonus = effetsmax[i].match(/-?\d+/);
		if (!listePouvoirs[carac])
			{ listePouvoirs[carac]=0; }
		if (listePouvoirs[carac]!=bonus) {
			texte += '<b>'+carac+' : '+aff(listePouvoirs[carac]);
			if (carac=='TOUR') {texte += ' min';}
			texte += '</b>';
			}
		else
			texte += effetsmax[i];
		}
	span = document.createElement('span');
	span.innerHTML = texte;
	node.parentNode.replaceChild(span, node);
	// affichage variations du décompte
	var mouchesParType = document.evaluate("./tr/td/ul/li/text()", footerNode, null, 7, null);
	for (var i=0 ; i<mouchesParType.snapshotLength ; i++) {
		var node = mouchesParType.snapshotItem(i);
		var mots = node.nodeValue.split(' ');
		var type = mots.pop();
		if (!listeTypes[type])
			{ node.nodeValue += ' (0 présente)'; }
		else if (mots[0]!=listeTypes[type]) {
			if (listeTypes[type]==1)
				{ node.nodeValue += ' (1 présente)'; }
			else
				{ node.nodeValue += ' ('+listeTypes[type]+' présentes)'; }
			}
		}
	}

try {
start_script();
traiteMouches();
displayScriptTime();
}
catch(e) {alert(e)}
