import { nanoid } from "nanoid";
import dynamic from "next/dynamic";
import React, { Fragment } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import type { Question } from "../../types/Form";
import { Button, Text } from "../atomic";
import FormQuestionSchemaEditor from "./FormQuestionSchemaEditor";
import { reindexItemInList } from "./utils";

const NoSSRComponent = (props: any) => (
  <React.Fragment>{props.children}</React.Fragment>
);

const NoSSR = dynamic(() => Promise.resolve(NoSSRComponent), {
  ssr: false,
});

// Components

interface FormSchemaEditorProps {
  questions: Question[];
  onChange: (questions: Question[]) => void;
}
const FormSchemaEditor: React.FC<FormSchemaEditorProps> = ({
  questions,
  onChange = () => {},
}) => {
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

    onChange(reindexItemInList(questions, source.index, destination.index));
  };

  return (
    <Fragment>
      {questions.length == 0 && (
        <Text error>There must be at least one question</Text>
      )}
      <NoSSR>
        <DragDropContext onDragEnd={_onDragEnd}>
          <Droppable droppableId="allQuestions" type="questions">
            {(provided, _) => {
              return (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {questions.map((question, index) => (
                    <Fragment key={question.id}>
                      <FormQuestionSchemaEditor
                        question={question}
                        index={index}
                        onChange={(newQuestion) => {
                          const newQuestions = questions.map((question) => {
                            if (question.id === newQuestion.id)
                              return newQuestion;
                            else return question;
                          });
                          onChange(newQuestions);
                        }}
                        onDelete={() => {
                          onChange(
                            questions.filter((s) => s.id != question.id)
                          );
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
        <div className="h-4"></div>
        <Button
          size="small"
          className="mx-auto"
          onClick={() => {
            onChange([
              ...questions,
              {
                id: nanoid(),
                title: "New question",
                description: "",
                type: "short-answer",
              },
            ]);
          }}
        >
          Add Question
        </Button>
      </NoSSR>
    </Fragment>
  );
};

export default FormSchemaEditor;
