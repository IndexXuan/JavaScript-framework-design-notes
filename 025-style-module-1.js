/*******************************************************
    > File Name: 025-style-module-1.js
    > Author: IndexXuan
    > Mail: indexxuan@gmail.com
    > Created Time: 2015年06月17日 星期三 10时41分51秒
 ******************************************************/

/** 
 *  样式模块大致分为两大块
 *  1. 精确获取样式
 *  2. 设置样式	
 *
 *  old ie use currentStyle and modern browsers use getComputedStyle(a window api)
 *  由于current仅仅支持属性法+驼峰风格,所以两种风格都可以的getComputedStyle就迁就一下,统一使用
 *  属性法+驼峰风格
 */

var getStyle = function(el, name) {
	if (el.style) {
		name = name.replace(/\-(\w)/g, function(all, letter) {
			return letter.toUpperCase();
		});
		if (window.getComputedStyle) {
			return el.ownerDocument.getComputedStyle(el, null)[name];
		} else {
			return el.currentStyle[name];
		}
	}
}

/** 
 *  设置样式没什么难度，直接el.style[name] = value;
 *  但是框架要考虑兼容性，易用性，扩展性，现列举难点或值得关注的点如下：
 *  1. 样式名要同时支持连字符风格（css标准风格）与驼峰风格（Dom的标准风格）
 *  2. 样式名要进行必要的处理，如float与css3带私有前缀的样式
 *  3. 如果框架是模仿jQuery风格，要考虑set all， get first
 *  4. 设置样式时，对于长度宽度可以考虑直接处理数值，由框架只能补全单位
 *  5. 设置样式时对于长度宽度可以传入相对值
 *  6. 对个别样式的特殊处理，如ie下 z-index, opacity, user-select, background-position, top, left
 *  7. 基于setStyle,getStyle的扩展，如height，width，offset等方法
 *
 */


