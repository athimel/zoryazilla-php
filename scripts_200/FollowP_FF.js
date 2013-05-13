/*********************************************************************************
*    This file is part of zoryazilla                                             *
*********************************************************************************/

function getProfilGogo(){
    var nodes = document.evaluate("//text()[contains(.,'Gowap Apprivoisé')]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var data='&TypeData=pGogo';
	data=data+'&TiD='+numTroll;

	if (nodes.snapshotLength!=0) {
		var arrTR = document.getElementsByTagName('tr');
		var Lfollower=arrTR[1].childNodes[0].childNodes[1].childNodes[1].childNodes[1].childNodes[3].childNodes[3].childNodes[1].childNodes[0].childNodes[1].childNodes[4].childNodes[0].childNodes[1];
		var id_gowap=trim(Lfollower.childNodes[2].childNodes[3].childNodes[1].childNodes[0].nodeValue);	
		var DLA=Lfollower.childNodes[4].childNodes[3].childNodes[7].childNodes[0].nodeValue;	
		var Poids=Lfollower.childNodes[4].childNodes[3].childNodes[7].childNodes[2].nodeValue;	
	    DLA=Number(DLA.slice(DLA.indexOf(":")+2, DLA.indexOf("heures")-1))*60+Number(DLA.slice(DLA.indexOf("et")+3, DLA.indexOf("minutes")-1));
	    Poids=Number(Poids.slice(Poids.indexOf(":")+2, Poids.indexOf("heures")-1))*60+Number(Poids.slice(Poids.indexOf("et")+3, Poids.indexOf("minutes")-1));
		data=data+'&Gogo='+id_gowap+'&DLA='+DLA+'&Poids='+Poids;
		var totaltab=document.getElementsByTagName( 'table' );
		data+="&TimeStamp="+trim(totaltab[totaltab.length-1].childNodes[1].childNodes[0].childNodes[1].childNodes[3].nodeValue).substr(27,19).replace(" ", "_");	
		MZ_appendNewScript(ZZDB+'/mzData.php?'+data);		
    }
}

function setDBMsgZZ(msg) { 
  var totaltab=document.getElementsByTagName( 'table' );
  var myB=document.createElement('i');
  myB.appendChild(document.createTextNode(msg));
  myB.setAttribute("class", "titre5");
  totaltab[totaltab.length-5].appendChild( myB );
}

//----------------------------------------------------------------------------------------------------
getProfilGogo();		// ITM Mettre à jour ordres de Gogo
