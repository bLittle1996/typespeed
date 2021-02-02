<template>
  <span
    class="word"
    :class="{
      active: active,
      correct: correct === true,
      incorrect: correct === false
    }"
    >{{ word }}</span
  >
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
export default defineComponent({
  props: {
    word: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      required: false,
      default: false
    },
    correct: {
      // Prop typing https://stackoverflow.com/questions/64831745/props-typing-in-vue-js-3-with-typescript
      // the `undefined` value means we don't know if it is correct or incorrect yet.
      type: Boolean as PropType<boolean | undefined>,
      required: false,
      default: undefined
    }
  }
});
</script>

<style lang="scss" scoped>
.word {
  display: inline-block;
  font-size: 1.125rem;
  padding: 0.125rem 0.25rem;

  &.active {
    background: lightgrey;
  }

  &.correct:not(.active) {
    color: green;
  }

  &.incorrect {
    color: red;
  }
}
</style>
