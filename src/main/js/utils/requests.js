export function get(url,callback){
    let xhr = new XMLHttpRequest();
    xhr.open("GET",url,true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if(xhr.readyState !== 4)
            return;
        callback(xhr.responseText, xhr.status, xhr.statusText);
    }
}


