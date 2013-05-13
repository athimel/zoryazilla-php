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

/*********************************************************************************
*               mod from Mountyzilla by Dabihul v2.0 - 2012-05-17                *
*********************************************************************************/

function positive(i) {
	if (i>=0)
		return '+'+i;
	return i;
	}

function traiteMouches() {
	var mouchesLa = document.evaluate(
		"//tr[@class='mh_tdpage']/td[6]/img[@alt='La Mouche est  là']/../../td[3]/nobr[1]",
		document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	listePouvoirs = new Array();
	listeTypes = new Array();
	for (var i=0 ; i<mouchesLa.snapshotLength ; i++) {
		var node = mouchesLa.snapshotItem(i);
		var type = trim(node.parentNode.parentNode.childNodes[7].textContent);
		if (listeTypes[type]==null)
			listeTypes[type] = 1;
		else
			listeTypes[type]++;
		if (!node.textContent)
			continue;
		
		var texte = node.textContent;
		var carac = texte.substring(0,texte.indexOf(':')-1);
		var valeur = parseInt(texte.match(/-?\d+/));
		if (listePouvoirs[carac]==null)
			listePouvoirs[carac] = valeur;
		else
			listePouvoirs[carac] += valeur;
		}
	var node = document.evaluate("//b/text()[contains(.,'Effet total')]", document, null,
							XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	node = node.parentNode.nextSibling;
	var effetsmax = node.textContent.split('|');
	var texte = ' ';
	for (var i=0 ; i<effetsmax.length ; i++) {
		if (texte.length!=1)
			texte += ' | ';
		var carac = trim(effetsmax[i].substring(0,effetsmax[i].indexOf(':')-1));
		var bonus = effetsmax[i].match(/-?\d+/);
		if (listePouvoirs[carac]==undefined)
			listePouvoirs[carac]=0;
		if (listePouvoirs[carac]!=bonus) {
			texte += '<b>' + carac + ' : ' + positive(listePouvoirs[carac]);
			if (carac=='TOUR')
				texte += ' min';
			texte +=  '</b>';
			}
		else
			texte += effetsmax[i];
		}
	span = document.createElement('span');
	span.innerHTML = texte;
	node.parentNode.replaceChild(span, node);
	
	var listeMouches = document.evaluate("//li", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	for  (var i=0 ; i<listeMouches.snapshotLength ; i++ ) {
		var node = listeMouches.snapshotItem(i);
		var mots = node.textContent.split(' ');
		var type = mots.pop();
		if (mots[0]!=listeTypes[type])
			node.textContent += ' ('+listeTypes[type]+' présentes)';
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
   var tbody = document.evaluate("//form[@name='ActionForm']/table[@class='mh_tdborder']/tbody[1]",
         document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
   tr=tbody.lastChild.lastChild;
   
   if (mouches.snapshotLength>0) {
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
