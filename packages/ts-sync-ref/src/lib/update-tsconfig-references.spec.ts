import { updateTsconfigReferences } from './update-tsconfig-references';

describe('updateTsconfigReferences', () => {
  it('updates existing references in tsconfig.json', async () => {
    const tsconfigFile = `{
      "compilerOptions": {},
      "references": [
        {"path": "old/path1"},
        {"path": "old/path2"}
      ]
    }`;
    const newPaths = ['new/path1', 'new/path2'];

    const result = updateTsconfigReferences(tsconfigFile, newPaths);

    expect(result).toContain('new/path1');
    expect(result).toContain('new/path2');
    expect(result).not.toContain('old/path1');
    expect(result).not.toContain('old/path2');
  });

  it('adds new references to an empty tsconfig.json', () => {
    const tsconfigFile = `{
      "compilerOptions": {}
    }`;
    const newPaths = ['new/path1', 'new/path2'];

    const result = updateTsconfigReferences(tsconfigFile, newPaths);

    expect(result).toContain('new/path1');
    expect(result).toContain('new/path2');
  });

  it('handles an empty paths array properly', () => {
    const tsconfigFile = `{
      "compilerOptions": {},
      "references": [
        {"path": "old/path1"},
        {"path": "old/path2"}
      ]
    }`;
    const newPaths: string[] = [];

    const result = updateTsconfigReferences(tsconfigFile, newPaths);

    expect(result).not.toContain('old/path1');
    expect(result).not.toContain('old/path2');
  });

  // More tests to be written for other scenarios
});
