//<![CDATA[
var dxComm = {
    //실행목록
    runAfter : function(){
        dxComm.dxLoadHTML();
    },
    //htmlLoad
    dxLoadHTML : function(){
        var z, i, elmnt, file, xhttp;
        /*loop through a collection of all HTML elements:*/
        z = document.getElementsByTagName("div");
        for (i = 0; i < z.length; i++) {
            elmnt = z[i];
            /*search for elements with a certain atrribute:*/
            file = elmnt.getAttribute("data-dx-load");
            if (file) {
                /*make an HTTP request using the attribute value as the file name:*/
                xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4) {
                        if (this.status == 200) {elmnt.innerHTML = this.responseText;}
                        if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
                        /*remove the attribute, and call this function once more:*/
                        elmnt.removeAttribute("data-dx-load");
                        elmnt.setAttribute("data-dx-loaded",file);
                        dxComm.dxLoadHTML();
                    }
                }      
                xhttp.open("GET", file, true);
                xhttp.send();
                /*exit the function:*/
                return;
            }
        }
    }
    //다음기능
}

//document.load
$(function(){
    dxComm.runAfter(); 
})
var rvURL = ['/pconts/html/benefit/main/main.html', '/pconts/html/topsClub/main/main.html', '/mob/MOBFM12101N/MOBFM12101R01.shc' ,'/pconts/html/card/main/main.html' , '/pconts/html/life/main/main.html' , '/mob/MOBFM006N/MOBFM006R01.shc' , '/mob/MOBFM006N/MOBFM006R02.shc']
for(var jj=0;jj<rvURL.length;jj++){  
  if(document.URL.match(rvURL[jj])){
    $('html').addClass('rv-22')                                 
  }
}
//]]>