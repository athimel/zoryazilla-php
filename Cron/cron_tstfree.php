<?php

	echo '<iframe style="display:none;" name="iframe_profil" id="id_iframe_profil" src="http://localhost/FZZ/zoryazilla.php?&action=crossdomain&url=http://games.mountyhall.com/mountyhall/View/PJView.php?ai_IDPJ=28468"></iframe>';

	echo "LA PAGE....<br>";
	print("<script type=\"text/javascript\">		
		var timout_count=0;
		function valide_troll() { 
				var myIFrame = document.getElementById('id_iframe_profil');
				var doc = myIFrame.contentDocument;
				var crossdiv=doc.getElementsByName('crossdiv')[0];
				timout_count=timout_count+1;
				if ((crossdiv.innerHTML.value=='Loading...')&&(timout_count<5)) { 
					setTimeout(\"valide_troll()\",1000);	// on attend pendant 5s.
				} else {
					alert(crossdiv.innerHTML);
				}
		}
			
		window.onload = function(e){
			setTimeout(\"valide_troll()\",1000);;
			return
		} 
	</script>");			
		
		
		
#$fp = fsockopen("http://ftp.mountyhall.com/Public_Trolls.txt", 80, $errno, $errstr, 30);
#if ($fp) echo "fsockopen OK"; else echo "fsockopen PAS MIEUX";  

##$response = http_get("http://ftp.mountyhall.com/Public_Trolls.txt", array("timeout"=>1), $info);
##print_r($info);

//phpinfo();

	  	//$fds=fopen("ftp://ftp.mountyhall.com/Public_Trolls.txt", "r");
	  	///$fdd=fopen("ftp/Public_Diplomatie.txt", "w+");
	  	
		
		
		
#$ftp_server = "ftp.mountyhall.com";
#$ftp_user = "anonymous";
#$ftp_pass = "zoryazilla";
#
#$URLFILE="http://ftp.mountyhall.com/Public_Trolls.txt";
#
#  /*      $ch = curl_init("$URLFILE");
#        curl_setopt($ch, CURLOPT_HEADER, 0);
#        curl_setopt($ch, CURLOPT_POST, 1);
#        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
#        $output = curl_exec($ch);      
#        curl_close($ch);
#        echo "cURL=[$output]";*/
#
#		
#	@$ch = curl_init();
#	@curl_setopt($ch, CURLOPT_URL, $URLFILE);
#	@curl_setopt($ch, CURLOPT_USERAGENT, "ZZCdmBot : Fusion ZoryaZilla CdM Bot");
#	@curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
#	$result = @curl_exec ($ch); 
#	@curl_close ($ch);
#	echo "cURL=[$result]";
#	
#	
#// set up a connection or die
#$conn_id = ftp_connect($ftp_server) or die("Couldn't connect to $ftp_server"); 
#
#// try to login
#if (@ftp_login($conn_id, $ftp_user, $ftp_pass)) {
#    echo "Connected as $ftp_user@$ftp_server\n";
#} else {
#    echo "Couldn't connect as $ftp_user\n";
#}



##	  	if ($fds) {
##
##			while(!feof($fds)) {
##				$buffer=fgets($fds);												// et on remplit avec les nouvelles valeurs
##				///fputs($fdd, $buffer);
##				$troll = explode(";", $buffer);
##				$l=sizeof($troll);
##			    $query =  "INSERT INTO `MH_Trolls` VALUES ('$troll[0]','".mysql_real_escape_string($troll[1])."','".$troll[$l-7]."','".$troll[$l-6]."','".$troll[$l-5]."','".$troll[$l-4]."','".$troll[$l-2]."','".$troll[$l-3]."')";
##  				echo "$query<BR>";
##	  			//$result = @MySQL_QUERY($query);
##			}
##			fclose($fds);
##			///fclose($fdd);
##		}
	
?>			