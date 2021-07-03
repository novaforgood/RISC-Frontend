import { Tag } from "../atomic";
import { ProfileTag } from "./types";

interface TagSelectorProps {
  selectableTags: ProfileTag[];
  selectedTagIds: string[];
  onChange?: (selectedTagIds: string[]) => void;
}

function TagSelector({
  selectableTags,
  selectedTagIds,
  onChange = () => {},
}: TagSelectorProps) {
  const selectedTagSet = new Set(selectedTagIds);

  return (
    <div className="flex flex-wrap gap-2">
      {selectableTags.map((tag, i) => {
        const tagIsSelected = selectedTagSet.has(tag.profileTagId);

        return (
          <Tag
            key={i}
            variant={tagIsSelected ? "dark" : "outline"}
            onClick={() => {
              console.log("lol");
              if (tagIsSelected) {
                onChange(
                  selectedTagIds.filter((id) => id !== tag.profileTagId)
                );
              } else {
                onChange([...selectedTagIds, tag.profileTagId]);
              }
            }}
          >
            {tag.name}
          </Tag>
        );
      })}
    </div>
  );
}

export default TagSelector;
