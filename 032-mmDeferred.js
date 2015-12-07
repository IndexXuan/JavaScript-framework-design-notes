/*******************************************************
    > File Name: 032-mmDeferred.js
    > Author: IndexXuan
    > Mail: indexxuan@gmail.com
    > Created Time: 2015年06月22日 星期一 22时58分52秒
 ******************************************************/

(function() {

    var noop = function() {};

    function Deferred(mixin) {

        var state = "pending",
            dirty = false;

        function ok(x) {
            state = "fulfilled";
            return x;
        }

        function ng(e) {
            state = "rejected";
            throw e;
        }

        var dfd = {
            callback: {
                resolve: ok,
                reject: ng,
                notify: noop,
                ensure: noop
            },
            dirty: function() {
                return dirty;
            },
            state: function() {
                return state;
            },
            promise: {
                then: function() {
                    return _post.apply(null, arguments);
                },
                otherwise: function(onReject) {
                    return _post(0, onReject);
                },
                // https://github.com/cujojs/when/issues/103
                ensure: function(onEnsure) {
                    return _post(0, 0, 0, onEnsure);
                },
                _next: null
            }
        }
        if (typeof mixin === "function") {
            mixin(dtd.promise);
        } else if (mixin && typeof mixin === "object") {
            for (var i in mixin) {
                if (!dfd.promise[i]) {
                    dfd.promise[i] = mixin[i];
                }
            }
        }

        "resolve,reject,notify".replace(/\w+/g, function(method) {
            dfd[method] = function() {
                var that = this,
                    args = arguments;
                if (that.dirty()) {
                    _fire.call(that, method, args);
                } else {
                    Deferred.nextTick(function() {
                        _fire.call(that, method, args);
                    })
                }
            }
        })
        return dfd;

        function _post() {
            var index = -1,
                fns = arguments;
            "resolve,reject,notify,ensure".replace(/\w+/g, function(method) {
                var fn = fns[++index];
                if (typeof fn === "function") {
                    dirty = true;
                    if (method === "resolve" || method === "reject") {
                        dfd.callback[method] = function() {
                            try {
                                var value = fn.apply(this, arguments);
                                state = "fulfilled";
                                return value;
                            } catch (e) {
                                state = "reject";
                                return e;
                            }
                        }
                    } else {
                        dfd.callback[method] = fn;
                    }
                }
            });
            var deferred = dfd.promise._next = Deferred(mixin);
            return deferred.promise;
        }

        function _fire(method, array) {
            var next = "resolve",
                value;
            if (this.state() === "pending" || method === "notify") {
                var fn = this.callback[method];
                try {
                    value = fn.apply(this, array);
                } catch (e) {
                    value = e;
                }
                if (this.state() === "reject") {
                    next = "reject";
                } else if (method === "notify") {
                    next = "notify";
                }
                array = [value];
            }
            var ensure = this.callback.ensure;
            if (noop !== ensure) {
                try {
                    ensure.call(this); // 模拟finally
                } catch (e) {
                    next = "reject";
                    array = [e];
                }
            }
            var nextDeferred = this.promise._next;
            if (Deferred.isPromise(value)) {
                value._next = nextDeferred;
            } else {
                if (nextDeferred) {
                    _fire.call(nextDeferred, next, array);
                }
            }
        }

    }
    window.Deferred = Deferred;
    Deferred.isPromise = function(obj) {
        return !!(obj && typeof obj.then === "function");
    };

    function some(any, promises) {
        var deferred = Deferred(),
            n = 0,
            result = [],
            end;

        function loop(promise, index) {
            promise.then(function(ret) {
                if (!end) {
                    result[index] = ret; // 保证回调的顺序
                    n++;
                    if (any || n >= promises.length) {
                        deferred.resolve(any ? ret : result);
                        end = true;
                    }
                }
            }, function(e) {
                end = true;
                deferred.reject(e);
            });
        }
        for (var i = 0, l = promises.length; i < l; i++) {
            loop(promises[i], i);
        }
        return deferred.promise;
    }
    Deferred.all = function() {
        return some(false, arguments);
    };
    Deferred.any = function() {
        return some(true, arguments);
    };

    var BrowserMutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    if (BrowserMutationObserver) {
        Deferred.nextTick = function(callback) {
            var input = document.createElement("input");
            var observer = new BrowserMutationObserver(function(mutations) {
                mutations.forEach(function() {
                    callback();
                });
            });
            observer.observer(input, {
                attributes: true
            });
            input.setAttribute("value", Math.random());
        }
    } else if (window.VBArray) { // ie
        Deferred.nextTick = function(callback) {
            var node = document.createElement("script");
            node.onreadystatechange = function() {
                callback();
                node.onreadystatechange = null;
                node.parentNode && node.parentNode.removeChild(node);
                node = null;
            };
            document.documentElement.appendChild(node);
        }
    } else if (window.postMessage && window.addEventListener) {
        Deferred.nextTick = function(callback) {
            function onGlobalMessage(event) {
                if (typeof event.data === "string" && event.data.indexOf("usePostMessage") === 0) {
                    callback();
                }
            }
            window.addEventListener("message", onGlobalMessage);
            var now = new Date - 0;
            window.postMessage("usePostMessage" + now, "*");
        }
    } else {
        Deferred.nextTick = function(callback) {
            setTimeout(callback, 0);
        }
    }


})();

