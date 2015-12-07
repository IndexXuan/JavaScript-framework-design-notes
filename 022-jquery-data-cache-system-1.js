/*******************************************************
    > File Name: 022-data-cache-system.js
    > Author: IndexXuan
    > Mail: indexxuan@gmail.com
    > Created Time: 2015年06月16日 星期二 16时50分33秒
 ******************************************************/

/** data cache in jQuery */
/* first generation v1.2.3 */
var expando = "jQuery" + (new Date()).getTime(), uuid = 0, windowData = {};
jQuery.extend({
	cache: {},
    data: function(elem, name, data) {
		elem = elem == window ? windowData : elem; // deal with window specially
		var id = elem[expando];
		if (!id) {
			id = elem[expando] = ++uuid;
		}
		// if no cache, create it in pool
		if (name && !jQuery.cache[id]) {
			jQuery.cache[id] = {};
		}
		// third param is not undefined, mean write
		if (data != undefined) {
			jQuery.cache[id][name] = data;
		}
		return name ? jQuery.cache[id][name] : id;
	},

	removeData: function(elem, name) {
		elem = elem == window ? windowData : elem;
		var id = elem[expando];
		if (name) { // remove target data
			if (jQuery.cache[id]) {
				delete jQuery.cache[id][name];
				name = "";

				for (name in jQuery.cache[id]) {
					break;
				}
				if (!name) {
					jQuery.removeData(elem);
				}
			}
		} else {
			// remove uuid, but ie will throw error then delete element
			try {
				delete elem[expando];
			} catch (e) {
				if (elem.removeAttribute) {
					elem.removeAttribute(expando);
				}
			}
			delete jQuery.cache[id];
		}
	}
});

// jQuery1.3
jQuery.extend({
	queue: function(elem, type, data) {
		if (elem) {
			type = (type || "fx") + "queue";
			var q = jQuery.data(elem, type);
			if (!q || jQuery.isArray(data)) {
				q = jQuery.data(elem, type, jQuery.makeArray(data));
			} else if (data) {
				q.push(data);
			}
		}
		return q;
	},
	dequeue: function(elem, type) {
		var queue = jQuery.queue(elem, type),
			fn = queue.shift();
		if (!type || type === "fx") {
			fn = queue[0];
		}
		if (fn !== undefined) {
			fn.call(elem);
		}
	}
});

// jQuery1.43 $.fn.data
var rbrace = /^(?:\{.*\}|\[.*\])$/;
if (data === undefined && this.length) {
	data = jQuery.data(this[0], key);
	if (data === undefined && this[0].nodeType === 1) {
		data = this[0].getAttribute("data-" + key);
		if (typeof data === "String") {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					!jQuery.isNaN(data) ? parseFloat(data) :
					rbrace.test(data) ? jQuery.parseJSON(data) :
					data;
			} catch (e) {
			}
		} else {
			data = undefined;
		}
	}
}

