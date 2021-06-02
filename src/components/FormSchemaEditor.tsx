import Input from "./atomic/Input";
import Text from "./atomic/Text";
import React, { Fragment } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import _ from "lodash";
import { nanoid } from "nanoid";
import { DraggableLocation, DropResult } from "react-beautiful-dnd";
import { Button, Card } from "./atomic";
import dynamic from "next/dynamic";

const NoSSRComponent = (props: any) => (
  <React.Fragment>{props.children}</React.Fragment>
);

const NoSSR = dynamic(() => Promise.resolve(NoSSRComponent), {
  ssr: false,
});

// Types

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

// interface TextQuestion extends Question {
//   type: "single-line" | "paragraph";
// }
// interface MultipleChoiceQuestion extends Question {
//   type: "multiple-choice";
//   choices: string[]; // TODO: Multiple choice data structure
// }

export interface Question {
  readonly id: string;
  title: string;
  type: string;
}

type Section = {
  readonly id: string;
  title: string;
  questions: Question[];
};

type Form = {
  sections: Section[];
};

// Components

interface FormQuestionSchemaEditorProps {
  question: Question;
  index: number;
  onChange: (question: Question) => void;
  onDelete: () => void;
}
const FormQuestionSchemaEditor: React.FC<FormQuestionSchemaEditorProps> = ({
  question,
  index,
  onChange = () => {},
  onDelete = () => {},
}) => {
  const { id: questionID, title } = question;

  const updateQuestion = (changes: RecursivePartial<Question>) => {
    return { ..._.mergeWith(question, changes, mergeArraysByID) };
  };

  return (
    <Draggable key={questionID} draggableId={questionID} index={index}>
      {(provided, _) => {
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            style={{
              // some basic styles to make the items look a bit nicer
              userSelect: "none",

              // change background colour if dragging
              // background: snapshot.isDragging ? "lightgreen" : "white",

              // styles we need to apply on draggables
              ...provided.draggableProps.style,
            }}
          >
            <div {...provided.dragHandleProps} id={questionID}>
              handle
            </div>

            <div className="flex items-end">
              <div>
                <div>
                  <Input
                    value={title || ""}
                    onChange={(e) => {
                      onChange(updateQuestion({ title: e.target.value }));
                    }}
                  />
                  <div className="w-4" />
                </div>
                <Button
                  size="small"
                  onClick={() => {
                    onDelete();
                  }}
                >
                  Delete
                </Button>

                <div className="h-4" />
              </div>
            </div>
            <div className="h-12" />
          </div>
        );
      }}
    </Draggable>
  );
};

interface FormSectionSchemaEditorProps {
  section: Section;
  index: number;
  onChange: (section: Section) => void;
  onDelete: () => void;
}
const FormSectionSchemaEditor: React.FC<FormSectionSchemaEditorProps> = ({
  section,
  index,
  onChange = () => {},
  onDelete = () => {},
}) => {
  const { id: sectionID, title, questions } = section;

  const updateSection = (changes: RecursivePartial<Section>) => {
    console.log(section);
    console.log(changes);
    return { ..._.mergeWith(section, changes, mergeArraysByID) };
  };

  return (
    <Draggable key={sectionID} draggableId={sectionID} index={index}>
      {(provided, _) => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          <div {...provided.dragHandleProps} id={sectionID}>
            handle
          </div>

          <div className="flex items-center">
            <Input
              value={title || ""}
              onChange={(e) => {
                onChange(updateSection({ title: e.target.value }));
              }}
            />
            <div className="w-4" />
            <Button
              size="small"
              onClick={() => {
                onDelete();
              }}
            >
              Delete
            </Button>
          </div>

          <div className="h-4" />
          <Card>
            <div>
              <Droppable
                droppableId={`section---SEPARATOR---${sectionID}`}
                type={"question"}
              >
                {(provided, _) => {
                  return (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {!questions.length && (
                        <Fragment>
                          <Text>
                            Empty Section. Drag items here or add a question!
                          </Text>
                          <div className="h-4" />
                        </Fragment>
                      )}
                      {questions.map((question, index) => (
                        <Fragment key={question.id}>
                          <FormQuestionSchemaEditor
                            key={question.id}
                            question={question}
                            index={index}
                            onChange={(newQuestion) => {
                              console.log("NEW QUESTION");
                              console.log(newQuestion);

                              onChange(
                                updateSection({ questions: [newQuestion] })
                              );
                            }}
                            onDelete={() => {
                              onChange({
                                ...section,
                                questions: section.questions.filter(
                                  (q) => q.id !== question.id
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
            </div>
            <Button
              onClick={() => {
                onChange(
                  updateSection({
                    questions: [
                      { id: nanoid(), type: "single-line", title: "Question" },
                    ],
                  })
                );
              }}
            >
              + Add Question
            </Button>
          </Card>
          <div className="y-12" />
        </div>
      )}
    </Draggable>
  );
};

interface FormEditorProps {
  form: Form;
  onChange: (form: Form) => void;
}
const FormEditor: React.FC<FormEditorProps> = ({
  form,
  onChange = () => {},
}) => {
  const updateForm = (changes: RecursivePartial<Form>) => {
    return { ..._.mergeWith(form, changes, mergeArraysByID) };
  };

  const _onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      // Dropped outside the list.

      return;
    }

    const { source, destination } = result;
    if (source.droppableId !== destination.droppableId) {
      if (
        source.droppableId !== "allSections" &&
        destination.droppableId !== "allSections"
      ) {
        // Drop question in a different section from which it was dragged.

        const sourceID = source.droppableId.split("---SEPARATOR---")[1];
        const destinationID =
          destination.droppableId.split("---SEPARATOR---")[1];

        const moveResult = moveQuestionBetweenSections(
          form.sections.find((v) => v.id == sourceID)!.questions,
          form.sections.find((v) => v.id == destinationID)!.questions,
          source,
          destination
        );

        const newSections = form.sections.map((section) => {
          if (section.id === sourceID) {
            return {
              ...section,
              questions: moveResult[`section---SEPARATOR---${sourceID}`],
            };
          } else if (section.id === destinationID) {
            return {
              ...section,
              questions: moveResult[`section---SEPARATOR---${destinationID}`],
            };
          } else {
            return section;
          }
        });
        onChange(updateForm({ sections: newSections }));
      }
      return;
    }

    if (result.type === "sections") {
      // Drop section somewhere else.

      onChange(
        updateForm({
          sections: reindexItem(
            form.sections,
            result.source.index,
            result.destination.index
          ),
        })
      );
    } else {
      // Drop question in same section it was dragged.

      const sectionID =
        result.destination.droppableId.split("---SEPARATOR---")[1];

      const newQuestions = reindexItem(
        form.sections.find((v) => v.id == sectionID)!.questions,
        result.source.index,
        result.destination!.index
      );
      onChange(
        updateForm({
          sections: [{ id: sectionID, questions: newQuestions }],
        })
      );
    }
  };

  return (
    <NoSSR>
      <div className="w-full">
        <DragDropContext onDragEnd={_onDragEnd}>
          <Droppable droppableId="allSections" type="sections">
            {(provided, _) => {
              return (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    backgroundColor: "#f0f0f0",
                    boxSizing: "border-box",
                  }}
                >
                  {form.sections.map((section, index) => (
                    <Fragment key={section.id}>
                      <FormSectionSchemaEditor
                        section={section}
                        index={index}
                        onChange={(newSection) => {
                          console.log("NEW SECTION");
                          console.log(newSection);
                          onChange(updateForm({ sections: [newSection] }));
                        }}
                        onDelete={() => {
                          onChange({
                            ...form,
                            sections: form.sections.filter(
                              (s) => s.id != section.id
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
        <Button
          onClick={() => {
            onChange(
              updateForm({
                sections: [
                  { id: nanoid(), title: "New Section", questions: [] },
                ],
              })
            );
          }}
        >
          Add Section
        </Button>
      </div>
    </NoSSR>
  );
};

export default FormEditor;

// Utility

/**
 *
 * @param list
 * @param startIndex
 * @param endIndex
 * @returns [list] but with the rearranged item
 *
 * Moves item from [startIndex] to [endIndex]
 */
const reindexItem = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

/**
 *
 * @param source
 * @param destination
 * @param droppableSource
 * @param droppableDestination
 * @returns a dictionary: sectionID => new set of questions in that section
 *
 * Moves a question from [source] to [destination] based on drag parameters.
 */
const moveQuestionBetweenSections = (
  source: Question[],
  destination: Question[],
  droppableSource: DraggableLocation,
  droppableDestination: DraggableLocation
) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);
  destClone.splice(droppableDestination.index, 0, removed);

  const result: Record<string, Question[]> = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

function mergeButOverwriteArrays(oldValue: any, newValue: any) {
  if (_.isArray(oldValue)) {
    return newValue;
  }
}

function mergeArraysByID(oldValue: any, newValue: any) {
  if (_.isArray(oldValue)) {
    var merged = _.mergeWith(
      _.keyBy(oldValue, "id"),
      _.keyBy(newValue, "id"),
      mergeButOverwriteArrays
    );
    var values = _.values(merged);
    return [...values];
  }
}
