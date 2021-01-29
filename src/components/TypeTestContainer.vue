<template>
  <div>
    <button @click="getMoreWords(100)">more words!</button>
    <words-display
      :words="words"
      :currentWordIndex="currentWordIndex"
      :userResponses="userResponseMap"
    />
    <input v-model="userInput" @update:modelValue="onUserInput" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import randomWords from "random-words";
import WordsDisplay from "./WordsDisplay.vue";
import { UserResponseMap } from "./types";

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
    const userInput = ref<string>("");
    const userResponseMap = ref<UserResponseMap>({});

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

    /**
     * A function that determines whether or not what the user has typed is correct or not,
     * and moves onto the next word.
     */
    const onUserInput = () => {
      const input = userInput.value.toLowerCase();

      // Haven't typed anything? Abort
      if (!input.length) return;
      // If they type a space from the get go (e.g. they double tap the spacebar)
      // we should prevent that from skipping the current word
      if (input === " ") {
        userInput.value = "";
        return;
      }

      // Get last character typed
      const lastChar = input[input.length - 1];
      // if it's a space, move onto the next word and reset user input
      if (lastChar === " ") {
        const currentWord = words.value[currentWordIndex.value];

        // store the users answers
        userResponseMap.value[currentWordIndex.value] = {
          correct: input.trim() === currentWord,
          input: input.trim()
        };
        // go to the next word
        currentWordIndex.value += 1;
        // reset the input
        userInput.value = "";
      }
    };

    return {
      words,
      currentWordIndex,
      getMoreWords,
      userInput,
      onUserInput,
      userResponseMap
    };
  }
});
</script>
