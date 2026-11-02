import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getDeckById } from '../data/sample-deck';
import { useMatchStore } from '../stores/match-store';
import DoodleAvatar from '../components/DoodleAvatar';
import { DoodleCastle, DoodleSwords } from '../components/doodles/DoodleItems';
import { DoodleKnight } from '../components/doodles/DoodleCharacters';

export default function MatchmakingScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const deck = getDeckById(id!);
  const { opponentInfo, startStudy, engine } = useMatchStore();
  const [isFound, setIsFound] = useState(false);

  useEffect(() => {
    const foundTimer = setTimeout(() => {
      setIsFound(true);
    }, 500);

    const transitionTimer = setTimeout(() => {
      startStudy();
      navigate(`/study/${id}`);
    }, 2200);

    return () => {
      clearTimeout(foundTimer);
      clearTimeout(transitionTimer);
    };
  }, [id, navigate, startStudy]);

  if (!deck || !opponentInfo || !engine) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center p-5 safe-area bg-[#060913] text-white">
        <p className="font-impact text-lg text-[#8E9DB8] mb-4">NO ACTIVE MATCH FOUND</p>
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

  const isKnight = opponentInfo.type === 'knight';

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between safe-area max-w-[480px] mx-auto w-full px-5 py-8 bg-[#060913]">
      {/* Top Header */}
      <div className="text-center pt-2">
        <span className="font-impact uppercase text-xs tracking-widest text-[#38BDF8]">
          {deck.title}
        </span>
        <h1 className="font-impact uppercase text-3xl sm:text-4xl text-white mt-1 tracking-tight text-extrude">
          {isFound ? 'MATCH FOUND!' : 'SEARCHING FOR MATCH...'}
        </h1>
      </div>

      {/* Matiks-style VS Showdown Arena */}
      <div className="my-auto py-6">
        <div className="flex items-center justify-between gap-2.5">
          {/* Player Side (You) */}
          <div className="flex-1 flex flex-col items-center text-center p-4 rounded-3xl ios-matte-card">
            <div className="w-20 h-20 rounded-2xl bg-[#0E172C] border border-[#38BDF8]/40 flex items-center justify-center overflow-hidden mb-3 doodle-sticker-glow">
              <DoodleKnight size={58} />
            </div>
            <span className="font-impact uppercase text-xs text-[#38BDF8] tracking-wider">
              YOU
            </span>
            <span className="font-impact uppercase text-lg text-white mt-0.5">
              PLAYER
            </span>
            <span className="font-body text-xs text-[#8E9DB8] mt-1 font-semibold">RATING 1000</span>
          </div>

          {/* Center VS Emblem with Swords */}
          <div className="flex flex-col items-center justify-center shrink-0 px-1">
            <div className="w-12 h-12 rounded-full bg-[#0E1628] border border-[#38BDF8]/40 flex items-center justify-center shadow-lg">
              <span className="font-impact text-sm text-white">VS</span>
            </div>
            <div className="mt-2">
              <DoodleSwords size={26} />
            </div>
          </div>

          {/* Opponent Side */}
          <div className="flex-1 flex flex-col items-center text-center p-4 rounded-3xl ios-matte-card">
            <div className="w-20 h-20 rounded-2xl bg-[#0E172C] border border-[#38BDF8]/40 flex items-center justify-center overflow-hidden mb-3 doodle-sticker-glow">
              <DoodleAvatar
                type={opponentInfo.type}
                name={opponentInfo.name}
                size={64}
              />
            </div>
            <span
              className={`font-impact uppercase text-xs tracking-wider ${
                isKnight ? 'text-[#EE9B00]' : 'text-[#38BDF8]'
              }`}
            >
              {isKnight ? 'KNIGHT' : 'SQUIRE'}
            </span>
            <span className="font-impact uppercase text-lg text-white mt-0.5 truncate max-w-[110px]">
              {opponentInfo.name}
            </span>
            <span className="font-body text-xs text-[#8E9DB8] mt-1 font-semibold">
              {isKnight ? `RATING ${opponentInfo.rating}` : 'UNRANKED'}
            </span>
          </div>
        </div>

        {/* Alpha 1 Disclosure Badge */}
        <div className="mt-6 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0E1528] border border-[#1C2B4B] text-xs font-impact uppercase text-[#8E9DB8] shadow-md">
            <span>🤖</span>
            <span>COMPUTER OPPONENT ({isKnight ? 'RANKED BOT' : 'PRACTICE BOT'})</span>
          </div>
        </div>
      </div>

      {/* Bottom Loading Indicator */}
      <div className="w-full text-center pb-4">
        <div className="flex justify-center items-center gap-2 text-[#38BDF8] text-xs font-impact uppercase tracking-wider">
          <div className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" />
          <span>ENTERING STUDY WINDOW...</span>
        </div>
      </div>
    </div>
  );
}
