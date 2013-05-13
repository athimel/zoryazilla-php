/*********************************************************************************
*    This file is part of zoryazilla                                             *
*********************************************************************************/

var Autologon = MZ_getValue("Autologon");
var numTroll = MZ_getValue("NUM_TROLL");
var Troll = MZ_getValue("NOM_TROLL");
if (Autologon) {
	var ZZSession=document.getElementsByName('ZZSession')[0].value;
	var numTroll=document.getElementsByName('TiD')[0].value;
	var Troll=document.getElementsByName('Troll')[0].value.toLowerCase();
	MZ_setValue("NUM_TROLL", numTroll);
	MZ_setValue("session."+numTroll, ZZSession);
	MZ_setValue("session."+Troll, ZZSession);
    //alert("Sauvegarde mot de passe "+Troll+" (#"+numTroll+ ") OK!");
} else if (numTroll>0) {
	MZ_setValue("session."+numTroll, ""); 	// car le remove ne marche pas!
 	MZ_removeValue("session."+numTroll);
	MZ_setValue("session"+Troll, ""); 		// car le remove ne marche pas!
 	MZ_removeValue("session."+Troll);
}
