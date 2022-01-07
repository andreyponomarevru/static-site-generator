# Asynchronous Programming in JavaScript. Part I. Threading

* [Building blocks](#building-blocks)
  * [Engine](#engine)
  * [Runtime Environment](#runtime-environment)
* [Threading](#threading)
  * [Browser Runtime Environment](#browser-runtime-environment)
  * [Node.js Runtime Environment](#nodejs-runtime-environment)
    * [Worker Pool](#worker-pool)
* [Glossary](#glossary)
* [Q&A](#qa)
* [References](#references)
* [Further Reading](#further-reading)

---

**JavaScript is at its most basic a *synchronous*, *blocking*, *single-threaded* language. That is, the JavaScript engine can only process one statement at a time in a single thread.**

In this article, I will explore what "single-threaded" in the context of JS means. 

**NOTE**. If you need a bigger-picture perspective on applications designed to handle multiple connections, please read this article: [Overview of Forks, Threads, and Asynchronous I/O](https://www.remwebdevelopment.com/blog/overview-of-forks-threads-and-asynchronous-io-133.html). The article doesn't talk about Node.js in particular, but the architecture of Node.js as a software falls into one of the three categories discussed in the article (Node.js implements an asynchronous I/O model). You can safely skip the article if all you want to learn is asynchronous JS. But if you need information regarding scaling, running multiple child processes/instances and how all this interrelates with OS, the article may become pretty helpful.

We start with the discussion of the two most important entities in JS: the **Engine** and the **Runtime Environment**.

![](./../img/engine-and-runtime-environment.png)

*Illustration 1. OS, Runtime Environment, and Engine.*

**ILLUSTRATION NOTE.** In JavaScript, we have Native Objects (aka JS built-ins) and Host Objects. Here is the mental model note: Native Objects (all JavaScript native objects and methods) are supplied by the JavaScript Engine itself i.e. it provides them to the Runtime Environment. Then Runtime Environment takes them and exposes them through its main Host Object (which is `window` in a browser, `global` in Node.js, and can be something else in other environments).



## Building blocks <a name="building-blocks"></a>

### Engine <a name="engine"></a>

There are two types of programming languages: compiled and interpreted. If the language is interpreted (like JavaScript) — before execution, the source code is not compiled into binary code. Hence, we need a thing that could help the computer to understand what to do with a plain text script. And this thing is called *JavaScript Engine* (= interpreter).

In simple words, the engine interprets and runs your JavaScript code. 

More technically speaking:

> JavaScript Engine translates \[i.e. compiles\] the source code of your script into runnable machine code instructions, so it can be executed by the CPU of the host machine. The engine translates scripts at runtime on the fly. Your code won’t be compiled unless you run it ([source](http://dolszewski.com/javascript/javascript-runtime-environment/)).

![](./../img/engine.png)

*Illustration 2. How our script gets processed by the engine.*
 
**The Engine consists of:**

* Heap
  > Heap is a large unstructured data structure which stores all the dynamic data like function definitions, objects, arrays etc. Execution context stack just contains their reference or in other words stores their memory addresses where these function definitions, objects and arrays are stored. The memory occupied in the heap continues to exist even after the JavaScript code execution has completed. They are removed by the JavaScript Garbage Collector ([source](https://blog.bitsrc.io/javascript-internals-javascript-engine-run-time-environment-settimeout-web-api-eeed263b1617)).

* Call Stack

**Here are the main things the Engine does:**

* compiles and executes JS code
* manages the Call Stack (runns functions in a specific order)
* manages memory allocation for objects — the Memory Heap
* performs garbage collection of objects which are no longer in use
* provides all the data types, operators, objects, and functions

**The most widely known JavaScript Engines are:**

* V8 (used in Chrome and Node.js)
* SpiderMonkey (used in Firefox)
* Nitro (used in Safari)
* Chakra (used in Edge)

Now, let's talk about how the JavaScript Engine fits into the bigger picture. For now, keep in mind only two things: there is a Runtime Environment, and there is an Engine inside of it. 



### Runtime Environment <a name="runtime-environment"></a>

Usually, we don't use the Engine directly. It works inside some *Runtime Environment* (RE), which provides your scripts with RE-specific features (libraries, APIs) available at runtime. For instance, in Node.js Runtime Environment, there is an `http` module and a `process` global object. 

> The important thing is that the *JavaScript Engine implementation is totally independent of the Runtime Environment*. Engines aren’t developed with any particular environment in mind. You can find the V8 engine both in Chrome browser and Node.js. One engine successfully utilized in two environments created for totally different uses ([source](http://dolszewski.com/javascript/javascript-runtime-environment/)).

**In general, the Runtime environment consists of the following entities:**

* **Event Loop** (runs on the main thread and is a part of the Runtime Environment)
* **Macrotask Queue** (aka Message Queue)
* **Microtask Queue** (aka Job Queue)
* **Tasks** (aka Messages) (put in aforementioned Queues)
* **APIs** (provided by the Runtime Environment; the *Browser Runtime Environment* provides us with *Web APIs* while *Node.js Runtime Environment* - with *Node.js APIs*)

There are a few other entities, but I'll mention them later when discussing Browser and Node.js Environments in more detail.

Note that although both Chrome browser and Node.js use the same Engine (V8), their Runtime Environments are different in:

* provided APIs
* Event Loop implementation
* some other stuff, that will be covered later

Now, let's take a step back and discuss what is threadening.



## Threading <a name="threading"></a>

***Threading* is how many operations the interpreter can execute simultaneously.**

Programming languages can be divided into:

* **single-threaded** - at a single point in time, the interpreter can run only one operation
* **multi-threaded** - at a single point in time, the interpreter can run two or more operations

Now, these are the two main paragraphs of this article:

**Generally, we should not be concerned with threading in JavaScript, cause threads are implemented and managed by the Runtime Environment itself and it is done differently in each RE. For us, most of the time when we work with asynchronous code, it doesn't matter whether the new thread is created or not, cause a) it is considered an internal implementation detail and b) no matter what, everything eventually ends up in a Queue and is handled by the Event Loop.**

**So, any async code executes either in a parallel thread (like `fs.readFile()`) or in the same main thread but after all sync code has been fully executed (like `setTimeout`). In both ways, the async callback is always put into the Queue i.e. the result of execution of any async code is eventually always handled by the Event Loop. Thus in most cases, there is no need to think about threads and about whether some function/method executes in a separate thread or not.**

Nevertheless, it's useful to understand things at least one layer deeper than we usually need, so let's continue. 

**In browser:** by default, the Chrome browser itself creates an entirely separate operating system *process* for every single tab or extra extension you are using. 

**In Node.js:** same with Node — it creates a separate *process* for each script. 

And as we know, each process is single-threaded i.e. **browser, Node.js, and almost all other existing REs provide only a single-thread for JavaScript execution per realm (loosely, window/tab)**. Sometimes that one thread is shared across realms (for instance, when multiple windows/tabs have access to each other's code).

---

As we've seen above, RE provides us with APIs: *Web APIs* in Browser RE, *Node.js APIs* in Node.js RE, some other APIs in other REs. Some of these APIs (i.e. their methods) are allowed to use multiple threads to execute asynchronous tasks. Which APIs create new threads and which do not is considered an internal implementation detail and may vary.

But where do the aforementioned APIs take these threads from? 

**In browser**, the browser itself creates threads for executing certain Web APIs tasks. (**NOTE:** look at illustration 1 again — there is no "Worker Pool" in Browser Runtime Environment; nevertheless the browser probably has its own Worker Pool as Node.js has, but it's not documented and should be considered an internal implementation detail.)

**In Node.js** the library called `libuv` has a Worker Pool and it just takes threads from this pool and assigns asynchronous tasks to execute in specific threads. 

("certain tasks" means the tasks that we usually consider *asynchronous*: network operations, reading files from the disk, <del>timers</del>, <del>events</del>, etc.; full list of them see in the "Event Loop" article). 

<img src="./../img/eventloop.png" width="700px">

*Illustration 3. JavaScript Engine.*

 
 
### Browser Runtime Environment <a name="browser-runtime-environment"></a>

Consists of (only most important parts):

* Event Loop
* Macrotask Queue
* Microtask Queue
* Tasks
* Web APIs 

Browser Runtime Environment provides **Web APIs** (aka browser APIs): you have `window` as the main host object. Through it the Browser Runtime Environment exposes Native JS objects/functions and Web APIs (among them is the DOM API, it provides the stuff like `document` object, `addEventListener()`, `setTimeout`, ...), Fetch API, Console API, etc.) (*note*: there is no one single "Web API"; there are dozens of separate APIs implemented in web browsers i.e. provided to JavaScript by different Browser Runtime Environments).



### Node.js Runtime Environment <a name="nodejs-runtime-environment"></a>

Consists of (only most important parts):

* Event Loop
* Macrotask Queue
* Microtask Queue
* Tasks
* Node.js API (providing globals, native modules' APIs)
* libraries: `libuv`, `c-ares`, ... (full list in [Node.js documentation](https://nodejs.org/en/docs/meta/topics/dependencies/))

Also, I've already explained it above but I want to reiterate: when you're writing code, you're not in "Runtime Environment". The moment you issue `npm run start` or `node app.js` or whatever command you're using to start your app, you're in "Runtime Environment".

---

While Browser RE has Web APIs, Node.js RE has **Node.js APIs**: you have the main `global` host object which provides you with globals like `require`, `setTimeout`, `console`, `Buffer`, `process`, etc. Node also gives you host objects in the form of built-in modules (e.g. `http`, `fs`).

**Node.js and Chrome browser have different Event Loop implementations, so they are executed differently. Node.js uses Event Loop implemented in the `libuv` library**. 

**`libuv` library is provided by Node.js Runtime Environment and is completely written in C. Its main responsibility is to provide non-blocking I/O operations — primarily, non-blocking interactions with the system’s disk and network. It provides mechanisms to handle file system, DNS, network, child processes, pipes, signal handling, polling, and streaming. It also includes a Worker Pool for offloading work for some things that can't be done asynchronously at the operating system level** (more on this below). By default, there are four threads in it. We could increase or reduce this Worker Pool by calling `process.env.UV_THREADPOOL_SIZE` at the top of our script.

Thanks to the `libuv` we can use Node.js to implement any sort of server executing any TCP or UDP protocol, whether it's DNS, HTTP, internet relay chat (IRC), or FTP.

> The strategy used by `libuv` to achieve asynchronous I/O is not always a Worker Pool, specifically in the case of the `http` module a different strategy appears to be used at this time. For our purposes here it's mainly important to note how the asynchronous context is achieved (by using `libuv`) and that the Worker Pool maintained by `libuv` is one of the multiple strategies offered by that library to achieve asynchronicity ([source](https://stackoverflow.com/questions/22644328/when-is-the-thread-pool-used)) 

Cause Worker Pool is implemented in `libuv`, this results in a slight delay whenever Node needs to communicate internally between JavaScript and C++, but this is hardly noticeable.

With the `libuv` library and Worker Pool which it provides, we're able to write the code like this:

```js
fs.readFile(path.join(__dirname, './package.json'), (err, content) => {
 if (err) return null;
 console.log(content.toString());
});
```

> Certain functions and modules, usually written in C/C++, like `fs` in example above, support asynchronous I/O operations. When you call these functions/methods, they internally manage passing the call on to a worker thread. For instance, when you use the `fs` module to request a file, the `fs` module passes that call on to a Worker Pool (which is, in a broad sense, can be considered a part of Node.js API) asking it to use one of its threads to read the contents of a file and notify the Event Loop (running on a main thread) when it is done. The Event Loop then takes the provided callback function and executes it with the content of the file ([source](https://stackoverflow.com/questions/22644328/when-is-the-thread-pool-used))

Above is an example of a non-blocking code; as such, we don’t have to wait synchronously for something to happen. We tell the Worker Pool to read the file (using one of available threads) and call the callback function with the result of the operation (when the file is read, Node.js API will create the task in a Queue containing the callback function and providing it with the result of `fs.readFile` method). Since Worker Pool has its own threads, the Event Loop on the main thread can continue executing normally while the file is being read.



#### Worker Pool <a name="worker-pool"></a>

In the past, fields that require complex calculations — such as AI, machine learning, or big data — couldn't really use Node.js efficiently due to the operations blocking the main (and only) thread (the so-called "thread blocking" aka "Event Loop blocking" or just "blocking"), making the server unresponsive. That was the case up until Node.js v10.5.0 came about, which added support for multiple threads.

The `libuv` library provbided by the Node.js Runtime Environment has a default Worker Pool size of 4, and uses a queue (not the Queue in a sense of micro/macro-tasks; it's another unrelated queue) to manage access to the Worker Pool - the upshot is that if you have 5 long-running DB queries all going at the same time, one of them (and any other asynchronous action that relies on the Worker Pool) will be waiting for those queries to finish before they even get started. 
  
In other words, when `libuv` needs to perform some operation that needs a new thread, it looks into the Worker Pool checking is there available thread? If yes, it takes it and assignes the function to this thread. If there is no available threads, `libuv` waits using internal queue to manage functions demanding new threads.

You can mitigate this by increasing the size of the Worker Pool through the `UV_THREADPOOL_SIZE` environment variable, so long as you do it before the Worker Pool is required and created: `process.env.UV_THREADPOOL_SIZE = 10;`

Note that **the threads in the Worker Pool may block** (for example, waiting for a disk access), **but this doesn’t block the JavaScript engine which runs in its own thread**. If all the threads in the Worker Pool are busy and new tasks from the JavaScript Engine arrive, then these new tasks are simply queued up by `libuv` and they will be processed as soon as a worker thread becomes free.



## Glossary <a name="glossary"></a>

* **Node.js = Node.js Runtime Environment**

  When we say "Node.js", technically it means "Node.js Runtime Environment" i.e. Node.js IS the Runtime Environment! In essense Node.js was developed to replicate the browser Runtime Environment outside an actual browser. 

* **Engine = Interpreter** (although the engine also compiles the code, we can still call it an interpreter, just in a broader sense)

* The terms **thread worker**, **worker**, and **thread** are often used interchangeably; they all refer to the same thing. Also **Thread Pool** = **Worker Pool** = **`libuv`'s threadpool**



## Q&A <a name="qa"></a>

* **[Why run one Node.js process per core?](https://stackoverflow.com/questions/54849387/why-run-one-node-js-process-per-core)**

* **[Node.js on multi-core machines](https://stackoverflow.com/questions/2387724/node-js-on-multi-core-machines)**

* **Does each event listener or timer or network operation creates a new thread?** It does not matter and it is considered an internal implementation detail. But generally, no, event listeners and timers do not create new threads; network operations and disk access operations usually do, but again, it may vary between Runtime Environments). 

  It's best to imagine that in both browser and Node.js RE, some methods of APIs are executed in one or more separate concurrent threads at the same time as the main JavaScript thread executes. The code executing in those other threads can add tasks to the Queue that will be picked up by the Event Loop running on the main JavaScript thread. So we don't have to worry about thread management and order of execution, Runtime Environment does it for us using Event Loop. 

* **But what if we still want a real traditional concurrency i.e. to have multiple threads?** 
  * [Stackoverflow: How to create threads in nodejs](https://stackoverflow.com/questions/18613023/how-to-create-threads-in-nodejs)
  * with some limitations, we can achieve a real concurrency (multi-threading) by utilizing WebWorkers ([`webworker-threads`](https://www.npmjs.org/package/webworker-threads)) or through built-in [`cluster`](http://nodejs.org/api/cluster.html) module 
  * also, we can *imitate* (to fake) concurrency (multi-threaded behavior) by implementing some way of chunking up your work and manually using `setTimeout` or `setImmediate` or `process.nextTick` to pause your work and continue it in a later loop to let other processes complete (but that's not recommended). 



## References <a name="references"></a>

* [dolszewski.com: The JavaScript runtime environment](http://dolszewski.com/javascript/javascript-runtime-environment/)
* [javascript.info: Event loop: microtasks and macrotasks](https://javascript.info/event-loop)
* [developer.mozilla.org: General asynchronous programming concepts](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Concepts)
* [developer.mozilla.org: Asynchronous JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous)



## Further Reading <a name="further-reading"></a>

* Check out my [Child Process article](child-processes.md#fork) (`fork` section), it contains examples of how long computations can block the event loop and how to cope with this with forking (`fork`) a child process instead of async. code. In Node.js we rarely do this. Instead, we usually use JS async features like Promises and `async`/`await`). `fork` is one of the three possible approaches to handling simultaneous connections, explained in [Overview of Forks, Threads, and Asynchronous I/O](https://www.remwebdevelopment.com/blog/overview-of-forks-threads-and-asynchronous-io-133.html) article.
* [An Intro to Node.js That You May Have Missed](https://itnext.io/an-intro-to-node-js-that-you-may-have-missed-b175ef4277f7)
