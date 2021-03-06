﻿var pushed = false;
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
        document.getElementById("shitlist").innerHTML = document.getElementById("shitlist").innerHTML.concat('<li><a href="post.html?id=').concat(splits[0]).concat('">').concat(splits[1]).concat("</a></li>");

    } catch (err) {
        console.log("Whoops");
    }
}

var toJSON = function (cookie) {
    var output = {};
    cookie.split(/\s*;\s*/).forEach(function (pair) {
        pair = pair.split(/\s*=\s*/);
        output[pair[0]] = pair.splice(1).join('=');
    });
    return output;
}

var postcomment = function (id,column) {
	var again = window.localStorage.getItem("cancommentagain");
	if (again == null || again == "" || again == undefined) again = 0;
	var content = document.getElementById("comtent").value;
	if (content != "" && content != undefined && title != "" && title != undefined) {
		if (new Date().getTime() >= again) {
			pushed = true;
			var n = new Date().getTime() + 15000;
			window.localStorage.setItem("cancommentagain", n);
			//var cookie = toJSON(document.cookie);
			//var sess = cookie.sess;
			document.getElementById("comtent").value = "";
			var sess = window.localStorage.getItem("sess");
			var thing = new XMLHttpRequest();
			thing.open("POST", "http://api.columns.stibarc.gq/newcomment.sjs", false);
			thing.send("sess=" + sess + "&column=" + column + "&postid=" + id + "&content=" + encodeURIComponent(content).replace(/%0A/g, "%0D%0A"));
			location.reload();
		} else {
			var left = again - new Date().getTime();
			left = Math.round(left/1000);
			document.getElementById("wait").innerHTML = "Please wait " + left + " more seconds before posting again";
			document.getElementById("wait").style.display = "";
		}
	}
}

window.onload = function () {
	pushed = false;
    //var cookie = toJSON(document.cookie);
    var sess = window.localStorage.getItem("sess");
	if (sess != undefined && sess != "" && sess != null) {
        document.getElementById("postout").style.display = "none";
        document.getElementById("postin").style.display = "";
        document.getElementById("footerout").style.display = "none";
        document.getElementById("footerin").style.display = "";
    }
    var id = getAllUrlParams().id;
    var column = getAllUrlParams().column;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "http://api.columns.stibarc.gq/getpost.sjs?id="+id+"&column="+column, false);
    xmlHttp.send(null);
    var stuff = JSON.parse(xmlHttp.responseText);
    document.getElementById("title").innerHTML = stuff.title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    document.title = stuff.title + " - STiBaRC|Columns";
    document.getElementById("dateandstuff").innerHTML = 'Posted by <a href="user.html?id=' + stuff.poster + '">' + stuff.poster + "</a> at " + stuff.postdate;
    document.getElementById("content").innerHTML = stuff.content.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r\n/g, "<br/>");
    xmlHttp.open("GET", "http://api.columns.stibarc.gq/getcomments.sjs?id="+id+"&column="+column, false);
    xmlHttp.send(null);
    if (xmlHttp.responseText != "undefined\n") {
        var comments = JSON.parse(xmlHttp.responseText);
        for (var key in comments) {
            document.getElementById("comments").innerHTML = document.getElementById("comments").innerHTML + '<div id="comment"><a href="user.html?id=' + comments[key]['poster'] + '">' + comments[key]['poster'] + '</a><br/>' + comments[key]['content'].replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r\n/g, "<br/>") + '</div><br/>';
        }
    } else {
        document.getElementById("comments").innerHTML = document.getElementById("comments").innerHTML + '<div id="comment">No comments</div>';
    }
    document.getElementById("commentbutton").onclick = function (evt) {
		if (!pushed) {
			postcomment(id,column);
		}
    }
}