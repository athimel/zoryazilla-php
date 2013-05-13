/*
 * Script MZ : Affiche un compte à rebours avant la prochaine DLA
 * Auteur : Marmotte86 (93138)
 */

/* Lancement du script selon la page chargée */
if(currentURL.indexOf("MH_Play/Play_menu.php") != -1) {
	var mhTitle = top.document.title;
	var divInfo = document.evaluate('//div[@class="infoMenu"]',document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
	var divDLA = document.createElement('span');
	divDLA.setAttribute('style', 'cursor: pointer');
	divInfo.insertBefore(divDLA, document.evaluate('//br',divInfo,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue);
	divInfo.insertBefore(document.createElement('br'), divDLA);
	divInfo = divInfo.innerHTML;

	function displayTime() {
		var dlaInfo = divInfo.match(/DLA:\s+(\d+)\/(\d+)\/(\d+) (\d+):(\d+):(\d+)/);
		var dlaDate = new Date(dlaInfo[3], dlaInfo[2]-1, dlaInfo[1], dlaInfo[4], dlaInfo[5], dlaInfo[6]);
		var mhDiff = MZ_getValue('rebours_diff_time');
		var dlaDiff = dlaDate.getTime() - (new Date()).getTime() - mhDiff;
		if(dlaDiff > 0) {
			var dlaTime = new Date(dlaDiff);
			var dlaHours = Math.floor(dlaDiff / 60 / 60 / 1000);
			var dlaMinutes = dlaTime.getUTCMinutes();
			if(dlaMinutes < 10) dlaMinutes = '0' + dlaMinutes;
			var dlaSeconds = dlaTime.getUTCSeconds();
			if(dlaSeconds < 10) dlaSeconds = '0' + dlaSeconds;
			var dlaTimeString = 'DLA dans : ' + dlaHours + ':' + dlaMinutes + ':' + dlaSeconds;
			var dlaTitleString = dlaHours + ':' + dlaMinutes + ':' + dlaSeconds;
		}
		else if(dlaDiff > -(5 * 60 * 1000)) {
			var dlaTime = new Date(-dlaDiff);
			var dlaMinutes = dlaTime.getUTCMinutes();
			var dlaSeconds = dlaTime.getUTCSeconds();
			if(dlaSeconds < 10) dlaSeconds = '0' + dlaSeconds;
			var dlaTimeString = 'Over-DLA : ' + dlaMinutes + ':' + dlaSeconds;
			var dlaTitleString = dlaMinutes + ':' + dlaSeconds + ' (Over-DLA)';
		}
		else {
			var dlaTimeString = 'Vous pouvez activer';
			var dlaTitleString = 'Vous pouvez activer';
			clearInterval(timer);
		}

		/* Affichage du compte à rebours */
		divDLA.innerHTML = dlaTimeString;
		document.title = dlaTitleString + ' - ' + mhTitle;
		if(MZ_getValue('rebours_in_title')) top.document.title = dlaTitleString + ' - ' + mhTitle;
		else top.document.title = mhTitle;
	};
	var timer = setInterval(displayTime, 500);

	function changeDisplay() {
		MZ_setValue('rebours_in_title', !MZ_getValue('rebours_in_title'));
		displayTime();
	};
	divDLA.addEventListener('click', changeDisplay, true);
}
else if(currentURL.indexOf("MH_Play/Play_action.php") == -1){
	var mhInfo = document.body.innerHTML.match(/\[Heure Serveur :\s+(\d+)\/(\d+)\/(\d+) (\d+):(\d+):(\d+)/);
	var mhDate = new Date(mhInfo[3], mhInfo[2]-1, mhInfo[1], mhInfo[4], mhInfo[5], mhInfo[6]);
	MZ_setValue('rebours_diff_time', mhDate.getTime() - (new Date()).getTime());
}
