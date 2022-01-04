# Asychronous Programming in JavaScript. Part II. Synchronous vs. Asynchronous code

* [Synchronicity vs Asynchronicity](#synchronicity-vs-asynchronicity-)
  * [Synchronous code execution](#synchronous-code-execution)
    * [Thread Blocking](#thread-blocking)
    * [Coping with Thread Blocking](#coping-with-thread-blocking)
  * [Asynchronous code execution](#asynchronous-code-execution)
    * [Asynchronous callback-functions](#asynchronous-callback-functions)
    * [Promises](#promise)
  * [Mixing sync and async code](#mixing-sync-and-async-code)
* [Glossary](#glossary)
* [Q&A](#qa)
* [References](#references)
* [Further Reading](#further-reading)

---

**JavaScript is at its most basic a *synchronous*, *blocking*, *single-threaded* language. That is, the JavaScript engine can only process one statement at a time in a single thread.**

The meaning of "single-threaded" has been covered in the first part. 

This time, I want to explain what "synchronous" and "blocking" means. 



# Synchronicity vs. Asynchronicity <a name="synchronicity-vs-asynchronicity"></a>

The terms **synchronous** and **asynchronuous** describe *how* the code in the thread is executed. 

We can divide all JavaScript code into:

  * ***synchronous code* (synchronous execution) is the code (functions), which the interpreter runs on the main thread. The interpreter executes code *sequentially*, line by line, from top to bottom; all instructions are executed in the same order they appear in your program. When someone says that a programming language is synchronous he means exactly this: a language has only one thread and all the code being executed runs on it sequentially.**
   
    When you invoke a synchronous function, its *Execution Context* (EC) is immediately added to the Call Stack >  executes > and removed from the Stack *only when the execution is completely finished*. Such code is a blocking code — it blocks the Event Loop cause it prevents the further execution of a program: if any operation (some nested function for instance) executes for too long, all other operations are suspended, waiting for the current operation being finished. Such situations called **"thread blocking"** or "Event Loop blocking" or just "blocking" and the code causing them — the "blocking code". That is the function suspends (blocks) the execution of all the code following right beneath its invocation and as a consequence, all the queued tasks in Macrotask Queue. The blocking lasts until the function is completely executed, and its EC is removed from the stack. We will discuss blocking in a more detail later in separate section.
    
    All JavaScript "native code" (i.e. functions provided by JavaScript Engine itself and not by the Runtime Environment) is synchronous. 
    
    **NOTE**. There are only two slippy cases: **Promise handlers (`then`, `catch`, `finally`) and `async`/`await` are "asynchronous".** I use quotes cause *they are not asyncrhonous in a litteral sense*. Technically speaking these functions are synchronous as any other native JavaScript code. The reason we often call them "asynchronous" is because they *manage* (*handle*, *make use of*) the real asynchronicity provided by the Runtime Environment (be it a browser (which RE provides Web APIs), Node.js (which RE provides Node.js APIs), etc.). **So the asynchronicity is not baked into these functions, rather it is provided by the external environment.** Let's reiterate: Promises and `async`/`await` are not asynchronous, they are just *means* to handle asynchronous code. They use Event Loop and the API provided by the RE creates for them tasks in a Queue, so they don't create any new threads. But the *asynchronous functions* they handle (like `fs.readFile` in `await fs.readFile(...)` is a part of Node.js Runtime Environment (i.e. part of Node.js API provided by Environment), so while executing, under the hood `fs` utilizes one of the threads in Worker Pool.
    
  * ***asynchronous code* (asynchronous execution) is the code (functions), which the interpreter runs either on a separrate parallel thread at the same time as the main thread (e.g. `fs.readFile()`) OR in the same main thread but after all sync code has been executed (e.g. `setTimeout()`). It means that asynchronous functions do not block the thread unlike the synchronous ones: asyn function starts exactly like a regular sync function, but unlike the sync function, its async function's EC is immediately removed from the Stack and doesn't block the code following after it i.e. the interpreter proceeds to execute the code down below.**

    Generally we should not care whether the function runs on a separate thread or on the same thread but after the sync code executed because this is the internal implementation details and they may vary between Runtime Environments and APIs they provide.
  
    **NOTE**. Regarding functions executing in a separate parallel thread — these functions are always provided by the Runtime Environment's APIs (e.g. `fetch` belongs to the Web API provided by Browser RE, `fs.readFile` belongs to Node.js API provided by Node.js RE). They are implemented in a way to allow the interpreter to remove their EC from the Call Stack before they have finished the execution. Meanwhile they continue the execution in a parallel thread.
     
    Speaking about APIs providing asynchronous functions: these APIs can’t themselves put the execution code on to the stack, if it did, then it would randomly appear in the middle of your code. Any Web API pushes the callback onto the Queue when it’s done executing. The Event Loop now is responsible for the execution of these tasks i.e. callbacks in the Queue and pushing it in the stack, when it is empty. Event Loop basic job is to look both at the stack and the Queue, pushing the first thing on the Queue to the stack when it see stack as empty. Each task (callback) is always processed completely before any other task is processed, hence all callbacks in the Queue have to wait until the current one is finished. If a script runs too long, it blocks others. **That’s why callbacks should be relatively short and simple.** If you put some heavy computations in it, it will block the thread.

    Now, as for the list of asynchronous functions, here they are (remember all of them provided by the Runtime Environment) (sure, we can write our own async functions but here we discuss the ones provided by the RE):

    * `XMLHttpRequest` (for making network requests); it can be used in two modes: synchronous or asynchronous)
    * I/O operations (including запросы к БД и др. операции связанные с базой данных)
    * ряд функций принадлежащих [Web APIs](https://developer.mozilla.org/en-US/docs/Web/API): 
      * DOM API: one of Web APIs is a DOM API, it provides function `setTimeout`, `addEventListener`, ...
      * Fetch API (for making network requests)
    * Node.js filesystem operations

    So, when you hear folks say that JavaScript is an asynchronous language, what they mean is that you can manipulate JavaScript to behave in an asynchronous way. It’s not baked in, but it’s possible! It is up to the programming environment you are using (web browsers, in the case of web development) to provide you with APIs that allow you to run such tasks asynchronously.

Whether we want to run code synchronously or asynchronously will depend on what we're trying to do.

There are times when we want things to load and happen right away. But if we're running a computationally expensive operation like querying a database (which are usually implemented as asynchronous function and provided by the Runtime Environment) and using the results to populate templates it is better to push this off the main thread and complete the task asynchronously.

---

**REMINDER.** In JavaScript asynchronous functions invoked the same way as synchronous function i.e. in the same order they are written in code:
```js
console.log('a');
setTimeout(() => console.log('c'));
console.log('b');
```
First, `console.log` is invoked, next `setTimeout` and then another `console.log`.

The only difference between async and sync function is how the function gets executed after its invocation (creation of its EC): 
* before the interpreter will move to the next line of code, the EC of *synchronous function* must be fully executed and then removed from the Stack. 
* but in case of *asynchronous function*, its EC is added to Stack and immediately removed, without waiting for the end of execution, and interpreter starts processing the next line of code. Meanwhile in some cases (depending on internal implementation details of specific RE/API) the asynchronous function may continue execution in background in separate thread OR it may just wait for some event to happen (like the elapsed timer, mouse click or the end of our own computationally intensive function). 
  
  In any case, the result is the same: when the function in separate thread is executed or when some event happens, the API creates a new task in Queue and it gets executed only after all synchronous code in the main thread has been fullt executed. 



## Synchronous code execution <a name="synchronous-code-execution"></a>

### Thread Blocking <a name="thread-blocking"></a>

Any JavaScript code that takes too long to return back control to the Event Loop will block the execution of any JavaScript code in the page, even block the UI thread, and the user cannot click around, scroll the page, and so on.

During synchronous execution, if the interpreter is busy processing some function's Execution Context, no other operation could be executed at the same moment. Moving to the next operation is also impossible until the current EC is fully processed. In other words, eveything is blocked, until the current EC is executed. 

Usually the execution takes a split second and we don't notice any delay/freezing. But if this EC executes for too long (for example the *synchronous* request to database or computationally intensive function) - we're in trouble: as I've said already, this EC blocks the execution of any JavaScript code on a page, even browser UI —  it doesn't respond to any user actions: the user can't click, can't scroll the page, etc. Such situation is called the "thread blocking".

***Example.** Thread blocking when running slow synchronous function (for instance, the function performing computationally intensive tasks or synchronous request to database).*
```js
function computationHeavyTask() {
  // ...
}

computationHeavyTask(); 
// alternatively, here could have been a sync request to DB, 
// like databaseRequest();

consol.log('hi');
```
Lets reiterate again: when the interpreter puts the Execution Context of `computationHeavyTask` synchronous function onto the Stack, it wouldn't be able to remove it until the function is fully executed. Thus, if the current EC can't be removed from the Stack, it is also impossible to add to the Stack the EC of `console.log('hi')`. We will see `hi` only when the `computationHeavyTask()` is 100% processed and its EC is removed from the Stack.



### Coping with Thread Blocking <a name="coping-with-thread-blocking"></a>

When you run the synchronous code, unfortunately there is no any way to avoid blocking the thread. 

Neverheless, it is possible to regain some control over the order of function execution using one standard approach to writing the synchronous code — **сallbacks**. 

Callbacks are functions that are passed into other functions as arguments and are called when certain conditions occur. Callback functions can be named or anonymous functions. 

***Example.** Using callback in `forEach()` method. Note that this callback is synchronous.*
```js
// the expected parameter of forEach() is a callback function, which itself
// takes two parameters: a reference to the array element and index values

const colors = ["red", "pink", "black", "yellow"];

colors.forEach((colorName, index) => {
  console.log(index + '. ' + colorName);
});
```

***Example.** We can write our own synchronous callback as well.*
```js
function greeting(name) {
  console("Hi " + name);
}

function processUserInput(callback) {
  let name = prompt("Enter your name.");
  callback(name);
}

processUserInput(greeting);
```
That is, when we pass a callback function as a parameter to another function, we are only passing the function definition as the parameter — the callback function is not executed immediately. It is "called back" (hence the name) synchronously, somewhere inside the containing function's body. The containing function is responsible for executing the callback function when the time comes.

Callbacks allow not only to control the order in which functions are run and data is passed between them, they also allow you to pass data to different fuctions depending on circumstance. So you could have different actions to run on the user details you want to process like `greeting()`, `goodbye()`, `addToDatabase()`, `requestEmailAddress()`, etc.

However, for all their usefulness, such callbacks are still synchronous. They are still blocking the thread when they run.



## Asynchronous code execution <a name="asynchronous-code-execution"></a>

**NOTE.** All the theory from this point and until the end of the article is concerned with "why do we need async code?" and "when should we use async code?".

We can execute the code asynchronously in a number of ways:

* **Passing callback-function to asynchronous method provided by Runtime Envronment (RE) APIs.**

  (In such a case, we call our callback-function an asynchronous one (but only because it is invoked asynchronously accoording to the Event Loop model of particular RE; there is nothing else special about it)).

  Browser RE provides us with Web APIs (which in turn provide us with asynchronous methods like `addEventListener("click", ourAsyncCallback)`, `setTimeout(ourAsyncCallback, 1000)`, etc.; 
  
  Node.js RE provides us with Node.js APIs (which in turn provide us with asynchronous methods like `fs.readFile('/text.txt', ourAsyncCallback)`, `setTimeout(ourAsyncCallback, 1000)`, etc.). 
  
* **Using `Promise`es** (for example we can use the asynchronous `fetch` provided by browser RE's API like `fetch(...).then(ourAsyncCallback)`)

* **Using `async`/`await`** (used mainly for readability)

For the reasons illustrated earlier related to blocking (among many other reasons), many Web API features today use asynchronous code to run, especially those that influence or fetch some kind of resource from an external device, such as fetching a file from the network, accessing a database on the server and returning data from it, accessing a video stream from a web cam, etc. 

Above I've listed three ways to code asynchronously, now I will show examples for each of them (except `async`/`await` cause there is nothing deserving of attention).



### Asynchronous callback-functions <a name="asynchronous-callback-functions"></a>

An example of asynchronous callback is an event handler, i.e. function you pass as the second argument to  `addEventListener()`. 

```js
elem.addEventListener('click', () => {
    console.log('Hi!');
  }
);
```

The first parameter is the type of event to be listened for, and the second one is a function that is invoked \[asynchronousy\] when the event is fired. 

I'll remind right away: `addEventListener` is provided by Web API which in turn belongs to Browser Runtime Environment i.e. it is not a part of JavaScript, but a part of Browser Runtime Environment. `addEventListener` is asynchronous. It starts synchronously as any other async function and attaches the event handler to element and then removed from the Stack. When the event happens (we've clicked on some element), Web API creates a task "run the callback provided to `addEventListener` + pass it an event object with info about click as argument" and puts the task into the Macrotask  Queue. Then on some iteration of the Event Loop this task will be picked up from the Queue and executed.

What happens next is the standard behavior of the Event Loop (see the article about Event Loop for detail),  here is a short explanation: 

1. after the JS Engine will finish processing the entire code of the script file, according to Event Loop model, it will check the Microtask Queue and execute ALL tasks from this Queue
2. then the browser will render the page
3. then JS Engine will check Macrotask Queue again and invoke your event handler




### Promise <a name="promise"></a>

Consider another approach to writing async code.

We retrieve data from API using `fetch()` method, which is asynchronous; it belongs to Web API. 

Why is it asynchronous? Because Web API implementors decided to create it in that way.

```js
console.log('1');

fetch('https://api.mixcloud.com/spartacus/')
  .then(response => {
    console.log(response);
    return response.json();
  })
  .then(user => console.log(user)); //

console.log('2');
```

The [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) method is handled by Macrotask Queue (yes, mAcrotask), I won't explain here all the details of execution cause you should know them already from the article about Event Loop; if you don't understand something, consult the article about Event Loop. 

Nevertheless, here is a brief explanation:

`fetch` is a part of Web API provided by Browser Runtime Environment. It is asynchronous, but it doesn't necessarely runs in a separate thread, it depends on specific Runtime Environment and API implementation and may vary. We should not be concerned with this, the only thing to bear in mind is that it runs asynchronously.

1. output `1`
2. after `fetch()` invocation and creation of its EC, its EC instantly removed from the stack (so it *does not block* subsequent JavaScript code from running) and sync code under `fetch(...` continues to execute: in our case the next sync code is `console.log('2');`. 
3. meanwhile our async method `fetch` continuous its execution in background in parallel thread or somehow else — it doesn't matter (it depending on specific RE and API implementation; explained above). After `fetch` method got the file from the server, Fetch API generates a message into a Macrotask Queue and associates callback function we gave to `then` with this message. 
4. after the main thread (i.e. the first task/message from Macrotask Queue) has finished processing, according to Event Loop model, JS Engine checks Microtask Queue — it is empty, so rendering of the page happens. Then, JS Engine check Macrotask Queue again and sees there is a message from Fetch API. Then, it checks the stack and sees it is empty. So it starts processing the Queue: it takes the message with associated callback function (the callback we passed to `then`), takes this function and passes it to call stack, so the function is invoked and runs.




## Mixing sync and async code <a name="mixing-sync-and-async-code"></a>

**The content of this section is taken from [MDN](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Introducing).**

Let's explore what happens when we try mixing sync and async code, so we can further understand the difference. The following example is fairly similar to what we've seen before.

```js
console.log ('Starting');
let image;

fetch('coffee.jpg').then((response) => {
  console.log('It worked :)')
  return response.blob();
}).then((myBlob) => {
  let objectURL = URL.createObjectURL(myBlob);
  image = document.createElement('img');
  image.src = objectURL;
  document.body.appendChild(image);
}).catch((error) => {
  console.log('There has been a problem with your fetch operation: ' + error.message);
});

console.log ('All done!');
```

1. The browser will start executing the code, see the first `console.log()` statement (`Starting`) and execute it, and then initialize the `image` variable.
2. It will then move to the next line and begin executing the `fetch()` block but, because it is async and not blocking, it will move on with the code execution, finding the last `console.log` statement (`All done!`) and outputting it to the console.
3. Only once the `fetch()` block has completely finished running and delivering its result through the `.then()` blocks will we finally see the second `console.log()` message (`It worked ;)`) appear. So the messages have appeared in a different order to what you'd expect:
   1. `Starting`
   2. `All done!`
   3. `It worked :)`

In a less trivial code example, this could cause a problem — you can't include an async code block that returns a result, which you then rely on later in a sync code block. You just can't guarantee that the async function will return before the browswer has processed the async block. 
 
To see this in action, run the code shown above but change the third `console.log()` call - `console.log ('All done!');` to the following:

```js
console.log ('All done! ' + image + 'displayed.');
```

<de;>You should now get an error in your console instead of the third message:</del> \[there is no error; looks like it is mistake in MDN article; instead of an error shown below, the output is `Starting` — `All done! undefineddisplayed.` — `It worked :)`\]

```js
TypeError: image is undefined; can't access its "src" property
```
This is because at the time the browser tries to run the third `console.log()` statement, the `fetch()` block has not finished running so the `image` variable has not been given a value \[but even if it would have finished running, the result would have been the same cause the message from Fetch API is handled only *after* all sync code in the script (recall: all code inside a file wrapped in a single anonymous function and i handled by Macrotask Queue as a single task, whitch must be 100% complete before handling Microtask Queue -> rendering -> and then handling 1 task from Macrotask Queue again)\].

To fix the problematic `fetch()` example described above and make the three `console.log()` statements appear in the desired order, you could make the third `console.log()` statement run async as well. 

This can be done by moving it inside another `.then()` block chained onto the end of the second one, or by moving it inside the second `then()` block. Try fixing this now. Here is an [example](https://github.com/mdn/learning-area/blob/master/javascript/asynchronous/introducing/async-sync-fixed.html) of how it should be done.



## Glossary <a name="glossary"></a>

* **Engine = Interpreter**



## Q&A <a name="qa"></a>

* **Is Asynchronous and Non-blocking are two different things?**
  
  No, these are the same thing. "Blocking code/function" means "synchronous code" and "non-blocking code/function" means asynchronous code. I.e. if the function is not blocking,  it is asynchronous.

* **What determines which Javascript functions are blocking vs non-blocking?**
 
  Just read the documentation for the function you are using, there will be the info is the function is blocking or non-blocking. [Details](https://softwareengineering.stackexchange.com/questions/202047/what-determines-which-javascript-functions-are-blocking-vs-non-blocking)

* **[Why run one Node.js process per core?](https://stackoverflow.com/questions/54849387/why-run-one-node-js-process-per-core)**

* **[Node.js on multi-core machines](https://stackoverflow.com/questions/2387724/node-js-on-multi-core-machines)**

**TODO:** move the bullet points below to another article.

* Microtasks are used "under the cover" of `await` as well, as it’s another form of promise handling ([source](https://javascript.info/event-loop#macrotasks-and-microtasks))

* `fetch` responses end up in Macrotask!

* promises use Microtask Queue



## References <a name="references"></a>

* [dolszewski.com: The JavaScript runtime environment](http://dolszewski.com/javascript/javascript-runtime-environment/)
* [javascript.info: Event loop: microtasks and macrotasks](https://javascript.info/event-loop)
* [developer.mozilla.org: General asynchronous programming concepts](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Concepts)
* [developer.mozilla.org: Asynchronous JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous)



## Further Reading <a name="further-reading"></a>

* Check out my [Child Process article](child-processes.md#fork) (`fork` section), it contains examples of how long computations can block the event loop and how to cope with this with forking (`fork`) a child process instead of async. code. In Node.js we rarely do this (we usually just use JS async features like Promises and `async`/`await`), but there is always this another approach. It is one of three possible approaches to handling simultaneous connections, explained in [Overview of Forks, Threads, and Asynchronous I/O](https://www.remwebdevelopment.com/blog/overview-of-forks-threads-and-asynchronous-io-133.html) article.
* [An Intro to Node.js That You May Have Missed](https://itnext.io/an-intro-to-node-js-that-you-may-have-missed-b175ef4277f7)
