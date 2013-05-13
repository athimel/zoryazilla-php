/*********************************************************************************
*    This file is part of zoryazilla                                             *
*********************************************************************************/

function getProfil2Gogo(){ 
    var nodes_g = document.evaluate("//text()[contains(.,'Gowap Apprivoisé')]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var nodes_w = document.evaluate("//text()[contains(.,'poids porté')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

	var data='&TypeData=p2Gogo';
	data=data+'&TiD='+numTroll;
	
	var totaltab=document.getElementsByTagName( 'table' );
	data+="&TimeStamp="+trim(totaltab[totaltab.length-1].childNodes[1].childNodes[0].childNodes[1].childNodes[3].nodeValue).substr(27,19).replace(" ", "_");	

	if (nodes_g.snapshotLength==nodes_w.snapshotLength) { 
		for (i=0; i<nodes_g.snapshotLength; i++) {		//poids porté : 

			var follower=nodes_g.snapshotItem(i).nodeValue;
			var id_gowap=trim(follower.substr(0,follower.indexOf(".")));
			weight=nodes_w.snapshotItem(i).nodeValue.substr(13);

			var Poids=0;
			if (weight.indexOf("heure")>0) {
				Poids+=60*Number(weight.substr(0, weight.indexOf("heure")));
				weight=weight.substr(weight.indexOf("et ")+3);
			}
			Poids+=Number(weight.substr(0, weight.indexOf("minute")));
			data+='&Gogo[]='+id_gowap+'&Poids[]='+Poids;
		}
		MZ_appendNewScript(ZZDB+'/mzData.php?'+data);		
	}
}

function setDBMsgZZ(msg) { 
  var totaltab=document.getElementsByTagName( 'table' );
  var myB=document.createElement('i');
  myB.appendChild(document.createTextNode(msg));
  myB.setAttribute("class", "titre5");
  totaltab[3].appendChild( myB );
}


function getGogo(){
    var nodes = document.evaluate("//td/text()[contains(.,'Aucun suivant actuellement!')]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var numtroll = MZ_getValue("NUM_TROLL");
	var matosData="";
	var data='&TypeData=Gogo';
	data=data+'&TiD='+numtroll;
	if (nodes.snapshotLength==0) {

		var arrTR = document.getElementsByTagName('tr');
		var Lfollower=arrTR[1].childNodes[0].childNodes[1].childNodes[1].childNodes[1].childNodes[3].childNodes[6].childNodes[1].childNodes[1];

		var iGogo=0;
		var typeMatos="";
		var matosId="";
		var matosName="";
		var matosDesc="";
		var matosEtat="";
		while (iGogo<(Lfollower.childNodes.length-2)) {

			var id_gowap=Lfollower.childNodes[iGogo].childNodes[1].childNodes[1].childNodes[1].childNodes[0].childNodes[1].childNodes[0].childNodes[0].nodeValue;
			if ((id_gowap.indexOf('Gowap')>0)||(id_gowap.indexOf('Golem')>0)) {
				if (id_gowap.indexOf('Gowap')>0) data=data+'&IdGogo[]='; else data=data+'&IdGolem[]=';		
				id_gowap=id_gowap.substring(0,id_gowap.indexOf('.'))*1;
				data=data+id_gowap;	
				var equipGogo=Lfollower.childNodes[iGogo+2].childNodes[0].childNodes[0].childNodes[1];	

				if ((equipGogo) && (equipGogo.childNodes.length>2)) {
					for (var i=0; i<=(equipGogo.childNodes.length-2); i+=2) {
                        if ( equipGogo.childNodes[i].childNodes[0].childNodes[0] == '[object XPCNativeWrapper [object HTMLSpanElement]]' )
						{ // nouveau type de matériel
 							typeMatos=equipGogo.childNodes[i].childNodes[0].childNodes[0].childNodes[0].nodeValue;
						} else {
                    				    
							if (equipGogo.childNodes[i].childNodes[1].childNodes.length==3) {
 								matosDesc = trim(equipGogo.childNodes[i].childNodes[1].childNodes[2].nodeValue );
 								matosId = matosDesc.slice(  matosDesc.indexOf("[")+1, matosDesc.indexOf("]") );
 								matosName = matosDesc.slice(  matosDesc.indexOf("]")+1, matosDesc.indexOf("(") );
 								matosDesc = matosDesc.substring( matosDesc.indexOf("(") );
								matosEtat = "[Non identifié]";
						    } else {
 								matosId = trim(equipGogo.childNodes[i].childNodes[1].childNodes[2].nodeValue );
 								matosId = matosId.substring( 1, matosId.length - 1 );
								matosName = trim(equipGogo.childNodes[i].childNodes[1].childNodes[3].childNodes[0].nodeValue); 	
	 							matosDesc = trim(trim(equipGogo.childNodes[i].childNodes[1].childNodes[4].nodeValue).substring(1));
								matosEtat = trim(matosDesc.slice(0, matosDesc.indexOf("-")));
 								matosDesc = trim(matosDesc.substring(matosDesc.indexOf("-")+1)).replace(/\t+/i, " ");							
							}
							matosData = matosData+'&Matos[]='+URLEncode( typeMatos + ' : ' + matosName );
							matosData = matosData+'&MiD[]='+matosId;
							matosData = matosData+'&Desc[]='+URLEncode( matosDesc );
							matosData = matosData+'&Etat[]='+URLEncode( matosEtat );
							matosData = matosData+'&Vu[]='+id_gowap;
 						}
					}
				}


			} else {
				id_gowap=id_gowap.substring(0,id_gowap.indexOf('.'))*1;
				data=data+'&IdFam[]='+id_gowap;			
			}	
			iGogo=iGogo+4;
		} 
    }

	//alert(ZZDB+'/mzData.php?'+data+matosData);


	var url = ZZDB+'/mzData.php';
	MZ_xmlhttpRequest({
				method: 'POST',
				url: url,
				headers : {
					'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
					'Accept': 'application/atom+xml,application/xml,text/xml',
					'Content-type':'application/x-www-form-urlencoded'
				},
				data: data+matosData,
				onload: function(responseDetails) {
					try
					{
 						 var totaltab=document.getElementsByTagName( 'table' );
						  var myB=document.createElement('i');
						  myB.appendChild(document.createTextNode(responseDetails.responseText));
						  myB.setAttribute("class", "titre5");
						  totaltab[3].appendChild( myB );
					}
					catch(e)
					{
						//alert(e+"\n"+url+"\n"+texte);
					}
				}
			});

}


//----------------------------------------------------------------------------------------------------

getProfil2Gogo();		// ITM Mettre à jour ordres de Gogo
getGogo();		// ITM Mettre à jour les id des Gogo
