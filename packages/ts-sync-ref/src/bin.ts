import * as process from 'process';
import { echo, argv, path, fs } from 'zx';

import { findProjects } from './lib/find-projects.js';
import { tryFormatTsconfig } from './lib/try-format-tsconfig.js';
import { getAllImportRegex } from './lib/get-all-import-regex.js';
import { updateTsconfigReferences } from './lib/update-tsconfig-references.js';

const tsconfigPath = argv['project'] || argv['p'] || 'tsconfig.json';
const sourceFileGlobPattern = argv['files'] || argv['f'] || 'src/**/*.ts';
const monorepoDir = argv['monorepo'] || argv['m'] || './';
const dryRun = argv['dry-run'] || false;
const verbose = argv['verbose'] || false;

if (verbose) {
  process.env['VERBOSE'] = 'true';
}

const imports = new Set(
  await getAllImportRegex(tsconfigPath, sourceFileGlobPattern),
);

const projects = await findProjects(monorepoDir);
const referencedProjects = projects.filter((it) => imports.has(it.moduleId));

echo`Found ${referencedProjects.length} referenced projects in ${imports.size} imports`;

const referencedProjectsTsconfig = referencedProjects
  .filter((it) => !!it.compositeTsconfigPath)
  .map((it) =>
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    path.join(it.projectRoot, it.compositeTsconfigPath!),
  )
  .map((it) => path.relative(path.dirname(tsconfigPath), it));

const tsconfigContent = await fs.readFile(tsconfigPath, 'utf-8');

const updatedTsconfig = updateTsconfigReferences(
  tsconfigContent,
  referencedProjectsTsconfig,
);
const formatted = await tryFormatTsconfig(updatedTsconfig, tsconfigPath);

echo`Updated tsconfig.json is \n${formatted}`;

if (dryRun) {
  echo`No changes made`;
  process.exit(0);
} else {
  await fs.writeFile(tsconfigPath, formatted);
  echo`Updated tsconfig.json`;
}
