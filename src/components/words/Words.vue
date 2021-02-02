<template>
  <div>
    <Word
      v-for="(word, index) in words"
      :key="index"
      :word="word"
      :active="currentWordIndex === index"
      :correct="
        /**
         * If the user is currently typing this word, it is correct so long as the word starts with what they've typed.
         * Otherwise we compare against the whole word they typed (if there isn't one yet then it is undefined)
         */
        (currentWordIndex === index &&
          word.startsWith(userInputHistory[index])) ||
          (userInputHistory[index]
            ? userInputHistory[index] === word
            : undefined)
      "
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import Word from "./Word.vue";

export default defineComponent({
  components: { Word },
  props: {
    words: {
      // Prop typing https://stackoverflow.com/questions/64831745/props-typing-in-vue-js-3-with-typescript
      type: Array as PropType<string[]>,
      required: true
    },
    currentWordIndex: {
      type: Number,
      required: true
    },
    // An array of words that the user has typed!
    userInputHistory: {
      type: Array as PropType<string[]>,
      required: false,
      default: []
    }
  }
});
</script>
