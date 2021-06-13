import { ChangeEvent, HTMLAttributes, useState } from "react";
import { Button, Card } from "./atomic";
import TitledInput from "./TitledInput";
var _ = require("lodash"); // Is this right?

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
  form: Question[];
};

// TODO: Grab previously saved answer from question, if any
const fetchAnswer = (id: string): string => {
  return ""; // Filler text to remove
};

// TODO: Push answer to db
const pushAnswer = (id: string, answer): void => {
  console.log("Change Reg at id: ", id, " with answer ", answer);
};

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
const TextAsker = ({ id, title, type }: TextQuestion) => {
  const [answer, setAnswer] = useState(fetchAnswer(id));

  var throttledPush = _.throttle(() => {
    pushAnswer(id, answer);
  }, 3000);

  var debouncedPush = _.debounce(throttledPush, 3000);

  const handleAnswerChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setAnswer(e.target.value);
    console.log("Naive log at id: ", id, " with answer ", answer);
    debouncedPush();
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
 */
const Form = ({ form = [], ...props }: FormProps) => {
  // I'm not a real fan of a var having the same name as an HTML elem, but I think it's ok

  //TODO
  const handleFormSubmit = () => {
    // This should probably be a function that iterates through all the Askers and tells each of them
    // to push their answers.
    console.log("Imagine that a form submitted");
  };

  return (
    <Card {...props}>
      <form onSubmit={handleFormSubmit} /*do we need an action?*/>
        {form.map((question, i) => {
          switch (question.type) {
            case "short-answer":
            case "long-answer":
              return <TextAsker {...question} key={i}></TextAsker>;
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
