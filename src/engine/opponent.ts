import {
  DuelCallbacks,
  MatchPhase,
  OpponentAdapter,
  OpponentInfo,
  OpponentType,
} from './types';

export const BOT_NAMES = [
  'Mira',
  'Jonas',
  'Aiko',
  'Dev',
  'Lena',
  'Tomas',
  'Priya',
  'Oskar',
  'Cedric',
  'Rowan',
  'Bram',
  'Elora',
  'Alden',
  'Finn',
  'Kael',
  'Tova',
  'Soren',
  'Gareth',
  'Wynne',
  'Corin',
];

/**
 * Knight bot accuracy formula from PLAN.md section 4.5 and reference/wordduel.html:
 * clamp(0.5 + (rating - 700) / 1200, 0.45, 0.92)
 */
export function calculateKnightAccuracy(rating: number): number {
  return Math.min(0.92, Math.max(0.45, 0.5 + (rating - 700) / 1200));
}

/**
 * Computes bot pace in ms per card.
 * - Squire: 5000 to 7000 ms.
 * - Knight: 2500 to 5000 ms scaled by rating.
 */
export function calculateBotPaceMs(type: OpponentType, rating: number): number {
  if (type === 'squire') {
    return Math.round(5000 + Math.random() * 2000);
  }

  // Knight pace scales from 5000ms down to 2500ms based on rating
  const fastness = Math.min(1, Math.max(0, (rating - 700) / 900));
  const base = 5000 - fastness * 2500;
  const jitter = (Math.random() - 0.5) * 500;
  return Math.round(Math.min(5000, Math.max(2500, base + jitter)));
}

export interface BotOpponentConfig {
  name?: string;
  type: OpponentType;
  playerRating?: number;
  rating?: number;
  accuracy?: number; // test override
  fixedPaceMs?: number; // test override
  readyPercent?: number; // test override (0.7 - 1.0)
  useRealTimers?: boolean;
}

export class BotOpponent implements OpponentAdapter {
  readonly info: OpponentInfo;
  readonly accuracy: number;

  private fixedPaceMs?: number;
  private readyPercent: number;
  private useRealTimers: boolean;

  // Study state
  private studyReadyCallback?: () => void;
  private studyReadyTimeMs = 0;
  private studyElapsedMs = 0;
  private isStudyReady = false;

  // Duel state
  private duelCallbacks?: DuelCallbacks;
  private duelElapsedMs = 0;
  private nextCardIndex = 0;
  private timeToNextAnswerMs = 0;

  // Timers
  private timeoutIds: ReturnType<typeof setTimeout>[] = [];

  constructor(config: BotOpponentConfig) {
    this.useRealTimers = config.useRealTimers ?? false;
    this.fixedPaceMs = config.fixedPaceMs;

    const playerRating = config.playerRating ?? 1000;
    let rating: number;
    let accuracy: number;

    if (config.type === 'squire') {
      rating = config.rating ?? 800;
      accuracy =
        config.accuracy ?? 0.55 + Math.random() * 0.15; // 55% - 70%
    } else {
      // Knight rating starts within 120 points of player deck rating
      rating =
        config.rating ??
        Math.max(100, Math.round(playerRating + (Math.random() * 240 - 120)));
      accuracy = config.accuracy ?? calculateKnightAccuracy(rating);
    }

    const name =
      config.name ?? BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];

    this.info = {
      name,
      rating,
      type: config.type,
      isBot: true,
    };
    this.accuracy = accuracy;
    this.readyPercent = config.readyPercent ?? 0.7 + Math.random() * 0.3;
  }

  onPhaseChange(phase: MatchPhase): void {
    if (phase !== 'study' && phase !== 'duel') {
      this.clearAllTimers();
    }
  }

  onStudyStart(studySeconds: number, onReady: () => void): void {
    this.studyReadyCallback = onReady;
    this.isStudyReady = false;
    this.studyElapsedMs = 0;
    this.studyReadyTimeMs = Math.round(
      studySeconds * 1000 * this.readyPercent,
    );

    if (this.useRealTimers) {
      const id = setTimeout(() => {
        if (!this.isStudyReady) {
          this.isStudyReady = true;
          this.studyReadyCallback?.();
        }
      }, this.studyReadyTimeMs);
      this.timeoutIds.push(id);
    }
  }

  onDuelStart(callbacks: DuelCallbacks): void {
    this.duelCallbacks = callbacks;
    this.duelElapsedMs = 0;
    this.nextCardIndex = 0;
    this.scheduleNextDuelAnswer();
  }

  /**
   * Drives bot internal clock. Call with delta in ms.
   * Enables both virtual-time unit tests and frame/interval real-time updates.
   */
  tick(deltaMs: number): void {
    // 1. Study phase ticking
    if (this.studyReadyCallback && !this.isStudyReady) {
      this.studyElapsedMs += deltaMs;
      if (this.studyElapsedMs >= this.studyReadyTimeMs) {
        this.isStudyReady = true;
        this.studyReadyCallback();
      }
    }

    // 2. Duel phase ticking
    if (this.duelCallbacks) {
      this.duelElapsedMs += deltaMs;
      this.timeToNextAnswerMs -= deltaMs;

      while (this.timeToNextAnswerMs <= 0 && this.duelCallbacks) {
        this.processBotAnswer();
      }
    }
  }

  private scheduleNextDuelAnswer(): void {
    const pace =
      this.fixedPaceMs ??
      calculateBotPaceMs(this.info.type, this.info.rating);
    this.timeToNextAnswerMs = pace;

    if (this.useRealTimers) {
      const id = setTimeout(() => {
        if (this.duelCallbacks) {
          this.processBotAnswer();
        }
      }, pace);
      this.timeoutIds.push(id);
    }
  }

  private processBotAnswer(): void {
    if (!this.duelCallbacks) return;

    const cardIdx = this.nextCardIndex++;
    const question = this.duelCallbacks.getQuestion(cardIdx);

    // Determine correctness using accuracy probability. When wrong,
    // bot selects a plausible distractor index from the question.
    const isCorrect = Math.random() < this.accuracy;
    const chosenIndex = isCorrect
      ? question.correctIndex
      : (question.correctIndex + 1 + Math.floor(Math.random() * 3)) % 4;

    const answerTimeMs =
      this.fixedPaceMs ??
      calculateBotPaceMs(this.info.type, this.info.rating);

    this.duelCallbacks.onAnswer({
      cardIndex: cardIdx,
      isCorrect: chosenIndex === question.correctIndex,
      timeMs: answerTimeMs,
    });

    // Schedule subsequent answer
    this.scheduleNextDuelAnswer();
  }

  cleanup(): void {
    this.clearAllTimers();
    this.studyReadyCallback = undefined;
    this.duelCallbacks = undefined;
  }

  private clearAllTimers(): void {
    for (const id of this.timeoutIds) {
      clearTimeout(id);
    }
    this.timeoutIds = [];
  }
}
