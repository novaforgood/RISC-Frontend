import { HTMLAttributes } from "react";
import { Card } from "./atomic";
import TitledInput from "./TitledInput";

/**
 * @summary Typedefs for the Form.
 * BACKLOG: Where should we store these types?
 */
export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export type QuestionBase = {
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

// Eventually, `form` likely shouldn't be optional
type FormProps = HTMLAttributes<HTMLDivElement> & {
  form?: Question[];
};

const fetchStoredAnswer = (id: string): string => {
  // TODO: Grab previously saved answer from question, if any
  return "Type your answer here"; // Filler text to remove
};

// TODO
const MultipleChoiceAsker = ({ ...props }: MultipleChoiceQuestion) => {
  return <></>;
};

/**
 * @summary Short text and Long Text Asker.
 * Right now, there is no difference except placeholder. Do we want long answer to have multiline input functionality?
 */
const TextAsker = ({ id, title, type }: TextQuestion) => {
  return (
    <TitledInput
      title={title}
      placeholder={type == "short-answer" ? "Short text" : "Long text"} // Want this branching to be in the Form switch statement, but couldn't get types to work in args of this function
      value={fetchStoredAnswer(id)}
    ></TitledInput>
  );
};

/**
 * @summary Renders Form from question[]
 */
const Form = ({ form = [], ...props }: FormProps) => {
  return (
    <Card {...props}>
      {form.map((question) => {
        switch (question.type) {
          case "short-answer":
          case "long-answer":
            return <TextAsker {...question}></TextAsker>;
          case "multiple-choice":
            return <MultipleChoiceAsker {...question}></MultipleChoiceAsker>;
        }
      })}
    </Card>
  );
};

export default Form;
