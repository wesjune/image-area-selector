import { create } from "zustand";
import { Selection, UploadedImage } from "./types";

type UploadedImageStore = {
  uploadedImage: UploadedImage | null;
  setUploadedImage: (image: UploadedImage) => void;
};

export const useUploadedImageStore = create<UploadedImageStore>((set) => ({
  uploadedImage: null,
  setUploadedImage: (uploadedImage) => set({ uploadedImage }),
}));

type SelectionsStore = {
  selections: Selection[];
  setSelections: (selections: Selection[]) => void;
};

export const useSelectionsStore = create<SelectionsStore>((set) => ({
  selections: [],
  setSelections: (selections) => set({ selections }),
}));

export function useStore() {
  const uploadedImage = useUploadedImageStore((state) => state.uploadedImage);
  const setUploadedImage = useUploadedImageStore(
    (state) => state.setUploadedImage,
  );
  const selections = useSelectionsStore((state) => state.selections);
  const setSelections = useSelectionsStore((state) => state.setSelections);

  return {
    uploadedImage,
    setUploadedImage,
    selections,
    setSelections,
  };
}
