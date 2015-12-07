/*******************************************************
    > File Name: 014-es5-method-of-Object.js
    > Author: IndexXuan
    > Mail: indexxuan@gmail.com
    > Created Time: 2015年06月11日 星期四 22时10分32秒
 ******************************************************/

/***
*  Object.keys
 *  Object.getOwnPropertyNames
 *  Object.getPrototypeOf
 *  Object.defineProperty
 *  Object.defineProperties
 *  Object.getOwnPropertyDescriptor
 *  Object.create
 *  Object.seal
 *  Object.freeze
 *  Object.preventExtensions
 *  Object.isSealed
 *  Object.isFrozen
 *  Object.isExtensible
 */

// besides Object.keys, others almost cannot be simulate in old ie, 
// use __proto__ or __defineGetter__ or defineSetter__ to simulate Object.defineProperty
// object.getOwnPropertyNames用于收集当前对象不可遍历与可遍历属性（不包括原型链上），以数组形式返回
var obj = {
	aa: 1,
	toString: function() {
		return "0";
	}
}
if (Object.defineProperty && Object.seal) {
	Object.defineProperty(obj, "name", {
		value: 2
	})
}
console.log(Object.getOwnPropertyNames(obj)); // ["aa", "toString", "name"]
console.log(Object.keys(obj)); // ["aa", "toString"]

function fn(aa, bb) {}
console.log(Object.getOwnPropertyNames(fn)); // ["Prototype", "length", "name", "arguments", "caller"]
console.log(Object.keys(fn)); // []
var reg = /\w{2,}/i;

console.log(Object.getOwnPropertyNames(reg)); // ["lastIndex", "source", "global", "ignoreCase", "multiline", "sticky"]
console.log(Object.keys(reg)); // []

console.log(Object.getPrototypeOf(function() {}) === Function.prototype); // true
console.log(Object.getPrototypeOf({}) === Object.prototype); // true

