﻿var column = 1;
function getAllUrlParams(url) {
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
    var obj = {};
    if (queryString) {
        queryString = queryString.split('#')[0];
        var arr = queryString.split('&');
        for (var i = 0; i < arr.length; i++) {
            var a = arr[i].split('=');
            var paramNum = undefined;
            var paramName = a[0].replace(/\[\d*\]/, function (v) {
                paramNum = v.slice(1, -1);
                return '';
            });
            var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
            paramName = paramName;
            paramValue = paramValue;
            if (obj[paramName]) {
                if (typeof obj[paramName] === 'string') {
                    obj[paramName] = [obj[paramName]];
                }
                if (typeof paramNum === 'undefined') {
                    obj[paramName].push(paramValue);
                }
                else {
                    obj[paramName][paramNum] = paramValue;
                }
            }
            else {
                obj[paramName] = paramValue;
            }
        }
    }
    return obj;
}

var toLink = function (item) {
    try {
        var i = item.indexOf(':');
        var splits = [item.slice(0, i), item.slice(i + 1)];
        document.getElementById("shitlist").innerHTML = document.getElementById("shitlist").innerHTML.concat('<li><a href="post.html?id=').concat(splits[0]).concat("&column=").concat(column).concat('">').concat(splits[1]).concat("</a></li>");

    } catch (err) {
        console.log("Whoops");
    }
}

var toJSON = function(cookie) {
    var output = {};
    cookie.split(/\s*;\s*/).forEach(function (pair) {
        pair = pair.split(/\s*=\s*/);
        output[pair[0]] = pair.splice(1).join('=');
    });
    return output;
}

var checkId = function () {
	var id = window.localStorage.getItem("appID");
	if (id == null || id == "" || id == undefined) {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open("GET", "https://api.stibarc.gq/getappid.sjs", false);
		xmlHttp.send(null);
		window.localStorage.setItem("appID", xmlHttp.responseText);
	}
}

var refresh = function() {
    var offline = false;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "http://api.columns.stibarc.gq/getposts.sjs?column="+column, false);
    try {
        xmlHttp.send(null);
    } catch (err) {
        offline = true;
    }
    if (!offline) {
	checkId();
        var tmp = xmlHttp.responseText.split("\n");
        document.getElementById("shitlist").innerHTML = "";
        for (i = 0; i < tmp.length - 1; i++) {
            toLink(tmp[i]);
        }
    } else {
        document.getElementById("shitlist").innerHTML = "Error loading posts. Device offline.";
    }
}

var changecolumn = function(thing) {
	column = thing;
	refresh();
}

window.onload = function () {
    var offline = false;
    //var cookie = toJSON(document.cookie);
    var sess = window.localStorage.getItem("sess");
    if (sess != undefined && sess != null && sess != "") {
        document.getElementById("loggedout").style.display = "none";
        document.getElementById("loggedin").style.display = "";
        document.getElementById("footerout").style.display = "none";
        document.getElementById("footerin").style.display = "";
    }
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "http://api.columns.stibarc.gq/getposts.sjs?column="+column, false);
    try {
        xmlHttp.send(null);
    } catch (err) {
        offline = true;
    }
    if (!offline) {
	checkId();
        var tmp = xmlHttp.responseText.split("\n");
        document.getElementById("shitlist").innerHTML = "";
        for (i = 0; i < tmp.length - 1; i++) {
            toLink(tmp[i]);
        }
    } else {
        document.getElementById("shitlist").innerHTML = "Error loading posts. Device offline.";
    }
}