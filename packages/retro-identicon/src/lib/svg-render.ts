import { IdenticonMatrix } from './retro-identicon';

function createRect(x: number, y: number, fill: string) {
  return `<rect x="${x}" y="${y}" width="1" height="1" stroke="none" fill="${fill}"/>`;
}

function proportionalHue(n: number) {
  return Math.ceil(n * 360);
}

export function svgRender(m: IdenticonMatrix) {
  const { matrix } = m;
  const svgTagOpen = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${matrix.length} ${matrix.length}">`;
  const svgTagClose = '</svg>';
  // take the last 9 bits of the hash as the foreground color hue
  const fgHue = Number(m.hash & BigInt(0x1ff));
  const fgColor = `hsl(${proportionalHue(fgHue / 511)}, 70%, 60%)`;
  // take the next 9 bits of the hash as the background color hue
  const bgHue = Number((m.hash >> BigInt(9)) & BigInt(0x1ff));
  const bgColor = `hsl(${proportionalHue(bgHue / 511)}, 70%, 40%)`;
  const rects = matrix
    .map((row, i) =>
      row
        .map((value, j) => {
          if (value === 0) {
            // bg block
            return createRect(j, i, bgColor);
          }
          return createRect(j, i, fgColor);
        })
        .join(''),
    )
    .join('');
  return svgTagOpen + rects + svgTagClose;
}
