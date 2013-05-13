<?php

$fusion_replace["all"]= array(
 array("'Mozilla/4.0", "'Mozilla/4.0 [FusionZoryaZilla]")
,array("'http://mountyzilla.tilk.info/scripts_0.8/images", "SkinZZ+'MZ")
,array('"http://mountyzilla.tilk.info/scripts_0.8/images', 'SkinZZ+"MZ')
,array("'http://mountyzilla.tilk.info/scripts_0.9/images", "SkinZZ+'MZ")
,array('"http://mountyzilla.tilk.info/scripts_0.9/images', 'SkinZZ+"MZ')
,array("'http://mountyzilla.tilk.info/scripts_0.9", "ZZDB+'")
,array('"http://mountyzilla.tilk.info/scripts_0.9', 'ZZDB+"')
,array("'http://mountypedia.free.fr/mz/monstres_0.9_post_FF.php", "ZZDB+'/mzMonstres.php")
,array("http://www.fur4x-hebergement.net/minitilk", "http://minitilk.fur4x-hebergement.net")
);


$fusion_replace["vue_FF.js"]= array(
// array("'http://mountypedia.free.fr/mz/monstres_0.9_post_FF.php", "ZZDB+'/mzMonstres.php")
 array("computeMission(begin2,end2);", "computeMission(begin2,end2); /*ZZ: appel de setInfosMonstres */ if (i == max) setInfosMonstres(1);")
,array("for (var i = 3; i < nbMonstres+2; i++) {", "x_monstres[2].removeChild(x_monstres[2].childNodes[2]);	for (var i = 3; i < nbMonstres+2; i++) {")		// correction bug MZ sur les niveaux
,array("for (var i = nbMonstres; --i >= 1;)", "for (var i = nbMonstres+1; --i >= 1;)") 																		// correction bug MZ sur les infotactique
,array("refreshDiplo();", "//refreshDiplo();	  // Diplo faite par ZZ dans sa version Fusion")	
,array("var cache = getSortComp(\"Invisibilité\")>0 || getSortComp(\"Camouflage\")>0;", "var cache =true; // (ZZ: le caché peut servir pour les autres) var cache = getSortComp(\"Invisibilité\")>0 || getSortComp(\"Camouflage\")>0;")	
,array('display: inline; z-index: 3; max-width: 400px;', 'display: inline; z-index: 3; max-width: 500px;')
,array("return new Array(posx, pos.substring(pos.indexOf('=') + 2, pos.indexOf(',')), pos.substr(pos.lastIndexOf('=') + 2));", "var posy = pos.substring(pos.indexOf('=') + 2, pos.indexOf(',')); var posn = pos.substr(pos.lastIndexOf('=') + 2); if (posn.indexOf('[')>0) posn=posn.substr(0, posn.indexOf('[')-1); return new Array(posx, posy, posn);")   	// correction bug MZ si zone MB
,array('if(donneesMonstre && donneesMonstre.length>12)','if(donneesMonstre && donneesMonstre.length>13)		
      {
         if(donneesMonstre[13]==1)
         {
            var tr = x_monstres[i].childNodes[checkBoxLevels.checked ? 2 : 3];
            tr.appendChild(document.createTextNode(" "));
            tr.appendChild(createImage(SkinZZ+"distance.png", "Attaque à distance"));
         }
		 }
		 if(donneesMonstre && donneesMonstre.length>12)')														// patché par Yogui
,array("savePosition();", "if (!externalVue) savePosition();	  // pas de sauvegarde dans le cas des vues externes")	
,array("function filtreLevels() {", "function filtreLevels() {
     if (nbMonstres<=1) return;			// si pas de monstre pas de traitement du level")	
);

$fusion_replace["option_FF.js"]= array(
 array('if (document.getElementById("tags").value == "default")', 'if (document.getElementById("tags").value == "zztags") MZ_setValue("TAGSURL",ZZDB+"/Tags/ZZTags.csv"); else if (document.getElementById("tags").value == "default")')
,array("appendOption(select, 'none', 'Aucuns');", "appendOption(select, 'none', 'Aucuns'); appendOption(select, 'zztags', 'Trollstiaire ZoryaZilla');")
,array('var c = MZ_getValue("TAGSURL");',  'var c = MZ_getValue("TAGSURL"); if(c==ZZDB+"/Tags/ZZTags.csv") document.getElementsByName("tags")[0].value = "zztags"; else') 
,array("'http://mountyzilla.tilk.info/scripts", "ZZDB+'/scripts")
);


$fusion_replace["diplo_FF.js"]= array(
 array("getDiplo_FF.php", "mzData.php")
,array("url: getDiploURL + '?num=' + numTroll + '&' + param,", "url: getDiploURL + '?TypeData=Diplo&num=' + numTroll + '&' + param,")
);

$fusion_replace["ordresgowap_FF.js"]= array(
// array('"http://mountyzilla.tilk.info/scripts_0.8/carte_trajet2.php', 'ZZDB+"/scripts/carte_trajet.php')
 array('setCarteGogo();', '// setCarteGogo(); remplacé par le nouveau script de felpath plus performant')
);

/*
$fusion_replace["menu_FF.js"]= array(
 array("cookiesToStorage();", "//cookiesToStorage(); // ZZ devenu inutile, on retire")
,array('var listeCookies=new Array("NUM_TROLL","NOM_TROLL","CDMID","NIV_TROLL","URL1","URL2","URL3","NOM1","NOM2","NOM3","VUEEXT","MAX_LEVEL","USECSS","FORMAT_TIME",', '//var listeCookies=... (obsolète)')
,array('	"INFOCARAC","TAGSURL","SEND_IDT","NOINFOEM","MM_TROLL","RM_TROLL","NOENGAGE","NOINT","NOGG","NOCOMP","NOBID","NODIPLO","NOMYTH","NOEM","NOTROU","NOGOWAP",', '')
,array('	"NOLEVEL");', '')
,array('var listeCookiesByTroll = new Array("MISSION_","IT_","POISS_");', '//var listeCookiesByTroll =... (obsolète) ')
);
*/

/*		==> Normalement décumul corrigé avec le code de Dahibul
$fusion_replace["malus_FF.js"]= array(		//Patch pour prendre en compte le décumul
 array("var listeType = new Array();", "var listeType = new Array();
 	//======== ZZ: patch correctif de MZ pour décumul ============
	var listePouvoirsDecumul = new Array(); var listeTypeDecumul = new Array(); var listeDureeDecumul = new Array(); ")
,array("if(listePouvoirsByTurn[nbTour] == null)", "var altimg=malus.snapshotItem(i).parentNode.parentNode.childNodes[7].childNodes[1].getAttribute('alt');
		var nom=malus.snapshotItem(i).parentNode.parentNode.childNodes[1].firstChild.nodeValue;
		
		var decumul=false; //======== ZZ: check décumul 
		if (altimg=='Décumul appliqué') 
		{
			decumul=true; 
			if(listePouvoirsDecumul[nom] == null) 
			{ 
				listePouvoirsDecumul[nom]= new Array(); 
				listeDureeDecumul[nom]= new Array(); 
				listeTypeDecumul[nom]= type; 
			}		
			listePouvoirsDecumul[nom][(listePouvoirsDecumul[nom].length)]=textes; 
			listeDureeDecumul[nom][(listeDureeDecumul[nom].length)]=nbTour; 
		}
		if(listePouvoirsByTurn[nbTour] == null)")
,array("for(var j=0;j<textes.length;j++)", "if (!decumul) for(var j=0;j<textes.length;j++)")
,array('var tbody = document.evaluate', 'for (var nom in listePouvoirsDecumul) //======== ZZ: inversion des bonus/malus de décumul 
	{
		var l=(listeDureeDecumul[nom].length)-1;
		for (var t=0; t<=l; t++) 
		{
			var textes = listePouvoirsDecumul[nom][t];
			var nbTour =listeDureeDecumul[nom][l-t]; 			
			var type = listeTypeDecumul[nom]; 			
			 for(var j=0;j<textes.length;j++)		
			 {	
				var texte = trim(textes[j]);
				if(texte.indexOf(":")==-1) continue;
				var bonus = trim(texte.substring(0,texte.indexOf(":")));
				listePouvoirs[bonus] = 1;
				var valeur = parseInt(texte.substring(texte.indexOf(":")+1));
				if(listePouvoirsByTurn[nbTour][type][bonus] == null)
					listePouvoirsByTurn[nbTour][type][bonus] = valeur;
				else
					listePouvoirsByTurn[nbTour][type][bonus] += valeur;		
			}	
		}
	}
	var tbody = document.evaluate')
);
*/

$fusion_replace["profil_FF.js"]= array(
 array("else if (comp.indexOf('Dressage')!=-1)", "else if(comp.indexOf('Golemologie') != -1) {
		texte = 'Cette compétence permet de fabriquer un golem à partir d\'un bric-à-brac d\'objets plus ou moins utiles et d\'un minerai taillé contenant toute l\'intelligence de celui-ci, mais permet aussi de pouvoir leur donner des instructions précises.<hr/>'; 
		texte += '<b>Le golem de Cuir</b> : ce golem possède de nombreuses poches. Il est donc capable de tenir plus d\'un objet à la fois.';
		texte += '<b>Le golem de Métal</b> : le golem de combat par excellence.';
		texte += '<b>Le golem de Mithril</b> : La version du golem de métal pour les trõlls richissimes.';
		texte += '<b>Le golem de Papier</b> : ce golem est aussi résistant qu\'un gobelin venant de naître, mais par contre, c\'est le seul capable de communiquer avec son propriétaire.';
    } else if (comp.indexOf('Dressage')!=-1)")
//,array("Rapport kills/deaths","Rapport meutres/décès")		
);


//$fusion_replace["myevent_FF.js"]= array(
// array("'http://mountypedia.free.fr/mz/monstres_0.9_post_FF.php", "ZZDB+'/mzMonstres.php")
//);



$fusion_replace["actions_FF.js"]= array(
// array('getLevel();', '// getLevel(); //ZZ: remplacé car ne fonctionne pas correctement et ZZ le calcul ailleurs')
//,array('if (document.evaluate("//form/descendant::p/text()[contains(., \'Vous êtes entré dans une Zone Piégée\')]",', 'if(document.evaluate("//tr/td/descendant::p/text()[contains(., \'Zone centrale ciblée\')]",document, null, XPathResult.STRING_TYPE, null).stringValue) return; else if (document.evaluate("//form/descendant::p/text()[contains(., \'Vous êtes entré dans une Zone Piégée\')]",')
);

$fusion_replace["libs_FF.js"]= array(
 array('if(!isPage("MH_Play/Play_vue.php") && !isPage("MH_Play/Play_menu.php"))', 'function isZZPage(url) { return currentURL.indexOf(ZZDB + url) == 0; } if(!isPage("MH_Play/Play_vue.php") && !isPage("MH_Play/Play_menu.php") && !isZZPage("/Play_vue.php"))')
);

$fusion_replace["infomonstre_FF.js"]= array(
 array('start_script();', '/*start_script();')
,array('displayScriptTime();', 'displayScriptTime();*/')
);

$fusion_replace["tancompo_FF.js"]= array(
 array("treateComposants();",  "treateComposants(); treateMinerai();")
);

/*$fusion_replace["cdmcomp_FF.js"]= array(
 array("if (!document.evaluate(\"b/b/text()[contains(.,'RÉUSSI')]\",", "")
,array("form, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue)", "if ((!document.evaluate(\"b/b/text()[contains(.,'RÉUSSI')]\", form, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue)
	 && (!document.evaluate(\"p/b/b/text()[contains(.,'RÉUSSI')]\", form, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue))")
);		*/
		
$fusion_remove_func["vue_FF.js"]= array(
 'getMonstrePosition'
,'putRealDiplo'
,'getTrollGuildeID'
,'toggleTableau'
,'refreshDiplo'
);

/*
$fusion_remove_func["menu_FF.js"]= array(
 'cookiesToStorage'
,'cookieToStorage'
);
*/

$fusion_remove_func["ordresgowap_FF.js"]= array(
 'setCarteGogo'
);

//$fusion_remove_func["actions_FF.js"]= array(
// 'getLevel'
//);

$fusion_remove_func["equip_FF.js"]= array(
 'treateEquipement'
);

$fusion_remove_func["infomonstre_FF.js"]= array(
 'treateMonstre'
,'initPopup'
,'showPopup'
,'hidePopup'
,'createPopupImage2'
,'toggleTableau'
,'computeMission'
);


?>