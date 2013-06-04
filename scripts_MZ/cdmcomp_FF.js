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
/* v0.1.1 by Dabihul - 2012-08-02                                               */

var pageDispatcher = "http://mountypedia.free.fr/mz/cdmdispatcher.php";
//var pageDispatcher = "http://m2m-bugreport.dyndns.org/scripts/dev/cdmdispatcher.php";
//var pageCdmRecord = "http://nocmh.free.fr/scripts/cdmCollecteur.php";
var cdm = '';


function traiteCdM() { // check Dab
	var form = document.getElementsByTagName('form')[0];

	// Teste si ce message du bot est un message de CdM
	if (!document.evaluate("./p/b/text()[contains(.,'fait partie')]", form, null, 9, null).singleNodeValue)
		return;
	
	cdm = document.evaluate("./p/b/text()[contains(.,'fait partie')]",
					form, null, 9, null).singleNodeValue.nodeValue + '\n';
	var tbody = document.evaluate("descendant::table/tbody", form, null, 9, null).singleNodeValue;
	var intits = document.evaluate("descendant::td[@width='25%']/descendant::b/text()", tbody, null, 7, null);
	var vals = document.evaluate("descendant::td[@width='79%']/descendant::b/text()", tbody, null, 7, null);
	for (var i=0 ; i<intits.snapshotLength ; i++) 
		cdm += intits.snapshotItem(i).nodeValue + ' ' + vals.snapshotItem(i).nodeValue + '\n';

	// On insère le bouton et un espace
	var button = insertButtonCdm('as_Action', sendInfoCDM);

	// Insertion de l'estimation des PV restants
	var pv = vals.snapshotItem(1).nodeValue;
	if (pv.indexOf("entre") == -1)
		return;
	pv = getPVsRestants(pv,vals.snapshotItem(2).nodeValue);
	if (pv) {
		var tr = insertTr(intits.snapshotItem(3).parentNode.parentNode.parentNode);
		appendTdText(tr, pv[0], true);
		appendTdText(tr, pv[1], true);
		}
	}


function sendInfoCDM() {
	MZ_setValue('CDMID', 1+parseInt(MZ_getValue('CDMID')) );
	var buttonCDM = this;
	var texte = '';
	//alert(pageDispatcher+'?cdm='+escape(cdm));
	//window.open(pageCdmRecord + "?cdm=" + escape(cdm) + "&source=mountyzilla/script_teubreu&forwardTo=" + pageDispatcher
	//		, 'popupCdm', 'width=400, height=240, toolbar=no, status=no, location=no, resizable=yes');
	MZ_xmlhttpRequest({
		method: 'GET',
		url: pageDispatcher+'?cdm='+escape(cdm),
		headers : {
			'User-agent': 'Mozilla/4.0 [FusionZoryaZilla] (compatible) Greasemonkey',
			'Accept': 'application/atom+xml,application/xml,text/xml'
			},
		onload: function(responseDetails) {
			texte = responseDetails.responseText;
			buttonCDM.value = texte;
			//alert('texte1 = '+texte);
			buttonCDM.disabled = true;
			}
		});
	//alert('texte2 = '+texte);
	}

start_script(31);
traiteCdM();
//============================ ZZ POST CODE ======================================

if( !document.getElementById('CdmButton') ) {

   var form = document.getElementsByName('ActionForm')[0];
   if(form.innerHTML.indexOf('RÉUSSI')!=-1) { // La connaissance des monstres a réussi

      // ITM Envoyer Automatiquement les données à la ZZ Database.
      var footer2=document.getElementById( 'footer2' );  
      var ts = footer2.innerHTML;
      var TimeStamp=ts.substr(ts.indexOf('GMT')-20, 19);
      TimeStamp=TimeStamp.replace(" ", "_");
      var data="&TimeStamp="+TimeStamp;
      data+="&TiD="+MZ_getValue("NUM_TROLL");
      data+="&cdm="+escape(cdm); // cdm est préparé par MZ
      MZ_appendNewScript(ZZDB+'/mzCdM.php?'+data);      
  }
}

function delBoutonBestiaire() {
 document.getElementsByName('as_Action')[0].parentNode.removeChild(document.getElementsByName('as_Action')[0].parentNode.childNodes[0]);
}

function setDBMsgZZ(msg) { 
  var totaltab=document.getElementsByTagName( 'table' );
  var myB=document.createElement('i');
  myB.appendChild(document.createTextNode(msg));
  myB.setAttribute("class", "titre5");
  totaltab[totaltab.length-4].appendChild( myB );
}

