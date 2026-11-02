import { useParams, useNavigate } from 'react-router';
import { getDeckById } from '../data/sample-deck';
import { DoodleShield, DoodleSword, DoodleCastle } from '../components/doodles/DoodleItems';

export default function DeckScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const deck = getDeckById(id!);

  if (!deck) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center p-4 safe-area bg-bg-base text-white">
        <p className="text-mute text-lg">Deck not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between safe-area max-w-[480px] mx-auto w-full px-5 py-6">
      {/* Top Bar: Medieval Header */}
      <div className="flex items-center justify-between border-b border-line pb-3">
        <div className="flex items-center gap-2.5">
          <DoodleCastle size={28} />
          <span className="font-black italic uppercase text-lg tracking-wider text-white text-extrude-sm">
            Vocuknight
          </span>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-surface-card border border-cyan-glow/40 font-black italic uppercase tracking-wider text-cyan-glow">
          Arena
        </span>
      </div>

      {/* Center Deck Presentation */}
      <div className="my-auto text-center py-6">
        <div className="flex justify-center mb-4 transform hover:scale-105 transition-transform doodle-sticker-glow">
          <DoodleShield size={96} />
        </div>

        <span className="text-xs font-black italic uppercase tracking-widest px-3 py-1 rounded-full bg-teal-dark/50 text-cyan-bright border border-cyan-glow/50">
          {deck.category} · Level {deck.level}
        </span>

        <h1 className="text-4xl sm:text-5xl font-black italic uppercase text-white mt-4 tracking-tight leading-none text-extrude-lg">
          {deck.title}
        </h1>

        <p className="text-sm font-semibold text-mute mt-3 max-w-xs mx-auto">
          Timed study deck followed by a rapid-fire <span className="text-cyan-glow">60-second</span> vocabulary card duel.
        </p>

        {/* Floating Stats Badges */}
        <div className="grid grid-cols-3 gap-2 mt-6 p-3.5 rounded-2xl bg-surface border-2 border-line shadow-lg">
          <div className="text-center">
            <span className="text-[11px] font-black italic uppercase text-mute block tracking-wider">Cards</span>
            <span className="text-2xl font-black italic text-white text-extrude-sm">{deck.words.length}</span>
          </div>
          <div className="text-center border-x border-line">
            <span className="text-[11px] font-black italic uppercase text-mute block tracking-wider">Rating</span>
            <span className="text-2xl font-black italic text-cyan-glow text-extrude-sm">1000</span>
          </div>
          <div className="text-center">
            <span className="text-[11px] font-black italic uppercase text-mute block tracking-wider">Lang</span>
            <span className="text-2xl font-black italic text-white text-extrude-sm uppercase">{deck.language}</span>
          </div>
        </div>
      </div>

      {/* Bottom Button in Thumb Reach */}
      <div className="pb-4">
        <button
          onClick={() => navigate(`/play/${id}`)}
          className={[
            'w-full py-4 px-6 rounded-2xl font-black italic uppercase text-2xl min-h-12 flex items-center justify-center gap-3',
            'bg-teal text-white border-2 border-cyan-glow shadow-lg text-extrude',
            'transition-all active:scale-95 motion-reduce:transition-none hover:bg-teal-dark',
          ].join(' ')}
          aria-label={`Play deck ${deck.title}`}
        >
          <DoodleSword size={28} />
          <span>PLAY</span>
        </button>
      </div>
    </div>
  );
}
