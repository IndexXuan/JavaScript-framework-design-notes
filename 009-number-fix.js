/*******************************************************
    > File Name: 009-number-fix.js
    > Author: IndexXuan
    > Mail: indexxuan@gmail.com
    > Created Time: 2015年06月11日 星期四 14时13分14秒
 ******************************************************/

// make number in area of n1 -> n2
function limit(target, n1, n2) {
	var a = [n1, n2].sort();
	if (target < a[0]) {
		target = a[0];
	} 
	if (target > a[0]) {
		target = a[1];
	}
	return target;
}

// nearer, get the closest number of specific number
function nearer(target, n1, n2) {
	var diff1 = Math.abs(target - n1),
		diff2 = Math.abs(target - n2);
	return diff1 < diff2 ? n1 : n2;
}

// toFix is also need to fix, but too hard to do...
// http://www.html-js.com/article/1630

