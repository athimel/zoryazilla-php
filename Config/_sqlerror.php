<?
/*ECHO "
SQL Error:<BR>
1 => Coterie inconnue, ou mauvais  Password<BR>
2 => Creation de coterie impossible<BR>
3 => Erreur Authentification MH<BR>
4 => Troll non-membre de la coterie<BR>
5 => Action illégale<BR>
6 => Format invalide<BR>
";*/

function _sqlerr($err) {
 	switch ($err) {
	 	case 0: $msg="OK";	break;
	 	case 1: $msg="Coterie inconnue, ou mauvais  Password";	break;
	 	case 2: $msg="Creation de coterie impossible";	break;
	 	case 3: $msg="Erreur Authentification MH";	break;
	 	case 4: $msg="Troll non-membre de la coterie";	break;
	 	case 5: $msg="Action illégale";	break;
	 	case 6: $msg="Format invalide";	break;
	 	default:$msg="Erreur";	
	}
    return ($msg);
}

?>