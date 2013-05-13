// ==UserScript==
// @name MH - Carte des raccourcis
// @include http://games.mountyhall.com/mountyhall/MH_Play/Actions/Play_a_Raccourcis.php?ai_IdAction=524&*
// @include http://serv01.mountyhall.com/mountyhall/MH_Play/Actions/Play_a_Raccourcis.php?ai_IdAction=524&*
// @description Aide a l'utilisation des cartes de raccourcis. Version 1.0 du 22 aout 2011 par Feldspath (34422)
// @injectframes 1
// ==/UserScript==

var ie = (window.attachEvent)? true:false;
if ("function" != typeof addEvent) {
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
}
if("function" != typeof MZ_getValue) {
	if(typeof localStorage == "object") {
		function MZ_getValue(nom) {
			return localStorage.getItem(nom);
		}
		function MZ_setValue(nom,valeur) {
			localStorage.setItem(nom,valeur);
		}
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

var lien =  window.self.location.toString().match(/\/mountyhall\/MH_Play\/Actions\/Play_a_Raccourcis\.php\?ai_IdAction=524&.*ai_PosX=(-?\d+)&ai_PosY=(-?\d+)&ai_PosN=(-?\d+)/);
// lien = ["blabla", 10, 20, -30];
if(lien) {
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
	function declare_css() {
		if(haut.getElementById("css_carte")) return;
		css = "#gestion_fav_carte { position:absolute; padding: 1px; border-width:1px; border-style:solid; min-width:300px; z-index:3000; }\n#titre_fav, .fav, .fav_dessus { min-height:15px; }\n.fav  { margin:0; margin:0 0 -1px 0; padding: 1px 1px 1px 1px; border : 1px solid #a1927f; }\n.fav_dessus { margin:-1px; margin:-1px -1px -2px -1px; padding: 0px 1px 0px 1px; border : 2px solid #a1927f; }\n\n.a_cliquer { position: relative; float: right; cursor:pointer; margin-left: 2px; }\n\n#glissiere_niv, #desc_niv { position: absolute; }\n#cadre_carte { position: absolute; z-index:2500; boder-width:1px; border-style:solid; }\n#trou_carte, #sortie_carte { position: absolute; top: 0px; left: 0px; }\n#trou_fav, #trace_fav { position: absolute; top: 20px; left: 0px; }\n.choix_zoom { position: relative; margin-left:30px; margin-top:2px; }\n#glissiere_carte, #glissiere_fav { position: relative; }\n\n#bulle_carte {\n	visibility:hidden;\n	position:absolute; z-index:3500;\n	width:400px;\n	border-width:1px; border-style:solid; border-color:#a1927f;\n}\n.bulle_haut  { font-weight:bold; text-align:left; padding:2px; }\n#bulle_desc_carte { font-size:11px; padding:2px; }\n#cadre_fav { position: relative; }\n#bulle_zoom { display:block !important; visibility: hidden; position: absolute; z-index: 3500;  border : 1px solid  #a1927f; }";

		var node = document.createElement("style");
		node.type = "text/css";
		node.id = "css_carte";
		node.appendChild(document.createTextNode(css));
		haut.getElementsByTagName("head")[0].appendChild(node);
	}
	function trace_trou(ref) {
		dessin = haut.getElementById(ref);
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
	function trace_lieux() {
		dessin = haut.getElementById("carte_lieux");
		dessin.width = 4*zoom_fav+2*decalh;
		dessin.height = 4*zoom_fav+2*decalv;

		if (dessin.getContext){
			var ctx = dessin.getContext('2d');

			for (var i in lieux) {
				for (var j in lieux[i]) {
					var ecart = Math.min((maxi-lieux[i][j][0][2])/delta, 1);
					trace_point(ctx, coord_x(parseInt(i)), coord_y(parseInt(j)), "rgb(50,"+(150-Math.round(100.0*ecart))+","+(50+Math.round(100.0*ecart))+")")
				}
			}
			
			xx = coord_x(posx); yy = coord_y(posy);
			ctx.strokeStyle = "rgb(50,50,150)";
			ctx.lineWidth = coeff;
			ctx.beginPath();
			ctx.arc(xx, yy, 3*coeff, 0, Math.PI*2,  true);
			ctx.moveTo(xx, yy-3*coeff);
			ctx.lineTo(xx, yy+3*coeff);
			ctx.moveTo(xx-3*coeff, yy);
			ctx.lineTo(xx+3*coeff, yy);
			ctx.stroke();
		}
	}
	function montrer_lieu(texte) {
		var coord = texte.match(/^\d+ .+ \((-?\d+);(-?\d+);-?\d+\)$/)
		if(!coord) return;
		dessin = haut.getElementById("carte_lieux");

		if (dessin.getContext){
			var ctx = dessin.getContext('2d');
			trace_point(ctx, coord_x(parseInt(coord[1])), coord_y(parseInt(coord[2])), "rgb(0,0,0)")
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
		dessine_glissiere("carte", Math.min(99,Math.max(0,Math.round(zoom/2.0)-25)));
	}

	function ini_glisse(evt) {
		xpage = (evt.offsetX)? evt.offsetX:evt.layerX;
		zoom = Math.min(250,Math.max(50,(xpage+23.0)*2.0));
		MZ_setValue("zoom_carte", zoom)
		trace_glissiere();
		haut.getElementById("val_zoom_carte").innerHTML = zoom+"%";
		coeff = zoom/50.0;
		echelle_carte();
		glissable = true;
		this.style.cursor = "e-resize";
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

		curseur = Math.min(100,Math.max(0,Math.round(zoom/2.0)-25))+2;
		this.style.cursor = (xpage <= (curseur+2) && xpage >= (curseur-2)) ? "e-resize":"pointer";
		val = Math.min(250,Math.max(50,(xpage+23.0)*2.0));

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
			MZ_setValue("zoom_carte", zoom)
			trace_glissiere();
			haut.getElementById("val_zoom_carte").innerHTML = zoom+"%";
			coeff = zoom/50.0;
			echelle_carte();
		}
	}
	function drop_t() {
		glissable = false;
		bougeable = false;
	}
	function afficher_carte(evt) {
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

		xcase = Math.round((xpage-decalh)/coeff-100.0);
		ycase = Math.round(100.0-(ypage-decalv)/coeff);
		bulle.style.top = (ypos+8)+'px';
		bulle.style.left = (xpos+16)+'px';
		bulle.style.visibility = "visible";

		haut.getElementById("carte_lieux").style.cursor = "";
		haut.getElementById("bulle_haut_carte").innerHTML = "x = "+Math.round(xcase)+", y = "+Math.round(ycase);
		desc = haut.getElementById("bulle_desc_carte");
		desc.innerHTML = "";
		if(lieux[xcase] && lieux[xcase][ycase]) {
			haut.getElementById("carte_lieux").style.cursor = "pointer";
			var nb_lieux = lieux[xcase][ycase].length;
			for(var i=0; i<nb_lieux; i++) {
				var nvdiv = document.createElement("div");
				nvdiv.appendChild(document.createTextNode("["+lieux[xcase][ycase][i][0]+"] "+lieux[xcase][ycase][i][1]+", n = "+lieux[xcase][ycase][i][2]));
				nvdiv.id = "lieu_"+lieux[xcase][ycase][i][0];
				addEvent(nvdiv, "click", function() { change_lieu(this.id.split("_")[1]); }, true);
				desc.appendChild(nvdiv);
			}
		}
		for(var i in position_trous) {
			dist = (xcase-position_trous[i][0])*(xcase-position_trous[i][0])+(ycase-position_trous[i][1])*(ycase-position_trous[i][1])-position_trous[i][2]
			if(dist <= 0) {
				desc.appendChild(document.createTextNode(" Trous de M\u00e9t\u00e9orite : n=-1 -> n="+position_trous[i][4]));
				desc.appendChild(document.createElement("br"));
				break;
			}
		}
	}
	function sel_lieu(evt) {
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

		xcase = Math.round((xpage-decalh)/coeff-100.0);
		ycase = Math.round(100.0-(ypage-decalv)/coeff);

		if(lieux[xcase] && lieux[xcase][ycase]) {
			change_lieu(lieux[xcase][ycase][0][0]);
		}
	}
	function change_lieu(ref) {
		document.getElementsByTagName("select")[0].value = ref;
	}

	function cacher_bulle(etat) {
		bulle.style.visibility = etat? "hidden":"visible";
	}
	function ini_carte() {
		if(!cadrable) return;

		haut = window.parent.frames[0].document;

		if(haut.getElementById("cadre_carte")) {
			cadre = haut.getElementById("cadre_carte");
			if(cadre.style.display != "none"  && initialise) {
				cadre.style.display = "none";
				return;
			}
			cadre.style.display = "block";
			cadre.style.top = (haut.body.scrollTop+2)+"px";
			cadre.style.left = (haut.body.scrollLeft+2)+"px";
			echelle_carte();
			return;
		}
		declare_css();

		cadre = bloc("cadre_carte");
		cadre.className = "mh_tdpage";
		cadre.style.top = (haut.body.scrollTop+2)+"px";
		cadre.style.left = (haut.body.scrollLeft+2)+"px";
		cadre.style.display = "block";

		var fermer = creer_icone(15, 15, "Fermer", function() { this.parentNode.style.display = "none" });
		dessine_fermer(fermer);
		cadre.appendChild(fermer);

		trajet = bloc("carte_carte");
		trajet.style.position = "absolute";

		trajet.appendChild(creer_canvas("trou_carte"));
		var dessin = creer_canvas("carte_lieux");
		dessin.style.position = "absolute";
		addEvent(haut, "mousemove", glisse, true);
		addEvent(dessin, "click", sel_lieu, true);
		addEvent(haut, "mouseup", drop_t, true);
		addEvent(dessin, "mousemove", afficher_carte, true);
		addEvent(dessin, "mouseout", function() { cacher_bulle(true) }, true);
		addEvent(dessin, "mouseover",  function() { cacher_bulle(false) }, true);
		trajet.appendChild(dessin);

		trajet.appendChild(creer_glissiere("carte", zoom));

		cadre.appendChild(trajet);
		haut.body.appendChild(cadre);

		trace_glissiere();
		creer_bulle_carte(); creer_bulle_zoom();
		echelle_carte();
	}
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
	function creer_bulle_carte() {
		if(haut.getElementById("bulle_carte")) return;
		haut.body.appendChild(bloc("bulle_carte"));
		bulle = haut.getElementById("bulle_carte");
		bulle.className = "mh_tdtitre";
		nvdiv = bloc("mobile_bulleVue_carte");
		nvdiv.className = "bulle_haut_carte";
		nvdiv.appendChild(enligne("bulle_haut_carte"));
		bulle.appendChild(nvdiv);
		bulle.appendChild(bloc("bulle_desc_carte"));
		bulle.lastChild.className = "mh_tdpage";
	}
	function creer_bulle_zoom() {
		if(haut.getElementById("bulle_zoom")) return;
		var bulle_fav = bloc("bulle_zoom");
		bulle_fav.className = "mh_tdpage";
		haut.body.appendChild(bulle_fav);
	}
	function echelle_carte() {
		haut.getElementById("cadre_carte").style.height = (200*coeff+2*decalv+20)+"px";
		haut.getElementById("cadre_carte").style.minWidth = (200*coeff+2*decalh+35)+"px";
		trace_trou("trou_carte");
		trace_lieux();
	}
	function echelle_fav() {
		coeff = zoom_fav/50.0;
		haut.getElementById("liste_fav_carte").style.marginLeft = (4*zoom_fav+2*decalh+5)+"px";
		haut.getElementById("cadre_fav").style.minHeight = (4*zoom_fav+2*decalv+40)+"px";
		var gestion = haut.getElementById("gestion_fav_carte");
		gestion.style.left = Math.max(1, haut.body.clientWidth+haut.body.scrollLeft-2-gestion.offsetWidth)+"px";
		trace_trou("trou_fav");
		place_fav();
		coeff = zoom/50.0;
	}

	////////////////////////////////////////////////////////////

	var data_img = new Array();
	var data_svg = new Array();
	data_svg["fermer"] = [[3,7, 7, 6.5],[0,4.5, 4.5],[1,9.5, 9.5],[0,9.5, 4.5],[1,4.5, 9.5]];

	var coeff=2, decalv=30, decalh=30;
	var position_trous = [[-70.5, -7.5, 2, 1.5, -69], [-66.5, -37.5, 2, 1.5, -69], [-63.5, 8.5, 2, 1.5, -69], [-59.5, -32.5, 2, 1.5, -69], [-52, 57, 0.25, 0.8, -59], [-50.5, -22.5, 2, 1.5, -69], [-35.5, -51.5, 2, 1.5, -69], [-34.5, 14.5, 2, 1.5, -69], [-34.5, 64.5, 2, 1.5, -69], [-11.5, 72.5, 2, 1.5, -69], [5.5, -49.5, 2, 1.5, -69], [5.5, 31.5, 2, 1.5, -69], [10.5, 63.5, 2, 1.5, -69], [12, -15, 0.25, 0.8, -59], [21.5, 35.5, 2, 1.5, -69], [30, -52, 0.25, 0.8, -59], [46.5, 51.5, 2, 1.5, -69], [48, -39, 0.25, 0.8, -59], [55, 70, 0.25, 0.8, -69], [56.5, 23.5, 75, 8.7, -99], [64, 70, 0.25, 0.8, -59], [74.5, 31.5, 2, 1.5, -69]];
	var bulle = null;
	var favori = new Array(), nb_fav=0, nv_pt = null, retrace_fav = false;
	var haut = null;
	var cadrable = window.parent && window.parent.frames.length > 1 && window.parent.frames[0].document;
	var zoom_fav = 100;


	if(cadrable) {
		data_img["carte"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYBAMAAAASWSDLAAAAAXNSR0IArs4c6QAAACRQTFRFZBcScyYjTEU/dm1hk4J4pZSJyban3Me25dC/8dvL/uHS/OfWEvrSsAAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADeUAAA3lAebqaa8AAAAHdElNRQfaCxMTKRANnM4vAAAAiUlEQVQY02NgFIQDAQbp3btWz1w5EwQ2MkhXdHSUA8HMmTMmMkh3794NRDt2796JxpHCwVmIrGwhgyTQNCBqB6KJDJLVMJntQD0gzs4yCAcss9kNygEboIrMMY0AchZCOdErIDLIRkvNhhm9YyODJDGchWgyUG8DTQOGwa7du3ev3g0CGxmQgwoAO1+fU9dLcv4AAAAASUVORK5CYII=";

		var posx = parseInt(lien[1]), posy = parseInt(lien[2]), posn = parseInt(lien[3]), coord, xx, yy, nn, mini = 0, maxi = -1000, delta;
		var lieux = new Array();
		var bougeable = false, glissable = false, initialise = false, simple = true;
		var zoom=100;
		if(MZ_getValue("zoom_carte")) {
			zoom = parseFloat(MZ_getValue("zoom_carte"));
			coeff = zoom/50.0;
		}

		var choix = document.getElementsByTagName("select")[0];
		addEvent(choix, "mouseover", function() { montrer_lieu(this.text); }, true);
		addEvent(choix, "mouseout", echelle_carte, true);
		
		var liste = choix.getElementsByTagName("option");
		var nb_choix = liste.length;
		for(var i=1; i<nb_choix; i++) {
			addEvent(liste[i], "mouseover", function() { montrer_lieu(this.innerHTML); }, true);
			addEvent(liste[i], "mouseout", echelle_carte, true);
			coord = liste[i].innerHTML.match(/^(\d+) (.+) \((-?\d+);(-?\d+);(-?\d+)\)$/);
			xx = parseInt(coord[3]); yy = parseInt(coord[4]); nn = parseInt(coord[5]);
			if(!lieux[xx]) {
				lieux[xx] = new Array();
				lieux[xx][yy] = [[coord[1], coord[2], nn]];
			}
			else if(!lieux[xx][yy]) {
				lieux[xx][yy] = [[coord[1], coord[2], nn]];
			}
			else {
				lieux[xx][yy].push([coord[1], coord[2], nn]);
			}
			mini = Math.min(mini, nn);
			maxi = Math.max(maxi, nn);
		}
		delta = Math.min(maxi-mini, 70);
		if(!delta) delta = 1;

		//icone
		var nvdiv = bloc("div_fav");
		nvdiv.className = "mh_tdpage";
		if(cadrable) {
			var carte = document.createElement("img");
			carte.src = data_img["carte"];
			carte.id = "lance_carte";
			addEvent(carte, "click", ini_carte, true);
			carte.title = "Ouvrir la carte";
			carte.style.cursor = "pointer";
			nvdiv.appendChild(carte);
		}
		nvdiv.style.position = "absolute";
		nvdiv.style.top = "2px";
		nvdiv.style.right = "2px";
		nvdiv.style.padding = "1px";
		document.body.appendChild(nvdiv);
		
		ini_carte();
	}
	initialise = true;
}