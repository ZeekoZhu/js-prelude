import * as $ from 'zx';
import { getCompositeTsconfigPath } from './get-composite-tsconfig-path.js';

export interface IProjectInfo {
  moduleId: string;
  projectRoot: string;
  compositeTsconfigPath?: string;
}

export async function findProjects(
  monoRepoRoot: string,
): Promise<IProjectInfo[]> {
  const packageFiles = await $.globby(
    ['*/package.json', '*/*/package.json', '*/*/*/package.json'],
    {
      cwd: monoRepoRoot,
      gitignore: true,
      absolute: true,
    },
  );
  const tasks = packageFiles.map(extractProjectInfo);
  return await Promise.all(tasks);
}

async function extractProjectInfo(
  pathToPackageJson: string,
): Promise<IProjectInfo> {
  const projectRoot = $.path.dirname(pathToPackageJson);
  const packageJson = await $.fs.readFile(pathToPackageJson, 'utf-8');
  const moduleId = JSON.parse(packageJson).name;
  try {
    const compositeTsconfig = await getCompositeTsconfigPath(
      packageJson,
      projectRoot,
    );
    return { moduleId, projectRoot, compositeTsconfigPath: compositeTsconfig };
  } catch (e) {
    return { moduleId, projectRoot };
  }
}
