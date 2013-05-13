/*********************************************************************************
*    This file is part of ZoryaZilla Fusion merged with mountyzilla              *
*********************************************************************************/
//============================ ZZ PRE CODE =======================================
/*********************************************************************************
*    This file is part of zoryazilla                                             *
*********************************************************************************/
// Function setCarteGogo() has been removed from MZ original code for ZZ Fusion


// setCarteGogo(); remplacé par le nouveau script de felpath plus performant		// Via script des trouillots
//============================ ZZ POST CODE ======================================
function strim(str) {
	return str.replace(/\s+/g, '').replace(/\|+/g, '&');
}

function getOrdresGogo(){
    var nodes = document.evaluate("//text()[contains(.,'Gowap Apprivoisé')]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    var nodes_order = document.evaluate("//tr[@class='mh_tdpage_fo']", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var data='&TypeData=oGogo';
	data=data+'&TiD='+numTroll;

	if (nodes.snapshotLength!=0) {
		var follower=nodes.snapshotItem(0).nodeValue;
		var id_gowap=trim(follower.substr(0,follower.indexOf(".")));
		
		data=data+'&Gogo='+id_gowap;
		var goto=""; var tresor="";	
		for (i=0; i<nodes_order.snapshotLength; i++) {		//poids porté : 

			var order=nodes_order.snapshotItem(i).childNodes[5].childNodes[0].nodeValue;
			if ((order.indexOf("Déplacement")>=0) && (goto=="")) goto="&"+strim(order.slice(order.indexOf("X")));
			if ((order.indexOf("Ramasser")>=0) && (tresor=="")) tresor="&Tresor="+strim(order.slice(order.indexOf("trésor")+7));
			if (order.indexOf("Arrêt")>=0) break;
		}
		
		data=data+goto+tresor;
		var totaltab=document.getElementsByTagName( 'table' );
		data+="&TimeStamp="+trim(totaltab[totaltab.length-1].childNodes[1].childNodes[0].childNodes[1].childNodes[3].nodeValue).substr(27,19).replace(" ", "_");	
		//alert(ZZDB+'/mzData.php?'+data);		
		MZ_appendNewScript(ZZDB+'/mzData.php?'+data);		

    }
}

function setDBMsgZZ(msg) { 
  var totaltab=document.getElementsByTagName( 'table' );
  var myB=document.createElement('i');
  myB.appendChild(document.createTextNode(msg));
  myB.setAttribute("class", "titre5");
  totaltab[totaltab.length-4].appendChild( myB );
}

//----------------------------------------------------------------------------------------------------
getOrdresGogo();		// ITM Mettre à jour ordres de Gogo

