import { Accessor, KeyType } from './power-accessor.js';

export interface IObjectPointer<TObj extends object, T> {
  get(root: TObj): T;

  set(root: TObj, value: T): void;

  remove(root: TObj): void;

  getReferenceHolder<TR>(root: TObj): TR;
}

export class ObjectPointer<TObj extends object, T>
  implements IObjectPointer<TObj, T>
{
  constructor(
    protected objectGetter: (root: TObj) => object,
    protected key: KeyType,
  ) {}

  getReferenceHolder<TR>(root: TObj): TR {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.objectGetter(root);
  }

  get(root: TObj): T {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.objectGetter(root)[this.key];
  }

  remove(root: TObj): void {
    const parent = this.objectGetter(root);
    if (Array.isArray(parent) && typeof this.key === 'number') {
      parent.splice(this.key, 1);
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      delete parent[this.key];
    }
  }

  set(root: TObj, value: T): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.objectGetter(root)[this.key] = value;
  }
}

type PathType = KeyType[];

export function pathToPointer(path: PathType) {
  if (path.length < 1) {
    throw new Error('path should have at least 1 elements');
  }
  return new ObjectPointer((root) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let obj: any = root;
    for (let i = 0; i < path.length - 1; i++) {
      obj = obj[path[i]];
    }
    return obj;
  }, path[path.length - 1]);
}

export function toPointers<TObj extends object, T>(
  accessor: Accessor<TObj, T>,
  obj: TObj,
): IObjectPointer<TObj, T>[] {
  const matchers = accessor.matcherList;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let paths = [[[], obj]] as [PathType, any][];
  for (const matcher of matchers) {
    paths = paths.flatMap(([path, child]) => {
      const matches = matcher.matches(child);
      return matches.map(([key, value]) => {
        return [[...path, key], value] as [PathType, any];
      });
    });
  }
  return paths.map((it) => pathToPointer(it[0])) as IObjectPointer<TObj, T>[];
}
