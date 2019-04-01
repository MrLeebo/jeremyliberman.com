---
title: 'How does "this" work in JavaScript?'
description: `Not sure where JavaScript's context variable "this" comes from? Let's talk about it. As a bonus, we'll also talk about closures and arrow functions.`
date: 2019-04-01
---

Whether you are learning JavaScript coming from a different language, or are getting into programming for the first time, JavaScript's concepts of context and closures are some of the most confusing aspects of the language. Newcomers learning React are particularly susceptible to encountering pitfalls if they don't have a solid understanding.

### What is Context?

Context is, basically, the object that a function belongs to. A lot of times you'll see the terms "function" and "method" used interchangeably. If you want to be precise, a method is a function that belongs to an object. Usually it either reacts to that object's state, or is capable of modifying that state. In JavaScript, you can access a method's context using "this".

```js
const obj = {
  name: 'Steve',
  greet() {
    // this.name is part of this function's context
    console.log(`Hello, ${this.name}!`)
  }
}

obj.greet() // "Hello, Steve!"
```

However, this code is fairly brittle. It can have unexpected consequences if you change the way you call the function.

##### Examples of function calls without context

```js
const greet = obj.greet
greet()
```

```js
(obj.greet)()
```

In both of these cases, you are likely to see either "Hello, undefined!", or get a `TypeError` depending on if your code is running in [strict mode](https://devdocs.io/javascript/strict_mode). If you're not in strict mode, functions that don't have a set context will use the global context instead (`global` or `window` depending on if you're running Node vs Browser JavaScript). In strict mode, `this` will be undefined in functions without context.

Context is determined by how you call the function, not how it's defined. The context is set automatically when the function is called directly from the object using the basic "dot" syntax:

```js
obj.greet() // We have context! `this` is `obj`!
```

### Assigning Context to a Method Programmatically

Of course, if the basic dot syntax was the only way we could invoke methods in JavaScript and keep the context, that would really limit the kinds of applications we could build. Fortunately, there are ways to assign a method's context to something else, when you call it, or to bind a new context to a function permanently.

```js
// method.call(thisArg)
const greet = obj.greet
greet.call(obj)

// method.bind(thisArg)
const boundGreet = obj.greet.bind(obj)
boundGreet()
```

Using `method.call(thisArg)`, we invoke the function and set its context to the given object. You can see that a function's "context" is basically just an invisible argument that gets added to the parameter list. The `method.bind(thisArg)` returns a clone of the function where the context has permanently been assigned to the given object. And I mean **permanently**, you can't reassign the context by calling `boundGreet.call(other)` or `boundGreet.bind(other)` again.

### What about Closures?

In JavaScript, when you define a function you have access to any variables defined within the scope of that function, as well as any variables defined in the outside scopes that your function is being defined within.

```js
function outer() {
  const x = 2
  
  return function inner(y) {
    // x is part of the inner function's closure
    return x * y  
  }
}

const doubler = outer()
doubler(3) // 6
```

In this example, the variable `x` is part of the closure for the `inner` function. Closures and Context are two different concepts, though sometimes people abuse closures when they are trying to juggle two or more contexts at the same time.

```js
const obj = { 
  runLater() {
    // take the context "this" and add it to the closure "that" 
    // of a function that will run in 5 seconds.
    const that = this
    setTimeout(function() {
      // since this function was invoked by `setTimeout`, its context will be the global scope or "undefined"
      // based on whether you're in "strict mode"
      console.log(that)
    }, 5000)
  }
}

obj.runLater()
```

A closure is constructed any time a function accesses a variable from an outer scope. It's important to remember that closures don't capture the _values_ of variables, they capture the **variables themselves**. This means that the closure will contain the value that the variable has when it executes, which may be different from the value it had when you defined it!

```js
function runLater() {
  let x = 5

  setTimeout(function() {
    console.log(`x is ${x}`)
  }, 0)
  
  // even though x was 5 when we defined the function, it changed to 10
  // before the function executed. It is "x" that the closure captured,
  // not the number 5.
  x = 10
}

runLater()
// x is 10
```

A very common way to encounter this behavior is if you are defining a callback inside a loop if the variables in your loop aren't properly scoped.

```js
function countToTen() {
  for (var i = 0; i < 10; i++) {
    setTimeout(function() {
      console.log(i + 1)
    }, i)
  }
}

countToTen()
```

If you're expecting this loop to prints the numbers from 1 to 10, you'll be disappointed. It actually prints 10 ten times. Why? `var i = 0` hoists the "i" variable to the top of the function, meaning that each callback function that we pass to `setTimeout()` actually gets the same variable, which the loop increments to 10.

If you change the variable definition to `let i = 0`, which scopes the "i" variable within the body of the for loop, it will count from 1 to 10.

At the end of all that, you may be wondering why we're talking about closures, since we've already established they're different from context. I'm just grooming you for the next topic, _arrow functions_.

### How does context differ for Arrow Functions? 

It's quite simple and yet there are a lot of misconceptions about this. **Arrow functions don't have context.** Closures just happen to make them behave that way. When you access `this` inside an arrow function, it's actually adding `this` to the arrow function's closure. In this way, arrow functions always inherit the "context" of the function scope they're defined inside. It's not actually binding the context, it's just trapping "this" in the closure.

```js
const obj = {
  runLater() {
    // "this" is part of the closure for this arrow function!
    setTimeout(() => console.log(this), 0)
  }
}

obj.runLater()
```

Remember earlier when we talked about juggling context from multiple functions by storing the outer function's context in a variable using `const that = this`? This example is identical to that, but we don't need to juggle anything because the arrow function has no context.
