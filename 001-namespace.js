/*******************************************************
    > File Name: 001.js
    > Author: IndexXuan
    > Mail: indexxuan@gmail.com
    > Created Time: 2015年06月10日 星期三 10时14分02秒
 ******************************************************/

// namaspace
// call as this form: xxx.yyy.zzz()
if (typeof(Ten) === "undefined") {
    Ten = {};
	Ten.Function = {};
	Ten.Array = {};
	Ten.Class = {};
	Ten.JSONP = new Ten.Class();
	Ten.XHR = new Ten.Class();
}

// jQuery1.2 noConflict
var _jQuery = window.jQuery, _$ = window.$; // 先把可能存在的同名变量保存起来
jQuery.extend({
	noConflict: function(deep) {
		window.$ = _$; // 这是再放回去
		if (deep) {
			window.jQuery = _jQuery;
		}
		return jQuery;
	}
})
// 注意此方法只对单问价的类库或框架有用，像ext就不能复制。因为把命名空间改名后，将ext置为null，然后
// 有通过动态方式引入新的js文件，该文件再以ext调用，就会导致错误。
// mass对jq的多库共存进行改进，它与jq一样拥有两个命名空间，一个是$,另一个是根据url生成的长命名空间
// namespace = DOC.URL.replace(/#.+|\w)/g, '');

