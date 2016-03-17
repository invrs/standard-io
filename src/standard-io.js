import Immutable from "immutable"

export function mergeObjects(objects, base = Immutable.Map()) {
  return objects.reduce(
    (current, arg) => { return current.merge(arg) },
    base
  )
}

export function objectArgument({ args } = {}) {
  let objects = toObjects(args)
  let _args = toNonObjects(args)
  
  args = mergeObjects(objects)

  return args.merge({ args, _args }).toJS()
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

  if (typeof value == "object") {
    return { then, value, ...value }
  } else {
    return { then, value }
  }
}

export function toNonObjects(args) {
  return args.filter(
    item => item && typeof item != "object"
  )
}

export function toObjects(args) {
  return args.filter(
    item => item && typeof item == "object"
  )
}
