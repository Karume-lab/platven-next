import { ColumnDragData } from "@/components/kanban/board-column";
import { TaskDragData } from "@/components/kanban/task-card";
import { Active, DataRef, Over } from "@dnd-kit/core";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type DraggableData = ColumnDragData | TaskDragData;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hasDraggableData<T extends Active | Over>(
  entry: T | null | undefined,
): entry is T & {
  data: DataRef<DraggableData>;
} {
  if (!entry) {
    return false;
  }

  const data = entry.data.current;

  if (data?.type === "Column" || data?.type === "Task") {
    return true;
  }

  return false;
}

export const objectToFormData = (
  data: { [key: string]: any },
  options: { useIndexOnFiles: boolean } = { useIndexOnFiles: false },
  formData: FormData = new FormData(),
  parentKey?: string,
): FormData => {
  for (const key in data) {
    if (key in data) {
      const value = data[key];

      const formKey = parentKey ? `${parentKey}[${key}]` : key;

      if (value !== null && value !== undefined) {
        if (value instanceof Array) {
          value.forEach((val, index) => {
            const nestedFormKey = `${formKey}[${index}]`;

            if (typeof val === "object" && !(val instanceof File)) {
              // Recursively handle nested objects in arrays
              objectToFormData(val, options, formData, nestedFormKey);
            } else {
              // Handle File instances in arrays
              if (val instanceof File) {
                formData.append(
                  options.useIndexOnFiles ? nestedFormKey : formKey,
                  val,
                  val.name,
                );
              } else {
                formData.append(nestedFormKey, val);
              }
            }
          });
        } else if (typeof value === "object" && !(value instanceof File)) {
          // Recursively handle nested objects
          objectToFormData(value, options, formData, formKey);
        } else if (value instanceof File) {
          // Handle top-level File instances
          formData.append(formKey, value, value.name);
        } else {
          formData.append(formKey, value as string);
        }
      }
    }
  }
  return formData;
};

export function findRepeated<T>(
  data: T[],
  predicate: (a: T, b: T) => boolean,
): T[] {
  /**
   This function finds elements that are repeated in an array based on a predicate.

    Args:
        data: The array to search for repeated elements.
        predicate: A function that takes two elements from the array and returns True
            if they are considered the same based on the predicate.

    Returns:
        A list of elements that appear multiple times in the array based on the predicate.

  */

  const repeatedElements: Set<T> = new Set();

  for (let i = 0; i < data.length; i++) {
    const element = data[i];

    // Check if element has already been seen (excluding itself)
    if (repeatedElements.has(element)) {
      continue;
    }

    // Efficiently check for duplicates within remaining elements
    for (let j = i + 1; j < data.length; j++) {
      const otherElement = data[j];
      if (predicate(element, otherElement)) {
        repeatedElements.add(element);
        repeatedElements.add(otherElement);
        break;
      }
    }
  }

  return Array.from(repeatedElements); // Convert Set to array
}

export const formartCurrency = (amount: number) => {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "KES",
  }).format(amount);
  return formatted;
};
