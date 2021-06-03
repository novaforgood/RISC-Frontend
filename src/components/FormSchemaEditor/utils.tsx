import _ from "lodash";
import { DraggableLocation } from "react-beautiful-dnd";
import { Question } from "./index";

/**
 *
 * @param list
 * @param startIndex
 * @param endIndex
 * @returns [list] but with the rearranged item
 *
 * Moves item from [startIndex] to [endIndex]
 */
export const reindexItemInList = (
  list: any[],
  startIndex: number,
  endIndex: number
) => {
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
export const moveQuestionBetweenSections = (
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

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};
export function getUpdateFunction<T>(item: T) {
  const update = (
    arg: RecursivePartial<T> | ((item: T) => RecursivePartial<T>)
  ) => {
    let changes;
    if (typeof arg === "function") {
      changes = arg(item);
    } else {
      changes = arg;
    }
    return { ..._.mergeWith(item, changes, mergeButOverwriteArrays) };
  };
  return update;
}
