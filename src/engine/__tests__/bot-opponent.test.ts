import { describe, it, expect, vi } from 'vitest';
import {
  BotOpponent,
  calculateKnightAccuracy,
  calculateBotPaceMs,
} from '../opponent';
import { DuelQuestion, WordCard } from '../types';

describe('calculateKnightAccuracy formula', () => {
  it('returns exactly 0.5 at 700 rating', () => {
    expect(calculateKnightAccuracy(700)).toBeCloseTo(0.5);
  });

  it('returns exactly 0.75 at 1000 rating', () => {
    expect(calculateKnightAccuracy(1000)).toBeCloseTo(0.75);
  });

  it('clamps to lower bound 0.45 for low ratings', () => {
    expect(calculateKnightAccuracy(500)).toBe(0.45);
    expect(calculateKnightAccuracy(100)).toBe(0.45);
  });

  it('clamps to upper bound 0.92 for high ratings', () => {
    expect(calculateKnightAccuracy(1400)).toBe(0.92);
    expect(calculateKnightAccuracy(2000)).toBe(0.92);
  });
});

describe('calculateBotPaceMs', () => {
  it('generates pace between 5000ms and 7000ms for Squire', () => {
    for (let i = 0; i < 20; i++) {
      const pace = calculateBotPaceMs('squire', 800);
      expect(pace).toBeGreaterThanOrEqual(5000);
      expect(pace).toBeLessThanOrEqual(7000);
    }
  });

  it('generates pace between 2500ms and 5000ms for Knight', () => {
    for (let i = 0; i < 20; i++) {
      const pace = calculateBotPaceMs('knight', 1000);
      expect(pace).toBeGreaterThanOrEqual(2500);
      expect(pace).toBeLessThanOrEqual(5000);
    }
  });
});

describe('BotOpponent lifecycle', () => {
  it('initializes Squire with accuracy between 55% and 70%', () => {
    const squire = new BotOpponent({ type: 'squire' });
    expect(squire.info.type).toBe('squire');
    expect(squire.accuracy).toBeGreaterThanOrEqual(0.55);
    expect(squire.accuracy).toBeLessThanOrEqual(0.70);
  });

  it('initializes Knight with rating within 120 points of player', () => {
    const knight = new BotOpponent({ type: 'knight', playerRating: 1000 });
    expect(knight.info.type).toBe('knight');
    expect(knight.info.rating).toBeGreaterThanOrEqual(880);
    expect(knight.info.rating).toBeLessThanOrEqual(1120);
    expect(knight.accuracy).toBe(calculateKnightAccuracy(knight.info.rating));
  });

  it('triggers study ready callback via tick', () => {
    const bot = new BotOpponent({
      type: 'squire',
      readyPercent: 0.8, // Exactly 80%
    });

    const onReady = vi.fn();
    // 60-second window -> ready at 48,000 ms
    bot.onStudyStart(60, onReady);

    bot.tick(40000);
    expect(onReady).not.toHaveBeenCalled();

    bot.tick(8000);
    expect(onReady).toHaveBeenCalledTimes(1);

    // Further ticks shouldn't re-trigger
    bot.tick(5000);
    expect(onReady).toHaveBeenCalledTimes(1);
  });

  it('emits duel answers over time when ticked', () => {
    const sampleCard: WordCard = {
      id: 'c1',
      word: 'valiant',
      definition: 'showing courage',
      partOfSpeech: 'adj',
      example: 'valiant knight',
      language: 'en',
    };

    const mockQuestion: DuelQuestion = {
      card: sampleCard,
      type: 'word_to_meaning',
      prompt: 'valiant',
      options: ['showing courage', 'weak', 'slow', 'fearful'],
      correctIndex: 0,
      distractors: [],
    };

    const bot = new BotOpponent({
      type: 'knight',
      rating: 1000,
      fixedPaceMs: 3000, // Exactly 3000ms per card
      accuracy: 1.0, // 100% accurate for testing
    });

    const onAnswer = vi.fn();
    bot.onDuelStart({
      getQuestion: () => mockQuestion,
      onAnswer,
    });

    // Advance 2900ms -> no answer yet
    bot.tick(2900);
    expect(onAnswer).not.toHaveBeenCalled();

    // Advance 100ms -> total 3000ms -> 1 answer
    bot.tick(100);
    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(onAnswer).toHaveBeenCalledWith(
      expect.objectContaining({
        cardIndex: 0,
        isCorrect: true,
      }),
    );

    // Advance another 3000ms -> 2nd answer
    bot.tick(3000);
    expect(onAnswer).toHaveBeenCalledTimes(2);
    expect(onAnswer).toHaveBeenLastCalledWith(
      expect.objectContaining({
        cardIndex: 1,
        isCorrect: true,
      }),
    );
  });
});
