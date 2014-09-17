<?
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1		pour empecher la mise en cache (cache trop important avec ironie ou FF8) !!!
#header('<meta: http-equiv="Content-Type" content="text/html;charset=UTF-8">'); 		// pour les caractère accentué
header('Content-Type: text/html; charset=iso-8859-1'); 								// pour les caractère accentué
session_cache_limiter("nocache");
session_start();

#Script pour les versions antérieures à 1.0.5
require("_global.php");
require_once("./Config/_sqlconf.php");
#-----------------------------------------------------------------------------------

  #========== Settings ==========
  $HorsVue=15;  #15 cases
  $HorsDate=1;  #1 jour
  if (!isset($ZTRO)) $ZTRO=0;				// Troll Hors-Vue (illimité pour l'intant)
  if (!isset($ZMON)) $ZMON=$HorsVue;		// Monstre Hors-Vue
  if (!isset($ZTRE)) $ZTRE=$HorsVue;		// Trésors Hors-Vue
  if (!isset($ZLIE)) $ZLIE=$HorsVue;		// Lieu Hors-Vue
  #========== Settings ==========

#-----------------------------------------------------------------------------------
if (!empty($_SESSION['login'])) { #Recupération de l'ID de Session
	$ZZ_TID=$_SESSION['login'] ;
} else die();

if ($num!=$ZZ_TID) {
  //$_SESSION['login']="";
  die();	//tentative de corruption
}

  $fTInfo=false;
  $OutOfDate=date("Y-m-d H:i:s",mktime(date("H"),date("i"),date("s"),date("m"),date("d")-$HorsDate,date("Y")));


//UPDATE `mz_profil`  SET TimeStamp='2008-09-22 12:37:17' 

//http://localhost/MZZ/mzVue.php?&num=28468&X=4&Y=3&N=-38&MeID[]=1449231&MeID[]=532139&MeID[]=1448647&MeID[]=1994327&MeID[]=543189&MeID[]=575772&MeID[]=1023819&MeID[]=883125&MeID[]=1778243&MeID[]=1992171&MeID[]=1993511&MeID[]=554784&MeID[]=778474&MeID[]=1162385&MeID[]=1937866&MeID[]=461929&MeID[]=518570&MeID[]=1992417&MeID[]=1993517&MeID[]=451302&MeID[]=1947589&MeID[]=1954792&MeID[]=1947590

#-----------------------------------------------------------------------------------
  $mysql=_sqlconnect();	# -------------- Ouverture DB  
  # Au passage mise à jour du profil du troll avec sa position X,Y,N
  $query =  "UPDATE `MZ_Profil` SET X=$X, Y=$Y, N=$N where TiD=$num";
  #echo "$query<BR>";     
  $result = MySQL_QUERY($query);    

	

  $query = "SELECT if( abs(P.X-$X)>abs(P.Y-$Y), if( abs(P.X-$X)>abs(P.N-$N),   abs(P.X-$X)  , abs(P.N-$N) ), if( abs(P.N-$N)>abs(P.Y-$Y),   abs(P.N-$N)  , abs(P.Y-$Y)) )as dist, P.TimeStamp, P.TiD, P.Troll, P.Race, P.Niveau, P.DLA, P.PA, P.PV, P.PVMax, P.X, P.Y, P.N, P.Camoufle  FROM `MZ_Profil` as P INNER JOIN `MZ_Share` as S ON (P.TiD=S.SHRiD) where (S.TiD=$num) and (S.link='S') and (P.TimeStamp>'$OutOfDate') ";
  if ($ZTRO>0) $query .= "and (abs(P.X-$X)<=$ZTRO) and (abs(P.Y-$Y)<=$ZTRO) and (abs(P.N-$N)<=$ZTRO) ";
  $query .= "and (P.TiD!=$num) order by dist asc, P.N desc, P.X asc , P.Y asc, P.Troll ASC ";
  //echo "$query<BR>";
  $result1 = @MySQL_QUERY($query);

  if (isset($MeID)) {
	  $query = "SELECT I.TimeStamp, I.MeID, I.SR, I.RM, P.Troll, P.TiD FROM `MZ_Insulte` as I INNER JOIN `MZ_Profil` as P ON (I.TiD=P.TiD) INNER JOIN `MZ_Share` as S on (P.TiD=S.SHRiD) where (I.Insulte=1) and (S.TiD=$num) and (S.link='S') and I.MeID in (";
	  for ($i=0; $i<sizeof($MeID);$i++) {$MiD=abs($MeID[$i]); $query .=  "$MiD,";}
	  $query .= "0) and I.TimeStamp=(select max(TimeStamp) FROM `MZ_Insulte` as I2 where (I2.MeID=I.MeID) and (I2.Insulte=1))";
	  #echo "$query<BR>";	  
	  $result2 = @MySQL_QUERY($query);
  }

  $query = "SELECT GG.Gogo, GG.TiD, iGG.TimeStamp, iGG.Type, iGG.goX, iGG.goY, iGG.goN, iGG.IdTresor, iGG.DLA, iGG.Poids, P.Troll, P.TiD FROM `MZ_Gogo` as GG INNER JOIN `MZ_Profil` as P ON (GG.TiD=P.TiD) INNER JOIN `MZ_Share` as S ON (P.TiD=S.SHRiD) LEFT JOIN `MZ_iGogo` as iGG ON GG.Gogo=iGG.Gogo where (S.TiD=$num) and (S.link='S') ";
  #$query .= "and GG.Gogo in (";		#restreindre aux monstres en vue
  #for ($i=0; $i<sizeof($MeID);$i++) {$MiD=abs($MeID[$i]); $query .=  "$MiD,";}
  #echo "$query<BR>";  
  $result3 = @MySQL_QUERY($query);
  
  $query = "SELECT GG.Fam, GG.TiD FROM `MZ_Fam` as GG INNER JOIN `MZ_Share` as S ON (GG.TiD=S.SHRiD) where (S.TiD=$num) and (S.link='S') ";
  #$query .= "and GG.Fam in (";		#restreindre aux monstres en vue
  #for ($i=0; $i<sizeof($MeID);$i++) {$MiD=abs($MeID[$i]); $query .=  "$MiD,";}
  #$query .= "0)  ";
  #echo "$query<BR>";  
  $result4 = @MySQL_QUERY($query);
  

  $query = "SELECT U.GiD, case when C.DIPLO_INV is null then 'oui' else C.DIPLO_INV end as DIPLO_INV, case when C.DIPLO_PERSO is null then 'oui' else C.DIPLO_PERSO end as DIPLO_PERSO from MZ_User as U left join MZ_User_prefs as C on U.TiD=C.TiD where U.TiD=$num";
  //echo "$query<BR>";
  $result5 = @MySQL_QUERY($query);
  $nData = @MySQL_NUM_ROWS($result5);
  if ($nData>0) { 		//  diplo guilde diplo + perso
	$idGuilde=mysql_result($result5,0,"GiD");
	$flagDiplo_Inv=mysql_result($result5,0,"DIPLO_INV");
	$flagDiplo_Perso=mysql_result($result5,0,"DIPLO_PERSO");
	
	$query = "SELECT D.tgId, D.Color, D.TG FROM `MZ_Diplo` as D Where (D.GiD=$idGuilde or D.GiD=-$num)";
  	//echo "$query<BR>";
  	$result5 = @MySQL_QUERY($query);

	$query = "SELECT D.tgId, D.Color, D.TG FROM `MZ_Diplo_inv` as D Where (D.GiD=$idGuilde or D.GiD=-$num)";
  	//echo "$query<BR>";
  	$result5i = @MySQL_QUERY($query);
  } else { 				// pas de guilde diplo perso seule
	$flagDiplo_Inv='oui';

	$query = "SELECT D.tgId, D.Color, D.TG FROM `MZ_Diplo` as D Where (D.GiD=-$num)";
  	//echo "$query<BR>";
  	$result5 = @MySQL_QUERY($query);

	$query = "SELECT D.tgId, D.Color, D.TG FROM `MZ_Diplo_inv` as D Where (D.GiD=-$num)";
  	//echo "$query<BR>";
  	$result5i = @MySQL_QUERY($query);
  }
  $query = "SELECT D.tgId, D.Color, D.TG FROM `MZ_Diplo_perso` as D Where D.GiD=-$num";
  //echo "$query<BR>";
  $result5p = @MySQL_QUERY($query);

  $query = "SELECT SHRiD from `MZ_Share` as S where (S.TiD=$num) and (S.link='S')";				// en bleu comme la guilde, les membre avec qui on partage
  $result5s = @MySQL_QUERY($query);
   
	
  $query = "SELECT X.TimeStamp, X.X, X.Y, X.N, X.MM, P.Troll, P.TiD, X.Type FROM `MZ_Piege` as X INNER JOIN `MZ_Profil` as P ON (X.TiD=P.TiD) INNER JOIN `MZ_Share` as S ON (X.TiD=S.SHRiD) where (S.TiD=$num) and (S.link='S') "; 
  if ($ZLIE>0) $query .= "and (abs(X.X-$X)<=$ZLIE) and (abs(X.Y-$Y)<=$ZLIE) and (abs(X.N-$N)<=$ZLIE) ";
  //$query .= "and (abs(X.X-$X)<=$HorsVue) and (abs(X.Y-$Y)<=$HorsVue) and (abs(X.N-$N)<=$HorsVue) ";
  //echo "//$query<BR>";  
  $result6 = @MySQL_QUERY($query);

  // pour le gestionnaire de vue!
  $query = "SELECT DISTINCT P.Troll, P.TiD, V.VueId, V.TypeVue, V.TimeStamp FROM `MZ_VueManager` as V INNER JOIN `MZ_Profil` as P ON (V.TiD=P.TiD) INNER JOIN `MZ_Share` as S ON (V.TiD=S.SHRiD) where (S.TiD=$num) and (S.link='S') order by V.TimeStamp desc ";
  //echo "$query<BR>";  
  $result7 = @MySQL_QUERY($query);

	
  _sqlclose();	# -------------- Fermeture DB   
#-----------------------------------------------------------------------------------


#-----------------------------------------------------------------------------------
  #result1 => "SELECT P.TimeStamp, P.TiD, P.Troll, P.Race, P.Niveau, P.DLA, P.PA, P.PV, P.PVMax, P.X, P.Y, P.N, P.Camoufle  FROM `MZ_Profil` as P INNER JOIN `MZ_Groupe` as G on (P.TiD=G.Tid) where (G.Nom='$coterie') and (G.Pwd='$password') and (P.TimeStamp>'$OutOfDate') ";
  $nData = @MySQL_NUM_ROWS($result1);
  if ($nData>0) {
	  $fTInfo=true;
      //print("infosTrolls = new Array();");
      #infosTrolls[TiD] = new Array(PV,PVMax,'TimeStamp','Nom', DLA,PA, X, Y, N, Camouflé, 'Race', Niveau); 
      for ($i=0; $i<$nData; $i++) { 
        $TimeStamp=mysql_result($result1,$i,"TimeStamp"); #'2006-10-24 10:37:57'
        $TimeStamp="le ".substr($TimeStamp, 8,2).'/'.substr($TimeStamp, 5,2)." ".substr($TimeStamp, 11,2).":".substr($TimeStamp, 14,2);
        $TiD=mysql_result($result1,$i,"TiD");			_sqlAddLogId($TiD);			// ajout d'une log pour ce troll 
        $Troll=mysql_result($result1,$i,"Troll");
        $Race=mysql_result($result1,$i,"Race");
        $Niveau=mysql_result($result1,$i,"Niveau");
        $DLA=mysql_result($result1,$i,"DLA");
        $DLA=substr($DLA, 8,2).'/'.substr($DLA, 5,2)." ".substr($DLA, 11,2).":".substr($DLA, 14,2);
        $PA=mysql_result($result1,$i,"PA");
        $PV=mysql_result($result1,$i,"PV");
        $PVMax=mysql_result($result1,$i,"PVMax");
        $tX=mysql_result($result1,$i,"X");
        $tY=mysql_result($result1,$i,"Y");
        $tN=mysql_result($result1,$i,"N");
        $Camoufle=mysql_result($result1,$i,"Camoufle");
        print("infosTrolls[$TiD]=new Array(\"$PV\",\"$PVMax\",\"$TimeStamp\",\"$DLA\",\"$PA\",\"$Troll\",\"$tX\",\"$tY\",\"$tN\",\"$Camoufle\",\"$Race\",\"$Niveau\",\"\");");
//      print("infosTrolls[$TiD]=new Array($PV,$PVMax,$TimeStamp,$DLA,$PA,$Troll,$tX,$tY,$tN,$Camoufle,$Race,$Niveau);");
      }
  }

#-----------------------------------------------------------------------------------
#result2 =>  "SELECT I.TimeStamp, I.MeID, I.SR, I.RM, P.Troll FROM `MZ_Insulte` as I INNER JOIN `MZ_Profil` as P ON (I.TiD=P.TiD) INNER JOIN `MZ_Groupe` as G ON (I.TiD=G.TiD) where (I.Insulte=1) and (G.Nom='$coterie') and I.MeID in (";
  if (isset($MeID)) {
	  $nData = @MySQL_NUM_ROWS($result2);
	  if ($nData>0) {
		  $fTInfo=true;
          //print("MeInsulte = new Array();");
		  #MeInsulte[MeID]=new Array('TimeStamp', Troll, 'RM', SR );
	      for ($i=0; $i<$nData; $i++) { 
    	    $MiD=mysql_result($result2,$i,"MeID"); 
        	$TiD=mysql_result($result2,$i,"TiD");			_sqlAddLogId($TiD);			// ajout d'une log pour ce troll 
    	    $Troll=mysql_result($result2,$i,"Troll"); 
    	    $SR=mysql_result($result2,$i,"SR"); 
    	    $RM=mysql_result($result2,$i,"RM"); 
    	    $TimeStamp=mysql_result($result2,$i,"TimeStamp"); 
	        $TimeStamp="le ".substr($TimeStamp, 8,2).'/'.substr($TimeStamp, 5,2)." ".substr($TimeStamp, 11,2).":".substr($TimeStamp, 14,2);
    	    print("MeInsulte[$MiD]=new Array(\"$TimeStamp\",\"$Troll\",\"$RM\",\"$SR\",\"\");");
//    	    print "MeInsulte[$MiD]=new Array('$TimeStamp', \"$Troll\", '$RM', $SR); ";
    	  }
	  }
  }  

#-----------------------------------------------------------------------------------
#result3 =>  "SELECT GG.Gogo, GG.TiD, iGG.TimeStamp, iGG.Type, iGG.goX, iGG.goY, iGG.goN, iGG.IdTresor, iGG.DLA, iGG.Poids, P.Troll FROM `MZ_Gogo` as GG INNER JOIN `MZ_Profil` as P ON (GG.TiD=P.TiD) INNER JOIN `MZ_Groupe` as G ON (G.TiD=P.TiD) LEFT JOIN `MZ_iGogo` as iGG ON GG.Gogo=iGG.Gogo where (G.Nom='$coterie') and (G.Pwd='$password') ";
  #Les gogos de toute la coterie  
  $nData = @MySQL_NUM_ROWS($result3);
  //print("gogo = new Array();");
  if ($nData>0) {
	  $fTInfo=true;
      for ($i=0; $i<$nData; $i++) { 
        $Gogo=mysql_result($result3,$i,"Gogo");
        $TiD=mysql_result($result3,$i,"TiD");			_sqlAddLogId($TiD);			// ajout d'une log pour ce troll 
        $TimeStamp=mysql_result($result3,$i,"TimeStamp");
        $TimeStamp="le ".substr($TimeStamp, 8,2).'/'.substr($TimeStamp, 5,2)." ".substr($TimeStamp, 11,2).":".substr($TimeStamp, 14,2);
        $Troll=mysql_result($result3,$i,"Troll"); 
        $Type=mysql_result($result3,$i,"Type"); 
        $goX=mysql_result($result3,$i,"goX"); if ($goX=='') $goX=0;
        $goY=mysql_result($result3,$i,"goY"); if ($goY=='') $goY=0;
        $goN=mysql_result($result3,$i,"goN"); if ($goN=='') $goN=0;
        $Tresor=mysql_result($result3,$i,"IdTresor"); if ($Tresor=='') $Tresor=0;
        $DLA=mysql_result($result3,$i,"DLA"); if ($DLA=='') $DLA=0;
        $Poids=mysql_result($result3,$i,"Poids"); if ($Poids=='') $Poids=0;
		print("gogo[$Gogo]=new Array(\"$TiD\",\"$Troll\",\"$TimeStamp\",\"$Type\",\"$goX\",\"$goY\",\"$goN\",\"$Tresor\",\"$DLA\",\"$Poids\",\"\");");
//      print("gogo[$Gogo]=new Array($TiD, \"$Troll\", '$TimeStamp', '$Type', $goX, $goY, $goN, $Tresor, $DLA, $Poids);");
      }
  }


#-----------------------------------------------------------------------------------
#result4 =>  "SELECT GG.Fam, GG.TiD FROM `MZ_Fam` as GG INNER JOIN `MZ_Groupe` as G ON (GG.TiD=G.TiD) where (G.Nom='$coterie') and (G.Pwd='$password') ";
  #Les fams de toute la coterie  
  $nData = @MySQL_NUM_ROWS($result4);
//  print("fam = new Array();");
  if ($nData>0) {
	  $fTInfo=true;
      for ($i=0; $i<$nData; $i++) { 
        $Fam=mysql_result($result4,$i,"Fam");
        $TiD=mysql_result($result4,$i,"TiD");			_sqlAddLogId($TiD);			// ajout d'une log pour ce troll 
        print("fam[$Fam]=new Array(\"$TiD\",\"\");");
      }
  }


#-----------------------------------------------------------------------------------
#result6 =>  "SELECT X.TimeStamp, X.X, X.Y, X.N, X.MM, P.Troll FROM `MZ_Piege` as X INNER JOIN `MZ_Profil` as P ON (X.TiD=P.TiD) INNER JOIN `MZ_Groupe` as G ON  (X.TiD=G.TiD) where  (G.Nom='$coterie') and (G.Pwd='$password') "; 
  #Les pieges de toute la coterie  
  $nData = @MySQL_NUM_ROWS($result6);
//      print("infosPieges = new Array();");
  if ($nData>0) {
	  $fTInfo=true;
      for ($i=0; $i<$nData; $i++) { 
   	    $pTimeStamp=mysql_result($result6,$i,"TimeStamp"); 
        $pX=mysql_result($result6,$i,"X");
        $pY=mysql_result($result6,$i,"Y");
        $pN=mysql_result($result6,$i,"N");
        $pMM=mysql_result($result6,$i,"MM");
        $pType=mysql_result($result6,$i,"Type");        
        $TiD=mysql_result($result6,$i,"TiD");			_sqlAddLogId($TiD);			// ajout d'une log pour ce troll 
        $Troll=mysql_result($result6,$i,"Troll");
        print("infosPieges[$i]=new Array(\"$pTimeStamp\",\"$pX\",\"$pY\",\"$pN\",\"$Troll\",\"$pMM\",\"$pType\",\"\");");
//      print("infosPieges[$i]=new Array('$pTimeStamp', $pX, $pY, $pN, \"$Troll\", $pMM); ");
      }
  }
  


#-----------------------------------------------------------------------------------
#result7 =>  "  $query = "SELECT DISTINCT P.Troll, P.TiD, V.VueId, V.TypeVue, V.TimeStamp FROM `MZ_Vue` as V INNER JOIN `MZ_Profil` as P ON (V.TiD=P.TiD) INNER JOIN `MZ_Share` as S ON (V.TiD=S.SHRiD) where (S.TiD=$num) and (S.link='S') "; 
  #Les vue des membres alliés 
  // pour le gestionnaire de vue on ne propose que la dernière vue des amis
  $arr_VueTroll = array();
  $idx=0;
  $nData = @MySQL_NUM_ROWS($result7);
  if ($nData>0) {
	  $fTInfo=true;
      for ($i=0; $i<$nData; $i++) { 
   	    $pTimeStamp=mysql_result($result7,$i,"TimeStamp"); 
        $TypeVue=mysql_result($result7,$i,"TypeVue");        
        $VueId=mysql_result($result7,$i,"VueId");        
        $TiD=mysql_result($result7,$i,"TiD");			_sqlAddLogId($TiD);			// ajout d'une log pour ce troll 
        $Troll=mysql_result($result7,$i,"Troll");
	  	if (($TypeVue!='VUE') || (!$arr_VueTroll[$TiD]) || (($TiD==$num) && ($arr_VueTroll[$TiD]<4))) {		// on a pas encore proposé la vue de ce troll
	        print("infosVue[$idx]=new Array(\"$pTimeStamp\",\"$Troll\",\"$TypeVue\",\"$VueId\",\"$TiD\",\"\");");
		  	$idx++;
		}
		$arr_VueTroll[$TiD]++;
      }
  }

/* diplo réalisé par MZ  */
#-----------------------------------------------------------------------------------
  #result5 =>  "SELECT tgId, Color, TG FROM `MZ_Diplo` where GiD=$idGuilde";
  #Recupération du N° de Guilde et Verification des accès
  $ct=array();
  $cg=array();
  $nData = MySQL_NUM_ROWS($result5);
  if ($nData>0) {  
	  $fTInfo=true;
      for ($i=0; $i<$nData; $i++) { 
	        $tgId=mysql_result($result5,$i,"tgId");
	        $Color=mysql_result($result5,$i,"Color");
	        $TG=mysql_result($result5,$i,"TG");
	        if ($TG=='T') {
	        	$ct[$tgId]=$Color;
			} else { 
	        	$cg[$tgId]=$Color;
			}
      }
  }

  #ajout / écrase avec la diplo perso ====================================================
  $nData = MySQL_NUM_ROWS($result5p);
  if (($flagDiplo_Perso=='oui')&&($nData>0)) {  
	  $fTInfo=true;
      for ($i=0; $i<$nData; $i++) { 
	        $tgId=mysql_result($result5p,$i,"tgId");
	        $Color=mysql_result($result5p,$i,"Color");
	        $TG=mysql_result($result5p,$i,"TG");
	        if ($TG=='T') {
	        	$ct[$tgId]=$Color;
			} else { 
	        	$cg[$tgId]=$Color;
			}
      }
  }
  
  #ajout de la diplo inversée ====================================================
  $nData = MySQL_NUM_ROWS($result5i);
  if (($flagDiplo_Inv=='oui')&&($nData>0)) {  
	  $fTInfo=true;
      for ($i=0; $i<$nData; $i++) { 
	        $tgId=mysql_result($result5i,$i,"tgId");
	        $Color=mysql_result($result5i,$i,"Color");
	        $TG=mysql_result($result5i,$i,"TG");
	        if ($TG=='T') {
				if (!$ct[$tgId]) {
				  $ct[$tgId]=$Color; 
				} else if ($ct[$tgId]<>$Color) {
  				  $ct[$tgId]="#FFD3D3"; 
				}
			} else { 
				if (!$cg[$tgId]) {
				  $cg[$tgId]=$Color; 
                                } else if ($cg[$tgId]<>$Color) {
                                  $cg[$tgId]="#FFD3D3"; 
                                }
			}
      }
  }

  #ajout des membres avec qui l'on partage=========================================
  $nData = MySQL_NUM_ROWS($result5s);
  if ($nData>0) {  
	  $fTInfo=true;
      for ($i=0; $i<$nData; $i++) { 
	        $tgId=mysql_result($result5s,$i,"SHRiD");
	        $Color="#BBBBFF";
	        $TG="T";
        	$ct[$tgId]=$Color;		// pas de conflit, si l'on partage on est amis!!!
      }
  }

  foreach ($ct as $tgId => $Color) print("ct[$tgId]='$Color';"); 
  foreach ($cg as $tgId => $Color) print("cg[$tgId]='$Color';"); 
  


//  print("putInfosVUE();");
  
#----------------------------------------------------------------------------------- 
//_sqlTLog();	#Log des consommations de temps SQL et PHP
_sqllogTiD($_SESSION['login'], "mzVue.php");		// log sur les trolls
  
?>