export class ImportCounter {
  private imports: Map<string, number> = new Map();

  constructor(private blockList: RegExp[]) {}

  /**
   * Add an import to the counter
   * @param id
   * @param count
   */
  addImport(id: string, count = 1) {
    if (this.isBlocked(id)) {
      return;
    }
    const currentCount = this.imports.get(id) || 0;
    this.imports.set(id, currentCount + count);
  }

  /**
   * Get the imports
   */
  getImports() {
    return this.imports;
  }

  /**
   * Merge another counter into this one
   * @param other
   */
  merge(other: ImportCounter) {
    for (const [id, count] of other.getImports()) {
      this.addImport(id, count);
    }
  }

  /**
   * Check if an import is blocked
   * @param id
   * @private
   */
  private isBlocked(id: string): boolean {
    return this.blockList.some((it) => it.test(id));
  }
}
