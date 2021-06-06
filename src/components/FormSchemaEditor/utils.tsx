import _ from "lodash";

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
