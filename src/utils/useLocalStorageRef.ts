import { Ref, ref, UnwrapRef, watch } from "vue";
import { isDefined, isString } from "./guards";

/**
 * Writes to local storage in a predictable, parsabled format for later retrieval.
 * @param key
 * @param value
 */
const setItem = (key: string, value: any): void => {
  localStorage.setItem(key, JSON.stringify({ data: value }));
};

/**
 * Fetches the value of the key, assuming it is in the structure provided by `setItem`
 * @param key
 */
const getItem = (key: string) => {
  const localStorageValue = localStorage.getItem(key);

  if (isString(localStorageValue)) {
    try {
      return JSON.parse(localStorageValue).data;
    } catch {
      return undefined;
    }
  }

  return undefined;
};

export const useLocalStorageRef = <T>(
  key: string,
  fallbackValue?: T
): Ref<UnwrapRef<T> | undefined> => {
  // Try to initialize with the value in storage, otherwise use the initial value.
  const value = ref<T | undefined>(getItem(key) ?? fallbackValue);

  /**
   * Whenever _any_ property of the value changes, we ought to reflect that in local storage!
   */
  watch(
    value,
    () => {
      setItem(key, value);
    },
    { deep: true }
  );

  return value;
};
