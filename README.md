# StandardIO [![Build Status](https://travis-ci.org/invrs/standard-io.svg?branch=master)](https://travis-ci.org/invrs/standard-io)

A standard for javascript function arguments and return values.

## Overview

StandardIO limits the input and output of all javascript functions to a single object.

Our aim is to make working with Promises more fluid and to open the door for functions [becoming more extensible](#implementation).

This function adheres to the StandardIO spec:

```js
function hello({ world }) {
  return `hello ${world}`
}

hello({ world: "world" })
  // { value: "hello world" }
```

StandardIO makes creating and using promises more succinct:

```js
function hello({ world, promise: { resolve } }) {
  let fn = () => resolve({ world: `hello ${world}` })
  setTimeout(fn, 1)
}

hello().then(hello).then(console.log)
  // { world: "hello hello world" }
```

Even functions with hard returns are thenable:

```js
function hello({ world, promise: { resolve } }) {
  return { world: `hello ${world}` }
}

hello().then(hello).then(console.log)
  // { world: "hello hello world" }
```

The `args` property makes argument objects portable:

```js
function hello({ args, world }) {
  world = `hello ${world}`
  return { ...args, world }
}

hello({ a: true, world: "world" })
  // { a: true, world: "hello world" }
```

## Implementation

StandardIO is a specification for how functions should receive parameters and transform those parameters into an argument for the function (input). It also specifies the format for returning values (output).

Currently the only way to implement StandardIO with ES6 classes is through [extensions built for Industry](https://github.com/invrs/industry#existing-extensions) that automatically wrap your methods. Industry is a framework for defining extensible factories using ES6 classes.

The StandardIO pattern enables Industry to extend the inputs and outputs of methods with minimal impact on existing code.

## Specification

1. Object argument
  1. [`args` property](#args-property)
  2. [`_args` property](#_args-property)
  3. [`promise.resolve` property](#promiseresolve-property)
  4. [`promise.reject` property](#promisereject-property)
2. Return value object
  1. [`then` property](#then-property)
  2. [`value` property](#value-property)

### Object argument

If you pass multiple objects to a function, they merge to form a single object:

```js
function hello({ a, b, c }) {
  a // 1
  b // 2
  c // 3
}

hello({ a: false, b: 2 }, { a: 1, c: 3 })
```

Though it goes against the pattern, you can pass non-object parameters into a function (see the [`_args` property](#_args-property)).

#### `args` property

The `args` property of the object argument is a reference to the object argument itself.

This allows you to use destructuring assignment on the argument while also having a reference to the entire object if needed:

```js
function hello({ args, world }) {
  world = `hello ${world}`
  return { ...args, world }
}

hello({ a: true, world: "world" })
  // { a: true, world: "hello world" }
```

The `args` property will always overwrite any `args` property that is passed to the function.

The `args` value does not contain an `args` or `_args` property.

#### `_args` property

The `_args` property of the object argument is an array of any non-object values that were passed into the function:

```js
function hello({ _args: [ world ] }) {
  return `hello ${world}`
}

hello("world")
  // { value: "hello world" }
```

The `_args` property will always overwrite any `_args` property that is passed to the function.

#### `promise.resolve` property

The `promise.resolve` property of the object argument is a function you can call if your function is asynchronous.

The `promise.resolve` function is similar to the one in `new Promise(function(resolve, reject) { ... })`.

The resolved asynchronous value is passed along through the [`promise.then` property](#promise.then-property).

#### `promise.reject` property

The `promise.reject` property of the argument object is a function you can call if your function is asynchronous.

The `promise.reject` function is similar to the one in `new Promise(function(resolve, reject) { ... })`.

The rejected asynchronous value is passed along through the [`promise.then` property](#promise.then-property).

### Return value object

The return value of a function is **always** a single object.

#### `then` property

The `then` property exposes a function that makes the return object thenable.

If a function does a hard return with a promise, `then` will resolve when the promise does.

If a function does a hard return with a non-promise value, `then` will resolve with that value.

If a function does not return any value, `then` will resolve when the [resolve](#resolve-property) or [reject](#reject-property) functions are called.

#### `value` property

The `value` property of the object argument is set to the value of the hard return (if there is one):

```js
function hello() {
  return "hello"
}

hello()
  // { value: "hello" }
```

The `value` property will always overwrite the `value` property of an object that is returned from the function.

