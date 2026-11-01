import {
  Deck,
  DuelQuestion,
  MatchPhase,
  MatchResult,
  MissedCardReview,
  OpponentAdapter,
  OpponentAnswerEvent,
  OpponentInfo,
  PlayerAnswer,
  PlayerStats,
  StudyWindow,
  WordCard,
} from './types';
import { selectStudySet } from './study-set';
import { DuelQuestionStream } from './questions';
import { aggregatePlayerStats, determineWinner } from './scoring';
import { calculateMatchRating } from './elo';

export const COUNTDOWN_DURATION_MS = 3000;
export const DUEL_DURATION_MS = 60000;

export interface MatchEngineConfig {
  deck: Deck;
  studyWindow: StudyWindow;
  opponent: OpponentAdapter;
  playerRating?: number;
  missedCardIds?: string[];
  useRealTimers?: boolean;
}

export interface MatchEngineState {
  phase: MatchPhase;
  studyWindow: StudyWindow;
  studySet: WordCard[];
  timeRemainingMs: number;
  isPlayerReady: boolean;
  isOpponentReady: boolean;
  playerScore: number;
  opponentScore: number;
  currentQuestionIndex: number;
  currentQuestion: DuelQuestion | null;
  playerAnswers: PlayerAnswer[];
  opponentAnswers: OpponentAnswerEvent[];
  result: MatchResult | null;
  opponentInfo: OpponentInfo;
  flippedCardIds: Set<string>;
}

export type StateListener = (state: MatchEngineState) => void;

export class MatchEngine {
  private deck: Deck;
  private studyWindow: StudyWindow;
  private opponent: OpponentAdapter;
  private playerRating: number;
  private studySet: WordCard[];
  private questionStream: DuelQuestionStream;
  private useRealTimers: boolean;

  // Phase & timer tracking
  private phase: MatchPhase = 'lobby';
  private timeRemainingMs = 0;
  private timerIntervalId?: ReturnType<typeof setInterval>;

  // Readiness
  private isPlayerReady = false;
  private isOpponentReady = false;

  // Cards & study
  private flippedCardIds = new Set<string>();

  // Duel progress
  private currentQuestionIndex = 0;
  private cardStartTimeMs = 0;
  private playerAnswers: PlayerAnswer[] = [];
  private opponentAnswers: OpponentAnswerEvent[] = [];

  // Results
  private result: MatchResult | null = null;

  // Observers
  private listeners: StateListener[] = [];

  constructor(config: MatchEngineConfig) {
    this.deck = config.deck;
    this.studyWindow = config.studyWindow;
    this.opponent = config.opponent;
    this.playerRating = config.playerRating ?? 1000;
    this.useRealTimers = config.useRealTimers ?? false;

    // Build study set according to rules (favors missed cards if Squire)
    const missed =
      this.opponent.info.type === 'squire' ? config.missedCardIds : undefined;
    this.studySet = selectStudySet(this.deck, this.studyWindow, missed);
    this.questionStream = new DuelQuestionStream(this.studySet, this.deck);
  }

  // --- Public API ---

  getState(): MatchEngineState {
    const currentQuestion =
      this.phase === 'duel'
        ? this.questionStream.getQuestion(this.currentQuestionIndex)
        : null;

    const playerScore = this.playerAnswers.filter((a) => a.isCorrect).length;
    const opponentScore = this.opponentAnswers.filter((a) => a.isCorrect).length;

    return {
      phase: this.phase,
      studyWindow: this.studyWindow,
      studySet: [...this.studySet],
      timeRemainingMs: this.timeRemainingMs,
      isPlayerReady: this.isPlayerReady,
      isOpponentReady: this.isOpponentReady,
      playerScore,
      opponentScore,
      currentQuestionIndex: this.currentQuestionIndex,
      currentQuestion,
      playerAnswers: [...this.playerAnswers],
      opponentAnswers: [...this.opponentAnswers],
      result: this.result,
      opponentInfo: this.opponent.info,
      flippedCardIds: new Set(this.flippedCardIds),
    };
  }

  subscribe(listener: StateListener): () => void {
    this.listeners.push(listener);
    listener(this.getState());
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  flipCard(cardId: string): void {
    if (this.phase !== 'study') return;
    this.flippedCardIds.add(cardId);
    this.notify();
  }

  startStudy(): void {
    if (this.phase !== 'lobby') return;
    this.phase = 'study';
    this.timeRemainingMs = this.studyWindow * 60 * 1000;
    this.isPlayerReady = false;
    this.isOpponentReady = false;

    this.opponent.onPhaseChange('study');
    this.opponent.onStudyStart(this.studyWindow * 60, () => {
      this.isOpponentReady = true;
      this.checkStudyCompletion();
      this.notify();
    });

    this.setupTimer();
    this.notify();
  }

  markPlayerReady(): void {
    if (this.phase !== 'study' || this.isPlayerReady) return;
    this.isPlayerReady = true;
    this.checkStudyCompletion();
    this.notify();
  }

  submitPlayerAnswer(chosenIndex: number): void {
    if (this.phase !== 'duel') return;

    const question = this.questionStream.getQuestion(this.currentQuestionIndex);
    const now = Date.now();
    const timeMs = this.cardStartTimeMs > 0 ? now - this.cardStartTimeMs : 1000;
    this.cardStartTimeMs = now;

    const isCorrect = chosenIndex === question.correctIndex;
    const chosenOption = question.options[chosenIndex] ?? '';

    this.playerAnswers.push({
      cardIndex: this.currentQuestionIndex,
      cardId: question.card.id,
      chosenIndex,
      chosenOption,
      isCorrect,
      timeMs,
    });

    // Advance to next card immediately
    this.currentQuestionIndex += 1;
    this.notify();
  }

  /**
   * Advances the match engine clock by deltaMs.
   * Enables 100% deterministic, instant unit testing without real-time delays.
   */
  tick(deltaMs: number): void {
    const startPhase = this.phase;
    this.opponent.tick(deltaMs);

    // If opponent.tick triggered a phase change (e.g. study -> countdown),
    // do not consume the new phase's timer in this same tick.
    if (this.phase !== startPhase) {
      return;
    }

    if (this.phase === 'study') {
      this.timeRemainingMs = Math.max(0, this.timeRemainingMs - deltaMs);
      if (this.timeRemainingMs <= 0) {
        this.advanceToCountdown();
      } else {
        this.notify();
      }
    } else if (this.phase === 'countdown') {
      this.timeRemainingMs = Math.max(0, this.timeRemainingMs - deltaMs);
      if (this.timeRemainingMs <= 0) {
        this.advanceToDuel();
      } else {
        this.notify();
      }
    } else if (this.phase === 'duel') {
      this.timeRemainingMs = Math.max(0, this.timeRemainingMs - deltaMs);
      if (this.timeRemainingMs <= 0) {
        this.advanceToResults();
      } else {
        this.notify();
      }
    }
  }

  cleanup(): void {
    if (this.timerIntervalId) {
      clearInterval(this.timerIntervalId);
      this.timerIntervalId = undefined;
    }
    this.opponent.cleanup();
    this.listeners = [];
  }

  // --- Internal State Transitions ---

  private checkStudyCompletion(): void {
    if (this.isPlayerReady && this.isOpponentReady) {
      this.advanceToCountdown();
    }
  }

  private advanceToCountdown(): void {
    if (this.phase !== 'study') return;
    this.phase = 'countdown';
    this.timeRemainingMs = COUNTDOWN_DURATION_MS;
    this.opponent.onPhaseChange('countdown');
    this.notify();
  }

  private advanceToDuel(): void {
    if (this.phase !== 'countdown') return;
    this.phase = 'duel';
    this.timeRemainingMs = DUEL_DURATION_MS;
    this.currentQuestionIndex = 0;
    this.cardStartTimeMs = Date.now();
    this.playerAnswers = [];
    this.opponentAnswers = [];

    this.opponent.onPhaseChange('duel');
    this.opponent.onDuelStart({
      getQuestion: (idx) => this.questionStream.getQuestion(idx),
      onAnswer: (ans) => {
        if (this.phase !== 'duel') return;
        this.opponentAnswers.push(ans);
        this.notify();
      },
    });

    this.notify();
  }

  private advanceToResults(): void {
    if (this.phase !== 'duel') return;
    this.phase = 'results';
    this.timeRemainingMs = 0;

    if (this.timerIntervalId) {
      clearInterval(this.timerIntervalId);
      this.timerIntervalId = undefined;
    }

    this.opponent.onPhaseChange('results');
    this.computeResults();
    this.notify();
  }

  private computeResults(): void {
    const playerStats: PlayerStats = aggregatePlayerStats(this.playerAnswers);
    const opponentStats: PlayerStats = aggregatePlayerStats(
      this.opponentAnswers,
    );

    const winner = determineWinner(playerStats, opponentStats);
    const outcome = winner === 'player' ? 1 : winner === 'draw' ? 0.5 : 0;

    const ratingResult = calculateMatchRating(
      this.playerRating,
      this.opponent.info.rating,
      outcome,
      this.opponent.info.type,
    );

    // Identify missed cards
    const answeredMap = new Map<string, PlayerAnswer>();
    for (const ans of this.playerAnswers) {
      answeredMap.set(ans.cardId, ans);
    }

    const missedCards: MissedCardReview[] = [];
    for (const card of this.studySet) {
      const answer = answeredMap.get(card.id);
      if (!answer || !answer.isCorrect) {
        missedCards.push({
          card,
          chosenAnswer: answer?.chosenOption,
          correctAnswer: card.definition,
          wasStudied: this.flippedCardIds.has(card.id),
        });
      }
    }

    this.result = {
      winner,
      playerStats,
      opponentStats,
      ratingDelta: ratingResult.delta,
      newRating: ratingResult.newRating,
      missedCards,
    };
  }

  private setupTimer(): void {
    if (!this.useRealTimers) return;

    if (this.timerIntervalId) {
      clearInterval(this.timerIntervalId);
    }

    let lastTick = Date.now();
    this.timerIntervalId = setInterval(() => {
      const now = Date.now();
      const delta = now - lastTick;
      lastTick = now;
      this.tick(delta);
    }, 100);
  }

  private notify(): void {
    const state = this.getState();
    for (const listener of this.listeners) {
      listener(state);
    }
  }
}
