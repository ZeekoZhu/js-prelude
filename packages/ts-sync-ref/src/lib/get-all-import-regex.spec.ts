import { getImportModuleIdInFile } from './get-all-import-regex';

describe('getImportModuleIdInFile', () => {
  test('returns empty array when there are no imports', () => {
    const code = `const foo = 'bar';`;
    const result = getImportModuleIdInFile(code);
    expect(result).toEqual([]);
  });

  test('returns module id for single static import statement', () => {
    const code = `import { foo } from 'bar';`;
    const result = getImportModuleIdInFile(code);
    expect(result).toEqual(['bar']);
  });

  test('returns module id for multiple static import statements', () => {
    const code = `
      import { foo } from 'bar';
      import { baz } from '../baz';
    `;
    const result = getImportModuleIdInFile(code);
    expect(result).toEqual(['bar', '../baz']);
  });

  test('returns module id for dynamic import statements', () => {
    const code = `const foo = import('bar');`;
    const result = getImportModuleIdInFile(code);
    expect(result).toEqual(['bar']);
  });

  test('returns module id for multiple dynamic import statements', () => {
    const code = `
      const foo = import('bar');
      const baz = import('../baz');
    `;
    const result = getImportModuleIdInFile(code);
    expect(result).toEqual(['bar', '../baz']);
  });

  test('returns module id for side effect import statements', () => {
    const code = `import 'bar';`;
    const result = getImportModuleIdInFile(code);
    expect(result).toEqual(['bar']);
  });

  test('returns module id for multiple side effect import statements', () => {
    const code = `
      import 'bar';
      import '../baz';
    `;
    const result = getImportModuleIdInFile(code);
    expect(result).toEqual(['bar', '../baz']);
  });
});
