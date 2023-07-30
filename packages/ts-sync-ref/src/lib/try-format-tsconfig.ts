import { echo, chalk } from 'zx';

export async function tryFormatTsconfig(code: string, tsconfigPath: string) {
  try {
    const prettier = (await import('prettier')).default;
    const options = (await prettier.resolveConfig(tsconfigPath)) ?? undefined;
    return prettier.format(code, { ...options, filepath: tsconfigPath });
  } catch (e) {
    echo(chalk.yellowBright('Cannot find prettier, skip formatting.'));
    console.log(e);
    return code;
  }
}
