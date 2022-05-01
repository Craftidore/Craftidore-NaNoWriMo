// Set up a namespace for our utility
var $ajaxUtils = new Object();
// Returns an HTTP request object
function getRequestObject() {
    if (window.XMLHttpRequest) {
        // Most current ajax object.
        return (new XMLHttpRequest());
    }
    else if (window.ActiveXObject) {
        // For very old IE browsers (optional)
        return (new ActiveXObject("Microsoft.XMLHTTP"));
    }
    else {
        window.alert("Ajax is not supported!");
        return (null);
    }
}
// Makes an Ajax GET request to 'requestUrl'
$ajaxUtils.sendGetRequest =
    function (requestUrl, responseHandler) {
        var request = getRequestObject();
        request.onreadystatechange =
            function () {
                handleResponse(request, responseHandler);
            }; // This function will get called when anything changes. We don't want to make request and responseHandler window, as ajax works asynchronously. 
        request.open("GET", requestUrl, true); // GET request, with the given url, and the boolean says "yes, this should be async"
        request.send(null); // for POST only
    };
// Only calls user provided 'responseHandler'
// function if response is ready
// and not an error
function handleResponse(request, responseHandler) {
    if ((request.readyState == 4) && // There are many ready states (I think 4). We want to be on '4'
        (request.status == 200)) {
        responseHandler(request);
    }
}
addEventListener("DOMContentLoaded", function (event) {
    // set marked settings
    marked.use({
        pedantic: false,
        gfm: true,
        breaks: false,
        sanitize: false,
        smartLists: true,
        smartypants: false,
        xhtml: false
    });
    checkLoad();
});
addEventListener("hashchange", function (event) {
    loadPage(location.hash);
});
function loadPage(hash) {
    $ajaxUtils.sendGetRequest("/pages/" + bookNum + "/" + hash.substring(1) + ".md", function (response) {
        var markdown = response.responseText;
        document.getElementById("content").innerHTML = parseMarkdown(markdown);
    });
    document.getElementById("content");
}
function parseMarkdown(markdownText) {
    console.log(markdownText);
    var htmlText = marked.parse(markdownText);
    console.log(htmlText);
    return htmlText.trim();
}
function customMarkdownRegex(markdownText) {
    var partHTMLText = markdownText;
    return markdownText;
}
function main() {
    // render hash is necessary
    if (location.hash != "" && location.hash != "#") {
        loadPage(location.hash);
    }
    else {
        loadPage("#Home");
    }
}
(function (global) {
    var autoLoadStory = "01";
    var book = "book";
    var vars = new URLSearchParams(location.search);
    global.loadSteps = 0;
    if (!vars.has(book)) {
        resetURL();
    }
    else {
        global.bookNum = vars.get(book);
        loadData();
    }
    function resetURL() {
        var newVars = new URLSearchParams();
        newVars.set(book, autoLoadStory);
        location.search = newVars.toString();
    }
    function loadData() {
        $ajaxUtils.sendGetRequest("pages/" + global.bookNum + "/data.json", setData);
    }
    function setData(response) {
        console.log("Setting data");
        global.checkLoad();
        var data = JSON.parse(response.response);
        document.getElementById("title").innerHTML = data.title;
        document.getElementsByTagName("title")[0].innerHTML = data.title;
        document.getElementById("sidebar").innerHTML = constructSidebar(data.pages);
        document.getElementById("bookStyles").setAttribute('href', "src/css/" + data.styles);
    }
    function constructSidebar(data) {
        var finalHTML = "<ul>";
        data.forEach(function (item) {
            finalHTML += "<a href=\"#" + item.hash + "\"><li>" + item.name + "</li></a>";
        });
        finalHTML += "</ul>";
        return finalHTML;
    }
    global.checkLoad = function () {
        global.loadSteps++;
        if (global.loadSteps === 2) {
            main();
        }
    };
})(window);
var bookData = /** @class */ (function () {
    function bookData() {
    }
    return bookData;
}());
var linkData = /** @class */ (function () {
    function linkData() {
    }
    return linkData;
}());
//# sourceMappingURL=main.js.map