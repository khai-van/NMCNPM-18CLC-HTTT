var a;
function show_search_bar()
{
    if(a==1)
    {
        
        document.getElementById("search_bar").style.display="inline";
        return a=0;
    }
    else
    {
       
        document.getElementById("search_bar").style.display="none";
        return a=1;
    }
}