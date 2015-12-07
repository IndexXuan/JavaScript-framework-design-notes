/*******************************************************
    > File Name: 008-array-fix.js
    > Author: IndexXuan
    > Mail: indexxuan@gmail.com
    > Created Time: 2015年06月11日 星期四 09时13分59秒
 ******************************************************/
/**
 
pop: 
	delete and return the last element of the array
push:
	add an element(or more) to the array and return length of new array
shift:
	delete the first element of the array and return it
unshift:
    add an element(or more) to the head of the array and return the length of new array 
slice: (start [, end]) index can also nagetive number, do not change the target array
	get the child array of the array, like the string method substring. slice, substring and substr
    are three brother and make arraylike object to real array
sort:
	has basic function to sort and you can tell it how to sort
reverse:
	do as its name...
splice: (start, deleteCount[, item1[, item2[, item3]]])
    very powful, add of remove to the target array, can be use to create the method remove of array
    first usage: delete and return the delete as a new array, change the target array
	second usage: add something, make target array a new array (just deleteCount t0 0)
concat: var new_array = old_array.concat(value[ , value2[ , value3]]) arguments can also be an array
	do not change the target array, so new a varible to get the return, always use to plain the array
	or do clone operation
join: 
	the opposite operation to the split, make an array to be a string with specific sperator
    do not change target array
indexOf & lastIndexOf:
	if exists, return index, then return -1
forEach:
	pass the arguments one by one and do the same operation
map:
    make new array with operation you choose 
filter:
	do some operation and the element return true will add to the new array and return the new array
some:
	if has at least one return true, then return true, same with 'any' method
every:
	all element return true then return true
reduce & reduceRight
    iterator and result is a single value

**/



// fix it and add some useful method
Array.prototype.indexOf = Array.prototype.indexOf || function(item, index) {
	var n = this.length, i = ~~index;
	if (i < 0) {
		i += n;
	}
	for (; i < n; i++) {
		if (this[i] === item) {
			return i;
		}
	}

	return -1;
}

Array.prototype.lastIndexOf = Array.prototype.lastIndexOf || function(item, index) {
	var n = this.length,
		i = index == null ? n - 1 : index;
	if (i < 0) {
		i += n;
	}
	for (; i < n; i++) {
		if (this[i] === item) {
			return i;
		}
	}

	return -1;
}

// sucks, very powder to fix and i can never do itself... very hard
function iterator(vars, body, ret) {
	var fun = 'for(var ' + vars + 'i=0,n = this.length;i < n;i++){' +
		body.replace('_', '((i in this) && fn.call(scope, this[i],i,this))')
	    + '}' + ret;
	return Function("fn,scope", fun);
}

Array.prototype.forEach = iterator('', '_', '');
Array.prototype.filter = iterator('r=[],j=0,', 'if(_)r[j++]=this[i]', 'return r');
Array.prototype.map = iterator('r=[],', 'r[i]=_', 'return r');
Array.prototype.some = iterator('', 'if(_)return true', 'return false');
Array.prototype.every = iterator('', 'if(!_)return false', 'return true');

Array.prototype.reduce = function(fn, lastResult, scope) {
	if (this.length == 0) {
		return lastResult;
	} 
	var i = lastResult !== undefined ? 0 : 1;
	var result = lastResult !== undefined ? lastResult : this[0];
	for (var n = this.length; i < n; i++) {
		result = fn.call(scope, result, this[i], i, this);
	}
	return result;
}

Array.prototype.reduceRight = function(fn, lastResult, scope) {
	var array = this.concat().reverse();
	return array.reduce(fn, lastResult, scope);
}

function contains(target, item) {
	return target.indexOf(item) > -1;
}

function removeAt(target, item) {
	var index = target.indexOf(item);
	if (~index) {
		return removeAt(target, index);
	}
	return false;
}

function shuffle(target) {
	var j, x, i = target.length;
	for (; i > 0; j = parseInt(Math.random() * i),
		x = target[--i], target[i] = target[j], target[j] = x) {
		// nothing
	}
	return target;
}

// random
function random(target) {
	return target[Math.floor(Math.random() * target.length)];
}

// flatten
function flatten(target) {
	var result = [];
	target.forEach(function(item) {
		if (Array.isArray(item)) {
			result = result.concat(flatten(item));
		} else {
			result.push(item);
		}
	});
	return result;
}

// unique
function unique(target) {
	var result = [];
	loop: for (var i = 0, n = target.length; i < n; i++) {
		for (var x = i + 1; x < n; x++) {
			if (target[x] === target[i]) {
				continue loop;
			}
		}
		result.push(target[i]);
	}
	return result;
}

// compact
function compact(target) {
	return target.filter(function(el) {
		return el != null;
	});
}

// pluck: get the specific prop of each element of the target array, return a new array
function pluck(target, name) {
	var result = [], prop;
	target.forEach(function(item) {
		prop = item[name];
		if (prop != null) {
			result.push(prop);
		}
	});
	return result;
}

// groupBy
function groupBy(target, val) {
	var result = {};
	var iterator = $.isFunction(val) ? val : function(obj) {
		return obj[val];
	};
	target.forEach(function(value, index) {
		var key = iterator(value, index);
		(result[key] || (result[key] == [])).push(value);
	});
	return result;
}

// sortBy, usually use for object array
function sortBy(target, fn, scope) {
	var array = target.map(function(item, index) {
		return {
			el: item,
			re: fn.call(scope, item, index)
		};
	}).sort(function(left, right) {
		var a = left.re, b = right.re;
		return a < b ? -1 : a > b ? 1 : 0;
	});
	return pluck(array, 'el');
}

// union, two array and become a big one 
function union(target, array) {
	return unique(target.concat(array));
}

// intersect, two array and get the shared part
function intersect(target, array) {
	return target.filter(function(n) {
		return ~array.indexOf(n);
	});
}

// diff, arrayA - arrayB 
function diff(target, array) {
	var result = array.slice();
	for (var i = 0; i < result.length; i++) {
		for (var j = 0; j < array.length; j++) {
			if (result[i] === array[j]) {
				result.splice(i, 1);
				i--;
				break;
			}
		}
	}
	return result;
}

// min 
function min(target) {
	return Math.min.apply(0, target);
}

// max
function max(target) {
	return Math.max.apply(0, target);
}

// fix-bugs of old ie method
// old ie's unshift method do not return the length of the array
if ([].unshift(1) !== 1) {
	var _unshift = Array.prototype.unshift;
	Array.prototype.unshift = function() {
		_unshift.apply(this, arguments);
		return this.length;
	}
}

// the second arguments of the splice method, ie is 0 and other is array.length
if ([1, 2, 3].splice(1).length == 0) {
	// if ie6, 7, 8, the first element is not remove, it mean, if splice(1), do nothing, return nothing
    var _splice = Array.prototype.splice;
	Array.prototype.splice = function(a) {
		if (arguments.length == 1) {
			return _splice.call(this, a, this.length); // one arguments, need do sth
		} else {
			return _splice.call(this, arguments); // more than one arguments, do nothing, as usual
		}
	}
}

// a very important problem, how can we remember which method change the target array and which are not
// yet we know, some method is create by splice as a base, so we know
var _slice = Array.prototype.slice;
Array.prototype.pop = function() {
	return this.splice(this.length - 1, 1)[0];
}

Array.prototype.push = function() {
	this.splice.apply(this, [this.length, 0].concat(_slice.call(arguments)));
	return this.length;
}

Array.prototype.shift = function() {
	return this.splice(0, 1)[0];
}

Array.prototype.unshift = function() {
	this.splice.apply(this, [0, 0].concat(_slice.call(arguments)));
	return this.length;
}

