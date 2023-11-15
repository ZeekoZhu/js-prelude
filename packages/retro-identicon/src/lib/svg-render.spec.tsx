import { retroIdenticon } from './retro-identicon';
import { svgRender } from './svg-render';

describe('svg-render', () => {
  it('should work', () => {
    const result = retroIdenticon('test', { sidePixels: 10 });
    const svg = svgRender(result);
    expect(svg).toBeTruthy();
  });
});
