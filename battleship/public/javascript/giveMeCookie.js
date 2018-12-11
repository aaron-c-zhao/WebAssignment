document.cookie = "vistTimes=0";

var cookieArray = document.cookie.split('; ');
var cookies={};


for(var i = 0; i < cookieArray.length; i++){
    var cookie = cookieArray[i].split("=")
    cookies[cookie[0]]=cookie[1];
}


var visitTimes = parseInt(cookies["vistTimes"]);
visitTimes++;
var stringVisitTimes = visitTimes.toString();

document.cookie = "vistTimes" + "=" + stringVisitTimes + ";";
