/*******************************************************
    > File Name: 041-MVVM-1.js
    > Author: IndexXuan
    > Mail: indexxuan@gmail.com
    > Created Time: 2015年06月29日 星期一 15时34分08秒
 ******************************************************/

// 属性变化的监听
var name, oldValue, val;
get = function() {
	oldValue = this[name];
	// 这里收集订阅者，订阅者为调用这个get方法的某个视图函数
	// 由于这个get事实上可能被包几层，因此可能是caller.caller.caller
	// 这需要更高的技术来收集，这里只是假设
	Observer.bind(name, arguments.callee.caller);
	return oldValue;
}

set = function(val) {
	if (oldValue !== val) { // 不一样就重写oldValue
		oldVal = val;
		Observer.fire(this, name, val); // 通知订阅者更新
	}
}

/** 
 *  重点是如何让用户调用set，get方法。各大框架的做法都不太一样
 *  knockout： 对于普通的属性，放到ko.observable函数里，返回一个监控函数，然后根据传参额不同判定是读还是写
 *  emberjs： 则拥有两个特性，setter，getter，对监控数组的访问都必须通过它们，从而确保观察者不会被遗漏任何订阅函数
 *  也不忘在修改时通知它们。
 *  angular: 是对$watch回调，控制器函数等进行重新编译，得到它们的赋值取值关系，从而生成一大堆回调，交给观察者
 *  winjs: 是使用Object.defineProperty, 第三个参数本来就可以接受两个函数当getter，setter，从而控制着所有对此
 *  属性的访问，这应该是最好最自然的实现，不过缺憾就是严重受制于浏览器的语法支持。
 *  kendoui： 则是将VM包的很紧，只能通过它暴露那些方法进行修改属性，而这些方法里有着像emberjs那样的上帝getter、setter
 *  
 *  浏览器其实私藏了很多好东西：
 *  ie的万能onpropertychange，无论setAttibute或者“=”，只要值不一样，都能触发回调。
 *  标准浏览器：__defineSetter__, __defineGetter__,人们用来模拟ie的outerHTML,它们算是最纯粹的访问器设置机制，没有
 *  设置可配置性，可遍历性
 *  ff：proxy.create和Object.prototype.watch
 *  ecma6: Object.observe，是Object.prototype.watch的强化版，连数组的变动都能监听到，可惜缺点是一样的。
 *  avalon还用到了老将:VBScript，不多说了。。。
 */

