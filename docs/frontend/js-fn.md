# Javascript

## 原型与原型链

-   实例的 **proto** 属性（原型）等于其构造函数的 prototype 属性。
-   Object.proto === Function.prototype
-   Function.prototype.proto === Object.prototype
-   Object.prototype.proto === null

## 继承实现

```js
function extend(child, parent) {
    var F = function () {}; // 空函数为中介，减少实例时占用的内存

    F.prototype = parent.prototype; // f继承parent原型

    child.prototype = new F(); // 实例化f，child继承，child、parent原型互不影响

    child.prototype.constructor = child; // child构造函数指会自身，保证继承统一

    child.super = parent.prototype; // 新增属性指向父类，保证子类继承完备
}
```

## 深拷贝

```js
function deepCopy(s, t) {
    t = t || (Object.prototype.toString.call(t) === "[object Array]" ? [] : {});

    for (var i in s) {
        if (typeof s[i] === "object") {
            t[i] = deepCopy(s[i], t[i]);
        } else {
            t[i] = s[i];
        }
    }

    return t;
}
```

## Ajax

```js
var ajax = {};

ajax.get = function (url, fn) {
    var xhr = new XMLHttpRequest();

    xhr.open("GET", url, true);

    xhr.onreadystatechange = function () {
        if (
            xhr.readyState === 4 &&
            (xhr.status === 200 || xhr.status === 403)
        ) {
            fn.call(this, xhr.responseText);
        }
    };

    xhr.send();
};

ajax.post = function (url, data, fn) {
    var xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);

    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function () {
        if (
            xhr.readyState === 4 &&
            (xhr.status === 200 || xhr.status === 403)
        ) {
            fn.call(this, xhr.responseText);
        }
    };

    xhr.send(data);
};
```

## 格式化日期

```js
function formatDate(date, format) {
    if (arguments.length === 0) return null;

    format = format || "{y}-{m}-{d} {h}:{i}:{s}";

    if (typeof date !== "object") {
        if ((date + "").length === 10) date = parseInt(date) * 1000;
        date = new Date(date);
    }

    const dateObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay(),
    };

    const dayArr = ["一", "二", "三", "四", "五", "六", "日"];

    const str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (match, key) => {
        let value = dateObj[key];

        if (key === "a") return dayArr[value - 1];

        if (value < 10) {
            value = "0" + value;
        }

        return value || 0;
    });

    return str;
}
```

## new 实现

```js
function New(Class) {
    let obj = {};
    obj.__proto__ = Class.prototype;
    let res = Class.call(obj);
    return typeof res === "object" ? res : obj;
}
```

## call 实现

```js
Function.prototype.callfb = function (ctx) {
    if (typeof this !== "function") {
        throw new Error("Function undefined");
    }

    ctx = ctx || window;

    const fn = ctx.fn;

    ctx.fn = this;

    const args = [...arguments].slice(1);

    const res = ctx.fn(...args);

    ctx.fn = fn;

    return res;
};
```

## apply 实现

```js
Function.prototype.applyFb = function (ctx) {
    if (typeof this !== "function") {
        throw new Error("Function undefined");
    }

    ctx = ctx || window;

    const fn = ctx.fn;

    ctx.fn = this;

    const args = arguments[1];

    const res = Array.isArray(args) ? ctx.fn(...args) : ctx.fn();

    ctx.fn = fn;

    return res;
};
```

## bind 实现

```js
Function.prototype.bindFb = function (ctx) {
    const fn = this;

    const args = [...arguments].slice(1);

    const F = function () {};

    const fBind = function () {
        return fn.apply(
            this instanceof fBind ? this : ctx,
            args.concat(...arguments)
        );
    };

    if (fn.prototype) {
        F.prototype = fn.prototype;
    }

    fBind.prototype = new F();

    return fBind;
};
```

## instanceof 实现

```js
function instanceofFb(left, right) {
    let proto,
        prototype = right.prototype;

    proto = left.__proto__;

    while (proto) {
        if (proto === prototype) {
            return true;
        }

        proto = proto.__proto__;
    }

    return false;
}
```

## Promise 实现

```js
function promiseFb(fn) {
    const _this = this;
    this.state = "pending"; // 初始状态为pending
    this.value = null;
    this.resolvedCallbacks = []; // 这两个变量用于保存then中的回调，因为执行完Promise时状态可能还是pending
    this.rejectedCallbacks = []; // 此时需要吧then中的回调保存起来方便状态改变时调用

    function resolve(value) {
        if (_this.state === "pending") {
            _this.state = "resolved";
            _this.value = value;
            _this.resolvedCallbacks.map((cb) => {
                cb(value);
            }); // 遍历数组，执行之前保存的then的回调函数
        }
    }

    function reject(value) {
        if (_this.state === "pending") {
            _this.state = "rejected";
            _this.value = value;
            _this.rejectedCallbacks.map((cb) => {
                cb(value);
            });
        }
    }

    try {
        fn(resolve, reject);
    } catch (e) {
        reject(e);
    }
}

promiseFb.prototype.then = function (onFulfilled, onRejected) {
    // 因为then的两个参数均为可选参数，
    // 所以判断参数类型本身是否为函数，如果不是，则需要给一个默认函数如下（方便then不传参数时可以透传）
    // 类似这样： Promise.resolve(4).then().then((value) => console.log(value))
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (fn) => fn;
    onRejected =
        typeof onRejected === "function"
            ? onRejected
            : (e) => {
                  throw e;
              };

    switch (this.state) {
        case "pending":
            // 若执行then时仍为pending状态时，添加函数到对应的函数数组
            this.resolvedCallbacks.push(onFulfilled);
            this.rejectedCallbacks.push(onRejected);
            break;
        case "resolved":
            onFulfilled(this.value);
            break;
        case "rejected":
            onRejected(this.value);
            break;
        default:
            break;
    }
};

promiseFb.all = function (promises) {
    // 当这个数组里的所有promise对象全部变为resolve状态的时候，才会resolve
    return new Promise((resolve, reject) => {
        let done = gen(promises.length, resolve);
        promises.forEach((promise, index) => {
            promise.then((value) => {
                done(index, value);
            }, reject);
        });
    });
};

function gen(lenth, resolve) {
    let count = 0;
    let values = [];
    return function (i, value) {
        values[i] = value;
        if (++count === lenth) {
            resolve(values);
        }
    };
}

promiseFb.race = function (promises) {
    // 只要有一个promise对象进入 FulFilled 或者 Rejected 状态的话，就会继续进行后面的处理
    return new Promise((resolve, reject) => {
        promises.forEach((promise) => {
            promise.then(resolve, reject);
        });
    });
};

promiseFb.prototype.catch = function (onRejected) {
    // 用于promise方法链时 捕获前面onFulfilled/onRejected抛出的异常
    return this.then(null, onRejected);
};

promiseFb.resolve = function (value) {
    return new Promise((resolve, reject) => {
        resolve(value);
    });
};

promiseFb.reject = function (reason) {
    return new Promise((resolve, reject) => {
        reject(reason);
    });
};
```

## debounce 防抖

```js
function debounce(fn, wait, immediate) {
    let timer;
    return function () {
        if (immediate) {
            fn.apply(this, arguments);
        }
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, arguments);
        }, wait);
    };
}
```

## throttle 节流

```js
function throttle(fn, wait) {
    let prev = new Date();
    return function () {
        const now = new Date();
        if (now - prev > wait) {
            fn.apply(this, arguments);
            prev = now;
        }
    };
}
```