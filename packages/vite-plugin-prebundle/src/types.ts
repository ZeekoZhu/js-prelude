export interface PreBundleEntry {
  moduleId: string;
  moduleFilePath: string;
  exports: string[];
  isCommonJS: boolean;
  exportAs?: string;
}

export interface PrebundleOptions {
  /**
   * Create prebundle entries for the specified modules.
   */
  include?: string[];
  /**
   * Avoid creating prebundle entries for the specified modules, but these modules will still be included in the final bundle.
   */
  exclude?: RegExp[];
  /**
   * Merge multiple entry modules into a single module, each of them is
   * reexported with a new name, which can reduce the
   * number of output files.
   */
  merge?: Record<string, string[]>;
}
