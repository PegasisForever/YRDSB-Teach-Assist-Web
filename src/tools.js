let net={}
net.post=function (url,data,callback) {
    const xmlhttp=new XMLHttpRequest();
    xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState===4){
            callback(xmlhttp.status,xmlhttp.responseText)
        }
    }
    xmlhttp.open("POST",url,true);
    xmlhttp.setRequestHeader("Content-type","application/json");
    xmlhttp.send(JSON.stringify(data));
}

export default net

export function isMobile() {
    return false
}

export function safeDiv(a,b) {
    return a > 0.0 ? (a / b) : 0.0
}