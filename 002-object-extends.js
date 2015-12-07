/*******************************************************
    > File Name: 002-object-extends.js
    > Author: IndexXuan
    > Mail: indexxuan@gmail.com
    > Created Time: 2015年06月10日 星期三 10时26分22秒
 ******************************************************/

// 我们需要有一种机制，将新功能添加到我们的命名空间中，这方法在js中通常被称作
// extend or mixin。js对象的属性描述符(Property Descriptor)没有诞生之前，是可以被
// 随意添加、更改、删除其成员，因此扩展一个对象非常便捷，一个简单的扩展方法就是
function extend(destination, source) {
	for (var property in source) {
		destination[property] = source[property];
	}
	return destination;
}

// 不过ie旧版本有个问题，他认为像Object的原型方法就不应该被遍历出来，因为for in 循环是无法遍历valueOf, 
// toString的属性名，这导致后来人们模拟Object.keys方法实现时也遇到了这个问题
Object.keys = Object.keys || function(obj) {
	var a = [];
	for (a[a.length] in obj); // like magic..., auto length++ and auto push prop
	return a;
}

// mass mixin, 支持多对象合并与选择是否覆写
function mix(target, source) { // 如果最后参数是布尔，判定是否覆写同名属性
	var args = [].slice.call(arguments), i = 1, key,
		ride = typeof args[args.length - 1] == "boolean" ? args.pop() : true;
	if (args.length === 1) { // 处理$.mix(hash)的情形
		target = !this.window ? this : {};
		i = 0;
	}
	while ((source = args[i++])) {
		for (key in source) { // 处理对象杂糅，用户保证都是对象
			if (ride || !(key in target)) {
				target[key] = source[key];
			}
		}
	}
	return target;
}

