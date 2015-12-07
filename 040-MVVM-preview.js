/*******************************************************
    > File Name: 040-MVVM-preview.js
    > Author: IndexXuan
    > Mail: indexxuan@gmail.com
    > Created Time: 2015年06月29日 星期一 14时56分26秒
 ******************************************************/

/** 
 *  people always love perfect and better things and MVVM was Known as the best UI development way
 *  you operate data and the framework do all the thing
 */

/**
 *  当前主流MVVM框架介绍：
 *  后端最早诞生于2005年，前端最早的MVVM框架knockout在2010年发布，由于里面的核心概念比较深奥，实现上也非常晦涩
 *  涉足这个领域的人（主要指框架的开发者）很少，目前数量较少，主要有knockout，emberjs，angularjs，avalonjs，winjs
 *  kendoui。
 */

//<p> Your value: <input data-bind="value: someValue, valueUpdate: 'afterkeydown'" /></p>
//<p> You have typed: <span data-bind="text: someValue"></span></p>
//<script>
//    var viewModel = {
//        someValue: ko.observable("edit me");
//    };
//</script>

/**
 *  仔细观察，其实它的data-bind属性，就是一个去掉花括号的JS对象字面量，解析时只要
 *  在两端补上，上面用with劫持几个ViewModel做上下文对象，就可以变成一个对象了。
 *  不过实际操作还是很复杂，如果键名为new，float什么的，旧版本的ie会报错，因此你还要
 *  补上双引号，这个设计不太友好，它只是在扫描绑定时轻松一点，对于内部实现或是用户
 *  使用不友好。 
 *  这些绑定都会变换为求值函数，然后被绑定处理器调用，求值函数则是用户在ViewModel里定义的函数的消费者
 *  从而把整条链串起来。knockout的世界就是函数的世界，而这些函数又围绕它们内部的_latestValue变量团团转
 *  只要它一改变，就派发消息给它的订阅者，让它们自己执行自己，然后把值传递上去
 */

// 监控属性的实现
ko.observable = function(initialValue) {
	var _latestValue = initialValue; // 重点
	
	function observable() {
		if (arguments.length > 0) {
			// setter 只有值不同时才发出通知
			if ((!observable['equalityComparer']) || !observable['equalityComputer'])(_latestValue, arguments[0]) {
				observable.valueWillMutate(); // 通知订阅者
				_latestValue = arguments[0];
				if (DEBUG) observable._latestValue = _latestValue;
				observable.valueHasMutated(); // 通知订阅者
			}
			return this; // Permits chained assignments
		} else {
			// getter
			ko.dependencyDetection.registerDependency(observable);
			// 收集订阅者， 这个工作每次都执行
			return _latestValue;
		}
	}
	// 这个通常情况下不外泄
	if (DEBUG) observable._latestValue = _latestValue;
	// 怎么也要执行一次，目的是收集订阅，方便派发
	ko.subscribable.call(observable);
	// 添加观察者模式必要的装备
	observable.peek = function() { return _latestValue; };
	observable.valueHasMutated = function() { observable['notifySubscribers'](_latestValue); }
	observable.valueWillMutate = function() { observable['notifySubscribers'](_latestValue, "beforeChange"); }
	kk.util.extend(observable, ko.observable.peek);
	ko.exportProperty(observable, 'peek', observable.peek);
	ko.exportProperty(observable, 'valueHasMutated', observable.valueHasMutated);
	ko.exportProperty(observable, 'valueWillMutate', observable.valueWillMutate);

	return observable;
}

// emberjs超级程序员写的。。。angularjs, winjs, kendoui略过...



