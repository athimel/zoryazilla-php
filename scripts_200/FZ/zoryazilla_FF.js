/*********************************************************************************
*    This file is part of zoryazilla                                             *
*********************************************************************************/

var Autologon = MZ_getValue("Autologon");
var numTroll = MZ_getValue("NUM_TROLL");
var ZZDB = MZ_getValue("ZZDB");
FormDlgBox=document.getElementsByName('ZZ_TID')[0];

action=document.getElementsByName('Page')[0].value;
if (!action) action="Login";


if (action=="Newzz") {
 	var NewsID=document.getElementsByName('NewsID')[0].value;
	MZ_setValue(numTroll+".ZZ_NewzID", NewsID);
} else if ((action!="ResetMDP") && (FormDlgBox)) FormDlgBox.value=numTroll;


if (action=="Script")  {
	var scriptsURL=MZ_getValue("scriptsComplementaires");
	var scriptc = scriptsURL.split("£");

 	var TypeScript=document.getElementsByName('TypeScript')[0].value;
 	var IdScript=document.getElementsByName('IdScript')[0].value;
	if ((TypeScript=='Switch') && (IdScript!="")) TypeScript='addScript'; else IdScript=-1;

 	var nbscript=document.getElementsByName('SCRIPT_COMP_NB')[0].value;
 	var ZZScripts="";
 	var autreScripts="";
	for(var i=0;i<scriptc.length;i++)
	{
		var flagOther=true;
		if(scriptc[i].length>0)
		{
			for (var s=0; s<nbscript; s++) 
			{
					var ScriptExt=document.getElementsByName('SCRIPT_COMP_'+s)[0].value;
					var ScriptInt=document.getElementsByName('SCRIPT_COMP_ZZ'+s)[0].value;
					if ((scriptc[i]==ZZDB+'/scripts/'+ScriptInt)||(scriptc[i]==ScriptExt)) 
					{
						flagOther=false;
						if (s!=IdScript) 
						{
							document.getElementsByName('CHECKBOX_SCRIPT_COMP_'+s)[0].checked=true;
							if (ZZScripts.length!=0) ZZScripts+="£"; ZZScripts+=scriptc[i]; 	
						} else 
						{ 
							TypeScript='delScript'; 
						}
					}
			}
			if (flagOther) 
			{
				if(autreScripts.length!=0) autreScripts+="£"; autreScripts+=scriptc[i]; 	
			}
		}
	}

	if (TypeScript=='addScript') 
	{
		document.getElementsByName('CHECKBOX_SCRIPT_COMP_'+IdScript)[0].checked=true;
		switchInt=ZZDB+'/scripts/'+document.getElementsByName('SCRIPT_COMP_ZZ'+IdScript)[0].value;
		if (ZZScripts.length!=0) ZZScripts+="£"; ZZScripts+=switchInt; 	
	}
	document.getElementsByName('AUTRES_SCRIPTS_COMP')[0].value=autreScripts.replace(/£/g, "\n");

	if ((TypeScript=='addScript')||(TypeScript=='delScript'))
	{
		if (autreScripts.length!=0) {if (ZZScripts.length!=0) ZZScripts+="£"; ZZScripts+=autreScripts; }
		MZ_setValue("scriptsComplementaires", ZZScripts);	
	}
		
}
/*
if (action=="Prefs")  {
 	var Pref=document.getElementsByName('SETPREF')[0];
	if ((Pref) && (Pref.value!="default")){
 			var SkinZZ=document.getElementsByName('SETPREF_SkinZZ')[0].value;
			//var HandiZilla=document.getElementsByName('SETPREF_HandiZilla')[0].value;
			var ZMON=document.getElementsByName('SETPREF_ZMON')[0].value;
			var ZTRO=document.getElementsByName('SETPREF_ZTRO')[0].value;
			var ZTRE=document.getElementsByName('SETPREF_ZTRE')[0].value;
			var ZLIE=document.getElementsByName('SETPREF_ZLIE')[0].value;
			MZ_setValue(numTroll+".pref.SkinZZ", SkinZZ);
			//MZ_setValue(numTroll+".pref.ITM_HandiZilla", HandiZilla);
			MZ_setValue(numTroll+".pref.ZMON", ZMON);
			MZ_setValue(numTroll+".pref.ZTRO", ZTRO);
			MZ_setValue(numTroll+".pref.ZTRE", ZTRE);
			MZ_setValue(numTroll+".pref.ZLIE", ZLIE);
	}

 	if ((Pref) && (Pref.value=="default")) {
			document.getElementsByName('SkinZZ')[0].value=ZZDB+"/skin/";
			//document.getElementsByName('HandiZilla')[0].value="non" ;
			document.getElementsByName('ZMON')[0].value=5;
			document.getElementsByName('ZTRO')[0].value=0;
			document.getElementsByName('ZTRE')[0].value=5;
			document.getElementsByName('ZLIE')[0].value=15;
	} else {
	 	var SkinZZ=MZ_getValue(numTroll+".pref.SkinZZ"); if (!SkinZZ) SkinZZ=ZZDB+"/skin/";
		Pref=document.getElementsByName('SkinZZ')[0];
	    Pref.value=SkinZZ;

	 	//var HandiZilla=MZ_getValue(numTroll+".pref.ITM_HandiZilla");
		//Pref=document.getElementsByName('HandiZilla')[0];
	    //Pref.value=HandiZilla;

		var ZMON=MZ_getValue(numTroll+".pref.ZMON");  if (!ZMON) ZMON=5;
		Pref=document.getElementsByName('ZMON')[0];
	    Pref.value=ZMON;

		var ZTRO=MZ_getValue(numTroll+".pref.ZTRO");  if (!ZTRO) ZTRO=0;
		Pref=document.getElementsByName('ZTRO')[0];
	    Pref.value=ZTRO;

		var ZTRE=MZ_getValue(numTroll+".pref.ZTRE");  if (!ZTRO) ZTRE=0;
		Pref=document.getElementsByName('ZTRE')[0];
	    Pref.value=ZTRE;

		var ZLIE=MZ_getValue(numTroll+".pref.ZLIE");  if (!ZLIE) ZLIE=15;	// max 15 cases pour les pièges
		Pref=document.getElementsByName('ZLIE')[0];
	    Pref.value=ZLIE;
	}

}
*/