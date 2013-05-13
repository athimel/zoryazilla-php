/*********************************************************************************
*    This file is part of zoryazilla.                                           *
*********************************************************************************/
MZ_setValue("ZZDB", ZZDB);
MZ_setValue("Autologon", Autologon);

//const scriptsMZ = ZZDB+"/scripts_MZ/";	
//const scriptsFZ = ZZDB+"/scripts_200/";		
const scriptsMZ = ZZDB+"/scripts_MZ/FZ/";			// mode debug
const scriptsFZ = ZZDB+"/scripts_200/FZ/";

MZ_appendNewScript(ZZDB+'/mzPrivate.php?TiD='+MZ_getValue("NUM_TROLL"));			// couche de cryptage
	
//=================== Activation des Scripts Mountyzilla & Fusion ZZ ==========================================//
chargerScript("libs");
//====================== librairie commune au deux environnements  =============================================//

	
//------------------------- pages sur site Zoryazilla ----------------------------------------------------------//
if (isZZPage("/zoryazilla.php"))chargerScriptZZ("zoryazilla_FF.js");
else if (isZZPage("/mzLogin.php")) chargerScriptZZ("login_FF.js");
else if (isZZPage("/mzAutologon.php")) chargerScriptZZ("login_FF.js");
else if (isZZPage("/Play_vue.php")) chargerScript("vue");					// activer le script de vu sur les page de vue ZZ
//et pages MH non prise en compte dans MZ
else if (isPage("MH_Play/PlayStart.php")) chargerZZScript("PlayStart_FF.js");
else if (isPage("MH_Play/TurnStart.php")) chargerZZScript("TurnStart_FF.js");
else if (isPage("MH_Play/Play_action.php")) chargerZZScript("Play_action_FF.js");
else if (isPage("MH_Follower/FO_Profil.php")) chargerZZScript("FollowP_FF.js");
else if (isPage("Messagerie/MH_Messagerie.php")) chargerZZScript("Messagerie_FF.js");
else if (isPage("View/TresorHistory2.php")) chargerZZScript("TresorHistory_FF.js");
else if (isPage("MH_Guildes/Guilde_Membres.php")) chargerZZScript("guilde_FF.js");     
else if (isPage("View/PJView_Events.php")) chargerZZScript("PJView_Events_FF.js");
else if (isPage("")) chargerScriptZZ("other_FF.js");		// => en cas d'évolution ZZ, cela evite la publication de l'extension complète

//=================== Activation des Scripts Mountyzilla & Fusion ZZ ==========================================//
// Détection de la page à traiter
if (isPage("Messagerie/ViewMessageBot.php"))
	chargerScript("cdmbot");
else if (isPage("MH_Play/Actions/Competences/Play_a_Competence16b.php"))
	chargerScript("cdmcomp");
else if (isPage("MH_Guildes/Guilde_o_AmiEnnemi.php"))
	chargerScript("diplo");
else if (isPage("MH_Play/Play_equipement.php"))
	chargerScript("equip");
else if (isPage("MH_Play/Actions/Competences/Play_a_Competence10.php"))
	chargerScript("idt");
else if (isPage("MH_Play/Play_menu.php"))
	chargerScript("menu");
else if (isPage("MH_Play/Options/Play_o_Interface.php") || isPage("installPack.php"))
	chargerScript("option");
else if (isPage("View/PJView.php"))
	chargerScript("pjview");
else if (isPage("MH_Play/Play_profil.php"))
	chargerScript("profil");
else if (isPage("MH_Play/Play_profil_old.php"))
	chargerScript("profil_old");
else if (isPage("MH_Play/Play_e_ChampComp.php"))
	chargerScript("saccompo");
else if (isPage("MH_Taniere/TanierePJ_o_Stock.php") || isPage("MH_Comptoirs/Comptoir_o_Stock.php"))
	chargerScript("tancompo");
else if (isPage("MH_Play/Play_vue.php"))
	chargerScript("vue");
else if (isPage("MH_Play/Play_news.php"))
{
	chargerScript("http://echoduhall.free.fr/Echo/tilk.php3");
	chargerScript("news");
}
else if(isPage("MH_Play/Actions/Play_a_Move.php") || isPage("MH_Lieux/Lieu_Teleport.php"))
	chargerScript("move");
else if (isPage("MH_Missions/Mission_Etape.php"))
	chargerScript("mission");
else if (isPage("View/MonsterView.php"))
	chargerScript("infomonstre");
else if (isPage("MH_Play/Actions/Play_a_Attack.php"))
	chargerScript("attaque");
else if (isPage("MH_Follower/FO_Ordres.php"))
	chargerScript("ordresgowap");
else if(isPage("MH_Follower/FO_Equipement.php"))
	chargerScript("equipgowap");
else if(isPage("MH_Play/Play_mouche.php"))
	chargerScript("mouches");
else if(isPage("MH_Play/Play_BM.php"))
	chargerScript("malus");
else if(isPage("MH_Play/Play_evenement.php"))
	chargerScript("myevent");
else if(isPage("MH_Lieux/Lieu_DemanderEnchantement.php"))
	chargerScript("enchant");
else if(isPage("MH_Lieux/Lieu_Enchanteur.php"))
	chargerScript("pre-enchant");
if (isPage("MH_Play/Actions") || isPage("Messagerie/ViewMessageBot.php"))
	chargerScript("actions");

function isPage(url) {
	return currentURL.indexOf(MHURL + url) == 0;
}
function chargerScript(script) {
	// (mauvaise) Détection du chargement de la page
	if (document.getElementsByTagName('A').length > 0)
		MZ_appendNewScript(script.indexOf("http://") != -1 ? script : scriptsMZ + script + "_FF.js");
}
//=================== FIN Scripts Mountyzilla ==========================================//


//=================== Script Externe intégré de base à Fusion ZZ ==========================================//
if(isPage("MH_Follower/FO_Ordres.php") || isPage("MH_Play/Play_equipement.php?as_CurSect=follo") || isPage("MH_Follower/FO_Profil.php")|| isPage("MH_Lieux/Lieu_Description.php"))
	chargerScriptZZ("feldspath.trajet_canvas.user.js");			//script du génialisime feldspath patch pour ajouter les infos ZZ
else if(isPage("Messagerie/MH_Messagerie.php?cat=3"))
	chargerScriptZZ("cenairdsvoum.retitremsg.js");				//trop de RE tue le RE (goodies bien sympatique de cenairdsvoum) 
//=================== FIN Script Externe intégrés ========================================================//
//MZ_appendNewScript(ZZDB+'/mzScriptsExt.php');					// ajout des scripts Externes (à la volée)

function isZZPage(url) {
	return currentURL.indexOf(ZZDB + url) == 0;
}

function chargerScriptZZ(script) {
	MZ_appendNewScript(scriptsFZ+script);
}

function chargerZZScript(script) {
	MZ_appendNewScript(scriptsFZ+script);
	var node = document.evaluate("//td/text()[contains(.,'Page générée en')]",
	document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if (node) node.nodeValue += " - [ZoryaZilla Database: "+ZZDB+"]";
}