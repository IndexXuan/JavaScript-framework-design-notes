/*******************************************************
    > File Name: 023-jquery-data-cache-system-2.js
    > Author: IndexXuan
    > Mail: indexxuan@gmail.com
    > Created Time: 2015年06月17日 星期三 08时56分55秒
 ******************************************************/

/** 作者Rick Waldron,六个目标：
 *  1. 在接口与语义上兼容1.9.x分支
 *  2. 通过简化存储路径为统一的方式提高维护性
 *  3. 使用相同的机制来实现“私有”与“用户”数据
 *  4. 不再把私有数据与用户数据混在一起
 *  5. 不再在用户对象上添加自定义属性
 *  6. 方便以后可以平滑的利用WeakMap对象进行升级（WeakMap大致在2014年底完成标准化）
 */

// override valueOf method to fulfill the target and deal with some special element
function Data() {
	this.cache = {};
}

Data.uid = 1;

Data.prototype = {
	locker: function(owner) {
		var ovalueOf,
		// owner is a element node or document object or window
		// check whether valueOf is overrided, pass the element(Data), if return "object", then no override
		// others, return "string", is overrided!
		// this string is the UUID, to create cache object in the cache repo.
	    unlock = owner.valueOf(Data);
		// this version jQuery not support ie6-8, so can use Object.defineProperty, and not wish others to rewrite 
		// or reconfig, this process is called unlock and in the great gate through valueOf.
		if (typeof unlock !== "string") {
			unlock = jQuery.expando + Date.uid++;
			ovalueOf = owner.valueOf;

			Object.defineProperty(owner, "valueOf", {
				value: function(pick) {
					if (pick === Data) {
						return unlock;
					}
					return ovalueOf.apply(owner);
				}
			});
		}
		// create cache then...
		if (!this.cache[unlock]) {
			this.cache[unlock] = {};
		}

		return unlock;
	},
	set: function(owner, data, value) {
		// set method
		var prop, cache, unlock;
		// get uuid
		unlock = this.locker(owner);
		cache = this.cache[unlock];
		// if pass three param, and the second param is string, then add new key-value in the cache object
		if (typeof data === "string") {
			cache[data] = value;
			// if pass the second param is object
		} else {
			for (prop in data) {
				cache[prop] = data[prop];
			}
		}
		this.cache[unlock] = cache;

		return this;
	},
	get: function(owner, key) {
		// read method
		var cache = this.cache[this.locker(owner)];
		// if only one arguments, return entire cache object
		return key === undefined ? cache : cache[key];
	},
	access: function(owner, key, value) {
		// decide read method or write method
		if ( key === undefined ||
			((key && typeof key === "string") && value === undefined) ) {
			return this.get(owner, key);
		}
		this.set(owner, key, value);
		return value !== undefined ? value : key;
	},
	remove: function(owner, key) {
		// 
	},
	hasData: function(owner) {
		return !jQuery.isEmptyObject(this.cache[this.locker(owner)]);
	},
	discard: function(owner) {
		delete this.cache[this.locker(owner)];
	}
};
var data_user, data_priv;

function data_discard(owner) {
	data_user.discard(owner);
	data_priv.discard(owner);
} 

data_user = new Data();
data_priv = new Data();

// expose to the user is empty method, all pass to the two real object data_user, data_priv
// private data not through user way. REAL great system
// use closure is great but memory is a problem, jQuery use defineProperty do the next generation cache system now!
jQuery.extend({
	// UUID
	expando: "jQuery" + (core_version + Math.random()).replace(/\D/g, ""),

	// compatible with old version and system
	acceptData: function() {
		return true;
	},

	hasData: function(elem) {
		return data_user.hasData(elem) || data_priv.hasData(elem);
	},

	data: function(elem, name, data) {
		return data_user.access(elem, name);
	},

	removeData: function(elem, name) {
		return data_user.remove(elem, name);
	},

	_data: function(elem, name, data) {
		return data_priv.access(elem, name, data);	
	},

	_removeData: function(elem, name) {
		return data_priv.remove(elem, name);
	}
});

