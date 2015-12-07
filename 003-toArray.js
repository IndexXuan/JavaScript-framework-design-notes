/*******************************************************
    > File Name: 003-toArray.js
    > Author: IndexXuan
    > Mail: indexxuan@gmail.com
    > Created Time: 2015年06月10日 星期三 10时44分14秒
 ******************************************************/

// jQuery的makeArray
var makearray = function(array) {
    var ret = [];
    if (array != null) {
        var i = array.length;
        // the window, srings(and functions) also have 'length'
        if (i == null || typeof array === "string" || jQuery.isFunction(array) || array.setInterval) {
            ret[0] = array;
        } else {
            while (i) {
                ret[--i] = array[i];
            }
        }
    }
    return ret;
}

// ext toArray
var toArray = fucntion() {
    return isIE ?
        function(a, i, j, res) {
            res = [];
            Ext.each(a, function(v) {
                res.push(v);
            });
            return rs.slice(i || 0, j || res.length);
        } :
        function(a, i, j) {
            return Array.prototype.slice.call(a, i || 0, j || a.length);
        }
}();

// mass 
$.slice = window.dispatchEvent ? function(nodes, start, end) {
    return [].slice.call(nodes, start, end);
} : function(nodes, start, end) {
    var ret = [],
        n = nodes.length;
    if (end === void 0 || typeof end === "number" && isFinite(end)) {
        start = parseInt(start, 10) || 0;
        end = end === void 0 ? n : parseInt(end, 10);
        if (start < 0) {
            start += n;
        }
        if (end > n) {
            end = n;
        }
        if (end < 0) {
            end += n;
        }
        for (var i = start; i < end; ++i) {
            ret[i - start] = nodes[i];
        }
    }
    return ret;
}
