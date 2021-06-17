import _ from "lodash";
import { Fragment, useState } from "react";
import type { Question, TextQuestion } from "../types/Form";
import { Card, Input, Text } from "./atomic";

type TextAskerProps = TextQuestion & {
  initResponse: string;
  readonly: boolean;
  onChange: (id: string, answer: string) => void;
};

export type ResponseJson = { [key: string]: string };
type FormProps = {
  questions: Question[];
  responses?: ResponseJson;
  onChange?: (responses: ResponseJson) => void;
  onAutosave?: (responses: ResponseJson) => void; // Takes in answer json and send it to db
  autosaveInterval?: number;
  readonly?: boolean;
  className?: string;
};

// Dummy data
export var dummyForm: Question[] = [
  {
    id: "0ABC",
    title: "Test Question",
    type: "short-answer",
    description: "",
  },
  {
    id: "1ABC",
    title: "Test Question",
    type: "short-answer",
    description: "",
  },
];

/**
 * @summary Short text and Long Text Asker.
 * Right now, there is no difference except placeholder. Do we want long answer to have multiline input functionality?
 */
const TextAsker = ({
  id,
  title,
  description,
  type,
  initResponse,
  readonly,
  onChange,
}: TextAskerProps) => {
  const [answer, setAnswer] = useState(initResponse); // Replace with responses

  return (
    <div>
      <Text b>{title}</Text>
      <div className="h-1" />
      {description && (
        <Fragment>
          <Text className="text-secondary">{description}</Text>
          <div className="h-1" />
        </Fragment>
      )}
      <Input
        className="w-full"
        placeholder={type == "short-answer" ? "Short text" : "Long text"}
        readOnly={readonly}
        value={answer}
        onChange={(e) => {
          setAnswer(e.target.value);
          onChange(id, e.target.value);
        }}
      ></Input>
    </div>
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
  readonly = false,
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
                  readonly={readonly}
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
