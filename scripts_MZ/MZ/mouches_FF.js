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
/* v2.1 by Dabihul - 2012-08-02                                                 */

function traiteMouches() {
	var formBody = document.getElementsByTagName('tbody')[3];
	if (!formBody) {return;}
	var mouchesLa = document.evaluate("./tr/td[6]/img[@alt='La Mouche est  là']/../../td[3]/nobr[1]",
							formBody, null, 7, null);
	listePouvoirs = new Array();
	listeTypes = new Array();
	for (var i=0 ; i<mouchesLa.snapshotLength ; i++) {
		var node = mouchesLa.snapshotItem(i);
		var type = trim(node.parentNode.parentNode.childNodes[7].textContent);
		if (!listeTypes[type])
			listeTypes[type] = 1;
		else
			listeTypes[type]++;
		if (!node.textContent)
			continue;
		
		var texte = node.textContent;
		var carac = texte.substring(0,texte.indexOf(':')-1);
		var valeur = parseInt(texte.match(/-?\d+/));
		if (!listePouvoirs[carac])
			listePouvoirs[carac] = valeur;
		else
			listePouvoirs[carac] += valeur;
		}
	var node = document.evaluate("./tr/td[1]/b[contains(./text(),'Effet total')]",
						formBody, null, 9, null).singleNodeValue.nextSibling;
	var effetsmax = node.textContent.split('|');
	var texte = ' ';
	for (var i=0 ; i<effetsmax.length ; i++) {
		if (texte.length!=1)
			texte += ' | ';
		var carac = trim(effetsmax[i].substring(0,effetsmax[i].indexOf(':')-1));
		var bonus = effetsmax[i].match(/-?\d+/);
		if (!listePouvoirs[carac])
			listePouvoirs[carac]=0;
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
	
	var listeMouches = document.evaluate("./tr/td[1]/ul/li/text()", formBody, null, 7, null);
	for  (var i=0 ; i<listeMouches.snapshotLength ; i++ ) {
		var node = listeMouches.snapshotItem(i);
		var mots = node.nodeValue.split(' ');
		var type = mots.pop();
		if (!listeTypes[type])
			node.nodeValue += ' (0 présente)';
		else if (mots[0]!=listeTypes[type]) {
			if (listeTypes[type]==1)
				node.nodeValue += ' (1 présente)';
			else
				node.nodeValue += ' ('+listeTypes[type]+' présentes)';
			}
		}
	}

try {
start_script();
traiteMouches();
displayScriptTime();
}
catch(e) {alert(e)}
