import { noop } from "../../../src/utils";

const isFunction = (potentialFunction: unknown) => () => {
  expect(potentialFunction).toBeInstanceOf(Function);
};

describe("utils/index.ts", () => {
  describe("noop", () => {
    /* What an incredible and meaningful test */
    it("is a function", isFunction(noop));
  });
});
