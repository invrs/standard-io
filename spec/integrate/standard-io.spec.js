import { mergeObjects, standardIO, toNonObjects, toObjects } from "../../"

describe("StandardIO", () => {

  describe("standardIO", () => {
    it("merges object parameters", () => {
      expect(standardIO({ a: 1 }, { b: 2 })).toEqual({
        a: 1, b: 2, args: { a: 1, b: 2 }, _args: []
      })
    })

    it("adds non-object parameters to _args", () => {
      expect(standardIO(1, { a: 1 }, 2, { b: 2 }, 3)).toEqual({
        a: 1, b: 2, args: { a: 1, b: 2 }, _args: [ 1, 2, 3 ]
      })
    })
  })
})
