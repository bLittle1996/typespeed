<template>
  <div>
    <words-display :words="words" :currentWordIndex="currentWordIndex" />
    <button @click="getMoreWords(100)">more words!</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import randomWords from "random-words";
import WordsDisplay from "./WordsDisplay.vue";

/**
 * This component is responsible for managing the state of the typing test.
 */
export default defineComponent({
  components: {
    WordsDisplay
  },
  setup(props, ctx) {
    // The list of words to be displayed to the user.
    const words = ref<string[]>([]);
    // The index of the word that should currently be typed.
    const currentWordIndex = ref<number>(0);
    /**
     * A helper function to help us get new words. Since we are not using the `join` parameter, we know we will receive a string[] back.
     */
    const getWords = (numberOfWords: number) =>
      randomWords({
        exactly: numberOfWords,
        wordsPerString: 1
      }) as string[];

    /**
     * A helper function to append new words to the words array.
     * @param numberOfWords The number of new words to get, defaults to 100.
     */
    const getMoreWords = (numberOfWords = 100) => {
      words.value = [...words.value, ...getWords(numberOfWords)];
    };

    words.value = getWords(100);

    return {
      words,
      currentWordIndex,
      getMoreWords
    };
  }
});
</script>
