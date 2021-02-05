import { DeepReadonly, readonly, ref, Ref, watch } from "vue";

export interface Timer {
  /**
   * The time remaining on the timer.
   */
  remainingTime: DeepReadonly<Ref<number>>;
  /**
   * The duration of the timer.
   */
  duration: DeepReadonly<Ref<number>>;
  /**
   * Whether or not the timer is ticking down.
   */
  isRunning: DeepReadonly<Ref<boolean>>;
  /**
   * Whether or not the timer has completed.
   */
  isComplete: DeepReadonly<Ref<boolean>>;
  /**
   * Starts the timer. If the timer is at zero, it will restart the timer.
   */
  startTimer: () => void;
  /**
   * Pauses the timer.
   */
  pauseTimer: () => void;
  /**
   * Updates the duration of the timer. If the timer is currently running, note that this will not change the remaining time reported.
   */
  setDuration: (duration: number) => void;
  /**
   * Stops the timer and sets the remaining time to be equal to the duration.
   */
  resetTimer: () => void;
}

export const useTimer = (durationInMs: number): Timer => {
  const duration = ref<number>(durationInMs);
  const isRunning = ref<boolean>(false);
  const remainingTime = ref<number>(duration.value);
  const isComplete = ref<boolean>(false);

  const resetTimer = () => {
    remainingTime.value = duration.value;
    isRunning.value = false;
    isComplete.value = false;
  };

  const startTimer = () => {
    if (isComplete.value) {
      resetTimer();
    }

    isRunning.value = true;
  };

  const pauseTimer = () => {
    isRunning.value = false;
  };

  const setDuration = (durationInMs: number) => {
    duration.value = durationInMs;
  };

  watch([isRunning], () => {
    if (!isRunning.value) return;
    let lastTimestamp = performance.now();
    const tick = (timestamp) => {
      const deltaTime = timestamp - lastTimestamp;
      // Update the last timestamp so delta time works correctly between ticks.
      lastTimestamp = timestamp;
      // if we haven't paused between ticks, modify the remaining time.
      if (isRunning.value) {
        remainingTime.value = Math.max(0, remainingTime.value - deltaTime);
      }

      if (isRunning.value && remainingTime.value > 0) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  });

  return {
    duration: readonly(duration),
    remainingTime: readonly(remainingTime),
    isRunning: readonly(isRunning),
    isComplete: readonly(isComplete),
    startTimer,
    pauseTimer,
    resetTimer,
    setDuration,
  };
};
