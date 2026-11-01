import { Deck, StudyWindow, WordCard, WINDOW_CARD_COUNT } from './types';

/**
 * Fisher-Yates shuffle. Returns a new array; does not mutate the input.
 */
export function shuffle<T>(arr: readonly T[]): T[] {
  const result = arr.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Select the study set for a match.
 *
 * - For a given window (1, 3, or 5 minutes), the target size is 10, 20, or 30.
 * - If the deck has fewer words than the target, the whole deck is used.
 * - If `missedCardIds` is provided (Squire mode), those cards are prioritised
 *   and the rest of the set is filled randomly from remaining deck words.
 * - Otherwise (Knight mode or no misses), a random subset is selected.
 */
export function selectStudySet(
  deck: Deck,
  window: StudyWindow,
  missedCardIds?: string[],
): WordCard[] {
  const targetSize = Math.min(WINDOW_CARD_COUNT[window], deck.words.length);

  if (missedCardIds && missedCardIds.length > 0) {
    const missedSet = new Set(missedCardIds);
    const missed = deck.words.filter((w) => missedSet.has(w.id));
    const rest = deck.words.filter((w) => !missedSet.has(w.id));

    // Take up to targetSize missed cards, then fill with random others.
    const prioritised = shuffle(missed).slice(0, targetSize);
    const remaining = targetSize - prioritised.length;
    const filler = shuffle(rest).slice(0, remaining);

    return shuffle([...prioritised, ...filler]);
  }

  return shuffle(deck.words).slice(0, targetSize);
}
