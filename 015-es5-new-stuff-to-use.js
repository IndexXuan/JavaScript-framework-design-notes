/*******************************************************
    > File Name: 014-es5-method-of-Object-2.js
    > Author: IndexXuan
    > Mail: indexxuan@gmail.com
    > Created Time: 2015年06月15日 星期一 20时35分51秒
 ******************************************************/

var obj = {x : 1};

// 等价于
var obj = Object.create(Object.prototype, {
	x: {
		value: 1,
		writable: true,
		enumerable: true,
		configurable: true
	}
});	

if (typeof Object.defineProperty !== 'function') {
	Object.defineProperty = function(obj, prop, desc) {
		if ('value' in desc) {
			obj[prop] = desc.value;
		}
		if ('get' in desc) {
			obj.__defineGetter__(prop, desc.get);
		}
		if ('set' in desc) {
			obj.defineSetter__(prop, desc.set);
		}
		return obj;
	};
}

if (typeof Object.defineProperties !== 'function') {
	Object.defineProperties = function(obj, descs) {
		for (var prop in descs) {
			if (descs.hasOwnProperty(prop)) {
				Object.defineProperty(obj, prop, descs[prop]);
			}
		}
		return obj;
	};
}

var obj = {};
Object.defineProperty(obj, {
	"value": {
		value: true,
		writable: false
	},
	"name": {
		value: "John",
		writable: false
	}
});
var a = 1;
for (var p in obj) {
	a = p;
}
console.log(a); // 1

var obj = {},
	value = 0;
Object.defineProperty(obj, "aaa", {
	set: function(a) {
		value = a;
	},
	get: function() {
		return value;
	}
});
// 一个包含set， get， configuration，enumerable的对象
console.log(Object.getOwnPropertyDescriptor(obj, "aaa"));
console.log(typeof obj.aaa); // number
console.log(obj.hasOwnProperty("aaa")); // true

(function() {
	// 一个包含value writable configurable enumerable的对象
	console.log(Object.getOwnPropertyDescriptor(arguments, "length"));
})（1, 2, 3);

function mixin(receiver, supplier) {
	if (Object.getOwnPropertyDescriptor) {
		Object.keys(supplier).forEach(function(property) {
			Object.defineProperty(receiver, property, Object.getOwnPropertyDescriptor(supplier, property));
		});
	} else {
		for (var property in supplier) {
			if (supplier.hasOwnProperty(property)) {
				receiver[property] = supplier[property];
			}
		}
	}
}

if (typeof Object.create !== 'function') {
	Object.create = function(prototype, descs) {
		function F(); 

		F.prototype = prototype;
		var obj = new F();
		if (descs != null) {
			Object.defineProperties(obj, descs);
		}
		return obj;
	};
}

function Animal(name) {
	this.name = name;
}

Animal.prototype.getName = function() {
	return this.name;
}

function Dog(name, age) {
	Animal.call(this, name);
	this.age = age;
}

Dog.prototype = Object.create(Animal.prototype, {
	getAge: {
		value: function() {
			return this.age;
		}
	},
	setAge: {
		value: function(age) {
			this.age = age;
		}
	}
});

var dog = new Dog("dog", 4);
console.log(dog.name); // dog
dog.setAge(6);
console.log(dog.getAge()); // 6

// 生成一个空对象，没有toString valueOf等方法，什么都没有，空空荡荡
// 在Object.prototype被污染或者极需节省内存的情况下有用。
// 外国人丧心病狂的在旧式ie下模拟了出来。。。 
// https://github.com/kriskowal/es5-shim/blob/master/es5-sham.js
Object.create(null); 

