import { trimStart } from 'lodash-es';
import { fs, glob, path } from 'zx';
import { PreBundleEntry } from '../types';
import { readManifest } from './utils';

export class PreBundleReferenceManager {
  private moduleLookup: Map<string, PreBundleEntry> = new Map();

  private readonly prebundleDir: string;

  constructor(public manifestFile: string, public publicPath: string) {
    this.prebundleDir = path.resolve(path.dirname(manifestFile));
    const manifest = readManifest(manifestFile);
    for (const entry of manifest) {
      this.moduleLookup.set(entry.moduleId, entry);
    }
  }

  async getPrebundleChunkFiles() {
    const chunkFiles = await glob(
      path.join(this.prebundleDir, 'pre-bundle-*.mjs'),
    );
    return Promise.all(
      chunkFiles.map(async (it) => ({
        fileName: path.join(trimStart(this.publicPath, '/'), path.basename(it)),
        code: await fs.readFile(it, 'utf-8'),
      })),
    );
  }

  getPreBundleFiles() {
    return this.getPrebundleChunkFiles();
  }

  getPreBundledModule(moduleId: string): PreBundleEntry | null {
    return this.moduleLookup.get(moduleId) ?? null;
  }

  async getPreBundledCode(moduleId: string) {
    const preBundle = this.moduleLookup.get(moduleId);
    if (!preBundle) {
      return null;
    }
    return await fs.readFile(
      path.resolve(this.prebundleDir, preBundle.moduleFilePath),
      'utf-8',
    );
  }

  async getPreBundleChunkCode(fileName: string) {
    return await fs.readFile(
      path.resolve(this.prebundleDir, fileName),
      'utf-8',
    );
  }

  getPreBundleModules() {
    return Array.from(this.moduleLookup.keys());
  }

  /**
   * Get the file system path of the prebundle file
   * @param prebundle
   */
  getPrebundleImportFsPath(prebundle: PreBundleEntry) {
    return path.resolve(this.prebundleDir, prebundle.moduleFilePath);
  }

  /**
   * Get the import path of the prebundle file
   * @param prebundle
   */
  getPreBundleImportPath(prebundle: PreBundleEntry) {
    return path.join(this.publicPath, prebundle.moduleFilePath);
  }
}
