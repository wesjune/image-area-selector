import { css } from "@emotion/react";
import { TrashIcon } from "../Icons/TrashIcon";

interface DeleteButtonProps {
  onDelete: () => void;
}

export function DeleteButton({ onDelete }: DeleteButtonProps) {
  return (
    <button
      onClick={onDelete}
      css={css`
        display: none;
        border: none;
        border-radius: 0.25rem;
        padding: 0.25rem;
        background-color: #fff;
        color: #ccc;
        cursor: pointer;
        transition: color 0.2s;

        &:hover {
          color: #666;
        }

        svg {
          width: 1rem;
          height: 1rem;
        }
      `}
    >
      <TrashIcon />
    </button>
  );
}
