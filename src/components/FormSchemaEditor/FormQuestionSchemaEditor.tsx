import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { DeleteIcon, DragHandle } from "./icons";
import { Question } from "./index";
import Select from "./Select";
import { getUpdateFunction } from "./utils";

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
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const handleMouseDownOutside = (event: Event) => {
    if (ref.current && !ref.current!.contains(event.target as Node)) {
      setFocused(false);
    }
  };
  useEffect(() => {
    window.addEventListener("mousedown", handleMouseDownOutside, false);
    return () => {
      window.removeEventListener("mousedown", handleMouseDownOutside, false);
    };
  }, []);

  const updateQuestion = getUpdateFunction(question);

  const singlelinePreviewStyles = classNames({
    "w-full px-2 py-1 rounded-md placeholder-secondary border-2 border-inactive resize-none box-border text-secondary bg-tertiary \
    focus:ring-2 focus:ring-primary focus:ring-opacity-20 focus:outline-none pointer-events-none":
      true,
  });

  const paragraphPreviewStyles = classNames({
    "w-full px-2 py-1 rounded-md placeholder-secondary border-2 border-inactive resize-none box-border text-secondary bg-tertiary \
    focus:ring-2 focus:ring-primary focus:ring-opacity-20 focus:outline-none pointer-events-none":
      true,
    "bg-tertiary": hovered,
  });

  const questionPreview = () => {
    switch (question.type) {
      case "short-answer":
        return (
          <input
            disabled
            readOnly
            value="Short Answer"
            className={singlelinePreviewStyles}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        );
      case "long-answer":
        return (
          <textarea
            disabled
            readOnly
            value="Long Answer"
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
    "bg-white w-full p-6 rounded border-2 border-box": true,
    "border-white": !focused,
    "border-secondary": focused,
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
          >
            <div
              ref={ref}
              onMouseDown={() => {
                setFocused(true);
              }}
              onMouseEnter={() => {
                setHovered(true);
              }}
              onMouseLeave={() => {
                setHovered(false);
              }}
              className={wrapperStyles}
            >
              <div className="flex items-center justify-between">
                <DragHandle
                  className="cursor-grab p-1.5"
                  {...provided.dragHandleProps}
                />
                <div className="w-2"></div>

                <div className="w-1"></div>
                <button
                  className="rounded hover:bg-tertiary p-1.5 cursor-pointer"
                  onClick={() => {
                    onDelete();
                  }}
                >
                  <DeleteIcon className="h-3.5" />
                </button>
              </div>
              <div className="h-4"></div>

              <div className="flex items-start">
                <div className="w-2/3">
                  <input
                    placeholder="Question"
                    className={
                      "w-full px-2 py-1 rounded-md placeholder-secondary border border-inactive \
                      resize-none box-border font-bold box-border \
                      hover:border-secondary \
                      focus:ring-2 focus:ring-inactive focus:outline-none"
                    }
                    value={question.title}
                    onChange={(e) => {
                      onChange(updateQuestion({ title: e.target.value }));
                    }}
                  />
                  <div className="h-4"></div>
                  <input
                    placeholder="Description"
                    className={
                      "w-full px-2 py-1 rounded-md placeholder-secondary border border-inactive \
                      resize-none box-border text-secondary box-border \
                      hover:border-secondary \
                      focus:ring-2 focus:ring-inactive focus:outline-none"
                    }
                    value={question.description}
                    onChange={(e) => {
                      onChange(updateQuestion({ description: e.target.value }));
                    }}
                  />
                </div>
                <div className="w-2 sm:w-4 md:w-8"></div>
                <div className="w-1/3">
                  <Select
                    options={[
                      { label: "Short Answer", value: "short-answer" },
                      { label: "Long Answer", value: "long-answer" },
                    ]}
                    value={question.type}
                    onSelect={(selectedValue) => {
                      onChange(updateQuestion({ type: selectedValue }));
                    }}
                  />
                </div>

                {/* <input
                  placeholder="Description"
                  className={
                    "flex-1 px-1.5 py-1 rounded-md placeholder-secondary border-2 border-inactive \
                      resize-none box-border text-secondary box-border \
                      hover:border-secondary hover:border-2 \
                      focus:ring-2 focus:ring-primary focus:ring-opacity-20 focus:outline-none"
                  }
                  value={"Short Answer"}
                  onChange={(e) => {
                    onChange(updateQuestion({ description: e.target.value }));
                  }}
                /> */}

                {/* <select
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
                  <option value="paragraph">Long Answer</option>
                  <option value="single-line">Short Answer</option>
                  <option value="multiple-choice">Multiple Choice</option>
                </select> */}
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
