import { nanoid } from "nanoid";
import { InputHTMLAttributes, useEffect, useRef, useState } from "react";
import { Card, Tag, Text } from "../atomic";
import SelectOptionModal from "../SelectOptionModal";
import { ProfileTag } from "./types";

function XIcon() {
  return (
    <svg
      className="mt-0.5"
      height="6pt"
      viewBox="0 0 329 329"
      width="6pt"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m194.800781 164.769531 128.210938-128.214843c8.34375-8.339844 8.34375-21.824219 0-30.164063-8.339844-8.339844-21.824219-8.339844-30.164063 0l-128.214844 128.214844-128.210937-128.214844c-8.34375-8.339844-21.824219-8.339844-30.164063 0-8.34375 8.339844-8.34375 21.824219 0 30.164063l128.210938 128.214843-128.210938 128.214844c-8.34375 8.339844-8.34375 21.824219 0 30.164063 4.15625 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921875-2.089844 15.082031-6.25l128.210937-128.214844 128.214844 128.214844c4.160156 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921874-2.089844 15.082031-6.25 8.34375-8.339844 8.34375-21.824219 0-30.164063zm0 0" />
    </svg>
  );
}

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
        className="rounded-xl border border-secondary px-1"
        ref={ref}
        autoFocus
        placeholder="type here"
        value={newTagName}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const target = e.target as HTMLInputElement;
            const val = target.value.trim();
            if (val.length > 20) {
              alert("Your tag name cannot exceed 20 characters.");
              return;
            }
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
    <div
      onClick={() => setEdit(true)}
      className="cursor-pointer rounded-xl border border-secondary px-2 hover:bg-tertiary"
    >
      add tag +
    </div>
  );
}

interface TagComponentProps {
  onDelete: () => void;
  tag: ProfileTag;
}
function TagComponent({ tag, onDelete }: TagComponentProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <SelectOptionModal
        title={`Delete tag "${tag.name}"`}
        primaryButtonText="Confirm"
        secondaryButtonText="Cancel"
        isOpen={open}
        onPrimaryButtonClick={() => {
          onDelete();
          setOpen(false);
        }}
        onSecondaryButtonClick={() => {
          setOpen(false);
        }}
        onClose={() => {
          setOpen(false);
        }}
      >
        <Text>
          Are you sure you want to delete this tag? Once you save your changes,
          all mentors with this tag will have it removed.
        </Text>
      </SelectOptionModal>
      <Tag
        onClick={() => {
          setOpen(true);
        }}
        className="hover:bg-inactive flex items-center"
      >
        <div>{tag.name}</div>
        <div className="w-1.5"></div>
        <XIcon />
      </Tag>
    </div>
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
    <Card className="w-full p-5">
      <div className="flex items-center flex-wrap gap-2">
        {tags.map((tag) => (
          <TagComponent
            key={tag.profileTagId}
            tag={tag}
            onDelete={() => {
              onChange(tags.filter((t) => t.profileTagId !== tag.profileTagId));
            }}
          />
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
    </Card>
  );
}

export default TagSchemaEditor;
