<template>
  <div>
    <pre>{{ wordsToType.join(" ") }}</pre>
    <input
      v-model.trim="userInput"
      @keypress.space.prevent="handleSpaceKeypress"
    />
  </div>
</template>

<script lang="ts">
import { getRandomWords } from "@/utils/words";
import { computed, defineComponent, ref } from "vue";

/**
 * This component is responsible for managing the state of the typing test.
 */
export default defineComponent({
  setup() {
    const wordsToType = ref(getRandomWords(100)); // words the user ought to type
    const typedWords = ref<string[]>([]); // words the user has typed (mistakes and all)
    const currentWordIndex = ref(0); // the current word being typed
    const userInput = ref("");
    const lowerCaseInput = computed(() => userInput.value.toLowerCase());

    /**
     * When the user enters a space, we want to move onto the next word in the list.
     * This function will also insert more words to the list of words to type if necessary.
     *
     * This is utilized with the `.prevent` modifier to prevent other events from firing simultaneously (such as the input event v-model uses)
     */
    const handleSpaceKeypress = () => {
      // If they haven't typed anything yet, don't move onto the next word.
      if (userInput.value === "") return;
      // store user response
      typedWords.value[currentWordIndex.value] = lowerCaseInput.value;
      // increment index, and reset user input
      currentWordIndex.value += 1;
      userInput.value = "";
      // In addition, if we are halfway to the end of the list of words to type
      // we should get some more!
      if (currentWordIndex.value >= wordsToType.value.length / 2) {
        wordsToType.value = [...wordsToType.value, ...getRandomWords(100)];
      }
    };

    return { wordsToType, currentWordIndex, userInput, handleSpaceKeypress };
  }
});
</script>
