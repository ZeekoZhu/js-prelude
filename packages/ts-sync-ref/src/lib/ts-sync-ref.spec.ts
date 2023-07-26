import { tsSyncRef } from './ts-sync-ref';

describe('tsSyncRef', () => {
  it('should work', () => {
    expect(tsSyncRef()).toEqual('ts-sync-ref');
  });
});
