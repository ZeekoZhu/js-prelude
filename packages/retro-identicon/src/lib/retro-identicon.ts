import { simpleHash } from './simple-hash';

export interface RetroIdenticonOptions {
  /**
   * The number of pixels on each side of the identicon
   * @default 10
   */
  sidePixels: number;
}

function firstBits(hash: bigint, bitToGenerate: number) {
  const bits: number[] = [];
  for (let i = 0; i < bitToGenerate; i++) {
    bits.push(Number((hash >> BigInt(i)) & BigInt(1)));
  }
  return bits;
}

export interface IdenticonMatrix {
  matrix: number[][];
  hash: bigint;
}

/**
 * Generates a retro identicon
 * @param input
 * @param sidePixels, it must be an odd number
 */
export function retroIdenticon(
  input: string,
  { sidePixels }: RetroIdenticonOptions,
): IdenticonMatrix {
  const hash = simpleHash(input);
  const bits = firstBits(hash, (sidePixels * sidePixels) / 2);
  const matrix: number[][] = [];
  for (let i = 0; i < sidePixels; i++) {
    for (let j = 0; j < sidePixels / 2; j++) {
      if (j === 0) {
        matrix[i] = [];
      }
      const value = i * (sidePixels / 2) + j;
      matrix[i][j] = bits[value];
      // mirrored position
      matrix[i][sidePixels - j - 1] = bits[value];
    }
  }
  return { matrix, hash };
}
