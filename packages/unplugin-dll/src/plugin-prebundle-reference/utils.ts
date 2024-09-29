import { fs } from 'zx';

import { PreBundleEntry } from '../types';

export function readManifest(pathToManifest: string): PreBundleEntry[] {
  return JSON.parse(
    fs.readFileSync(pathToManifest, 'utf8'),
  ) as PreBundleEntry[];
}

export const PLUGIN_NAME = 'plugin-prebundle-reference';

export class NamingCounter {
  private counter = new Map<string, number>();

  constructor(private prefix: string) {}

  next(name: string) {
    const postfix = this.counter.get(name) ?? 0;
    this.counter.set(name, postfix + 1);
    return `${this.prefix}_${name}$${postfix.toString(16)}`;
  }
}
