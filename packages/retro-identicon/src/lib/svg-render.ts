import { IdenticonMatrix } from './retro-identicon';

function proportionalHue(n: number) {
  return Math.ceil(n * 360);
}

function generateForeground(matrix: number[][], fill: string) {
  // generate a path for all blocks with value 1
  const path: string[] = [];
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      const value = matrix[i][j];
      if (value === 1) {
        const drawPath = `M${j} ${i} h1 v1 h-1 z`;
        path.push(drawPath);
      }
    }
  }
  return `<path d="${path.join(' ')}" fill="${fill}"/>`;
}

export function svgRender(m: IdenticonMatrix) {
  const { matrix, hash } = m;
  // take the last 9 bits of the hash as the foreground color hue
  const fgHue = Number(hash & BigInt(0x1ff));
  const fgColor = `hsl(${proportionalHue(fgHue / 511)}, 70%, 60%)`;
  // take the next 9 bits of the hash as the background color hue
  const bgHue = Number((hash >> BigInt(9)) & BigInt(0x1ff));
  const bgColor = `hsl(${proportionalHue(bgHue / 511)}, 70%, 40%)`;
  const svgTagOpen = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${matrix.length} ${matrix.length}">`;
  const bgRect = `<rect x="0" y="0" width="${matrix.length}" height="${matrix.length}" stroke="none" fill="${bgColor}"/>`;
  const svgTagClose = '</svg>';
  const rects = generateForeground(matrix, fgColor);
  return svgTagOpen + bgRect + rects + svgTagClose;
}
