import {
  Fragment,
  InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import { Tag } from "../atomic";
import { ProfileTag } from "./types";

type AddTagInputProps = InputHTMLAttributes<HTMLInputElement>;

function AddTagInput(props: AddTagInputProps) {
  const [edit, setEdit] = useState(false);

  const ref = useRef<HTMLInputElement | null>(null);
  const handleClickOutside = (event: MouseEvent) => {
    if (ref && ref.current && !ref.current!.contains(event.target as Node)) {
      setEdit(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return edit ? (
    <div className="relative">
      <input
        className="rounded"
        ref={ref}
        autoFocus
        placeholder="type here"
        // onKeyDown={(e) => {
        //   if (e.key === "Enter") {
        //     const val = e.target.value.trim();
        //     if (val.length > 0) {
        //       onEnter(e.target.value);
        //       setEdit(false);
        //     }
        //   }
        // }}
        {...props}
      ></input>
      <div className="absolute">Press enter to add</div>
    </div>
  ) : (
    <div onClick={() => setEdit(true)}>add tag +</div>
  );
}

interface TagSchemaEditorProps {
  tags: ProfileTag[];
  onChange: (newTags: ProfileTag[]) => void;
}

function TagSchemaEditor({
  tags = [],
  onChange = () => {},
}: TagSchemaEditorProps) {
  return (
    <div className="w-full">
      <div className="flex">
        {tags.map((tag, i) => (
          <Fragment key={i}>
            <Tag
              onClick={() => {
                onChange([]);
              }}
            >
              <div>{tag.name}</div>
            </Tag>
          </Fragment>
        ))}
        <AddTagInput />
      </div>
    </div>
  );
}

export default TagSchemaEditor;
