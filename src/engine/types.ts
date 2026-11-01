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

/** Match phases in sequential order. */
export type MatchPhase = 'lobby' | 'study' | 'countdown' | 'duel' | 'results';

/** Duel question prompt types. */
export type QuestionType = 'word_to_meaning' | 'meaning_to_word';

/** A 4-option question generated for a card during a duel. */
export interface DuelQuestion {
  card: WordCard;
  type: QuestionType;
  prompt: string;
  options: string[];
  correctIndex: number;
  distractors: WordCard[];
}

/** Record of a single answer given during the duel. */
export interface PlayerAnswer {
  cardIndex: number;
  cardId: string;
  chosenIndex: number;
  chosenOption: string;
  isCorrect: boolean;
  timeMs: number;
}

/** Aggregated duel stats for a player or opponent. */
export interface PlayerStats {
  score: number; // 1 point per correct card
  wrong: number;
  totalAnswers: number;
  totalAnswerTimeMs: number;
  avgAnswerTimeMs: number;
}

/** Card review detail displayed in Results. */
export interface MissedCardReview {
  card: WordCard;
  chosenAnswer?: string;
  correctAnswer: string;
  wasStudied: boolean;
}

/** Final match outcome. */
export interface MatchResult {
  winner: 'player' | 'opponent' | 'draw';
  playerStats: PlayerStats;
  opponentStats: PlayerStats;
  ratingDelta: number; // 0 for Squire, Elo delta for Knight
  newRating: number;
  missedCards: MissedCardReview[];
}

/** Public metadata for an opponent. */
export interface OpponentInfo {
  name: string;
  rating: number;
  type: OpponentType;
  isBot: boolean;
}

/** Answer event emitted by an Opponent adapter during the duel. */
export interface OpponentAnswerEvent {
  cardIndex: number;
  isCorrect: boolean;
  timeMs: number;
}

/** Callbacks supplied to an OpponentAdapter when a duel begins. */
export interface DuelCallbacks {
  getQuestion: (cardIndex: number) => DuelQuestion;
  onAnswer: (event: OpponentAnswerEvent) => void;
}

/** Interface for pluggable opponents (BotOpponent in Alpha 1, RemoteOpponent in beta). */
export interface OpponentAdapter {
  readonly info: OpponentInfo;
  onPhaseChange(phase: MatchPhase): void;
  onStudyStart(studySeconds: number, onReady: () => void): void;
  onDuelStart(callbacks: DuelCallbacks): void;
  tick(deltaMs: number): void;
  cleanup(): void;
}
