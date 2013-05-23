/*********************************************************************************
*    This file is part of ZoryaZilla Fusion merged with mountyzilla              *
*********************************************************************************/
//============================ ZZ PRE CODE =======================================
/*********************************************************************************
*    This file is part of zoryazilla & mountyzilla - mod by Dab 2013-01-22       *
*********************************************************************************/
// Function setCarteGogo() has been removed from MZ original code for ZZ Fusion


// setCarteGogo(); remplacé par le nouveau script de felpath plus performant		// Via script des trouillots
//============================ ZZ POST CODE ======================================
function strim(str) {
	return str.replace(/\s+/g, '').replace(/\|+/g, '&');
}

function getOrdresGogo(){
    var nodes = document.evaluate("//text()[contains(.,'Gowap Apprivoisé')]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var data='&TypeData=oGogo';
	data=data+'&TiD='+numTroll;
	if (nodes.snapshotLength!=0) {
		var arrTR = document.getElementsByTagName('tr');
		var Lfollower=arrTR[1].childNodes[0].childNodes[1].childNodes[1].childNodes[1].childNodes[3].childNodes[3].childNodes[1].childNodes[0].childNodes[1].childNodes[4].childNodes[1].childNodes[1];
		var id_gowap=Lfollower.childNodes[0].childNodes[1].childNodes[2].childNodes[0].nodeValue;	
		id_gowap=id_gowap.slice(id_gowap.indexOf('[')+1, id_gowap.indexOf(']'));	
		data=data+'&Gogo='+id_gowap;
		var goto=""; var tresor="";
		var iGogo=2;
		while (iGogo<(Lfollower.childNodes.length)) {
			var order=Lfollower.childNodes[iGogo].childNodes[5].childNodes[0].nodeValue;
			if ((order.indexOf("Déplacement")>=0) && (goto=="")) goto="&"+strim(order.slice(order.indexOf("X")));
			if ((order.indexOf("Ramasser")>=0) && (tresor=="")) tresor="&Tresor="+order.slice(order.indexOf("trésor")+7);
			if (order.indexOf("Arrêt")>=0) break;
			iGogo=iGogo+2;
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

