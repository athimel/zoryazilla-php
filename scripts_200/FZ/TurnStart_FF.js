
/*********************************************************************************
*    This file is part of zoryazilla                                             *
*********************************************************************************/

var LOGON_TROLL=MZ_getValue('LOGON_TROLL');
//=============================================================
if (LOGON_TROLL!="") {
  var totaltab = document.getElementsByTagName('TABLE');
  var t=totaltab[2].childNodes[1].childNodes[0].childNodes[1].childNodes[0];
  var data="&TypeData=DLA";
  data=data+"&Troll="+escape(LOGON_TROLL);
  if (t) {	
    if (t.nodeValue.indexOf("Il vous reste")>=0) {	// cas d'un session déjà activée
		var PA=totaltab[2].childNodes[1].childNodes[0].childNodes[1].childNodes[0].nodeValue;
		var DLA=totaltab[2].childNodes[1].childNodes[0].childNodes[1].childNodes[2].nodeValue;
		PA=PA.substr(PA.indexOf("reste")+6, 1);
		DLA=DLA.slice(DLA.indexOf("le")+3, DLA.indexOf(".")).replace(" ", "_");
		data=data+"&PA="+PA;
		data=data+"&DLA="+DLA.replace(" ", "_");
	} else if (t.nodeValue.indexOf("nouvelle date limite")>=0) {	// cas d'un session déjà activée
		var PA=6;
		var DLA=totaltab[2].childNodes[1].childNodes[0].childNodes[1].childNodes[6].nodeValue;
		var PV=totaltab[2].childNodes[1].childNodes[0].childNodes[1].childNodes[7].childNodes[6].nodeValue;
		PV=PV.slice(PV.indexOf("de")+3, PV.indexOf("Point")-1);
		DLA=DLA.slice(DLA.indexOf("est le")+7, DLA.indexOf(".")).replace(" ", "_");
		data=data+"&PA="+PA;
		data=data+"&PV="+PV;
		data=data+"&DLA="+DLA.replace(" ", "_");
	}
  } 
	
  MZ_appendNewScript(ZZDB+'/mzData.php?'+data);		//permet d'ouvrir la session
}