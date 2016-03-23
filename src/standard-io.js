import clone from "lodash.clone"

function merge(base, obj) {
  let new_obj = {}
  for (let key in base) {
    new_obj[key] = base[key]
  }
  for (let key in obj) {
    new_obj[key] = obj[key]
  }
  return new_obj
}

export function mergeObjects(objects, base = {}) {
  return objects.reduce(
    (current, arg) => { return merge(current, arg) },
    base
  )
}

export function objectArgument({ args } = {}) {
  let objects = toObjects(args)
  let _args = toNonObjects(args)
  
  args = mergeObjects(objects)

  return clone(merge(args, { args, _args }))
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
