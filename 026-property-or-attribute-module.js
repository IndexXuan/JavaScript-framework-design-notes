/*******************************************************
    > File Name: 026-property-or-attribute-module.js
    > Author: IndexXuan
    > Mail: indexxuan@gmail.com
    > Created Time: 2015年06月17日 星期三 18时45分12秒
 ******************************************************/

/** 通常我们把对象的非函数成员叫做属性。对于元素节点来说，其属性大体分为两大类，固有属性与自定义属性
 *  固有属性一般遵循驼峰命名法，拥有默认值，并且无法删除。自定义属性是用户随意添加的键值对，由于元素节点也是
 *  一个普通的js对象，没有什么严格的访问操作，因此命名风格林林总总，值的类型也是乱七八糟。但是随意添加属性显然
 *  不安全，比如引起循环引用，因此，浏览器提供了一组API来供人们操作自定义属性，即setAttribute getAttribute removeAttribute
 *  会对属性名进行小写化处理，属性值统一转换为字符串。
 */

var el = document.createElement("div");
el.setAttribute("xxx", "1");
el.setAttribute("XxX", "2");
el.setAttribute("XXx", "3");
console.log(el.getAttribute("xxx"));
console.log(el.getAttribute("XxX"));
// ie6/7 will return 1, and others return 3

// 如何区分固有属性和自定义属性, very important and useful !!!!!!!!!!!!!!!!!!!!!!
function isAttribute(attr, host) {
	// 有些属性是特殊元素才有的，需要用到第二个参数
	host = host || document.createElement("div");
	return host.getAttribute(attr) === null && host[attr] === void 0;
}

// classList operations, based on Prototype.js
var getClass = function(ele) {
	return ele.className.replace(/\s+/, " ").split(" ");
};

var hasClass = function(ele, cls) {
	return (" " + ele.className + " ").indexOf(" " + cls + " ") > -1;
};

var addClass = function(ele, cls) {
	if (!this.hasClass(cls)) {
		ele.className += " " + cls;
	}
};

var removeClass = function(ele, cls) {
	if (hasClass(ele, cls)) {
		var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
		ele.className = ele.className.replace(reg, " ");
	}
};

var clearClass = function(ele, cls) {
	ele.className = "";
};

// mass framework classList methods
addClass: function(item) {
	if (typeof item == "string") {
		for (var i = 0, el; el = this[i++]; ) {
			if (el.nodeType === 1) {
				if (!el.className) {
					el.className = item;
				} else {
					var a = (el.className + " " + cls).match(/\S+/g);
					a.sort();
					for (var i = a.length - 1; i > 0; i--) {
						if (a[i] == a[i - 1]) {
							a.splice(i, 1);
						}
					}
					el.className = a.join(" ");
				}
			}
		}
	}
	return this;
},

removeClass: function(item) {
	if ((item && typeof item === "string") || item === void 0) {
		var classNames = (item || "").match(rnospaces), cl = classNames.length;
		for (var i = 0, node; node = this[i++]; ) {
			if (node.nodeType === 1 && node.className) {
				if (item) {
					var set = " " + node.className.match(rnospaces).join(" ") + " ";
					for (var c = 0; c < cl; c++) {
						set = set.replace(" " + classNames[c] + " ", " ");
					}
					node.className = set.slice(1, set.length - 1);
				} else {
					node.className = "";
				}
			}
		}
	}
	return this;
},

// 如果第二个参数为true，要求所有的匹配元素都拥有此类名才返回true
hasClass: function(item, every) {
	var method = every === true ? "every" : "some",
		rclass = new RegExp('(\\s|^)' + item + '(\\s|$)');
	return $.slice(this)[method](function(el) {
		return "classList" in el ? el.classList.contains(item) :
			(el.className || "").match(rclass);
	});
},

toggleClass: function(value) {
	var type = typeof value, className, i,
		classNames = type === "string" && value.match(/\S+/g) || [];
	return this.each(function(el) {
		i = 0;
		if (el.nodeType === 1) {
			var self = $(el);
			if (type == "string") {
				while ((className = classNames[i++])) {
					self[self.hasClass(className) ? "removeClass" : "addClass"](className);
				}
			} else if (type === "undefined" || type === "boolean") {
				if (el.className) {
					$._data(el, "__className__", el.className);
				}
				el.className = el.className || value === false ? "" : $._data(el, "__className__") || "";
			}
		}
	});
},

replaceClass: function(odl, neo) {
	for (var i = 0, node; node = this[i++]; ) {
		if (node.nodeType === 1 && node.className) {
			var arr = node.className.match(rnospaces), arr2 = [];
			for (var j = 0; j < arr.length; j++) {
				arr2.push(arr[j]) == old ? neo : arr[j];
			}
			node.className = arr2.join(" ");
		}
	}
	return this;
},

// Prototype.js system
/** 
 *  名字映射的发明
 *  herf src的ie处理
 *  getAttributeNode的发掘
 *  事件钩子的处理
 *  布尔属性的处理
 *  style属性的ie处理
 */

// jQuery的属性系统

// mass的属性系统

