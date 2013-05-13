<!-- dissimulation du contenu du SCRIPT pour les anciens browsers


function Enter(Cible,Largeur,Hauteur)
{
	Divers = window.open("","Divers",'width=' + Largeur + ',height=' + Hauteur + ',toolbar=0,location=0,directories=0,status=0,menubar=0,resizable=1,scrollbars=1');
	Divers.location = Cible;
	Divers.focus();
}

function EnterPJView(IdCible,Largeur,Hauteur)
{
	DetailView = window.open("","DetailView",'width=' + Largeur + ',height=' + Hauteur + ',toolbar=0,location=0,directories=0,status=0,menubar=0,resizable=1,scrollbars=1');
	DetailView.location = "/mountyhall/View/PJView.php?ai_IDPJ=" + IdCible;
	DetailView.focus();
}
function EnterMonsterView(IdCible,Largeur,Hauteur)
{
	DetailView = window.open("","DetailView",'width=' + Largeur + ',height=' + Hauteur + ',toolbar=0,location=0,directories=0,status=0,menubar=0,resizable=1,scrollbars=1');
	DetailView.location = "/mountyhall/View/MonsterView.php?ai_IDPJ=" + IdCible;
	DetailView.focus();
}
function EnterMonsterTypeView(IdCible,Largeur,Hauteur)
{
	DetailView = window.open("","DetailView",'width=' + Largeur + ',height=' + Hauteur + ',toolbar=0,location=0,directories=0,status=0,menubar=0,resizable=1,scrollbars=1');
	DetailView.location = "/mountyhall/View/MonsterView2.php?IDMo=" + IdCible;
	DetailView.focus();
}
function EnterAllianceView(IdCible,Largeur,Hauteur)
{
	DetailView = window.open("","DetailView",'width=' + Largeur + ',height=' + Hauteur + ',toolbar=0,location=0,directories=0,status=0,menubar=0,resizable=1,scrollbars=1');
	DetailView.location = "/mountyhall/View/AllianceView.php?ai_IDAlliance=" + IdCible;
	DetailView.focus();
}
function EnterCarteLaby(Largeur,Hauteur)
{
	DetailView = window.open("","DetailView",'width=' + Largeur + ',height=' + Hauteur + ',toolbar=0,location=0,directories=0,status=0,menubar=0,resizable=1,scrollbars=1');
	DetailView.location = "/mountyhall/View/CarteLabyView.php";
	DetailView.focus();
}
function EnterComp(IdComp)
{
	Enter('http://www.mountyhall.com/MH_Rules/Competences/Competence_Desc.php?ai_IDComp=' + IdComp,600,500)
}
function EnterSort(IdSort)
{
	Enter('http://www.mountyhall.com/MH_Rules/Sorts/Sort_Desc.php?ai_IDSort=' + IdSort,600,500)
}

// Alias pour gain de BP :

function EAV(IdCible)
{
	EnterAllianceView(IdCible,750,550)
}
function EPV(IdCible)
{
	EnterPJView(IdCible,750,550)
}
function EMV(IdCible)
{
	EnterMonsterView(IdCible,750,550)
}
function EMTV(IdCible)
{
	EnterMonsterTypeView(IdCible,750,550)
}
function CLABY()
{
	EnterCarteLaby(750,550)
}


// fin de dissimulation du contenu du SCRIPT pour les anciens browsers -->
