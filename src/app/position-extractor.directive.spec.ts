import { PositionExtractorDirective } from './position-extractor.directive';

interface IEventMockInfo {
  target: HTMLElement;
  offsetX: number;
  offsetY: number;
}

class EventMock implements IEventMockInfo {
  public readonly target: HTMLElement;
  public readonly offsetX: number;
  public readonly offsetY: number;
  public constructor(config: IEventMockInfo) {
    this.target = config.target;
    this.offsetX = config.offsetX;
    this.offsetY = config.offsetY;
  }
}

describe('PositionExtractorDirective', () => {

  let directive: PositionExtractorDirective;

  beforeAll(() => {
    directive = new PositionExtractorDirective();
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should return values between -1 and 1', (done: DoneFn) => {
    const div: HTMLDivElement = document.createElement('div');
    directive.appPosition.subscribe((pos) => {
      console.log(pos);
      expect(pos[0]).toBeLessThanOrEqual(1);
      expect(pos[0]).toBeLessThanOrEqual(1);
      expect(pos[1]).toBeGreaterThanOrEqual(-1);
      expect(pos[1]).toBeGreaterThanOrEqual(-1);
      done();
    });

    // tslint:disable-next-line:no-magic-numbers
    div.style.height = '200px';
    // tslint:disable-next-line:no-magic-numbers
    div.style.width = '200px';
    const mEvent: EventMock = new EventMock({
      target: div,
      offsetX: 200,
      offsetY: 100
    });
    directive.onMouseMove(mEvent);
  });
});
