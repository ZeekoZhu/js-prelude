import { asciiRender } from './ascii-render';
import { retroIdenticon } from './retro-identicon';

describe('retroIdenticon', () => {
  it('should work', () => {
    const result = retroIdenticon('zeeko', { sidePixels: 10 });
    expect(asciiRender(result)).toMatchInlineSnapshot(`
      "███         ██████         ███
      ███      ███      ███      ███
                  ██████            
      ███   ██████      ██████   ███
      █████████            █████████
         ███   ████████████   ███   
      ███   ███            ███   ███
         ██████            ██████   
            ███   ██████   ███      
         █████████      █████████   "
    `);
  });
});
