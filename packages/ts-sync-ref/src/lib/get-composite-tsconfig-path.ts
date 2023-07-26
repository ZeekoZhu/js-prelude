import { get } from 'lodash-es';
import * as $ from 'zx';

async function readCompositeTsconfigPathFromConfig(
  packageJson: string,
  projectRoot: string,
): Promise<string | undefined> {
  const compositeConfig = get(packageJson, 'ts-auto-ref');
  if (!compositeConfig) return undefined;
  const compositeTsconfigPath = $.path.join(projectRoot, compositeConfig);
  if (!(await $.fs.exists(compositeTsconfigPath))) {
    return undefined;
  }
  return compositeConfig;
}

const compositeRegex = /"composite"\s*:\s*true/;

function isCompositeTsconfig(tsconfigPath: string) {
  const tsconfig = $.fs.readFileSync(tsconfigPath, 'utf-8');
  return compositeRegex.test(tsconfig);
}

async function getTsconfigFile(projectRoot: string): Promise<string> {
  const tsconfigFiles = await $.globby(['tsconfig.json', 'tsconfig.*.json'], {
    cwd: projectRoot,
    gitignore: true,
    absolute: true,
  });
  const compositeConfig = tsconfigFiles.find((it) => isCompositeTsconfig(it));
  if (compositeConfig == null) {
    throw new Error(
      `Cannot find tsconfig.*.json with 'composite: true' in ${projectRoot}`,
    );
  }
  return $.path.basename(compositeConfig);
}

export async function getCompositeTsconfigPath(
  packageJson: string,
  projectRoot: string,
) {
  return (
    (await readCompositeTsconfigPathFromConfig(packageJson, projectRoot)) ||
    (await getTsconfigFile(projectRoot))
  );
}
