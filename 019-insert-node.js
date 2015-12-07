/*******************************************************
    > File Name: 019-insert-node.js
    > Author: IndexXuan
    > Mail: indexxuan@gmail.com
    > Created Time: 2015年06月16日 星期二 10时16分00秒
 ******************************************************/

// 为了提高性能，合理利用高级API, mass做法是能用createContextualFragment就用，否则
// 尝试insertAdjacentHTML，不行就只能转换文档碎片，通过apendChild, insertBefore插入
// 里面分支复杂，所以我们必须搞个适配器，合理分流

// mass framework implement
"append,prepend,before,after,replace".replace($.rword, function(method) {
	$.fn[method] = function(item) {
		return manipulate(this, method, item, this.ownerDocument);
	};
	$.fn[method + "To"] = function(item) {
		$(item, this.ownerDocument)[method](this);
		return this;
	};
});

// jQuery implement
append: function() {
	return this.domManip(arguments, true, function(elem) {
		if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
			this.appendChild(elem);
		}
	});
},

prepend: function() {
	// ...
},

before: function() {
	// ...
},

after: function() {
	// ...
},

replaceWith: function() {
	// ...
},

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	repalceAll: "repalceWith",
}, function(name, original) {
	jQuery.fn[name] = function(selector) {
		var elems,
		ret = [],
			insert = jQuery(selector),
			last = insert.length - 1,
			i = 0;
		for (; i <= last; i++) {
			elems = i === last ? this : this.clone(true);
			jQuery(insert[i])[original](elems);

			// Support: QtWebKit
		    // .get() because core_push_apply(_, arraylike) throws
			core_push_apply(ret, elems.get());
		}
		return this.pushStack(ret);
	};
});

/**
 *  两者还是很相似的，都是空心化的api转移到内部方法去适配。
 *  mass使用manipulate
 */

function manipulate(nodes, name, item, doc) {
	// 我们只允许向元素内部插入东西，因此需要转换为纯正的元素节点集合
	var elems = $.filter(nodes, function(el) {
			return el.nodeType === 1;
		}),
	    handler = insertHooks[name];
	if (item.nodeType) {
		// 如果传入元素节点、文本节点或文档碎片
		insertAdjacentNode(elems, item, handler);
	} else if (typeof item === "string") {
		var fast = (name !== "replace") && $.support[adjacent] && !rnest.test(item);
		if (!fast) {
			item = $.parseHTML(item, doc);
		}
		insertAdjacentHTML(elems, item, insertHooks[name + "2"], handler);
	} else if (item.length) {
		insertAdjaceneFragment(elems, item, doc, handler);
	}
	return nodes;
}

function insertAdjacentNode(elems, item, handler) {
	for (var i = 0, el; el = elems[i]; i++) {
		handler(el, i ? cloneNode(item, true, true) : item);
	}
}

function insertAdjacentHTML(elems, item, fastHandler, handler) {
	for (var i = 0, el; el = elems[i++]; ) {
		if (item.nodeType) {
			handler(el, item.cloneNode(true));
		} else {
			fastHandler(el, item);
		}
	}
}

function insertAdjaceneFragment(elems, item, doc, handler) {
	var fragment = doc.createDocumentFragment();
	for (var i = 0, el; el = elems[i++]; ) {
		handler(el, makeFragment(item, fragment, i > 1));
	}
}

function makeFragment(nodes, fragment, bool) {
	// 只有飞NodeList的情况下才为i递增
	var ret = fragment.cloneNode(false),
		go = !nodes.item;
	for (var i = 0, node; node = nodes[i]; go && i++) {
		ret.appendChild(bool && cloneNode(node, true, true) || node);
	}
	return ret;
}

var insertHooks = {
	prepend: function(el, node) {
		el.insertBefore(node, el.firstChild);
	},
	append: function(el, node) {
		el.appendChild(node);
	},
	before: function(el, node) {
		el.parentNode.insertBefore(node, el);
	},
	after: function(el, node) {
		el.parentNode.insertBefore(node, el.nextSibling);
	},
	replace: function(el, node) {
		el.parentNode.replaceChild(node, el);
	},
	prepend2: function(el, html) {
		el[adjacent]("afterBegin", html);
	},
	append2: function(el, html) {
		el[adjacent]("beforeEnd", html);
	},
	before2: function(el, html) {
		el[adjacent]("beforeBegin", html);
	},
	after2: function(el, html) {
		el[adjacent]("afterEnd", html);
	}
};

// 强大的applyElement
if (!document.documentElement.applyElement && typeof HTMLElement !== "undefined") {
	HTMLElement.prototype.removeNode = function(deep) {
		if (this.parentNode) {
			if (!deep) {
				var fragment;
				var range = this.ownerDocument.createRange();
				range.selectNodeContents(this);
				fragment = range.extractContents();
				range.setStartBefore(this);
				range.insertNode(fragment);
				range.detach();
			}
			return this.parentNode.removeChild(this);
		}
		if (!deep) {
			var range = this.ownerDocument.createRange();
			range.selectNodeContents(this);
			range.deleteContents();
			range.detach();
		}
		return this;
	};
	HTMLElement.prototype.applyElement = function(newNode, where) {
		newNode = newNode.removeNode(false);

		switch ((where || 'outside').toLowerCase()) {
			
			case 'inside':
				var fragment;
			    var range = this.ownerDocument.createRange();
				range.selectNodeContents(this);
				range.surroundContents(newNode);
				range.detach();
				break;
			case 'outside':
				var range = this.ownerDocument.createRange();
			    range.selectNode(this);
				range.surroundContents(newNode);
				range.detach();
				break;
			default:
				throw new Error('DOMException.NOT_SUPPORT_ERR(9)');
		}

		return newNode;
	};
}

