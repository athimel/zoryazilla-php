// ==UserScript==
// @name Feldspatatrac - Vue 2D MH
// @include http://games.mountyhall.com/mountyhall/MH_Play/Play_vue.php*
// @include http://serv01.mountyhall.com/mountyhall/MH_Play/Play_vue.php*
// @include http://games.mountyhall.com/mountyhall/MH_Play/Actions/Play_a_SortResult.php*
// @include http://serv01.mountyhall.com/mountyhall/MH_Play/Actions/Play_a_SortResult.php*
// @description Vue 2D ingame version 3.8.1.4 du 13 decembre 2011 par Feldspath (34422)
// @injectframes 1
// ==/UserScript==

//////////////////////
//Generation de la map
//Selection des niveaux
function niveaux() {
	var sel = document.getElementById("selecteur");
	sel.innerHTML = "";
	var nvspan = enligne("etik_niv");
	nvspan.innerHTML = "Niveau";
	sel.appendChild(nvspan);

	var nvdiv = document.createElement("div");
	nvdiv.id = "alt_niv";
	nvdiv.innerHTML = "aucun";
	nvdiv.className = "niv_out";
	nvdiv.style.left = "50px";
	nvdiv.style.width = "45px";
	addEvent(nvdiv, "click", alt_niv, true);
	sel.appendChild(nvdiv);

	var decal_n = 98;
	var typ_couche = ["t", "m", "o", "l", "c", "d", "smr", "smv", "smb", "str", "stv", "stb"];
	for (var j=nmin;j<=nmax;j++) {
		var strate = enligne("NS"+j);

		for(var i=0; i<12; i++) {
			strate.appendChild(enligne("NS"+j+typ_couche[i]));
			strate.lastChild.className = "couche_"+typ_couche[i];
		}

		strate.appendChild(enligne("NS_moqp"+j));
		strate.lastChild.className = "i_moqp couche_m";
		strate.appendChild(enligne("NS_ooqp"+j));
		strate.lastChild.className = "i_ooqp couche_o";
		ancre.appendChild(strate);

		nvdiv = bloc("S"+j);
		nvdiv.className = "niv";
		nvdiv.style.left = decal_n+"px";
		nvdiv.innerHTML = j;
		addEvent(nvdiv, "click", etagc, true);
		addEvent(nvdiv, "mouseover", etag, true);
		addEvent(nvdiv, "mouseout", etago, true);
		sel.appendChild(nvdiv);
		decal_n += 38;
	}
	(document.getElementById("S"+n1)).style.backgroundImage="url("+img_src("tab")+")";
}
//Affichage des images & texte
function c_case(v,h) {
	var imag=document.createElement("img");
	imag.src=img_src("case");
	imag.className = "case";
	imag.style.top = v+"px"; imag.style.left = h+"px";
	imag.alt="";
	return imag;
}
function p_txt(texte, styl) {
	var dive=document.createElement("span");
	aj_texte(dive, texte);
	dive.className = styl;
	return dive;
}
//grille
function grille() {
	//quadrillage
	if(ie) {
		repere = bloc("repere");
		var ec = [decal_h-18, parseInt(dh+.5*larg-6), parseInt(dv+.5*larg-7), decal_g-25, dv+h1*larg+1*larg+3, parseInt(dh+.5*larg-6), parseInt(dv+.5*larg-7), dh+h1*larg+1*larg+3];
		for (var j=-h1;j<=h1;j++) {//grille
			dj = larg*j;
			hh = dj+dh;
			for (var i=-h1;i<=h1;i++) {
				repere.appendChild(c_case(dv+i*larg, hh));
			}
			repere.appendChild(c_case(dv, hh));//axe x
			repere.appendChild(c_case(dv+dj, dh));//axe y
			//etiquettes texte
			repere.appendChild(p_txt(ec[0], ec[1]+dj, j+x1));//haut
			repere.appendChild(p_txt(ec[2]+dj, ec[3], y1-j));//gauche
			repere.appendChild(p_txt(ec[4], ec[5]+dj, j+x1));//bas
			repere.appendChild(p_txt(ec[6]+dj, ec[7], y1-j));//droite
		}

		if((x1 != posx || y1 != posy) && posx > xmin && posx < xmax && posy > ymin && posy < ymax) repere.appendChild(c_case(dv+(y1-posy)*larg, dh+(posx-x1)*larg));
		ancre.appendChild(repere);
	}
	else {
		var couleur = ["rgb(183,161,140)", "rgba(216,194,173,0.33)", "rgba(0,0,0,0.02)", "rgba(0,0,0,0.4)", "rgba(0, 0, 0, 0.05)"] //grille, fond, ligne, centre

		dessin = document.getElementById("grille");
		dessin.width = th;
		dessin.height = tv;

		if (dessin.getContext){
			var ctx = dessin.getContext("2d");
			ctx.lineWidth="1";
			ctx.fillStyle=couleur[1];

			ctx.fillRect(0,0,th,tv);
			ctx.fillRect(0,(ymax-y1)*haut ,th,haut);
			ctx.fillRect((x1-xmin)*larg ,0,larg,tv);
			ctx.strokeRect(0,0,th,tv);


			if(opt["style_niv"] == 1) {
				ctx.fillStyle=couleur[2];
				var pair = 0;
				for (var j=0;j<=nby;j++) {
					for(var i=0; i<nb_n_vus; i++) {
						if((pair % 2 )==0) ctx.fillRect(0, opt["ico"]*i+1+haut*j, th, opt["ico"]);
						pair++;
					}
				}
			}
			else if(opt["style_niv"] == 2) {
				ctx.fillStyle=couleur[2];
				var pair = 0;
				for (var j=0;j<=2*nbx;j++) {
					for(var i=0; i<nb_n_vus; i++) {
						if((pair % 2 )==0) ctx.fillRect(opt["ico"]*i+1+larg*j, 0, opt["ico"], tv);
						pair++;
					}
				}
			}
			if(opt["style_niv"] > 0 && vu["S"+n1]) {
				var milieu = 0
				for (var j=nmax; j>posn; j--) {
					if (vu["S"+j]) milieu++;
				}
				ctx.strokeStyle=couleur[4];
				if(opt["style_niv"] == 1) {
					for (var j=0;j<=nby;j++) {
						ctx.strokeRect(0, opt["ico"]*milieu+1+haut*j, th, opt["ico"]);
					}
				}
				else if(opt["style_niv"] == 2) {
					for (var j=0;j<=nbx;j++) {
						ctx.strokeRect(opt["ico"]*milieu+1+larg*j, 0, opt["ico"], tv);
					}
				}
			}

			ctx.strokeStyle=couleur[0];
			ctx.beginPath();
			for (var j=0;j<=nbx;j++) {
				ctx.moveTo(larg*j, 0);
				ctx.lineTo(larg*j, tv-1);
			}
			for (var j=0;j<=nby;j++) {
				ctx.moveTo(0, haut*j);
				ctx.lineTo(th-1, haut*j);
			}
			ctx.stroke();
			if(posx >= xmin && posx <= xmax && posy >= ymin && posy <= ymax) {
				ctx.strokeStyle=couleur[3];
				ctx.strokeRect(larg*(posx-xmin),haut*(ymax-posy),larg,haut);
			}
		}
	}
}
function creer_grille() {
	repere = bloc("repere");
	var dessin  = document.createElement("canvas");
	dessin.style.top = decal_h+"px";
	dessin.style.left = decal_g+"px";
	dessin.id = "grille";
	repere.appendChild(dessin);

	for (var j=xmin;j<=xmax;j++) {//grille
		repere.appendChild(p_txt(j, "th X"+j));//haut
		repere.appendChild(p_txt(j, "tb X"+j));//bas
	}
	for (var j=ymin;j<=ymax;j++) {//grille
		repere.appendChild(p_txt(j, "tg Y"+j));//gauche
		repere.appendChild(p_txt(j, "td Y"+j));//droite
	}
	ancre.appendChild(repere);
}
//Place les icones
function calc_coord(px,py,pn,cat,lign,nom) {
	if(!coord[cat][px]) {
		coord[cat][px] = new Array();
		coord[cat][px][py] = new Array();
		coord[cat][px][py][pn] = [[lign,nom]];
		return;
	}
	else if(!coord[cat][px][py]) {
		coord[cat][px][py] = new Array();
		coord[cat][px][py][pn] = [[lign,nom]];
		return;
	}
	else if(!coord[cat][px][py][pn]) {
		coord[cat][px][py][pn] = [[lign,nom]];
		return;
	}
	else {
		coord[cat][px][py][pn].push([lign,nom]);
	}
}
function p_ico_m(px,py,pn,lien,nom,ref) {
	if(coord[0][px] && coord[0][px][py] && coord[0][px][py][pn]) {
		compte["i_moqp"]++;
		(document.getElementById("NS_moqp"+pn)).appendChild(p_ico_b(px,py,pn,lien,nom,ref,1));
	}
	else {
		(document.getElementById("NS"+pn+"m")).appendChild(p_ico_b(px,py,pn,lien,nom,ref,1));
	}
}
function p_ico_o(px,py,pn,lien,nom,ref) {
	if(coord[0][px] && coord[0][px][py] && coord[0][px][py][pn]) {
		compte["i_ooqp"]++;
		(document.getElementById("NS_ooqp"+pn)).appendChild(p_ico_b(px,py,pn,lien,nom,ref,2));
	}
	else {
		(document.getElementById("NS"+pn+"o")).appendChild(p_ico_b(px,py,pn,lien,nom,ref,2));
	}
}
function p_ico_b(px,py,pn,lien,nom,ref,cat) {
	var typ = ["i_t","i_m","i_o","i_l","i_c","i_d"][cat];
	nom = typ+nom;
	calc_coord(px,py,pn,cat,ref,nom);
	compte[nom]++;
	var imag=document.createElement("img");
	imag.className = "icone "+nom+" X"+px+" Y"+py;
	imag.src= img_src(typ+lien);
	imag.alt="";
	imag.id=typ+ref;
	imag.name=nom;
	return imag;
}
function img_src(source) {
	if(chemin) return chemin+source+".png";
	return data_img[source];
}
function icones() {
	//trolls
	for(var k=0; k<6; k++) { coord[k] = new Array(); }
	var xxx, yyy, nnn, mm, px, py, pn, nom, pp, gg;

	l_t = new Array(); l_g = new Array();
	if(nb_t > 1) {
		xxx = x_t[0].childNodes.length-3; yyy = x_t[0].childNodes.length-2; nnn = x_t[0].childNodes.length-1;
		if(x_t[1].getElementsByTagName("input").length > 0) {
			pp = 3; gg = 6
		}
		else {
			pp = 2; gg = 5
		}
		for (var i=1;i<nb_t;i++) {
			if(x_t[i].childNodes.length < 3) continue;

			px = parseInt(x_t[i].childNodes[xxx].firstChild.nodeValue);
			py = parseInt(x_t[i].childNodes[yyy].firstChild.nodeValue);
			pn = parseInt(x_t[i].childNodes[nnn].firstChild.nodeValue);
			if(px < xmin || px > xmax || py < ymin || py > ymax || pn < nmin || pn > nmax) continue;

			l_t[prepare_regexp(x_t[i].childNodes[pp].getElementsByTagName("a")[0].innerHTML)] = [px, py, pn];
			if(x_t[i].childNodes[gg].getElementsByTagName("a").length > 0) {
				nom = prepare_regexp(x_t[i].childNodes[gg].getElementsByTagName("a")[0].innerHTML);
				if(nom) {
					if(l_g[nom]) {
						l_g[nom].push([px, py, pn]);
					}
					else {
						l_g[nom] = [[px, py, pn]];
					}
				}
			}

			statut = "n";
			if(x_t[i].className == "mh_trolls_amis" || x_t[i].className == "mh_guildes_amis" || x_t[i].style.backgroundColor == "rgb(170, 255, 170)") statut = "a";
			else if(x_t[i].className == "mh_trolls_ennemis" || x_t[i].className == "mh_guildes_ennemis" || x_t[i].style.backgroundColor == "rgb(255, 170, 170)") statut = "e";
			else if(x_t[i].className == "mh_guildes_perso" || x_t[i].style.backgroundColor == "rgb(187, 187, 255)") statut = "p";
			else if(x_t[i].getElementsByTagName("a")[0].className == "mh_trolls_0") statut = "i";

			(document.getElementById("NS"+pn+"t")).appendChild(p_ico_b(px,py,pn,statut,statut,i,0));
		}
	}
	//monstres
	l_m = new Array();
	try {
	if(nb_m > 1) {
		xxx = x_m[0].childNodes.length-3; yyy = x_m[0].childNodes.length-2; nnn = x_m[0].childNodes.length-1;
		mm = (x_m[1].childNodes.length == 6)? 2:3;

		for (var i=1;i<nb_m;i++) {
			if(x_m[i].childNodes.length < 3) continue;

			px = parseInt(x_m[i].childNodes[xxx].firstChild.nodeValue);
			py = parseInt(x_m[i].childNodes[yyy].firstChild.nodeValue);
			pn = parseInt(x_m[i].childNodes[nnn].firstChild.nodeValue);
			if(px < xmin || px > xmax || py < ymin || py > ymax || pn < nmin || pn > nmax) continue;

			statut = ""; nom = prepare_regexp(x_m[i].childNodes[mm].firstChild.innerHTML.split(" [")[0]);
			if(l_m[nom]) {
				l_m[nom].push([px, py, pn]);
			}
			else {
				l_m[nom] = [[px, py, pn]];
			}
			if(nom == "gowap apprivoise") {
				statut = "g";
				if(x_m[i].childNodes[mm].childNodes[1] && x_m[i].childNodes[mm].childNodes[1].nodeValue.match(/\[.+\]/)) statut = "m";
			}
			else if(nom.indexOf("rehzineu") != -1) {
				statut = "r";
			}

			p_ico_m(px, py, pn, statut, statut, i);
		}
	}
	} catch(e) { }
	//item
	var cat_obj = new Array(); cat_obj["Potion"]="p"; cat_obj["Composant"]="c"; cat_obj["Champignon"]="ch"; cat_obj["Armure"]="oa"; cat_obj["Arme (1 main)"]="oa1"; cat_obj["Arme (2 mains)"]="oa2"; cat_obj["Casque"]="oc"; cat_obj["Talisman"]="ot"; cat_obj["Bouclier"]="oe"; cat_obj["Bottes"]="ob"; cat_obj["Anneau"]="a"; cat_obj["Parchemin"]="e"; cat_obj["Carte"]="ca"; cat_obj["Minerai"]="m"; cat_obj["Outils"]="o"; cat_obj["Apocryphe du Phoenix"]="ap";
	for (var i=1;i<nb_o;i++) {
		px = parseInt(x_o[i].childNodes[3].firstChild.nodeValue);
		py = parseInt(x_o[i].childNodes[4].firstChild.nodeValue);
		pn = parseInt(x_o[i].childNodes[5].firstChild.nodeValue);
		if(px < xmin || px > xmax || py < ymin || py > ymax || pn < nmin || pn > nmax) continue;

		statut = "";
		if(x_o[i].getElementsByTagName("a").length == 0) {
			nom = trim(x_o[i].getElementsByTagName("b")[0].innerHTML);
			if(cat_obj[nom]) statut = cat_obj[nom];
			else if(nom.indexOf("Gigots de Gob") != -1) statut = "g";
			else if(nom.match(/Armure d'Anneaux|Armure de bois|Armure de cuir|Armure de peaux|Armure de pierre|Armure de plates|Cotte de Mailles|Cuir Bouilli|Cuirasse d'\u00e9cailles|Cuirasse d'Ossements|Culotte en Cuir|Fourrures|Haubert d'\u00e9cailles|Haubert de mailles|Pagne de Mailles|Pagne en Cuir|Robe de mage|Tunique d'\u00e9cailles/)) statut = "oa";
			else if(nom.match(/Boulet et cha\u00eene|Coutelas d'Obsidienne|Coutelas en os|Crochet|Dague|Ep\u00e9e Courte|Ep\u00e9e Longue|Fouet|Gantelet|Gourdin|Gourdin clout\u00e9|Grosse racine|Lame d'Obsidienne|Lame en os|Lame en pierre|Machette|Masse d'arme|Torche/)) statut = "oa1";
			else if(nom.match(/Baton Lest\u00e9|B\u00e2tons de Parade|Cha\u00eene Clout\u00e9e|Espadon|Grosse Stalagmite|Hache \u00e0 deux mains d'Obsidienne|Hache de Bataille|Hache de guerre en os|Hache de guerre en pierre|Hallebarde/)) statut = "oa2";
		}

		if(opt["spec_obj"]) statut2 = statut;
		p_ico_o(px, py, pn, statut2, statut, i);
	}
	//lieux
	for (var i=1;i<nb_l;i++) {
		px = parseInt(x_l[i].childNodes[3].firstChild.nodeValue);
		py = parseInt(x_l[i].childNodes[4].firstChild.nodeValue);
		pn = parseInt(x_l[i].childNodes[5].firstChild.nodeValue);
		if(px < xmin || px > xmax || py < ymin || py > ymax || pn < nmin || pn > nmax) continue;

		statut = ""; nom = x_l[i].childNodes[2].innerHTML;
		if(x_l[i].getElementsByTagName("a").length > 0) statut = "t";
		else if(nom.indexOf("Trou de M\u00e9t\u00e9orite") != -1) statut = "tm";
		else if(nom.indexOf("Portail de T\u00e9l\u00e9portation") != -1) statut = "p";
		else if(nom.indexOf("Sortie de Portail") != -1) statut = "s";
		else if(nom.indexOf("Gr\u00f4t\u00e0dne\u00efjh") != -1) statut = "g";
		else if(nom.indexOf("Gr\u00f4 R\u00e9hzine\u00fb") != -1) statut = "r";
		else if(nom.match(/Couvoir|Terrier|Cocon|Porte d'Outre-Monde|Nid|Portail D\u00e9moniaque/)) statut = "m";
		else if(nom.match(/Gowapier|Refuge|Forge|Agence d'Annonce|Boutique d'Enchantement|Cahute du R\u00e9mouleur|Lice|Armurerie|Source de Purification|Auberge|Mal\u00e9facterie|Marabouterie|Min\u00e9roll|S\u00e9pulcre|Bureau des Primes|T\u00e9l\u00e9porteur|Antre du tr\u00e9panateur/)) statut = "c";
		if(opt["spec_lieux"]) statut2 = statut;
		(document.getElementById("NS"+pn+"l")).appendChild(p_ico_b(px,py,pn,statut2,statut,i,3));
	}
	//champ
	for (var i=1;i<nb_c;i++) {
		px = parseInt(x_c[i].childNodes[2].firstChild.nodeValue);
		py = parseInt(x_c[i].childNodes[3].firstChild.nodeValue);
		pn = parseInt(x_c[i].childNodes[4].firstChild.nodeValue);
		if(px < xmin || px > xmax || py < ymin || py > ymax || pn < nmin || pn > nmax) continue;

		(document.getElementById("NS"+pn+"c")).appendChild(p_ico_b(px,py,pn,"","",i,4));
		nb_cr += parseInt(x_c[i].childNodes[1].firstChild.nodeValue);
	}
	compte["i_c"] = nb_cr;
	for (var i=1;i<nb_d;i++) {
		px = parseInt(x_d[i].childNodes[3].firstChild.nodeValue);
		py = parseInt(x_d[i].childNodes[4].firstChild.nodeValue);
		pn = parseInt(x_d[i].childNodes[5].firstChild.nodeValue);
		if(px < xmin || px > xmax || py < ymin || py > ymax || pn < nmin || pn > nmax) continue;

		(document.getElementById("NS"+pn+"d")).appendChild(p_ico_b(px,py,pn,"","",i,5));
	}
}
function calc_dim() {
	if(opt["style_niv"] == 0) {
		for(var i=nmin; i<=nmax; i++) {
			val_classe(classes["NS"+i]).top = "0px";
			val_classe(classes["NS"+i]).left = "0px";
		}
		larg = Math.floor(2.5*opt["ico"])+1;
		haut = Math.floor(2.5*opt["ico"])+1;
	}
	else if(opt["style_niv"] == 1) {
		nb_n_vus = 0;
		for(var i=nmax; i>=nmin; i--) {
			if(vu["S"+i]) {
				val_classe(classes["NS"+i]).top = (nb_n_vus*opt["ico"])+"px";
				val_classe(classes["NS"+i]).left = "0px";
				nb_n_vus++;
			}
		}
		nb_n_vus = Math.max(1, nb_n_vus);
		larg = compte["i_c"]? 5*opt["ico"]+1:4*opt["ico"]+1;
		haut = nb_n_vus*opt["ico"]+1;
	}
	else if(opt["style_niv"] == 2) {
		nb_n_vus = 0;
		for(var i=nmax; i>=nmin; i--) {
			if(vu["S"+i]) {
				val_classe(classes["NS"+i]).top = "0px";
				val_classe(classes["NS"+i]).left = (nb_n_vus*opt["ico"])+"px";
				nb_n_vus++;
			}
		}
		nb_n_vus = Math.max(1, nb_n_vus);
		larg = nb_n_vus*opt["ico"]+1;
		haut = compte["i_c"]? 5*opt["ico"]+1:4*opt["ico"]+1;
	}
	for (var i=xmin; i<=xmax; i++) {
		val_classe(classes["X"+i]).marginLeft = ((i-xmin)*larg)+"px";
	}
	for (var i=ymin; i<=ymax; i++) {
		val_classe(classes["Y"+i]).marginTop= ((ymax-i)*haut)+"px";
	}
	th = nbx*larg; tv= nby*haut;
	popup_vue.style.width = Math.max(th+decal_d+decal_g,173+76*v1,250)+"px";
	ancre.style.height = tv+decal_b+decal_h+"px";
	var masque = document.getElementById("masque");
	masque.style.width = th+"px";
	masque.style.height = tv+"px";

	val_classe(7).bottom = -(decal_h-2)+"px";
	val_classe(7).left = (decal_g+.5*larg-6)+"px";
	val_classe(8).right = -(decal_g-2)+"px";
	val_classe(8).top = (decal_h+.5*haut-6)+"px";
	val_classe(9).top = (decal_h+tv+2)+"px";
	val_classe(9).left = (decal_g+.5*larg-6)+"px";
	val_classe(10).left = (decal_g+th+2)+"px";
	val_classe(10).top = (decal_h+.5*haut-6)+"px";

	val_classe(1).top = (decal_h+1)+"px";
	val_classe(1).left =  (decal_g+1)+"px";
	val_classe(12).top = (decal_h)+"px";
	val_classe(12).left =  (decal_g)+"px";
	if(opt["style_niv"] == 0 || opt["style_niv"] == 4) {
		var demi = larg - opt["ico"], tiers = Math.floor(opt["ico"] * 0.75);
		val_classe(2).top = (decal_h+1)+"px";
		val_classe(2).left = (decal_g+demi)+"px";
		val_classe(11).top = (decal_h)+"px";
		val_classe(11).left = (decal_g+demi-1)+"px";
		val_classe(3).top = (decal_h+demi)+"px";
		val_classe(3).left = (decal_g+1)+"px";
		val_classe(4).top = (decal_h+demi)+"px";
		val_classe(4).left = (decal_g+demi)+"px";
		val_classe(5).top = (decal_h+tiers)+"px";
		val_classe(5).left = (decal_g+tiers)+"px";
	}
	else if(opt["style_niv"] == 1) {
		val_classe(2).top = (decal_h+1)+"px";
		val_classe(2).left = (decal_g+opt["ico"]+1)+"px";
		val_classe(11).top = (decal_h)+"px";
		val_classe(11).left = (decal_g+opt["ico"])+"px";
		val_classe(3).top = (decal_h+1)+"px";
		val_classe(3).left = (decal_g+2*opt["ico"]+1)+"px";
		val_classe(4).top = (decal_h+1)+"px";
		val_classe(4).left = (decal_g+3*opt["ico"]+1)+"px";
		val_classe(5).top = (decal_h+1)+"px";
		val_classe(5).left = (decal_g+4*opt["ico"]+1)+"px";
	}
	else {
		val_classe(2).top = (decal_h+opt["ico"]+1)+"px";
		val_classe(2).left = (decal_g+1)+"px";
		val_classe(11).top = (decal_h+opt["ico"])+"px";
		val_classe(11).left = (decal_g)+"px";
		val_classe(3).top = (decal_h+2*opt["ico"]+1)+"px";
		val_classe(3).left = (decal_g+1)+"px";
		val_classe(4).top = (decal_h+3*opt["ico"]+1)+"px";
		val_classe(4).left = (decal_g+1)+"px";
		val_classe(5).top = (decal_h+4*opt["ico"]+1)+"px";
		val_classe(5).left = (decal_g+1)+"px";
	}
	val_classe(6).top = val_classe(4).top;
	val_classe(6).left = val_classe(4).left;

	grille();
}
///////////////////////////////////////////////////////////////////////////
//Utilisation de la map

////////////////////////////////
//Affichage des info d'un case dans une infobox
function get_desc(cat,xx,yy,fonct) {
	if(coord[cat][xx] && coord[cat][xx][yy]) {
		for (var i in coord[cat][xx][yy]) {
			for (var j in coord[cat][xx][yy][i]) {
				var desc = document.createElement("div");
				desc.appendChild(illustr(coord[cat][xx][yy][i][j][1], "", ""));
				desc.firstChild.className = "icone_desc";
				fonct(desc, coord[cat][xx][yy][i][j][0]);
				descase[i].push(desc);
			}
		}
	}
}

function c_txt(xx,yy) {
	document.getElementById("bulle_desc").innerHTML = "";

	descase = new Array();
	for (var j=nmin;j<=nmax;j++) { descase[j]=new Array(); }
	get_desc(0,xx,yy,troll);
	get_desc(1,xx,yy,monst);
	get_desc(2,xx,yy,item);
	get_desc(3,xx,yy,lieu);
	get_desc(4,xx,yy,champ);
	get_desc(5,xx,yy,cenot);

	var i = 0;
	for (var j=nmax;j>=nmin;j--) {
		if (descase[j].length > 0 || opt["niv_vide"]) {
			var nvdiv = document.createElement("div");
			nvdiv.className = (i%2)? "bulle_desc_impair":"bulle_desc";
			nvdiv.id = "niveau_"+xx+"_"+yy+"_"+j;
			addEvent(nvdiv,"mouseover", function() { voir_action(this.id, true); }, true);
			addEvent(nvdiv,"mouseout", function() { voir_action(this.id, false); }, true);
			if(!vu["S"+j]) { nvdiv.className += " pas_vu"; }

			var nvspan = document.createElement("div");
			nvspan.className = (j==n1)? "meme_niv":"autre_niv";
			aj_texte(nvspan, "n = "+j+", distance : "+Math.max(Math.abs(xx-x1),Math.abs(yy-y1),Math.abs(j-n1))+" ");
			var sp_action = document.createElement("span");
			sp_action.className = "niv_action";
			var imag = illustr("centrer","Excentrer la vue","Excentrer");
			imag.className = "excentrer";
			addEvent(imag, "click", function() { excentrer(this.parentNode.parentNode.parentNode.id); }, true);
			sp_action.appendChild(imag);
			if(avec_tp) {
				var imag = illustr("tp","Ajouter une destination TP","TP");
				imag.className = "excentrer";
				addEvent(imag, "click", function() { aj_fav_typ("tp", this.parentNode.parentNode.parentNode.id); }, true);
				sp_action.appendChild(imag);
			}
			if(avec_gowap) {
				var imag = illustr("gow","Ajouter une destination gowap","Gowap");
				imag.className = "excentrer";
				addEvent(imag, "click", function() { aj_fav_typ("gow", this.parentNode.parentNode.parentNode.id); }, true);
				sp_action.appendChild(imag);
			}
			nvspan.appendChild(sp_action);
			nvdiv.appendChild(nvspan);

			var divdesc = document.createElement("div");
			for(var k in descase[j]) {
				divdesc.appendChild(descase[j][k]);
			}
			nvdiv.appendChild(divdesc);
			document.getElementById("bulle_desc").appendChild(nvdiv);
			i++;
		}
	}
}
function voir_action(ref, voir) {
	document.getElementById(ref).firstChild.getElementsByTagName("span")[0].style.visibility = voir? "visible":"hidden";
}
function cercle_img(couleur) {
	var imag = document.createElement("img");
	imag.className = "cercle_desc";
	imag.src = img_src("cercle"+couleur);
	return imag;
}
function troll(noeud, i) {
	var cell = x_t[i].childNodes;
	var j = (x_t[i].getElementsByTagName("input").length > 0)? [3, 6, 5, 4]:[2, 5, 4, 3];

	var nom = prepare_regexp(cell[j[0]].innerHTML);
	var guilde = prepare_regexp(cell[j[1]].innerHTML);
	if(opt["motif_tr"] && (nom.match(expreg["motif_tr"]) || guilde.match(expreg["motif_tr"]))) noeud.appendChild(cercle_img("r"));
	else if(opt["motif_tv"] && (nom.match(expreg["motif_tv"]) || guilde.match(expreg["motif_tv"]))) noeud.appendChild(cercle_img("v"));
	else if(opt["motif_tb"] && (nom.match(expreg["motif_tb"]) || guilde.match(expreg["motif_tb"]))) noeud.appendChild(cercle_img("b"));

	var elt = document.createElement("span");
	elt.innerHTML = "["+cell[1].innerHTML+"] "+cell[j[0]].innerHTML+" "+cell[j[1]].innerHTML+" "+cell[j[2]].innerHTML+" ";
	noeud.appendChild(elt);

	elt = document.createElement("span");
	elt.innerHTML = cell[j[3]].innerHTML;
	x_t[i].childNodes[j[3]].id = "niv_troll_"+i+"_i";
	elt.id = "niv_troll_"+i;
	addEvent(elt, "mouseover", function(event) { envoi_evt(this.id+"_i", event); }, true);
	addEvent(elt, "mouseout", function(event) { envoi_evt(this.id+"_i", event); }, true);
	noeud.appendChild(elt);

	if(x_t[i].getElementsByTagName("table").length > 0) noeud.appendChild(x_t[i].getElementsByTagName("table")[0].cloneNode(true));
}
function monst(noeud, i) {
	var cell = x_m[i].childNodes;

	var nom = (cell.length == 6)? cell[2]:cell[3];
	nom = prepare_regexp(nom.firstChild.innerHTML.split(" [")[0]);
	if(opt["motif_mr"] && nom.match(expreg["motif_mr"])) noeud.appendChild(cercle_img("r"));
	else if(opt["motif_mv"] && nom.match(expreg["motif_mv"])) noeud.appendChild(cercle_img("v"));
	else if(opt["motif_mb"] && nom.match(expreg["motif_mb"])) noeud.appendChild(cercle_img("b"));

	var elt = document.createElement("span");
	if(cell[1].style.color == "blue") {
		aj_texte(noeud, "[");
		elt.innerHTML = cell[1].innerHTML;
		elt.style.color = "blue"
		elt.id = "num_monst_"+cell[1].id;
		addEvent(elt, "mouseover", function(event) { envoi_evt(this.id.split("_")[2], event); }, true);
		addEvent(elt, "mouseout", function(event) { envoi_evt(this.id.split("_")[2], event); }, true);
		noeud.appendChild(elt);
		aj_texte(elt, "] ");
	}
	else {
		elt.innerHTML = "["+cell[1].innerHTML+"] ";
		noeud.appendChild(elt);
	}
	elt = document.createElement("span");
	if(cell[3].getElementsByTagName("a").length > 0) {
		elt.innerHTML = cell[3].innerHTML+" ";
		noeud.appendChild(elt);

		elt = document.createElement("span");
		elt.innerHTML = cell[2].innerHTML;
		elt.id = "niv_monst_"+i;
		elt.className = "clickable";
		x_m[i].childNodes[2].id = "niv_monst_"+i+"_i";
		addEvent(elt, "click", function(event) { envoi_evt(this.id+"_i", event); }, true);
		noeud.appendChild(elt);
	}
	else {
		elt.innerHTML = cell[2].innerHTML;
		noeud.appendChild(elt);
	}
	if(x_m[i].getElementsByTagName("table").length > 0) noeud.appendChild(x_m[i].getElementsByTagName("table")[0].cloneNode(true));
}
function lieu(noeud, i) {
	var cell = x_l[i].childNodes;
	noeud.innerHTML += "["+cell[1].innerHTML+"] "+cell[2].innerHTML;
}
function item(noeud, i) {
	var cell = x_o[i].childNodes;
	noeud.innerHTML += "["+cell[1].innerHTML+"] "+cell[2].innerHTML;
}
function champ(noeud, i) {
	noeud.innerHTML += x_c[i].childNodes[1].innerHTML;
}
function cenot(noeud, i) {
	var cell = x_d[i].childNodes;
	noeud.innerHTML += "["+cell[1].innerHTML+"] "+cell[2].innerHTML;
}
function excentrer(pt) {
	pt = pt.split("_");
	x1 = parseInt(pt[1]);
	y1 = parseInt(pt[2]);
	n1 = parseInt(pt[3]);

	if(x1 !== cold[0] || y1 != cold[1] || n1 != cold[2]) {
		h1 = Math.min(h1,vueh+Math.max(Math.abs(x1-posx),Math.abs(y1-posy)));
		v1 = Math.min(v1,vuev+Math.abs(n1-posn));
		ini_popup();
	}
}
function aj_fav_typ(typ, pt) {
	var x2, y2, n2;
	pt = pt.split("_");
	x2 = parseInt(pt[1]);
	y2 = parseInt(pt[2]);
	n2 = parseInt(pt[3]);

	var maintenant = new Date();
	if(!MZ_getValue("favori_"+typ)) {
		MZ_setValue("favori_"+typ, "vue-"+maintenant.getDate()+"-"+(maintenant.getMonth()+1)+"-"+maintenant.getFullYear()+"/"+x2+"/"+y2+"/"+n2+"/");
	}
	else {
		var texte = MZ_getValue("favori_"+typ);
		var param = texte.split("/");
		var nb_fav = Math.floor(param.length/4);
		if (param.length > 3) {
			for (var i=0; i<nb_fav; i++) {
				if(parseInt(param[4*i+1]) == x2 && parseInt(param[4*i+2]) == y2 && parseInt(param[4*i+3]) == n2) return;
			}
		}
		MZ_setValue("favori_"+typ, texte+"vue-"+maintenant.getDate()+"-"+(maintenant.getMonth()+1)+"-"+maintenant.getFullYear()+"/"+x2+"/"+y2+"/"+n2+"/");
	}
}
function centre_dist(pt, evt) {
	pt = pt.split("_");
	x1 = parseInt(pt[2]);
	y1 = parseInt(pt[3]);
	n1 = parseInt(pt[4]);

	if(x1 !== cold[0] || y1 !== cold[1] || n1 !== cold[2]) {
		if(!vue_cree) {
			h1 = Math.min(opt_val("h",vueh),vueh+Math.max(Math.abs(x1-posx),Math.abs(y1-posy)));
			v1 = Math.min(opt_val("v",vuev),vuev+Math.abs(n1-posn));
			creer_vue(); creer_bulle_vue(); poser_vue(evt); ini_popup(); init_evenement_v();
		}
		else {
			h1 = Math.min(h1,vueh+Math.max(Math.abs(x1-posx),Math.abs(y1-posy)));
			v1 = Math.min(v1,vuev+Math.abs(n1-posn));

			poser_vue(evt);
			ini_popup();
		}
	}
	else {
		poser_vue(evt);
	}
	document.getElementById("action_lieu").style.display = "none";
}
function autorun() {
	x1 = posx;
	y1 = posy;
	n1 = posn;
	h1 = Math.min(opt_val("h",vueh),vueh+Math.max(Math.abs(x1-posx),Math.abs(y1-posy)));
	v1 = Math.min(opt_val("v",vuev),vuev+Math.abs(n1-posn));
	var nvevt = document.createEvent("MouseEvents");
	nvevt.initMouseEvent("click", true, true, window, 0, 20, 20, 20, 20, false, false, false, false, 0, null);

	creer_vue(); creer_bulle_vue(); poser_vue(nvevt); ini_popup(); init_evenement_v();
	document.getElementById("action_lieu").style.display = "none";
}
////////////////////////////////
//Afficher/Effacer info
//selection des profondeurs
function etag() {
	if(opt["style_niv"]) return;
	var ref = this.id;
	(document.getElementById("N"+ref)).style.display= (vu[ref])? "none":"";
}
function etago() {
	if(opt["style_niv"]) return;
	var ref = this.id;
	(document.getElementById("N"+ref)).style.display= (vu[ref])? "":"none";
}
function etagc() {
	var ref = this.id;
	vu[ref] = !vu[ref];
	if (vu[ref]) {
		(document.getElementById("N"+ref)).style.display= "";
		(document.getElementById(ref)).className="niv";
	}
	else {
		(document.getElementById("N"+ref)).style.display= "none";
		(document.getElementById(ref)).className="niv_out";
	}
	if(opt["style_niv"]) calc_dim();
	actu_tous();
}
function alt_niv() {
	var tous = true;
	for (var j in vu) { tous &= vu[j]; }
	if (tous) {
		for (var j in vu) {
			vu[j] = false;
			(document.getElementById("N"+j)).style.display = "none";
			(document.getElementById(j)).className = "niv_out";
		}
		(document.getElementById("alt_niv")).className = "niv";
		(document.getElementById("alt_niv")).innerHTML = "Tous";
	}
	else {
		for (var j in vu) {
			vu[j] = true;
			(document.getElementById("N"+j)).style.display = "";
			(document.getElementById(j)).className = "niv";
		}
		(document.getElementById("alt_niv")).className = "niv_out";
		(document.getElementById("alt_niv")).innerHTML = "Aucun";
	}
	if(opt["style_niv"]) calc_dim();
}
function actu_tous() {
	var tous = true;
	for (var j in vu) { tous &= vu[j]; }
	if (tous) {
		(document.getElementById("alt_niv")).className = "niv_out";
		(document.getElementById("alt_niv")).innerHTML = "Aucun";
	}
	else {
		(document.getElementById("alt_niv")).className = "niv";
		(document.getElementById("alt_niv")).innerHTML = "Tous";
	}
	return tous;
}

//////////////////////
//options d'affichage
//creation des entrees
function aj_opt(ref,desc) {
	var nvspan = aligne();
	var choix = document.createElement("input");
	choix.id = ref;
	choix.type = "checkbox";
	choix.checked = opt[ref];
	choix.title = desc;
	var etik = document.createElement("label");
	etik.appendChild(illustr(ref,desc,desc));
	etik.htmlFor = ref;
	nvspan.appendChild(choix);
	nvspan.appendChild(etik);
	return nvspan;
}
function aj_opt_fptt(ref,desc) {
	var nvspan = aligne();
	var choix = document.createElement("input");
	choix.id = ref;
	choix.type = "checkbox";
	choix.checked = opt[ref];
	choix.title = desc;
	var etik = document.createElement("label");
	aj_texte(etik, desc);
	etik.htmlFor = ref;
	nvspan.appendChild(choix);
	nvspan.appendChild(etik);
	return nvspan;
}
function aj_opt_base(ref, desc, modif_opaq) {
	var sp = aj_opt(ref,desc);
	addEvent(sp.firstChild, "click", function() { alterne_ico(this.id,this.checked); }, true);
	addEvent(sp, "mouseover", function() { encadre(this.firstChild.id, true, modif_opaq); }, true);
	addEvent(sp, "mouseout",  function() { encadre(this.firstChild.id, false, modif_opaq); }, true);
	return sp;
}
function aj_option(texte,val) {
	var it = document.createElement("option");
	it.value = val;
	aj_texte(it, texte);
	return it;
}
function aj_spec_obj() {
	var sp = aj_opt_fptt("spec_obj","Objets");
	addEvent(sp.firstChild, "click", specifier_obj, true);
	return sp;
}
function aj_spec_lieux() {
	var sp = aj_opt_fptt("spec_lieux","Lieux");
	addEvent(sp.firstChild, "click", specifier_lieux, true);
	return sp;
}
function aj_entree(ref,val) {
	var entree = document.createElement("input");
	entree.id = ref;
	entree.name = ref;
	entree.className = "TextboxV2";
	entree.size = "5";
	entree.value = val;
	return entree;
}
function aj_alterne_ico(ref, desc, noeud) {
	if(compte[ref] > 0) {
		noeud.appendChild(aj_opt_base(ref,desc+" ("+compte[ref]+")",true));
	}
	return compte[ref];
}
function aj_alterne_ico_oqp(ref, desc, noeud) {
	if(compte[ref] > 0) {
		noeud.appendChild(aj_opt_base(ref,desc+" ("+compte[ref]+")",false));
	}
	return compte[ref];
}
function aj_alterne_cat(cat,noeud,nb,desc) {
	var lst = ["i_tn", "i_m", "i_o", "i_l"];
	var imag = illustr(lst[cat],"Tout cocher/d\u00e9cocher ("+nb+" "+desc+")","Tout cocher/d\u00e9cocher ("+nb+" "+desc+")");
	imag.id = "altcat_"+cat;
	addEvent(imag, "click", function() { alterne_cat(this.id) }, true);
	imag.className = "img_click";
	noeud.appendChild(imag);
}
//creation des options
function creer_opt() {
	var opt_vue = document.getElementById("opt_vue");
	opt_vue.innerHTML = "";
	var i = 0, nb_cat = 0;
	if(nb_t > 1) {
		spanchoix = document.createElement("span");
		spanchoix.className = (i%2)? "gp_choix_impair":"gp_choix";
		var lst = [["a","Tr\u00f5lls alli\u00e9s"],["p","Guilde"],["n","Tr\u00f5lls neutres"],["e","Tr\u00f5lls ennemis"],["i","Tr\u00f5lls intangibles"]];
		for(var j in lst) {
			nb_cat += aj_alterne_ico("i_t"+lst[j][0], lst[j][1], spanchoix);
		}
		if(spanchoix.childNodes.length > 1) { aj_alterne_cat(0, spanchoix, nb_cat, "tr\u00f5lls"); }

		opt_vue.appendChild(spanchoix);
		espacer(opt_vue);
		i++;
	}
	if(nb_m > 1) {
		nb_cat = 0;
		spanchoix = document.createElement("span");
		spanchoix.className = (i%2)? "gp_choix_impair":"gp_choix";
		nb_cat += aj_alterne_ico("i_m", "Monstres", spanchoix);
		nb_cat += aj_alterne_ico("i_mg", "Gowaps Apprivois\u00e9s", spanchoix);
		nb_cat += aj_alterne_ico("i_mm", "Gowaps Malades", spanchoix);
		nb_cat += aj_alterne_ico("i_mr", "R\u00e9hzine\u00fbx", spanchoix);
		aj_alterne_ico_oqp("i_moqp", "Monstres occup\u00e9s", spanchoix);
		if(spanchoix.childNodes.length > 1) { aj_alterne_cat(1, spanchoix, nb_cat, "monstres"); }
		opt_vue.appendChild(spanchoix);
		espacer(opt_vue);
		i++;
	}
	if(nb_o > 1) {
		nb_cat = 0;
		spanchoix = document.createElement("span");
		spanchoix.className = (i%2)? "gp_choix_impair":"gp_choix";
		lst = [["a","Anneau"],["ap","Apocryphe du Phoenix"],["ca","Carte"],["ch","Champignons"],["c","Composants"],["oa1","Arme \u00e0 1 main"],["oa2","Arme \u00e0 2 mains"],["oa","Armure"],["ob","Bottes"],["oe","Bouclier"],["oc","Casque"],["ot","Talisman"],["g","Gigots de gob"],["o","Outils"],["m","Minerais"],["e","Parchemins"],["p","Potions"],["","Objets Divers"]];
		for(var j in lst) {
			nb_cat += aj_alterne_ico("i_o"+lst[j][0], lst[j][1], spanchoix);
		}
		aj_alterne_ico_oqp("i_ooqp", "Tr\u00e9sors occup\u00e9s", spanchoix);

		if(spanchoix.childNodes.length > 1) { aj_alterne_cat(2, spanchoix, nb_cat, "tr\u00e9sors"); }

		opt_vue.appendChild(spanchoix);
		espacer(opt_vue);
		i++;
	}
	if(nb_c > 1) {
		spanchoix = document.createElement("span");
		spanchoix.className = (i%2)? "gp_choix_impair":"gp_choix";
		aj_alterne_ico("i_c", "Champignons", spanchoix);
		opt_vue.appendChild(spanchoix);
		espacer(opt_vue);
		i++;
	}
	if(nb_l > 1) {
		nb_cat = 0;
		spanchoix = document.createElement("span");
		spanchoix.className = (i%2)? "gp_choix_impair":"gp_choix";
		lst = [["t","Tani\u00e8res"],["tm","Trous de m\u00e9t\u00e9orites"],["p","Portails de T\u00e9l\u00e9portation"],["s","Sorties de Portail"],["c","Services"],["m","Nids de monstre"],["g","Gr\u00f4t\u00e0dne\u00efjh"],["r","Gr\u00f4 R\u00e9hzine\u00fbde N'hoy\u00ebl"],["","Divers"]];
		if(parNom("i_l").length < nb_l-1) {
			for(var j in lst) {
				nb_cat += aj_alterne_ico("i_l"+lst[j][0], lst[j][1], spanchoix);
			}
		}
		if(spanchoix.childNodes.length > 1) { aj_alterne_cat(3, spanchoix, nb_cat, "lieux"); }

		opt_vue.appendChild(spanchoix);
		espacer(opt_vue);
		i++;
	}
	if(nb_d > 1) {
		spanchoix = document.createElement("span");
		spanchoix.className = (i%2)? "gp_choix_impair":"gp_choix";
		aj_alterne_ico("i_d", "Ce\u00e9notaphes", spanchoix);
		opt_vue.appendChild(spanchoix);
		espacer(opt_vue);
		i++;
	}

	opt_crees = true;
	if(ie) {
		etik = ["i_ta","i_tp","i_tn","i_te","i_ti","i_m","i_mg","i_moqp","i_d","i_oc","i_ooa","i_ooa1","i_ooa2","i_oob","i_ooc","i_ooe","i_oot","i_og","i_oe","i_op","i_o","i_ooqp","i_c","i_om","i_oa","i_oca","i_l","i_lt","i_lp","i_ls","i_ltm","i_lc","i_lm","spec_obj","spec_lieux","ouvre_dist","opaque"];
		for(var j in etik) {
			if(document.getElementById(etik[j])) document.getElementById(etik[j]).checked = opt[etik[j]];
		}
	}
}
function creer_opt_spe() {
	var divchoix = document.createElement("div");
	divchoix.className = "gp_choix";
	aj_texte(divchoix, "Ic\u00f4nes\u00a0sp\u00e9cifiques\u00a0:\u00a0");
	divchoix.appendChild(aj_spec_obj());
	divchoix.appendChild(aj_spec_lieux());
	opt_vue_spe.appendChild(divchoix);

	divchoix = document.createElement("div");
	divchoix.className = "gp_choix";
	var sp = aj_opt_fptt("autorun","Lancer à l'ouverture de la page");
	addEvent(sp.firstChild, "click", opt_autorun, true);
	divchoix.appendChild(sp);
	opt_vue_spe.appendChild(divchoix);

	divchoix = document.createElement("div");
	divchoix.className = "gp_choix";
	var sp = aj_opt_fptt("niv_vide","Afficher\u00a0niveaux\u00a0vides");
	addEvent(sp.firstChild, "click", alt_niv_vide, true);
	divchoix.appendChild(sp);
	opt_vue_spe.appendChild(divchoix);

	divchoix = document.createElement("div");
	divchoix.className = "gp_choix";
	aj_texte(divchoix, "Affichage\u00a0des\u00a0niveaux\u00a0:\u00a0");
	var choix = document.createElement("select");
	choix.appendChild(aj_option("Superpos\u00e9s","0"));
	choix.appendChild(aj_option("D\u00e9calage vertical","1"));
	choix.appendChild(aj_option("D\u00e9calage horizontal","2"));
	addEvent(choix, "keyup", function() { change_aff_niv(this.value); }, true);
	addEvent(choix, "change", function() { change_aff_niv(this.value); }, true);
	choix.value = opt["style_niv"];
	divchoix.appendChild(choix);
	opt_vue_spe.appendChild(divchoix);

	divchoix = document.createElement("div");
	divchoix.className = "gp_choix";
	aj_texte(divchoix, "Monstres : ");
	divchoix.appendChild(creer_recherche("m", "r")); espacer(divchoix);
	divchoix.appendChild(creer_recherche("m", "v")); espacer(divchoix);
	divchoix.appendChild(creer_recherche("m", "b")); espacer(divchoix);
	opt_vue_spe.appendChild(divchoix);
	divchoix = document.createElement("div");
	divchoix.className = "gp_choix";
	aj_texte(divchoix, "Trolls : ");
	divchoix.appendChild(creer_recherche("t", "r")); espacer(divchoix);
	divchoix.appendChild(creer_recherche("t", "v")); espacer(divchoix);
	divchoix.appendChild(creer_recherche("t", "b")); espacer(divchoix);
	opt_vue_spe.appendChild(divchoix);

	divchoix = document.createElement("div");
	divchoix.className = "gp_choix";
	aj_texte(divchoix, "Ressources\u00a0:\u00a0");
	var choix = aj_entree("opt_pack", pack);
	addEvent(choix, "keyup", function() { regle_chemin(this.value); }, true);
	addEvent(choix, "change", function() { regle_chemin(this.value); }, true);
	choix.size = "40";
	divchoix.appendChild(choix);
	opt_vue_spe.appendChild(divchoix);

	divchoix = document.createElement("div");
	divchoix.id = "o_opaque";
	espacer(divchoix);
	divchoix.className = "gp_choix";
	divchoix.appendChild(insert_texte("Opacit\u00e9\u00a0des\u00a0ic\u00f4nes\u00a0:\u00a0"));
	divchoix.appendChild(creer_glissiere("opacite"));
	divchoix.appendChild(insert_texte("\u00a0"));
	choix = aj_entree("opt_opaque", opt["opaque"]);
	addEvent(choix, "keyup", function() { alterne_opaque(this.value); }, true);
	addEvent(choix, "change", function() { alterne_opaque(this.value); }, true);
	divchoix.appendChild(choix);
	divchoix.appendChild(insert_texte("\u00a0%"));
	opt_vue_spe.appendChild(divchoix);

	divchoix = document.createElement("div");
	divchoix.id = "o_taille";
	espacer(divchoix);
	divchoix.className = "gp_choix";
	divchoix.appendChild(insert_texte("Taille\u00a0des\u00a0ic\u00f4nes\u00a0:\u00a0"));
	divchoix.appendChild(creer_glissiere("ico"));
	divchoix.appendChild(insert_texte("\u00a0"));
	choix = aj_entree("opt_taille_ico", opt["ico"]);
	addEvent(choix, "keyup", function() { regle_taille(this.value); }, true);
	addEvent(choix, "change", function() { regle_taille(this.value); }, true);
	divchoix.appendChild(choix);
	divchoix.	appendChild(insert_texte("\u00a0px\u00a0"));

	divchoix.appendChild(insert_texte("\u00a0"));
	var actu = illustr("actu", "Actualiser l'affichage", "Actualiser");
	var raz = illustr("raz", "Remise a z\u00e9ro", "RAZ");
	actu.id = "actu";
	actu.className = "a_cliquer";
	raz.className = "a_cliquer";
	addEvent(actu, "click", actu_param, true);
	addEvent(raz, "click", raz_param, true);
	divchoix.appendChild(raz);
	divchoix.appendChild(actu);
	opt_vue_spe.appendChild(divchoix);

	ex_ico(opt["ico"]);
	positionne_curseur("opacite", opt["opaque"]);
}
//actions des options
function creer_recherche(cat, couleur) {
	var spanchoix = document.createElement("span");
	var imag = document.createElement("img");
	imag.src = img_src("cercle"+couleur);
	spanchoix.appendChild(imag);
	var choix = aj_entree("recheche_"+cat+"_"+couleur, opt["motif_"+cat+couleur]);
	addEvent(choix, "keyup", actu_recherche, true);
	addEvent(choix, "change", actu_recherche, true);
	choix.size = "20";
	spanchoix.appendChild(choix);
	return spanchoix;
}
function actu_recherche() {
	var ref = this.id.split("_");
	var motif = this.value;
	if(motif) {
		motif = motif.replace("/","");
	}
	if(motif != opt["motif_"+ref[1]+ref[2]]){
		opt["motif_"+ref[1]+ref[2]] = motif;
		expreg["motif_"+ref[1]+ref[2]] = new RegExp(prepare_regexp(motif));
		if(ref[1] == "m") {
			cherche_motif_m(motif, ref[2])
		}
		else {
			cherche_motif_t(motif, ref[2])
		}
		sauver_opt();
	}
}

function creer_glissiere(ref) {
	var glissiere = document.createElement("div");
	glissiere.className = "glissiere";
	glissiere_fond = bloc("glissiere_opt_"+ref);
	addEvent(glissiere_fond , "click", function(evt) { click_glissiere(this.id,evt); }, true);
	glissiere_fond.innerHTML = " ";
	glissiere_fond.className = "glissiere_fond";
	glissiere.appendChild(glissiere_fond);
	var curseur = bloc("curseur_opt_"+ref);
	curseur.innerHTML = " ";
	curseur.className = "curseur";
	glissiere.appendChild(curseur);
	return glissiere;
}
function alterne_ico(ref,coche) {
	opt[ref] = coche;
	if(opt_crees) sauver_opt();
	val_classe(classes[ref]).display = coche? "inline":"none";
}
function alterne_cat(cat) {
	cat = parseInt(cat.split("_")[1]);
	var lst = [["i_ta","i_tp","i_tn","i_te","i_ti"], ["i_m","i_mg","i_mm","i_mr"], ["i_oc","i_och","i_oob","i_og","i_oe","i_op","i_o","i_om","i_ooa","i_ooa1","i_ooa2","i_ooc","i_ooe","i_oot","i_oa","i_oca","i_oo","i_oap"], ["i_l","i_lt","i_lp","i_ls","i_ltm","i_lc","i_lm","i_lr","i_lg"]];
	var tous = true;
	for (var i in lst[cat]) {
		if (compte[lst[cat][i]]) {
			tous &= opt[lst[cat][i]];
		}
	}

	tous = !tous;
	var coche = tous? "inline":"none";
	for (var i in lst[cat]) {
		if (compte[lst[cat][i]] && opt[lst[cat][i]] != tous) {
			opt[lst[cat][i]] = tous;
			val_classe(classes[lst[cat][i]]).display = coche;
			document.getElementById(lst[cat][i]).checked = tous;
		}
	}
	sauver_opt();
}
function encadre(ref, dessus,modif_opaq) {
	if (dessus) {
		val_classe(classes[ref]).zIndex = "630";
		if (modif_opaq) style_opaque(val_classe(classes[ref]), 100);
		val_classe(classes[ref]).display = "inline";
	}
	else {
		val_classe(classes[ref]).zIndex = "620";
		if (modif_opaq) style_opaque(val_classe(classes[ref]), opt["opaque"]);
		val_classe(classes[ref]).display = opt[ref]? "inline":"none";
	}
}
function specifier_lieux() {
	opt["spec_lieux"] = this.checked;
	sauver_opt();
	var lst_etik = ["t","tm","p","s","c","m","r","s",""];
	if(opt["spec_lieux"]) {
		for(var j in lst_etik) {
			lst = parNom("i_l"+lst_etik[j]);
			for(var i in lst) { lst[i].src = img_src("i_l"+lst_etik[j]); }
		}
	}
	else {
		for(var j in lst_etik) {
			lst = parNom("i_l"+lst_etik[j]);
			for(var i in lst) { lst[i].src = img_src("i_l"); }
		}
	}
}
function alt_niv_vide() {
	opt["niv_vide"] = this.checked;
	sauver_opt();
}
function opt_autorun() {
	opt["autorun"] = this.checked;
	sauver_opt();
}
function specifier_obj() {
	opt["spec_obj"] = this.checked;
	sauver_opt();
	var lst_etik = ["c","oa","oa1","oa2","ob","oc","oe","ot","g","e","p","m","ch","ca","a","o","","ap"];
	if(opt["spec_obj"]) {
		for(var j in lst_etik) {
			lst = parNom("i_o"+lst_etik[j]);
			for(var i in lst) { lst[i].src = img_src("i_o"+lst_etik[j]); }
		}
	}
	else {
		for(var j in lst_etik) {
			lst = parNom("i_o"+lst_etik[j]);
			for(var i in lst) { lst[i].src = img_src("i_o"); }
		}
	}
}
function change_aff_niv(val) {
	opt["style_niv"] = val;
	sauver_opt();
	calc_dim();
}
function regle_taille(valeur) {
	valeur = (isNaN(valeur))? 12:parseInt(valeur);
	if(valeur != opt["ico"]) {
		opt["ico"] = valeur;
		sauver_opt();
		positionne_curseur("ico",Math.floor(100.0*(parseFloat(valeur)-5.0)/45.0));
		val_classe(0).width = valeur+"px";
		val_classe(0).height = valeur+"px";
		val_classe(13).width = (opt["ico"]+2)+"px";
		val_classe(13).height = (opt["ico"]+2)+"px";
		val_classe(14).marginRight = -(opt["ico"]+1)+"px";
		val_classe(14).left = -(opt["ico"]+1)+"px";
		calc_dim();
	}
}
function ex_ico(val) {
	positionne_curseur("ico",Math.floor(100.0*(parseFloat(val)-5.0)/45.0));
}
function regle_chemin(valeur) {
	if(valeur && trim(valeur)) {
		if(trim(valeur) != pack) {
			document.getElementById("actu").src = definir_chemin(trim(valeur))+"actu.png";
		}
	}
	else {
		document.getElementById("actu").src = data_img["actu"];
	}
}
function alterne_opaque(opacite) {
	opacite = (isNaN(opacite))? 25:Math.min(100,Math.max(0,parseInt(opacite)));

	if(opt["opaque"] == opacite) return;
	opt["opaque"] = opacite;
	sauver_opt();
	positionne_curseur("opacite",opacite);
	applique_opacite();
}
function click_glissiere(ref,evt ) {
		if (evt.offsetX) {
			xpage = evt.offsetX;
		}
		else {
			xpage = evt.layerX;
		}
		xpage = Math.min(100,Math.max(0,xpage));
		ref = ref.split("_")[2];
		valeur_curseur(ref, xpage);
}
function valeur_curseur(ref,valeur) {
	if(ref == "opacite") {
		set_opt("opt_opaque",valeur);
		alterne_opaque(valeur);
	}
	else {
		valeur = 5+Math.floor(valeur/100.0*45.0);
		set_opt("opt_taille_ico",valeur);
		regle_taille(valeur);
	}
}
function actu_param() {
	var pack2 = trim(get_opt("opt_pack"));
	if(pack != pack2) {
		applique_chemin(pack2);
		ini_popup();
	}
}
function raz_param() {
	var refaire = false;
	if(opt["ico"] != 12) {
		refaire = true;
		opt["ico"] = 12;
		sauver_opt();
		set_opt("opt_taille_ico",12);
		ex_ico(12);
	}
	if(pack != "") {
		refaire = true;
		applique_chemin("");
		set_opt("opt_pack",pack);
	}
	if(refaire) ini_popup();
}
function applique_chemin(val) {
	pack = val;
	chemin = definir_chemin(val);
	MZ_setValue("FELDSPATATRAC_CHEMIN", val);
	if (chemin) {
		document.getElementById("fichier_style").href = chemin+"fptt.css";
		document.getElementById("inline_style").firstChild.nodeValue = "";
	}
	else {
		document.getElementById("fichier_style").href = "";
		document.getElementById("inline_style").firstChild.nodeValue = data_css;
	}
}
function positionne_curseur(ref,valeur) {
	document.getElementById("curseur_opt_"+ref).style.left = Math.min(Math.max(0,valeur),100)+"px";
}
function definir_chemin(chaine) {
	if(trim(chaine)) {
		if(chaine.toLowerCase().indexOf("http://") == 0) { chem = trim(chaine); }
		else { chem = trim("file://"+chaine.replace(/\\/g,"/")); }
		if(chem.substr(chem.length-1,1) != "/") chem +="/";
		return chem;
	}
	return "";
}
function applique_opacite() {
	var ligne = 15;
	for (var i in liste_ico) {
		style_opaque(val_classe(ligne), opt["opaque"]);
		ligne++;
	}
}
function ini_css() {
	//styles fixes
	var newcss = document.createElement("link");
	newcss.rel = "stylesheet";
	newcss.type = "text/css";
	newcss.id = "fichier_style";
	var newstyle = document.createElement("style");
	newstyle.type = "text/css";
	newstyle.id = "inline_style";
	if(chemin) {
		newcss.href = chemin+"fptt.css";
		aj_texte(newstyle, "");
	}
	else {
		aj_texte(newstyle, data_css);
	}
	document.getElementsByTagName("head")[0].appendChild(newcss);
	document.getElementsByTagName("head")[0].appendChild(newstyle);

	//styles dynamiques
	var styl = document.createElement("style");
	styl.id = "style_fptt";
	styl.type = "text/css";
	document.getElementsByTagName("head")[0].appendChild(styl);

	feuille_css = ie? document.styleSheets["style_fptt"]:document.getElementById("style_fptt").sheet;
	var opa = ie? "filter: alpha(opacity="+opt["opaque"]+")":"opacity: "+(parseFloat(opt["opaque"])/100.0);

	aj_regle(".icone, .icone_desc", "width : "+opt["ico"]+"px; height : "+opt["ico"]+"px;", 0);
	aj_regle(".couche_t", "", 1);
	aj_regle(".couche_m", "", 2);
	aj_regle(".couche_o", "", 3);
	aj_regle(".couche_l", "", 4);
	aj_regle(".couche_c", "", 5);
	aj_regle(".couche_d", "", 6);
	aj_regle(".th", "position:absolute;", 7);
	aj_regle(".tg", "position:absolute;", 8);
	aj_regle(".tb", "position:absolute;", 9);
	aj_regle(".td", "position:absolute;", 10);
	aj_regle(".couche_smr, .couche_smv, .couche_smb", "", 11);
	aj_regle(".couche_str, .couche_stv, .couche_stb", "", 12);
	aj_regle(".cercle, .cercle_desc", "width : "+(opt["ico"]+2)+"px; height : "+(opt["ico"]+2)+"px;", 13);
	aj_regle(".cercle_desc", "margin-right: -"+(opt["ico"]+1)+"px; left: -"+(opt["ico"]+1)+"px;", 14);
	var ligne = 15;
	for (var i in liste_ico) {
		aj_regle("."+liste_ico[i], opa+"; display:"+(opt[liste_ico[i]]? "inline":"none")+";", ligne);
		classes[liste_ico[i]] = ligne;
		ligne++;
	}
	aj_regle(".i_moqp", "display:"+(opt["i_moqp"]? "inline":"none")+";", ligne);
	classes["i_moqp"] = ligne;
	ligne++;
	aj_regle(".i_ooqp", "display:"+(opt["i_ooqp"]? "inline":"none")+";", ligne);
	classes["i_ooqp"] = ligne;
	ligne++;

	inf = posn-2*vuev; sup = Math.min(0,posn+2*vuev)+1;
	for (var i=inf;i<sup;i++) {
		aj_regle("#NS"+i, "position:absolute;", ligne);
		classes["NS"+i] = ligne;
		ligne++;
	}
	inf = posx-2*vueh; sup = posx+2*vueh+1;
	for (var i=inf;i<sup;i++) {
		aj_regle(".X"+i, "", ligne);
		classes["X"+i] = ligne;
		ligne++;
	}
	inf = posy-2*vueh; sup = posy+2*vueh+1;
	for (var i=inf;i<sup;i++) {
		aj_regle(".Y"+i, "", ligne);
		classes["Y"+i] = ligne;
		ligne++;
	}
	if (ie) {
		aj_regle(".case", "", ligne);
		classes["case"] = ligne;
	}
}
///////////
//Popup Vue
function afficher_vue(evt) {
	x1 = opt_val("x",posx);
	y1 = opt_val("y",posy);
	n1 = opt_val("n",posn);
	if (x1 < posx-vueh) x1 = posx-vueh;
	if (x1 > posx+vueh) x1 = posx+vueh;
	if (y1 > posy+vueh) y1 = posy+vueh;
	if (y1 < posy-vueh) y1 = posy-vueh;
	if (n1 < posn-vuev) n1 = posn-vuev;
	if (n1 > posn+vuev) n1 = posn+vuev;
	opt["h"] = opt_val("h",vueh); opt["v"]= opt_val("v",vuev); sauver_opt();
	h1 = Math.min(opt["h"],vueh+Math.max(Math.abs(x1-posx),Math.abs(y1-posy)));
	v1 = Math.min(opt["v"],vuev+Math.abs(n1-posn));

	if(!vue_cree) {
		creer_vue(); creer_bulle_vue(); poser_vue(evt); ini_popup(); init_evenement_v();
	}
	else if(x1 !== cold[0] || y1 != cold[1] || n1 != cold[2] || h1 != cold[3] || v1 != cold[4]) {
		poser_vue(evt); ini_popup();
		popup_vue.style.display = "";
	}
	else {
		popup_vue.style.display = "";
		document.getElementById("contenu_vue").style.display = "";
	}
	if(vue_reduite) alterner_voir();
}
function creer_vue() {
	//Creation de la popup
	pu_vue = bloc("popup_vue");

	var mobile_vue = bloc("mobile_vue");
	var reduc = illustr("moins","Reduire la vue","Reduire");
	addEvent(reduc, "click", alterner_voir, true);
	reduc.id = "reduire_vue";
	var fermer = illustr("fermer","Fermer la vue","Fermer");
	addEvent(fermer, "click", cacher_vue, true);
	fermer.id = "fermer_vue";
	var param = illustr("param","Param\u00e8tres avanc\u00e9s","Param\u00e8tres");
	addEvent(param, "click", alterne_param, true);
	param.id = "param_vue";
	var fixer = illustr("bouge","Fixer la vue","Fixation");
	addEvent(fixer, "click", alterne_static, true);
	var recentrer = illustr("centrer","Recentrer la vue","Recentrer");
	addEvent(recentrer, "click",  function() { excentrer("centre_"+posx+"_"+posy+"_"+posn); }, true);
	fixer.id = "fixer_vue";
	recentrer.id = "recentrer";
	mobile_vue.appendChild(reduc);
	mobile_vue.appendChild(enligne("titre_vue"));
	mobile_vue.appendChild(fermer);
	mobile_vue.appendChild(param);
	mobile_vue.appendChild(fixer);
	mobile_vue.appendChild(recentrer);

	var contenu = bloc("contenu_vue");
	contenu.className = "mh_tdpage";
	contenu.appendChild(bloc("selecteur"));
	contenu.appendChild(bloc("opt_vue"));
	var formulaire = document.createElement("form");
	formulaire.id = "opt_vue_spe";
	formulaire.name = "opt_vue_spe";
	formulaire.action = "";
	contenu.appendChild(formulaire);
	contenu.appendChild(bloc("ancre"));

	contenu.appendChild(enligne("chrono"));

	pu_vue.appendChild(mobile_vue);
	pu_vue.appendChild(contenu);
	corps_page.appendChild(pu_vue);

	popup_vue = document.getElementById("popup_vue");
	ancre = document.getElementById("ancre");
	opt_vue_spe = document.getElementById("opt_vue_spe");
	if(!opt["opt_spe"]) { opt_vue_spe.style.display = "none"; }
	creer_opt_spe();
	vue_cree = true;
}
function poser_vue(evt) {
	var ty = (evt.pageY)? evt.pageY:(evt.clientY + document.body.scrollTop);
	if (statique) {
		statique = false;
		popup_vue.style.position = "absolute";
		document.getElementById("fixer_vue").src = img_src("bouge");
	}
	popup_vue.style.top = (ty+10)+"px";
	popup_vue.style.left = gauche_vue+"px";
	popup_vue.style.display = "";
}
function cacher_vue() {
	popup_vue.style.display = "none";
}
function ini_style_popup() {
	val_classe(0).width = opt["ico"]+"px";
	val_classe(0).height = opt["ico"]+"px";
	val_classe(13).width = (opt["ico"]+2)+"px";
	val_classe(13).height = (opt["ico"]+2)+"px";
	val_classe(14).marginRight = -(opt["ico"]+1)+"px";
	val_classe(14).left = -(opt["ico"]+1)+"px";
	if(ie) {
		val_classe(classes["case"]).width = (larg+1)+"px";
		val_classe(classes["case"]).height = (haut+1)+"px";
	}
}
function ini_popup() {
	depart();
	avec_tp = (document.getElementById("avec_tp"))? true:false;
	avec_gowap = (document.getElementById("avec_gowap"))? true:false;

	for (var i in liste_ico) {
		compte[liste_ico[i]] = 0;
	}
	compte["i_moqp"] = 0;
	compte["i_ooqp"] = 0;

	ancre.innerHTML = "";
	ini_style_popup();

	bulle_vue.style.visibility = "hidden";
	fixe = false;

	coord = new Array(); oqp = new Array();

	xmin = Math.max(x1-h1, posx-vueh); xmax = Math.min(x1+h1, posx+vueh); nbx = xmax-xmin+1;
	ymin = Math.max(y1-h1, posy-vueh); ymax = Math.min(y1+h1, posy+vueh); nby = ymax-ymin+1;
	nmin = Math.max(n1-v1, posn-vuev); nmax = Math.min(n1+v1, posn+vuev, 0);

	vu = new Array();
	for (var j=nmin;j<=nmax;j++) {
		vu["S"+j] = true;
	}

	document.getElementById("titre_vue").innerHTML = "Vue X="+x1+", Y="+y1+", N="+n1+" ("+h1+"/"+v1+")";
	dh = decal_g+h1*larg; dv = decal_h+h1*haut;
	cold = [x1, y1, n1, h1, v1];

	niveaux(); creer_grille(); icones(); init_overlay(); calc_dim(); creer_opt(); ini_cherche();
	document.getElementById("recentrer").style.display = (x1 != posx || y1 != posy || n1 != posn)? "":"none";
	document.getElementById("contenu_vue").style.display="";
	document.getElementById("reduire_vue").src=img_src("moins");
	sauver_opt();
	fin();
}
function alterner_voir() {
	vue_reduite = !vue_reduite;
	if(vue_reduite) {
		document.getElementById("contenu_vue").style.display="none";
		bulle_vue.style.display="none";
		document.getElementById("reduire_vue").src=img_src("plus");
	}
	else {
		document.getElementById("contenu_vue").style.display="";
		document.getElementById("reduire_vue").src=img_src("moins");
	}
}
function alterne_param() {
	opt["opt_spe"] = !opt["opt_spe"];
	sauver_opt();
	opt_vue_spe.style.display = (opt["opt_spe"])? "":"none";
}
function depart() {
	chrono = (new Date()).getTime();
}
function fin() {
	var temps = (new Date()).getTime()-chrono;
	var minutes = Math.floor(temps/60000.0);
	temps = (temps % 60000)/1000.0;
	document.getElementById("chrono").innerHTML = (minutes? minutes+"mn ":"")+String(temps).replace(/\./,",")+"s";
}
function ini_cherche() {
	if(opt["motif_mr"]) cherche_motif_m(opt["motif_mr"], "r");
	if(opt["motif_mv"]) cherche_motif_m(opt["motif_mv"], "v");
	if(opt["motif_mb"]) cherche_motif_m(opt["motif_mb"], "b");
	if(opt["motif_tr"]) cherche_motif_t(opt["motif_tr"], "r");
	if(opt["motif_tv"]) cherche_motif_t(opt["motif_tv"], "v");
	if(opt["motif_tb"]) cherche_motif_t(opt["motif_tb"], "b");
}
function cherche_motif_m(motif, couleur) {
	for(var i=nmin; i<=nmax; i++) {
		document.getElementById("NS"+i+"sm"+couleur).innerHTML = "";
	}
	if(motif) {
		motif = new RegExp(prepare_regexp(motif));
		for(var i in l_m) {
			if(i.match(motif)) {
				for (var j in l_m[i]) {
					var imag=document.createElement("img");
					imag.className = "cercle  X"+l_m[i][j][0]+" Y"+l_m[i][j][1];
					imag.src= img_src("cercle"+couleur);
					imag.alt="";
					(document.getElementById("NS"+l_m[i][j][2]+"sm"+couleur)).appendChild(imag);
				}
			}
		}
	}
}
function cherche_motif_t(motif, couleur) {
	for(var i=nmin; i<=nmax; i++) {
		document.getElementById("NS"+i+"st"+couleur).innerHTML = "";
	}
	if(motif) {
		motif = new RegExp(prepare_regexp(motif));
		for(var i in l_t) {
			if(i.match(motif)) {
				var imag=document.createElement("img");
				imag.className = "cercle  X"+l_t[i][0]+" Y"+l_t[i][1];
				imag.src= img_src("cercle"+couleur);
				imag.alt="";
				(document.getElementById("NS"+l_t[i][2]+"st"+couleur)).appendChild(imag);
			}
		}
		for(var i in l_g) {
			if(i.match(motif)) {
				for (var j in l_g[i]) {
					var imag=document.createElement("img");
					imag.className = "cercle  X"+l_g[i][j][0]+" Y"+l_g[i][j][1];
					imag.src= img_src("cercle"+couleur);
					imag.alt="";
					(document.getElementById("NS"+l_g[i][j][2]+"st"+couleur)).appendChild(imag);
				}
			}
		}
	}
}
function prepare_regexp(chaine) {
	if(chaine == "") return "";
	chaine = chaine.replace(/[\u00e8\u00e9\u00ea\u00eb]/g, 'e');
	chaine = chaine.replace(/[\u00e0\u00e1\u00e2\u00e3\u00e4]/g, 'a');
	chaine = chaine.replace(/[\u00f9\u00fa\u00fb\u00fc]/g, 'u');
	chaine = chaine.replace(/[\u00ec\u00ed\u00ee\u00ef]/g, 'i');
	chaine = chaine.replace(/[\u00f2\u00f3\u00f4\u00f5\u00f6]/g, 'o');
	chaine = chaine.replace(/[\u00e7]/g, 'c');
	chaine = chaine.replace(/[\u0153]/g, 'oe');
	chaine = chaine.replace(/[\u0152]/g, 'Oe');
	return chaine.toLowerCase();
}
////////////
//Bulle info
function creer_bulle_vue() {
	corps_page.appendChild(bloc("popup_bulleVue"));
	bulle_vue = document.getElementById("popup_bulleVue");
	var nvdiv = bloc("mobile_bulleVue");
	nvdiv.className = "bulle_haut";
	nvdiv.appendChild(enligne("bulle_haut"));
	var fermer = illustr("fermer","","Fermer");
	addEvent(fermer, "click", fermer_bulle_vue, true);
	nvdiv.appendChild(fermer);
	bulle_vue.appendChild(nvdiv);
	bulle_vue.appendChild(bloc("bulle_desc"));
}
function init_overlay() {
	var masque = bloc("masque");
	masque.style.top = decal_h+"px";
	masque.style.left = decal_g+"px";
	addEvent(masque, "click", alterne_fixe, true);
	addEvent(masque, "mousemove", afficher_case, true);
	addEvent(masque, "mouseout", cacher_bulle, true);
	ancre.appendChild(masque);
}
function afficher_case(evt) {
	if(!fixe) {
		var xpage = 0, ypage = 0, xpos = 0, ypos = 0;

		if (evt.offsetX) {
			xpage = evt.offsetX;
			ypage = evt.offsetY;
			xpos = evt.clientX;
			ypos = evt.clientY + document.body.scrollTop;
		}
		else {
			xpage = evt.layerX;
			ypage = evt.layerY;
			xpos = evt.pageX;
			ypos = evt.pageY;
		}
		// var largeur = corps_page.clientWidth+corps_page.scrollLeft-420;
		// if(xpos > largeur) {
			// xpos = largeur;
			// ypos = ypos+15;
		// }
		if (xpage < th && xpage > 0 && ypage < tv && ypage > 0) {
			xcase = xmin + parseInt(xpage/larg);
			ycase = ymax - parseInt(ypage/haut);
			bulle_vue.style.top = (ypos)+"px";
			bulle_vue.style.left = (xpos+16)+"px";
			bulle_vue.style.visibility = "visible";
			document.getElementById("bulle_haut").innerHTML = "x = "+xcase+", y = "+ycase;
			if (xcase !== xold || ycase != yold) {
				c_txt(xcase,ycase);
				xold = xcase; yold = ycase;
			}
		}
	}
}
function alterne_fixe() {
	fixe = !fixe;
}
function alterne_static() {
	if(statique) {
		statique = false;
		popup_vue.style.position = "absolute";
		popup_vue.style.top = (parseInt(popup_vue.style.top)+document.body.scrollTop)+"px";
		popup_vue.style.left = (parseInt(popup_vue.style.left)+document.body.scrollLeft)+"px";
		document.getElementById("fixer_vue").src = img_src("bouge");
	}
	else {
		statique = true;
		popup_vue.style.position = "fixed";
		popup_vue.style.top = (parseInt(popup_vue.style.top)-document.body.scrollTop)+"px";
		popup_vue.style.left = (parseInt(popup_vue.style.left)-document.body.scrollLeft)+"px";
		document.getElementById("fixer_vue").src = img_src("fixe");
	}
}
function cacher_bulle() {
	if(!fixe) { bulle_vue.style.visibility = "hidden"; }
}
function fermer_bulle_vue() {
	bulle_vue.style.visibility = "hidden";
	fixe = false;
}
///////////////////
//Gestion drag&drop
function init_evenement_v(){
//On commence par affecter une fonction a chaque evenement de la souris
	if(ie){
		document.onmousedown = start_v;
		document.onmousemove = drag_v;
		document.onmouseup = drop_v;
	}
	else{
		document.addEventListener("mousedown",start_v, false);
		document.addEventListener("mousemove",drag_v, false);
		document.addEventListener("mouseup",drop_v, false);
	}
}
function start_v(e){
	//On initialise l'evenement s'il n'a pas ete cree ( sous ie )
	if(!e){
		e = window.event;
	}
	//Detection de l'element sur lequel on a clicke
	monElement = (e.target)? e.target:e.srcElement;

	if(monElement) {
		if(monElement.id.indexOf("mobile_") == 0) {
			movable = true;
			myObjectClick = document.getElementById("popup_"+monElement.id.split("_")[1]);
		}
		else if(monElement.id.indexOf("curseur_") == 0) {
			glissable = true;
			myObjectClick = monElement;
		}
		if(myObjectClick){
			positionXAtClick = e.clientX;
			positionYAtClick = e.clientY;
			positionXMyobjectClick = parseInt(myObjectClick.offsetLeft);
			positionYMyobjectClick = parseInt(myObjectClick.offsetTop);
			return false;
		}
	}
}
function drag_v(e){
	//On initialise l'evenement s'il n'a pas ete cree ( sous ie )
	if(!e){
		e = window.event;
	}

	//Si l'objet est deplacable et qu'il existe
	if(movable && myObjectClick){
		//On recupere la position de la souris par rapport a l'objet
		myObjectClick.style.left = e.clientX + ( positionXMyobjectClick - positionXAtClick ) + "px";
		myObjectClick.style.top = e.clientY + ( positionYMyobjectClick - positionYAtClick ) + "px";
		if(myObjectClick.id == "popup_vue") gauche_vue = parseInt(myObjectClick.style.left);
		return false;
	}
	if(glissable && myObjectClick){
		myObjectClick.style.position = "relative";
		//On recupere la position de la souris par rapport a l'objet
		valeur = Math.max(0,Math.min(100,e.clientX + ( positionXMyobjectClick - positionXAtClick )));
		myObjectClick.style.left = valeur + "px";
		valeur_curseur(myObjectClick.id.split("_")[2], valeur);
	}
}
function drop_v(){
	myObjectClick = null;
	movable = false;
	glissable = false;
	positionXAtClick = null;
	positionYAtClick = null;
	positionXMyobjectClick = null;
	positionYMyobjectClick = null;
}

////////////////////////
//fonctions elementaires
function illustr(source,titre,autre) {
	var imag = document.createElement("img");
	imag.src = img_src(source);
	imag.title = titre;
	imag.alt = autre;
	return imag;
}
function bloc(ref) {
	var nvdiv = document.createElement("div");
	nvdiv.id = ref;
	return nvdiv;
}
function enligne(ref) {
	var nvspan = document.createElement("span");
	nvspan.id = ref;
	return nvspan;
}
function aligne() {
	var nspan = document.createElement("span");
	nspan.className = "aligne";
	return nspan;
}
function espacer(noeud) {
	noeud.appendChild(document.createTextNode(" "));
}
function opt_val(ref,defaut) {
	if(isNaN(parseInt(document.getElementById("v2d_"+ref).value))) return defaut;
	return parseInt(document.getElementById("v2d_"+ref).value);
}
function ligne_titre() {
	var nlleligne = document.createElement("tr");
	nlleligne.className = "mh_tdtitre";
	return nlleligne;
}
function insert_texte(texte) {
	var divtexte = document.createElement("div");
	divtexte.appendChild(document.createTextNode(texte));
	divtexte.className = "texte_enligne";
	return divtexte;
}
function envoi_evt(ref, evt) {
	var nvevt = document.createEvent("MouseEvents");
	nvevt.initMouseEvent(evt.type, true, true, window, 0, evt.screenX, evt.screenY, evt.clientX, evt.clientY, false, false, false, false, 0, null);
	(document.getElementById(ref)).dispatchEvent(nvevt);
}
function aj_texte(noeud, texte) {
	noeud.appendChild(document.createTextNode(texte));
}
/////////////////
//Gestion options
function lire_opt() {
	var etik = ["h","v","i_ta","i_tp","i_tn","i_te","i_ti","i_m","i_mg","i_mr","i_moqp","i_oc","i_och","i_oob","i_og","i_oe","i_op","i_o","i_ooqp","i_c","i_om","i_l","i_lt","i_lp","i_ls","i_ltm","i_lc","i_lm","i_lg","i_lr","i_d","spec_obj","spec_lieux","ouvre_dist","affich_fptt","opaque","i_ooa","i_ooa1","i_ooa2","i_ooc","i_ooe","i_oot","ico","opt_spe","i_oa","i_oca","i_mm","i_oo","style_niv","statique","niv_vide","i_oap","autorun","motif_mr","motif_mv","motif_mb","motif_tr","motif_tv","motif_tb"];
	var defaut = [10,5,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,25,true,true,true,true,true,true,12,false,true,true,true,true,0,false,false,true,false,"","","","","",""];
	var nb_options = defaut.length;

	pack = "";
	for(i=0;i<nb_options;i++) {
		opt[etik[i]] = defaut[i];
	}
	if(MZ_getValue("FELDSPATATRAC")) {
		var option_valeurs = MZ_getValue("FELDSPATATRAC").split("/");
		nb_options = Math.min(option_valeurs.length/2);
		if(nb_options > 20) {
			for(i=0; i<nb_options; i++) {
				if(opt[option_valeurs[2*i]] === undefined) continue;
				if(typeof opt[option_valeurs[2*i]] == "string") {  opt[option_valeurs[2*i]] = option_valeurs[2*i+1];}
				else if (typeof opt[option_valeurs[2*i]] == "boolean") { opt[option_valeurs[2*i]] = (option_valeurs[2*i+1] == 1); }
				else {  opt[option_valeurs[2*i]] = parseInt(option_valeurs[2*i+1]);}
			}
		}
	}
	var lst = ["mr", "mv", "mb", "tr", "tv", "tb"];
	for (var i=0; i<6 ; i++) {
		expreg["motif_"+lst[i]] = new RegExp(prepare_regexp(opt["motif_"+lst[i]]));
	}
	if(MZ_getValue("FELDSPATATRAC_CHEMIN")) {
		pack = MZ_getValue("FELDSPATATRAC_CHEMIN");
	}
	chemin = definir_chemin(pack);
}
function sauver_opt() {
	var liste_options = "";
	for(var i in opt) {
		liste_options += i+"/";
		if(typeof opt[i] == "boolean") { liste_options += ((opt[i])? 1:0) + "/"; }
		else { liste_options += opt[i] + "/"; }
	}
	MZ_setValue("FELDSPATATRAC",liste_options);
}

//////////////////////////////
//compatibilite multinavigateurs
var ie = !(window.addEventListener);
if("function" != typeof MZ_getValue) {
	// if(false) {
	if(typeof localStorage == "object") {
		function MZ_getValue(nom) {
			return localStorage.getItem(nom);
		}
		function MZ_setValue(nom,valeur) {
			localStorage.setItem(nom,valeur);
		}
		if(localStorage.getItem("favori_tp") === null && "function" == typeof GM_getValue && GM_getValue("favori_tp")) localStorage.setItem("favori_tp", GM_getValue("favori_tp"));
		if(localStorage.getItem("favori_gow") === null && "function" == typeof GM_getValue && GM_getValue("favori_gow")) localStorage.setItem("favori_gow", GM_getValue("favori_gow"));
		if(localStorage.getItem("FELDSPATATRAC") === null && "function" == typeof GM_getValue && GM_getValue("FELDSPATATRAC")) localStorage.setItem("FELDSPATATRAC", GM_getValue("FELDSPATATRAC"));
	}
	else if("function" == typeof GM_getValue) {
		function MZ_getValue(nom) {
			return GM_getValue(nom);
		}
		function MZ_setValue(nom,valeur) {
			GM_setValue(nom,valeur);
		}
	}
	else if("function" == typeof PRO_getValue) {
		function MZ_getValue(nom) {
			return PRO_getValue(nom);
		}
		function MZ_setValue(nom,valeur) {
			PRO_setValue(nom,valeur);
		}
	}
	else {
		function MZ_getValue(nom) {
			var dc = document.cookie;
			var prefix = nom + "=";
			var begin = dc.indexOf("; " + prefix);
			if (begin == -1) {
				begin = dc.indexOf(prefix);
				if (begin != 0) return "";
			}
			else
				begin += 2;
			var end = document.cookie.indexOf(";", begin);
			if (end == -1)
				end = dc.length;
			return unescape(dc.substring(begin + prefix.length, end));
		}
		function MZ_setValue(nom,valeur) {
			var expdate = new Date ();
			expdate.setTime (expdate.getTime() + (24 * 60 * 60 * 1000 * 31));
			var curCookie = nom + "=" + escape(valeur) + "; expires="+expdate.toGMTString();
			document.cookie = curCookie;
		}
	}
}
if("function" != typeof trim) {
	function trim(str) {
		if(str) return str.replace(/(^\s*)|(\s*$)/g,"");
		return "";
	}
}
if(ie) {
	function addEvent(obj, typ, fn, sens) {
		obj["e"+typ+fn] = fn; obj[typ+fn] = function() {
			obj["e"+typ+fn]( window.event );
		};
		obj.attachEvent("on"+typ, obj[typ+fn] );
	}
	function effaceEvent(obj,typ,fn,sens) {
		obj.detachEvent("on"+typ, obj[typ+fn]);
	}
	function parNom(nom) {
		var listeNom = new Array();
		var parI = document.getElementsByTagName("img");
		for(var i in parI) {
			if (parI[i].name == nom) listeNom.push(parI[i]);
		}
		return listeNom;
	}
	function aj_regle(regle, val, ligne) {
		feuille_css.addRule(regle, val, ligne);
	}
	function val_classe(ligne) {
		return feuille_css.rules[ligne].style;
	}
	function style_opaque(elt, val) {
		elt.filter = "alpha(opacity="+val+")";
	}
}
else {
	function addEvent(obj, typ, fn, sens) {
		obj.addEventListener(typ, fn, sens);
	}
	function effaceEvent(obj,typ,fn,sens) {
		obj.removeEventListener(typ, fn, sens);
	}
	function parNom(nom) {
		return document.getElementsByName(nom);
	}
	function aj_regle(regle, val, ligne) {
		feuille_css.insertRule(regle+" { "+val+" }",ligne);
	}
	function val_classe(ligne) {
		return feuille_css.cssRules[ligne].style;
	}
	function style_opaque(elt, val) {
		elt.opacity = parseFloat(val)/100.0;
	}
}
function get_opt(ref) {
	// return document.forms["opt_vue_spe"].elements[ref].value;
	return document.getElementById(ref).value;
}
function set_opt(ref,val) {
	// document.forms["opt_vue_spe"].elements[ref].value = val;
	document.getElementById(ref).value = val;
}

//////////////////////////////
//Integration vue
function creer_ligne_fptt() {
	var nvtr = ligne_titre();
	nvtr.id = "ligne_fptt";
	var nvtd = document.createElement("td");
	nvtd.colSpan = "2";
	remplir_ligne(nvtd);
	nvtr.appendChild(nvtd);

	var form = document.getElementsByTagName("form");
	for (var i=0; i<form.length; i++) {
		if(form[i].name == "LimitViewForm") {
			tableau_tete[0] = form[i].getElementsByTagName("table")[0];
			break;
		}
	}
	tableau_tete[0].appendChild(document.createElement("tfoot"));
	tableau_tete[0].lastChild.appendChild(nvtr);
	ini_css();

	if(tableau_tete[0].childNodes[1].getElementsByTagName("tr").length > 2) {
		opt_mz();
		if(opt["affich_fptt"]) alterne_ligne(true);
	}
}
function creer_ligne_fptt_vl() {
	var nvdiv = bloc("cadre_fptt");
	nvdiv.className = "mh_tdtire";

	position = document.getElementsByTagName("b")[ligne_pos].innerHTML.match(/(-?\d+)/g);
	posx = parseInt(position[0]); posy = parseInt(position[1]); posn = parseInt(position[2]);
	vueh = 0;

	for (var i=1; i<7; i++) {
		if(tableau_tete[i].getElementsByTagName("thead").length > 0) {
			tableau = tableau_tete[i].getElementsByTagName("tbody")[1].getElementsByTagName("tr");
			debut = 1;
		}
		else {
			tableau = tableau_tete[i].getElementsByTagName("tbody")[0].getElementsByTagName("tr");
			debut = 2;
		}
		if(tableau.length > debut) {
			vueh = Math.max(vueh, parseInt(tableau[tableau.length-1].getElementsByTagName("td")[0].firstChild.nodeValue));
		}
	}
	vuev = vueh;

	remplir_ligne(nvdiv);
	document.getElementsByTagName("b")[ligne_pos].parentNode.appendChild(nvdiv);
	ini_css();
}
function remplir_ligne(noeud) {
	noeud.appendChild(illustr("vue_pt","Vue 2D","Vue 2D"));
	aj_texte(noeud, " Centre : X = ");
	noeud.appendChild(aj_entree("v2d_x", posx));
	aj_texte(noeud, " Y = ");
	noeud.appendChild(aj_entree("v2d_y", posy));
	aj_texte(noeud, " N = ");
	noeud.appendChild(aj_entree("v2d_n", posn));
	aj_texte(noeud, " Port\u00e9e horizontale = ");
	noeud.appendChild(aj_entree("v2d_h", opt["h"]));
	aj_texte(noeud, " verticale = ");
	noeud.appendChild(aj_entree("v2d_v", opt["v"]));
	espacer(noeud);

	var entree = document.createElement("input");
	entree.type = "button";
	entree.className = "mh_form_submit";
	entree.value = "Afficher";
	addEvent(entree, "click", afficher_vue, true);
	noeud.className = "mh_tdtitre";
	noeud.appendChild(entree);
	espacer(noeud);
}
function opt_mz() {
	var sp = aj_opt_fptt("affich_fptt","Ligne Feldspatatrac");
	addEvent(sp.firstChild,"click", function() { alterne_ligne(this.checked); },true);
	tableau_tete[0].childNodes[1].childNodes[0].childNodes[1].appendChild(sp);
}
function alterne_ligne(coche) {
	opt["affich_fptt"] = coche;
	sauver_opt();
	document.getElementById("ligne_fptt").parentNode.style.display = (coche)? "none":"";
}

/////////////////////
//Lancement du script
var page = null, ligne_pos;
// if (window.self.location.toString().indexOf("/Play_vue.") !=-1) {
if (window.self.location.toString().indexOf("/mountyhall/MH_Play/Play_vue.php") !=-1) {
// if (true) {
	page = "vue";
}
else if (window.self.location.toString().indexOf("/mountyhall/MH_Play/Actions/Play_a_SortResult.php") !=-1) {
// else if (true) {
	var parb = document.getElementsByTagName("b");
	var nbb = parb.length
	for(var i=0; i<nbb; i++) {
		if(parb[i].innerHTML == "Vue obtenue") {
			page = "vl";
			ligne_pos = i+1;
			break;
		}
	}
}

if(page) {
	var data_img = new Array();
	data_img["i_ta"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMBAMAAACkW0HUAAAAAXNSR0IArs4c6QAAABJQTFRFAAUAAAAATU4CJGwrMJI6xMY6UkFWJwAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2AofFSMVueqZmwAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAABASURBVAjXRcqxCQAxDEPRTzzD9UcgvUErZIELeP9VTq7yC71GJBJBam8FXks0Scglo9xrnu/CqjqYs5rRDzcn/C2xDGyKJycVAAAAAElFTkSuQmCC";
	data_img["i_te"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMBAMAAACkW0HUAAAAAXNSR0IArs4c6QAAABJQTFRFAAUAAAAAkikpTU4CvjY2xMY6SEZa+wAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2AofFSI7fCelFQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAABBSURBVAjXRcqxDcAwDAPBhzxDeoETBDC8gRcIDO2/SqjKX/AakkgEqb0VeC3RJCGXjHKveb4Lq+pgzmpGP9yc8AP9JAwXMkNEsgAAAABJRU5ErkJggg==";
	data_img["i_ti"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAgMAAAArG7R0AAAAAXNSR0IArs4c6QAAAAxQTFRFAAAAAAAAODc3TU4CW4sL7AAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2AsGDg0uA+QEpwAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAySURBVAjXY2hYxcTQxbCIYQEDF4MCAweD1qoVDAYMPAwGjhDMA+LZGDAwMxxgYPjPAADaiQhTCsqpiQAAAABJRU5ErkJggg==";
	data_img["i_tn"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMBAMAAACkW0HUAAAAAXNSR0IArs4c6QAAABJQTFRFAAUAAAAAODc3TU4CZWVlxMY6wZKhrwAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2AofFSIiGEwN1QAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAABBSURBVAjXRcqxDcAwDAPBhzxDeoETBDC8gRcIDO2/SqjKX/AakkgEqb0VeC3RJCGXjHKveb4Lq+pgzmpGP9yc8AP9JAwXMkNEsgAAAABJRU5ErkJggg==";
	data_img["i_tp"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMBAMAAACkW0HUAAAAAXNSR0IArs4c6QAAABJQTFRFAAMAAAAAKTSSOza+TU4CxMY6x05T+gAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2AsDCCkvtlhZFwAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAABBSURBVAjXRcqxDcAwDAPBh+AV0gtcwQu4sAcIYO2/SqgqX/AakkgEqTkVeC3RJCGXjHLLPO8Pp+pi7mlGP9ze8AHeUAwGBSc3xAAAAABJRU5ErkJggg==";
	data_img["i_m"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAgMAAAArG7R0AAAAAXNSR0IArs4c6QAAAAxQTFRF84RhAAAAUAMDph0d5+Pe/wAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2AofFSUmUGBfCwAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAA3SURBVAgdY2hgYGJiWMXAohT6gImTIYH5xvOjQIEGBv3/P5glhNWZ7oi8YOD+/4DpO8MCBqA6ADnBDoJN5EDIAAAAAElFTkSuQmCC";
	data_img["i_mg"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAgMAAAArG7R0AAAAAXNSR0IArs4c6QAAAAlQTFRFAAADAAAAExMTSbruOAAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2AsDDikK+dHx4gAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAsSURBVAgdY2AAgVUMDIsYuhhWMGgxKDp6MCg4cjAoMADxKg4QCcZMDA0gdQCdcwYyQGpsXgAAAABJRU5ErkJggg==";
	data_img["i_mm"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAgMAAAArG7R0AAAAAXNSR0IArs4c6QAAAAlQTFRFPgACB1MGstKxfGA3LwAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2gQWCBogetOwwQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAvSURBVAjXY2AAgVAGhsBVrgxhq6YySGamMEhlLmGQWgXEoUsY2FZNAGPGVQ4gdQD/WQtz/cwmqAAAAABJRU5ErkJggg==";
	data_img["i_mr"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAgMAAAArG7R0AAAAAXNSR0IArs4c6QAAAAlQTFRFzwAAUjUZLJAufUubFwAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2gwBDRcAD2YISAAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAtSURBVAjXY2DQYGBgmAbEq4AYyA5dFcrANK0BjLmmLQBjzcwMBtVVEQwsDAIA0RAJymPdpdoAAAAASUVORK5CYII=";
	data_img["i_moqp"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAMBAMAAACdPPCPAAAAAXNSR0IArs4c6QAAABhQTFRFYXAAAAAAUAMDODc3ph0dTU4CZWVlxMY6PLMEtAAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2AsEEBkQUJqIqAAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAABdSURBVAgdFcHRCcIwFEDR6y347QKFkAkCbwUHcTRH6CIV/wuPzFFoMJ5jgUYEi1CNCbXeAqJJ5cF02dcv+4Qs+JyK0OB9gpCdP0d37a/72IQio4MkfCwHMjKPzI0f+ucdB/XcPaMAAAAASUVORK5CYII=";
	data_img["i_o"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAgMAAAArG7R0AAAAAXNSR0IArs4c6QAAAAlQTFRFAAADTT8vh3Fb9Iq3HgAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2AofFgo7Izy15gAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAxSURBVAjXY2AIdWBgXDWBgSHLgYFBCsjOmsDAtmoJg9SqlQxZUCwF5LOtCmBgDGUAABszDMn2/AC2AAAAAElFTkSuQmCC";
	data_img["i_oa"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAQMAAABsu86kAAAAAXNSR0IArs4c6QAAAAZQTFRFAG1hd3d3uP7vLgAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2QgfFCQq8JPIkwAAACVJREFUCNdj4GdgsD/AUPmAISGB4UEBwwEDEAIygFygIFCKnwEAwscKzxsc4O8AAAAASUVORK5CYII=";
	data_img["i_oc"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAgMAAAArG7R0AAAAAXNSR0IArs4c6QAAAAlQTFRFPgACbWpquLa2mqw3iQAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2AsEFQ4ATmXesQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAuSURBVAjXY5ByYGBgC2BgiJrAwJAFxKJLGBgYMoEYLDGFgYFxJRAvBQqkAHEIAKY3BrNODAPeAAAAAElFTkSuQmCC";
	data_img["i_oca"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAgMAAAArG7R0AAAAAXNSR0IArs4c6QAAAAlQTFRFAAAAR0ZAuLWdAdg8bAAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2QgfFBgCttUZlgAAAC1JREFUCNdjYGBlYGCMcmAQW+XAkLVqAhhLrVoCxmyrVoIxI5DNuDKAgSGEAQAnzA0IyROWzAAAAABJRU5ErkJggg==";
	data_img["i_och"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMBAMAAACkW0HUAAAAAXNSR0IArs4c6QAAAA9QTFRFAAAATT8vV1dXbVpIqaaTlD+zDwAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2AofFSgi4qPlXwAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAA4SURBVAjXY2BgEBRkAAJBY2MgzWgMBAIMwiDKEEYxAmlDAaCkoKAASKmKE4hkcnFRwKAYlJQYGAA6Dgc+MpREvAAAAABJRU5ErkJggg==";
	data_img["i_d"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAgMAAAArG7R0AAAAAXNSR0IArs4c6QAAAAlQTFRFcwAAciwsQkFBedU+dQAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAH0lEQVQI12Ng0GBggGGtVSvAGFkMghkZHFVFGUJDQwGFCQW0whwLKAAAAABJRU5ErkJggg==";
	data_img["i_oe"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAgMAAAArG7R0AAAAAXNSR0IArs4c6QAAAAxQTFRFAAAAAAAAR0ZAuLWdt1LiOgAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2AsDDwYEDbeOvwAAADlJREFUCB1jYljAwMQU1cDEwJrBxBkhxsSwLIFJKWkWE9O0Bqa2rgwmrjAGpgKtBUy3DzAwfctuAADvnAxDM7ZozQAAAABJRU5ErkJggg==";
	data_img["i_og"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAgMAAAArG7R0AAAAAXNSR0IArs4c6QAAAAxQTFRFAAAAbR8fbWpquLa2xGtK5QAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2AsDDysu9iYdhgAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAtSURBVAjXY2BgWMDAwPQAiH8xMHD/Y2AQf8HAGtrAIBrKwBAagoQDGBhEHRgA5KUIwNTQP18AAAAASUVORK5CYII=";
	data_img["i_om"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAgMAAAArG7R0AAAAAXNSR0IArs4c6QAAAAxQTFRFQrhjdHR0jIyMlJOT2MBMfwAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2QUUCTgxp+4vsQAAADJJREFUCNdjYICBUAcG0SwHBqlfUxjy1z1hyHu9hCHv/wWGqFcTGMReOTCwTnUAqmEAABLeDXvGBuU8AAAAAElFTkSuQmCC";
	data_img["i_oo"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAMBAMAAABGh1qtAAAAAXNSR0IArs4c6QAAAA9QTFRFEQEAekUijFUueHp3srSxV5ksjgAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAbOAAAGzgHzo9ooAAAAB3RJTUUH2gkVBRkmWmC+OwAAADVJREFUCB0FwQENwCAMALAuGFim4DgYAQfgX9NbEB+ohJg0lbSY2Cpx1oRzE8ZriHPBeA02fpGaBAUdFiGSAAAAAElFTkSuQmCC";
	data_img["i_ooa"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAgMAAAArG7R0AAAAAXNSR0IArs4c6QAAAAlQTFRFPgACSQsLo3xWoDUvHwAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAAJ0lEQVQI12NgdHRgYJs2gUFq1RKG1FWRDIGrXBkYVzkgcCiUngbGACVPC69VlsMbAAAAAElFTkSuQmCC";
	data_img["i_ooa1"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAgMAAAArG7R0AAAAAXNSR0IArs4c6QAAAAxQTFRFN7hjAAAAUFBQeHh4loozLgAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2QgDDioqZW4rnAAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAtSURBVAjXY2Bg4GNgYLAG4jcMDMwbgNwDYK4AkCsO5LICuaIODAwhAQwMQAQAmcgGw2okeUUAAAAASUVORK5CYII=";
	data_img["i_ooa2"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAgMAAAArG7R0AAAAAXNSR0IArs4c6QAAAAxQTFRFQrhjSQcHV1dXioqKZrskoQAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2QgDFxIXOW5DiQAAAC9JREFUCNdjsGBgYHgBxK9WAPEqIJ7AwGAVAsSiDAx8rA4MDIwBQFmgAANQgIEVAPScB7Bd2A1LAAAAAElFTkSuQmCC";
	data_img["i_oob"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAgMAAAArG7R0AAAAAXNSR0IArs4c6QAAAAxQTFRFdGtyEAEBQAQGcCoohG1/bQAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2QgDDic6zXdFtQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAlSURBVAjXY1i1gIFh/wM0/AKIry1g2H89gmH//zgg/gfGoaEhAPNOFiO0HF3sAAAAAElFTkSuQmCC";
	data_img["i_ooc"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAgMAAAArG7R0AAAAAXNSR0IArs4c6QAAAAxQTFRFQrhjV1dXioqK593PzPJUkQAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAALklEQVQI12M4wMDMAMIfGPgZbIDQPvQPA++qAga2VRMYpFYtAeOsVSvBODQ0FAArVA4+PRHhtgAAAABJRU5ErkJggg==";
	data_img["i_ooe"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAgMAAAArG7R0AAAAAXNSR0IArs4c6QAAAAxQTFRFAAAATk5OcHBwfHl5GJrmeQAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2gkWCBMjyoiegwAAACRJREFUCNdjCA0NZcjatxKM6///BWMYX2rfEjhm3RfAwBDKAAD25BMWAU1q8QAAAABJRU5ErkJggg==";
	data_img["i_oot"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAgMAAAArG7R0AAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9oJFgcXK6tjlIgAAAAJUExURVcDA0VFRUoDA4ZSNocAAAABdFJOUwBA5thmAAAAAWJLR0QB/wIt3gAAAChJREFUCB1jYAhlYGBlCGAQYGBhcGBgBGMQG4RBJEiEIZOBgWEVGAMAQswDewKXWHgAAAAASUVORK5CYII=";
	data_img["i_op"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAgMAAAArG7R0AAAAAXNSR0IArs4c6QAAAAxQTFRFAAAAAAAAD3UgUo1mEHuddwAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2AsDDxMsD7fAUQAAADBJREFUCB1jZAx5zcjguB+OGR3+M4q+DmEM2MDKmAVk1zf8Y4xf8I1R/MVVRtaA3wBe1xCllIQD1AAAAABJRU5ErkJggg==";
	data_img["i_oap"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAgMAAAArG7R0AAAAAXNSR0IArs4c6QAAAAxQTFRFAAAAAAAA0MxU//g7nKsA6gAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2gwGFwQE5YKT3AAAADBJREFUCB1jZAx5zcjguB+OGR3+M4q+DmEM2MDKmAVk1zf8Y4xf8I1R/MVVRtaA3wBe1xCllIQD1AAAAABJRU5ErkJggg==";
	data_img["i_ooqp"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAMBAMAAACdPPCPAAAAAXNSR0IArs4c6QAAABhQTFRFYXAAAAAAODc3TT8vTU4CZWVlh3FbxMY6SL4GTQAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2AsEEBgDzT/4NwAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAABZSURBVAjXTcyxCoAwDATQw36Eq0RwFiqZHQr9gv5AkexCIL/vZfOmx8EdgLqfIliAYoeMIRSUIKkyUxuhUxhK7Qnm5oBaX0r/sh7heUd597wzu3LAsla0BnxleBlo1W2l8AAAAABJRU5ErkJggg==";
	data_img["i_c"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMBAMAAACkW0HUAAAAAXNSR0IArs4c6QAAAA9QTFRFAAAATT8vV1dXbVpIqaaTlD+zDwAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2AofFSgi4qPlXwAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAA4SURBVAjXY2BgEBRkAAJBY2MgzWgMBAIMwiDKEEYxAmlDAaCkoKAASKmKE4hkcnFRwKAYlJQYGAA6Dgc+MpREvAAAAABJRU5ErkJggg==";
	data_img["i_l"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMBAMAAACkW0HUAAAAAXNSR0IArs4c6QAAAA9QTFRFAAAAAAAA1AwMciws////PmvQ2AAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2AofFSgG3qABjgAAAB10RVh0Q29tbWVudABDcmVhdGVkIHdpdGggVGhlIEdJTVDvZCVuAAAAOElEQVQI12NgUgICBQZFERcRFyEGFUcREUEnBkVHR0cRJwaoHAMDowADAx6KmcGAmdGY2ZjBGAwAMVYGeQ9w/3kAAAAASUVORK5CYII=";
	data_img["i_lc"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAgMAAAArG7R0AAAAAXNSR0IArs4c6QAAAAlQTFRFAAACU0Mgs5ZLIIr62gAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2QURBzspou85HAAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAqSURBVAjXY2Ba1cCgFbqCQXNVBsOyVVlAvIphamgUmF4GprPAciA1QLUAm+oRHkz3pRwAAAAASUVORK5CYII=";
	data_img["i_lm"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAgMAAAArG7R0AAAAAXNSR0IArs4c6QAAAAlQTFRFPgACAAAAswsLQTGjowAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2QURCDgTRJL0UAAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAgSURBVAjXY3BwZGQQZQhhyHJcyRDpmMqQ5jgTzMchDgDjOgnPFPQ4zgAAAABJRU5ErkJggg==";
	data_img["i_lp"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAMAAABhq6zVAAAAAXNSR0IArs4c6QAAADxQTFRFYKYAAAAAMzMzNDQ0NjY2Nzc3Ozs7PDw8PT09Pj4+Pz8/QEBAQUFBQkJCQ0NDRERERUVFRkZGR0dHJ2Y9D4XmtAAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2QUSDBYOOS+WlwAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAABUSURBVAhbPYxLFoAwCANbFbSt/Wjuf1dJUbNh5gEJwRItnM7X+Izcmxu51ZKnkc8E1cjF6DUBIraK92gFHl7Vl13yLzw7gGVZ548VKGQTyqze1bofQ8gFKCLn6REAAAAASUVORK5CYII=";
	data_img["i_ls"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAMAAABhq6zVAAAAAXNSR0IArs4c6QAAADlQTFRFAAAIAAAANDQ0NjY2Nzc3Ozs7PDw8PT09Pj4+Pz8/QEBAQUFBQkJCQ0NDREREhTMzRUVFRkZGR0dH4xT9/wAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2QUSDBg2j64DhwAAAFBJREFUCFtNjFEOgDAIQ4eKmxMGev/DSocm9oe+tLSUEIVw01/+EfzQJHiVfkyCP1szJgQ+pAVYRHS7WorQkhfsD1nrFT/LhBxYN8Cc3pmZHiSMBJ7q2OZPAAAAAElFTkSuQmCC";
	data_img["i_lt"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAgMAAAArG7R0AAAAAXNSR0IArs4c6QAAAAxQTFRFN7hjAAAANCMMYkcjj5DQgQAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2QURCAYguoeOOwAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAsSURBVAjXY2BwZGBgEAHiWghm/O8Axuz/LzCwv77AIL/qCxjXr/rLEBoaCgD0uA4H1ykQ0QAAAABJRU5ErkJggg==";
	data_img["i_ltm"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMBAMAAACkW0HUAAAAAXNSR0IArs4c6QAAABJQTFRFYwUAKx0KswsLYkcjTU1N////qaLHpQAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2QURCB0sGgcJigAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAA2SURBVAjXY2BQYAABpiAwpRoK5iopQUQdGJAoQQEGBkZBBgYQxQCnhBkYDIEUo7GxAFgRUAEAkpcDJQvy9UwAAAAASUVORK5CYII=";
	data_img["i_lg"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAgMAAAArG7R0AAAAAXNSR0IArs4c6QAAAAxQTFRFAAAAAAAAvLez////9X/3+gAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2gwBDg0vFtxxkwAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAtSURBVAgdY2QIXc3I+M+Rkf3HRUb5M5yM8t1ejPXawYx1OsIouL7hH2MoAwMAO0UMSCDh9cYAAAAASUVORK5CYII=";
	data_img["i_lr"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAgMAAAArG7R0AAAAAXNSR0IArs4c6QAAAAlQTFRFKgAAYD4dK2gsi85DTwAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2gwBDQQjzO44qAAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAxSURBVAjXY2BYxcDANKWBgUuKgYFh2QIGrikKDFpSDWC21hQNhlVg9gogW4thRSgTAPeUC1KUCyD0AAAAAElFTkSuQmCC";
	data_img["invi"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAQMAAABsu86kAAAAAXNSR0IArs4c6QAAAANQTFRFAAAAp3o92gAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2QEZEiEsSHHY/AAAAAtJREFUCNdjYCAMAAAkAAEuHnGgAAAAAElFTkSuQmCC";
	data_img["tab0"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAAXNSR0IArs4c6QAAAGBQTFRF3dPH3dTH3tXI39bJ4NbK4NbL4NfK4NfL4djL4djM4tjL4tjN4tnM4tnN49rN49rO5NvO5NvP5dvO5dvQ5dzP5dzQ5t3Q5t3R5t3S597R597S6N7S6N7T6N/S6eDT6uDTeItOrgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfaCRUFDBJMYayaAAAEMklEQVQYGQXBAaoktxZEQTHTFPri+ky+dJJGFG3vf5c/YqG0jZlRa2HbsdU2vbdCSa9bm0FeKA1zBti/P6f3thEWg4U4M4Ow3bjtYs7Ze1QN0jxt731vG0ucjwDAcM6cI3n9/r0RykEWAKC27a0AwHZ6awA5S3IMbFqhIgAYOM+mktMmfW/SJlk1s8/AeTbiIEswDABq28ZKv9/7/SZdv54ZJJBA9plBhrbv9xpbzAAjM5zDIhXikHoOisANFoIBOHtwznCegVmXMwPg6GwKboaa84xjB7DjxobGq+z9fJ7ns0kbe/YZkAROVA2t1FuwQMvA2Wd/njOyEDPEICexNJNqJDmWgCWcxEicZw9YIAZs256hnSOTK3J9lpX23pBqDjSaMwjZloyUGiU5v7adZ93G7o3aplEETmonBo4sSYk4+zA+696K1L23fb8vM6RxYxvYMjOkVmscr7SMzMbg+7YRsm/kJLUYQH2L5Pau/XyekQCxP1zXjIR6LzaT2kJXs/GcYR0AnDAIhGMGJIUkqYnlvaFXOnu191Yu+6G3tty21RwrbRvpfD7Pgd40rLb31omdGsSQ21gEC1IDcmrHbRd7I8mfPZw9QpyD6G0OzDDPZ9Lc721l38WcOYe0rUAyZ2zc+Ci+0YzDKO6165VGc4Y92JZgcDMSpo1nJLHPma2b5Ky05jy/168NZz+Q+96moi0nh2oA5uRbw1IigIfal30j9962970NjlHagTkjwxK6V2pbeL9f272NLYHN2aO2TVszp13ax3p+nzM8H1wAgDPg979/M3uffUaS3V55wczMzEPDYAtAtmTEtL018+yRBWi5ldLiVgOxbEv7c2xJ48YWn2ccS+1qG4Hem95bx5IkV2ktEc9R73tbzSAvSza4xb2XJLHStrU4v0dSWtybOZy9BCBLnlGuPpMG2b1GfAYkyb1vdUhmCWQJO20s5CSWY3DjWwFSFKyWZUmS7N4aZEkCFIMbxcgS4Na+WZYEMo5l21JiSTYohsGxY1FzrCUAAFDfakatZVkMYIa2bTOMa5YZENhO3/IcxAySADAzkuJkn0c1qwJbktPYPgMzihPbQmJmUFoZMCuxJVeyhaoY0jppG7uNJbvt/d42S6kZ3zdIqPe9dmvkthFtLIaIETKrsQ1NjdN/Gwal743UZmgrt4YBxGrj738FZj8PNbQckUZIg2ylddqGM6uR2vRbM8MMbTgHt2aQzOznAaU11nL6Fu6b3rYiFTARSkwbS2DbjT1aap1akAoREDM2Q9/bW8tt740EGq2GkeU4ESDJtoRQ2kRyBAoDI2dZvq9JjXpbUrtFCbKGQxpJgdaFRSxbghkJxbblyhqirf1g+faK+/aa9dffkW/57D3M//5UiEFWA5qfn79/GGyBG8br558K7NaCPz+NLQspcaq//vz8YXDEYDv9P6O3o8N5ytDKAAAAAElFTkSuQmCC";
	data_img["tab"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAAXNSR0IArs4c6QAAAFpQTFRFtKeVtqmXt6qYuKuZuayavK2Vuq2bva6Wu66cvq+XvK+dv7CYvbCevrGfwbGZwrKawLKgw7ObwbOhxLScwrSixbWdw7ajxrafxLekxbilxrmmyLmhx7qoyLup9YqaJgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfaCRUFDgn0Mgf0AAADlUlEQVRIiW2WUY8jNwyD3btg4ApC7zuWC8iD9P//zT7Ink2B+mWTyUiyKJLakci2NAPZEiCfU+u2QF63bVskGvtTRGZmXK+1VtlCQCZIACBJsl01ZkQm++S87KpVVVUW/zkZkcge1zUjkUGyJKDvVPuaaF8USEBjPyciT33IiOir5gm47/u+y3aN5P9P96HGBrDXfd+rqsbrNRPgqZYbsqq1qmxB5ne7YqBG7HnU/WQjSe62EcSMSGIsugiCzE7wffqrbJVN/zycM+br5+vn5FwbJJ8IS3LZO5fkYZKcr9ePV6KeICAfbDsD2FWWTA5/gxJz5jPtxkDsPtIuWzJzAHKVV5mI5GlF5yrNLp2UMWzLZbnWqn2RJujGjt2PiBmIHOsuqdy1at3SwxBJUuyxVtlgw7AVuZPj+5/a7zbHbDil+sFd47qua2Zz/XVRtshMVO9FpJ7JkBMzZ45DhcyepGQJqWfSlN6MSVUpGa611taba2fcAjziJOacCaoSjC0Nb7LoGYn/y2pcto01Ipp1szUjETMbtBZAY2uv911l3TXIiEDGZZIyc+ZDSGzlDFDKcpWscS4T2BbqHvTIa7MhZ0RQpczRRHr9/OPHK8jrB6jeb1NCaym6IAGZft+GIWQDs7may1Kte1WtqjYnuexsGCSGO6QH7ft2T8RHLGR74qF7eZB57GVeeB19RGJX1cF5twY5iICIfKWIzDzcb2SbWZA5Z2ALoiUmOX0vmzwimdtADqWP/O4a5Q5Z97LLu3qP2npMask2ZEpjs/sZZNKKWmuVBVfDvOp+F5HMa5TaDQT4Ll7Z5Gxmziu3WXi9KycuxjG7prEeMlpk4rJXCVoSdonRqtXz57DLbiPZ6Pi4ojS0D+1we4JwkKM9snqXgDQ+3NRrmUjU2Y5tR+DyMhEp8x0icJW5ehE8ISazzaKniYaPDnc3MxI+fKl70hG1pOEPuW+vlZqHVec9wK77XmV9VOnYeq+y7TppDsjntbaLveMttN7LzJmHMPZjTmK74BMCxHXlSXW2GNnaZm9p5UeVti4ClxXXx37aemp+fISsda86BCBT7RicaoA66cfFpEOU5KG3Gw1p9cYQH4Q5VNnfOqQO9lrebeq7F8m16rGJVo7ZLqAzvo8QMoItHLlWr2yCmLFHX/f7faORm9PzCpiT5d4bAp1/e0hkZf71+/evP3+Npw/JiqA2bzhLm72igN9fX19/f/0LGZ6qBKhv2ZwAAAAASUVORK5CYII=";
	data_img["tab2"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAAXNSR0IArs4c6QAAAGBQTFRFyLmhyrujy7ykyr2rzb2ly76szr6mz7+nzb+t0MCozsCu0cGpz8Gv0sKq0MKw08Or0cSx1MSs0sWy1cWt08az1seu1Me01ci12Miv1sm22cmw2sqx2Mq328uz2sy62827IF+SBgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfaCRUFDwZ9liskAAAEAElEQVQYGQXBAQokyREEwT4YplWk4gJfP1BSaND/fymzJ6hqZ1Cpqoqr3rsE3euqneJT1M6ZtO/nc/beVSKZSsiZmVBV3d2nc877DssE5ru79/7uqtDzoW1Tk3PmHPD5fN5QPEGSti3uuleaJlX1rk2LPqA2fasES5O0k5zvW0FV93d1V320855pzvcNPUVoJpO2ZVUV9/e7v5/u89d3JtBCgp6ZYLPu73etkpkkg5mck6dKyYnrnCCtWinNJM15p3qm5zvNPLdnJkmV89bGdbL2fEfVpqqqyepj3vf7+X4/b91V5z2TAK2KTFfw2krKY5LznvfzPYOEzlRTVIUZlwFUaPNQVQs933daSeikqjpTnYP1Eq/nEfVeq8xJlDlTigoWXIt6/nrV73NV94qriqSqqjY5CKDkvCfjee6Vqt6rv98vM1VVtemLmakrrlUftYN5a+L9uVL0iqqSSYI/C7r3eb+f70BS+n5y1QyEvbfaUSVc5o1zJs9Jk6qd0lI1kwJWVav4vuleOO/j3itu32/3qujuLnNEd1c4n8/3tF61z+q9qqq2ZOpdpVZatSm6quqT9w3g552cdwg5p9S7nmQm8/2Men93F71P5sw5VVdSsGc0rh70yox2UK/qozJn+k5VaCauA7WqM0Dfc+blqudRzfl+nr/e5Lzf1Pu7Klm3xxOZNJnjT5sHJWm/Wb19r+i9u97fXaMWdZI5g+1DuBdWTX+/n+pdFVrNeQfd1dXOcR/eI9/POZPvJ9okTXIm9fe//zrve94zgLoXn2RmZuYbzURJUhQsnd29a+b7DtKERwXXqEyqqPB+jgKjKvl8RwX3WZWW39V7VwVAcRWic9j7uyszxUfQVq17b1XF3V2l5zOAa93rnJz3oUkRnMHLZ1yL7rXkMymAe3/Lic5Di1BVlaAqaqJ6l7QgVnbzCADq1RYB2qCJihYhjbt6fQQarIoqqIAmaDNRVao58tAkSdvib5lBRSST1k5dV52Oax87KY3q/uz3hM4USJLYGUD1PV80j7QKqKpnkhlUVQqdmeCKbe2jCgpKEG3dVd1VdxV0d+/v7vqgZrw/C8H7u+padFfiKplIh2KeVW1XrfrftRP0dwV16opqO2no4+rvf9t03u83mq45VKUwQXFVV3vmWUHdn3YmM3XNOVXNBOy832+Cu1Ye3d+296d3V6okGSlqVaFRVR0eVlUSl1JbOqOZ+rteRXfvFRqGRzOIqrQFVCjFXQUlwU4z6CPen1XL3t2qrkWLTE5cARt126eKQjoDQVVcZCIv7zfi9dL785rn3/+I13zedzr/+nspmSKaMn/+/PMnE6VROz5//iOpqjR//1kVKajKv//+83emSiaq+39apaQSB/RtgAAAAABJRU5ErkJggg==";
	data_img["tab3"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAAXNSR0IArs4c6QAAAEhQTFRFwrSiw7ajxLekxbilxrmmx7qoyLupybyqyr2ry76szb+tzsCuz8Gv0MKw08Or0cSx1MSs0sWy1cWt08az1seu1Me02Miv2cmwyVZ9cgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfaCRUFDzpS+VejAAAD3UlEQVQYGQXBOQ4cQQwEwQa0QyPrAEFD+v9PFfFQ2saAWgvbjq1u07sVSva8tQH5oTQwAPP7zd5tIyzAQgyAsN14dx/MzKAVSHy7e3e3jSXmJwAwzDAj+f1+g1AGWQCAutu9CgBsp7cGkPMkx8DQChUBADDfUMlpk71LdpO8GmaA+QYxyBIAAGjbNlb27u6SfX8+QAIJZA8gw3bvztgCAGRghkcqxJA1gyJwg4UAgBlwBuYDeMcAgKMZCt7Amvlw7AB23Niw8Ssz3+/7fkN2YzMDSAInqmAr9QoW6BmYmfl9gywEEIOcxBJkhSTHEvCEkxiJ+QawQAC2bQMtI5MTOc+z0t6FVAw0YkDItmSkrFGS+TN2vneNvRd1m0YROKmdGBhZkhIxM+B5dxWpe9feHUAaN7aBkQGyVtc4fmlBZjD4rhsh+yInqQWAekVy9958vw8JEPPjXIOE9g4bUlvoxGAG3gDgBBAIxwCSQpLUxPIM7Ekzr3tXeZmPvdpyd3fFWOnuRprf7xvopeFte1cndmoQkNtYBAtSA3LWjts+ZpDk38AMQswgepsBgO9HmrvblX0PhhnSbgWSGWy88Si+CBxQ3LPrl0YMDNiWALxBwrQxSGJmGF2SeWnNfL/3Z2Dmg9xdU7FdJkMFAJOr4SkRwMfax1zk3u327jY4RmkBBhme0J20beHubPc2tgQ2M6jdTbeG6T7NWN9vBr4fLgDAAL5/f8PMzCDJ7p78AAA+GsAWgGzJCHb31vANsgA9t1K2uBUQy7Y0v7El4cYWvw/HUvdtG4Hu0rt1LElyla0lYkZ7d1sB8rNkg1u8dySJld3dWswPSdnivTDMPAHIkkE5/cgG2XtG/ABJ8t6thoQnkCXstLGQk1iOwY1vBUhRsHZ5liTJ7tUgSxKgGNwoRpYA79qXZ0kg41i2LSWWZINiAMeORc1YTwAAoN4K1FqWBYCBbrcN4DXPAALb2SvfIABJABiQFCczn2peBbYkp7E9AChObAsJAGUrA+YltuRKtlAVQ3addDf2bizZu3t3u3lKDb4LEurd2V0jdzeiGwuIQMi8jW3Y1Dj9uwGU3kVqA93KrQFAvG58/xZgvo8atoxIIySQrWydbsPwNlKbvRoA6IYZ3BqQDPN9oOwa6zl7C3fp7VakAohQYtpYAttubPS0dWpBVoiAABvoXa+Wu3sXCYReA7IcJwIk2ZYQym4iOQIFADnP8p1JjfZ2Se0tSpAFQzaSAq0XHrFsCUBCsW15ZUE0mg/L1xN3PfNw5Cu/GWBYIUBWA0KyAFvgBvyUCuzWArSxZSElTgUCcATYzv4HhoNxGHgDeNUAAAAASUVORK5CYII=";
	data_img["actu"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAQMAAABsu86kAAAAAXNSR0IArs4c6QAAAAZQTFRFAHgBVj0ZssvH2AAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2QgEDBoVkh3chQAAACFJREFUCNdjkGNgsGdgqG9g+HwAhB7C0PMPDI8fgBgPGgD1QRBBOFuLXgAAAABJRU5ErkJggg==";
	data_img["raz"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAQMAAABsu86kAAAAAXNSR0IArs4c6QAAAAZQTFRFvq6YVj0ZVPaRCgAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAJUlEQVQI12N4UMDw4QPDzw8M9Q8Y7A8wyDeAEJAB5AIFgVIPCgAigRAtFCOwEwAAAABJRU5ErkJggg==";
	data_img["plus"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPAQMAAAABGAcJAAAAAXNSR0IArs4c6QAAAAZQTFRFAPDDalJSwQPpggAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2gkWBycE3/SfIgAAAB10RVh0Q29tbWVudABDcmVhdGVkIHdpdGggVGhlIEdJTVDvZCVuAAAAKUlEQVQI12Pgf8BgU8GQyMPg3MJwuA2E5n9i2P8LREK4QHGgLFAN/wMAYAEPrqZJGnwAAAAASUVORK5CYII=";
	data_img["moins"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPAQMAAAABGAcJAAAAAXNSR0IArs4c6QAAAAZQTFRFAPCTalJSCg7mIAAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2gkWByc2FyPOogAAAB10RVh0Q29tbWVudABDcmVhdGVkIHdpdGggVGhlIEdJTVDvZCVuAAAAKUlEQVQI12Pgf8BgU8GQwMPgwMJwgA2E5n9i2P8LREK4QHGgLFAN/wMAHDUMmg1xnqMAAAAASUVORK5CYII=";
	data_img["param"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPAgMAAABGuH3ZAAAAAXNSR0IArs4c6QAAAAlQTFRFAAACcnJyrKysHYI3uQAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAAOklEQVQI12NgYGBlAAJJEJECJkSARCaQybhqAgMD21IHBgYpIIM1C8RYCZRLXQIkAlJgGhgngAigJAA3/gj9EYu15gAAAABJRU5ErkJggg==";
	data_img["case"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAdCAMAAABhTZc9AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH1ggaDCoH/3IJRwAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAABCUExURQAAAM64o8+5pNC6pdG7ptK8p9O9qNS+qdW/qtbAq9fBrNjCrdnDrtrEr9vFsNzGsd3Hst7Is9/JtODKteLMt/////E/0GkAAAAVdFJOU1VVVVVVVVVVVVVVVVVVVVVVVVVVVemFkf4AAAABYktHRBXl2PmjAAABdElEQVQYGX3BwXFjBxBDwQfMcOXyyfmn6YtE/gG85QC2G/5E/JND0J+XrybdSWQX/l2e89yTh9foidf39mtyNSxHP+fFI4S4mgu9K8uKd3ZC2kr6Ive58tfBorQCTBDlx2Jsg76X94cxxyuFNqrA0kfD8govAU+wkNX/sTbLip7dJ9R4voVkCYXB4v3WdISo5FkL+dPnEX9XIpqABHWknPY+d8uvYO4uYzXlJGOq9S3fV5tkS1LpI5/UDzYLauRVeYJm5FbK4WV50SBBrnJvaOtUOQYQbc7F41zuSZubXpYQ2YpsqdLUo2aBzzJ9ui/btHj04NVj/YxZflm5PvKTeSm5pmB/tSyrmrSX9FoUQjUCliu2U+G2aFwV+xIGX0slipD30G/20meR6CeepBLEEr/la/Z7cVGpRpXAMmnJ95gl0QySBxL5La6ijFlapOZO7vN4C8XDuSx88elr7oL9S9P3zcvJAsuVcEbWuHJeay444c/+A7zFI3LrLd4IAAAAAElFTkSuQmCC";
	data_img["centrer"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANAgMAAAAPhQzvAAAAAXNSR0IArs4c6QAAAAlQTFRFgEI4VVVVuayf7exZ6gAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfaCBQADTLtAzEtAAAAHklEQVQI12MIDQ11YMjMioISYC5EzCEKmUCSQFEMACofEPjI8jYFAAAAAElFTkSuQmCC";
	data_img["tp"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANAgMAAAAPhQzvAAAAAXNSR0IArs4c6QAAAAlQTFRFQAkQAAAA9vW9SDK4iQAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH2wcTCQkfF7rvHgAAACxJREFUCNdjYAh1YGBgzQphYBBbtZSBQWrVSgaGqFUrHRiyVq0iRISGhjoAAG6fFUmWMrW0AAAAAElFTkSuQmCC";
	data_img["gow"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAgMAAAArG7R0AAAAAXNSR0IArs4c6QAAAAlQTFRFXAByVA0Lyqp4QnItCgAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2wcTCTMHIX+pMQAAAC9JREFUCNdjYACBUAaGwFWuDGGrpjJIZqYwSGUuYZBaBcShSxjYVk0AY8ZVDiB1AP9ZC3P9zCaoAAAAAElFTkSuQmCC";
	data_img["fermer"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPAgMAAABGuH3ZAAAAAXNSR0IArs4c6QAAAAlQTFRFPgACVj0Zvq6YXeg1agAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2QUXFTUz+8fFKgAAAB10RVh0Q29tbWVudABDcmVhdGVkIHdpdGggVGhlIEdJTVDvZCVuAAAAPElEQVQI12NgCA1hYGDNWurAILZqVQCDVNayCQyRUVOnMGSFhS1hyJoaBSSWZsFYIDGwLFgdWAdYL8gUAIRmGCaFXC9bAAAAAElFTkSuQmCC";
	data_img["vue_pt"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAAAXNSR0IArs4c6QAAAAlQTFRFAAAASTMwh3Fbk3lFXQAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfYCwoQLC7TFSCGAAAAG0lEQVQI12NgAAGNhV4aEAIbVyTQVQRCEFYMAMbnC1WzvGhOAAAAAElFTkSuQmCC";
	data_img["glissiere"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGgAAAAMAQMAAAC0t2quAAAAAXNSR0IArs4c6QAAAAZQTFRFAHgBAAAA1Hl1pAAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2QgFDAwoblFCJgAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAYSURBVAjXYzjAgADMDOTy/iMDNB5VbAAALOkhhTBiX10AAAAASUVORK5CYII=";
	data_img["curseur"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAMAQMAAACQruVuAAAAAXNSR0IArs4c6QAAAAZQTFRFTk5OhYWFMOXZPwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9kIBQwNMGQm6zEAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAADklEQVQI12NgYCjAAhkANJgEYZREEvsAAAAASUVORK5CYII=";
	data_img["bouge"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAPAgMAAACQHae8AAAAAXNSR0IArs4c6QAAAAlQTFRFegAAAAAAJl0ncDEMqwAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2gkWBzIbZUl0wwAAACtJREFUCNdjYGBqYGBg4FoAJLRWAIlVq2BcEBEatTQUiUBIQNSBdYC5QFMAFKEOSG0ssR4AAAAASUVORK5CYII=";
	data_img["fixe"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAPAgMAAACQHae8AAAAAXNSR0IArs4c6QAAAAlQTFRFSQAAAAAAeyEhaQDekAAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2gkWBzIc+y3hYAAAACtJREFUCNdjYGBqYGBg4FoAJLRWAIlVq2BcEBEatTQUiUBIQNSBdYC5QFMAFKEOSG0ssR4AAAAASUVORK5CYII=";
	data_img["cercleb"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOBAMAAADtZjDiAAAAAXNSR0IArs4c6QAAAAlwSFlzAAAA0AAAANABeWPPlAAAAAd0SU1FB9oMBhYVBcCe6m0AAAAkUExURQAAAAoA2woA2woA2woA2woA2woA2woA2woA2woA2woA2////0su0F0AAAALdFJOUwAbH11uc7rJ6fr9f20iAAAAAAFiS0dECx/XxMAAAABCSURBVAhbY2BgzFjVJsDAwBBZouQ+lYGBdTKQbRnAIGkApJknMqQzgEAZQwuY9mBYBKa14DRMHKYOpg9mDsxcqD0AdgcPz+YBG+YAAAAASUVORK5CYII=";
	data_img["cerclev"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOBAMAAADtZjDiAAAAAXNSR0IArs4c6QAAAAlwSFlzAAAA0AAAANABeWPPlAAAAAd0SU1FB9oMBhYWCnsMpD8AAAAkUExURQAAAC6sAS6sAS6sAS6sAS6sAS6sAS6sAS6sAS6sAS6sAf///04KVmcAAAALdFJOUwAbH11uc7rJ6fr9f20iAAAAAAFiS0dECx/XxMAAAABCSURBVAhbY2BgzFjVJsDAwBBZouQ+lYGBdTKQbRnAIGkApJknMqQzgEAZQwuY9mBYBKa14DRMHKYOpg9mDsxcqD0AdgcPz+YBG+YAAAAASUVORK5CYII=";
	data_img["cercler"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOBAMAAADtZjDiAAAAAXNSR0IArs4c6QAAAAlwSFlzAAAA0AAAANABeWPPlAAAAAd0SU1FB9oMBhYrEOyGFfsAAAAkUExURQAAAL0AAL0AAL0AAL0AAL0AAL0AAL0AAL0AAL0AAL0AAP///x9tojYAAAALdFJOUwAbH11uc7rJ6fr9f20iAAAAAAFiS0dECx/XxMAAAABCSURBVAhbY2BgzFjVJsDAwBBZouQ+lYGBdTKQbRnAIGkApJknMqQzgEAZQwuY9mBYBKa14DRMHKYOpg9mDsxcqD0AdgcPz+YBG+YAAAAASUVORK5CYII=";

	var data_css = "#popup_vue { position:absolute; z-index:500; border-width:1px; border-style:solid; overflow:visible; font-size:12px; }\n#mobile_vue { \n	position:relative;\n	font-weight:bold;\n	border-width:1px; border-style:solid;\n	overflow:visible;\n	padding : 2px;\n	z-index:510;\n	height:20px;\n	background: #cbb1ae url('"+data_img["tab"]+"');\n	cursor:move;\n}\n#mobile_vue span, #mobile_vue img { \n	position: relative; float:left; z-index:550;\n}\n#mobile_vue img { cursor:pointer; padding:2px; }\n.a_cliquer { \n	cursor:pointer; \n	position:relative;\n	float:right;\n}\nimg#fermer_vue, img#fixer_vue, img#param_vue { float:right; }\n#contenu_vue { \n	position:relative; z-index:510;\n	border-width:1px; border-style:solid;\n}\n #grille {\n	position:absolute;\n}\n #repere {	position:absolute; }\n#selecteur { height:30px; background-image:url('"+data_img["tab2"]+"'); }\n#contenu_vue { background-image:url('"+data_img["tab0"]+"'); }\n.niv, .niv_out { border-style:solid; cursor:pointer; width:35px; text-align:center; position:absolute; top:5px; background-image:url('"+data_img["tab3"]+"');}\n.niv { border-width:2px; font-weight:bolder; }\n.niv_out { border-width:1px; font-weight:normal; margin-top:1px; margin-left:1px;}\n#etik_niv { position:absolute; top:7px; left:2px; }\n#opt_vue, #opt_vue_spe, #selecteur, #ancre { position:relative; } \n#opt_vue  span { position:static; }\n#opt_vue, #opt_vue_spe  { background-image:url('"+data_img["tab2"]+"');white-space:normal; }\n.aligne, .th, .td, .tb, .tg { white-space: nowrap; }\nlabel { cursor:pointer }\n.case { position:absolute; z-index:610; opacity : 0.33; filter : alpha(opacity=33); }\n.couche_t, .couche_m, .couche_o, .couche_l, .couche_c, .couche_d, .couche_smr, .couche_smv, .couche_smb, .couche_str, .couche_stv, .couche_stb { position:absolute; }\n.couche_smr, .couche_str { z-index:635; }\n.couche_smv, .couche_stv { z-index:630; }\n.couche_smb, .couche_stb { z-index:625; }\n.icone { position:absolute; z-index:620; }\n.cercle { position:absolute; }\n#masque {\n	position:absolute;\n	margin:0px; padding:0px; border:0px;\n	z-index:700;\n	background-image:url(invi.png);\n}\n\n#popup_bulleVue { \n	visibility:hidden;\n	position:absolute; z-index:1000;\n	width:400px;\n	border-width:1px; border-style:solid; border-color:#a1927f;\n	background: #cbb1ae url('"+data_img["tab"]+"');\n}\n#mobile_bulleVue {\n	cursor:move;\n}\n.bulle_haut  {\n	font-weight:bold;\n	text-align:left;\n	padding:2px;\n}\n.bulle_haut img {\n	position: absolute; top:1px; right:1px;\n	cursor:pointer;\n	margin:0px; padding:0px; border:0px;\n	vertical-align:top;\n}\n#bulle_desc{\n	font-size:11px;\n	background: #cbb1ae url('"+data_img["tab2"]+"');\n	padding:2px;\n}\n.excentrer, #recentrer, .clickable { cursor:pointer; }\n.gp_choix, .gp_choix_impair { margin-left:10px; }\n.gp_choix { background: #cbb1ae url('"+data_img["tab2"]+"'); }\n.bulle_desc_impair, .gp_choix_impair {\n	background: #cfb5b3 url('"+data_img["tab3"]+"');\n}\n\n.meme_niv { font-weight:bolder; }\n\n.texte_enligne { float:left;position:relative; }\ndiv.gp_choix { float:none;clear:left; }\n#o_opaque { height : 10px; }\n#o_taille { height : 22px; }\n#opt_opaque, #opt_taille_ico { display:block; position:relative; float:left; }\n\ndiv.glissiere {\n	padding:0px; margin:0px; position:relative; float:left;\n} \ndiv.glissiere_fond {\n	cursor:pointer;\n	left: 0px; top:3px;\n	z-index:810;\n	height:12px; width:104px;\n	position: relative;\nbackground-image: url('"+data_img["glissiere"]+"');\n}\ndiv.curseur {\n	cursor:e-resize;\n	left: 0px; top:-9px;\n	z-index:820;\n	height:12px; width:5px;\n	position: relative;\n	background-image: url('"+data_img["curseur"]+"');\n}\ndiv.glissiere_fond, div.curseur { \n	background-repeat : no-repeat;\n}\n\n#chrono {\n	position:absolute;\n	bottom:0px;\n	right:1px;\n}\n#ancre { overflow: visible; }\n#popup { z-index:1300 !important }\ntable.mh_tdborder[id^=popupCDM] { z-index:1100 !important }\n#bulle { z-index:1200 !important }\n#bulle_desc table, #bulle_desc table { display: inline; }\n.img_click { margin-left:2px; border-style:outset; border-width:1px; padding:0px 2px; margin-bottom:-1px; background-color:rgba(0,0,0,0.2); cursor:pointer; }\n.pas_vu > div { opacity:0.5; }\n#cadre_fptt { border: 1px solid #000; padding: 2px; }\n.cercle_desc { position:relative; top:1px; }\n.niv_action { visibility:hidden; }\n.niv_action img { margin-right: 3px; }";

	//Initialisation des parametres
	var decal_g=35, decal_h=25, decal_d=40, decal_b=35, gauche_vue=30, larg=null, haut=null, xold = null, yold = null, cold = [null, null, null, null, null], nb_n_vus = null;
	var liste_ico = ["i_ta","i_tp","i_tn","i_te","i_ti","i_m","i_mg","i_mm","i_mr","i_oc","i_och","i_oob","i_og","i_oe","i_op","i_o","i_c","i_om","i_l","i_lt","i_lp","i_ls","i_ltm","i_lc","i_lm","i_lg","i_lr","i_ooa","i_ooa1","i_ooa2","i_ooc","i_ooe","i_oot","i_oa","i_oca","i_oo","i_oap","i_d"];
	var descase = new Array(), vu = new Array(), coord = new Array(), opt = new Array(), compte = new Array(), tableau_tete = new Array(), expreg = new Array();
	var vue_cree = false, vue_reduite = false, fixe = false, statique = false, opt_crees = false, ini_style = true, entetes_crees = false, click_fait = false, css_fam = false, avec_gowap = false, avec_tp = false;;
	var bulle_vue = null, ancre = null, opt_vue_spe = null, popup_vue = null, feuille_css = null;
	var th = 0, tv = 0, dh = 0, dv = 0;
	var chemin = "", pack = "";
	var chrono = 0;
	var classes = new Array();
	var l_m = new Array(), l_t = new Array(), l_g = new Array();

	var movable = false, glissable = false;
	var myObjectClick = null, positionXAtClick = null, positionYAtClick = null, positionXMyobjectClick = null, positionYMyobjectClick = null;
	var corps_page = document.getElementsByTagName("body")[0];

	var x1, y1, n1, v1, h1, xmin, xmax, ymin, ymax, nmin, nmax, nbx, nby;
	var nb_cr=0;
	var x_m = new Array(), x_t = new Array(), x_o = new Array(), x_c = new Array(), x_l = new Array(), x_d = new Array();
	var nb_m=0, nb_t=0, nb_o=0, nb_c=0, nb_l=0, nb_d=0;
	var posx, posy, posn, vueh, vuev

	lire_opt();

	if(page == "vue") {
		var tableau = document.getElementsByTagName("p")[0].childNodes;
		var nb1 = tableau.length, nb2=0, nb3=1;

		for(var i=0; i<nb1; i++) {
			if(tableau[i].nodeName == "TABLE") {
				if(tableau[i].className == "mh_tdborder") {
					nb2++;
					if(nb2 > nb3) {
						tableau_tete[nb3] = false;
						nb3++;
					}
				}
				else {
					tableau_tete[nb3] = tableau[i];
					nb3++;
				}
			}
		}

		x_m = (tableau_tete[1])? tableau_tete[1].getElementsByTagName("tbody")[1].getElementsByTagName("tr"): new Array(); nb_m = x_m.length;
		x_t = (tableau_tete[2])? tableau_tete[2].getElementsByTagName("tbody")[1].getElementsByTagName("tr"): new Array(); nb_t = x_t.length;
		x_o = (tableau_tete[3])? tableau_tete[3].getElementsByTagName("tbody")[1].getElementsByTagName("tr"): new Array(); nb_o = x_o.length;
		x_c = (tableau_tete[4])? tableau_tete[4].getElementsByTagName("tbody")[1].getElementsByTagName("tr"): new Array(); nb_c = x_c.length;
		x_l = (tableau_tete[5])? tableau_tete[5].getElementsByTagName("tbody")[1].getElementsByTagName("tr"): new Array(); nb_l = x_l.length;
		x_d = (tableau_tete[6])? tableau_tete[6].getElementsByTagName("tbody")[1].getElementsByTagName("tr"): new Array(); nb_d = x_d.length;

		var liste = document.getElementsByTagName("li");
		var position = liste[0].innerHTML.match(/(-?\d+)/g), portee = liste[2].innerHTML.match(/(\d+)/g);
		posx = parseInt(position[0]); posy = parseInt(position[1]); posn = parseInt(position[2]); vueh = parseInt(portee[0]); vuev = parseInt(portee[1]);

		creer_ligne_fptt();
		if(opt["autorun"]) { autorun(); }
	}
	else {
		var j = 1;
		var tableaux = document.getElementsByTagName("table");
		for (var i=0;i<tableaux.length;i++) {
			if (tableaux[i].className == "mh_tdborder") {
				tableau_tete[j]=tableaux[i];
				j++;
			}
		}
		if(tableau_tete.length > 7) creer_ligne_fptt_vl();
	}

	if(!document.getElementById("action_lieu")) {
		function prepare_click(num) {
			var tableau = tableau_tete[num].getElementsByTagName("tbody")[1].getElementsByTagName("tr");
			var nb = tableau.length;
			if(nb > 1) {
				for (var i = 1; i < nb; i++) {
					addEvent(tableau[i].childNodes[0], "click", function(event) { affiche_action(this, event); }, true);
					tableau[i].childNodes[0].style.cursor = "pointer";
					tableau[i].childNodes[0].id = num+"_"+i+"_";
				}
			}
		}
		function affiche_action(cible, evt) {
			var ligne = cible.parentNode;
			var nb = ligne.childNodes.length;
			var ref = cible.id+ligne.childNodes[nb-3].innerHTML+"_"+ligne.childNodes[nb-2].innerHTML+"_"+ligne.childNodes[nb-1].innerHTML;
			var cadre = document.getElementById("action_lieu");
			if (cadre.style.display == "none" || document.getElementById("action_coord").innerHTML != ref) {
				document.getElementById("action_coord").innerHTML = ref;
				cadre.style.display = "block";
				cadre.style.left = evt.clientX;
				cadre.style.top = (evt.clientY + document.body.scrollTop-20);
			}
			else {
				cadre.style.display = "none";
			}
		}

		var nvdiv = document.createElement("div");
		nvdiv.id = "action_lieu";
		nvdiv.className = "mh_tdtitre";
		nvdiv.style.display = "none";
		nvdiv.style.position = "absolute";
		nvdiv.style.padding = "1px";
		nvdiv.style.border = "1px solid";
		nvdiv.appendChild(document.createElement("span"));
		nvdiv.appendChild(document.createElement("span"));
		nvdiv.appendChild(document.createElement("span"));
		var nvsp = document.createElement("span");
		nvsp.id = "action_coord"
		nvsp.style.display = "none";
		nvdiv.appendChild(nvsp);
		document.body.appendChild(nvdiv);

		for(var i=1; i<7; i++) {
			prepare_click(i);
		}
	}
	var imag = document.createElement("img");
	imag.src = img_src("centrer")
	imag.title = "ouvrir la vue 2D";
	imag.style.cursor = "pointer";
	imag.style.marginRight = "1px";
	addEvent(imag, "click", function(event) { centre_dist(this.parentNode.parentNode.childNodes[3].innerHTML, event); }, true);
	document.getElementById("action_lieu").childNodes[0].appendChild(imag);
}