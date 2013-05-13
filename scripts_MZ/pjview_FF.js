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

/*********************************************************************************
*               mod from Mountyzilla by Dabihul v1.0 - 2012-02-29                *
* - m�n de l'analyseur de profil                                                 *
* - correction des valeurs (MM/RM et qq erreurs)                                 *
* - ajout d'une 18e carac (poids max pour les anneaux... ok c'est moche)         *
* - gestion des items renforc�s ou l�gers                                        *
* TODO                                                                           *
* - m�n pour ZZ                                                                  *
*********************************************************************************/

var mh_caracs = new Array();
var mh_templates = new Array();

//liste du matos
//mh_caracs ["Nom"] = new Array("Type", "AttP","AttM", "DegP","DegM", "Esq", "ArmP","ArmM", "Vue", "Reg", "RM_Min", "RM_Max", "MM_Min", "MM_Max", "PV", "DLA", "Poids_Min", "Poids_Max");
mh_caracs["Armure d'Anneaux"] = new Array("Armure",0,0,0,0,-8,8,0,0,0,90,180,0,0,0,0.00,80.00,80.00);
mh_caracs["Armure de bois"] = new Array("Armure",0,0,0,0,-3,5,0,0,0,20,50,0,0,0,0.00,50.00,50.00);
mh_caracs["Armure de Cuir"] = new Array("Armure",0,0,0,0,0,2,0,0,0,10,20,0,0,0,0.00,10.00,10.00);
mh_caracs["Armure de peaux"] = new Array("Armure",0,0,0,0,-2,4,0,0,0,20,60,0,0,0,0.00,45.00,45.00);
mh_caracs["Armure de pierre"] = new Array("Armure",0,0,0,0,-6,12,0,0,0,60,150,0,0,0,0.00,120.00,120.00);
mh_caracs["Armure de Plates"] = new Array("Armure",0,0,0,0,-5,10,0,0,0,50,100,0,0,0,0.00,100.00,100.00);
mh_caracs["Bottes"] = new Array("Bottes",0,0,0,0,2,0,0,0,0,0,0,0,0,0,0.00,5.00,5.00);
mh_caracs["Bouclier � Pointes"] = new Array("Bouclier",1,0,1,0,-1,4,0,0,0,0,0,0,0,0,0.00,35.00,35.00);
mh_caracs["Boulet et cha�ne"] = new Array("Arme",-3,0,5,0,0,0,0,0,0,0,0,0,0,0,0.00,15.00,15.00);
mh_caracs["B�tons de Parade"] = new Array("Arme",-4,0,0,0,2,2,0,0,0,0,0,0,0,0,0.00,7.50,7.50);
mh_caracs["Cagoule"] = new Array("Casque",0,0,0,0,1,0,0,-1,0,0,0,5,10,0,0.00,2.50,2.50);
mh_caracs["Casque en cuir"] = new Array("Casque",0,0,0,0,0,1,0,0,0,5,10,0,0,0,0.00,5.00,5.00);
mh_caracs["Casque en m�tal"] = new Array("Casque",0,0,0,0,0,2,0,-1,0,5,10,0,0,0,0.00,10.00,10.00);
mh_caracs["Casque � cornes"] = new Array("Casque",0,0,1,0,-1,3,0,-1,0,5,10,0,0,0,0.00,10.00,10.00);
mh_caracs["Casque � Pointes"] = new Array("Casque",1,0,1,0,0,3,0,-1,0,0,0,0,0,0,0.00,12.50,12.50);
mh_caracs["Cha�ne Clout�e"] = new Array("Arme",-2,0,4,0,1,0,0,0,0,0,0,0,0,0,0.00,35.00,35.00);
mh_caracs["Collier de dents"] = new Array("Talisman",0,0,1,0,0,0,0,0,0,0,0,0,0,0,5.00,1.00,1.00);
mh_caracs["Collier de pierre"] = new Array("Talisman",0,0,0,0,0,0,0,0,0,5,10,5,10,0,0.00,2.50,2.50);
mh_caracs["Collier � Pointes"] = new Array("Talisman",0,0,1,0,-1,1,0,0,0,0,0,0,0,0,0.00,2.50,2.50);
mh_caracs["Cotte de Mailles"] = new Array("Armure",0,0,0,0,-3,7,0,0,0,30,60,0,0,0,0.00,70.00,70.00);
mh_caracs["Coutelas d'Obsidienne"] = new Array("Arme",2,0,2,0,0,0,0,0,-2,-10,-5,-30,-15,0,0.00,5.00,5.00);
mh_caracs["Coutelas en os"] = new Array("Arme",0,0,1,0,0,0,0,0,0,0,0,0,0,0,0.00,4.00,4.00);
mh_caracs["Crochet"] = new Array("Arme",-2,0,3,0,0,0,0,0,0,0,0,0,0,0,0.00,12.50,12.50);
mh_caracs["Cuir Bouilli"] = new Array("Armure",0,0,0,0,-1,3,0,0,0,20,40,0,0,0,0.00,18.00,18.00);
mh_caracs["Cuirasse d'Ossements"] = new Array("Armure",0,0,0,0,-3,5,0,0,0,15,30,15,30,0,0.00,68.00,68.00);
mh_caracs["Cuirasse d'�cailles"] = new Array("Armure",0,0,0,0,-3,6,0,0,0,30,70,0,0,0,0.00,60.00,60.00);
mh_caracs["Culotte en Cuir"] = new Array("Armure",0,0,0,0,1,0,0,0,0,0,0,0,0,0,0.00,2.50,2.50);
mh_caracs["Dague"] = new Array("Arme",0,0,1,0,0,0,0,0,0,0,0,0,0,0,0.00,5.00,5.00);
mh_caracs["Ep�e Courte"] = new Array("Arme",0,0,2,0,0,0,0,0,0,0,0,0,0,0,0.00,10.00,10.00);
mh_caracs["Ep�e Longue"] = new Array("Arme",-2,0,4,0,0,0,0,0,0,0,0,0,0,0,0.00,20.00,20.00);
mh_caracs["Espadon"] = new Array("Arme",-6,0,8,0,0,0,0,0,0,0,0,0,0,0,0.00,40.00,40.00);
mh_caracs["Fouet"] = new Array("Arme",4,0,-2,0,0,0,0,0,0,0,0,0,0,0,0.00,7.00,7.00);
mh_caracs["Fourrures"] = new Array("Armure",0,0,0,0,0,2,0,0,0,15,30,0,0,0,0.00,10.00,10.00);
mh_caracs["Gantelet"] = new Array("Arme",-2,0,1,0,1,2,0,0,0,0,0,0,0,0,0.00,7.50,7.50);
mh_caracs["Gorgeron en cuir"] = new Array("Talisman",0,0,0,0,0,1,0,0,0,0,0,0,0,0,0.00,2.50,2.50);
mh_caracs["Gorgeron en m�tal"] = new Array("Talisman",0,0,0,0,0,2,0,0,-1,0,0,0,0,0,0.00,5.00,5.00);
mh_caracs["Gourdin"] = new Array("Arme",-1,0,2,0,0,0,0,0,0,0,0,0,0,0,0.00,12.50,12.50);
mh_caracs["Gourdin clout�"] = new Array("Arme",-1,0,3,0,0,0,0,0,0,0,0,0,0,0,0.00,15.00,15.00);
mh_caracs["Gros'Porte"] = new Array("Bouclier",0,0,0,0,-1,5,0,0,0,10,20,0,0,0,0.00,50.00,50.00);
mh_caracs["Grosse Stalagmite"] = new Array("Arme",-20,0,28,0,-15,0,0,-4,0,0,0,0,0,0,0.00,125.00,125.00);
mh_caracs["Hache de Bataille"] = new Array("Arme",-4,0,6,0,0,0,0,0,0,0,0,0,0,0,0.00,40.00,40.00);
mh_caracs["Hache de guerre en os"] = new Array("Arme",-4,0,6,0,0,0,0,0,0,0,0,0,0,0,0.00,25.00,25.00);
mh_caracs["Hache de guerre en pierre"] = new Array("Arme",-10,0,14,0,0,0,0,0,0,5,10,0,0,0,0.00,75.00,75.00);
mh_caracs["Hache � deux mains d'Obsidienne"] = new Array("Arme",-8,0,16,0,0,0,0,0,-4,-90,-50,-30,-15,0,0.00,75.00,75.00);
mh_caracs["Hallebarde"] = new Array("Arme",-10,0,12,0,0,0,0,0,0,0,0,0,0,0,0.00,60.00,60.00);
mh_caracs["Haubert d'�cailles"] = new Array("Armure",0,0,0,0,-4,8,0,0,0,40,80,0,0,0,0.00,80.00,80.00);
mh_caracs["Haubert de mailles"] = new Array("Armure",0,0,0,0,-4,9,0,0,0,40,90,0,0,0,0.00,90.00,90.00);
mh_caracs["Heaume"] = new Array("Casque",-1,0,0,0,0,4,0,-2,0,10,20,0,0,0,0.00,20.00,20.00);
mh_caracs["Jambi�res en cuir"] = new Array("Bottes",0,0,0,0,0,1,0,0,0,5,10,0,0,0,0.00,10.00,10.00);
mh_caracs["Jambi�res en fourrure"] = new Array("Bottes",0,0,0,0,0,1,0,0,0,5,10,0,0,0,0.00,2.50,2.50);
mh_caracs["Jambi�res en maille"] = new Array("Bottes",0,0,0,0,-1,3,0,0,0,5,10,0,0,0,0.00,20.00,20.00);
mh_caracs["Jambi�res en m�tal"] = new Array("Bottes",0,0,0,0,-2,4,0,0,0,5,10,0,0,0,0.00,25.00,25.00);
mh_caracs["Jambi�res en os"] = new Array("Bottes",0,0,0,0,-1,2,0,0,0,5,10,0,0,0,0.00,10.00,10.00);
mh_caracs["Lame d'Obsidienne"] = new Array("Arme",2,0,6,0,0,0,0,0,-3,-60,-30,-20,-10,0,0.00,20.00,20.00);
mh_caracs["Lame en os"] = new Array("Arme",0,0,2,0,0,0,0,0,0,0,0,0,0,0,0.00,7.00,7.00);
mh_caracs["Lame en pierre"] = new Array("Arme",-2,0,4,0,0,0,0,0,0,0,0,0,0,0,0.00,20.00,20.00);
mh_caracs["Lorgnons"] = new Array("Casque",0,0,0,0,-1,0,0,1,0,0,0,5,10,0,0.00,2.50,2.50);
mh_caracs["Machette"] = new Array("Arme",1,0,2,0,-1,0,0,0,0,0,0,0,0,0,0.00,20.00,20.00);
mh_caracs["Masse d'Arme"] = new Array("Arme",-1,0,3,0,0,0,0,0,0,0,0,0,0,0,0.00,15.00,15.00);
mh_caracs["Pagne de Mailles"] = new Array("Armure",0,0,0,0,2,1,0,0,0,0,0,0,0,0,0.00,7.50,7.50);
mh_caracs["Pagne en Cuir"] = new Array("Armure",0,0,0,0,2,-1,0,0,0,0,0,0,0,0,0.00,5.00,5.00);
mh_caracs["Rondache en bois"] = new Array("Bouclier",0,0,0,0,1,1,0,0,0,0,0,0,0,0,0.00,15.00,15.00);
mh_caracs["Rondache en m�tal"] = new Array("Bouclier",0,0,0,0,1,2,0,0,0,0,0,0,0,0,0.00,30.00,30.00);
mh_caracs["Sandales"] = new Array("Bottes",0,0,0,0,1,0,0,0,0,0,0,0,0,0,0.00,2.50,2.50);
mh_caracs["Talisman d'Obsidienne"] = new Array("Talisman",1,0,2,0,0,0,0,0,-4,20,40,20,40,0,0.00,2.50,2.50);
mh_caracs["Talisman de pierre"] = new Array("Talisman",0,0,0,0,0,0,0,0,-1,10,20,10,20,0,0.00,2.50,2.50);
mh_caracs["Targe"] = new Array("Bouclier",0,0,0,0,1,0,0,0,0,0,0,0,0,0,0.00,5.00,5.00);
mh_caracs["Torche"] = new Array("Arme",1,0,1,0,0,0,0,1,0,0,0,0,0,0,0.00,5.00,5.00);
mh_caracs["Torque de pierre"] = new Array("Talisman",0,0,0,0,0,0,0,0,-2,20,40,20,40,0,0.00,2.50,2.50);
mh_caracs["Tunique"] = new Array("Armure",0,0,0,0,1,0,0,0,0,5,10,5,10,0,0.00,2.50,2.50);
mh_caracs["Tunique d'�cailles"] = new Array("Armure",0,0,0,0,-1,3,0,0,0,15,30,0,0,0,0.00,30.00,30.00);
mh_caracs["Turban"] = new Array("Casque",0,0,0,0,0,0,0,0,0,10,20,0,0,0,0.00,2.50,2.50);
mh_caracs["Baton Lest�"] = new Array("Arme",2,0,-1,0,0,0,0,0,0,0,0,0,0,0,0.00,7.50,7.50);
mh_caracs["Grosse racine"] = new Array("Arme",-1,0,3,0,0,0,0,0,0,5,10,0,0,0,0.00,20.00,20.00);
mh_caracs["Couronne d'Obsidienne"] = new Array("Arme",0,0,0,-1,0,0,1,2,-1,0,0,0,0,0,0.00,10.00,10.00);
mh_caracs["Couronne de cristal"] = new Array("Arme",0,0,0,1,-1,0,-1,3,0,0,0,0,0,0,0.00,10.00,10.00);
mh_caracs["Chapeau pointu"] = new Array("Arme",0,0,0,0,0,1,0,0,0,0,0,5,10,0,0.00,5.00,5.00);
mh_caracs["Souliers dor�s"] = new Array("Arme",0,0,0,0,-1,1,1,0,0,0,0,0,0,0,0.00,10.00,10.00);
mh_caracs["Grimoire"] = new Array("Arme",-2,2,-1,1,0,0,0,0,0,0,0,5,10,0,10.00,25.00,25.00);
mh_caracs["Robe de mage"] = new Array("Arme",0,0,0,0,-1,2,1,0,0,10,20,10,20,0,0.00,20.00,20.00);
mh_caracs["Anneau de protection"] = new Array("Anneau",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.00,3.00,13.00);
mh_caracs["Anneau de Protection"] = new Array("Anneau",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.00,3.00,13.00);

//mh_templates["Nom"] = new Array( "AttP", "AttM", "DegP", "DegM", "Esq", "ArmP", "ArmM", "Vue", "Reg", "RM_Min", "RM_Max", "MM_Min", "MM_Max", "PV", "DLA", "Poids_Min", "Poids_Max");
mh_templates["de Feu"] = new Array(0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0);
mh_templates["de R�sistance"] = new Array(0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0);
mh_templates["de l'Aigle"] = new Array(0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0);
mh_templates["de la Salamandre"] = new Array(0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0);
mh_templates["des Cyclopes"] = new Array(0,1,0,1,0,0,0,-1,0,0,0,0,0,0,0,0,0);
mh_templates["des Enrag�s"] = new Array(0,1,0,1,-1,0,0,0,0,0,0,0,0,0,0,0,0);
mh_templates["des Tortues"] = new Array(0,0,0,0,0,0,2,0,0,0,0,0,0,0,30,0,0);
mh_templates["des Vampires"] = new Array(0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0);
mh_templates["du Glacier"] = new Array(0,1,0,0,0,0,1,0,0,5,5,0,0,0,0,0,0);
mh_templates["du Rat"] = new Array(0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0);
mh_templates["du Roc"] = new Array(0,0,0,0,-1,0,1,0,0,0,0,0,0,0,0,0,0);
mh_templates["du Temps"] = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,-30,0,0);
mh_templates["du Vent"] = new Array(0,0,0,-1,1,0,0,0,0,0,0,0,0,0,0,0,0);
mh_templates["en Mithril"] = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
mh_templates["des Anciens"] = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
mh_templates["des Champions"] = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
mh_templates["des Duellistes"] = new Array(0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
mh_templates["de la Terre"] = new Array(0,0,0,0,0,0,0,0,2,0,0,0,0,5,30,0,0);
mh_templates["de l'Orage"] = new Array(0,0,0,-1,2,0,0,0,0,0,0,0,0,0,0,0,0);
mh_templates["de l'Ours"] = new Array(0,0,0,2,0,0,0,0,0,0,0,0,0,5,30,0,0);
mh_templates["des B�h�moths"] = new Array(0,0,0,0,0,0,3,0,0,0,0,0,0,0,30,0,0);
mh_templates["des Mages"] = new Array(0,0,0,0,0,0,0,0,0,5,5,5,5,0,0,0,0);
mh_templates["du Pic"] = new Array(0,0,0,0,-1,0,2,0,0,0,0,0,0,0,0,0,0);
mh_templates["du Sable"] = new Array(0,0,0,0,3,0,-1,-1,0,0,0,0,0,0,0,0,0);
mh_templates["l�ger"] = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
mh_templates["l�g�re"] = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
mh_templates["renforc�"] = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
mh_templates["renforc�e"] = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
mh_templates["robuste"] = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);

function addArray(array1, array2) {
	var arrayResult = new Array();
//	if (Array1.length != Array2.length)
//		return -1;
	for ( i=array1.length ; --i >= 0 ; )
		arrayResult[i] = array1[i] + array2[i];
	return arrayResult;
	}

function getTemplates(tmpItem) {
	var b = true;
	var item = tmpItem;
	var ar = new Array();
	while (b) {
		b = false;
		for (var cle in mh_templates) {
			if (item.substr(item.length - cle.length, cle.length) != cle) {
				continue };
			item = item.substr(0, item.length - cle.length - 1);
			ar.unshift(cle);
			if (item.substr(item.length - 3, 3) == " et") {
				item = item.substr(0, item.length - 3) };
			b = true;
			}
		}
	ar.unshift(item);
	return ar;
	}

function addMithril(arrayCaracs, tmpTypeItem) {
	if (tmpTypeItem == "Arme") {
		if (arrayCaracs[0] < 0)
			arrayCaracs[0] = Math.ceil(arrayCaracs[0] / 2);
		}
	else {
		if (arrayCaracs[4] < 0) // Il y a *aussi* diminution dans le cas Esq = -1
			arrayCaracs[4] = Math.ceil(arrayCaracs[4] / 2);
		}
	arrayCaracs[15] = arrayCaracs[15] / 2.0;
	arrayCaracs[16] = arrayCaracs[16] / 2.0;
	return arrayCaracs;
	}

function addRenfort(arrayCaracs, TypeTemplate) {
	// � appliquer APR�S le mithril
	if (TypeTemplate == "l�ger" || TypeTemplate == "l�g�re") {
		arrayCaracs[4]++;
		arrayCaracs[5]--;
		var coef = -1.0;
		}
	else {
		arrayCaracs[5]++;
		var coef = 1.0;
		}
	// Cette formule n'a rien d'officiel, gare !
	arrayCaracs[15] = arrayCaracs[15] + coef * Math.floor(arrayCaracs[15] * 0.1);
	arrayCaracs[16] = arrayCaracs[16] + coef * Math.floor(arrayCaracs[16] * 0.1);
	return arrayCaracs;
	}

function getCaracs(item) {
	var templates = getTemplates(item);
	var caracs = mh_caracs[templates[0]];
	if (!caracs)
		return new Array();

	var typeItem = caracs[0];
	caracs.shift();
	templates.shift();
	if (templates[templates.length - 1] == "en Mithril") {
		caracs = addMithril(caracs, typeItem);
		templates.pop();
		}
	if (templates[0] == "l�ger" || templates[0] == "l�g�re" || templates[0] == "renforc�"
		|| templates[0] == "renforc�e" || templates[0] == "robuste") {
		caracs = addRenfort(caracs,templates[0]);
		templates.shift();
		}
	for (var i = templates.length ; --i >= 0 ; )
		caracs = addArray(caracs, mh_templates[templates[i]]);
//	Comment �a marchait avant, il me semble qu'il faut toujours traiter le mithril avant ?
//	for (var i = 1; i < templates.length; i++)
//		caracs = templates[i] == "en Mithril" ? addMithril(caracs, typeItem)
//				: addArray(caracs, mh_templates[templates[i]]);
	return caracs;
	}

function aff(nbr) {
	return nbr >= 0 ? "+" + nbr : nbr;
	}

function getLine(tab) {
	var str = "";
	if (tab[0] != 0 || tab[1] != 0) {
		str += "<b>Att : </b>" + aff(tab[0]);
		if (tab[1] != 0)
			str += "/" + aff(tab[1]);
		str += " | ";
		}
	if (tab[4] != 0) {
		str += "<b>Esq : </b>" + aff(tab[4]);
		str += " | ";
		}
	if (tab[2] != 0 || tab[3] != 0) {
		str += "<b>Deg : </b>" + aff(tab[2]);
		if (tab[3] != 0)
			str += "/" + aff(tab[3]);
		str += " | ";
		}
	if (tab[8] != 0) {
		str += "<b>Reg : </b>" + aff(tab[8]);
		str += " | ";
		}
	if (tab[7] != 0) {
		str += "<b>Vue : </b>" + aff(tab[7]);
		str += " | ";
		}
	if (tab[5] != 0 || tab[6] != 0) {
		str += "<b>Arm : </b>" + aff(tab[5]);
		if (tab[6] != 0)
			str += "/" + aff(tab[6]);
		str += " | ";
		}
	if (tab[9] != 0 || tab[10] != 0) {
		str += "<b>RM : </b>" + aff(tab[9]) + "%";
		if (tab[9] != tab[10])
			str += "/" + aff(tab[10]) + "%";
		str += " | ";
		}
	if (tab[11] != 0 || tab[12] != 0) {
		str += "<b>MM : </b>" + aff(tab[11]) + "%";
		if (tab[11] != tab[12])
			str += "/" + aff(tab[12]) + "%";
		str += " | ";
		}
	if (tab[13] != 0) {
		str += "<b>PV : </b>" + aff(tab[13]);
		str += " | ";
		}
	if (tab[14] != 0) {
		str += "<b>DLA : </b>" + aff(tab[14]) + " min";
		str += " | ";
		}
	str += "<b>Poids : </b>" + tab[15] + " min";
	if (tab[15] != tab[16])
		str += " / " + tab[16] + " min";
	return str;
	}

function toolTipInit() {
	DivInfo = document.createElement('div');
	DivInfo.setAttribute('id', 'infosVue');
	DivInfo.setAttribute('class', 'mh_textbox');
	DivInfo.setAttribute('style', 'position: absolute; border: 1px solid #000000;'
		+ ' visibility: hidden; display: inline; zIndex: 99;');
	document.body.appendChild(DivInfo);
	document.addEventListener('mousemove', getXY, false);
	document.addEventListener('click', changeFreezeStatus, false);
	DivInfosStyle = DivInfo.style;
	}

function getXY(evt) {
	if (!freezed && DivInfosStyle.visibility == "visible") {
		DivInfosStyle.left = evt.pageX + 'px';
		DivInfosStyle.top = evt.pageY + 10 + 'px';
		}
	}

function changeFreezeStatus() {
	if (DivInfosStyle.visibility == "visible") {
		freezed = !freezed;
		if (!freezed)
			hideInfos();
		}
	}

function showInfos() {
	var currentInfos = this.getAttribute("infos");
	if (!freezed) {
		DivInfo.innerHTML = currentInfos;
		DivInfosStyle.visibility = "visible";
		}
	}

function hideInfos() {
	if (!freezed)
		DivInfosStyle.visibility = "hidden";
	}

function treateEquipement() {
	if (MZ_getValue("INFOCARAC") == "false")
		return false;

	var faireligne = false;
	var caracs = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
	var nodes = document.evaluate("//td/b[text() = 'Equipement Utilis�']/../../td[2]/img[contains(@src,bullet)]",
			document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength > 0) {
		for (var j=0 ; j<nodes.snapshotLength ; j++) {
			var node = nodes.snapshotItem(j);
			var next = node.nextSibling;
			var nnext = next.nextSibling;
			var nom = next.nodeValue;
			if (nnext.childNodes.length == 1)
				nom += nnext.childNodes[0].nodeValue;
			nom = nom.replace(/^\s*|\s*$/g, "");
			var c = String.fromCharCode(180);
			while (nom.indexOf(c) != -1)
				nom = nom.replace(c, "'");

			var ar = getCaracs(nom);
			if (ar.length != 0) {
				faireligne=true;
				caracs = addArray(caracs, ar);
				var span = document.createElement('span');
				span.appendChild(next);
				span.appendChild(nnext);
				span.setAttribute("infos",getLine(ar));
				span.addEventListener("mouseover", showInfos,true);
				span.addEventListener("mouseout", hideInfos,true);
				insertBefore(node.nextSibling, span);
				}
			}

		if (faireligne) {
			var nodes = document.evaluate("//td/b[text() = 'Equipement Utilis�']", document, null,
					XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			var node = nodes.snapshotItem(0);
			node.setAttribute("infos",getLine(caracs));
			node.addEventListener("mouseover", showInfos,true);
			node.addEventListener("mouseout", hideInfos,true);
			}
		}
	else {
		nodes = document.evaluate("//dd[@class = 'equipement']/ul/li", document, null,
				XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		if (nodes.snapshotLength > 0) {
			for (var j = 0; j < nodes.snapshotLength; j++) {
				var node = nodes.snapshotItem(j);
				var nom = node.childNodes[0].nodeValue;
				if (node.childNodes.length > 1)
					nom += node.childNodes[1].childNodes[0].nodeValue;
				nom = nom.replace(/^\s*|\s*$/g, "");
				var c = String.fromCharCode(180);
				while (nom.indexOf(c) != -1)
					nom = nom.replace(c, "'");
				var ar = getCaracs(nom);
				if (ar.length != 0) {
					caracs = addArray(caracs, ar);
					node.setAttribute("infos",getLine(ar));
					node.addEventListener("mouseover", showInfos,true);
					node.addEventListener("mouseout", hideInfos,true);
					}
				}
			var nodes = document.evaluate("//dt[@class = 'equipement']", document, null,
					XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			var node = nodes.snapshotItem(0);
			node.setAttribute("infos",getLine(caracs));
			node.addEventListener("mouseover", showInfos,true);
			node.addEventListener("mouseout", hideInfos,true);
			}
		}
	}

var DivInfo;
var DivInfosStyle;
var freezed = false;

treateEquipement();
toolTipInit();
//============================ ZZ POST CODE ======================================
function setKarmaTroll() {
	var troll = document.getElementsByName('ai_IDPJ')[0].value;		
	MZ_appendNewScript(ZZDB+'/mzData.php?&TypeData=Karma&TiD='+troll);
}

function setDBMsgZZ(msg, infos) { 
    var nodes = document.evaluate("//td/b[text() = 'Nombre de Meurtres']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength > 0) {
		var node = nodes.snapshotItem(0);
		var nbm=node.parentNode.parentNode.firstChild.nextSibling.nextSibling.nextSibling.firstChild;

	} else {
		var nodes = document.evaluate("//dd[@class = 'meurtres']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		var nbm=nodes.snapshotItem(0).firstChild;
	}
	
	if (nodes.snapshotLength > 0) {
		var kill=nbm.nodeValue;
		var zzNode=document.createElement('span');
		zzNode.innerHTML=kill+' <b><i>'+msg+'</b></i>';
		zzNode.setAttribute("infos",infos);
		zzNode.addEventListener("mouseover", showInfos,true);
		zzNode.addEventListener("mouseout", hideInfos,true);
		nbm.parentNode.replaceChild(zzNode, nbm.parentNode.firstChild);
	}
}

/***********************************************************************************************************/
setKarmaTroll();
