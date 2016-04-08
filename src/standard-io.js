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
  let then

  if (value && value.then) {
    then = value.then.bind(value)
  } else if (value) {
    promise = Promise.resolve(value)
    then = promise.then.bind(promise)
  } else if (promise) {
    then = promise.then.bind(promise)
  } else {
    promise = Promise.resolve()
    then = promise.then.bind(promise)
  }

  if (Array.isArray(value) && !toNonObjects(value).length) {
    value = mergeObjects(value)
  }

  if (typeof value == "object") {
    return { then, value, ...value }
  } else {
    return { then, value }
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
