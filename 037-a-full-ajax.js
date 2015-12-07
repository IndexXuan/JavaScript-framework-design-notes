/*******************************************************
    > File Name: 037-a-full-ajax.js
    > Author: IndexXuan
    > Mail: indexxuan@gmail.com
    > Created Time: 2015年06月30日 星期二 14时34分37秒
 ******************************************************/

/** 
 *  我们先来考虑它有什么参数，首先原生的XMLHttpRequest的参数一定要有，然后是method，url，async
 *  成功回调，失败回调，过时回调，传输数据，再之是与缓存相关，如返回什么数据类型，不区分成功或
 *  失败都执行的complete回调，过期时间，为了跨域，我们还把JSONP整合进去，这就设计回调名。
 *  我们创建一个伪XMLHttpRequest对象，它将实现大部分XMLHttpRequest2.0的接口，这由一个主函数返回
 *  它，为方便起见，就叫ajax。它会将传递的参数处理成querystring的形式，发送请求时，我们视跨域
 *  或上传，可能采用script与form来发送数据，因此需要一个传送器（transport）的概念，搞个适配器，
 *  视情况用不同的传输器发出请求与绑定回调，数据回来时，我们需要转换原始的数据为用户目标数据
 *  因此需要有转换器（converter）的概念
 *  https://github.com/RubyLouvre/mass-Framework/master/ajax.js
 *  https://github.com/RubyLouvre/mass-Framework/master/ajax_fix.js
 */

$.ajax = function(opts) {
    if (!opts || !opts.url) {
        $.error("arguments must be an object and need url prop");
    }
	opts = setOptions(opts); // deal with user arguments, like create querystring, capital the type
	// create a fake xmlhttprequest object, can deal with complete, success, error
	var dummyXHR = new $.XMLHttpRequest(opts);
	"complete success error".replace($.rword, function(name) {
		if (typeof opts[name] === "function") {
			dummyXHR.bind(name, opts[name]);
			delete opts[name];
		}
	});
	var dataType = opts.dataType; // return data type
	var transports = $.ajaxTransports;
	var name = opts.form ? "upload" : "dataType";
	var transports = transports[name] || transports.xhr
}
