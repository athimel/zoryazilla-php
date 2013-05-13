/* Réorganisation de la vue de Mountyhall. Script externe de MZ
Reste �  faire : rien pour l'instant. Ouvert aux suggestions constructives
*/

var lastTypeWasMove = false;
var vueArray;

function copyArray(oldArray)
{
	var newArray=new Array();
	for(var i=0;i<oldArray.length;i++){
		newArray.push(oldArray[i]);
	}
	return newArray;
}
// fonction de copie des différents tableaux correspondant aux différentes sections de la vue. rajouté par Tilk pour?
function backupArray()
{
	x_monstres = copyArray(x_monstres);
	x_trolls = copyArray(x_trolls);
	x_tresors = copyArray(x_tresors);
	x_champis = copyArray(x_champis);
	x_lieux = copyArray(x_lieux);
	totaltab = copyArray(totaltab);
}

// possibilité de centrer sur un élément de la vue
function analyse(centre){
// bizarrement quand on fait un clic sur 'mettre a jour', ça lance 'analyse' avec le MouseEvent comme argument
  if(centre != null && centre.className == null){
    analyse(null);
    return;
  }
  
// mise �  jour du about:config
  setCheckBoxCookie(checkBoxVRM,"REORGFILTREMONSTRES");
  setCheckBoxCookie(checkBoxVRT,"REORGFILTRETROLLS");
  setCheckBoxCookie(checkBoxVRO,"REORGFILTRETRESORS");
  setCheckBoxCookie(checkBoxVRC,"REORGFILTRECHAMPIS");
  setCheckBoxCookie(checkBoxVRL,"REORGFILTRELIEUX");
  setCheckBoxCookie(checkBoxRemAnalyse,"REORGREMSCRIPT");
    
  setTextBoxCookie(distFiltreM,"REORGDISTMONSTRES");
  setTextBoxCookie(distFiltreT,"REORGDISTTROLLS");
  setTextBoxCookie(distFiltreO,"REORGDISTTRESORS");
  setTextBoxCookie(distFiltreC,"REORGDISTCHAMPIS");
  setTextBoxCookie(distFiltreL,"REORGDISTLIEUX");

  if(checkBoxRemAnalyse.checked) {
      var vCNode = document.getElementById('vueClassee');
	  if(vCNode!=null)
	  {
		vCNode.parentNode.removeChild(vCNode);
		}
      return null;
    }

  if(currentURL.indexOf("http://games.mountyhall.com/mountyhall/MH_Play/Play_vue.php")==0){
  	if(document.getElementById('vueClassee') != null)
  	{
  		var vCNode = document.getElementById('vueClassee');
  		vCNode.parentNode.removeChild(vCNode);
  	}
    
    vueArray=new Array();
    var index = 0;
    var myDeltaColspan=0;
    
  // on récupère le nombre max de colonnes dans l'ensemble de la vue, pour adapter les colonnes des autres parties    
    var maxNbCols=0;
    if(x_monstres[2] != null && maxNbCols < x_monstres[2].childNodes.length){maxNbCols = x_monstres[2].childNodes.length;}
    if(x_trolls[2] != null && maxNbCols < x_trolls[2].childNodes.length){maxNbCols = x_trolls[2].childNodes.length;}
    if(x_tresors[2] != null && maxNbCols < x_tresors[2].childNodes.length){maxNbCols = x_tresors[2].childNodes.length;}
    if(x_champis[2] != null && maxNbCols < x_champis[2].childNodes.length){maxNbCols = x_champis[2].childNodes.length;}
    if(x_lieux[2] != null && maxNbCols < x_lieux[2].childNodes.length){maxNbCols = x_lieux[2].childNodes.length;}
  	myDeltaColspan=maxNbCols-6;
      
  // on copie les monstres en vue dans un tableau global, si ceux-ci sont �  une distance inférieure �  celle paramétrée
    var myDistance=distFiltreM.value;
    for (var cpt=2;cpt<x_monstres.length;cpt++) {
    
      if(x_monstres[cpt].style.display != 'none' && getmyDistance(x_monstres[cpt]) != null && calculeDist(centre,x_monstres[cpt])<= myDistance && !checkBoxVRM.checked){
       vueArray[index]=new Array();
        vueArray[index][0]=0;
        vueArray[index][1]=moveOrCopy(x_monstres[cpt]);
  	    if(!checkBoxLevels.checked){
  		   vueArray[index][1].childNodes[3].setAttribute('colspan',myDeltaColspan);
  	    }
  	    else{		    
  		   vueArray[index][1].childNodes[1].setAttribute('colspan','2');
  		   vueArray[index][1].childNodes[2].setAttribute('colspan',myDeltaColspan);
  	    }
  		if(!checkBoxLevels.checked)
  		{
  			vueArray[index][1].childNodes[2].addEventListener("click", function() {getCDM(getMonstreNomByTR(this.parentNode, true),getMonstreIDByTR(this.parentNode));},true);
  		}
        index++;
      }
    }
      
  // on rajoute les trolls en vue dans le tableau global, si ceux-ci sont �  une distance inférieure �  celle paramétrée
    //on commence par rajouter le troll qui joue, histoire que s'il bouge il sache se retrouver
    var currentTrollRow=document.createElement('TR');
    currentTrollRow.setAttribute('class', 'mh_tdtitre')
    var distanceCT=0;
    /*if(centre != null) {
      distanceCT=Math.max(distanceCT, Math.abs(getPositionElement(centre)[0]-getPosition()[0]));
      distanceCT=Math.max(distanceCT, Math.abs(getPositionElement(centre)[1]-getPosition()[1]));
      distanceCT=Math.max(distanceCT, Math.abs(getPositionElement(centre)[2]-getPosition()[2]));
    }*/
    distTD=document.createElement('TD');
    distTD.style.backgroundColor='#FFFFFF';
    distTD.appendChild(document.createTextNode(distanceCT)); // distance
    currentTrollRow.appendChild(distTD);
    numTD=document.createElement('TD');
    numTD.appendChild(document.createTextNode(MZ_getValue("NUM_TROLL"))); // numéro
    numTD.style.backgroundColor='#FFFFFF';
    numTD.setAttribute('align','center');
    currentTrollRow.appendChild(numTD);
    nivTD=document.createElement('TD');
    nivTD.appendChild(document.createTextNode(MZ_getValue("NIV_TROLL"))); // niveau
    nivTD.style.backgroundColor='#FFFFFF';
    nivTD.setAttribute('align','center');
    currentTrollRow.appendChild(nivTD);
    nomTD=document.createElement('TD');
    nomTD.appendChild(document.createTextNode(MZ_getValue("NOM_TROLL"))); // nom  
    nomTD.style.backgroundColor='#FFFFFF';
    currentTrollRow.appendChild(nomTD);
    raceTD=document.createElement('TD');
    raceTD.appendChild(document.createTextNode("")); // race 
    raceTD.style.backgroundColor='#FFFFFF';
    raceTD.setAttribute('align','center');
    currentTrollRow.appendChild(raceTD);
    guildeTD=document.createElement('TD');
    guildeTD.appendChild(document.createTextNode("")); // guilde
    guildeTD.style.backgroundColor='#FFFFFF';
    guildeTD.setAttribute('align','center');
    currentTrollRow.appendChild(guildeTD); 
    if(maxNbCols==11){
      paTD=document.createElement('TD');
      paTD.appendChild(document.createTextNode("")); // PA
      paTD.style.backgroundColor='#FFFFFF';
      paTD.setAttribute('align','center');
      currentTrollRow.appendChild(paTD);   
      pvTD=document.createElement('TD');
      pvTD.appendChild(document.createTextNode("")); // PV
      pvTD.style.backgroundColor='#FFFFFF';
      pvTD.setAttribute('align','center');
      currentTrollRow.appendChild(pvTD); 
    }
    xTD=document.createElement('TD');
    xTD.appendChild(document.createTextNode(getPosition()[0])); // position X
    xTD.style.backgroundColor='#FFFFFF';
    xTD.setAttribute('align','center');
    currentTrollRow.appendChild(xTD);
    yTD=document.createElement('TD');
    yTD.appendChild(document.createTextNode(getPosition()[1])); // position Y
    yTD.style.backgroundColor='#FFFFFF';
    yTD.setAttribute('align','center');
    currentTrollRow.appendChild(yTD);
    zTD=document.createElement('TD');
    zTD.appendChild(document.createTextNode(getPosition()[2])); // position Z
    zTD.style.backgroundColor='#FFFFFF';
    zTD.setAttribute('align','center');
    currentTrollRow.appendChild(zTD); 

    vueArray[index]= new Array()
    vueArray[index][0]=1;
    vueArray[index][1]=currentTrollRow;
    index++;
    
    var myDistance=distFiltreT.value;
    var myReorgTrollsArray=new Array();
    var posTrollInNewArray=0;
    for (var cpt=2;cpt<x_trolls.length;cpt++) {
        if(x_trolls[cpt].style.display != 'none' && getmyDistance(x_trolls[cpt]) != null && calculeDist(centre,x_trolls[cpt])<= myDistance && !checkBoxVRT.checked){
        vueArray[index]=new Array();
        vueArray[index][0]=1;
        vueArray[index][1]=moveOrCopy(x_trolls[cpt]);
  	    vueArray[index][1].childNodes[3].setAttribute('align','center');
  	    vueArray[index][1].insertBefore(vueArray[index][1].childNodes[3],vueArray[index][1].childNodes[2]);
  		      vueArray[index][1].childNodes[2].addEventListener("mouseover", showPXTroll,true);
  		      vueArray[index][1].childNodes[2].addEventListener("mouseout", hidePXTroll,true);
  		      vueArray[index][1].childNodes[3].lastChild.addEventListener("mouseover", showPopup,true);
            vueArray[index][1].childNodes[3].lastChild.addEventListener("mouseout", hidePopup,true);
        index++;
      }
    }
      
  // on rajoute les trésors en vue dans le tableau global, si ceux-ci sont �  une distance inférieure �  celle paramétrée
    var myDistance=distFiltreO.value;
    for (var cpt=2;cpt<x_tresors.length;cpt++) {
      if(x_tresors[cpt].style.display != 'none' && getmyDistance(x_tresors[cpt]) != null && calculeDist(centre,x_tresors[cpt])<= myDistance && !checkBoxVRO.checked){
        vueArray[index]=new Array();
        vueArray[index][0]=2;
        vueArray[index][1]=moveOrCopy(x_tresors[cpt]);
  	    vueArray[index][1].childNodes[1].setAttribute('colspan','2');
        vueArray[index][1].childNodes[2].setAttribute('colspan',myDeltaColspan);
        index++;
      }
    }
      
  // on rajoute les champis en vue dans le tableau global, si ceux-ci sont �  une distance inférieure �  celle paramétrée
    var myDistance=distFiltreC.value;
    for (var cpt=2;cpt<x_champis.length;cpt++) {
      if(x_champis[cpt].style.display != 'none' && getmyDistance(x_champis[cpt]) != null && calculeDist(centre,x_champis[cpt])<= myDistance && !checkBoxVRC.checked){
        vueArray[index]=new Array();
        vueArray[index][0]=3;
        vueArray[index][1]=moveOrCopy(x_champis[cpt]);
        vueArray[index][1].childNodes[0].setAttribute('colspan','3');
        vueArray[index][1].childNodes[1].setAttribute('colspan',myDeltaColspan);
        index++;
      }
    }
      
  // on rajoute les lieux en vue dans le tableau global, si ceux-ci sont �  une distance inférieure �  celle paramétrée
    var myDistance=distFiltreL.value;
    for (var cpt=2;cpt<x_lieux.length;cpt++) {
      if(x_lieux[cpt].style.display != 'none' && getmyDistance(x_lieux[cpt]) != null && calculeDist(centre,x_lieux[cpt])<= myDistance && !checkBoxVRL.checked){
        vueArray[index]=new Array();
        vueArray[index][0]=4;
        vueArray[index][1]=moveOrCopy(x_lieux[cpt]);
        vueArray[index][1].childNodes[1].setAttribute('colspan','2');
        vueArray[index][1].childNodes[2].setAttribute('colspan',myDeltaColspan); 
        index++;
      }
    }   
  
  // on insère avant la vue 'normale' le tableau qui contiendra la vue réorganisée (rabatttable)    
    var aList = document.getElementsByTagName('p');
    var insertPoint=aList[0];
  
  // si la vue classée n'existe pas encore, on la crée    
    var vueClassee=document.createElement('DIV');
    vueClassee.setAttribute('id','vueClassee');
    insertBefore(insertPoint,vueClassee);
    var maTable = document.createElement('table');
    maTable.setAttribute('width', '98%');
    maTable.setAttribute('border', '0');
    maTable.setAttribute('align', 'center');
    maTable.setAttribute('cellpadding', '2');
    maTable.setAttribute('cellspacing', '1');
    maTable.setAttribute('class', 'mh_tdborder');
    maTable.setAttribute('id','reorgTable');
    
  	var mythead = document.createElement("thead");
  	maTable.appendChild(mythead);
  	

    vueClassee.appendChild(maTable);
    
  	totaltab.push(maTable);
                              
  	var tr = appendTr(mythead,'mh_tdtitre');
  	tr.setAttribute('onmouseover', "this.style.cursor = 'pointer'; this.className = 'mh_tdpage';");
  	tr.setAttribute('onmouseout', "this.className = 'mh_tdtitre';");
  	tr.setAttribute('height', "30");
  	tr.addEventListener("click", function() {
		try{
			var tbody = totaltab[totaltab.length-1].childNodes[1];
			if(!tbody.getAttribute('style') || tbody.getAttribute('style') == ''){
        reorgVisible='display:none;';
      }
      else{
        reorgVisible='';        
      }
			tbody.setAttribute('style',reorgVisible); 
      MZ_setValue("REORGVISIBLE",reorgVisible);
		}
		catch(e) {alert(e);}
	},true);    	
  	appendTdText(tr, "\u00a0VUE REORGANISEE", true).setAttribute('colspan',maxNbCols);    	
  	var mytbody = document.createElement('tbody');
  	maTable.appendChild(mytbody);
  
    if(MZ_getValue("REORGVISIBLE") !=null){
      mytbody.setAttribute('style',MZ_getValue("REORGVISIBLE"));
    }
    else {
       mytbody.setAttribute('style','');
    }

  
  	tr = appendTr(mytbody,'mh_tdtitre');
  	appendTdText(tr, "Dist.", true).setAttribute('width',10);
  	appendTdText(tr, "Réf.", true).setAttribute('width',40);
  	appendTdText(tr, "Niveau", true).setAttribute('width',25);
  	appendTdText(tr, "Nom", true).setAttribute('align', 'left');;
  	appendTdText(tr, "Race", true);
  	appendTdText(tr, "Guilde", true);
  	if(myDeltaColspan==5){    
  		appendTdText(tr, "PV", true);
  		appendTdText(tr, "PA", true);
    }
  	tmpTd = appendTdText(tr, "X", true);  	
  	appendTdText(tr, "Y", true).setAttribute('width',25);
    appendTdText(tr, "N", true).setAttribute('width',25);
       
  // on remplace la distance au joueur par celle �  la case ciblée      
    for(i=0;i<vueArray.length;i++){ 
      vueArray[i][1].firstChild.setAttribute('title',"distance réelle : "+vueArray[i][1].firstChild.firstChild.nodeValue);
      vueArray[i][1].firstChild.firstChild.nodeValue=calculeDist(centre,vueArray[i][1]);//+ " ("+vueArray[i][1].firstChild.firstChild.nodeValue+")";
    }
      
  // on trie le tableau global de vue pour pouvoir l'afficher dans l'ordre de distance plutôt que par section    
    vueTriee=vueArray.sort(triVue);
  
  // on met des couleurs alternées pour voir ce qui est sur la même case que quoi
  	var arrayClasse= new Array("mh_tdpage","mh_tdtitre");
  	var indiceClasse=0;
  	var centreImage;
    for(i=0;i<vueTriee.length;i++){ 
      if(i!=0){
  	    if(!isTREqual(vueTriee[i][1],vueTriee[i-1][1])){
          indiceClasse = (indiceClasse+1)%2;
          vueTriee[i][1].childNodes[0].appendChild(document.createTextNode(" "));
          centreImage=createImage('http://raistlin.fr/~thomas/mh/centrage.png', 'Centrer sur cette case');
          centreImage.addEventListener("click", function(){try{analyse(this.parentNode.parentNode);}catch(e){alert(e)}},true);
          vueTriee[i][1].childNodes[0].appendChild(centreImage);
        }  	    
        if(calculeDist(centre,vueTriee[i][1])!= calculeDist(centre,vueTriee[i-1][1])){
          for(a=0;a<vueTriee[i][1].childNodes.length;a++){
            vueTriee[i][1].childNodes[a].style.borderTop="2px solid black";
          }
        }  	    
        if(vueTriee[i][1].style.backgroundColor==""){
	  vueTriee[i][1].setAttribute('class',arrayClasse[indiceClasse]);
	}
	else{
	  if(arrayClasse[indiceClasse]=="mh_tdtitre"){
	    vueTriee[i][1].style.backgroundColor=assombritCouleur(vueTriee[i][1].style.backgroundColor);
	  }
	}
      }
      mytbody.appendChild(vueTriee[i][1]);
    }
  }
}

// test d'égalité entre les coordonnées de deux éléments (<tr>) rajouté par Tilk alterner les coulelurs
function isTREqual(tr1,tr2)
{
	if(getmyDistance(tr1) != getmyDistance(tr2)) {return false;}		
	var pos1 = getPositionElement(tr1);
	var pos2 = getPositionElement(tr2);
	for(var i=0;i<=2;i++){
    if(parseInt(pos1[i])!=parseInt(pos2[i])){
      return false;}
    }
	return true;
}

// ajouter une ligne de titre dans un tableau
function insertTitle(next, txt) {
	var div = document.createElement('DIV');
	div.setAttribute('class', 'Titre2');
	appendText(div, txt);
	insertBefore(next, div);
}

/* fonction de tri de la vue réorganisée : on trie dans l'ordre suivant 
1) la distance  (croissant)
2) X
3) Y
4) Z
5) le type d'element : Monstres puis Trolls puis Trésors puis Champis puis Lieux (l'ordre des sections de la vue 'normale')
*/
function triVue(a,b){
  retour=0;
  if (getmyDistance(a[1]) < getmyDistance(b[1])) {retour=-1;alerte="getmyDistance";}
  else if (getmyDistance(a[1]) == getmyDistance(b[1]) && getPositionElement(a[1])[0] < getPositionElement(b[1])[0]){retour=-1;alerte="X";}
  else if (getmyDistance(a[1]) == getmyDistance(b[1]) && getPositionElement(a[1])[0] == getPositionElement(b[1])[0] && getPositionElement(a[1])[1] < getPositionElement(b[1])[1]){retour=-1;alerte="Y";}
  else if (getmyDistance(a[1]) == getmyDistance(b[1]) && getPositionElement(a[1])[0] == getPositionElement(b[1])[0] && getPositionElement(a[1])[1] == getPositionElement(b[1])[1] && getPositionElement(a[1])[2] < getPositionElement(b[1])[2]){retour=-1;alerte="Z";}
  else if (getmyDistance(a[1]) == getmyDistance(b[1]) && getPositionElement(a[1])[0] == getPositionElement(b[1])[0] && getPositionElement(a[1])[1] == getPositionElement(b[1])[1] && getPositionElement(a[1])[2] == getPositionElement(b[1])[2]){retour=0;alerte="égalité";}
  else if (getmyDistance(a[1]) == getmyDistance(b[1]) && getPositionElement(a[1])[0] == getPositionElement(b[1])[0] && getPositionElement(a[1])[1] == getPositionElement(b[1])[1] && getPositionElement(a[1])[2] == getPositionElement(b[1])[2] && a[0] < b[0]) {retour=-1;alerte="type";}
  else {retour=1;alerte="sinon";} 
  return retour; 
}

// renvoie la première colonne (distance) de l'élément (<tr>) passé en argument
function getmyDistance(element) {
	var tds = element.childNodes[0].firstChild.nodeValue;
	return parseInt(tds);
}

// renvoie les X,Y,Z de l'élément (<tr>) passé en argument
function getPositionElement(element) {
	var tds = element.childNodes;
	var j = tds.length;
	return new Array(parseInt(tds[j - 3].firstChild.nodeValue), parseInt(tds[j - 2].firstChild.nodeValue), parseInt(tds[j - 1].firstChild.nodeValue));
}

// permet de choisir si les lignes réorganisées sont supprimées de la vue "normale" ou non
function moveOrCopy(source){
    return source.cloneNode(true);
} 

// pour simplifier l'ajout de la selectbox
function nothingToDo() {
  return;
}

// ajout de la ligne dans l'entête
if (isPage("MH_Play/Play_vue.php")) { 	// ZZ: mofification pour prendre en compte les pages de dev
//if(currentURL.indexOf("http://games.mountyhall.com/mountyhall/MH_Play/Play_vue.php")==0){
  backupArray();
  var headTr = insertTr(totaltab[3].childNodes[1].firstChild, 'mh_tdpage');	
  td3= appendTdText(headTr,'VUE REORGANISEE :',true);
  td3.setAttribute('align', 'right');
  td3 = appendTdCenter(headTr);
  
// ajout des différents filtres :
// copie ou déplacement des lignes?
  checkBoxRemAnalyse = appendNobr(td3, 'RemAnalyse', null, 'Désactiver le script').firstChild;
  
  //types de lignes réorganisées : en cas de modification, on recharge la vue réorganisée
  var maTable2 = document.createElement('table');
  maTable2.setAttribute('border', '0');
  maTable2.setAttribute('class', 'mh_tdborder');
  maTable2.setAttribute('align', 'center');
  maTable2.setAttribute('cellpadding', '2');
  maTable2.setAttribute('cellspacing', '1');
  var mytbody2 = document.createElement('tbody');
  maTable2.appendChild(mytbody2);
  td3.appendChild(maTable2);
    
  tr = appendTr(mytbody2,'mh_tdtitre');  
  appendTdText(tr, "", true).setAttribute('align', 'center');
  td2=appendTdText(tr, "Les Monstres", true)
  td2.setAttribute('align', 'center');
  td2=appendTdText(tr, "Les Trolls", true)
  td2.setAttribute('align', 'center');
  td2=appendTdText(tr, "Les Trésors", true)
  td2.setAttribute('align', 'center');
  td2=appendTdText(tr, "Les Champis", true)
  td2.setAttribute('align', 'center');
  td2=appendTdText(tr, "Les Lieux", true)
  td2.setAttribute('align', 'center');

//cacher ou non les types de lignes
  tr = appendTr(mytbody2,'mh_tdpage');
  td2=appendTdText(tr, "Ne pas Réorganiser", true)
  td2.setAttribute('align', 'center');
  td2=appendTdText(tr, "", true)
  td2.setAttribute('align', 'center');
  checkBoxVRM = appendNobr(td2, 'remM', null, '').firstChild;
  td2=appendTdText(tr, "", true)
  td2.setAttribute('align', 'center');
  checkBoxVRT = appendNobr(td2, 'remT', null, '').firstChild;
  td2=appendTdText(tr, "", true)
  td2.setAttribute('align', 'center');
  checkBoxVRO = appendNobr(td2, 'remO', null, '').firstChild;
  td2=appendTdText(tr, "", true)
  td2.setAttribute('align', 'center');
  checkBoxVRC = appendNobr(td2, 'remC', null, '').firstChild;
  td2=appendTdText(tr, "", true)
  td2.setAttribute('align', 'center');
  checkBoxVRL = appendNobr(td2, 'remL', null, '').firstChild;
  
// distance réorganisée par type de ligne
  tr = appendTr(mytbody2,'mh_tdpage');
  td2=appendTdText(tr, "Distance de Réorganisation", true)
  td2.setAttribute('align', 'center');
  td2=appendTdText(tr, "", true)
  td2.setAttribute('align', 'center');
  distFiltreM = appendTextbox(td2, 'text', 'distFiltreM', 3, 3, 5);
  td2=appendTdText(tr, "", true)
  td2.setAttribute('align', 'center');
  distFiltreT = appendTextbox(td2, 'text', 'distFiltreT', 3, 3, 5);
  td2=appendTdText(tr, "", true)
  td2.setAttribute('align', 'center');
  distFiltreO = appendTextbox(td2, 'text', 'distFiltreO', 3, 3, 5);
  td2=appendTdText(tr, "", true)
  td2.setAttribute('align', 'center');
  distFiltreC = appendTextbox(td2, 'text', 'distFiltreC', 3, 3, 5);
  td2=appendTdText(tr, "", true)
  td2.setAttribute('align', 'center');
  distFiltreL = appendTextbox(td2, 'text', 'distFiltreL', 3, 3, 5);
  
  getCheckBoxCookie(checkBoxVRM,"REORGFILTREMONSTRES");
  getCheckBoxCookie(checkBoxVRT,"REORGFILTRETROLLS");
  getCheckBoxCookie(checkBoxVRO,"REORGFILTRETRESORS");
  getCheckBoxCookie(checkBoxVRC,"REORGFILTRECHAMPIS");
  getCheckBoxCookie(checkBoxVRL,"REORGFILTRELIEUX");
  getCheckBoxCookie(checkBoxRemAnalyse,"REORGREMSCRIPT");
  
  //getComboBoxCookie(cMLSelect,"REORGDELMOVELINE");
  
  getTextBoxCookie(distFiltreM,"REORGDISTMONSTRES");
  getTextBoxCookie(distFiltreT,"REORGDISTTROLLS");
  getTextBoxCookie(distFiltreO,"REORGDISTTRESORS");
  getTextBoxCookie(distFiltreC,"REORGDISTCHAMPIS");
  getTextBoxCookie(distFiltreL,"REORGDISTLIEUX");

  filtreButton = appendButton(td3,'Mise �  jour',analyse); // en cas de modification, on recharge la vue réorganisée
  filtreButton.setAttribute('name', 'filtreButton');
  appendText(td3,'\u000a\u000a');
  addPmPxForm();
  analyse(null);
  computeMission_reorg = computeMission;
  computeMission = newComputeMission;
  analyseTagFile_reorg = analyseTagFile;
  analyseTagFile = newAnalyseTagFile;
  refreshDiplo_reorg = refreshDiplo;
  refreshDiplo = newRefreshDiplo;

}

function addPmPxForm(){

//  on rajoute les checkbox
    for (var cpt=3;cpt<x_trolls.length;cpt++) {
      varCheckBox=appendNobr(td2, x_trolls[cpt].childNodes[1].innerHTML, null, '').firstChild;  
      x_trolls[cpt].childNodes[2].appendChild(varCheckBox);
    }   
    
    aList = document.getElementsByTagName('p');
    
    // on insère les boutons avant la vue reorg   
    insertPoint=aList[0];
    insertDiv=document.createElement('DIV');
    insertDiv.setAttribute('id','pmpx1');
    insertBefore(insertPoint,insertDiv);

    // on insère les boutons avant les trolls
    insertPoint2=aList[0].childNodes[4];
    insertDiv2=document.createElement('DIV');
    insertDiv2.setAttribute('id','pmpx2');
    insertBefore(insertPoint2,insertDiv2);
    
    pmButton = appendButton(insertDiv,'PM',sendPM); 
    pxButton = appendButton(insertDiv,'PX',sendPX);  
    pmButton2 = appendButton(insertDiv2,'PM',sendPM); 
    pxButton2 = appendButton(insertDiv2,'PX',sendPX);  
    
}


function sendPM(){
    var basePmUrl = "http://games.mountyhall.com/mountyhall/Messagerie/MH_Messagerie.php?cat=3&dest=";
    var listDestinataires = "";
    for (var cpt=3;cpt<x_trolls.length;cpt++) {
      if(x_trolls[cpt].childNodes[2].lastChild.checked){
        listDestinataires += x_trolls[cpt].childNodes[2].lastChild.id + "," ;        
      }
    } 
    for (var cpt=3;cpt<vueArray.length;cpt++) {
      if(vueArray[cpt][0]==1 && vueArray[cpt][1].childNodes[3].lastChild.checked){
        listDestinataires += vueArray[cpt][1].childNodes[3].lastChild.id + "," ;        
      }
    } 
    listDestinataires=enleveDoublons(listDestinataires.slice(0,-1).split(",")).join(",");
    window.location.replace(basePmUrl+listDestinataires);
}

function sendPX(){
  var basePxUrl = "http://games.mountyhall.com/mountyhall/Messagerie/MH_Messagerie.php?cat=8&dest=";
    var listDestinataires = "";
    for (var cpt=3;cpt<x_trolls.length;cpt++) {
      if(x_trolls[cpt].childNodes[2].lastChild.checked){
        listDestinataires += x_trolls[cpt].childNodes[2].lastChild.id + "," ;        
      }
    } 
    for (var cpt=3;cpt<vueArray.length;cpt++) {
      if(vueArray[cpt][0]==1 && vueArray[cpt][1].childNodes[3].lastChild.checked){
        listDestinataires += vueArray[cpt][1].childNodes[3].lastChild.id + "," ;        
      }
    }
    listDestinataires=enleveDoublons(listDestinataires.slice(0,-1).split(",")).join(",");
    window.location.replace(basePxUrl+listDestinataires);
}

function newRefreshDiplo(begin, end)
{
	refreshDiplo_reorg(begin,end);
	analyse(null);
}

function newComputeMission(begin, end)
{
	computeMission_reorg(begin,end);
	analyse(null);
}

function newComputeTag()
{
	computeTag_reorg(begin,end);
	analyse(null);
}

function newAnalyseTagFile(data)
{
	analyseTagFile_reorg(data);
	analyse(null);
}

function setTextBoxCookie(TextBox, cookie) {
	var dist = TextBox.value;
	MZ_setValue(cookie, dist);
	return dist;
}

function getTextBoxCookie(TextBox, cookie) {
	if(MZ_getValue(cookie)!=null)
		TextBox.value = MZ_getValue(cookie);
}

function setReorgComboBoxCookie(comboBox, cookie) {
	var filtre = comboBox.value;
	MZ_setValue(cookie, filtre);
	return filtre;
}

function calculeDist(elem1, elem2){
  var distance = 0;
  if(elem1 == null && elem2 == null){return 0;}
  else if(elem1 == null && elem2 != null){return getmyDistance(elem2);}
  else if(elem2 == null && elem1 != null){return getmyDistance(elem1);}
  else{
    distance=Math.max(distance, Math.abs(getPositionElement(elem1)[0]-getPositionElement(elem2)[0]));
    distance=Math.max(distance, Math.abs(getPositionElement(elem1)[1]-getPositionElement(elem2)[1]));
    distance=Math.max(distance, Math.abs(getPositionElement(elem1)[2]-getPositionElement(elem2)[2]));
  }
  return distance;
}

function assombritCouleur(str) {   
  arr = str.replace(/rgb\(|\)/g, "").split(",");    
  res=new Array();
  res[0] = parseInt(arr[0], 10)-40;
  res[1] = parseInt(arr[1], 10)-40;
  res[2] = parseInt(arr[2], 10)-40;
  resultat="rgb("+res[0]+","+res[1]+","+res[2]+")";
  return resultat;
}

function enleveDoublons(TabInit){
  NvTab= new Array();
  TabInit.sort();
  NvTab[0]=TabInit[0];
  compteur=1;
  for(i=1;i<TabInit.length;i++){
    if(TabInit[i]!=TabInit[i-1]){NvTab[compteur++]=TabInit[i];}
  }   
  return NvTab;
}
