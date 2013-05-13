/*********************************************************************************
*    This file is part of ZoryaZilla Fusion merged with mountyzilla              *
*********************************************************************************/
//============================ ZZ PRE CODE =======================================
// dans la nouvelle version de MZ (dabihul), cette varaible n'est plus d�finie
var poissotron = "http://minitilk.fur4x-hebergement.net/getDice2.php";

// pr�f�rence de l'utilisateur (mettre par d�faut si pas d�finie)
if (typeof ZTRO=="undefined")   var ZTRO=0; 
if (typeof ZMON=="undefined")   var ZMON=5;  
if (typeof ZTRE=="undefined")   var ZTRE=5; 
if (typeof ZLIE=="undefined")   var ZLIE=15; 
if (typeof SkinZZ=="undefined") var SkinZZ=ZZDB+"/skin/";
if (typeof ShrVUE=="undefined") var ShrVUE=true;

var typeFamilly = new Array();    // Indice des familles de monstre (pour tabMonstres)
typeFamilly = ["Animal", "D�mon", "Humanoide", "Insecte", "Monstre","Mort-Vivant"];

var tmpltFamilly = new Array();    // pr�fix et suffix
tmpltFamilly["Animal"]=["Attentionn�","Attentionn�e","Cogneur","Cogneuse","Coriace","Corrompu","Corrompue","Enrag�","Enrag�e","Fouisseur","Fouisseuse","Gardien","Gardienne","Gigantesque","Gros","Grosse","Homochrome","Malade","Petit","Petite","Ronfleur","Ronfleuse","Vorace"];
tmpltFamilly["D�mon"]=["Archiatre","Cogneur","Cogneuse","Coriace","Corrompu","Corrompue","de Premier Cercle","de Second Cercle","de Troisi�me Cercle","de Quatri�me Cercle","de Cinqui�me Cercle","des Abysses","Eth�r�","Eth�r�e","Fanatique","Gardien","Gardienne","Gros","Grosse","Invocateur","Invocatrice","Malade","Petit","Petite","Prince","Princesse","Ronfleur","Ronfleuse"];
tmpltFamilly["Humanoide"]=["Alchimiste","Agressif","Agressive","Barbare","Berserker","Cogneur","Cogneuse","Coriace","Corrompu","Corrompue","Champion","Championne","Effray�","Effray�e","Fanatique","Fou","Folle","Frondeur","Frondeuse","Gardien","Gardienne","Grand Frondeur","Grande Frondeuse","Gros","Grosse","Gu�risseur","Gu�risseuse","Guerrier","Guerri�re","H�ros","Malade","Mutant","Mutante","Paysan","Paysanne","Petit","Petite","Planqu�","Planqu�e","Ronfleur","Ronfleuse","Scout","Shaman","Sorcier","Sorci�re","Voleur","Voleuse"];
tmpltFamilly["Insecte"]=["Alpha","Cogneur","Cogneuse","Coriace","Corrompu","Corrompue","Fouisseur","Fouisseuse","Gardien","Gardienne","Gigantesque","Gros","Grosse","Homochrome","Lobotomisateur","Lobotomisatrice","Malade","Morticole","Ouvrier","Ouvri�re","Petit","Petite","Reine","Ronfleur","Ronfleuse","Soldat","Strident","Stridente"];
tmpltFamilly["Monstre"]=["Cogneur","Cogneuse","Colossal","Colossale","Coriace","Corrompu","Corrompue","Cracheur","Cracheuse","Esculape","Fouisseur","Fouisseuse","Fr�n�tique","Fustigateur","Fustigatrice","Gardien","Gardienne","Gargantuesque","Gigantesque","Gros","Grosse","Homomorphe","Malade","Petit","Petite","Ronfleur","Ronfleuse","Traqueur","Traqueuse"];
tmpltFamilly["Mort-Vivant"]=["Archa�que","Cogneur","Cogneuse","Coriace","Corrompu","Corrompue","Gardien","Gardienne","Gros","Grosse","Implacable","Ma�tre","Ma�tresse","Malade","M�dicastre","Mentat","N�cromant","N�cromante","Petit","Petite","Psychophage","Ronfleur","Ronfleuse","Spectral","Spectrale"];

var caracFamilly = new Array();    // caracs fonctions des pr�fix/suffix
caracFamilly["Animal"]=[[2,"Soigne les Monstres et a une attaque de moins en cas d'attaques multiples"],[2,"Soigne les Monstres et a une attaque de moins en cas d'attaques multiples"],[2,"Pouvoir habituel remplac� par Amn�sie : perte temporaire de x%"],[2,"Pouvoir habituel remplac� par Amn�sie : perte temporaire de x%"],[1,""],[1,""],[1,""],[3,"A un plus grand nombre d'attaques"],[3,"A un plus grand nombre d'attaques"],[0,"Enfouit les Tr�sors"],[0,"Enfouit les Tr�sors"],[20,""],[20,""],[1,""],[0,""],[0,""],[0,"Se Camoufle et attaque � distance"],[-1,"Pouvoir habituel remplac� par Maladie"],[-1,""],[-1,""],[2,"Augmente la Fatigue"],[2,"Augmente la Fatigue"],[1,""]];
caracFamilly["D�mon"]=[[2,"Soigne les Monstres et a une attaque de moins en cas d'attaques multiples"],[2,"Pouvoir habituel remplac� par Amn�sie : perte temporaire de x%"],[2,"Pouvoir habituel remplac� par Amn�sie : perte temporaire de x%"],[1,""],[1,""],[1,""],[-1,""],[0,""],[2,""],[4,""],[5,""],[3,""],[0,"Se Camoufle et attaque � distance"],[0,"Se Camoufle et attaque � distance"],[2,"Ne fuit pas et a un plus grand nombre d'attaques"],[20,""],[20,""],[0,""],[0,""],[3,"Fait appara�tre des Monstres"],[3,"Fait appara�tre des Monstres"],[-1,"Pouvoir habituel remplac� par Maladie"],[-1,""],[-1,""],[8,"Insensible au Hurlement Effrayant et a une dur�e de Tour r�duite"],[8,"Insensible au Hurlement Effrayant et a une dur�e de Tour r�duite"],[2,"Augmente la Fatigue"],[2,"Augmente la Fatigue"]];
caracFamilly["Humanoide"]=[[0,"Ramasse, Transmute et Lance des Potions"],[1,""],[1,""],[1,""],[2,"A un plus grand nombre d'attaques"],[2,"Pouvoir habituel remplac� par Amn�sie : perte temporaire de x%"],[2,"Pouvoir habituel remplac� par Amn�sie : perte temporaire de x%"],[1,""],[1,""],[1,""],[4,""],[4,""],[-1,"Fuit rapidement le combat"],[-1,"Fuit rapidement le combat"],[2,"Ne fuit pas et a un plus grand nombre d'attaques"],[1,""],[1,""],[2,"Attaque � distance"],[2,"Attaque � distance"],[20,""],[20,""],[4,"Attaque � distance"],[4,"Attaque � distance"],[0,""],[0,""],[2,"Soigne les Monstres et a une attaque de moins en cas d'attaques multiples"],[2,"Soigne les Monstres et a une attaque de moins en cas d'attaques multiples"],[1,""],[1,""],[5,"A une dur�e de Tour r�duite"],[-1,"Pouvoir habituel remplac� par Maladie"],[2,""],[2,""],[-1,""],[-1,""],[-1,""],[-1,""],[0,"Se Camoufle et attaque � distance"],[0,"Se Camoufle et attaque � distance"],[2,"Augmente la Fatigue"],[2,"Augmente la Fatigue"],[2,""],[0,"Attaque � distance et a un Pouvoir si le Monstre n'en a pas habituellement"],[0,"Attaque � distance et a un Pouvoir si le Monstre n'en a pas habituellement"],[0,"Attaque � distance et a un Pouvoir si le Monstre n'en a pas habituellement"],[2,"Vole des objets dans l'Equipement"],[2,"Vole des objets dans l'Equipement"]];
caracFamilly["Insecte"]=[[11,"Insensible au Hurlement Effrayant, attaque � distance et a un plus grand nombre d'attaques"],[2,"Pouvoir habituel remplac� par Amn�sie : perte temporaire de x%"],[2,"Pouvoir habituel remplac� par Amn�sie : perte temporaire de x%"],[1,""],[1,""],[1,""],[0,"Enfouit les Tr�sors"],[0,"Enfouit les Tr�sors"],[20,""],[20,""],[1,""],[0,""],[0,""],[0,"Se Camoufle et attaque � distance"],[2,"Flagellation Mentale : retire 1% de ma�trise sur une Comp�tence"],[2,"Flagellation Mentale : retire 1% de ma�trise sur une Comp�tence"],[-1,"Pouvoir habituel remplac� par Maladie"],[2,"Soigne les Monstres et a une attaque de moins en cas d'attaques multiples"],[0,""],[0,""],[-1,""],[-1,""],[11,"Insensible au Hurlement Effrayant et a un plus grand nombre d'attaques"],[2,"Augmente la Fatigue"],[2,"Augmente la Fatigue"],[2,""],[3,"Donne des Malus de Concentration"],[3,"Donne des Malus de Concentration"]];
caracFamilly["Monstre"]=[[2,"Pouvoir habituel remplac� par Amn�sie : perte temporaire de x%"],[2,"Pouvoir habituel remplac� par Amn�sie : perte temporaire de x%"],[7,""],[7,""],[1,""],[1,""],[1,""],[2,"Attaque � distance"],[2,"Attaque � distance"],[2,"Soigne les Monstres et a une attaque de moins en cas d'attaques multiples"],[0,"Enfouit les Tr�sors"],[0,"Enfouit les Tr�sors"],[3,"A un plus grand nombre d'attaques"],[2,"Flagellation Mentale : retire 1% de ma�trise sur un Sortil�ge ou une Comp�tence"],[2,"Flagellation Mentale : retire 1% de ma�trise sur un Sortil�ge ou une Comp�tence"],[20,""],[20,""],[3,""],[1,""],[0,""],[0,""],[0,"Se Camoufle et attaque � distance"],[-1,"Pouvoir habituel remplac� par Maladie"],[-1,""],[-1,""],[2,"Augmente la Fatigue"],[2,"Augmente la Fatigue"],[1,""],[1,""]];
caracFamilly["Mort-Vivant"]=[[-1,""],[2,"Pouvoir habituel remplac� par Amn�sie : perte temporaire de x%"],[2,"Pouvoir habituel remplac� par Amn�sie : perte temporaire de x%"],[1,""],[1,""],[1,""],[20,""],[20,""],[0,""],[0,""],[3,""],[8,"Insensible au Hurlement Effrayant et a un plus grand nombre d'attaques"],[8,"Insensible au Hurlement Effrayant et a un plus grand nombre d'attaques"],[-1,"Pouvoir habituel remplac� par Maladie"],[2,"Soigne les Monstres et a une attaque de moins en cas d'attaques multiples"],[2,"Attaque � distance"],[5,"Fait appara�tre des Monstres"],[5,"Fait appara�tre des Monstres"],[-1,""],[-1,""],[2,"Flagellation Mentale : retire 1% de ma�trise sur un Sortil�ge"],[2,"Augmente la Fatigue"],[2,"Augmente la Fatigue"],[0,"Se Camoufle et attaque � distance"],[0,"Se Camoufle et attaque � distance"]];


var ageFamilly = new Array();   // niveau fonction de age
ageFamilly["Animal"]={B�b�:0,  Enfan�on:1, Jeune:2, Adulte:3, Mature:4, 'Chef de Harde':5, Ancien:6, Ancienne:6, Anc�tre:7};
ageFamilly["D�mon"]={Initial:0, Initiale:0, Novice:1, Mineur:2, Mineure:2, Favori:3, Favorite:3, Majeur:4, Majeure:4, Sup�rieur:5, Sup�rieure:5, Supr�me:6, Ultime:7};
ageFamilly["Humanoide"]={Nouveau:0, Nouvelle:0, Jeune:1, Adulte:2, V�t�ran:3, V�t�rante:3, Briscard:4, Briscarde:4, Doyen:5, Doyenne:5, L�gendaire:6, Mythique:7};
ageFamilly["Insecte"]={Larve:0, Immature:1,  Juv�nile:2,  Imago:3,  D�velopp�:4, D�velopp�e:4, M�r:5, M�re:5, Accompli:6, Accomplie:6, Achev�:7, Achev�e:7};
ageFamilly["Monstre"]={Nouveau:0, Nouvelle:0, Jeune:1,  Adulte:2,  V�t�ran:3, V�t�rante:3, Briscard:4, Briscarde:4, Doyen:5, Doyenne:5, L�gendaire:6,  Mythique:7};
ageFamilly["Mort-Vivant"]={Naissant:0, Naissante:0, R�cent:1, R�cente:1, Ancien:2, Ancienne:2, V�n�rable:3, S�culaire:4, Antique:5, Ancestral:6, Ancestrale:6,  Ant�diluvien:7, Ant�diluvienne:7};

var tabMonstres = new Array();  
var tabMonstres = [ //nom, n� Famille, Niveau, IdImage
["Chauve-Souris G�ante", 0,2,72],
["Cheval � Dents de Sabre", 0,18,9],
["Dindon", 0,1,0],
["Glouton", 0,15,114],
["Gnu Domestique", 0,1,0],
["Gnu Sauvage", 0,1,20],
["Gowap Apprivois�", 0,-7,0],
["Gowap Sauvage", 0,-7,0],
["Rat G�ant", 0,1,32],
["Rat", 0,1,0],
["Sagouin", 0,3,76],
["Tubercule Tueur", 0,11,61],
["Abishaii Bleu", 1,15,4],
["Abishaii Noir", 1,9,52],
["Abishaii Rouge", 1,17,10],
["Abishaii Vert", 1,12,25],
["Abishaii Rose", 1,1,130],
["Balrog", 1,50,0],
["Barghest", 1,24,99],
["Behemoth", 1,25,93],
["Diablotin", 1,1,18],
["El�mentaire du Chaos", 1,17,86],
["El�mentaire d'Air", 1,18,21],
["El�mentaire d'Eau", 1,14,40],
["El�mentaire de Feu", 1,17,46],
["El�mentaire de Terre", 1,19,29],
["Erinyes", 1,8,24],
["Gritche", 1,25,0],
["Hellrot", 1,15,54],
["Incube", 1,10,106],
["Marilith", 1,22,45],
["Molosse Satanique", 1,7,63],
["Palefroi Infernal", 1,20,13],
["Pseudo-Dragon", 1,1,129],
["Shai", 1,16,27],
["Sir�ne", 1,8,0],
["Succube", 1,10,56],
["Xorn", 1,11,127],
["Ashashin", 2,21,98],
["Boggart", 2,3,70],
["Caillouteux", 2,2,71],
["Champi-Glouton", 2,4,42],
["Ettin", 2,10,67],
["Flagelleur Mental", 2,24,0],
["Furgolin", 2,9,90],
["G�ant de Pierre", 2,14,112],
["G�ant des Gouffres", 2,18,113],
["Gnoll", 2,3,38],
["Gobelin Magique", 2,1,0],
["Goblin", 2,1,30],
["Goblours", 2,4,115],
["Golem d'Argile", 2,14,116],
["Golem de Chair", 2,9,105],
["Golem de Fer", 2,24,117],
["Golem de Pierre", 2,19,118],
["Gremlins", 2,3,6],
["Homme-L�zard", 2,4,84],
["Hurleur", 2,8,62],
["Kobold", 2,1,66],
["Loup-Garou", 2,8,58],
["Lutin", 2,2,75],
["M�duse", 2,6,92],
["M�gac�phale", 2,25,49],
["Minotaure", 2,6,77],
["Ogre", 2,6,68],
["Orque", 2,3,41],
["Ours-Garou", 2,13,55],
["Rat-Garou", 2,3,57],
["Rocketeux", 2,6,59],
["Sorci�re", 2,15,28],
["Sphinx", 2,23,0],
["Tigre-Garou", 2,9,126],
["Titan", 2,20,44],
["Y�ti", 2,7,80],
["Yuan-ti", 2,12,0],
["Ankheg", 3,10,69],
["Anoploure Purpurin", 3,24,95],
["Araign�e G�ante", 3,2,33],
["Coccicruelle", 3,16,0],
["Essaim Sanguinaire", 3,18,0],
["Foudroyeur", 3,23,109],
["Limace G�ante", 3,9,51],
["Mante Fulcreuse", 3,22,0],
["Mille-Pattes G�ant", 3,12,26],
["Mille-Pattes", 3,12,0],
["Nuage d'Insectes", 3,5,0],
["Nu�e de Vermine", 3,10,0],
["Scarab�e G�ant", 3,5,17],
["Scarab�e", 3,5,0],
["Scorpion G�ant", 3,10,50],
["Scorpion", 3,10,0],
["Strige", 3,1,82],
["Thri-kreen", 3,8,37],
["Amibe G�ante", 4,8,36],
["Anaconda des Catacombes", 4,6,53],
["Basilisk", 4,11,100],
["Behir", 4,13,96],
["Beholder", 4,50,48],
["Bondin", 4,8,88],
["Bouj'Dla Placide", 4,23,87],
["Bouj'Dla", 4,13,87],
["Bulette", 4,14,101],
["Carnosaure", 4,16,3],
["Chim�re", 4,11,102],
["Chonchon", 4,20,11],
["Cockatrice", 4,5,89],
["Crasc M�dius", 4,20,16],
["Crasc Maexus", 4,25,16],
["Crasc", 4,10,16],
["Cube G�latineux", 4,21,0],
["Daemonite", 1,19,107],
["Djinn", 4,21,8],
["Effrit", 4,22,108],
["Esprit-Follet", 4,15,0],
["Familier", 4,1,35],
["Feu Follet", 4,16,2],
["Fumeux", 1,17,110],
["Fungus G�ant", 4,6,111],
["Fungus", 4,6,0],
["Fungus Violet", 4,3,0],
["Gargouille", 4,5,91],
["Gorgone", 4,11,43],
["Grouilleux", 4,2,0],
["Grylle", 4,20,119],
["Harpie", 4,4,39],
["Hydre", 4,50,0],
["Labeilleux", 3,20,120],
["L�zard G�ant", 4,5,74],
["L�zard", 4,5,0],
["Manticore", 4,7,64],
["Mimique", 4,7,23],
["Monstre Rouilleur", 4,4,83],
["Mouch'oo Domestique", 4,21,0],
["Mouch'oo Majestueux Sauvage", 4,21,0],
["Mouch'oo Sauvage", 4,12,121],
["Naga", 4,9,122],
["Ombre de Roches", 4,12,1],
["Pititabeille", 3,1,120],
["Phoenix", 4,23,47],
["Plante Carnivore", 4,4,78],
["Slaad", 4,5,65],
["Tertre Errant", 4,19,125],
["Trancheur", 4,21,14],
["Tutoki", 4,2,31],
["Ver Carnivore G�ant", 4,13,15],
["Ver Carnivore", 4,13,15],
["Vouivre", 4,23,12],
["Worg", 4,5,0],
["Ame-en-peine", 5,7,97],
["Banshee", 5,15,22],
["Capitan", 5,24,94],
["Croquemitaine", 5,6,103],
["Ectoplasme", 5,15,104],
["Fant�me", 5,19,19],
["Goule", 5,4,60],
["Liche", 5,50,85],
["Momie", 5,4,73],
["N�crochore", 5,25,123],
["N�crophage", 5,7,0],
["N�-H�niym-H���", 5,0,0],
["Ombre", 5,2,79],
["Spectre", 5,13,124],
["Squelette", 5,1,34],
["Vampire", 5,22,7],
["Zombie", 5,2,81],
["Aragnarok du Chaos",3,17,128], 
["El�mentaire Magmatique",1,8,131],
["Raquettou",2,22,133],
["Cube G�latineux",4,32,134],
["Archi-N�cromant",5,43,135]
];

// === Images des monstes ===
var skinBEAST=new Array();
skinBEAST[0]='Wanted-nophoto.jpg';
skinBEAST[1]='VG_OmbreDesRoches.jpg';
skinBEAST[2]='VB_feufollet.jpg';
skinBEAST[3]='VG_Carnosaure.jpg';
skinBEAST[4]='GO_abishai_bleu.jpg';
skinBEAST[5]='turkey_03.gif';
skinBEAST[6]='Gremlins.jpg';
skinBEAST[7]='GO_Vampire.jpg';
skinBEAST[8]='VB_djinn.jpg';
skinBEAST[9]='MA_cheval_dent_de_sabreF.jpg';
skinBEAST[10]='GO_abishai_rouge.jpg';
skinBEAST[11]='GO_Chonchon.jpg';
skinBEAST[12]='VG_Vouivre.jpg';
skinBEAST[13]='VG_PalefroiInfernal.jpg';
skinBEAST[14]='VB_petittrancheur.jpg';
skinBEAST[15]='GO_Vcg.jpg';
skinBEAST[16]='GO_Crasc.jpg';
skinBEAST[17]='ScarabeeGeant.jpg';
skinBEAST[18]='Diablotin.jpg';
skinBEAST[19]='GO_Fantome.jpg';
skinBEAST[20]='GnuSauvage.jpg';
skinBEAST[21]='AK_elementaireair.jpg';
skinBEAST[22]='GO_Banshee.jpg';
skinBEAST[23]='VG_Mimique.jpg';
skinBEAST[24]='VB_erinyes.jpg';
skinBEAST[25]='GO_abishai_vert.jpg';
skinBEAST[26]='VG_MillePattesGeant.jpg';
skinBEAST[27]='GO_Shai.jpg';
skinBEAST[28]='VB_sorciere.jpg';
skinBEAST[29]='VB_elementairedeterre.jpg';
skinBEAST[30]='Gobelin.jpg';
skinBEAST[31]='FP_Tutoki.jpg';
skinBEAST[32]='RatGeant.jpg';
skinBEAST[33]='AraigneeGeante.jpg';
skinBEAST[34]='Squelette.jpg';
skinBEAST[35]='VB_familier.jpg';
skinBEAST[36]='VB_amibe.jpg';
skinBEAST[37]='VB_three-kreen.jpg';
skinBEAST[38]='FP_Gnoll.jpg';
skinBEAST[39]='Harpie.jpg';
skinBEAST[40]='AK_elementaireeau.jpg';
skinBEAST[41]='Orque.jpg';
skinBEAST[42]='ChampiGlouton.jpg';
skinBEAST[43]='VG_Gorgogne.jpg';
skinBEAST[44]='VB_titan.jpg';
skinBEAST[45]='GO_Marilith2.jpg';
skinBEAST[46]='AK_elementairefeu.jpg';
skinBEAST[47]='GO_Phoenix.jpg';
skinBEAST[48]='Beholder.jpg';
skinBEAST[49]='FP_Megacephale.jpg';
skinBEAST[50]='VG_ScorpionGeant.jpg';
skinBEAST[51]='VB_limace.jpg';
skinBEAST[52]='GO_abishai_noir.jpg';
skinBEAST[53]='AnacondaCatacombes.jpg';
skinBEAST[54]='VB_hellrot.jpg';
skinBEAST[55]='GO_OursGarou.jpg';
skinBEAST[56]='Succube.jpg';
skinBEAST[57]='RatGarou.jpg';
skinBEAST[58]='LoupGarou.jpg';
skinBEAST[59]='VB_rocketeux.jpg';
skinBEAST[60]='FP_Goule.jpg';
skinBEAST[61]='GO_Tubercule.jpg';
skinBEAST[62]='Hurleur.jpg';
skinBEAST[63]='MolosseSatanique.jpg';
skinBEAST[64]='VB_manticore.jpg';
skinBEAST[65]='Slaad.jpg';
skinBEAST[66]='VG_Kobold.jpg';
skinBEAST[67]='VB_etins.jpg';
skinBEAST[68]='Ogre.jpg';
skinBEAST[69]='VG_Ankheg.jpg';
skinBEAST[70]='GO_Boggart.jpg';
skinBEAST[71]='VG_Caillouteux.jpg';
skinBEAST[72]='ChauveSouris.jpg';
skinBEAST[73]='Momie.jpg';
skinBEAST[74]='LezardGeant.jpg';
skinBEAST[75]='Lutin.jpg';
skinBEAST[76]='VG_Sagouin.jpg';
skinBEAST[77]='Minotaure.jpg';
skinBEAST[78]='PlanteCarnivore.jpg';
skinBEAST[79]='VB_ombre.jpg';
skinBEAST[80]='Yeti.jpg';
skinBEAST[81]='Zombie.jpg';
skinBEAST[82]='VB_strige.jpg';
skinBEAST[83]='VB_monstre_rouilleur.jpg';
skinBEAST[84]='VB_homme-lezard.jpg';
skinBEAST[85]='Liche.jpg';
skinBEAST[86]='AK_elementairechaos.jpg';
skinBEAST[87]='VB_BoujDla.jpg';
skinBEAST[88]='VB_Bondin.jpg';
skinBEAST[89]='VB_Coquatrice.jpg';
skinBEAST[90]='VB_Furgolin.jpg';
skinBEAST[91]='VB_Gargouille.jpg';
skinBEAST[92]='VB_Meduse.jpg';
skinBEAST[93]='BO_Behemoth.jpg';
skinBEAST[94]='BO_Capitan.jpg';
skinBEAST[95]='BO_AnolporPurpurin.jpg';
skinBEAST[96]='BO_Behir.jpg';
skinBEAST[97]='BO_AmeEnPeine.jpg';
skinBEAST[98]='BO_Ashashin.jpg';
skinBEAST[99]='BO_Barghest.jpg';
skinBEAST[100]='BO_Basilisk.jpg';
skinBEAST[101]='BO_Bulet.jpg';
skinBEAST[102]='BO_Chimere.jpg';
skinBEAST[103]='BO_Croquemitaine.jpg';
skinBEAST[104]='BO_Ectoplasme.jpg';
skinBEAST[105]='BO_GolemDeChair.jpg';
skinBEAST[106]='BO_Incube.jpg';
skinBEAST[107]='KH_Daemonite.jpg';
skinBEAST[108]='KH_Effrit.jpg';
skinBEAST[109]='TO_Foudroyeur.jpg';
skinBEAST[110]='Fumeux.jpg';
skinBEAST[111]='OF_Fungus.jpg';
skinBEAST[112]='BO_GeantDePierre.jpg';
skinBEAST[113]='BO_GeantDesGouffres.jpg';
skinBEAST[114]='OF_Glouton.jpg';
skinBEAST[115]='OF_Goblours.jpg';
skinBEAST[116]='BO_GolemDArgile.jpg';
skinBEAST[117]='OF_GolemFer.jpg';
skinBEAST[118]='BO_GolemDePierre.jpg';
skinBEAST[119]='OF_Grylle.jpg';
skinBEAST[120]='OF_Labeilleux.jpg';
skinBEAST[121]='NA_Mouchoo.jpg';
skinBEAST[122]='TO_Naga.jpg';
skinBEAST[123]='KH_Necrochore.jpg';
skinBEAST[124]='OF_Spectre.jpg';
skinBEAST[125]='BO_TertreErrant.jpg';
skinBEAST[126]='KH_TigreGarou.jpg';
skinBEAST[127]='OF_Xorn.jpg';
skinBEAST[128]='BO_AragnarokDuChaos.png';
skinBEAST[129]='OF_PseudoDragon.png';
skinBEAST[130]='AbishaiRose.png';
skinBEAST[131]='AK_elementairemagmatique.png';
skinBEAST[132]='BO_ChevalierDuChaos.png';
skinBEAST[133]='OS_Racketou.jpg';
skinBEAST[134]='OS_Cube_Gelatineux.jpg';
skinBEAST[135]='OS_Necromant.jpg';

// === Images des comp�tences ===
var skinIMG=new Array();
skinIMG['Attaque Precise']='attaque_precise.png';
skinIMG['Botte Secrete']='botte_secrete.png';
skinIMG['Charger']='charger.png';
skinIMG['Connaissance des Monstres']='connaissance_des_monstres.png';
skinIMG['Construire un Piege']='construire_un_piege.png';
skinIMG['Contre-Attaquer']='contre_attaquer.png';
skinIMG['Coup de Butoir']='coup_de_butoir.png';
skinIMG['Frenesie']='frenesie.png';
skinIMG['Lancer de Potions']='lancer_de_potions.png';
skinIMG['Pistage']='pistage.png';
skinIMG['Regeneration Accrue']='regeneration_accrue.png';
skinIMG['Insultes']='insultes.png';
skinIMG['Deplacement Eclair']='deplacement_eclair.png';
skinIMG['Identification des Champignons']='identification_des_champignons.png';
skinIMG['Balluchonnage']='balluchonnage.png';
skinIMG['Acceleration du Metabolisme']='acceleration_metabolique.png';
skinIMG['Ecriture Magique']='ecriture_magique.png'; 
skinIMG['Grattage']='grattage.png'; 
skinIMG['Hurlement Effrayant']='hurlement_effrayant.png'; 
skinIMG['Miner']='miner.png'; 
skinIMG['Camouflage']='camouflage.png'; 
skinIMG['Tailler']='tailler.png'; 
skinIMG['Bidouille']='bidouille.png'; 
skinIMG['Dressage']='dressage.png'; 
skinIMG['Melange Magique']='melange_magique.png'; 
skinIMG['Necromancie']='necromancie.png'; 
skinIMG['Parer']='parer.png'; 
skinIMG['Planter un Champignon']='planter_un_champignon.png'; 
skinIMG['Shamaner']='shamaner.png'; 
skinIMG['Marquage']='marquage.png'; 
skinIMG['Retraite']='retraite.png'; 
skinIMG['RotoBaffe']='rotobaffe.png';
skinIMG['Balayage']='balayage.png';
skinIMG['Golemologie']='golemologie.png';
skinIMG['Reparation']='reparation.png';
skinIMG['Course']='course.png';

// === Images des sorts ===
skinIMG['Analyse Anatomique']='analyse_anatomique.png';
skinIMG['Armure Etheree']='armure_etheree.png';
skinIMG['Augmentation de l�Attaque']='augmentation_de_l_attaque.png';
skinIMG['Augmentation de l�Esquive']='augmentation_de_l_esquive.png';
skinIMG['Augmentation des Degats']='augmentation_des_degats.png';
skinIMG['Bulle Anti-Magie']='bulle_d_anti_magie.png';
skinIMG['Bulle Magique']='bulle_magique.png';
skinIMG['Explosion']='explosion.png';
skinIMG['Faiblesse Passagere']='faiblesse_passagere.png';
skinIMG['Flash Aveuglant']='flash_aveuglant.png';
skinIMG['Glue']='glue.png';
skinIMG['Griffe du Sorcier']='griffe_du_sorcier.png';
skinIMG['Hypnotisme']='hypnotisme.png';
skinIMG['Projectile Magique']='projectile_magique.png';
skinIMG['Rafale Psychique']='rafale_psychique.png';
skinIMG['Teleportation']='teleportation.png';
skinIMG['Vampirisme']='vampirisme.png';
skinIMG['Vision Accrue']='vision_accrue.png';
skinIMG['Sacrifice']='sacrifice.png';
skinIMG['Identification des tresors']='identification_de_tresors.png';
skinIMG['Invisibilite']='invisibilite.png';
skinIMG['Vision lointaine']='vision_lointaine.png';
skinIMG['Voir le Cache']='voir_le_cache.png';
skinIMG['Telekinesie']='telekinesie.png';
skinIMG['Projection']='projection.png';
skinIMG['Vue Troublee']='vue_troublee.png';
skinIMG['Siphon des ames']='syphon_des_ames.png';
skinIMG['Levitation']='levitation.png'; 
skinIMG['Puissance Magique']='puissance_magique.png'; 
skinIMG['Pr�cision Magique=']='precision_magique.png'; 

// === Conversion Ev�nement => image comp�tence/sorts ===
var ZZImg=new Array();	
ZZImg['Rafale Psy.']='sortileges/'+skinIMG['Rafale Psychique'];
ZZImg['Charge']='competences/'+skinIMG['Charger'];
ZZImg['Att. Pr�cise']='competences/'+skinIMG['Attaque Precise'];
ZZImg['Botte Secr�te']='competences/'+skinIMG['Botte Secrete'];
ZZImg['Fr�n�sie']='competences/'+skinIMG['Frenesie'];
ZZImg['Coup de Butoir']='competences/'+skinIMG['Coup de Butoir'];
ZZImg['Projectile Mag.']='sortileges/'+skinIMG['Projectile Magique'];
ZZImg['Vampirisme']='sortileges/'+skinIMG['Vampirisme'];
ZZImg['Explosion']='sortileges/'+skinIMG['Explosion'];
ZZImg['Griffe du Sorcier']='sortileges/'+skinIMG['Griffe du Sorcier'];
ZZImg['Pi�ge � Feu']='competences/'+skinIMG['Construire un Piege'];
ZZImg['Rotobaffe']='competences/'+skinIMG['Rotobaffe'];
ZZImg['Syphon des �mes']='sortileges/'+skinIMG['Siphon des ames'];
ZZImg['CdM']='competences/'+skinIMG['Connaissance des Monstres'];
ZZImg['Insulte']='competences/'+skinIMG['Insultes'];

// === Conversion Ev�nement => image comp�tence/sorts ===
var skinTresor=new Array();	
skinTresor['Potion']='equipement/potions/potion_elixir.gif';
skinTresor['Armure']='equipement/corps/armure_de_plates.gif';
skinTresor['Arme (2 mains)']='equipement/mains/hache_a_2_mains_d_obsidienne.gif';
skinTresor['Arme (1 main)']='equipement/mains/epee_courte.gif';
skinTresor['Casque']='equipement/tete/casque_a_cornes.gif';
skinTresor['Bouclier']='equipement/mains/targe.gif';
skinTresor['Parchemin']='equipement/parcho/parchemin.gif';
skinTresor['Talisman']='equipement/cou/collier_de_dents.gif';
skinTresor['Bottes']='equipement/pieds/bottes.gif';
skinTresor['Tr�sor']='equipement/tresor.png';
skinTresor['Composant']='equipement/composant.jpg';
skinTresor['Carte']='equipement/parcho/parchemin.gif';
skinTresor['Anneau']='equipement/anneau.jpg';
skinTresor['Champignon']='equipement/champignon.jpg';
skinTresor['Minerai']='equipement/minerai.jpg';
skinTresor['Outils']='equipement/outils.jpg';
skinTresor['Gigots de Gob']='equipement/gigots_de_gob.jpg';
skinTresor['Sp�cial']='equipement/special.jpg';

// === Fonctions ===
function URLencode(sStr) {
  return escape(sStr).replace(/\+/g, '%2B').replace(/\"/g,'%22').replace(/\'/g, '%27');
  //return escape(sStr).replace(/\+/g, '%2C').replace(/\"/g,'%22').replace(/\'/g, '%27');
}


function PrintObj(obj) {
	alert(ArrayToString(obj, "", 0)); 
}

function ArrayToString(obj, s, i) {
     if (i>20) { return ""; }
     var r="";
     if (typeof(obj)=='object') {
       if (obj.toString().indexOf("Text")) {
           if (i==0) {
               r=r+"["+s+"="+obj.nodeValue+"]";
           }
       }
       r=r+ArrayToString(obj.childNodes[i], s+"."+i, 0);
       r=r+ArrayToString(obj, s, i+1);
       return r;
     } else {
        return "";
     }
}
/*********************************************************************************
*    This file is part of Mountyzilla.                                           *
*                                                                                *
*    Mountyzilla is free software; you can redistribute it and/or modify         *
*    it under the terms of the GNU General Public License as published by        *
*    the Free Software Foundation; either version 2 of the License, or           *
*    (at your option) any later version.                                         *
*                                                                                *
*    Mountyzilla is distributed in the hope that it will be useful,              *
*    but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*    GNU General Public License for more details.                                *
*                                                                                *
*    You should have received a copy of the GNU General Public License           *
*    along with Mountyzilla; if not, write to the Free Software                  *
*    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*********************************************************************************/

/*********************************************************************************
* v1.2.2.2 by Dabihul - 2012-08-02                                               *
* - r�vision de getPVrestants (erreurs calculs)                                  *
* - ajout des fonctions de gestion/stockage des dates                            *
* - ajout des nouvelles comps dans arraycompsort                                 *
* TODO                                                                           *
* - revoir la gestion des CdM                                                    *
* - revoir tout ce qui est li� � la vue (estimateurs d�g nott)                   *
* - v�rfier la gestion des enchants                                              *
*********************************************************************************/

var poissotron = 'http://minitilk.fur4x-hebergement.net/getDice2.php';

/*********************************************************************************
*                    mise � jour de variables globales utiles                    *
*********************************************************************************/

var numTroll = MZ_getValue('NUM_TROLL'); // utilis� pour acc�s bdd (un peu partout)
var nivTroll = MZ_getValue('NIV_TROLL'); // utilis� dans vue pour PX
var mmTroll = MZ_getValue(numTroll+'.caracs.mm'); // utilis� dans actions et vue (calculs SR)
var rmTroll = MZ_getValue(numTroll+'.caracs.rm'); // utilis� dans actions et vue (calculs SR)


/*********************************************************************************
*                           Fonctions dur�e de script                            *
*********************************************************************************/

var date_debut = null;

function start_script(nbJours_exp) {
	if (date_debut)
		return;
	date_debut = new Date();
	// Cr�� la variable expdate si demand�
	if (nbJours_exp) {
		expdate = new Date();
		expdate.setTime(expdate.getTime()+nbJours_exp*86400000);
		}
	}

function displayScriptTime() {
	var node = document.evaluate("//td/text()[contains(.,'Page g�n�r�e en')]/../br",
						document, null, 9, null).singleNodeValue;
	if (node)
		insertText(node,' - [Script ex�cut� en '+(new Date().getTime()-date_debut.getTime())/1000+' sec.]');
	}


/*********************************************************************************
*                              Insertion de scripts                              *
*********************************************************************************/


function isPage(url) {
	return currentURL.indexOf(MHURL + url) == 0;
}

function chargerScript(script) {
	// (mauvaise) D�tection du chargement de la page
	if (document.getElementsByTagName('A').length > 0)
		appendNewScript(script.indexOf('http://') != -1 ? script : scriptsMZ+script+'_FF.js');
}

function addScript(src) {
	var newScript = document.createElement('script');
	newScript.setAttribute('language', 'JavaScript');
	newScript.setAttribute('src', src);
	var parent = document.body;
	parent.appendChild(newScript);
	return newScript;
}

function appendNewScript(src, paren) {
	MZ_appendNewScript(src);
}


/*********************************************************************************
*                              Modifications du DOM                              *
*********************************************************************************/
// check complet Dab

function insertBefore(next, el) {
	next.parentNode.insertBefore(el, next);
	}

function appendTr(tbody, clas) {
	var tr = document.createElement('tr');
	if (clas)
		tr.setAttribute('class', clas);
	tbody.appendChild(tr);
	return tr;
	}

function insertTr(next, clas) {
	var tr = document.createElement('tr');
	if (clas)
		tr.setAttribute('class', clas);
	insertBefore(next, tr);
	return tr;
	}

function appendTd(tr) {
	var td = document.createElement('td');
	if (tr)
		tr.appendChild(td);
	return td;	
	}

function insertTd(next) {
	var td = document.createElement('td');
	insertBefore(next, td);
	return td;
	}

function appendTdCenter(tr, colspan) {
	var td = appendTd(tr);
	td.setAttribute('align', 'center');
	if (colspan)
		td.setAttribute('colspan', colspan);
	return td;
	}

function insertTdElement(next, el) {
	var td = insertTd(next);
	if (el)
		td.appendChild(el);
	return td;
	}

function appendText(paren, text, bold) {
	if (bold) {
		var b = document.createElement('b');
		b.appendChild(document.createTextNode(text));
		paren.appendChild(b);
		}
	else
		paren.appendChild(document.createTextNode(text));
	}

function insertText(next, text, bold) {
	if (bold) {
		var b = document.createElement('b');
		appendText(b, text);
		insertBefore(next, b);
		}
	else
		insertBefore(next, document.createTextNode(text));
	}

function appendTdText(tr, text, bold) {
	var td = appendTd(tr);
	appendText(td, text, bold);
	return td;
	}

function insertTdText(next, text, bold) {
	var td = insertTd(next);
	appendText(td, text, bold);
	return td;
	}

function appendBr(paren) {
	paren.appendChild(document.createElement('br'));
	}

function insertBr(next) {
	insertBefore(next, document.createElement('br'));
	}

function appendLI(ul, text) { // uniquement utilis� dans les options (cr�dits)
	var li = document.createElement('li');
	appendText(li, text);
	ul.appendChild(li);
	return li;
	}

function appendTextbox(paren, type, nam, size, maxlength, value) {
	var input = document.createElement('input');
	input.setAttribute('class', 'TextboxV2');
	input.setAttribute('type', type);
	input.setAttribute('name', nam);
	input.setAttribute('id', nam);
	input.setAttribute('size', size);
	input.setAttribute('maxlength', maxlength);
	if (value)
		input.setAttribute('value', value);
	paren.appendChild(input);
	return input;
	}

function appendCheckBox(paren, nam, checked, onClick) {
	var input = document.createElement('input');
	input.setAttribute('type', 'checkbox');
	input.setAttribute('name', nam);
	input.setAttribute('id', nam);
	if (checked)
		input.checked = true;
	if (onClick)
		input.addEventListener('click', onClick, true);
	paren.appendChild(input);
	return input;
	}

function appendNobr(paren, id, delgg, text) {
	var nobr = document.createElement('nobr');
	appendCheckBox(nobr, id, null, delgg);
	appendText(nobr, text);
	paren.appendChild(nobr);
	appendText(paren, '   ');
	return nobr;
	}

function appendOption(select, value, text) {
	var option = document.createElement('option');
	option.setAttribute('value', value);
	appendText(option, text);
	select.appendChild(option);
	return option;
	}

function appendHidden(form, nam, value) {
	var input = document.createElement('input');
	input.setAttribute('type', 'hidden');
	input.setAttribute('name', nam);
	input.setAttribute('id', nam);
	input.setAttribute('value', value);
	form.appendChild(input);
	}

function appendButton(paren, value, onClick) {
	var input = document.createElement('input');
	input.setAttribute('type', 'button');
	input.setAttribute('class', 'mh_form_submit');
	input.setAttribute('value', value);
	input.setAttribute('onMouseOver', 'this.style.cursor=\'hand\';');
	input.addEventListener('click', onClick, true);
	paren.appendChild(input);
	return input;
	}

function appendSubmit(paren, value, onClick) {
	var input = document.createElement('input');
	input.setAttribute('type', 'submit');
	input.setAttribute('class', 'mh_form_submit');
	input.setAttribute('value', value);
	input.setAttribute('onMouseOver', 'this.style.cursor=\'hand\';');
	if (onClick)
		input.addEventListener('click', onClick, true);
	paren.appendChild(input);
	return input;
	}

function createImage(url, text) {
	var img = document.createElement('img');
	img.setAttribute('src',url);
	img.setAttribute('title',text);
	img.setAttribute('align','ABSMIDDLE');
	return img;
	}
	
function createCase(titre, table, width) {
	if (width==null)
		width='120';
	var tr = appendTr(table, 'mh_tdpage');
	
	var td = appendTdText(tr, titre, true);
	td.setAttribute('class', 'mh_tdtitre');
	td.setAttribute('width', width);
	
	td = appendTdText(tr, '');
	td.setAttribute('class', 'mh_tdpage');
	return td;
	}

function getMyID(e) {
	var parent = e.parentNode;
	for (var i=0 ; i<parent.childNodes.length ; i++) {
		if(e==parent.childNodes[i])
			return i;
		}
	return -1;
	}

function insertAfter(e, newE) {
	var id = getMyID(e);
	if (id==-1)
		return;
	if (id<e.parentNode.childNodes.length-1)
		insertBefore(e.nextSibling,newE);
	else
		e.parentNode.appendChild(newE);
	}


/*********************************************************************************
*                      Fonctions de mise en forme du texte                       *
*********************************************************************************/

function aff(nb) {
	return nb >= 0 ? '+'+nb : nb;
	}

function trim(str) {
	return str.replace(/(^\s*)|(\s*$)/g,'');
	}

function epure(texte) {
	return texte.replace(/[����]/g,'e').replace(/[���]/g,'a').replace(/�/g, 'A').replace(/[���]/g,'u')
			.replace(/[���]/g,'o').replace(/[��]/g,'i').replace(/[�]/g,'c');
	}

function bbcode(texte)
{
	texte=texte.replace(/&/g, "&amp;") ;
	texte=texte.replace(/"/g, "&quot;") ;
	texte=texte.replace(/</g, "&lt;") ;
	texte=texte.replace(/>/g, "&gt;") ;
	texte=texte.replace(/'/g, "&#146;") ;
	texte=texte.replace(/\[b\](.*?)\[\/b\]/g,"<b>$1</b>");
	texte=texte.replace(/\[i\](.*?)\[\/i\]/g,"<i>$1</i>");
	texte=texte.replace(/\[img\]([^"]*?)\[\/img\]/g,"<img src=\"$1\" />");
	return texte;	
}

function str_woa(str) { // Dab : string without accent ... epure c'pas mieux ? <_<
	return str.replace(/[����]/g, 'e').replace(/[���]/g, 'a').replace(/�/g, 'A')
			.replace(/[���]/g, 'u').replace(/[��]/g, 'i').replace(/[��]/g, 'o');
	}


/*********************************************************************************
*                       Gestion / Transformation des Dates                       *
*********************************************************************************/

function addZero(i) {
	return (i<10) ? '0'+i : i;
	}

function DateToString(date) {
	return addZero(date.getDate())+'/'+addZero(date.getMonth()+1)+'/'+date.getFullYear()+' '
		+addZero(date.getHours())+':'+addZero(date.getMinutes())+':'+addZero(date.getSeconds());
	}

function StringToDate(str) {
	return str.replace(/([0-9]+)\/([0-9]+)/,"$2/$1");
	}


/*********************************************************************************
*                             Stockage des comp/sort                             *
*********************************************************************************/

conversionCompSortArray = new Array();
// comps
conversionCompSortArray[str_woa('Acc�l�ration du M�tabolisme')]='AM';
conversionCompSortArray[str_woa('Attaque Pr�cise')]='AP';
conversionCompSortArray[str_woa('Balayage')]='Balayage';
conversionCompSortArray[str_woa('Balluchonnage')]='Balluchonnage';
conversionCompSortArray[str_woa('Bidouille')]='Bidouille';
conversionCompSortArray[str_woa('Botte Secr�te')]='BS';
conversionCompSortArray[str_woa('Camouflage')]='Camouflage';
conversionCompSortArray[str_woa('Charger')]='Charger';
conversionCompSortArray[str_woa('Connaissance des Monstres')]='CdM';
conversionCompSortArray[str_woa('Construire un Pi�ge')]='Piege';
conversionCompSortArray[str_woa('Contre-Attaquer')]='CA';
conversionCompSortArray[str_woa('Coup de Butoir')]='CdB';
conversionCompSortArray[str_woa('Course')]='Course';
conversionCompSortArray[str_woa('D�placement Eclair')]='DE';
conversionCompSortArray[str_woa('Dressage')]='Dressage';
conversionCompSortArray[str_woa('Ecriture Magique')]='EM';
conversionCompSortArray[str_woa('Fr�n�sie')]='Frenesie';
conversionCompSortArray[str_woa('Grattage')]='Grattage';
conversionCompSortArray[str_woa('Hurlement Effrayant')]='HE';
conversionCompSortArray[str_woa('Identification des Champignons')]='IdC';
conversionCompSortArray[str_woa('Insultes')]='Insultes';
conversionCompSortArray[str_woa("S'interposer")]='Interposition';
conversionCompSortArray[str_woa('Lancer de Potions')]='LdP';
conversionCompSortArray[str_woa('Marquage')]='Marquage';
conversionCompSortArray[str_woa('M�lange Magique')]='MM';
conversionCompSortArray[str_woa('Miner')]='Miner';
conversionCompSortArray[str_woa('N�cromancie')]='Necromancie';
conversionCompSortArray[str_woa('Parer')]='Parer';
conversionCompSortArray[str_woa('Pistage')]='Pistage';
conversionCompSortArray[str_woa('Planter un Champignon')]='PuC';
conversionCompSortArray[str_woa('R�g�n�ration Accrue')]='RA';
conversionCompSortArray[str_woa('R�paration')]='Reparation';
conversionCompSortArray[str_woa('Retraite')]='Retraite';
conversionCompSortArray[str_woa('Rotobaffe')]='Rotobaffe';
conversionCompSortArray[str_woa('Shamaner')]='Shamaner';
conversionCompSortArray[str_woa('Tailler')]='Tailler';
//conversionCompSortArray[str_woa('Vol')]='Vol';
// sorts
conversionCompSortArray[str_woa('Analyse Anatomique')]='AA';
conversionCompSortArray[str_woa('Armure Eth�r�e')]='AE';
conversionCompSortArray[str_woa('Augmentation de l�Attaque')]='AdA';
conversionCompSortArray[str_woa('Augmentation de l�Esquive')]='AdE';
conversionCompSortArray[str_woa('Augmentation des D�gats')]='AdD';
conversionCompSortArray[str_woa('Bulle Anti-Magie')]='BAM';
conversionCompSortArray[str_woa('Bulle Magique')]='BuM';
conversionCompSortArray[str_woa('Explosion')]='Explosion';
conversionCompSortArray[str_woa('Faiblesse Passag�re')]='FP';
conversionCompSortArray[str_woa('Flash Aveuglant')]='FA';
conversionCompSortArray[str_woa('Glue')]='Glue';
conversionCompSortArray[str_woa('Griffe du Sorcier')]='GdS';
conversionCompSortArray[str_woa('Hypnotisme')]='Hypnotisme';
conversionCompSortArray[str_woa('Identification des tr�sors')]='IdT';
conversionCompSortArray[str_woa('Invisibilit�')]='Invisibilite';
conversionCompSortArray[str_woa('L�vitation')]='Levitation';
conversionCompSortArray[str_woa('Projectile Magique')]='Projectile';
conversionCompSortArray[str_woa('Projection')]='Projection';
conversionCompSortArray[str_woa('Rafale Psychique')]='Rafale';
conversionCompSortArray[str_woa('Sacrifice')]='Sacrifice';
conversionCompSortArray[str_woa('Siphon des �mes')]='Siphon';
conversionCompSortArray[str_woa('T�l�kin�sie')]='Telekinesie';
conversionCompSortArray[str_woa('T�l�portation')]='TP';
conversionCompSortArray[str_woa('Vampirisme')]='Vampirisme';
conversionCompSortArray[str_woa('Vision Accrue')]='VA';
conversionCompSortArray[str_woa('Vision lointaine')]='VL';
conversionCompSortArray[str_woa('Voir le Cach�')]='VlC';
conversionCompSortArray[str_woa('Vue Troubl�e')]='VT';
//conversionCompSortArray[str_woa('')]='';

function setSortComp(nom,pourcentage,niveau) { //check Dab
	if (!niveau)
		niveau = 1;
	pourcentage = parseInt(pourcentage);
	if (conversionCompSortArray[epure(nom)])
		MZ_setValue(numTroll+'.compsort.'+conversionCompSortArray[epure(nom)]+'.'+niveau,pourcentage);
	}

function getSortComp(nom,niveau) { // check Dab
	var nomEnBase = conversionCompSortArray[epure(nom)];
	if (!nomEnBase)
		return 0;
	if (!niveau) {
		var pcmax = 0;
		var niveau = 1;
		while (MZ_getValue(numTroll+'.compsort.'+nomEnBase+'.'+niveau)) {
			pcmax = Math.max(pcmax, MZ_getValue(numTroll+'.compsort.'+nomEnBase+'.'+niveau));
			niveau++;
			}
		return pcmax;
		}
	if (MZ_getValue(numTroll+'.compsort.'+nomEnBase+'.'+niveau))
		return MZ_getValue(numTroll+'.compsort.'+nomEnBase+'.'+niveau);
	return 0;
	}

function removeAllSortComp() { // check Dab
	for (var comp in conversionCompSortArray) {
		var niveau = 1;
		var nomEnBase = conversionCompSortArray[comp];
		while (MZ_getValue(numTroll+'.compsort.'+nomEnBase+'.'+niveau)) {
			MZ_removeValue(numTroll+'.compsort.'+nomEnBase+'.'+niveau);
			niveau++;
			}
		}
	}

function isProfilActif() {
	var att = MZ_getValue(numTroll+'.caracs.attaque');
	var attbmp = MZ_getValue(numTroll+'.caracs.attaque.bmp');;
	var attbmm = MZ_getValue(numTroll+'.caracs.attaque.bmm');;
	var mm = MZ_getValue(numTroll+'.caracs.mm');
	var deg = MZ_getValue(numTroll+'.caracs.degats');
	var degbmp = MZ_getValue(numTroll+'.caracs.degats.bmp');
	var degbmm = MZ_getValue(numTroll+'.caracs.degats.bmm');
	var vue = MZ_getValue(numTroll+'.caracs.vue');
	var bmvue = MZ_getValue(numTroll+'.caracs.vue.bm');
	if (att==null || attbmp==null || attbmm==null || mm==null || deg==null
		|| degbmp==null || degbmm==null || vue==null || bmvue==null)
		return false;
	return true;
	}


/*********************************************************************************
*                               Gestions des CDMs                                *
*********************************************************************************/

function getPVsRestants(pv, bless, vue) { // by Dab
	bless = parseInt(bless.match(/\d+/));
	if (bless==0)
		return null;
	var pvminmax = pv.match(/\d+/g);
	if (bless==95) {
		var pvb = 1;
		var pvh = Math.floor( pvminmax[1]/20 );
		}
	else if (bless == 5) {
		var pvb = Math.floor( pvminmax[0]*19/20 );
		var pvh = pvminmax[1];
		}
	else {
		var pvb = Math.ceil( pvminmax[0]*(95-bless) / 100 );
		var pvh = Math.floor( pvminmax[1]*(105-bless) / 100 );
		}
	return vue ?  " (" + pvb + "-" + pvh + ")"
			: new Array("Points de Vie restants : ", "Entre " + pvb + " et " + pvh);
	}

/* function estimPV(pv, bless) { // by Dab
	var pvb, pvh;
	bless = parseInt(bless.match(/\d+/));
	if (bless==0)
		return null;
	var encadrepv = pv.match(/\d+/g);
	if (bless==95) {
		pvb = 1;
		pvh = Math.floor( encadrepv[1]/20 );
		}
	else if (bless == 5) {
		pvb = Math.floor( encadrepv[0]*19/20 );
		pvh = encadrepv[1];
		}
	else {
		pvb = Math.ceil( encadrepv[0]*(95-bless)/100 );
		pvh = Math.floor( encadrepv[1]*(105-bless)/100 );
		}
	return new Array(pvb, pvh);
	} */

function insertButtonCdm(nextName, url, texte) {
	if (texte==null)
		texte = 'Participer au bestiaire';
	var nextNode = document.getElementsByName(nextName)[0];

	var espace = document.createTextNode('\t');
	insertBefore(nextNode, espace);

	var button = document.createElement('input');
	button.setAttribute('type', 'button');
	button.setAttribute('class', 'mh_form_submit');
	button.setAttribute('value', texte);
	button.setAttribute('onMouseOver', 'this.style.cursor=\'hand\';');
	if(url)
		button.addEventListener('click', url, true);
	insertBefore(espace, button);
	return button;
}

var listeTitres = new Array('Niveau', 'Famille', 'Points de Vie', 'Blessure', 'Attaque', 'Esquive', 'D�g�ts',
		'R�g�n�ration', 'Armure', 'Vue', 'Capacit� sp�ciale', 'R�sistance Magique', 'Autres');
		
function createCDMTable(id, nom, donneesMonstre) {
try{
	var urlImg = SkinZZ+"MZ/";
	var table = document.createElement('table');
	var profilActif = isProfilActif();
	table.setAttribute('class', 'mh_tdborder');
	table.setAttribute('border', '0');
	table.setAttribute('cellspacing', '1');
	table.setAttribute('cellpadding', '4');
	
	var thead = document.createElement('thead');
	var tr = appendTr(thead, 'mh_tdtitre');
	var td = appendTdText(tr, 'CDM de ' + nom + (donneesMonstre[11] != '???' ? ' (N� ' + id + ')' : ''), true);
	td.setAttribute('colspan', '2');
	table.appendChild(thead);
	var tbody = document.createElement('tbody');
	table.appendChild(tbody);


	for (var i = 0; i < listeTitres.length-3; i++) {
		 createCase(listeTitres[i],tbody,80);
	}
	var TypeMonstre=getEM(nom);
	var infosCompo="";
	if (TypeMonstre!="") {
	   infosCompo=compoEM(TypeMonstre);
	}
	var nodes = tbody.childNodes;
	nodes[0].childNodes[1].innerHTML = bbcode(donneesMonstre[0]) + analysePX(bbcode(donneesMonstre[0]));
	nodes[1].childNodes[1].firstChild.nodeValue = bbcode(donneesMonstre[1]);
	nodes[2].childNodes[1].innerHTML = bbcode(donneesMonstre[2]);
	nodes[3].childNodes[1].innerHTML = bbcode(donneesMonstre[11]);
	nodes[4].childNodes[1].innerHTML = bbcode(donneesMonstre[3]);
	nodes[5].childNodes[1].innerHTML = bbcode(donneesMonstre[4]);
	nodes[6].childNodes[1].innerHTML = bbcode(donneesMonstre[5]);
	nodes[7].childNodes[1].innerHTML = bbcode(donneesMonstre[6]);
	nodes[8].childNodes[1].innerHTML = bbcode(donneesMonstre[7]);
	nodes[9].childNodes[1].innerHTML = bbcode(donneesMonstre[8]);
	if(donneesMonstre[10] && donneesMonstre[10].length>0)
	{
		td = createCase(listeTitres[10],tbody);
		td.innerHTML = bbcode(donneesMonstre[10]);
		if(donneesMonstre[16] && donneesMonstre[16].length>0)
		{
			td.appendChild(document.createTextNode(" "));
			if(donneesMonstre[16] == "De zone")
				td.appendChild(createImage(urlImg+"zone.gif", "Port�e : Zone"));
			else if(donneesMonstre[16] == "Automatique")
				td.appendChild(createImage(urlImg+"automatique.gif", "Toucher automatique"));
			else if(donneesMonstre[16] == "Au toucher")
				td.appendChild(createImage(urlImg+"toucher.gif", "Pouvoir au toucher"));
		}
			
	}
	if(donneesMonstre[9] && donneesMonstre[9].length>0)
	{
		td = createCase(listeTitres[11],tbody);
		td.innerHTML = bbcode(donneesMonstre[9]);
		// seuil de r�sistance du monstre
		var lb = td.getElementsByTagName('b');
		if (lb.length == 1) {
			var mrm = lb[0].firstChild.nodeValue * 1;
			var v = (mrm / mmTroll);
			lb[0].firstChild.nodeValue += " ("
					+ (mrm < mmTroll ? Math.max(10, Math.floor(v*50)) : Math.min(90, Math.floor(100 - 50/v))) + " %)";
		}
	}
	
	if(donneesMonstre[12]>0 || donneesMonstre[13]>=0 || donneesMonstre[14]>0 || donneesMonstre[15].length>0 || (donneesMonstre[17] && donneesMonstre[17].length>0) || infosCompo.length>0 || nom.indexOf("Gowap Apprivois�")==-1)
	{
		
		td = createCase(listeTitres[12],tbody);
		if(donneesMonstre[12]==1)
		{
			td.appendChild(createImage(urlImg+"oeil.gif", "Voit le cach�"));
		}
		if(donneesMonstre[13]==1)
		{
			td.appendChild(createImage(urlImg+"distance.gif", "Attaque � distance"));
		}
		else if(donneesMonstre[13]==0)
		{
			td.appendChild(createImage(urlImg+"cac.gif", "Corps � corps"));
		}
		if(donneesMonstre[14]==1)
		{
			td.appendChild(createImage(urlImg+"1.gif", "1 attaque par tour"));
		}
		if(donneesMonstre[14]>1 && donneesMonstre[14]<=6)
		{
			td.appendChild(createImage(urlImg+donneesMonstre[14]+".gif", donneesMonstre[14]+" attaque(s) par tour"));
		}
		else if(donneesMonstre[14]>6)
		{
			td.appendChild(createImage(urlImg+"plus.gif","Beaucoup d'attaques par tour"));
		}
		if(donneesMonstre[15]=="Lente")
		{
			td.appendChild(createImage(urlImg+"lent.gif","Lent � se d�placer"));
		}
		else if(donneesMonstre[15]=="Normale")
		{
			td.appendChild(createImage(urlImg+"normal.gif","Vitesse normale de d�placement"));
		}
		else if(donneesMonstre[15]=="Rapide")
		{
			td.appendChild(createImage(urlImg+"rapide.gif","D�placement rapide"));
		}
		if(donneesMonstre[17] && donneesMonstre[17].length>0 && donneesMonstre[17]!="Vide")
		{
			td.appendChild(createImage(urlImg+"charge2.gif","Poss�de de l'�quipement ("+donneesMonstre[17]+")"));
		}
		if(infosCompo.length>0)
		{
			td.appendChild(createImage(urlImg+"Competences/ecritureMagique.png",infosCompo));
		}
		if(profilActif && nom.indexOf("Gowap Apprivois�")==-1 && nom.indexOf("Gowap Sauvage")==-1)
		{
			td.appendChild(createPopupImage2(urlImg+"calc.png", id, nom));
		}
	}


	// pourcentage de blessure
	lb = nodes[3].childNodes[1].getElementsByTagName('b');
	if (lb.length == 1 && donneesMonstre[2].indexOf("-") != -1) {
		var pvs = getPVsRestants(donneesMonstre[2], lb[0].firstChild.nodeValue, true);
		if (pvs)
			lb[0].firstChild.nodeValue += pvs;
	}
	return table;
}
catch(e){alert(e);}
}


/*********************************************************************************
*                           Gestion des enchantements                            *
*********************************************************************************/

var listeMonstreEnchantement = null;
var listeEquipementEnchantement = null;
var listeInfoEnchantement = null;

function computeCompoEnchantement()
{
	listeMonstreEnchantement = new Array();
	listeInfoEnchantement = new Array();
	listeEquipementEnchantement = new Array();
	var liste = MZ_getValue(numTroll+'.enchantement.liste').split(';');
	for(var i=0;i<liste.length;i++)
	{
		var idEquipement = liste[i]*1;
		if(MZ_getValue(numTroll+'.enchantement.'+idEquipement+'.objet')==null || MZ_getValue(numTroll+'.enchantement.'+idEquipement+'.enchanteur')==null)
			continue;
		var nomEquipement = MZ_getValue(numTroll+'.enchantement.'+idEquipement+'.objet');
		var infoEnchanteur = MZ_getValue(numTroll+'.enchantement.'+idEquipement+'.enchanteur').split(';');
		var texteGlobal='';
		for(var j=0;j<3;j++)
		{
			var infoComposant = MZ_getValue(numTroll+'.enchantement.'+idEquipement+'.composant.'+j).split(';');
			listeMonstreEnchantement[infoComposant[2]] = 1;
			var array = new Array();
			array[0]=infoComposant[0].replace("Ril","�il");
			array[1]=infoComposant[1];
			array[2]=infoComposant[2];
			array[3]=getQualite(infoComposant[3]);
			var texte = infoComposant[4].replace("Ril","�il");
			for(var k=5;k<infoComposant.length;k++)
			{
				texte += ";"+infoComposant[k].replace("Ril","�il");
			}
			texteGlobal+=texte+'\n';
			texte += " pour l'enchantement d'un(e) "+nomEquipement+" chez l'enchanteur n�"+infoEnchanteur[0]+' ('+infoEnchanteur[1]+'|'+infoEnchanteur[2]+'|'+infoEnchanteur[3]+')';
			array[4]=texte;
			listeInfoEnchantement.push(array);
		}
		texteGlobal += "chez l'enchanteur n�"+infoEnchanteur[0]+' ('+infoEnchanteur[1]+'|'+infoEnchanteur[2]+'|'+infoEnchanteur[3]+')';
		listeEquipementEnchantement[idEquipement] = texteGlobal;
	}
	
}

function isEnchant(nom) {
	var monstreEnchant = '';
	for(j in listeInfoEnchantement) {
		monstre = listeInfoEnchantement[j][2].toLowerCase();
		if ((nom+' ').toLowerCase().indexOf(monstre+' ')>=0){		
			monstreEnchant=monstre;
			break; // �a permet d'arreter de chercher dans le tableau des EM -> on gagne du temps
		}
	}
	return trim(monstreEnchant);
}

function getInfoEnchantementFromMonstre(nom)
{
	try
	{
		if(!listeMonstreEnchantement)
		{
			computeCompoEnchantement();
		}
		var infosEnchant = '';
		for(j in listeInfoEnchantement) {
			monstre = listeInfoEnchantement[j][2].toLowerCase();
			if ((nom+' ').toLowerCase().indexOf(monstre+' ')>=0){		
				if(infosEnchant=='')
					infosEnchant=listeInfoEnchantement[j][4];
				else
					infosEnchant+='\n'+listeInfoEnchantement[j][4];
			}
		}
		return trim(infosEnchant);
	}
	catch(e)
	{
		alert(e);
	}
}

function composantEnchant(Monstre, composant, localisation,qualite) {
     var compo='';
	for (var i=0; i<listeInfoEnchantement.length; i++) {
	 	if (listeInfoEnchantement[i][2].toLowerCase()==Monstre.toLowerCase() && 
			listeInfoEnchantement[i][0].toLowerCase()==composant.toLowerCase() && 
			listeInfoEnchantement[i][1].toLowerCase()==localisation.toLowerCase() && 
			listeInfoEnchantement[i][3]<=qualite
		) {
			return listeInfoEnchantement[i][4];
		}
	}
	return compo;     
}

function insertEnchantInfos(tbody) {
	try
	{
		if(!listeMonstreEnchantement)
			computeCompoEnchantement();
		var nodes = document.evaluate("descendant::img[@alt = 'Composant - Sp�cial']",
				tbody, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		if (nodes.snapshotLength == 0)
			return false;
		var urlImg = SkinZZ+'MZ/enchant.png';
		for (var i = 0; i < nodes.snapshotLength; i++) {
			var link = nodes.snapshotItem(i).nextSibling.nextSibling;
			var nomCompoTotal = link.firstChild.nodeValue.replace(/\240/g, ' ');
			var nomCompo = nomCompoTotal.substring(0,nomCompoTotal.indexOf(" d'un"));
			nomCompoTotal = nomCompoTotal.substring(nomCompoTotal.indexOf("d'un"),nomCompoTotal.length);
			nomCompoTotal = nomCompoTotal.substring(nomCompoTotal.indexOf(' ')+1,nomCompoTotal.length);
			var nomMonstre = nomCompoTotal.substring(0,nomCompoTotal.indexOf(" de Qualit�"));
			var qualite = nomCompoTotal.substring(nomCompoTotal.indexOf("de Qualit�")+11,nomCompoTotal.indexOf(' ['));
			var localisation = nomCompoTotal.substring(nomCompoTotal.indexOf('[')+1,nomCompoTotal.indexOf(']'));
			if(isEnchant(nomMonstre).length>0)
			{
				var infos = composantEnchant(nomMonstre, nomCompo, localisation,getQualite(qualite));
				if(infos.length>0)
				{
					if(link.parentNode == link.nextSibling.parentNode)
					{
						var tmp = link.nextSibling;
						link.parentNode.insertBefore(createImage(urlImg,infos), link.nextSibling);
					}
					else
					{
						link.parentNode.appendChild(createImage(urlImg,infos));
					}
				}
			}
		}
	}
	catch(e)
	{
		alert(e);
	}
}

function computeEnchantementEquipement(fontionTexte,formateTexte)
{
	try
	{
		if(!listeMonstreEnchantement)
			computeCompoEnchantement();
		var nodes = document.evaluate("//a[@class='AllLinks' and contains(@href,'TresorHistory.php')]",
				document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		if (nodes.snapshotLength == 0)
			return false;
		var urlImg = SkinZZ+'MZ/enchant.png';
		for (var i = 0; i < nodes.snapshotLength; i++) 
		{
			var link = nodes.snapshotItem(i);
			var idEquipement = link.getAttribute('href');
			idEquipement = idEquipement.substring(idEquipement.indexOf('ai_IDTresor=')+12);
			idEquipement = parseInt(idEquipement.substring(0,idEquipement.indexOf("'")));
			var nomEquipement = trim(link.firstChild.nodeValue);
			var enchanteur = MZ_getValue(numTroll+'.enchantement.'+idEquipement+'.enchanteur');
			if(!enchanteur || enchanteur == '')
				continue;
			var infos = listeEquipementEnchantement[idEquipement];
			infos=formateTexte(infos);
			if(infos.length>0)
			{
				if(link.parentNode == link.nextSibling.parentNode)
				{
					var tmp = link.nextSibling;
					link.parentNode.insertBefore(fontionTexte(urlImg,infos), link.nextSibling);
				}
				else
				{
					link.parentNode.appendChild(fontionTexte(urlImg,infos));
				}
			}
			MZ_setValue(numTroll+'.enchantement.'+idEquipement+'.objet',nomEquipement+' ('+idEquipement+')');
		}
	}
	catch(e)
	{
		alert(e);
	}
}

/*********************************************************************************
*    This  part is a  Zoryazilla  data                  *
*  Gestion des compos EM                         *
*********************************************************************************/


function insertEMInfos(tbody) {
	var nodes = document.evaluate("descendant::img[@alt = 'Composant - Sp�cial']",
			tbody, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength == 0)
		return false;
	var urlImg = SkinZZ+'MZ/Competences/ecritureMagique.png';
	for (var i = 0; i < nodes.snapshotLength; i++) {
		var link = nodes.snapshotItem(i).nextSibling.nextSibling;
		var nomCompoTotal = link.firstChild.nodeValue.replace(/\240/g, ' ');
		var nomCompo = nomCompoTotal.substring(0,nomCompoTotal.indexOf(" d'un"));
		nomCompoTotal = nomCompoTotal.substring(nomCompoTotal.indexOf("d'un"),nomCompoTotal.length);
		nomCompoTotal = nomCompoTotal.substring(nomCompoTotal.indexOf(' ')+1,nomCompoTotal.length);
		var nomMonstre = nomCompoTotal.substring(0,nomCompoTotal.indexOf(" de Qualit�"));
		var qualite = nomCompoTotal.substring(nomCompoTotal.indexOf("de Qualit�")+11,nomCompoTotal.indexOf(' ['));
		var localisation = nomCompoTotal.substring(nomCompoTotal.indexOf('[')+1,nomCompoTotal.indexOf(']'));
		if(isEM(nomMonstre).length>0)
		{
			var infos = composantEM(nomMonstre, nomCompo, localisation,getQualite(qualite));
			if(infos.length>0)
			{
				var shortDescr = 'Variable';
				var bold = 0;
				if(infos != 'Composant variable')
				{
					shortDescr = infos.substring(0,infos.indexOf(' '));
					if(parseInt(shortDescr)>=0)
						bold=1;
				}
				if(link.parentNode == link.nextSibling.parentNode)
				{
					var tmp = link.nextSibling;
					link.parentNode.insertBefore(createImage(urlImg,infos), link.nextSibling);
					insertText(tmp,' ['+shortDescr+']',bold);
				}
				else
				{
					link.parentNode.appendChild(createImage(urlImg,infos));
					appendText(link.parentNode,' ['+shortDescr+']',bold);
				}
			}
		}
	}

}

function getQualite(qualite)
{
	for (var i=0; i<tabQualite.length; i++)
	{
		if(tabQualite[i].toLowerCase()==qualite.toLowerCase())
			return i;
	}
	return -1;
}

function isEM(nom) {
	var monstreEM = '';
	for(j in tabEM) {
		monstre = tabEM[j][0].toLowerCase();
		if ((nom+' ').toLowerCase().indexOf(monstre+' ')>=0){		
			monstreEM=monstre;
			break; // �a permet d'arreter de chercher dans le tableau des EM -> on gagne du temps
		}
	}
	return trim(monstreEM);
}

function getEM(nom) {
	var monstreEM = '';
	if(nom.indexOf('[') != -1)
		nom = nom.substring(0,nom.indexOf('['));
	for(j in tabEM) {
		monstre = tabEM[j][0].toLowerCase();
		if (nom.toLowerCase().indexOf(monstre+' ')==0 || nom.toLowerCase().indexOf(' '+monstre+' ')>=0){		
			monstreEM=monstre;
			break; // �a permet d'arreter de chercher dans le tableau des EM -> on gagne du temps
		}
	}
	return trim(monstreEM);
}

function compoEM(Monstre) {
     var compo='';
	for (var i=0; i<tabEM.length; i++) {
	 	if (tabEM[i][0].toLowerCase()==Monstre.toLowerCase()) {
	 	    if (tabEM[i][4]==1)
			    compo='Divers composants '+tabEM[i][1]+' '+tabEM[i][0]+' ('+tabEM[i][2]+')';
  		    else
			    compo=tabEM[i][1]+' '+tabEM[i][0]+" (Qualit� "+tabQualite[tabEM[i][3]]+") pour l'�criture de "+tabEM[i][2];
		}
	}
	return compo;     
}

function composantEM(Monstre, composant, localisation,qualite) {
     var compo='';
	for (var i=0; i<tabEM.length; i++) {
	 	if (tabEM[i][0].toLowerCase()==Monstre.toLowerCase()) {
			if(tabEM[i][4]==0)
			{
				var pourcentage=0;
				if(tabEM[i][1].substring(0,tabEM[i][1].indexOf(" d'un")).toLowerCase()!=composant.toLowerCase())
					pourcentage -= 20;
				pourcentage -= 5 * (tabEM[i][3]-qualite);
				if(localisation.toLowerCase()!=tabEM[i][5].toLowerCase())
					pourcentage -= 5;
				if(pourcentage>=-20)
				{
					if(compo.length>0)
						compo+=' | ';
					compo+=pourcentage+"% pour l'�criture de "+tabEM[i][2];
				}
			}
			else
			{
				if(compo.length>0)
					compo+=' | ';
				compo+='Composant variable';
			}
		}
	}
	return compo;     
}

tabQualite = ["Tr�s Mauvaise","Mauvaise","Moyenne","Bonne","Tr�s Bonne"];

tabEM=[ //Monstre, Compo, Sort EM, TypeEM
["Basilisk","�il d'un ","Analyse Anatomique",2,0,"T�te"],
["Ankheg","Carapace d'un","Armure Eth�r�e",2,0,"Sp�cial"],
["Rocketeux","Tripes d'un","Armure Eth�r�e",3,0,"Corps"],

["Loup-Garou","Bras d'un","Augmentation de l'Attaque",2,0,"Membre"],
["Titan","Griffe d'un","Augmentation de l'Attaque",3,0,"Membre"],

["Erinyes","Plume d'une","Augmentation de l'Esquive",2,0,"Membre"],
["Palefroi Infernal","Sabot d'un","Augmentation de l'Esquive",3,0,"Membre"],

["Manticore","Patte d'une","Augmentation des D�g�ts",2,0,"Membre"],
["Trancheur","Griffe d'un","Augmentation des D�g�ts",3,0,"Membre"],

["Banshee","Peau d'une","Bulle Anti-Magie",2,0,"Corps"],

["Essaim Sanguinaire","Pattes d'un","Bulle Magique",2,0,"Membre"],
["Sagouin","Patte d'un","Bulle Magique",3,0,"Membre"],
["Effrit","Cervelle d'un","Bulle Magique",4,0,"T�te"],

["Diablotin","C�ur d'un","Explosion",2,0,"Corps"],
["Chim�re","Sang d'une","Explosion",3,0,"Corps"],
["Barghest","Bave d'un","Explosion",4,0,"Sp�cial"],

["N�crophage","T�te d'un","Faiblesse Passag�re",2,0,"T�te"],
["Vampire","Canine d'un","Faiblesse Passag�re",3,0,"Sp�cial"],

["Gorgone","Chevelure d'une","Flash Aveuglant",2,0,"T�te"],
["G�ant des Gouffres","Cervelle d'un","Flash Aveuglant",3,0,"T�te"],

["Limace G�ante","Mucus d'une","Glue",2,0,"Sp�cial"],
["Grylle","Gueule d'un","Glue",3,0,"T�te"],

["Abishaii Noir","Serre d'un","Griffe du Sorcier",2,0,"Membre"],
["Vouivre","Venin d'une","Griffe du Sorcier",3,0,"Sp�cial"],
["Araign�e G�ante","Mandibule d'une","Griffe du Sorcier",4,0,"Sp�cial"],

["Nuage d'Insectes","Chitine d'un","Invisibilit�",2,0,"Sp�cial"],
["Yuan-ti","Cervelle d'un","Invisibilit�",3,0,"T�te"],
["Gritche","Epine d'un","Invisibilit�",4,0,"Sp�cial"],

["Y�ti","Jambe d'un","Projection",2,0,"Membre"],
["Djinn","T�te d'un","Projection",3,0,"T�te"],

["Sorci�re","Verrue d'une","Sacrifice",2,0,"Sp�cial"],

["Plante Carnivore","Racine d'une","T�l�kin�sie",2,0,"Sp�cial"],
["Tertre Errant","Cervelle d'un","T�l�kin�sie",3,0,"T�te"],

["Boggart","Main d'un","T�l�portation",2,0,"Membre"],
["Succube","T�ton Aguicheur d'une","T�l�portation",3,0,"Corps"],
["N�crochore","Os d'un","T�l�portation",4,0,"Corps"],

["Abishaii Vert","�il d'un","Vision Accrue",2,0,"T�te"],

["Fungus G�ant","Spore d'un","Vision Lointaine",2,0,"Sp�cial"],
["Abishaii Rouge","Aile d'un","Vision Lointaine",3,0,"Membre"],

["Zombie","Cervelle Putr�fi�e d'un","Voir le Cach�",2,0,"T�te"],
["Shai","Tripes d'un","Voir le Cach�",3,0,"Corps"],
["Phoenix","�il d'un","Voir le Cach�",4,0,"T�te"],

["Naga","Ecaille d'un","Vue Troubl�e",2,0,"Corps"],
["Marilith","Ecaille d'une","Vue Troubl�e",3,0,"Membre"],


["Rat","d'un","Composant variable",-1,1],
["Rat G�ant","d'un","Composant variable",-1,1],
["Dindon","d'un","Composant variable",-1,1],
["Goblin","d'un","Composant variable",-1,1],
["Limace","d'une","Composant variable",-1,1],
["Limace G�ante","d'une","Composant variable",-1,1],
["Ver","d'un","Composant variable",-1,1],
["Ver Carnivore","d'un","Composant variable",-1,1],
["Ver Carnivore G�ant","d'un","Composant variable",-1,1],
["Fungus","d'un","Composant variable",-1,1],
["Vouivre","d'une","Composant variable",-1,1],
["Gnu","d'un","Composant variable",-1,1],
["Scarab�e","d'un","Composant variable",-1,1]

];

var moisChampi = new Array();
moisChampi["Pr�scientus Reguis"] = "du Phoenix";
moisChampi["Amanite Trollo�de"] = "de la Mouche";
moisChampi["Girolle Sanglante"] = "du Dindon";
moisChampi["Horreur Des Pr�s"] = "du Gobelin";
moisChampi["Bolet P�teur"] = "du D�mon";
moisChampi["Pied Jaune"] = "de la Limace";
moisChampi["Agaric Sous-Terrain"] = "du Rat";
moisChampi["Suinte Cadavre"] = "de l'Hydre";
moisChampi["C�pe Lumineux"] = "du Ver";
moisChampi["Fungus Rampant"] = "du Fungus";
moisChampi["Nez Noir"] = "de la Vouivre";
moisChampi["Pleurote Pleureuse"] = "du Gnu";
moisChampi["Phytomassus Xil�nique"] = "du Scarab�e";


/***********************************************
Analyse PX
***********************************************/

function getPXNiv(niv) {
	return Math.max(0, 11 + 3 * niv - 2 * nivTroll);
}

function getPXTueNiv(niv) {
	return Math.max(0, 11 + 3 * nivTroll - 2 * niv);
}

function analysePX(niv) {
	niv = niv + "";
	var i = niv.indexOf("+");
	if (i != -1)
		return " --> \u2265 <b>" + getPXNiv(niv.slice(0, i)) + "</b> PX";
	i = niv.slice(1).indexOf("-");
	if (i != -1) {
		var max = getPXNiv(niv.slice(i + 2));
		return max == 0 ? " --> <b>0</b> PX" : " --> <b>" + getPXNiv(niv.slice(0, i + 1)) +
				"</b> \u2264 PX \u2264 <b>" + max + "</b>";
	}
	i = niv.indexOf("=");
	if (i != -1) {
		var max = getPXNiv(niv.slice(i + 1));
		return max == 0 ? " --> <b>0</b> PX" : " --> \u2264 <b>" + max + "</b>";
	}
	return " --> <b>" + getPXNiv(niv) + "</b> PX";
}

function analysePXTroll(niv)
{
	var str = analysePX(niv);
	str += "<br/>Vous lui rapportez <b>"+getPXTueNiv(niv)+"</b> PX.";
	return str;
}

/***********************************************
Les % de toucher
***********************************************/

var c = new Array();

function cnp(n,k)
{
	if(c[n] != null && c[n][k] != null)
		return c[n][k];
	if(c[n] == null)
		c[n] = new Array();
	if(k==0)
	{
		c[n][k] = 1;
		return 1;
	}
	var result = cnp(n-1,k-1)*n/k;
	c[n][k] = result;
	return result;
}

var coeff = new Array();

function coef(n,p)
{
	if(n==0 && p==0)
		return 1;
	if(p>n*3.5)
		p = 7*n-p
	if(coeff[n] != null && coeff[n][p] !=null)
		return coeff[n][p];
	if(coeff[n] == null)
		coeff[n] = new Array();
	var kmax = Math.floor((p-n)/6);
	var x=0;
	for(var k=0;k<=kmax;k++)
	{
		x+=(1-2*(k%2)) * cnp(n,k) * cnp(p-6*k-1,n-1);
	}
	coeff[n][p] = x;
	return x;
}

function chanceEsquiveParfaite(a,d,ba,bd)
{
	var win = 0;
	var los = 0;
	if(ba==null)
		ba=0;
	if(bd==null)
		bd=0;
/*	if(6*a+ba<2*(d+bd))
		return 100;
	if(a+ba>2*(6*d+bd))
		return 0;*/
	for(var ds=d;ds<=6*d;ds++)
	{
		var cd = coef(d,ds);
		for(var as=a;as<=6*a;as++)
		{
			if(2*Math.max(as+ba,0) < Math.max(ds+bd,0))
				win += cd * coef(a,as);
			else
				los += cd * coef(a,as);
		}
	}
	return Math.round(100*win/(win+los));
}

function chanceTouche(a,d,ba,bd)
{
	var win = 0;
	var los = 0;
	if(ba==null)
		ba=0;
	if(bd==null)
		bd=0;
	if(a+ba>6*d+bd)
		return 100;
	if(6*a+ba<d+bd)
		return 0;
	for(var ds=d;ds<=6*d;ds++)
	{
		var cd = coef(d,ds);
		for(var as=a;as<=6*a;as++)
		{
			if(Math.max(as+ba,0) > Math.max(ds+bd,0))
				win += cd * coef(a,as);
			else
				los += cd * coef(a,as);
		}
	}
	return Math.round(100*win/(win+los));
}

function chanceCritique(a,d,ba,bd)
{
	var win = 0;
	var los = 0;
	if(ba==null)
		ba=0;
	if(bd==null)
		bd=0;
	if(a+ba>2*(6*d+bd))
		return 100;
	if(6*a+ba<2*(d+bd))
		return 0;
	for(var ds=d;ds<=6*d;ds++)
	{
		var cd = coef(d,ds);
		for(var as=a;as<=6*a;as++)
		{
			if(Math.max(as+ba,0) > 2*Math.max(ds+bd,0))
				win += cd * coef(a,as);
			else
				los += cd * coef(a,as);
		}
	}
	return Math.round(100*win/(win+los));
}

/***********************************************
Analyse tactique
***********************************************/

function getTexteAnalyse(modificateur,chiffre)
{
	if(chiffre==0)
		return chiffre;
	return modificateur+chiffre;
} 

function getAnalyseTactique(id,nom)
{
	var donneesMonstre = listeCDM[id];
	var needAutres=false;
	var i;
	if(donneesMonstre == null)
		return;
	var array = analyseTactique(donneesMonstre,nom);
	if(array==null)
		return "";
	var str = "<table class='mh_tdborder' border='0' cellspacing='1' cellpadding='4'><tr class='mh_tdtitre'><td>Attaque</td><td>Esq. Parfaite</td><td>Touch�</td><td>Critique</td><td>D�g�ts</td></tr>";
	for(i=0;i<array.length;i++)
	{
		if(array[i][1]==100 && i>0)
		{
			needAutres=true;
			break;
		}
		if(i==1 && array[i][4]>0)
			str+= "<tr class=mh_tdpage><td><b>"+array[i][0]+"</b></td><td><b>"+getTexteAnalyse(array[i][5],array[i][1])+"%</b></td><td><b>"+getTexteAnalyse(array[i][5],array[i][2])+"%</b></td><td><b>"+getTexteAnalyse(array[i][5],array[i][3])+"%</b></td><td><b>"+getTexteAnalyse(array[i][6],array[i][4])+"</b></td></tr>";
		else if(i==0)
			str+= "<tr class=mh_tdpage><td><i>"+array[i][0]+"</i></td><td><i>"+getTexteAnalyse(array[i][5],array[i][1])+"%</i></td><td><i>"+getTexteAnalyse(array[i][5],array[i][2])+"%</i></td><td><i>"+getTexteAnalyse(array[i][5],array[i][3])+"%<i></td><td><b><i>"+getTexteAnalyse(array[i][6],array[i][4])+"<i></b></td></tr>";
		else
			str+= "<tr class=mh_tdpage><td>"+array[i][0]+"</td><td>"+getTexteAnalyse(array[i][5],array[i][1])+"%</td><td>"+getTexteAnalyse(array[i][5],array[i][2])+"%</td><td>"+getTexteAnalyse(array[i][5],array[i][3])+"%</td><td><b>"+getTexteAnalyse(array[i][6],array[i][4])+"</b></td></tr>";
	}
	if(needAutres)
	{
		if(i==array.length-1)
			str+= "<tr class=mh_tdpage><td>"+array[i][0]+"</td><td>"+getTexteAnalyse(array[i][5],array[i][1])+"%</td><td>"+getTexteAnalyse(array[i][5],array[i][2])+"%</td><td>"+getTexteAnalyse(array[i][5],array[i][3])+"%</td><td><b>"+getTexteAnalyse(array[i][6],array[i][4])+"</b></td></tr>";
		else if(i==1)
			str+= "<tr class=mh_tdpage><td><b>Toutes attaques</b></td><td>100%</td><td>0%</td><td>0%</td><td>0</td></tr>";
		else
			str+= "<tr class=mh_tdpage><td>Autres attaques</td><td>100%</td><td>0%</td><td>0%</td><td>0</td></tr>";
	}
	return str+"</table>";
}

function analyseTactique(donneesMonstre,nom)
{
	try
	{
	var listeAttaques=new Array();
	var att = MZ_getValue(numTroll+".caracs.attaque");
	var attbmp = MZ_getValue(numTroll+".caracs.attaque.bmp");;
	var attbmm = MZ_getValue(numTroll+".caracs.attaque.bmm");;
	var mm = MZ_getValue(numTroll+".caracs.mm");
	var deg = MZ_getValue(numTroll+".caracs.degats");
	var degbmp = MZ_getValue(numTroll+".caracs.degats.bmp");
	var degbmm = MZ_getValue(numTroll+".caracs.degats.bmm");
	var vue = MZ_getValue(numTroll+".caracs.vue");
	var pv = MZ_getValue(numTroll+".caracs.pv");
	var esq = Math.max(MZ_getValue(numTroll+".caracs.esquive")-MZ_getValue(numTroll+".caracs.esquive.nbattaques"),0);
	var esqbonus = MZ_getValue(numTroll+".caracs.esquive.bm");
	var arm = MZ_getValue(numTroll+".caracs.armure");
	var armbmp = MZ_getValue(numTroll+".caracs.armure.bmp");
	var armbmm = MZ_getValue(numTroll+".caracs.armure.bmm");
	var modificateurEsquive = '';
	var modificateurArmure = '';
	var modificateurMagie = '';
	var modificateurEsquiveM = '';
	var modificateurArmureM = '';
	var pasDeSR=false;
	var esqM, attM, armM, degM;
	if(donneesMonstre==null || att==null || attbmp==null || attbmm==null || mm==null || deg==null || degbmp==null || degbmm==null || vue==null ||pv==null || esq==null || arm==null)
		return null;
	var td = document.createElement('TD')
	td.innerHTML = bbcode(donneesMonstre[4]);
	var esqM = 0;
	try
	{
		esqM=Math.ceil(td.getElementsByTagName('b')[0].firstChild.nodeValue);
	} 
	catch(e)
	{
		esqM=Math.ceil(parseInt(td.firstChild.nodeValue));
		modificateurEsquive = '<';
		modificateurArmure = '<';
		modificateurMagie = '<';
	}
	td.innerHTML = bbcode(donneesMonstre[3]);
	var attM = 0;
	try
	{
		attM=Math.ceil(td.getElementsByTagName('b')[0].firstChild.nodeValue);
	} 
	catch(e)
	{
		attM=Math.ceil(parseInt(td.firstChild.nodeValue));
		modificateurEsquiveM = '>';
		modificateurArmureM = '>';
	}
	td.innerHTML = bbcode(donneesMonstre[5]);
	var degM = 0;
	try
	{
		degM=Math.ceil(td.getElementsByTagName('b')[0].firstChild.nodeValue);
	} 
	catch(e)
	{
		degM=Math.ceil(parseInt(td.firstChild.nodeValue));
		modificateurArmureM = '>';
	}
	td.innerHTML = bbcode(donneesMonstre[7]);
	var armM = 0;
	try
	{
		armM=Math.ceil(td.getElementsByTagName('b')[0].firstChild.nodeValue);
	} 
	catch(e)
	{
		armM=Math.ceil(parseInt(td.firstChild.nodeValue));
		modificateurArmure = '<';
	}
	var coeffSeuil = 0.95;
	try
	{
		td.innerHTML = bbcode(donneesMonstre[9]);
		var rm = parseInt(td.getElementsByTagName('b')[0].firstChild.nodeValue);
		var v = (rm / mm);
		var seuil = (rm < mm ? Math.max(10, Math.floor(v*50)) : Math.min(90, Math.floor(100 - 50/v)));
		coeffSeuil = (200-seuil)/200;
	}
	catch(e) 
	{
		modificateurMagie = '<';
		pasDeSR = true;
	}
	var chanceDEsquiveParfaite = chanceEsquiveParfaite(att,esqM,attbmp+attbmm,0);
	var chanceDeTouche = chanceTouche(att,esqM,attbmp+attbmm,0);
	var chanceDeCritique = chanceCritique(att,esqM,attbmp+attbmm,0);
	var degats = (((chanceDeTouche-chanceDeCritique)*Math.max(deg*2+degbmp+degbmm-armM,1)+chanceDeCritique*Math.max(Math.floor(deg*1.5)*2+degbmp+degbmm-armM,1))/100);
	//str += "Attaque normale : Touch� "+chanceDeTouche+"% Critique "+chanceDeCritique+"% D�g�ts "+(((chanceDeTouche-chanceDeCritique)*Math.max(deg*2+degbmp+degbmm-arm,1)+chanceDeCritique*Math.max(Math.floor(deg*1.5)*2+degbmp+degbmm-arm,1))/100);	
	listeAttaques.push(new Array("Attaque normale",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,modificateurEsquive,modificateurArmure));
	if(getSortComp("Vampirisme")>0)
	{
		var pour = getSortComp("Vampirisme");
		chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(Math.floor(deg*2/3),esqM,attbmm,0)*pour/100);
		chanceDeTouche = Math.round(chanceTouche(Math.floor(deg*2/3),esqM,attbmm,0)*pour/100);
		chanceDeCritique = Math.round(chanceCritique(Math.floor(deg*2/3),esqM,attbmm,0)*pour/100);
		degats = Math.round(coeffSeuil*((chanceDeTouche-chanceDeCritique)*Math.max(deg*2+degbmm,1)+chanceDeCritique*Math.max(Math.floor(deg*1.5)*2+degbmm,1)))/100;
		//str += "\nVampirisme : Touch� "+chanceDeTouche+"% Critique "+chanceDeCritique+"% D�g�ts "+(degats);
		listeAttaques.push(new Array("Vampirisme",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,modificateurEsquive,modificateurMagie));
	}
	if(getSortComp("Botte Secr�te")>0)
	{
		var pour = getSortComp("Botte Secr�te");
		chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(Math.floor(att/2),esqM,Math.floor((attbmp+attbmm)/2),0)*pour/100);
		chanceDeTouche = Math.round(chanceTouche(Math.floor(att/2),esqM,Math.floor((attbmp+attbmm)/2),0)*pour/100);
		chanceDeCritique = Math.round(chanceCritique(Math.floor(att/2),esqM,Math.floor((attbmp+attbmm)/2),0)*pour/100);
		degats = Math.round(((chanceDeTouche-chanceDeCritique)*Math.max(Math.floor(deg/2)*2+Math.floor((degbmp+degbmm)/2)-Math.floor(armM/2),1)+chanceDeCritique*Math.max(Math.floor(deg*1.5/2)*2+Math.floor((degbmp+degbmm)/2)-Math.floor(armM/2),1)))/100;
		//str += "\nBotte Secr�te : Touch� "+chanceDeTouche+"% Critique "+chanceDeCritique+"% D�g�ts "+(degats);
		listeAttaques.push(new Array("Botte Secr�te",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,modificateurEsquive,modificateurArmure));
	}
	if(getSortComp("Rafale Psychique")>0)
	{
		var pour = getSortComp("Rafale Psychique");
		chanceDEsquiveParfaite = 0;
		chanceDeTouche = Math.round(100*pour/100);
		chanceDeCritique = Math.round(0*pour/100);
		degats = Math.round(coeffSeuil*((chanceDeTouche-chanceDeCritique)*Math.max(deg*2+degbmm,1)+chanceDeCritique*Math.max(Math.floor(deg*1.5)*2+degbmm,1)))/100;
		//str += "\nRafale Psychique : Touch� "+chanceDeTouche+"% Critique "+chanceDeCritique+"% D�g�ts "+(degats);
		listeAttaques.push(new Array("Rafale Psychique",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,'',pasDeSR?modificateurMagie:''));
	}
	if(getSortComp("Explosion")>0)
	{
		var pour = getSortComp("Explosion");
		chanceDEsquiveParfaite = 0;
		chanceDeTouche = Math.round(100*pour/100);
		chanceDeCritique = Math.round(0*pour/100);
		degats = Math.round(coeffSeuil*((chanceDeTouche-chanceDeCritique)*Math.max(Math.floor(1+deg/2+pv/20)*2+degbmm,1)+chanceDeCritique*Math.max(Math.floor(Math.floor(1+deg/2+pv/20)*1.5)*2+degbmm,1)))/100;
		//str += "\nRafale Psychique : Touch� "+chanceDeTouche+"% Critique "+chanceDeCritique+"% D�g�ts "+(degats);
		listeAttaques.push(new Array("Explosion",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,'',pasDeSR?modificateurMagie:''));
	}
	if(getSortComp("Projectile Magique")>0)
	{
		var pour = getSortComp("Projectile Magique");
		chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(vue,esqM,attbmm,0)*pour/100);
		chanceDeTouche = Math.round(chanceTouche(vue,esqM,attbmm,0)*pour/100);
		chanceDeCritique = Math.round(chanceCritique(vue,esqM,attbmm,0)*pour/100);
		degats = Math.round(coeffSeuil*((chanceDeTouche-chanceDeCritique)*Math.max(Math.floor(vue/2)*2+degbmm,1)+chanceDeCritique*Math.max(Math.floor(Math.floor(vue/2)*1.5)*2+degbmm,1)))/100;
		//str += "\nProjectile Magique : Touch� "+chanceDeTouche+"% Critique "+chanceDeCritique+"% D�g�ts "+(degats);
		listeAttaques.push(new Array("Projectile Magique",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,modificateurEsquive,modificateurMagie));
	}
	if(getSortComp("Fr�n�sie")>0)
	{
		var pour = getSortComp("Fr�n�sie");
		chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(att,esqM,attbmm+attbmp,0)*pour/100);
		chanceDeTouche = Math.round(chanceTouche(att,esqM,attbmm+attbmp,0)*pour/100);
		chanceDeCritique = Math.round(chanceCritique(att,esqM,attbmm+attbmp,0)*pour/100);
		degats = Math.round(((chanceDeTouche-chanceDeCritique)*2*Math.max((deg*2+degbmp+degbmm-armM),1)+chanceDeCritique*2*Math.max(Math.floor(deg*1.5)*2+degbmm+degbmp-armM,1)))/100;
		//str += "\nFr�n�sie : Touch� "+chanceDeTouche+"% Critique "+chanceDeCritique+"% D�g�ts "+(degats);
		listeAttaques.push(new Array("Fr�n�sie",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,modificateurEsquive,modificateurArmure));
	}
	if(getSortComp("Charger")>0)
	{
		var pour = getSortComp("Charger");
		chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(att,esqM,attbmm+attbmp,0)*pour/100);
		chanceDeTouche = Math.round(chanceTouche(att,esqM,attbmm+attbmp,0)*pour/100);
		chanceDeCritique = Math.round(chanceCritique(att,esqM,attbmm+attbmp,0)*pour/100);
		var degats = Math.round(((chanceDeTouche-chanceDeCritique)*Math.max((deg*2+degbmp+degbmm-armM),1)+chanceDeCritique*Math.max(Math.floor(deg*1.5)*2+degbmm+degbmp-armM,1)))/100;
		//str += "\nCharge : Touch� "+chanceDeTouche+"% Critique "+chanceDeCritique+"% D�g�ts "+(degats);
		listeAttaques.push(new Array("Charger",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,modificateurEsquive,modificateurArmure));
	}
	if(getSortComp("Griffe du Sorcier")>0)
	{
		var pour = getSortComp("Griffe du Sorcier");
		chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(att,esqM,attbmm,0)*pour/100);
		chanceDeTouche = Math.round(chanceTouche(att,esqM,attbmm,0)*pour/100);
		chanceDeCritique = Math.round(chanceCritique(att,esqM,attbmm,0)*pour/100);
		degats = Math.round(coeffSeuil*((chanceDeTouche-chanceDeCritique)*Math.max(Math.floor(deg/2)*2+degbmm,1)+chanceDeCritique*Math.max(Math.floor(Math.floor(deg/2)*1.5)*2+degbmm,1)))/100;
		//str += "\nGriffe du Sorcier : Touch� "+chanceDeTouche+"% Critique "+chanceDeCritique+"% D�g�ts "+(degats);
		listeAttaques.push(new Array("Griffe du Sorcier",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,modificateurEsquive,modificateurMagie));
	}
	if(getSortComp("Attaque Pr�cise")>0)
	{
		var niveau = 5;
		var oldPour = 0;
		var chanceDEsquiveParfaite = 0;
		var chanceDeTouche = 0;
		var chanceDeCritique = 0;
		degats = 0;
		while(niveau>0)
		{
			var pour = getSortComp("Attaque Pr�cise",niveau);
			if(pour>oldPour)
			{
				var chanceDEsquiveParfaiteNiveau = chanceEsquiveParfaite(Math.min(att+3*niveau,Math.floor(att*1.5)),esqM,attbmm+attbmp,0)*(pour-oldPour)/100;
				var chanceDeToucheNiveau = chanceTouche(Math.min(att+3*niveau,Math.floor(att*1.5)),esqM,attbmm+attbmp,0)*(pour-oldPour)/100;
				var chanceDeCritiqueNiveau = chanceCritique(Math.min(att+3*niveau,Math.floor(att*1.5)),esqM,attbmm+attbmp,0)*(pour-oldPour)/100;
				chanceDEsquiveParfaite += chanceDEsquiveParfaiteNiveau;
				chanceDeTouche += chanceDeToucheNiveau;
				chanceDeCritique += chanceDeCritiqueNiveau;
				degats += (((chanceDeToucheNiveau-chanceDeCritiqueNiveau)*Math.max((deg*2+degbmp+degbmm-armM),1)+chanceDeCritiqueNiveau*Math.max(Math.floor(deg*1.5)*2+degbmm+degbmp-armM,1))/100);
				oldPour = pour;
			}
			niveau--;
		}
		//str += "\nAttaque Pr�cise : Touch� "+(Math.round(chanceDeTouche*100)/100)+"% Critique "+(Math.round(chanceDeCritique*100)/100)+"% D�g�ts "+Math.round(degats*100)/100;
		listeAttaques.push(new Array("Attaque Pr�cise",chanceDEsquiveParfaite,Math.round(chanceDeTouche*100)/100,Math.round(chanceDeCritique*100)/100,Math.round(degats*100)/100,modificateurEsquive,modificateurArmure));
	}
	if(getSortComp("Coup de Butoir")>0)
	{
		var niveau = 5;
		var oldPour =0;
		var chanceDEsquiveParfaite = 0;
		var chanceDeTouche=0;
		var chanceDeCritique=0;
		degats=0;
		while(niveau>0)
		{
			var pour = getSortComp("Coup de Butoir",niveau);
			if(pour>oldPour)
			{
				var chanceDEsquiveParfaiteNiveau = chanceEsquiveParfaite(att,esqM,attbmm+attbmp,0)*(pour-oldPour)/100;
				var chanceDeToucheNiveau = chanceTouche(att,esqM,attbmm+attbmp,0)*(pour-oldPour)/100;
				var chanceDeCritiqueNiveau = chanceCritique(att,esqM,attbmm+attbmp,0)*(pour-oldPour)/100;
				chanceDEsquiveParfaite += chanceDEsquiveParfaiteNiveau;
				chanceDeTouche += chanceDeToucheNiveau;
				chanceDeCritique += chanceDeCritiqueNiveau;
				degats += (((chanceDeToucheNiveau-chanceDeCritiqueNiveau)*Math.max((Math.min(Math.floor(deg*1.5),deg+3*niveau)*2+degbmp+degbmm-armM),1)+chanceDeCritiqueNiveau*Math.max(Math.floor(Math.min(Math.floor(deg*1.5),deg+3*niveau)*1.5)*2+degbmm+degbmp-armM,1))/100);
				oldPour = pour;
			}
			niveau--;
		}
		//str += "\nCoup de Butoir : Touch� "+(Math.round(chanceDeTouche*100)/100)+"% Critique "+(Math.round(chanceDeCritique*100)/100)+"% D�g�ts "+Math.round(degats*100)/100;
		listeAttaques.push(new Array("Coup de Butoir",chanceDEsquiveParfaite,Math.round(chanceDeTouche*100)/100,Math.round(chanceDeCritique*100)/100,Math.round(degats*100)/100,modificateurEsquive,modificateurArmure));
	}
	listeAttaques.sort(function(a,b){var diff = parseInt(100*b[4])-parseInt(100*a[4]);if(diff==0) return parseInt(b[1])-parseInt(a[1]); return diff;});
	if(nom.toLowerCase().indexOf("m�gac�phale")==-1)
	{
		chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(attM,esq,0, esqbonus));
		chanceDeTouche = Math.round(chanceTouche(attM,esq,0, esqbonus));
		chanceDeCritique = Math.round(chanceCritique(attM,esq,0, esqbonus));
	}
	else
	{
		chanceDEsquiveParfaite = 0;
		chanceDeTouche = 100;
		chanceDeCritique = 0;
	}
	degats = Math.round(((chanceDeTouche-chanceDeCritique)*Math.max(Math.floor(degM)*2-arm,1)+chanceDeCritique*Math.max(Math.floor(Math.floor(degM)*1.5)*2-arm*2-armbmm-armbmp,1)))/100;

	listeAttaques.unshift(new Array("Monstre",Math.round(chanceDEsquiveParfaite*100)/100,Math.round(chanceDeTouche*100)/100,Math.round(chanceDeCritique*100)/100,Math.round(degats*100)/100,modificateurEsquive,modificateurArmure));
	return listeAttaques;
	}
	catch(e) { alert(e);}
}

/***********************************************
Les popups
***********************************************/

var tagPopup=null;

function initTagPopup() {
	if(tagPopup!=null)
		return;
	tagPopup = document.createElement('div');
	tagPopup.setAttribute('id', 'tagPopup');
	tagPopup.setAttribute('class', 'mh_textbox');
	tagPopup.setAttribute('style', 'position: absolute; border: 1px solid #000000; visibility: hidden;' +
			'display: inline; z-index: 3; max-width: 400px;');
	document.body.appendChild(tagPopup);
}

function showTagPopup(evt) {
	var texte = this.getAttribute("texteinfo");
	tagPopup.innerHTML = texte;
	tagPopup.style.left = evt.pageX + 15 + 'px';
	tagPopup.style.top = evt.pageY + 'px';
	tagPopup.style.visibility = "visible";
}

function hideTagPopup() {
	tagPopup.style.visibility = "hidden";
}

function createTagImage(url, text)
{
	var img = document.createElement('img');
	img.setAttribute('src',url);
	img.setAttribute('align','ABSMIDDLE');
	img.setAttribute("texteinfo",text);
	img.addEventListener("mouseover", showTagPopup,true);
	img.addEventListener("mouseout", hideTagPopup,true);
	return img;
}

/***********************************************
les tags de trolls
***********************************************/

var nbTagFile=0;
var nbTagFileAnalyzed=0;
var infoTagTrolls = new Array();
var infoTagGuildes = new Array();

function performTagComputation()
{
	var nbGuildes = document.evaluate("//a[contains(@href,'javascript:EAV') or contains(@href,'javascript:EnterAllianceView')]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
	var nbTrolls = document.evaluate("//a[contains(@href,'javascript:EPV') or contains(@href,'javascript:EnterPJView')]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
	if(nbTrolls>0 || nbGuildes>0)
	{
		initTagPopup();
		getTag(analyseTags,showTags);
	}
}

function getTag(fonctionAnalyse,fonctionAffiche)
{
	try
	{
		if(MZ_getValue("TAGSURL") == null || MZ_getValue("TAGSURL")=="")
			return false;
		var tagsurl = MZ_getValue("TAGSURL");
		var listeTagsURL = tagsurl.split("$");
		nbTagFile = listeTagsURL.length;
		for(var i=0;i<listeTagsURL.length;i++)
		{
			if(listeTagsURL[i].toLowerCase().indexOf("http")==0)
			{
				//appendNewScript(listeTagsURL[i]);
				MZ_xmlhttpRequest({
				    method: 'GET',
				    url: listeTagsURL[i],
				    headers: {
				        'User-agent': 'Mozilla/4.0 [FusionZoryaZilla] (compatible) Mountyzilla',
				        'Accept': 'application/xml,text/xml',
				    },
				    onload: function(responseDetails) {
						try
						{
							fonctionAnalyse(responseDetails.responseText);
						}
						catch(e)
						{
							alert(e);
						}
						nbTagFileAnalyzed++;
						if(nbTagFileAnalyzed==nbTagFile)
						{
							fonctionAffiche();
						}
					},
					onerror: function(responseDetails) {
						nbTagFileAnalyzed++;
						if(nbTagFileAnalyzed==nbTagFile)
							fonctionAffiche();
					},
				});
			}
			else
			{
				nbTagFileAnalyzed++;
				if(nbTagFileAnalyzed==nbTagFile)
					fonctionAffiche();
			}
		}
	}
	catch(e) {alert(e);}
}

function showTags()
{
	try
	{
		if(infoTagGuildes.length>0)
		{
			var nodes = document.evaluate("//a[contains(@href,'javascript:EAV') or contains(@href,'javascript:EnterAllianceView')]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			for(var i=0;i<nodes.snapshotLength;i++)
			{
				var node = nodes.snapshotItem(i);
				var link = node.getAttribute('href');
				var guildeID = parseInt(link.substring(link.indexOf('(')+1,link.indexOf(',')));
				var infos = infoTagGuildes[guildeID];
				if (infos) 
				{
					for(var j=0;j<infos.length;j++)
					{
						insertAfter(node,createTagImage(infos[j][0], infos[j][1]));
						insertAfter(node,document.createTextNode(" "));
					}
				}	
			}
		}
		if(infoTagTrolls.length>0)
		{
			var nodes = document.evaluate("//a[contains(@href,'javascript:EPV') or contains(@href,'javascript:EnterPJView')]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			for(var i=0;i<nodes.snapshotLength;i++)
			{
				var node = nodes.snapshotItem(i);
				var link = node.getAttribute('href').replace(/'/g,"");
				var trollID = parseInt(link.substring(link.indexOf('(')+1,link.indexOf(')')));
				var infos = infoTagTrolls[trollID];
				if (infos) 
				{
					for(var j=0;j<infos.length;j++)
					{
						insertAfter(node,createTagImage(infos[j][0], infos[j][1]));
						insertAfter(node,document.createTextNode(" "));
					}
				}	
			}
		}
	}
	catch(e) {alert(e);}
}

function analyseTags(data)
{
	var icones = new Array();
	var descriptions = new Array();
	
	var lignes = data.split("\n");
	for(var i=0;i<lignes.length;i++)
	{
		try
		{
			var data = lignes[i].split(";");
			if(data.length<=1)
				continue;
			if(data[0]=="I")
			{
				icones.push(lignes[i].substring(lignes[i].indexOf(";")+1));
			}
			else if(data[0]=="D")
			{
				descriptions.push(bbcode(lignes[i].substring(lignes[i].indexOf(";")+1)));
			}
			else if(data[0]=="T")
			{
				if(data.length<=2)
				continue;
				var id = data[1]*1;
				var icone = icones[data[2]*1];
				var texte = "";
				for(var j=3;j<data.length;j++)
					texte+=descriptions[data[j]*1];
				var info = new Array(icone,texte);
				if(infoTagTrolls[id] == null)
					infoTagTrolls[id] = new Array();
				infoTagTrolls[id].push(info);
			}
			else if(data[0]=="G")
			{
				if(data.length<=2)
					continue;
				var id = data[1]*1;
				var icone = icones[data[2]*1];
				var texte = "";
				for(var j=3;j<data.length;j++)
					texte+=descriptions[data[j]*1];
				var info = new Array(icone,texte);
				if(infoTagGuildes[id] == null)
					infoTagGuildes[id] = new Array();
				infoTagGuildes[id].push(info);
			}
		}
		catch(e)
		{
			alert(e);
			break;
		}
	}
}

function isZZPage(url) { return currentURL.indexOf(ZZDB + url) == 0; } if(!isPage("MH_Play/Play_vue.php") && !isPage("MH_Play/Play_menu.php") && !isZZPage("/Play_vue.php"))
	performTagComputation();
