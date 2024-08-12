import { css } from "@emotion/react";
import { useStore } from "../store";

export function DataPreview() {
  const { selections } = useStore();

  // TODO: Discuss with the designer(s) about the magic numbers
  return (
    <div
      css={css`
        border-radius: 0.25rem;
        padding: 2rem;
        height: 703px;
        background-color: rgb(28, 40, 56);
        color: #fff;
        overflow-y: auto;
      `}
    >
      {selections.length > 0 && (
        <pre>
          {JSON.stringify(
            selections.map((s) => ({
              x: Math.round(s.x),
              y: Math.round(s.y),
              width: Math.round(s.width),
              height: Math.round(s.height),
            })),
            null,
            2,
          )}
        </pre>
      )}
    </div>
  );
}
