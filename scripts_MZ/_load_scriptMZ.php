<?php
function chargerScript($file) {
	global $scriptsMZ;
	
	$script_name=$file."_FF.js";
	$script_file=$scriptsMZ.$script_name;
	printf("Loading: ".$script_file."<br>");

		
	$fds=gzopen($script_file, 'r');
	$fdd=fopen("MZ/$script_name", "w+");

    while(!feof($fds)) {
		$buffer=fgets($fds);
		fputs($fdd, $buffer);
	}
	fclose($fds);
	fclose($fdd);
}

require("_def.php");

echo "End of load!";

?>