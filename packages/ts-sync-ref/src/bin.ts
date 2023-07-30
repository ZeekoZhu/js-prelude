#!/usr/bin/env node
import * as process from 'process';
import { chalk, argv, echo, fs, path } from 'zx';

import { findProjects } from './lib/find-projects.js';
import { getAllImportRegex } from './lib/get-all-import-regex.js';
import { tryFormatTsconfig } from './lib/try-format-tsconfig.js';
import { updateTsconfigReferences } from './lib/update-tsconfig-references.js';
import { convertToAbsolutePath } from './lib/path-utils.js';

const tsconfigPath = convertToAbsolutePath(
  argv['project'] || argv['p'] || './tsconfig.json',
);
const sourceFileGlobPattern = convertToAbsolutePath(
  argv['files'] || argv['f'] || 'src/**/*.ts',
);
const monorepoDir = convertToAbsolutePath(
  argv['monorepo'] || argv['m'] || './',
);
const dryRun = argv['dry-run'] || false;
const verbose = argv['verbose'] || false;

const help = argv['help'] || argv['h'] || false;

if (help) {
  const helpText = `
Usage: ts-sync-ref [options]

Options:
  -p, --project <path>      Path to ${chalk.bold`project's`} tsconfig.json
                            default = './tsconfig.json'
  -f, --files <glob>        Glob pattern for source ${chalk.bold`files`},
                            relative to current working directory
                            default = 'src/**/*.ts'
  -m, --monorepo <path>     Path to ${chalk.bold`monorepo`} root
                            default = './'
  --dry-run                 Do not write to tsconfig.json
  --verbose                 Print verbose logs
  -h, --help                Display this message
`;
  echo(helpText);
  process.exit(0);
}

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
