import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function hasKeyOfType<T>(obj: any, key: keyof T, type: string): obj is T {
  return obj && typeof obj[key] === type;
}

