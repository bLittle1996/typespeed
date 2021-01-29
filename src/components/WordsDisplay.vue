<template>
  <div>
    <span
      v-for="(word, index) in words"
      class="word"
      :class="{
        current: index === currentWordIndex,
        correct: userResponses[index] && userResponses[index].correct,
        incorrect: userResponses[index] && !userResponses[index].correct
      }"
      :key="index"
    >
      {{ word }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, toRefs } from "vue";
import { UserResponseMap } from "./types";
export default defineComponent({
  props: {
    words: {
      type: Array as PropType<string[]>,
      required: true
    },
    currentWordIndex: {
      type: Number,
      required: true
    },
    userResponses: {
      type: Object as () => UserResponseMap,
      required: false
    },
    getMoreWords: {
      type: Function as PropType<() => void>,
      default: () => {
        /* This comment exists to prevent a tslint issue. */
      }
    }
  }
});
</script>

<style scoped lang="scss">
.word {
  display: inline-block;
  font-size: 1.15rem;

  &:not(:last-child) {
    margin-right: 1ch;
  }

  &.current {
    background: lightgrey;
    padding: 0.5rem;
  }

  &.correct {
    color: green;
  }

  &.incorrect {
    color: red;
  }
}
</style>
