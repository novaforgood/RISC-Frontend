import { nanoid } from "nanoid";
import dynamic from "next/dynamic";
import {
  Fragment,
  InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { Button, Card, Input, Tag, Text } from "../atomic";
import { DragHandle } from "../FormSchemaEditor/icons";
import { reindexItemInList } from "../FormSchemaEditor/utils";
import SelectOptionModal from "../SelectOptionModal";
import { ProfileTag, ProfileTagCategory } from "./types";

const NoSSRComponent = (props: any) => <Fragment>{props.children}</Fragment>;

const NoSSR = dynamic(() => Promise.resolve(NoSSRComponent), {
  ssr: false,
});

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
  categories: ProfileTagCategory[];
  onChange: (
    newTags: ProfileTag[],
    newCategories: ProfileTagCategory[]
  ) => void;
}
function TagSchemaEditor({
  tags = [],
  categories = [],
  onChange = () => {},
}: TagSchemaEditorProps) {
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
      tags,
      reindexItemInList(categories, source.index, destination.index)
    );
  };

  return (
    <Card className="w-full p-5">
      <NoSSR>
        <DragDropContext onDragEnd={_onDragEnd}>
          <Droppable droppableId="allTagCategories" type="tagCategories">
            {(provided, _) => {
              return (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {categories.map((category, index) => {
                    return (
                      <Draggable
                        key={category.profileTagCategoryId}
                        draggableId={category.profileTagCategoryId}
                        index={index}
                      >
                        {(provided, _) => {
                          return (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              style={{
                                userSelect: "none",
                                ...provided.draggableProps.style,
                              }}
                            >
                              <DragHandle
                                className="cursor-grab p-1.5"
                                {...provided.dragHandleProps}
                              />
                              <Input
                                value={category.name}
                                onChange={(e) => {
                                  onChange(
                                    tags,
                                    categories.map((cat) => {
                                      if (
                                        cat.profileTagCategoryId ===
                                        category.profileTagCategoryId
                                      ) {
                                        return {
                                          ...cat,
                                          name: e.target.value,
                                        };
                                      } else {
                                        return cat;
                                      }
                                    })
                                  );
                                }}
                              />
                              <div>{category.name}</div>
                              <div className="flex items-center flex-wrap gap-2">
                                {tags.map((tag) => {
                                  if (
                                    tag.profileTagCategoryId !==
                                    category.profileTagCategoryId
                                  ) {
                                    return null;
                                  }
                                  return (
                                    <TagComponent
                                      key={tag.profileTagId}
                                      tag={tag}
                                      onDelete={() => {
                                        onChange(
                                          tags.filter(
                                            (t) =>
                                              t.profileTagId !==
                                              tag.profileTagId
                                          ),
                                          categories
                                        );
                                      }}
                                    />
                                  );
                                })}
                                <AddTagInput
                                  onEnter={(newTagName) => {
                                    if (
                                      tags.find(
                                        (tag) => tag.name === newTagName
                                      )
                                    ) {
                                      alert(
                                        `Cannot add tag: Tag "${newTagName}" already exists.`
                                      );
                                      return;
                                    }
                                    onChange(
                                      [
                                        ...tags,
                                        {
                                          name: newTagName,
                                          profileTagId: nanoid(),
                                          profileTagCategoryId:
                                            category.profileTagCategoryId,
                                        },
                                      ],
                                      categories
                                    );
                                  }}
                                />
                              </div>
                            </div>
                          );
                        }}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              );
            }}
          </Droppable>
        </DragDropContext>
      </NoSSR>
      <Button
        onClick={() => {
          onChange(tags, [
            ...categories,
            {
              name: "",
              profileTagCategoryId: nanoid(),
              listIndex: categories.length,
            },
          ]);
        }}
      >
        Add category lel
      </Button>
    </Card>
  );
}

export default TagSchemaEditor;
