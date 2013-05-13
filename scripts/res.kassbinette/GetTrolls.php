<?php

	require_once("../../Config/_sqlconf.php");
	# http://www.kassbinette.net/scriptsComplementairesMH/Autosuggest/GetTrolls.aspx?query=Zor&callCounter=3
	# {"callCounter":"3","query":"Zor","suggestions":["zorglub","Zorak Zoran","Zorglublemechant","AzorkA","ZorakZoran","Zorak","Zorgloub","Zoram","bashozor","Zorya","Enzorth","Balzorg","Razorb","zorak zoranus","Zozor","zorback","Megazord","Zor","Squilnozor","Zorglubounet"],
	#"data":[997,1012,3766,5443,9160,12671,13129,15435,21735,28468,53915,58668,58834,59744,67609,71587,73236,84752,88594,89633],
	#"presentations":[" [997] Tomawak niveau 39"," [1012] Skrim niveau 34"," [3766] Kastar niveau 55"," [5443] Durakuir niveau 42"," [9160] Kastar niveau 60"," [12671] Kastar niveau 40"," [13129] Durakuir niveau 30"," [15435] Kastar niveau 17"," [21735] Kastar niveau 39"," [28468] Durakuir niveau 60"," [53915] Kastar niveau 35"," [58668] Kastar niveau 40"," [58834] Kastar niveau 40"," [59744] Durakuir niveau 47"," [67609] Tomawak niveau 18"," [71587] Kastar niveau 44"," [73236] Durakuir niveau 20"," [84752] Skrim niveau 25"," [88594] Tomawak niveau 39"," [89633] Skrim niveau 13"],"countReturnedTroll":20,"countMaxTroll":44}


	#{"callCounter":"2","query":"aaxj","suggestions":[],"data":[],"presentations":[],"countReturnedTroll":0,"countMaxTroll":0}
	
	$callCounter=$_GET['callCounter'];
	$qry=$_GET['query'];

	if (($callCounter=="") || ($qry=="")) die();

	#-----------------------------------------------------------------------------------
	$mysql=_sqlconnect();	# -------------- Ouverture DB  

	$query = "SELECT TiD,Troll,Race,Niveau from MZ_Trolls where Troll like '%$qry%'";  	
	//echo "$query<BR>";
	$result = @MySQL_QUERY($query);
	$nrow = @MySQL_NUM_ROWS($result);	
	
	/*if ($nrow<=0) {	// élargir la recherhce
		$query = "SELECT TiD,Troll,Race,Niveau from MZ_Trolls where Troll like '%$qry%'";  	
		//echo "$query<BR>";
		$result = @MySQL_QUERY($query);
		$nrow = @MySQL_NUM_ROWS($result);	
	}*/

	_sqlclose();	# -------------- Fermeture DB   
	#-----------------------------------------------------------------------------------
	$max=min(20, $nrow);
	
	$suggestions="";
	$data="";
	$presentations="";

	for ($i=0; $i<$max; $i++) {
		$TiD=mysql_result($result,$i,"TiD"); 
		$Troll=mysql_result($result,$i,"Troll"); 
		$Race=mysql_result($result,$i,"Race"); 
		$Niveau=mysql_result($result,$i,"Niveau"); 
		if ($i>0) $suggestions.=","; $suggestions.="\"$Troll\"";
		if ($i>0) $data.=","; $data.="$TiD";
		if ($i>0) $presentations.=","; $presentations.="\" [$TiD] $Race niveau $Niveau\"";
	}

	if ($max>0) echo '{"callCounter":"'.$callCounter.'","query":"'.$qry.'","suggestions":['.$suggestions.'],"data":['.$data.'],"presentations":['.$presentations.'],"countReturnedTroll":'.$max.',"countMaxTroll":'.$nrow.'}';
	else echo '{"callCounter":"'.$callCounter.'","query":"'.$qry.'","suggestions":[],"data":[],"presentations":[],"countReturnedTroll":0,"countMaxTroll":0}';

	die();
?>