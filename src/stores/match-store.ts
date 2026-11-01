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
} from '../engine/types';

interface MatchStoreState {
  // Settings & match state
  studyWindow: StudyWindow;
  opponentType: OpponentType;
  studySet: WordCard[];
  flippedCardIds: Set<string>;
  isReady: boolean;

  // Engine instance & state
  engine: MatchEngine | null;
  engineState: MatchEngineState | null;
  phase: MatchPhase;
  playerScore: number;
  opponentScore: number;
  result: MatchResult | null;

  // Actions
  setWindow: (w: StudyWindow) => void;
  setOpponent: (o: OpponentType) => void;
  initStudy: (studySet: WordCard[]) => void;
  flipCard: (id: string) => void;
  markReady: () => void;

  createEngine: (
    deck: Deck,
    studyWindow?: StudyWindow,
    opponentType?: OpponentType,
    playerRating?: number,
  ) => MatchEngine;
  reset: () => void;
}

export const useMatchStore = create<MatchStoreState>((set, get) => ({
  studyWindow: 3,
  opponentType: 'squire',
  studySet: [],
  flippedCardIds: new Set<string>(),
  isReady: false,

  engine: null,
  engineState: null,
  phase: 'lobby',
  playerScore: 0,
  opponentScore: 0,
  result: null,

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
        result: state.result,
        isReady: state.isPlayerReady,
      });
    });

    set({
      engine,
      studyWindow: effectiveWindow,
      opponentType: effectiveOpponent,
    });

    return engine;
  },

  reset: () => {
    get().engine?.cleanup();
    set({
      studyWindow: 3,
      opponentType: 'squire',
      studySet: [],
      flippedCardIds: new Set<string>(),
      isReady: false,
      engine: null,
      engineState: null,
      phase: 'lobby',
      playerScore: 0,
      opponentScore: 0,
      result: null,
    });
  },
}));
