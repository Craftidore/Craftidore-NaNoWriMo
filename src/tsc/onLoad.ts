((global:any) => {
    const autoLoadStory = "01";
    const book = "book";
    let vars = new URLSearchParams(location.search);
    global.loadSteps = 0;
    if (!vars.has(book)) {
        resetURL()
    } else {
        global.bookNum = vars.get(book);
        loadData();
    }
    function resetURL() {
        let newVars = new URLSearchParams();
        newVars.set(book, autoLoadStory);
        location.search = newVars.toString();
    }
    function loadData() {
        $ajaxUtils.sendGetRequest("pages/" + global.bookNum + "/data.json", setData)
    }
    function setData(response:XMLHttpRequest) {
        console.log("Setting data");
        global.checkLoad();
        let data:bookData = JSON.parse(response.response);
        document.getElementById("title").innerHTML = data.title;
        document.getElementsByTagName("title")[0].innerHTML = data.title;
        document.getElementById("sidebar").innerHTML = constructSidebar(data.pages);
        document.getElementById("bookStyles").setAttribute('href', "src/css/" + data.styles);
    }
    function constructSidebar (data:Array<linkData>):string {
        let finalHTML:string = "<ul>"
        data.forEach((item) => {
            finalHTML += "<a href=\"#" + item.hash + "\"><li>" + item.name + "</li></a>";
        });
        finalHTML += "</ul>";
        return finalHTML;
    }
    global.checkLoad = function () {//This should get called *exactly twice* and only do things on the second time
        global.loadSteps++;
        if (global.loadSteps === 2) {
            main();
        }
    }
})(window)

class bookData {
    title: string;
    pages: Array<linkData>;
    styles: string;
}
class linkData {
    name: string;
    hash: string;
}