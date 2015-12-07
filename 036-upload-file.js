/*******************************************************
    > File Name: 036-upload-file.js
    > Author: IndexXuan
    > Mail: indexxuan@gmail.com
    > Created Time: 2015年06月30日 星期二 13时46分24秒
 ******************************************************/

/** 
 *  发送数据要用send方法，通常网上说我们在POST请求时发送querystring。后来增加了FormData，ArrayBuffer,Blob,Document这几种
 *  数据类型。
 *  FormData是一个不透明的对象，无法序列化，但能简化人工提交数据的过程，以前，我们点击提交表单，浏览器会自动将这个表单的
 *  所有disabled属性为false的input，textarea，select，button元素的name与value抽取出来，变成一个querystring。当我们用Ajax
 *  提交时，这个过程就成为人工的。jQuery把它抽象成一个serialize方法，代码量不在少数，而FormData直接就可以new一个实例出来
 *  我们只需遍历表单元素，用append方法传入其name，value即可。
 */

var formdata = new FormData();
formdata.append("name", "Index");
formdata.append("blog", "https://github.com/IndexXuan/");

// or
var formobj = document.getElementById("form");
var formdata = formobj.getFormData();

// or
var formobj = document.getElementById("form");
var formdata = new FormData(formobj);

var xhr = new XMLHttpRequest();
xhr.open("POST", "http://ajaxpath");
xhr.send(formdata);


/** 
 *  上传文件
 *  这个与前面提到的传送数据有点相似，不过它与input[type="file"]接合的更紧密
 *  假设页面有一个ID为upload的上传域与一个ID为progress用于显示进度的span元素，
 *  那么使用XMLHttpRequest2来上传文件是这样实现的：
 */

window.addEventListener("load", function() {
	var le = document.querySelector("#file");
	var progress = document.querySelector("#progress");
	el.addEventListener("change", function() {
		var file = this.files[0];
		if (file) {
			var xhr = new XMLHttpRequest();
			xhr.upload.addEventListener("progress", function(e) {
				// deal with something
				var  done = e.position || e.loaded, total = e.totalSize || e.total;
				progress.innerHTML = (Math.floor(done / total * 1000) / 10) + "%";
			});
			xhr.addEventListener("load", function() {
				progress.innerHTML = "上传成功";
			});
			xhr.open('PUT', '/upload', true);
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			xhr.setRequestHeader('Content-Type', 'application/octet-stream');
			xhr.send(file);
		}
	})
});

