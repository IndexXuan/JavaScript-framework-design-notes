/*******************************************************
    > File Name: 042-MVVM-ViewModel.js
    > Author: IndexXuan
    > Mail: indexxuan@gmail.com
    > Created Time: 2015年06月29日 星期一 15时59分35秒
 ******************************************************/

/** 
 *  上一节我们讲到了如何坚挺一个属性的变化，现在让我们实现ViewModel吧，ViewModel就是一堆监听属性或计算属性的集合
 *  它是基于Model转换过来的，对一些需要渲染到视图的属性进行强化，方便下次我么改动它是自动同步到视图，使用了MVVM
 *  我们就要转换思路，将注意点重心放在数据而非dom
 */

/** 
 *  java中发明了“贫血模型”， “充血模型”这些概念，指出get,set（贫血模型）不够面向对象，过于单薄，颗粒度较小，
 *  容易造成代码膨胀，最重要的是业务逻辑的描述能力比较差，一个稍微复杂一点的业务逻辑，就需要太多的类和代码去描述
 *  而充血模型则包含很多操作数据的方法，自治程度高，表达能力强，缺点也不是没有，降低了复用性，鉴于前端该需求重构
 *  推倒重来的事太多了，写代码快才是王道，jquery证明了这点，因此这模式适合ViewModel，angular放任我们在$scope中添加任何
 *  数据与方法就是明证。
 */

// skipArray
var user = avalon.define({
	$id: "user", 
	firstName: "Index", 
	lastName: "Xuan",
	fullName: {
		set: function(val) {
			var array = (val || "").split(" ");
			this.firstName = array[0] || "";
			this.lastName = array[0] || "";
		},
		get: function() {
			return this.firstName + " " + this.lastName;
		}
	}
});

