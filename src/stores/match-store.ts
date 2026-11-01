import { create } from 'zustand';
import {
  MatchEngine,
  MatchEngineState,
} from '../engine/match-engine';
import { BotOpponent } from '../engine/opponent';
import {
  Deck,
  WordCard,
  StudyWindow,
  OpponentType,
  MatchPhase,
  MatchResult,
  OpponentInfo,
  DuelQuestion,
} from '../engine/types';

interface MatchStoreState {
  // Settings & match state
  deck: Deck | null;
  studyWindow: StudyWindow;
  opponentType: OpponentType;
  studySet: WordCard[];
  flippedCardIds: Set<string>;
  isReady: boolean;
  isOpponentReady: boolean;
  timeRemainingMs: number;

  // Engine instance & state
  engine: MatchEngine | null;
  engineState: MatchEngineState | null;
  phase: MatchPhase;
  playerScore: number;
  opponentScore: number;
  currentQuestion: DuelQuestion | null;
  currentQuestionIndex: number;
  result: MatchResult | null;
  opponentInfo: OpponentInfo | null;

  // Actions
  setWindow: (w: StudyWindow) => void;
  setOpponent: (o: OpponentType) => void;
  initStudy: (studySet: WordCard[]) => void;
  flipCard: (id: string) => void;
  markReady: () => void;
  startStudy: () => void;
  submitAnswer: (chosenIndex: number) => void;

  createEngine: (
    deck: Deck,
    studyWindow?: StudyWindow,
    opponentType?: OpponentType,
    playerRating?: number,
  ) => MatchEngine;
  restartMatch: () => MatchEngine | null;
  reset: () => void;
}

export const useMatchStore = create<MatchStoreState>((set, get) => ({
  deck: null,
  studyWindow: 3,
  opponentType: 'squire',
  studySet: [],
  flippedCardIds: new Set<string>(),
  isReady: false,
  isOpponentReady: false,
  timeRemainingMs: 0,

  engine: null,
  engineState: null,
  phase: 'lobby',
  playerScore: 0,
  opponentScore: 0,
  currentQuestion: null,
  currentQuestionIndex: 0,
  result: null,
  opponentInfo: null,

  setWindow: (studyWindow) => set({ studyWindow }),
  setOpponent: (opponentType) => set({ opponentType }),
  initStudy: (studySet) =>
    set({ studySet, flippedCardIds: new Set<string>(), isReady: false }),

  flipCard: (id) =>
    set((state) => {
      state.engine?.flipCard(id);
      const next = new Set(state.flippedCardIds);
      next.add(id);
      return { flippedCardIds: next };
    }),

  markReady: () => {
    const { engine } = get();
    engine?.markPlayerReady();
    set({ isReady: true });
  },

  startStudy: () => {
    const { engine } = get();
    engine?.startStudy();
  },

  submitAnswer: (chosenIndex: number) => {
    const { engine } = get();
    engine?.submitPlayerAnswer(chosenIndex);
  },

  createEngine: (deck, window, opponentType, playerRating) => {
    const existing = get().engine;
    if (existing) {
      existing.cleanup();
    }

    const effectiveWindow = window ?? get().studyWindow;
    const effectiveOpponent = opponentType ?? get().opponentType;

    const bot = new BotOpponent({
      type: effectiveOpponent,
      playerRating,
      useRealTimers: true,
    });

    const engine = new MatchEngine({
      deck,
      studyWindow: effectiveWindow,
      opponent: bot,
      playerRating,
      useRealTimers: true,
    });

    // Sync engine state to Zustand store
    engine.subscribe((state) => {
      set({
        engineState: state,
        phase: state.phase,
        studySet: state.studySet,
        flippedCardIds: state.flippedCardIds,
        playerScore: state.playerScore,
        opponentScore: state.opponentScore,
        currentQuestion: state.currentQuestion,
        currentQuestionIndex: state.currentQuestionIndex,
        timeRemainingMs: state.timeRemainingMs,
        isReady: state.isPlayerReady,
        isOpponentReady: state.isOpponentReady,
        result: state.result,
        opponentInfo: state.opponentInfo,
      });
    });

    set({
      deck,
      engine,
      studyWindow: effectiveWindow,
      opponentType: effectiveOpponent,
      opponentInfo: bot.info,
    });

    return engine;
  },

  restartMatch: () => {
    const { deck, studyWindow, opponentType } = get();
    if (!deck) return null;
    return get().createEngine(deck, studyWindow, opponentType);
  },

  reset: () => {
    get().engine?.cleanup();
    set({
      deck: null,
      studyWindow: 3,
      opponentType: 'squire',
      studySet: [],
      flippedCardIds: new Set<string>(),
      isReady: false,
      isOpponentReady: false,
      timeRemainingMs: 0,
      engine: null,
      engineState: null,
      phase: 'lobby',
      playerScore: 0,
      opponentScore: 0,
      currentQuestion: null,
      currentQuestionIndex: 0,
      result: null,
      opponentInfo: null,
    });
  },
}));
