import { MouseEvent, useCallback, useEffect, useState } from "react";
import { css } from "@emotion/react";

import { DIRECTIONS, MIN_SELECTION_DIMENSION } from "../../constants";
import { useStore } from "../../store";
import { Direction, Selection } from "../../types";
import { isOverlapping } from "../../utils";

import { DeleteButton } from "./DeleteButton";
import { ResizePoints } from "./ResizePoints";

interface SelectionBoxProps {
  isCreating?: boolean;
  selection: Selection;
}

const STATUS_TYPES = {
  DRAGGING: "dragging",
  RESIZING: "resizing",
};

export function SelectionBox({
  isCreating = false,
  selection,
}: SelectionBoxProps) {
  const { uploadedImage, selections, setSelections } = useStore();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [resizeDirection, setResizeDirection] = useState("");
  const [status, setStatus] = useState("");

  const isDragging = status === STATUS_TYPES.DRAGGING;
  const isResizing = status === STATUS_TYPES.RESIZING;

  function handleSelectionDelete(id: string) {
    setSelections(selections.filter((s) => s.id !== id));
  }

  function handleResizeStart(
    e: MouseEvent<HTMLDivElement>,
    direction: Direction,
  ) {
    e.stopPropagation();
    setMousePosition({ x: e.clientX, y: e.clientY });
    setResizeDirection(direction);
    setStatus(STATUS_TYPES.RESIZING);
  }

  function handleMouseDown(e: MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    setMousePosition({ x: e.clientX, y: e.clientY });
    setStatus(STATUS_TYPES.DRAGGING);
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      if (!uploadedImage) return;
      const { scale, width: imageWidth, height: imageHeight } = uploadedImage;

      const dx = (e.clientX - mousePosition.x) / scale;
      const dy = (e.clientY - mousePosition.y) / scale;

      function updateSelection(selection: Selection) {
        const updatedSelections = selections.map((s) =>
          s.id === selection.id ? selection : s,
        );

        !updatedSelections.some(
          (s) => s.id !== selection.id && isOverlapping(s, selection),
        ) && setSelections(updatedSelections);
      }

      if (isDragging) {
        const newX = Math.max(
          0,
          Math.min(imageWidth - selection.width, selection.x + dx),
        );
        const newY = Math.max(
          0,
          Math.min(imageHeight - selection.height, selection.y + dy),
        );

        updateSelection({
          ...selection,
          x: newX,
          y: newY,
        });
      }

      if (isResizing) {
        let newX = selection.x;
        let newY = selection.y;
        let newWidth = selection.width;
        let newHeight = selection.height;

        const maxWidth = uploadedImage.width - newX;
        const maxHeight = uploadedImage.height - newY;
        const minDimension = MIN_SELECTION_DIMENSION / scale;

        if (resizeDirection.includes(DIRECTIONS.WEST)) {
          newX = Math.min(
            selection.x + selection.width - minDimension,
            Math.max(0, selection.x + dx),
          );
          newWidth = selection.x + selection.width - newX;
        }

        if (resizeDirection.includes(DIRECTIONS.EAST)) {
          newWidth = Math.min(
            maxWidth,
            Math.max(minDimension, selection.width + dx),
          );
        }

        if (resizeDirection.includes(DIRECTIONS.NORTH)) {
          newY = Math.min(
            selection.y + selection.height - minDimension,
            Math.max(0, selection.y + dy),
          );
          newHeight = selection.y + selection.height - newY;
        }

        if (resizeDirection.includes(DIRECTIONS.SOUTH)) {
          newHeight = Math.min(
            maxHeight,
            Math.max(minDimension, selection.height + dy),
          );
        }

        updateSelection({
          ...selection,
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight,
        });
      }
    },
    [
      isDragging,
      isResizing,
      mousePosition,
      resizeDirection,
      selection,
      selections,
      setSelections,
      uploadedImage,
    ],
  );

  const handleMouseUp = useCallback(() => {
    setStatus("");
  }, []);

  useEffect(() => {
    if (!isDragging && !isResizing) return;

    window.addEventListener("mousemove", handleMouseMove as never);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove as never);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  if (!uploadedImage) return null;

  const { scale } = uploadedImage;

  function scaleSelectionKey(key: number) {
    return Math.round(key * scale);
  }

  return (
    <div
      onMouseDown={handleMouseDown}
      css={css`
        position: absolute;
        left: ${scaleSelectionKey(selection.x)}px;
        top: ${scaleSelectionKey(selection.y)}px;
        width: ${scaleSelectionKey(selection.width)}px;
        height: ${scaleSelectionKey(selection.height)}px;
        display: grid;
        place-items: center;
        border: 1px solid #007bff;
        ${(isCreating || isDragging || isResizing) &&
        "background-color: rgb(0, 123, 255, 0.2);"}
        cursor: ${isDragging ? "grabbing" : "grab"};

        &:hover {
          background-color: rgb(0, 123, 255, 0.2);

          & > button {
            display: inline-grid;
          }
        }
      `}
    >
      {!isCreating && (
        <DeleteButton onDelete={() => handleSelectionDelete(selection.id)} />
      )}
      {!isCreating && <ResizePoints onResizeStart={handleResizeStart} />}
    </div>
  );
}
