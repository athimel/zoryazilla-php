function affichDetailTr(objectToMask)
{
    if(document.getElementById(objectToMask).style.display == 'none')
    	document.getElementById(objectToMask).style.display = 'table-row';
    else
        document.getElementById(objectToMask).style.display = 'none';
}
function affichDetailDiv(objectToMask)
{
    if(document.getElementById(objectToMask).style.display == 'none')
    	document.getElementById(objectToMask).style.display = 'block';
    else
        document.getElementById(objectToMask).style.display = 'none';
}
function afficheDetailTrPlus(objectToMask,plusToMask)
{
    affichDetailTr(objectToMask);
    changePlus(objectToMask,plusToMask);
}
function afficheDetailDivPlus(objectToMask,plusToMask)
{
    affichDetailDiv(objectToMask);
    changePlus(objectToMask,plusToMask);
}
function changePlus(objectToMask,plusToMask)
{
    if(document.getElementById(objectToMask).style.display == 'none')
        document.getElementById(plusToMask).innerHTML = '[+]';
    else
        document.getElementById(plusToMask).innerHTML = '[-]';
}