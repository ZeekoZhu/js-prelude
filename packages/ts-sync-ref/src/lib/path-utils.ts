import process from 'process';
import { path } from 'zx';

export function convertToAbsolutePath(pathLike: string): string {
  return path.isAbsolute(pathLike)
    ? pathLike
    : path.join(process.cwd(), pathLike);
}
