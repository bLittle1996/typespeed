export const isDefined = <T>(thing: T): thing is Exclude<T, undefined> => {
  return typeof thing !== "undefined";
};

export const isString = (thing: unknown): thing is string => {
  return typeof thing === "string";
};
