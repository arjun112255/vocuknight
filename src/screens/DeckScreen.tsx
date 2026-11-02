import { useParams, useNavigate } from 'react-router';
import { getDeckById } from '../data/sample-deck';
import { DoodleShield, DoodleSword, DoodleCastle } from '../components/doodles/DoodleItems';

export default function DeckScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const deck = getDeckById(id!);

  if (!deck) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center p-4 safe-area">
        <p className="text-mute text-lg">Deck not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between safe-area max-w-[480px] mx-auto w-full px-5 py-6">
      {/* Top Bar: Medieval Arena Header */}
      <div className="flex items-center justify-between border-b border-line pb-3">
        <div className="flex items-center gap-2">
          <DoodleCastle size={28} />
          <span className="font-extrabold text-sm tracking-wider uppercase text-ink">
            Vocuknight
          </span>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-parchment/70 border border-line font-bold text-ink">
          Arena
        </span>
      </div>

      {/* Center Deck Card: Heraldic Medieval Presentation */}
      <div className="my-auto text-center py-6">
        <div className="flex justify-center mb-4 transform hover:scale-105 transition-transform">
          <DoodleShield size={96} />
        </div>

        <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-sage/30 text-teal-dark border border-sage/50">
          {deck.category} · Level {deck.level}
        </span>

        <h1 className="text-4xl sm:text-5xl font-black text-ink mt-3 tracking-tight leading-none">
          {deck.title}
        </h1>

        <p className="text-sm text-mute mt-3 max-w-xs mx-auto">
          Timed study window followed by a head-to-head 60-second vocabulary card duel.
        </p>

        {/* Matiks-style Floating Stat Badges */}
        <div className="grid grid-cols-3 gap-2 mt-6 p-3 rounded-2xl bg-surface border-2 border-line shadow-xs">
          <div className="text-center">
            <span className="text-xs text-mute font-medium block">Cards</span>
            <span className="text-xl font-black text-ink">{deck.words.length}</span>
          </div>
          <div className="text-center border-x border-line">
            <span className="text-xs text-mute font-medium block">Rating</span>
            <span className="text-xl font-black text-teal">1000</span>
          </div>
          <div className="text-center">
            <span className="text-xs text-mute font-medium block">Language</span>
            <span className="text-xl font-black text-ink uppercase">{deck.language}</span>
          </div>
        </div>
      </div>

      {/* Bottom Thumb Zone: Large Tactile PLAY Button */}
      <div className="pb-4">
        <button
          onClick={() => navigate(`/play/${id}`)}
          className={[
            'w-full py-4 px-6 rounded-2xl font-black text-xl min-h-12 flex items-center justify-center gap-3',
            'bg-teal text-white border-2 border-ink shadow-md',
            'transition-all active:scale-95 motion-reduce:transition-none hover:bg-teal-dark',
          ].join(' ')}
          aria-label={`Play deck ${deck.title}`}
        >
          <DoodleSword size={26} />
          <span>PLAY</span>
        </button>
      </div>
    </div>
  );
}
