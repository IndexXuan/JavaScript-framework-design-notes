/*******************************************************
    > File Name: 034-ajax-preview.js
    > Author: IndexXuan
    > Mail: indexxuan@gmail.com
    > Created Time: 2015年06月23日 星期二 23时19分28秒
 ******************************************************/

var xhr = new (self.XMLHttpRequest || ActiveXObject("MicroSoft.XMLHTTP"));
xhr.onreadystatechange = function() { // 先绑定事件后open
	if (this.readyState === 4 && this.status === 200) {
		var div = document.createElement("div");
		div.innerHTML = this.responseText;
		document.body.appendChild(div);
	}
}
xhr.open("POST", "/ajax", true);
// 必须，用于服务器判断request是ajax请求还是传统请求（同步）
xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
xhr.send("key=val&key1=val2");

// 这是一个完整的ajax程序，包括跨平台的获取XMLHttpRequest对象，绑定事件回调，判定处理状态，发出请求，设置首部，
// 以及在POST请求时，通过send方法发送数据。上面七个步骤每一个都有兼容性问题或易用性处理。如果跨域请求，ie8可能为
// XDomainRequest更为方便。

