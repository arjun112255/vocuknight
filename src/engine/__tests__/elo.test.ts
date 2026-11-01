import { describe, it, expect } from 'vitest';
import { calculateElo, calculateMatchRating, MIN_RATING } from '../elo';

describe('calculateElo', () => {
  it('gives positive rating delta on win against equal rating', () => {
    const { delta, newRating } = calculateElo(1000, 1000, 1);
    expect(delta).toBe(16);
    expect(newRating).toBe(1016);
  });

  it('gives negative rating delta on loss against equal rating', () => {
    const { delta, newRating } = calculateElo(1000, 1000, 0);
    expect(delta).toBe(-16);
    expect(newRating).toBe(984);
  });

  it('gives delta 0 on draw against equal rating', () => {
    const { delta, newRating } = calculateElo(1000, 1000, 0.5);
    expect(delta).toBe(0);
    expect(newRating).toBe(1000);
  });

  it('gives larger positive delta when winning against a higher rated opponent', () => {
    const winStronger = calculateElo(1000, 1400, 1);
    const winEqual = calculateElo(1000, 1000, 1);
    expect(winStronger.delta).toBeGreaterThan(winEqual.delta);
  });

  it('gives larger loss penalty when losing to a lower rated opponent', () => {
    const loseWeaker = calculateElo(1200, 800, 0);
    const loseEqual = calculateElo(1200, 1200, 0);
    expect(loseWeaker.delta).toBeLessThan(loseEqual.delta);
  });

  it('never drops below MIN_RATING (100)', () => {
    const { newRating } = calculateElo(105, 1500, 0);
    expect(newRating).toBeGreaterThanOrEqual(MIN_RATING);
  });
});

describe('calculateMatchRating', () => {
  it('strictly returns delta 0 for Squire matches on win', () => {
    const result = calculateMatchRating(1000, 1000, 1, 'squire');
    expect(result.delta).toBe(0);
    expect(result.newRating).toBe(1000);
  });

  it('strictly returns delta 0 for Squire matches on loss', () => {
    const result = calculateMatchRating(1000, 1000, 0, 'squire');
    expect(result.delta).toBe(0);
    expect(result.newRating).toBe(1000);
  });

  it('strictly returns delta 0 for Squire matches on draw', () => {
    const result = calculateMatchRating(1000, 1000, 0.5, 'squire');
    expect(result.delta).toBe(0);
    expect(result.newRating).toBe(1000);
  });

  it('updates rating for Knight matches on win', () => {
    const result = calculateMatchRating(1000, 1000, 1, 'knight');
    expect(result.delta).toBe(16);
    expect(result.newRating).toBe(1016);
  });

  it('updates rating for Knight matches on loss', () => {
    const result = calculateMatchRating(1000, 1000, 0, 'knight');
    expect(result.delta).toBe(-16);
    expect(result.newRating).toBe(984);
  });
});
