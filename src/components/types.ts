export type UserResponse = {
  correct: boolean;
  input: string;
};

export type UserResponseMap = {
  [wordIndex: number]: UserResponse | undefined;
};

export type UserMetrics = {
  charactersTyped: number;
};
