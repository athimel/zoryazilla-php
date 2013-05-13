
function createForm(url,nom) {
  var myForm=document.createElement('form');
  myForm.setAttribute('method','post');
  myForm.setAttribute('align','right');
  myForm.setAttribute('action',url);
  myForm.setAttribute('name',nom);
  return myForm;
}  

function createMsgPXBouton() {
  var myForm=createForm('../Messagerie/MH_Messagerie.php?&dest=', 'sendMP');
  appendSubmit(myForm, 'Envoyer un MP', function() {document.getElementsByName('sendMP')[0].action=sendMessagePrive(3);});
  myForm.appendChild(document.createTextNode(" "));
  appendSubmit(myForm, 'Partage PX', function() {document.getElementsByName('sendMP')[0].action=sendMessagePrive(8);});
  myForm.appendChild(document.createTextNode(" "));
  appendSubmit(myForm, 'Partage ZZ', function() {document.getElementsByName('sendMP')[0].action=grantPartageZZ();});
  return myForm;
}  

function grantPartageZZ() {
  var MP=ZZDB+"/zoryazilla.php?&Source=MH&action=MyShare&TypeShr=NewShr&User=";

  for ( var i = 2; i < zz_trolls.childNodes.length;i+=2)
  {
  		if (zz_trolls.childNodes[i].childNodes[2].firstChild.checked) {
  			MP += trim(zz_trolls.childNodes[i].childNodes[4].childNodes[0].nodeValue)+',';   
		}		
  }  
//  document.sendMP.action=MP;
  return MP;	
} 

function sendMessagePrive(cat) {

  var MP="../Messagerie/MH_Messagerie.php?cat="+cat+"&dest=";
  for ( var i = 2; i < zz_trolls.childNodes.length;i+=2)
  {
  		if (zz_trolls.childNodes[i].childNodes[2].firstChild.checked) {
			if (cat==8) MP += '%2C'+trim(zz_trolls.childNodes[i].childNodes[4].childNodes[0].nodeValue); 
			else MP += '+'+trim(zz_trolls.childNodes[i].childNodes[4].childNodes[0].nodeValue)+'%2C'; 
		}
  }  
  if (cat==8) MP=MP.replace("=%2C", "=");
//  document.sendMP.action=MP;
  return MP;	
} 

// Ajout des boutons
  arrtable=document.getElementsByTagName('table');
  tab=arrtable[5];
  tab.parentNode.insertBefore(createMsgPXBouton(),tab); 



  var newB = document.createElement( 'b' );
  newB.appendChild( document.createTextNode( 'MP' ) );
  var newTd = document.createElement( 'td' );
  newTd.setAttribute( 'width', '5' );
  newTd.setAttribute( 'align', 'center' );
  newTd.appendChild( newB );
  Titre=arrtable[5].childNodes[1].childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[1].childNodes[0];  
  Titre.insertBefore( newTd, Titre.childNodes[2] );  


  var zz_trolls=arrtable[5].childNodes[1].childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[1];
  for (i=2; i<zz_trolls.childNodes.length; i+=2) {
     	var newTd = document.createElement( 'td' );		// Pour la box MP
     	newTd.setAttribute( 'width', '5' );
	 	newTd.setAttribute( 'align', 'center' );	
	 
	 	var cb=document.createElement('INPUT');
	 	cb.setAttribute('type','checkbox');
	 	cb.setAttribute('name','mp_'+i);
	 	 
		zz_trolls.childNodes[i].insertBefore( newTd, zz_trolls.childNodes[i].childNodes[2] );
	  	zz_trolls.childNodes[i].childNodes[2].appendChild(cb);
  }
