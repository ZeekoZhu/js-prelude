export interface PreBundleEntry {
  moduleId: string;
  moduleFilePath: string;
  exports: string[];
  isCommonJS: boolean;
}

export interface PrebundleOptions {
  /**
   * Include the specified modules in the prebundle.
   */
  include?: string[];
  /**
   * Exclude the specified modules from the prebundle.
   */
  exclude?: RegExp[];
}
