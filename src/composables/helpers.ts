export function moveElementToEnd<T>(list: T[], index: number): T[] {
  // 1. Check for invalid index
  if (index < 0 || index >= list.length) {
    return list; // Return the original list if the index is out of bounds
  }

  // 2. Remove the element at the specified index
  // splice(start: number, deleteCount: number, ...items: T[])
  // It returns an array containing the deleted element(s).
  const [elementToMove] = list.splice(index, 1);

  if (elementToMove !== undefined) {
    // 3. Add the removed element to the end of the array
    list.push(elementToMove);
  }

  // Return the mutated list (optional, but good practice for chaining)
  return list;
}
