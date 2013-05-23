/*********************************************************************************
*    This file is part of ZoryaZilla Fusion merged with mountyzilla              *
*********************************************************************************/
//============================ ZZ PRE CODE =======================================
/*********************************************************************************
*  This file is part of Mountyzilla (http://mountyzilla.tilk.info/)              *
*  Mountyzilla is free software; provided under the GNU General Public License   *
*********************************************************************************/

/* v0.0.1 by Dabihul - 2013-04-21 */

const annivURL = 'http://mountyzilla.tilk.info/scripts/anniv.php';
const rssURL = 'http://mountyzilla.tilk.info/news/rss.php';
const nbitems = 10;
const maxchardescription = 300;

function epureDescription(texte)
{
	return texte.replace(/\\(.)/g,"$1");
}

MZ_xmlhttpRequest({
		    method: 'GET',
		    url: annivURL,
		    headers: {
		        'User-agent': 'Mozilla/4.0 [FusionZoryaZilla] (compatible) Mountyzilla',
		        'Accept': 'application/xml,text/xml',
		    },
		    onload: function(responseDetails) {
				try
				{
					
					var listetrolls = responseDetails.responseText.split("\n");
					if(listetrolls.length==0)
						return;
					var string = '<table border="0" class="mh_tdborder" cellspacing="1" cellpadding="1" STYLE="max-width:98%"><tr CLASS="mh_tdtitre"><td align="center"><b><span class="Echo_texte" title="Envoyez leur un message ou un cadeau !">Les Trõlls qui fêtent leur anniversaire aujourd\'hui</span></b></td></tr><tr CLASS="mh_tdpage"><td align="center"><small>';
					var first = true;
					for(var i=0;i<listetrolls.length;i++)
					{
						var infos = listetrolls[i].split(";");
						if(infos.length!=3 || 1*infos[2]==0)
							continue;
						var an = "ans";
						if(first)
							first=false;
						else
							string += ", ";
						if(1*infos[2]==1)
							an = "an";
						string += '<a href="javascript:EPV('+infos[0]+')"><span class="Echo_texte">'+infos[1]+'</span></a> ('+infos[2]+' '+an+')'
					}
					string += '</small></td></tr></table>';
					var thisP = document.evaluate("//p/a/text()[contains(.,'messagerie')]/../..",
												document, null, 9, null).singleNodeValue;
					var newP = document.createElement('p');
					newP.setAttribute('align','center');
					if(thisP!=null)
					{
						thisP.parentNode.insertBefore(newP,thisP);
						newP.innerHTML=string;
					}
				}
				catch(e)
				{
					alert(e);
				}
			}
		});

MZ_xmlhttpRequest({
		    method: 'GET',
		    url: rssURL,
		    headers: {
		        'User-agent': 'Mozilla/4.0 [FusionZoryaZilla] (compatible) Mountyzilla',
		        'Accept': 'application/xml,text/xml',
		    },
		    onload: function(responseDetails) {
				try
				{
					var responseXML  = new DOMParser().parseFromString(responseDetails.responseText,'text/xml');
					var title = responseXML .evaluate("//channel/title/text()",	responseXML , null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
					//var link = responseXML .evaluate("//channel/link/text()",	responseXML , null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
					var description = responseXML .evaluate("//channel/description/text()",	responseXML , null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
					if(title && description)
					{
						var string = '<table border="0" class="mh_tdborder" cellspacing="1" cellpadding="1" STYLE="max-width:98%"><tr CLASS="mh_tdtitre"><td align="center" colspan="2"><p class="Style1"><span class="Echo_texte" title="'+epureDescription(description.nodeValue)+'">&nbsp;'+title.nodeValue+'&nbsp;</span></p></td></tr>';
						var items = responseXML .evaluate("//channel/item", responseXML , null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
						if(items.snapshotLength==0)
							return;
						for(var i=0;i<Math.min(items.snapshotLength,nbitems);i++)
						{
							var item = items.snapshotItem(i);
							var titleI = responseXML .evaluate("title/text()", item, null,XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
							var descriptionI = responseXML .evaluate("description/text()", item, null,XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
							if(titleI && descriptionI)
							{
								string += '<tr CLASS="mh_tdpage"><td align="center" valign="center"><b><span class="Echo_texte">'+titleI.nodeValue+'</span></b></td><td valign="center">'+epureDescription(descriptionI.nodeValue).substring(0,maxchardescription)+'</td></tr>'
							}
						}
						string += '</table>';
						//var thisP=document.getElementsByTagName('p')[8];
						//var thisP=document.evaluate("//p/table[@class = 'mh_tdborder' and contains(./descendant::text(),'Heure Serveur')]/..",	document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
						//var thisP=document.evaluate("//p/table/descendant::text()[contains(.,'Heure Serveur')]/../../../../..",	document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
						var thisP=document.getElementById('footer2');
						var newP=document.createElement('p');
						newP.setAttribute('align','center');
						thisP.parentNode.insertBefore(newP,thisP);
						newP.innerHTML=string;
					}

				}
				catch(e)
				{
					alert(e);
				}
			}
		});
//============================ ZZ POST CODE ======================================

function Anniversaire(){
      //var pos_base = document.getElementsByTagName('p');
      //pos_base[3].innerHTML="";
      var annivURL = 'http://mountyzilla.tilk.info/scripts/anniv.php';
      MZ_xmlhttpRequest({
          method: 'GET',
          url: annivURL,
          headers: {
              'User-agent': 'Mozilla/4.0 (compatible) ZoryaZilla',
              'Accept': 'application/xml,text/xml',
          },
          onload: function(responseDetails) {
            try
            {
               
               var nomOK = MZ_getValue('LOGON_TROLL').toLowerCase();
               var HappyBirthday=false;
               if (parseInt(nomOK)) idOK=parseInt(nomOK);

               var listetrolls = responseDetails.responseText.split("\n");
               if(listetrolls.length==0)
                  return;
               var string = '<table width=98% border="0" class="mh_tdborder" cellspacing="1" cellpadding="1"><tr CLASS="mh_tdtitre"><td align="center"><b>Joyeux anniversaire !!</b></td></tr><tr CLASS="mh_tdpage"><td align="center">';
               var first = true;
               
               
               for(var i=0;i<listetrolls.length;i++)
               {
                  
                  var infos = listetrolls[i].split(";");
                  if(infos.length!=3 || 1*infos[2]==0)
                     continue;
                  var an = "ans";
                  if(first)
                     first=false;
                  if(1*infos[2]==1)
                     an = "an";
                  if( (infos[1].toLowerCase() == nomOK) || (infos[0] == parseInt(nomOK)) )
                  {
                  	 HappyBirthday=true;
	                 string += '<a href="javascript:EPV('+infos[0]+')"><span class="Echo_texte" style="font-weight: bold; color: Green ;">'+infos[1]+'</span></a> ('+infos[2]+' '+an+')';
                  	 break;
                  }
               }
               
               
               
               string += '</td></tr></table>';
               if (HappyBirthday) {
	               var thisP = document.evaluate("//p/a/text()[contains(.,'messagerie')]/../..",   document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    	           var newP=document.createElement('p');
        	       newP.setAttribute('align','center');;
            	   thisP.parentNode.insertBefore(newP,thisP);
               	   newP.innerHTML=string;
               }
            }
            catch(e)
            {
               alert(e);
            }
         }
      });
}

Anniversaire();
