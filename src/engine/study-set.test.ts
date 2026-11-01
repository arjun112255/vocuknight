import { describe, it, expect } from 'vitest';
import { selectStudySet } from './study-set';
import { Deck, WordCard } from './types';

/** Helper: build a deck with `size` synthetic cards. */
function makeDeck(size: number): Deck {
  const words: WordCard[] = Array.from({ length: size }, (_, i) => ({
    id: `word-${i}`,
    word: `word${i}`,
    definition: `definition of word${i}`,
    partOfSpeech: 'adj',
    example: `Example sentence for word${i}.`,
    language: 'en',
  }));
  return {
    id: 'test-deck',
    title: 'Test Deck',
    category: 'test',
    level: 'B1',
    language: 'en',
    words,
  };
}

describe('selectStudySet', () => {
  it('returns 10 cards for 1-min window', () => {
    const result = selectStudySet(makeDeck(30), 1);
    expect(result).toHaveLength(10);
  });

  it('returns 20 cards for 3-min window', () => {
    const result = selectStudySet(makeDeck(30), 3);
    expect(result).toHaveLength(20);
  });

  it('returns 30 cards for 5-min window', () => {
    const result = selectStudySet(makeDeck(30), 5);
    expect(result).toHaveLength(30);
  });

  it('clamps to deck size when deck is smaller than target', () => {
    const result = selectStudySet(makeDeck(15), 3);
    expect(result).toHaveLength(15);
  });

  it('uses whole deck when deck size equals target', () => {
    const deck = makeDeck(10);
    const result = selectStudySet(deck, 1);
    expect(result).toHaveLength(10);
    const ids = new Set(result.map((c) => c.id));
    for (const w of deck.words) {
      expect(ids.has(w.id)).toBe(true);
    }
  });

  it('all returned cards belong to the deck', () => {
    const deck = makeDeck(30);
    const deckIds = new Set(deck.words.map((w) => w.id));
    const result = selectStudySet(deck, 3);
    for (const c of result) {
      expect(deckIds.has(c.id)).toBe(true);
    }
  });

  it('returns no duplicate cards', () => {
    const result = selectStudySet(makeDeck(30), 3);
    const ids = result.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('prioritises missed cards in Squire mode', () => {
    const deck = makeDeck(30);
    const missedIds = ['word-0', 'word-1', 'word-2', 'word-3', 'word-4'];
    const result = selectStudySet(deck, 1, missedIds);
    expect(result).toHaveLength(10);
    const resultIds = new Set(result.map((c) => c.id));
    for (const id of missedIds) {
      expect(resultIds.has(id)).toBe(true);
    }
  });

  it('does not exceed target even with many missed cards', () => {
    const missedIds = Array.from({ length: 15 }, (_, i) => `word-${i}`);
    const result = selectStudySet(makeDeck(30), 1, missedIds);
    expect(result).toHaveLength(10);
  });

  it('works without missed cards (random selection)', () => {
    const deck = makeDeck(30);
    const result = selectStudySet(deck, 1);
    expect(result).toHaveLength(10);
    const deckIds = new Set(deck.words.map((w) => w.id));
    for (const c of result) {
      expect(deckIds.has(c.id)).toBe(true);
    }
  });

  it('produces different orderings across calls (shuffle check)', () => {
    const deck = makeDeck(30);
    const orders = new Set<string>();
    for (let i = 0; i < 20; i++) {
      const result = selectStudySet(deck, 5);
      orders.add(result.map((c) => c.id).join(','));
    }
    // With 30! permutations, 20 calls should yield more than 1 unique ordering.
    expect(orders.size).toBeGreaterThan(1);
  });
});
