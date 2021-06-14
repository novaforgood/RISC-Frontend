import { HTMLAttributes, useState } from "react";
import { Card } from "./atomic";
import TitledInput from "./TitledInput";
const _ = require("lodash"); // Is this right?

// TYPES
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

type TextAskerProps = TextQuestion & {
  initResponse: string;
  onChange: (id: string, answer: string) => void;
};

type FormProps = HTMLAttributes<HTMLDivElement> & {
  questions: Question[];
  initResponses: { [key: string]: string };
  onSubmit: (responses: Object) => void; // Takes in answer json and send it to db
  id?: string; // id for the form HTML element to allow linking of external buttons
};

/**
 * @summary Short text and Long Text Asker.
 * Right now, there is no difference except placeholder. Do we want long answer to have multiline input functionality?
 */
const TextAsker = ({
  id,
  title,
  type,
  initResponse,
  onChange,
}: TextAskerProps) => {
  const [answer, setAnswer] = useState(initResponse); // Replace with responses

  return (
    <TitledInput
      title={title}
      placeholder={type == "short-answer" ? "Short text" : "Long text"} // Want this branching to be in the Form switch statement, but couldn't get types to work in args of this function
      value={answer}
      onChange={(e) => {
        setAnswer(e.target.value);
        onChange(id, e.target.value);
      }}
    ></TitledInput>
  );
};

/**
 * @summary Renders Form from question[]
 * @param questions questions to render into components
 * @param initResponses mapped type from question id to previously saved response
 * @param onChange Function that takes in responses json and pushes it to the db
 * @param id The id that will be given to the form HTML element. This allows linking external submit buttons.
 */
const Form = ({
  questions,
  initResponses = {},
  onSubmit,
  id,
  ...props
}: FormProps) => {
  var responses: { [key: string]: string } = initResponses;

  const debouncedOnSubmit = _.debounce(() => {
    onSubmit(responses);
  }, 3000);

  //TODO
  const onChange = (id: string, answer: string): void => {
    responses[`${id}`] = answer;
    debouncedOnSubmit();
  };

  return (
    <Card {...props}>
      <form
        id={id}
        onSubmit={() => onSubmit(responses)} /*do we need an action?*/
      >
        {questions.map((q, i) => {
          switch (q.type) {
            case "short-answer":
            case "long-answer":
              return (
                <TextAsker
                  {...q}
                  initResponse={initResponses[`${q.id}`] || ""}
                  onChange={onChange}
                  key={i}
                ></TextAsker>
              );
            case "multiple-choice":
              return;
          }
        })}
      </form>
    </Card>
  );
};

export default Form;
