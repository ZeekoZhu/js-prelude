export interface PreBundleEntry {
  moduleId: string;
  moduleFilePath: string;
  exports: string[];
  isCommonJS: boolean;
  exportAs?: string;
}

export interface PrebundleOptions {
  /**
   * Create prebundle entries for the specified modules, each item in the
   * array must be a resolvable module id. Dependencies of these modules will be prebundled as well.
   */
  entries?: string[];
  /**
   * Avoid creating prebundle entries for the specified modules, but these modules might still be included in the final bundle if it is referenced by other prebundled modules.
   */
  exclude?: RegExp[];
  /**
   * Merge multiple entry modules into a single module, each of them is
   * reexported with a new name, which can reduce the
   * number of output files.
   */
  merge?: Record<string, string[]>;
}
