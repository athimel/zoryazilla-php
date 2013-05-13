/*********************************************************************************
*    This file is part of zoryazilla                                             *
*********************************************************************************/
function setDBMsgZZ(msg) { 
		var SkinZZ=MZ_getValue(numTroll+"SkinZZ"); if (!SkinZZ) SkinZZ=ZZDB+"/skin/";
		var arrTR = document.getElementsByTagName('table');
		var tabMsg=arrTR[5].childNodes[1];
		var iMsg=4;
		var nPiege=0;
		while (iMsg<(tabMsg.childNodes.length-4)) {
			var title=tabMsg.childNodes[iMsg].childNodes[3].childNodes[1].childNodes[0].nodeValue;
			if (title.indexOf('Déclenchement de Piège')>=0) {// X = -26, Y = -20, N = -15
				tabMsg.childNodes[iMsg].childNodes[3].childNodes[1].innerHTML+=' <img height=15 src="'+SkinZZ+'/competences/construire_un_piege.png">';
			}			
			iMsg=iMsg+2;
		} 
}

function catchMsgPiege(){
  if ( window.self.location.toString().indexOf("MH_Messagerie.php?cat=9")!=-1 )
  {
		var data='&TypeData=PiegeX';
		data=data+'&TiD='+numTroll;

		var arrTR = document.getElementsByTagName('table');
		var tabMsg=arrTR[5].childNodes[1];
		var iMsg=4;
		var nPiege=0;
		while (iMsg<(tabMsg.childNodes.length-4)) {
			var title=tabMsg.childNodes[iMsg].childNodes[3].childNodes[1].childNodes[0].nodeValue;
			if (title.indexOf('Déclenchement de Piège')>=0) {// X = -26, Y = -20, N = -15
			    var X=title.slice(title.indexOf("X =")+4, title.indexOf("Y =")-2);
			    var Y=title.slice(title.indexOf("Y =")+4, title.indexOf("N =")-2);
			    var N=title.slice(title.indexOf("N =")+4, title.length);
			    var eXplose=tabMsg.childNodes[iMsg].childNodes[5].childNodes[0].nodeValue.replace(" ", "_");	 
				data=data+'&TimeStamp[]='+eXplose+'&X[]='+X+'&Y[]='+Y+'&N[]='+N;	
			 	nPiege=nPiege+1;
			}			
			iMsg=iMsg+2;
		} 

	    if (nPiege>0) {
			MZ_appendNewScript(ZZDB+'/mzData.php?'+data);
		}
  }
}

//----------------------------------------------------------------------------------------------------
catchMsgPiege();