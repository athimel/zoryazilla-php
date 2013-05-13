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


/******************************************************************
*                 mod from Mountyzilla by Dabihul                 *
******************************************************************/

var pageDispatcher = "http://mountypedia.free.fr/mz/cdmdispatcher.php";
//var pageDispatcher = "http://m2m-bugreport.dyndns.org/scripts/dev/cdmdispatcher.php";
//var pageCdmRecord = "http://nocmh.free.fr/scripts/cdmCollecteur.php";
var cdm = "";


function traiteCdM() { // check Dab
	var form = document.evaluate("//form[@name = 'ActionForm']",
			document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue

	// Teste si ce message du bot est un message de CdM
	if (!document.evaluate("//text()[contains(.,'fait partie')]",
			form, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue)
		return;
		
	cdm = document.evaluate("p/b/text()[contains(.,'fait partie')]",
			form, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.nodeValue + "\n";
	var tbody = document.evaluate("descendant::table/tbody",
			form, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	var intits = document.evaluate("descendant::td[@width = '25%']/descendant::b/text()",
			tbody, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var vals = document.evaluate("descendant::td[@width = '79%']/descendant::b/text()",
			tbody, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	for (var i=0 ; i<intits.snapshotLength ; i++) 
		cdm += intits.snapshotItem(i).nodeValue + " " + vals.snapshotItem(i).nodeValue + "\n";

	// On ins�re le bouton et un espace
	var button = insertButtonCdm('as_Action',sendInfoCDM);

	// pour mettre une estimation des PV restants
	var pv = vals.snapshotItem(1).nodeValue;
	if (pv.indexOf("entre") == -1)
		return;
	pv = getPVsRestants(pv,vals.snapshotItem(2).nodeValue);
	if (pv) {
		var blessure = document.evaluate("descendant::td[@width = '25%']/b/text()[contains(.,'Blessure')]/../../..",
				tbody, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		var tr = insertTr(blessure.nextSibling);
		appendTdText(tr, pv[0], true);
		appendTdText(tr, pv[1], true);
		}
	}


function sendInfoCDM() {
	MZ_setValue('CDMID',1 + (MZ_getValue('CDMID') * 1));
	var buttonCDM = this;
	//window.open(pageCdmRecord + "?cdm=" + escape(cdm) + "&source=mountyzilla/script_teubreu&forwardTo=" + pageDispatcher
	//		, 'popupCdm', 'width=400, height=240, toolbar=no, status=no, location=no, resizable=yes');
	MZ_xmlhttpRequest({
				method: 'GET',
				url: pageDispatcher+"?cdm="+escape(cdm),
				headers : {
					'User-agent': 'Mozilla/4.0 [FusionZoryaZilla] (compatible) Greasemonkey',
					'Accept': 'application/atom+xml,application/xml,text/xml'
					},
				onload: function(responseDetails) {
					buttonCDM.value=responseDetails.responseText;
					buttonCDM.disabled = true;
					}
				});
	}

start_script(31);
traiteCdM();
//============================ ZZ POST CODE ======================================

if( !document.getElementById('CdmButton') ) {
   var form = document.getElementsByName('ActionForm')[0];
   if(form.innerHTML.indexOf('R�USSI')!=-1) 
   { // La connaissance des monstres a r�ussi
      
      // ITM Envoyer Automatiquement les donn�es � la ZZ Database.
      var totaltab=document.getElementsByTagName( 'table' );  
      var ts=totaltab[totaltab.length-1].childNodes[1].childNodes[0].childNodes[1].childNodes[3].nodeValue;
	  var TimeStamp=ts.substr(ts.indexOf('GMT')-20, 19);
	  TimeStamp=TimeStamp.replace(" ", "_");
  	  var data="&TimeStamp="+TimeStamp;
      data+="&TiD="+MZ_getValue("NUM_TROLL");
      data+="&cdm="+escape(cdm); // cdm est pr�par� par MZ
      //alert(ZZDB+'/mzCdM.php?'+data);      
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
