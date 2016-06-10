import { objectArgument, returnObject } from "../../"

describe("StandardIO", () => {

  describe("objectArgument", () => {
    it("accepts nothing", () => {
      expect(objectArgument()).toEqual({ args: {}, _args: [] })
    })

    it("merges object parameters", () => {
      let args = [ { a: 1 }, { b: 2 } ]
      expect(objectArgument({ args })).toEqual({
        a: 1, b: 2,
        args: { a: 1, b: 2 },
        _args: []
      })
    })

    it("ignores args keys", () => {
      let args = [ { a: 1 }, { b: 2 } ]
      let ignore = [ "a" ]
      expect(objectArgument({ args, ignore })).toEqual({
        a: 1, b: 2,
        args: { b: 2 },
        _args: []
      })
    })

    it("adds non-object parameters to _args", () => {
      expect(objectArgument({ args: [ 1, { a: 1 }, 2, { b: 2 }, 3 ] })).toEqual({
        a: 1, b: 2,
        args: { a: 1, b: 2 }, _args: [ 1, 2, 3 ]
      })
    })
  })

  describe("returnObject", () => {
    it("accepts nothing", () => {
      let output = returnObject()
      expect(output.catch).toEqual(jasmine.any(Function))
      expect(output.then).toEqual(jasmine.any(Function))
      expect(output.value).toEqual({})
    })

    it("accepts a promise value", (done) => {
      let promise = new Promise(resolve => resolve("test"))
      let output = returnObject({ value: promise })
      expect(output.value).toEqual(promise)
      output.then(value => {
        expect(value).toEqual("test")
        done()
      })
    })

    it("accepts a rejected promise value", (done) => {
      let promise = new Promise(() => { throw "rejected" })
      let output = returnObject({ value: promise })
      expect(output.value).toEqual(promise)
      output.catch(value => {
        expect(value).toEqual("rejected")
        done()
      })
    })

    it("accepts a non-promise value", () => {
      let output = returnObject({ value: true })
      expect(output.catch).toEqual(jasmine.any(Function))
      expect(output.then).toEqual(jasmine.any(Function))
      expect(output.value).toEqual(true)
      output.then((value) => expect(value).toEqual(true))
    })

    it("accepts an object", () => {
      let value = { a: 1, b: 2 }
      let output = returnObject({ value })
      expect(output.value).toEqual(value)
      expect(output.a).toBe(1)
      expect(output.b).toBe(2)
      expect(output.catch).toEqual(jasmine.any(Function))
      expect(output.then).toEqual(jasmine.any(Function))
      output.then((v) => expect(v).toEqual(value))
    })

    it("accepts an array of objects", () => {
      let value = { a: 1, b: 2 }
      let value1 = { a: 1 }
      let value2 = { b: 2 }
      let output = returnObject({ value: [ value1, value2 ] })
      expect(output.value).toEqual(value)
      expect(output.a).toBe(1)
      expect(output.b).toBe(2)
      expect(output.catch).toEqual(jasmine.any(Function))
      expect(output.then).toEqual(jasmine.any(Function))
      output.then((v) => expect(v).toEqual(value))
    })

    it("accepts an array of non-objects", () => {
      let value = [ { a: 1 }, true ]
      let value1 = { a: 1 }
      let value2 = true
      let output = returnObject({ value: [ value1, value2 ] })
      expect(output.catch).toEqual(jasmine.any(Function))
      expect(output.then).toEqual(jasmine.any(Function))
      expect(output.value).toEqual(value)
      output.then((v) => expect(v).toEqual(value))
    })

    it("accepts no value with promise", () => {
      let promise = new Promise(() => { return "test" })
      let output = returnObject({ promise })
      expect(output.catch).toEqual(jasmine.any(Function))
      expect(output.then).toEqual(jasmine.any(Function))
      expect(output.value).toEqual({})
      output.then((value) => expect(value).toEqual("test"))
    })

    it("accepts nothing", () => {
      let output = returnObject()
      expect(output.catch).toEqual(jasmine.any(Function))
      expect(output.then).toEqual(jasmine.any(Function))
      expect(output.value).toEqual({})
      output.then((value) => expect(value).toEqual({}))
    })
  })
})
