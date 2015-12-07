/*******************************************************
    > File Name: 033-javascript-async-future.js
    > Author: IndexXuan
    > Mail: indexxuan@gmail.com
    > Created Time: 2015年06月23日 星期二 22时30分03秒
 ******************************************************/

/** 
 *  相关的库推荐
 *  deferred-generator
 *  taskjs
 *  gens
 *  co
 *  windjs
 *  前四个基于原生的yield，后面基于预编译，当然原生的性能高。现阶段实现一个生成器，代码量极大，相当于把
 *  用户代码回炉重造，而promise则简单、成本低廉很多。
 */

// 1. yield
function fib() {
	var i = 0,
		J = 1;
	while (true) {
		yield i;
		var t = i;
		i = j;
		j += t;
	}
}
var g = fib();
for (var i = 0; i < 10; i++) {
	console.log(g.next());
}

function f() {
	console.log(1);
	var value = yield 2;
	console.log(value);
	console.log("这是跟在3后面");
}
var g = f(); // 这里什么也不执行
console.log(g.next()); // 这里打印f函数以yield切开的前半部分，及其返回值，于是有1，2
g.send(3); // 这里打印3，与我们最后那一行提示
// 从上例我们也可以看出send的用途，用于覆写生成器暂时保存起来的变量的值
// 我们也可以看到上例最终抛错了，一个stopIteration异常，因此我们得try catch 一下，并用close方法关闭它
// 一个函数里允许存在多个yield关键字，将程序拆成n+1块，相对应的，需要执行next方法n+1次。
function Generator() {
	yield "aaaa";
	yield "bbbb";
	yield "cccc";
	yield "dddd";
}
var g = Generator();
console.log(g.next()); // "aaaa";
console.log(g.next()); // "bbbb";
console.log(g.next()); // "cccc";
console.log(g.next()); // "dddd";
// 但是这样太多next了，我们让它变得智能化些，让console.log这个逻辑抽取成一个函数，然后递归自身。
var g = Generator();
function process(g, f) {
	try {
		f(g.next());
		process(g, f);
	} catch (e) {
	}
}
process(g, function(a) {
	console.log(a);
});
// 我们再加入一些异步代码，如setTimeout，就会看到一些美妙的效果
function Generator(next) {
	setTimeout(next, 1000);
	yield;
	console.log("aaaa");

	setTimeout(next, 1000);
	yield;
	console.log("bbbb");

	setTimeout(next, 1000);
	yield;
	console.log("cccc");
}

function process(f) {
	var g;
	// 这是传参next，next里面再次驱动它执行生成器的next，形成递归调用
	g = f(function() {
		try {
			g.next();
		} catch (e) {
		}
	});
	g.next(); // 执行它
}

process(Generator);
// 我们可以看到aaaa, bbbb, cccc都是每隔1秒打印出来，原本异步的代码，被整的同步一样，阻塞在那里，只有前一块执行完了才轮到下一块，
// 如果没有yield，我们就不得不嵌套它。
setTimeout(function() {
	console.log("aaaa");
	setTimeout(function() {
		console.log("bbbb");
		setTimeout(function() {
			console.log("cccc");
		}, 1000)
	}, 1000)
}, 1000)

// 明显的例子
Function.prototype.wait = function() {
	var me = this;
	var g = me(function(t) {
		try {
			g.send(t);
		} catch (e) {
		}
	});
	g.next();
}
Requester = function(a) {
	this.resume = a;
};

Requester.prototype.send = function(time) {
	var resume = this.resume;
	setTimeout(function() {
		resume(time);
	}, time);
};

(function(resume) {
	var r = new Requester(resume);
	// 这里每隔1000秒才执行
	var json = yield r.send(1000);
	console.log(json);
	// 这里每隔1000秒才执行
	json = yield r.send(1000);
	console.log(json);
}).wait();

