declare var marked: any;
declare var checkLoad: any;
declare var bookNum: string;

addEventListener("DOMContentLoaded", (event) => {
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

	checkLoad()
});
addEventListener("hashchange", (event) => {
	loadPage(location.hash)
})
function loadPage(hash:string){
	$ajaxUtils.sendGetRequest("/pages/"+ bookNum + "/" + hash.substring(1) + ".md", (response:XMLHttpRequest) => {
		let markdown = response.responseText;
		document.getElementById("content").innerHTML = parseMarkdown(markdown);
	});	document.getElementById("content");
}
function parseMarkdown(markdownText:string):string {
	console.log(markdownText)
	const htmlText = marked.parse(markdownText);
	console.log(htmlText);


	return htmlText.trim()
}

function main() {
	// render hash is necessary
	if (location.hash != "" && location.hash != "#") {
		loadPage(location.hash)
	}
	else {
		loadPage("#000")
	}
}