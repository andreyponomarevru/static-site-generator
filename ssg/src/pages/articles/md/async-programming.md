# An h1 header

From doc: Test stubs are functions (spies) with pre-programmed behavior. They support the full test spy API in addition to methods which can be used to alter the stub’s behavior.
As spies, stubs can be either anonymous, or wrap existing functions. When wrapping an existing function with a stub, the original function is not called.

Stubs are really great. This is because; they have all the functionality of spies but unlike spies they replace the whole function. This means that with spies the function runs as is but with a stub you are replacing said function. This helps in scenarios where we need to test:

External calls which make tests slow and difficult to write (e.g HTTP calls/ DB calls)
Triggering different outcomes for a piece of code (e.g. what happens if an error is thrown/ if it passes)

1. A
2. B
3. C
   - A1
   
![](/img/engine-vs-runtime.svg)

## References:
  - [MND: .../docs/Learn/JavaScript/Asynchronous/Concepts](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Concepts)
  - [MDN: .../docs/Learn/JavaScript/Asynchronous](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous)

## FAQ
  - _Is Asynchronous and Non-blocking are two different things?_  
    No, this is the same thing. "blocking code/function" means "synchronous code" and "non-blocking code/function" means asynchronous code. I.e. if the function is not blocking, it is asynchronous.

    No, this is the same thing. "blocking code/function" means "synchronous code" and "non-blocking code/function" means asynchronous code. I.e. if the function is not blocking, it is asynchronous.
  - _What determines which Javascript functions are blocking vs non-blocking?_  
    Just read the documentation for the function you are using, there will be the info is the function is blocking or non-blocking. [Details](https://softwareengineering.stackexchange.com/questions/202047/what-determines-which-javascript-functions-are-blocking-vs-non-blocking)
  - Microtasks are used “under the cover” of `await` as well, as it’s another form of promise handling ([source](https://javascript.info/event-loop#macrotasks-and-microtasks))
  - `fetch` responses end up in Macrotask!
  - promises use Microtask Queue
  - Note that the terms _thread worker_, _worker_, and _thread_ are often used interchangeably; they all refer to the same thing. Also _Thread Pool_ = _Worker Pool_ = _`libuv`'s threadpool_

Paragraphs are separated by a blank line.

2nd paragraph. _Italic_, **bold**, and `monospace`. Itemized lists
look like:

- this one
- that one
- the other one

Note that — not considering the asterisk — the actual text
content starts at 4-columns in.

> Block quotes are
> written like so.
>
> They can span multiple paragraphs,
> if you like.

Use 3 dashes for an em-dash. Use 2 dashes for ranges (ex., "it's all
in chapters 12--14"). Three dots ... will be converted to an ellipsis.
Unicode is supported. ☺

## An h2 header

Here's a numbered list:

1. first item
2. second item
3. third item

As you probably guessed, indented 4 spaces. By the way, instead of
indenting the block, you can use delimited blocks, if you like:

```js
define foobar() {
    print "Welcome to flavor country!";
}
```

(which makes copying & pasting easier). You can optionally mark the
delimited block for Pandoc to syntax highlight it:

```php
import time
# Quick, count to ten!
for i in range(10):
    # (but not *too* quick)
    time.sleep(0.5)
    print i
```

### An h3 header

Now a nested list:

1.  First, get these ingredients:
    - carrots
    - celery
    - lentils
2.  Boil some water.
3.  Dump everything in the pot and follow
    this algorithm:

        find wooden spoon
        uncover pot
        stir
        cover pot
        balance wooden spoon precariously on pot handle
        wait 10 minutes
        goto first step (or shut off burner when done)

    Do not bump wooden spoon or it will fall.

Notice again how text always lines up on 4-space indents (including
that last line which continues item 3 above).

Here's a link to [a website](http://foo.bar), to a [local
doc](local-doc.html), and to a [section heading in the current
doc](#an-h2-header). Here's a footnote [^1].

[^1]: Footnote text goes here.

Tables can look like this:

size material color

---

9 leather brown
10 hemp canvas natural
11 glass transparent

Table: Shoes, their sizes, and what they're made of

(The above is the caption for the table.) Pandoc also supports
multi-line tables:

---

keyword text

---

red Sunsets, apples, and
other red or reddish
things.

green Leaves, grass, frogs
and other things it's
not easy being.

---

A horizontal rule follows.

---

Here's a definition list:

apples
: Good for making applesauce.
oranges
: Citrus!
tomatoes
: There's no "e" in tomatoe.

Again, text is indented 4 spaces. (Put a blank line between each
term/definition pair to spread things out more.)

and images can be specified like so:

![example image](example-image.jpg "An exemplary image")

Inline math equations go in like so: $\omega = d\phi / dt$. Display
math should get its own line and be put in in double-dollarsigns:

$$I = \int \rho R^{2} dV$$

And note that you can backslash-escape any punctuation characters
which you wish to be displayed literally, ex.: \`foo\`, \*bar\*, etc.
