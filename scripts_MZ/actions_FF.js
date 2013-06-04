/*********************************************************************************
*    This file is part of ZoryaZilla Fusion merged with mountyzilla              *
*********************************************************************************/
//============================ ZZ PRE CODE =======================================
var IdAttaque = new Array();    // Indice des familles de monstre (pour tabMonstres)
IdAttaque["Rafale Psychique"]="IdSort4";
IdAttaque["Charge"]="IdComp14";
IdAttaque["Attaque Pr�cise"]="IdComp9";
IdAttaque["Botte Secr�te"]="IdComp1";
IdAttaque["Fr�n�sie"]="IdComp7";
IdAttaque["Coup de Butoir"]="IdComp8";
IdAttaque["Projectile Magique"]="IdSort1";
IdAttaque["Vampirisme"]="IdSort3";
IdAttaque["Explosion"]="IdSort8";
IdAttaque["Griffe du Sorcier"]="IdSort28";
IdAttaque["Pi�ge � Feu"]="IdComp15";
IdAttaque["Balayage"]="IdComp6";
IdAttaque["Siphon des �mes"]="IdSort14";

function setDBMsgZZ(msg) { 
	if (document.URL.indexOf("Messagerie/ViewMessageBot.php")>=0) {
		var td = document.evaluate("//td/text()[contains(.,'MOUNTYHALL - La Terre des')]/..", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		if (!td) return false;
		td.innerHTML+="<br><br>"+msg;
	} else {
	  var totaltab=document.getElementsByTagName( 'table' );
	  var myB=document.createElement('i');
	  myB.appendChild(document.createTextNode(msg));
	  myB.setAttribute("class", "titre5");
	  totaltab[totaltab.length-2].appendChild( myB );
	}
}
  
function catchInsulte() {     
   if ((document.URL.indexOf("Play_a_Competence18b.php")>=0) && (MZ_getValue("A_INSULTE") != "")) {  //Le Monstre � �t� insult�
		var ptotal = document.getElementsByTagName('p');
//try {
//alert("p: " + ptotal[4]);
//alert("pc: " + ptotal[4].childNodes[0]);
//alert("pcc: " + ptotal[4].childNodes[0].childNodes[1]);
//alert("pccc: " + ptotal[4].childNodes[0].childNodes[1].childNodes[0]);
//alert("pcccn: " + ptotal[4].childNodes[0].childNodes[1].childNodes[0].nodeValue);
// } catch (e) {}
//try {
//alert("2p: " + ptotal[4]);
//alert("2pc: " + ptotal[4].childNodes[0]);
//alert("2pcn: " + ptotal[4].childNodes[0].nodeValue);
//alert("2pcc: " + ptotal[4].childNodes[0].childNodes[1]);
//alert("2pccn: " + ptotal[4].childNodes[0].childNodes[1].nodeValue);
// } catch (e) {}
		var effect='undefined'; try {effect=ptotal[4].childNodes[0].childNodes[1].childNodes[0].nodeValue; } catch (e) {}
		if (effect!='undefined') {
			var nodes = document.evaluate("//b[contains(preceding::text()[1], 'Seuil de R�sistance')]/text()[1]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			if (nodes.snapshotLength == 1) {
				sr = nodes.snapshotItem(0).nodeValue;
				SR_Cible = sr.slice(0, sr.indexOf("%") - 1);
 				var RM_Cible = getRM(sr);
			}
            var footer2=document.getElementById( 'footer2' );  
            var ts = footer2.innerHTML;
            var TimeStamp=ts.substr(ts.indexOf('GMT')-20, 19).replace(" ", "_");
		    var Insulte=0; if (effect.indexOf('pleinement')!=-1) Insulte=1;
		    var MeID=MZ_getValue("A_INSULTE").slice(3);
		  	var data="&TypeData=Insulte";
			var totaltab=document.getElementsByTagName( 'table' );
			data+="&TimeStamp="+TimeStamp;
		  	data+="&Insulte="+Insulte;
		  	data+="&TiD="+numTroll;
		  	data+="&MeID="+MeID;
		  	data+="&SR="+SR_Cible;
		  	data+="&RM="+escape(RM_Cible);
//alert("insulte: " + ZZDB+'/mzData.php?'+data);
		  	MZ_appendNewScript(ZZDB+'/mzData.php?'+data);
		}
		MZ_setValue("A_INSULTE", ""); // car le remove ne marche pas!
 		MZ_removeValue("A_INSULTE");
  }	else if(document.URL.indexOf("Play_a_Competence18.php")>0) {  //Action Insulter un Monstre
		MZ_setValue("A_INSULTE", ""); // car le remove ne marche pas!
 		MZ_removeValue("A_INSULTE");
		var button = document.getElementsByName('ActionForm')[0];	
		button.addEventListener("click", function() {MZ_setValue("A_INSULTE",document.getElementsByName('ai_IDTarget')[0].value);}, true);
		//button.addEventListener("click", function() {MZ_setValue("A_INSULTE",document.ActionForm.ai_IDTarget.value);}, true);
  }
}

function catchPiege() {     
  if (document.URL.indexOf("Play_a_Competence15b.php")>=0) {  //Un piege � �t� pos�
      var nodes = document.evaluate("//b/text()[contains(.,'Vous avez pos� un Pi�ge')]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      for (var i = 0; i < nodes.snapshotLength; i++) {
        var Piege = nodes.snapshotItem(i).nodeValue;
        var TypePiege = Piege.slice(Piege.indexOf("Pi�ge �")+8, Piege.indexOf("en")-1);        
	    var X=Piege.slice(Piege.indexOf("X =")+4, Piege.indexOf("Y =")-3);
	    var Y=Piege.slice(Piege.indexOf("Y =")+4, Piege.indexOf("N =")-3);
	    var N=Piege.slice(Piege.indexOf("N =")+4, Piege.indexOf("dont")-1);
	    var MM=Piege.slice(Piege.indexOf("est de")+7, Piege.indexOf("."));
	  	var data="&TypeData=Piege";
		var totaltab=document.getElementsByTagName( 'table' );
		var TimeStamp=totaltab[totaltab.length-1].childNodes[1].childNodes[0].childNodes[1].childNodes[3].nodeValue;
		TimeStamp=TimeStamp.substr(TimeStamp.indexOf('GMT')-20, 19);
		TimeStamp=TimeStamp.replace(" ", "_");
		data+="&TimeStamp="+TimeStamp;
	  	data+="&TiD="+numTroll;
	  	data+="&Piege="+TypePiege;	  	
	  	data+="&X="+X;
	  	data+="&Y="+Y;
	  	data+="&N="+N;
	  	data+="&MM="+MM;
	  	MZ_appendNewScript(ZZDB+'/mzData.php?'+data);
      }    
  }	
}

function putInfoTelek(X, Y, N) {
	var isStyleClass = MZ_getValue("USECSS") == "true";
	var totaltd=document.getElementsByTagName('TD');
	var off7=4;
	var s=document.getElementsByName('as_NewPos')[0].value.split('#');
	var h=document.getElementsByName('as_NewPos')[1].value.split('#');
	var v=document.getElementsByName('as_NewPos')[3].value.split('#');
	var f=document.getElementsByName('as_NewPos')[7].value.split('#');
	if ((X==h[0]) && (Y==v[1])) { 
		if(isStyleClass) totaltd[off7+4].setAttribute('class','mh_trolls_amis'); else  totaltd[off7+4].style.backgroundColor='#AAFFAA'; 
	} else if (X==h[0]) { 
		if ((Y<=s[1])&&(Y<=f[1])) {
			if(isStyleClass) totaltd[off7+7].setAttribute('class','mh_trolls_amis'); else  totaltd[off7+7].style.backgroundColor='#AAFFAA'; 
			if(isStyleClass) totaltd[off7+1].setAttribute('class','mh_trolls_ennemis'); else  totaltd[off7+1].style.backgroundColor='#FFAAAA'; 
		}else if ((Y>=s[1])&&(Y>=f[1])) {
			if(isStyleClass) totaltd[off7+1].setAttribute('class','mh_trolls_amis'); else  totaltd[off7+1].style.backgroundColor='#AAFFAA'; 
			if(isStyleClass) totaltd[off7+7].setAttribute('class','mh_trolls_ennemis'); else  totaltd[off7+7].style.backgroundColor='#FFAAAA'; 
 		}
	} else if (Y==v[1]) { 
		if ((X<=s[0])&&(X<=f[0])) {
			if(isStyleClass) totaltd[off7+3].setAttribute('class','mh_trolls_amis'); else  totaltd[off7+3].style.backgroundColor='#AAFFAA'; 
			if(isStyleClass) totaltd[off7+5].setAttribute('class','mh_trolls_ennemis'); else  totaltd[off7+5].style.backgroundColor='#FFAAAA'; 
		} else if ((X>=s[0])&&(X>=f[0])) {
			if(isStyleClass) totaltd[off7+5].setAttribute('class','mh_trolls_amis'); else  totaltd[off7+5].style.backgroundColor='#AAFFAA'; 
			if(isStyleClass) totaltd[off7+3].setAttribute('class','mh_trolls_ennemis'); else  totaltd[off7+3].style.backgroundColor='#FFAAAA'; 
 		}
	} else if ((X<=s[0])&&(X<=f[0])&&(Y<=s[1])&&(Y<=f[1])){ 
		if(isStyleClass) totaltd[off7+6].setAttribute('class','mh_trolls_amis'); else  totaltd[off7+6].style.backgroundColor='#AAFFAA'; 
		if(isStyleClass) totaltd[off7+2].setAttribute('class','mh_trolls_ennemis'); else  totaltd[off7+2].style.backgroundColor='#FFAAAA'; 
	} else if ((X<=s[0])&&(X<=f[0])&&(Y>=s[1])&&(Y>=f[1])){ 
		if(isStyleClass) totaltd[off7].setAttribute('class','mh_trolls_amis'); else  totaltd[off7].style.backgroundColor='#AAFFAA'; 
		if(isStyleClass) totaltd[off7+8].setAttribute('class','mh_trolls_ennemis'); else  totaltd[off7+8].style.backgroundColor='#FFAAAA'; 
	} else if ((X>=s[0])&&(X>=f[0])&&(Y>=s[1])&&(Y>=f[1])){ 
		if(isStyleClass) totaltd[off7+2].setAttribute('class','mh_trolls_amis'); else  totaltd[off7+2].style.backgroundColor='#AAFFAA'; 
		if(isStyleClass) totaltd[off7+6].setAttribute('class','mh_trolls_ennemis'); else  totaltd[off7+6].style.backgroundColor='#FFAAAA'; 
	} else if ((X>=s[0])&&(X>=f[0])&&(Y<=s[1])&&(Y<=f[1])){ 
		if(isStyleClass) totaltd[off7+8].setAttribute('class','mh_trolls_amis'); else  totaltd[off7+8].style.backgroundColor='#AAFFAA'; 
		if(isStyleClass) totaltd[off7].setAttribute('class','mh_trolls_ennemis'); else  totaltd[off7].style.backgroundColor='#FFAAAA'; 
	}
}

function catchTelek() {     
	if (document.URL.indexOf("Play_a_Sort24.php")>=0) {
		X=MZ_getValue(numTroll+".position.X")
		Y=MZ_getValue(numTroll+".position.Y")
		N=MZ_getValue(numTroll+".position.N")
		putInfoTelek(X, Y, N); 
	}
}

function catchIdT2() {     
    if(document.referrer.indexOf("Play_a_Sort10.php")>=0) {
        var nodes = document.evaluate("//b/text()[contains(.,'-')]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		if (nodes.snapshotLength>0) {
			var matosData="";	
	        for (var i = 0; i < nodes.snapshotLength; i++) {
	        	var Tresor = nodes.snapshotItem(i).nodeValue;
    	    	var matosId=Tresor.slice(0, Tresor.indexOf("-")-1);
        		var matosName=Tresor.slice(Tresor.indexOf("-")+1, Tresor.indexOf("(")-1);
        		var matosDesc=Tresor.slice(Tresor.indexOf("(")+1, Tresor.indexOf(")"));
				matosData = matosData+'&Matos[]='+URLencode('Tr�sor : ' + matosName);					      		
				matosData = matosData+'&MiD[]='+matosId;		      
				matosData = matosData+'&Desc[]='+URLencode(matosDesc);					      
				matosData = matosData+'&Etat[]='+URLencode('[Identifi� au sol]');				      
				matosData = matosData+'&Vu[]=0';
	        }    
  		    var data="&TypeData=IdT";
  	    	data+="&TiD="+numTroll+matosData;
		    //alert(ZZDB+'/mzData.php?'+data);
		    MZ_appendNewScript(ZZDB+'/mzData.php?'+data);
		}
    }	
}

function getDataSort(SortComp, mm, Code) {
  	var strData="";
	var DEG_Cible=0;
	var ARM_Cible=0;
	var ESQ_Cible=-1;
	var ageM="";
	
	// recup�ration de l'id/age
  	var cible = Code.substr(Code.indexOf("<li>")+4);
  	if (cible.indexOf("n�")>0) 
		MeID=Number(cible.substring(cible.indexOf("n�")+2,cible.indexOf(")")));	//Id 
  	else
		MeID=Number(cible.substring(cible.indexOf("(")+1,cible.indexOf(")")));	//Id 
	if (((cible.indexOf("un")==0)||(cible.indexOf("<b>un")==0))&& (cible.indexOf("[")>0)&& (cible.indexOf("]")>0))	
		ageM=cible.slice(cible.indexOf("[")+1, cible.indexOf("]"));			//age du monstre
	else 
		MeID=-MeID;															//Id n�gatif pour les trolls
	// recup�ration des d�gats
	if (Code.indexOf("PV :")>0) {
		var pv=Code.substring(Code.indexOf("PV :"));
		DEG_Cible=-parseInt(pv.slice(pv.indexOf("(")+1, pv.indexOf(")")));	
	}
	// recup�ration du sr
	if (Code.indexOf("R�sistance de la Cible")>0) {
		var sr=Code.substring(Code.indexOf("R�sistance de la Cible"));
		sr=sr.slice(sr.indexOf(":")+1, sr.indexOf("%"));
		if (sr.indexOf("<b>")>=0) sr=sr.substr(sr.indexOf("<b>")+3);
		sr=parseInt(sr.slice(sr.indexOf(":")+1, sr.indexOf("%")));
		SR_Cible=sr;
  		if(sr==10) RM_Cible="<"+Math.round((sr*mm)/50);  			
		else if(sr<=50) RM_Cible="="+Math.round((sr*mm)/50);   			
		else if(sr<90) RM_Cible="="+Math.round(50*mm/(100-sr));  			
		else RM_Cible=">"+Math.round(50*mm/(100-sr));	
	} 
	return "&MeID[]="+MeID+"&AGE[]="+ageM+"&ESQ[]="+ESQ_Cible+"&DEG[]="+DEG_Cible+"&ARM[]="+ARM_Cible+"&SR[]="+SR_Cible+"&RM[]="+RM_Cible;
}

function getDataAttaque(SortComp, mm, Code) {
  	var strData="";
	var DEG_Cible=0;
	var ARM_Cible=-1;
	var ESQ_Cible=-1;
	var RM_Cible=0;
	var SR_Cible=0;
	var ageM="";
	var sr=0;
  	var lines = Code.split("<p>");
	MeID=Number(lines[0].substring(lines[0].indexOf("(")+1,lines[0].indexOf(")")));	//Id n�gatif pour les trolls, positif pour les monstres
	if (lines[0].indexOf("le Troll")==0) {
		MeID=-MeID;
	} else {
		ageM=lines[0].slice(lines[0].indexOf("[")+1, lines[0].indexOf("]"));
	}
  	for (var j=1; j<lines.length; j++) {
	      	var line=lines[j].split('<br>');
	  	for (var i=0;i<line.length;i++) {
	      		var l=line[i];
	  		if (l.indexOf("Esquive de votre adversaire est de")>0) {
				ESQ_Cible=parseInt(l.slice(48));
	  		} else if (l.indexOf("lui avez inflig�")>0) {
				DEG_Cible=parseInt(l.substr(25), "point");
	  		} else if (l.indexOf("Armure le prot�ge")>0) {
				ARM_Cible=parseInt(l.substr(45), "point");
	  		} else if (l.indexOf("de R�sistance de la Cible")>0) {
				sr=parseInt(l.substr(41), "%");
			}
		}
	}
  
	if (sr>0) // le 0 est impossible, c'est que ce n'est pas une attaque magique
	{	
		SR_Cible=sr;
  		if (sr==10) {
			RM_Cible="<"+Math.round((sr*mm)/50);  			
		} else if (sr<=50) {
			RM_Cible="="+Math.round((sr*mm)/50);   			
		} else if (sr<90) {
			RM_Cible="="+Math.round(50*mm/(100-sr));  			
		} else {
			RM_Cible=">"+Math.round(50*mm/(100-sr));
		}
	}					  
	if (ARM_Cible==-1) {
		ARM_Cible=0;
	} else {
	  	ARM_Cible=DEG_Cible-ARM_Cible;
	  	DEG_Cible=DEG_Cible-ARM_Cible; 
	}
	if (SortComp=='IdComp1') {
		ARM_Cible=2*ARM_Cible;	// Pour BS: seulement 50% de l'armure physique est prose en compte
	}
        var result = "&MeID[]="+MeID+"&AGE[]="+ageM+"&ESQ[]="+ESQ_Cible+"&DEG[]="+DEG_Cible+"&ARM[]="+ARM_Cible+"&SR[]="+SR_Cible+"&RM[]="+RM_Cible;
	return result;
}  
  
function catchAttaque() {
	if ((document.URL.indexOf("Play_a_Combat.php")>=0) || (document.URL.indexOf("Play_a_SortResult.php")>=0)) 
	{
		if (document.URL.indexOf("Play_a_SortResult.php")>=0) {	// cas d'une xplo, on v�rifie que s'en est bien une
			var nodes = document.evaluate("//b/text()[contains(.,'Explosion')]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			if (nodes.snapshotLength<=0) return;
		}
		
		var SR_Cible=0;
		var RM_Cible=0;
		var REG_Cible=0;
		var NIV_Cible=0;
		var ATTAQUE=0;	
	  	var numTroll=MZ_getValue("NUM_TROLL");
	  	var nt=MZ_getValue("NIV_TROLL");
	  	var mm=MZ_getValue("MM_TROLL");
		// recherche du niveau de la Cible
  		var nodes = document.evaluate("//b/text()[contains(.,'TU�')]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  		if (nodes.snapshotLength==1) { // 1 seul kill 
	  		nodes = document.evaluate("//b/text()[contains(.,'PX')]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	  		if (nodes.snapshotLength==1) { // 1 seul kill gain de PX
			  	var gain=nodes.snapshotItem(0).nodeValue;
				nbPX = parseInt(nodes.snapshotItem(0).nodeValue, "PX");	
  				if (nbPX>0) // on a un gain de PX
				{		
	  				var divList=document.getElementsByTagName( 'div' ); 
					var comPX = 1;
					if (divList[2].childNodes[0].nodeValue.indexOf("Attaque Normale") == -1) comPX++;  // Si c'est une attaque normale, un seul PX
					NIV_Cible = (nbPX * 1 + 2 * nt - 10 - comPX) / 3;
					var b=nodes.snapshotItem(0);
					insertText(b.parentNode.nextSibling, " (Niveau de la cible:"+NIV_Cible+")");					
			    }
  			}
 		}
 		
		// recherche du malus de rafale
  		nodes = document.evaluate("//p/text()[contains(.,'Il aura, de plus, un malus de')]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  		for (var i = 0; i < nodes.snapshotLength; i++)
  		{
    		var node = nodes.snapshotItem(i);
    		sReg=node.nodeValue;
    		REG_Cible=REG_Cible+parseInt(sReg.slice(30), "point");
    		if (sReg.indexOf("pour sa prochaine")>0) {
    			REG_Cible="1x"+REG_Cible;	// rafale r�sist�e
    		} else {
    			REG_Cible="2x"+REG_Cible;
    		}
  		}
		// recherche du malus de GdS
  		nodes = document.evaluate("//text()[contains(.,'malus de Poison')]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  		for (var i = 0; i < nodes.snapshotLength; i++) {
	    		var node = nodes.snapshotItem(i);
	    		sReg=node.nodeValue;
	    		REG_Cible=REG_Cible+parseInt(sReg.slice(19), "PV");
	    		var xnodes = document.evaluate("//text()[contains(.,'prochain')]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	    		var xnode = xnodes.snapshotItem(0);
  			if (nodes.snapshotLength==1) {
	    			sReg=xnode.nodeValue;
		    		if (sReg.indexOf("pour ses")>0) {
			    		REG_Cible=String(parseInt(sReg.slice(9), "prochain"))+"x"+REG_Cible;	//poison sur plusieuer tours
				} else {
		    			REG_Cible="1x"+REG_Cible;	// poison pendant 1 tour
				}
			} 
  		}
  
  		// d�termination de la compt/sorti
   		var nodes = document.evaluate("//div/text()[contains(.,'R�sultat')]", document, null,XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
   		if (nodes) {
			ATTAQUE=IdAttaque[nodes.nodeValue.substring(nodes.nodeValue.indexOf(":")+2)];
			if (!ATTAQUE) {
				ATTAQUE=0;
			}
		} 
		if (ATTAQUE==0) {
	  		// recherche des la comp�tense ou sortil�ge utilis� (on tente l'ancienne m�thode si la nouvelle ne fonctionne pas)
	  		var url=document.referrer;
	  		url=url.substring(url.indexOf('/Actions')+9);
	  		if(url.indexOf("ai_IdComp") != -1) {
		      		url=url.substring(url.indexOf('ai_IdComp')+10)
		      		url=url.substring(0,url.indexOf('&'));
		      		ATTAQUE="IdComp"+url;
		  	} else if(url.indexOf("ai_IdSort") != -1) {
		      		url=url.substring(url.indexOf('ai_IdSort')+10)
		      		ATTAQUE="IdSort"+url;
	  		}  
  		}
  		
		// recherche des donn�es de l'attaque, Cible(s), esquive, etc...
  		var DataAttaque=""; 
//alert("tables: " + document.getElementsByTagName('table').length);
   		var Code=document.getElementsByTagName('table')[0].innerHTML;
//alert("Code: " + Code);
  		//var Code=document.getElementsByName('ActionForm')[0].innerHTML;
  		//Code=Code.substr(0, Code.indexOf("<input name"));
  		var bloc = Code.split("Vous avez attaqu� ");
//alert("bloc.length: " + bloc.length);
  		if (bloc.length>1) {
	      		for(var i=1;i<bloc.length;i++) {
//alert("bloc["+i+"]: " + bloc[i]);
				var iData = getDataAttaque(ATTAQUE, mm, bloc[i]);
//alert("bloc["+i+"] (DA): " + iData);
				DataAttaque+=iData ;
			}
  		} else {
	      		var bloc = Code.split("a eu l'effet suivant :");
//alert("bloc2.length: " + bloc.length);
	      		for(var i=1;i<bloc.length;i++) {
//alert("bloc2["+i+"]: " + bloc[i]);
				var iData = getDataSort(ATTAQUE, mm, bloc[i]);
//alert("bloc2["+i+"] (DA): " + iData);
				DataAttaque+=iData; 
			}
  		}
		// envoy� le r�sultat � ZZ
  		if (DataAttaque!="") {	
	  		var data="&TypeData=Attaque";
//	 		var totaltab=document.getElementsByTagName( 'table' );
//	 		var TimeStamp=totaltab[totaltab.length-1].childNodes[1].childNodes[0].childNodes[1].childNodes[3].nodeValue;
//	  		TimeStamp=TimeStamp.substr(TimeStamp.indexOf("/")-2, 19).replace(" ", "_");
                        var footer2=document.getElementById( 'footer2' );  
		        var ts = footer2.innerHTML;
		        var TimeStamp=ts.substr(ts.indexOf('GMT')-20, 19);
		        TimeStamp=TimeStamp.replace(" ", "_");
	  		data+="&TimeStamp="+TimeStamp;
	  		data+="&TiD="+numTroll;
	  		data+="&Attaque="+ATTAQUE;
	  		data+="&REG="+REG_Cible;
	  		data+="&NIV="+NIV_Cible;
	  		data+=DataAttaque;
	  
//alert(data);
	  		MZ_appendNewScript(ZZDB+'/mzData.php?'+data);
  		}
	}  
}

function catchBOTDegatPiege() {     
	if (document.URL.indexOf("Messagerie/ViewMessageBot.php")>=0) {
		var messageTitle = document.getElementsByTagName('table')[0].childNodes[1].childNodes[0].childNodes[1].childNodes[0].childNodes[1].firstChild.nodeValue;
		if (messageTitle.indexOf("[MountyHall] D�clenchement de Pi�ge") != -1) {
			var td = document.evaluate("//td/text()[contains(.,'a d�clench� votre Pi�ge � Feu')]/..", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			if (!td) return "";
		
			var DataAttaque="";
			var piege = td.innerHTML;
			var deg_monstre=piege;
			while (deg_monstre.indexOf("Le Monstre")>0) {
				var monstre=deg_monstre.substring(deg_monstre.indexOf("Le Monstre"));
				var deg=monstre.substring(monstre.indexOf("<br>")+4);
				var deg_monstre=deg.substring(deg.indexOf("<br>")+4);
				monstre=monstre.substring(0, monstre.indexOf("<br>"));
				deg=deg.substring(0, deg.indexOf("<br>"));
				var MeID=Number(monstre.substring(monstre.indexOf("(")+1,monstre.indexOf(")")));
				var ageM=monstre.slice(monstre.indexOf("[")+1, monstre.indexOf("]"));
				var DEG_Cible=deg.slice(10, deg.indexOf("points")-1);
				DataAttaque+="&MeID[]="+MeID+"&AGE[]="+ageM+"&DEG[]="+DEG_Cible+"&ESQ[]=-1&ARM[]=0&SR[]=0&RM[]=0";				
			}
			var deg_troll=piege;
			while (deg_troll.indexOf("Le Monstre")>0) {
				var troll=deg_troll.substring(deg_troll.indexOf("Le Troll"));
				var deg=troll.substring(troll.indexOf("<br>")+4);
				var deg_troll=deg.substring(deg.indexOf("<br>")+4);
				troll=troll.substring(0, troll.indexOf("<br>"));
				deg=deg.substring(0, deg.indexOf("<br>"));
				var MeID=-Number(troll.substring(troll.indexOf("(")+1,troll.indexOf(")")));		// Id negatif pour les troll
				var DEG_Cible=deg.slice(10, deg.indexOf("points")-1);
				DataAttaque+="&MeID[]="+MeID+"&DEG[]="+DEG_Cible+"&AGE[]=0&ESQ[]=-1&ARM[]=0&SR[]=0&RM[]=0";				
			}
			
			var TimeStamp=piege.substring(piege.indexOf("Il �tait alors"));
    		TimeStamp=TimeStamp.substring(TimeStamp.indexOf(":")+2);
			TimeStamp=TimeStamp.substring(0,TimeStamp.indexOf(".")).replace(" ", "_");
	  		var data="&TypeData=Attaque";
	  		data+="&TimeStamp="+TimeStamp;
	  		data+="&TiD="+numTroll;
	  		data+="&Attaque=IdComp15&REG=0&NIV=0";		//Comp�tence15=piege
	  		data+=DataAttaque;
	  
	  		//alert(ZZDB+'/mzData.php?'+data);
	  		MZ_appendNewScript(ZZDB+'/mzData.php?'+data);

		}
  }	
}

function catchBOTIdT2() {     
	if (document.URL.indexOf("Messagerie/ViewMessageBot.php")>=0) {
		var messageTitle = document.getElementsByTagName('table')[0].childNodes[1].childNodes[0].childNodes[1].childNodes[0].childNodes[1].firstChild.nodeValue;
		if (messageTitle.indexOf("[MountyHall] Sortil�ge : Identification des tr�sors") != -1) {
			var td = document.evaluate("//td/text()[contains(.,'MOUNTYHALL - La Terre des Tr�lls')]/..", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			if (!td) return "";
			var IdT = td.innerHTML;
			var TimeStamp=IdT.substring(IdT.indexOf("Il �tait alors"));
    		TimeStamp=TimeStamp.substring(TimeStamp.indexOf(":")+2);
			TimeStamp=TimeStamp.substring(0,TimeStamp.indexOf(".")).replace(" ", "_");
			
			IdT=IdT.substring(IdT.indexOf("identification a donn� le r�sultat suivant"));
			var Tresor=IdT.substring(IdT.indexOf("</p><b>")+7);
			Tresor=Tresor.substring(0, Tresor.indexOf("</b>"));
			
			var matosEtat='[Identification]';
			if (IdT.indexOf("Le tr�sor se trouve � vos pieds")>0) matosEtat='[Identifi� au sol]';
			
        	var matosId=Tresor.slice(0, Tresor.indexOf("-")-1);
       		var matosName=Tresor.slice(Tresor.indexOf("-")+1, Tresor.indexOf("(")-1);
        	var matosDesc=Tresor.slice(Tresor.indexOf("(")+1, Tresor.indexOf(")"));
			var matosData="";	
			matosData = matosData+'&TimeStamp[]='+TimeStamp;					      		
			matosData = matosData+'&Matos[]='+URLencode('Tr�sor : ' + matosName);					      		
			matosData = matosData+'&MiD[]='+matosId;		      
			matosData = matosData+'&Desc[]='+URLencode(matosDesc);					      
			matosData = matosData+'&Etat[]='+URLencode(matosEtat);				      
			matosData = matosData+'&Vu[]=0';
	  		var data="&TypeData=IdT&TiD="+numTroll+matosData;
			//alert(ZZDB+'/mzData.php?'+data);
			MZ_appendNewScript(ZZDB+'/mzData.php?'+data);
	    }
   }	
}

function catchBOTInsulte() {     
	if (document.URL.indexOf("Messagerie/ViewMessageBot.php")>=0) {
		var messageTitle = document.getElementsByTagName('table')[0].childNodes[1].childNodes[0].childNodes[1].childNodes[0].childNodes[1].firstChild.nodeValue;
		if (messageTitle.indexOf("[MountyHall] Comp�tence Insulte") != -1) {
			var td = document.evaluate("//td/text()[contains(.,'MOUNTYHALL - La Terre des Tr�lls')]/..", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			if (!td) return "";
			var Insulte = td.innerHTML;
			var TimeStamp=Insulte.substring(Insulte.indexOf("Il �tait alors"));
    		TimeStamp=TimeStamp.substring(TimeStamp.indexOf(":")+2);
			TimeStamp=TimeStamp.substring(0,TimeStamp.indexOf(".")).replace(" ", "_");
			
			var sr=Insulte.substring(Insulte.indexOf("Seuil de R�sistance de la Cible"));
			sr=sr.substring(sr.indexOf("<b>")+3, sr.indexOf("%")+1);
 			var RM_Cible = getRM(sr);
			var SR_Cible=sr.substring(0, sr.indexOf("%"));
		    var Ins=0; if (Insulte.indexOf("pleinement l'effet")!=-1) Ins=1;
		    var MeID=messageTitle.slice(messageTitle.indexOf("(")+1, messageTitle.indexOf(")"))
		    
		  	var data="&TypeData=Insulte";
			data+="&TimeStamp="+TimeStamp;
		  	data+="&Insulte="+Ins;
		  	data+="&TiD="+numTroll;
		  	data+="&MeID="+MeID;
		  	data+="&SR="+SR_Cible;
		  	data+="&RM="+escape(RM_Cible);
		  	//alert(ZZDB+'/mzData.php?'+data);
		  	MZ_appendNewScript(ZZDB+'/mzData.php?'+data);
	    }
   }	
}

function catchBOTAttaque() {     
	if (document.URL.indexOf("Messagerie/ViewMessageBot.php")>=0) {
		var messageTitle = document.getElementsByTagName('table')[0].childNodes[1].childNodes[0].childNodes[1].childNodes[0].childNodes[1].firstChild.nodeValue;
		if ((messageTitle.indexOf("[MountyHall] R�sultat de Combat - Attaquant") != -1)||
			(messageTitle.indexOf("[MountyHall] Attaquant -") != -1)||
		    (messageTitle.indexOf("[MountyHall] Sortil�ge : Explosion") != -1)) {
			var td = document.evaluate("//td/text()[contains(.,'MOUNTYHALL - La Terre des Tr�lls')]/..", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			if (!td) return "";
			var Combat = td.innerHTML;
			var SR_Cible=0;
			var RM_Cible=0;
			var REG_Cible=0;
			var NIV_Cible=0;
			var ATTAQUE=0;	
		  	var numTroll=MZ_getValue("NUM_TROLL");
		  	var nt=MZ_getValue("NIV_TROLL");
	  		var mm=MZ_getValue("MM_TROLL");
			// recherche des la comp�tense ou sortil�ge utilis� IMPOSSIBLE avec le BOT, on sait juste si Sort ou Comp.
		    if (messageTitle.indexOf("[MountyHall] Sortil�ge : Explosion") != -1) var ATTAQUE="IdSort8";   
		    else if (messageTitle.indexOf("(Rafale Psychique)") != -1) var ATTAQUE="IdSort4";  
		    else if (messageTitle.indexOf("(Charge)") != -1) var ATTAQUE="IdComp14";  
		    else if (messageTitle.indexOf("(Attaque Pr�cise)") != -1) var ATTAQUE="IdComp9";  
		    else if (messageTitle.indexOf("(Botte Secr�te)") != -1) var ATTAQUE="IdComp1";  
		    else if (messageTitle.indexOf("(Fr�n�sie)") != -1) var ATTAQUE="IdComp7";  
		    else if (messageTitle.indexOf("(Coup de Butoir)") != -1) var ATTAQUE="IdComp8";  
		    else if (messageTitle.indexOf("(Projectile Magique)") != -1) var ATTAQUE="IdSort1";  
		    else if (messageTitle.indexOf("(Vampirisme)") != -1) var ATTAQUE="IdSort3";  
		    else if (messageTitle.indexOf("(Griffe du Sorcier)") != -1) var ATTAQUE="IdSort28";  
		    else if (messageTitle.indexOf("(Pi�ge � Feu)") != -1) var ATTAQUE="IdComp15";  
		    else if (messageTitle.indexOf("(Balayage)") != -1) var ATTAQUE="IdComp6";  
		    else if (messageTitle.indexOf("(Siphon des �mes)") != -1) var ATTAQUE="IdSort14";  
			else {
	  			nodes = document.evaluate("//td/text()[contains(.,'gr�ce � une comp�tence')]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  				if (nodes.snapshotLength>0) var ATTAQUE="IdComp"; else var ATTAQUE="IdSort";  
			}
			
			// recherche du niveau de la Cible => impossible sur le BOT, le troll a p�t changer de niveau
			//...
			 		
			// recherche du malus de rafale
  			nodes = document.evaluate("//p/text()[contains(.,'Il aura, de plus, un malus de')]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  			for (var i = 0; i < nodes.snapshotLength; i++)
  			{
    			var node = nodes.snapshotItem(i);
	    		sReg=node.nodeValue;
    			REG_Cible=REG_Cible+parseInt(sReg.slice(30), "point");
    			if (sReg.indexOf("pour sa prochaine")>0) {
    				REG_Cible="1x"+REG_Cible;	// rafale r�sist�e
	    		} else {
    				REG_Cible="2x"+REG_Cible;
    			}
	      		ATTAQUE="IdSort4";		// Code rafale
	  		}
			// recherche du malus de GdS
  			nodes = document.evaluate("//text()[contains(.,'malus de Poison')]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	  		for (var i = 0; i < nodes.snapshotLength; i++)
  			{
    			var node = nodes.snapshotItem(i);
	    		sReg=node.nodeValue;
	    		REG_Cible=REG_Cible+parseInt(sReg.slice(19), "PV");
		    		var xnodes = document.evaluate("//text()[contains(.,'prochain')]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	    		var xnode = xnodes.snapshotItem(0);
	  			if (nodes.snapshotLength==1) {
		    		sReg=xnode.nodeValue;
		    		if (sReg.indexOf("pour ses")>0) {
			    		REG_Cible=String(parseInt(sReg.slice(9), "prochain"))+"x"+REG_Cible;	//poison sur plusieuer tours
						} else {
		    			REG_Cible="1x"+REG_Cible;	// poison pendant 1 tour
					}
				} 
	      		ATTAQUE="IdSort28";		// Code GdS
  			}
  
  
			// recherche des donn�es de l'ttaque, Cible(s), esquive, etc...
	  		var DataAttaque=""; 
	   		var Code=document.getElementsByTagName('table')[0].innerHTML;
	  		//var Code=document.getElementsByName('ActionForm')[0].innerHTML;
	  		//Code=Code.substr(0, Code.indexOf("<input name"));
	  		var bloc = Code.split("Vous avez attaqu� ");
	  		if (bloc.length>1) 
			{
	      		for(var i=1;i<bloc.length;i++) DataAttaque+=getDataAttaque(ATTAQUE, mm, bloc[i]); 
	  		} else {
	      		var bloc = Code.split("a eu l'effet suivant :");
	      		for(var i=1;i<bloc.length;i++) DataAttaque+=getDataSort(ATTAQUE, mm, bloc[i]); 
	  		}
			// envoy� le r�sultat � ZZ
  			if (DataAttaque!="") 
			{	
	  			var data="&TypeData=Attaque";
				var TimeStamp=Combat.substring(Combat.indexOf("Il �tait alors"));
    			TimeStamp=TimeStamp.substring(TimeStamp.indexOf(":")+2);
				TimeStamp=TimeStamp.substring(0,TimeStamp.indexOf(".")).replace(" ", "_");
	  		
	  			data+="&TimeStamp="+TimeStamp;
		  		data+="&TiD="+numTroll;
		  		data+="&Attaque="+ATTAQUE;
	  			data+="&REG="+REG_Cible;
	  			data+="&NIV="+NIV_Cible;
		  		data+=DataAttaque;
	  
	  			//alert(ZZDB+'/mzData.php?'+data);
		  		MZ_appendNewScript(ZZDB+'/mzData.php?'+data);
  			}
	    }
   }	
}

function catchVL() {
	if (document.URL.indexOf("Play_a_SortResult.php")>=0) 
	{
		if(!document.evaluate("//tr/td/descendant::p/text()[contains(., 'Zone centrale cibl�e')]",document, null, XPathResult.STRING_TYPE, null).stringValue) return; 
		var totaltab = document.getElementsByTagName('table');
		
		node=document.evaluate("//tr/td/descendant::b/text()[contains(., 'X = ')]",document, null, XPathResult.STRING_TYPE, null).stringValue;
		var a = node.split("|");
		var posX = parseInt(a[0].substring(4));
		var posY = parseInt(a[1].substring(5));
		var posN = parseInt(a[2].substring(5));
		var vueH = 0;
		var vueV = 0;
		
	  var myB=document.createElement('i');
	  myB.appendChild(document.createTextNode("Patientez, la page est en cours d'envoi � l'outil ZZ!"));
	  myB.setAttribute("class", "titre5");
	  tabtr=document.getElementsByTagName('tr')
	  insertBefore( tabtr[3], myB );
		
		/// Chargement des monstres		
		var txtMon="";
		var x_monstres = totaltab[3].getElementsByTagName('tr');
		if (x_monstres.length>=3) vueH=Math.max(vueH, x_monstres[x_monstres.length-1].childNodes[0].firstChild.nodeValue);
		for ( var i = 3; i < x_monstres.length;i++) {
			txtMon += x_monstres[i].childNodes[1].firstChild.nodeValue + ";" +x_monstres[i].childNodes[2].firstChild.firstChild.nodeValue + ";" + x_monstres[i].childNodes[3].firstChild.nodeValue + ";" + x_monstres[i].childNodes[4].firstChild.nodeValue + ";" + x_monstres[i].childNodes[5].firstChild.nodeValue + ";|\n" ;
			vueV=Math.max(vueV, Math.abs(posN-x_monstres[i].childNodes[5].firstChild.nodeValue));
		}
		
		var txtTro="";
		var x_trolls = totaltab[5].getElementsByTagName('tr');
		if (x_trolls.length>=3) vueH=Math.max(vueH, x_trolls[x_trolls.length-1].childNodes[0].firstChild.nodeValue);
		for (var i = 3; i < x_trolls.length; i++){
			txtTro += x_trolls[i].childNodes[1].firstChild.nodeValue + ";" +x_trolls[i].childNodes[2].firstChild.firstChild.nodeValue + ";" + x_trolls[i].childNodes[3].firstChild.nodeValue + ";" + x_trolls[i].childNodes[4].firstChild.nodeValue + ";" + x_trolls[i].childNodes[6].firstChild.nodeValue + ";" + x_trolls[i].childNodes[7].firstChild.nodeValue +  ";" + x_trolls[i].childNodes[8].firstChild.nodeValue + ";|\n" ;
			vueV=Math.max(vueV, Math.abs(posN-x_trolls[i].childNodes[8].firstChild.nodeValue));
		}

		var txtTre="";
		var x_tresors = totaltab[7].getElementsByTagName('tr');
		if (x_tresors.length>=3) vueH=Math.max(vueH, x_tresors[x_tresors.length-1].childNodes[0].firstChild.nodeValue);
		for (var i = 3; i < x_tresors.length; i++){
			txtTre += x_tresors[i].childNodes[1].firstChild.nodeValue + ";" +x_tresors[i].childNodes[2].firstChild.firstChild.nodeValue + ";" + x_tresors[i].childNodes[3].firstChild.nodeValue + ";" + x_tresors[i].childNodes[4].firstChild.nodeValue + ";" + x_tresors[i].childNodes[5].firstChild.nodeValue + ";|\n" ;
			vueV=Math.max(vueV, Math.abs(posN-x_tresors[i].childNodes[5].firstChild.nodeValue));
		}
		var txtCha="";
		var x_champis= totaltab[9].getElementsByTagName('tr');
		if (x_champis.length>=3) vueH=Math.max(vueH, x_champis[x_champis.length-1].childNodes[0].firstChild.nodeValue);
		for (var i = 3; i < x_champis.length; i++){
			txtCha += x_champis[i].childNodes[1].firstChild.nodeValue + ";" +x_champis[i].childNodes[2].firstChild.firstChild.nodeValue + ";" + x_champis[i].childNodes[3].firstChild.nodeValue + ";" + x_champis[i].childNodes[4].firstChild.nodeValue + ";" + x_champis[i].childNodes[5].firstChild.nodeValue + ";|\n" ;
			vueV=Math.max(vueV, Math.abs(posN-x_champis[i].childNodes[5].firstChild.nodeValue));
		}
		var txtLie="";
		var x_lieux= totaltab[11].getElementsByTagName('tr');
		if (x_lieux.length>=3) vueH=Math.max(vueH, x_lieux[x_lieux.length-1].childNodes[0].firstChild.nodeValue);
		for (var i = 3; i < x_lieux.length; i++){
			txtLie += x_lieux[i].childNodes[1].firstChild.nodeValue + ";" +x_lieux[i].childNodes[2].childNodes[1].firstChild.nodeValue + ";" + x_lieux[i].childNodes[3].firstChild.nodeValue + ";" + x_lieux[i].childNodes[4].firstChild.nodeValue + ";" + x_lieux[i].childNodes[5].firstChild.nodeValue + ";|\n" ;
			vueV=Math.max(vueV, Math.abs(posN-x_lieux[i].childNodes[5].firstChild.nodeValue));
		}
		var TypeVue="VL";
 	   	if(document.referrer.indexOf("Play_a_Sort23.php")>=0) TypeVue="VLC";		//IdSort=23 pour VLC et IdSort=9 pour VL
 
		//alert(ZZDB+'/mzVision.php?Vue='+posX+';'+posY+';'+posN+';'+vueH+';'+vueV+';&TypeVue='+TypeVue+'&Monstres=' + txtMon + '&Trolls=' + txtTro + '&Tresors=' + txtTre + '&Champis=' + txtCha + '&Lieux=' + txtLie);	
		var url = ZZDB+'/mzVision.php';
		MZ_xmlhttpRequest({
				method: 'POST',
				url: url,
				headers : {
					'User-agent': 'Mozilla/4.0 [FusionZoryaZilla] (compatible) Greasemonkey',
					'Accept': 'application/atom+xml,application/xml,text/xml',
					'Content-type':'application/x-www-form-urlencoded'
				},
				data: 'Vue='+posX+';'+posY+';'+posN+';'+vueH+';'+vueV+';&TypeVue='+TypeVue+'&Monstres=' + txtMon + '&Trolls=' + txtTro + '&Tresors=' + txtTre + '&Champis=' + txtCha + '&Lieux=' + txtLie,
				onload: function(responseDetails) {
					try
					{
						var texte = responseDetails.responseText;
						tabtr[2].childNodes[3].childNodes[3].childNodes[1].childNodes[0].childNodes[0].nodeValue=texte;
						//alert(texte);
					}
					catch(e)
					{
						alert(e+"\n"+url+"\n"+texte);
					}
				}
		});
	}
}
//----------------------------------------------------------------------------------------------------
//===========================================================================
// D�but du Script
catchInsulte();
catchBOTInsulte();
catchPiege();
catchBOTDegatPiege();
catchIdT2();
catchBOTIdT2();
catchAttaque();
catchBOTAttaque();
catchTelek();
catchVL();
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
/*********************************************************************************
* v0.4 by Dabihul - 2012-08-02                                                   *
* - m�n rep�rage messade de bot et insertion du texte                            *
* TODO                                                                           *
* - v�rifications pour explo                                                     *
* - voir avec Tilk pour le poissotron                                            *
*********************************************************************************/

var pageNivURL = 'http://mountypedia.free.fr/mz/niveau_monstre_combat.php';
//var idtURL = "http://mh.byethost5.com/idt_serveur.php";
/*****************
* Page de combat *
*****************/
function getLevel() {
	var divList = document.getElementsByTagName('div');
	
	if (divList.length <= 2)
		return;
	
	// On essaie de voir si cette action �tait une attaque
	var pList = document.getElementsByTagName('p');
	var nomM = '';
	// Modification pour Fr�n�sie by TetDure
	var numAtt = 0;
	for (var i = 0; i < pList.length; i++) {
		if (pList[i].firstChild) {
			nomM = pList[i].firstChild.nodeValue;
			if (nomM && nomM.indexOf('Vous avez attaqu� un') == 0)
				numAtt++;
			}
		}
	
	if (nomM == '')
		return;
	
	// Si c'est une attaque normale, un seul PX
	var comPX = 1;
	if (divList[2].firstChild.nodeValue.indexOf('Attaque Normale') == -1 && numAtt != 2)
		comPX++;
	// Extraction des infos du monstre attaqu�
	var idM;
	var male;
	if (nomM.slice(20, 21) == 'e') {
		male = false;
		idM = nomM.substring(nomM.indexOf('(') + 1, nomM.indexOf(')'));
		nomM = nomM.slice(22, nomM.indexOf('(') - 1);
		}
	else {
		male = true;
		idM = nomM.substring(nomM.indexOf('(') + 1, nomM.indexOf(')'));
		nomM = nomM.slice(21, nomM.indexOf('(') - 1);
		}
	
	if (idM == '')
		return;
	
	var bList = document.getElementsByTagName('b');
	var niveau = '';
	for (var i = 0; i < bList.length; i++) {
		var b = bList[i];
		if (b.childNodes[0].nodeValue != "TU�")
			continue;
		var nbPX = "";
		for (i++; i < bList.length; i++) {
			// Si plusieurs monstres ont �t� tu�s (par ex. explo), on ne peut pas d�duire leurs niveaux
			if (bList[i].childNodes[0].nodeValue == "TU�")
				return;
			if (bList[i].childNodes[0].nodeValue.indexOf("PX") != -1) {
				nbPX = bList[i].childNodes[0].nodeValue;
				break;
			}
		}
		if (nbPX == '')
			return;
		// Si on arrive ici c'est qu'on a trouv� un (et un seul) monstre tu� et les PX gagn�s
		nbPX = parseInt(nbPX.slice(0, nbPX.indexOf("P") - 1));
		if (!nbPX)
			nbPX = 0;
		chaine = (male ? "Il" : "Elle") + " �tait de niveau ";
		niveau = (nbPX * 1 + 2 * nivTroll - 10 - comPX) / 3;
		if (comPX > nbPX) {
			chaine += "inf�rieur ou �gal � " + Math.floor(niveau) + ".";
			niveau = "";
		} else if (Math.floor(niveau) == niveau) {
			chaine += niveau + ".";
		} else {
			chaine = "Mountyzilla n'est pas arriv� � calculer le niveau du monstre.";
			niveau = "";
		}
		insertBr(b.nextSibling.nextSibling.nextSibling);
		insertText(b.nextSibling.nextSibling.nextSibling, chaine);
	}
	if (niveau != '') {
		var button = insertButtonCdm('as_Action');
		button.setAttribute("onClick","window.open('" + pageNivURL + "?id=" + (idM * 1) + "&monstre="
				+ escape(nomM) + "&niveau=" + escape(niveau)
				+ "', 'popupCdm', 'width=400, height=240, toolbar=no, status=no, location=no, resizable=yes'); "
				+ "this.value = 'Merci de votre participation'; this.disabled = true;");
	}
}

/**************************
* Messages du bot : MM/RM *
**************************/
function insertInfoMagie(node, intitule, magie) {
	if (node.nextSibling) {
		node = node.nextSibling;
		insertBr(node);
		insertText(node, intitule);
		insertText(node, magie, true);
		}
	else {
		node = node.parentNode;
		appendBr(node);
		appendText(node, intitule);
		appendText(node, magie, true);
		}		
	}

function getMM(sr) {
	//sr = sr.slice(0, sr.indexOf('%') - 1);
	sr = parseInt(sr.match(/\d+/));
	if (sr==10)
		return '\u2265 ' + Math.round(50*rmTroll/sr);
	if (sr<=50)
		return Math.round(50*rmTroll/sr);
	if (sr<90)
		return Math.round((100-sr)*rmTroll/50);
	return '\u2264 ' + Math.round((100-sr)*rmTroll/50);
	}

function traiteMM() {
	var node = document.evaluate("//b[contains(preceding::text()[1], 'Seuil de R�sistance')]/text()[1]",
							document, null, 9, null).singleNodeValue;
	
	if (node) {
		var mm = getMM(node.nodeValue);
		node = node.parentNode.nextSibling.nextSibling.nextSibling;
		}
	else {
		var node = document.evaluate("//p/text()[contains(., 'Seuil de R�sistance')]",
								document, null, 9, null).singleNodeValue;
		if (!node)
			return;
		var mm = getMM(node.nodeValue);
		node = node.nextSibling.nextSibling;
		}
	insertInfoMagie(node, 'MM approximative de l\'Attaquant...: ', mm);
	}

function getRM(sr, tsr, i) {
	//sr = sr.slice(0, sr.indexOf('%') - 1);
	sr = parseInt(sr.match(/\d+/));
	var rm;
	if (mmTroll <= 0)
		rm = 'Inconnue (quelle id�e d\'avoir une MM valant'+mmTroll+' !)';
	else if (sr == 10)
		rm = '\u2264 ' + Math.round(sr*mmTroll/50);
	else if (sr <= 50)
		rm = Math.round(sr*mmTroll/50);
	else if (sr < 90)
		rm = Math.round(50*mmTroll/(100-sr));
	else
		rm = '\u2265 ' + Math.round(50*mmTroll/(100-sr));
	if (tsr)
		tsr[i] = (sr>10 && sr<90) ? rm : -1;
	return rm;
	}

function traiteRM() {
	var nodes = document.evaluate("//b[contains(preceding::text()[1], 'Seuil de R�sistance')]/text()[1]",
							document, null, 7, null);
	if (nodes.snapshotLength==0)
		return;
	
	var tsr = new Array();
	for (var i=0 ; i<nodes.snapshotLength ; i++) {
		var node = nodes.snapshotItem(i);
		var rm = getRM(node.nodeValue, tsr, i);
		node = node.parentNode.nextSibling.nextSibling.nextSibling;
		insertInfoMagie(node, 'RM approximative de la Cible.......: ', rm);
		}
	}

/**********************
* Fonction Poissotron *
**********************/
function sendDices() {
	var dice = MZ_getValue('POISS_'+numTroll); // = hash du mdp poissotron
	if (!dice || dice == '' || dice=='false')
		return false;
	
	//alert('sendDices ON');
	var bonus = 0;
	var seuil_base = 0;
	var seuil_tot = 0;
	var chaineDes = '';
	
	var node = document.evaluate("//td/text()[contains(., 'Page g�n�r�e en')]",
						document, null, 2, null).stringValue;
	if (node)
		chaineDes += 'temps='+node.substring(node.indexOf('g�n�r�e')+11, node.indexOf('sec')-1)+'&';
	
	node = document.evaluate("//b/text()[position()=1 and starts-with(., 'bonus')]",
						document, null, 2, null).stringValue;
	if (node)
		bonus = parseInt(node.match(/\d+/));
	
	var nodes = document.evaluate("//b/text()[position()=1 and contains(., 'jet de')]",
						document, null, 7, null);
	for (var i=0 ; i<nodes.snapshotLength ; i++) {
		var nbrs = nodes.snapshotItem(i).nodeValue.match(/\d+/g);
		var diceValue = nbrs[0];
		seuil_base = parseInt(nbrs[1]);
		seuil_tot = seuil_base+bonus;
		chaineDes += 'comp[]='+diceValue+'&comp_seuil[]='+seuil_tot+'&';
		}
	
	// � revoir d�s que j'ai une am�lio...
	node = document.evaluate("//b[descendant::text()[1]=\"Jet d'am�lioration\"]/following::b[1]/descendant::text()[1]",
						document, null, 2, null).stringValue;
	if (node)
		chaineDes += 'amel[]='+node+'&amel_seuil[]='+seuil_base+'&';
	
	nodes = document.evaluate("//b[contains(preceding::text()[1], 'Jet de R�sistance.....')]/text()[1]",
						document, null, 7, null);
	for (var i=0 ; i<nodes.snapshotLength ; i++)
		chaineDes += 'sr[]='+nodes.snapshotItem(i).nodeValue+'&';
	
	nodes = document.evaluate("//b[contains(preceding::text()[1], 'Seuil de R�sistance de la Cible')]/text()[1]",
						document, null, 7, null);
	for (var i = 0; i < nodes.snapshotLength; i++)
		chaineDes += 'sr_seuil[]='+nodes.snapshotItem(i).nodeValue.match(/\d+/)+'&';
	
	if (chaineDes == '')
		return false;
	
	var fin = currentURL.indexOf('?');
	var url = currentURL.slice(currentURL.indexOf('/Actions')+9, fin != -1 ? fin : 500);
	if (url == 'Play_a_SortResult.php') {
		url = document.referrer;
		if (url.indexOf('?') == -1)
			url = url.slice(url.indexOf('/Actions')+9);
		else
			url = url.slice(url.indexOf('/Actions')+9, url.indexOf('?'));
		if (url == 'Sorts/Play_a_SortXX.php') {
			url = document.referrer;
			url = url.slice(url.indexOf('&as_NomSort')+12);
			url = url.slice(0, url.indexOf('&'));
			url = 'Sorts/Play_a_SortXX.php/'+url;
			}
		else if (url == 'Sorts/Play_a_SortYY.php') {
			url = document.referrer;
			url = url.slice(url.indexOf('&as_NomSort')+12);
			url = url.slice(0, url.indexOf('&'));
			url = 'Sorts/Play_a_SortYY.php/'+url;
			}
		}
	else if(url == 'Play_a_Combat.php') {
		url = document.referrer;
		url = url.substring(url.indexOf('/Actions')+9);
		if (url.indexOf('ai_IdComp') != -1) {
			url = url.substring(url.indexOf('ai_IdComp')+10);
			url = url.substring(0,url.indexOf('&'));
			url = 'Competences/Play_a_Combat'+url+'.php';
			}
		else if (url.indexOf('as_NomSort') != -1) {
			url = url.substring(url.indexOf('as_NomSort')+11)
			url = url.substring(0,url.indexOf('&'));
			url = 'Sorts/'+url;
			}
		}
	
	addScript();
	MZ_xmlhttpRequest({
		method: 'GET',
		url: poissotron+'?url='+url+'&'+chaineDes+'&id='+numTroll+'&mdp='+dice,
		headers : {
			'User-agent': 'Mozilla/4.0 [FusionZoryaZilla] (compatible) Greasemonkey',
			'Accept': 'application/atom+xml,application/xml,text/xml',
			},
		onload: function(responseDetails) {
				var texte = responseDetails.responseText;
				if(texte.indexOf('error: ')!=-1) {
					alert(texte.substring(texte.indexOf('error: ')+7));
					MZ_setValue('POISS_'+numTroll, false);
					}
				}
		});
	return true;
	}

/**********************************
* Fonction stats IdT par Raistlin *
**********************************/
	
/*function getIdt() {
	if (MZ_getValue("SEND_IDT") == "non")
		return false;
		
	var regExpBeginning = /^\s+/;
	var regExpEnd       = /\s+$/;
	var nomIdt = document.evaluate(
			"//tr/td[contains(p/text(),'identification a donn� le r�sultat suivant : ')]/b/text()",
			document, null, XPathResult.STRING_TYPE, null).stringValue;
	if (!nomIdt)
		return false;
	var caracIdt;
	if (nomIdt.indexOf("Mal�diction !") != -1) {
		caracIdt = "";
		nomIdt = "Mission maudite";
	} else {
		caracIdt = nomIdt.slice(nomIdt.indexOf("(") + 1, nomIdt.indexOf(")"));
		nomIdt = nomIdt.slice(nomIdt.indexOf(" - ")+3);
		nomIdt = nomIdt.slice(0, nomIdt.indexOf("(") - 1);
		nomIdt = nomIdt.replace(regExpBeginning, "").replace(regExpEnd, "");
	}
	MZ_xmlhttpRequest({
		method: 'GET',
		url: idtURL + "?item=" + escape(nomIdt) + "&descr=" + escape(caracIdt),
		headers : {
			'User-agent': 'Mozilla/4.0 [FusionZoryaZilla] (compatible) Greasemonkey',
			'Accept': 'application/atom+xml,application/xml,text/xml',
		}
	});
	return true;
}*/

/**********************
* Fonction principale *
**********************/
function dispatch() {
	if (isPage('MH_Play/Actions')) {
		sendDices();
		if (document.evaluate("//form/descendant::p/text()[contains(., 'Zone Pi�g�e')]",
						document, null, 2, null).stringValue)
			traiteMM();
		else if (document.evaluate("//tr/td/descendant::p/text()[contains(., 'identification a donn�')]",
							document, null, 2, null).stringValue) {
			//getIdt();
			traiteRM();
			}
		else {
			traiteRM();
			getLevel();
			}
		}
	else { // traitement des messages du bot
		var messageTitle = document.getElementsByTagName('table')[0].childNodes[1].firstChild
								.childNodes[1].firstChild.childNodes[1].firstChild.nodeValue;
		if (messageTitle.indexOf('R�sultat de Combat') != -1 && messageTitle.indexOf('sur') != -1) {
			getLevel();
			traiteRM();
			}
		else if (messageTitle.indexOf('R�sultat du pouvoir') != -1
				|| messageTitle.indexOf('R�sultat de Combat') != -1)
			traiteMM();
		else if (messageTitle.indexOf('Identification des tr�sors') != -1)
			traiteRM();
		}
	}

start_script(31);
dispatch();
displayScriptTime();
//============================ ZZ POST CODE ======================================

