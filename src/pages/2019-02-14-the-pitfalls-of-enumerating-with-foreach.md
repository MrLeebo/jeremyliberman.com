---
title: "The pitfalls of enumerating with forEach()"
description: "Array's forEach() is a popular way of enumerating lists in JavaScript, but I never recommend using it due to these drawbacks."
date: 2019-02-14
---

If you ask a person on the street to start counting, they will say, "one, two, three, four, five," and so forth. Not us <strong>programmers</strong>. We count a little differently, a programmer will count, "zero, one, many."

OK, maybe not, but I'm referring to a rule of thumb known as the [Zero One Infinity Rule](https://en.wikipedia.org/wiki/Zero_one_infinity_rule), which is illustrative of how we tend to structure our programs. When you're writing a program, you structure your objects so that they can contain **zero** of something (e.g. the root node in a graph has no parent node), **one** (the other nodes in the graph can have one parent), or **many** (each node can have any number, including zero or one, of child nodes).

<img src="/assets/graph_inclusionTree.png" alt="Example node graph">

<center><a href="https://www.eclipse.org/elk/documentation/tooldevelopers/graphdatastructure.html" target="_blank">Source</a></center>

Usually the structure of code dealing with **zero** and **one** values pretty straightforward. You can check the existence of the value using an `if` statement. I'd rather talk about the **many**; lists, arrays, collections, whatever you want to call them.

There are a lot of ways to enumerate a list in JavaScript. To name a few, there's the classic `for` loop:

```js
for (let i = 0; i < list.length; i++) {
  console.log(list[i]);
}
```

The modern `for..of` loop:

```js
for (const item of list) {
  console.log(item);
}
```

The older `for..in` loop:

```js
for (const i in list) {
  console.log(list[i]);
}
```

The `while` loop:

```js
const iter = list[Symbol.iterator]();
let n;
while (((n = iter.next()), !n.done)) {
  console.log(n.value);
}
```

And of course, `forEach`:

```js
list.forEach(console.log);
```

Now, when you set them side-by-side like this, it's easy to see why a lot of junior developers will prefer the `forEach()` syntax. At first glance, it looks shorter, cleaner, easier to remember. However, there are a number of concerns you should be aware of:

- Fails to Communicate Intent
- Lack of Control Flow Statements
- Slow Performance

We'll go over each of these points below.

### Fails to Communicate Intent

Regardless of whether you return a value in your callback function, `forEach()` always returns `undefined`, so you can't chain it with other operations, and it is not well-suited for performing transformations on data. There's generally another function that does a better job and better communicates to other developers what you're trying to accomplish.

##### Perform a transformation on each value in the list

```js
// instead of
const result = [];
[(1, 2, 3, 4)].forEach(num => {
  result.push(Math.pow(num, 2));
});

// try
const result = [1, 2, 3, 4].map(num => Math.pow(num, 2));
```

With `.map()` each value in the input array will be replaced by the value returned by the callback in the output array. So you'll have a one-to-one symmetry between your input and output.

##### Filtering out values from the list

```js
// instead of
const evens = [];
[(1, 2, 3, 4)].forEach(num => {
  if (num % 2 === 0) evens.push(num);
});

// try
const evens = [1, 2, 3, 4].filter(num => num % 2 === 0);
```

You can use `.filter` to match each value in the arraya against a conditional check, and only return the values that pass the check. The resulting array will have as many or fewer items in it than the input array.

##### Perform an aggregation of the values in the list

```js
// instead of
let total = 0;
[(1, 2, 3, 4)].forEach(num => {
  total += num;
});

// try
const total = [1, 2, 3, 4].reduce((add, num) => add + num);
```

`.reduce()` is a function that bothers a lot of people, but in general you can think of it like this; use reduce to collapse an array into a single value. Aggregate functions like finding the sum total, the min/max, etc, are great candidates for reduce. You can also use it to construct a brand new object or array using the values of the input array. Like a `GROUP BY` statement in SQL.

Each one of these functions (as well as the other built-in array functions) do a better job of communicating the purpose of the loop than forEach does.

### Lack of Control Flow Statements

In a typical `for` loop, you can use control flow statements like `break`, `continue`, and `return` to change the flow of your operation.

```js
// return the name of the first item, responding to control flow instructions
function findName(list) {
  for (const item of list) {
    // skips to the next item in the list
    if (item.skip) continue;

    // terminates the loop, no matter how many items remain
    if (item.terminate) break;

    // if this item has a name, return it
    if (item.name) return item.name;
  }
}
```

There is no equivalent in `forEach()`. After you've found what you wanted, you have to let the rest of the loop play out, there's no way to terminate the loop early except by throwing an error. It's not a good idea to try to use errors as control flow statements in your code.

### Slow Performance

When it comes to the age-old debate of readability versus performance, I tend to linger around the readability side of the debate. Generally the JavaScript in the front-end (browser/client-side apps) shouldn't be doing so much stuff that it warrants optimizing, and I try to offload the work on the backend to the database or to small, [idempotent](https://joycse06.github.io/blog/2016/09/designing-good-background-jobs-idempotence/) jobs. However, I can't write an informative blog about the pitfalls of `forEach()` if I ignored the performance impact, can I?

<img src="/assets/forEachPerformance.png" alt="Performance Benchmark">
<center><a href="https://jsbench.me/ymjs56639r/1" target="_blank">Benchmark</a></center>

The slow performance of forEach is compounded by the fact that you can't end the loop early once you've found what you're looking for.

### Conclusion

For any given use of `.forEach()` there is likely to be a similar implementation that is either A) shorter or easier to read by using the appropriate array function, B) able to better take advantage of control flow structures to retrieve a result more directly, or C) able to execute faster.

The only measure by which `.forEach()` wins any kind of accolade is by being the fewest keystrokes for the most trivial loops. I don't think this is a compelling reason to use it, though, because as a developer your output is rarely ever limited by how fast you can type.
