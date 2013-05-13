// script MZ pour rajouter les boutons "message suivant" et "message prÃ©cÃ©dent"
// dans la fenetre de lecture des messages :
// http://games.mountyhall.com/mountyhall/Messagerie/ViewMessage.php?answer=1&msgId=22843437
var numMessageCourant;
var numMessagePrecedent;
var numMessageSuivant;
var listeMessages;

// rÃ©cupÃ©rer le numÃ©ro du message en cours depuis l'adresse
function getCurrentMessageNumber(){
  return currentURL.substring(currentURL.indexOf("msgId=")+6);
}
// rÃ©cupÃ©rer la liste des numeros messages depuis la page prÃ©cÃ©dente sous forme de tableau
function getMessageList(){
  var maListe=new Array();
  var fenetreSource=window.opener;
  if(fenetreSource==null){return false;}
  if(fenetreSource.document==null){return false;}else{documentSource=fenetreSource.document;}
  var mbf=documentSource.evaluate("//form[@name='mailboxForm']//tr[contains(descendant::input/attribute::type, 'checkbox')]", documentSource, null,XPathResult.ORDERED_NODE_ITERATOR_TYPE,null);

  var isNew=false;
  var elementCourant;
  while(elementCourant=mbf.iterateNext()){
    if(elementCourant.children[0].children[0] != null){isNew=true;} else {isNew=false;}
    if(elementCourant.children[1] != null){
      maListe.push(new Array(elementCourant.children[1].children[0].value,isNew));
    }
  }
  return maListe;
}

// crÃ©er un bouton : direction = Suivant ou Precedent
function addButton(parent, direction, unread, title, cible){
  var sourceImg="";
  var boutonFleche=document.createElement('IMG');
  if(unread){sourceImg='http://games.mountyhall.com/mountyhall/Images/New.gif';}
  else{sourceImg='http://games.mountyhall.com/MH_Packs/packMH_parchemin/fleches/fleche'+direction+'.jpg';}
  boutonFleche.setAttribute('src',sourceImg);
  boutonFleche.setAttribute('name',cible[0]);
  boutonFleche.setAttribute('title',title);
  boutonFleche.addEventListener("click", getOtherMessage,false);

  var tdFleche=document.createElement('TD');
  tdFleche.setAttribute('align','center');
  tdFleche.appendChild(boutonFleche);
  parent.appendChild(tdFleche);

}

// trouver le message suivant et le message prÃ©cÃ©dent dans la liste
function getSurroundingMessages(numMessage,listeMessages){
  var retourArray = new Array();
  for(i = 0; i < listeMessages.length; i++){
    if(listeMessages[i][0]==numMessage){
      if(i>0){retourArray[0]=listeMessages[i-1];}
      if(i<listeMessages.length-1){retourArray[1]=listeMessages[i+1];}
    }
  }
  return retourArray;
}

// trouver le message suivant et le message prÃ©cÃ©dent non lus dans la liste
function getSurroundingUnreadMessages(numMessage,listeMessages){
  var retourArray = new Array();
  var tmpArray = new Array();
// on rÃ©cupÃ¨re uniqument les nouveaux messages
  for(var i =0; i < listeMessages.length; i++){
    if(listeMessages[i][1] || (listeMessages[i][0]==numMessage)){
      tmpArray.push(listeMessages[i])
    }
  }
// et on fait comme avant
  for(var i = 0; i < tmpArray.length; i++){
    if(tmpArray[i][0]==numMessage){
      if(i>0){retourArray[0]=tmpArray[i-1];}
      if(i<tmpArray.length-1){retourArray[1]=tmpArray[i+1];}
    }
  }
  return retourArray;
}

//fermer le message en cours, ouvrir le message depuis la fenetre mÃ¨re.
function getOtherMessage(e){
  fenetreMere=window.opener;
  window.close();
  fenetreMere.location.reload();
  var nextWindow = fenetreMere.open('http://games.mountyhall.com/mountyhall/Messagerie/ViewMessage.php?answer=1&msgId='+e.target.name,'MsgView','scrollbars=yes,resizable=yes,width=750,height=350');
  nextWindow.focus();
}


if(currentURL.indexOf("http://games.mountyhall.com/mountyhall/Messagerie/ViewMessage.php")==0){
  numMessageCourant = getCurrentMessageNumber();
  listeMessages=getMessageList();

// crÃ©e un coin oÃ¹ on va rajouter les fleches
    var ArrowTable=document.createElement('DIV');
    ArrowTable.setAttribute('id','arrows');
    document.body.appendChild(ArrowTable);

    var maTable = document.createElement('table');
    maTable.setAttribute('width', '98%');
    maTable.setAttribute('border', '0');
    maTable.setAttribute('bgcolor', '#000000');
    maTable.setAttribute('align', 'center');
    maTable.setAttribute('cellpadding', '2');
    maTable.setAttribute('cellspacing', '1');
    maTable.setAttribute('id','arrowTable');
    
    var mytbody = document.createElement("tbody");
  	maTable.appendChild(mytbody);
  	
  	ArrowTable.appendChild(maTable);
    var tr = document.createElement('TR');
    tr.setAttribute('bgcolor', '#ced2f7');
    tr.setAttribute('class','mh_tdpage');
    tr.setAttribute('align','center');
    mytbody.appendChild(tr);

// on affiche les 2 boutons sauf aux deux bouts de la liste
  var surroundings=getSurroundingMessages(numMessageCourant,listeMessages);
  var surroundingsUnread=getSurroundingUnreadMessages(numMessageCourant,listeMessages);
  if(surroundingsUnread[0] != null){
    addButton(tr,'g',true,'Precedent non Lu',surroundingsUnread[0]);
  }
  if(surroundings[0] != null){
    addButton(tr,'g',false,'Precedent',surroundings[0]);
  }
  if(surroundings[1] != null){
    addButton(tr,'d',false,'Suivant',surroundings[1]);
  }
  if(surroundingsUnread[1] != null){
    addButton(tr,'d',true,'Suivant non Lu',surroundingsUnread[1]);
  }
}

