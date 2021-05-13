

$(document).ready(function(){
    $('.box_user').mouseover(show_table_login_sigin);
    $('.table_login_sigin').mouseover(show_table_login_sigin);
    $('.box_user').mouseout(hide_table_login_sigin);

    // $('.navbar-expand-lg').click(hide_search);
    $('#content').click(hide_search);
    $('#footer').click(hide_search);

});

function show_table_login_sigin()
{
    $('.table_login_sigin').show();
}

function hide_table_login_sigin()
{
    $('.table_login_sigin').hide();
}
    
function hide_search()
{
    $('#search_bar').hide();
}



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









