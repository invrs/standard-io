import clone from "lodash.clone"
import merge from "./merge"

export function mergeObjects(objects, base = {}) {
  return objects.reduce(
    (current, arg) => { return merge(current, arg) },
    base
  )
}

export function objectArgument({ args, ignore = [] } = {}) {
  let objects = toObjects(args)
  let _args = toNonObjects(args)
  let obj = mergeObjects(objects)

  return clone(
    merge(obj, {
      args: merge({}, obj, ignore),
      _args
    })
  )
}

export function returnObject({ promise, value } = {}) {
  if (value && value.then) {
    promise = value
  } else if (value) {
    promise = Promise.resolve(value)
  } else if (!promise) {
    promise = Promise.resolve()
  }

  let then = promise.then.bind(promise)
  let ctch = promise.catch.bind(promise)

  if (Array.isArray(value) && !toNonObjects(value).length) {
    value = mergeObjects(value)
  }

  if (typeof value == "object") {
    return { catch: ctch, then, value, ...value }
  } else {
    return { catch: ctch, then, value }
  }
}

export function toNonObjects(args = []) {
  return args.filter(
    item => item && typeof item != "object"
  )
}

export function toObjects(args = []) {
  return args.filter(
    item => item && typeof item == "object"
  )
}
