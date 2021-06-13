import { ChangeEvent, HTMLAttributes, useState } from "react";
import { Button, Card } from "./atomic";
import TitledInput from "./TitledInput";
const _ = require("lodash"); // Is this right?

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

type AnswerType = any; // TODO after 06/12: Should specify answer type

type TextAskerProps = TextQuestion & {
  initResponse: string;
};

type FormProps = HTMLAttributes<HTMLDivElement> & {
  form: Question[];
  initResponses: { [key: string]: string };
  onChange: (id: string, answer: AnswerType) => void;
};

var responses: { [key: string]: string };

// TODO
/**
 * @summary UNFINISHED: Multiple choice Asker
 */
const MultipleChoiceAsker = ({ ...props }: MultipleChoiceQuestion) => {
  return <></>;
};

/**
 * @summary Short text and Long Text Asker.
 * Right now, there is no difference except placeholder. Do we want long answer to have multiline input functionality?
 */
const TextAsker = ({ id, title, type, initResponse }: TextAskerProps) => {
  const [answer, setAnswer] = useState(initResponse); // Replace with responses

  // var throttledPush = _.throttle(() => {
  //   responses[`${id}`] = answer;
  //   console.log("Resp Modif at id: ", id, " with answer ", responses[`${id}`]);
  // }, 3000);

  // var throttledPush = () => {
  //   responses[`${id}`] = answer;
  //   console.log("Resp Modif at id: ", id, " with answer ", responses[`${id}`]);
  // };
  //
  // const debouncedPush = _.debounce(throttledPush, 3000);

  const handleAnswerChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setAnswer(e.target.value);
    console.log("Change at id: ", id, " with answer ", e.target.value); // Testing
    responses[`${id}`] = e.target.value;
    // Tell form to update it (debounced)
  };

  return (
    <TitledInput
      title={title}
      placeholder={type == "short-answer" ? "Short text" : "Long text"} // Want this branching to be in the Form switch statement, but couldn't get types to work in args of this function
      value={answer}
      onChange={handleAnswerChange}
    ></TitledInput>
  );
};

/**
 * @summary Renders Form from question[]
 * @param {Function} onChange
 */
const Form = ({
  form = [],
  initResponses = {},
  onChange,
  ...props
}: FormProps) => {
  responses = initResponses;

  //TODO
  const handleFormSubmit = () => {
    // This should probably be a function that iterates through all the Askers and tells each of them
    // to push their answers.
    console.log("Imagine that a form submitted");
  };

  // const externallyAccessibleFunction = () => {
  //   save all the questions
  // }

  return (
    <Card {...props}>
      <form onSubmit={handleFormSubmit} /*do we need an action?*/>
        {form.map((question, i) => {
          switch (question.type) {
            case "short-answer":
            case "long-answer":
              return (
                <TextAsker
                  {...question}
                  initResponse={initResponses[`${question.id}`] || ""}
                  key={i}
                ></TextAsker>
              );
            case "multiple-choice":
              return (
                <MultipleChoiceAsker
                  {...question}
                  key={i}
                ></MultipleChoiceAsker>
              );
          }
        })}
        <Button>Submit</Button>
      </form>
    </Card>
  );
};

export default Form;
