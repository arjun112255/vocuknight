import { PlayerStats } from './types';

/**
 * Computes aggregated statistics from a sequence of duel answers.
 */
export function aggregatePlayerStats(
  answers: { isCorrect: boolean; timeMs: number }[],
): PlayerStats {
  const totalAnswers = answers.length;
  let score = 0;
  let wrong = 0;
  let totalAnswerTimeMs = 0;

  for (const ans of answers) {
    if (ans.isCorrect) {
      score += 1;
    } else {
      wrong += 1;
    }
    totalAnswerTimeMs += ans.timeMs;
  }

  const avgAnswerTimeMs =
    totalAnswers > 0 ? Math.round(totalAnswerTimeMs / totalAnswers) : 0;

  return {
    score,
    wrong,
    totalAnswers,
    totalAnswerTimeMs,
    avgAnswerTimeMs,
  };
}

/**
 * Determines match winner according to Section 4.2 tie-break rules:
 * 1. Most correct cards (highest score)
 * 2. Fewer wrong answers
 * 3. Faster average answer time (lower avgAnswerTimeMs)
 * 4. Draw
 */
export function determineWinner(
  player: PlayerStats,
  opponent: PlayerStats,
): 'player' | 'opponent' | 'draw' {
  // Tie-break 1: Most correct cards
  if (player.score > opponent.score) return 'player';
  if (player.score < opponent.score) return 'opponent';

  // Tie-break 2: Fewer wrong answers
  if (player.wrong < opponent.wrong) return 'player';
  if (player.wrong > opponent.wrong) return 'opponent';

  // Tie-break 3: Faster average answer time
  if (player.avgAnswerTimeMs < opponent.avgAnswerTimeMs) return 'player';
  if (player.avgAnswerTimeMs > opponent.avgAnswerTimeMs) return 'opponent';

  // Tie-break 4: Draw
  return 'draw';
}
