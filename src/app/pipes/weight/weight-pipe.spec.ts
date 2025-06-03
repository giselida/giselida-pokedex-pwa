import { WeightPipe } from './weight-pipe';

describe('WeightPipe', () => {
  let pipeInstance: WeightPipe;

  beforeEach(() => {
    pipeInstance = new WeightPipe();
  });

  it('returns "0.0 Kg" for zero or negative values', () => {
    expect(pipeInstance.transform(0)).toBe('0.0 Kg');
    expect(pipeInstance.transform(-3)).toBe('0.0 Kg');
  });

  it('formats single-digit values as grams', () => {
    expect(pipeInstance.transform(7)).toBe('0.7 Kg');
  });

  it('formats two-digit values as kilograms with one decimal place', () => {
    expect(pipeInstance.transform(12)).toBe('1.2Kg');
  });

  it('formats three-digit values correctly', () => {
    expect(pipeInstance.transform(125)).toBe('12.5Kg');
  });
});
