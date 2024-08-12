import { MouseEvent, useRef, useState } from "react";
import { css } from "@emotion/react";

import { MIN_SELECTION_DIMENSION, RESTRICTED_WIDTH } from "../constants";
import { useStore } from "../store";
import { Selection } from "../types";
import { generateId, isOverlapping } from "../utils";

import { SelectionBox } from "./SelectionBox";

export function ImagePreview() {
  const { uploadedImage, selections, setSelections } = useStore();
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [currentSelection, setCurrentSelection] = useState<Selection | null>(
    null,
  );
  const containerRef = useRef<HTMLDivElement>(null);

  if (!uploadedImage) return null;
  const { height, name, scale, src, width } = uploadedImage;

  function getRelativeCoordinates(e: MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return { x: 0, y: 0 };

    const rect = containerRef.current.getBoundingClientRect();

    return {
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top) / scale,
    };
  }

  function handleMouseDown(e: MouseEvent<HTMLDivElement>) {
    const { x, y } = getRelativeCoordinates(e);
    setStartPoint({ x, y });
    setCurrentSelection({
      id: generateId(),
      x,
      y,
      width: 0,
      height: 0,
    });
  }

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!currentSelection) return;

    const endPoint = getRelativeCoordinates(e);

    const newSelection: Selection = {
      ...currentSelection,
      x: Math.min(startPoint.x, endPoint.x),
      y: Math.min(startPoint.y, endPoint.y),
      width: Math.abs(endPoint.x - startPoint.x),
      height: Math.abs(endPoint.y - startPoint.y),
    };

    setCurrentSelection({
      ...newSelection,
      x: Math.max(0, Math.min(newSelection.x, width - newSelection.width)),
      y: Math.max(0, Math.min(newSelection.y, height - newSelection.height)),
      width: Math.min(newSelection.width, width - newSelection.x),
      height: Math.min(newSelection.height, height - newSelection.y),
    });
  }

  function handleMouseUp() {
    if (!currentSelection) return;

    const newSelections = [...selections];

    if (
      currentSelection.width > MIN_SELECTION_DIMENSION / scale &&
      currentSelection.height > MIN_SELECTION_DIMENSION / scale &&
      !selections.some((s) => isOverlapping(s, currentSelection))
    ) {
      newSelections.push(currentSelection);
    }

    setSelections(newSelections);
    setCurrentSelection(null);
  }

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      css={css`
        position: relative;
        margin: 0 auto;
        width: ${RESTRICTED_WIDTH}px;
        overflow: hidden;
        user-select: none;
      `}
    >
      <img
        src={src}
        alt={name}
        draggable="false"
        css={css`
          width: 100%;
          height: auto;
        `}
      />
      {selections.map((selection) => (
        <SelectionBox key={selection.id} selection={selection} />
      ))}
      {!!currentSelection && (
        <SelectionBox isCreating={true} selection={currentSelection} />
      )}
    </div>
  );
}
