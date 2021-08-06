import { Tag, Text } from "../atomic";
import { ProfileTag, ProfileTagCategory } from "./types";

interface TagSelectorProps {
  selectableTagCategories: ProfileTagCategory[];
  selectableTags: ProfileTag[];
  selectedTagIds: string[];
  onChange?: (selectedTagIds: string[]) => void;
}

function TagSelector({
  selectableTags,
  selectableTagCategories = [],
  selectedTagIds,
  onChange = () => {},
}: TagSelectorProps) {
  const selectedTagSet = new Set(selectedTagIds);

  if (selectableTagCategories.length === 0)
    return <Text i>No tags to select.</Text>;

  return (
    <div className="flex flex-col gap-4">
      {selectableTagCategories.map((category) => {
        return (
          <div>
            <Text b>{category.name}</Text>
            <div className="flex flex-wrap gap-2 pt-2">
              {selectableTags
                .filter(
                  (tag) =>
                    tag.profileTagCategoryId === category.profileTagCategoryId
                )
                .map((tag, i) => {
                  const tagIsSelected = selectedTagSet.has(tag.profileTagId);

                  return (
                    <Tag
                      key={i}
                      className="shadow-md"
                      variant={tagIsSelected ? "dark" : "outline"}
                      onClick={() => {
                        if (tagIsSelected) {
                          onChange(
                            selectedTagIds.filter(
                              (id) => id !== tag.profileTagId
                            )
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
          </div>
        );
      })}
    </div>
  );
}

export default TagSelector;
