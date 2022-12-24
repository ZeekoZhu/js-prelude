/* eslint-disable @typescript-eslint/no-explicit-any */
interface IMatcher {
  matches(obj: any): any[];

  setValue(obj: any, value: any): void;
}

class KeyMatcher implements IMatcher {
  constructor(public key: string) {}

  matches(obj: any) {
    return [obj[this.key]];
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

export class Matcher {
  static all = new AllValuesMatcher();

  private constructor() {
    // ignore
  }

  static key(key: string) {
    return new KeyMatcher(key);
  }
}

function normalizeMatcher(value: IMatcher | string) {
  if (typeof value === 'string') {
    return Matcher.key(value);
  }
  return value;
}

export class Accessor<TObj, TValue> {
  public matcherList: IMatcher[] = [];

  constructor(...matcherList: (IMatcher | string)[]) {
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
      result = result.flatMap((obj) => matchers[i].matches(obj));
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
