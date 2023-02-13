/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IMatcher {
  matches(obj: any): any[];

  setValue(obj: any, value: any): void;
}

export type KeyType = string | number;

class KeyMatcher implements IMatcher {
  constructor(public key: KeyType) {}

  matches(obj: any) {
    if (Object.prototype.hasOwnProperty.call(obj, this.key)) {
      return [obj[this.key]];
    }
    return [];
  }

  setValue(obj: any, value: any) {
    obj[this.key] = value;
  }
}

class AllValuesMatcher implements IMatcher {
  matches(obj: any) {
    return Object.values(obj);
  }

  setValue(obj: any, value: any) {
    Object.keys(obj).forEach((key) => {
      obj[key] = value;
    });
  }
}

class PredicateMatcher implements IMatcher {
  constructor(public predicate: (key: KeyType, value: unknown) => boolean) {}

  matches(obj: any) {
    return Object.entries(obj)
      .filter(([key, val]) => {
        try {
          return this.predicate(key, val);
        } catch (e) {
          throw new Error(
            `Error in predicate function called with key: ${key}, value: ${JSON.stringify(
              val,
            )}: ${e}`,
          );
        }
      })
      .map(([, value]) => value);
  }

  setValue(obj: any, value: any) {
    Object.keys(obj).forEach((key) => {
      if (this.predicate(key, obj[key])) {
        obj[key] = value;
      }
    });
  }
}

export class Matcher {
  /**
   * Matches all values in an object
   */
  static all: IMatcher = new AllValuesMatcher();

  private constructor() {
    // ignore
  }

  /**
   * Matches a specific key in an object
   * @param key
   */
  static key(key: KeyType): IMatcher {
    return new KeyMatcher(key);
  }

  /**
   * Matches a value in an object based on a predicate function
   * @param predicate
   */
  static when(predicate: (key: KeyType, value: any) => boolean): IMatcher {
    return new PredicateMatcher(predicate);
  }
}

function normalizeMatcher(value: IMatcher | KeyType) {
  if (typeof value === 'string' || typeof value === 'number') {
    return Matcher.key(value);
  }
  return value;
}

/**
 * Accessor class to get and set values in a complex object
 */
export class Accessor<TObj, TValue> {
  public matcherList: IMatcher[] = [];

  /**
   * Creates a new accessor that matches the given matchers.
   * The matchers are applied in a 'path like' style.
   * @param matcherList
   */
  constructor(...matcherList: (IMatcher | KeyType)[]) {
    this.matcherList = matcherList.map(normalizeMatcher);
  }

  /**
   * Gets the value of the object
   * @param object
   * @returns it always returns an array, even if there is only one value
   */
  get(object: TObj): TValue[] {
    const matchers = this.matcherList;
    return this.getValue({ obj: object, matchers: matchers });
  }

  private getValue({
    obj,
    matchers,
    retrieveParentObjects,
  }: {
    obj: TObj;
    matchers: IMatcher[];
    retrieveParentObjects?: boolean;
  }) {
    let result: any[] = [obj];
    const lastIndex = retrieveParentObjects
      ? matchers.length - 1
      : matchers.length;
    for (let i = 0; i < lastIndex; i++) {
      try {
        const matcher = matchers[i];
        result = result.flatMap((obj) => matcher.matches(obj));
      } catch (e) {
        throw new Error(
          `Failed to match object with matcher at index ${i}. ${e}`,
        );
      }
    }
    return result;
  }

  /**
   * Sets the value of the object
   * @param object
   * @param value
   */
  set(object: TObj, value: TValue): void {
    const parentObjects = this.getValue({
      obj: object,
      matchers: this.matcherList,
      retrieveParentObjects: true,
    });
    const lastMatcher = this.matcherList[this.matcherList.length - 1];
    parentObjects.forEach((parentObject) => {
      lastMatcher.setValue(parentObject, value);
    });
  }
}
