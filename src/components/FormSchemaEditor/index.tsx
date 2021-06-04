import { nanoid } from "nanoid";
import dynamic from "next/dynamic";
import React, { Fragment } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { Button } from "../atomic";
import FormQuestionSchemaEditor from "./FormQuestionSchemaEditor";
import { getUpdateFunction, reindexItemInList } from "./utils";

const NoSSRComponent = (props: any) => (
  <React.Fragment>{props.children}</React.Fragment>
);

const NoSSR = dynamic(() => Promise.resolve(NoSSRComponent), {
  ssr: false,
});

// Types

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

type QuestionBase = {
  readonly id: string;
  title: string;
  description: string;
  type: string;
};
type TextQuestion = QuestionBase & {
  type: "short-answer" | "long-answer";
};
type MultipleChoiceQuestion = QuestionBase & {
  type: "multiple-choice";
  choices: Set<string>; // TODO: Multiple choice data structure
};

export type Question = MultipleChoiceQuestion | TextQuestion;

export type Form = {
  questions: Question[];
};

// Components

interface FormEditorProps {
  form: Form;
  onChange: (form: Form) => void;
}
const FormEditor: React.FC<FormEditorProps> = ({
  form,
  onChange = () => {},
}) => {
  const updateForm = getUpdateFunction(form);

  const _onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      // Dropped outside the list.
      return;
    }

    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      // Something is wrong.
      return;
    }

    onChange(
      updateForm((oldForm) => {
        const newQuestions = reindexItemInList(
          oldForm.questions,
          source.index,
          destination.index
        );
        return {
          questions: newQuestions,
        };
      })
    );
  };

  return (
    <NoSSR>
      <div className="w-full flex flex-col">
        <DragDropContext onDragEnd={_onDragEnd}>
          <Droppable droppableId="allQuestions" type="questions">
            {(provided, _) => {
              return (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {form.questions.map((question, index) => (
                    <Fragment key={question.id}>
                      <FormQuestionSchemaEditor
                        question={question}
                        index={index}
                        onChange={(newQuestion) => {
                          const newQuestions = form.questions.map(
                            (question) => {
                              if (question.id === newQuestion.id)
                                return newQuestion;
                              else return question;
                            }
                          );
                          onChange(updateForm({ questions: newQuestions }));
                        }}
                        onDelete={() => {
                          onChange({
                            ...form,
                            questions: form.questions.filter(
                              (s) => s.id != question.id
                            ),
                          });
                        }}
                      />
                    </Fragment>
                  ))}
                  {provided.placeholder}
                </div>
              );
            }}
          </Droppable>
        </DragDropContext>
        <div className="h-8"></div>
        <Button
          size="small"
          className="mx-auto"
          onClick={() => {
            onChange(
              updateForm((previousForm) => {
                return {
                  questions: [
                    ...previousForm.questions,
                    {
                      id: nanoid(),
                      title: "New question",
                      description: "",
                      type: "short-answer",
                    },
                  ],
                };
              })
            );
          }}
        >
          Add Question
        </Button>
      </div>
    </NoSSR>
  );
};

export default FormEditor;
