/*******************************************************
    > File Name: 042-MVVM-bind.js
    > Author: IndexXuan
    > Mail: indexxuan@gmail.com
    > Created Time: 2015年06月29日 星期一 16时20分56秒
 ******************************************************/

/** 
 *  在MVVM中，绑定是View与ViewModel的纽带 ，正因为绑定的存在，我们才能确定要操作的元素节点与文本节点，继而进行类名的
 *  切换，事件绑定，属性更新
 */

/** 
 *  knockoutjs
 *  有如下绑定：
 *  html
 *  css
 *  style
 *  attr
 *  foreach
 *  if
 *  ifnot
 *  with
 *  event
 *  enable
 *  disable
 *  value
 *  hasfocus
 *  checked
 *  options
 *  selectedOptions
 *  uniqueName
 *  template
 */

/** 
 *  rivetsjs
 *  有如下属性:
 *  data-text
 *  data-html
 *  data-value
 *  data-show
 *  data-hide
 *  data-enabled
 *  data-disabled
 *  data-checked
 *  data-unchecked
 *  data-[attribute]
 *  data-class-[class]
 *  data-on-[event]
 *  data-each-[item]
 */

/** 
 *  angularjs
 *  ng-cloak
 *  ng-include
 *  ng-init
 *  ng-model
 *  ng-non-bindable
 *  ng-list
 *  ng-repeat
 *  ng-switch
 *  {{}}
 */

/** 
 *  avalon
 *  ms-class-*
 *  ms-on-*
 *  ms-visible
 *  ms-each-*
 *  ms-if
 *  ms-href
 *  ms-disabled
 *  ms-enabled
 *  ms-controller
 *  ms-model(ms-duplex)
 *  ms-skip
 *  ms-html
 *  ms-important
 */

avalon.ready(function() {
	avalon.define({
		$id: "AAA",
		name: "lightr",
		color: "green"
	});
	avalon.define({
		$id: "BBB",
		name: "sphinx",
		color: "red"
	});
	avalon.define({
		$id: "CCC",
		name: "dragon"
	});
	avalon.define({
		$id: "DDD",
		name: "sirenia"
	});
	avalon.scan();
});

