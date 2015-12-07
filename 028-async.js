/*******************************************************
    > File Name: 028-async.js
    > Author: IndexXuan
    > Mail: indexxuan@gmail.com
    > Created Time: 2015年06月19日 星期五 11时04分02秒
 ******************************************************/

/** 
 *  API
 *  XMLHttpRequest
 *  postMessage
 *  WebWorkor
 *  setImmediate
 *  requestAnimationFrame
 *
 *  ==>
 *
 *  clearInterval
 *  clearTimeout
 *  clearImmediate
 *  cancelAnimatinFrame
 */

/** 
 *  technology
 *  iframe
 *  ajax
 *  无缝刷新，让用户驻留在网页的时间越来越长
 *  应用越来越复杂，页面越来越大，功能点越来越强，后端加载来的数据
 *  和模板，来拼装这些新的区域，人们必须发明新的模式来应对。最初就是
 *  回调地狱，callback hell。但是JavaScript这样的单线程语言来说，错误
 *  往往是致命的，必须try...catch，但是try...catch只能捕捉当前抛出的异常
 *  对后来执行的代码无效。
 */

function throwError() {
	throw new Error('ERROR');
}
try {
	setTimeout(throwError, 3000);
} catch (e) {
	console.log(e); // 无法捕获
}

// 1 如果回调的执行时间大于时间间隔，那么浏览器会继续执行他们，导致真正的时间间隔比原来的大

// 2. 存在一个最小的间隔，可以求得此值
function test(count, ms) {
	var c = 1;
	var time = [new Date() * 1];
	var id = setTimeout(function() {
		time.push(new Date() * 1);
		c += 1;
		if (c <= count) {
			setTimeout(arguments.callee, ms);
		} else {
			clearTimeout(id);
			var t1 = time.length;
			var av = 0;
			for (var i = 1; i < t1; i++) {
				var n = time[i] - time[i - 1]; // get the interval
				av += n;
			}
			console.log(av / count); 
		}
	}, ms);
}
window.onload = function() {
	var id = setTimeout(function() {
		test(100, 1);
		clearTimeout(id);
	}, 3000);
}

// old ie's fastest way!
var orig_setTimeout = window.setTimeout;
window.setTimeout = function(fun, wait) {
	if (wait < 15) {
		orig_setTimeout(fun, wait);
	} else {
		var img = new Image();
		img.onload = img.onerror = function() {
			fun();
		};
		img.src = "data:,foo";
	}
};

// 3. 零秒延迟，此回调会放到一个能立即执行的时段进行触发，js代码大体上自顶向下执行，但中间穿插着有关DOM渲染
// 事件回应等异步代码，它们组成一个队列，零秒延迟将会实现插队操作。

// 4. setTimeout, 如果不写第二个参数，在ie和firefox中可能给一个很大的数字，100ms上下，往后会缩小到
// 最小时钟间隔，safari、chrome、opera则多为10ms上下，firefox中，setInterval不写第二个参数，会当做setTimeout处理
window.onload = function() {
	var a = new Date() - 0;
	setTimeout(function() {
	    console.log(new Date() - a);
	});
	var flag = 0;
	var b = new Date(),
		text = "";
	var id = setInterval(function() {
		flag++;
		if (flag > 4) {
			clearInterval(id);
			console.log(text);
		}
		text += (new Date - b + " ");
		b = new Date;
	});
}

// 5. 标准浏览器与ie10，都支持额外的参数，从第三个参数起，作为回调的传参传入！
setTimeout(function() {
	console.log([].slice.call(arguments));
}, 10, 1, 2, 4);

// ie6 - 9模拟
if (window.VBArray && !(document.documentMode > 9)) {
	(function(overrideFun) {
		window.setTimeout = overrideFun(window.setTimeout);
		window.setInterval = overrideFun(window.setInterval);
	})(function(originalFun) {
		return function(code, delay) {
			var args = [].slice.call(arguments, 2);
			return originalFun(function() {
				if (typeof code == 'string') {
					eval(code);
				} else {
					code.apply(this, args);
				}
			}, delay);
		}
	});
}

// 6. setTimeout方法的时间间隔如果为极端的负数，0，或者极大的正数，都会处理未立即执行(最新浏览器)
//...

