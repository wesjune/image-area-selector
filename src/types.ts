import { DIRECTIONS } from "./constants";

export type Coordinates = {
  x: number;
  y: number;
};

export type Dimensions = {
  width: number;
  height: number;
};

export type Direction = (typeof DIRECTIONS)[keyof typeof DIRECTIONS];

export type Selection = {
  id: string;
} & Coordinates &
  Dimensions;

export type UploadedImage = {
  name: string;
  src: string;
  scale: number;
} & Dimensions;
