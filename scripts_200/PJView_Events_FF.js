/*********************************************************************************
*    This file is part of ZoryaZilla Fusion merged with mountyzilla              *
*********************************************************************************/

/*********************************************************************************/
function roundDate(str1, str2) { // � 15 seconde pr�s!
    var diffDate=Math.round((Date.parse(str1)-Date.parse(str2))/1000);
    if (diffDate<-15) return(diffDate);
    if (diffDate>15) return(diffDate);
    return(0);    
}


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


function putEventTroll() {
	var totaltab=document.getElementsByTagName('table');

	if (cssProfilAvance) {
		var x_events = totaltab[0].childNodes[3].childNodes;
		var i_events=1;
	} else {
		var x_events = totaltab[4].childNodes[1].childNodes;
		var i_events=2;
	}

	var dNode=5;
	var iNode=4;
	var tNode=3;
	var invStr='DEPLACEMENT';
	ZZinitPopup();
		
	//=== partie commune � infomonstres_FF.js (sauf depuis prise ne compte des profils avanc�)
	var newB = document.createElement( 'b' );
	newB.appendChild( document.createTextNode( 'Info' ) );
	if (cssProfilAvance) {
		var newTd = document.createElement( 'th' );
		newTd.setAttribute( 'width', '60' );
		newTd.appendChild( newB );
		newTd.setAttribute( 'class', 'eventType' );
		totaltab[0].childNodes[1].childNodes[1].insertBefore( newTd, totaltab[0].childNodes[1].childNodes[1].childNodes[5] );
	} else {	
		var newTd = document.createElement( 'td' );
		newTd.setAttribute( 'width', '60' );
		newTd.appendChild( newB );
		x_events[0].insertBefore( newTd, x_events[0].childNodes[iNode] );
	}
					
	//var iCdM=eventCdM.length-1; 
	//var iIns=eventInsulte.length-1; 
	//var iAtt=eventAttaque.length-1; 
	var fInfo=false;
	var fcInfo=false;
	var DescEvt=""; 
	for (var i=i_events;i<x_events.length;i+=2) {
  	  fInfo=false;
	  DescEvt=x_events[i].childNodes[dNode].childNodes[1].nodeValue;	// en cas de piege le sens des d�gat est invers� "pi�g� par piegeur" au lieu de "frappeur sur frapp�"
	  if ((x_events[i].childNodes[tNode].childNodes[0].nodeValue.indexOf(invStr)>=0) && (x_events[i].childNodes[dNode].childNodes[3])) DescEvt=x_events[i].childNodes[dNode].childNodes[3].nodeValue;
	  if ((DescEvt) && (DescEvt.slice(DescEvt.indexOf('\(')+2, DescEvt.indexOf('\)')-1)==evtTroll)) {    // 		diff�rence 	 infomonstres_FF.js  et PJView_Events.js  (control suppl�mentaire)
	  if (x_events[i].childNodes[dNode].childNodes[3]) {
	  	if (x_events[i].childNodes[tNode].childNodes[0].nodeValue.indexOf(invStr)>=0) DescEvt=x_events[i].childNodes[dNode].childNodes[1].nodeValue;
 	    else DescEvt=x_events[i].childNodes[dNode].childNodes[3].nodeValue; 			        

		var iAtt=eventAttaque.length-1; 
		var iCdM=eventCdM.length-1; 
		var iIns=eventInsulte.length-1; 

 	    while ((iIns>=0) && (fInfo==false)) {
		 	    if (roundDate(eventInsulte[iIns][0], x_events[i].childNodes[1].childNodes[0].nodeValue)==0) {
			 	// Controle du N� de Troll/Comp
			    if (    (x_events[i].childNodes[tNode].childNodes[0].nodeValue.indexOf('COMPETENCE')>=0)
			         && (DescEvt.slice(DescEvt.indexOf('\(')+2, DescEvt.indexOf('\)')-1)==eventInsulte[iIns][4]))
				{
					fInfo=true;
					x_events[i].childNodes[tNode].childNodes[0].nodeValue='Insulte';
					var newB = document.createElement( 'h' );
					if (eventInsulte[iIns][1]==1) 
						newB.appendChild( document.createTextNode( 'R�ussie' ) );
					else
						newB.appendChild( document.createTextNode( 'R�sist�e' ) );				
					var newTd = document.createElement( 'td' );
					newTd.setAttribute( 'align', 'center' );
			  		//newTd.setAttribute('title','SR='+ eventInsulte[iIns][2]+' (RM du monstre'+ eventInsulte[iIns][3]+')');
			  		span='SR='+ eventInsulte[iIns][2]+' (RM du monstre'+ eventInsulte[iIns][3]+')';
					newTd.setAttribute("texteinfo",span);
					newTd.setAttribute("imageinfo","Insulte");
					newTd.addEventListener("mouseover", ZZshowPopup,true);
					newTd.addEventListener("mouseout", ZZhidePopup,true);
			  		
					newTd.appendChild( newB );
					x_events[i].insertBefore( newTd , x_events[i].childNodes[iNode] );	
					eventInsulte.splice(iAtt,1);	//iIns--; (on retire l'�l�ment du tableau plutot que de d�cr�menter					
		 	        break;
		 	    } else {
					iIns--;
		 	    }
	 	    } else if (roundDate(eventInsulte[iIns][0], x_events[i].childNodes[1].childNodes[0].nodeValue)<0) {
	 	        break;
	 	    } else {
				iIns--;
	 	    }
	 	} 		 	  

 	    while ((iCdM>=0) && (fInfo==false)) {
			if  (roundDate(eventCdM[iCdM][0], x_events[i].childNodes[1].childNodes[0].nodeValue)==0) { 
			 	// Controle du N� de Troll/Comp
			    if (    (x_events[i].childNodes[tNode].childNodes[0].nodeValue.indexOf('COMPETENCE')>=0)
			         && (DescEvt.slice(DescEvt.indexOf('\(')+2, DescEvt.indexOf('\)')-1)==eventCdM[iCdM][4]))
				{
					fInfo=true;
					x_events[i].childNodes[tNode].childNodes[0].nodeValue='CdM';
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
					x_events[i].insertBefore( newTd , x_events[i].childNodes[iNode] );	
					eventCdM.splice(iAtt,1);	//iCdM--; (on retire l'�l�ment du tableau plutot que de d�cr�menter
		 	        break;
		 	    } else {
					iCdM--;
		 	    }
	 	    } else if (roundDate(eventCdM[iCdM][0],x_events[i].childNodes[1].childNodes[0].nodeValue)<0) {
	 	        break;
	 	    } else {
				iCdM--;
	 	    }
	 	} 
 	    while ((iAtt>=0) && (fInfo==false)) {
	 	    if (roundDate(eventAttaque[iAtt][0],x_events[i].childNodes[1].childNodes[0].nodeValue)==0) {
			    if ((  ((x_events[i].childNodes[tNode].childNodes[0].nodeValue.indexOf('SORTILEGE')>=0) && (eventAttaque[iAtt][3]=='Explosion'))
					   || (x_events[i].childNodes[tNode].childNodes[0].nodeValue.indexOf('COMBAT')>=0)||(x_events[i].childNodes[tNode].childNodes[0].nodeValue.indexOf('MORT')>=0)||(x_events[i].childNodes[tNode].childNodes[0].nodeValue.indexOf('DEPLACEMENT')>=0))
			         && (DescEvt.slice(DescEvt.indexOf('\(')+2, DescEvt.indexOf('\)')-1)==Math.abs(eventAttaque[iAtt][1])))
				{

			 	// Controle du N� de Troll/Combat (deplacementpourles pieges)
					fInfo=true;
					x_events[i].childNodes[tNode].childNodes[0].nodeValue=eventAttaque[iAtt][3];
					var newB = document.createElement( 'h' );
					if ((eventAttaque[iAtt][9]>0) && (eventAttaque[iAtt][7]==0)&&(eventAttaque[iAtt][2]==0)) {
						newB.appendChild( document.createTextNode( "Rat�" ) );				
					} else {
						newB.appendChild( document.createTextNode( "-"+eventAttaque[iAtt][2]+" PV" ) );				
					}
					var span='';					
					if (eventAttaque[iAtt][2]>0) {
				  		span=span+'D�g�ts=<b>'+eventAttaque[iAtt][2]+' PV</b><br>';
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
					x_events[i].insertBefore( newTd , x_events[i].childNodes[iNode] );	
					eventAttaque.splice(iAtt,1);	//iAtt--; (on retire l'�l�ment du tableau plutot que de d�cr�menter
		 	        break;
		 	    } else {
					iAtt--;
		 	    }
	 	    } else if (roundDate(eventAttaque[iAtt][0],x_events[i].childNodes[1].childNodes[0].nodeValue)<0) {
	 	        break;
	 	    } else {
				iAtt--;
	 	    }
	 	}}} 	//	diff�rence 	 	    infomonstres_FF.js  et PJView_Events.js 
		if (fInfo==false) {
			x_events[i].insertBefore( document.createElement('td') , x_events[i].childNodes[iNode] );	
		} else {
		 	fcInfo=true;
		}
	}
	if (fcInfo==false) {  // pas d'info on d�monte la colonne
		if (cssProfilAvance) {
			totaltab[0].childNodes[1].childNodes[1].removeChild( newTd, totaltab[0].childNodes[1].childNodes[1].childNodes[5] );
		} else {
			x_events[0].removeChild( x_events[0].childNodes[iNode] );	
		}
		for (var i=i_events;i<x_events.length;i+=2) {
			x_events[i].removeChild( x_events[i].childNodes[iNode] );	
		}
	//=== Fin partie commune � infomonstres_FF.js => qui affiche un tableau r�cap
	}
}

// D�but Du script ITM Event
var numTroll = MZ_getValue("NUM_TROLL");
var evtTroll = document.getElementsByName('ai_IDPJ')[0].value;		
var listeCDM=new Array();
var eventCdM = new Array();
var eventInsulte = new Array(); 
var eventAttaque = new Array();
var totaltab=document.getElementsByTagName('table');


// d�tection des profil �tendu, la structure des tables est diff�rente pour ceux l�!!!
var cssProfilAvance=false;
var nodes = document.evaluate("//th[@class = 'eventDescription']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
if (nodes.snapshotLength > 0) cssProfilAvance=true;

if (cssProfilAvance) {
	var x_events = totaltab[0].childNodes[3].childNodes;
	var toDate=x_events[1].childNodes[1].childNodes[0].nodeValue;
	var fromDate=x_events[x_events.length-2].childNodes[1].childNodes[0].nodeValue;
} else {
	var x_events = totaltab[4].childNodes[1].childNodes;
	var toDate=x_events[2].childNodes[1].childNodes[0].nodeValue;
	var fromDate=x_events[x_events.length-2].childNodes[1].childNodes[0].nodeValue;
}

//alert(ZZDB+"/mzPEvent.php?&num="+numTroll+"&evtTroll="+evtTroll+"&fromDate="+fromDate+"&toDate="+toDate);
MZ_xmlhttpRequest({
				method: 'GET',
				url: ZZDB+"/mzPEvent.php?&num="+numTroll+"&evtTroll="+evtTroll+"&fromDate="+fromDate+"&toDate="+toDate,
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
	 								} else if (varname=="eventCdM") {
	 									eventCdM[idx]=values;
	 								} else if (varname=="eventInsulte") {
	 									eventInsulte[idx]=values;
	 								}
								} 
						}
	 					if (texte) putEventTroll();
					}
					catch(e)
					{
						alert(e+"/"+xl);
					} 
				}
				});
				
				