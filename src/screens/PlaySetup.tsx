import { useParams, useNavigate } from 'react-router';
import { getDeckById } from '../data/sample-deck';
import { useMatchStore } from '../stores/match-store';
import { selectStudySet } from '../engine/study-set';
import { StudyWindow, OpponentType, WINDOW_CARD_COUNT } from '../engine/types';

const WINDOWS: { value: StudyWindow; label: string }[] = [
  { value: 1, label: '1 min' },
  { value: 3, label: '3 min' },
  { value: 5, label: '5 min' },
];

const OPPONENTS: { value: OpponentType; label: string; desc: string }[] = [
  { value: 'squire', label: 'Squire', desc: 'Practice' },
  { value: 'knight', label: 'Knight', desc: 'Ranked' },
];

export default function PlaySetup() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const deck = getDeckById(id!);
  const { studyWindow, opponentType, setWindow, setOpponent, initStudy } =
    useMatchStore();

  if (!deck) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center p-4">
        <p className="text-mute text-lg">Deck not found.</p>
      </div>
    );
  }

  const handleStart = () => {
    const studySet = selectStudySet(deck, studyWindow);
    initStudy(studySet);
    navigate(`/study/${id}`);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col safe-area">
      <div className="flex-1 max-w-[480px] mx-auto w-full px-5 pt-8">
        {/* Back link */}
        <button
          onClick={() => navigate(`/deck/${id}`)}
          className="text-mute text-sm mb-6 min-h-12 flex items-center"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-extrabold text-ink">{deck.title}</h1>

        {/* Window picker */}
        <section className="mt-8">
          <h2 className="text-sm font-semibold text-mute uppercase tracking-wider mb-3">
            Study window
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {WINDOWS.map(({ value, label }) => {
              const cardCount = Math.min(
                WINDOW_CARD_COUNT[value],
                deck.words.length,
              );
              return (
                <button
                  key={value}
                  onClick={() => setWindow(value)}
                  className={[
                    'rounded-xl py-4 text-center font-semibold min-h-12',
                    'border-2 transition-colors motion-reduce:transition-none',
                    studyWindow === value
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-line bg-surface text-ink',
                  ].join(' ')}
                >
                  <span className="block text-lg">{label}</span>
                  <span className="block text-xs text-mute mt-0.5">
                    {cardCount} cards
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Opponent toggle */}
        <section className="mt-8">
          <h2 className="text-sm font-semibold text-mute uppercase tracking-wider mb-3">
            Opponent
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {OPPONENTS.map(({ value, label, desc }) => (
              <button
                key={value}
                onClick={() => setOpponent(value)}
                className={[
                  'rounded-xl py-4 text-center font-semibold min-h-12',
                  'border-2 transition-colors motion-reduce:transition-none',
                  opponentType === value
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-line bg-surface text-ink',
                ].join(' ')}
              >
                <span className="block text-lg">{label}</span>
                <span className="block text-xs text-mute mt-0.5">{desc}</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Start button at the bottom for thumb reach */}
      <div className="max-w-[480px] mx-auto w-full px-5 pb-8">
        <button
          onClick={handleStart}
          className="w-full bg-accent text-white font-bold text-lg py-4 rounded-2xl min-h-12 active:scale-[0.98] transition-transform motion-reduce:transition-none"
        >
          Start
        </button>
      </div>
    </div>
  );
}
