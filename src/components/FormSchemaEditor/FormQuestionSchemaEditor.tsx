import classNames from "classnames";
import React, { Fragment, useEffect, useRef, useState } from "react";
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

  const updateQuestion = getUpdateFunction(question);

  const handleClickOutside = (event: Event) => {
    if (event.defaultPrevented) {
      return;
    }
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

  const singlelinePreviewStyles = classNames({
    "w-full px-1.5 py-1 rounded-md placeholder-secondary border-1.5 border-inactive resize-none box-border \
    focus:ring-2 focus:ring-primary focus:ring-opacity-20 focus:outline-none":
      true,
    "hover:border-secondary hover:border-2": !focused,
    "bg-inactive": focused,
  });

  const paragraphPreviewStyles = classNames({
    "w-full px-1.5 py-1 rounded-md placeholder-secondary border-1.5 border-inactive resize-none box-border \
    focus:ring-2 focus:ring-primary focus:ring-opacity-20 focus:outline-none":
      true,
    "hover:border-secondary hover:border-2": !focused,
    "bg-inactive": focused,
  });

  const questionPreview = () => {
    switch (question.type) {
      case "single-line":
        return (
          <input
            disabled={focused}
            className={singlelinePreviewStyles}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        );
      case "paragraph":
        return (
          <textarea
            disabled={focused}
            className={paragraphPreviewStyles}
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
    "bg-white w-full p-6 rounded cursor-pointer hover:bg-tertiary transition-background duration-100":
      true,
    "cursor-grab border-2 border-inactive hover:bg-white": focused,
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
                <div className="flex items-center pb-2 border-b border-secondary">
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
                    className="h-3.5 cursor-pointer"
                    onClick={() => {
                      //Delete
                      onDelete();
                    }}
                  />
                </div>
                <div className="h-4" />
              </VisibleGuard>

              <div>
                <VisibleGuard show={!focused}>
                  <Text b>{question.title}</Text>
                  {question.helperText && (
                    <Fragment>
                      <div className="h-1"></div>
                      <Text className="text-secondary">
                        {question.helperText}
                      </Text>
                    </Fragment>
                  )}
                </VisibleGuard>
                <VisibleGuard show={focused}>
                  <input
                    placeholder="Question"
                    className={`${
                      !focused && "hidden"
                    } w-full px-1.5 py-1 rounded-md placeholder-secondary border-1.5 border-inactive 
                      resize-none box-border font-bold
                      hover:border-secondary hover:border-2
                      focus:ring-2 focus:ring-primary focus:ring-opacity-20 focus:outline-none`}
                    value={question.title}
                    onChange={(e) => {
                      onChange(updateQuestion({ title: e.target.value }));
                    }}
                  />
                  <div className="h-1"></div>
                  <input
                    placeholder="Helper text"
                    className={`${
                      !focused && "hidden"
                    } w-full px-1.5 py-1 rounded-md placeholder-secondary border-1.5 border-inactive 
                      resize-none box-border text-secondary
                      hover:border-secondary hover:border-2
                      focus:ring-2 focus:ring-primary focus:ring-opacity-20 focus:outline-none`}
                    value={question.helperText}
                    onChange={(e) => {
                      onChange(updateQuestion({ helperText: e.target.value }));
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
