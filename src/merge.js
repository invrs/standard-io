export default function merge(base, obj = {}, ignore = []) {
  let new_obj = {}
  for (let key in base) {
    new_obj[key] = base[key]
  }
  for (let key in obj) {
    new_obj[key] = obj[key]
  }
  ignore.forEach(key => delete new_obj[key])
  return new_obj
}
