import { useParams, useNavigate } from 'react-router';
import { getDeckById } from '../data/sample-deck';
import { useMatchStore } from '../stores/match-store';
import { StudyWindow, WINDOW_CARD_COUNT } from '../engine/types';
import { DoodleHourglass, DoodleSword, DoodleScroll } from '../components/doodles/DoodleItems';
import { DoodleKnight, DoodleSquire } from '../components/doodles/DoodleCharacters';

const WINDOWS: { value: StudyWindow; label: string; desc: string }[] = [
  { value: 1, label: '1 MIN', desc: 'Sprint' },
  { value: 3, label: '3 MIN', desc: 'Standard' },
  { value: 5, label: '5 MIN', desc: 'Deep Dive' },
];

export default function PlaySetup() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const deck = getDeckById(id!);
  const { studyWindow, opponentType, setWindow, setOpponent, createEngine } =
    useMatchStore();

  if (!deck) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center p-4 safe-area bg-bg-base text-white">
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
            className="text-white font-black italic uppercase text-sm min-h-12 flex items-center gap-2 active:scale-95 transition-transform"
          >
            <DoodleScroll size={20} />
            <span>← Back</span>
          </button>
          <span className="text-xs px-3 py-1 rounded-full bg-surface-card border border-cyan-glow/40 font-black italic uppercase tracking-wider text-cyan-glow">
            Setup Match
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black italic uppercase text-white tracking-tight text-extrude">
          {deck.title}
        </h1>
        <p className="text-xs font-semibold text-mute mt-1">
          Select your study window and opponent tier
        </p>

        {/* 1. Study Window Selection */}
        <section className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <DoodleHourglass size={20} />
            <h2 className="text-xs font-black italic uppercase tracking-wider text-cyan-glow">
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
                    'rounded-2xl p-3 text-center border-2 min-h-12 transition-all active:scale-95 motion-reduce:transition-none shadow-md flex flex-col items-center justify-center',
                    isSelected
                      ? 'border-cyan-glow bg-teal text-white ring-2 ring-cyan-glow/50'
                      : 'border-line bg-surface text-white hover:border-cyan-glow/40',
                  ].join(' ')}
                >
                  <DoodleHourglass size={22} className="mb-1" />
                  <span className="block text-base font-black italic uppercase text-extrude-sm">{label}</span>
                  <span className={`block text-xs font-black italic mt-0.5 ${isSelected ? 'text-cyan-bright' : 'text-cyan-glow'}`}>
                    {cardCount} CARDS
                  </span>
                  <span className={`block text-[10px] font-semibold mt-0.5 ${isSelected ? 'text-white/90' : 'text-mute'}`}>
                    {desc}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 2. Opponent Tier Selection */}
        <section className="mt-6">
          <h2 className="text-xs font-black italic uppercase tracking-wider text-cyan-glow mb-3">
            Opponent Tier
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {/* Squire (Practice) */}
            <button
              type="button"
              onClick={() => setOpponent('squire')}
              className={[
                'rounded-2xl p-4 text-left border-2 min-h-12 transition-all active:scale-95 motion-reduce:transition-none shadow-md relative flex flex-col justify-between',
                opponentType === 'squire'
                  ? 'border-cyan-glow bg-surface-card ring-2 ring-cyan-glow/50'
                  : 'border-line bg-surface text-white hover:border-cyan-glow/30',
              ].join(' ')}
            >
              <div className="flex items-center justify-between mb-2">
                <DoodleSquire size={42} />
                <span className="text-[10px] uppercase font-black italic px-2 py-0.5 rounded-full bg-teal-dark/60 text-cyan-glow border border-cyan-glow/40">
                  Practice
                </span>
              </div>
              <div>
                <span className="block text-lg font-black italic uppercase text-white text-extrude-sm">Squire</span>
                <span className="block text-xs font-semibold text-mute mt-0.5">
                  Relaxed pace · No rating change
                </span>
              </div>
            </button>

            {/* Knight (Ranked) */}
            <button
              type="button"
              onClick={() => setOpponent('knight')}
              className={[
                'rounded-2xl p-4 text-left border-2 min-h-12 transition-all active:scale-95 motion-reduce:transition-none shadow-md relative flex flex-col justify-between',
                opponentType === 'knight'
                  ? 'border-amber bg-surface-card ring-2 ring-amber/50'
                  : 'border-line bg-surface text-white hover:border-amber/30',
              ].join(' ')}
            >
              <div className="flex items-center justify-between mb-2">
                <DoodleKnight size={42} />
                <span className="text-[10px] uppercase font-black italic px-2 py-0.5 rounded-full bg-amber/20 text-amber border border-amber/40">
                  Ranked
                </span>
              </div>
              <div>
                <span className="block text-lg font-black italic uppercase text-white text-extrude-sm">Knight</span>
                <span className="block text-xs font-semibold text-mute mt-0.5">
                  Competitive Elo · Fast pace
                </span>
              </div>
            </button>
          </div>
        </section>
      </div>

      {/* Start Button with Doodle Sword Icon */}
      <div className="pt-6">
        <button
          onClick={handleStart}
          className={[
            'w-full py-4 px-6 rounded-2xl font-black italic uppercase text-xl min-h-12 flex items-center justify-center gap-3',
            'bg-teal text-white border-2 border-cyan-glow shadow-lg text-extrude',
            'transition-all active:scale-95 motion-reduce:transition-none hover:bg-teal-dark',
          ].join(' ')}
        >
          <DoodleSword size={26} />
          <span>START MATCH</span>
        </button>
      </div>
    </div>
  );
}
