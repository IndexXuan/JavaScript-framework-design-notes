/*******************************************************
    > File Name: 029-Mochikit-Deferred.js
    > Author: IndexXuan
    > Mail: indexxuan@gmail.com
    > Created Time: 2015年06月21日 星期日 22时43分17秒
 ******************************************************/

// https://github.com/mochi/mochikit/blob/master/MochiKit/Async.js
Deferred = function(canceller) {
	this.chain = [];
	this.id = setTimeout("1");
	this.fired = -1;
	this.paused = 0;
	this.results = [null, null];
	this.canceller = canceller;
	this.silentlyCancelled = false;
	this.chained = false;
};

function curry(fn, scope, args) {
	return function() {
		var argv = [].concat.apply(args, arguments);
		return fn.apply(scope, argv);
	};
}
Deferred.prototype = {
	// three states, 未触发，触发成功，触发失败
	state: function() {
		if (this.fired == -1) {
			return 'unfired';
		} else if (this.fired === 0) {
			return 'success';
		} else {
			return 'error';
		}
	},
	// cancel trigger, like ajax's abort
    cancel: function(e) {
		if (this.fired == -1) {
			if (this.canceller) {
				this.canceller(this);
			} else {
				this.silentlyCancelled = true;
			}
			if (this.fired == -1) {
				if (!(e instanceof Error)) {
					e = new Error(e + "");
				}
				this.errback(e);
			}
		} else if ((this.fired == 0) && (this.results[0] instanceof Deferred)) {
			this.results[0].cancel(e);
		}
	},
	// this decided which queue to use
	_resback: function(res) {
		this.fired = ((res instanceof Error) ? 1 : 0);
		this.results[this.fired] = res;
		if (this.paused === 0) {
			this._fire();
		}
	},
	// check whether triggered.
	_check: function() {
		if (this.fired != -1) {
			if (!this.silentlyCancelled) {
				throw new "this method has invoked!";
			}
			this.silentlyCancelled = false;
			return;
		}
	},
	// trigger success callback
    callback: function(res) {
		this._check();
		if (res instanceof Deferred) {
			throw new Error("Defered instances can only be chained if they are the result of a callback");
		}
		this._resback(res);
	},
	// trigger error callback
	errback: function(res) {
		this._check();
		if (res instanceof Deferred) {
			throw new Error("Deferred instances can only be chained if they are the result of a callback");
		}
		if (!(res instanceof Error)) {
			res = new Error(res + "");
		}
		this._resback(res);
	},
	// add success and failure callback at the same time
	addBoth: function(a, b) {
		b = b || a;
		return this.addCallbacks(a, b);
	},
	// add success callback
	addCallback: function(fn) {
		if (arguments.length > 1) {
			var args = [].slice.call(arguments, 1);
			fn = curry(fn, window, args);
		}
		return this.addCallbacks(fn, null);
	},
	// add error callback
	addErrback: function(fn) {
		if (arguments.length > 1) {
			var args = [].slice.call(arguments, 1);
			fn = curry(fn, window, args);
		}
		return this.addCallbacks(null, fn);
	},
	// add success and error callbacks at the same time
	addCallbacks: function(cb, eb) {
		if (this.chained) {
			throw new Error("Chained Defereds can not be re-used");
		}
		if (this.finalized) {
			throw new Error("Finalized Deferreds can not be re-used");
		}
		this.chain.push([cb, eb]);
		if (this.fired >= 0) {
			this._fire();
		}
		return this;
	},
	// trigger the queue in order
	_fire: function() {
		var chain = this.chain;
		var fired = this.fired;
		var res = this.results[fired];
		var self = this;
		var cb = null;
		while (chain.length > 0 && this.paused === 0) {
			var pair = chain.shift();
			var f = pair[fired];
			if (f == null) {
				continue;
			}
			try {
				res = f(res);
				fired = ((res instanceof Error) ? 1 : 0);
				if (res instanceof Deferred) {
					cd = function(res) {
						self.paused--;
						self._resback(res);
					};
					this.paused++;
				}
			} catch (err) {
				fired = 1;
				if (!(err instanceof Error)) {
					try {
						err = new Error(err + "");
					} catch (e) {
						alert(e);
					}
				}
				res = err;
			}
		}
		this.fired = fired;
		this.results[fired] = res;
		if (cb && this.paused) {
			res.addBoth(cb);
			res.chained = true;
		}
	}
};

/** 
 *  我们先通它的addCallback、addErrback，addBoth方法来添加回调函数
 *  addCallback用于正常返回时执行，第一个参数为函数，允许第二个参数、第三个参数，反正内部一个curry搞定
 *  addErrback用于执行出错，参数同addCallback
 *  addBoth方便同时添加正常回调与错误回调
 *  它们内部调用addCallbacks方法，参数是两个函数或一个函数一个null，上面三个会设法弄成这种格式传到。
 *  Deferred实例有一个chain数组属性，它的每个元素都是一个双元素数组，换言之是这个样子：
 */

deferred.chain = [ [fn1, fn2], [fn3, fn4], [fn5, fn6]];

// or
var d = new Deferred();
d.addCallback(mycallback);
d.addErrback(myerrback);
d.addBoth(myboth);
d.addCallbacks(mycallback, myerrback);

// chain structure is showed below
[
	[mycallback, null],
	[null, myerrback],
    [myboth, myboth],
	[mycallback, myerrback]
];

function increment(value) {
	console.log(value);
}

var d = new Deferred();
d.addCallback(increment);
d.addCallback(increment);
d.addCallback(increment);
d.addErrback(increment);
d.callback(1);


// 复杂点的
var d = new Deferred();
d.addCallback(function(a) {
	console.log(a);
	return 4;
}).addBoth(function(a) {
	console.log(a);
	throw "抛错";
}, function(b) {
	console.log(b);
	return "xxx";
}).addBoth(function(a) {
	console.log(a);
	return "正常";
}, function(b) {
	console.log(b + "!");
	return "出错";
}).addBoth(function(a) {
	console.log(a + " 回复正常");
	return "正常2";
}, function(b) {
	console.log(b + " 继续出错");
	return "出错2";
})
d.callback(3);
/** 
 *  3
 *  4
 *  Error: 抛错!
 *  出错 回复正常
 */

/** 
 *  jQuery早期没有这样的强大系统，自己用计数器实现，很痛苦，比如有下面一种需求：
 *  1. 需要发起4个请求，这4个请求的地址和返回时间都不一样，必须等到它们都到齐时才能整理，合并成一个数据
 *  然后根据这些数据的某些值再发出两个请求，等到它们都返回时，最后处理依次才算成功。如果用MOchikit实现，非常简单
 */

var elapsed = (function() {
	var start = null;
	return function() {
		if (!start) {
			start = Date.now();
		}
		return ((Date.now() - start) / 1000);
	}
})();

console.log(elapsed(), "start");

var dl1, dl2;

dl1 = new DeferredList([
	doXHR('/sleep.php?n=3').addCallback(function(res) {
		console.log(elapsed(), "n=3", res, res.responseText);
		return res.responseText;
	}),
	doXHR('/sleep.php?n=4').addCallback(function(res) {
		console.log(elapsed(), "n=4", res, res.responseText);
		return res.responseText;
	}),
	doXHR('/sleep.php?n=5').addCallback(function(res) {
		console.log(elapsed(), "n=5", res, res.responseText);
		return res.responseText;
	}),
	doXHR('/sleep.php?n=6').addCallback(function(res) {
		console.log(elapsed(), "n=6", res, res.responseText);
		return res.responseText;
	}),
]).addCallback(function(res) {
	console.log(elapsed(), "first DeferredList complete.", res);

	return dl2 = new DeferredList([
		doXHR('/sleep.php?n=1').addCallback(function(res) {
			console.log(elapsed(), "n=1", res, res.responseText);
			return res.responseText;
		}),
		doXHR('/sleep.php?n=2').addCallback(function(res) {
			console.log(elapsed(), "n=2", res, res.responseText);
			return res.responseText;
		}),
	])
}).addCallback(function(res) {
	console.log(elapsed(), "end", res, dl1, dl2);
});

