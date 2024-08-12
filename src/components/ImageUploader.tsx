import { ChangeEvent, useState } from "react";
import { css } from "@emotion/react";

import { RESTRICTED_WIDTH } from "../constants";
import { useStore } from "../store";

import { ImageIcon } from "./Icons/ImageIcon";

export function ImageUploader() {
  const { setUploadedImage, uploadedImage } = useStore();
  const [error, setError] = useState<string | null>(null);

  if (uploadedImage) return null;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file || !file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onerror = () => {
      setError("Failed to read the file. Please try again.");
    };

    reader.onload = (e) => {
      const img = new Image();
      const src = e.target?.result as string;

      img.src = src;

      img.onerror = () => {
        setError("Failed to load the image. Please try another file.");
      };

      img.onload = () => {
        setUploadedImage({
          name: file.name,
          src,
          scale: RESTRICTED_WIDTH / img.width,
          width: img.width,
          height: img.height,
        });
      };
    };
  };

  return (
    <div
      css={css`
        margin: 0 auto;
        width: ${RESTRICTED_WIDTH}px;
      `}
    >
      <label
        htmlFor="image-upload"
        css={css`
          display: grid;
          align-content: center;
          justify-items: center;
          border: 1px solid #ccc;
          border-radius: 0.5rem;
          height: 156px;
          background-color: #fff;
          color: #888;
          cursor: pointer;
          transition: background-color 0.3s;

          &:hover {
            background: #f0f0f0;
          }
        `}
      >
        <ImageIcon />
        Upload image
      </label>
      <input
        type="file"
        accept="image/*"
        id="image-upload"
        onChange={handleFileChange}
        css={css`
          display: none;
        `}
      />
      {error && (
        <p
          css={css`
            margin-top: 1rem;
            color: red;
            text-align: center;
          `}
        >
          {error}
        </p>
      )}
    </div>
  );
}
