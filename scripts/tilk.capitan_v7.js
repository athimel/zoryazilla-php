/****************************************************************
*         Aide à la recherche de cachettes de Capitan           *
*              Développé par Mini TilK (n°36216)                *
*                      mini@tilk.info                           *
*****************************************************************
*         Ce script nécessite Mountyzilla pour être utilisé     *
*           Une fois MZ installé, allez dans Options            *
*      Modules Complémentaires/extensions/Mountyzilla/Options   *
*          Il suffit de cliquer sur nouveau script              *
*                   Et choisir ce fichier                       *
*****************************************************************
*         Pour utiliser la recherche, allez des les infos       *
*             de la carte de la cachette du capitan             *
*                    Une fois ceci fait,                        *
*           toutes les recherches seront sauvergardées          *
*            Et dans le détail de la carte vous verrez          *
*       Le nombre de cachettes possibles et leur position       *
****************************************************************/


function sortNumber(a,b)
{
	return b-a;
}

function removeTab(tab, i)
{
	var newTab = new Array();
	for(var j=0;j<i;j++)
	{
		newTab.push(tab[j]);
	}
	for(var j=i+1;j<tab.length;j++)
	{
		newTab.push(tab[j]);
	}
	return newTab;
}
var cache=new Array();

function tabToString(tab)
{
	var string = tab[0];
	for(var i=1;i<tab.length;i++)
		string+=";"+tab[i];
	return string;
}

function combi(tab)
{
	var newTab = new Array();
	if(tab.length==1)
	{
		newTab[""+tab[0]]=1;
		return newTab;
	}
	var val = tabToString(tab);
	if(cache[val])
		return cache[val];
	for(var i=0;i<tab.length;i++)
	{
		var lastTab = combi(removeTab(tab,i));
		for(var j in lastTab)
			newTab[tab[i]+";"+j]=1;
	}
	cache[val]=newTab;
	return newTab;
}

function affiche(tab)
{
	var newTab = combi(tab);
	var string="";
	for(var i in newTab)
	{
		string += i+"\n";
	}
	alert(string);
}

function extractPosition(nombre, indice)
{
	if((nombre+"").length<=indice)
		return "%";
	indice = (nombre+"").length - 1 - indice;
	return (nombre+"").substring(indice,indice+1);
}

function comparePos(x,y,n,x1,y1,n1)
{
	x = Math.abs(x);
	y = Math.abs(y);
	n = Math.abs(n);
	x1 = Math.abs(x1);
	y1 = Math.abs(y1);
	n1 = Math.abs(n1);
	var nbGood=0;
	for(var i=0;i<(x+"").length;i++)
		if(extractPosition(x,i)==extractPosition(x1,i))
			nbGood++;
	for(var i=0;i<(y+"").length;i++)
		if(extractPosition(y,i)==extractPosition(y1,i))
			nbGood++;
	for(var i=0;i<(n+"").length;i++)
		if(extractPosition(n,i)==extractPosition(n1,i))
			nbGood++;
	return nbGood;
}

function signe(x)
{
	if(x<0)
		return -1;
	return 1;
}

function getPosFromArray(liste,begin,length)
{
	var pos="";
	for(var i=begin;i<begin+length;i++)
		pos+=""+liste[i];
	return parseInt(pos, 10);
}

function calculeSolution6(x,y,n,essais)
{
	var listeChiffre = new Array();
	for(var i=0;i<(Math.abs(x)+"").length;i++)
		listeChiffre.push(extractPosition(Math.abs(x),i));
	for(var i=0;i<(Math.abs(y)+"").length;i++)
		listeChiffre.push(extractPosition(Math.abs(y),i));
	for(var i=0;i<(Math.abs(n)+"").length;i++)
		listeChiffre.push(extractPosition(Math.abs(n),i));
	var listeSolutionsPossibles = combi(listeChiffre);
	var listeSolutions = new Array();
	for(var key in listeSolutionsPossibles)
	{
		var liste = key.split(";");
		var x1 = getPosFromArray(liste,0,listeChiffre.length/3);
		var y1 = getPosFromArray(liste,listeChiffre.length/3,listeChiffre.length/3);
		var n1 = getPosFromArray(liste,2*(listeChiffre.length)/3,listeChiffre.length/3);
		var oki = true;
		for(var i=0;i<essais.length;i++)
		{
			if(essais[i][3] != comparePos(x1,y1,n1,Math.abs(essais[i][0]),Math.abs(essais[i][1]),Math.abs(essais[i][2])))
			{
				oki=false;
				break;
			}
		}
		if(oki)
			listeSolutions.push(new Array(x1*signe(x),y1*signe(y),n1*signe(n)));
	}
	return listeSolutions;
}

function calculeSolution5(x,y,n,essais)
{
	var listeChiffre = new Array();
	for(var i=0;i<(Math.abs(x)+"").length;i++)
		listeChiffre.push(extractPosition(Math.abs(x),i));
	for(var i=0;i<(Math.abs(y)+"").length;i++)
		listeChiffre.push(extractPosition(Math.abs(y),i));
	for(var i=0;i<(Math.abs(n)+"").length;i++)
		listeChiffre.push(extractPosition(Math.abs(n),i));
	var listeSolutionsPossibles = combi(listeChiffre);
	var length = Math.floor(listeChiffre.length/3);
	var listeSolutions = new Array();
	for(var key in listeSolutionsPossibles)
	{
		var liste = key.split(";");
		var x1 = getPosFromArray(liste,0,length);
		var y1 = getPosFromArray(liste,length,length+1);
		var n1 = getPosFromArray(liste,2*length+1,length+1);
		var oki = true;
		for(var i=0;i<essais.length;i++)
		{
			if(essais[i][3] != comparePos(x1,y1,n1,Math.abs(essais[i][0]),Math.abs(essais[i][1]),Math.abs(essais[i][2])))
			{
				oki=false;
				break;
			}
		}
		if(oki)
			listeSolutions.push(new Array(x1*signe(x),y1*signe(y),n1*signe(n)));
	}
	for(var key in listeSolutionsPossibles)
	{
		var liste = key.split(";");
		var x1 = getPosFromArray(liste,0,length+1);
		var y1 = getPosFromArray(liste,length+1,length);
		var n1 = getPosFromArray(liste,2*length+1,length+1);
		var oki = true;
		for(var i=0;i<essais.length;i++)
		{
			if(essais[i][3] != comparePos(x1,y1,n1,Math.abs(essais[i][0]),Math.abs(essais[i][1]),Math.abs(essais[i][2])))
			{
				oki=false;
				break;
			}
		}
		if(oki)
			listeSolutions.push(new Array(x1*signe(x),y1*signe(y),n1*signe(n)));
	}
	for(var key in listeSolutionsPossibles)
	{
		var liste = key.split(";");
		var x1 = getPosFromArray(liste,0,length+1);
		var y1 = getPosFromArray(liste,length+1,length+1);
		var n1 = getPosFromArray(liste,2*length+2,length);
		var oki = true;
		for(var i=0;i<essais.length;i++)
		{
			if(essais[i][3] != comparePos(x1,y1,n1,Math.abs(essais[i][0]),Math.abs(essais[i][1]),Math.abs(essais[i][2])))
			{
				oki=false;
				break;
			}
		}
		if(oki)
			listeSolutions.push(new Array(x1*signe(x),y1*signe(y),n1*signe(n)));
	}
	return listeSolutions;
}

function calculeSolution4(x,y,n,essais)
{
	var listeChiffre = new Array();
	for(var i=0;i<(Math.abs(x)+"").length;i++)
		listeChiffre.push(extractPosition(Math.abs(x),i));
	for(var i=0;i<(Math.abs(y)+"").length;i++)
		listeChiffre.push(extractPosition(Math.abs(y),i));
	for(var i=0;i<(Math.abs(n)+"").length;i++)
		listeChiffre.push(extractPosition(Math.abs(n),i));
	var listeSolutionsPossibles = combi(listeChiffre);
	var length = Math.floor(listeChiffre.length/3);
	var listeSolutions = new Array();
	for(var key in listeSolutionsPossibles)
	{
		var liste = key.split(";");
		var x1 = getPosFromArray(liste,0,length);
		var y1 = getPosFromArray(liste,length,length);
		var n1 = getPosFromArray(liste,2*length,length+1);
		var oki = true;
		for(var i=0;i<essais.length;i++)
		{
			if(essais[i][3] != comparePos(x1,y1,n1,Math.abs(essais[i][0]),Math.abs(essais[i][1]),Math.abs(essais[i][2])))
			{
				oki=false;
				break;
			}
		}
		if(oki)
			listeSolutions.push(new Array(x1*signe(x),y1*signe(y),n1*signe(n)));
	}
	for(var key in listeSolutionsPossibles)
	{
		var liste = key.split(";");
		var x1 = getPosFromArray(liste,0,length+1);
		var y1 = getPosFromArray(liste,length+1,length);
		var n1 = getPosFromArray(liste,2*length+1,length);
		var oki = true;
		for(var i=0;i<essais.length;i++)
		{
			if(essais[i][3] != comparePos(x1,y1,n1,Math.abs(essais[i][0]),Math.abs(essais[i][1]),Math.abs(essais[i][2])))
			{
				oki=false;
				break;
			}
		}
		if(oki)
			listeSolutions.push(new Array(x1*signe(x),y1*signe(y),n1*signe(n)));
	}
	for(var key in listeSolutionsPossibles)
	{
		var liste = key.split(";");
		var x1 = getPosFromArray(liste,0,length);
		var y1 = getPosFromArray(liste,length,length+1);
		var n1 = getPosFromArray(liste,2*length+1,length);
		var oki = true;
		for(var i=0;i<essais.length;i++)
		{
			if(essais[i][3] != comparePos(x1,y1,n1,Math.abs(essais[i][0]),Math.abs(essais[i][1]),Math.abs(essais[i][2])))
			{
				oki=false;
				break;
			}
		}
		if(oki)
			listeSolutions.push(new Array(x1*signe(x),y1*signe(y),n1*signe(n)));
	}
	return listeSolutions;
}

function calculeSolution(x,y,n,essais)
{
	var size = (";"+Math.abs(x)+Math.abs(y)+Math.abs(n)).length-1;
	if(size%3==0)
		return calculeSolution6(x,y,n,essais);
	if(size%3==1)
		return calculeSolution4(x,y,n,essais);
	if(size%3==2)
		return calculeSolution5(x,y,n,essais);
}
function afficheSolutions(x,y,n,essais)
{
	var listeSolutions = calculeSolution(x,y,n,essais);
	var string="Il y a "+listeSolutions.length+" solutions";
	if(listeSolutions.length<=10)
	{
		for(var i=0;i<listeSolutions.length;i++)
		{
			string+= "\n x="+listeSolutions[i][0]+" y="+listeSolutions[i][1]+" n="+listeSolutions[i][2];
		}
	}
	return string;
}

function toggleTableau() {

	var tbody = this.parentNode.parentNode.parentNode.childNodes[1];
	
	tbody.setAttribute('style', !tbody.getAttribute('style') || tbody.getAttribute('style') == '' ? 'display:none;' : '');
}

function createCase(titre,table,width)
{
	if(width==null)
		width="120";
	var tr = appendTr(table, 'mh_tdpage');

	var td = appendTdText(tr, titre, true);
	td.setAttribute('class', 'mh_tdpage');
	td.setAttribute('width', width);
	td.setAttribute('align', 'center');

	return td;
}

var tbody;

function generateTable(listeSolutions)
{
	var table = document.createElement('table');
	table.setAttribute('class', 'mh_tdborder');
	table.setAttribute('border', '0');
	table.setAttribute('cellspacing', '1');
	table.setAttribute('cellpadding', '4');
	table.setAttribute('style', 'width: 400px;');
	table.setAttribute('align', 'center');
	
	if(listeSolutions.length==1)
	{
		var thead = document.createElement('thead');
		var tr = appendTr(thead, 'mh_tdtitre');
		var td = appendTdText(tr, "Position de la cachette : X = "+listeSolutions[0][0]+", Y = "+listeSolutions[0][1]+", N = "+listeSolutions[0][2], true);
		td.setAttribute('align', 'center');
		table.appendChild(thead);
		return table;
	}
	else if(listeSolutions.length==0)
	{
		var thead = document.createElement('thead');
		var tr = appendTr(thead, 'mh_tdtitre');
		var td = appendTdText(tr, "Aucune solution trouvée.", true);
		td.setAttribute('align', 'center');
		table.appendChild(thead);
		return table;
	}
	
	var thead = document.createElement('thead');
	var tr = appendTr(thead, 'mh_tdtitre');
	var td = appendTdText(tr, "Il y a "+listeSolutions.length+" positions possibles", true);
	td.setAttribute('align', 'center');
	table.appendChild(thead);
	
	tbody = document.createElement('tbody');
	table.appendChild(tbody);
	
	for (var i = 0; i < listeSolutions.length; i++) {
		 createCase("X = "+listeSolutions[i][0]+", Y = "+listeSolutions[i][1]+", N = "+listeSolutions[i][2],tbody,400);
	}
	
	
	td.addEventListener("click", toggleTableau, true);
	td.setAttribute('onmouseover', "this.style.cursor = 'pointer'; this.className = 'mh_tdpage';");
	td.setAttribute('onmouseout', "this.className = 'mh_tdtitre';");
	tbody.setAttribute('style', 'display:none;');
	
	return table;
}

var listeSolutions = new Array();

function afficheInfoCarte(idCarte)
{
	var originalPos = MZ_getValue(numTroll+".capitan."+idCarte+".position").split(";");
	if(originalPos.length!=3)
		return;
	var essais = new Array();
	var i = 0;
	while(MZ_getValue(numTroll+".capitan."+idCarte+".essai."+i) != null)
	{
		essais.push(MZ_getValue(numTroll+".capitan."+idCarte+".essai."+i).split(";"));
		i++;
	}
	listeSolutions = calculeSolution(originalPos[0],originalPos[1],originalPos[2],essais);
	return generateTable(listeSolutions);
}

function getRepartitionFromCase(tx, ty, tn, listeSolutions)
{
	var size = (";"+Math.abs(listeSolutions[0][0])+Math.abs(listeSolutions[0][0])+Math.abs(listeSolutions[0][0])).length-1;
	var repartition = new Array();
	for(var i=0;i<size;i++)
		repartition.push(0);
	for(var i=0;i<listeSolutions.length;i++)
	{
		var nbGood = comparePos(listeSolutions[i][0],listeSolutions[i][1],listeSolutions[i][2],tx,ty,tn);
		repartition[nbGood]++;
	}
	repartition.sort(sortNumber);
	return repartition;
}

function getMeanPositionNumber(repartition,nbSolutions)
{
	var result=0;
	for(var i=0;i<repartition.length;i++)
	{
		result+=repartition[i]*repartition[i];
	}
	return result/nbSolutions;
}

function newRecherche(listeSolutions)
{
	var tx = parseInt(MZ_getValue(numTroll+".position.X"));
	var ty = parseInt(MZ_getValue(numTroll+".position.Y"));
	var tn = parseInt(MZ_getValue(numTroll+".position.N"));
	if(listeSolutions.length<=1)
		return null;
	var size = (";"+Math.abs(listeSolutions[0][0])+Math.abs(listeSolutions[0][0])+Math.abs(listeSolutions[0][0])).length-1;
	var repartition = getRepartitionFromCase(tx, ty, tn, listeSolutions);
	
	var table = document.createElement('table');
	table.setAttribute('class', 'mh_tdborder');
	table.setAttribute('border', '0');
	table.setAttribute('cellspacing', '1');
	table.setAttribute('cellpadding', '4');
	table.setAttribute('style', 'width: 400px;');
	table.setAttribute('align', 'center');
	
	var nbNotZero = 0;
	for(var i=0;i<size;i++)
	{
		if(repartition[i]!=0)
			nbNotZero++;
	}
	var string = "Il y a une utilité de faire une recherche en X = "+tx+" Y = "+ty+" N = "+tn;
	if(nbNotZero<=1)
	{
		//
		var minsolution = listeSolutions.length;
		var newpos = "";
		var isNotN = true;
		for(var dx=-1;dx<=1;dx++)
			for(var dy=-1;dy<=1;dy++)
				for(var dn=0;dn!=-3;dn=(dn==0?1:dn-2))
				{
					if(dx==0 && dy==0 && dn==0)
						continue;
					var tmprepartition = getRepartitionFromCase(tx+dx, ty+dy, tn+dn, listeSolutions);
					var tmpmeanscore = getMeanPositionNumber(tmprepartition,listeSolutions.length);
					if(((dn==0 || !isNotN) && minsolution>=tmpmeanscore) || (dn!=0 && isNotN && tmpmeanscore<=2*minsolution/3))
					{
						minsolution = tmpmeanscore;
						repartition = tmprepartition;
						newpos = "X = "+(tx+dx)+" Y = "+(ty+dy)+" N = "+(tn+dn);
						isNotN = (dn==0);
					}
				}
		if(minsolution == listeSolutions.length)
		{
			var thead = document.createElement('thead');
			var tr = appendTr(thead, 'mh_tdtitre');
			var td = appendTdText(tr, "Il n'y a aucune utilité de faire une recherche en X = "+tx+" Y = "+ty+" N = "+tn, true);
			td.setAttribute('align', 'center');
			table.appendChild(thead);
			return table;
		}
		string = "Conseil : allez faire une recherche en "+newpos;
	}
	
	var thead = document.createElement('thead');
	var tr = appendTr(thead, 'mh_tdtitre');
	var td = appendTdText(tr,string, true);
	td.setAttribute('align', 'center');
	table.appendChild(thead);
	var tbody = document.createElement('tbody');
	table.appendChild(tbody);
	for(var i=0;i<size;i++)
	{
		if(i==size-1)
		{
			if(repartition[i]!=0)
				createCase(Math.round(100*repartition[i]/listeSolutions.length)+"% de chance d'éliminer "+(listeSolutions.length-repartition[i])+" positions possibles",tbody,400);
		}
		else
		{
			var n=1;
			while((i+n)<size && repartition[i]==repartition[i+n])
				n++;
			if(repartition[i]!=0)
				createCase(Math.round(100*n*repartition[i]/listeSolutions.length)+"% de chance d'éliminer "+(listeSolutions.length-repartition[i])+" positions possibles",tbody,400);
			i+=n-1;
		}
	}
	
	td.addEventListener("click", toggleTableau, true);
	td.setAttribute('onmouseover', "this.style.cursor = 'pointer'; this.className = 'mh_tdpage';");
	td.setAttribute('onmouseout', "this.className = 'mh_tdtitre';");
	tbody.setAttribute('style', 'display:none;');
	return table;
}

function getIDCarte()
{
	var infoObjet = document.evaluate("//div[@class = 'titre2']/text()[contains(.,'Carte de la Cachette')]",
		document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	var idCarte = 0;
	if(infoObjet)
	{
		idCarte = parseInt(infoObjet.nodeValue);
	}
	return idCarte;
}

function analyseObject()
{
	var idCarte = getIDCarte();
	var originalPos = MZ_getValue(numTroll+".capitan."+idCarte+".position");
	if(!originalPos || originalPos == null)
	{
		var infoPos = document.evaluate("//td/text()[contains(.,'ai été tué en')]",
		document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		if(!infoPos)
			return
		var listePos = infoPos.nodeValue.split("=");
		if(listePos.length!=4)
			return;
		var x = parseInt(listePos[1]);
		var y = parseInt(listePos[2]);
		var n = parseInt(listePos[3]);
		MZ_setValue(numTroll+".capitan."+idCarte+".position",x+";"+y+";"+n);
	}
	var table = afficheInfoCarte(idCarte);
	var p = document.createElement('p');
	p.appendChild(table);
	document.body.appendChild(p);
	
	table = newRecherche(listeSolutions);
	if(table!=null)
	{
		var p = document.createElement('p');
		p.appendChild(table);
		document.body.appendChild(p);
		createNewRecherche();
	}
}

function createNewRecherche()
{
	p = document.createElement('p');
	
	var table = document.createElement('table');
	table.setAttribute('class', 'mh_tdborder');
	table.setAttribute('border', '0');
	table.setAttribute('cellspacing', '1');
	table.setAttribute('cellpadding', '4');
	table.setAttribute('style', 'width: 400px;');
	table.setAttribute('align', 'center');
	var tbody = document.createElement('tbody');
	table.appendChild(tbody);
	
	var td = createCase("Rajouter manuellement  une recherche :",tbody);

	td.appendChild(document.createElement('br'));
	td.appendChild(document.createTextNode("X = "));
	addInput(td, "rX");
	td.appendChild(document.createTextNode(" Y = "));
	addInput(td, "rY");
	td.appendChild(document.createTextNode(" N = "));
	addInput(td, "rN");
	td.appendChild(document.createElement('br'));
	td.appendChild(document.createTextNode("Nombre de chiffres bien placés : "));
	addInput(td, "rBP",1);
	td.appendChild(document.createElement('br'));
	var button=appendButton(td, "Ajouter", addRecherche);
	
	p.appendChild(table);
	document.body.appendChild(p);
}

function addRecherche()
{
	try
	{
		var td=this.parentNode;
		var x = (td.getElementsByTagName("input")[0]).value;
		var y = (td.getElementsByTagName("input")[1]).value;
		var n = (td.getElementsByTagName("input")[2]).value;
		var nbChiffres = (td.getElementsByTagName("input")[3]).value;
		if(x==null || isNaN(parseInt(x)))
		{
			alert("Erreur : champ X mal formaté.");
			return;
		}
		if(y==null || isNaN(parseInt(y)))
		{
			alert("Erreur : champ Y mal formaté.");
			return;
		}
		if(n==null || isNaN(parseInt(n)))
		{
			alert("Erreur : champ N mal formaté.");
			return;
		}
		if(nbChiffres==null || isNaN(parseInt(nbChiffres)))
		{
			alert("Erreur : nombre de chiffres bien placés mal formaté.");
			return;
		}
		var idCarte = getIDCarte();
		var i = 0;
		while(MZ_getValue(numTroll+".capitan."+idCarte+".essai."+i) != null)
		{
			i++;
		}
		MZ_setValue(numTroll+".capitan."+idCarte+".essai."+i,parseInt(x)+";"+parseInt(y)+";"+parseInt(n)+";"+parseInt(nbChiffres));
		window.location.replace(window.location);
	}
	catch(e)
	{
		alert(e);
	}
}

function addInput(parent, nom, size)
{
	var input = document.createElement('input');
	input.setAttribute('type','text');
	input.setAttribute('name',nom);
	input.setAttribute('type','text');
	input.setAttribute('maxlength',size==null?4:size);
	input.setAttribute('size',size==null?4:size);
	parent.appendChild(input);
}

function infoRecherche()
{
	var idCarte = MZ_getValue(numTroll+".capitan.lastCarteID");
	if(!idCarte || idCarte==null)
		return;
	idCarte = parseInt(idCarte);
	var i = 0;
	while(MZ_getValue(numTroll+".capitan."+idCarte+".essai."+i) != null)
	{
		i++;
	}
	var infoPos = document.evaluate("//p/b/text()[contains(.,'Vous êtes en')]",
		document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if(!infoPos)
	{
		var infoPos = document.evaluate("//p/b/text()[contains(.,'Vous avez trouvé la cachette')]",
		document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		if(!infoPos)
			return;
		MZ_removeValue(numTroll+".capitan.lastCarteID");
		for(var j=0;j<i;j++)
			MZ_removeValue(numTroll+".capitan."+idCarte+".essai."+j);
		return;
	}
	var listePos = infoPos.nodeValue.split("=");
	if(listePos.length!=4)
		return;
	var x = parseInt(listePos[1]);
	var y = parseInt(listePos[2]);
	var n = parseInt(listePos[3]);
	var infoResult = document.evaluate("//p/b/text()[contains(.,'Vous avez retrouvé')]",
		document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	var nbChiffres=0;
	if(infoResult)
	{
		var nbChiffres = parseInt((infoResult.nodeValue.split(" "))[3]);
	}
	MZ_setValue(numTroll+".capitan."+idCarte+".essai."+i,x+";"+y+";"+n+";"+nbChiffres);
	MZ_removeValue(numTroll+".capitan.lastCarteID");
	var table = afficheInfoCarte(idCarte);
	
	var form = document.evaluate("//form/p/input[@value = 'Terminer']/../..",
		document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	
	var p = document.createElement('p');
	p.appendChild(table);
	form.appendChild(p);
	
	
	
}

var combobox=null;

function changeObject()
{
	if(!combobox)
		return ;
	var id = combobox.options[combobox.selectedIndex].value;
	if(!id || id=="")
	{
		MZ_removeValue(numTroll+".capitan.lastCarteID");
		return;
	}
	MZ_setValue(numTroll+".capitan.lastCarteID",id);
}

function setCarteId()
{
	combobox = document.evaluate("//select[@name='ai_IdTarget']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if(!combobox)
	{
		return true;
	}
	combobox.addEventListener('change', changeObject, true);
	return true;
}

function isPage(url) {
	return currentURL.indexOf(MHURL + url) == 0;
}

try
{
	if (isPage("View/TresorHistory.php"))
	{
		analyseObject();
	}
	else if(isPage("MH_Play/Actions/Play_a_TrouverCachette2.php"))
	{
		infoRecherche();
	}
	else if(isPage("MH_Play/Actions/Play_a_TrouverCachette.php"))
	{
		setCarteId();
	}
}
catch(e)
{
	alert(e);
}































