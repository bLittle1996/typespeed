<template>
  <div>
    <span
      v-for="(word, index) in words"
      class="word"
      :class="{ current: index === currentWordIndex }"
      :key="index"
      >{{ word }}</span
    >
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, toRefs } from "vue";
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
    getMoreWords: {
      type: Function as PropType<() => void>,
      default: () => {
        /* This comment exists to prevent a tslint issue. */
      }
    }
  },
  setup(props) {
    const { words, getMoreWords, currentWordIndex } = toRefs(props);
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
}
.word.current {
  color: red;
}
</style>
