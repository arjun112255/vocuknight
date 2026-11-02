import { useParams, useNavigate } from 'react-router';
import { getDeckById } from '../data/sample-deck';
import { useMatchStore } from '../stores/match-store';
import { StudyWindow, WINDOW_CARD_COUNT } from '../engine/types';
import { DoodleHourglass, DoodleSword } from '../components/doodles/DoodleItems';
import { DoodleKnight, DoodleSquire } from '../components/doodles/DoodleCharacters';

const WINDOWS: { value: StudyWindow; label: string; desc: string }[] = [
  { value: 1, label: '1 min', desc: 'Sprint' },
  { value: 3, label: '3 min', desc: 'Standard' },
  { value: 5, label: '5 min', desc: 'Deep Dive' },
];

export default function PlaySetup() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const deck = getDeckById(id!);
  const { studyWindow, opponentType, setWindow, setOpponent, createEngine } =
    useMatchStore();

  if (!deck) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center p-4 safe-area">
        <p className="text-mute text-lg">Deck not found.</p>
      </div>
    );
  }

  const handleStart = () => {
    createEngine(deck, studyWindow, opponentType);
    navigate(`/matchmaking/${id}`);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between safe-area max-w-[480px] mx-auto w-full px-5 py-6">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(`/deck/${id}`)}
            className="text-mute font-bold text-sm min-h-12 flex items-center gap-1 active:scale-95 transition-transform"
          >
            ← Back
          </button>
          <span className="text-xs px-2.5 py-1 rounded-full bg-parchment/60 border border-line font-bold text-ink">
            Setup Match
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
          {deck.title}
        </h1>
        <p className="text-xs text-mute mt-1">Configure study duration and opponent tier</p>

        {/* 1. Study Window Selection */}
        <section className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <DoodleHourglass size={20} />
            <h2 className="text-xs font-black uppercase tracking-wider text-ink">
              Study Window
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {WINDOWS.map(({ value, label, desc }) => {
              const cardCount = Math.min(
                WINDOW_CARD_COUNT[value],
                deck.words.length,
              );
              const isSelected = studyWindow === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setWindow(value)}
                  className={[
                    'rounded-2xl p-3 text-center border-2 min-h-12 transition-all active:scale-95 motion-reduce:transition-none shadow-2xs',
                    isSelected
                      ? 'border-ink bg-teal text-white shadow-xs'
                      : 'border-line bg-surface text-ink hover:border-teal/50',
                  ].join(' ')}
                >
                  <span className="block text-lg font-black">{label}</span>
                  <span className={`block text-xs font-bold mt-0.5 ${isSelected ? 'text-sage' : 'text-teal'}`}>
                    {cardCount} cards
                  </span>
                  <span className={`block text-[10px] mt-1 ${isSelected ? 'text-white/80' : 'text-mute'}`}>
                    {desc}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 2. Opponent Tier Selection */}
        <section className="mt-6">
          <h2 className="text-xs font-black uppercase tracking-wider text-ink mb-3">
            Opponent Tier
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {/* Squire (Practice) */}
            <button
              type="button"
              onClick={() => setOpponent('squire')}
              className={[
                'rounded-2xl p-4 text-left border-2 min-h-12 transition-all active:scale-95 motion-reduce:transition-none shadow-2xs relative flex flex-col justify-between',
                opponentType === 'squire'
                  ? 'border-ink bg-parchment/60 ring-2 ring-teal shadow-xs'
                  : 'border-line bg-surface text-ink hover:border-teal/50',
              ].join(' ')}
            >
              <div className="flex items-center justify-between mb-2">
                <DoodleSquire size={40} />
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-sage/30 text-teal-dark border border-sage/40">
                  Practice
                </span>
              </div>
              <div>
                <span className="block text-base font-black text-ink">Squire</span>
                <span className="block text-xs text-mute mt-0.5">
                  Relaxed pace · No rating change
                </span>
              </div>
            </button>

            {/* Knight (Ranked) */}
            <button
              type="button"
              onClick={() => setOpponent('knight')}
              className={[
                'rounded-2xl p-4 text-left border-2 min-h-12 transition-all active:scale-95 motion-reduce:transition-none shadow-2xs relative flex flex-col justify-between',
                opponentType === 'knight'
                  ? 'border-ink bg-parchment/60 ring-2 ring-amber shadow-xs'
                  : 'border-line bg-surface text-ink hover:border-amber/50',
              ].join(' ')}
            >
              <div className="flex items-center justify-between mb-2">
                <DoodleKnight size={40} />
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-amber/20 text-terracotta border border-amber/30">
                  Ranked
                </span>
              </div>
              <div>
                <span className="block text-base font-black text-ink">Knight</span>
                <span className="block text-xs text-mute mt-0.5">
                  Competitive Elo · Fast pace
                </span>
              </div>
            </button>
          </div>
        </section>
      </div>

      {/* Start Button in Thumb Zone */}
      <div className="pt-6">
        <button
          onClick={handleStart}
          className={[
            'w-full py-4 px-6 rounded-2xl font-black text-lg min-h-12 flex items-center justify-center gap-2.5',
            'bg-teal text-white border-2 border-ink shadow-md',
            'transition-all active:scale-95 motion-reduce:transition-none hover:bg-teal-dark',
          ].join(' ')}
        >
          <DoodleSword size={22} />
          <span>START MATCH</span>
        </button>
      </div>
    </div>
  );
}
