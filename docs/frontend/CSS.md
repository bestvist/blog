# CSS

## CSS 样式

优先级: 行内样式 > 链接式 > 内嵌式 > @import 导入式

## 选择器

```css
/* 选择所有元素 */
* {
}

/* 选择 div 元素 */
div {
}

/* 选择类名元素 */
.class {
}

/* 选择 id 元素 */
#id {
}

/* 选择 div 元素内的所有 p 元素 */
div p {
}

/* 选择 div 元素内下一层级的 p 元素 */
div > p {
}
```

css 选择器权重: !important -> 行内样式 -> #id -> .class -> 元素和伪元素 -> \* -> 继承 -> 默认

## 文本溢出

```css
// 文本溢出单行显示
.single {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

// 文本溢出多行显示
.multiple {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
}
```

## CSS3 新特性

-   transition：过渡
-   transform：旋转、缩放、移动或者倾斜
-   animation：动画
-   gradient：渐变
-   shadow：阴影
-   border-radius：圆角
