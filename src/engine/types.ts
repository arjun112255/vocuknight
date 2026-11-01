/** A single vocabulary entry. */
export interface WordCard {
  id: string;
  word: string;
  definition: string;
  partOfSpeech: string;
  example: string;
  language: string;
}

/** A deck of vocabulary cards. */
export interface Deck {
  id: string;
  title: string;
  category: string;
  level: string;
  language: string;
  words: WordCard[];
}

/** Study window duration in minutes. */
export type StudyWindow = 1 | 3 | 5;

/** Opponent type for a match. */
export type OpponentType = 'squire' | 'knight';

/** Maps study window (minutes) to the number of cards in the study set. */
export const WINDOW_CARD_COUNT: Record<StudyWindow, number> = {
  1: 10,
  3: 20,
  5: 30,
};
