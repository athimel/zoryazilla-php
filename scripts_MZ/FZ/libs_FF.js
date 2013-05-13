/*********************************************************************************
*    This file is part of ZoryaZilla Fusion merged with mountyzilla              *
*********************************************************************************/
//============================ ZZ PRE CODE =======================================
// dans la nouvelle version de MZ (dabihul), cette varaible n'est plus définie
var poissotron = "http://minitilk.fur4x-hebergement.net/getDice2.php";

// préférence de l'utilisateur (mettre par défaut si pas définie)
if (typeof ZTRO=="undefined")   var ZTRO=0; 
if (typeof ZMON=="undefined")   var ZMON=5;  
if (typeof ZTRE=="undefined")   var ZTRE=5; 
if (typeof ZLIE=="undefined")   var ZLIE=15; 
if (typeof SkinZZ=="undefined") var SkinZZ=ZZDB+"/skin/";
if (typeof ShrVUE=="undefined") var ShrVUE=true;

var typeFamilly = new Array();    // Indice des familles de monstre (pour tabMonstres)
typeFamilly = ["Animal", "Démon", "Humanoide", "Insecte", "Monstre","Mort-Vivant"];

var tmpltFamilly = new Array();    // préfix et suffix
tmpltFamilly["Animal"]=["Attentionné","Attentionnée","Cogneur","Cogneuse","Coriace","Corrompu","Corrompue","Enragé","Enragée","Fouisseur","Fouisseuse","Gardien","Gardienne","Gigantesque","Gros","Grosse","Homochrome","Malade","Petit","Petite","Ronfleur","Ronfleuse","Vorace"];
tmpltFamilly["Démon"]=["Archiatre","Cogneur","Cogneuse","Coriace","Corrompu","Corrompue","de Premier Cercle","de Second Cercle","de Troisième Cercle","de Quatrième Cercle","de Cinquième Cercle","des Abysses","Ethéré","Ethérée","Fanatique","Gardien","Gardienne","Gros","Grosse","Invocateur","Invocatrice","Malade","Petit","Petite","Prince","Princesse","Ronfleur","Ronfleuse"];
tmpltFamilly["Humanoide"]=["Alchimiste","Agressif","Agressive","Barbare","Berserker","Cogneur","Cogneuse","Coriace","Corrompu","Corrompue","Champion","Championne","Effrayé","Effrayée","Fanatique","Fou","Folle","Frondeur","Frondeuse","Gardien","Gardienne","Grand Frondeur","Grande Frondeuse","Gros","Grosse","Guérisseur","Guérisseuse","Guerrier","Guerrière","Héros","Malade","Mutant","Mutante","Paysan","Paysanne","Petit","Petite","Planqué","Planquée","Ronfleur","Ronfleuse","Scout","Shaman","Sorcier","Sorcière","Voleur","Voleuse"];
tmpltFamilly["Insecte"]=["Alpha","Cogneur","Cogneuse","Coriace","Corrompu","Corrompue","Fouisseur","Fouisseuse","Gardien","Gardienne","Gigantesque","Gros","Grosse","Homochrome","Lobotomisateur","Lobotomisatrice","Malade","Morticole","Ouvrier","Ouvrière","Petit","Petite","Reine","Ronfleur","Ronfleuse","Soldat","Strident","Stridente"];
tmpltFamilly["Monstre"]=["Cogneur","Cogneuse","Colossal","Colossale","Coriace","Corrompu","Corrompue","Cracheur","Cracheuse","Esculape","Fouisseur","Fouisseuse","Frénétique","Fustigateur","Fustigatrice","Gardien","Gardienne","Gargantuesque","Gigantesque","Gros","Grosse","Homomorphe","Malade","Petit","Petite","Ronfleur","Ronfleuse","Traqueur","Traqueuse"];
tmpltFamilly["Mort-Vivant"]=["Archaïque","Cogneur","Cogneuse","Coriace","Corrompu","Corrompue","Gardien","Gardienne","Gros","Grosse","Implacable","Maître","Maîtresse","Malade","Médicastre","Mentat","Nécromant","Nécromante","Petit","Petite","Psychophage","Ronfleur","Ronfleuse","Spectral","Spectrale"];

var caracFamilly = new Array();    // caracs fonctions des préfix/suffix
caracFamilly["Animal"]=[[2,"Soigne les Monstres et a une attaque de moins en cas d'attaques multiples"],[2,"Soigne les Monstres et a une attaque de moins en cas d'attaques multiples"],[2,"Pouvoir habituel remplacé par Amnésie : perte temporaire de x%"],[2,"Pouvoir habituel remplacé par Amnésie : perte temporaire de x%"],[1,""],[1,""],[1,""],[3,"A un plus grand nombre d'attaques"],[3,"A un plus grand nombre d'attaques"],[0,"Enfouit les Trésors"],[0,"Enfouit les Trésors"],[20,""],[20,""],[1,""],[0,""],[0,""],[0,"Se Camoufle et attaque à distance"],[-1,"Pouvoir habituel remplacé par Maladie"],[-1,""],[-1,""],[2,"Augmente la Fatigue"],[2,"Augmente la Fatigue"],[1,""]];
caracFamilly["Démon"]=[[2,"Soigne les Monstres et a une attaque de moins en cas d'attaques multiples"],[2,"Pouvoir habituel remplacé par Amnésie : perte temporaire de x%"],[2,"Pouvoir habituel remplacé par Amnésie : perte temporaire de x%"],[1,""],[1,""],[1,""],[-1,""],[0,""],[2,""],[4,""],[5,""],[3,""],[0,"Se Camoufle et attaque à distance"],[0,"Se Camoufle et attaque à distance"],[2,"Ne fuit pas et a un plus grand nombre d'attaques"],[20,""],[20,""],[0,""],[0,""],[3,"Fait apparaître des Monstres"],[3,"Fait apparaître des Monstres"],[-1,"Pouvoir habituel remplacé par Maladie"],[-1,""],[-1,""],[8,"Insensible au Hurlement Effrayant et a une durée de Tour réduite"],[8,"Insensible au Hurlement Effrayant et a une durée de Tour réduite"],[2,"Augmente la Fatigue"],[2,"Augmente la Fatigue"]];
caracFamilly["Humanoide"]=[[0,"Ramasse, Transmute et Lance des Potions"],[1,""],[1,""],[1,""],[2,"A un plus grand nombre d'attaques"],[2,"Pouvoir habituel remplacé par Amnésie : perte temporaire de x%"],[2,"Pouvoir habituel remplacé par Amnésie : perte temporaire de x%"],[1,""],[1,""],[1,""],[4,""],[4,""],[-1,"Fuit rapidement le combat"],[-1,"Fuit rapidement le combat"],[2,"Ne fuit pas et a un plus grand nombre d'attaques"],[1,""],[1,""],[2,"Attaque à distance"],[2,"Attaque à distance"],[20,""],[20,""],[4,"Attaque à distance"],[4,"Attaque à distance"],[0,""],[0,""],[2,"Soigne les Monstres et a une attaque de moins en cas d'attaques multiples"],[2,"Soigne les Monstres et a une attaque de moins en cas d'attaques multiples"],[1,""],[1,""],[5,"A une durée de Tour réduite"],[-1,"Pouvoir habituel remplacé par Maladie"],[2,""],[2,""],[-1,""],[-1,""],[-1,""],[-1,""],[0,"Se Camoufle et attaque à distance"],[0,"Se Camoufle et attaque à distance"],[2,"Augmente la Fatigue"],[2,"Augmente la Fatigue"],[2,""],[0,"Attaque à distance et a un Pouvoir si le Monstre n'en a pas habituellement"],[0,"Attaque à distance et a un Pouvoir si le Monstre n'en a pas habituellement"],[0,"Attaque à distance et a un Pouvoir si le Monstre n'en a pas habituellement"],[2,"Vole des objets dans l'Equipement"],[2,"Vole des objets dans l'Equipement"]];
caracFamilly["Insecte"]=[[11,"Insensible au Hurlement Effrayant, attaque à distance et a un plus grand nombre d'attaques"],[2,"Pouvoir habituel remplacé par Amnésie : perte temporaire de x%"],[2,"Pouvoir habituel remplacé par Amnésie : perte temporaire de x%"],[1,""],[1,""],[1,""],[0,"Enfouit les Trésors"],[0,"Enfouit les Trésors"],[20,""],[20,""],[1,""],[0,""],[0,""],[0,"Se Camoufle et attaque à distance"],[2,"Flagellation Mentale : retire 1% de maîtrise sur une Compétence"],[2,"Flagellation Mentale : retire 1% de maîtrise sur une Compétence"],[-1,"Pouvoir habituel remplacé par Maladie"],[2,"Soigne les Monstres et a une attaque de moins en cas d'attaques multiples"],[0,""],[0,""],[-1,""],[-1,""],[11,"Insensible au Hurlement Effrayant et a un plus grand nombre d'attaques"],[2,"Augmente la Fatigue"],[2,"Augmente la Fatigue"],[2,""],[3,"Donne des Malus de Concentration"],[3,"Donne des Malus de Concentration"]];
caracFamilly["Monstre"]=[[2,"Pouvoir habituel remplacé par Amnésie : perte temporaire de x%"],[2,"Pouvoir habituel remplacé par Amnésie : perte temporaire de x%"],[7,""],[7,""],[1,""],[1,""],[1,""],[2,"Attaque à distance"],[2,"Attaque à distance"],[2,"Soigne les Monstres et a une attaque de moins en cas d'attaques multiples"],[0,"Enfouit les Trésors"],[0,"Enfouit les Trésors"],[3,"A un plus grand nombre d'attaques"],[2,"Flagellation Mentale : retire 1% de maîtrise sur un Sortilège ou une Compétence"],[2,"Flagellation Mentale : retire 1% de maîtrise sur un Sortilège ou une Compétence"],[20,""],[20,""],[3,""],[1,""],[0,""],[0,""],[0,"Se Camoufle et attaque à distance"],[-1,"Pouvoir habituel remplacé par Maladie"],[-1,""],[-1,""],[2,"Augmente la Fatigue"],[2,"Augmente la Fatigue"],[1,""],[1,""]];
caracFamilly["Mort-Vivant"]=[[-1,""],[2,"Pouvoir habituel remplacé par Amnésie : perte temporaire de x%"],[2,"Pouvoir habituel remplacé par Amnésie : perte temporaire de x%"],[1,""],[1,""],[1,""],[20,""],[20,""],[0,""],[0,""],[3,""],[8,"Insensible au Hurlement Effrayant et a un plus grand nombre d'attaques"],[8,"Insensible au Hurlement Effrayant et a un plus grand nombre d'attaques"],[-1,"Pouvoir habituel remplacé par Maladie"],[2,"Soigne les Monstres et a une attaque de moins en cas d'attaques multiples"],[2,"Attaque à distance"],[5,"Fait apparaître des Monstres"],[5,"Fait apparaître des Monstres"],[-1,""],[-1,""],[2,"Flagellation Mentale : retire 1% de maîtrise sur un Sortilège"],[2,"Augmente la Fatigue"],[2,"Augmente la Fatigue"],[0,"Se Camoufle et attaque à distance"],[0,"Se Camoufle et attaque à distance"]];


var ageFamilly = new Array();   // niveau fonction de age
ageFamilly["Animal"]={Bébé:0,  Enfançon:1, Jeune:2, Adulte:3, Mature:4, 'Chef de Harde':5, Ancien:6, Ancienne:6, Ancêtre:7};
ageFamilly["Démon"]={Initial:0, Initiale:0, Novice:1, Mineur:2, Mineure:2, Favori:3, Favorite:3, Majeur:4, Majeure:4, Supérieur:5, Supérieure:5, Suprême:6, Ultime:7};
ageFamilly["Humanoide"]={Nouveau:0, Nouvelle:0, Jeune:1, Adulte:2, Vétéran:3, Vétérante:3, Briscard:4, Briscarde:4, Doyen:5, Doyenne:5, Légendaire:6, Mythique:7};
ageFamilly["Insecte"]={Larve:0, Immature:1,  Juvénile:2,  Imago:3,  Développé:4, Développée:4, Mûr:5, Mûre:5, Accompli:6, Accomplie:6, Achevé:7, Achevée:7};
ageFamilly["Monstre"]={Nouveau:0, Nouvelle:0, Jeune:1,  Adulte:2,  Vétéran:3, Vétérante:3, Briscard:4, Briscarde:4, Doyen:5, Doyenne:5, Légendaire:6,  Mythique:7};
ageFamilly["Mort-Vivant"]={Naissant:0, Naissante:0, Récent:1, Récente:1, Ancien:2, Ancienne:2, Vénérable:3, Séculaire:4, Antique:5, Ancestral:6, Ancestrale:6,  Antédiluvien:7, Antédiluvienne:7};

var tabMonstres = new Array();  
var tabMonstres = [ //nom, n° Famille, Niveau, IdImage
["Chauve-Souris Géante", 0,2,72],
["Cheval à Dents de Sabre", 0,18,9],
["Dindon", 0,1,0],
["Glouton", 0,15,114],
["Gnu Domestique", 0,1,0],
["Gnu Sauvage", 0,1,20],
["Gowap Apprivoisé", 0,-7,0],
["Gowap Sauvage", 0,-7,0],
["Rat Géant", 0,1,32],
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
["Elémentaire du Chaos", 1,17,86],
["Elémentaire d'Air", 1,18,21],
["Elémentaire d'Eau", 1,14,40],
["Elémentaire de Feu", 1,17,46],
["Elémentaire de Terre", 1,19,29],
["Erinyes", 1,8,24],
["Gritche", 1,25,0],
["Hellrot", 1,15,54],
["Incube", 1,10,106],
["Marilith", 1,22,45],
["Molosse Satanique", 1,7,63],
["Palefroi Infernal", 1,20,13],
["Pseudo-Dragon", 1,1,129],
["Shai", 1,16,27],
["Sirène", 1,8,0],
["Succube", 1,10,56],
["Xorn", 1,11,127],
["Ashashin", 2,21,98],
["Boggart", 2,3,70],
["Caillouteux", 2,2,71],
["Champi-Glouton", 2,4,42],
["Ettin", 2,10,67],
["Flagelleur Mental", 2,24,0],
["Furgolin", 2,9,90],
["Géant de Pierre", 2,14,112],
["Géant des Gouffres", 2,18,113],
["Gnoll", 2,3,38],
["Gobelin Magique", 2,1,0],
["Goblin", 2,1,30],
["Goblours", 2,4,115],
["Golem d'Argile", 2,14,116],
["Golem de Chair", 2,9,105],
["Golem de Fer", 2,24,117],
["Golem de Pierre", 2,19,118],
["Gremlins", 2,3,6],
["Homme-Lézard", 2,4,84],
["Hurleur", 2,8,62],
["Kobold", 2,1,66],
["Loup-Garou", 2,8,58],
["Lutin", 2,2,75],
["Méduse", 2,6,92],
["Mégacéphale", 2,25,49],
["Minotaure", 2,6,77],
["Ogre", 2,6,68],
["Orque", 2,3,41],
["Ours-Garou", 2,13,55],
["Rat-Garou", 2,3,57],
["Rocketeux", 2,6,59],
["Sorcière", 2,15,28],
["Sphinx", 2,23,0],
["Tigre-Garou", 2,9,126],
["Titan", 2,20,44],
["Yéti", 2,7,80],
["Yuan-ti", 2,12,0],
["Ankheg", 3,10,69],
["Anoploure Purpurin", 3,24,95],
["Araignée Géante", 3,2,33],
["Coccicruelle", 3,16,0],
["Essaim Sanguinaire", 3,18,0],
["Foudroyeur", 3,23,109],
["Limace Géante", 3,9,51],
["Mante Fulcreuse", 3,22,0],
["Mille-Pattes Géant", 3,12,26],
["Mille-Pattes", 3,12,0],
["Nuage d'Insectes", 3,5,0],
["Nuée de Vermine", 3,10,0],
["Scarabée Géant", 3,5,17],
["Scarabée", 3,5,0],
["Scorpion Géant", 3,10,50],
["Scorpion", 3,10,0],
["Strige", 3,1,82],
["Thri-kreen", 3,8,37],
["Amibe Géante", 4,8,36],
["Anaconda des Catacombes", 4,6,53],
["Basilisk", 4,11,100],
["Behir", 4,13,96],
["Beholder", 4,50,48],
["Bondin", 4,8,88],
["Bouj'Dla Placide", 4,23,87],
["Bouj'Dla", 4,13,87],
["Bulette", 4,14,101],
["Carnosaure", 4,16,3],
["Chimère", 4,11,102],
["Chonchon", 4,20,11],
["Cockatrice", 4,5,89],
["Crasc Médius", 4,20,16],
["Crasc Maexus", 4,25,16],
["Crasc", 4,10,16],
["Cube Gélatineux", 4,21,0],
["Daemonite", 1,19,107],
["Djinn", 4,21,8],
["Effrit", 4,22,108],
["Esprit-Follet", 4,15,0],
["Familier", 4,1,35],
["Feu Follet", 4,16,2],
["Fumeux", 1,17,110],
["Fungus Géant", 4,6,111],
["Fungus", 4,6,0],
["Fungus Violet", 4,3,0],
["Gargouille", 4,5,91],
["Gorgone", 4,11,43],
["Grouilleux", 4,2,0],
["Grylle", 4,20,119],
["Harpie", 4,4,39],
["Hydre", 4,50,0],
["Labeilleux", 3,20,120],
["Lézard Géant", 4,5,74],
["Lézard", 4,5,0],
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
["Ver Carnivore Géant", 4,13,15],
["Ver Carnivore", 4,13,15],
["Vouivre", 4,23,12],
["Worg", 4,5,0],
["Ame-en-peine", 5,7,97],
["Banshee", 5,15,22],
["Capitan", 5,24,94],
["Croquemitaine", 5,6,103],
["Ectoplasme", 5,15,104],
["Fantôme", 5,19,19],
["Goule", 5,4,60],
["Liche", 5,50,85],
["Momie", 5,4,73],
["Nécrochore", 5,25,123],
["Nécrophage", 5,7,0],
["Nâ-Hàniym-Hééé", 5,0,0],
["Ombre", 5,2,79],
["Spectre", 5,13,124],
["Squelette", 5,1,34],
["Vampire", 5,22,7],
["Zombie", 5,2,81],
["Aragnarok du Chaos",3,17,128], 
["Elémentaire Magmatique",1,8,131],
["Raquettou",2,22,133],
["Cube Gélatineux",4,32,134],
["Archi-Nécromant",5,43,135]
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

// === Images des compétences ===
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
skinIMG['Augmentation de l´Attaque']='augmentation_de_l_attaque.png';
skinIMG['Augmentation de l´Esquive']='augmentation_de_l_esquive.png';
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
skinIMG['Précision Magique=']='precision_magique.png'; 

// === Conversion Evénement => image compétence/sorts ===
var ZZImg=new Array();	
ZZImg['Rafale Psy.']='sortileges/'+skinIMG['Rafale Psychique'];
ZZImg['Charge']='competences/'+skinIMG['Charger'];
ZZImg['Att. Précise']='competences/'+skinIMG['Attaque Precise'];
ZZImg['Botte Secrète']='competences/'+skinIMG['Botte Secrete'];
ZZImg['Frénésie']='competences/'+skinIMG['Frenesie'];
ZZImg['Coup de Butoir']='competences/'+skinIMG['Coup de Butoir'];
ZZImg['Projectile Mag.']='sortileges/'+skinIMG['Projectile Magique'];
ZZImg['Vampirisme']='sortileges/'+skinIMG['Vampirisme'];
ZZImg['Explosion']='sortileges/'+skinIMG['Explosion'];
ZZImg['Griffe du Sorcier']='sortileges/'+skinIMG['Griffe du Sorcier'];
ZZImg['Piège à Feu']='competences/'+skinIMG['Construire un Piege'];
ZZImg['Rotobaffe']='competences/'+skinIMG['Rotobaffe'];
ZZImg['Syphon des âmes']='sortileges/'+skinIMG['Siphon des ames'];
ZZImg['CdM']='competences/'+skinIMG['Connaissance des Monstres'];
ZZImg['Insulte']='competences/'+skinIMG['Insultes'];

// === Conversion Evénement => image compétence/sorts ===
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
skinTresor['Trésor']='equipement/tresor.png';
skinTresor['Composant']='equipement/composant.jpg';
skinTresor['Carte']='equipement/parcho/parchemin.gif';
skinTresor['Anneau']='equipement/anneau.jpg';
skinTresor['Champignon']='equipement/champignon.jpg';
skinTresor['Minerai']='equipement/minerai.jpg';
skinTresor['Outils']='equipement/outils.jpg';
skinTresor['Gigots de Gob']='equipement/gigots_de_gob.jpg';
skinTresor['Spécial']='equipement/special.jpg';

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
* - révision de getPVrestants (erreurs calculs)                                  *
* - ajout des fonctions de gestion/stockage des dates                            *
* - ajout des nouvelles comps dans arraycompsort                                 *
* TODO                                                                           *
* - revoir la gestion des CdM                                                    *
* - revoir tout ce qui est lié à la vue (estimateurs dég nott)                   *
* - vérfier la gestion des enchants                                              *
*********************************************************************************/

var poissotron = 'http://minitilk.fur4x-hebergement.net/getDice2.php';

/*********************************************************************************
*                    mise à jour de variables globales utiles                    *
*********************************************************************************/

var numTroll = MZ_getValue('NUM_TROLL'); // utilisé pour accès bdd (un peu partout)
var nivTroll = MZ_getValue('NIV_TROLL'); // utilisé dans vue pour PX
var mmTroll = MZ_getValue(numTroll+'.caracs.mm'); // utilisé dans actions et vue (calculs SR)
var rmTroll = MZ_getValue(numTroll+'.caracs.rm'); // utilisé dans actions et vue (calculs SR)


/*********************************************************************************
*                           Fonctions durée de script                            *
*********************************************************************************/

var date_debut = null;

function start_script(nbJours_exp) {
	if (date_debut)
		return;
	date_debut = new Date();
	// Créé la variable expdate si demandé
	if (nbJours_exp) {
		expdate = new Date();
		expdate.setTime(expdate.getTime()+nbJours_exp*86400000);
		}
	}

function displayScriptTime() {
	var node = document.evaluate("//td/text()[contains(.,'Page générée en')]/../br",
						document, null, 9, null).singleNodeValue;
	if (node)
		insertText(node,' - [Script exécuté en '+(new Date().getTime()-date_debut.getTime())/1000+' sec.]');
	}


/*********************************************************************************
*                              Insertion de scripts                              *
*********************************************************************************/


function isPage(url) {
	return currentURL.indexOf(MHURL + url) == 0;
}

function chargerScript(script) {
	// (mauvaise) Détection du chargement de la page
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

function appendLI(ul, text) { // uniquement utilisé dans les options (crédits)
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
	return texte.replace(/[éêèë]/g,'e').replace(/[àâä]/g,'a').replace(/Â/g, 'A').replace(/[ùûü]/g,'u')
			.replace(/[ôöõ]/g,'o').replace(/[ïî]/g,'i').replace(/[ç]/g,'c');
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
	return str.replace(/[éèêë]/g, 'e').replace(/[àâä]/g, 'a').replace(/Â/g, 'A')
			.replace(/[ùûü]/g, 'u').replace(/[ïî]/g, 'i').replace(/[öô]/g, 'o');
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
conversionCompSortArray[str_woa('Accélération du Métabolisme')]='AM';
conversionCompSortArray[str_woa('Attaque Précise')]='AP';
conversionCompSortArray[str_woa('Balayage')]='Balayage';
conversionCompSortArray[str_woa('Balluchonnage')]='Balluchonnage';
conversionCompSortArray[str_woa('Bidouille')]='Bidouille';
conversionCompSortArray[str_woa('Botte Secrète')]='BS';
conversionCompSortArray[str_woa('Camouflage')]='Camouflage';
conversionCompSortArray[str_woa('Charger')]='Charger';
conversionCompSortArray[str_woa('Connaissance des Monstres')]='CdM';
conversionCompSortArray[str_woa('Construire un Piège')]='Piege';
conversionCompSortArray[str_woa('Contre-Attaquer')]='CA';
conversionCompSortArray[str_woa('Coup de Butoir')]='CdB';
conversionCompSortArray[str_woa('Course')]='Course';
conversionCompSortArray[str_woa('Déplacement Eclair')]='DE';
conversionCompSortArray[str_woa('Dressage')]='Dressage';
conversionCompSortArray[str_woa('Ecriture Magique')]='EM';
conversionCompSortArray[str_woa('Frénésie')]='Frenesie';
conversionCompSortArray[str_woa('Grattage')]='Grattage';
conversionCompSortArray[str_woa('Hurlement Effrayant')]='HE';
conversionCompSortArray[str_woa('Identification des Champignons')]='IdC';
conversionCompSortArray[str_woa('Insultes')]='Insultes';
conversionCompSortArray[str_woa("S'interposer")]='Interposition';
conversionCompSortArray[str_woa('Lancer de Potions')]='LdP';
conversionCompSortArray[str_woa('Marquage')]='Marquage';
conversionCompSortArray[str_woa('Mélange Magique')]='MM';
conversionCompSortArray[str_woa('Miner')]='Miner';
conversionCompSortArray[str_woa('Nécromancie')]='Necromancie';
conversionCompSortArray[str_woa('Parer')]='Parer';
conversionCompSortArray[str_woa('Pistage')]='Pistage';
conversionCompSortArray[str_woa('Planter un Champignon')]='PuC';
conversionCompSortArray[str_woa('Régénération Accrue')]='RA';
conversionCompSortArray[str_woa('Réparation')]='Reparation';
conversionCompSortArray[str_woa('Retraite')]='Retraite';
conversionCompSortArray[str_woa('Rotobaffe')]='Rotobaffe';
conversionCompSortArray[str_woa('Shamaner')]='Shamaner';
conversionCompSortArray[str_woa('Tailler')]='Tailler';
//conversionCompSortArray[str_woa('Vol')]='Vol';
// sorts
conversionCompSortArray[str_woa('Analyse Anatomique')]='AA';
conversionCompSortArray[str_woa('Armure Ethérée')]='AE';
conversionCompSortArray[str_woa('Augmentation de l´Attaque')]='AdA';
conversionCompSortArray[str_woa('Augmentation de l´Esquive')]='AdE';
conversionCompSortArray[str_woa('Augmentation des Dégats')]='AdD';
conversionCompSortArray[str_woa('Bulle Anti-Magie')]='BAM';
conversionCompSortArray[str_woa('Bulle Magique')]='BuM';
conversionCompSortArray[str_woa('Explosion')]='Explosion';
conversionCompSortArray[str_woa('Faiblesse Passagère')]='FP';
conversionCompSortArray[str_woa('Flash Aveuglant')]='FA';
conversionCompSortArray[str_woa('Glue')]='Glue';
conversionCompSortArray[str_woa('Griffe du Sorcier')]='GdS';
conversionCompSortArray[str_woa('Hypnotisme')]='Hypnotisme';
conversionCompSortArray[str_woa('Identification des trésors')]='IdT';
conversionCompSortArray[str_woa('Invisibilité')]='Invisibilite';
conversionCompSortArray[str_woa('Lévitation')]='Levitation';
conversionCompSortArray[str_woa('Projectile Magique')]='Projectile';
conversionCompSortArray[str_woa('Projection')]='Projection';
conversionCompSortArray[str_woa('Rafale Psychique')]='Rafale';
conversionCompSortArray[str_woa('Sacrifice')]='Sacrifice';
conversionCompSortArray[str_woa('Siphon des Âmes')]='Siphon';
conversionCompSortArray[str_woa('Télékinésie')]='Telekinesie';
conversionCompSortArray[str_woa('Téléportation')]='TP';
conversionCompSortArray[str_woa('Vampirisme')]='Vampirisme';
conversionCompSortArray[str_woa('Vision Accrue')]='VA';
conversionCompSortArray[str_woa('Vision lointaine')]='VL';
conversionCompSortArray[str_woa('Voir le Caché')]='VlC';
conversionCompSortArray[str_woa('Vue Troublée')]='VT';
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

var listeTitres = new Array('Niveau', 'Famille', 'Points de Vie', 'Blessure', 'Attaque', 'Esquive', 'Dégâts',
		'Régénération', 'Armure', 'Vue', 'Capacité spéciale', 'Résistance Magique', 'Autres');
		
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
	var td = appendTdText(tr, 'CDM de ' + nom + (donneesMonstre[11] != '???' ? ' (N° ' + id + ')' : ''), true);
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
				td.appendChild(createImage(urlImg+"zone.gif", "Portée : Zone"));
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
		// seuil de résistance du monstre
		var lb = td.getElementsByTagName('b');
		if (lb.length == 1) {
			var mrm = lb[0].firstChild.nodeValue * 1;
			var v = (mrm / mmTroll);
			lb[0].firstChild.nodeValue += " ("
					+ (mrm < mmTroll ? Math.max(10, Math.floor(v*50)) : Math.min(90, Math.floor(100 - 50/v))) + " %)";
		}
	}
	
	if(donneesMonstre[12]>0 || donneesMonstre[13]>=0 || donneesMonstre[14]>0 || donneesMonstre[15].length>0 || (donneesMonstre[17] && donneesMonstre[17].length>0) || infosCompo.length>0 || nom.indexOf("Gowap Apprivoisé")==-1)
	{
		
		td = createCase(listeTitres[12],tbody);
		if(donneesMonstre[12]==1)
		{
			td.appendChild(createImage(urlImg+"oeil.gif", "Voit le caché"));
		}
		if(donneesMonstre[13]==1)
		{
			td.appendChild(createImage(urlImg+"distance.gif", "Attaque à distance"));
		}
		else if(donneesMonstre[13]==0)
		{
			td.appendChild(createImage(urlImg+"cac.gif", "Corps à corps"));
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
			td.appendChild(createImage(urlImg+"lent.gif","Lent à se déplacer"));
		}
		else if(donneesMonstre[15]=="Normale")
		{
			td.appendChild(createImage(urlImg+"normal.gif","Vitesse normale de déplacement"));
		}
		else if(donneesMonstre[15]=="Rapide")
		{
			td.appendChild(createImage(urlImg+"rapide.gif","Déplacement rapide"));
		}
		if(donneesMonstre[17] && donneesMonstre[17].length>0 && donneesMonstre[17]!="Vide")
		{
			td.appendChild(createImage(urlImg+"charge2.gif","Possède de l'équipement ("+donneesMonstre[17]+")"));
		}
		if(infosCompo.length>0)
		{
			td.appendChild(createImage(urlImg+"Competences/ecritureMagique.png",infosCompo));
		}
		if(profilActif && nom.indexOf("Gowap Apprivoisé")==-1 && nom.indexOf("Gowap Sauvage")==-1)
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
			array[0]=infoComposant[0].replace("Ril","Œil");
			array[1]=infoComposant[1];
			array[2]=infoComposant[2];
			array[3]=getQualite(infoComposant[3]);
			var texte = infoComposant[4].replace("Ril","Œil");
			for(var k=5;k<infoComposant.length;k++)
			{
				texte += ";"+infoComposant[k].replace("Ril","Œil");
			}
			texteGlobal+=texte+'\n';
			texte += " pour l'enchantement d'un(e) "+nomEquipement+" chez l'enchanteur n°"+infoEnchanteur[0]+' ('+infoEnchanteur[1]+'|'+infoEnchanteur[2]+'|'+infoEnchanteur[3]+')';
			array[4]=texte;
			listeInfoEnchantement.push(array);
		}
		texteGlobal += "chez l'enchanteur n°"+infoEnchanteur[0]+' ('+infoEnchanteur[1]+'|'+infoEnchanteur[2]+'|'+infoEnchanteur[3]+')';
		listeEquipementEnchantement[idEquipement] = texteGlobal;
	}
	
}

function isEnchant(nom) {
	var monstreEnchant = '';
	for(j in listeInfoEnchantement) {
		monstre = listeInfoEnchantement[j][2].toLowerCase();
		if ((nom+' ').toLowerCase().indexOf(monstre+' ')>=0){		
			monstreEnchant=monstre;
			break; // ça permet d'arreter de chercher dans le tableau des EM -> on gagne du temps
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
		var nodes = document.evaluate("descendant::img[@alt = 'Composant - Spécial']",
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
			var nomMonstre = nomCompoTotal.substring(0,nomCompoTotal.indexOf(" de Qualité"));
			var qualite = nomCompoTotal.substring(nomCompoTotal.indexOf("de Qualité")+11,nomCompoTotal.indexOf(' ['));
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
	var nodes = document.evaluate("descendant::img[@alt = 'Composant - Spécial']",
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
		var nomMonstre = nomCompoTotal.substring(0,nomCompoTotal.indexOf(" de Qualité"));
		var qualite = nomCompoTotal.substring(nomCompoTotal.indexOf("de Qualité")+11,nomCompoTotal.indexOf(' ['));
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
			break; // ça permet d'arreter de chercher dans le tableau des EM -> on gagne du temps
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
			break; // ça permet d'arreter de chercher dans le tableau des EM -> on gagne du temps
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
			    compo=tabEM[i][1]+' '+tabEM[i][0]+" (Qualité "+tabQualite[tabEM[i][3]]+") pour l'écriture de "+tabEM[i][2];
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
					compo+=pourcentage+"% pour l'écriture de "+tabEM[i][2];
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

tabQualite = ["Très Mauvaise","Mauvaise","Moyenne","Bonne","Très Bonne"];

tabEM=[ //Monstre, Compo, Sort EM, TypeEM
["Basilisk","Œil d'un ","Analyse Anatomique",2,0,"Tête"],
["Ankheg","Carapace d'un","Armure Ethérée",2,0,"Spécial"],
["Rocketeux","Tripes d'un","Armure Ethérée",3,0,"Corps"],

["Loup-Garou","Bras d'un","Augmentation de l'Attaque",2,0,"Membre"],
["Titan","Griffe d'un","Augmentation de l'Attaque",3,0,"Membre"],

["Erinyes","Plume d'une","Augmentation de l'Esquive",2,0,"Membre"],
["Palefroi Infernal","Sabot d'un","Augmentation de l'Esquive",3,0,"Membre"],

["Manticore","Patte d'une","Augmentation des Dégâts",2,0,"Membre"],
["Trancheur","Griffe d'un","Augmentation des Dégâts",3,0,"Membre"],

["Banshee","Peau d'une","Bulle Anti-Magie",2,0,"Corps"],

["Essaim Sanguinaire","Pattes d'un","Bulle Magique",2,0,"Membre"],
["Sagouin","Patte d'un","Bulle Magique",3,0,"Membre"],
["Effrit","Cervelle d'un","Bulle Magique",4,0,"Tête"],

["Diablotin","Cœur d'un","Explosion",2,0,"Corps"],
["Chimère","Sang d'une","Explosion",3,0,"Corps"],
["Barghest","Bave d'un","Explosion",4,0,"Spécial"],

["Nécrophage","Tête d'un","Faiblesse Passagère",2,0,"Tête"],
["Vampire","Canine d'un","Faiblesse Passagère",3,0,"Spécial"],

["Gorgone","Chevelure d'une","Flash Aveuglant",2,0,"Tête"],
["Géant des Gouffres","Cervelle d'un","Flash Aveuglant",3,0,"Tête"],

["Limace Géante","Mucus d'une","Glue",2,0,"Spécial"],
["Grylle","Gueule d'un","Glue",3,0,"Tête"],

["Abishaii Noir","Serre d'un","Griffe du Sorcier",2,0,"Membre"],
["Vouivre","Venin d'une","Griffe du Sorcier",3,0,"Spécial"],
["Araignée Géante","Mandibule d'une","Griffe du Sorcier",4,0,"Spécial"],

["Nuage d'Insectes","Chitine d'un","Invisibilité",2,0,"Spécial"],
["Yuan-ti","Cervelle d'un","Invisibilité",3,0,"Tête"],
["Gritche","Epine d'un","Invisibilité",4,0,"Spécial"],

["Yéti","Jambe d'un","Projection",2,0,"Membre"],
["Djinn","Tête d'un","Projection",3,0,"Tête"],

["Sorcière","Verrue d'une","Sacrifice",2,0,"Spécial"],

["Plante Carnivore","Racine d'une","Télékinésie",2,0,"Spécial"],
["Tertre Errant","Cervelle d'un","Télékinésie",3,0,"Tête"],

["Boggart","Main d'un","Téléportation",2,0,"Membre"],
["Succube","Téton Aguicheur d'une","Téléportation",3,0,"Corps"],
["Nécrochore","Os d'un","Téléportation",4,0,"Corps"],

["Abishaii Vert","Œil d'un","Vision Accrue",2,0,"Tête"],

["Fungus Géant","Spore d'un","Vision Lointaine",2,0,"Spécial"],
["Abishaii Rouge","Aile d'un","Vision Lointaine",3,0,"Membre"],

["Zombie","Cervelle Putréfiée d'un","Voir le Caché",2,0,"Tête"],
["Shai","Tripes d'un","Voir le Caché",3,0,"Corps"],
["Phoenix","Œil d'un","Voir le Caché",4,0,"Tête"],

["Naga","Ecaille d'un","Vue Troublée",2,0,"Corps"],
["Marilith","Ecaille d'une","Vue Troublée",3,0,"Membre"],


["Rat","d'un","Composant variable",-1,1],
["Rat Géant","d'un","Composant variable",-1,1],
["Dindon","d'un","Composant variable",-1,1],
["Goblin","d'un","Composant variable",-1,1],
["Limace","d'une","Composant variable",-1,1],
["Limace Géante","d'une","Composant variable",-1,1],
["Ver","d'un","Composant variable",-1,1],
["Ver Carnivore","d'un","Composant variable",-1,1],
["Ver Carnivore Géant","d'un","Composant variable",-1,1],
["Fungus","d'un","Composant variable",-1,1],
["Vouivre","d'une","Composant variable",-1,1],
["Gnu","d'un","Composant variable",-1,1],
["Scarabée","d'un","Composant variable",-1,1]

];

var moisChampi = new Array();
moisChampi["Préscientus Reguis"] = "du Phoenix";
moisChampi["Amanite Trolloïde"] = "de la Mouche";
moisChampi["Girolle Sanglante"] = "du Dindon";
moisChampi["Horreur Des Prés"] = "du Gobelin";
moisChampi["Bolet Péteur"] = "du Démon";
moisChampi["Pied Jaune"] = "de la Limace";
moisChampi["Agaric Sous-Terrain"] = "du Rat";
moisChampi["Suinte Cadavre"] = "de l'Hydre";
moisChampi["Cèpe Lumineux"] = "du Ver";
moisChampi["Fungus Rampant"] = "du Fungus";
moisChampi["Nez Noir"] = "de la Vouivre";
moisChampi["Pleurote Pleureuse"] = "du Gnu";
moisChampi["Phytomassus Xilénique"] = "du Scarabée";


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
	var str = "<table class='mh_tdborder' border='0' cellspacing='1' cellpadding='4'><tr class='mh_tdtitre'><td>Attaque</td><td>Esq. Parfaite</td><td>Touché</td><td>Critique</td><td>Dégâts</td></tr>";
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
	//str += "Attaque normale : Touché "+chanceDeTouche+"% Critique "+chanceDeCritique+"% Dégâts "+(((chanceDeTouche-chanceDeCritique)*Math.max(deg*2+degbmp+degbmm-arm,1)+chanceDeCritique*Math.max(Math.floor(deg*1.5)*2+degbmp+degbmm-arm,1))/100);	
	listeAttaques.push(new Array("Attaque normale",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,modificateurEsquive,modificateurArmure));
	if(getSortComp("Vampirisme")>0)
	{
		var pour = getSortComp("Vampirisme");
		chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(Math.floor(deg*2/3),esqM,attbmm,0)*pour/100);
		chanceDeTouche = Math.round(chanceTouche(Math.floor(deg*2/3),esqM,attbmm,0)*pour/100);
		chanceDeCritique = Math.round(chanceCritique(Math.floor(deg*2/3),esqM,attbmm,0)*pour/100);
		degats = Math.round(coeffSeuil*((chanceDeTouche-chanceDeCritique)*Math.max(deg*2+degbmm,1)+chanceDeCritique*Math.max(Math.floor(deg*1.5)*2+degbmm,1)))/100;
		//str += "\nVampirisme : Touché "+chanceDeTouche+"% Critique "+chanceDeCritique+"% Dégâts "+(degats);
		listeAttaques.push(new Array("Vampirisme",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,modificateurEsquive,modificateurMagie));
	}
	if(getSortComp("Botte Secrète")>0)
	{
		var pour = getSortComp("Botte Secrète");
		chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(Math.floor(att/2),esqM,Math.floor((attbmp+attbmm)/2),0)*pour/100);
		chanceDeTouche = Math.round(chanceTouche(Math.floor(att/2),esqM,Math.floor((attbmp+attbmm)/2),0)*pour/100);
		chanceDeCritique = Math.round(chanceCritique(Math.floor(att/2),esqM,Math.floor((attbmp+attbmm)/2),0)*pour/100);
		degats = Math.round(((chanceDeTouche-chanceDeCritique)*Math.max(Math.floor(deg/2)*2+Math.floor((degbmp+degbmm)/2)-Math.floor(armM/2),1)+chanceDeCritique*Math.max(Math.floor(deg*1.5/2)*2+Math.floor((degbmp+degbmm)/2)-Math.floor(armM/2),1)))/100;
		//str += "\nBotte Secrète : Touché "+chanceDeTouche+"% Critique "+chanceDeCritique+"% Dégâts "+(degats);
		listeAttaques.push(new Array("Botte Secrète",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,modificateurEsquive,modificateurArmure));
	}
	if(getSortComp("Rafale Psychique")>0)
	{
		var pour = getSortComp("Rafale Psychique");
		chanceDEsquiveParfaite = 0;
		chanceDeTouche = Math.round(100*pour/100);
		chanceDeCritique = Math.round(0*pour/100);
		degats = Math.round(coeffSeuil*((chanceDeTouche-chanceDeCritique)*Math.max(deg*2+degbmm,1)+chanceDeCritique*Math.max(Math.floor(deg*1.5)*2+degbmm,1)))/100;
		//str += "\nRafale Psychique : Touché "+chanceDeTouche+"% Critique "+chanceDeCritique+"% Dégâts "+(degats);
		listeAttaques.push(new Array("Rafale Psychique",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,'',pasDeSR?modificateurMagie:''));
	}
	if(getSortComp("Explosion")>0)
	{
		var pour = getSortComp("Explosion");
		chanceDEsquiveParfaite = 0;
		chanceDeTouche = Math.round(100*pour/100);
		chanceDeCritique = Math.round(0*pour/100);
		degats = Math.round(coeffSeuil*((chanceDeTouche-chanceDeCritique)*Math.max(Math.floor(1+deg/2+pv/20)*2+degbmm,1)+chanceDeCritique*Math.max(Math.floor(Math.floor(1+deg/2+pv/20)*1.5)*2+degbmm,1)))/100;
		//str += "\nRafale Psychique : Touché "+chanceDeTouche+"% Critique "+chanceDeCritique+"% Dégâts "+(degats);
		listeAttaques.push(new Array("Explosion",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,'',pasDeSR?modificateurMagie:''));
	}
	if(getSortComp("Projectile Magique")>0)
	{
		var pour = getSortComp("Projectile Magique");
		chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(vue,esqM,attbmm,0)*pour/100);
		chanceDeTouche = Math.round(chanceTouche(vue,esqM,attbmm,0)*pour/100);
		chanceDeCritique = Math.round(chanceCritique(vue,esqM,attbmm,0)*pour/100);
		degats = Math.round(coeffSeuil*((chanceDeTouche-chanceDeCritique)*Math.max(Math.floor(vue/2)*2+degbmm,1)+chanceDeCritique*Math.max(Math.floor(Math.floor(vue/2)*1.5)*2+degbmm,1)))/100;
		//str += "\nProjectile Magique : Touché "+chanceDeTouche+"% Critique "+chanceDeCritique+"% Dégâts "+(degats);
		listeAttaques.push(new Array("Projectile Magique",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,modificateurEsquive,modificateurMagie));
	}
	if(getSortComp("Frénésie")>0)
	{
		var pour = getSortComp("Frénésie");
		chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(att,esqM,attbmm+attbmp,0)*pour/100);
		chanceDeTouche = Math.round(chanceTouche(att,esqM,attbmm+attbmp,0)*pour/100);
		chanceDeCritique = Math.round(chanceCritique(att,esqM,attbmm+attbmp,0)*pour/100);
		degats = Math.round(((chanceDeTouche-chanceDeCritique)*2*Math.max((deg*2+degbmp+degbmm-armM),1)+chanceDeCritique*2*Math.max(Math.floor(deg*1.5)*2+degbmm+degbmp-armM,1)))/100;
		//str += "\nFrénésie : Touché "+chanceDeTouche+"% Critique "+chanceDeCritique+"% Dégâts "+(degats);
		listeAttaques.push(new Array("Frénésie",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,modificateurEsquive,modificateurArmure));
	}
	if(getSortComp("Charger")>0)
	{
		var pour = getSortComp("Charger");
		chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(att,esqM,attbmm+attbmp,0)*pour/100);
		chanceDeTouche = Math.round(chanceTouche(att,esqM,attbmm+attbmp,0)*pour/100);
		chanceDeCritique = Math.round(chanceCritique(att,esqM,attbmm+attbmp,0)*pour/100);
		var degats = Math.round(((chanceDeTouche-chanceDeCritique)*Math.max((deg*2+degbmp+degbmm-armM),1)+chanceDeCritique*Math.max(Math.floor(deg*1.5)*2+degbmm+degbmp-armM,1)))/100;
		//str += "\nCharge : Touché "+chanceDeTouche+"% Critique "+chanceDeCritique+"% Dégâts "+(degats);
		listeAttaques.push(new Array("Charger",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,modificateurEsquive,modificateurArmure));
	}
	if(getSortComp("Griffe du Sorcier")>0)
	{
		var pour = getSortComp("Griffe du Sorcier");
		chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(att,esqM,attbmm,0)*pour/100);
		chanceDeTouche = Math.round(chanceTouche(att,esqM,attbmm,0)*pour/100);
		chanceDeCritique = Math.round(chanceCritique(att,esqM,attbmm,0)*pour/100);
		degats = Math.round(coeffSeuil*((chanceDeTouche-chanceDeCritique)*Math.max(Math.floor(deg/2)*2+degbmm,1)+chanceDeCritique*Math.max(Math.floor(Math.floor(deg/2)*1.5)*2+degbmm,1)))/100;
		//str += "\nGriffe du Sorcier : Touché "+chanceDeTouche+"% Critique "+chanceDeCritique+"% Dégâts "+(degats);
		listeAttaques.push(new Array("Griffe du Sorcier",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,modificateurEsquive,modificateurMagie));
	}
	if(getSortComp("Attaque Précise")>0)
	{
		var niveau = 5;
		var oldPour = 0;
		var chanceDEsquiveParfaite = 0;
		var chanceDeTouche = 0;
		var chanceDeCritique = 0;
		degats = 0;
		while(niveau>0)
		{
			var pour = getSortComp("Attaque Précise",niveau);
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
		//str += "\nAttaque Précise : Touché "+(Math.round(chanceDeTouche*100)/100)+"% Critique "+(Math.round(chanceDeCritique*100)/100)+"% Dégâts "+Math.round(degats*100)/100;
		listeAttaques.push(new Array("Attaque Précise",chanceDEsquiveParfaite,Math.round(chanceDeTouche*100)/100,Math.round(chanceDeCritique*100)/100,Math.round(degats*100)/100,modificateurEsquive,modificateurArmure));
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
		//str += "\nCoup de Butoir : Touché "+(Math.round(chanceDeTouche*100)/100)+"% Critique "+(Math.round(chanceDeCritique*100)/100)+"% Dégâts "+Math.round(degats*100)/100;
		listeAttaques.push(new Array("Coup de Butoir",chanceDEsquiveParfaite,Math.round(chanceDeTouche*100)/100,Math.round(chanceDeCritique*100)/100,Math.round(degats*100)/100,modificateurEsquive,modificateurArmure));
	}
	listeAttaques.sort(function(a,b){var diff = parseInt(100*b[4])-parseInt(100*a[4]);if(diff==0) return parseInt(b[1])-parseInt(a[1]); return diff;});
	if(nom.toLowerCase().indexOf("mégacéphale")==-1)
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
