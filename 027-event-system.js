/*******************************************************
    > File Name: 027-event-system.js
    > Author: IndexXuan
    > Mail: indexxuan@gmail.com
    > Created Time: 2015年06月19日 星期五 08时51分49秒
 ******************************************************/

/** 
 *  事件系统是一个框架非常重要的部分，用于响应用户的各种行为
 *  浏览器提供了3种层次的API
 *  最原始的是写在元素标签内
 *  再次是脚本中，el.onXXX = funciton DOM0事件
 *  最后是事件的多投机制，一个元素可以绑定多个回调，统称为DOM2事件系统
 *  由于浏览器大战，现存两套API
 *  ×× ie、opera
 *  绑定事件：el.attachEvent("on" + type, callback)
 *  卸载事件：el.datachEvent("on" + type, callback)
 *  创建事件：document.createEventObject()
 *  派发事件：el.fireEvent(type, event)
 *  W3C
 *  绑定事件：el.addEventListener(type, callback, useCapture)
 *  卸载事件：el.removeEventListener(type, callback, useCapture)
 *  创建事件：el.createEvent(types)
 *  初始化事件：el.initEvent()
 *  派发事件：el.dispatchEvent(event)
 */

function addEvent(el, type, callback, useCapture) {
	if (el.dispatchEvent) { 
		el.addEventListener(type, callback, !!useCapture);
	} else {
		el.attachEvent("on" + type, callback);
	}
	return callback;
} 

function removeEvent(el, type, callback, useCapture) {
	if (el.dispatchEvent) {
		el.removeEventListener(type, callback, !!useCapture);
	} else {
		el.detachEvent("on" + type, callback);
	}
}

function fireEvent(el, type, args, event) {
	args = args || {};
	if (el.dispatchEvent) {
		event = document.createEvent("HTMLEvents");
		event.initEvent(type, true, true);
	} else {
		event = document.createEventObject();
	}
	for (var i in args) {
		if (args.hasOwnProperty(i)) {
			event[i] = args[i];
		}
	}
	if (el.dispatchEvent) {
		el.dispatchEvent(event);
	} else {
		el.fireEvent("on" + type, event);
	}
}

/** 
 *  onXXX绑定方式的缺点：
 *  1. 对DOM3新增的事件或者ff某些私有实现无法支持（大部分没用，不过某些比如DOMContentLoaded有用）
 *  2. 只能绑定一个事件，后面的会覆盖前面的
 *  3. 在ie回调下没有参数，在其他浏览器下回调的第一个参数是事件对象
 *  4. 只能在冒泡阶段使用
 */

/** 
 *  addEventListener的缺点
 *  1. 新事件支持不稳定，有些还没普及开就废弃了
 *  2. 标准浏览器也并未完全或按规范实现w3c的标准事件
 *  3. 各种事件名带私有前缀
 *  4. 第3/4/5个参数
 *  5. Event对象属性的支持差异大，未实现
 */

/** 
 *  Dean Edward的 addEvent.js源码分析
 *  http://dean.edwards.name/weblog/2005/10/add-event/
 */
function addEvent(element, type, handler) {
	// add uuid, help to remove
	if (!handler.$$guid) {
		handler.$$guid = addEvent.guid++;
	}
	// element add events, save all type callbacks
	if (!element.events) {
		element.events = {};
	}
    var handlers = element.events[type];
	if (!handlers) {
		// create a child object, save current type callback
		// if element has the onXXX event, it will became the first fired callback in current type
		// the problem is, this callback do not has uuid, so only can be remove by el.onXXX = null
		if (element["on" + type]) {
			handlers[0] = element["on" + type];
		}
	}
	// save current callback
	handlers[handler.$$guid] = handler;
	// all callback pass to handleEvent to handle
	element["on" + type] = handleEvent;
}

addEvent.guid = 1; // UUID
// remove event, easy to remove, only delete cache object
function removeEvent(element, type, callback) {
	if (element.events && element.events[type]) {
		delete element.events[type][handler.$$guid];
	}
}
function handleEvent(event) {
	var returnValue = true;
	event = event || fixEvent(window.event);
	// 根据事件类型，取得要处理的回调集合，由于uuid是纯数字，因此可以按照绑定时的顺序执行
	var handlers = this.events[event.type];
	for (var i in handlers) {
		this.$$handleEvent = handlers[i];
		if (this.$$handleEvent(event) === false) {
			returnValue = false;
		}
	}
	return returnValue;
}
// 对ie事件对象做简单的修复
function fixEvent(event) {
	event.preventDefault = fixEvent.preventDefault;
	event.stopPropagation = fixEvent.stopPropagation;
	return event;
}
fixEvent.preventDefault = function() {
	this.returnValue = false;
}
fixEvent.stopPropagation = function() {
	this.cancelBubble = true;
}

/** 
 *  jQuery事件源码分析...
 */

