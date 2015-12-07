/*******************************************************
    > File Name: 005-domready.js
    > Author: IndexXuan
    > Mail: indexxuan@gmail.com
    > Created Time: 2015年06月10日 星期三 15时00分11秒
 ******************************************************/

// 主流框架都有自己的一套domready,以便早早的介入，完成特征嗅探和绑定等任务
// if has DOMContentLoaded use it, then use hacks by Diego Perini
function IEContentLoaded(w, fn) {
	var d = w.document, done = false,
		init = function() {
		if (!done) { // only exec once
			done = true;
			fn();
		}
	};
	(function() {
		try {
			// 在dom为建完之前调用元素的doScroll方法抛出错误
			d.documentElement.doScroll('left');
		} catch (e) {
			// 延时再试
			setTimeout(arguments.callee, 50);
			return;
		}
		init();
	})();
	// 如果用户是在domready之后绑定的这个函数，就立即执行它
	d.onreadystatechange = function() {
		if (d.readyState == 'complete') {
			d.onreadystatechange = null;
			init();
		}
	};
}

// mass domready	
var readyList = [];
mass.ready = function(fn) {
	if (readyList) {
		fn.push(fn);
	} else {
		fn();
	}
}
var readyFn, ready = W3C ? "DOMContentLoaded" : "readystatechange";
function fireReady() {
	for (var i = 0, fn; fn = readyList[i++]; ) {
		fn();
	}
	readyList = null;
	fireReady = $.noop; // 惰性函数,防止ie9二次调用_checkDeps
}

function doScrollCheck() {
	try {
		html.doScroll('left');
	} catch (e) {
		setTimeout(doScrollCheck);
	}
}

