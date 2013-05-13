<?php
//Fonction pour l'affichage des lignes
function imagelinethick($image, $x1, $y1, $x2, $y2, $color, $thick = 1) {
    /* de cette manière, ca ne marche bien que pour les lignes orthogonales
    imagesetthickness($image, $thick);
    return imageline($image, $x1, $y1, $x2, $y2, $color);
    */
    if ($thick == 1) {
        return imageline($image, $x1, $y1, $x2, $y2, $color);
    }
    $t = $thick / 2 - 0.5;
    if ($x1 == $x2 || $y1 == $y2) {
        return imagefilledrectangle($image, round(min($x1, $x2) - $t), round(min($y1, $y2) - $t), round(max($x1, $x2) + $t), round(max($y1, $y2) + $t), $color);
    }
    $k = ($y2 - $y1) / ($x2 - $x1); //y = kx + q
    $a = $t / sqrt(1 + pow($k, 2));
    $points = array(
        round($x1 - (1+$k)*$a), round($y1 + (1-$k)*$a),
        round($x1 - (1-$k)*$a), round($y1 - (1+$k)*$a),
        round($x2 + (1+$k)*$a), round($y2 - (1-$k)*$a),
        round($x2 + (1-$k)*$a), round($y2 + (1+$k)*$a),
    );
    imagefilledpolygon($image, $points, 4, $color);
    return imagepolygon($image, $points, 4, $color);
}

//Récupération du trajet à afficher
$trajet = $_GET['trajet'];
$coord = explode(',',$trajet);
$nb_pt = floor(count($coord)/2);

//Paramètres
$coeff=2; $larg = $coeff*100; //echelle de l'image : coeff=1 => 1px=1caverne
$decalv=35; $decall=50; //offset haut et gauche pour l'affichage de l'image
$etage = 60; $period = 24*3600;


//création du fond de la carte
$im = ImageCreate (2*$larg+$decall+60, 2*$larg+$decalv+20) or die ("Erreur lors de la création de l'image");  
$fond = imagecolorallocatealpha($im, 255, 255, 255,127);
ImageFill ($im, 0, 0, $fond);
 
//couleurs de base		
$bleu = ImageColorAllocate ($im, 17, 17, 150);
$bleu_c = ImageColorAllocate ($im, 100, 117, 200);

for ($i=1;$i<$nb_pt;$i++) {
	// imageline($im, $coord[2*$i-2]*$coeff+$decall+$larg, -$coord[2*$i-1]*$coeff+$decalv+$larg, $coord[2*$i]*$coeff+$decall+$larg, -$coord[2*$i+1]*$coeff+$decalv+$larg, $bleu_c );
	$dx = $coord[2*$i]-$coord[2*$i-2];
	$dy = $coord[2*$i+1]-$coord[2*$i-1];

	//Détermination de la forme du trajet
	if (abs($dx) < abs($dy)) {
		$x_inter = $coord[2*$i];
		$y_inter = ($dy<0)? $coord[2*$i-1]-abs($dx):$coord[2*$i-1]+abs($dx);
	}
	else {
		$x_inter = ($dx>0)? $coord[2*$i-2]+abs($dy):$coord[2*$i-2]-abs($dy);
		$y_inter = $coord[2*$i+1];
	}
	
	//Affichage des lignes
	imagelinethick($im, $coord[2*$i-2]*$coeff+$decall+$larg, -$coord[2*$i-1]*$coeff+$decalv+$larg, $x_inter*$coeff+$decall+$larg, -$y_inter*$coeff+$decalv+$larg, $bleu_c, 2);
	imagelinethick($im, $x_inter*$coeff+$decall+$larg, -$y_inter*$coeff+$decalv+$larg, $coord[2*$i]*$coeff+$decall+$larg, -$coord[2*$i+1]*$coeff+$decalv+$larg, $bleu_c, 2);
	
	//affichage des points
	ImageFilledEllipse($im, $coord[2*$i]*$coeff+$decall+$larg, -$coord[2*$i+1]*$coeff+$decalv+$larg, 6, 6, $bleu_c);
}
ImageFilledEllipse ($im, $coord[0]*$coeff+$decall+$larg, -$coord[1]*$coeff+$decalv+$larg, 6, 6, $bleu_c);

ImageColorTransparent ($im, $blanc);


//export image
header ("Content-type: image/png"); 
ImagePng ($im);
?>