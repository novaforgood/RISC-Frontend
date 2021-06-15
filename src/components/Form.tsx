import { useState } from "react";
import { Card } from "./atomic";
import TitledInput from "./TitledInput";
import _ from "lodash"; // Is this right?

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

type FormProps = {
  questions: Question[];
  responses?: { [key: string]: string };
  onChange?: (responses: Object) => void;
  onAutosave?: (responses: Object) => void; // Takes in answer json and send it to db
  autosaveInterval?: number;
  className?: string;
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
 * @param responses mapped type from question id to previously saved response
 * @param onChange Invoked at every edit on form
 * @param onAutosave Invoked after user edits the form and pauses for `waitTime` milliseconds.
 * @param waitTime Autosave debounce wait time in milliseconds
 */
const Form = ({
  questions,
  responses = {},
  onChange = () => {},
  onAutosave = () => {},
  autosaveInterval = 3000,
  className,
}: FormProps) => {
  const debouncedAutosave = _.debounce(() => {
    onAutosave(responses);
  }, autosaveInterval);

  //TODO
  const handleChange = (id: string, answer: string): void => {
    responses[`${id}`] = answer;
    onChange(responses);
    debouncedAutosave();
  };

  return (
    <Card className={"p-9 border-inactive rounded-xl " + className}>
      <div className="space-y-6">
        {questions.map((question, i) => {
          switch (question.type) {
            case "short-answer":
            case "long-answer":
              return (
                <TextAsker
                  {...question}
                  initResponse={responses[`${question.id}`] || ""}
                  onChange={handleChange}
                  key={i}
                ></TextAsker>
              );
            case "multiple-choice":
              return;
          }
        })}
      </div>
    </Card>
  );
};

export default Form;
