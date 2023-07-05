import { IOption } from "./types";

function findById(arr: IOption[], value: string): IOption | null {
  for (const element of arr) {
    if (element.value === value) {
      return element;
    }
    if (element.children && element.children.length > 0) {
      const foundElement = findById(element.children, value);
      if (foundElement) {
        return foundElement;
      }
    }
  }
  return null;
}

export { findById };
