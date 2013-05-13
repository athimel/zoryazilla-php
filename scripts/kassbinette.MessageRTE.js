
/*
* Script MZ :Transformation de la boite d'édition standard des messages en un rich text editor
* Auteur : Kassbinette (95429)
* Contributeur : Utilisation des exemples Mozilla de rte 
*                fonction addbutton empruntée aux scripts de Marmotte86 (93138) & disciple (62333)
* Intégration complète des scripts Messagerie.js de Marmotte86 (93138) & disciple (62333)
*
* Merci à Vapulabehemot(82169) pour ces remarques pertinentes et ses corrections dans les infobulles.
* La variable hostName doit être adaptée si le script est copié sur un autre serveur.
* Le chemin du fichier doit subir le même sort si l'arborescence est changée.
* 
*/

// var hostName = "http://localhost:2305";

// FZZ: modification pour intégration à ZZ (Zorya)
//var hostName = "http://www.Kassbinette.net";
//var editorPath = "/ScriptsComplementairesMh/MessageRTE/";
var hostName = ZZDB.substr(0, ZZDB.indexOf("/", 8));  
var editorPath = ZZDB.substring(hostName.length)+"/scripts/res.kassbinette/";
//FZZ: Fin modifications........
var editorPage = editorPath + "MessageRTE.htm";
	

if (currentURL.indexOf("MH_Play/Play_vue.php") != -1) {


    function appendLinkToCopiableTable(labelName, tableName) {
        try {
          
            document.getElementsByName(labelName)[0].parentNode.innerHTML = "<span>" + document.getElementsByName(labelName)[0].parentNode.innerHTML + "</span>";
            oA = document.createElement("A");
            oA.style.cssFloat = "right";
          // oA.innerHTML = "showCopiable";
            oImg = document.createElement("IMG");
            oImg.src = hostName + editorPath + "ClipBoard.png";
            oImg.alt = "Montrer une version copier-collable du tableau";
            oA.appendChild(oImg);
            oA.addEventListener('click', function () { if (document.getElementById("showCopiableTable") == null || document.getElementById("showCopiableTable").style.display == "none") displayTable(labelName, tableName); else document.getElementById("showCopiableTable").style.display = "none"; }, true);
            document.getElementsByName(labelName)[0].parentNode.appendChild(oA);
        }
        catch (e) {
            alert("JS - appendLinkToCopiableTable : " + e.message);
        
        }
    }
    
   

    function removeChildren(oObj) {

        if (oObj.hasChildNodes()) {
            while (oObj.childNodes.length >= 1) {
                oObj.removeChild(oObj.firstChild);
            }
        }

    }

  
   function findPosY(obj) {
	var  curtop = 0;
	    if (obj.offsetParent) {
	        do {
	            curtop += obj.offsetTop;
	        } while (obj = obj.offsetParent);
	    }
	    return curtop;
    }


    function displayTable(labelName, tableName) {
        try{
            var oDiv = document.getElementById("showCopiableTable");
            if (oDiv == null) oDiv = document.createElement("DIV");
            else removeChildren(oDiv);
        
            oDiv.style.display = "block";   
            oDiv.id = "showCopiableTable"; 
            oDiv.style.zIndex = 100;
            oDiv.style.padding = "0px";
            oDiv.style.margin = "0px";
            oDiv.style.top = findPosY(document.getElementsByName(labelName)[0]);
            oDiv.style.left = 100;
            oDiv.style.border = "1px black solid";
            oDiv.style.position = "absolute";
        
            var oEntete = document.createElement("DIV");
            oEntete.style.width = "100%";
            oEntete.style.height = "22px";
            oEntete.style.border = "1px black solid";
            //oEntete.style.background = "White";
            oEntete.style.backgroundImage = "url('" + hostName + editorPath + "MHfond.jpg')";
            oEntete.id = "showCopiableTableEntete";

            var oEnteteTextInnerDiv = document.createElement("DIV");
            oEnteteTextInnerDiv.style.cssFloat = "left";
            oEnteteTextInnerDiv.style.height = "20px";
            oEnteteTextInnerDiv.innerHTML = "Tableau copier-collable vers le MessageRTE";
            oEnteteTextInnerDiv.style.marginTop = "2px";
            oEnteteTextInnerDiv.style.marginLeft = "2px";
        
            var oEnteteInnerDiv = document.createElement("DIV");
            oEnteteInnerDiv.style.cssFloat = "right";
            oEnteteInnerDiv.style.height = "20px";
            oEnteteInnerDiv.style.width = "20px";

            var oImg = document.createElement("Img");
            oImg.style.width = "100%";
            oImg.style.marginRight = "5px";
            oImg.style.paddingRight = "3px";
            oImg.style.paddingTop = "3px";
            oImg.style.height = "15px";
            oImg.style.width = "15px";
            oImg.addEventListener('click', function () { document.getElementById("showCopiableTable").style.display = "none"; }, true);
            oImg.src = hostName + editorPath + "index.png";
            oImg.style.float = "right";

            oEnteteInnerDiv.appendChild(oImg);
            oEntete.appendChild(oEnteteTextInnerDiv);
            oEntete.appendChild(oEnteteInnerDiv);
            oDiv.appendChild(oEntete);
        
            var oInnerDiv = document.createElement("DIV");
            oInnerDiv.style.width = "100%";
            oInnerDiv.innerHTML = document.getElementById(tableName).innerHTML;
        
            oDiv.appendChild(oInnerDiv);

            document.body.appendChild(oDiv);

         
       }
       catch(e)
       {
           alert("JS - displayTable : " + e.message);
       }
    }



    appendLinkToCopiableTable("monstres", "mh_vue_hidden_monstres");
    appendLinkToCopiableTable("trolls", "mh_vue_hidden_trolls");
    appendLinkToCopiableTable("tresors", "mh_vue_hidden_tresors");
    appendLinkToCopiableTable("champignons", "mh_vue_hidden_champignons");
    appendLinkToCopiableTable("lieux", "mh_vue_hidden_lieux");
    appendLinkToCopiableTable("cadavres", "mh_vue_hidden_cadavres");
 }

if (currentURL.indexOf("Messagerie/MH_Messagerie.php?cat=3") != -1) {
  



    // Dialogue avec l'iframe
    function receiveMessage(event) {
        try {
                // vérifier l'origine du message
                if (event.origin.toLowerCase() == hostName.toLowerCase()) {
                {
                    // l'Iframe enfant envoie le texte qu'elle contient donc l'ajouter  le texte dans la textArea originale
                    if (event.data.substring(0, "SendHtml".length) == "SendHtml")
                        SendHtml(event.data);
                    //  l'iframe demande le texte présent dans la text area donc lui fournir le texte présent dans celle ci
                    else if (event.data == "RequestText")
                        FillText();
                    else if (event.data == "HideTextArea")
                        HideTextArea();
                    else if (event.data == "DisplayRTE")
                        DisplayRTE();
                    else if (event.data == "Preview")
                        displayPreview();
                    else if (event.data == "SaveMsg")
                        SaveMsg();
                    else if (event.data.substring(0, "SaveMpFont".length) == "SaveMpFont")
                        SaveFont(event.data.substring("SaveMpFont".length, event.data.length));
                    else if (event.data == "RTERequestMpFont")
                        SendFont();
                    else if (event.data == "RestoreMsg")
                        RestoreMsg();
                    else if (event.data == "Reply")
                        Reply();
                    else if (event.data == "RTERequestMpSignature") {
                        SendSignature();
                    }
                    else if (event.data == "RTERequestMpSignatureUsage") {
                        SendSignatureUsage();
                    }
                    else if (event.data.substring(0, "SaveSignatureUsage".length) == "SaveSignatureUsage") {
                        SaveSignatureUsage(event.data.substring("SaveSignatureUsage".length, event.data.length));
                    }
                    else if (event.data.substring(0, "SaveMpSignature".length) == "SaveMpSignature") {
                        SaveSignature(event.data.substring("SaveMpSignature".length, event.data.length));
                    }
                    else { alert("JS - receiveMessage - Commande non reconnue : " + event.data); }
                }

            }
            else {
                alert("HostName incorrect :" + event.origin + " alors que " + hostName + " était attendu.");
            }
        }
        catch (e) {
            alert("JS - receiveMessage : " + e.message);
        }
    }
    //stocker la signature
    function SaveSignature(signature) {
        try {
            MZ_setValue('MpSignature', signature);
        }
        catch (e) {
            alert("JS - SaveSignature : " + e.message);
        }

    }
    //stocker l'utilisation de la signature
    function SaveSignatureUsage(usage) {
        try {
            MZ_setValue('MpSignatureUsage', usage);
        
        }
        catch (e) {
            alert("JS - SaveSignatureUsage : " + e.message);
        }

    }

    
    //envoyer signature
    function SendSignature(){
       try {
           if (MZ_getValue('MpSignature')) {
               signature = MZ_getValue('MpSignature');
               var iFrameWindow = unsafeWindow.document.getElementById('RTEedit').contentWindow;
               iFrameWindow.postMessage("JsSendMpSignature" + signature, hostName);
           }    
        }
        catch (e) {
            alert("JS - SaveSignature : " + e.message);
        }

    }
    //envoyer l'utilisation de la signature
    function SendSignatureUsage() {
        try {
            if (MZ_getValue('MpSignatureUsage')) {
                signatureUsage = MZ_getValue('MpSignatureUsage');
                var iFrameWindow = unsafeWindow.document.getElementById('RTEedit').contentWindow;
                iFrameWindow.postMessage("JsSendMpSignatureUsage" + signatureUsage, hostName);
            }
        }
        catch (e) {
            alert("JS - SaveSignature : " + e.message);
        }

    }
    

      //stocker la font
    function SaveFont(fontName) {
        try {
            MZ_setValue('MpFont', fontName);
        }
        catch (e) {
            alert("JS - SaveFont : " + e.fontName);
        }
    
    }
    function SendFont() {
        try {
            if (MZ_getValue('MpFont')) {
                fontname = MZ_getValue('MpFont');
                var iFrameWindow = unsafeWindow.document.getElementById('RTEedit').contentWindow;
                iFrameWindow.postMessage("JsSendMpFont" + fontname, hostName);
            }
        }
        catch (e) {
            alert("JS - SendFont : " + e.message);
        }
    }
    // fonction envoyant le texte de la rte au textArea
    function SendHtml(text) {
         try {
            document.getElementsByName('Message')[0].value = text.substring("SendHtml".length, text.length).replace(/<br>/gi, '\r\n');
            displayPreview();
        }
        catch (e) {
            alert("JS - SendHtml : " + e.message);
        }
    
    }
    /// fonction demandant au rte de fournir le texte qu'elle contient
    function RequestHtmlText() {
        try {
            var iFrameWindow = unsafeWindow.document.getElementById('RTEedit').contentWindow;
            // demander le texte contenu dans la textbox area
            iFrameWindow.postMessage("RequestHtmlText", hostName);
        }
        catch (err) {
            alert("JS - error : " + err.message);
        }
    }
    // fournir le texte de la textarea au rte
    function FillText() {
        try {
            var iFrameWindow = unsafeWindow.document.getElementById('RTEedit').contentWindow;
            // forcer le stockage du texte contenu dans la textbox area dans la boite d'édition
            iFrameWindow.postMessage("FillText" + document.getElementsByName('Message')[0].value.replace(/\n/gi, '<br>'), hostName);
            displayPreview();
        }
        catch (err) {
            alert("JS - error : " + err.message);
        }
    }
    // cacher la text area
    function HideTextArea() {
        try {
            document.getElementsByName('Message')[0].style.visibility = "hidden";
            document.getElementsByName('Message')[0].style.display = "none";
        }
        catch (e) {
            alert("JS - HideTextArea : " + e.message);
        }
    }
    // cacher la text area
    function ShowTextArea() {
        try {
            document.getElementsByName('Message')[0].style.visibility = "visible";
            document.getElementsByName('Message')[0].style.display = "block";
        }
        catch (e) {
            alert("JS - ShowTextArea : " + e.message);
        }
    }


    // creer le rte
    function createRTE() {
        try {
            // creation de la text area
            var messageArea = document.getElementsByName('Message')[0];
            //messageArea.parentNode.appendChild(document.createElement('br'));
            var newTextArea = document.createElement('iframe');
            newTextArea.setAttribute('id', 'RTEedit');
            newTextArea.setAttribute('src', hostName + editorPage);
            newTextArea.setAttribute('style', 'border:0px;overflow:hidden;width:630px;height:440px;display:none');
            messageArea.parentNode.appendChild(newTextArea);
            submitButton = document.getElementsByName('bsSend')[0];
        }
        catch (e) {
            alert("JS - CreateRTE : " +e.message);
        }
       
    
    }
    // montrer le rte
    function DisplayRTE() {
        try {
            document.getElementById('RTEedit').style.display = "block";
        }
        catch (e) {
            alert("JS - DisplayRTE : " + e.message);
        }
    }
    
    // ajout d'un bouton 
    function addButton(caption, clickFunction) {
        try {
            var sendButton = document.getElementsByName('bsSend')[0];
            var newButton = document.createElement('input');
            newButton.setAttribute('type', 'button');
            newButton.setAttribute('class', 'mh_form_submit');
            newButton.setAttribute('value', caption);
            newButton.addEventListener('click', clickFunction, true);
            sendButton.parentNode.appendChild(document.createTextNode(' '));
            sendButton.parentNode.appendChild(newButton);
        }
        catch (e) {
            alert("JS - addButton : " + e.message);
        }
    };
    
    ///// intégration des scripts de marmotte et disciple //////////////
    function addPreviewBox() {
        try {
           
            // Ajout de la ligne d'affichage de l'aperçu
            var trPreview = document.createElement('tr');
            trPreview.setAttribute('class', 'mh_tdpage');
            var tdPreview = document.createElement('td');
            tdPreview.setAttribute('id', 'marmotte_preview');
            tdPreview.setAttribute('colspan', 4);
            trPreview.appendChild(tdPreview);
            //            document.getElementsByTagName('form')[0].getElementsByTagName('table')[2].getElementsByTagName('tbody')[0].appendChild(trPreview);
            document.getElementsByName('bsSend')[0].parentNode.parentNode.parentNode.appendChild(trPreview);
        }
        catch (e) {
            alert("JS - addPreviewBox : " + e.message);
        }
    }
    // Affichage de l'aperçu
    function displayPreview() {
        try {
            var tdPreview = document.getElementById('marmotte_preview');
            var messageArea = document.getElementsByName('Message')[0];
            tdPreview.innerHTML = messageArea.value.replace(/\r?\n/g, '<br>');
        }
        catch (e) {
            alert("JS - displayPreview : " + e.message);
        }
    };
    // Sauvegarde du MP
    function SaveMsg() {
        try {
            
            var messageArea = document.getElementsByName('Message')[0];
            var titleInput = document.getElementsByName('Titre')[0];
            if (titleInput.value != '') MZ_setValue('lastMPTitle', titleInput.value);
            if (messageArea.value != '') MZ_setValue('lastMP', messageArea.value);
            
        }
        catch (e) {
            alert("JS - SaveMsg : " + e.message);
        }
    };
    // Restauration du MP sauvegardé
    function RestoreMsg() {
        try {
            var messageArea = document.getElementsByName('Message')[0];
            var titleInput = document.getElementsByName('Titre')[0];
            if (MZ_getValue('lastMPTitle')) titleInput.value = MZ_getValue('lastMPTitle');
            if (MZ_getValue('lastMP')) messageArea.value = MZ_getValue('lastMP');
            FillText();
        }
        catch (e) {
            alert("JS - RestoreMsg : " + e.message);
        }
    };
    // Restauration du MP sauvegardé
    function Reply() {
        var messageArea = document.getElementsByName('Message')[0];
        if (MZ_getValue('lastReply')) messageArea.value = MZ_getValue('lastReply');
        FillText();
    };
     
    /// fin premiere partie intégration

  

    
    // modification de la page MH
    try {
        // initialiser les evenements sur la page 
        unsafeWindow.addEventListener("message", receiveMessage, false);
        // ajout d'un event on change sur la text area
      //  document.getElementsByName('Message')[0].addEventListener("change", FillText, false);
        // ajouter le RTE (mais pas le montrer, lorsqu'il sera créé il demandera lui meme a cette page de l'afficher) 
        createRTE();
        /// Marmotte : ajouter  la boite de preview 
        addPreviewBox();
        /// Marmotte : ajouter l'evenement enregistrant la copie durant l'envoi du message
        document.getElementsByName('bsSend')[0].addEventListener('click', SaveMsg, true);

        if (hostName == "http://localhost:2105" || hostName == "http://localhost:2305")
        {
            addButton("Textarea Text", ShowTextArea);
           
        }
        
    }
    catch (e) {
        alert("JS - Init page: " + e.message);
    }


   
}
/* Ajout de disciple (62333) */
else if (currentURL.indexOf("Messagerie/ViewMessage.php?answer=1") != -1) {
    function reply(e) {
        var reply = document.evaluate("//table/tbody/tr[5]/td", document, null, XPathResult.ANY_TYPE, null).iterateNext().innerHTML;
        reply = '> ' + reply.replace(/<br>/g, '<br>&gt; ');
        MZ_setValue('lastReply', reply + '\n\n');
    };

    document.getElementsByName('bAnswer')[0].addEventListener('click', reply, true);
    document.getElementsByName('bAnswerToAll')[0].addEventListener('click', reply, true);




}


