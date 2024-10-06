import { PrebundleOptions } from '../types';

export interface MergeRule {
  moduleIdPrefix?: string;
  matchModule?: RegExp;
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

  addRules(rules: MergeRule[]) {
    this.rules.push(...rules);
  }

  getRule(moduleId: string) {
    return this.rules.find((it) => this.isMatchModule(moduleId, it))?.ruleName;
  }

  private isMatchModule(moduleId: string, rule: MergeRule) {
    if (rule.moduleIdPrefix) {
      return moduleId.startsWith(rule.moduleIdPrefix);
    }
    if (rule.matchModule) {
      return rule.matchModule.test(moduleId);
    }
    return false;
  }
}
