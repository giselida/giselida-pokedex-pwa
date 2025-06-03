import { HeightPipe } from './height-pipe';

describe('HeightPipe', () => {
  let pipeInstance: HeightPipe;

  beforeEach(() => {
    pipeInstance = new HeightPipe();
  });

  it('returns "0.0 cm" when the value is zero or negative', () => {
    expect(pipeInstance.transform(0)).toBe('0.0 cm');
    expect(pipeInstance.transform(-5)).toBe('0.0 cm');
  });

  it('formats single-digit values as centimeters', () => {
    expect(pipeInstance.transform(7)).toBe('70 cm');
  });

  it('formats two-digit values as meters with one decimal place', () => {
    expect(pipeInstance.transform(12)).toBe('1.20 m');
  });

  it('formats three-digit values correctly', () => {
    expect(pipeInstance.transform(125)).toBe('12.50 m');
  });
});
