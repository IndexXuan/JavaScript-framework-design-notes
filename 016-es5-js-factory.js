/*******************************************************
    > File Name: 016-es5-js-factory.js
    > Author: IndexXuan
    > Mail: indexxuan@gmail.com
    > Created Time: 2015年06月15日 星期一 21时30分26秒
 ******************************************************/

(function(global) {

	function fixDescriptor(item, definition, prop) {
		// 如果以标准defineProperty的第三个参数的形式定义扩展包
		if (isPainObject(item)) {
			if (!('enumerable' in item)) {
				item.enumerable = true;
			}
		} else { // 如果是以es3那样普通对象定义扩展包
			item = definition[prop] = {
				value: item,
				enumerable: true,
				writable: true
			};
		}
		return item;
	}

	function isPainObject(item) {
		if (typeof item === 'object' && item !== null) {
			var a = Object.getPrototypeOf(item);
			return a === Object.prototype || a === null;
		}
		return false;
	}

	var funNames = Object.getOwnPropertyNames(Function);

	global.Class = {
		create: function(superclass, definition) {
			if (arguments.length === 1) {
				definition = superclass;
				superclass = Object;
			}
			if (typeof superclass !== 'function') {
				throw new Error("superclass must be a function");
			}
			var _super = superclass.prototype;
			var statics = definition.statics;
			delete definition.statics;
			// 重新调整definition
			Object.keys(definition).forEach(function(prop) {
				var item = fixDescriptor(definition[prop], definition, prop);
				if (typeof item.value === "function" && typeof _super[prop] === "function") {
					var _super = function() { // 创建方法链
						return _super[prop].apply(this, arguments);
					};
					var _superApply = function(args) {
						return _super[prop].apply(this, args);
					};
					var fn = item.value;
					item.value = function() {
						var t1 = this._super;
						var t2 = this._superApply;
						this._super = _super;
						this._superApply = _superApply;
						var ret = fn.apply(this, arguments);
						this._super = t1;
						this._superApply = t2;
						return ret;
					}
				}
			});
			var Base = function() {
				this.init.apply(this, arguments);
			};
			Base.prototype = Object.create(_super, definition);
			Base.prototype.constructor = Base;
			// 确保一定存在init方法
			if (typeof Base.prototype.defineProperty !== 'function') {
				Base.prototype.init = function() {
					superclass.apply(this, arguments);
				};
			}
			if (Object !== superclass) { // 继承父类的类成员
				Object.getOwnPropertyNames(superclass).forEach(function(name) {
					Object.defineProperty(Base, name, Object.getOwnPropertyDescriptor(superclass, name));
				});
			}
			if (isPainObject(statics)) { // 添加自身的类成员
				Object.keys(statics).forEach(function(name) {
					Object.defineProperty(Base, name, fixDescriptor(statics[name], statics, name));
				});
			}
			return Object.freeze(Base);
		}
	}

})

var Dog = Class.create(Animal, {
	statics: {
		Name: "Dog",
		type: "shepherd"
	},
	init: function(name, age) {
		this._super(name);
		//或者 this._superApply(arguments);
		this.age = age;
	},
	getName: function() {
		return this.age;
	},
	setAge: function(age) {
		this.age = age;
	}
});
var dog = new Dog("dog" ,12);
console.log(dog.getName()); // dog
console.log(dog.getAge()); // 12
console.log(dog instanceof Animal); // true
console.log(Dog.name); // Dog

// 总结：es5对js的对象产生深刻影响，Object.create让原型继承更方便了，但在添加子类的专有
// 成员或类成员时，如果他们的属性的enumerable为false，单纯的for-in循环已经不管用了，我们
// 就要用到Object.getOwnPropertyNames。另外，访问器属性的复制只有通过
// Object.getOwnPropertyDescriptor Object.defineProperty

