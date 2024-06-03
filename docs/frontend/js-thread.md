# JS 单线程运行机制

-   消息队列：消息队列是一个先进先出的队列，它里面存放着各种消息。
-   事件循环：事件循环是指主线程重复从消息队列中取消息、执行的过程。

主线程只会做一件事情，就是从消息队列里面取消息、执行消息，再取消息、再执行。当消息队列为空时，就会等待直到消息队列变成非空。而且主线程只有在将当前的消息执行完成后，才会去取下一个消息。这种机制就叫做事件循环机制，取一个消息并执行的过程叫做一次循环。消息就是注册异步任务时添加的回调函数。

## 事件循环

macroTask(宏任务): 主代码块, setTimeout, setInterval, setImmediate, requestAnimationFrame, I/O, UI rendering

microTask(微任务): process.nextTick, Promise, Object.observe, MutationObserver
