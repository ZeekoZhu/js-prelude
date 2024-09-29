import { makeLegalIdentifier } from '@rollup/pluginutils';

export function makeIdentifierFromModuleId(moduleId: string) {
  // replace all `.` with `_dot_`
  // replace all `@` with `_at_`
  return makeLegalIdentifier(
    moduleId.replace(/\./g, '_dot_').replace(/@/g, '_at_'),
  );
}
