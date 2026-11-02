import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getDeckById } from '../data/sample-deck';
import { useMatchStore } from '../stores/match-store';
import DoodleAvatar from '../components/DoodleAvatar';
import { DoodleSword, DoodleCastle } from '../components/doodles/DoodleItems';
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
      <div className="min-h-[100dvh] flex flex-col items-center justify-center p-5 safe-area bg-bg-base text-white">
        <p className="text-mute text-lg mb-4">No active match found.</p>
        <button
          onClick={() => navigate(`/deck/${id ?? 'everyday-essentials'}`)}
          className="text-cyan-glow font-black italic uppercase min-h-12 flex items-center gap-2"
        >
          <DoodleCastle size={20} />
          <span>← Back to deck</span>
        </button>
      </div>
    );
  }

  const isKnight = opponentInfo.type === 'knight';

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between safe-area max-w-[480px] mx-auto w-full px-5 py-8">
      {/* Top Header */}
      <div className="text-center pt-2">
        <span className="text-xs uppercase tracking-widest text-mute font-black italic">
          {deck.title}
        </span>
        <h1 className="text-3xl font-black italic uppercase text-white mt-1 tracking-tight text-extrude">
          {isFound ? 'MATCH FOUND!' : 'SEARCHING FOR MATCH...'}
        </h1>
      </div>

      {/* Matiks-style VS Showdown Arena */}
      <div className="my-auto py-6">
        <div className="flex items-center justify-between gap-2">
          {/* Player Side (You) */}
          <div className="flex-1 flex flex-col items-center text-center p-4 rounded-3xl bg-surface border-2 border-line shadow-lg">
            <div className="w-20 h-20 rounded-full bg-surface-card border-2 border-cyan-glow flex items-center justify-center overflow-hidden mb-3 doodle-sticker-glow">
              <DoodleKnight size={58} />
            </div>
            <span className="text-xs uppercase font-black italic text-cyan-glow tracking-wider">
              YOU
            </span>
            <span className="text-lg font-black italic uppercase text-white mt-0.5 text-extrude-sm">
              PLAYER
            </span>
            <span className="text-xs text-mute mt-1 font-bold">RATING 1000</span>
          </div>

          {/* Center VS Emblem with Swords */}
          <div className="flex flex-col items-center justify-center shrink-0 px-1">
            <div className="w-12 h-12 rounded-full bg-surface-card border-2 border-cyan-glow flex items-center justify-center shadow-md">
              <span className="text-xs font-black italic text-white text-extrude-sm">VS</span>
            </div>
            <div className="flex -space-x-1 mt-1">
              <DoodleSword size={20} className="transform -rotate-45" />
              <DoodleSword size={20} className="transform rotate-45" />
            </div>
          </div>

          {/* Opponent Side */}
          <div className="flex-1 flex flex-col items-center text-center p-4 rounded-3xl bg-surface border-2 border-line shadow-lg">
            <div className="transform transition-transform duration-300 doodle-sticker-glow">
              <DoodleAvatar
                type={opponentInfo.type}
                name={opponentInfo.name}
                size={80}
              />
            </div>
            <span
              className={`text-xs uppercase font-black italic tracking-wider ${
                isKnight ? 'text-amber' : 'text-cyan-glow'
              }`}
            >
              {isKnight ? 'KNIGHT' : 'SQUIRE'}
            </span>
            <span className="text-lg font-black italic uppercase text-white mt-0.5 truncate max-w-[100px] text-extrude-sm">
              {opponentInfo.name}
            </span>
            <span className="text-xs text-mute mt-1 font-bold">
              {isKnight ? `RATING ${opponentInfo.rating}` : 'UNRANKED'}
            </span>
          </div>
        </div>

        {/* Alpha 1 Disclosure Badge */}
        <div className="mt-6 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-card border border-line text-xs font-black italic uppercase text-mute shadow-md">
            <span>🤖</span>
            <span>COMPUTER OPPONENT ({isKnight ? 'RANKED BOT' : 'PRACTICE BOT'})</span>
          </div>
        </div>
      </div>

      {/* Bottom Loading Indicator */}
      <div className="w-full text-center pb-4">
        <div className="flex justify-center items-center gap-2 text-cyan-glow text-xs font-black italic uppercase">
          <div className="w-2 h-2 rounded-full bg-cyan-glow animate-pulse" />
          <span>ENTERING STUDY WINDOW...</span>
        </div>
      </div>
    </div>
  );
}
