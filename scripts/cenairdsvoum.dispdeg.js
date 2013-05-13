/*
function chargerScript(script) {
	MZ_appendNewScript(script);
}
*/

function isPage(url) {
	return currentURL.indexOf(MHURL + url) == 0;
}

function searchDoc(t) {
	return document.evaluate("//child::text()[contains(.,'"+t+"')]",document,null,9,null).singleNodeValue!=null;
}

function DisplayDeg(DAtt,DDeg,BonusDeg) {
	arrTR[4].childNodes[5].setAttribute('rowspan','10');
	var myTR=document.createElement('tr');
	myTR.setAttribute('class','mh_tdpage');
	var myTD=document.createElement('td');
	myTD.setAttribute('valign','top');
	myTD.setAttribute('class','mh_tdtitre');
	myTD.appendChild(document.createElement('b'));
	myTD.childNodes[0].appendChild(document.createTextNode('Distribution des Dégats :'));
	myTR.appendChild(myTD);
	myTD=document.createElement('td');
	myTD.setAttribute('valign','top');
	myTR.appendChild(myTD);
	var mySpan1=document.createElement('span');
	var mySpan2=document.createElement('span');
	var mySpan3=document.createElement('span');
	var mySpan4=document.createElement('span');
	var mySpan5=document.createElement('span');
	arrTR[15].parentNode.insertBefore(myTR,arrTR[15]);
	var newTable=document.createElement('table');
    var newTR=document.createElement('tr');
    var newTD0=document.createElement('td');
    var newTD1=document.createElement('td');
    var newTD2=document.createElement('td');
    var newTD3=document.createElement('td');
    
    newTR.style.fontWeight = 'bold';
    
	newTD0.appendChild(document.createTextNode("Type de dégats"));
    newTR.appendChild(newTD0);
    newTD1.appendChild(document.createTextNode("68%"));
    newTR.appendChild(newTD1);
    newTD2.appendChild(document.createTextNode("95%"));
    newTR.appendChild(newTD2);
    newTD3.appendChild(document.createTextNode("99%"));
    newTR.appendChild(newTD3);
    newTable.appendChild(newTR);
    var degsigma = (0.81649658 * Math.sqrt(DDeg));
    var degmoyen = (DDeg * 2) + BonusDeg;
    var degattsigma = (0.81649658 * Math.sqrt(Math.floor(DAtt / 2)));
    var colnumber = 4;
    
    /* Calcul dégats normaux */
    var newTR=document.createElement('tr');
    var newTD = new Array();
    for (var i = 0;i < colnumber; i++) {
        newTD[i] = document.createElement('td');
        if (i == 0) {
            newTD[0].appendChild(document.createTextNode("Dégats normaux..........................:"));
        }
        else {
            newTD[i].appendChild(document.createTextNode((degmoyen - Math.round(i * degsigma)) + "/"+ (degmoyen + Math.round(i * degsigma))));
        }
        newTR.appendChild(newTD[i]);
    }
    newTable.appendChild(newTR);
    
    /* Calcul dégats critiques ou CdB normal */
    var newTR=document.createElement('tr');
    var newTD = new Array();
    for (var i = 0;i < colnumber; i++) {
        newTD[i] = document.createElement('td');
        if (i == 0) {
			if(searchDoc('Butoir')) {
				newTD[0].appendChild(document.createTextNode("Dégats critiques ou CdB normal....:"));
				} else {
					newTD[0].appendChild(document.createTextNode("Dégats critiques..................:"));
				}
        }
        else {
            newTD[i].appendChild(document.createTextNode(((Math.floor(DDeg * 3 / 2) * 2 + BonusDeg) - Math.round(i * degsigma * Math.sqrt(1.5))) + "/"+ ((Math.floor(DDeg * 3 / 2) * 2 + BonusDeg) + Math.round(i * degsigma * Math.sqrt(1.5)))));
        }
        newTR.appendChild(newTD[i]);
    }
    newTable.appendChild(newTR);
    
	if(searchDoc('Butoir')) {
    /* Calcul CdB Critique */
		var newTR=document.createElement('tr');
		var newTD = new Array();
		for (var i = 0;i < colnumber; i++) {
			newTD[i] = document.createElement('td');
			if (i == 0) {
				newTD[0].appendChild(document.createTextNode("CdB critique..............................:"));
			}
			else {
				newTD[i].appendChild(document.createTextNode(((DDeg * 4 + BonusDeg) - Math.round(i * degsigma * Math.sqrt(2))) + "/"+ ((DDeg * 4 + BonusDeg) + Math.round(i * degsigma * Math.sqrt(2)))));
			}
			newTR.appendChild(newTD[i]);
		}
		newTable.appendChild(newTR);
	}
	
	if(searchDoc('Botte Secrète')) {
    /* Calcul BS normale */
		var newTR=document.createElement('tr');
		var newTD = new Array();
		for (var i = 0;i < colnumber; i++) {
			newTD[i] = document.createElement('td');
			if (i == 0) {
				newTD[0].appendChild(document.createTextNode("BS normale................................:"));
			}
			else {
				newTD[i].appendChild(document.createTextNode((((Math.floor(DAtt / 2) * 2) + Math.floor(BonusDeg / 2)) - Math.round(i * degattsigma)) + "/"+ (((Math.floor(DAtt / 2) * 2) + Math.floor(BonusDeg / 2)) + Math.round(i * degattsigma))));
			}
			newTR.appendChild(newTD[i]);
		}
		newTable.appendChild(newTR);
	
    /* Calcul BS critique */
		var newTR=document.createElement('tr');
		var newTD = new Array();
		for (var i = 0;i < colnumber; i++) {
			newTD[i] = document.createElement('td');
			if (i == 0) {
				newTD[0].appendChild(document.createTextNode("BS critique................................:"));
			}
			else {
				newTD[i].appendChild(document.createTextNode(((Math.floor((Math.floor(DAtt / 2)) * 3 / 2 ) * 2) + Math.floor(BonusDeg / 2) - Math.round(i * degattsigma * Math.sqrt(1.5))) + "/"+ ((Math.floor((Math.floor(DAtt / 2)) * 3 / 2 ) * 2) + Math.floor(BonusDeg / 2) + Math.round(i * degattsigma * Math.sqrt(1.5)))));
			}
			newTR.appendChild(newTD[i]);
		}
		newTable.appendChild(newTR);
	}

		if(searchDoc('Griffe du Sorcier')) {
    /* Calcul GdS normale */
		var newTR=document.createElement('tr');
		var newTD = new Array();
		for (var i = 0;i < colnumber; i++) {
			newTD[i] = document.createElement('td');
			if (i == 0) {
				newTD[0].appendChild(document.createTextNode("GdS normale...............................:"));
			}
			else {
				newTD[i].appendChild(document.createTextNode((((Math.floor(DDeg / 2) * 2) + Math.floor(BonusDeg / 2)) - Math.round(i * degattsigma)) + "/"+ (((Math.floor(DDeg / 2) * 2) + Math.floor(BonusDeg / 2)) + Math.round(i * degattsigma))));
			}
			newTR.appendChild(newTD[i]);
		}
		newTable.appendChild(newTR);
	
    /* Calcul GdS critique */
		var newTR=document.createElement('tr');
		var newTD = new Array();
		for (var i = 0;i < colnumber; i++) {
			newTD[i] = document.createElement('td');
			if (i == 0) {
				newTD[0].appendChild(document.createTextNode("GdS critique...............................:"));
			}
			else {
				newTD[i].appendChild(document.createTextNode(((Math.floor((Math.floor(DDeg / 2)) * 3 / 2 ) * 2) + Math.floor(BonusDeg / 2) - Math.round(i * degattsigma * Math.sqrt(1.5))) + "/"+ ((Math.floor((Math.floor(DDeg / 2)) * 3 / 2 ) * 2) + Math.floor(BonusDeg / 2) + Math.round(i * degattsigma * Math.sqrt(1.5)))));
			}
			newTR.appendChild(newTD[i]);
		}
		newTable.appendChild(newTR);
	}

	myTD.appendChild(newTable);
}

try
{
	if (isPage("MH_Play/Play_profil.php")) {
        
        var DDeg = deg;
        var DAtt = att;
        var BonusDeg = degbonus;
        DisplayDeg(DAtt,DDeg,BonusDeg);
        
		/*alert(listeComp);*/
        /*chargerScript("http://mountyzilla.tilk.info/scripts_0.9/complementaires/news_perso.js");*/
        }
}
catch(e)
{
	alert(e);
}