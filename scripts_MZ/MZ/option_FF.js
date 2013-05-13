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
/* v0.1.1 by Dab - 2013-05-08 */


var tagsData = [];
tagsData['Types de Trolls (Ancien)'] = 'http://mountypedia.free.fr/mz/typeTrolls.csv';
tagsData['Types de Trolls (Nouveau)'] = 'http://mountypedia.free.fr/mz/typeTrolls_new.csv';
tagsData['Pogo 2009'] = 'http://mountyzilla.tilk.info/resources/pogo2009.csv';



/*                           Fonctions de sauvegarde                            */

function saveITData() {
	var IT = document.getElementById('itSelect').value;
	if (IT=='bricol') {
		var sys = document.getElementById('urlbricol').value;
		var log = document.getElementById('loginbricol').value;
		var pas = document.getElementById('passbricol').value;
		if (sys && log && pas)
				MZ_setValue(numTroll+'.INFOSIT', 'bricol$'+sys+'$'+log+'$'+hex_md5(pas) );
		}
	else
		{ MZ_removeValue(numTroll+'.INFOSIT'); }
	}

function saveTagsData() {
	var nom = document.getElementById('tagsSelect').value;
	
	switch(nom) {
		case 'none':
			MZ_removeValue(numTroll+'.TAGSURL');
			break;
		case 'other':
			var url = document.getElementById('tagsInput').value
			if (url)
				{�MZ_setValue(numTroll+'.TAGSURL', '#'+url ); } // # si url perso
			else 
				{�MZ_removeValue(numTroll+'.TAGSURL'); }
			break;
		default:
			MZ_setValue(numTroll+'.TAGSURL','$'+tagsData[nom]); // $ si url auto
		}
	}

function refreshLinks() {
	document.getElementById('linksBody').innerHTML = '';
	var i=1, anotherURL = MZ_getValue('URL1');
	if (!anotherURL) {addLinkField();}
	while( anotherURL && i<999 ) {
		addLinkField(i, anotherURL, MZ_getValue('URL'+i+'.nom'), MZ_getValue('URL'+i+'.ico') );
		i++;
		anotherURL = MZ_getValue('URL'+i);
		}
	}

function saveLinks() {
	var numLinks = document.getElementById('linksBody').childNodes.length;
	
	var data=[ [] ];
	/* R�cup�ration et tri des liens */
	for(var i=1 ; i<=numLinks ; i++) {
		MZ_removeValue('URL'+i);
		MZ_removeValue('URL'+i+'.nom');
		MZ_removeValue('URL'+i+'.ico');
		var url = document.getElementById('url'+i).value;
		var nom = document.getElementById('nom'+i).value;
		var ico = document.getElementById('ico'+i).value;
		if (url && (nom ||�ico) ) {
			data.push( [url, nom ? nom : '', ico ? ico : ''] );
			}
		}
	/* Sauvegarde */
	for(var i=1 ; i<data.length ; i++) {
		MZ_setValue('URL'+i, data[i][0]);
		MZ_setValue('URL'+i+'.nom', data[i][1]);
		MZ_setValue('URL'+i+'.ico', data[i][2]);
		}
	}

function saveAll() {
	MZ_setValue('VUEEXT', document.getElementById('vueext').value);
	
	var maxcdm = parseInt(document.getElementById('maxcdm').value);
	if (maxcdm)
		{ MZ_setValue(numTroll+'.MAXCDM', maxcdm ); }
	else {
		MZ_removeValue(numTroll+'.MAXCDM');
		document.getElementById('maxcdm').value = '';
		}
	
	// Pourquoi Tilk stockait-il tout en str ?
	MZ_setValue(numTroll+'.USECSS', document.getElementById('usecss').checked ? 'true' : 'false');
	MZ_setValue(numTroll+'.INFOCARAC', document.getElementById('infocarac').checked ? 'true' : 'false');
	//MZ_setValue(numTroll+'.SEND_IDT', document.getElementById("send_idt").checked ? "oui" : "non");
	MZ_setValue('NOINFOEM', document.getElementById('noInfoEM').checked ? 'true' : 'false');
	
	if (document.getElementById('usepoiss').checked && document.getElementById('passpoiss').value)
		{�MZ_setValue(numTroll+'.POISS', hex_md5(document.getElementById('passpoiss').value)); }
	else if (!document.getElementById('usepoiss').checked)
		{�MZ_removeValue(numTroll+'.POISS'); }
	
	saveLinks();
	refreshLinks();
	saveTagsData();
	saveITData();
	
	var bouton = document.getElementById('saveAll');
	bouton.value = (bouton.value=='Sauvegard� !') ? 'Re-sauvegard� !' : 'Sauvegard� !';
	}


/*                                EventListeners                                */

function onChangeIT() {
	var IT = document.getElementById('itSelect').value;
	
	var itBody = document.getElementById('itBody');
	itBody.innerHTML = '';
	
	if (IT=='bricol') {
		var tr = appendTr(itBody, 'mh_tdpage')
		var td = appendTd(tr);
		var str = MZ_getValue(numTroll+'.INFOSIT');
		if (str) {
			var splt = str.split('$');
			var system = splt[1];
			var login = splt[2];
			}
		appendText(td, 'Nom du syst�me : ');
		appendTextbox(td, 'text', 'urlbricol', '20', '50', system);
		td = appendTd(tr);
		appendText(td, 'Login du compte : ');
		appendTextbox(td, 'text', 'loginbricol', '20', '50', login);
		td = appendTd(tr);
		appendText(td, 'Mot de passe du compte : ');
		appendTextbox(td, 'password', 'passbricol', '20', '50');
		}
	}

function onChangeTags() {
	var value = document.getElementById('tagsSelect').value;
	var tagsBody = document.getElementById('tagsBody');
	
	if (value=='other') {
		var td = appendTdText(appendTr(tagsBody),'Url du fichier de tags : ');
		var mem = MZ_getValue(numTroll+'.TAGSURL'), url = '';
		if (mem && mem.substr(0,1)=='#')
			{ url = mem.substr(1); }
		appendTextbox(td, 'text', 'tagsInput', '50', '150', url);
		}
	else
		{ tagsBody.innerHTML = ''; }
	}

function addLinkField(i,url,nom,ico) {
	var linksBody = document.getElementById('linksBody');
	if (!(i>0)) {
		i = linksBody.childNodes.length+1;
		}
	var tr = appendTr(linksBody);
	var td = appendTdCenter(tr);
	appendText(td, 'Lien '+i+' : ');
	appendTextbox(td, 'text', 'url'+i, '40', '150', url);
	td = appendTdCenter(tr);
	appendText(td, 'Nom : ');
	appendTextbox(td, 'text', 'nom'+i, '20', '150', nom);
	td = appendTdCenter(tr);
	appendText(td, 'Ic�ne : ');
	appendTextbox(td, 'text', 'ico'+i, '40', '150', ico);
	}

function removeLinkField() {
	var linksBody = document.getElementById('linksBody');
	var i = linksBody.childNodes.length;
	MZ_removeValue('URL'+i);
	MZ_removeValue('URL'+i+'.nom');
	MZ_removeValue('URL'+i+'.ico');
	linksBody.removeChild(linksBody.lastChild);
	if (linksBody.childNodes.length==0)
		{ addLinkField(); }
	}


/*                            Fonctions d'insertion                             */


function insertTitle(next, txt) {
	var div = document.createElement('div');
	div.setAttribute('class','Titre2');
	appendText(div,txt);
	insertBefore(next,div);
	}

function insertMainTable(node) {
	var table = document.createElement('table');
	table.setAttribute('width', '98%');
	table.setAttribute('border', '0');
	table.setAttribute('align', 'center');
	table.setAttribute('cellpadding', '2');
	table.setAttribute('cellspacing', '1');
	table.setAttribute('class', 'mh_tdborder');
	var tbody = document.createElement('tbody');
	table.appendChild(tbody);
	insertBefore(node,table);
	return tbody;
	}

function appendSubTable(node) {
	var table = document.createElement('table');
	table.setAttribute('width', '100%');
	var tbody = document.createElement('tbody');
	table.appendChild(tbody);
	node.appendChild(table);
	return tbody;
	}

function insertOptionTable(insertPt) {
	var mainBody = insertMainTable(insertPt);
	
	/* Liens dans Vue */
	var tr = appendTr(mainBody, 'mh_tdtitre');
	var td = appendTdText(tr, 'Hyperliens ajout�s dans la Vue :',true);
	td = appendTd(appendTr(mainBody, 'mh_tdpage'));
	var tbody = appendSubTable(td);
	tbody.setAttribute('id','linksBody');
	refreshLinks();
	
	td = appendTdCenter(appendTr(mainBody, 'mh_tdpage'));
	appendButton(td, 'Ajouter', addLinkField );
	appendButton(td, 'Supprimer', removeLinkField );
	
	/* Options de la Vue : vue externe, nb de CdM, etc */
	tr = appendTr(mainBody, 'mh_tdtitre');
	appendTdText(tr, 'Options de la Vue :',true);
	td = appendTd(appendTr(mainBody, 'mh_tdpage'));
	tbody = appendSubTable(td);
	
	tr = appendTr(tbody);
	td = appendTdText(tr, 'Vue externe : ');
	var select = document.createElement('select');
	select.setAttribute('id', 'vueext');
	td.appendChild(select);
	var listeVues2D = ['Bricol\' Vue','Vue du CCM','Vue Gloumfs 2D','Vue Gloumfs 3D','Grouky Vue!'];
	for (var i=0 ; i<listeVues2D.length ; i++)
		{ appendOption(select, listeVues2D[i], listeVues2D[i]); }
	if (MZ_getValue('VUEEXT'))
		{ select.value = MZ_getValue('VUEEXT'); }
	
	td = appendTd(tr);
	appendCheckBox(td, 'noInfoEM', MZ_getValue('NOINFOEM')=='true');
	appendText(td, ' Masquer les informations � propos de l\'�criture magique');
	
	tr = appendTr(tbody);
	td = appendTdText(tr, 'Nombre de CdM automatiquement r�cup�r�es : ');
	appendTextbox(td, 'text', 'maxcdm', '5', '10', MZ_getValue(numTroll+'.MAXCDM') );
	
	td = appendTd(tr);
	appendCheckBox(td, 'usecss', MZ_getValue(numTroll+'.USECSS')=='true');
	appendText(td, ' Utiliser la CSS pour les couleurs de la diplomatie');
	
	/* Interface Tactique */
	td = appendTd(appendTr(mainBody, 'mh_tdtitre'));
	appendText(td, 'Interface Tactique : ',true);
	select = document.createElement('select');
	select.setAttribute('id', 'itSelect');
	//select.setAttribute('name', 'tactic'); ?
	appendOption(select, 'none', 'Aucune');
	appendOption(select, 'bricol', 'Syst�me Tactique des Bricol\'Trolls'); // seule support�e !
	td.appendChild(select);
	
	td = appendTd(appendTr(mainBody, 'mh_tdpage'));
	tbody = appendSubTable(td);
	tbody.setAttribute('id','itBody');
	select.addEventListener('change', onChangeIT, true);
	var str = MZ_getValue(numTroll+'.INFOSIT');
	if (str) {
		select.value = str.substring(0, str.indexOf('$'));
		onChangeIT();
		}
	
	/* Tags de Tr�lls */
	td = appendTd(appendTr(mainBody, 'mh_tdtitre'));
	appendText(td, 'Tags de tr�lls : ',true);
	select = document.createElement('select');
	select.setAttribute('id', 'tagsSelect');
	//select.setAttribute('name', 'tagsSelect'); ?
	appendOption(select, 'none', 'Aucun');
	str = MZ_getValue(numTroll+'.TAGSURL');
	str = str ? str.substr(1) : '';
	for (var tags in tagsData) {
		appendOption(select, tags, tags);
		if (str && str==tagsData[tags])
			{ select.value = tags; }
		}
	appendOption(select, 'other', 'Autre');
	td.appendChild(select);
	
	td = appendTd(appendTr(mainBody, 'mh_tdpage'));
	td.setAttribute('id','tagsBody');
	select.addEventListener('change', onChangeTags, true);
	str = MZ_getValue(numTroll+'.TAGSURL');
	if (str && str.substr(0,1)=='#') {
		select.value = 'other';
		onChangeTags();
		}
	
	/* Poissotron */
	td = appendTd(appendTr(mainBody, 'mh_tdtitre'));
	appendText(td, 'Poissotron : ',true);
	td = appendTd(appendTr(mainBody, 'mh_tdpage'));
	tbody = appendSubTable(td);

	tr = appendTr(tbody);
	td = appendTd(tr);
	appendCheckBox(td, 'usepoiss', MZ_getValue(numTroll+'.POISS') );
	appendText(td, ' Envoyer vos jets de d�s au ');
	var link = document.createElement('a');
	link.setAttribute('href', 'http://www.fur4x-hebergement.net/minitilk');
	link.setAttribute('target', '_blank');
	appendText(link, 'Poissotron');
	td.appendChild(link);
	
	td = appendTdText(tr, 'Mot de passe pour le Poissotron : ');
	appendTextbox(td, 'password', 'passpoiss', '20', '50');
	
	/* Options diverses */
	td = appendTd(appendTr(mainBody, 'mh_tdtitre'));
	appendText(td, 'Options diverses :',true);
	td = appendTd(appendTr(mainBody, 'mh_tdpage'));
	appendCheckBox(td, 'infocarac', MZ_getValue(numTroll+'.INFOCARAC')!='false');
	appendText(td, ' Afficher les caract�ristiques des �quipements des autres Tr�lls');
	
	/*td = appendTd(appendTr(mainBody, 'mh_tdpage'));
	appendCheckBox(td, 'send_idt', MZ_getValue(numTroll+'.SEND_IDT') != 'non')
	appendText(td, ' Envoyer les objets identifi�s au syst�me de stats');*/
	
	/* Bouton SaveAll */
	td = appendTdCenter(appendTr(mainBody, 'mh_tdtitre'));
	input = appendButton(td, 'Sauvegarder', saveAll);
	input.setAttribute('id', 'saveAll');
	}

function insertCreditsTable(insertPt) {
	var tbody = insertMainTable(insertPt);
	
	var td = appendTdText(appendTr(tbody, 'mh_tdtitre'),
		'Depuis son origine, nombreux sont ceux qui ont contribu� � faire de MountyZilla ce qu\'il est aujourd\'hui.'
		+' Merci � eux !');

	var ul = document.createElement('ul');
	td.appendChild(ul);
	appendLI(ul,'Fine fille (6465) pour les popup javascript');
	appendLI(ul,'Reivax (4234) pour les infos bulles');
	appendLI(ul,'Noc (2770) pour les moyennes des caracs');
	appendLI(ul,'Endymion (12820) pour les infos sur les comp/sorts');
	appendLI(ul,'Ratibus (15916) pour l\'envoi de CdM');
	appendLI(ul,'TetDure (41931) pour les PVs restants dans les CdM');
	appendLI(ul,'Les Teubreux pour leur bestiaire !');
	appendLI(ul,'Les d�veloppeurs de vue qui font des efforts pour s\'int�grer � Mountyzilla');
	appendLI(ul,'Gros K�k� (233) qui permet de tester le script aux limites du raisonnable avec sa vue de barbare');
	appendLI(ul,'TuttiRikikiMaoussKosTroll (61214) pour le script sur les caracs de l\'�quipement');
	appendLI(ul,'Ashitaka (9485) pour le gros nettoyage de l\'extension, des scripts, et beaucoup de choses � venir');
	appendLI(ul,'Toute ceux de l\'ancienne g�n�ration oubli�s par Tilk');
	appendLI(ul,'Zorya (28468), Vapulabehemot (82169), Breizhou13 (50233)... et tous les participants au projet ZoryaZilla');
	appendLI(ul,'Yoyor (87818) pour diverses am�liorations de code');
	appendLI(ul,'Tous les testeurs de la nouvelle g�n�ration oubli�s par Dabihul');
	}


/*                              Partie principale                               */

start_script(712);

// Pour cryptage des mdp IT & Poissotron
appendNewScript('http://mountyzilla.tilk.info/scripts/md5.js');

var insertPoint = document.getElementById('footer2');
insertBefore(insertPoint, document.createElement('p'));
insertTitle(insertPoint, 'Mountyzilla : Options');
insertOptionTable(insertPoint);
/* insertion enchantements ici
if (...)
insertEnchantementTable();
*/
insertBefore(insertPoint, document.createElement('p'));
insertTitle(insertPoint, 'Mountyzilla : Cr�dits');
insertCreditsTable(insertPoint);
insertBefore(insertPoint, document.createElement('p'));


/*                                  Obsol�tes                                   */
function deleteEnchantement()
{
	try
	{
	var idEquipement = this.getAttribute('name');
	MZ_removeValue(numTroll+".enchantement."+idEquipement+".objet");
	MZ_removeValue(numTroll+".enchantement."+idEquipement+".enchanteur");
	MZ_removeValue(numTroll+".enchantement."+idEquipement+".composant.0");
	MZ_removeValue(numTroll+".enchantement."+idEquipement+".composant.1");
	MZ_removeValue(numTroll+".enchantement."+idEquipement+".composant.2");
	var listeEquipement = MZ_getValue(numTroll+".enchantement.liste").split(";");
	var string = "";
	for(var i=0;i<listeEquipement.length;i++)
	{
		if(listeEquipement[i]!=idEquipement)
			if(string=="")
				string = listeEquipement[i];
			else
				string += ";"+listeEquipement[i];
	}
	if(string=="")
	{
		MZ_removeValue(numTroll+".enchantement.liste");
		var table = this.parentNode.parentNode.parentNode.parentNode;
		var parent = table.parentNode;
		for(var i=0;i<parent.childNodes.length;i++)
		{
			if(parent.childNodes[i]==table)
			{
				parent.removeChild(parent.childNodes[i-1]);
				parent.removeChild(parent.childNodes[i-1]);
				parent.removeChild(parent.childNodes[i-1]);
				break;
			}
		}
	}
	else
	{
		MZ_getValue(numTroll+".enchantement.liste",string);
		this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
	}
	}
	catch(e)
	{
		alert(e);
	}
}

if(MZ_getValue(numTroll+".enchantement.liste") && MZ_getValue(numTroll+".enchantement.liste")!="" )
{
	insertTitle(insertPoint, 'Les Enchantements en cours');
	table = document.createElement('table');
	table.setAttribute('width', '98%');
	table.setAttribute('border', '0');
	table.setAttribute('align', 'center');
	table.setAttribute('cellpadding', '2');
	table.setAttribute('cellspacing', '1');
	table.setAttribute('class', 'mh_tdborder');

	tbody = document.createElement('tbody');
	table.appendChild(tbody);
	
	tr = appendTr(tbody, 'mh_tdtitre');
	appendTdText(tr, 'Equipement',1);
	appendTdText(tr, 'Composants',1);
	appendTdText(tr, 'Enchanteur',1);
	appendTdText(tr, 'Action',1);
	
	var listeEquipement = MZ_getValue(numTroll+".enchantement.liste").split(";");
	for(var i=0;i<listeEquipement.length;i++)
	{
		try
		{
			var idEquipement = listeEquipement[i];
			var nomEquipement = MZ_getValue(numTroll+".enchantement."+idEquipement+".objet");
			var infoEnchanteur = MZ_getValue(numTroll+".enchantement."+idEquipement+".enchanteur").split(";");
			var ul = document.createElement('UL');
			for(var j=0;j<3;j++)
			{
				var infoComposant = MZ_getValue(numTroll+".enchantement."+idEquipement+".composant."+j).split(";");
				var texte = infoComposant[4].replace("Ril ","�il ");
				for(var k=5;k<infoComposant.length;k++)
				{
					texte += ";"+infoComposant[k].replace("Ril ","�il ");
				}
				li = appendLI(ul,texte);
				var string = '<form action="http://troc.mountyhall.com/search.php" method="post" TARGET = "_blank">';
				string+= '<input type="hidden" name="monster" value="'+infoComposant[2]+'" />';
				string+= '<input type="hidden" name="part" value="'+infoComposant[0]+'" />';
				string+= '<input type="hidden" name="qualite" value="'+(getQualite(infoComposant[3])+1)+'" />';
				string+= '<input type="hidden" name="q" value="min" />';
				string+= '<input type="submit" class="mh_form_submit" onMouseOver="this.style.cursor=\'hand\';" name="enter" value="Rechercher sur le Troc de l\'Hydre" />';
				string+= ' &nbsp; <input type="button" class="mh_form_submit" onMouseOver="this.style.cursor=\'hand\';" onClick="javascript:window.open(&quot;http://www.cyclotrolls.be/wakka.php?wiki=TroOGle&trooglephr=base%3Amonstres+tag%3Anom+%22'+infoComposant[2]+'%22&quot;)" value="Localiser le monstre gr�ce � Troogle" /></form>';
				
				string+= '</form>';
//				string += '<form action="http://www.cyclotrolls.be/wakka.php" method="get" TARGET = "_blank">';
//				string+= '<input type="hidden" name="wiki" value="TroOGle" />';
//				string+= '<input type="hidden" name="trooglephr" value="base:monstres tag:nom &quot;'+infoComposant[2]+'&quot;" />';
//				string+= '<input type="submit" class="mh_form_submit" onMouseOver="this.style.cursor=\'hand\';" name="enter" value="Localiser gr�ce � Troogle" /></form>';
				li.innerHTML += string;
			}
			tr = appendTr(tbody, 'mh_tdpage');
			
			td = appendTdText(tr, nomEquipement);
			td.setAttribute('valign', 'center');
			
			td = document.createElement('td');
			td.appendChild(ul);
			tr.appendChild(td);
			td.setAttribute('valign', 'center');
			
			td = appendTdText(tr, "Enchanteur n�"+infoEnchanteur[0]+" ("+infoEnchanteur[1]+"|"+infoEnchanteur[2]+"|"+infoEnchanteur[3]+")");
			td.setAttribute('valign', 'center');
			
			td = document.createElement('td');
			input = appendButton(td, 'Supprimer l\'enchantement', deleteEnchantement);
			input.setAttribute('name', idEquipement);
			tr.appendChild(td);
			td.setAttribute('valign', 'center');
		}
		catch(e)
		{
		}
	}
	insertBefore(insertPoint, table);
	insertBefore(insertPoint, document.createElement('p'));
}
/*                                Fin obsol�tes                                 */


displayScriptTime();
