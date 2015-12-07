/*******************************************************
    > File Name: 021-remove-node.js
    > Author: IndexXuan
    > Mail: indexxuan@gmail.com
    > Created Time: 2015年06月16日 星期二 16时14分51秒
 ******************************************************/

/** browser supply many method to remove node, including removeChild, removeNode, generate the node or fragment
 * and appendChild, create Range object and select target node then to deleteContents
 */

// EXT
var removeNode = IE6 || IE7 ? function() {
		var d; // how to detact ie6/7, do yourself
		return function(node) {
			if (node && node.tagName != 'BODY') {
				d = d || document.createElement('DIV');
				d.appendChild(node);
				d.innerHTML = '';
			}
		}
	}() : function(node) {
		if (node && ndoe.parentNode && node.tagName != 'BODY') {
			node.parentNode.removeChild(node);
		}
	}

// old ie has many problem and GC is very bad. we need to remove thorough.
// jQuery is not very fast in this respect and so it put eye on apis and make it easy to use
"remove,empty,detach".replace($.rword, function(method) {
	$.fn[method] = function() {
		var isRemove = method !== "empty";
		for (var i = 0, node; node = this[i++]; ) {
			if (node.nodeType === 1) {
				// remove match element
				var array = $.slice(node[TAGs](*)).concat(isRemove ? node : []);
				if (method !== "detach") {
					array.forEach(cleanNode);
				}
			}
			if (isRemove) {
				if (node.parentNode) {
					node.parentNode.removeChild(node);
				}
			} else {
				while (node.firstChild) {
					node.removeChild(node.firstChild);
				}
			}
		}
		return this;
	}
});

// modern browser way
function clearChild(node) { // node is element or fragment
    while (node.firstChild) {
		node.removeChild(node.firstChild);
	}
	return node;
}

// v2
var deleteRange = document.createRange();
function clearChild(node) {
	deleteRange.setStartBefore(node.firstChild);
	deleteRange.setEndAfter(node.lastChild);
	deleteRange.deleteContents();
	return node;
}

// v3
function clearChild(node) {
	node.textContent = "";
	return node;
}

