#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { sortBy } from 'lodash-es';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { findProjectImports } from './utils';
import { fs } from 'zx';

async function scanImports(
  directory: string,
  threshold: number,
): Promise<string[]> {
  const imports = await findProjectImports(
    directory,
    [/^~/, /^\./, /\.css$/],
    threshold,
  );
  return sortBy(imports);
}

(async () => {
  const argv = await yargs(hideBin(process.argv))
    .option('directory', {
      alias: 'd',
      description: 'Directory path to scan for imports',
      type: 'string',
    })
    .option('threshold', {
      alias: 't',
      description:
        'Threshold for import count, only include imports that are used more than this number',
      type: 'number',
      default: 1,
    })
    .option('output', {
      alias: 'o',
      description: 'Output file path',
      type: 'string',
    })
    .check((argv) => {
      if (!argv.directory) {
        throw new Error('Please provide a directory path.');
      }
      if (!argv.output) {
        throw new Error('Please provide an output file path.');
      }
      return true;
    })
    .parse();
  const imports = await scanImports(argv.directory!, argv.threshold);
  await fs.writeFile(argv.output!, JSON.stringify(imports, null, 2));
})();
