export function omit<T>(obj: T, keys: (keyof T)[]): Omit<T, keyof typeof keys> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}
