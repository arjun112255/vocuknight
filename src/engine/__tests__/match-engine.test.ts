import { describe, it, expect, vi } from 'vitest';
import { MatchEngine } from '../match-engine';
import { BotOpponent } from '../opponent';
import { Deck, WordCard } from '../types';

function createTestDeck(): Deck {
  const words: WordCard[] = Array.from({ length: 20 }, (_, i) => ({
    id: `card-${i}`,
    word: `word-${i}`,
    definition: `definition for word-${i}`,
    partOfSpeech: 'noun',
    example: `Example sentence for word-${i}`,
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

describe('MatchEngine State Machine & Lifecycle', () => {
  it('initializes in lobby phase with correct study set size', () => {
    const deck = createTestDeck();
    const opponent = new BotOpponent({ type: 'squire' });
    const engine = new MatchEngine({
      deck,
      studyWindow: 1, // 10 cards
      opponent,
    });

    const state = engine.getState();
    expect(state.phase).toBe('lobby');
    expect(state.studySet).toHaveLength(10);
    expect(state.playerScore).toBe(0);
    expect(state.opponentScore).toBe(0);
    expect(state.result).toBeNull();
  });

  it('progresses from lobby to study on startStudy()', () => {
    const deck = createTestDeck();
    const opponent = new BotOpponent({ type: 'squire' });
    const engine = new MatchEngine({
      deck,
      studyWindow: 1,
      opponent,
    });

    engine.startStudy();
    const state = engine.getState();
    expect(state.phase).toBe('study');
    expect(state.timeRemainingMs).toBe(60 * 1000);
  });

  it('records card flips during study phase', () => {
    const deck = createTestDeck();
    const opponent = new BotOpponent({ type: 'squire' });
    const engine = new MatchEngine({
      deck,
      studyWindow: 1,
      opponent,
    });

    engine.startStudy();
    const cardId = engine.getState().studySet[0].id;
    engine.flipCard(cardId);

    expect(engine.getState().flippedCardIds.has(cardId)).toBe(true);
  });

  it('transitions to countdown early when both players are ready', () => {
    const deck = createTestDeck();
    const opponent = new BotOpponent({
      type: 'squire',
      readyPercent: 0.5, // Ready halfway through
    });
    const engine = new MatchEngine({
      deck,
      studyWindow: 1, // 60s
      opponent,
    });

    engine.startStudy();
    engine.markPlayerReady();
    expect(engine.getState().phase).toBe('study');

    // Advance 30s -> opponent readies at 50%
    engine.tick(30000);
    expect(engine.getState().phase).toBe('countdown');
    expect(engine.getState().timeRemainingMs).toBe(3000);
  });

  it('countdown lasts exactly 3 seconds (3000ms)', () => {
    const deck = createTestDeck();
    const opponent = new BotOpponent({
      type: 'squire',
      readyPercent: 0.1,
    });
    const engine = new MatchEngine({
      deck,
      studyWindow: 1,
      opponent,
    });

    engine.startStudy();
    engine.markPlayerReady();
    engine.tick(10000); // Trigger countdown
    expect(engine.getState().phase).toBe('countdown');

    engine.tick(2000);
    expect(engine.getState().phase).toBe('countdown');
    expect(engine.getState().timeRemainingMs).toBe(1000);

    engine.tick(1000);
    expect(engine.getState().phase).toBe('duel');
    expect(engine.getState().timeRemainingMs).toBe(60000);
  });

  it('handles duel scoring and transitions to results after 60s', () => {
    const deck = createTestDeck();
    const opponent = new BotOpponent({
      type: 'knight',
      rating: 1000,
      fixedPaceMs: 5000,
      accuracy: 1.0, // Bot answers correctly every 5s
    });
    const engine = new MatchEngine({
      deck,
      studyWindow: 1,
      opponent,
      playerRating: 1000,
    });

    engine.startStudy();
    engine.markPlayerReady();
    engine.tick(60000); // Complete study via timer expiry
    engine.tick(3000); // Complete countdown
    expect(engine.getState().phase).toBe('duel');

    // Player answers card 0 correctly
    const q0 = engine.getState().currentQuestion!;
    engine.submitPlayerAnswer(q0.correctIndex);
    expect(engine.getState().playerScore).toBe(1);

    // Player answers card 1 incorrectly
    const q1 = engine.getState().currentQuestion!;
    const wrongIdx = (q1.correctIndex + 1) % 4;
    engine.submitPlayerAnswer(wrongIdx);
    expect(engine.getState().playerScore).toBe(1);

    // Advance duel clock by 60s
    engine.tick(60000);

    const finalState = engine.getState();
    expect(finalState.phase).toBe('results');
    expect(finalState.result).not.toBeNull();
    expect(finalState.result?.playerStats.score).toBe(1);
    expect(finalState.result?.playerStats.wrong).toBe(1);
    expect(finalState.result?.opponentStats.score).toBeGreaterThan(0);
    expect(typeof finalState.result?.ratingDelta).toBe('number');
  });

  it('notifies subscribers on state updates', () => {
    const deck = createTestDeck();
    const opponent = new BotOpponent({ type: 'squire' });
    const engine = new MatchEngine({
      deck,
      studyWindow: 1,
      opponent,
    });

    const listener = vi.fn();
    const unsubscribe = engine.subscribe(listener);

    // Called immediately with initial state
    expect(listener).toHaveBeenCalledTimes(1);

    engine.startStudy();
    expect(listener).toHaveBeenCalledTimes(2);

    unsubscribe();
    engine.markPlayerReady();
    expect(listener).toHaveBeenCalledTimes(2); // No new call after unsubscribe
  });
});
