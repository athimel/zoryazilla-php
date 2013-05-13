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

/* v0.9.1d by Dabihul - 2013-05-04
 * nouvelle structure de page (bis)
 * ajustement pour r�solution PDA (pas de banni�re)
 * TODO
 * r�vision des formules de trimul --> sera trait� en externe dans MZ 1.0.1
 * ajouter la gestion des bm de PV et du vampi... pour le trimul aussi --> manque d'infos
 * (ou pas) g�rer les d�cumuls avec la page des BM --> trop accessoire, ne sera pas fait
 */

var hauteur = 50;
var bulleStyle = null;

var mainTab, mainTR, pvTR;

var posX, posY, posN;
var vue, vuetotale;
var pvbase, pvmax, pv, pvdispo;
var fatigue, bmfatigue;
// variables sp�ciales Kastars
var pva, minParPV, overDLA;
var inJour, inMois, inAn, inHr, inMin, inSec; // �dition manuelle lastDLA
var lastDLAZone, maxAMZone, cumulZone; // auto-refresh lastDLA
var lastDLA, DLAaccel;
//
var reg, regbonus, regmoy;
var att, attbonus, attbmm, attmoy;
var esq, esqbonus, esqmoy;
var deg, degbonus, degbmm, degmoy;
var arm, armbonus, armbmm, armmoy;
var rm, rmbonus, mm, mmbonus;
var nbattaques, bonusDegM, bonusAttM; // nbattaques obsol�te
var DLA, DLAsuiv, HeureServeur, DureeTour;
var dtb, pdm, bmt; // d�tails dur�e du tour (calcul pvdispo)
var NBjours;


/*********************************************************************************
*                                Fonctions utiles                                *
*********************************************************************************/

function arrondi(x) {
	return Math.ceil(x-0.5); // arrondi � l'entier inf�rieur le plus proche
	}

function resiste(Ddeg,bm) { // version naive mais compr�hensible ^^
	if (!bm)
		{ return Math.floor(Ddeg); }
	return Math.floor(Ddeg)+arrondi(bm/2);
	}

function getPortee(param) { // �a devrait �tre +12.25 non ?
	return Math.ceil( Math.sqrt( 2*param+10.75 )-3.5 );
	}

function retourAZero(fatig) {
	if (fatig < 5) {return fatig;}
	if (fatig < 7) {return 5;}
	if (fatig < 9) {return 6;}
	if (fatig < 12) {return 7;}
	if (fatig < 15) {return 8;}
	if (fatig < 19) {return 9;}
	if (fatig < 24) {return 10;}
	if (fatig < 30) {return 11;}
	if (fatig < 38) {return 12;}
	if (fatig < 48) {return 13;}
	if (fatig < 60) {return 14;}
	if (fatig < 75) {return 15;}
	if (fatig < 94) {return 16;}
	if (fatig < 118) {return 17;}
	if (fatig < 148) {return 18;}
	if (fatig < 185) {return 19;} // �vite de calculer dans 99% des cas
	var varfat = fatig; var raz = 0;
	while (varfat>0) {
		raz++;
		varfat = Math.floor(varfat/1.25);
		}
	return raz;
	}

function decumulPumPrem(bonus) {
	switch(bonus) {
	case 20:
		return 33;
	case 33:
		return 41;
	case 41:
		return 46;
	case 46:
		return 49;
	case 49:
		return 51;
	default:
		return 20;
		}
	}

function coefDecumul(i) {
	switch(i) {
	case 2:
		return 0.67;
	case 3:
		return 0.4;
	case 4:
		return 0.25;
	case 5:
		return 0.15;
	default:
		return 0.1;
		}
	}

function dureeHM(dmin) {
	var ret = '';
	dmin = Math.floor(dmin);
	if (dmin>59)
		{ ret = Math.floor(dmin/60)+'h'; }
	var mins = dmin%60;
	if (mins!=0)
		{ ret += (ret) ? addZero(mins)+'min' : mins+'min'; }
	return (ret) ? ret : '-';
	}


/*********************************************************************************
*                       Extraction / sauvegarde des donn�es                      *
*********************************************************************************/

function getNumbers(str) {
	var nbrs = str.match(/-?\d+/g);
	for (var i=0 ; i<nbrs.length ; i++)
		nbrs[i] = parseInt(nbrs[i]);
	return nbrs;
	}

function init() {
	mainTab = document.getElementsByClassName('mh_tdborder');
	mainTR = document.evaluate("./tbody/tr", mainTab[0], null, 7, null);
	pvTR = mainTR.snapshotItem(4).childNodes[3].childNodes[1].getElementsByTagName('tr');
	
	var Nbrs = [];
	var node = mainTR.snapshotItem(1).childNodes[3].childNodes[7];
	Nbrs['dtb'] = node.firstChild.nodeValue;		// dur�e tour de base
	if (node.childNodes.length<6) {
		Nbrs['bmt'] = '0_0';	// la ligne n'existe pas si pas de bm de temps
		Nbrs['pdm'] = node.childNodes[4].nodeValue;
		}
	else {
		Nbrs['bmt'] = node.childNodes[2].nodeValue;	// bm temps
		Nbrs['pdm'] = node.childNodes[6].nodeValue;	// poids du matos
		}
	Nbrs['pos'] = mainTR.snapshotItem(2).childNodes[3].firstChild.nodeValue;
	Nbrs['vue'] = mainTR.snapshotItem(2).childNodes[3].childNodes[3].nodeValue;
	Nbrs['niv'] = mainTR.snapshotItem(3).childNodes[3].firstChild.nodeValue;
	Nbrs['pva'] = pvTR[0].childNodes[1].childNodes[1].firstChild.nodeValue;
	Nbrs['pvm'] = pvTR[2].childNodes[1].firstChild.nodeValue;
	Nbrs['fat'] = pvTR[4].childNodes[1].firstChild.nodeValue;
	var caracs =  mainTR.snapshotItem(5).childNodes[3].childNodes[1].getElementsByTagName('tr');
	Nbrs['reg'] = caracs[0].textContent;
	Nbrs['att'] = caracs[1].textContent;
	Nbrs['esq'] = caracs[2].textContent;
	Nbrs['deg'] = caracs[3].textContent;
	Nbrs['arm'] = caracs[4].textContent;
	node = mainTR.snapshotItem(9).childNodes[3];
	Nbrs['rm'] = node.firstChild.nodeValue;
	Nbrs['mm'] = node.childNodes[2].nodeValue;
	for (var key in Nbrs)
		Nbrs[key] = getNumbers(Nbrs[key]);
	
	dtb = Nbrs['dtb'][0]*60+Nbrs['dtb'][1];
	bmt = Nbrs['bmt'][0]*60+Nbrs['bmt'][1];
	pdm = Nbrs['pdm'][0]*60+Nbrs['pdm'][1];
	
	posX = Nbrs['pos'][0];
	posY = Nbrs['pos'][1];
	posN = Nbrs['pos'][2];
	
	vue = Nbrs['vue'][0];
	vuetotale = Math.max(0, vue+Nbrs['vue'][1] );
	
	nivTroll = Nbrs['niv'][0];
	
	pv = Nbrs['pva'][0];
	pvbase = Nbrs['pvm'][0];
	pvmax = pvbase;
	if (Nbrs['pvm'].length>1) // s'il y a des BM de PV
		{ pvmax += Nbrs['pvm'][1]; }
	
	fatigue = Nbrs['fat'][0];
	bmfatigue = (Nbrs['fat'].length>1) ? Nbrs['fat'][1] : 0; // bmfat = 0 si pas de BM fat
	
	reg = Nbrs['reg'][0];
	// les Nbrs[...][1] contiennent les 3 ou les 6 de "D3" ou "D6"
	regbonus = Nbrs['reg'][2]+Nbrs['reg'][3];
	regmoy = 2*reg+regbonus;
	appendTdText(caracs[0], '(moyenne : '+regmoy+')');
	
	att = Nbrs['att'][0];
	attbonus = Nbrs['att'][2];
	attbmm = Nbrs['att'][3];
	attmoy = 3.5*att+attbonus+attbmm;
	appendTdText(caracs[1],'(moyenne : '+attmoy+')');
	
	esq = Nbrs['esq'][0];
	esqbonus = Nbrs['esq'][2]+Nbrs['esq'][3];
	esqmoy = 3.5*esq+esqbonus;
	appendTdText(caracs[2],'(moyenne : '+esqmoy+')');
	
	deg = Nbrs['deg'][0];
	degbonus = Nbrs['deg'][2];
	degbmm = Nbrs['deg'][3];
	degmoy = 2*deg+degbonus+degbmm;
	appendTdText(caracs[3],'(moyenne : '+degmoy+'/'+(2*Math.floor(1.5*deg)+degbonus+degbmm)+')');
	
	rm = Nbrs['rm'][0];
	rmbonus = Nbrs['rm'][1];
	rmTroll = rm+rmbonus;
	mm = Nbrs['mm'][0];
	mmbonus = Nbrs['mm'][1];
	mmTroll = mm+mmbonus;
	
	arm = Nbrs['arm'][0];
	if (Nbrs['arm'].length>4) { // s'il y a des D d'armure non activ�s
		armbonus = Nbrs['arm'][4];
		armbmm = Nbrs['arm'][5];
		}
	else {
		armbonus = Nbrs['arm'][2];
		armbmm = Nbrs['arm'][3];
		}
	armmoy = 2*arm+armbonus+armbmm;
	appendTdText(caracs[4],'(moyenne : '+armmoy+')');
	
	// PuM/Pr�M
	nodepum = document.evaluate("./td[2]/p/text()[contains(.,'Bonus')]", mainTR.snapshotItem(6), null, 7, null);
	if (nodepum.snapshotLength>0) {
		bonusAttM = getNumbers( nodepum.snapshotItem(0).nodeValue );
		bonusDegM = getNumbers( nodepum.snapshotItem(1).nodeValue );
		}
	
	// setDLA()
	var str = mainTR.snapshotItem(1).childNodes[3].childNodes[1].firstChild.nodeValue;
	DLA = new Date( StringToDate(str) );
	
	// setHeureServeur()
	var footerNode = document.getElementById('footer2');
	if (!footerNode) {return;}
	var str = document.evaluate(".//text()[contains(.,'Serveur')]", footerNode,
								null, 9, null).singleNodeValue.nodeValue;
	str = str.substring(str.indexOf('/')-2,str.lastIndexOf(':')+3);
	HeureServeur = new Date( StringToDate(str) );
	}

function saveProfil() {
	// Nota : voir plus tard si stocker les effets des comps/sorts directement ne serait pas plus rentable
	//MZ_setValue(numTroll+'.profilON',true); // pour remplacer isProfilActif ?
	//MZ_setValue('NIV_TROLL',nivTroll);
	MZ_setValue(numTroll+'.caracs.attaque',att);
	MZ_setValue(numTroll+'.caracs.attaque.bmp',attbonus);
	MZ_setValue(numTroll+'.caracs.attaque.bmm',attbmm);
	MZ_setValue(numTroll+'.caracs.esquive',esq);
	MZ_setValue(numTroll+'.caracs.esquive.bm',esqbonus);
	MZ_setValue(numTroll+'.caracs.esquive.nbattaques',nbattaques);
	MZ_setValue(numTroll+'.caracs.degats',deg);
	MZ_setValue(numTroll+'.caracs.degats.bmp',degbonus);
	MZ_setValue(numTroll+'.caracs.degats.bmm',degbmm);
	MZ_setValue(numTroll+'.caracs.regeneration',reg);
	MZ_setValue(numTroll+'.caracs.regeneration.bm',regbonus);
	MZ_setValue(numTroll+'.caracs.vue',vue);
	MZ_setValue(numTroll+'.caracs.vue.bm',vuetotale-vue);
	MZ_setValue(numTroll+'.caracs.pv',pv);
	MZ_setValue(numTroll+'.caracs.pv.base',pvbase);
	MZ_setValue(numTroll+'.caracs.pv.max',pvmax);
	MZ_setValue(numTroll+'.caracs.rm',rmTroll);
	MZ_setValue(numTroll+'.caracs.rm.bm',rmbonus);
	MZ_setValue(numTroll+'.caracs.mm',mmTroll);
	MZ_setValue(numTroll+'.caracs.mm.bm',mmbonus);
	MZ_setValue(numTroll+'.caracs.armure',arm);
	MZ_setValue(numTroll+'.caracs.armure.bmp',armbonus);
	MZ_setValue(numTroll+'.caracs.armure.bmm',armbmm);
	/*MZ_setValue(numTroll+'.bonus.AttM',armbmm);
	MZ_setValue(numTroll+'.bonus.DegM',armbmm);  // � venir*/
	MZ_setValue(numTroll+'.position.X',posX);
	MZ_setValue(numTroll+'.position.Y',posY);
	MZ_setValue(numTroll+'.position.N',posN);
	}

/*********************************************************************************
*                          Fonctions modifiant la page                           *
*********************************************************************************/

function setLieu() {
	if (mainTR.snapshotItem(0).childNodes.length>5) // si pas PDA, augmenter hauteur banni�re
		{ mainTR.snapshotItem(0).childNodes[5].setAttribute('rowspan',12); }
	var myTR = document.createElement('tr');
	myTR.setAttribute('class','mh_tdpage');
	var myTD = document.createElement('td');
	myTD.setAttribute('valign','top');
	myTD.setAttribute('class','mh_tdtitre');
	var bnode = document.createElement('b');
	bnode.appendChild(document.createTextNode('Lieux les plus proches :'));
	myTD.appendChild(bnode);
	myTR.appendChild(myTD);
	myTD = document.createElement('td');
	myTD.setAttribute('valign','top');
	var newA = document.createElement('a');
	newA.appendChild(document.createTextNode('Chez les Bricol\' Trolls'));
	newA.setAttribute('href',
		'http://trolls.ratibus.net/mountyhall/lieux.php?search=position&orderBy=distance&posx='
									+posX+'&posy='+posY+'&posn='+posN+'&typeLieu=3');
	newA.setAttribute('target','_blank');
	myTD.appendChild(newA);
	myTR.appendChild(myTD);
	insertBefore(mainTR.snapshotItem(3),myTR);
	}

function minParPVsac(fatig, bm) {
	var out = [];
	if (fatig>4)
		{ out[0] = Math.floor(120/( fatig*(1+Math.floor(fatig/10)) )); }
	else
		{ out[0] = 30; }
	if (bm && bm>0) {
		var totalfat=fatig+bm;
		if (totalfat>4)
			{ out[1] = Math.floor(120/( totalfat*(1+Math.floor(totalfat/10)) )); }
		else
			{ out[1] = 30; } // inutile avec bmfat >= 15 mais bon
		}
	return out;
	}

function toInt(str) {
	str = parseInt(str);
	return (str) ? str : 0;
	}

function saveLastDLA() { // pour les calculs d'AM max
	var str = addZero(toInt(inJour.value))+'/'+addZero(toInt(inMois.value))+'/'+toInt(inAn.value)+' '
			+addZero(toInt(inHr.value))+':'+addZero(toInt(inMin.value))+':'+addZero(toInt(inSec.value));
	lastDLA = new Date( StringToDate(str) );
	MZ_setValue(numTroll+'.DLA.ancienne', str);
	lastDLAZone.innerHTML = '';
	var myB = document.createElement('b');
	myB.addEventListener('click', inputMode, false);
	appendText(myB, str);
	lastDLAZone.appendChild(myB);
	refreshAccel();
	}

function inputMode() {
	var date;
	if (lastDLA)
		{ date = new Date( lastDLA ); }
	else
		{ date = new Date( DLAaccel ); }
	lastDLAZone.innerHTML = '';
	inJour = appendTextbox(lastDLAZone, 'text', 'inJour', 1, 2, date.getDate() );
	appendText(lastDLAZone, '/');
	inMois = appendTextbox(lastDLAZone, 'text', 'inMois', 1, 2, 1+date.getMonth() );
	appendText(lastDLAZone, '/');
	inAn = appendTextbox(lastDLAZone, 'text', 'inAn', 3, 4, date.getFullYear() );
	appendText(lastDLAZone, ' - ');
	inHr = appendTextbox(lastDLAZone, 'text', 'inHr', 1, 2, date.getHours()+'' );
	appendText(lastDLAZone, ':');
	inMin = appendTextbox(lastDLAZone, 'text', 'inMin', 1, 2, date.getMinutes()+'' );
	appendText(lastDLAZone, ':');
	inSec = appendTextbox(lastDLAZone, 'text', 'inSec', 1, 2, date.getSeconds()+'' );
	appendText(lastDLAZone, ' - ');
	var myA = document.createElement('a');
	myA.addEventListener('click', saveLastDLA, false);
	appendText(myA, '[Enregistrer]', true)
	lastDLAZone.appendChild(myA);
	}


function setAccel() {
	var race = mainTR.snapshotItem(0).childNodes[3].childNodes[4].nodeValue;
	if (race.indexOf('Kastar')==-1)
		{ return; }
	
	/* Cr�ation d'une nouvelle ligne du profil sp�ciale AM */
	var TRfat = document.createElement('tr');
	TRfat.setAttribute('class','mh_tdpage');
	var myTD = document.createElement('td');
	myTD.setAttribute('class','mh_tdtitre');
	myTD.setAttribute('valign','top');
	appendText(myTD,'Fatigue et AM',true);
	TRfat.appendChild(myTD);
	myTD = document.createElement('td');
	TRfat.appendChild(myTD);
	insertBefore(mainTR.snapshotItem(5),TRfat);
	
	/* R�cup�ration des donn�es */
	overDLA = (HeureServeur>DLA.getTime()+300000);
	fatigue = (overDLA) ? Math.floor(fatigue/1.25) : fatigue ;
	var varfat = fatigue;
	var BMfrais = false;
	var varbm = [];
	if (bmfatigue>0) { // r�cup�ration des BM de fatigue depuis la page des BM
		if (MZ_getValue(numTroll+'.bm.fatigue')) {
			var listefat = MZ_getValue(numTroll+'.bm.fatigue').split(';');
			listefat.pop();
			var tour = 0;
			for (var i=0 ; i<listefat.length ; i++) {
				var nbrs = listefat[i].match(/\d+/g); // [tour,fatigue]
				while (tour<=parseInt(nbrs[0])) {
					varbm[tour]=parseInt(nbrs[1]);
					tour++;
					}
				}
			}
		if (varbm[0]==bmfatigue)
			{BMfrais = true;}
		}
	else
		{BMfrais = true;}
	if (!BMfrais && bmfatigue>0) { // si les BM n'ont pas �t� rafra�chis
		if (bmfatigue==15)
			{ varbm[0]=15;varbm[1]=15;varbm[2]=15; }
		else
			{ varbm[0]=30;varbm[1]=30;varbm[2]=15; }
		}
	if (overDLA) // d�calage BM en overDLA
		{ varbm.shift(); }
	var minppv = minParPVsac(varfat,varbm[0]);
	minParPV = (varbm[0]==undefined) ? minppv[0] : minppv[1];
	
	/* Tableau des fatigues et accel futures */
	if (fatigue>0 || varbm[0]>0) {
		var myTAB = document.createElement('table');
		myTAB.setAttribute('class','mh_tdborder');
		myTAB.setAttribute('border','0');
		myTAB.setAttribute('cellspacing','1');
		myTAB.setAttribute('cellpadding','1');
		myTAB.setAttribute('style','text-align:center');
		myTD.appendChild(myTAB);
		
		var lignetour = '<td align="left">Tour :</td>';
		var lignefat = '<td align="left" class="mh_tdtitre"><b>Fatigue :</b></td>';
		var lignemin = '<td align="left" class="mh_tdtitre"><b>1 PV =</b></td>';
		var col=0;
		while (col<9 && (varfat>0 || varbm[col])) {
			if (col==0) {
				if (overDLA)
					{ lignetour += '<td><i>� activer</i></td>'; }
				else
					{ lignetour += '<td>En cours</td>'; }
				}
			else
				{ lignetour += '<td>&nbsp;&nbsp;+'+col+'&nbsp;&nbsp;</td>'; }
			if (varbm[col]) {
				if (BMfrais || (!overDLA && col==0)) {
					lignefat += '<td>'+varfat+'+'+varbm[col]+'</td>' ;
					lignemin += '<td>'+minppv[1]+'\'</td>';
					}
				else {
					lignefat +=  '<td>'+varfat+'+'+varbm[col]+' (?)</td>' ;
					lignemin += '<td>'+minppv[1]+'\' ('+minppv[0]+'\')</td>';
					}
				}
			else {
				lignefat += '<td>'+varfat+'</td>' ;
				lignemin += '<td>'+minppv[0]+'\'</td>';
				}
			col++;
			varfat = Math.floor(varfat / 1.25);
			minppv = minParPVsac(varfat,varbm[col]);
			}
		if (varfat>1 || (varfat==1 && !overDLA)) {
			lignetour += '<td><b>&nbsp; ... &nbsp;</b></td>';
			lignefat += '<td>-</td>';
			lignemin += '<td>-</td>';
			}
		col = (overDLA) ? Math.max(retourAZero(fatigue)-1,col) : Math.max(retourAZero(fatigue),col);
		lignetour += '<td>&nbsp;&nbsp;+'+col+'&nbsp;&nbsp;</td>';
		lignefat += '<td>0</td>';
		lignemin += '<td>30\'</td>';
		myTAB.innerHTML = '<tr class="mh_tdtitre" style="font-weight:bold">'+lignetour+'</tr>'
					+ '<tr class="mh_tdpage">'+lignefat+'</tr>'
					+ '<tr class="mh_tdpage">'+lignemin+'</tr>';

		if (!BMfrais && bmfatigue) { // si les BM n'ont pas �t� rafra�chis
			appendText(myTD, '/!\\ Visitez la page des Bonus/Malus pour mettre � jour votre fatigue. /!\\', true);
			appendBr(myTD);
			}
		appendBr(myTD);
		}
	
	if (pv<=0) {
		appendText(myTD, 'Aucun calcul possible : vous �tes mort voyons !');
		return;
		}

	/* Setup lastDLAZone */
	if (overDLA) { // bypass des infos de "menu_FF.js" en cas d'overDLA
		DLAaccel = new Date( DLAsuiv );
		lastDLA = new Date( DLA );
		MZ_setValue(numTroll+'.DLA.ancienne', DateToString(DLA) );
		pva = Math.min(pv+regmoy,pvmax);
		appendText(myTD, '/!\\ Votre DLA est d�pass�e, calculs bas�s sur des estimations. /!\\', true);
		appendBr(myTD);
		}
	else {
		DLAaccel = new Date( DLA );
		pva = pv;
		if (MZ_getValue(numTroll+'.DLA.ancienne'))
			{ lastDLA = new Date( StringToDate(MZ_getValue(numTroll+'.DLA.ancienne')) ); }
		else
			{ lastDLA = false; }
		}
	appendText(myTD, 'Derni�re DLA enregistr�e : ');	
	lastDLAZone = document.createElement('span');
	lastDLAZone.style.cursor = 'pointer';
	var myB = document.createElement('b');
	myB.addEventListener('click', inputMode, false);
	lastDLAZone.appendChild(myB);
	myTD.appendChild(lastDLAZone);
	if (lastDLA)
		{ appendText(myB, DateToString(lastDLA) ); }
	else
		{ appendText(myB, 'aucune'); }
	appendBr(myTD);
	
	/* Setup maxAMZone et cumulZone */
	appendText(myTD, 'Acc�l�ration maximale possible : ');
	maxAMZone = document.createElement('b');
	myTD.appendChild(maxAMZone);
	appendBr(myTD);
	cumulZone = document.createElement('span');
	myTD.appendChild(cumulZone);

	refreshAccel();
	}

function refreshAccel() {
	/* Acc�l�ration pour cumul instantan� */
	if (lastDLA) {
		pvsmax = Math.min(pva-1 , Math.ceil( Math.floor((DLAaccel-lastDLA)/60000)/minParPV ));
		maxAMZone.innerHTML = pvsmax + ' PV';
		}
	else {
		pvsmax = pva-1;
		maxAMZone.innerHTML = 'inconnue'
		}
	// pvAccel = (nb de minutes avant DLA (arrondi sup) / nb de min/PV) , arrondi sup
	var pvs = Math.ceil( Math.ceil((DLAaccel-HeureServeur)/60000) / minParPV );
	cumulZone.innerHTML = '';
	if (pvs<=pvsmax) {
		appendText(cumulZone, 'Vous devez acc�l�rer d\'au moins ');
		appendText(cumulZone, pvs+' PV', true);
		appendText(cumulZone, ' pour activer imm�diatement un nouveau tour.');
		if (pvs!=1) {
			var gainSec = Math.floor((DLAaccel-HeureServeur)/1000)-(pvs-1)*60*minParPV;
			appendText(cumulZone, ' ('+(pvs-1)+' PV dans '+Math.floor(gainSec/60)+'min'+addZero(gainSec%60)+'s)');
			}
		}
	else {
		var avantDLA = new Date( DLAaccel-HeureServeur-pvsmax*minParPV*60000 );
		appendText(cumulZone, 'Apr�s votre acc�l�ration maximale, il vous faudra encore attendre '
						+ dureeHM(avantDLA/60000)
						+' avant de r�activer.');
		}
	}

function setInfoDateCreation() {
	var node = mainTR.snapshotItem(0).childNodes[3].childNodes[6];
	var dateC = node.nodeValue;
	dateC = dateC.substring(dateC.indexOf('(')+1,dateC.indexOf(')'));
	dateC = new Date( StringToDate(dateC) );
	NBjours = Math.floor((HeureServeur-dateC)/86400000)+1;
	if (NBjours!=1)
		{ node.nodeValue += ' ('+NBjours+' jours dans le hall)'; }
	else
		{ node.nodeValue += ' (Bienvenue � toi pour ton premier jour dans le hall)'; }
	}

function setNextDLA() {
	var node = mainTR.snapshotItem(1).childNodes[3].childNodes[8].childNodes[1];
	var nbrs = node.firstChild.nodeValue.match(/\d+/g);
	DureeTour = nbrs[0]*3600000+nbrs[1]*60000;
	var DLAsuivMSec = DLA.getTime()+DureeTour; var loupes = 0;
	while (DLAsuivMSec < HeureServeur) {
		DLAsuivMSec += DureeTour;
		loupes++;
		}
	DLAsuiv = new Date( DLAsuivMSec );
	appendBr(node);
	appendText(node, '---> Prochaine DLA (estim�e)............: '+DateToString(DLAsuiv) );
	if (loupes==1)
		{ node.nextSibling.nodeValue = ' (Vous avez manqu� votre dernier tour)'; }
	else if (loupes>1)
		{ node.nextSibling.nodeValue = ' (Vous avez manqu� vos '+loupes+' derniers tours)'; }
	}

function setInfosPxPi() {
	if (nivTroll==60)
		{ return; }
	
	/* Extraction des donn�es */
	var TDexp = mainTR.snapshotItem(3).childNodes[3];
	var node = TDexp.firstChild;
	var str = node.nodeValue;
	var pi_tot = parseInt(str.match(/\d+/g)[1]);
	var nbrs = getNumbers(TDexp.childNodes[2].nodeValue);
	var px = nbrs[0]+nbrs[1];
	var pi_nextLvl = nivTroll*(nivTroll+3)*5;
	var px_ent = 2*nivTroll;
	if (nivTroll<3) {px_ent=Math.max(px_ent,Math.min(px,5));}
	var nb_ent = Math.ceil((pi_nextLvl-pi_tot)/px_ent);
	
	/* Modification ligne "Niveau" */
	str = str.substring(0,str.length-1)+' | Niveau '+(nivTroll+1)+' : '+pi_nextLvl
		+' PI => '+nb_ent+' entra�nement';
	if (nb_ent>1) {str += 's';}
	str += ')';
	var span = document.createElement('span');
	span.setAttribute('title',(Math.round(10*(pi_tot+px)/NBjours)/10)+' PI par jour');
	appendText(span,str);
	TDexp.replaceChild(span,node);
	
	/* Ajout ligne PX entrainement */
	insertBr(TDexp.childNodes[3]);
	node = document.createElement('i');
	if (px<px_ent)
		{ appendText(node,'Il vous manque '+(px_ent-px)+' PX pour vous entra�ner.'); }
	else
		{ appendText(node,'Entra�nement possible. Il vous restera '+(px-px_ent)+' PX.'); }
	insertBefore(TDexp.childNodes[4],node);
	}

function setInfosPV() { // pour AM et Sacro
	var texte = '1 PV de perdu = +'+Math.floor(250/pvmax)+' min';
	var sec = Math.floor(15000/pvmax)%60;
	if (sec!=0) {texte += ' '+sec+' sec';}
	
	var lifebar = pvTR[1].childNodes[1].firstChild;
	if (lifebar)
		{ lifebar.setAttribute('title',texte); }

	if (pv<=0 || bmt+pdm>=0) {return;}
	// pvmin0malus = pvm + ceiling(pvm/250*(bmt+pdm))
	pvdispo = pv-pvmax-Math.ceil((bmt+pdm)*pvmax/250);
	var td = appendTd(pvTR[3]);
	var span = document.createElement('span');
	span.setAttribute('title',texte);
	var inode = document.createElement('i');
	if (pvdispo>0)
		{ texte = 'Vous pouvez encore perdre '+pvdispo+' PV sans malus de temps.'; }
	else if (pvdispo<0)
		{ texte = 'Il vous manque '+(-pvdispo)+' PV pour ne plus avoir de malus de temps.'; }
	else
		{ texte =''; }
	inode.appendChild(document.createTextNode(texte));
	span.appendChild(inode);
	td.appendChild(span);
	}

function setStabilite() {
	var node = mainTR.snapshotItem(5).childNodes[3].childNodes[2];
	appendBr(node);
	appendText(node,'- Stabilit�..........: '+Math.floor(2*(esq+reg)/3)+' D6 '+aff(esqbonus)
				+' (moyenne : '+arrondi(3.5*Math.floor(2*(esq+reg)/3)+esqbonus)+')');
	}

function setCurrentEsquive() {
	var pnode = mainTR.snapshotItem(6).childNodes[3].firstChild;
	var attmod = pnode.childNodes[3].nodeValue.match(/\d+/);
	pnode.childNodes[3].nodeValue += ' (moyenne attaque : '+Math.max(attmoy-3.5*attmod,attbonus+attbmm,0)+')';
	var esqmod = pnode.childNodes[5].nodeValue.match(/\d+/);
	pnode.childNodes[5].nodeValue += ' (moyenne esquive : '+Math.max(esqmoy-3.5*esqmod,esqbonus,0)+')';
	nbattaques = parseInt(esqmod);
	var armmod = pnode.childNodes[7].nodeValue.match(/\d+/);
	pnode.childNodes[7].nodeValue += ' (moyenne armure : '+Math.max(armmoy-2*armmod,armbonus+armbmm,0)+')';
	}

function setRatioKillDeath() {
	var node = document.evaluate("./td[2]/p[contains(./text(),'Adversaires tu�s')]",
								mainTR.snapshotItem(6), null, 9, null).singleNodeValue;
	if (!node) {return;}
	var killnode = node.firstChild;
	var kill = getNumbers( killnode.nodeValue );
	var span = document.createElement('span');
	span.setAttribute('title','Un kill tous les '+(Math.round(10*NBjours/kill)/10)+' jours');
	appendText(span, killnode.nodeValue);
	node.replaceChild(span,killnode);
	var deathnode = node.childNodes[2];
	var death = getNumbers( deathnode.nodeValue );
	if (death!=0) {
		span = document.createElement('span');
		span.setAttribute('title','Une mort tous les '+(Math.round(10*NBjours/death)/10)+' jours');
		appendText(span, deathnode.nodeValue);
		node.replaceChild(span,deathnode);
		appendBr(node);
		appendText(node, 'Rapport meurtres/d�c�s : '+Math.floor((kill/death)*1000)/1000);
		}
	}

function setTotauxMagie() {
	var TDmag = mainTR.snapshotItem(9).childNodes[3];
	var span = document.createElement('span');
	span.setAttribute('title',
		(Math.round(10*rm/NBjours)/10)+' ('+(Math.round(10*rmTroll/NBjours)/10)+') points de RM par jour | '
		+(Math.round(10*rm/nivTroll)/10)+' ('+(Math.round(10*rmTroll/nivTroll)/10)+') points de RM par niveau'
		);
	appendText(span, TDmag.firstChild.nodeValue+' (Total : '+rmTroll+')');
	TDmag.replaceChild(span,TDmag.firstChild);
	
	span = document.createElement('span');
	span.setAttribute('title',
		(Math.round(10*mm/NBjours)/10)+' ('+(Math.round(10*mmTroll/NBjours)/10)+') points de MM  par jour | '
		+(Math.round(10*mm/nivTroll)/10)+' ('+(Math.round(10*mmTroll/nivTroll)/10)+') points de MM par niveau'
		);
	appendText(span, TDmag.childNodes[2].nodeValue+' (Total : '+mmTroll+')');
	TDmag.replaceChild(span,TDmag.childNodes[2]);
	}

function setPourcentagesTotaux() {
	removeAllSortComp();
	var compTabs = document.evaluate("./tbody/tr/td/table", mainTab[1], null, 7, null);
	if (!compTabs) {return;}
	var listeComp = compTabs.snapshotItem(0);
	var listeSort = compTabs.snapshotItem(1);
	var titres = document.evaluate("./tbody/tr/td/b/text()", mainTab[1], null, 7, null);
	titres.snapshotItem(0).nodeValue += ' (Total : '+setInfosDesBulles(listeComp,'competences')+'%)';
	titres.snapshotItem(1).nodeValue += ' (Total : '+setInfosDesBulles(listeSort,'sortileges')+'%)';
	}


/*********************************************************************************
*              Textes des popups pour les comp�tences et sortil�ges              *
*********************************************************************************/

function competences(comp,niveau) {
	var texte = '';
	if (comp.indexOf('Acceleration du Metabolisme')!=-1 && minParPV!=null) {
		texte = '<b>1</b> PV = <b>'+minParPV+'</b> minute';
		if (minParPV>1) {texte += 's';}
		if (overDLA) {texte += '<br/><i>(Votre DLA est d�pass�e.)</i>';}
		}
	else if (comp.indexOf('Attaque Precise')!=-1) {
		for (var i=Math.min(niveau+1,5) ; i>=1 ; i--) {
			var conn = getSortComp(comp,i);
			var ok = true;
			for (var j=i+1 ; j<=niveau ; j++) {
				if (conn<=getSortComp(comp,j)) {
					ok = false;
					break;
					}
				}
			if (ok) {
				if (i>niveau) {texte += '<i>';}
				texte += 'Attaque (niveau '+i+') : <b>'
					+ Math.min( Math.floor(att*1.5) , att+3*i )+'</b> D6 '+aff(attbonus+attbmm)
					+ ' => <b>'+(arrondi(3.5*Math.min( Math.floor(1.5*att) , att+3*i ))+attbonus+attbmm)
					+ '</b><br/>';
				if (i>niveau) {texte += '</i>';}
				}
			}
		texte += 'D�g�ts : <b>'+deg+'</b> D3 '+aff(degbonus+degbmm)
			+ ' => <b>'+degmoy+'/'+(degmoy+2*Math.floor(deg/2))+'</b>';
		}
	else if (comp.indexOf('Balayage')!=-1) {
		texte = 'D�stabilisation : <b>'+att+'</b> D6 '+aff(attbonus+attbmm)
			+ ' => <b>'+(arrondi(3.5*att)+attbonus+attbmm)+'</b><br/>'
			+ 'Effet : <b>Met � terre l\'adversaire</b>';
		}
	else if (comp.indexOf('Balluchonnage')!=-1)
		{ texte = 'Un beau noeud �vite souvent de mauvaises surprises...'; }
	else if (comp.indexOf('Bidouille')!=-1) {
		texte = 'Bidouiller un tr�sor permet de compl�ter le nom d\'un objet de votre inventaire '
			+ 'avec le texte de son choix.';
		}
	else if (comp.indexOf('Botte Secrete')!=-1) {
		texte = 'Attaque : <b>'+Math.floor(att/2)+'</b> D6 '+aff( Math.floor((attbonus+attbmm)/2) )
			+ ' => <b>'+arrondi(3.5*Math.floor(att/2)+Math.floor((attbonus+attbmm)/2))+'</b><br/>'
			+ 'D�g�ts : <b>'+Math.floor(att/2)+'</b> D3 '+aff( Math.floor((degbonus+degbmm)/2) )
			+ ' => <b>'+(2*Math.floor(att/2)+Math.floor((degbonus+degbmm)/2))
			+ '/'+(2*Math.floor(1.5*Math.floor(att/2))+Math.floor((degbonus+degbmm)/2))+'</b>';
		}
	else if (comp.indexOf('Camouflage')!=-1) {
		var camou = getSortComp('Camouflage',1);
		texte =  'Pour conserver son camouflage, il faut r�ussir un jet sous:<br/>'
			+ '<i>D�placement :</i> <b>'+Math.floor(0.75*camou)+'%</b><br/>'
			+ '<i>Attaque :</i> <b>perte automatique</b>.<br/>'
			+ '<i>Projectile Magique :</i> <b>'+Math.floor(0.25*camou)+'%</b>';
		}
	else if (comp.indexOf('Charger')!=-1) {
		var portee = Math.min(getPortee(reg+Math.floor(pv/10))-Math.floor((fatigue+bmfatigue)/5),vuetotale);
		if (pv<=0)
			{ return '<i>On ne peut charger personne quand on est mort !</i>'; }
		if (portee<1)
			{ return '<b>Impossible de charger</b>'; }
		else {
			texte = 'Attaque : <b>'+att+'</b> D6 '+aff(attbonus+attbmm)
				+ ' => <b>'+attmoy+'</b><br/>'
				+ 'D�g�ts : <b>'+deg+'</b> D3 '+aff(degbonus+degbmm)
				+ ' => <b>'+degmoy+'/'+(degmoy+2*Math.floor(deg/2))+'</b>'
				+ '<br/>Port�e : <b>'+portee+'</b> case';
			if (portee>1) {texte += 's';}
			}
		}
	else if (comp.indexOf('Connaissance des Monstres')!=-1) {
		texte = 'Port�e horizontale : <b>'+vuetotale+'</b> case';
		if (vuetotale>1) {texte += 's';}
		texte += '<br/>Port�e verticale : <b>'+Math.ceil(vuetotale/2)+'</b> case';
		if (vuetotale>2) {texte += 's';}
		}
	else if (comp.indexOf('Construire un Piege')!=-1) {
		texte = 'D�gats du pi�ge � feu : <b>'+Math.floor((esq+vue)/2)+'</b> D3'
			+ ' => <b>'+2*Math.floor((esq+vue)/2)+' ('+resiste((esq+vue)/2)+')</b>';
		}
	else if (comp.indexOf('Contre-Attaquer')!=-1) {
		texte = 'Attaque : <b>'+Math.floor(att/2)+'</b> D6 '+aff(Math.floor((attbonus+attbmm)/2))
			+ ' => <b>'+arrondi(3.5*Math.floor(att/2)+Math.floor((attbonus+attbmm)/2))+'</b><br/>'
			+ 'D�g�ts : <b>'+deg+'</b> D3 '+aff(degbonus+degbmm)
			+ ' => <b>'+degmoy+'/'+(degmoy+2*Math.floor(deg/2))+'</b>';
		}
	else if (comp.indexOf('Coup de Butoir')!=-1) {
		texte = 'Attaque : <b>'+att+'</b> D6 '+aff(attbonus+attbmm)
			+ ' => <b>'+attmoy+'</b>';
		for (var i=Math.min(niveau+1,5) ; i>=1 ; i--) {
			var conn = getSortComp(comp,i);
			var ok = true;
			for (var j=i+1 ; j<=niveau ; j++) {
				if (conn<=getSortComp(comp,j)) {
					ok = false;
					break;
					}
				}
			if (ok) {
				if (i>niveau) {texte += '<i>';}
				texte += '<br/>D�g�ts (niveau '+i+') : <b>'
					+ Math.min(Math.floor(1.5*deg),deg+3*i)+'</b> D3 '+aff(degbonus+degbmm)
					+ ' => <b>'+( degmoy + 2*Math.min(Math.floor(deg/2),3*i) )
					+ '/'+( degmoy + 2*Math.min(Math.floor(deg/2),3*i) + 2*Math.floor(deg/2))+'</b>';
				if (i>niveau) {texte += '</i>';}
				}
			}
		}
	else if (comp.indexOf('Course')!=-1)
		{ texte = 'D�placement gratuit : <b>'+Math.floor(getSortComp('Course',1)/2)+' %</b> de chance'; }
	else if (comp.indexOf('Deplacement Eclair')!=-1)
		{ texte = 'Permet d\'�conomiser <b>1</b> PA par rapport au d�placement classique'; }
	else if(comp.indexOf('Golemologie') != -1) {
		texte = 'Cette comp�tence permet de fabriquer un golem � partir d\'un bric-�-brac d\'objets plus ou moins utiles et d\'un minerai taill� contenant toute l\'intelligence de celui-ci, mais permet aussi de pouvoir leur donner des instructions pr�cises.<hr/>'; 
		texte += '<b>Le golem de Cuir</b> : ce golem poss�de de nombreuses poches. Il est donc capable de tenir plus d\'un objet � la fois.';
		texte += '<b>Le golem de M�tal</b> : le golem de combat par excellence.';
		texte += '<b>Le golem de Mithril</b> : La version du golem de m�tal pour les tr�lls richissimes.';
		texte += '<b>Le golem de Papier</b> : ce golem est aussi r�sistant qu\'un gobelin venant de na�tre, mais par contre, c\'est le seul capable de communiquer avec son propri�taire.';
    } else if (comp.indexOf('Dressage')!=-1)
		{ texte = 'Le dressage permet d\'apprivoiser un gowap redevenu sauvage ou un gnu sauvage.'; }
	else if (comp.indexOf('Ecriture Magique')!=-1) {
		texte = 'R�aliser la copie d\'un sortil�ge apr�s en avoir d�couvert la formule n�cessite de '
			+ 'r�unir les composants de cette formule, d\'obtenir un parchemin vierge sur lequel �crire, '
			+ 'et de r�cup�rer un champignon ad�quat pour confectionner l\'encre.';
		}
	else if (comp.indexOf('Frenesie')!=-1) {
		texte = 'Attaque : <b>'+att+'</b> D6 '+aff(attbonus+attbmm)
			+ ' => <b>'+attmoy+'</b><br/>'
			+ 'D�g�ts : <b>'+deg+'</b> D3 '+aff(degbonus+degbmm)
			+ ' => <b>'+degmoy+'/'+(degmoy+2*Math.floor(deg/2))+'</b>';
		}
	else if (comp.indexOf('Grattage')!=-1)
		{ texte = 'Permet de confectionner un Parchemin Vierge � partir de composants et de Gigots de Gob\'.'; }
	else if (comp.indexOf('Hurlement Effrayant')!=-1)
		{ texte = 'Fait fuir un monstre si tout se passe bien.<br/>Lui donne de gros bonus sinon.'; }
	else if (comp.indexOf('Identification des Champignons')!=-1) {
		texte = 'Port�e horizontale : <b>'+Math.ceil(vuetotale/2)+'</b> case';
		if (vuetotale>2) {texte += 's';}
		texte += '<br/>Port�e verticale : <b>'+Math.ceil(vuetotale/4)+'</b> case';
		if (vuetotale>4) {texte += 's';}
		}
	else if (comp.indexOf('Insultes')!=-1)
		{ texte = 'Port�e horizontale : <b>'+Math.min(vuetotale,1)+'</b> case'; }
	else if (comp.indexOf('interposer')!=-1) {
		texte = 'Jet de r�flexe : <b>'+Math.floor(2*(esq+reg)/3)+'</b> D6 '+aff(esqbonus)
			+ ' => <b>'+arrondi(3.5*Math.floor(2*(esq+reg)/3)+esqbonus)+'</b>';
		}
	else if (comp.indexOf('Lancer de Potions') != -1)
		{ texte = 'Port�e : <b>'+(2+Math.floor(vuetotale/5))+'</b> cases'; }
	else if (comp.indexOf('Marquage')!=-1) {
		texte = 'Marquage permet de rajouter un sobriquet � un monstre. '
			+ 'Il faut bien choisir le nom � ajouter car celui-ci sera d�finitif. '
			+ 'Il faut se trouver dans la m�me caverne que le monstre pour le marquer.';
		}
	else if (comp.indexOf('Melange Magique')!=-1) {
		texte = 'Cette Comp�tence permet d\'utiliser deux Potions pour en r�aliser une nouvelle '
			+ 'qui aura comme effet la somme des effets des potions initiales.';
		}
	else if (comp.indexOf('Miner')!=-1) {
		texte = 'Port�e horizontale (officieuse) : <b>'+2*vuetotale+'</b> cases<br/>'
			+ 'Port�e verticale (officieuse) : <b>'+2*Math.ceil(vuetotale/2)+'</b> cases';
		}
	else if (comp.indexOf('Necromancie')!=-1)
		{ texte = 'La N�cromancie permet � partir des composants d\'un monstre de faire "revivre" ce monstre.'; }
	else if (comp.indexOf('Parer')!=-1) {
		texte = 'Jet de parade : <b>'+Math.floor(att/2)+'</b> D6 '+aff( Math.floor((attbonus+attbmm)/2) )
			+ ' => <b>'+arrondi(3.5*Math.floor(att/2)+Math.floor((attbonus+attbmm)/2))+'</b><hr/>'
			+ '<i>Equivalent esquive : <b>'+(Math.floor(att/2)+esq)+'</b> D6 '
			+ aff( Math.floor((attbonus+attbmm)/2)+esqbonus )
			+ ' => <b>'+(arrondi(3.5*(Math.floor(att/2)+esq)+Math.floor((attbonus+attbmm)/2))+esqbonus)+'</b></i>';
		}
	else if (comp.indexOf('Pistage')!=-1) {
		texte = 'Port�e horizontale : <b>'+2*vuetotale+'</b> cases<br/>'
			+ 'Port�e verticale : <b>'+2*Math.ceil(vuetotale/2)+'</b> cases';
		}
	else if (comp.indexOf('Planter un Champignon')!=-1) {
		texte = 'Planter un Champignon est une comp�tence qui vous permet de cr�er des colonies '
			+ 'd\'une vari�t� donn�e de champignon � partir de quelques exemplaires pr�alablement enterr�s.';
		}
	else if (comp.indexOf('Regeneration Accrue')!=-1) {
		texte = 'R�g�n�ration : <b>'+Math.floor(pvmax/15)+'</b> D3'
			+ ' => <b>+'+2*Math.floor(pvmax/15)+'</b> PV';
		}
	else if (comp.indexOf('Reparation')!=-1) {
		texte = 'Marre de ces arnaqueurs de forgerons ? Prenez quelques outils, '
			+ 'et r�parez vous-m�me votre mat�riel !';
		}
	else if (comp.indexOf('Retraite')!=-1) {
		texte = 'Vous jugez la situation avec sagesse et estimez qu\'il serait pr�f�rable de pr�parer '
			+ 'un repli strat�gique pour d�concerter l\'ennemi et lui foutre une bonne branl�e ... plus tard. '
			+ 'MOUAHAHA ! Quelle intelligence d�moniaque.';
		}
	else if (comp.indexOf('Rotobaffe')!=-1) {
		var Datt = att; var attbm = attbonus+attbmm;
		var Ddeg = deg; var degbm = degbonus+degbmm;
		for (var i=1 ; i<niveau+2 ; i++) {
			texte += '<b>Attaque n�'+i+' :</b><br/>'
				+ 'Attaque : <b>'+Datt+'</b> D6 '+aff(attbm)
				+ ' => <b>'+(arrondi(3.5*Datt)+attbm)+'</b><br/>'
				+ 'D�g�ts : <b>'+Ddeg+'</b> D3 '+aff(degbm)
				+ ' => <b>'+(2*Ddeg+degbm)+'</b>';
			Datt = Math.floor(0.75*Datt); attbm = Math.floor(0.75*attbm);
			Ddeg = Math.floor(0.75*Ddeg); degbm = Math.floor(0.75*degbm);
			if (i<niveau+1) {texte += '<hr/>';}
			}
		}
	else if (comp.indexOf('Shamaner')!=-1) {
		texte = 'Permet de contrecarrer certains effets des pouvoirs sp�ciaux des monstres '
			+ 'en utilisant des champignons (de 1 � 3).';
		}
	else if (comp.indexOf('Tailler')!=-1) {
		texte = 'Permet d\'augmenter sensiblement la valeur marchande de certains minerais. '
			+ 'Mais cette op�ration d�licate n\'est pas sans risques...';
		}
	return texte;
	}

function decumul_buff(nom,str,buff) {
	var ret = '1<sup>ere</sup>'+nom+' : <b>'+str+' +'+buff+'</b>';
	var dec = buff, total = buff;
	var i=1;
	while (i<6) {
		i++;
		dec = Math.floor(coefDecumul(i)*buff);
		if (dec<=1 || i==6) {break;}
		total += dec;
		ret += '<br/><i>'+i+'<sup>e</sup> '+nom+' : '+str+' +'+dec+' (+'+total+')</i>';
		}
	ret += '<br/><i>'+i+'<sup>e</sup> et + : '+str+' +'+dec+'</i>';
	return ret;
	}

function addVenin(type,effet,duree) {
	var ret = '<b>Venin '+type+' : </b><br/><b>'+effet+'</b> D3'+' pendant <b>'+duree+'</b> tour';
	var dured = Math.max(Math.floor(duree/2),1);
	if (duree>1) {ret += 's';}
	return ret+' => <b>'+2*effet+' x '+duree+' = '+2*effet*duree
			+'</b> ('+2*effet+' x '+dured+' = '+2*effet*dured+')';
	}

function perteSacro(sac) {
	return ' (-'+(sac+2*Math.floor(sac/5)+2)+' PV)';
	}

function sortileges(sort,mainCall,pcA,pcD) {
	var texte = '';
	if (mainCall) {
		var pcA = (bonusAttM) ? bonusAttM : false;
		var pcD = (bonusDegM) ? bonusDegM : false;
		}
	if (sort.indexOf('Analyse Anatomique')!=-1) {
		texte = 'Port�e horizontale : <b>'+Math.floor(vuetotale/2)+'</b> case';
		if (vuetotale>3) {texte += 's';}
		texte += '<br/>Port�e verticale : <b>'+Math.floor((vuetotale+1)/4)+'</b> case';
		if (vuetotale>7) {texte += 's';}
		}
	else if (sort.indexOf('Armure Etheree')!=-1)
		{ texte = decumul_buff('AE','Armure magique',reg); }
	else if (sort.indexOf('Augmentation')!=-1 && sort.indexOf('Attaque')!=-1)
		{ texte = decumul_buff('AdA','Attaque physique',1+Math.floor((att-3)/2)); }
	else if (sort.indexOf('Augmentation')!=-1 && sort.indexOf('Esquive')!=-1)
		{ texte = decumul_buff('AdE','Esquive',1+Math.floor((esq-3)/2)); }
	else if (sort.indexOf('Augmentation des Degats')!=-1)
		{ texte = decumul_buff('AdD','D�g�ts physiques',1+Math.floor((deg-3)/2)); }
	else if (sort.indexOf('Bulle Anti-Magie')!=-1) {
		texte = 'RM : <b>+'+rm+'</b> (Total : <b>'+(2*rm+rmbonus)+'</b>)<br/>'
			+ 'MM : <b>-'+mm+'</b> (Total : <b>'+mmbonus+'</b>)';
		}
	else if (sort.indexOf('Bulle Magique')!=-1) {
		texte = 'RM : <b>-'+rm+'</b> (Total : <b>'+rmbonus+'</b>)<br/>'
			+ 'MM : <b>+'+mm+'</b> (Total : <b>'+(2*mm+mmbonus)+'</b>)';
		}
	else if (sort.indexOf('Explosion')!=-1) {
		texte = 'Attaque : <b>Automatique</b><br/>'
			+ 'D�g�ts : <b>'+Math.floor( 1+(deg+Math.floor(pvbase/10))/2 )+'</b> D3 '
			+ ' => <b>'+2*Math.floor( 1+(deg+Math.floor(pvbase/10))/2 )
			+ ' ('+resiste( 1+(deg+Math.floor(pvbase/10))/2 )+')</b>';
		}
	else if (sort.indexOf('Faiblesse Passagere')!=-1) {
		if (pv<=0)
			{ return '<i>Dans votre �tat, vous n\'affaiblirez personne...</i>'; }
		// effet r�duit total = ceiling(effet total /2)
		// d�coupage Phys+Mag : P = ceiling(effet/2), M = floor(effet/2)
		texte = 'Port�e horizontale : <b>'+Math.min(1,vuetotale)+'</b> case<br/>'
			+ 'D�g�ts physiques : <b>-'+Math.ceil( (Math.floor(pv/10)+deg-5)/4 )
			+ ' (-'+Math.ceil( (Math.floor(pv/10)+deg-5)/8 )+')</b><br/>'
			+ 'D�g�ts magiques : <b>-'+Math.floor( (Math.floor(pv/10)+deg-4)/4 )
			+ ' (-'+Math.floor( (Math.floor(pv/10)+deg-2)/8 )+')</b>';
		}
	else if (sort.indexOf('Flash Aveuglant')!=-1)	
		{ texte = 'Vue, Attaque, Esquive : <b>-'+(1+Math.floor(vue/5))+'</b>'; }
	else if (sort.indexOf('Glue')!=-1) {
		texte = 'Port�e : <b>'+(1+Math.floor(vuetotale/3))+'</b> case';
		if (vuetotale>2) {texte += 's';}
		}
	else if (sort.indexOf('Griffe du Sorcier')!=-1) {
		var modD = 0;
		texte = 'Attaque : <b>'+att+'</b> D6 ';
		if (pcA) {
			modD = parseInt(att*pcA/100);
			texte += '<i>'+aff(modD)+'D6</i> ';
			}
		texte += aff(attbmm)
			+ ' => <b>'+(arrondi(3.5*(att+modD))+attbmm)+'</b><br/>'
			+ 'D�g�ts : <b>'+Math.floor(deg/2)+'</b> D3 ';
		if (pcD) {
			modD = parseInt(Math.floor(deg/2)*pcD/100);
			texte += '<i>'+aff(modD)+'D3</i> ';
			}
		else
			{ modD = 0; }
		texte += aff(degbmm)
			+ ' => <b>'+(2*(Math.floor(deg/2)+modD)+degbmm)
			+ '/'+(2*(Math.floor(deg/2)+Math.floor(deg/4)+modD)+degbmm)
			+ ' ('+resiste(Math.floor(deg/2)+modD,degbmm)
			+ '/'+resiste(Math.floor(deg/2)+Math.floor(deg/4)+modD,degbmm)+')</b>';
		if (!mainCall) {return texte;}	
		var effet = 1+Math.floor((Math.floor(pvbase/10)+reg)/3);
		texte += '<hr/>'+addVenin('insidieux',effet,2+Math.floor(vue/5))+'<hr/>';
		effet = Math.floor(1.5*effet);
		texte += addVenin('virulent',effet,1+Math.floor(vue/10));
		}
	else if (sort.indexOf('Hypnotisme')!=-1) {
		texte = 'Esquive : <b>-'+Math.floor(1.5*esq)+'</b> D�s'
			+ ' (<b>-'+Math.floor(esq/3)+'</b> D�s)';
		}
	else if (sort.indexOf('Identification des tresors')!=-1)
		{ texte = 'Permet de connaitre les caract�ristiques et effets pr�cis d\'un tr�sor.'; }
	else if (sort.indexOf('Invisibilite')!=-1) {
		texte = 'Un troll invisible est ind�tectable m�me quand on se trouve sur sa zone. '
			+ 'Toute action physique ou sortil�ge d\'attaque fait dispara�tre l\'invisibilit�.';
		}
	else if (sort.indexOf('Levitation')!=-1) {
		texte = 'Prendre un peu de hauteur permet parfois d\'�viter les ennuis. '
			+ 'Comme les pi�ges ou les trous par exemple...';
		}
	else if (sort.indexOf('Projectile Magique')!=-1) {
		var modD = 0;
		var portee = getPortee(vuetotale);
		texte = 'Attaque : <b>'+vue+'</b> D6 ';
		if (pcA) {
			modD = parseInt(vue*pcA/100);
			texte += '<i>'+aff(modD)+'D6</i> ';
			}
		texte += aff(attbmm)
			+' => <b>'+(arrondi(3.5*(vue+modD))+attbmm)+'</b><br/>'
			+'D�g�ts : <b>'+Math.floor(vue/2)+'</b> D3 ';
		if (pcD) {
			modD = parseInt(Math.floor(vue/2)*pcD/100);
			texte += '<i>'+aff(modD)+'D3</i> ';
			}
		else
			{ modD = 0; }
		texte += aff(degbmm)
			+ ' => <b>'+(2*(Math.floor(vue/2)+modD)+degbmm)
			+ '/'+(2*(Math.floor(1.5*Math.floor(vue/2))+modD)+degbmm)
			+ ' ('+resiste(Math.floor(vue/2)+modD,degbmm)
			+ '/'+resiste(1.5*Math.floor(vue/2)+modD,degbmm)+')</b>';
		if (!mainCall) {return texte;}
		texte += '<br/>Port�e : <b>'+portee+'</b> case';
		if (portee > 1) {texte += 's';}
		}
	else if (sort.indexOf('Puissance Magique')!=-1) {
		var newSort, pc = 20;
		var sortAtt = ['Projectile Magique','Rafale Psychique','Siphon des Ames','Vampirisme','Griffe du Sorcier'];
		for (var i=1 ; i<4 ; i++) {
			if (texte) {texte += '<hr/>'}
			texte += '<b>'+i+'<sup>e</sup> PuM ('+aff(pc)+' %) :</b><br/>';
			newSort = false;
			for (var j=0 ; j<4 ; j++) {
				if ( getSortComp(sortAtt[j]) ) {
					if (newSort) {texte += '<br/><br/>'}
					texte += '<i>'+sortAtt[j]+' :</i><br/>'+sortileges(sortAtt[j],false,-pc,pc);
					newSort = true;
					}
				}
			pc = decumulPumPrem(pc);
			}
		}
	else if (sort.indexOf('Precision Magique')!=-1) {
		var newSort, pc = 20;
		var sortAtt = ['Projectile Magique','Rafale Psychique','Siphon des Ames','Vampirisme','Griffe du Sorcier'];
		for (var i=1 ; i<4 ; i++) {
			if (texte) {texte += '<hr/>'}
			texte += '<b>'+i+'<sup>e</sup> Pr�M ('+aff(pc)+' %) :</b><br/>';
			newSort = false;
			for (var j=0 ; j<4 ; j++) {
				if ( getSortComp(sortAtt[j]) ) {
					if (newSort) {texte += '<br/><br/>'}
					texte += '<i>'+sortAtt[j]+' :</i><br/>'+sortileges(sortAtt[j],false,pc,-pc);
					newSort = true;
					}
				}
			pc = decumulPumPrem(pc);
			}
		}
	else if (sort.indexOf('Projection')!=-1) {
		texte = 'Si le jet de r�sistance de la victime est rat�:<br/>'
			+ 'la victime est <b>d�plac�e</b> et perd <b>1D6</b> d\'Esquive<hr/>'
			+ 'Si le jet de r�sistance de la victime est r�ussi:<br/>'
			+ 'la victime ne <b>bouge pas</b> mais perd <b>1D6</b> d\'Esquive.';
		}
	else if (sort.indexOf('Rafale Psychique')!=-1) {
		var modD = 0;
		texte = 'Attaque : <b>Automatique</b><br/>'
			+ 'D�g�ts : <b>'+deg+'</b> D3 ';
		if (pcD) {
			modD = parseInt(deg*pcD/100);
			texte += '<i>'+aff(modD)+'D3</i> ';
			}
		texte += aff(degbmm)
			+ ' => <b>'+(2*(deg+modD)+degbmm)+' ('+resiste(deg+modD,degbmm)+')</b>';
		if (!mainCall) {return texte;}
		texte += '<br/>Malus : r�g�n�ration <b>-'+deg+'</b>';
		}
	else if (sort.indexOf('Sacrifice')!=-1) {
		if (pv<=0)
			{ return '<i>Qui voulez-vous donc soigner ? Vous �tes mort !</i>'; }
		var sac = Math.floor((pv-1)/2);
		texte = 'Port�e horizontale : <b>'+Math.min(1,vuetotale)+'</b> case<br/>'
			+ 'Soin maximal : <b>'+sac+'</b> PV'+perteSacro(sac);
		sac = Math.floor(pvdispo/1.4)-1;
		if (sac>0)
			{ texte += '<hr/>Soin maximal sans malus de temps : <b>'+sac+'</b> PV'+perteSacro(sac); }
		if (sac>3) {
			sac = 5*Math.floor((sac+1)/5)-1;
			texte	+= '<br/>Soin optimal sans malus de temps : <b>'+sac+'</b> PV'+perteSacro(sac);
			}
		}
	else if (sort.indexOf('Siphon')!=-1) {
		var modD = 0;
		texte = 'Attaque : <b>'+att+'</b> D6 ';
		if (pcA) {
			modD = parseInt(att*pcA/100);
			texte += '<i>'+aff(modD)+'D6</i> ';
			}
		texte += aff(attbmm)
			+ ' => <b>'+arrondi(3.5*(att+modD)+attbmm)+'</b><br/>'
			+ 'D�g�ts : <b>'+reg+'</b> D3 ';
		if (pcD) {
			modD = parseInt(reg*pcD/100);
			texte += '<i>'+aff(modD)+'D3</i> ';
			}
		else
			{ modD = 0; }
		texte += aff(degbmm)
			+ ' => <b>'+(2*(reg+modD)+degbmm)+'/'+(2*(Math.floor(1.5*reg)+modD)+degbmm)
			+ ' ('+resiste(reg+modD,degbmm)+'/'+resiste(1.5*reg+modD,degbmm)+')</b>';
		if (!mainCall) {return texte;}
		texte += '<br/>N�crose : attaque magique <b>-'+reg+'</b>';
		}
	else if (sort.indexOf('Telekinesie')!=-1) {
		texte = 'Port�e horizontale  :<br/>';
		var vt = Math.floor(vuetotale/2)+2;
		texte += '<i>Tr�sor d\'une Plum\' ou Tr�s L�ger : </i><b>'+vt+'</b> cases';
		vt--;
		texte += '<br/><i>Tr�sor L�ger : </i><b>'+vt+'</b> case';
		if (vt>1) {texte += 's';} vt=Math.max(0,vt-1);
		texte += '<br/><i>Tr�sor Moyen : </i><b>'+vt+'</b> case';
		if (vt>1) {texte += 's';} vt=Math.max(0,vt-1);
		texte += '<br/><i>Tr�sor Lourd : </i><b>'+vt+'</b> case';
		if (vt>1) {texte += 's';} vt=Math.max(0,vt-1);
		texte += '<br/><i>Tr�sor Tr�s Lourd ou d\'une Ton\' : </i><b>'+vt+'</b> case';
		if (vt>1) {texte += 's';}
		}
	else if (sort.indexOf('Teleportation')!=-1) {
		var portee = getPortee(mmTroll/5);
		var pmh = (20+vue+portee);
		var pmv = 3+Math.floor(portee/3);
		texte = 'Port�e horizontale : <b>'+pmh+'</b> cases<br/>'
			+ 'Port�e verticale : <b>'+pmv+'</b> cases<hr/>'
			+ 'X compris entre '+(posX-pmh)+' et '+(posX+pmh)+'<br/>'
			+ 'Y compris entre '+(posY-pmh)+' et '+(posY+pmh)+'<br/>'
			+ 'N compris entre '+(posN-pmv)+' et '+Math.min(-1,posN+pmv)+'<br/>';
		}
	else if (sort.indexOf('Vampirisme')!=-1) {
		var modD = 0;
		texte = 'Attaque : <b>'+Math.floor(2*deg/3)+'</b> D6 ';
		if (pcA) {
			modD = parseInt(Math.floor(2*deg/3)*pcA/100);
			texte += '<i>'+aff(modD)+'D6</i> ';
			}
		texte += aff(attbmm)
			+ ' => <b>'+arrondi(3.5*(Math.floor(2*deg/3)+modD)+attbmm)+'</b><br/>'
			+ 'D�g�ts : <b>'+deg+'</b> D3 ';
		if (pcD) {
			modD = parseInt(deg*pcD/100);
			texte += '<i>'+aff(modD)+'D3</i> ';
			}
		else
			{ modD = 0; }
		texte += aff(degbmm)
			+ ' => <b>'+(2*(deg+modD)+degbmm)+'/'+(2*(Math.floor(1.5*deg)+modD)+degbmm)
			+ ' ('+resiste(deg+modD,degbmm)+'/'+resiste(1.5*deg+modD,degbmm)+')</b>';
		}
	else if (sort.indexOf('Vision Accrue')!=-1)
		{ texte = decumul_buff('VA','Vue',Math.floor(vue/2)); }
	else if (sort.indexOf('Vision lointaine')!=-1) {
		texte = 'En ciblant une zone situ�e n\'importe o� dans le Monde Souterrain, '
			+ 'votre Tr�ll peut voir comme s\'il s\'y trouvait.';
		}
	else if (sort.indexOf('Voir le Cache')!=-1) {
		texte = '<b>Sur soi :</b><br/>'
			+ 'Port�e horizontale : <b>'+Math.min(5,getPortee(vue))+'</b> cases<hr/>'
			+ '<b>� distance :</b><br/>'
			+ 'Port�e horizontale : <b>'+getPortee(vuetotale)+'</b> cases';
		}
	else if (sort.indexOf('Vue Troublee')!=-1) {
		texte = 'Port�e horizontale : <b>'+Math.min(1,vuetotale)+'</b> case<br/>'
			+ 'Vue : <b>-'+Math.floor(vue/3)+'</b>';
		}
	return texte;
	}


/*********************************************************************************
*                       Fonctions cr�ant les infos-bulles                        *
*********************************************************************************/

function creerBulleVide() {
	var newTable = document.createElement('table');
	newTable.setAttribute('id', 'bulle');
	newTable.setAttribute('class', 'mh_tdborder');
	newTable.setAttribute('width', '300');
	newTable.setAttribute('border', '0');
	newTable.setAttribute('cellpadding', '5');
	newTable.setAttribute('cellspacing', '1');
	newTable.setAttribute('style', 'position:absolute;visibility:hidden;z-index:800;height:auto;');
	var tr = appendTr(newTable, 'mh_tdtitre');
	appendTdText(tr, 'Titre');
	tr = appendTr(newTable, 'mh_tdpage');
	appendTdText(tr, 'Contenu');
	var aList = document.getElementsByTagName('a');
	aList[aList.length-1].parentNode.appendChild(newTable);
	}

function setInfosDesBulles(liste, fonction) {
	var listeTR = liste.getElementsByTagName('tr');
	var totalpc = 0;
	for (var i=0 ; i<listeTR.length ; i++) {
		var node = listeTR[i].childNodes[3].firstChild;
		var nom = epure(trim(node.firstChild.nodeValue));
		var nbrs = getNumbers(listeTR[i].childNodes[5].firstChild.firstChild.nodeValue);
		setInfos(node,nom,fonction,nbrs[0]);
		setSortComp(nom,nbrs[1],nbrs[0]);
		totalpc += nbrs[1];
		for (var j=3 ; j<listeTR[i].childNodes[5].childNodes.length ; j+=2) {
			nbrs = getNumbers(listeTR[i].childNodes[5].childNodes[j].nodeValue);
			setSortComp(nom,nbrs[1],nbrs[0]);
			totalpc += nbrs[1];
			}
		}
	return totalpc;
	}

function setInfos(node, nom, fonction, niveau) {
	node.setAttribute('nom',nom);
	node.setAttribute('fonction',fonction);
	node.setAttribute('niveau',niveau);
	node.addEventListener('mouseover',setBulle,true);
	node.addEventListener('mouseout',cacherBulle,true);
	}

function setBulle(evt) {
	var nom = this.getAttribute('nom');
	var fonction = this.getAttribute('fonction');
	var niveau = parseInt(this.getAttribute('niveau'));
	var str='';
	if (fonction=='competences')
		{ str=competences(nom,niveau); }
	else if (fonction=='sortileges')
		{ str=sortileges(nom,true); }
	if (str=='')
		{ return; }
	
	var xfenetre, yfenetre, xpage, ypage, element = null;
	var offset = 15;
	var bulleWidth = 300;
	if (!hauteur)
		{ hauteur = 50; }
	element = document.getElementById('bulle');
	xfenetre = evt.clientX;
	yfenetre = evt.clientY;
	xpage = xfenetre;
	ypage = yfenetre;
	if (evt.pageX)
		{ xpage = evt.pageX; }
	if (evt.pageY)
		{ ypage = evt.pageY; }
	if (element) {
		bulleStyle = element.style;
		element.childNodes[0].childNodes[0].innerHTML = '<b>' + nom + '</b>';
		element.childNodes[1].childNodes[0].innerHTML = str;
		}
	
	if (bulleStyle) {
		if (xfenetre > bulleWidth + offset)
			{ xpage -= bulleWidth + offset; }
		else
			{ xpage += offset; }
		if (yfenetre > hauteur + offset)
			{ ypage -= hauteur + offset; }
		bulleStyle.width = bulleWidth;
		bulleStyle.left = xpage + 'px';
		bulleStyle.top = ypage + 'px';
		bulleStyle.visibility = 'visible';
		}
	}

function cacherBulle() {
	if (bulleStyle)
		{ bulleStyle.visibility = 'hidden'; }
	}

try {
start_script(31);
creerBulleVide();
init();
setInfoDateCreation();
setNextDLA();
setInfosPV();
setInfosPxPi();
setStabilite();
setCurrentEsquive();
setRatioKillDeath();
setTotauxMagie();
setPourcentagesTotaux();
// Ces deux fonctions modifient lourdement le DOM, � placer en dernier, dans cet ordre
setAccel();
setLieu();
saveProfil();
displayScriptTime();
}
catch(e) {alert(e)}
//============================ ZZ POST CODE ======================================
//var ZZCRON='<img src="'+ZZDB+'/Cron/zzcron.php">';

function setNewsZZ(news) {
    IdNewZZ=news*1;
    if (zzlink) {
	 	var cnews=MZ_getValue(TiD+".ZZ_NewzID");
		if (news<0) {
		 	zzlink.innerHTML="MON PROFIL <FONT SIZE=-1>(<img height=18 SRC='"+SkinZZ+"/Bullet-yeux.gif'> <A HREF='"+ZZDB+"/zoryazilla.php?Source=MH&action=Newzz&PG="+PG+"'>Info ZZ</A>)</FONT>";
 		} else if ((!cnews) ||(cnews<news)) {
		 	zzlink.innerHTML="MON PROFIL <FONT SIZE=-1>(<A HREF='"+ZZDB+"/zoryazilla.php?Source=MH&action=Newzz&PG="+PG+"'>Info ZZ</A><img height=18 SRC='"+SkinZZ+"/New.gif'>)</FONT>";
		}
    }
} 

function initProfil() {


	//TiD=arrTR[4].childNodes[3].childNodes[1].getAttribute('href');
	//TiD=TiD.slice(TiD.indexOf('(')+1,TiD.indexOf(','));
	troll=arrTR[4].childNodes[3].childNodes[1].childNodes[0].nodeValue;
	troll=troll.substring(troll.indexOf('-')+2);

	//race=arrTR[4].childNodes[3].childNodes[4].nodeValue.split(':')[1];
	race = document.evaluate("//tr/td/text()[contains(.,'Race')]",arrTable[3], null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.nodeValue;
	race = race.substring(race.indexOf(":")+1);

	if (typeof(arrTR[6].childNodes[3].childNodes[1].childNodes[1].childNodes[2])!='undefined') {
    	if(arrTR[6].childNodes[3].childNodes[1].childNodes[1].childNodes[2].nodeValue.indexOf('[Camoufl�]')>0) {
        	camou=1; // Le troll est Camoufl�
    	}
	} 
}


// override infoBulle pour ajout des images
function ZZinfoBulle(evt) {
   var nom=this.getAttribute("nom");
   var fonction=this.getAttribute("fonction");
   var img=SkinZZ+'/'+fonction+'/'+skinIMG[nom];
   element = document.getElementById( 'bulle' );
   if( element ) {
   		element.childNodes[0].childNodes[0].innerHTML = '<TABLE><TR><TD><IMG SRC="'+img+'"><TD><TD valign=center> <b>'+nom+'</b></TD></TR></TABLE>';
	}
}

function ZZcreerInfoBulle(noeud) {
    //noeud.removeEventListener("mouseover", infoBulle,true);
	noeud.addEventListener("mouseover", ZZinfoBulle,true);
}

function ZZcreerInfoBulles(liste) {
	var i = 0;
	while (liste.childNodes[i] != null) {
		if (liste.childNodes[i].childNodes[3] != null) {
			ZZcreerInfoBulle(liste.childNodes[i].childNodes[3].childNodes[0]);
		}
		i += 2;
	}
}

function overrideInfoBulles() {
 	//var node = arrTable[8].childNodes[1];		// Le DOM est alt�r� par le tableau d'AM des kastars, il faut r�-�valuer le bon noeud!
    var node = document.evaluate("//tr/td/b/text()[contains(.,'Comp�tences')]/../../..", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.parentNode;
    if (!node) return;
	    
	var listeComp = node.childNodes[2].childNodes[1].childNodes[0].childNodes[1];
	var listeSort = node.childNodes[2].childNodes[3].childNodes[0].childNodes[1];
	ZZcreerInfoBulles(listeComp);
	ZZcreerInfoBulles(listeSort);	
}

// Fonction concoter par Breizhou13 modifi� par Zo avec la r�formesur le balayage
// Calcul du nombre de PA pour se relever lorsque le troll est � terre
function Morphologie(typeaff) { // version Dabihul
   var node = document.evaluate("//tr/td/p/b/i/text()[contains(.,'Caract�ristiques D�duites')]/../../..", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
   var chiffres = node.innerHTML.match(/\d+/g);
   var corpulence = chiffres[0];
   var agilite = chiffres[1];
   var stabilite = Math.floor((esq+reg)*2/3)+" D6 "+aff(esqbonus)+" (moyenne : "+(7*Math.floor((esq+reg)/3)+esqbonus)+")";
      
   // Cr�ation de la table d'affichage
   if (typeaff==1) {
      var string = '<table border="0" cellspacing="1" cellpadding="2" class="mh_tdborder">';
      string += '<tr class="mh_tdtitre">';
      string += '<td colspan="2" align="center"><b>Caract�ristiques D�duites</b></td>';
      string += '<td align="center"><b>Stabilit�</b></td></tr>';
      string += '<tr class="mh_tdpage">';
      string += '<td align="center">Corpulence</td><td align="center">'+corpulence+'</td>';
      string += '<td rowspan="2" align="center">'+stabilite+'</td></tr>';
      string += '<tr class="mh_tdpage">';
      string += '<td align="center">Agilit�</td><td align="center">'+agilite+'</td></tr>';
      string += '</table>';
      }
   else if (typeaff==2) {
      var string = '<b><i>Caract�ristiques D�duites  :</i></b><br>';
      string += '<table><tr><td>-  Corpulence.....:</td><td align=left>'+corpulence+' points</td></tr>';
      string += '<tr><td>- Agilit�.............:</td><td>'+agilite+' points</td></tr>';
      string += '<tr><td>- Stabilit�...........:</td><td>'+stabilite+'</td></tr></table>';
      }
   else {
      var string = '<b><i>Caract�ristiques D�duites  :</i></b><br>';
      string += '- Corpulence.....: '+corpulence+' points<br>';
      string += '- Agilit�.............: '+agilite+' points<br>';
      string += '- Stabilit�..........: '+stabilite;
      }
   node.innerHTML = string;
}  
   


// Fonction concoter par Breizhou13
function CaracEnTab() { // version Dabihul
   //recuperation des emplacements
   var base = document.evaluate("//tr/td/b/text()[contains(.,'Caract�ristiques')]/../../../td[2]/table", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
   var nombre_TR = base.getElementsByTagName('TR');
   
   //mise en forme du tableau et nettoyage des noms des caracs
   base.setAttribute('class','mh_tdborder');
   var tr = document.createElement('tr');
   tr.setAttribute('class','mh_tdtitre')
   for(i=0 ; i<nombre_TR.length ; i++) {
      nombre_TR[i].setAttribute('class','mh_tdpage');
      var nombre_TD = nombre_TR[i].getElementsByTagName('TD');
      nombre_TD[0].innerHTML = nombre_TD[0].innerHTML.substr(0,nombre_TD[0].innerHTML.indexOf('.', 0));
      var len = nombre_TD.length;
      for(j=0 ; j<len ; j++) {
         nombre_TD[j].setAttribute('align','center');
         }
      var moy = nombre_TD[len-1].textContent;
      nombre_TD[len-1].firstChild.nodeValue = moy.substring(11,moy.length-1);
      }
   
   //insertion des entetes du tableau
   insertBefore(base.firstChild, tr);
   appendTdText(tr, "", true);
   appendTdText(tr, "Nombre de d�s", true);
   appendTdText(tr, "Bonus physique", true);
   appendTdText(tr, "Bonus magique", true);
   appendTdText(tr, "Moyenne", true);
}
   

   
//=====================================================================
var TiD=numTroll;
var SkinZZ=MZ_getValue(TiD+".pref.SkinZZ"); if (!SkinZZ) SkinZZ=ZZDB+"/skin";
var troll="";
var race="";
var camou=0;
var PG="";
var nodesPG = document.evaluate("//img[contains(@src,'contenu/header.jpg')]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
if (nodesPG.snapshotLength==1) {
	PG=nodesPG.snapshotItem(0).src;
	PG=URLencode(PG.substring(0, PG.length-19));
}
initProfil();
overrideInfoBulles();

var nodes = document.evaluate("//B/text()[contains(.,'MON PROFIL')]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
if (nodes.snapshotLength==1) {
    var node = nodes.snapshotItem(0);
    zzlink=node.parentNode;
	zzlink.innerHTML="MON PROFIL <FONT SIZE=-1>(<A HREF='"+ZZDB+"/zoryazilla.php?Source=MH&action=Newzz&PG="+PG+"'>Info ZZ</A>)</FONT>";
}


var IdNewZZ=0;
var PVMax=pvmax;
var pvactuels=pv;
var data="&TypeData=Profil";
data=data+"&Troll="+escape(trim(troll))+"&Race="+trim(race)+"&Niveau="+nivTroll;
data=data+"&TiD="+TiD+"&PVMax="+PVMax+"&PV="+pvactuels;
data=data+"&PA="+trim(arrTR[5].childNodes[3].childNodes[5].childNodes[0].nodeValue).substr(0,1);;
data=data+"&DLA="+trim(arrTR[5].childNodes[3].childNodes[1].childNodes[0].nodeValue).replace(" ", "_");

//data=data+"&TimeStamp="+trim(arrTable[10].childNodes[1].childNodes[0].childNodes[1].childNodes[3].nodeValue).substr(27,19).replace(" ", "_");
var TimeStamp = document.evaluate("//tr/td/text()[contains(.,'Heure Serveur')]", arrTable[3], null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.nodeValue;
TimeStamp = TimeStamp.substring(TimeStamp.indexOf("Heure")+18);
TimeStamp = TimeStamp.substring(TimeStamp.indexOf(": ")+2,TimeStamp.indexOf("]")-11).replace(" ", "_");
data=data+"&TimeStamp="+TimeStamp;
data=data+"&X="+posX+"&Y="+posY+"&N="+posN+"&Camoufle="+camou;  
//alert(ZZDB+'/mzData.php?'+data);
MZ_appendNewScript(ZZDB+'/mzData.php?'+data);


Morphologie(1);
CaracEnTab();




