/*******************************************************
    > File Name: 010-function-fix.js
    > Author: IndexXuan
    > Mail: indexxuan@gmail.com
    > Created Time: 2015年06月11日 星期四 14时52分32秒
 ******************************************************/

// ecma262v5's only extend to Function is bind method, from prototype.js

// bind
//var observable = function(val) {
//    var cur = val; // an internal varible
//    function field(neo) {
//        if (arguments.length) { // setter
//            if (cur !== neo) {
//                cur = neo;
//            }
//        } else { // getter
//            return cur;
//        }
//    }
//    field();
//    return field;
//} 

// fix this's point to
Function.prototype.bind = function(context) {
	if (arguments.length < 2 && context === void 0) {
		return this;
	}
	var _method = this, args = [].slice.call(arguments, 1);
	return function() {
		return _method.apply(context, args.concat.apply(args, arguments));
	}
}

// so we can fix ie attachEvent, this is point to window, and it should to who invoked it
var addEvent = document.addEventListener ?
	function(el, type, fn, capture) {
    	el.addEventListener(type, fn, capture);
    } :
	function(el, type, fn) {
		el.attachEvent("on" + type, fn.bind(el, event));
	}
//


// call : obj.method() --> method(obj)
// apply: obj.method(a, b, c) --> method(obj, [a, b, c])
// bind is a change of apply and make sure the return value is a function

var bind = function(bind) {
	return {
		bind: bind.bind(bind),
		call: bind.bind(call),
		apply: bind.bind(bind.apply)
	}
}(Function.prototype.bind);

// usage
var a = [1, [2, 3], 4];
var b = [1, 3];
var concat = bind.apply([].concat);
console.log(concat(b, a)); // [1, 3, 1, 2, 3, 4]

// arraylike to array
var slice = bind([].slice);
var array = slice({
	0: "aaa",
	1: "bbb",
	length: 3
});
console.log(array); // ["aaa", "bbb", "ccc"]

function test() {
	var args = slice(arguments);
	console.log(args); [1, 2, 3, 4, 5]
}
test(1, 2, 3, 4, 5);


var hasOwn = bind.call(Object.prototype.hasOwnProperty);
hasOwn([], "xx"); // false
// bind.bind need one more exec
var hasOwn2 = bind.bind(Object.prototype);
hasOwn2([], "xx"); // false

function curry(fn) {
	function inner(len, arg) {
		if (len == 0) {
			return fn.apply(null, arg);
		}
		return function(x) {
			return inner(len - 1, arg.concat(x));
		};
	}
	return inner(fn.length, []);
}

function sum(x, y, z, w) {
	return x + y + z + w;
}
curry(sum)('a')('b')('c')('d'); // => 'abcd'

function curry2(fn) {
	function inner(len, arg) {
		if (len < 0) {
			return fn.apply(null, arg);
		}
		return function() {
			return inner(len - arguments.length, arg.concat(Array.apply([], arguments)));
		};
	}
	return inner(fn.length, []);
}

curry2(sum)('a')('b', 'c')('d'); // => 'abcd'
curry2(sum)('a')()('b', 'c')()('d'); // => 'abcd'

Function.prototype.partial = function() {
	var fn = this, args = Array.prototype.slice.call(arguments);
	return function() {
		var arg = 0;
		for (var i = 0; i < args.length && arg < arguments.length; i++) {
			if (args[i] === undefined) {
				args[i] = arguments[arg++];
			}
		}
		return fn.apply(this, args);
	};
}

var delay = setTimeout.partial(undefined, 10);
delay(function() {
	console.log("A call to this funciton will be temporarily delayed!");
});

// pure empty object
var _ = Object.create(null);

// ie emulation
var _ = (function() {
	var doc = new ActiveXObject('htmlfile');
	doc.write('<script></script>');
	doc.close();
	var obj = doc.parentWindow.Object;
	if (!obj || obj === Object) {
		return;
	}
	var name, names = [
		'constructor', 'hasOwnProperty', 'isPrototypeOf'
		,'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf'
	];
	while (name = names.pop()) {
		delete obj.prototype[name];
	}
	return obj;
}())

function partial(fn) {
	var A = [].slice.call(arguments, 1);
	return A.length < 1 ? fn : function() {
		var a = Array.apply([], arguments);
		var c = A.concat(); // copy 
		for (var i = 0; i < c.length; i++) {
			if (c[i] === '_') {
				// replace the placeholder
				c[i] = a.shift();
			}
		}
		return fn.apply(this, c.concat(a));
	}
}

function test(a, b, c, d) {
	return "a = " + a + " b = " + b + " c = " + c + " d = " + d;
}

var fn = partial(test, 1, '_', 2,'_');
fn(44, 55); // "a = 1 b = 44 c = 2 d = 55"

/**
 *  curry
 *  partial
 *  not use very often, because front-end develop is to show something fast
 *  in back-end like nodejs, we need them to make callbacks more flatten and clear
 *  more info in Ajax chapter
 */

/**
 *  two important method
 *  apply 
 *  call
 *  create a new function and pass the user arguments to exec
 *  in JavaScript, there are many ways to create the function like: you know...
 */

Function.prototype.apply = Function.prototype.apply || function(x, y) {
	x = x || window;
	y = y || [];
	x._apply = this;
	if (!x.__apply) {
		x.constructor.prototype.__apply = this;
	}
	var r, j = y.length;
	switch(j) {
		case 0: r = x.__apply(); break;
		case 1: r = x.__apply(y[0]); break;
		case 2: r = x.__apply(y[0], y[1]); break;
		case 3: r = x.__apply(y[0], y[1], y[2]); break;
		case 4: r = x.__apply(y[0], y[1], y[2], y[3]); break;
		default: 
			var a = [];
		    for (var i = 0; i < j; i++) {
				a[i] = "y[" + i + "]";
			}
			r = eval("x.__apply(" + a.join(",") + ")");
			break;
	}
	try {
		delete x.__apply ? x.__apply : x.constructor.prototype.__apply;
	}
	catch (e) {}
	return r;
};

Function.prototype.call = Function.prototype.call || function() {
	var a = arguments, x = a[0], y = [];
	for (var i = 1, j = a.length; i < j; ++i) {
		y[i - 1] = a[i];
	}
	return this.apply(x, y);
}

