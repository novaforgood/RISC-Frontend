import { nanoid } from "nanoid";
import {
  Fragment,
  InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import { Tag } from "../atomic";
import { ProfileTag } from "./types";

type AddTagInputProps = {
  onEnter: (newTagName: string) => void;
} & InputHTMLAttributes<HTMLInputElement>;

function AddTagInput({ onEnter, ...props }: AddTagInputProps) {
  const [edit, setEdit] = useState(false);
  const [newTagName, setNewTagName] = useState("");

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
        value={newTagName}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const target = e.target as HTMLInputElement;
            const val = target.value.trim();
            if (val.length > 0) {
              setNewTagName("");
              onEnter(val);
            }
          }
        }}
        onChange={(e) => {
          setNewTagName(e.target.value);
        }}
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
                onChange(
                  tags.filter((t) => t.profileTagId !== tag.profileTagId)
                );
              }}
            >
              <div>{tag.name}</div>
            </Tag>
          </Fragment>
        ))}
        <AddTagInput
          onEnter={(newTagName) => {
            if (tags.find((tag) => tag.name === newTagName)) {
              alert(`Cannot add tag: Tag "${newTagName}" already exists.`);
              return;
            }
            onChange([...tags, { name: newTagName, profileTagId: nanoid() }]);
          }}
        />
      </div>
    </div>
  );
}

export default TagSchemaEditor;
