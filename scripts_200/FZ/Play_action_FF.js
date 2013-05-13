/*********************************************************************************
*    This file is part of zoryazilla                                             *
*********************************************************************************/
var numTroll=MZ_getValue("NUM_TROLL");
var nsav_pa=MZ_getValue("PA_TROLL");
var btotal = document.getElementsByTagName('b');
var nb_pa=btotal[1].childNodes[0].nodeValue.substr(12,1);
if (nb_pa!=nsav_pa) {
    var data="&TypeData=PA&PA="+nb_pa+"&TiD="+numTroll;
	MZ_appendNewScript(ZZDB+'/mzData.php?'+data);
    MZ_setValue("PA_TROLL",nb_pa);   
}

