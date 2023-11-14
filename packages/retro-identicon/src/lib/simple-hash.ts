/**
 * Simple hash function that generates 64-bit hash
 * @param value
 */
export const simpleHash = (value: string): bigint => {
  let hash = 0xcbf29ce484222325n;
  const prime = 0x100000001b3n;
  for (let i = 0; i < value.length; i++) {
    hash ^= BigInt(value.charCodeAt(i));
    hash *= prime;
  }
  // Return the hash as a 64-bit value
  return hash;
};
