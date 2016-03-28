import merge from "./merge"

/**
 * Clones (copies) an Object using deep copying.
 *
 * This function supports circular references by default, but if you are certain
 * there are no circular references in your object, you can save some CPU time
 * by calling clone(obj, false).
 *
 * Caution: if `circular` is false and `parent` contains circular references,
 * your program may enter an infinite loop and crash.
 *
 * @param `parent` - the object to be cloned
 * @param `circular` - set to true if the object to be cloned may contain
 *    circular references. (optional - true by default)
 * @param `depth` - set to a number if the object is only to be cloned to
 *    a particular depth. (optional - defaults to Infinity)
*/
function clone(parent, circular, depth) {
  if (typeof circular === 'object') {
    depth = circular.depth
    circular = circular.circular
  }
  
  let allParents = []
  let allChildren = []

  if (typeof circular == 'undefined')
    circular = true

  if (typeof depth == 'undefined')
    depth = Infinity

  function _clone(parent, depth, ancestor) {
    if (parent === null)
      return null

    if (depth === 0)
      return parent

    let child

    if (typeof parent == "function") {
      return parent.bind(ancestor)
    }
    
    if (typeof parent != 'object') {
      return parent
    }

    if (__isArray(parent)) {
      child = []
    } else if (__isRegExp(parent)) {
      child = new RegExp(parent.source, __getRegExpFlags(parent))
      if (parent.lastIndex) child.lastIndex = parent.lastIndex
    } else if (__isDate(parent)) {
      child = new Date(parent.getTime())
      return child
    } else {
      child = merge(parent)
    }

    if (circular) {
      let index = allParents.indexOf(parent)

      if (index != -1) {
        return allChildren[index]
      }
      
      allParents.push(parent)
      allChildren.push(child)
    }

    for (let i in parent) {
      let attrs
      
      if (attrs && attrs.set == null) {
        continue
      }
      
      child[i] = _clone(parent[i], depth - 1, parent)
    }

    return child
  }

  return _clone(parent, depth)
}

function __objToStr(o) {
  return Object.prototype.toString.call(o)
}

function __isDate(o) {
  return typeof o === 'object' && __objToStr(o) === '[object Date]'
}

function __isArray(o) {
  return typeof o === 'object' && __objToStr(o) === '[object Array]'
}

function __isRegExp(o) {
  return typeof o === 'object' && __objToStr(o) === '[object RegExp]'
}

function __getRegExpFlags(re) {
  let flags = ''
  if (re.global) flags += 'g'
  if (re.ignoreCase) flags += 'i'
  if (re.multiline) flags += 'm'
  return flags
}

export default clone
