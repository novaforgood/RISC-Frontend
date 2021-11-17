import classNames from "classnames";
import { Fragment, useCallback } from "react";
import type { Question, TextQuestion } from "../types/Form";
import { Card, Input, Text, TextArea } from "./atomic";

type TextAskerProps = TextQuestion & {
  initResponse: string;
  readonly: boolean;
  showDescriptions: boolean;
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
  showDescriptions?: boolean;
  className?: string;
};

export enum QuestionTypes {
  shortText = "short-answer",
  longText = "long-answer",
}

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
 * @summary Short text asker.
 */
const ShortTextAsker = ({
  id,
  title,
  description,
  type,
  initResponse,
  readonly,
  showDescriptions,
  onChange,
}: TextAskerProps) => {
  if (readonly) {
    return (
      <div>
        <Text b>{title}</Text>
        <div className="h-1" />
        {showDescriptions && description && (
          <Fragment>
            <Text className="text-secondary">{description}</Text>
            <div className="h-2" />
          </Fragment>
        )}
        <div>{initResponse}</div>
      </div>
    );
  }
  return (
    <div>
      <Text b>{title}</Text>
      <div className="h-1" />
      {showDescriptions && description && (
        <Fragment>
          <Text className="text-secondary">{description}</Text>
          <div className="h-2" />
        </Fragment>
      )}
      <Input
        className="w-full"
        placeholder={type === "short-answer" ? "Short text" : "Long text"}
        readOnly={readonly}
        disabled={readonly}
        value={initResponse}
        onChange={(e) => {
          onChange(id, e.target.value);
        }}
      ></Input>
    </div>
  );
};

/**
 * @summary Long text asker.
 */
const LongTextAsker = ({
  id,
  title,
  description,
  type,
  initResponse,
  readonly,
  showDescriptions,
  onChange,
}: TextAskerProps) => {
  const styles = classNames({
    "w-full": true,
    "bg-white resize-none": readonly,
  });

  if (readonly) {
    return (
      <div>
        <Text b>{title}</Text>
        <div className="h-1" />
        {showDescriptions && description && (
          <Fragment>
            <Text className="text-secondary">{description}</Text>
            <div className="h-2" />
          </Fragment>
        )}
        <div>{initResponse}</div>
      </div>
    );
  }
  return (
    <div>
      <Text b>{title}</Text>
      <div className="h-1" />
      {showDescriptions && description && (
        <Fragment>
          <Text className="text-secondary">{description}</Text>
          <div className="h-2" />
        </Fragment>
      )}
      <TextArea
        className={styles}
        placeholder={type === "short-answer" ? "Short text" : "Long text"}
        readOnly={readonly}
        disabled={readonly}
        maxRows={undefined}
        value={initResponse}
        onChange={(e: any) => {
          const target = e.target as HTMLTextAreaElement;
          onChange(id, target.value);
        }}
      ></TextArea>
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
  // onAutosave = () => {},
  // autosaveInterval = 3000,
  readonly = false,
  showDescriptions = true,
  className,
}: FormProps) => {
  // const debouncedAutosave = _.debounce(() => {
  //   onAutosave(responses);
  // }, autosaveInterval);

  //TODO
  const handleChange = useCallback(
    (id: string, answer: string): void => {
      onChange({
        ...responses,
        [id]: answer,
      });
      // debouncedAutosave();
    },
    [responses, onChange]
  );

  return questions.length > 0 ? (
    readonly ? (
      <Card className="p-2 md:p-6">
        <div className="space-y-6">
          {questions.map((question, i) => {
            switch (question.type) {
              case "short-answer":
                return (
                  <ShortTextAsker
                    {...question}
                    initResponse={responses[`${question.id}`] || ""}
                    readonly={readonly}
                    showDescriptions={showDescriptions}
                    onChange={handleChange}
                    key={i}
                  ></ShortTextAsker>
                );
              case "long-answer":
                return (
                  <LongTextAsker
                    {...question}
                    initResponse={responses[`${question.id}`] || ""}
                    readonly={readonly}
                    showDescriptions={showDescriptions}
                    onChange={handleChange}
                    key={i}
                  ></LongTextAsker>
                );
              case "multiple-choice":
                return;
            }
          })}
        </div>
      </Card>
    ) : (
      <Card className={"p-2 md:p-6 border-inactive rounded-xl " + className}>
        <div className="space-y-6">
          {questions.map((question, i) => {
            switch (question.type) {
              case "short-answer":
                return (
                  <ShortTextAsker
                    {...question}
                    initResponse={responses[`${question.id}`] || ""}
                    readonly={readonly}
                    showDescriptions={showDescriptions}
                    onChange={handleChange}
                    key={i}
                  ></ShortTextAsker>
                );
              case "long-answer":
                return (
                  <LongTextAsker
                    {...question}
                    initResponse={responses[`${question.id}`] || ""}
                    readonly={readonly}
                    showDescriptions={showDescriptions}
                    onChange={handleChange}
                    key={i}
                  ></LongTextAsker>
                );
              case "multiple-choice":
                return;
            }
          })}
        </div>
      </Card>
    )
  ) : (
    <Card className="p-2 md:p-6">
      <div className="space-y-6">
        This program does not currently have their application set up. If you
        know the administrator personally, contact them to let them know!
      </div>
    </Card>
  );
};

export default Form;
