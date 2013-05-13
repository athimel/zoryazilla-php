<?php
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1		pour empecher la mise en cache!!!
header("Content-Type: image/png");

ob_start();
include("cron.php");
ob_end_clean();				// on s'assure que rien ne transpire du cron!

if ( isset($_GET['return_image']) )
{ 
	if ($_GET['return_image']==2)
		require("cron2.png");
	else if ($_GET['return_image']==3)
		require("cron3.gif");
	else 
		require("cron.png");
} else  {
	header("Content-Length: 49");
	echo pack('H*', '47494638396101000100910000000000ffffffffffff00000021f90405140002002c00000000010001000002025401003b');
}
?>