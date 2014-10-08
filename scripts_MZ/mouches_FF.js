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
	
	var mouchesLa = document.evaluate("./tbody/tr/td["+td_etat+"]/img[@alt='La Mouche est là']"
										+"/../../td["+td_effet+"]/nobr[1]", mainTab, null, 7, null);

	var listePouvoirs = [], listeTypes = [];
	for (var i=0 ; i<mouchesLa.snapshotLength ; i++) {
		// pour décompte final type de mouches
		var node = mouchesLa.snapshotItem(i);
		var type = trim(node.parentNode.parentNode.childNodes[index_type].textContent);
		if (!listeTypes[type]) {
			listeTypes[type] = 1;
		} else {
			listeTypes[type]++;
		}		
		if (!node.textContent) {
			continue;
		}
		
		// gestion bonus (multiples pour pogées)
		var texte = node.textContent;
		if (texte.indexOf('|')!=-1) {
                    var caracs = texte.split(' | ');
		} else {
		    var caracs = [ texte ]; 
                }

		for (var j=0 ; j<caracs.length ; j++) {
			var valeur = parseInt(caracs[j].match(/-?\d+/));
			var carac = caracs[j].substring(0,caracs[j].indexOf(':')-1);
			if (!listePouvoirs[carac]) { 
                            listePouvoirs[carac] = valeur;
			} else { 
			    listePouvoirs[carac] += valeur;
                        }
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

		if (!listePouvoirs[carac]) {
                    listePouvoirs[carac]=0;
                }
		if (listePouvoirs[carac]!=bonus) {
			texte += '<b>'+carac+' : '+aff(listePouvoirs[carac]);
			if (carac=='TOUR') {
                            texte += ' min';
                        }
			texte += '</b>';
		} else {
			texte += effetsmax[i];
		}
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
//============================ ZZ POST CODE ======================================



function positive(i)

{

   if(i>=0)

      return "+"+i;

   return i;

}



function FlyLess() {

try

{

   //var mouches = document.evaluate("//tr[@class='mh_tdpage']/td/img[@alt='Pas Là']/../../td[2]/text()[contains(.,'(')]",

     //    document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

         

    var mouches = document.evaluate("//img[@alt='Pas Là']/../../td[2]/text()[contains(.,'(')]",

		document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

			          

   listePouvoirs = new Array();

   for(var i=0;i<mouches.snapshotLength;i++)

   {

      var texte = mouches.snapshotItem(i).nodeValue;

      if(texte.indexOf(":")==-1)

         continue;

      var bonus = trim(texte.substring(texte.indexOf("(")+1,texte.indexOf(":")));

      var valeur = parseInt(texte.substring(texte.indexOf(":")+1,texte.indexOf(")")));

      if(listePouvoirs[bonus] == null)

         listePouvoirs[bonus] = valeur;

      else

         listePouvoirs[bonus] += valeur;

   }

   var nombreMouches = document.evaluate("//tr[@class='mh_tdpage']/td[4]/text()[contains(.,'jours')]/../../td[2]/text()[contains(.,'(')]",

         document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;

   var tbody = document.evaluate("//form[@name='ActionForm']/table[0]/tbody[1]",

         document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;


   

   if (tbody && mouches.snapshotLength>0) {

           tr=tbody.lastChild.lastChild;

	   var td = appendTdText(tr,mouches.snapshotLength+" mouches absentes sur "+nombreMouches+"",1);

	   td.setAttribute('colspan', 4);

	   var text="";

 	   for (key in listePouvoirs)

	   {

 	     if(text.length!=0)

 	        text+=" | ";

	      text+=key+" : "+positive(listePouvoirs[key]);

	      if(key=="TOUR")

	         text+=" min";

	      if(key=="RM" || key=="MM")

	         text+="%";

	   }

	   appendText(td," ( "+text+" )");

	}

}

catch(e) {alert(e)}

}



FlyLess();

