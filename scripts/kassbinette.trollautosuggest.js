/*
* Script MZ :Ajout d'une boite autosuggest sur base des noms de trolls afin de ne plus saisir les id mais les noms
* Auteur : Kassbinette (95429)
*
*/

if (currentURL.indexOf("Messagerie/MH_Messagerie.php?cat=3") != -1) {
   //var hostName = "http://localhost:2305";

   // FZZ: modification pour intégration à ZZ (Zorya)   
   //var hostName = "http://www.Kassbinette.net";
   //var autoSuggestService = "/scriptsComplementairesMH/Autosuggest/GetTrolls.aspx";
   //var TrollLinkService = "/scriptsComplementairesMH/Autosuggest/GetTrollsById.aspx";
   //var imgLoading = "/scriptsComplementairesMH/Autosuggest/Img/spinner.gif";

   var hostName = ZZDB.substr(0, ZZDB.indexOf("/", 8));  
   var autoSuggestService = ZZDB.substring(hostName.length)+"/scripts/res.kassbinette/GetTrolls.php";
   var TrollLinkService =  ZZDB.substring(hostName.length)+"/scripts/res.kassbinette/GetTrollsById.php";
   var imgLoading = ZZDB.substring(hostName.length)+"/scripts/res.kassbinette/spinner.gif";
	//FZZ: Fin modifications........

   var currentSelectedLine = null;
   var currentCounter = 0;
   var currentCounterTrollLink = 0;
   var blocCall = 0;

   //crée la text box qui va abriter l'autosuggest, les events etc
   function CreateAutoSuggestTB() {
       try {
           // trouver l'emplacement correct pour la boite
           var TrollList = document.getElementsByName('sbMSG_destinataires')[0];
          
           var newLine = TrollList.parentNode.appendChild(document.createElement('br'));
           var newbloc = TrollList.parentNode.appendChild(document.createElement('div'));
          
           var AutoSuggestTextBox = newbloc.appendChild(document.createElement('input'));
           AutoSuggestTextBox.setAttribute('id', 'query');
           AutoSuggestTextBox.setAttribute('type', 'text');
        //   AutoSuggestTextBox.addEventListener('change', function () {  GetSuggestions(event); }, true);
           AutoSuggestTextBox.addEventListener('keyup', function (event) { GetSuggestions(event); }, true);
           AutoSuggestTextBox.addEventListener('keydown', function (event) { KeyBoardNavigation(event); }, true);           
           var loading = newbloc.appendChild(document.createElement('img'));
           loading.setAttribute('id', 'imgAutosuggestLoading');
           loading.setAttribute('src', hostName + imgLoading);
           loading.setAttribute('alt', "Loading");
           loading.setAttribute('style', "visibility:hidden;height:16px;margin-top:3px");
           
           var newText = newbloc.appendChild(document.createElement('font'));
           newText.setAttribute('size', '1');
           newText.innerHTML = " Pour rechercher/ajouter un destinataire, entrez tout ou partie du nom du Troll dans la boîte de saisie" 
       }
       catch (e) {
           alert("CreateAutoSuggestTB : " + e.message);
       }
   }
   
   // Ajout de la ligne de traduction des Ids vers Les noms de trolls 
   function CreateLigneLinkTroll(JsonText) { /*FZZ*/ if (JsonText=="") return;  /*FZZ modification: pour eviter un message d'ino sur creation de message*/
       try {
           var link = "http://games.mountyhall.com/mountyhall/View/PJView.php?ai_IDPJ=";
           var newList = GetNewListLink();
           var ret = "";
           var listTroll = document.getElementsByName('MSG_destinataires')[0].value;
           listTroll= listTroll.substring(0, listTroll.length - 1);
           var arrayIds =listTroll.split(",");
           var json = eval("(" + JsonText + ")");
           for (j = 0; j < arrayIds.length; j++)
               for (i = 0; i < json.trolls.length; i++) {
                   if (json.trolls[i].Id == arrayIds[j]) {
                       ret = ret + "<a target='_blank' href='" + link + json.trolls[i].Id + "'>" + json.trolls[i].Nom + "</a>, ";
                       json.trolls.splice(i,1);
                   }
               }

           newList.innerHTML = ret;
       }
       catch (e) {
           alert('CreateLigneLinkTroll : ' + e.message);
       }
   }
   
   // retrouve l'emplacement pour insérer la ligne des noms de trolls 
   function GetNewListLink() {
       try {
           var newList = document.getElementById('divNewListLink');
           
           if (newList == null) {
               newList = document.getElementsByName('MSG_destinataires')[0].parentNode.appendChild(document.createElement('div'));
               newList.setAttribute("id", "divNewListLink");
           }
           return newList;
       }
       catch (e) {
           alert("GetNewListLink :" + e.message);
       }
   }

   // Recoit la réponse des noms de trolls
   function CallServerTrollLink() {
       try {
           currentCounterTrollLink++;
           
           var listTroll = document.getElementsByName('MSG_destinataires')[0].value;
           listTroll = listTroll.substring(0, listTroll.length - 1);

           MZ_xmlhttpRequest({
               method: 'GET',
               url: hostName + TrollLinkService + '?ids=' + listTroll + '&callCounter=' + currentCounterTrollLink,
               headers: {
                   'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
                   'Accept': 'application/atom+xml,application/xml,text/xml'
               },
               onload: function (responseDetails) {
                   CreateLigneLinkTroll(responseDetails.responseText);
               },
               onerror: function (responseDetails) {
                   alert('CreateLigneLinkTroll : Erreur durant l\'appel' + responseDetails);
               }
           });
       }
       catch (e) {
           alert("CallServerTrollLink :" + e.message);
       }
   }

   //copier l'id du troll dan la boite utilsée par le site
   function SetTrollId(id) {
       try {
           document.getElementsByName('ai_TrollId')[0].value = id;
           setAutoCompleteColor()
       }
       catch (e) {
           alert('SetTrollId : ' + e.message);
       }
   }

   //Copier le nom du troll dans  la boite de saisie
   function SetTrollName(name) {
       try {
           blocCall = 1;
           document.getElementById('query').value = name;
       }
       catch (e) {
           alert('SetTrollName : ' + e.message);
       }
   }

   // Mettre la couleur de la boite de texte
   function setAutoCompleteColor(id) {
       try {
           var id = document.getElementsByName('ai_TrollId')[0].value;
           if (id != '')
               document.getElementById('query').style.backgroundColor = '#BDFFB2';
           else if (document.getElementById('query').value == '')
               document.getElementById('query').style.backgroundColor = '#FFFFFF';
           else
               document.getElementById('query').style.backgroundColor = '#FF8E75';
       }
       catch (e)
                { alert('setAutoCompleteColor : ' + e.message); }
   }

   // Efface l'id du troll si nécessaire (si le nom saisi est différent de l'id saisi) 
   function EmptyTrollId() {
       try {
               SetTrollId('');
       }
       catch (e) {
           alert("JS - EmptyTrollId : " + e.message);
       }
   }
   // lance la demande des noms de trolls sur base de ce qui est actuellement saisi (seuleemnt si au moins deux car) ; bloccall empeche de relancer si on vient de cliquer // devrait disparaitre car j'ai enveler l'event change
   function GetSuggestions(evt) {
       try {
           if(evt.keyCode != 13 && evt.keyCode != 38 && evt.keyCode != 40)
               if (document.getElementById('query').value.length >= 2 && blocCall == 0 ) {
                  document.getElementById('imgAutosuggestLoading').style.visibility = "";
                  CallServer();
                  currentSelectedLine = null;
               }
               EmptyTrollId();
               blocCall = 0;
       }
       catch (e) {
           alert("GetSuggestions :" + e.message);
       }
   }
   // Appelle le serveur pour rechercher les noms de trolls 
   function CallServer() {
       try {
           currentCounter++;
           GetAutoSuggestDiv().style.visibility = "hidden";
           MZ_xmlhttpRequest({
               method: 'GET',
               url: hostName + autoSuggestService + '?query=' + document.getElementById('query').value + '&callCounter=' + currentCounter,
               headers: {
                   'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
                   'Accept': 'application/atom+xml,application/xml,text/xml'
               },
               onload: function (responseDetails) {
                   ShowAutoSuggestDiv(responseDetails.responseText);
               },
               onerror: function (responseDetails) {
                   alert('GetSuggestions : Erreur durant l\'appel' + responseDetails);
               }
           });
       }
       catch (e) {
           alert("CallServer :" + e.message);
       }
   }

   // montre la boite de résultats 
   function ShowAutoSuggestDiv(jSonText) {
       try {
           var TB = document.getElementById('query');
           var divAutoSuggest = GetAutoSuggestDiv();

           if (FillAutoSuggestDiv(jSonText)) {
               divAutoSuggest.style.left = getOffsetLeft(TB);
               divAutoSuggest.style.top = getOffsetTop(TB) + 20;
               divAutoSuggest.style.visibility = "visible";
               document.getElementById('imgAutosuggestLoading').style.visibility = "hidden";
           }
        }
       catch (e) {
           alert("ShowAutoSuggestDiv :" + e.message);
        }
   }

   // Cache la boite de résultats 
   function HideAutoSuggestDiv() {
       try {
         //  var TB = document.getElementById('query');
           var divAutoSuggest = GetAutoSuggestDiv();
           divAutoSuggest.style.visibility = "hidden";
       }
       catch (e) {
           alert("HideAutoSuggestDiv :" + e.message);
       }
   }
   // retrouve la boite des résultats 
    function GetAutoSuggestDiv(){
        try{
           var divAutoSuggest = document.getElementById('divAutoSuggest');
           if(divAutoSuggest==null)
           {
               divAutoSuggest = document.createElement('div');
               divAutoSuggest.setAttribute("id", "divAutoSuggest");
               divAutoSuggest.style.width = "300";
               divAutoSuggest.style.overflowY = "scroll";
               divAutoSuggest.style.overflowX = "hidden";
               divAutoSuggest.style.position = "absolute";
               divAutoSuggest.style.zIndex = "100";
               divAutoSuggest.style.backgroundColor = "white";
               divAutoSuggest.style.border = "1px solid black";
               document.body.appendChild(divAutoSuggest);
           }
           return divAutoSuggest;
        }
        catch(e){
          alert("GetAutoSuggestDiv :" + e.message);
        }
  }
  // rempli la boite des résultats 
    function FillAutoSuggestDiv(jSonText){
        try {
               var ret = false;
               var myJSonAnswer = eval("(" + jSonText + ")");
               var query = myJSonAnswer.query;
               var data = myJSonAnswer.data;
               var suggestions = myJSonAnswer.suggestions;
               var presentations = myJSonAnswer.presentations;
               var callCounter = myJSonAnswer.callCounter;

               var countReturnedTroll = myJSonAnswer.countReturnedTroll;
               var countMaxTroll = myJSonAnswer.countMaxTroll;
               var nbrShown = countReturnedTroll;
               var divAutoSuggest = GetAutoSuggestDiv();

               if (callCounter == currentCounter) {
                   ret = true; 
                   divAutoSuggest.innerHTML = "";
                   var arLen = data.length;
                   for (var i = 0, len = arLen; i < len; ++i) {
                       divAutoSuggest.appendChild(ComposeLigneRetour(query, data[i], suggestions[i], presentations[i]));
                   }
                   if (countReturnedTroll < countMaxTroll) {
                       var divFooter = divAutoSuggest.appendChild(document.createElement('div'));
                       divFooter.setAttribute("id", "divFoorter");
                       divFooter.style.overflow = "hidden";
                       divFooter.style.margin = "5";
                       divFooter.style.textAlign = "center";
                       divFooter.innerHTML = countReturnedTroll + " trolls retournés sur un total de " + countMaxTroll + "<br/>Veuillez affiner votre recherche";
                    
                       nbrShown++;
                   }
                   else if (countReturnedTroll == 0) {
                       var divFooter = divAutoSuggest.appendChild(document.createElement('div'));
                       divFooter.setAttribute("id", "divNone");
                       divFooter.style.overflow = "hidden";
                       divFooter.style.margin = "5";
                       divFooter.style.textAlign = "center";
                       divFooter.innerHTML = "Aucun troll retourné. <br/>Veuillez élargir votre recherche";
                  
                       nbrShown++;
                   }
                   divAutoSuggest.style.height = GetAutoSuggestDivHeight(nbrShown);
               }

          
           return ret;
        }
        catch(e){
            alert("FillAutoSuggestDiv :" + e.message);
        }
    }

    // retourne la hauteur désirée pour la boite de résultats
    function GetAutoSuggestDivHeight(curCount) {
        try {
            return Math.min(curCount, 8) * 44;
        }
        catch (e) {
            alert(" GetAutoSuggestDivHeight : " + e.message);
        }
    }
    
    // Crée les lignes de la boite de résultats
    function ComposeLigneRetour(query,data, suggestion, presentation) {
        try {
            var arLen = data.length;
            divLine = document.createElement('div');
            divLine.style.borderBottom = "1px solid gray";
            divLine.setAttribute("id", "divAutoSuggest" + data);
            divLine.setAttribute("name", "divLineAutoSuggest");
            divLine.style.width = "300";
            divLine.style.overflow = "hidden";
            divLine.addEventListener('mouseover', function () { lineSelect(this); }, true);
            //divLine.addEventListener('click', function () { var arr = this.getElementsByTagName('input'); SelectTroll(arr[0].value, arr[1].value); AddTrollToListDest(); }, true);
            divLine.addEventListener('click', function () { selectAndAddTrollFromDiv(); }, true);
            hidTrollId = document.createElement('input');
            hidTrollId.type= "hidden";
            hidTrollId.name = "TrollId";
            hidTrollId.value = data;
            divLine.appendChild(hidTrollId);

            hidTrollName = document.createElement('input');
            hidTrollName.type = "hidden";
            hidTrollName.name = "TrollName";
            hidTrollName.value = suggestion;
            divLine.appendChild(hidTrollName);

            divsubLine = document.createElement('div');
            divsubLine.style.overflow = "hidden";
            divsubLine.style.margin = "5";
            var regex = new RegExp('(' + query + ')', 'gi');
            divsubLine.innerHTML = suggestion.replace(regex, "<span style='background-color:#FFFBAF;font-weight:bold;font-size:14'>" + query + "</span>") + "<br/>" + presentation;
            divLine.appendChild(divsubLine);
            return divLine;
        }
        catch (e) {
            alert("ComposeLigneRetour :" + e.message);
        }
    }

    // a partir d'un div sortir  le troll et l'ajouter a la liste de dest 
    function selectAndAddTrollFromDiv() {
        var div = currentSelectedLine;
        var arr = div.getElementsByTagName('input'); 
        selectTroll(arr[0].value, arr[1].value); 
        AddTrollToListDest(); 
    }



    
    // sélectionne le troll provenant de la boite de résultats 
    function selectTroll(TrollId, TrollName) {
        try {
            SetTrollId(TrollId);
            SetTrollName(TrollName);
            HideAutoSuggestDiv();
        }
        catch (e) {
            alert(" SelectTroll : " + e.message);
        }
    }
    // Navigation avec les flèches
    function KeyBoardNavigation(evt) {
        try {
            if (evt.keyCode == 40) // down
                lineSelect(nextLine());
            if (evt.keyCode == 38) // up
                lineSelect(previousLine());
            if (evt.keyCode == 39) // right
            {
                if(currentSelectedLine!=null)
                    selectAndAddTrollFromDiv();
            }
        }
        catch (e) {
            alert(" KeyBoardNavigation : " + e.message);
        }
     
    }


    // sélectionne le DIV suivant 
    function nextLine() {
        try {
            var ret = null; 
            if (currentSelectedLine == null) 
                ret = document.getElementsByName("divLineAutoSuggest").item(0);
            else 
            {
                var next = currentSelectedLine.nextSibling;
                if (next != null)
                    ret = next;
             
                 
            }
            return ret;
            
        }
        catch (e) {
            alert(" nextLine : " + e.message);
        }
        
    }
    // Sélectionne le DIV précédent
    function previousLine() {
        try {
              ret = null;
              if (currentSelectedLine == null)
                  ret =  document.getElementsByName("divLineAutoSuggest").item(0);
              else
              {
                var previous = currentSelectedLine.previousSibling;
                if (previous != null)
                    ret  = previous;
                   
              }
            return ret;
        }
        catch (e) {
            alert(" previousLine : " + e.message);
        }

    }

    // pour voir le code outer d'un node
    function outerHTML(node) {

        var span = document.createElement("span");
        span.appendChild(node.cloneNode(true));
        return span.innerHTML;
    }

    // higlight ligne de la boite de résultats 
    function lineSelect(line) {
        try {
                if (line != null) {
                    if (line.getAttribute('name') == "divLineAutoSuggest") {
                        if (currentSelectedLine != null)
                            lineUnSelect(currentSelectedLine);
                        currentSelectedLine = line;
                        line.style.backgroundColor = "C6CAFF";
                    }
            }
        }
        catch (e) {
            alert(" lineSelect : " + e.message);
        }
    }

    // enleve la couleur 
    function lineUnSelect(line) {
        try {
            line.style.backgroundColor = "";
        }
        catch (e) {
            alert(" lineUnSelect : " + e.message);
        }
    }

     // Position  top d'un elm
    function getOffsetTop(elm) {

        var mOffsetTop = elm.offsetTop;
        var mOffsetParent = elm.offsetParent;

        while (mOffsetParent) {
            mOffsetTop += mOffsetParent.offsetTop;
            mOffsetParent = mOffsetParent.offsetParent;
        }

        return mOffsetTop;
    }
    // Position  let d'un elm
    function getOffsetLeft(elm) {

        var mOffsetLeft = elm.offsetLeft;
        var mOffsetParent = elm.offsetParent;

        while (mOffsetParent) {
            mOffsetLeft += mOffsetParent.offsetLeft;
            mOffsetParent = mOffsetParent.offsetParent;
        }

        return mOffsetLeft;
    }

    // ajoute le troll a la liste des destinataies en utilisant la fonction provenant de MH 
    function AddTrollToListDest() {
        try {
            unsafeWindow.changeDestinataire(1);
            SetTrollName('');
            setAutoCompleteColor(); 
            CallServerTrollLink();
        }
        catch (e) {
            alert(" AddTrollToListDest : " + e.message);
        }
    }

    // crée le nouveau bouton d'ajout // cache l'ancien 
    function ReplaceAddButton() {
        try {
            var oldButton = document.getElementsByName("bAddTrollOnId")[0];
            oldButton.style.visibility = "hidden";
            oldButton.style.display = "none";
            var newButton = document.createElement('input');
            newButton.setAttribute("id", "newButtonAddDestinataire");
            newButton.setAttribute("type", "button");
            newButton.setAttribute("value", "Ajouter/supprimer ce destinataire");
            newButton.setAttribute("class", "mh_form_submit");
            newButton.addEventListener('click', function () { AddTrollToListDest(); }, true);
            newButton.addEventListener('mouseover', function () { this.style.cursor = 'hand'; }, true);

            oldButton.parentNode.appendChild(newButton);
        }
        catch (e) {
            alert(" ReplaceExistingButton : " + e.message);
        }
    }

    // crée le nouveau bouton d'effacement // efface l'ancien
    function ReplaceDeleteButton() {
        try {
            var oldButton = document.getElementsByName("bEmptyDest")[0];
            oldButton.style.visibility = "hidden";
            oldButton.style.display = "none";
            var newButton = document.createElement('input');
            newButton.setAttribute("id", "newButtonDeleteDestinataires");
            newButton.setAttribute("type", "button");
            newButton.setAttribute("value", "Effacer tous les destinataires");
            newButton.setAttribute("class", "mh_form_submit");
            newButton.addEventListener('click', function () { document.getElementsByName("MSG_destinataires")[0].value = ''; GetNewListLink().innerHTML=''; }, true);
            newButton.addEventListener('mouseover', function () { this.style.cursor = 'hand'; }, true);

            oldButton.parentNode.appendChild(newButton);
        }
        catch (e) {
            alert(" ReplaceExistingButton : " + e.message);
        }
    }

    // modification de la page MH
   try {
       CreateAutoSuggestTB();
       ReplaceAddButton();
       ReplaceDeleteButton();
       document.body.addEventListener('click', function () { GetAutoSuggestDiv().style.visibility = "hidden"; });
       CallServerTrollLink(); // dans le cas d'une réponse 

    }
    catch (e) {
        //alert("JS - Init page: " + e.message);		// FZZ: modification pour intégration à ZZ (Zorya)   : mise ne commentaire!
    }
}


