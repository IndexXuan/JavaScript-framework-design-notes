/*******************************************************
    > File Name: 013-class-factory.js
    > Author: IndexXuan
    > Mail: indexxuan@gmail.com
    > Created Time: 2015年06月11日 星期四 19时06分56秒
 ******************************************************/

function A() {

}

A.prototype = {
	aa: "aa",
	method: function() {

	}
};
var a = new A;
var b = new A;
console.log(a.aa === b.aa); // true
console.log(a.method === b.method); // true

// we always put shared method or props in prototype
function A() {
	var count = 0;
	this.aa = "aa";
	this.method = function() {
		return count;
	}
	this.obj = {};
}

A.prototype = {
	aa: "aa",
	method: function() {

	}
};
var a = new A;
var b = new A;
console.log(a.aa === b.aa); // true
console.log(a.obj === b.obj); // false, will created every time when invoked
console.log(a.method === b.method); // false

// lots of stuff was hard to express and learn it myself and use them in real project ~

