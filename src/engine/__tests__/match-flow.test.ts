import { describe, it, expect } from 'vitest';
import { MatchEngine } from '../match-engine';
import { BotOpponent } from '../opponent';
import { Deck, WordCard } from '../types';

function createDeck(): Deck {
  const words: WordCard[] = [
    { id: 'w1', word: 'valiant', definition: 'brave and bold', partOfSpeech: 'adj', example: 'valiant knight', language: 'en' },
    { id: 'w2', word: 'frugal', definition: 'saving money', partOfSpeech: 'adj', example: 'frugal shopper', language: 'en' },
    { id: 'w3', word: 'lucid', definition: 'clear to see', partOfSpeech: 'adj', example: 'lucid dream', language: 'en' },
    { id: 'w4', word: 'candid', definition: 'direct and frank', partOfSpeech: 'adj', example: 'candid shot', language: 'en' },
    { id: 'w5', word: 'aloof', definition: 'standing apart', partOfSpeech: 'adj', example: 'aloof cat', language: 'en' },
    { id: 'w6', word: 'arduous', definition: 'hard work', partOfSpeech: 'adj', example: 'arduous climb', language: 'en' },
    { id: 'w7', word: 'bolster', definition: 'to support', partOfSpeech: 'verb', example: 'bolster courage', language: 'en' },
    { id: 'w8', word: 'copious', definition: 'plentiful', partOfSpeech: 'adj', example: 'copious rain', language: 'en' },
    { id: 'w9', word: 'diligent', definition: 'working hard', partOfSpeech: 'adj', example: 'diligent ant', language: 'en' },
    { id: 'w10', word: 'elusive', definition: 'hard to catch', partOfSpeech: 'adj', example: 'elusive fox', language: 'en' },
  ];

  return {
    id: 'test-deck',
    title: 'Flow Deck',
    category: 'test',
    level: 'A2',
    language: 'en',
    words,
  };
}

describe('Complete Match Flow Integration', () => {
  it('flows through Matchmaking -> Study -> Countdown -> Duel -> Results with missed cards and Not studied tags', () => {
    const deck = createDeck();
    const bot = new BotOpponent({
      type: 'knight',
      rating: 1050,
      fixedPaceMs: 4000,
      accuracy: 0.8,
    });

    const engine = new MatchEngine({
      deck,
      studyWindow: 1, // 10 cards
      opponent: bot,
      playerRating: 1000,
    });

    // 1. Lobby Phase
    expect(engine.getState().phase).toBe('lobby');

    // 2. Study Phase
    engine.startStudy();
    expect(engine.getState().phase).toBe('study');

    // Player flips 2 cards in study set
    const studySet = engine.getState().studySet;
    engine.flipCard(studySet[0].id);
    engine.flipCard(studySet[1].id);

    // Player marks ready
    engine.markPlayerReady();

    // Advance time until study concludes (60s)
    engine.tick(60000);

    // 3. Countdown Phase (3 seconds)
    expect(engine.getState().phase).toBe('countdown');
    engine.tick(3000);

    // 4. Duel Phase (60 seconds)
    expect(engine.getState().phase).toBe('duel');

    // Player answers first card correctly
    const q0 = engine.getState().currentQuestion!;
    engine.submitPlayerAnswer(q0.correctIndex);

    // Player answers second card with a wrong answer
    const q1 = engine.getState().currentQuestion!;
    const wrongIdx = (q1.correctIndex + 1) % 4;
    engine.submitPlayerAnswer(wrongIdx);

    // Complete duel by advancing 60 seconds
    engine.tick(60000);

    // 5. Results Phase
    const state = engine.getState();
    expect(state.phase).toBe('results');
    expect(state.result).not.toBeNull();

    const result = state.result!;
    expect(result.playerStats.score).toBe(1);
    expect(result.playerStats.wrong).toBe(1);
    expect(result.winner).toBeDefined();

    // Verify missed cards breakdown
    expect(result.missedCards.length).toBeGreaterThan(0);

    // Specifically verify the card answered incorrectly has chosenAnswer
    const wrongCardMissed = result.missedCards.find((m) => m.card.id === q1.card.id);
    expect(wrongCardMissed).toBeDefined();
    expect(wrongCardMissed?.chosenAnswer).toBeDefined();

    // Verify wasStudied flag matches whether card was flipped during study
    for (const missed of result.missedCards) {
      if (missed.card.id === studySet[0].id || missed.card.id === studySet[1].id) {
        expect(missed.wasStudied).toBe(true);
      } else {
        expect(missed.wasStudied).toBe(false);
      }
    }
  });
});
