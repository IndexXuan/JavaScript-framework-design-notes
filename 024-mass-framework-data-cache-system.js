/*******************************************************
    > File Name: 024-mass-framework-data-cache-system.js
    > Author: IndexXuan
    > Mail: indexxuan@gmail.com
    > Created Time: 2015年06月17日 星期三 10时17分19秒
 ******************************************************/

// 与jQuery关联方式不同，为了建立目标对象与缓存体的联系，jQuery选择了目标对象添加一个自定义属性，结果在旧版
// ie遭遇阻击，被逼祭出noData。mass挖掘了元素节点的uniqueNumber属性，这是ie的私有实现，不过用于对付旧版ie的
// object，applet，embed标签够了。标准浏览器很好打发，这样添加自定义属性，取得uuid值的操作封装在mass.js的getUid
getUid: global.getComputedStyle ? function(obj) { // ie9+ modern browsers
	return obj.uniqueNumber || (obj.uniqueNumber = NsVal.uuid++);
} : function(obj) {
	if (obj.nodeType !== 1) {
		return obj.uniqueNumber || (obj.uniqueNumber = NsVal.uuid++);
	} 
	var uid = obj.getAttribute("uniqueNumber", uid);
	if (!uid) {
		uid = NsVal.uuid++;
		obj.setAttribute("uniqueNumber", uid);
	}
	return +uid;
}

// 略...

// New Way WeakMap, 天生为缓存系统打造的，普通的对象只能key是字符串，value无所谓，而WeakMap是要不是null,都可以作为
// key,同时key-value是若引用，删除键名，对应的缓存体也会自动被清除出WeakMap。
var map = new WeakMap(), el = document.body;
map.set(el, {data: {}}); // 设置新键值对
var value = map.get(el); // read
console.log(value); 
console.log(map.has(el));
map.delete(el);

define("data", ["lang"], function($) {
	var caches = new WeakMap;
	function innerData(owner, name, data, pvt) {
		var table = caches.get(owner);
		if (!table) {
			table = {
				data: {}
			}
			caches.set(table);
		}
		// ...
	}
	function innerRemoveData(owner, name, pvt) {
		var table = caches.get(owner);
		if (!table) {
			return;
		}
		// ...
	}

	$.mix({
		hasData: function(target) {
			return caches.has(target);
		},
		data: function(target, name, data) {
			return innerData(target, name, data);
		},
		_data: function(target, name, data) {
			return innerData(target, name, data, true);
		},
		removeData: function(target, name) {
			return innerRemoveData(target, name);
		},
		_removeData: function(target, name) {
			return innerRemoveData(target, name, true);
		},
		parseData: function(target, name, table, value) {
			// ...
		},
		mergeData: function(cur, src) {
			// ...
		}
	});
});

/** 
 *  说到底，数据缓存就是在目标对象与缓存体之间建立一对一的关系，然后在缓存体上操作数据，
 *  复杂度都集中在前者，从软件设计原则上看，这也是最好的结果（吻合KISS原则和单一职责原则）
 */

