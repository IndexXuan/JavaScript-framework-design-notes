/*******************************************************
    > File Name: 011-date-fix.js
    > Author: IndexXuan
    > Mail: indexxuan@gmail.com
    > Created Time: 2015年06月11日 星期四 17时04分46秒
 ******************************************************/

/** 
 *  new Date();
 *  new Date(value);
 *  new Date(detaString)
 *  new Date(year, month, day /*, hour, minute, second, millisecond 
 *  recomand you just use "2015/06/11 17:04:18", it can be resolved by all browsers
 */

if (!Date.now) {
	Date.now = function() {
		return +new Date;
	}
}

if (!Date.prototype.toISOString) {
	void function() {
		function pad(number) {
			var r = String(number);
			if (r.length === 1) {
				r = '0' + r;
			}
			return r;
		}

		Date.prototype.toJSON = Date.prototype.toISOString = function() {
			return this.getUTCFullYear()
			       + '-' + pad(this.getUTCMonth() + 1)
				   + '-' + pad(this.getUTCDate())
				   + 'T' + pad(this.getUTCHours())
				   + ':' + pad(this.getUTCMinutes())
				   + ':' + pad(this.getUTCSeconds())
				   + '.' + String((this.getUTCMilliseconds() / 1000).toFixed(3)).slice(2, 5)
				   + 'Z';
		};

	}();
}

// fix ie67 getYear, setYear
if ((new Date).getYear() > 1900) {
	Date.prototype.getYear = function() {
		return this.getFullYear() - 1900; // -1900
	};
	Date.prototype.setYear = function(year) {
		return this.setUTCFullYear(year); // +1900
	}
}

// useful methods
// get period
var getDatePeriod = function(start, finish) {
	return Math.abs(start * 1 - finish * 1) / 60 / 60 / 1000 / 24;
}

// locate the index of the date in month
var getFirstDateInMonth = function(date) {
	return new Date(date.getFullYear(), date.getMonth(), 1);
}

// locate the last day of the input date
var getLastDateMonth = function(date) {
	return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

// locate the first day of the season of the input date
var getFirstDateInQuarter = function(date) {
	return new Date(date.getFullYear(), ~~(date.getMonth() / 3) * 3, 1);
}

// locate the last day of the season of the input date
var getLastDateInQuarter = function(date) {
	return new Date(date.getFullYear(), ~~(date.getMonth() / 3) * 3 + 3, 0);
}

Date.prototype.isLeapYear = function() {
	return new Date(this.getFullYear(), 2, 0).getDate() == 29;
}

function getDaysInMonth(date) {
	switch (date.getMonth()) {
		case 0:
		case 2:
		case 4: 
		case 6:
		case 7:
		case 9:
		case 11:
		  return 31;
		case 1:
			var y = date.getFullYear();
		    return y % 4 == 0 && y % 100 != 0 || y % 400 == 0 ? 29 : 28;
		default:
			return 30;
	}
}

// dateFormat: https://github.com/RubyLouvre/mass-Framework/blob/1.41/avalon.js

