/*********************************************************************************
*    This file is part of ZoryaZilla Fusion merged with mountyzilla              *
*********************************************************************************/
//============================ ZZ PRE CODE ======================================

function trim(str) {
	//str = this != window? this : str;
	return str.replace(/^\s+/, '').replace(/\s+$/, '');
}


function showUsury()
{
  if( (window.self.location.toString().indexOf("Play_equipement.php?as_CurSect=equip")!=-1) || (window.self.location.toString().indexOf("Play_equipement.php")!=-1 &&
      window.self.location.toString().indexOf("Play_equipement.php?")==-1 ))
  {
    var tables = document.getElementsByTagName('table');
    var i = 0;
    while((tables[i].getAttribute('class') != "TableEq") && (i < tables.length))
    { i++; };

    if(tables[i].getAttribute('class') == "TableEq")
    {
      var tableEq = tables[i];
      var arrTD = tableEq.getElementsByTagName('td');
      var td_i = 0;

      var etats = new Array("Intact",
             "Excellent Etat",
             "Bon Etat",
             "Normal",
             "Usagé",
             "Usé",
             "Très Usé",
             "Quasi inutilisable",
             "Inutilisable",
             "Cassé");

      var colors = new Array ("#006600",
               "#009900",
               "#00CC00",
               "#99CC00",
               "#CCCC00",
               "#CC9900",
               "#CC6600",
               "#CC3300",
               "#CC0000",
               "#FF0000");

      for(td_i = 0; td_i < arrTD.length; td_i++)
      {
   for(var etat_i=0; etat_i < etats.length; etat_i++)
   {
     var etat = "Etat : " + etats[etat_i];
     var etat_regexp = new RegExp(etat);
     if(arrTD[td_i].innerHTML.match(etat))
     {
       var new_txt = "<span style=\"color:" +
             colors[etat_i] +
             ";font-weight:bold;\">Etat : " +
             etats[etat_i] +
             "</span>";
       arrTD[td_i].innerHTML = arrTD[td_i].innerHTML.replace(etat_regexp, new_txt);
     }
   }
      }
    }
  }
}

function URLEncode(sStr) {
    return escape(sStr).replace(/\+/g, '%2B').replace(/\"/g,'%22').replace(/\'/g, '%27').replace(/\//g,'%2F');
}

function putMatosInDB()
{
	if (( window.self.location.toString().indexOf("Play_equipement.php")!=-1 && window.self.location.toString().indexOf("Play_equipement.php?")==-1 )
		 || window.self.location.toString().indexOf("Play_equipement.php?as_CurSect=equip")!=-1)
	{
		var arrTR = document.getElementsByTagName('tr');
		var numtroll = MZ_getValue("NUM_TROLL");
		var data = '&TypeData=Matos';
		data = data + '&TiD=' + numtroll;
		var nbMatosToAdd = 0;
		var typeMatos = "";
		var ipos = 32;
		while (1)
		{
			if (( arrTR[ipos].childNodes[0] != '[object XPCNativeWrapper [object HTMLTableCellElement]]' ) && ( arrTR[ipos].childNodes[0] != '[object XrayWrapper [object HTMLTableCellElement]]' ) )
			{
				break;
			}

			if ( arrTR[ipos].childNodes[0].childNodes[0].childNodes[0] )
			{
				 typeMatos = arrTR[ipos].childNodes[0].childNodes[0].childNodes[0].nodeValue;
			}
			else
			{
				var matosId = trim(arrTR[ipos].childNodes[2].childNodes[2].nodeValue );

				if ( matosId[matosId.length - 1] == ']' )
				{
					data = data+'&Matos[]='+URLEncode( typeMatos + ' : ' + arrTR[ipos].childNodes[2].childNodes[3].childNodes[0].nodeValue );
					matosId = matosId.substring( 1, matosId.length - 1 );
					data = data+'&MiD[]='+matosId;
					data = data+'&Desc[]='+URLEncode( arrTR[ipos].childNodes[2].childNodes[6].nodeValue );
					data = data+'&Etat[]='+URLEncode( trim(arrTR[ipos].childNodes[2].childNodes[4].nodeValue) );
				}
				nbMatosToAdd++;
			}
			ipos++;
		}
		//alert(ZZDB+'/mzData.php?'+data);
		MZ_appendNewScript(ZZDB+'/mzData.php?'+data);
	}
}


function getAllText(Element) {
   if(Element.nodeName == "#text") {
      var thisText=Element.nodeValue.replace(/[\t\n\r]/gi,' ');
      thisText=thisText.replace(/[ ]+/gi,' ');
      if(thisText==" ") return '';
      return thisText;
   }
   if(Element.nodeName.toLowerCase() == "script" || Element.nodeName.toLowerCase() == "noframes") return "";
   var string=''
   if(Element.nodeName.toLowerCase() == "tbody" || Element.nodeName.toLowerCase() == "center" || Element.nodeName.toLowerCase() == "br") string='\n';
   if(Element.nodeName.toLowerCase() == "li") string='';
   for(var i=0;i<Element.childNodes.length;i++) {
     //string+=' '+Element.nodeName+' : ';
     string+=getAllText(Element.childNodes[i]);
     if(Element.nodeName.toLowerCase() == "tbody" && i<Element.childNodes.length-1) string+='\n';
     else if(Element.nodeName.toLowerCase() =='tr' && i<Element.childNodes.length-1) string+=' ';
   }
   if(Element.nodeName.toLowerCase() == "center" || Element.nodeName.toLowerCase() == "li") string+='\n';
   return string;
}

function setDBMsgZZ(msg) { 
  var totaltab=document.getElementsByTagName( 'table' );
  var myB=document.createElement('i');
  myB.appendChild(document.createTextNode(msg));
  myB.setAttribute("class", "titre5");
  totaltab[3].appendChild( myB );
}

function getGogo(){
  if ( window.self.location.toString().indexOf("Play_equipement.php?as_CurSect=follo")!=-1 )
  {
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
                        if ((equipGogo.childNodes[i].childNodes[0].childNodes[0] == '[object XPCNativeWrapper [object HTMLSpanElement]]') || ( equipGogo.childNodes[i].childNodes[0].childNodes[0] == '[object XrayWrapper [object HTMLElement]]'))
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
}

putMatosInDB(); 	// ITM Chargement du matos en DB
getGogo();		// ITM Mettre à jour les id des Gogo
showUsury();		// couleur de l'équipement, code de netWorms ! Merci à lui!

//===================== fonction MZ remplacée car elle posait probleme avec le matériel à deux mains.
function treateEquipement() {
	//On récupère l'equipement
	var textes = document.evaluate(
		"//table[@class = 'TableEq']/descendant::text()[contains(.,' : +') or contains(.,' : -')]"
		, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var listeBonus = new Array(); 
	// faire une liste des id du matériel déjà comptabilisé.
	var listeMatosID = new Array(); var matosID=0; var cmId=0; var dejaVu=false;
	
	for (var i = 0; i < textes.snapshotLength; i++) 
	{
		var texte = textes.snapshotItem(i).nodeValue;
		// recherche de l'id de l'equipement pour eviter de compter 2 fois les armes à deux mains!
		var equip=textes.snapshotItem(i).parentNode.parentNode.parentNode;
		if (equip.childNodes.length==3) matosID=trim(equip.childNodes[1].childNodes[2].nodeValue); else matosID=trim(equip.parentNode.childNodes[0].childNodes[0].childNodes[2].nodeValue);
		matosID=matosID.substring(1, matosID.length-1);
		if ((listeMatosID[matosID]) && (matosID!=cmId)) {
			dejaVu=true; 
		} else {
			if (!listeMatosID[matosID]) dejaVu=false; 
			listeMatosID[matosID]=true;
		}
		cmId=matosID;
		
		var liste = texte.split("|");
		if (!dejaVu) for(var j=0;j<liste.length;j++)
		{
			var bonus = liste[j];
			if(bonus.indexOf(" : ")!=-1)
			{
				var valeur = bonus.substring(bonus.indexOf(" : ")+3).split("\\");
				bonus = trim(bonus.substring(0,bonus.indexOf(" : ")));
				if(listeBonus[bonus] == null)
				{
					listeBonus[bonus] = new Array();
					listeBonus[bonus][0] = parseInt(valeur[0]);
					listeBonus[bonus][1] = parseInt(valeur.length==1?0:valeur[1]);
				}
				else
				{
					listeBonus[bonus][0] += parseInt(valeur);
					listeBonus[bonus][1] += parseInt(valeur.length==1?0:valeur[1]);
				}
			}
		}
	}
	
	var text="";
	for (key in listeBonus)
	{
		if(listeBonus[key][0]==0 && listeBonus[key][1]==0)
			continue;
		if(text.length!=0)
			text+=" | ";
		text+=key+" : "+positive(listeBonus[key][0]);
		if( listeBonus[key][1]!=0)
			text+="\\"+positive(listeBonus[key][1])
		if(key=="TOUR")
			text+=" min";
		if(key=="RM" || key=="MM")
			text+="%";
	}
	if(text.length>0)
	{
		var node = document.evaluate("//table[@class = 'mh_tdpage']",
				document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		insertText(node,'Total : '+text, true);
		insertBr(node);
	}
	
}

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

var popup;

function initPopup() {
	popup = document.createElement('div');
	popup.setAttribute('id', 'popup');
	popup.setAttribute('class', 'mh_textbox');
	popup.setAttribute('style', 'position: absolute; border: 1px solid #000000; visibility: hidden;' +
			'display: inline; z-index: 3; max-width: 400px;');
	document.body.appendChild(popup);
}

function showPopup(evt) {
	var texte = this.getAttribute("texteinfo");
	popup.innerHTML = texte;
	popup.style.left = evt.pageX + 15 + 'px';
	popup.style.top = evt.pageY + 'px';
	popup.style.visibility = "visible";
}

function hidePopup() {
	popup.style.visibility = "hidden";
}

function createPopupImage(url, text)
{
	var img = document.createElement('img');
	img.setAttribute('src',url);
	img.setAttribute('align','ABSMIDDLE');
	img.setAttribute("texteinfo",text);
	img.addEventListener("mouseover", showPopup,true);
	img.addEventListener("mouseout", hidePopup,true);
	return img;
}

function formateTexte(texte)
{
	texte = texte.replace(/\n/g,"<br/>");
	texte = texte.replace(/^([^<]*) d'un/g,"<b>$1</b> d'un");
	texte = texte.replace(/<br\/>([^<]*) d'un/g,"<br/><b>$1</b> d'un");
	texte = texte.replace(/(d'une? )([^<]*) d'au/g,"$1<b>$2</b> d'au");
	texte = texte.replace(/(Qualité )([^<]*) \[/g,"$1<b>$2</b> [");
	texte = texte.replace(/\[([^<]*)\]/g,"[<b>$1</b>]");
	return texte;
}


function treateGowaps() {
	//On récupère les gowaps possédants des composants
	var tbodys = document.evaluate(
			"//table[@width='98%' and @class='mh_tdborder']/descendant::img[@alt = 'Composant - Spécial']/../../..",
			document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	for (var j = 0; j < tbodys.snapshotLength; j++) 
	{
		var tbody = tbodys.snapshotItem(j);
		var tbody1 = tbody.parentNode.parentNode.parentNode.parentNode.parentNode;
		var node = document.evaluate("./descendant::a[contains(@href,'FO_Profil.php')]/text()",
				tbody1, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		
		
		insertButtonComboDB(tbody, 'gowap', parseInt(node.nodeValue.substring(0, node.nodeValue.indexOf('.'))));
		if(MZ_getValue("NOINFOEM") != "true")
			insertEMInfos(tbody);
	}
}

function positive(i)
{
	if(i>=0)
		return "+"+i;
	return i;
}

// Function treateEquipement() has been removed from MZ original code for ZZ Fusion


function treateChampi() {
	if(MZ_getValue("NOINFOEM") == "true")
		return false;
	var nodes = document.evaluate("//img[@alt = 'Champignon - Spécial']/../a/text()",
			document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength == 0)
		return false;

	for (var i = 0; i < nodes.snapshotLength; i++) {
			var node = nodes.snapshotItem(i);
			var texte = trim(node.nodeValue.replace(/\240/g, " "));
			if(texte.indexOf("*")!=-1)
				texte = texte.substring(0,texte.lastIndexOf(" "));
			var nomChampi = texte.substring(0,texte.lastIndexOf(" "));
			if(moisChampi[nomChampi])
			{
				appendText(node.parentNode.parentNode," [Mois "+moisChampi[nomChampi]+"]");
			}
			
	}
}



try
{
start_script();

if (currentURL.indexOf("?as_CurSect=follo") != -1)
{
	treateChampi();
	treateGowaps();
}
else if(currentURL.indexOf("?")==-1 || currentURL.indexOf("?as_CurSect=equip") != -1)
	treateEquipement();
	
if(MZ_getValue(numTroll+".enchantement.liste") && MZ_getValue(numTroll+".enchantement.liste")!="" )
{
	initPopup();
	computeEnchantementEquipement(createPopupImage,formateTexte);
}
	
displayScriptTime();
}
catch(e){alert(e)}
//============================ ZZ POST CODE ======================================
