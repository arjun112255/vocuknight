import { describe, it, expect } from 'vitest';
import { aggregatePlayerStats, determineWinner } from '../scoring';
import { PlayerStats } from '../types';

describe('aggregatePlayerStats', () => {
  it('correctly scores 1 point per correct card and 0 for wrong', () => {
    const answers = [
      { isCorrect: true, timeMs: 2000 },
      { isCorrect: false, timeMs: 3000 },
      { isCorrect: true, timeMs: 1000 },
      { isCorrect: false, timeMs: 4000 },
      { isCorrect: true, timeMs: 2000 },
    ];

    const stats = aggregatePlayerStats(answers);
    expect(stats.score).toBe(3);
    expect(stats.wrong).toBe(2);
    expect(stats.totalAnswers).toBe(5);
    expect(stats.totalAnswerTimeMs).toBe(12000);
    expect(stats.avgAnswerTimeMs).toBe(2400);
  });

  it('handles empty answers gracefully', () => {
    const stats = aggregatePlayerStats([]);
    expect(stats.score).toBe(0);
    expect(stats.wrong).toBe(0);
    expect(stats.totalAnswers).toBe(0);
    expect(stats.totalAnswerTimeMs).toBe(0);
    expect(stats.avgAnswerTimeMs).toBe(0);
  });
});

describe('determineWinner (Tie-break rules)', () => {
  const basePlayer: PlayerStats = {
    score: 10,
    wrong: 2,
    totalAnswers: 12,
    totalAnswerTimeMs: 24000,
    avgAnswerTimeMs: 2000,
  };

  it('Tie-break 1: Player with more correct cards wins', () => {
    const opponent: PlayerStats = {
      score: 8,
      wrong: 1, // fewer wrong, but lower score
      totalAnswers: 9,
      totalAnswerTimeMs: 9000,
      avgAnswerTimeMs: 1000,
    };

    expect(determineWinner(basePlayer, opponent)).toBe('player');

    const betterOpponent: PlayerStats = {
      ...basePlayer,
      score: 12,
    };
    expect(determineWinner(basePlayer, betterOpponent)).toBe('opponent');
  });

  it('Tie-break 2: Equal scores go to fewer wrong answers', () => {
    const player: PlayerStats = {
      score: 10,
      wrong: 2, // fewer wrong
      totalAnswers: 12,
      totalAnswerTimeMs: 36000,
      avgAnswerTimeMs: 3000, // slower, but fewer wrong
    };

    const opponent: PlayerStats = {
      score: 10,
      wrong: 4, // more wrong
      totalAnswers: 14,
      totalAnswerTimeMs: 14000,
      avgAnswerTimeMs: 1000, // faster, but more wrong
    };

    expect(determineWinner(player, opponent)).toBe('player');
    expect(determineWinner(opponent, player)).toBe('opponent');
  });

  it('Tie-break 3: Equal score and wrong go to faster average answer time', () => {
    const playerFast: PlayerStats = {
      score: 10,
      wrong: 2,
      totalAnswers: 12,
      totalAnswerTimeMs: 24000,
      avgAnswerTimeMs: 2000, // faster
    };

    const opponentSlow: PlayerStats = {
      score: 10,
      wrong: 2,
      totalAnswers: 12,
      totalAnswerTimeMs: 30000,
      avgAnswerTimeMs: 2500, // slower
    };

    expect(determineWinner(playerFast, opponentSlow)).toBe('player');
    expect(determineWinner(opponentSlow, playerFast)).toBe('opponent');
  });

  it('Tie-break 4: Returns draw when all criteria are identical', () => {
    const player: PlayerStats = {
      score: 10,
      wrong: 2,
      totalAnswers: 12,
      totalAnswerTimeMs: 24000,
      avgAnswerTimeMs: 2000,
    };

    const opponent: PlayerStats = {
      score: 10,
      wrong: 2,
      totalAnswers: 12,
      totalAnswerTimeMs: 24000,
      avgAnswerTimeMs: 2000,
    };

    expect(determineWinner(player, opponent)).toBe('draw');
  });
});
