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
  if (window.location.hostname === "localhost") {
    return "http://localhost:5000";
  } else {
    return `http://${window.location.hostname}:5000`;
  }
};
