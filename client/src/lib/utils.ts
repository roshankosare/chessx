import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hasKeyOfType<T>(
  obj: any,
  key: keyof T,
  type: string
): obj is T {
  return obj && typeof obj[key] === type;
}

export const getServerUrl = () => {
  // const server_url = process.env.VITE_SERVER_URL;
  // if (server_url) return server_url;
  if (window.location.hostname === "localhost") {
    return "http://localhost:5000";
  } else {
    return `http://${window.location.hostname}:5000`;
  }
};

const rows = 8;
export const generateTileId = (row: number, col: number): string => {
  const letters = "abcdefgh";
  return `${letters[col]}${rows - row}`;
};
