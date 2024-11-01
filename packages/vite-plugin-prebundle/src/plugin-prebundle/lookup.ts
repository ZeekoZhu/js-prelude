/**
 * A one-to-many lookup table
 */
export class Lookup<T> {
  private map = new Map<string, Set<T>>();

  static fromRecord<T>(record: Record<string, T[]>) {
    const lookup = new Lookup<T>();
    for (const key in record) {
      for (const value of record[key]) {
        lookup.add(key, value);
      }
    }
    return lookup;
  }

  add(key: string, value: T) {
    let set = this.map.get(key);
    if (!set) {
      set = new Set();
      this.map.set(key, set);
    }
    set.add(value);
  }

  get(key: string) {
    return this.map.get(key);
  }

  has(key: string) {
    return this.map.has(key);
  }

  delete(key: string) {
    return this.map.delete(key);
  }

  clear() {
    this.map.clear();
  }

  *entries() {
    for (const [key, value] of this.map.entries()) {
      yield [key, value] as const;
    }
  }

  keys() {
    return this.map.keys();
  }
}
