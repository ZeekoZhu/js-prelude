import { describe, it, vi } from 'vitest';
import { convertToAbsolutePath } from './path-utils';

describe('convertToAbsolutePath', () => {
  it('Should return the same path if the input path is already an absolute path', () => {
    const mockPath = '/absolute/path/to/file';

    const result = convertToAbsolutePath(mockPath);

    expect(result).toEqual('/absolute/path/to/file');
  });

  it('Should return the absolute path combining with process.cwd if the input path is a relative path', () => {
    const mockPath = 'relative/path/to/file';
    const mockCwd = '/mock/cwd';

    vi.spyOn(process, 'chdir').mockReturnValue();
    vi.spyOn(process, 'cwd').mockReturnValue(mockCwd);

    const result = convertToAbsolutePath(mockPath);

    expect(result).toEqual('/mock/cwd/relative/path/to/file');
  });
});
