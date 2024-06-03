# 双向绑定

**双向绑定**：视图（View）的变化能实时让数据模型（Model）发生变化，而数据的变化也能实时更新到视图层.

![mvvm](/images/mvvm.jpg)

#### Object.defineProperty

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <title>mvvm</title>
    </head>
    <body>
        <p>数据值：<span id="data"></span></p>
        <p><input type="text" onkeyup="keyup()" /></p>
        <script>
            var obj = {
                data: "",
            };

            function keyup(e) {
                e = e || window.event;
                obj.data = e.target.value; // 更新数据值
            }

            Object.defineProperty(obj, "data", {
                get: function () {
                    return this.data;
                },
                set: function (newVal) {
                    document.getElementById("data").innerText = newVal; // 更新视图值
                },
            });
        </script>
    </body>
</html>
```

#### Proxy

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <title>mvvm</title>
    </head>
    <body>
        <p>数据值：<span id="data"></span></p>
        <p><input type="text" onkeyup="keyup()" /></p>
        <script>
            var obj = new Proxy(
                {},
                {
                    get: function (target, key, receiver) {
                        return Reflect.get(target, key, receiver);
                    },
                    set: function (target, key, value, receiver) {
                        if (key === "data") {
                            document.getElementById("data").innerText = value; // 更新视图值
                        }
                        return Reflect.set(target, key, value, receiver);
                    },
                }
            );

            function keyup(e) {
                e = e || window.event;
                obj.data = e.target.value; // 更新数据值
            }
        </script>
    </body>
</html>
```

## Diff

![diff](/images/diff.jpg)
