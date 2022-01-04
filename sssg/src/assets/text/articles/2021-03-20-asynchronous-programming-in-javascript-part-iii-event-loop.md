# Asychronous Programming in JavaScript. Part III. Event Loop

* Event Loop in Browser
  * Core Concepts
    * Events
    * Call Stack
    * Event Loop
    * Queues
      * Macrotask Queue
      * Microtask Queue
  * How everything works together
  * Examples
* Event Loop in Node.js
  * Computationally intensive code and the Node.js Event Loop
    * Algorithmic refactoring
    * Creating a backend service
* References 
  
---

This article covers two main JavaScript Runtime Environments: Browser and Node.js



## Event Loop in Browser

![](./../../../img/event-loop-in-browser.svg)



### Core Concepts

#### Events

(if needed delete this paragraph, nothing too important here)

A web browser is an interactive interface for web pages. User click on elements, scroll down pages, or type using the keyboard. All these actions fire user events which the browser exposes as a part of the JavaScript runtime environment. Beyond that, the user isn’t the only source of events. Your scripts can create events as well. A very special type of events you create is a timer event. You can delay execution of some code by a specified amount of time. The browser handles these events with the already mentioned event loop. But that’s not all, you can use browser's API to communicate via the network with the server side of your application. The result of network communication is also an event.



#### Call Stack

> If you need more details on how Stack operates, read this article: http://wiki.com/doku.php?id=execution_context_lexical_environment#stack 

**Сall stack** - это структура данных типа «стек», для хранения вызванных в данный момент Execution Context'ов. При помощи неё JS-интерпретатор отслеживает своё текущее местоположение в процессе выполнения кода.

От начала выполнения и до самого завершения программы, стек не остаётся пустым ни на секунду. На дне стека всегда находится как минимум Global EC (в нём хранится весь код находящийся в глобальной области видимости). При этом если в стеке находится лишь Global EC, принято говорить, что стек пустой, такой вот нюанс.

Каждый вызов функции тоже создаёт свой EC. Если в функции есть вложенный вызов, а в нём ещё один вложенный и т.д. то в сумме они формируют столбик таких EC-ов, который и называется стеком.

В Chrome присутствует лимит на количество Execution Context'ов (=фреймов), которые могут одновременно находится в стеке -- 16 000 EC. Если попытаться добавить в стек больше этого числа, мы получим RangeError: `Maximum Call Stack Size Exceeded`.

Example of how call stack works:
```js
function foo(b) {
  var a = 10;
  return a + b + 11;
}

function bar(x) {
  var y = 3;
  return foo(x * y);
}
console.log(bar(7)); //returns 42
```

1. вызов `bar()` создаёт первый EC. В нём хранятся аргументы и локальные переменные этой функции. 

2. Интерпретатор начинает его выполнять.

3. встречает `return foo(x * y)`, срабатывает вызов `foo()`, и создаётся второй EC, который помещается поверх первого EC функции `bar()`. EC `foo()` точно также хранит в себе аргументы и локальные переменные  `foo()`

4. когда EC `foo()`, являющийся на текущий момент самым верхним в стеке, выполнился и вернул значение, верхний EC удаляется из стека и в стеке остаётся только тот EC что был под ним, т.е. EC `bar()`. 

5. срабатывает `return` у `bar()`, и её EC тоже удаляется из стека



#### Event Loop

Browser JavaScript execution flow, as well as in Node.js, is based on an Event Loop.

In general, in most browsers there is an Event Loop for every browser tab, to make every process isolated and avoid a web page with infinite loops or heavy processing to [block](http://wiki.com/doku.php?id=how_js_executes_code#%D0%B1%D0%BB%D0%BE%D0%BA%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%B0_%D0%BF%D0%BE%D1%82%D0%BE%D0%BA%D0%B0) your entire browser.

> Actually, the environment manages *multiple* concurrent Event Loops. For example, Web Workers run in their own Event Loop. But for now, it doesn't matter. During reading all this article you can safely think about only one Event Loop per browser's tab i.e. page, imagine only a single Event Loop per tab. The situations when there are many Event Loops are rare and will be discussed apart.
>
> For now, the only important thing is: you mainly need to be concerned that *your code* will run on a *single* Event Loop, and write code with this thing in mind to avoid blocking it.


**The concept of Event Loop is very simple. When you open browser's tab (page) or run Node.js, there’s an endless loop, when JavaScript engine waits for tasks, executes them and then sleeps waiting for more tasks.**

**The general algorithm of the engine:**

1. While there are tasks:
  * execute them, starting with the oldest task 
2. Sleep until a task appears, then go to 1.


That’s a formalization for what we see when browsing a page. JavaScript engine does nothing most of the time, only runs if something happened and generated a new task(s) in the Queue. Queue is the place where all tasks that are need to be done stored. If there is a task(s) in the Queue — JS Engine runs handling these tasks(s) until all tasks are processed and Queues are empty. If there is no tasks i.e. the Queue is empty, JS Engine sleeps, checking endlessly in background "are there any new tasks in the Queue to handle?"

Tasks are handles *one at a time* in a sense that the task in any queue runs to completion and can’t be interrupted by another task (do not confuse this with "one macrotask in one iteration" rule).

In order to simplify things, till this moment I wrote that there is a Queue. But in fact, there is no single Queue. Instead we have two separate Queues: 1) Macrotask Queue and 2) Microtask Queue. Tasks from any type of queue are processed on “first come – first served” basis. I will explore this in details later, but for now remember: on each Event Loop iteration, JS Engine 1) executes only 1 task from Macrotask Queue, then 2) executes ALL tasks in Microtasks Queue, then 3) if re-rendering of the pages is needed, rerenders the page. Then this loop repeats untill no tasks in Queues left. We will explore the details later.

**Also, don't forget about blocking!** Always keep in mind, that rendering never happens while the engine executes a task (no matter from which Queue the task is). Doesn’t matter if the task takes a long time. *Changes to DOM are painted only after the task is complete*.

If a task takes too long, the browser can’t do other tasks, process user events, so after a time it raises an alert like “Page Unresponsive” suggesting to kill the task with the whole page. That happens when there are a lot of complex calculations or a programming error leading to infinite loop.

So, going back to discussing Queues and tasks — as I have already mentions, the tasks in Queues always created by some events. Depending on their type, some events generate tasks in Macrotask Queue while others in Microtask Queue. 



#### Queues

The Event Loop usually has access to at least two task queues: a Macrotask Queue and a Microtask Queue. 

But, although the implementation of an Event Loop should use at least one queue for macrotasks (i.e. Macrotask Queue) and at least one queue for microtasks (i.e. Microtask Queue), the Event Loop implementations usually go beyond that, and have several queues for different types of macro- and microtasks. This enables the Event Loop to prioritize types of tasks; for example, giving priority to performance-sensitive tasks such as user input. On the other hand, because there are many browsers and JavaScript execution environments out in the wild, you shouldn’t be surprised if you run into Event Loops with only a single queue for both types of tasks together.

In this article we will explore only the classic situation, when we have only two Queues: Microtask and Microtask.

We won't use this information in this articles, but keep in mind for the future:
* To schedule a new macrotask: Use zero delayed `setTimeout(f)`.
* To schedule a new microtask: Use `queueMicrotask(f)`. 



##### Macrotask Queue

Examples of events triggering the creation of new tasks in Macrotask Queue:

* when an external script `<script src="...">` loads, the tasks is "Execute it" / AFAIU, if there is no aforementioned tag, but we have `<script>...</script>` tag, the task generally is the same: execute mainline (or global) JavaScript code. 

  **NOTE**. Generally, in context of this articles the only thing you should understand is that when the JS file is downloaded or `<script>` tag parsed, this generates a new task in queue). 

* when a user moves their mouse, the task is "Dispatch `mousemove` event and execute handlers".

* when the time is due for a scheduled `setTimeout`, the task is "Run its callback". 

* examples of other events triggering the creation of new tasks: 
  * creating the main document object
  * parsing HTML
  * changing the current URL, as well as various events such as page loading, input, network events, and timer events
  * `setTimeout`, `setInterval`, `setImmediate`
  * `addEventListener`
  * <del>`fetch`</del>,
  * `requestAnimationFrame`
  * I/O
    * reading/writing data from/to a disk
    * making HTTP requests
    * and talking to databases
    * ...
  * ...and so on.


The tasks generated by these events form a queue, so-called "Macrotask Queue" (v8 term). From the browser’s perspective, a macrotask represents one discrete, self-contained unit of work. 

So, tasks are set – the engine handles them – then waits for more tasks (while sleeping and consuming close to zero CPU).

It may happen that a task comes while the engine is busy, then it’s enqueued. For instance, while the engine is busy executing a `script`, a user may move their mouse causing `mousemove`, and `setTimeout` may be due and so on, these tasks form a Macrotask Queue.

As I've mentioned above already, tasks from any type of queue are processed on “first come – first served” basis. In context of Macrotask Queue it means that, if the tasks happened in this order: 1. script downloaded -> 2. user moved the mouse -> 3. timer is scheduled, then  when the engine browser is done with the `script`, it handles `mousemove` event, then `setTimeout` handler, and so on.



##### Microtask Queue

Examples of events triggering the creation of new tasks in Microtask Queue:

* promise handlers (callbacks): `then`, `catch`, `finally`
* `async`/`await`
* `MutationObserver` — DOM mutation changes (they are mentioned only in "JavScript Ninjs" book; I don't understand what is it yet but looks like it's not very important thing, at least for now)
* `process.nextTick()` (in Node.js)
* `queueMicrotask` 

**Microtasks come solely from our code** (i.e. as far as I understand, they're not created by external APIs, but by JavaScript itself).

JS Engine checks Microtask Queue right after Macrotask Queue, but before the page rendering stage.

Microtasks are smaller tasks that update the application state and as I've already mentioned above should be executed before the browser continues with other assignments such as re-rendering the UI. Thus, microtasks enable us to execute certain actions before the UI is re-rendered, thereby avoiding unnecessary UI rendering that might show inconsistent application state.

  * **Example: Synchronous code + Macrotask Queue + Microtask Queue.** Notice that the promise handler (`than` callback) is executed before the `setTimeout`, because promise responses are stored inside the Microtask Queue. 
  
    Повторю ещё раз: если в Microtask Queue не одно, а больше заданий, то вне зависимости от любых условий, сначала должны выполнится все эти задания из Microtask Queue, и только после этого JS Engine сможет отрендерить страницу (если это требуется) и перейти к следующей итерации Event Loop'а
    ```js
    console.log('Script start');

    setTimeout(() => {
      console.log('setTimeout');
    }, 0);

    new Promise((resolve, reject) => {
        resolve('Promise resolved');
      }).then(res => console.log(res))
        .catch(err => console.log(err));

    console.log('Script End');

    // Output:

    Script start
    Script End
    Promise resolved
    setTimeout

    /* What happens under the hood: */

    /* Event Loop Iteration 1: */

    // execute one macrotask (i.e. all code in the file): */
    Script start
    // — setTimeout added and removed from the stack. Timer ticks in parallel thread. As we have passed '0' delay, the new macrotask instantly
    // created and already waits in Macrotask Queue 
    // — executor in Promise runs. As we have instantly called 'resolve' inside executor, the Promise instantly resolves, but 'then' callback
    // always runs asynchronously, so the task to execute 'then' callback is created in Microtask Queue
    Script End
    // — execute all Microtasks (runs 'then' callback):
    Promise resolved
    // — page rendering happens. End of 1st iteration of Event Loop

    /* Event Loop Iteration 2: */ 

    // execute one macrotask: takes the callback from setTimeout from Macrotask Queue
    setTimeout 
    ```


### How everything works together

Now, as we have discussed each part of the process individually, let's see how everything works together.

![](./../../../img/event-loop-in-browser.svg)

Imagine Event Loop as an infinitely repeating loop. Every time the Event Loop takes a full trip (=iteration), we call it a [*tick*](https://nodejs.dev/understanding-process-nexttick). This loop repeats the same algorithm on each iteration ([source](https://javascript.info/event-loop#summary)):
  - **check Macrotask Queue — execute *only 1 task***. Even if there are many macrotasks in the queue already, only a single (i.e. ONE) task is processed during a single iteration of the loop, it's a crucially important detail. After the task (this single task) is 100% executed go to step 2. In case when there is no tasks, just wait till a new macrotask appears. 
  - **check Microtask Queue — execute *all tasks* from Microtask Queue**. *All* microtasks should be executed before the next rendering, because their goal is to update the application state *before* rendering occurs. (*)
  - **render changes if any**. When the Microtask Queue is finally empty, the Event Loop checks whether a UI render update is required, and if it is, the UI is re-rendered. Because updating the UI is a complex operation, if there isn’t an explicit need to render the page, the browser may choose not to perform the UI rendering in this loop iteration (check the interesting example "progress indication" in the end of the article)

Also, I emphasize: note the difference between handling the Macrotask and Microtask Queues: In a __single loop iteration__, *one macrotask at most* is processed (others are left waiting in the queue), whereas *all* microtasks are processed. 

> **(*)** — while these microtasks are processed, they can queue even more microtasks, which will all be run one by one, until the microtask queue is exhausted). If a microtask recursively queues other microtasks, it might take a long time until the next macrotask is processed. This means, you could end up with a blocked UI, or some finished I/O idling in your application. However, at least concerning Node.js's `process.nextTick` function (which queues microtasks), there is an inbuilt protection against such blocking by means of process.maxTickDepth. This value is set to a default of 1000, cutting down further processing of microtasks after this limit is reached which allows the next macrotask to be processed)

---

**Abstract Example**

As you already know, Event Loop starts when we open a browser's tab (i.e. a new page) and spins infinitely until we close it. Usually there is a `<script src="script.js>` tag (there maybe inline JavaScript code (`<script>...</script>`) instead of `<script src="...>` tag, it doesn't change much. In such case, the first task will be not "Execute the downloaded script" but "Execute mainline (or global) JavaScript code", which generally is the same thing)), the browser needs to download an external script. 

When the script is downloaded, this event automatically creates a new task in Macrotask Queue: "Execute the downloaded script". As always, there is also a function to execute, associated with this task. It's not technically accurate, but you can imagine this function as anonymous self-executing function wrapping ALL the code inside the file i.e. this function is the one that creates a Global EC. The main point here is that the JS Engine considers executing all code in the file (i.e. 100% of this function) as handling one single task in Macrotask Queue.

During the execution of this task, when the Engine encounters asynchronous function calls, it evokes them, pushes to the stack, removes from the stack and continues executing synchronous code further, while asynchronous functions continue their execution in concurrent threads created by the runtime environment. When any asynchronous function is finished (example: got the response from DB), the API it belongs to will push a task to the Macro/Microtask Queue (with associated callback we provided to this asynchronous function). 

So here is how Event Loop works after the browser downloaded the external JS file or parsed the `<script>` tag:

  1. ... между моментом своего создания при открытии вкладки и до момента загрузки скрипта Event Loop совершал итерации по этому же алгоритму (описанному выше) просто вхолостую...
  
  2. **1st Iteration:**
     1. checks Macrotask Queue — there is a task "Execute the downloaded script".
     
        1. processes the task by executing all the code within a downloaded file. 
        
           During the execution, all asynchronous functions will be added and deleted from the stack, continuing their execution concurrently in background. When they will finish, their APIs will create new tasks in Macro/Microtask Queue. Suppose we have three `setTimeout` functions and 3 Promise-related functions. So after some time, when done, `setTimeout` functions will create tasks in Macrotask Queue and promise-related functions will create tasks in Microtask Queue. "Tasks" usually is "Execute the provided callback function".
           
  3. check Microtask Queue — if there are any tasks, execute them ALL, one after another. Suppose, while macrotask 1 above was in process, all our promise-related functions already completed and generated 3 new tasks in Microtask Queue (these tasks usually are "execute provided callback functions"). So JS Engines handles all these tasks right now by executing the provided callback functions
  
  4. render the page if needed
  
  5. **2nd Iteration:**
     1. check Macrotask Queue — there are 2 tasks left from our `setTimeout` functions. Execute only ONE of them
     2. check Microtask Queue — it is empty
     3. render the page if needed
  
  6. **3rd Iteration:**
     1. check Macrotask Queue — there is 1 task left from our `setTimeout` function. Execute only ONE of them
     2. check Microtask Queue — it is empty
     3. render the page if needed
    
  7. **4th Iteration:**
     1. check Macrotask Queue — it is empty
     2. check Microtask Queue — it is empty
     3. render the page if needed

  8. ... Event Loop продолжает совершать итерации по этому же алгоритму просто вхолостую ожидая появления новых tasks...

> (In the future, move this paragraph to separate article cause this is a big topic)
>
> **Several runtimes communicating together**
>
> A web worker or a cross-origin `iframe` has its own stack, heap, and Macrotask Queue. Two distinct runtimes can only communicate through sending messages via the `postMessage` method. This method adds a message to the other runtime if the latter listens to `message` events.



### Examples

* Examples explaining above-listed theory:
  * http://wiki.com/doku.php?id=interpreter_internals_and_asynchrony#event_loop
  * http://wiki.com/doku.php?id=interpreter_internals_and_asynchrony#event_loopmicro_macrotask_queue_use-case_2progress_indication
  * http://wiki.com/doku.php?id=interpreter_internals_and_asynchrony#event_loopsync_code_macrotask_queue_microtask_queue

* The typical use-cases of using macro/micro tasks are:
  * [splitting CPU-hungry tasks](https://javascript.info/event-loop#use-case-1-splitting-cpu-hungry-tasks)
  * [progress indication](https://javascript.info/event-loop#use-case-2-progress-indication) (Although this is the link pointing to the original example with all explanation, I will shortly explain this example here, just cause it is very important: [[http://wiki.com/doku.php?id=interpreter_internals_and_asynchrony#event_loopmicro_macrotask_queue_use-case_2progress_indication|link]])
  * [doing something after the event](https://javascript.info/event-loop#use-case-3-doing-something-after-the-event)



## Event Loop in Node.js

![](./../img/event-loop-v1.svg)

***Node.js Event Loop.** My own illustration.*

---

![](./../img/nodejs-event-loop.png)

***Node.js Event Loop.** Illustration from [Node.js course from IBM](https://developer.ibm.com/technologies/node-js/tutorials/learn-nodejs-the-event-loop/)*

> (both images are correct, I just created more verbose one)

**[Full Event Loop theory (IBM Course)](https://developer.ibm.com/technologies/node-js/tutorials/learn-nodejs-the-event-loop/# (I've backed up it to disk)**

**Important facts:**
  * From trusted [Node.js Course](https://jscomplete.com/learn/node-beyond-basics/learning-node-runtime) **What will Node do when the Call Stack and the Event Loop queues are all empty?** It will simply exit. 
  
    When you run a Node program, Node will automatically start the Event Loop and when that Event Loop is idle and has nothing else to do, the process will exit. 
  
    To keep a Node process running, you need to place something somewhere in event queues. For example, when you start a timer or an HTTP server you are basically telling the Event Loop to keep running and checking on these events. 
    
    AFAIU, same happens when you register event listeners (`on`) — i.e. if you have any registered event listeners in your code, the Event Loop will be running infinitely. It will exit only if (when) you remove all these event listeners; same idea is described on [Stackoverflow](https://stackoverflow.com/questions/56376508/how-are-all-the-events-listeners-in-javascript-kept-active-or-alive)

  * У `setTimeout` и `setInterval`, когда ты указываешь время задержки `0` или вообще его не указываешь, оно автоматом конвертируется в `1ms` (инфа из [IBM Course](https://developer.ibm.com/technologies/node-js/tutorials/learn-nodejs-the-event-loop/#)). Т.е. когда мы указываем задержку `0`, task в очереди всегда создаётся через 1ms. Это может приводить к тому, что колбэки этих функций будут вызываться только на второй итерации лупа, а на первой итерации Node их не увидит. 

  * Боле того, как я написал выше, tasks `setTimeout` и `setInterval` в очереди всегда будут создаваться спустя указанное время задержки (либо 1ms, если задержка `0`, см. выше), НО сами колбэки могут быть вызваны немного позже указанного времени. Почему? Потому что, непосредственно итерация лупа может выполняться *дольше указанной задержки таймера*, т.е. task таймера в очереди уже создан, но Event Loop ещё не прошёл всю текущую итерацию, а застрял где-то например на фазе Poll. Таким образом ивент луп сделает полный круг и наконец-то снова подойдёт к фазе "Timers"s спустя скажем 2-3ms или более  — и вот в этот момент будут выполнены tasks или Timers Queue, несмотря на то что эти таски создались там уже ещё раньше (например через 1ms, если мы указали задержку `0`) и просто стояли в очереди, ждали. Цитата из [IBM Course](https://developer.ibm.com/technologies/node-js/tutorials/learn-nodejs-the-event-loop/#): Once the timer expires, the callback is invoked during the next Timers phase of the Event Loop. This might be later than the actual timeout value, depending on //when the next Timers phase runs//. 

  * `setImmediate`'s delay is always 0 — a task in queue is created instantly, there is no 1ms delay нету

  * `setImmediate()` vs. `setTimeout()`. [Node.js Doc](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/#setimmediate-vs-settimeout): The order in which the timers are executed will vary depending on the context in which they are called. If both are called from within the main module, then timing will be bound by the performance of the process (which can be impacted by other applications running on the machine). 
  
    Как я понимаю: taskи для этих таймеров постоянно создаются в разное время, на это влияет текущая загруженность ОС. Иногда первый создаётся task `setImmediate` или `setTimeout`. Запомни главный вывод: **когда представляешь очерёдность выполнения фаз, имей ввиду что колбэк `setTimeout` (и *вероятно*, но не факт, `setInterval`) будучи в основном коде (в глобальном EC или функции, не важно, главное НЕ внутри Event Loop-колбэков), на первой итерации лупа может не добавится в очередь, короче Node его не увидит при первой итерации лупа. Т.е. это как повезёт: иногда он сразу на первой итерации лупа  уже добавлен и выполняется, а иногда только на второй)**. По этой причине, если ты напишешь прямо в файла два вызова подряд: `setImmediate` и затем `setTimeout` (или наоборот, сначала сетТаймайту а потом Иммидиэйт), то они будут выполняться в непредсказуемом порядоке: то `setImmediate` первым, то `setTimeout` 

  * **Poll Phase** 
    > Normally, if the poll queue is empty, it blocks and waits for any in-flight I/O operations to complete, then execute their callbacks right away. However, if timers are scheduled the poll phase will end. Any microtasks will be run as necessary, and the Event Loop proceeds to the check phase  ([source — Node.js course from IBM](https://developer.ibm.com/technologies/node-js/tutorials/learn-nodejs-the-event-loop/)).



### Computationally intensive code and the Node.js Event Loop

As you know, computationally intensive synchronous code blocks the Event Loop. There are two general ways to solve this problem in Node.js:

* Algorithmic refactoring
* Creating a backend service



#### Algorithmic refactoring

Perhaps, the algorithms in you code is suboptimal and can be rewritten to be faster. Or, if not faster, the task can be split into callbacks dispatched through the Event Loop
  
**Example.** It is possible to divide the calculation into chunks and then dispatch the computation of those chunks through the Event Loop. 

This converts the `fibonacci` function from asynchronous function to a traditional callback-oriented asynchronous function. We're using `setImmediate` at each stage of the calculation to ensure the Event Loop executes regularly and that the server can easily handle other requests while churning away on a calculation. It does nothing to reduce the computation required; this is still the silly, inefficient Fibonacci algorithm. All we've done is spread the computation through the Event Loop

```js
exports.fibonacciAsync = function(n, done) {
  if (n === 0) done(undefined, 0);
  else if (n === 1 || n === 2) done(undefined, 1);
  else {
    setImmediate(() => {
      exports.fibonacciAsync(n - 1, (err, val1) => {
        if (err) done(err);
        else setImmediate(() => {
          exports.fibonacciAsync(n - 2, (err, val2) => {
            if (err) done(err);
            else done(undefined, val1 + val2);
          });
        });
      });
    });
  }
};
```

This converts the fibonacci function from asynchronous function to a traditional callback-oriented asynchronous function. We're using setImmediate at each stage of the calculation to ensure the Event Loop executes regularly and that the server can easily handle other requests while churning away on a calculation. It does nothing to reduce the computation required; this is still the silly, inefficient Fibonacci algorithm. All we've done is spread the computation through the Event Loop.

```js
const math = require('./math');

(async () => {
  for (let num = 1; num < 5; num++) {
    await new Promise((resolve, reject) => {
      math.fibonacciAsync(num, (err, fibo) => {
        if (err) reject(err);
        else {
          let now = new Date().toISOString();
          console.log(`${now} Fibonacci for ${num} = ${fibo}`);
          resolve();
        }
      });
    });
  }
})().catch(err => { console.log(err); });
```

With this change, the server no longer freezes when calculating a large Fibonacci number. The calculation of course still takes a long time, but at least other users of the application aren't blocked. 

**It's up to you, and your specific algorithms, to choose how to best optimize your code and to handle any long-running computations you may have.**



#### Creating a backend service

Can you imagine a backend server dedicated to solving your particular task (calculating Fibonacci numbers in book example)? Okay, maybe not, but it's quite common to implement backend servers to offload work from frontend servers, and we will implement a backend Fibonacci server at the end of this chapter. 

So, as I just wrote, the next way to mitigate computationally intensive code is to push the calculation to a backend process. To explore that strategy, we'll request computations from a backend Fibonacci server, using the HTTP Client object to do so. 



## References

* https://javascript.info/event-loop
* https://javascript.info/microtask-queue 
* "Secrets of the JavaScript Ninja 2nd Edition" (has many details not mentioned on javascript.info, but they don't conflict or change the big picture presented on javascript.info and are not very important for me *now*)
* https://blog.risingstack.com/node-js-at-scale-understanding-node-js-event-loop/ (this post has an awesome but extremely complex example of event lopp in Node. It shows the same things explained in my examples here but all in one huge example. Read it only if you really need to. + There is some interesting stuff at the very beggining of the post, but not critically important, related to CPU and low-level stuff, read it if you're interested in how round-trip latency and CPU processing connected) + I saved this article to hard drive "Understanding the Node.js Event Loop _ @RisingStack" file)
* [`setImmediate()` vs `nextTick()` vs `setTimeout(fn,0)`](http://voidcanvas.com/setimmediate-vs-nexttick-vs-settimeout/)
* https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/ ( haven't read it yet, read if you need not a big picture but details)
* https://stackoverflow.com/questions/28650804/does-settimeout-or-setinterval-use-thread-to-fire
* https://blog.bitsrc.io/javascript-internals-javascript-engine-run-time-environment-settimeout-web-api-eeed263b1617
