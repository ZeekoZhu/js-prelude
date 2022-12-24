/* eslint-disable @typescript-eslint/no-explicit-any */
interface IMatcher {
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
          throw new Error(`Error in predicate function called with key: ${key}, value: ${JSON.stringify(val)}: ${e}`);
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
  static all = new AllValuesMatcher();

  private constructor() {
    // ignore
  }

  static key(key: KeyType) {
    return new KeyMatcher(key);
  }

  static when(predicate: (key: KeyType, value: any) => boolean) {
    return new PredicateMatcher(predicate);
  }
}

function normalizeMatcher(value: IMatcher | KeyType) {
  if (typeof value === 'string' || typeof value === 'number') {
    return Matcher.key(value);
  }
  return value;
}

export class Accessor<TObj, TValue> {
  public matcherList: IMatcher[] = [];

  constructor(...matcherList: (IMatcher | KeyType)[]) {
    this.matcherList = matcherList.map(normalizeMatcher);
  }

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
