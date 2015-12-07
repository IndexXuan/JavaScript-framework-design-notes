/*******************************************************
    > File Name: 006-noConflict.js
    > Author: IndexXuan
    > Mail: indexxuan@gmail.com
    > Created Time: 2015年06月10日 星期三 15时15分24秒
 ******************************************************/

var window = this,
    undefined,
	_jQuery = window.jQuery,
	_$ = window.$,
	// 把window存入闭包中的同名变量,方便内部函数在调用window时不用费大力气查找它
	// _jQuery 与 _$用于以后重写
	jQuery = window.jQuery = window.$ = function(selector, context) {
		return new jQuery.fn.init(selector, context);
    };

jQuery.extend({
	noConflict: function(deep) {
		// 引入jq后，闭包外面的window.$ and window.jQuery都存储在一个函数
		// 它是用来生成jQuery对象或者domReady后执行里面的函数的
		// 回顾最上面的代码,在还没有把function赋给它的时候， _jQuery与_$已经被赋值了
		// 因此他两的值必然为undefined
		// 因此这种放弃控制权的技术很简单，就是用undefined把window.$ and jQuery的函数清除掉
		// 这是Prototype或者mootools的$就可以使用了
		window.$ = _$; // 相当于window.$ = undefined
		// 如果连你的程序也有个叫jQuery的东西，tmd连jQuery都可以让你你
		// 这时候就要为noConflict添加一个布尔值, true
		if (deep) {
			// 但是我们必须有一个东西接纳jQuery对象与jQuery的入口函数
			// 闭包里的东西除非被window等宿主对象引用，否则就不是不可见的
			// 因此我们把闭包里面的JQuery return出去，外面用一个变量接纳就可以
			window.jQuery = _jQuery; // 相当于window.jQuery = undefined
		}
		return jQuery;
	}
});

