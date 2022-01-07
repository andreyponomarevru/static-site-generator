# Asynchronous Programming in JavaScript. Part III. Event Loop

* [Events](#events)
* [Event Loop in Browser](#event-loop-in-browser)
  * [Core Concepts](#core-concepts)
    * [Call Stack](#call-stack)
    * [Event Loop](#event-loop)
    * [Queues](#queues)
      * [Macrotask Queue](#macrotask-queue)
      * [Microtask Queue](#microtask-queue)
  * [How everything fits together](#how-everything-fits-together)
* [Event Loop in Node.js](#event-loop-in-nodejs)
  * [Q&A](#qa)
  * [Computationally intensive code and the Node.js Event Loop](#computationally-intensive-code-and-the-nodejs-event-loop)
    * [Algorithmic refactoring](#algorithmic-refactoring)
    * [Creating a backend service](#creating-a-backend-service)
* [Q&A](#qa--1)
* [References](#references)
* [Further Reading](#further-reading)
  
---

This article covers Event Loops of the two main JavaScript Runtime Environments: Browser and Node.js


## Events <a name="events"></a>

Clicking on some elements, filling input forms, scrolling and resizing page, toggling media playback, performing network requests, loading scripts, timer expiration — all these and many other actions fire events which the browser exposes as a part of the Browser Runtime Environment.

To handle these events the browser uses a special mechanism called the **Event Loop**.



## Event Loop in Browser <a name="event-loop-in-browser"></a>

![](./../../../img/event-loop-in-browser.svg)



### Core Concepts <a name="core-concepts"></a>

#### Call Stack <a name="call-stack"></a>

**Сall stack** is a stack data structure that stores currently invoked and executing Execution Contexts (read "functions"). Using it, the JS-interpreter keeps track of its current location during code execution (***note:** if you need more details on how the Call Stack operates, read my article "Execution Context & Lexical Environment"*, this section is just a short reminder).

From the very beginning of execution and until the very end, the Stack is never left empty even for a second. At the very bottom of the Stack, there is always at least the Global Execution Context (it stores all code placed into the global scope). 

If the Stack contains *only the Global* EC, we usually say that the stack is empty (even though as you understand in reality it's not — after all, it contains the Global EC! But that's just how most people describe these things; it's just an unfortunate wording). The Global EC is always in the Stack until the script's process is exited (I'm talking about Node.js now).

*Every* invocation of a function creates EC as well. If a function contains nested function invocation(s) — each of these function invocations creates EC too. When the EC is created, the interpreter pushes it to the Call Stack.

Chrome has a limit on a number of Execution Contexts (= "frames" in Chrome terminology) that could be placed into the Call Stack at the same time — 16 000 ECs. If you will exceed this number, there will be a RangeError: `Maximum Call Stack Size Exceeded`.

Example of how the Call Stack works:
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

0. When we start the script, there is already one EC in the Stack — the Global one.
1. `bar()` invocation creates the second EC. It stores the arguments and local variables of this function. 
2. Interpreter starts executing this EC.
3. Interpreter encounters `return foo(x * y)` and `foo()` gets invoked — this leads to the creation of the third EC, that will be placed on top of the previous EC. 
4. When the `foo()` EC (which at the moment is the topmost one in the Stack) is executed and returned the value, it is removed from the Stack. 
5. Next, the `return` in `bar()` is executed and `bar`'s EC is also removed from the Stack, leaving only the Global EC.



#### Event Loop <a name="event-loop"></a>

The execution flow of JavaScript both in the browser and in Node.js is based on Event Loop.

In general, in most browsers there is an Event Loop for every browser tab, to make every process isolated and avoid a web page with infinite loops or heavy processing to block your entire browser (see the article "Asynchronous Programming in JavaScript. Part II. Synchronous vs. Asynchronous code" for detail about thread blocking aka Event Loop blocking).

**NOTE**. Actually, the environment manages *multiple* concurrent Event Loops. For example, Web Workers run in their own Event Loop. But for now, it doesn't matter. While reading the article, imagine only one Event Loop per browser's tab i.e. page. This is enough to have a proper mental model. **For now, you mainly need to be concerned only that *your code* will run on a *single* Event Loop, and write code with this thing in mind to avoid blocking it.**

> **The concept of Event Loop is very simple. When you open the browser's tab (page) or run Node.js, there’s an endless loop, when JavaScript engine waits for tasks, executes them and then sleeps waiting for more tasks.**
>
> **The general algorithm of the engine:**
>
> 1. While there are tasks:
>    * execute them, starting with the oldest task 
> 2. Sleep until a task appears, then go to 1.
>
> That’s a formalization for what we see when browsing a page. JavaScript engine does nothing most of the time, only runs if something happened and generated a new task(s) in the Queue. Queue is the place where all tasks that are need to be done stored. If there are a task(s) in the Queue — JS Engine runs handling these tasks(s) until all tasks are processed and Queues are empty. If there a no tasks i.e. the Queue is empty, JS Engine sleeps, checking endlessly in background "are there any new tasks in the Queue to handle?" 
>
> ([source](https://javascript.info/event-loop))

**Tasks are handled *one at a time*. The task in any queue runs to completion and can’t be interrupted by another task (do not confuse this with "one macrotask in one iteration" rule).**

To simplify things, until this moment I wrote that there is a "Queue". But in fact, there is no single Queue. Instead, we have two separate Queues: 1) Macrotask Queue and 2) Microtask Queue. Tasks from any type of queue are processed on a "first come – first served" basis. I will explore this in detail later, but for now remember: **on each Event Loop iteration, JS Engine 1) executes only 1 task from Macrotask Queue, then 2) executes ALL tasks in Microtasks Queue, then 3) if re-rendering of the pages is needed, rerenders the page. Then this loop repeats until no tasks in Queues are left. All this is depicted on the browser Event Loop illustration at the very top of the article.** We will explore the details later.

**Also, don't forget about blocking!** Always keep in mind, that rendering never happens while the engine executes a task (no matter from which Queue the task is). If a task takes too long to execute, our event Loop will be blocked and the page won't rerender. *Changes to DOM are painted only after the task is complete*.

If a task takes too long, the browser can’t do other tasks (e.g. process user events), so after a time it raises an alert like "Page Unresponsive" suggesting to kill the task with the whole page. That happens when there are a lot of complex calculations or a programming error leading to an infinite loop.

So, going back to the discussion of Queues and tasks — as I've already mentioned, **the tasks in Queues are always created by some events. Depending on their type, some events generate tasks in Macrotask Queue while others in Microtask Queue.** 



#### Queues <a name="queues"></a>

The Event Loop usually has access to at least two task queues: a Macrotask Queue and a Microtask Queue. 

Although the implementation of an Event Loop should use at least one queue for macrotasks (i.e. Macrotask Queue) and at least one queue for microtasks (i.e. Microtask Queue), the Event Loop implementations usually go beyond that and have several queues for different types of macro- and microtasks. This enables the Event Loop to prioritize types of tasks; for example, giving priority to performance-sensitive tasks such as user input. On the other hand, because there are many browsers and JavaScript execution environments out in the wild, you shouldn’t be surprised if you run into Event Loops with only a single queue for both types of tasks together.

In this article, we explore only the classic situation, when we have only two Queues: Microtask Queue and Macrotask Queue.

We won't build upon this information in this article, but keep in mind for the future:
* To schedule a new macrotask: use zero delayed `setTimeout(f)`.
* To schedule a new microtask: use `queueMicrotask(f)`. 



##### Macrotask Queue <a name="macrotask-queue"></a>

Examples of events triggering the creation of a new task in Macrotask Queue:

* when an external script `<script src="...">` loads, the task is "Execute it" / AFAIU, if there is no aforementioned tag, but we have `<script>...</script>` tag, the task generally is the same: execute mainline (or global) JavaScript code. 

  **NOTE**. Generally, in the context of this article, the only thing you should understand is that when the JS file is downloaded or the `<script>` tag parsed, this generates a new task in the queue). 

* when a user moves his mouse, the task is "Dispatch `mousemove` event and execute handler".

* when the time is due for a scheduled `setTimeout`, the task is "Run its callback". 

* examples of other events triggering the creation of new tasks: 
  * creating the main document object
  * parsing HTML
  * changing the current URL, as well as various events such as page loading, input, network events, and timer events
  * `setTimeout`, `setInterval`, `setImmediate`
  * `addEventListener`
  * `requestAnimationFrame`
  * I/O
    * reading/writing data from/to a disk
    * making HTTP requests (i.e. `fetch` responses end up in Macrotask)
    * talking to databases
    * ...
  * ...and so on.

The tasks generated by these events form a queue, the so-called "Macrotask Queue" (V8 term). **From the browser's perspective, a macrotask represents one discrete, self-contained unit of work.**

So, tasks are set > the engine handles them > then waits for more tasks (while sleeping and consuming close to zero CPU).

It may happen that a task comes while the engine is busy, then it’s enqueued. For instance, while the engine is busy executing a `script`, a user may move his mouse causing `mousemove`, and `setTimeout` may be due, and so on, these tasks form a Macrotask Queue.

As I've already mentioned above, tasks from any type of queue are processed on a "first come – first served" basis. In the context of Macrotask Queue it means that, if the tasks happened in this order: 1. script downloaded -> 2. user moved the mouse -> 3. timer is scheduled, then when the engine browser is done with the `script`, it handles `mousemove` event, then `setTimeout` handler.



##### Microtask Queue <a name="microtask-queue"></a>

Examples of events triggering the creation of new tasks in Microtask Queue:

* promises (i.e. promise handlers (callbacks): `then`, `catch`, `finally`)
* `async`/`await` (yes, microtasks are used "under the cover" of `await` as well, as it's another form of promise handling ([source](https://javascript.info/event-loop#macrotasks-and-microtasks)))
* `MutationObserver` (DOM mutation changes)
* `process.nextTick()` (in Node.js)
* `queueMicrotask` 

**Microtasks come solely from our code** (i.e. as far as I understand, they're not created by external APIs, but by JavaScript itself).

JS Engine checks Microtask Queue right after Macrotask Queue, but before the page rendering stage.

Microtasks are smaller tasks that update the application state and as I've already mentioned above should be executed before the browser continues with other assignments such as re-rendering the UI. Thus, microtasks enable us to execute certain actions before the UI is re-rendered, thereby avoiding unnecessary UI rendering that might show an inconsistent application state.

<details><summary><b>Example: Macrotask Queue and Microtask Queue during synchronous code execution.</b></summary>
 
<br>
  
Notice that the promise handler (`.then` callback) is executed before the `setTimeout` because promise responses are stored inside the Microtask Queue. 

I reiterate: вне зависимости от любых условий, сначала должны выполнится все задания из Microtask Queue, и только после этого JS Engine сможет отрендерить страницу (если это требуется) и перейти к следующей итерации Event Loop'а
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
//
// Script start
// Script End
// Promise resolved
// setTimeout
```

What happens under the hood:

* **Event Loop Iteration 1:**
  * execute one macrotask (i.e. all code in the file): outputs `Script start`
  * `setTimeout` added and removed from the stack. <del>Timer ticks in parallel thread.</del> (`setTimeout` is a part of Web API, which is a part of Browser Runtime Environment. How the timer ticks is generally an internal implementation detail of Runtime Environment and may vary between REs. It may run in parallel thread indeed or be implemented somehow else). As we have passed the `0` delay, the new macrotask is instantly created and already waits in Macrotask Queue. 
  * executor in Promise runs. As we have instantly called `resolve` inside executor, the Promise instantly resolves, but `.then` callback always runs asynchronously, so the task to execute `.then` callback created in Microtask Queue
  * output `Script End`. This is the end of the first Macrotask "Execute all code in the file")
  * now, execute all Microtasks (runs `.then` callback):
  * output: `Promise resolved`
  * page rendering happens. End of the 1st iteration of Event Loop

* **Event Loop Iteration 2:**
  * execute one macrotask: takes the callback from `setTimeout` from Macrotask Queue: outputs `setTimeout` 

</details>



### How everything fits together <a name="how-everything-fits-together"></a>

Now, as we have discussed each part of the process individually, let's see how everything fits together.

![](./../../../img/event-loop-in-browser.svg)

Imagine Event Loop as an infinitely repeating loop. Every time the Event Loop takes a full trip (=iteration), we call it a [*tick*](https://nodejs.dev/understanding-process-nexttick). 

This loop repeats the same algorithm on each iteration ([source](https://javascript.info/event-loop#summary)):

1. **check Macrotask Queue — execute *only 1 task***. Even if there are many macrotasks in the queue already, only ONE task is processed during a single iteration of the loop, it's a crucially important detail. After the task (this single task) is 100% executed go to step 2. In case when there are no tasks, just wait till a new macrotask appears. 
2. **check Microtask Queue — execute *all tasks* from Microtask Queue**. *All* microtasks should be executed before the next rendering because their goal is to update the application state *before* rendering occurs. (*)
3. **render changes if any**. When the Microtask Queue is finally empty, the Event Loop checks whether a UI render update is required, and if it is, the UI is re-rendered. Because updating the UI is a complex operation, if there isn't an explicit need to render the page, the browser may choose not to perform the UI rendering in this loop iteration (check the interesting example of "progress indication" at the end of the article)

I'd like to emphasize the difference between handling the Macrotask and Microtask Queues again: in a single loop iteration, only one macrotask is processed (others left waiting in the queue) and then *all* microtasks are processed. 

**(*)** — while these microtasks are processed, they can queue even more microtasks, which will all be run one by one, until the microtask queue is exhausted). If a microtask recursively queues other microtasks, it might take a long time until the next macrotask is processed. This means you could end up with a blocked UI. However, at least in Node.js's `process.nextTick` function (which queues microtasks), there is inbuilt protection against such blocking by means of `process.maxTickDepth`. This value is set to a default of `1000`, cutting down further processing of microtasks after this limit is reached which allows the next macrotask to be processed)

---

**Abstract Example**

As you already know, Event Loop starts when we open a browser's tab (i.e. a new page) and spins infinitely until we close it. 

Usually, there is a `<script src="script.js>` tag, so the browser needs to download an external script. 

**NOTE**. Instead, there may be inline JavaScript code like `<script>...</script>` in place of `<script src="...>` tag, it doesn't change much; in such case, the first task will be "Execute mainline i.e. global, JavaScript code" instead of "Execute the downloaded script", which is ultimately the same thing.

When the script is downloaded, this event (script downloading) automatically creates a new task in Macrotask Queue: "Execute the downloaded script". As always, there is also a function to execute, associated with this task. It's not technically accurate, but you can imagine this function as an anonymous self-executing function wrapping ALL the code inside the file i.e. this function is the one that creates a Global EC. The main point here is that the JS Engine considers executing all code in the file (i.e. 100% of this function) as handling one single task in Macrotask Queue.

During the execution of this task, when the Engine encounters asynchronous function calls, it evokes them, pushes  them to the stack, removes them from the stack, and continues executing synchronous code further, while asynchronous functions continue their execution either in concurrent threads created by the Runtime Environment or somehow else, this is an internal implementation detail that varies between REs so we should not worry about this. 

When any asynchronous function completes (example: got the response from DB), the API it belongs to will push a task to the Macro/Microtask Queue (with associated callback we provided to this asynchronous function).

So here is how Event Loop works after the browser has downloaded the external JS file or parsed the `<script>` tag:

  1. Between the moment of its creation (i.e. when the tab was opened) until the moment of finishing the script loading, Event Loop was spinning using the same algorithm (described above), but just haven't been doing any useful work because there were no tasks to execute. If you prefer another wording, we can say that "it was idle".
  
  2. **1st Iteration:**
     1. checks Macrotask Queue — there is a task "Execute the downloaded script".
     
        1. processes the task by executing all the code within a downloaded file. 
        
           During the execution, all asynchronous functions will be added and deleted from the stack, continuing their execution concurrently in the background. When they will finish, their APIs will create new tasks in Macro/Microtask Queue. Suppose we have three `setTimeout` functions and 3 Promise-related functions. So after some time, when done, `setTimeout` functions will create tasks in Macrotask Queue and promise-related functions will create tasks in Microtask Queue. The "task" usually is "Execute the provided callback function".
           
  3. check Microtask Queue — if there are any tasks, execute them ALL, one after another. Suppose, while macrotask 1 above was in process, all our promise-related functions already completed and generated 3 new tasks in Microtask Queue (these tasks usually are "execute the provided callback function"). So JS Engine handles all those tasks right away by executing the provided callback functions.
  
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

  8. Event Loop continues spinning using the same algorithm (or if you prefer "is back to the idle state") until a new task appears.

---

**NOTE. Several runtimes communicating together**. A web worker or a cross-origin `iframe` has its own stack, heap, and Macrotask Queue. Two distinct runtimes can only communicate through sending messages via the `postMessage` method. This method adds a message to the other runtime if the latter listens to `message` events. **TODO.** In the future, move this paragraph to a separate article cause this is a big topic.

---

**TODO:** add links to examples

* More examples explaining the above-listed theory:
  * http://wiki.com/doku.php?id=interpreter_internals_and_asynchrony#event_loop
  * http://wiki.com/doku.php?id=interpreter_internals_and_asynchrony#event_loopmicro_macrotask_queue_use-case_2progress_indication
  * http://wiki.com/doku.php?id=interpreter_internals_and_asynchrony#event_loopsync_code_macrotask_queue_microtask_queue

* The typical use-cases of using macro/micro tasks are:
  * [javascript.info: splitting CPU-hungry tasks](https://javascript.info/event-loop#use-case-1-splitting-cpu-hungry-tasks)
  * [javascript.info: Progress Indication](https://javascript.info/event-loop#use-case-2-progress-indication) — although this is the link pointing to the original example with all explanation, I will shortly explain this example here, just cause it is very important: [[http://wiki.com/doku.php?id=interpreter_internals_and_asynchrony#event_loopmicro_macrotask_queue_use-case_2progress_indication|link]])
  * [javascript.info: Doing something after the event](https://javascript.info/event-loop#use-case-3-doing-something-after-the-event)



## Event Loop in Node.js <a name="event-loop-in-nodejs"></a>

![](./../img/event-loop-in-nodejs.svg)

***Node.js Event Loop.** My own illustration.*

---

![](./../img/nodejs-event-loop.png)

***Node.js Event Loop.** Illustration from [Node.js course from IBM](https://developer.ibm.com/technologies/node-js/tutorials/learn-nodejs-the-event-loop/)*

*Both illustrations are correct, mine is just more verbose.*

---

### Q&A <a name="qa"></a>

* **What will Node do when the Call Stack and the Event Loop queues are all empty?** ([source](https://jscomplete.com/learn/node-beyond-basics/learning-node-runtime)) 

  It will simply exit. 

  When you run a Node program, Node will automatically start the Event Loop and when that Event Loop is idle and has nothing else to do, the process will exit. 

  To keep a Node process running, you need to place something somewhere in event queues. For example, when you start a timer or an HTTP server you are basically telling the Event Loop to keep running and checking on these events. 
  
  The Same happens when you register event listeners (`.on`) i.e. if you have any registered event listeners in your code, the Event Loop will be running infinitely. It will exit only if (when) you remove all these event listeners; the same stuff is explained on [Stackoverflow](https://stackoverflow.com/questions/56376508/how-are-all-the-events-listeners-in-javascript-kept-active-or-alive)

* **[Does `setTimeout` or `setInterval` use thread to fire? (Stackoverflow)](https://stackoverflow.com/questions/28650804/does-settimeout-or-setinterval-use-thread-to-fire)?**

  Well, it's not simple to answer. The callbacks are *triggered* not by the JavaScript code running in the main thread, but by the Runtime Environment (which theoretically might create new threads to manage timers or do something else, but we should not care about this, it's an internal implementation detail). Why are the callbacks triggered by the RE? Because the aforementioned functions are a part of (i.e. provided by) the Runtime Environment. But in the end, when the time comes, callbacks themselves of course always run in the main thread.

* **When `setTimeout` or `setInterval` delay time is set to zero, is it *actually* a zero, or is it more?** 
  
  When you set the delay time for `setTimeout` or `setInterval` equal to zero or don't set it at all, it is automatically "converted" to "1ms" ([source — IBM Course](https://developer.ibm.com/technologies/node-js/tutorials/learn-nodejs-the-event-loop/#)). I.e. when we set zero delays, the task pops up in queue always after at least 1ms. 

  This is usually the reason why the callbacks of `setTimeout` and `setInterval` are often invoked only on the second or third iteration of the Event Loop — on the first Event Loop iteration the tasks with these callbacks haven't been created yet, but after 1ms they finally appear in a Queue and picked up by the next iteration of Event Loop.

  **Moreover, as I've written above, tasks created by `setTimeout` and `setInterval` will always be created after the provided delay time (or after at least 1ms, if the delay is zero, see above), BUT the callbacks themselves might be invoked a bit later than the provided delay time.** Why? Because the Event Loop iteration may take *more time than the provided delay time*. I.e. the task generated by `setTimeout` or `setInterval` might be already queued, but the current loop iteration is not finished yet i.e. the loop cycle takes a lot of time to process i.e. the Event Loop is temporarily blocked by some long-running task, for example in hangs in Polling phase, reading from disk too big file. But eventually, after some time, let's say 2-3ms or more, the Event Loop will finish the current cycle (iteration) and finally will start the next iteration and execute the "Timers" phase containing in its Timers Queue our callbacks.   Quote from [IBM Course](https://developer.ibm.com/technologies/node-js/tutorials/learn-nodejs-the-event-loop/#): 
  > Once the timer expires, the callback is invoked during the *next Timers phase* of the Event Loop. *This might be later than the actual timeout value, depending on **when the next Timers phase runs***. 

* **What about `setImmediate`, does it also has a minimum delay of 1ms, like `setTimeout` or `setInterval`?**

  `setImmediate`'s delay is always zero — a task in queue is created instantly, there is no 1ms delay.

* **When we call `setImmediate` and `setTimeout(... , 0)` one after another, in what order do they get executed?**

  `setImmediate()` vs. `setTimeout()`. [Node.js Doc](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/#setimmediate-vs-settimeout): The order in which the timers are executed will vary depending on the context in which they are called. If both are called from within the main module, then the timing will be bound by the performance of the process (which can be impacted by other applications running on the machine). 

  Here is how I understand this. Let's start from the ground up: there is a Node.js API provided by Node.js Runtime Environment. This API provides us with `setImmediate()` and `setTimeout()` functions. When we call them both in the same code, when the time elapses, API creates for their tasks (with respective callbacks), and the tasks are queued. But in what order they are queued? 
  
  The order is random (not actually, read further). The exact time when API will create and queue the task depends on how busy the OS is at the current moment: sometimes, the first task that is queued is a `setImmediate`'s task, sometimes a `setTimeout`'s task, this constantly varies. Remember the main things: **when you imagine the order of phases, keep in mind that when `setTimeout` is called in the main code (i.e. in Global EC or in function, but NOT inside Event Loop-callbacks), on the first Event Loop iteration its (`setTimeout`'s) callback might not be added to the queue — Node RE won't see it on the first loop iteration. I.e. if we get lucky Node RE *might* pick the `setTimeout`'s callback-task up and put it into queue right away on the very first loop iteration. Other times Node RE will pick it up later, on the next iteration**. 
  
  For this reason, if you put two calls in a row, for example like 
  ```js
  setImmediate(...);
  setTimeout(...);
  
  // OR
  
  setTimeout(...);
  setImmediate(...);
  ```
  the callback-tasks created and queued by the Runtime Environment will be invoked (i.e. pushed to the Stack and handled by the interpreter) in an *unpredictable order*: one time it may be `setImmediate`'s callback first, another time — `setTimeout`'s callback first.

* **How does Poll phase execute?** 
  > Normally, if the poll queue is empty, it blocks and waits for any in-flight I/O operations to complete, then executes their callbacks right away. However, if timers are scheduled *the poll phase will end*. Any microtasks will be run as necessary, and the Event Loop proceeds to the check phase  ([source — Node.js course from IBM](https://developer.ibm.com/technologies/node-js/tutorials/learn-nodejs-the-event-loop/)).



### Computationally intensive code and the Node.js Event Loop <a name="computationally-intensive-code-and-the-nodejs-event-loop"></a>

As you know, computationally intensive synchronous code blocks the Event Loop. In Node.js there are two common ways to solve or at least to mitigate this problem:

* Algorithmic refactoring
* Creating a backend service



#### Algorithmic refactoring <a name="algorithmic-refactoring"></a>

**The content of this section is from David Herron's book "Node.js Web Development".**

Perhaps, the algorithms in your code are suboptimal and can be rewritten to be faster. Or, if not faster, the task can be split into callbacks dispatched through the Event Loop.
  
**Example.** It is possible to divide the calculation into chunks and then dispatch the computation of those chunks through the Event Loop. 

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

This converts the `fibonacci` function from an asynchronous function to a traditional callback-oriented asynchronous function. We're using `setImmediate` at each stage of the calculation to ensure the Event Loop executes regularly and that the server can easily handle other requests while churning away on a calculation. It does nothing to reduce the computation required; this is still the silly, inefficient Fibonacci algorithm. All we've done is spread the computation through the Event Loop.


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



#### Creating a backend service <a name="creating-a-backend-service"></a>

**The content of this section is from David Herron's book "Node.js Web Development".**

Can you imagine a backend server dedicated to solving your particular task (calculating Fibonacci numbers in book example)? Okay, maybe not, but it's quite common to implement backend servers to offload work from frontend servers, and we will implement a backend Fibonacci server at the end of this chapter. 

So, as I just wrote, the next way to mitigate computationally intensive code is to push the calculation to a backend process. To explore that strategy, we can request computations from a backend Fibonacci server, using the HTTP Client object to do so. 



## Q&A <a name="qa--1"></a>

* **What is a *task?*** In the context of Micro/Macrotask Queue, a "task" means a "callback" (1 task = 1 callback); this queue is even sometimes referred to as Callback Queue.



## References <a name="references"></a>

* [The JavaScript runtime environment](http://dolszewski.com/javascript/javascript-runtime-environment/)

* [Event Loop](https://javascript.info/event-loop)

* [Microtask Queue](https://javascript.info/microtask-queue) 

* [Secrets of the JavaScript Ninja, 2nd Edition](https://www.amazon.co.uk/Secrets-JavaScript-Ninja-Second-Resig/dp/1617292850) — has many details not mentioned at javascript.info but they are not too important; refer to the book only to deepen the understanding of the subject

* [Understanding the Node.js Event Loop](https://blog.risingstack.com/node-js-at-scale-understanding-node-js-event-loop/) — this post has awesome but unnecessarily complex examples of event loщp in Node. It shows the same things that have been explained in examples in my article but all in one huge code snippet. Read it only if you really need to for whatever reason. 

  Also, there is some interesting stuff at the very beginning of the post, but not critically important (related to CPU and low-level stuff, read it if you're interested in how round-trip latency and CPU processing are connected) (***note:** I saved this article to hard drive, grep for "Understanding the Node.js Event Loop _ @RisingStack" filename*)
  
* [`setImmediate()` vs. `nextTick()` vs. `setTimeout(fn, 0)` — in depth explanation](http://voidcanvas.com/setimmediate-vs-nexttick-vs-settimeout/)

* [JavaScript Internals: JavaScript engine, Run-time environment & setTimeout Web API](https://blog.bitsrc.io/javascript-internals-javascript-engine-run-time-environment-settimeout-web-api-eeed263b1617)

* [All Introduction to the event loop in Node.js (IBM Course)](https://developer.ibm.com/technologies/node-js/tutorials/learn-nodejs-the-event-loop/#) (***note:** I backed it up to disk*)



## Further Reading <a name="further-reading"></a>

* [Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/) — read it if you need details instead of a big picture
