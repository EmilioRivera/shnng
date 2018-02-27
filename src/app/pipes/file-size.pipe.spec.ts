import { FileSizePipe } from './file-size.pipe';

describe('FileSizePipe', () => {
  it('create an instance', () => {
    const pipe: FileSizePipe = new FileSizePipe();
    expect(pipe).toBeTruthy();
  });
});
