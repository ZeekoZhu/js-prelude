import { PrebundleOptions } from '../types';

interface MergeRule {
  moduleIdPrefix: string;
  ruleName: string;
}

export class ModuleMergeRules {
  rules: MergeRule[] = [];

  constructor(mergeConfig: Exclude<PrebundleOptions['merge'], undefined>) {
    for (const ruleName in mergeConfig) {
      const prefixList = mergeConfig[ruleName];
      for (const moduleIdPrefix of prefixList) {
        this.rules.push({ moduleIdPrefix, ruleName });
      }
    }
  }

  getRule(moduleId: string) {
    return this.rules.find((it) => moduleId.startsWith(it.moduleIdPrefix))
      ?.ruleName;
  }
}
