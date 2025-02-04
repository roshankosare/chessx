import { randomInt } from 'crypto';

export function generateNumericID(length = 8) {
  const max = 10 ** length; // Maximum value based on length
  return randomInt(0, max).toString().padStart(length, '0');
}
