import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Text } from "../atomic";
import { DeleteIcon, DragHandle } from "./icons";
import { Question } from "./index";
import { getUpdateFunction } from "./utils";

interface VisibleGuardProps {
  show: boolean;
}
const VisibleGuard: React.FC<VisibleGuardProps> = ({ show, children }) => {
  return <div className={`${!show && "hidden"}`}>{children}</div>;
};

interface FormQuestionSchemaEditorProps {
  question: Question;
  onChange: (question: Question) => void;
  onDelete: () => void;
  index: number;
}
const FormQuestionSchemaEditor: React.FC<FormQuestionSchemaEditorProps> = ({
  question,
  onChange = () => {},
  onDelete = () => {},
  index,
}) => {
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const handleClickOutside = (event: Event) => {
    if (ref.current && !ref.current!.contains(event.target as Node)) {
      setFocused(false);
    }
  };
  useEffect(() => {
    window.addEventListener("click", handleClickOutside, false);
    return () => {
      window.removeEventListener("click", handleClickOutside, false);
    };
  }, []);

  const updateQuestion = getUpdateFunction(question);
  const questionPreview = () => {
    switch (question.type) {
      case "single-line":
        return (
          <input
            className="w-full h-8 rounded-md p-3 placeholder-secondary border-1.5 border-inactive resize-none box-border
              hover:border-secondary hover:border-2
              focus:ring-2 focus:ring-primary focus:ring-opacity-20 focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        );
      case "paragraph":
        return (
          <textarea
            className="w-full h-16 rounded-md p-3 placeholder-secondary border-1.5 border-inactive resize-none box-border
                        hover:border-secondary hover:border-2
                        focus:ring-2 focus:ring-primary focus:ring-opacity-20 focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        );
      // case "multiple-choice":
      //   return (
      //     <div>
      //       {[...question.choices].map((choice) => {
      //         return (
      //           <label>
      //             <input type="radio" name={choice} value="6/24" id={choice} />
      //             {choice}
      //           </label>
      //         );
      //       })}
      //     </div>
      //   );
      default:
        return <div></div>;
    }
  };

  const wrapperStyles = classNames({
    "w-full p-6 rounded cursor-pointer bg-white hover:bg-tertiary": true,
    "cursor-grab": focused,
  });

  return (
    <Draggable key={question.id} draggableId={question.id} index={index}>
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
            {...provided.dragHandleProps}
          >
            <div
              ref={ref}
              onClick={() => {
                setFocused(true);
              }}
              className={wrapperStyles}
            >
              <VisibleGuard show={focused}>
                <div className="flex items-center">
                  <DragHandle className="cursor-grab" />
                  <div className="w-2"></div>
                  <select
                    name="Question Type"
                    value={question.type}
                    onChange={(e) => {
                      onChange(
                        updateQuestion({
                          type: e.target.value as
                            | "paragraph"
                            | "single-line"
                            | "multiple-choice",
                        })
                      );
                    }}
                  >
                    <option value="paragraph">Paragraph</option>
                    <option value="single-line">Single Line</option>
                    {/* <option value="multiple-choice">Multiple Choice</option> */}
                  </select>
                  <div className="w-2"></div>
                  <DeleteIcon
                    className="h-3.5"
                    onClick={() => {
                      //Delete
                      onDelete();
                    }}
                  >
                    Delete
                  </DeleteIcon>
                </div>
                <div className="h-4" />
              </VisibleGuard>

              <div>
                <VisibleGuard show={!focused}>
                  <Text>{question.title}</Text>
                </VisibleGuard>
                <VisibleGuard show={focused}>
                  <input
                    placeholder="Question"
                    className={`${
                      !focused && "hidden"
                    } w-full h-8 rounded-md p-3 placeholder-secondary border-1.5 border-inactive resize-none box-border
                hover:border-secondary hover:border-2
                focus:ring-2 focus:ring-primary focus:ring-opacity-20 focus:outline-none`}
                    value={question.title}
                    onChange={(e) => {
                      onChange(updateQuestion({ title: e.target.value }));
                    }}
                  />
                </VisibleGuard>
              </div>
              <div className="h-4"></div>
              {questionPreview()}
            </div>
          </div>
        );
      }}
    </Draggable>
  );
};

export default FormQuestionSchemaEditor;
