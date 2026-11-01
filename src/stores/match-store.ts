import { create } from 'zustand';
import { WordCard, StudyWindow, OpponentType } from '../engine/types';

interface MatchState {
  studyWindow: StudyWindow;
  opponentType: OpponentType;
  studySet: WordCard[];
  flippedCardIds: Set<string>;
  isReady: boolean;

  setWindow: (w: StudyWindow) => void;
  setOpponent: (o: OpponentType) => void;
  initStudy: (studySet: WordCard[]) => void;
  flipCard: (id: string) => void;
  markReady: () => void;
  reset: () => void;
}

export const useMatchStore = create<MatchState>((set) => ({
  studyWindow: 3,
  opponentType: 'squire',
  studySet: [],
  flippedCardIds: new Set<string>(),
  isReady: false,

  setWindow: (studyWindow) => set({ studyWindow }),
  setOpponent: (opponentType) => set({ opponentType }),
  initStudy: (studySet) =>
    set({ studySet, flippedCardIds: new Set<string>(), isReady: false }),
  flipCard: (id) =>
    set((state) => {
      const next = new Set(state.flippedCardIds);
      next.add(id);
      return { flippedCardIds: next };
    }),
  markReady: () => set({ isReady: true }),
  reset: () =>
    set({
      studyWindow: 3,
      opponentType: 'squire',
      studySet: [],
      flippedCardIds: new Set<string>(),
      isReady: false,
    }),
}));
