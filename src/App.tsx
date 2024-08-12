import { css } from "@emotion/react";

import { DataPreview } from "./components/DataPreview";
import { ImagePreview } from "./components/ImagePreview";
import { ImageUploader } from "./components/ImageUploader";

export function App() {
  // TODO: Discuss with the designer(s) about the magic numbers
  return (
    <div
      css={css`
        display: grid;
        grid-template-columns: 433px minmax(548px, 1fr);
        gap: 135px;
        padding: 2rem;
      `}
    >
      <div
        css={css`
          min-height: 792px;
          border-radius: 0.25rem;
          background-color: rgb(244, 248, 248);
          box-shadow: 0 1rem 1rem 0 rgba(0, 0, 0, 0.2);
          overflow: hidden;
        `}
      >
        <div
          css={css`
            margin-bottom: 2.5rem;
            padding: 1rem 2rem;
            height: 56px;
            background-color: #eee;
          `}
        >
          <div
            css={css`
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background-color: #ccc;
            `}
          />
        </div>
        <ImageUploader />
        <ImagePreview />
      </div>
      <DataPreview />
    </div>
  );
}
