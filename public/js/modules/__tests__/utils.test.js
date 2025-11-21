
import { validateDate, calculatePrice } from '../utils.js';

describe('validateDate', () => {
  test('returns true for a future date', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    expect(validateDate(futureDate.toISOString().split('T')[0])).toBe(true);
  });

  test('returns false for a past date', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    expect(validateDate(pastDate.toISOString().split('T')[0])).toBe(false);
  });
});

describe('calculatePrice', () => {
  test('calculates price for single room', () => {
    expect(calculatePrice('single', 2)).toBe(100);
  });

  test('calculates price for double room', () => {
    expect(calculatePrice('double', 3)).toBe(240);
  });

  test('calculates price for dorm room', () => {
    expect(calculatePrice('dorm', 1)).toBe(30);
  });
});
