import { IOption } from "./types";

function findById(arr: IOption | IOption[], value: string): IOption | null {
  if (Array.isArray(arr)) {
    for (const element of arr) {
      if (element?.value === value) {
        return element;
      }
    }
  } else {
    if (arr?.value === value) {
      return arr;
    } else {
      return null;
    }
  }

  return null;
}

export { findById };
