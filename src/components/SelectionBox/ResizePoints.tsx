import { css } from "@emotion/react";

import { DIRECTIONS } from "../../constants";
import { Direction } from "../../types";

interface ResizePointsProps {
  onResizeStart: (
    e: React.MouseEvent<HTMLDivElement>,
    direction: Direction,
  ) => void;
}

export function ResizePoints({ onResizeStart }: ResizePointsProps) {
  return (
    <>
      {Object.values(DIRECTIONS).map((direction) => (
        <div
          key={direction}
          onMouseDown={(e) => onResizeStart(e, direction)}
          css={css`
            position: absolute;
            ${direction.includes(DIRECTIONS.NORTH) && "top: -0.25rem;"}
            ${direction.includes(DIRECTIONS.SOUTH) && "bottom: -0.25rem;"}
            ${direction.includes(DIRECTIONS.WEST) && "left: -0.25rem;"}
            ${direction.includes(DIRECTIONS.EAST) && "right: -0.25rem;"}
            ${(direction === DIRECTIONS.NORTH ||
              direction === DIRECTIONS.SOUTH) &&
            "left: 50%; transform: translateX(-50%);"}
            ${(direction === DIRECTIONS.EAST ||
              direction === DIRECTIONS.WEST) &&
            "top: 50%; transform: translateY(-50%);"}
            width: 0.5rem;
            height: 0.5rem;
            border: 1px solid #007bff;
            background-color: #fff;
            cursor: ${direction}-resize;
          `}
        />
      ))}
    </>
  );
}
