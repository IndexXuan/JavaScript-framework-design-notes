/*******************************************************
    > File Name: 012-browser-snif.js
    > Author: IndexXuan
    > Mail: indexxuan@gmail.com
    > Created Time: 2015年06月11日 星期四 18时49分47秒
 ******************************************************/

// mass framework
define("browser", function() {
	var w = window, ver = w.opera ? (opera.version().replace(/\d$/, "") - 0) 
	    : parseFloat((/(?:IE|fox\/ome\/|ion\/)(\d+\.\d)/.exec(navigator.userAgent) || [,0])[1]);
	return {
		// test ie or kernel is trident, if exists, get the version
		ie: !!w.VBArray && Math.max(document.documentMode || 0, ver),
		firefox: !!w.netscape && ver, // Gecko
		opera: !!w.opera && ver, // Presto
		chrome: !!w.chrome && ver,
		safari: /apple/i.test(navigator.vendor) && ver // WebCore
	}  
});

// some tricks
ie = !!document.recalc
ie = !!window.VBArray
ie = !!window.ActiveXObject
ie = !!window.createPopup;
ie = document.expando; // document.all is also in old version of ie and opera
ie678 = !-[1, ];
ie678 = '\v' == 'v';
ie678 = 0.9.toFixed(0) == "0";
ie8 = window.toStaticHTML
ie9 = window.msPerformance

ie67 = !"1"[0]; // ie6 / 7不支持string的下标取值，需要使用charAt

