import { useParams, useNavigate } from 'react-router';
import { getDeckById } from '../data/sample-deck';
import { useMatchStore } from '../stores/match-store';
import { StudyWindow, WINDOW_CARD_COUNT } from '../engine/types';
import { DoodleHourglass, DoodleSword, DoodleCastle } from '../components/doodles/DoodleItems';
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
      <div className="min-h-[100dvh] flex flex-col items-center justify-center p-4 safe-area bg-[#060913] text-white">
        <p className="font-impact text-lg text-[#8E9DB8] mb-4">DECK NOT FOUND</p>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 rounded-xl bg-[#0E1528] border border-[#1E2D4E] font-impact uppercase text-sm text-[#38BDF8] flex items-center gap-2"
        >
          <DoodleCastle size={20} />
          <span>RETURN TO ARENA</span>
        </button>
      </div>
    );
  }

  const handleStart = () => {
    createEngine(deck, studyWindow, opponentType);
    navigate(`/matchmaking/${id}`);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between safe-area max-w-[480px] mx-auto w-full px-5 py-6 bg-[#060913]">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#18233C]">
          <button
            onClick={() => navigate('/')}
            className="text-white/80 hover:text-white font-impact uppercase text-sm min-h-12 flex items-center gap-2 active:scale-95 transition-transform"
          >
            <DoodleCastle size={20} />
            <span>← ARENA</span>
          </button>
          <span className="font-impact uppercase text-xs px-3 py-1 rounded-full bg-[#0E1628] border border-[#38BDF8]/40 tracking-wider text-[#38BDF8]">
            MATCH CONFIG
          </span>
        </div>

        <h1 className="font-impact uppercase text-3xl sm:text-4xl text-white tracking-tight leading-tight text-extrude">
          {deck.title}
        </h1>
        <p className="font-body text-xs text-[#8E9DB8] mt-1">
          Select study duration and challenger tier
        </p>

        {/* 1. Study Window Selection */}
        <section className="mt-6">
          <div className="flex items-center gap-2 mb-2.5">
            <DoodleHourglass size={18} />
            <h2 className="font-impact uppercase text-xs tracking-wider text-[#38BDF8]">
              STUDY WINDOW
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
                    'rounded-2xl p-3 text-center border min-h-[58px] transition-all active:scale-95 flex flex-col items-center justify-center',
                    isSelected
                      ? 'border-[#38BDF8] bg-[#0A9396]/25 text-white shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                      : 'border-[#1C2B4B] bg-[#0E1628] text-white/70 hover:border-[#38BDF8]/40 hover:text-white',
                  ].join(' ')}
                >
                  <DoodleHourglass size={20} className="mb-1" />
                  <span className="block font-impact uppercase text-base leading-none text-white">{label}</span>
                  <span className={`block font-impact uppercase text-xs mt-1 ${isSelected ? 'text-[#38BDF8]' : 'text-[#8E9DB8]'}`}>
                    {cardCount} CARDS
                  </span>
                  <span className={`block font-body text-[10px] mt-0.5 ${isSelected ? 'text-white/90' : 'text-[#8E9DB8]'}`}>
                    {desc}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 2. Opponent Tier Selection */}
        <section className="mt-6">
          <h2 className="font-impact uppercase text-xs tracking-wider text-[#38BDF8] mb-2.5">
            OPPONENT TIER
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {/* Squire (Practice) */}
            <button
              type="button"
              onClick={() => setOpponent('squire')}
              className={[
                'rounded-2xl p-4 text-left border min-h-[64px] transition-all active:scale-95 shadow-md relative flex flex-col justify-between',
                opponentType === 'squire'
                  ? 'border-[#38BDF8] bg-[#005F73]/25 shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                  : 'border-[#1C2B4B] bg-[#0E1628] text-white/70 hover:border-[#38BDF8]/30',
              ].join(' ')}
            >
              <div className="flex items-center justify-between mb-2">
                <DoodleSquire size={38} />
                <span className="font-impact uppercase text-[10px] px-2 py-0.5 rounded-full bg-[#005F73]/50 text-[#38BDF8] border border-[#0A9396]/40">
                  PRACTICE
                </span>
              </div>
              <div>
                <span className="block font-impact uppercase text-lg text-white">SQUIRE</span>
                <span className="block font-body text-xs text-[#8E9DB8] mt-0.5">
                  Relaxed pace · No rating loss
                </span>
              </div>
            </button>

            {/* Knight (Ranked) */}
            <button
              type="button"
              onClick={() => setOpponent('knight')}
              className={[
                'rounded-2xl p-4 text-left border min-h-[64px] transition-all active:scale-95 shadow-md relative flex flex-col justify-between',
                opponentType === 'knight'
                  ? 'border-[#EE9B00] bg-[#EE9B00]/15 shadow-[0_0_12px_rgba(238,155,0,0.25)]'
                  : 'border-[#1C2B4B] bg-[#0E1628] text-white/70 hover:border-[#EE9B00]/30',
              ].join(' ')}
            >
              <div className="flex items-center justify-between mb-2">
                <DoodleKnight size={38} />
                <span className="font-impact uppercase text-[10px] px-2 py-0.5 rounded-full bg-[#EE9B00]/20 text-[#EE9B00] border border-[#EE9B00]/40">
                  RANKED
                </span>
              </div>
              <div>
                <span className="block font-impact uppercase text-lg text-white">KNIGHT</span>
                <span className="block font-body text-xs text-[#EE9B00] mt-0.5">
                  Competitive Elo · Fast pace
                </span>
              </div>
            </button>
          </div>
        </section>
      </div>

      {/* Start Button with Doodle Sword Icon */}
      <div className="pt-6 pb-2">
        <button
          onClick={handleStart}
          className="w-full py-4 px-6 rounded-2xl font-impact uppercase text-xl min-h-[54px] flex items-center justify-center gap-3 bg-[#0A9396] text-white border border-[#38BDF8]/60 shadow-[0_4px_20px_rgba(10,147,150,0.4)] transition-all active:scale-[0.98] hover:bg-[#005F73]"
        >
          <DoodleSword size={26} />
          <span>START MATCH ({studyWindow} MIN)</span>
        </button>
      </div>
    </div>
  );
}
