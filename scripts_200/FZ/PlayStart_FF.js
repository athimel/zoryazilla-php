/*********************************************************************************
*    This file is part of zoryazilla                                             *
*********************************************************************************/

//========================= Fonctions MH, pour validation
// Vérifier qu'un champ est obligatoire dans un <FORM>
function validObligatoire(theChamp,theLabel) {
    var val = theChamp.value;
    if (theLabel == '' || theLabel == null) theLabel = "La zone indiquée par le curseur";
    if (strip(val) == '') {
        window.alert(theLabel + " est obligatoire !");
        theChamp.focus();
        return(false);
    }
    return(true);
}

function validate_form() { 
        with (document.LoginForm) {
            return(validObligatoire(as_Login, 'Le Nom du Troll') 
				&& validObligatoire(as_Pwd, 'Le Mot de Passe') 
			)
		}       
}
//===============================================================
function validateZZ() {

	var Troll = document.getElementsByName('as_Login')[0].value.toLowerCase();

	if (Autologon) {
 		//trZZ.removeChild(tdZZ0); 	// On retire avent d'envoyer à MH
		var ZZSession = MZ_getValue("session."+Troll);
	} else {
		//trZZ.removeChild(tdZZ1);	// On retire avent d'envoyer à MH
		//trZZ.removeChild(tdZZ2);
		var ZZSession = document.getElementsByName('as_ZZ')[0].value;
	}

	alert( ZZDB+"/mzLogin.php?&Troll="+encodeURIComponent(Troll)+"&ZZSession="+encodeURIComponent(ZZSession));
	MZ_setValue('LOGON_TROLL', Troll);
	MZ_xmlhttpRequest({
				method: 'GET',
				url: ZZDB+"/mzLogin.php?&Troll="+encodeURIComponent(Troll)+"&ZZSession="+encodeURIComponent(ZZSession),
				headers : {
					'User-agent': 'Mozilla/4.0 [FusionZoryaZilla] (compatible) Greasemonkey',
					'Accept': 'application/atom+xml,application/xml,text/xml'
				},
				onload: function(responseDetails) {
 					if (responseDetails.responseText=="0") alert("Erreur de login ZZ!!");
					else MZ_setValue("NUM_TROLL", responseDetails.responseText);
				}
				});

	//return validate_form();	// Validation des Champs MH
	return true;
}

//On logout, un éventuelle session ZZ*
MZ_xmlhttpRequest({
				method: 'GET',
				url: ZZDB+"/mzLogout.php",
				headers : {
					'User-agent': 'Mozilla/4.0 [FusionZoryaZilla] (compatible) Greasemonkey',
					'Accept': 'application/atom+xml,application/xml,text/xml'
				},
				});

var tdZZ0 = document.createElement('A');
tdZZ0.setAttribute('align','center');
tdZZ0.setAttribute('href',ZZDB+'/zoryazilla.php?&action=Autologon');
tdZZ0.setAttribute('target','_blank');
tdZZ0.setAttribute('CLASS','mh_links');
tdZZ0.setAttribute('height','100');
tdZZ0.appendChild(document.createTextNode('===> zoryazilla <==='));


var tdZZ1 = document.createElement('label');
tdZZ1.appendChild(document.createTextNode("Accès à ZZ : "));

var tdZZ2 = document.createElement('INPUT');
tdZZ2.setAttribute('class','TextboxV2');
tdZZ2.setAttribute('align','center');
tdZZ2.setAttribute('type','password');
tdZZ2.setAttribute('name','as_ZZ');



if (Autologon) {
	var trZZ=tdZZ0;

} else {
	var trZZ = document.createElement('h');
	trZZ.appendChild(tdZZ1);
	trZZ.appendChild(tdZZ2);
}

//var form = document.evaluate("//form[@name = 'LoginForm']",document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
var form = document.getElementsByName('LoginForm')[0];
if(form) {
        var tList = form.getElementsByTagName( 'hr' );
		var nodeZZ=tList[1];
		nodeZZ.parentNode.insertBefore( document.createElement('hr'),nodeZZ);
		nodeZZ.parentNode.insertBefore(trZZ,nodeZZ);
}

var button = document.getElementsByName('as_Action')[0];	
button.addEventListener("click", validateZZ, true);

var button = document.getElementsByName('as_View')[0];	
button.addEventListener("click", validateZZ, true);
