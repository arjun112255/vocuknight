import { OpponentType } from './types';

/** Standard minimum rating floor. */
export const MIN_RATING = 100;

/** Default Elo K-factor as defined in reference/wordduel.html. */
export const DEFAULT_K_FACTOR = 32;

/**
 * Computes standard Elo rating adjustments.
 *
 * @param playerRating Current player rating
 * @param opponentRating Current opponent rating
 * @param outcome 1 for player win, 0.5 for draw, 0 for player loss
 * @param kFactor Elo K-factor (default 32)
 */
export function calculateElo(
  playerRating: number,
  opponentRating: number,
  outcome: 1 | 0.5 | 0,
  kFactor: number = DEFAULT_K_FACTOR,
): { delta: number; newRating: number } {
  const expected = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
  const delta = Math.round(kFactor * (outcome - expected));
  const newRating = Math.max(MIN_RATING, playerRating + delta);

  return { delta, newRating };
}

/**
 * Calculates rating change for a finished match.
 *
 * In accordance with AGENTS.md & PLAN.md:
 * - Squire matches are unranked practice: rating delta is strictly 0.
 * - Knight matches are ranked: changes the deck rating using Elo.
 */
export function calculateMatchRating(
  playerRating: number,
  opponentRating: number,
  outcome: 1 | 0.5 | 0,
  opponentType: OpponentType,
  kFactor: number = DEFAULT_K_FACTOR,
): { delta: number; newRating: number } {
  if (opponentType === 'squire') {
    return { delta: 0, newRating: playerRating };
  }

  return calculateElo(playerRating, opponentRating, outcome, kFactor);
}
