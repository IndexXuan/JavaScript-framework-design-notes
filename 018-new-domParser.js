/*******************************************************
    > File Name: 018-new-domParser.js
    > Author: IndexXuan
    > Mail: indexxuan@gmail.com
    > Created Time: 2015年06月16日 星期二 09时59分57秒
 ******************************************************/

var TABLE = document.createElement("table");
var TR = document.createElement("tr");
var SELECT = document.createElement("select");
var tagHooks = {
	option: SELECT,
	thead: TABLE,
	tfoot: TABLE,
	tbody: TABLE,
	td: TR,
	th: TR,
	tr: document.createElement("tbody"),
	col: document.createElement("colgroup"),
	legend: document.createElement("fieldset"),
	"*": document.createElement("div")
};
var rparse = /^\s*<(\w+|!)[^>]*>/;
// 在DomArray的构造器中调用
if (rparse.test(expr)) {
	var html = expr.trim();
	var tag = RegExp.$1;
	dom = $.parseHTML(html, tag);
}

$.parseHTML = function(html, tag) {
	var parent;
	if (tag == null) {
		tag = "*";
	} else if (!(tag in tagHooks)) {
		tag = "*";
	}
    parent = tagHooks(tag);
	parent.innerHTML = "" + html;
	// 这里尝试处理script节点
	return [].slice.call(parent.childNodes);
}

