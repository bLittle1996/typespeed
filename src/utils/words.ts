import randomWords from "random-words";

/**
 * A helper function to help us get new words. Since we are not using the `join` parameter, we know we will receive a string[] back.
 */
export const getRandomWords = (numberOfWords: number) =>
  randomWords({
    exactly: numberOfWords,
    wordsPerString: 1,
  }) as string[];
