import { useParams, useNavigate } from 'react-router';
import { getDeckById } from '../data/sample-deck';
import { DoodleShield, DoodleSword, DoodleCastle, DoodleCrown, DoodleBook, DoodleHourglass, DoodleScroll } from '../components/doodles/DoodleItems';

export default function DeckScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const deck = getDeckById(id!);

  if (!deck) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center p-4 safe-area bg-[#060913] text-white font-barriecito">
        <p className="text-xl text-[#8E9DB8] mb-4">Deck Not Found</p>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 rounded-xl bg-[#0E1528] border border-[#1E2D4E] text-base text-[#38BDF8] flex items-center gap-2"
        >
          <DoodleCastle size={20} />
          <span>Return to Arena</span>
        </button>
      </div>
    );
  }

  // Choose appropriate hero doodle based on deck
  const renderHeroDoodle = () => {
    switch (deck.id) {
      case 'everyday-essentials':
        return <DoodleShield size={96} />;
      case 'work-and-business':
        return <DoodleCastle size={96} />;
      case 'feelings-and-character':
        return <DoodleCrown size={96} />;
      case 'academic-starters':
        return <DoodleBook size={96} />;
      case 'travel-and-places':
        return <DoodleHourglass size={96} />;
      default:
        return <DoodleScroll size={96} />;
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between safe-area max-w-[480px] mx-auto w-full px-5 py-6 bg-[#060913] font-barriecito">
      {/* Top Bar: Medieval Header */}
      <div className="flex items-center justify-between border-b border-[#18233C] pb-3">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/80 hover:text-white text-base active:scale-95 transition-all"
        >
          <DoodleCastle size={22} />
          <span>← Arena</span>
        </button>
        <span className="text-xs px-3 py-1 rounded-full bg-[#0E1628] border border-[#38BDF8]/40 tracking-wider text-[#38BDF8]">
          Deck Vault
        </span>
      </div>

      {/* Center Deck Presentation */}
      <div className="my-auto text-center py-6">
        <div className="flex justify-center mb-5 transform hover:scale-105 transition-transform doodle-sticker-glow">
          {renderHeroDoodle()}
        </div>

        <span className="text-xs tracking-widest px-3.5 py-1 rounded-full bg-[#005F73]/40 text-[#38BDF8] border border-[#0A9396]/40">
          {deck.category} · Level {deck.level}
        </span>

        <h1 className="text-4xl sm:text-5xl text-white mt-4 tracking-wide leading-tight text-extrude">
          {deck.title}
        </h1>

        <p className="font-body text-xs text-[#8E9DB8] mt-3 max-w-xs mx-auto leading-relaxed">
          Study the set of cards in your chosen window, then battle through a rapid <span className="text-[#38BDF8] font-bold">60-second</span> vocabulary duel.
        </p>

        {/* Floating Stats Badges */}
        <div className="grid grid-cols-3 gap-2 mt-6 p-3.5 rounded-2xl ios-matte-card">
          <div className="text-center">
            <span className="text-xs text-[#8E9DB8] block tracking-wider">Cards</span>
            <span className="text-2xl text-white text-extrude-sm">{deck.words.length}</span>
          </div>
          <div className="text-center border-x border-[#1C2B4B]">
            <span className="text-xs text-[#8E9DB8] block tracking-wider">Rating</span>
            <span className="text-2xl text-[#38BDF8] text-extrude-sm">1000</span>
          </div>
          <div className="text-center">
            <span className="text-xs text-[#8E9DB8] block tracking-wider">Lang</span>
            <span className="text-2xl text-white text-extrude-sm uppercase">{deck.language}</span>
          </div>
        </div>
      </div>

      {/* Bottom Button in Thumb Reach */}
      <div className="pb-4">
        <button
          onClick={() => navigate(`/play/${id}`)}
          className="w-full py-4 px-6 rounded-2xl text-2xl min-h-[54px] flex items-center justify-center gap-3 bg-[#0A9396] text-white border border-[#38BDF8]/60 shadow-[0_4px_20px_rgba(10,147,150,0.4)] transition-all active:scale-[0.98] hover:bg-[#005F73]"
          aria-label={`Play deck ${deck.title}`}
        >
          <DoodleSword size={26} />
          <span>Configure Match</span>
        </button>
      </div>
    </div>
  );
}
