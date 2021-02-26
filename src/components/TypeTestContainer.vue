<template>
  <div>
    <Words
      :words="wordsToType"
      :currentWordIndex="currentWordIndex"
      :userInputHistory="typedWords"
    />
    <input
      @keydown="startTest"
      v-model.trim="userInput"
      @keypress.space.prevent="handleSpaceKeypress"
      :disabled="testState.value === 'postTest'"
    />
    <br />
    <span>{{ `${remainingTime / 1000}`.split(".")[0] }}</span>
    <br />
    <span>{{ testState.value }}</span>
  </div>
</template>

<script lang="ts">
import { useTimer } from "@/utils/useTimer";
import { getRandomWords } from "@/utils/words";
import { useMachine } from "@xstate/vue";
import { computed, defineComponent, ref, watch } from "vue";
import { Machine } from "xstate";
import Words from "./words/Words.vue";

const localStorageKey = "results";
const START_TEST = "start";
const END_TEST = "end";
/**
 * A simple state machine to keep track of which state our test should currently be in.
 *
 * idle: The test is ready to be run.
 * test: The test is currently running
 * postTest: The test has finished and results should be displayed (no other inputs are allowed at this time). It will automatically return to idle after a few seconds.
 */
const typeTestMachine = Machine({
  id: "typetest",
  initial: "idle",
  states: {
    idle: {
      on: {
        [START_TEST]: "test"
      }
    },
    test: {
      entry: "startTimer",
      exit: "cleanUp",
      on: {
        [END_TEST]: "postTest"
      }
    },
    postTest: {
      entry: "saveResults",
      after: {
        5000: "idle"
      }
    }
  }
});

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
    const testTimer = useTimer(15000); // the timer to be used during the test
    const { state, send } = useMachine(typeTestMachine, {
      actions: {
        startTimer: () => {
          testTimer.resetTimer();
          testTimer.startTimer();
        },
        /* Fires when exiting the test state */
        cleanUp: () => {
          userInput.value = "";
        },
        /**
         * Store the user results somewhere
         */
        saveResults: () => {}
      }
    });

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

    watch([testTimer.isComplete], ([isComplete]) => {
      if (isComplete) {
        send(END_TEST);
      }
    });

    return {
      wordsToType,
      currentWordIndex,
      userInput,
      typedWords,
      handleSpaceKeypress,
      remainingTime: testTimer.remainingTime,
      testState: state,
      startTest: () => {
        if (state.value.value === "idle") {
          send(START_TEST);
        }
      }
    };
  }
});
</script>
