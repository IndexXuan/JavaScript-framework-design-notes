/*******************************************************
    > File Name: 017-create-node.js
    > Author: IndexXuan
    > Mail: indexxuan@gmail.com
    > Created Time: 2015年06月15日 星期一 22时58分54秒
 ******************************************************/

// browsers have their own way to create node, such as document.createElement, it will return the tag you pass to it
// and even the not supported one. Luckly, this feature become the last way to make old ie support the html5 new tags!

function createNamedElement(type, name) {
	var element = null;
	try {
		element = document.createElement('<' + type + ' name="' + name + '">');
	} catch (e) {
	}
	if (!element || element.nodeName !== type.toUpperCase()) {
		// Non-ie browser; use canonical method to create named element
		element = document.createElement(type);
		element.name = name;
	}
	return element;
}

// innerHTML is a very magic and powful method, it is 2 - 10 times faster than createElement and can create many tags
// at the same time. Though is a private method in ie and become public in all browsers. ie will trimLeft and firefox 
// will do what the user input.
//
// some info
// 1. some element is readOnly in ie and rewrite innerHTML will throw error. this make us use appendChild and insertBefore
// 2. ie's innerHTML will ignore the no-scope element, including comment, style, script, link, meta, noscript and so on.
// 3. innerHTML will not exec the script inner it and jQuery use regexp to get the script and eval it in global
//    and mass get the script and inject it into a script(create script elements and done)
// 4. some elements cannot be a seperate element inner div such as td, th and so on. innerHTML them will not work and 
//    just became a comomon textNode.
//
//    insertAdjacentHTML, another ie method to popular in all browsers, very powful and you can choose where to insert.
//    beforeBegin, afterBegin, beforeEnd, afterEnd

// jquery new 
function $(a, b) { // first constructor
	return new $.fn.init(a, b); // second constructor
}
// put the prototype object to a short-named property-name
// very comfortable to extend the prototype
$.fn = $.prototype = {
	init: function(a, b) {
		this.a = a;
		this.b = b;
	}
}
// share prototype
$.fn.init.prototype = $.fn;
var a = $(1, 2);
console.log(a instanceof $);
console.log(a instanceof $.fn.init);

// another non-new factory, not support ie <= 10, use __proto__
var $ = function(expr, context) {
	// this dom real array is selected by selector or domParser, typeof of nodeList
	var dom = [];
	return DomArray(dom, expr, context);
}
// DomArray is a inner method
function DomArray(dom, expr, context) {
	dom = dom || [];
	dom.context = context;
	dom.expr = expr;
	dom.__proto__ = DomArray.prototype; // important
	return dom;
}
DomArray.prototype = $.fn = []; // important, aim to use Array's method
$.fn.get = function() { // add prototype method
	console.log(this.expr);
}
var a = $("div");
a.push("a", "b", "c");
a.get(); // div
console.log(a.length); // 3
a.forEach(function(i) {
	console.log(i); // one by one, a, b, c
});

$.fn.extend({
	init: function(expr, context) {
		// 1: deal with "" null, undefined
		if (!expr) {
			return this;
		}
		// 2: make $ the same with element to has the property of ownerDocument
	    var doc, nodes; // start of nodeList search
		if ($.isArrayLike(context)) { // typeof context === "string" 
			return $(context).find(expr);
		}

		if (expr.nodeType) { // 3: deal with node arguments
			this.ownerDocument = expr.nodeType === 9 ? expr : expr.ownerDocument;
			return $.Array.merge(this, [expr]);
		}
		this.selector = expr + "";
		if (typeof expr === "string") { // 4: deal with css3 selector
			doc = this.ownerDocument = !context ? document : getDoc(context, context[0]);
			var scope = context || doc;
			expr = expr.trim();
			if (expr.charAt(0) === "<" && expr.charAt(expr.length - 1) === ">" && expr.length >= 3) {
				nodes = $.parseHTML(expr, doc); // 5: generate the node
				nodes = nodes.childNodes;
			} else if (rtag.test(expr)) { // 6: getElementsByTagName
				nodes = $.query(expr, scope);
			} else { // 7: into selector module
				this.ownerDocument = getDoc(expr[0]);
				$.Array.merge(this, $.isArrayLike(expr) ? expr : [expr]);
				delete this.selector;
			}
		},
	},
	mass: $.mass,
	length: 0,
	valueOf: function() { // transform to pure Array
		return Array.prototype.slice.call(this);
	},
	size: function() {
		return this.length;
	},
	toString: function() { // collect the tagName property, make pure Array and return
		var i = this.length,
			ret = [],
			getType = $.type;
		while (i--) {
			ret[i] = getType(this[i]);
		}
		return ret.join(", ");
	},
	labor: function(nodes) { 
		var neo = new $;
		neo.context = this.context;
		neo.selector = this.selector;
		neo.ownerDocument = this.ownerDocument;
		return $.Array.merge(neo, nodes || []);
	},
	slice: function(a, b) {
		return this.labor($.slice(this, a, b));
	},
	get: function(num) {
		return !arguments.length ? this.valueOf() : this[num < 0 ? this.length + num : num];
	},
	eq: function(i) {
		return i === -1 ? this.slice(i) : this.slice(i, +i + 1);
	},
	gt: function(i) {
		return this.slice(i + 1, this.length);
	},
	lt: function(i) {
		return this.slice(0, i);
	},
	first: function() {
		return this.slice(0, 1);
	},
	last: function() {
		return this.slice(-1);
	},
	even: function() {
		return this.labor($.filter(this, function(_, i) {
			return i % 2 === 0;
		}));
	},
	odd: function() {
		return this.labor($.filter(this, functin(_, i) {
			return i % 2 === 1;
		}));
	},
	each: function(fn) {
		return $.each(this, fn);
	},
	map:function(fn) {
		return this.labor($.map(this, fn));
	},
	clone: function(dataAndEvents, deepDataAndEvnets) {
		// ...
	},
	html: function(item) {
		// ...
	},
	text: function(item) {
		// ...
	},
	outerHTML: function(item) {
		// ...
	}
});
$.fn.init.prototype = $.fn;
"push,unshift,pop,shift,splice,sort,reverse".replace($.rword, function(method) {
	$.fn[method] = function() {
		Array.prototype[method].apply(this, arguments);
		return this;
	}
});

/**
 *  $(selector[, context]);
 *  $(element);
 *  $(elementArray);
 *  $(object);
 *  $(jQuery object);
 *  $()
 *  $(html[, ownerDocument]);
 *  $(html, attributes);
 *  $(callback);
 *  three parts: selector, domParser, domReady
 */

