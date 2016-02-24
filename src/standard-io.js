import Immutable from "immutable"

export function mergeObjects(objects, base = Immutable.Map()) {
  return objects.reduce(
    (current, arg) => { return current.merge(arg) },
    base
  )
}

export function standardIO(...args) {
  let objects = toObjects(args)
  let _args = toNonObjects(args)
  
  args = mergeObjects(objects)

  return args.merge({ args, _args }).toJS()
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
