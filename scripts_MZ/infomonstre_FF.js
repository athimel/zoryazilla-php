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
var listeCDM = new Array();
var idMonstre=-1;
var nomMonstre="";
var tbody;
var popup;

// Function treateMonstre() has been removed from MZ original code for ZZ Fusion

// Function initPopup() has been removed from MZ original code for ZZ Fusion

// Function createPopupImage2() has been removed from MZ original code for ZZ Fusion

// Function showPopup() has been removed from MZ original code for ZZ Fusion

// Function hidePopup() has been removed from MZ original code for ZZ Fusion

// Function toggleTableau() has been removed from MZ original code for ZZ Fusion

// Function computeMission() has been removed from MZ original code for ZZ Fusion

/*start_script();
try
{
	initPopup();
	treateMonstre();
}
catch(e)
{
	alert(e);
}
displayScriptTime();*/
//============================ ZZ POST CODE ======================================

function ZZinitPopup() {
	popup = document.createElement('div');
	popup.setAttribute('id', 'popup');
	popup.setAttribute('class', 'mh_textbox');
	popup.setAttribute('style', 'position: absolute; border: 1px solid #000000; visibility: hidden;' +
			'display: inline; z-index: 3; max-width: 400px;');
	document.body.appendChild(popup);
}

function ZZshowPopup(evt) {
	var texte = this.getAttribute("texteinfo");
	var image = this.getAttribute("imageinfo");
	if ((image) && (ZZImg[image])) popup.innerHTML = "<table><tr><td><img src="+SkinZZ+ZZImg[image]+"></td><td>"+texte+"</td></tr></table>";
	else popup.innerHTML = texte;
	popup.style.left = evt.pageX + 15 + 'px';
	popup.style.top = evt.pageY + 'px';
	popup.style.visibility = "visible";
}

function ZZhidePopup() {
	popup.style.visibility = "hidden";
}


function roundDate(str1, str2) { // à 15 seconde près!
    var diffDate=Math.round((Date.parse(str1)-Date.parse(str2))/1000);
    if (diffDate<-15) return(diffDate);
    if (diffDate>15) return(diffDate);
    return(0);    
}

function putEventMonstre() {
	var totaltab=document.getElementsByTagName('table');
	var MZshift=3;

	//if (listeCDM.length>0) { // Décalage d'un tableau par la CDM de MZ  (on ne l'affiche plus!!!!
	//	var x_events = totaltab[4].childNodes[1].childNodes;
	//} else {	
        var x_events_headers = totaltab[3].getElementsByTagName('thead')[0].getElementsByTagName('tr');
		var x_events = totaltab[3].getElementsByTagName('tbody')[0].getElementsByTagName('tr');
		MZshift=2;
	//}

	var dNode=5;
	var iNode=3;
	var tNode=3;
	var invStr='DEPLACEMENT';
	ZZinitPopup();	
			
	//=== partie commune à infomonstres_FF.js
	var infoTh = document.createElement( 'th' );
	infoTh.setAttribute( 'width', '60' );
	infoTh.appendChild( document.createTextNode( 'Info' ) );
	x_events_headers[0].insertBefore( infoTh, x_events_headers[0].childNodes[iNode] );
	
	//var iCdM=eventCdM.length-1; 
	//var iIns=eventInsulte.length-1; 
	//var iAtt=eventAttaque.length-1; 
	var infoCellUsed=false;
	var infoColumnUsed=false;
	var DescEvt=""; 

    // Enrichissement des lignes d'event
	for (var i=0;i<x_events.length;i++) {
  	  infoCellUsed=false;
      var eventRow = x_events[i];

      var eventTypeCell = eventRow.childNodes[tNode].childNodes[0];
      var eventType = eventTypeCell.nodeValue;

	  DescEvt=eventRow.childNodes[dNode].childNodes[1].nodeValue;
      // en cas de piege le sens des dégat est inversé "piégé par piegeur" au lieu de "frappeur sur frappé"
	  if ((eventType.indexOf(invStr)>=0) && (eventRow.childNodes[dNode].childNodes[3])) {
          DescEvt=eventRow.childNodes[dNode].childNodes[3].nodeValue;
      }
	                         
	  //if (DescEvt.slice(DescEvt.indexOf('\(')+2, DescEvt.indexOf('\)')-1)==evtTroll) {    // 	différence 	 infomonstres_FF.js  et PJView_Events.js  (controle supplémentaire)
	  if (eventRow.childNodes[dNode].childNodes[3]) {
	  	if (eventType.indexOf(invStr)>=0) {
           DescEvt=eventRow.childNodes[dNode].childNodes[3].nodeValue;
 	    } else {
            DescEvt=eventRow.childNodes[dNode].childNodes[1].nodeValue; 				// différence 	 infomonstres_FF.js  et PJView_Events.js (Changement de sens pour les monstres)       
        }
		var iAtt=eventAttaque.length-1; 
		var iCdM=eventCdM.length-1; 
		var iIns=eventInsulte.length-1; 

        // Affichage des insultes
 	    while ((iIns>=0) && (infoCellUsed==false)) {
		 	    if (roundDate(eventInsulte[iIns][0], eventRow.childNodes[1].childNodes[0].nodeValue)==0) {
			 	// Controle du N° de Troll/Comp
			    if (    (eventType.indexOf('COMPETENCE')>=0)
			         && (DescEvt.slice(DescEvt.indexOf('\(')+2, DescEvt.indexOf('\)')-1)==eventInsulte[iIns][4]))
				{
					infoCellUsed=true;
					eventTypeCell.nodeValue='Insulte';
					var newB = document.createElement( 'h' );
					if (eventInsulte[iIns][1]==1) 
						newB.appendChild( document.createTextNode( 'Réussie' ) );
					else
						newB.appendChild( document.createTextNode( 'Résistée' ) );				
					var newTd = document.createElement( 'td' );
					newTd.setAttribute( 'align', 'center' );
			  		//newTd.setAttribute('title','SR='+ eventInsulte[iIns][2]+' (RM du monstre'+ eventInsulte[iIns][3]+')');
			  		span='SR='+ eventInsulte[iIns][2]+' (RM du monstre'+ eventInsulte[iIns][3]+')';
					newTd.setAttribute("texteinfo",span);
					newTd.setAttribute("imageinfo","Insulte");
					newTd.addEventListener("mouseover", ZZshowPopup,true);
					newTd.addEventListener("mouseout", ZZhidePopup,true);
			  		
					newTd.appendChild( newB );
					eventRow.insertBefore( newTd , eventRow.childNodes[iNode] );	
					eventInsulte.splice(iAtt,1);	//iIns--; (on retire l'élément du tableau plutot que de décrémenter					
		 	        break;
		 	    } else {
					iIns--;
		 	    }
	 	    } else if (roundDate(eventInsulte[iIns][0], eventRow.childNodes[1].childNodes[0].nodeValue)<0) {
	 	        break;
	 	    } else {
				iIns--;
	 	    }
	 	} 		

        // Affichage des CdM
 	    while ((iCdM>=0) && (infoCellUsed==false)) {
			if  (roundDate(eventCdM[iCdM][0], eventRow.childNodes[1].childNodes[0].nodeValue)==0) { 
			 	// Controle du N° de Troll/Comp
			    if (    (eventType.indexOf('COMPETENCE')>=0)
			         && (DescEvt.slice(DescEvt.indexOf('\(')+2, DescEvt.indexOf('\)')-1)==eventCdM[iCdM][4]))
				{
					infoCellUsed=true;
					eventTypeCell.nodeValue='CdM';
					var newB = document.createElement( 'h' );
					newB.appendChild( document.createTextNode( eventCdM[iCdM][3]+'%' ) );
					var newTd = document.createElement( 'td' );
					newTd.setAttribute( 'align', 'center' );
			  		//newTd.setAttribute('title','Blessure='+ eventCdM[iCdM][3]+'% '+ eventCdM[iCdM][1]+'<PV<'+ eventCdM[iCdM][2]);
			  		var span='Blessure=<b>'+ eventCdM[iCdM][3]+'%</b> '+ eventCdM[iCdM][1]+'&lt;PV&lt;'+ eventCdM[iCdM][2];
					newTd.setAttribute("texteinfo",span);
					newTd.setAttribute("imageinfo","CdM");
					newTd.addEventListener("mouseover", ZZshowPopup,true);
					newTd.addEventListener("mouseout", ZZhidePopup,true);
			  		
					newTd.appendChild( newB );
					eventRow.insertBefore( newTd , eventRow.childNodes[iNode] );	
					eventCdM.splice(iAtt,1);	//iCdM--; (on retire l'élément du tableau plutot que de décrémenter
		 	        break;
		 	    } else {
					iCdM--;
		 	    }
	 	    } else if (roundDate(eventCdM[iCdM][0],eventRow.childNodes[1].childNodes[0].nodeValue)<0) {
	 	        break;
	 	    } else {
				iCdM--;
	 	    }
	 	} 

        // Affichage des attaques
 	    while ((iAtt>=0) && (infoCellUsed==false)) {
	 	    if (roundDate(eventAttaque[iAtt][0],eventRow.childNodes[1].childNodes[0].nodeValue)==0) {
			    if ((  ((eventType.indexOf('SORTILEGE')>=0) && (eventAttaque[iAtt][3]=='Explosion'))
					   || (eventType.indexOf('COMBAT')>=0)||(eventType.indexOf('MORT')>=0)||(eventType.indexOf('DEPLACEMENT')>=0))
			         && (DescEvt.slice(DescEvt.indexOf('\(')+2, DescEvt.indexOf('\)')-1)==Math.abs(eventAttaque[iAtt][1])))
				{

			 	// Controle du N° de Troll/Combat (deplacementpourles pieges)
					infoCellUsed=true;
					eventTypeCell.nodeValue=eventAttaque[iAtt][3];
					var newB = document.createElement( 'h' );
					if ((eventAttaque[iAtt][9]>0) && (eventAttaque[iAtt][7]==0)&&(eventAttaque[iAtt][2]==0)) {
						newB.appendChild( document.createTextNode( "Raté" ) );				
					} else {
						newB.appendChild( document.createTextNode( "-"+eventAttaque[iAtt][2]+" PV" ) );				
					}
					var span='';					
					if (eventAttaque[iAtt][2]>0) {
				  		span=span+'Dégâts=<b>'+eventAttaque[iAtt][2]+' PV</b><br>';
					} 
					if (eventAttaque[iAtt][9]>0) {
				  		span=span+'Esquive=<b>'+eventAttaque[iAtt][9]+'</b><br>';
					} 
					if (eventAttaque[iAtt][7]>0) {
				  		span=span+'Armure=<b>'+eventAttaque[iAtt][7]+'</b><br>';
					} 
					if (eventAttaque[iAtt][4]!='0') {
				  		span=span+'REG=<b>-'+ eventAttaque[iAtt][4]+'</b><br>';
				  	} 
					if (eventAttaque[iAtt][5]>0) {
				  		span=span+'RM<b>'+ eventAttaque[iAtt][6]+'</b><br>';
				  	} 
					if (span=='') span='Attaque Physique<br>';

					var newTd = document.createElement( 'td' );
					newTd.setAttribute( 'align', 'center' );
//			  		newTd.setAttribute('title',span.slice(0,span.length-2));
					newTd.setAttribute("texteinfo",span);
					newTd.setAttribute("imageinfo",eventAttaque[iAtt][3]);
					newTd.addEventListener("mouseover", ZZshowPopup,true);
					newTd.addEventListener("mouseout", ZZhidePopup,true);

					newTd.appendChild( newB );
					eventRow.insertBefore( newTd , eventRow.childNodes[iNode] );	
					eventAttaque.splice(iAtt,1);	//iAtt--; (on retire l'élément du tableau plutot que de décrémenter
		 	        break;
		 	    } else {
					iAtt--;
		 	    }
	 	    } else if (roundDate(eventAttaque[iAtt][0],eventRow.childNodes[1].childNodes[0].nodeValue)<0) {
	 	        break;
	 	    } else {
				iAtt--;
	 	    }
	 	}}//} 		différence 	//infomonstres_FF.js  et PJView_Events.js 

		if (infoCellUsed==false) { // Ne rentre dans aucun des cas précédents
			eventRow.insertBefore( document.createElement('td') , eventRow.childNodes[iNode] );	
		} else {
		 	infoColumnUsed=true; // Au moins un event contient des infos
		}
	}


	if (infoColumnUsed==false) {  // pas d'info on démonte la colonne
        x_events_headers[0].removeChild( infoTh ); // On retire le th "Info"
		for (var k=0;k<x_events.length;k++) { // On retire chaque cellule
			x_events[k].removeChild( x_events[k].childNodes[iNode] );	
		}
	//=== Fin partie commune à infomonstres_FF.js => qui affiche un tableau récap
	} else {  // Récap./Summarize
		var PVMin=0;
		var PVMax=0;
		var DateCdM=0;	
		var Blessure=0;	
		if (_eventCdM.length>0) { 
			DateCdM=_eventCdM[_eventCdM.length-1][0];	
			Blessure=_eventCdM[_eventCdM.length-1][3];	
		}
		for (var iCdM=0; iCdM<_eventCdM.length; iCdM=iCdM+1) {		 
			if (1*_eventCdM[iCdM][1]>PVMin) PVMin=1*_eventCdM[iCdM][1];
			if (((1*_eventCdM[iCdM][2]<PVMax) && (1*_eventCdM[iCdM][2]>0))||(PVMax==0)) PVMax=1*_eventCdM[iCdM][2];
		}		
//		alert(DateCdM+"=>"+PVMin+" "+PVMax);

		var DEG_CdM=0;
		var DEG_Reste=0;
		var DEG_Total=0;
		var ARM=0;
		var ESQ_MIN=-1;
		var ESQ_MAX=-1;
		var minRM=0;
		var maxRM=0;
		var NIV=0;
		var MORT=0;
		if (totaltab[0].childNodes[1].childNodes[0].childNodes[1].childNodes[1].childNodes[0].nodeValue.indexOf('a été Tué.')>0) MORT=1;
		// ========== Rvue des ATTs
		for (var iAtt=_eventAttaque.length-1; iAtt>=0; iAtt=iAtt-1) {	
 			// Conversion string => number
			_eventAttaque[iAtt][2]=1*_eventAttaque[iAtt][2];
			_eventAttaque[iAtt][7]=1*_eventAttaque[iAtt][7];
			_eventAttaque[iAtt][8]=1*_eventAttaque[iAtt][8];
			_eventAttaque[iAtt][9]=1*_eventAttaque[iAtt][9];
//     	    if ((roundDate(DateCdM, eventAttaque[iAtt][0]) <0) && (DateCdM!=0)) {
     	    if ((Date.parse(DateCdM)<Date.parse(_eventAttaque[iAtt][0])) && (DateCdM!=0)) {    	     
     	         DEG_CdM=DEG_CdM+_eventAttaque[iAtt][2];
            } else {
     	         DEG_Reste=DEG_Reste+_eventAttaque[iAtt][2];
            }        
            if (ARM<_eventAttaque[iAtt][7]) ARM=_eventAttaque[iAtt][7];
            if (ESQ_MAX<_eventAttaque[iAtt][9]) ESQ_MAX=_eventAttaque[iAtt][9];
            if (((ESQ_MIN>_eventAttaque[iAtt][9])&&(_eventAttaque[iAtt][9]>=0)) || (ESQ_MIN==-1)) ESQ_MIN=_eventAttaque[iAtt][9];
            if (NIV<_eventAttaque[iAtt][8]) NIV=_eventAttaque[iAtt][8];
            var vRM=_eventAttaque[iAtt][6];
            if (vRM!='0') {
             	if (vRM.slice(0,1)=='=') {
             	  if ((minRM!=maxRM)||((minRM==0)&&(maxRM==0))) { 
				    maxRM=parseInt(vRM.slice(1)); 
				  } else { 
				    if (maxRM<parseInt(vRM.slice(1))) maxRM=parseInt(vRM.slice(1)); 
                  }
             	  minRM=maxRM;
             	} else if (vRM.slice(0,1)=='<') {
             	  if ((minRM!=maxRM)||((minRM==0)&&(maxRM==0))) { 
				    if ((minRM>parseInt(vRM.slice(1)))||(minRM==0)) minRM=parseInt(vRM.slice(1)); 
				  }
             	} else {
             	  if ((minRM!=maxRM)||((minRM==0)&&(maxRM==0))) { 
				    if (maxRM<parseInt(vRM.slice(1))) maxRM=parseInt(vRM.slice(1)); 
				  }
             	}             	 
            }
		}		
		DEG_Total=DEG_Reste+DEG_CdM;

		// ========== Rvue des ATTs
		for (var iIns=eventInsulte.length-1; iIns>=0; iIns=iIns-1) {
            var vRM=eventInsulte[iIns][3];
            if (vRM!='0') {
             	if (vRM.slice(0,1)=='=') {
             	  if ((minRM!=maxRM)||((minRM==0)&&(maxRM==0))) { 
				    maxRM=parseInt(vRM.slice(1)); 
				  } else { 
				    if (maxRM<parseInt(vRM.slice(1))) maxRM=parseInt(vRM.slice(1)); 
                  }
             	  minRM=maxRM;
             	} else if (vRM.slice(0,1)=='<') {
             	  if ((minRM!=maxRM)||((minRM==0)&&(maxRM==0))) { 
				    if ((minRM>parseInt(vRM.slice(1)))||(minRM==0)) minRM=parseInt(vRM.slice(1)); 
				  }
             	} else {
             	  if ((minRM!=maxRM)||((minRM==0)&&(maxRM==0))) { 
				    if (maxRM<parseInt(vRM.slice(1))) maxRM=parseInt(vRM.slice(1)); 
				  }
             	}             	 		 	
		}
	}
			
	var trvITM = document.createElement('TR');
	trvITM.setAttribute('class','mh_titre3');
	trvITM.appendChild(document.createElement('TD'));
	trvITM.childNodes[0].setAttribute( 'colspan', '2' );
	trvITM.childNodes[0].setAttribute( 'align', 'center' );
	trvITM.appendChild(document.createElement('TD'));
	trvITM.childNodes[1].setAttribute( 'colspan', '2' );

	if (DateCdM==0) {
		var vBarrePV='-';
		var vCdM='';
	} else {
		var lSize=Math.floor((50*(100-Blessure))/100); if ((lSize<50) && (lSize>48)) lSize=48;
		var vPV='<I>dernière CdM</I>';			 				
		var vCdM='[<B>'+Blessure+'</B>% de ';
		if (PVMax==0) vCdM=vCdM+'&#62;<B>'+PVMax+'</B>]'; else if (PVMin==0) vCdM=vCdM+'&#60;<B>'+PVMin+'</B>]'; else vCdM=vCdM+'<B>'+PVMin+'</B>&#60;PV&#60;<B>'+PVMax+'</B>]';
		if (MORT==1) {
		 	lSize=0; vPV='<I>Mort</I>';	
	 	} else if (DEG_CdM==0) { 
	 	 	PV=Math.round((PVMax+PVMin)*(100-Blessure)/200);
			vPV='<I>CdM :</I> <B>'+PV+'</B> PV';			 	
	 	} else if (PVMax==0) { 
	 	} else if (PVMin==0) {  // PV supérieur à PVMin
	 	} else {
			var rPV=Math.round((PVMin+PVMax)/2);
			var PV=Math.round(rPV*(100-Blessure)/100);
			if (PV<DEG_CdM) {rPV=PVMax; PV=Math.round(PVMax*(100-Blessure)/100);}
			PV=PV-DEG_CdM; 
			if (PV>0) {
		        lSize=Math.floor((50*PV)/rPV); if ((lSize<50) && (lSize>48)) lSize=48;   // pour rendre plus joli
				vPV='<I>reste</I> <B>'+PV+'</B> PV';			 	
			} else { 
			    lSize=2 ;
				vPV='<I>presque mort</I>';			 	
			}
		}
		var rSize=50-lSize;			
		vBarrePV='<TABLE width=50 border=0 cellspacing=1 cellpadding=0 bgcolor=#000000><TR><TD bgcolor=#FF0000 height=10 width='+lSize+' border=0 cellspacing=0 cellpadding=0></TD>';
		if (rSize>0) vBarrePV=vBarrePV+'<TD bgcolor=#FFFFFF height=10 width='+rSize+' border=0 cellspacing=0 cellpadding=0></TD>';
		vBarrePV=vBarrePV+'</TR></TABLE>'+vPV;
	}
		
	var vDEGT='-';	var vDEGC='-'; 	var vARM='-'; var vESQ='-';  var vRM='-'; 
	if ((ESQ_MIN==ESQ_MAX)&&(ESQ_MIN>=0)) vESQ='<B>'+ESQ_MIN+'</B>'; else if ((ESQ_MIN>=0) && (ESQ_MAX>=0)) vESQ='de <B>'+ESQ_MIN+'</B> à <B>'+ESQ_MAX+'</B>'; else if (ESQ_MIN>=0) vESQ='<B>'+ESQ_MIN+'</B>'; else if (ESQ_MAX>=0) vESQ='<B>'+ESQ_MAX+'</B>';
	if ((minRM==maxRM) && (minRM!=0))  vRM='<B>'+minRM+'</B>'; else if ((minRM>0) && (maxRM>0)) vRM='de <B>'+minRM+'</B> à <B>'+maxRM+'</B>'; else if (minRM>0) vRM='<FONT SIZE=-2>inférieure à </FONT><B>'+minRM+'</B>'; else if (maxRM>0) vRM='<FONT SIZE=-2>supérieure à </FONT><B>'+maxRM+'</B>';
    if (ARM>0) vARM='<B>'+ARM+'</B>';
    if (DEG_Total>0) vDEGT='<B>-'+DEG_Total+'</B> PV';
    if (DEG_CdM>0) vDEGC='<B>-'+DEG_CdM+'</B> PV';
	trvITM.childNodes[0].innerHTML ='<I><U>Estimation<BR>des Caractéristiques</I></U> :<BR>';
	var tabCarac='<TABLE class=mh_tdborder border=0 cellspacing=1 cellpadding=4><TR class=mh_tdpage>';
	tabCarac=tabCarac+'<TD align=center width=120>Jet d\'Esquive<BR>'+vESQ+'</TD>';
	tabCarac=tabCarac+'<TD align=center width=70>Armure<BR>'+vARM+'</TD>';
	tabCarac=tabCarac+'<TD align=center width=120>Résistance Magique <BR>'+vRM+'</TD>';
	tabCarac=tabCarac+'<TD width=90 align=center>'+vBarrePV+'</TD></TR>';
	tabCarac=tabCarac+'<TR class=mh_tdpage>';
	if (NIV>0) tabCarac=tabCarac+'<TD align=center>Niveau : <B>'+NIV+'</B></TD><TD align=right colspan=2>'; else tabCarac=tabCarac+'<TD align=right colspan=3>';
	tabCarac=tabCarac+'Total des Dégats encaissés : </TD><TD align=center>'+vDEGT+'</TD></TR>';
	tabCarac=tabCarac+'<TR class=mh_tdpage><TD align=right colspan=3>Dégats depuis la CdM : '+vCdM+'</TD><TD align=center>'+vDEGC+'</TD></TR>';
	tabCarac=tabCarac+'</TABLE><BR>';
	trvITM.childNodes[1].innerHTML = tabCarac;
	totaltab[MZshift].childNodes[1].insertBefore(trvITM, totaltab[MZshift].childNodes[1].childNodes[1]);
	
	}
	
}

//----------------------------------------------------------------------------------------------------
function ZZcompoEM(Monstre) {
     var compo="";
	for (var i=0; i<tabEM.length; i++) {
	 	if (tabEM[i][0].toLowerCase()==Monstre.toLowerCase()) {
	 	    if (tabEM[i][4]==1)
			    compo="<IMG SRC='"+SkinZZ+"smallEM_variable.gif'> Divers composants <b>"+tabEM[i][1]+" "+tabEM[i][0]+" </b>("+tabEM[i][2]+")";
  		    else
			    compo="<IMG SRC='"+SkinZZ+"smallEM_fixe.gif'> <b>"+tabEM[i][1]+" "+tabEM[i][0]+"</b> (Qualité "+tabQualite[tabEM[i][3]]+") pour l'écriture de <b>"+tabEM[i][2]+"</b>";
		}
	}
	return compo;     
}

function getMonstreDef(nom){
	for (var k = 0; k < tabMonstres.length; k++) {
		if (nom.indexOf(tabMonstres[k][0]+" ") != -1) {	
			return k;
		}
	}
	return -1;
}

function createImageSize(url, w, h)
{
	var img = document.createElement('img');
	img.setAttribute('src',url);
	img.setAttribute('width', w);	
	img.setAttribute('height', h);
	return img;
}
  
function createBarrePV(color, pvr, pv, comment) { //color: 0=red, 1=gris
	if (pvr>pv) pvr=pv;
    var size=Math.floor((50*pvr)/pv); if ((size<50) && (size>48)) size=48;   // pour rendre plus joli
	if (comment=='') var text=pvr+'/'+pv+' PV';	else var text=comment;    

	if (color==0) var imgG='/skin/red.gif'; else if (color==1) var imgG='/skin/grey.gif'; else imgG='/skin/white.gif';
    if (color==-3) var imgD='/skin/green.gif';  else var imgD='/skin/white.gif'; 

	var myTableI=document.createElement('span');
	myTableI.setAttribute('title',text);
	myTableI.setAttribute('align','ABSMIDDLE');

	var img1 = createImageSize(ZZDB+'/skin/black.gif', 1, 10);
	myTableI.appendChild(img1);
	var img2 = createImageSize(ZZDB+imgG, size, 10);
	myTableI.appendChild(img2);		
	var img3 = createImageSize(ZZDB+'/skin/black.gif', 1, 10);
	myTableI.appendChild(img3);
	var img4 = createImageSize(ZZDB+imgD, 50-size, 10);
	myTableI.appendChild(img4);
	if (size<50) {
		var img5 = createImageSize(ZZDB+'/skin/black.gif', 1, 10);
		myTableI.appendChild(img5);
	}
	return myTableI;
}

//----------------------------------------------------------------------------------------------------
function putBestiaireInfo() {
   var cmdMonstre=listeCDM[MeID];
   var id=MeID;
   var Bestiaire="BESTIAIRE"; 
   var barrePV;
   var Blessure;
   if (cmdMonstre[11].indexOf("%")>0) {

    	Bestiaire="CDM du <br><b>"+cmdMonstre[11].slice(cmdMonstre[11].indexOf('le')+2)+"</b>";
		Blessure="&nbsp&nbsp&nbsp"+bbcode(cmdMonstre[11]); 
		if (cmdMonstre[11].indexOf("%")!=-1) {
			var b=1*cmdMonstre[11].slice(cmdMonstre[11].indexOf("[b]")+3,  cmdMonstre[11].indexOf(" %"));
			if ((b!=0) && (cmdMonstre[2].indexOf("-")!=-1)) {
		        var pv2 = cmdMonstre[2].substring(0,cmdMonstre[2].indexOf("-"))*1;
		        var pv1 = cmdMonstre[2].substring(cmdMonstre[2].indexOf("-")+1,cmdMonstre[2].indexOf(" -->"))*1;
		        var p1=92.5;  if (b!=95) p1=b-5; if (p1<0) p1=0;
		        var pva1 = Math.floor(pv1 * (100 - p1) / 100);
		        var p2=92.5;  if (b!=90) p2=b+5; if (p2>100) p2=100;
		     	var pva2 = Math.floor(pv2 * (100 - p2) / 100)+1;
		     	var pvm = Math.floor((pva1+pva2)/2);
		        Blessure="&nbsp&nbsp&nbsp<b>"+b+"%</b> =><b>"+pvm+"</b> PV (entre <b>"+pva2+"</b> et <b>"+pva1+"</b>)"; 
		    } else if ((b!=0) && (cmdMonstre[2].indexOf("[b]")!=-1)) {
				var pv1=1*cmdMonstre[2].slice(cmdMonstre[2].indexOf("[b]")+3, cmdMonstre[2].indexOf("[/b]"));
		        var p1=92.5;  if (b!=95) p1=b-5; if (p1<0) p1=0;
		        var pva1 = Math.floor(pv1 * (100 - p1) / 100);
		        var p2=92.5;  if (b!=90) p2=b+5; if (p2>100) p2=100;
		     	var pva2 = Math.floor(pv1 * (100 - p2) / 100)+1;
		        Blessure="&nbsp&nbsp&nbsp<b>"+b+"%</b> reste entre <b>"+pva1+"</b> et <b>"+pva2+"</b> PV"; 
		    }
		}
		
    	var pv=100-cmdMonstre[11].substring(cmdMonstre[11].indexOf(']')+1,cmdMonstre[11].indexOf('%'));
    	var barrePV=createBarrePV(0, pv, 100, ''); 
   }
   
   // information de SR
   var cdmRM=bbcode(cmdMonstre[9]);
   if((cmdMonstre[9].indexOf("[b]")!=-1) && (MM_TROLL!="")) {
		var v=0;
		var mrm=1*cmdMonstre[9].slice(cmdMonstre[9].indexOf("[b]")+3,  cmdMonstre[9].indexOf("[/b]"));
		var tmm=MM_TROLL*1;
		if(tmm<0) v="10";
		else if(mrm<tmm) v=Math.max(10,Math.floor((mrm/tmm)*50));
		else v=Math.min(90,Math.floor(100-(tmm/mrm)*50));
	    cdmRM+=" <font size=-2>("+v+"%)</font>";
   }   

   var cdmMM="";
   // information de SR
   var cdmMM=cmdMonstre[18];
   if((cmdMonstre[18].indexOf("[b]")!=-1) && (RM_TROLL!="")) {
		var v=0;
		var mmm=1*cmdMonstre[12].slice(cmdMonstre[12].indexOf("[b]")+3,  cmdMonstre[12].indexOf("[/b]"));
		var trm=RM_TROLL*1;
		if(trm<0) v="90";
		else if(trm<mmm) v=Math.max(10,Math.floor((trm/mmm)*50));
		else v=Math.min(90,Math.floor(100-(mmm/trm)*50));
	    cdmMM=bbcode(cdmMM)+" <font size=-2>("+v+"%)</font>";
   }   

	var idMonstre = getMonstreDef(fullname);
   if (idMonstre>=0) var photo=SkinZZ+'/monstres/'+skinBEAST[tabMonstres[idMonstre][3]]; else photo=SkinZZ+'/monstres/'+skinBEAST[0];


	var vlc="non"; var attdist=""; var att=""; var vit=""; var equip=""; var dla=""; var tour=""; var AM=""; var BM=""; var pouvoir=""; var range=""; var vole=""; var SF=""; var attmag="";
	if (cmdMonstre[12]==1) vlc="oui"; else if (cmdMonstre[12]==0) vlc="non"; else vlc="";
	if(cmdMonstre[13]==1) attdist="oui"; else if(cmdMonstre[13]==0) attdist="non"; else attdist="";	
	//if(cmdMonstre[14]==1) att=1; else if(cmdMonstre[14]>1 && cmdMonstre[14]<=6) att=cmdMonstre[14]; else if(cmdMonstre[14]>6) attdist="Beaucoup";
	if(cmdMonstre[14]) att=cmdMonstre[14];
	if(cmdMonstre[15]!="") vit=bbcode(cmdMonstre[15]); 
	if(cmdMonstre[17] && cmdMonstre[17].length>0) equip=bbcode(cmdMonstre[17]);
	if(cmdMonstre[16]) range=bbcode(cmdMonstre[16]);
	if(cmdMonstre[10]) pouvoir=bbcode(cmdMonstre[10]);
	if(cmdMonstre[19]) dla=bbcode(cmdMonstre[19]);
	if(cmdMonstre[20]) BM=bbcode(cmdMonstre[20]);
	if(cmdMonstre[21]) tour=bbcode(cmdMonstre[21]);
	if(cmdMonstre[22]) AM=bbcode(cmdMonstre[22]);
	if(cmdMonstre[23]) { if (cmdMonstre[23]==1) vole="oui"; else if (cmdMonstre[23]==0) vole="non"; else vole=""; }
	if(cmdMonstre[24]) SF=bbcode(cmdMonstre[24]);
	if(cmdMonstre[25]) { if (cmdMonstre[25]==1) attmag="oui"; else if (cmdMonstre[25]==0) attmag="non"; else attmag=""; } 
	
   var strCDM ='<TABLE class="mh_tdborder" width="690" BORDER="0" CELLSPACING="1" CELLPADDING="2">';
   strCDM+='<TR class="mh_tdtitre"><TD>NIV: '+bbcode(cmdMonstre[0]) + analysePX(bbcode(cmdMonstre[0]))+'</td><TD colspan="4">'+id+' '+fullname+'</TD><TD colspan="2" align="center">'+bbcode(cmdMonstre[1])+'</TD></TR>';
   strCDM+='<TR class="mh_tdpage"><TD rowspan="8" align="center" valign="center"><IMG SRC="'+photo+'"></td><TD class="mh_tdtitre">PdV:</TD><TD>'+bbcode(cmdMonstre[2])+'</TD><TD colspan="4">';
   if (cmdMonstre[11].indexOf("%")>0) strCDM+=barrePV.innerHTML+" "+Blessure; strCDM+='</TD></TR>';
   strCDM+='<TR class="mh_tdpage"><TD class="mh_tdtitre">ATT:</TD><TD>'+bbcode(cmdMonstre[3])+'</TD><TD class="mh_tdtitre">VUE:</TD><TD>'+bbcode(cmdMonstre[8])+'</TD><TD colspan="2" rowspan="2" class="mh_tdtitre" align="center" valign="center">'+Bestiaire+'</TD></TR>';
   strCDM+='<TR class="mh_tdpage"><TD class="mh_tdtitre">ESQ:</TD><TD>'+bbcode(cmdMonstre[4])+'</TD><TD class="mh_tdtitre">VLC:</TD><TD>'+vlc+'</TD></TR>';
   strCDM+='<TR class="mh_tdpage"><TD class="mh_tdtitre">DEG:</TD><TD>'+bbcode(cmdMonstre[5])+'</TD><TD class="mh_tdtitre">M.M:</TD><TD>'+cdmMM+'</TD><TD class="mh_tdtitre">VIT:</TD><TD>'+vit+'</TD></TR>';
   strCDM+='<TR class="mh_tdpage"><TD class="mh_tdtitre">REG:</TD><TD>'+bbcode(cmdMonstre[6])+'</TD><TD class="mh_tdtitre">R.M:</TD><TD>'+cdmRM+'</TD><TD class="mh_tdtitre">TR.:</TD><TD>'+tour+'</TD></TR>';
   strCDM+='<TR class="mh_tdpage"><TD class="mh_tdtitre">ARM:</TD><TD>'+bbcode(cmdMonstre[7])+'</TD><TD class="mh_tdtitre">Att:</TD><TD>'+att+'</TD><TD class="mh_tdtitre">DLA:</TD><TD>'+dla+'</TD></TR>';
   strCDM+='<TR class="mh_tdpage"><TD class="mh_tdtitre" width=30>A.M:</TD><TD width="180">'+AM+'</TD><TD class="mh_tdtitre" width="30">Dist.:</TD><TD width="180">'+attdist+'</TD><TD class="mh_tdtitre" width="30">Mag.:</TD><TD width="90">'+attmag+'</TD></TR>';
   strCDM+='<TR class="mh_tdpage"><TD class="mh_tdtitre" width=30>Charg.:</TD><TD width="180">'+equip+'</TD><TD class="mh_tdtitre" width="30">S.F.:</TD><TD width="180">'+SF+'</TD><TD class="mh_tdtitre" width="30">Vole:</TD><TD width="90">'+vole+'</TD></TR>';


   if (BM!="")  strCDM+='<TR class="mh_tdpage"><TD colspan="7">Bonus/Malus: '+BM+'</TD></TR>';
   strCDM+='<TR height=15 class="mh_tdtitre"><TD width="150">Pouvoir '+range+':</TD><TD width="5400" colspan="6">'+pouvoir+'</td></TR>';

	var TypeMonstre=getEM(fullname);
	var infosCompo="";
	if (TypeMonstre!="") {
	   infosCompo=ZZcompoEM(TypeMonstre);
	   strCDM+='<TR class=mh_tdpage><TD colspan=7>Composant: '+infosCompo+'</TD></TR>';
	}
    strCDM+='</TABLE>';

   //Mise en Place spécial pour la page évent.
   element=document.getElementsByTagName('div');  
   if (idMonstre>0) {
    	element[1].innerHTML = strCDM;  
    } else {
		element[0].innerHTML += strCDM;  
    }
}

// Début Du script ITM Event
var NIV_TROLL = MZ_getValue("NIV_TROLL");	
var NUM_TROLL=numTroll;			// Id du Troll
var MM_TROLL = MZ_getValue("MM_TROLL");	
var RM_TROLL = MZ_getValue("RM_TROLL");	

var totaltab=document.getElementsByTagName('table');
var monstre=totaltab[0].childNodes[1].childNodes[0].childNodes[1].childNodes[1].childNodes[0].nodeValue;

if (monstre.lastIndexOf("Ce Monstre n'existe pas ou a ",0) === 0) { // recherche via dernier évenement
  //  var nodes = document.evaluate("//text()[contains(.,'a débarrassé le Monde Souterrain')]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    var nodes = document.evaluate("//a[@class='mh_monstres']/text()", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength>0)	{
	   var node = nodes.snapshotItem(0).nodeValue;
	   if (node.slice(0,3)=='une') {
           monstre=node.slice(4);
       } else {
           monstre=node.slice(3);
       }
	}
}

//var MeID=monstre.slice(monstre.indexOf('(')+1,monstre.indexOf(')'));
var MeID=document.getElementsByName('ai_IDPJ')[0].value;
//var MeID=document.ActionForm.ai_IDPJ.value;
var fullname=monstre.slice(0,monstre.indexOf(']')+1); 
var str='&nom[]='+escape(fullname)+'$'+MeID;

var eventCdM = new Array();
var eventInsulte = new Array(); 
var eventAttaque = new Array();
var _eventCdM = new Array();
var _eventAttaque = new Array();

var totaltab=document.getElementsByTagName('table');
//if (listeCDM.length>0) var x_events = totaltab[4].childNodes[1].childNodes; else 
var x_events = totaltab[3].getElementsByTagName('tbody')[0].getElementsByTagName('tr');
var fromDate="01/01/1980 00:00:00"; // Need fromDate even if no event is present
var toDate="31/12/2199 23:59:59"; // Need fromDate even if no event is present
try {
  toDate=x_events[0].childNodes[1].childNodes[0].nodeValue;
} catch(err) {}
try {
  fromDate=x_events[x_events.length-1].childNodes[1].childNodes[0].nodeValue;
} catch(err) {} 

var url = ZZDB+"/mzMEvent.php?&num="+numTroll+"&fromDate="+fromDate+"&toDate="+toDate+"&MeID="+MeID+str;
//console.log(url);
MZ_xmlhttpRequest({
				method: 'GET',
				url: url,
				headers : {
					'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
					'Accept': 'application/atom+xml,application/xml,text/xml'
				},
				onload: function(responseDetails) {
					try
					{
						var texte = responseDetails.responseText;

						var lines = texte.split(";");
						if(lines.length==0)
							return;
						for(var j=0;j<lines.length;j++)
						{
								var  xl = lines[j].split("]=");
								if (xl.length==2) 
								{
									var varname=xl[0].substr(0,xl[0].indexOf("["));
								    //var idx=xl[0].slice(xl[0].indexOf("[")+1, xl[0].indexOf("]"));
								    var idx=xl[0].substr(xl[0].indexOf("[")+1);
									var xv=xl[1].slice(xl[1].indexOf('("')+2, xl[1].length-1);
									var values=xv.split('","');
									if (varname=="eventAttaque") {
	 									eventAttaque[idx]=values;
	 									_eventAttaque[idx]=values;			// copie pour tableau recap
	 								} else if (varname=="eventCdM") {
	 									eventCdM[idx]=values;
	 									_eventCdM[idx]=values;				// copie pour tableau recap
	 								} else if (varname=="eventInsulte") {
	 									eventInsulte[idx]=values;
	 								} else if (varname=="listeCDM") {
	 									listeCDM[idx]=values;
	 								}
								} 
						}
	 					putEventMonstre();
	 					if (listeCDM.length > 0) {
                            putBestiaireInfo();
                        }
					}
					catch(e)
					{
					        console.error(e+"/"+xl);
//						alert(e+"/"+xl);
					} 
				}
				});

