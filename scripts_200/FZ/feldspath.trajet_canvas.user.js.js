//============================ ZZ PRE CODE =======================================
var infosTrolls=new Array();
//============================ ZZ PRE CODE =======================================


// ==UserScript==
// @name Trajet des gowap MkII
// @namespace http://feldspath.free.fr/
// @include http://games.mountyhall.com/mountyhall/MH_Play/Play_equipement.php?as_CurSect=follo*
// @include http://games.mountyhall.com/mountyhall/MH_Follower/FO_Ordres.php*
// @include http://games.mountyhall.com/mountyhall/MH_Follower/FO_NewOrder.php*
// @include http://games.mountyhall.com/mountyhall/MH_Follower/FO_Profil.php*
// @include http://games.mountyhall.com/mountyhall/MH_Lieux/Lieu_Description.php*
// @include http://serv01.mountyhall.com/mountyhall/MH_Play/Play_equipement.php?as_CurSect=follo*
// @include http://serv01.mountyhall.com/mountyhall/MH_Follower/FO_Ordres.php*
// @include http://serv01.mountyhall.com/mountyhall/MH_Follower/FO_NewOrder.php*
// @include http://serv01.mountyhall.com/mountyhall/MH_Follower/FO_Profil.php*
// @include http://serv01.mountyhall.com/mountyhall/MH_Lieux/Lieu_Description.php*
// @description Trajet des gowap, version canvas 2.0.0.0 du 19 decembre 2010 par Feldspath
// @injectframes 1
// ==/UserScript==

var ie = (window.attachEvent)? true:false;
if("function" != typeof MZ_getValue) {
	if("function" == typeof GM_getValue) {
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
if (ie) {
	function addEvent(obj, typ, fn, sens) {
		obj["e"+typ+fn] = fn; obj[typ+fn] = function() {
			obj["e"+typ+fn]( window.event );
		}
		obj.attachEvent("on"+typ, obj[typ+fn] );
	}
}
else  {
	function addEvent(obj, typ, fn, sens) {
		obj.addEventListener(typ, fn, sens);
	}
}
function aj_opt(ref,desc,val) {
	nvspan = aligne();
	choix = document.createElement("input");
	choix.id = ref;
	choix.type = "checkbox";
	choix.checked = val;
	choix.title = desc;
	etik = document.createElement("label");
	etik.appendChild(document.createTextNode(desc));
	etik.htmlFor = ref;
	nvspan.appendChild(choix);
	nvspan.appendChild(etik);
	return nvspan;
}
function bloc(ref) {
	nvdiv = document.createElement("div");
	nvdiv.id = ref;
	return nvdiv;
}
function enligne(ref) {
	nvspan = document.createElement("span");
	nvspan.id = ref;
	return nvspan;
}
function aligne() {
	nspan = document.createElement("span");
	nspan.className = "aligne";
	return nspan;
}
function aj_entree(ref,val) {
	entree = document.createElement("input");
	entree.id = ref;
	entree.name = ref;
	entree.className = "TextboxV2";
	entree.size = "5";
	entree.value = val;
	addEvent(entree, "keyup", modifier_coord, true);
	addEvent(entree, "change", modifier_coord, true);
	addEvent(entree, "click", action_trajet, true);
	return entree;
}
function get_opt(ref) {
	val = document.getElementById(ref).value;
	if(!val) {
		val = 0;
	}
	else {
		val = (isNaN(val))? 0:parseInt(val);
	}
	return val;
}
function set_opt(ref,val) {
	document.getElementById(ref).value = val;
}
function inserer_tableau(tablo,rg,element) {
	tablo.splice(rg, 0, elt);
}
function effacer_tableau(tablo,rg) {
	tablo.splice(rg,1);
}
function creer_canvas(ref) {
	var dessin = document.createElement("canvas");
	dessin.id = ref;
	return dessin;
}
function creer_icone(lx, ly, desc, clique) {
	var dessin = document.createElement("canvas");
	dessin.width = lx;
	dessin.height = ly;
	dessin.className = "a_cliquer";
	dessin.title = desc;
	addEvent(dessin, "click", clique, true);
	return dessin;
}
function dessine_svg(trace, chemin) {
	for(var i in chemin) {
		if(chemin[i][0] == 0) {
			trace.moveTo(chemin[i][1], chemin[i][2]);
		}
		else if(chemin[i][0] == 1) {
			trace.lineTo(chemin[i][1], chemin[i][2]);
		}
		else if(chemin[i][0] == 2) {
			trace.bezierCurveTo(chemin[i][1],chemin[i][2], chemin[i][3],chemin[i][4], chemin[i][5],chemin[i][6]);
		}
		else if(chemin[i][0] == 3) {
			trace.arc(chemin[i][1], chemin[i][2], chemin[i][3], 0, Math.PI*2,  true);
		}
	}
}
function creer_glissiere(ref, val) {
	var div_gliss = bloc("choix_zoom_"+ref);
	div_gliss.appendChild(document.createTextNode("Zoom : "));
	div_gliss.className = "choix_zoom";
	dessin = creer_canvas("glissiere_"+ref);
	dessin.width = 104;
	dessin.height = 12;
	addEvent(dessin, "mousedown", ini_glisse, true);
	addEvent(dessin, "mousemove", sur_curseur, true);
	addEvent(dessin, "mouseout", function() { haut.getElementById("bulle_zoom").style.visibility="hidden" }, true);
	addEvent(dessin, "mouseover", function() { haut.getElementById("bulle_zoom").style.visibility="visible" }, true);
	div_gliss.appendChild(dessin);
	div_gliss.appendChild(enligne("val_zoom_"+ref));
	div_gliss.lastChild.innerHTML = val+"%";

	creer_bulle_zoom();

	return div_gliss;
}
function dessine_glissiere(ref, val) {
	dessin = haut.getElementById("glissiere_"+ref);
	if (dessin.getContext){
		var ctx = dessin.getContext('2d');
		ctx.clearRect(0, 0,104, 12);
		ctx.fillStyle = "rgb(0,0,0)";
		ctx.fillRect(0,0,2,12);
		ctx.fillRect(102,0,2,12);
		ctx.fillRect(0,5,104,2);

		ctx.fillStyle = "rgb(80,80,80)";
		ctx.fillRect(val,0,5,12);
		ctx.fillStyle = "rgb(200,200,200)";
		ctx.fillRect(val+1,1,3,10);
	}
}
function coord_x(val) {
	return decalh+coeff*(val+100);
}
function coord_y(val) {
	return decalv+coeff*(100-val);
}
function creer_bulle_trajet() {
	if(haut.getElementById("bulle_trajet")) {
		bulle = haut.getElementById("bulle_trajet");
		return;
	}
	haut.body.appendChild(bloc("bulle_trajet"));
	bulle = haut.getElementById("bulle_trajet");
	bulle.className = "mh_tdtitre";
	nvdiv = bloc("mobile_bulleVue");
	nvdiv.className = "bulle_haut_gow";
	nvdiv.appendChild(enligne("bulle_haut_gow"));
	bulle.appendChild(nvdiv);
	bulle.appendChild(bloc("bulle_desc_gow"));
	bulle.lastChild.className = "mh_tdpage";
}

function declare_css() {
	if(haut.getElementById("css_gow")) return;
	css = "#carte_trajet { position: relative; text-align: left; }\ndiv#carte_gowap, div.mh_tdpage { display: none; }\ndiv.mh_tdpage#cadre_liste, div.mh_tdpage#bulle_desc_gow  { display: block !important; }\n#trou, #trajet, #surligne, #danger, #cadre_liste {\n	position: absolute;\n	top: 0px;\n	left: 0px;\n}\n#cadre_liste {\n	padding: 10px 20px 5px 10px;\n}\n.etape {\n	width: 100%;\n	border: 1px solid #000;\n	padding: 1px 5px 1px 5px;\n	margin: -1px 0px 0px 0px;\n}\nlabel {\n	cursor: pointer;\n}\n.etape_surlignee {\n	width: 100%;\n	border : 2px solid #ff2222;\n	padding: 1px 5px 0px 5px;\n	margin: -2px -1px -1px -1px;\n}\n.etape canvas, .etape_surlignee canvas {\n	position: relative; float: right;\n	margin-left:10px; margin-right: -3px; margin-top : 2px;\n}\n.a_cliquer  {\n	cursor: pointer;\n}\n#aj_noeud { cursor : pointer; }\n#trou_fav, #trace_fav { position: absolute; top: 20px; left: 0px; }\n.choix_zoom { position: relative; margin-left:30px; margin-top:2px; }\n#glissiere_gow, #glissiere_fav { position: relative; }\n\n#bulle_trajet { \n	visibility:hidden;\n	position:absolute; z-index:3100;\n	width:400px;\n	border-width:1px; border-style:solid; border-color:#a1927f;\n}\n#mobile_bulleVue { cursor:move; }\n.bulle_haut  { font-weight:bold; text-align:left; padding:2px; }\n#bulle_desc_gow { font-size:11px; padding:2px; }\n\n#gestion_fav_gow { position:absolute; padding: 1px; border-with:1px; border-style:solid; min-width:300px; z-index:3000; }\n#titre_gow, .fav, .fav_dessus { min-height:15px; }\n.fav  { margin:0; margin:0 0 -1px 0; padding: 1px 1px 1px 1px; border : 1px solid #a1927f; }\n.fav_dessus { margin:-1px; margin:-1px -1px -2px -1px; padding: 0px 1px 0px 1px; border : 2px solid #a1927f; }\n#gestion_fav_gow .a_cliquer { position: relative; float: right; margin-left: 2px; }\n#gestion_fav_gow { display: block !important; }\n#cadre_fav { position: relative; }\n#bulle_zoom { display:block !important; visibility: hidden; position: absolute; z-index: 3500;  border : 1px solid  #a1927f; }";

	var node = document.createElement("style");
	node.type = "text/css";
	node.id = "css_gow";
	node.appendChild(document.createTextNode(css));
	haut.getElementsByTagName("head")[0].appendChild(node);
}
function bouton(ref,desc) {
	entree = document.createElement("input");
	entree.type = "button"
	entree.id = ref;
	entree.value = desc;
	entree.className = "mh_form_submit";
	return entree;
}
function trim(str) {
   return str.replace(/(^\s*)|(\s*$)/g,"");
}
var corps_page = window.document.getElementsByTagName("body")[0];

////////////////////////////////////////////////////////////
function charge_trajet() {
	if(MZ_getValue("TRAJET_"+num_gow)) {
		param = MZ_getValue("TRAJET_"+num_gow).split("/");
		if(param[0] == "zoom") {
			zoom = parseInt(param[1]);
			typ_gow = parseInt(param[3]);
			dla = parseInt(param[5]);
			coord = param[7].split(",");
			etapes_ini = new Array();
			if(coord.length > 1) {
				nb_ini = Math.floor(coord.length/3);
				for(var i = 0; i<nb_ini; i++) {
					etapes_ini.push([parseInt(coord[3*i]), parseInt(coord[3*i+1]), parseInt(coord[3*i+2]), coord[3*i].match(/^\d+e$/g) !== null]);
				}
			}
			etapes = new Array();
			coord = param[9].split(",");
			if(coord.length > 1) {
				nb_coord = Math.floor(coord.length/3);
				for(var i = 0; i<nb_coord; i++) {
					etapes.push([parseInt(coord[3*i]), parseInt(coord[3*i+1]), parseInt(coord[3*i+2])]);
				}
			}
			else {
				choix_ini = true;
			}
			if(param.length > 10) {
				param = param[11].split(",");
				if(param.length > 1) {
					nb_a = Math.floor(param.length/2);
					for(var i=0; i<nb_a; i++) {
						arret.push([parseInt(param[2*i]), parseInt(param[2*i+1])]);
					}
				}
				else {
					arret = [[-1, parseInt(param[0])]];
				}
			}
			else {
				arret = [[-1, etapes.length]];
			}
		}
	}
}
function sauve_trajet() {
	param = "zoom/"+zoom+"/typ_gow/"+typ_gow+"/dla/"+dla+"/t_enreg/";
	for(var i = 0; i<etapes_ini.length; i++) {
		param += etapes_ini[i][0]+(etapes_ini[i][3]? "e":"")+","+etapes_ini[i][1]+","+etapes_ini[i][2]+",";
	}
	param += "/t_prev/";
	for(var i = 0; i<nb_ajout; i++) {
		param += etapes[i][0]+","+etapes[i][1]+","+etapes[i][2]+",";
	}
	param += "/arret/"
	for(var i in arret) {
		param += arret[i][0]+","+arret[i][1]+",";
	}
	MZ_setValue("TRAJET_"+num_gow,param);
}
function charge_opt_position() {
	if(MZ_getValue("OPT_POSITION_GOWAP")) {
		param = MZ_getValue("OPT_POSITION_GOWAP").split("/");
		zoom = parseInt(param[1]);
		t_enreg = (param[3] == "1");
		t_prev = (param[5] == "1");
	}
}
function sauve_opt_position() {
	MZ_setValue("OPT_POSITION_GOWAP","zoom/"+zoom+"/t_enreg/"+(t_enreg? 1:0)+"/t_prev/"+(t_prev? 1:0));
}
////////////////////////////////////////////////////////////
function ini_canvas() {
	trajet = bloc("carte_trajet");

	dessin = creer_canvas("trou");
	dessin.className = "mh_tdpage";
	trajet.appendChild(dessin);
	trajet.appendChild(creer_canvas("trajet"));
	trajet.appendChild(creer_canvas("danger"));

	dessin = creer_canvas("surligne");
	addEvent(dessin, "click", action_trajet, true);
	addEvent(dessin, "mousedown", start_v, true);
	addEvent(dessin, "mousemove", afficher_position, true);
	addEvent(dessin, "mouseout", function() { cacher_bulle(true) }, true);
	addEvent(dessin, "mouseover",  function() { cacher_bulle(false) }, true);
	trajet.appendChild(dessin);

	trajet.appendChild(creer_glissiere("gow", zoom));

	cadre_liste = bloc("cadre_liste");
	cadre_liste.className = "mh_tdpage";
	cadre_liste.appendChild(bloc("liste_etapes"));

	cadre_liste.appendChild(document.createElement("br"));
	cadre_liste.appendChild(document.createTextNode("Type de gowap : "));
	etik = ["Rapide", "Normal", "Lent"]; val = [6, 4, 2];
	sel = document.createElement('select');
	sel.name = "selgow";
	sel.id = "selgow";
	for(var i=0; i<etik.length; i++) {
		option=document.createElement('option');
		option.value = val[i];
		option.appendChild(document.createTextNode(etik[i]));
		sel.appendChild(option);
	}
	sel.value = typ_gow;
	addEvent(sel, "keyup", change_gow, true);
	addEvent(sel, "change", change_gow, true);
	cadre_liste.appendChild(sel);

	nvdiv = bloc("ligne_fav");
	choix = document.createElement("select");
	choix.id = "sel_fav";
	addEvent(choix, "mouseover", surligne_fav, true);
	addEvent(choix, "mouseout", efface_surligne, true);
	nvdiv.appendChild(choix);
	dessin = dessine_plus();
	addEvent(dessin, "click", inserer_fav, true);
	nvdiv.appendChild(dessin);
	dessin = dessin = creer_icone(21, 21, "G\u00e9rer les destinations favorites", ini_gestion);
	if (dessin.getContext){
		var ctx = dessin.getContext('2d');
		ctx.strokeStyle = "rgb(50,50,50)";
		ctx.fillStyle = "rgb(220,220,220)";
		ctx.lineWidth = "1";
		dessine_svg(ctx, data_svg["param"]);
		ctx.stroke();
		ctx.fill();
	}
	dessin.style.verticalAlign = "text-bottom";
	nvdiv.appendChild(dessin);
	cadre_liste.appendChild(nvdiv);

	cadre_liste.appendChild(bloc("inserer_etape"));

	aj = bouton("aj_etape", "Ajouter une \u00e9tape ");
	addEvent(aj, "click", alterne_ajout, true);
	cadre_liste.appendChild(aj);
	if(nb_ini > 0) {
		aj = bouton("raz_liste", "Initialiser");
		addEvent(aj, "click", raz, true);
		cadre_liste.appendChild(aj);
	}
	aj = bouton("eff_trajet", "Effacer tout");
	addEvent(aj, "click", efface_trajet, true);
	cadre_liste.appendChild(aj);

	trajet.appendChild(cadre_liste);

	parp = document.getElementsByTagName('p');
	parp[parp.length-1].insertBefore(trajet,parp[parp.length-1].firstChild);
}
function inserer_fav() {
	ref = parseInt(document.getElementById("sel_fav").value);
	if(ref == -2) return;
	etapes[nb_ajout] = (ref == -1)? soi:[favori[ref][1], favori[ref][2], favori[ref][3]];

	if(choix_ini) {
		liste_etapes.innerHTML =  "";
		choix_ini = false;
		liste_etapes.innerHTML =  "";
		liste_etapes.appendChild(aj_depart());
		choix_ini = false;
	}
	if(!document.getElementById("etape_"+nb_ajout)) {
		document.getElementById("liste_etapes").appendChild(aj_liste(nb_ajout,  etapes[nb_ajout]));
		if(nb_ajout > 0) {
			document.getElementById("etape_"+(nb_ajout-1)).insertBefore(aj_descendre(nb_ajout-1), document.getElementById("etape_"+(nb_ajout-1)).getElementsByTagName("br")[0]);
		}
	}
	nb_ajout++;
	sauve_trajet();
	prepare_inserer();
	trace_trajet_prev();
}
function surligne_fav() {
	if(page_trajet != "trajet") return;
	var val = parseInt(this.value);
	if(val == -2) return;
	dessin = document.getElementById("surligne");
	dessin.width = 200*coeff+2*decalh;
	dessin.height = 200*coeff+2*decalv;

	if(choix_ini) {
		var debut = depart
	}
	else {
		var debut = (nb_ajout > 0)? etapes[nb_ajout-1]:depart
	}
	trace_trajet(couleur_surligne, "surligne", debut, [(val == -1)? soi:[favori[val][1], favori[val][2], favori[val][3]]], true);
}
function change_gow() {
	typ_gow = this.value;
	calc_dist();
	sauve_trajet();
}
function alterne_ajout() {
	aj_noeud = !aj_noeud;
	if(aj_noeud) {
		document.getElementById("aj_etape").style.borderStyle = "inset";
		if(nb_ajout == 0) {
			etapes[nb_ajout] = depart;
		}
		else {
			etapes[nb_ajout] = etapes[nb_ajout-1];
		}
		if(choix_ini) {
			liste_etapes.innerHTML =  "";
			liste_etapes.appendChild(aj_depart());
			choix_ini = false;
		}
		if(!document.getElementById("etape_"+nb_ajout)) {
			document.getElementById("liste_etapes").appendChild(aj_liste( nb_ajout,  etapes[nb_ajout]));
			if(nb_ajout > 0) {
				document.getElementById("etape_"+(nb_ajout-1)).insertBefore(aj_descendre(nb_ajout-1), document.getElementById("etape_"+(nb_ajout-1)).getElementsByTagName("br")[0]);
			}
			prepare_inserer();
		}
	}
	else {
		document.getElementById("aj_etape").style.borderStyle = "outset";
		nb_ajout++;
		sauve_trajet();
		prepare_inserer();
		trace_trajet_prev();
	}
}
function trace_trou() {
	document.getElementById("carte_trajet").style.height = (200*coeff+2*decalv+10)+"px";
	dessin = document.getElementById("trou");
	dessin.width = 200*coeff+2*decalh;
	dessin.height = 200*coeff+2*decalv;
	if (dessin.getContext){
		var ctx = dessin.getContext('2d');

		//repere
		ctx.beginPath();
		dessine_svg(ctx, [[0,100*coeff+decalh, decalv], [1,100*coeff+decalh, 200*coeff+decalv], [0,decalh, 100*coeff+decalv], [1,200*coeff+decalh, 100*coeff+decalv]]);
		ctx.stroke();
		ctx.strokeRect(decalh, decalv, coeff*200, coeff*200);

		//trous
		ctx.fillStyle = couleur_trou;
		for(var i in position_trous) {
			ctx.beginPath();
			ctx.arc(coord_x(position_trous[i][0]), coord_y(position_trous[i][1]), coeff*position_trous[i][3], 0, Math.PI*2,  true);
			ctx.fill();
		}
	}
//============================ ZZ MOD pour affichage des position de Trolls  =======================================
	putInfosMAP();		//
//============================ ZZ Fin MOD ================================== =======================================
}
function trace_trou_fav() {
	dessin = haut.getElementById("trou_fav");
	dessin.width = 200*coeff+2*decalh;
	dessin.height = 200*coeff+2*decalv;

	if (dessin.getContext){
		var ctx = dessin.getContext('2d');

		//repere
		ctx.beginPath();
		ctx.moveTo(100*coeff+decalh, decalv);
		ctx.lineTo(100*coeff+decalh, 200*coeff+decalv);
		ctx.moveTo(decalh, 100*coeff+decalv);
		ctx.lineTo(200*coeff+decalh, 100*coeff+decalv);
		ctx.stroke();
		ctx.strokeRect(decalh, decalv, coeff*200, coeff*200);

		//trous
		ctx.fillStyle = "rgb(200,0,0)";
		for(var i in position_trous) {
			ctx.beginPath();
			ctx.arc(coord_x(position_trous[i][0]), coord_y(position_trous[i][1]), coeff*position_trous[i][3], 0, Math.PI*2,  true);
			ctx.fill();
		}
	}
}
function trace_position(pos) {
	dessin = document.getElementById("trou");
	if (dessin.getContext){
		var ctx = dessin.getContext('2d');
		ctx.strokeStyle = "rgba(0,0,0,0.6)";
		ctx.lineWidth = 2;
		ctx.beginPath();
		dessine_svg(ctx, [[3,coord_x(pos[0]), coord_y(pos[1]), 8],[0,coord_x(pos[0])-8, coord_y(pos[1])],[1,coord_x(pos[0])+8, coord_y(pos[1])],[0,coord_x(pos[0]), coord_y(pos[1])-8],[1,coord_x(pos[0]), coord_y(pos[1])+8]]);
		ctx.stroke();
	}
}
function trace_sortie(pos) {
	dessin = document.getElementById("trou");
	if (dessin.getContext){
		var ctx = dessin.getContext('2d');
		ctx.strokeStyle = "rgba(0,0,0,0.6)";
		ctx.lineWidth = 2;
		ctx.strokeRect(coord_x(pos[0]-2.5), coord_y(pos[1]+2.5), 5*coeff, 5*coeff)
		ctx.beginPath();
		dessine_svg(ctx, [[0,coord_x(pos[0]-2.5), coord_y(pos[1])], [1,coord_x(pos[0]-2.5)+5*coeff, coord_y(pos[1])], [0,coord_x(pos[0]), coord_y(pos[1]+2.5)], [1,coord_x(pos[0]), coord_y(pos[1]+2.5)+5*coeff]]);
		ctx.stroke();
	}
}
function trace_trajet_prev() {
	sauve_trajet();
	if(choix_ini) {
		dessin = document.getElementById("trajet");
		dessin.width = 200*coeff+2*decalh;
		dessin.height = 200*coeff+2*decalv;
	}
	else {
		trace_trajet(couleur_prev, "trajet", depart, etapes, true);
	}
	calc_dist();
}
function trace_trajet(couleur, ou, ref, noeuds, refaire) {
	var dessin = document.getElementById(ou);
	var dx, dy, x_inter, y_inter;
	if(refaire) {
		dessin.width = 200*coeff+2*decalh;
		dessin.height = 200*coeff+2*decalv;
	}

	var pts = [[ref[0], ref[1]]];
	var nb_etape = noeuds.length;
	if(nb_etape == 0) return;
	for(var i=0; i< nb_etape; i++) {
		dx = noeuds[i][0] - ref[0];
		dy = noeuds[i][1] - ref[1];
		if(dx != 0 && dy != 0 && dx != dy) {
			if (Math.abs(dx) < Math.abs(dy)) {
				x_inter = noeuds[i][0];
				y_inter = (dy<0)? ref[1]-Math.abs(dx):ref[1]+Math.abs(dx);
			}
			else {
				x_inter = (dx>0)? ref[0]+Math.abs(dy):ref[0]-Math.abs(dy);
				y_inter = noeuds[i][1];
			}
			pts.push([x_inter, y_inter]);
		}
		pts.push([noeuds[i][0], noeuds[i][1]]);
		ref = noeuds[i];
	}
	if (dessin.getContext){
		var ctx = dessin.getContext('2d');
		ctx.lineWidth = coeff;
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		ctx.strokeStyle = couleur;
		ctx.beginPath();
		var nb_pts = pts.length;
		ctx.moveTo(coord_x(pts[0][0]), coord_y(pts[0][1]));
		for (var i=1; i<nb_pts; i++) {
			ctx.lineTo(coord_x(pts[i][0]), coord_y(pts[i][1]));
		}
		ctx.stroke();
		ctx.fillStyle = couleur;
		for (var i=0; i<nb_etape; i++) {
			if(noeuds[i][3]) {
				ctx.fillRect(coord_x(noeuds[i][0])-coeff, coord_y(noeuds[i][1])-coeff, 2*coeff, 2*coeff);
			}
			else {
				ctx.beginPath();
				ctx.arc(coord_x(noeuds[i][0]), coord_y(noeuds[i][1]), coeff, 0, Math.PI*2,  true);
				ctx.fill();
			}
		}
	}
}
function trace_fav() {
	coeff = zoom_fav/50.0;
	place_fav();
	coeff = zoom/50.0;
	retrace_fav = false;
}
function place_fav() {
	dessin = haut.getElementById("trace_fav");
	dessin.width = 4*zoom_fav+2*decalh;
	dessin.height = 4*zoom_fav+2*decalv;

	if (nb_fav == 0) return;
	if (dessin.getContext){
		var ctx = dessin.getContext('2d');
		var mini = favori[0][3], maxi = favori[0][3], couleur;
		for (var i=1; i<nb_fav; i++) {
			if(mini > favori[i][3]) mini = favori[i][3];
			if(maxi < favori[i][3]) maxi = favori[i][3];
		}
		if (mini == maxi) mini -= 100;

		for (var i=0; i<nb_fav; i++) {
			trace_point(ctx, coord_x(favori[i][1]), coord_y(favori[i][2]), "rgb(50,"+(150-Math.round(100.0*(maxi-favori[i][3])/(maxi-mini)))+","+(50+Math.round(100.0*(maxi-favori[i][3])/(maxi-mini)))+")")
		}
		if(nv_pt !== null) {
			trace_point(ctx, coord_x(nv_pt[0]), coord_y(nv_pt[1]), "rgba(0,0,0,0.5)")
		}
	}
}
function trace_point(trace, xx, yy, couleur) {
	trace.strokeStyle = couleur;
	trace.fillStyle = couleur;
	trace.lineWidth = coeff;
	trace.beginPath();
	trace.arc(xx, yy, coeff, 0, Math.PI*2,  true);
	trace.fill();
	trace.beginPath();
	trace.arc(xx, yy, 3*coeff, 0, Math.PI*2,  true);
	trace.stroke();
}
function trace_glissiere() {
	dessine_glissiere("gow", Math.min(99,Math.max(0,Math.round(zoom/2.0)-25)));
}
function trace_glissiere_fav() {
	dessine_glissiere("fav", Math.min(99,Math.max(0,Math.round(zoom_fav/2.0)-25)));
}
function ini_glisse(evt) {
	if(this.id == "glissiere_gow") {
		xpage = (evt.offsetX)? evt.offsetX:evt.layerX;
		zoom = Math.min(250,Math.max(50,(xpage+23.0)*2.0));
		MZ_setValue("zoom", zoom)
		trace_glissiere();
		document.getElementById("val_zoom_gow").innerHTML = zoom+"%";
		coeff = zoom/50.0;
		if(page_trajet == "trajet") {
			echelle_trajet();
			trace_trajet_prev();
			sauve_trajet();
		}
		else if(page_trajet == "suivants") {
			echelle_position();
			sauve_opt_position();
		}
		else {
			echelle_teleport();
		}
		glissable = true;
		this.style.cursor = "e-resize";
	}
	if(this.id == "glissiere_fav") {
		xpage = (evt.offsetX)? evt.offsetX:evt.layerX;
		zoom_fav = Math.min(250,Math.max(50,(xpage+23.0)*2.0));
		MZ_setValue("zoom_fav", zoom_fav)
		trace_glissiere_fav();
		haut.getElementById("val_zoom_fav").innerHTML = zoom_fav+"%";
		echelle_fav();
	}
}
function sur_curseur(evt) {
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
	if(this.id == "glissiere_gow") {
		curseur = Math.min(100,Math.max(0,Math.round(zoom/2.0)-25))+2;
		this.style.cursor = (xpage <= (curseur+2) && xpage >= (curseur-2)) ? "e-resize":"pointer";
		val = Math.min(250,Math.max(50,(xpage+23.0)*2.0))+"%";
	}
	else if(this.id == "glissiere_fav") {
		val = Math.min(250,Math.max(50,(xpage+23.0)*2.0))+"%";
	}
	var bulle_zoom = haut.getElementById("bulle_zoom")
	bulle_zoom.style.top = (ypos+3)+'px';
	bulle_zoom.style.left = (xpos+16)+'px';
	bulle_zoom.style.visibility = "visible";
	bulle_zoom.innerHTML = val;
}
function glisse(evt) {
	if(glissable) {
		xpage = (evt.offsetX)? evt.offsetX:evt.layerX;
		zoom = Math.min(250,Math.max(50,(xpage+23.0)*2.0));

		trace_glissiere();
		document.getElementById("val_zoom_gow").innerHTML = zoom+"%";
		coeff = zoom/50.0;
		if(page_trajet == "trajet") {
			echelle_trajet();
			trace_trajet_prev();
			sauve_trajet();
		}
		else if(page_trajet == "suivants") {
			echelle_position();
			sauve_opt_position();
		}
		else {
			echelle_teleport();
		}
	}
}
function drop() {
	glissable = false;
	bougeable = false;
}
function action_trajet(evt) {
	if(aj_noeud) {
		aj_noeud = false;
		nb_ajout++;
		document.getElementById("aj_etape").style.borderStyle = "outset";
		sauve_trajet();
		prepare_inserer();
	}
}
function afficher_position(evt) {
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

	xcase = Math.round((xpage-decalh)/coeff-100.0);
	ycase = Math.round(100.0-(ypage-decalv)/coeff);
	bulle.style.top = (ypos+8)+'px';
	bulle.style.left = (xpos+16)+'px';
	bulle.style.visibility = "visible";

	document.getElementById("bulle_haut_gow").innerHTML = "x = "+Math.round(xcase)+", y = "+Math.round(ycase);
	desc = document.getElementById("bulle_desc_gow");
	desc.innerHTML = "";
	for(var i in position_trous) {
		dist = (xcase-position_trous[i][0])*(xcase-position_trous[i][0])+(ycase-position_trous[i][1])*(ycase-position_trous[i][1])-position_trous[i][2]
		if(dist <= 0) {
			desc.appendChild(document.createTextNode(" Trous de M\u00e9t\u00e9orite : n=-1 -> n="+position_trous[i][4]));
			desc.appendChild(document.createElement("br"));
			break;
		}
	}

	document.getElementById("surligne").style.cursor = "";

	//============================ ZZ MOD pour affichage des position de Trolls  =======================================
	bulleInfosTrolls(desc, xcase, ycase);
	//============================ ZZ Fin MOD ================================== =======================================

	if(aj_noeud) {
		if(nb_ajout == 0) {
			etapes[nb_ajout] = [xcase, ycase, depart[2]];
		}
		else {
			etapes[nb_ajout] = [xcase, ycase, etapes[nb_ajout-1][2]];
		}
		deplace_noeud(nb_ajout, xcase, ycase);
		trace_trajet_prev();
	}
	else if(bougeable) {
		etapes[noeud_courant] = [xcase, ycase, etapes[noeud_courant][2]];
		deplace_noeud(noeud_courant, xcase, ycase);
		trace_trajet_prev();
	}
	else {
		document.getElementById("etape_depart").className = "etape";
		nb_liste = choix_ini? nb_tt:nb_ajout;
		for (var i=0; i<nb_liste; i++) {
			document.getElementById("etape_"+i).className = "etape";
		}
		sur_etape = false;
		if(choix_ini) {
			for (var i = nb_ini-1; i>=0; i--) {
				if(Math.round(xcase) == etapes_tt[i][0] && Math.round(ycase) == etapes_tt[i][1]) {
					desc.appendChild(document.createTextNode(pile_etape_ini(i)));
					desc.appendChild(document.createElement("br"));
					document.getElementById("surligne").style.cursor = "move";
					sur_etape = true;
					break;
				}
			}
		}
		else {
			for (var i = nb_ajout-1; i>=0; i--) {
				if(Math.round(xcase) == etapes[i][0] && Math.round(ycase) == etapes[i][1]) {

					desc.appendChild(document.createTextNode(pile_etape(i)));
					desc.appendChild(document.createElement("br"));
					document.getElementById("surligne").style.cursor = "move";
					sur_etape = true;
					break;
				}
			}
		}

		if(!sur_etape) {
			etape_listee =  new Array();
			for(var i in ligne_v) {
				if(xcase == ligne_v[i][1] && ycase >= ligne_v[i][2] && ycase <= ligne_v[i][3] && !etape_listee[ligne_v[i][0]]) {
					desc.appendChild(document.createTextNode(transition_etape(ligne_v[i][0], xcase, ycase)));
					desc.appendChild(document.createElement("br"));
					etape_listee[ligne_v[i][0]] = true;
				}
			}
			for(var i in ligne_h) {
				if(ycase == ligne_h[i][3] && xcase >= ligne_h[i][1] && xcase <= ligne_h[i][2] && !etape_listee[ligne_h[i][0]]) {
					desc.appendChild(document.createTextNode(transition_etape(ligne_h[i][0], xcase, ycase)));
					desc.appendChild(document.createElement("br"));
					etape_listee[ligne_h[i][0]] = true;
				}
			}
			for(var i in ligne_d) {
				if(xcase >= ligne_d[i][2] && xcase <= ligne_d[i][3] && !etape_listee[ligne_d[i][0]]) {
					equation = ycase-ligne_d[i][1]*xcase-ligne_d[i][4];
					if(equation == 0) {
						desc.appendChild(document.createTextNode(transition_etape(ligne_d[i][0], xcase, ycase)));
						desc.appendChild(document.createElement("br"));
						etape_listee[ligne_d[i][0]] = true;
					}
				}
			}

		}
	}
}
function afficher_fav(evt) {
	var xpage = 0, ypage = 0, xpos = 0, ypos = 0, xs, ys;

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
	xcase = Math.round(50*(xpage-decalh)/zoom_fav-100.0);
	ycase = Math.round(100.0-50*(ypage-decalv)/zoom_fav);
	bulle.style.top = (ypos+3)+'px';
	bulle.style.left = (xpos+16)+'px';
	bulle.style.visibility = "visible";

	haut.getElementById("bulle_haut_gow").innerHTML = "x = "+Math.round(xcase)+", y = "+Math.round(ycase);
	desc = haut.getElementById("bulle_desc_gow");
	desc.innerHTML = "";
	for(var i in position_trous) {
		dist = (xcase-position_trous[i][0])*(xcase-position_trous[i][0])+(ycase-position_trous[i][1])*(ycase-position_trous[i][1])-position_trous[i][2]
		if(dist <= 0) {
			desc.appendChild(document.createTextNode(" Trous de M\u00e9t\u00e9orite : n=-1 -> n="+position_trous[i][4]));
			desc.appendChild(document.createElement("br"));
			break;
		}
	}

	for(var i=0; i<nb_fav; i++) {
		if(xcase == favori[i][1] && ycase == favori[i][2]) {
			haut.getElementById("fav_gow_"+i).className = "fav_dessus";
			desc.appendChild(document.createTextNode(protege_texte(favori[i][0]+" (n = "+favori[i][3]+")")));
			desc.appendChild(document.createElement("br"));
		}
		else {
			haut.getElementById("fav_gow_"+i).className = "fav";
		}
	}
}
function afficher_position_suivant(evt) {
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

	xcase = (xpage-decalh)/coeff-100.0;
	ycase = 100.0-(ypage-decalv)/coeff;
	bulle.style.top = (ypos+3)+'px';
	bulle.style.left = (xpos+16)+'px';
	bulle.style.visibility = 'visible';
	document.getElementById("bulle_haut_gow").innerHTML = "x = "+Math.round(xcase)+", y = "+Math.round(ycase);
	desc = document.getElementById("bulle_desc_gow");
	desc.innerHTML = "";
	for(var i in position_trous) {
		dist = (xcase-position_trous[i][0])*(xcase-position_trous[i][0])+(ycase-position_trous[i][1])*(ycase-position_trous[i][1])-position_trous[i][2]
		if(dist <= 0) {
			desc.appendChild(document.createTextNode(" Trous de M\u00e9t\u00e9orite : n=-1 -> n="+position_trous[i][4]));
			desc.appendChild(document.createElement("br"));
			break;
		}
	}
	xcase = Math.round(xcase);
	ycase = Math.round(ycase);

	//============================ ZZ MOD pour affichage des position de Trolls  =======================================
	bulleInfosTrolls(desc, xcase, ycase);
	//============================ ZZ Fin MOD ================================== =======================================

	for (var i in suivants) {
		if(suivants[i][2] == xcase && suivants[i][3] == ycase ) {
			desc.appendChild(document.createTextNode(suivants[i][1]+", n="+suivants[i][4]))
			desc.appendChild(document.createElement("br"));;
		}
	}
}
function afficher_teleport(evt) {
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
	xcase = (xpage-decalh)/coeff-100.0;
	ycase = 100.0-(ypage-decalv)/coeff;
	bulle.style.top = (ypos+3)+'px';
	bulle.style.left = (xpos+16)+'px';
	bulle.style.visibility = 'visible';

	document.getElementById("bulle_haut_gow").innerHTML = "x = "+Math.round(xcase)+", y = "+Math.round(ycase);
	desc = document.getElementById("bulle_desc_gow");
	desc.innerHTML = "";
	for(var i in position_trous) {
		dist = (xcase-position_trous[i][0])*(xcase-position_trous[i][0])+(ycase-position_trous[i][1])*(ycase-position_trous[i][1])-position_trous[i][2]
		if(dist <= 0) {
			desc.appendChild(document.createTextNode(" Trous de M\u00e9t\u00e9orite : n=-1 -> n="+position_trous[i][4]));
			desc.appendChild(document.createElement("br"));
			break;
		}
	}
	xcase = Math.round(xcase);
	ycase = Math.round(ycase);

	//============================ ZZ MOD pour affichage des position de Trolls  =======================================
	bulleInfosTrolls(desc, xcase, ycase);
	//============================ ZZ Fin MOD ================================== =======================================
	
}
function modifier_coord() {
	a_modifier = this.id.split("_")[1];
	etapes[a_modifier] = [get_opt("etape_"+a_modifier+"_x"), get_opt("etape_"+a_modifier+"_y"), get_opt("etape_"+a_modifier+"_n")];
	if(aj_noeud) {
		aj_noeud = false;
		nb_ajout++;
		document.getElementById("aj_noeud").style.fontWeight = "normal";
	}
	trace_trajet_prev();
	if(point_surligne) {
		point_surligne = etapes[a_modifier];
		surligne();
	}
}
function deplace_noeud(rg, xx, yy) {
	set_opt("etape_"+rg+"_x", xx);
	set_opt("etape_"+rg+"_y", yy);
}
function transition_etape(num, posx, posy) {
	texte = "";
	noeuds = choix_ini? etapes_tt:etapes;
	if(num == 0) {
		ref = depart;
		document.getElementById("etape_depart").className = "etape_surlignee";
	}
	else {
		ref = noeuds[num-1];
		document.getElementById("etape_"+(num-1)).className = "etape_surlignee";
	}
	dist = Math.max(Math.abs(posx-ref[0]), Math.abs(posy-ref[1]))
	n_inter = (noeuds[num][2] > ref[2])? Math.min(noeuds[num][2],ref[2]+dist):Math.max(noeuds[num][2],ref[2]-dist);
	texte += " -> Etape n\u00b0"+(num+1)+", distance : "+dist+" (total : "+(distances[num][0] + dist)+")";
	document.getElementById("bulle_haut_gow").innerHTML += ", n = "+ n_inter;
	document.getElementById("etape_"+num).className = "etape_surlignee";

	return texte;
}
function pile_etape(num) {
	document.getElementById("bulle_haut_gow").innerHTML += ", n = "+etapes[num][2];
	texte = "Etape n\u00b0"+(num+1)+", distance : "+(distances[num+1][0]-distances[num][0])+" (total : "+distances[num+1][0]+")";
	document.getElementById("etape_"+num).className = "etape_surlignee";

	return texte;
}
function pile_etape_ini(num) {
	document.getElementById("bulle_haut_gow").innerHTML += ", n = "+etapes_tt[num][2];
	texte = "Etape n\u00b0"+(num+1)+" ("+["D\u00e9placement","Ebrouissage","Filature"][etapes_tt[num][3]]+"), distance : "+(distances[num+1][0]-distances[num][0])+" (total : "+distances[num+1][0]+")";
	document.getElementById("etape_"+num).className = "etape_surlignee";
	return texte;
}
function start_v(evt){
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

	xcase = Math.round((xpage-decalh)/coeff-100.0);
	ycase = Math.round(100.0-(ypage-decalv)/coeff);

	for (var i = nb_ajout-1; i>=0; i--) {
		if(xcase == etapes[i][0] && ycase == etapes[i][1]) {
			bougeable = true;
			noeud_courant = i;
			break;
		}
	}
}
function cacher_bulle(etat) {
	bulle.style.visibility = etat? "hidden":"visible";
}

function lister_etapes() {
	liste_etapes = document.getElementById("liste_etapes");
	liste_etapes.innerHTML =  "";

	liste_etapes.appendChild(aj_depart());

	if(choix_ini) {
		noeuds = etapes_tt;
		nb_liste = nb_tt;
	}
	else {
		noeuds = etapes;
		nb_liste = nb_ajout;
	}

	for (var i=0 ; i<nb_liste; i++) {
		liste_etapes.appendChild(aj_liste(i, noeuds[i]));
	}
	prepare_inserer();
}
function aj_depart() {
	nvdiv = bloc("depart");
	nvdiv.appendChild(document.createTextNode("D\u00e9part"));
	nvdiv.className = "etape";
	nvdiv.id = "etape_depart";
	nvdiv.appendChild(document.createElement("br"))
	nvdiv.appendChild(document.createTextNode("X = "+depart[0]+", Y =  "+depart[1]+", N = "+depart[2]));
	addEvent(nvdiv, "mouseover", surligne_point, true);
	addEvent(nvdiv, "mouseout", efface_surligne, true);
	return nvdiv;
}
function aj_liste(rg, pt) {
	nvdiv = bloc("etape_"+rg);
	nvdiv.className = "etape";
	nvdiv.appendChild(document.createTextNode("Etape n\u00b0"+(rg+1)+(choix_ini? " ("+["D\u00e9placement","Ebrouissage","Filature"][pt[3]]+")":"")));
	if(!choix_ini) {
		dessin = dessin = creer_icone(12, 12, "Supprimer l'\u00e9tape", effacer_noeud);
		dessin.id = "efface_"+rg
		if (dessin.getContext){
			var ctx = dessin.getContext('2d');
			ctx.lineCap = "round";
			ctx.lineWidth = 2;
			ctx.strokeStyle = "rgb(220,50,50)";
			dessine_svg(ctx, data_svg["suppr"]);
			ctx.stroke();
		}
		addEvent(dessin, "mouseover", surligne_suppr, true);
		addEvent(dessin, "mouseout", efface_surligne, true);
		nvdiv.appendChild(dessin);
	}
	if(cadrable) {
		dessin = dessine_copie();
		addEvent(dessin, "click", copier_action, true);
		nvdiv.appendChild(dessin);
	}
	if(!choix_ini) {
		if(rg > 0) {
			nvdiv.appendChild(aj_monter(rg));
		}
		else {
			dessin = document.createElement("canvas");
			dessin.width = 11;
			dessin.height = 12;
			nvdiv.appendChild(dessin);
		}

		if(rg < (nb_ajout-1)) {
			nvdiv.appendChild(aj_descendre(rg));
		}
	}

	nvdiv.appendChild(document.createElement("br"))
	nvdiv.appendChild(document.createTextNode("X = "));
	nvdiv.appendChild(aj_entree("etape_"+rg+"_x", pt[0]));
	nvdiv.appendChild(document.createTextNode(" Y = "));
	nvdiv.appendChild(aj_entree("etape_"+rg+"_y", pt[1]));
	nvdiv.appendChild(document.createTextNode(" N = "));
	nvdiv.appendChild(aj_entree("etape_"+rg+"_n", pt[2]));
	nvdiv.appendChild(aj_danger(rg));
	nvdiv.appendChild(document.createElement("br"));
	nvdiv.appendChild(enligne("dist_"+rg));
	addEvent(nvdiv, "mouseover", surligne_point, true);
	addEvent(nvdiv, "mouseout", efface_surligne, true);
	return nvdiv;
}
function copier_action() {
	if(!cadrable || (window.parent.frames[1].location.toString().indexOf("/mountyhall/MH_Follower/FO_NewOrder.php") == -1)) return;
	// if(!cadrable || (window.parent.frames[1].location.toString().indexOf("FO_NewOrder") == -1)) return;
	bas = window.parent.frames[1].document;
	typ_ordre = quel_ordre(bas.forms[0]);
	if(typ_ordre != 1 && typ_ordre != 7) return;

	var ref = parseInt(this.parentNode.id.split("_")[1]);
	var position = choix_ini? etapes_tt[ref]:etapes[ref];
	bas.forms[0].elements[1].value = position[0];
	bas.forms[0].elements[2].value = position[1];
	bas.forms[0].elements[3].value = position[2];
}
function copier_depart() {
	if(!cadrable || (window.parent.frames[1].location.toString().indexOf("/mountyhall/MH_Follower/FO_NewOrder.php") == -1)) return;
	// if(!cadrable || (window.parent.frames[1].location.toString().indexOf("FO_NewOrder") == -1)) return;
	bas = window.parent.frames[1].document;
	typ_ordre = quel_ordre(bas.forms[0]);
	if(typ_ordre != 1 && typ_ordre != 7) return;

	bas.forms[0].elements[1].value = depart[0];
	bas.forms[0].elements[2].value = depart[1];
	bas.forms[0].elements[3].value = depart[2];
}
function aj_monter(num) {
	dessin = dessin = creer_icone(11, 12, "Monter", monter_etape);
	dessin.id = "monter_"+num;
	if (dessin.getContext){
		var ctx = dessin.getContext('2d');
		ctx.fillStyle = "rgb(100,170,100)";
		dessine_svg(ctx, data_svg["monter"]);
		ctx.fill();
	}
	addEvent(dessin, "mouseover", surligne_monte, true);
	addEvent(dessin, "mouseout", efface_surligne, true);
	return dessin;
}
function aj_descendre(num) {
	dessin = creer_icone(11, 12, "Descendre", descendre_etape);
	dessin.id = "descendre_"+num
	if (dessin.getContext){
		var ctx = dessin.getContext('2d');
		ctx.fillStyle = "rgb(100,170,100)";
		dessine_svg(ctx, data_svg["descendre"]);
		ctx.fill();
	}
	addEvent(dessin, "mouseover",surligne_descend, true);
	addEvent(dessin, "mouseout", efface_surligne, true);
	return dessin;
}
function aj_danger(num) {
	dessin = creer_canvas("danger_"+num);
	dessin.width = 19;
	dessin.height = 20;
	dessin.title = "Attention trous!";
	dessin.style.visibility = "hidden";
	if (dessin.getContext){
		var ctx = dessin.getContext('2d');
		ctx.beginPath();
		ctx.strokeStyle = "rgb(170,60,60)";
		ctx.fillStyle = "rgb(255,255,255)";
		ctx.lineWidth = 2;
		ctx.lineJoin = "round";
		dessine_svg(ctx, [[0, 9,0], [1, 18,19], [1, 1,19], [1, 9,0]]);
		ctx.fill();
		ctx.stroke();
		ctx.beginPath();
		ctx.fillStyle = "rgb(0,0,0)";
		ctx.strokeStyle = "rgb(0,0,0)";
		ctx.lineCap = "round";
		ctx.moveTo(9,6);
		ctx.lineTo(9,12);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(9,16,1.5,0,Math.PI*2,true);
		ctx.fill();
	}
	return dessin;
}
function surligne_suppr() {
	ini_suppr();
	effacer_tableau(suppr_surligne, parseInt(this.id.split("_")[1]))
	trace_trajet(couleur_surligne, "surligne", depart, suppr_surligne, true);
}
function surligne_monte() {
	ini_suppr();
	rg = parseInt(this.id.split("_")[1])
	temp = suppr_surligne[rg];
	suppr_surligne[rg] = suppr_surligne[rg-1];
	suppr_surligne[rg-1] = temp;
	trace_trajet(couleur_surligne, "surligne", depart, suppr_surligne, true);
}
function surligne_descend() {
	ini_suppr();
	rg = parseInt(this.id.split("_")[1])
	temp = suppr_surligne[rg];
	suppr_surligne[rg] = suppr_surligne[rg+1];
	suppr_surligne[rg+1] = temp;
	trace_trajet(couleur_surligne, "surligne", depart, suppr_surligne, true);
}
function surligne_point() {
	var ref = this.id;
	if(ref == "etape_depart") {
		point_surligne = depart;
	}
	else {
		point_surligne = choix_ini? etapes_tt[parseInt(ref.split("_")[1])]:etapes[parseInt(ref.split("_")[1])];
	}
	dessin = document.getElementById("surligne");
	dessin.width = 200*coeff+2*decalh;
	dessin.height = 200*coeff+2*decalv;
	if (dessin.getContext){
		var ctx = dessin.getContext('2d');
		if(point_surligne[3] == 1) {
			ctx.fillStyle = "rgba(0,0,0,0.8)";
			ctx.strokeStyle = "rgba(0,0,0,0.8)";
			ctx.lineWidth = coeff;
			ctx.fillRect(coord_x(point_surligne[0])-coeff, coord_y(point_surligne[1])-coeff, 2*coeff, 2*coeff);
			ctx.strokeRect(coord_x(point_surligne[0])-3*coeff, coord_y(point_surligne[1])-3*coeff, 6*coeff, 6*coeff);
		}
		else {
			trace_point(ctx, coord_x(point_surligne[0]), coord_y(point_surligne[1]), "rgba(0,0,0,0.8)");
		}
	}
}
function surligne_trajet() {
	var val = parseInt(this.value);
	if(parseInt(val) == 0) {
		trajet_surligne = [depart, etapes[0]];
	}
	else {
		trajet_surligne = [etapes[parseInt(val-1)], etapes[parseInt(val)]];
	}
	dessin = document.getElementById("surligne");
	dessin.width = 200*coeff+2*decalh;
	dessin.height = 200*coeff+2*decalv;
	milieu = [Math.floor((trajet_surligne[0][0]+trajet_surligne[1][0])/2), Math.floor((trajet_surligne[0][1]+trajet_surligne[1][1])/2), Math.floor((trajet_surligne[0][2]+trajet_surligne[1][2])/2), ]
	trace_trajet(couleur_surligne, "surligne", trajet_surligne[0], [milieu, trajet_surligne[1]], true);
}
function efface_surligne() {
	dessin = document.getElementById("surligne");
	dessin.width = 200*coeff+2*decalh;
	dessin.height = 200*coeff+2*decalv;
}
function prepare_inserer() {
	inserer = document.getElementById("inserer_etape");
	inserer.innerHTML = "";
	if(nb_ajout > 0) {
		etik = ["D\u00e9part -> Etape n\u00b01"]; val = [0];
		for (var i = 1; i<nb_ajout; i++) {
			etik.push("Etape n\u00b0"+i+" -> "+(i+1));
			val.push(i);
		}

		entree=document.createElement('select');
		entree.name="sel_ins";
		entree.id="sel_ins";
		for(var i=0; i<etik.length; i++) {
			option=document.createElement('option');
			option.value=val[i];
			option.appendChild(document.createTextNode(etik[i]));
			addEvent(option, "mouseover", surligne_trajet, true);
			addEvent(option, "mouseout", efface_surligne, true);
			entree.appendChild(option);
		}
		entree.value = 0;
		addEvent(entree, "mouseover", surligne_trajet, true);
		addEvent(entree, "mouseout", efface_surligne, true);
		inserer.appendChild(entree);

		aj = bouton("ins", "Ins\u00e9rer une \u00e9tape ");
		addEvent(aj, "click", inserer_milieu, true);
		inserer.appendChild(aj);
	}
}
function raz() {
	ini_tableau();
	nb_ajout = nb_ini;
	choix_ini = false;
	lister_etapes();
	trace_trajet_prev();
}
function efface_trajet() {
	etapes = new Array();
	nb_ajout = 0;
	choix_ini = true;
	lister_etapes();
	trace_trajet_prev();
}
function inserer_milieu() {
	rang = get_opt("sel_ins");
	ref = (rang == 0)? depart:etapes[rang-1];
	inserer_noeud(rang,[Math.floor((ref[0]+etapes[rang][0])/2.0), Math.floor((ref[1]+etapes[rang][1])/2.0), Math.floor((ref[2]+etapes[rang][2])/2.0)]);
}
function inserer_noeud(rg, val) {
	inserer_tableau(etapes, rg, val);
	nb_ajout++;
	lister_etapes();
	trace_trajet_prev();
}
function monter_etape() {
	rg = parseInt(this.id.split("_")[1]);
	temp = etapes[rg];
	etapes[rg] = etapes[rg-1]
	etapes[rg-1] = temp
	lister_etapes();
	trace_trajet_prev();
}
function descendre_etape() {
	rg = parseInt(this.id.split("_")[1]);
	temp = etapes[rg];
	etapes[rg] = etapes[rg+1]
	etapes[rg+1] = temp
	lister_etapes();
	trace_trajet_prev();
}
function effacer_noeud() {
	rang = parseInt(this.id.split("_")[1]);
	effacer_tableau(etapes, rang);
	nb_ajout--;
	if(nb_ajout == 0) {
		choix_ini = true;
	}
	lister_etapes();
	trace_trajet_prev();
}
function calc_dist() {
	ligne_h = new Array(); ligne_v = new Array(); ligne_d = new Array();
	var ref = depart;
	var dx, dy, dh, signe, x_inter, y_inter, d, nb_dla, danger, text_dist;
	distances = [[0, 0]];
	if(choix_ini) {
		noeuds = etapes_tt;
	}
	else {
		noeuds = etapes;
	}
	var dessin = document.getElementById("danger");
	dessin.width = 200*coeff+2*decalh;
	dessin.height = 200*coeff+2*decalv;

	var nb_etape = noeuds.length;
	for(var i=0; i<nb_etape; i++) {
		dx = noeuds[i][0] - ref[0];
		dy = noeuds[i][1] - ref[1];
		dh = Math.max(Math.abs(dx), Math.abs(dy));
		danger = false; chute = new Array();
		if(dx == 0) {
			ligne_v.push([i, ref[0], Math.min(noeuds[i][1], ref[1]), Math.max(noeuds[i][1], ref[1])]);
			danger = calc_inter(noeuds[i][0],Math.min(noeuds[i][1], ref[1]),0,1,dh);
		}
		else if(dy == 0) {
			ligne_h.push([i, Math.min(noeuds[i][0], ref[0]), Math.max(noeuds[i][0], ref[0]), ref[1]]);
			danger = calc_inter(Math.min(noeuds[i][0], ref[0]),noeuds[i][1],1,0,dh);
		}
		else if(dx == dy) {
			signe = (dx*dy > 0)? 1:-1;
			ligne_d.push([i, signe, Math.min(noeuds[i][0], ref[0]), Math.max(noeuds[i][0], ref[0]), ref[1]-signe*ref[0]]);
			if(dx < 0) {
				danger = calc_inter(noeuds[i][0],noeuds[i][1],1,signe,dh);
			}
			else {
				danger = calc_inter(ref[0],ref[1],1,signe,dh);
			}
		}
		else {
			if (Math.abs(dx) < Math.abs(dy)) {
				x_inter = noeuds[i][0];
				y_inter = (dy<0)? ref[1]-Math.abs(dx):ref[1]+Math.abs(dx);
				ligne_v.push([i, x_inter, Math.min(noeuds[i][1], y_inter), Math.max(noeuds[i][1], y_inter)]);
				danger = calc_inter(x_inter,Math.min(noeuds[i][1],y_inter),0,1,Math.abs(noeuds[i][1]-y_inter));
			}
			else {
				x_inter = (dx>0)? ref[0]+Math.abs(dy):ref[0]-Math.abs(dy);
				y_inter = noeuds[i][1];
				ligne_h.push([i, Math.min(noeuds[i][0], x_inter), Math.max(noeuds[i][0], x_inter), y_inter]);
				danger = calc_inter(Math.min(noeuds[i][0],x_inter),y_inter,1,0,Math.abs(noeuds[i][0]-x_inter));
			}
			signe = (dx*dy > 0)? 1:-1;
			ligne_d.push([i, signe, Math.min(x_inter, ref[0]), Math.max(x_inter, ref[0]), ref[1]-signe*ref[0]]);
			if(dx < 0) {
				danger = danger || calc_inter(x_inter,y_inter,1,signe,Math.abs(x_inter-ref[0]));
			}
			else {
				danger = danger || calc_inter(ref[0],ref[1],1,signe,Math.abs(x_inter-ref[0]));
			}

		}
		if(danger) {
			document.getElementById("danger_"+i).style.visibility = "visible";
			trace_trajet(couleur_danger, "danger", ref, [noeuds[i]], false);

			if (dessin.getContext){
				var ctx = dessin.getContext('2d');
				ctx.fillStyle = couleur_chute;
				for (var j in chute) {
					ctx.beginPath();
					ctx.arc(coord_x(chute[j][0]), coord_y(chute[j][1]), coeff*0.50, 0, Math.PI*2,  true);
					ctx.fill();
				}
			}
		}
		else {
			document.getElementById("danger_"+i).style.visibility = "hidden";
		}

		if (document.getElementById("dist_"+i)) {
			d = Math.max(dh, Math.abs(ref[2] - noeuds[i][2]));
			nb_dla = Math.ceil(parseFloat(d)/parseFloat(typ_gow));
			if(i==0) {
				text_dist = "Distance : "+d+", DLA : "+nb_dla;
				if(dla) { text_dist += ", dur\u00e9e : "+format_tps(parseFloat(nb_dla)*dla); }
				document.getElementById("dist_"+i).innerHTML = text_dist;
				distances[i+1] = ([d+distances[i][0], nb_dla+distances[i][1]]);
			}
			else {
				text_dist = "Distance : "+d+" / total : "+(d+distances[i][0])+", DLA : "+nb_dla+" / "+(nb_dla+distances[i][1]);
				if(dla) { text_dist += ", dur\u00e9e : "+format_tps(parseFloat(nb_dla)*dla)+" / "+format_tps(parseFloat(nb_dla+distances[i][1])*dla); }
				document.getElementById("dist_"+i).innerHTML = text_dist;
				distances[i+1] = ([d+distances[i][0], nb_dla+distances[i][1]]);
			}

		}
		ref = noeuds[i];
	}
}
function calc_inter(x0,y0,px,py,tmax) {
	var res = false, a = 0, b = 0, c = 0, delta = 0, t0 = 0, t1 = 0;

	for(var k in position_trous) {
		a = parseFloat(px*px+py*py);
		b = parseFloat((x0-position_trous[k][0])*px+(y0-position_trous[k][1])*py);
		c = parseFloat((x0-position_trous[k][0])*(x0-position_trous[k][0])+(y0-position_trous[k][1])*(y0-position_trous[k][1])-position_trous[k][2]);
		delta = b*b-a*c
		if(delta >= 0) {
			t0 = Math.ceil(-b/a-Math.sqrt(delta)/a);
			t1 = Math.floor(-b/a+Math.sqrt(delta)/a);
			if(t0 <= tmax && t1 >= 0) {
				res = true;
				for(var l=Math.max(0,t0); l<=Math.min(tmax,t1); l++) {
					chute.push([x0+l*px, y0+l*py]);
				}
			}
		}
	}
	return res;
}
function format_tps(tps) {
	var jours = Math.floor(tps/1440);
	var heures = tps%1440;
	var minutes = heures%60
	heures = Math.floor(heures/60);
	return (jours? jours+"jr ":"")+heures+"h "+minutes+"mn";
}
function ini_trajet() {
	var ind_a = -1;
	var pos = document.getElementsByTagName('b')[1].innerHTML.split(/[\(,\)]/g);

	if(pos.length < 4) {
		noeud = document.getElementsByTagName("form")[0].getElementsByTagName("table")[1].getElementsByTagName("tr")[1].getElementsByTagName("td")[1];
		pos = noeud.innerHTML.match(/X = (-?\d+) \| Y = (-?\d+) \| N = (-?\d+)/);
	}
	else {
		noeud = document.getElementsByTagName('b')[1];
	}

	depart = [parseInt(pos[1]),parseInt(pos[2]),parseInt(pos[3])];
	expreg = /(.*) .*X=(-?\d+) \| Y=(-?\d+) \| N=(-?\d+)/;
	expreg2 = /Suivre\u00a0(.+) \(\d+\) \u00e0 une distance de (\d+) case/;
	lignes = document.getElementsByTagName('tr');

	if(cadrable) {
		var dessin = dessine_copie();
		dessin.style.marginLeft = "4px";
		addEvent(dessin, "click", copier_depart, true);
		noeud.appendChild(dessin);
	}

	charge_trajet(); introspection();
	// soi = [-53, 18, -245, "feldspath"];

	etapes_ini = new Array(); arret = new Array(); nb_ini = 0;
	for(var i=0;i<lignes.length;i++) {
		if(lignes[i].className == "mh_tdpage_fo") {
			ordre = lignes[i].getElementsByTagName('td')[2].firstChild.nodeValue;
			point = ordre.match(expreg);
			if(point) {
				etapes_ini.push([parseInt(point[2]),  parseInt(point[3]),  parseInt(point[4]), (point[1] != "D\u00e9placement")]);
				nb_ini++;
			}
			else if(ordre.match(/Arr\u00eat/)) {
				arret.push([-1, nb_ini]); ind_a = nb_ini;
			}
			else {
				point = ordre.match(expreg2);
				if(point) {
					if(soi && soi[3] == point[1]) {
						arret.push([parseInt(point[2]), nb_ini]);
					}
					else {
						arret.push([-1, nb_ini]);
					}
					ind_a = nb_ini;
				}
			}
		}
	}
	if(ind_a != nb_ini) arret.push([-1, nb_ini]);
	nb_a = arret.length;
	nb_ajout = etapes.length;
	calc_etapes();

	declare_css();
	ini_canvas();
	trace_glissiere();
	echelle_trajet() ;
	creer_bulle_trajet();
	lister_etapes(); charger_fav(); lister_fav();
	trace_trajet_prev();
}
function introspection() {
	if(window.parent && window.parent.parent && window.parent.parent.frames.length > 1) {
		var pos = (window.parent.parent.frames[0].document.getElementsByTagName('div')[1].innerHTML).match(/X=(-?\d+)\|Y=(-?\d+)\|N=(-?\d+)/);
		if(pos) {
			soi = [parseInt(pos[1]), parseInt(pos[2]), parseInt(pos[3]), window.parent.parent.frames[0].document.getElementsByTagName('a')[0].firstChild.innerHTML];
		}
	}
}
function calc_etapes() {
	var continu = true, deb = 0, fin = 0, dx, dy, dn, dxa, dya, dna, inter, suivre = false;
	ref = depart;
	for(var i in arret) {
		fin = arret[i][1];
		if(deb != fin) {
			for(var j=deb; j<fin; j++) {
				etapes_tt.push([etapes_ini[j][0], etapes_ini[j][1], etapes_ini[j][2], etapes_ini[j][3]? 1:0]);
			}
			ref = etapes_ini[fin-1];
		}
		if(arret[i][0] != -1) {
			dx = soi[0] - ref[0];
			dy = soi[1] - ref[1];
			dn = soi[2] - ref[2];
			dxa = Math.max(Math.abs(dx)-arret[i][0], 0);
			dya = Math.max(Math.abs(dy)-arret[i][0], 0);
			dna = Math.max(Math.abs(dn)-arret[i][0], 0);
			inter = [ref[0]+((dx>0)? dxa:-dxa), ref[1]+((dy>0)? dya:-dya), ref[2]+((dn>0)? dna:-dna)];
			etapes_tt.push([inter[0], inter[1], inter[2], 2]);
		}
		deb = fin;
	}
	nb_tt = etapes_tt.length;
}
function echelle_trajet() {
	trace_trou();
	trace_position(depart);
	document.getElementById("cadre_liste").style.left = 200*coeff+2*decalh+5+"px";
	trace_reel(couleur_reel, "trou", depart, etapes_ini, arret, false);
	efface_surligne();
}
function echelle_position() {
	trace_trou();
	for(var i in suivants) {
		trace_position([suivants[i][2], suivants[i][3]]);
		aleatoire = 50+Math.round(155.0*i/nbs);
		if(t_prev && suivants[i][6]) {
			trace_trajet("rgba(0,"+aleatoire+",0,0.6)", "trou", [suivants[i][2], suivants[i][3]], suivants[i][6], false);
		}
		if(t_enreg && suivants[i][5]) {
			trace_reel(aleatoire, "trou", [suivants[i][2], suivants[i][3]], suivants[i][5], suivants[i][7], false);
		}
	}
}
function trace_reel(couleur, ou, ref, noeuds, transition, refaire) {
	var continu = true, deb = 0, fin = 0, dx, dy, dxa, dya, inter, suivre = false;
	for(var i in transition) {
		fin = transition[i][1];
		if(deb != fin && suivre) {
			trace_trajet("rgba("+couleur+",0,"+couleur+(continu? ",0.6)":",0.2)"), ou, ref, [noeuds[deb]], refaire);
			ref = noeuds[deb];
			deb++;
			suivre = false;
		}
		if(deb != fin) {
			var points = new Array();
			for(var j=deb; j<fin; j++) {
				points.push(noeuds[j]);
			}
			trace_trajet("rgba(0,0,"+couleur+(continu? ",0.6)":",0.2)"), ou, ref, points, refaire);
			ref = noeuds[fin-1];
		}
		if(transition[i][0] != -1 && soi) {
			dx = soi[0] - ref[0];
			dy = soi[1] - ref[1];
			dxa = Math.max(Math.abs(dx)-transition[i][0], 0);
			dya = Math.max(Math.abs(dy)-transition[i][0], 0);
			if(dxa >0 || dya >0) {
				inter = [ref[0]+((dx>0)? dxa:-dxa), ref[1]+((dy>0)? dya:-dya)];
				trace_trajet("rgba("+couleur+",0,"+couleur+(continu? ",0.6)":",0.2)"), ou, ref, [inter], refaire);
				ref = inter;
				suivre = true;
			}
		}
		continu = false;
		deb = fin;
	}
}
function echelle_teleport() {
	trace_trou();
	trace_sortie(sortie);
}
function ini_position() {
	ligne = document.getElementsByTagName("form")[0].getElementsByTagName("tbody")[0].childNodes;
	nbs = 0;
	for (var i=0;i<ligne.length;i++) {
		if (ligne[i].className == "mh_tdtitre") {
			num_gow = ligne[i].getElementsByTagName('a')[0].href.split("=")[1];
			nom = trim(ligne[i].getElementsByTagName('a')[0].firstChild.nodeValue);
			point = ligne[i].getElementsByTagName('tr')[1].getElementsByTagName('td')[1].innerHTML.match(/X = (-?\d+) \| Y = (-?\d+) \| N = (-?\d+)/);
			charge_trajet();
			suivants[nbs] = [num_gow, nom, parseInt(point[1]), parseInt(point[2]), parseInt(point[3]), etapes_ini, etapes, arret];
			nbs++;
		}
	}
	if(nbs > 0) {
		charge_opt_position();
		declare_css();
		var trajet = bloc("carte_trajet");

		var dessin = creer_canvas("trou");
		dessin.className = "mh_tdpage";
		addEvent(dessin, "mousemove", afficher_position_suivant, true);
		addEvent(dessin, "mouseout", function() { cacher_bulle(true) }, true);
		addEvent(dessin, "mouseover",  function() { cacher_bulle(false) }, true);
		trajet.appendChild(dessin);

		var div_gliss = creer_glissiere("gow", zoom);
		div_gliss.appendChild(aj_opt("opt_enreg", "Trajets enregistr\u00e9s", t_enreg));
		addEvent(div_gliss.lastChild.firstChild, "click", alterne_trajet, true);
		div_gliss.appendChild(aj_opt("opt_prev", "Trajets pr\u00e9visionnels", t_prev));
		addEvent(div_gliss.lastChild.firstChild, "click", alterne_trajet, true);
		trajet.appendChild(div_gliss);

		parp = document.getElementsByTagName('p');
		parp[parp.length-1].insertBefore(trajet,parp[parp.length-1].firstChild);
		introspection();
		trace_trou();
		trace_glissiere();
		echelle_position();
		creer_bulle_trajet();
	}
}
function ini_teleport() {
	pos = corps_page.innerHTML.match(/ en X = (-?\d+) \| Y = (-?\d+) \| N = (-?\d+)\./);
	sortie = [parseInt(pos[1]), parseInt(pos[2])];
	declare_css();

	trajet = bloc("carte_trajet");

	dessin = creer_canvas("trou");
	dessin.className = "mh_tdpage";
	addEvent(dessin, "mousemove", afficher_teleport, true);
	addEvent(dessin, "mouseout", function() { cacher_bulle(true) }, true);
	addEvent(dessin, "mouseover",  function() { cacher_bulle(false) }, true);
	trajet.appendChild(dessin);

	trajet.appendChild(creer_glissiere("gow", zoom));

	parp = document.getElementsByTagName('p');
	parp[parp.length-1].insertBefore(trajet,parp[parp.length-1].firstChild)

	trace_glissiere();
	echelle_teleport();
	creer_bulle_trajet();
}
function alterne_trajet() {
	if(this.id == "opt_enreg") {
		t_enreg = !t_enreg;
	}
	else {
		t_prev = !t_prev;
	}
	sauve_opt_position();
	echelle_position();
}
function ini_tableau() {
	etapes = new Array();
	for(var i in etapes_ini) {
		etapes[i] = etapes_ini[i];
	}
}
function ini_suppr() {
	suppr_surligne = new Array();
	for(var i in etapes) {
		suppr_surligne[i] = etapes[i];
	}
}
//////////////////////////
//destinations favorites
function dessine_fermer(dessin) {
	if (dessin.getContext){
		var ctx = dessin.getContext('2d');
		ctx.lineCap = "round"
		ctx.strokeStyle = "rgb(80,80,80)";
		ctx.lineWidth = "1.5";
		dessine_svg(ctx, data_svg["fermer"]);
		ctx.stroke();
	}
}
function creer_bulle_zoom() {
	if(haut.getElementById("bulle_zoom")) return;
	var bulle_fav = bloc("bulle_zoom");
	bulle_fav.className = "mh_tdpage";
	haut.body.appendChild(bulle_fav);
}
function echelle_fav() {
	coeff = zoom_fav/50.0;
	haut.getElementById("liste_fav_gow").style.marginLeft = (4*zoom_fav+2*decalh+5)+"px";
	haut.getElementById("cadre_fav").style.minHeight = (4*zoom_fav+2*decalv+40)+"px";
	var gestion = haut.getElementById("gestion_fav_gow");
	gestion.style.left = Math.max(1, haut.body.clientWidth+haut.body.scrollLeft-2-gestion.offsetWidth)+"px";

	trace_trou_fav();
	place_fav();
	coeff = zoom/50.0;
}
function ini_gestion() {
	haut = (page_trajet == "action")? window.parent.frames[0].document:document;
	if(MZ_getValue("zoom_fav")) {
		zoom_fav = parseFloat(MZ_getValue("zoom_fav"))
	}
	if (!haut.getElementById("gestion_fav_gow")) {
		declare_css();
		gestion = bloc("gestion_fav_gow");
		gestion.className = "mh_tdpage";

		var nvdiv = bloc("titre_fav");
		nvdiv.className = "mh_tdtitre";
		nvdiv.appendChild(document.createTextNode("Gestion des destinations favorites"));
		var fermer = creer_icone(15, 15, "Fermer", function() { this.parentNode.parentNode.style.visibility = "hidden" });
		dessine_fermer(fermer);
		nvdiv.appendChild(fermer);
		gestion.appendChild(nvdiv);
		var carte_fav = bloc("cadre_fav");

		carte_fav.appendChild(creer_canvas("trou_fav"));
		var dessin = creer_canvas("trace_fav");
		addEvent(haut, "mouseup", drop, true);
		addEvent(haut, "mousemove", glisse, true);
		addEvent(dessin, "mousemove", afficher_fav, true);
		addEvent(dessin, "click", aj_pos, true);
		addEvent(dessin, "mouseout", function() { cacher_bulle(true) }, true);
		addEvent(dessin, "mouseover",  function() { cacher_bulle(false) }, true);
		carte_fav.appendChild(dessin);

		carte_fav.appendChild(creer_glissiere("fav", zoom_fav));
		carte_fav.appendChild(bloc("liste_fav_gow"));
		gestion.appendChild(carte_fav);
		haut.body.appendChild(gestion);

		trace_glissiere_fav();
	}
	else if(haut.getElementById("gestion_fav_gow").style.visibility == "visible") {
		haut.getElementById("gestion_fav_gow").style.visibility = "hidden";
		return;
	}
	charger_fav();
	gerer_fav(); echelle_fav(); poser_fav(); creer_bulle_trajet();
}
function gerer_fav() {
	var gestion = haut.getElementById("gestion_fav_gow");
	gestion.style.visibility = "visible";

	var liste_fav = haut.getElementById("liste_fav_gow");
	liste_fav.innerHTML = "";
	for(var i=0; i<nb_fav; i++) {
		liste_fav.appendChild(bloc("fav_gow_"+i));
		aff_fav(i);
	}
	aj_edit();
}
function poser_fav() {
	var gestion = haut.getElementById("gestion_fav_gow");
	if(page_trajet == "action") {
		gestion.style.top = (haut.body.clientHeight+haut.body.scrollTop-2-gestion.offsetHeight)+"px";
	}
	else {
		var noeud = document.getElementById("ligne_fav");
		var ecart = noeud.offsetHeight+1;
		while(noeud.offsetParent) {
			ecart += noeud.offsetTop;
			noeud = noeud.offsetParent;
		}
		gestion.style.top = ecart+"px";
	}
	gestion.style.left = Math.max(1, haut.body.clientWidth+haut.body.scrollLeft-2-gestion.offsetWidth)+"px";
}
function aff_fav(rg) {
	var fav = haut.getElementById("fav_gow_"+rg);
	fav.innerHTML = "";
	fav.className = "fav";
	var texte = protege_texte(favori[rg][0])+" ("+favori[rg][1]+", "+favori[rg][2]+", "+favori[rg][3]+")";
	fav.appendChild(document.createTextNode(texte));

	dessin = creer_icone(11, 12, "Supprimer "+texte, effacer_fav);
	if (dessin.getContext){
		var ctx = dessin.getContext('2d');
		ctx.strokeStyle = "rgb(200,100,100)";
		ctx.lineCap = "round";
		ctx.lineWidth = "2";
		dessine_svg(ctx, data_svg["suppr"]);
		ctx.stroke();
	}
	fav.appendChild(dessin);

	dessin = creer_icone(12, 12, "Editer "+texte, editer_fav);
	if (dessin.getContext){
		var ctx = dessin.getContext('2d');
		ctx.strokeStyle = "rgb(30,30,30)";
		ctx.fillStyle = "rgb(180,180,180)";
		var echelle = 12.0/21.0;
		ctx.scale(echelle, echelle);
		ctx.lineWidth = "1";
		dessine_svg(ctx, data_svg["param"]);
		ctx.stroke();
		ctx.fill();
	}
	fav.appendChild(dessin);

	dessin = creer_icone(11, 12, "Descendre "+texte, descendre_fav);
	if (dessin.getContext){
		var ctx = dessin.getContext('2d');
		ctx.fillStyle = "rgb(100,170,100)";
		dessine_svg(ctx, data_svg["descendre"]);
		ctx.fill();
	}
	if(rg == nb_fav-1) dessin.style.visibility = "hidden";
	fav.appendChild(dessin);

	dessin = creer_icone(11, 12, "Monter "+texte, monter_fav);
	if (dessin.getContext){
		var ctx = dessin.getContext('2d');
		ctx.fillStyle = "rgb(100,170,100)";
		dessine_svg(ctx, data_svg["monter"]);
		ctx.fill();
	}
	fav.appendChild(dessin);
	if(rg == 0) dessin.style.visibility = "hidden";
}
function monter_fav() {
	var ref = parseInt(this.parentNode.id.split("_")[2])

	var temp = favori[ref-1];
	favori[ref-1] = favori[ref];
	favori[ref] = temp;
	sauver_fav(); lister_fav(); gerer_fav();
}
function descendre_fav() {
	var ref = parseInt(this.parentNode.id.split("_")[2]);

	var temp = favori[ref+1];
	favori[ref+1] = favori[ref];
	favori[ref] = temp;
	sauver_fav(); lister_fav(); gerer_fav();
}
function effacer_fav() {
	favori.splice(parseInt(this.parentNode.id.split("_")[2]),1);
	nb_fav--;
	sauver_fav(); lister_fav();
	gerer_fav();
	trace_fav();
}
function editer_fav() {
	var rg = parseInt(this.parentNode.id.