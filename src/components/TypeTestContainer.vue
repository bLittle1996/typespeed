<template>
  <div>
    <Words
      :words="wordsToType"
      :currentWordIndex="currentWordIndex"
      :userInputHistory="typedWords"
    />
    <input
      v-model.trim="userInput"
      @keypress.space.prevent="handleSpaceKeypress"
    />
    <span>{{ `${remainingTime / 1000}`.split(".")[0] }}</span>
  </div>
</template>

<script lang="ts">
import { useTimer } from "@/utils/useTimer";
import { getRandomWords } from "@/utils/words";
import { computed, defineComponent, ref, watch } from "vue";
import Words from "./words/Words.vue";

/**
 * This component is responsible for managing the state of the typing test.
 */
export default defineComponent({
  components: { Words },
  setup() {
    const wordsToType = ref<string[]>(getRandomWords(100)); // words the user ought to type
    const typedWords = ref<string[]>([]); // words the user has typed (mistakes and all)
    const currentWordIndex = ref<number>(0); // the current word being typed
    const userInput = ref<string>("");
    const lowerCaseInput = computed<string>(() =>
      userInput.value.toLowerCase()
    );
    const isTestRunning = ref<boolean>(false);
    const timer = useTimer(6000);

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

    // Store the users typed words in an array mirroring the wordsToType
    watch(
      [lowerCaseInput, currentWordIndex],
      ([typedString, wordIndex], [, oldWordIndex]) => {
        // if the input got reset from moving onto the next word, we shouldn't do anything
        if (!typedString && wordIndex !== oldWordIndex) return;
        // So while initially compiling, TypeScript thinks our values are Ref<unknown>
        // We'll add a type guard to convince TypeScript that thy are the correct types
        if (typeof wordIndex === "number" && typeof typedString === "string") {
          typedWords.value[wordIndex] = typedString;
        }
      }
    );

    // If the user types something, then we will want to start the test (if it is not already started)
    // In a similar vein, if the remaining time reaches zero, we ought to stop the test
    watch([userInput, timer.remainingTime], () => {
      if (!isTestRunning.value) {
        console.log("Test running");
        isTestRunning.value = true;
      } else if (timer.remainingTime.value <= 0) {
        console.log("Test stopping, time elapsed.");
        isTestRunning.value = false;
      }
    });

    // when the test starts and stops, manage the timer effectively.
    watch([isTestRunning], () => {
      if (isTestRunning.value) {
        console.log("Starting timer.");
        timer.startTimer();
      } else {
        console.log("Pausing timer.");
        timer.pauseTimer();
      }
    });

    return {
      wordsToType,
      currentWordIndex,
      userInput,
      typedWords,
      handleSpaceKeypress,
      remainingTime: timer.remainingTime
    };
  }
});
</script>
