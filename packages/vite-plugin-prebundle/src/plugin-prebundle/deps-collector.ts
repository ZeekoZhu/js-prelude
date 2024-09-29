import { PluginContext } from 'rollup';

/**
 * Collect dependencies for a set of module during the `resolve` phase of Vite.
 */
export class DepsCollector {
  /**
   * Modules that can be resolved
   * @private
   */
  public deps = new Set<string>();
  private queue: string[] = [];
  private done = false;

  /**
   * Add a module ID to the queue. This method should be call in the `resolve` phase of Vite.
   * @param id
   */
  addToQueue(id: string) {
    if (this.done) {
      return;
    }
    this.queue.push(id);
  }

  async collectWithVite(ctx: PluginContext) {
    if (this.done) {
      console.warn('[collect-deps] Collecting is done, cannot collect again');
      return;
    }
    const queue = this.queue;
    while (queue.length > 0) {
      const id = queue.pop();
      if (!id || id.startsWith('.')) {
        continue;
      }
      if (this.deps.has(id)) {
        continue;
      }
      const resolution = await ctx.resolve(id, undefined, {
        isEntry: false,
        skipSelf: false,
      });
      if (!resolution) {
        ctx.warn(`[collect-deps] Cannot resolve module: ${id}`);
        continue;
      }
      this.deps.add(id);
      await ctx.load({ ...resolution, resolveDependencies: true });
    }
    this.done = true;
  }
}
