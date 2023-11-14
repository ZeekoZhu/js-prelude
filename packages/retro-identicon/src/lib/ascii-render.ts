import { IdenticonMatrix } from './retro-identicon';

export function asciiRender(m: IdenticonMatrix) {
  const { matrix } = m;
  return matrix
    .map((row) => row.map((value) => (value === 0 ? '   ' : '███')).join(''))
    .join('\n');
}
