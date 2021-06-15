export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

type QuestionBase = {
  readonly id: string;
  title: string;
  description: string;
};

export type TextQuestion = QuestionBase & {
  type: "short-answer" | "long-answer";
};

export type MultipleChoiceQuestion = QuestionBase & {
  type: "multiple-choice";
  choices: Set<string>; // TODO: Multiple choice data structure
};

export type Question = MultipleChoiceQuestion | TextQuestion;
