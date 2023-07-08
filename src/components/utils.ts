import { IOption } from "./types";

function findById(
  givenData: IOption | IOption[],
  value: string,
  returnBool: boolean
): IOption | boolean {
  if (Array.isArray(givenData)) {
    for (const element of givenData) {
      if (element?.value === value) {
        return returnBool ? true : element;
      }
    }
  } else {
    if (givenData?.value === value) {
      return returnBool ? true : givenData;
    } else {
      return null;
    }
  }
  return null;
}

function flatten(array: IOption[]) {
  return array.reduce((result, item) => {
    result.push(item);
    if (item.children) {
      result.push(...flatten(item.children));
    }
    return result;
  }, []);
}
export { findById, flatten };
