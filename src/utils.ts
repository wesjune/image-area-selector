import { Selection } from "./types";

export const generateId = () => Date.now().toString(16);

export function isOverlapping(a: Selection, b: Selection) {
  return !(
    a.x + a.width <= b.x ||
    b.x + b.width <= a.x ||
    a.y + a.height <= b.y ||
    b.y + b.height <= a.y
  );
}
