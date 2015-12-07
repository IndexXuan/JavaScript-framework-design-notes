/*******************************************************
    > File Name: 035-getXHR.js
    > Author: IndexXuan
    > Mail: indexxuan@gmail.com
    > Created Time: 2015年06月23日 星期二 23时28分57秒
 ******************************************************/

function xhr() {
	if (!xhr.cache) {
		var fns = [
			function () { return new XMLHttpRequest(); },
			function () { return new ActiveXObject('Msxml2.XMLHTTP')},
			function () { return new ActiveXObject('MicroSoft.XMLHTTP')}
		];
		for (var i = 0, n = fns.length; i < n; i++) {
			try {
				fns[i]();
				xhr.cache = fns[i];
				break;
			} catch (e) {
			}
		}
		return xhr.cache();
	} else {
		return xhr.cache();
	}
}
var xhrObject = xhr(); // 调用
console.log(xhrObject); // [object XMLHttpRequest]

