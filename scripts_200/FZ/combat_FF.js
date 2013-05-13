/*********************************************************************************
*    This file is part of Mountyzilla modified for zoryazilla                    *
*********************************************************************************/
function URLencode(sStr) {
  return escape(sStr).replace(/\+/g, '%2C').replace(/\"/g,'%22').replace(/\'/g, '%27');
}

function getDataSort(SortComp, Code) {
  	var strData="";
	var DEG_Cible=0;
	var ARM_Cible=0;
	var ESQ_Cible=-1;
	var ageM="";
	return "";
}

function getDataAttaque(SortComp, Code) {
  	var strData="";
	var DEG_Cible=0;
	var ARM_Cible=0;
	var ESQ_Cible=-1;
	var ageM="";
  
  	var lines = Code.split("<p>");
	MeID=Number(lines[0].substring(lines[0].indexOf("(")+1,lines[0].indexOf(")")));	//Id négatif pour les trolls, positif pour les monstres
	if(lines[0].indexOf("le Troll")==0)	
		MeID=_MeID;
	else 
		ageM=lines[0].slice(lines[0].indexOf("[")+1, lines[0].indexOf("]"));
  	for(var j=1;j<lines.length;j++) {
      	var line=lines[j].split('<br>'); 
	  	for(var i=0;i<line.length;i++) {
      		var l=line[i];
	  		if (l.indexOf("Esquive de votre adversaire est de")>0) ESQ_Cible=parseInt(l.slice(48));
	  		else if (l.indexOf("lui avez infligé")>0) DEG_Cible=parseInt(l.substr(25), "point");
	  		else if (l.indexOf("Armure le protège")>0) ARM_Cible=parseInt(l.substr(45), "point");

	  }
  }
  ARM_Cible=DEG_Cible-ARM_Cible;  
  if (SortComp=='IdComp1') ARM_Cible=2*ARM_Cible;
  return "&MeID[]="+MeID+"&AGE[]="+ageM+"&ESQ[]="+ESQ_Cible+"&DEG[]="+DEG_Cible+"&ARM[]="+ARM_Cible;
}  
  
function catchAttaque() {
  var divList=document.getElementsByTagName( 'div' );
  var comp=2;
  var male=true;
  var numTroll=MZ_getValue("NUM_TROLL");
  var nt=MZ_getValue("NIV_TROLL");
  var mm=MZ_getValue("MM_TROLL");
  if(nt=="" || divList.length<=2)
  	return;
  
  //Modification Pour frénésie by TetDure
  var pList=document.getElementsByTagName( 'p' );
  var numAtt=0;
  for(var j=0;j<pList.length;j++) {
//ATT_Multiple
  	  var fatt=-1; try {fatt=pList[j].childNodes[0].nodeValue.indexOf("Vous avez attaqué");} catch (e){}
      if (fatt>=0) numAtt++;
  }

  if( (divList[2].childNodes[0].nodeValue.indexOf("Attaque Normale")!=-1 )  || numAtt==2 )
      comp=1;


  var nom=pList[0].childNodes[0].nodeValue;
  var nomM="";
  var ageM="";
  var idM="";
  var i=0;
  var rmText="";
  var attTroll=false;

/*
  while(!nom || nom.indexOf("Vous avez attaqué ")<0)
  {
  	i++;
	if(i>=pList.length) return;
	nom=pList[i].childNodes[0].nodeValue;
  }
  if(nom.indexOf("Vous avez attaqué le Troll")==0) {
	nomM=nom.slice(27,nom.indexOf("(")-1);
	idM=-Number(nom.substring(nom.indexOf("(")+1,nom.indexOf(")")));	//Id négatif pour les trolls, positif pour les monstres
  	attTroll=true;
	male=true;
  } 
  else if(nom.slice(20,21)=="e")
  {
	ageM=nom.slice(nom.indexOf("[")+1, nom.indexOf("]"));
	nomM=nom.slice(22,nom.indexOf("(")-1);
	idM=nom.substring(nom.indexOf("(")+1,nom.indexOf(")"));
	male=false;
  }
  else
  {
	ageM=nom.slice(nom.indexOf("[")+1, nom.indexOf("]"));
	nomM=nom.slice(21,nom.indexOf("(")-1);
	idM=nom.substring(nom.indexOf("(")+1,nom.indexOf(")"));
  }
  
  */
  if(mm!="")
  {
    for(var j=i;j<pList.length;j++)
    {
	var frs=-1; try {frs=pList[j].childNodes[0].nodeValue.indexOf("Seuil de Résistance de la Cible");} catch (e){}
  	if(frs!=-1)
  	{
		var sr=pList[j].childNodes[0].nextSibling.childNodes[0].nodeValue;
		sr=sr.slice(0,sr.indexOf("%")-1);
		SR_Cible=sr;      //ITM
		var string="";
		if(sr==10) {
			rmText="&type=inf&rm="+Math.round((sr*mm)/50);
			string="\u2264 "+Math.round((sr*mm)/50);
		    RM_Cible="<"+Math.round((sr*mm)/50); //ITM   			
		} else if(sr<=50) {
			rmText="&type=egal&rm="+Math.round((sr*mm)/50);
			string=Math.round((sr*mm)/50);
		    RM_Cible="="+Math.round((sr*mm)/50); //ITM   			
		} else if(sr<90) {
			rmText="&type=egal&rm="+Math.round(50*mm/(100-sr));
			string=Math.round(50*mm/(100-sr));
		    RM_Cible="="+Math.round(50*mm/(100-sr)); //ITM   			
		} else {
			rmText="&type=sup&rm="+Math.round(50*mm/(100-sr)); 
			string="\u2265 "+Math.round(50*mm/(100-sr)); 
		    RM_Cible=">"+Math.round(50*mm/(100-sr)); //ITM   			
		}
/*fait par MZ		pList[j].appendChild(document.createElement('br'));
		pList[j].appendChild(document.createTextNode('RM approximative de la Cible.......: '));
		var myB=document.createElement('b');
		myB.appendChild(document.createTextNode(string));
		pList[j].appendChild(myB);*/
		break;
	}
     }
  }

  //if (idM=="")
    //return;


	var bList = document.getElementsByTagName('b');
	var niveau = "";
	for (var i = 0; i < bList.length; i++) {
		var b = bList[i];
		if (b.childNodes[0].nodeValue != "TUÉ")
			continue;
		var nbPX = "";
		for (i++; i < bList.length; i++) {
			// Si plusieurs monstres ont été tués (par ex. explo), on ne peut pas déduire leurs niveaux
			//if (bList[i].childNodes[0].nodeValue == "TUÉ")
			//	return;
			if (bList[i].childNodes[0].nodeValue.indexOf("PX") != -1) {
				nbPX = bList[i].childNodes[0].nodeValue;
				break;
			}
		}
		if (nbPX == "")
			return;
					
		// Si on arrive ici c'est qu'on a trouvé un (et un seul) monstre tué et les PX gagnés
		nbPX = parseInt(nbPX.slice(0, nbPX.indexOf("P") - 1));
		if (!nbPX)
			nbPX = 0;
		//chaine = (male ? "Il" : "Elle") + " était de niveau ";
		chaine = "Son niveau était ";
		niveau = (nbPX * 1 + 2 * nt - 10 - comp) / 3;

		if (comp > nbPX) {
			chaine += "inférieur ou égal à " + Math.floor(niveau) + ".";
			niveau = "";
		} else if (Math.floor(niveau) == niveau) {
			chaine += "égal à " + niveau + ".";
			NIV_Cible=niveau;		//Info pour ZZ
		} else {
			chaine = "Zoryazilla n'est pas arrivé à calculer le niveau du monstre.";
			niveau = "";
		}
	}
/*
  var nodes = document.evaluate("//b[contains(preceding::text()[1],'Vous lui avez infligé')]/text()[1]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
  for (var i = 0; i < nodes.snapshotLength; i++)
  {
    var node = nodes.snapshotItem(i);
    DEG_Cible=DEG_Cible+parseInt(node.nodeValue, "point");
  }

  nodes = document.evaluate("//b[contains(preceding::text()[1],'Son Armure le protège')]/text()[1]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
  if (nodes.snapshotLength>0) {
	  for (var i = 0; i < nodes.snapshotLength; i++)
	  {
	    var node = nodes.snapshotItem(i);
	    ARM_Cible=ARM_Cible+parseInt(node.nodeValue, "point");
	  }
  
  	// prise en compte armure/deg
	  ARM_Cible=DEG_Cible-ARM_Cible;
	  DEG_Cible=DEG_Cible-ARM_Cible;
	  ARM_Cible=Math.floor(ARM_Cible/numAtt);
  }
*/
  nodes = document.evaluate("//p/text()[contains(.,'Il aura, de plus, un malus de')]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  for (var i = 0; i < nodes.snapshotLength; i++)
  {
    var node = nodes.snapshotItem(i);
    sReg=node.nodeValue;
    REG_Cible=REG_Cible+parseInt(sReg.slice(30), "point");
    if (sReg.indexOf("pour sa prochaine")>0) {
    	REG_Cible="1x"+REG_Cible;	// rafale résistée
    } else {
    	REG_Cible="2x"+REG_Cible;
    }
  }

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
  }
  

  var url=document.referrer;
  url=url.substring(url.indexOf('/Actions')+9);
  if(url.indexOf("ai_IdComp") != -1)
  {
      url=url.substring(url.indexOf('ai_IdComp')+10)
      url=url.substring(0,url.indexOf('&'));
      ATTAQUE="IdComp"+url;
      
  } else if(url.indexOf("ai_IdSort") != -1) {
      url=url.substring(url.indexOf('ai_IdSort')+10)
      ATTAQUE="IdSort"+url;
  }  
  
//  var Code=document.getElementsByTagName('table')[0].innerHTML;
//  alert(Code);  
  
  var DataAttaque=""; 
  var Code=document.getElementsByName('ActionForm')[0].innerHTML;
  Code=Code.substr(0, Code.indexOf("<input name"));
  var bloc = Code.split("Vous avez attaqué ");
  if (bloc.length>1) {
      for(var i=1;i<bloc.length;i++) DataAttaque+=getDataAttaque(ATTAQUE, bloc[i]); 
  } else {
      var Code=document.getElementsByTagName('table')[0].innerHTML;
      var bloc = Code.split("a eu l'effet suivant :");
      for(var i=1;i<bloc.length;i++) DataAttaque+=getDataSort(ATTAQUE, bloc[i]); 
  }

/*

  var nodes = document.evaluate("//p/text()[contains(.,'Esquive de votre adversaire est de')]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  for (var i = 0; i < nodes.snapshotLength; i++)
  {
    var node = nodes.snapshotItem(i);
    ESQ_Cible=parseInt(node.nodeValue.slice(48));
  }
  */

  // Pour BS: seulement 50% de l'armure physique est prose en compte
  //if (ATTAQUE=='IdComp1') ARM_Cible=2*ARM_Cible;
  if (DataAttaque!="") {	
	  var data="&TypeData=Attaque";
	  var totaltab=document.getElementsByTagName( 'table' );
	  var TimeStamp=totaltab[totaltab.length-1].childNodes[1].childNodes[0].childNodes[1].childNodes[3].nodeValue;
	  TimeStamp=TimeStamp.substr(TimeStamp.indexOf("/")-2, 19).replace(" ", "_");
	  data+="&TimeStamp="+TimeStamp;
	  data+="&TiD="+numTroll;
	  data+="&Attaque="+ATTAQUE;
	  //data+="&MeID="+idM;
	  //data+="&DEG="+DEG_Cible;
	  data+="&REG="+REG_Cible;
	  data+="&SR="+SR_Cible;
	  data+="&RM="+escape(RM_Cible);
	  //data+="&ARM="+ARM_Cible;
	  data+="&NIV="+NIV_Cible;
	  //data+="&ESQ="+ESQ_Cible;
	  //data+="&AGE="+ageM;
	  data+=DataAttaque;
	  //if (numAtt>1) data+="&CODE="+URLencode(ATT_CODE);		// s'il y a plus d'une Attaque, le envoyer tout le code.
	  
	  //alert(ZZDB+'/mzData.php?'+data);
	  MZ_appendNewScript(ZZDB+'/mzData.php?'+data);

  }
}

function setDBMsgZZ(msg) { 
  var totaltab=document.getElementsByTagName( 'table' );
  var myB=document.createElement('i');
  myB.appendChild(document.createTextNode(msg));
  myB.setAttribute("class", "titre5");
  totaltab[totaltab.length-2].appendChild( myB );
}

//----------------------------------------------------------------------------------------------------
var ATT_CODE=document.getElementsByName('ActionForm')[0].innerHTML;
ATT_CODE=ATT_CODE.substr(0, ATT_CODE.indexOf("<input name"));
var SR_Cible=0;
var RM_Cible=0;
var DEG_Cible=0;
var REG_Cible=0;
var ARM_Cible=0;
var NIV_Cible=0;
var ESQ_Cible=-1;
var ATTAQUE=0;
catchAttaque();
