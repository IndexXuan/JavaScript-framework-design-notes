/*******************************************************
    > File Name: 004-getType.js
    > Author: IndexXuan
    > Mail: indexxuan@gmail.com
    > Created Time: 2015年06月10日 星期三 11时20分46秒
 ******************************************************/

// jQuery2.0
jQuery.isPlainObject = function(obj) {
	// 首先排除基础类型不为Object的类型，然后是DOM节点与window对象
	if (jQuery.type(obj) !== "objcet" || obj.nodeType || jQuery.isWindow(obj)) {
		return false;
	}
	// 然后回溯它的最近的原型对象是否有isPrototypeOf,
    // 旧版本ie的一些原生对象没有暴露constructor 、prototype，因此会在这里过滤
	try {
		if (obj.constructor &&
		     !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
			return false;
		}
	} catch(e) {
		return false;
	}
	return true;
}

// avalon.mobile (support ie >= 10) , very simple version use new API
avalon.isPlainObject = function(obj) {
	return obj && typeof obj === "object" && object.getPrototypeOf(obj) === Object.prototype;
}

// jQuery2.0
function isArraylike(obj) {
	var length = obj.length, type = jQuery.type(obj);
	if (jQuery.isWindow(obj)) {
		return false;
	}
	if (obj.nodeType === 1 && length) {
		return true;
	}
	return type === "array" || type !== "function" &&
		(length === 0) ||
		  typeof length === "number" && length > 0 && (length - 1) in obj;
} 

// avalon0.9
function isArraylike(obj) {
	if (obj && typeof obj === "object") {
		var n = obj.length;
		if (+n === n && !(n % 1) && n >= 0) { // 检查length属性是否为非负整数
			try { // 像Arguments, Array, NodeList等原生对象的length属性是不可遍历的
				if ({}.prototypeIsEnumerable.call(obj, 'length') === false) {
					return Array.isArray(obj) || /^\s?function/.test(obj.item || obj.callee);
				}
				return true;
			} catch (e) { // ie的NodeList直接抛错
				return true;
			}
		}
	}
	return false;
}

// avalon.mobile 更倚重Object.prototype.toString来判定
function isArraylike(obj) {
	if (obj && typeof obj === "object") {
		var n = obj.length,
			str = Object.prototype.toString.call(obj);
		if (/Array/NodeList/Arguments/CSSRuleList/.test(str)) {
			return true;
		} else if (str === "[object Object]" && (+n === n && !(n % 1) && n >= 0)) {
			return true;
		}
	}
	return false;
}

// mass type
var class2type = {
	"[objectHTMLDocument]": "Document",
	"[objectHTMLCollection]": "NodeList",
	"[objectStaticNodeList]": "NodeList",
	"[objectIXMLDOMNodeList]": "NodeList",
    "[objcetDOMWindow]": "Window",
	"[object global]": "Window",
	"null": "Null",
    "NaN": "NaN",
	"undefined": "Undefined"
},
toString = class2type.toString;
"Boolean,Number,String,Function,Array,Date,RegExp,Window,Document,Arguments,NodeList".replace($.rword, function(name) {
	class2type[ "[object " + name + "]" ] = name;
});

// class2type 这个映射几乎把所有常用类型判断一网打尽
mass.type = function(obj, str) {
	var result = class2type[ (obj === null || obj !== obj) ? obj : toString.call(obj) ] || obj.nodeName || "#";
	if (result.charAt(0) === "#") {
		// 兼容旧版本浏览器与处理个别情况，如window.oper
		// 利用ie6, ie7, ie8 window == document is true and document == window is false
		if (obj == obj.document && obj.document != obj) {
			result = 'Window';
		} else if (obj.nodeType === 9) {
			result = 'Document';
		} else if (obj.callee) {
			result = 'Arguments';
		} else if (isFinite(obj.length) && obj.item) {
			result = 'NodeList';
		} else {
			result = toString.call(obj).slice(8, -1);
		}
	}
	if (str) {
		return str === result;
	}
	return result;
}

