/*******************************************************
    > File Name: 007-string-fix.js
    > Author: IndexXuan
    > Mail: indexxuan@gmail.com
    > Created Time: 2015年06月10日 星期三 15时43分01秒
 ******************************************************/

// string is a object, very useful in js, it has lots of methods and we can use them to
// fix old browser or make them more powful.


// so we can see...
// contains
function contains(target, it) {
	return target.indexOf(it) != -1; // indexOf 也可以是 search or lastIndexOf
}

// mootool contains, more powful
function contains(target, str, separator) {
	return separator ?
		(separator + target + separator).indexOf(separator + str + separator) > -1 : target.indexOf(str) > -1;
}

// startWith, 判定目标字符串是否处于原字符串的开始之处，可以说是contains方法的变种
function startWith(target, str, ignorecase) {
	var start_str = target.substr(0, str.length);
	return ignorecase ? start_str.toLowerCase() === str.toLowerCase() : 
		start_str === str;
}

// endWith, 与startWith相反
function endWith(target, str, ignorecase) {
	var end_str = target.substring(target.length - str.length);
	return ignorecase ? end_str.toLowerCase() === str.toLowerCase() : end_str === str;
}

// repeat, 重复自身一定的次数
// v1
function repeat(target, n) {
	return (new Array(n + 1)).join(target);
}

// v2, join
function join(target, n) {
	return Array.prototype.join.call({
		length: n + 1
	}, target);
}

// v3, v2优化版
// 利用闭包将类数组对象与数组原型的join方法缓存起来，省的每次都重复创建与寻找方法
var repeat = (function() {
	var join = Array.prototype.join, obj = {};
	return function(target, n) {
		obj.length = n + 1;
		return join.call(obj, target);
	}
})();

// v4, 二分法，比如重复5次，那重复2次时的成果不要浪费
function repeat(target, n) {
	var s = target, total = {};
	while (n > 0) {
		if (n % 2 == 1) {
			total[total.length] = s; // 如果是奇数
		}
		if (n == 1) {
			break;
		}
		s += s;
		n = n >> 1; // 相当于n 除以 2取其商，或者说开2次方
	}
	return total.join('');
}

// v5, v4优化版，免去创建数组和使用join方法，它的悲剧在于它在循环中创建字符串比要求的还长，需要回减
function repeat(target, n) {
	var s = target, c = s.length * n;
	do {
		s += s;
	} while (n = n >> 1) 
	s = s.substring(0, c);
	return s
}

// v6, v4改良版 the best version !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
function repeat(target, n) {
	var s = target, total = "";
	while (n > 0) {
		if (n % 2 == 1) {
			total += s;
		}
		if (n == 1) {
			break;
		}
		s += s;
		n = n >> 1;
	}
	return total;
}

// v7, v6相近，不过浏览器对递归做了优化（包括ie6），与其他版本相比属于上乘方案之一
function repeat(target, n) {
	if (n == 1) {
		return target;
	}
	var s = repeat(target, Math.floor(n / 2));
	s += s;
	if (n % 2) {
		s += target;
	}
	return s;
}

// v8, 可以说是一个反例，很慢，不过实际是可行的，因此实际上没有人将n设置很大
function repeat(target, n) {
	return (n <= 0) ? "" : target.concat(repeat(target, --n));
}


// byteLen获取一个字符串所有字节的长度
// v1
function byteLen(target) {
	var byteLength = target.length, i = 0;
	for (; i < target.length; i++) {
		if (target.charCodeAt(i) > 255) {
			byteLength++;
		}
	}
	return byteLength;
}

// v2 使用正则，支持定制汉字存储字节数
function byteLen(target, fix) {
	fix = fix ? fix : 2;
	var str = new Array(fix + 1).join("-");
	return target.replace(/[^\x00-\xff]/g, str).length;
}


// truncate, 用于对字符串超出部分截断并添加后缀
function truncate(target, length, truncation) {
	length = length || 30;
	truncation = truncation === void 0 ? '...' : truncation; // 小注意的细节,这里为什么判断truncate不存在
}


// camelize方法，转换为驼峰风格
function  camelize(target) {
	if (target.indexOf('-') < 0 && target.indexOf('_') < 0) {
		return target; // check early
	}
	return target.replace(/[-_][^-_]/g, function(match) {
		return match.charAt(1).toUpperCase();
	});
}

// underscored
function underscored(target) {
	return target.replace(/([a-z\d])([A-Z])/g, '$1_$2').replace(/\-/g, '_').toLowerCase();
}

// dasherize, css style
function dasherize(target) {
	return underscored(target).replace(/_/g, '-');
}

// capitalize
function capitalize(target) {
	return target.charAt(0).toUpperCase() + target.substring(1).toLowerCase();
}

// stripTags... what a fuck method...
function stripTags(target) {
	return String(target || "").replace(/<[^>]+>/g, '');
}

// stripScripts, before stripTags to exec to make up for stripTags method
function stripScripts(target) {
	return String(target || "").replace(/<script[^>]*>([\S\s]*?)<\/script>/img, '');
}

// escapeHTML
function escapeHTML(target) {
	return target.replace(/&/g, '&amp;')
	             .replace(/</g, '&lt;')
				 .replace(/>/g, '&gt')
				 .replace(/"/g, "&quot;")
				 .replace(/'/g, "&#39;");
}

// unescapeHTML
function unescapeHTML(target) {
	return target.replace(/&quot;/g, '"')
	             .replace(/&lt;/g, '<')
				 .replace(/&gt;/g, '>')
				 .replace(/&amp;/g, "&")
				 .replace(/&#([\d]+);/g, function($0, $1) {
					 return String.fromCharCode(parseInt($1, 10));
				 });
}

// escapeRegExp, safe format the string
function escapeRegExp(target) {
	return target.replace(/([-.*+?^${}()|[\]\/\\]/g, '\\$1');
}

// pad, fillZero
// v1
function pad(target, n) {
	var zero = new Array(n).join('0');
	var str = zero + target;
	var result = str.substr(-n); // great
	return result;
}

// v2
function pad(target, n) {
    return Array((n + 1) - target.toString().split('').length).join('0') + target;
}

// v3
function pad(target, n) {
	return (Math.pow(10, n) + "" + target).slice(-n);
}

// v4
function pad(target, n) {
	return ((1 << n).toString(2) + target).slice(-n);
}

// v5
function pad(target, n) {
	return (0..toFixed(n) + target).slice(-n);
}

// v6, a very big number and almost enough for daily use
function pad(target, n) {
	return (le20 + "" + target).slice(-n);
}

// v7
function pad(target, n) {
	var len = target.toStrin().length;
	while (len < n) {
		target = "0" + target;
		len++;
	}
	return target;
}

// v8, mass version
function pad(target, n, filling, right, radix) {
	var num = target.toString(radix || 10);
	filling = filling || "0";
	while (num.length < n) {
		if (!right) {
			num = filling + num;
		} else {
			num += filling;
		}
	}
	return num;
}

// format, like printf in C
function format(str, object) {
	var array = Array.prototype.slice.call(arguments, 1);
	return str.replace(/\\?\#{{[^{}]+)\}/gm, function(match, name) {
		if (match.charAt(0) == '\\') {
			return match.slice(1);
		}
		var index = Number(name);
		if (index >= 0) {
			return array[index];
		}
		if (object && object[name] !== void 0) {
			return object[name];
		}
	});
}

// usage for format method
var a = format("Result is #{0}, #{1}", 22, 23);
console.log(a); // Result is 22, 23
var b = format("#name is a #{sex}", {
	name: "Jhon", 
	sex: "man"
});
console.log(b); // Jhon is a man

// quote
var escapeable = /["\\\x00-\x1f\x7f-\x9f]/g,
	meta = {
        '\b': '\\b',
		'\t': '\\t',
		'\n': '\\n',
		'\f': '\\f',
		'\r': '\\r',
		'"' : '\\"',
		'\\': '\\\\'
    };
function quote(target) {
	if (target.match(escapeable)) {
		return '"' + target.replace(escapeable, function(a) {
			var c = meta[a];
			if (typeof c === 'string') {
				return c;
			}
			return '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4);
		}) + '"';
	}
	return '"' + target + '"';
}

// trim
// v1 
function trim(str) {
	return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

// v2, prototype version, a bit slow than v1
function trim(str) {
	return str.replace(/^\s+/, '').replace(/\s+$/, '');
}

// v3, slow than two above, but still very fast
function trim(str) {
	return str.substring(Math.max(str.search(/\S/), 0),
		   str.search(/\S\s*$/) + 1);
}

// v4, very elegant version even it is not fast, some famous frameworks chooes it! 
function trim(str) {
	return str.replace(/^\s+|\s+$/g, '');
}

// v5... v6... do not want to list...

// v10, very very very good one
function trim(str) {
	var whitespace = ' \n\r\t\t\f\x0b\xa0\u2000\u2001\u2002\u2003\n\
	    \u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
    for (var i = 0; i < str.length; i++) {
		if (whitespace.indexOf(str.charAt(i)) === -1) {
			str = str.substring(i);
			break;
		}
	}
	for (i = str.length - 1; i >= 0; i--) {
		if (whitespace.indexOf(str.charAt(i)) === -1) {
			str = str.substring(0, i + 1);
			break;
		}
	}
	return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
}

