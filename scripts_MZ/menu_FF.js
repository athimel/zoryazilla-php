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
/* v1.0.4 by Dabihul - 2012-08-01 - TODO nada                                   */


// n'est lanc� que sur refresh du volet de menu (activation ou [Refresh])

function updateData() {
	var inputs = document.getElementsByTagName('input');
	var divs = document.getElementsByTagName('div');
	
	numTroll = inputs[0].getAttribute('value');
	MZ_setValue('NUM_TROLL', numTroll);
	MZ_setValue('NIV_TROLL',inputs[1].getAttribute('value'));
	if (!MZ_getValue(numTroll+'.caracs.rm'))
		MZ_setValue(numTroll+'.caracs.rm', 0); // assure l'init des 4 var de libs
	MZ_setValue(numTroll+'.caracs.mm',inputs[2].getAttribute('value'));
	
	var DLA = new Date( StringToDate(divs[1].firstChild.nodeValue.substring(5)) );
	if (MZ_getValue(numTroll+'.DLA.encours')) {
		var DLAstockee = new Date( StringToDate(MZ_getValue(numTroll+'.DLA.encours')) );
		if (DLA>DLAstockee)
			MZ_setValue(numTroll+'.DLA.ancienne', DateToString(DLAstockee) );
		}
	MZ_setValue(numTroll+'.DLA.encours', DateToString(DLA) );
	
	var listePos = divs[1].childNodes[2].nodeValue.split('=');
	MZ_setValue(numTroll+'.position.X', parseInt(listePos[1]) );
	MZ_setValue(numTroll+'.position.Y', parseInt(listePos[2]) );
	MZ_setValue(numTroll+'.position.N', parseInt(listePos[3]) );
	}

start_script(31);

updateData();
//============================ ZZ POST CODE ======================================
// ajout d'un icon pour les Cron ZZ
var node =  document.evaluate("//div/text()[contains(.,'DLA')]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
if (node.snapshotLength==1) {
	var zzNode=document.createElement('span');
	zzNode.appendChild(createImage(ZZDB+'/Cron/zzcron.php?return_image=1', "ZoryaZilla Scheduler"));
	zzNode.appendChild(document.createTextNode(" "+node.snapshotItem(0).nodeValue));
	node.snapshotItem(0).parentNode.replaceChild(zzNode, node.snapshotItem(0).parentNode.firstChild);
}

