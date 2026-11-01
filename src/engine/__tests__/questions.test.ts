import { describe, it, expect } from 'vitest';
import {
  createDuelQuestion,
  selectDistractors,
  DuelQuestionStream,
} from '../questions';
import { Deck, WordCard } from '../types';

function makeDeckWithPOS(): Deck {
  const words: WordCard[] = [
    { id: 'w1', word: 'swift', definition: 'moving fast', partOfSpeech: 'adj', example: 'swift runner', language: 'en' },
    { id: 'w2', word: 'quick', definition: 'fast in action', partOfSpeech: 'adj', example: 'quick reply', language: 'en' },
    { id: 'w3', word: 'rapid', definition: 'happening fast', partOfSpeech: 'adj', example: 'rapid growth', language: 'en' },
    { id: 'w4', word: 'brisk', definition: 'active and fast', partOfSpeech: 'adj', example: 'brisk walk', language: 'en' },
    { id: 'w5', word: 'run', definition: 'move with legs fast', partOfSpeech: 'verb', example: 'run home', language: 'en' },
    { id: 'w6', word: 'sprint', definition: 'run at full speed', partOfSpeech: 'verb', example: 'sprint 100m', language: 'en' },
    { id: 'w7', word: 'dash', definition: 'run in a hurry', partOfSpeech: 'verb', example: 'dash out', language: 'en' },
    { id: 'w8', word: 'gallop', definition: 'run like a horse', partOfSpeech: 'verb', example: 'horses gallop', language: 'en' },
  ];

  return {
    id: 'pos-deck',
    title: 'POS Deck',
    category: 'test',
    level: 'A2',
    language: 'en',
    words,
  };
}

describe('selectDistractors', () => {
  it('selects 3 distractors from the deck excluding target', () => {
    const deck = makeDeckWithPOS();
    const target = deck.words[0];
    const distractors = selectDistractors(target, deck.words);

    expect(distractors).toHaveLength(3);
    for (const d of distractors) {
      expect(d.id).not.toBe(target.id);
    }
  });

  it('prefers distractors with matching part of speech', () => {
    const deck = makeDeckWithPOS();
    const target = deck.words[0]; // 'swift' is 'adj'
    const distractors = selectDistractors(target, deck.words);

    // There are 3 other adjectives in deck ('quick', 'rapid', 'brisk')
    // They score highest because of part-of-speech match
    const adjCount = distractors.filter((d) => d.partOfSpeech === 'adj').length;
    expect(adjCount).toBeGreaterThanOrEqual(2);
  });
});

describe('createDuelQuestion', () => {
  const deck = makeDeckWithPOS();
  const target = deck.words[0];

  it('creates a word_to_meaning question with 4 options and 1 correct answer', () => {
    const q = createDuelQuestion(target, deck.words, 'word_to_meaning');

    expect(q.prompt).toBe(target.word);
    expect(q.options).toHaveLength(4);
    expect(q.correctIndex).toBeGreaterThanOrEqual(0);
    expect(q.correctIndex).toBeLessThan(4);
    expect(q.options[q.correctIndex]).toBe(target.definition);
  });

  it('creates a meaning_to_word question with 4 options and 1 correct answer', () => {
    const q = createDuelQuestion(target, deck.words, 'meaning_to_word');

    expect(q.prompt).toBe(target.definition);
    expect(q.options).toHaveLength(4);
    expect(q.correctIndex).toBeGreaterThanOrEqual(0);
    expect(q.correctIndex).toBeLessThan(4);
    expect(q.options[q.correctIndex]).toBe(target.word);
  });

  it('contains unique options with no duplicates', () => {
    const q = createDuelQuestion(target, deck.words, 'word_to_meaning');
    const set = new Set(q.options);
    expect(set.size).toBe(4);
  });
});

describe('DuelQuestionStream', () => {
  it('returns identical questions for the same index across calls', () => {
    const deck = makeDeckWithPOS();
    const stream = new DuelQuestionStream(deck.words.slice(0, 4), deck);

    const q0_a = stream.getQuestion(0);
    const q0_b = stream.getQuestion(0);
    expect(q0_a).toBe(q0_b);

    const q3_a = stream.getQuestion(3);
    const q3_b = stream.getQuestion(3);
    expect(q3_a).toBe(q3_b);
  });

  it('continues beyond study set size by reshuffling', () => {
    const deck = makeDeckWithPOS();
    const studySet = deck.words.slice(0, 3);
    const stream = new DuelQuestionStream(studySet, deck);

    // Request 10 questions from a 3-card study set
    const questions = Array.from({ length: 10 }, (_, i) => stream.getQuestion(i));
    expect(questions).toHaveLength(10);
    for (const q of questions) {
      expect(q.options).toHaveLength(4);
    }
  });
});
