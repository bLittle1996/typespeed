import { getRandomWords } from "@/utils/words";

describe("utils/words.ts", () => {
  describe("getRandomWords", () => {
    it("returns an array of the specificied length", () => {
      const lengths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 100, 1000, 10000];

      lengths.forEach((length) => {
        expect(getRandomWords(length)).toHaveLength(length);
      });
    });

    it("returns an empty array when requesting zero words", () => {
      expect(getRandomWords(0)).toHaveLength(0);
    });

    it("returns an array of strings", () => {
      const lengths = [1, 5, 10, 20, 40, 80, 160, 320, 640, 1280, 2560];

      lengths.forEach((length) => {
        const words = getRandomWords(length);
        expect(words.every((word) => typeof word === "string")).toBe(true);
      });
    });
  });
});
