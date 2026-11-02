import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getDeckById } from '../data/sample-deck';
import { useMatchStore } from '../stores/match-store';
import DoodleAvatar from '../components/DoodleAvatar';
import { DoodleSword } from '../components/doodles/DoodleItems';
import { DoodleKnight } from '../components/doodles/DoodleCharacters';

export default function MatchmakingScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const deck = getDeckById(id!);
  const { opponentInfo, startStudy, engine } = useMatchStore();
  const [isFound, setIsFound] = useState(false);

  useEffect(() => {
    // 600ms quick discovery feel, then transition after 2.2s
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
      <div className="min-h-[100dvh] flex flex-col items-center justify-center p-5 safe-area">
        <p className="text-mute text-lg mb-4">No active match found.</p>
        <button
          onClick={() => navigate(`/deck/${id ?? 'everyday-essentials'}`)}
          className="text-teal font-semibold min-h-12 flex items-center"
        >
          ← Back to deck
        </button>
      </div>
    );
  }

  const isKnight = opponentInfo.type === 'knight';

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between safe-area max-w-[480px] mx-auto w-full px-5 py-8">
      {/* Top Header */}
      <div className="text-center pt-2">
        <span className="text-xs uppercase tracking-widest text-mute font-bold">
          {deck.title}
        </span>
        <h1 className="text-2xl font-black text-ink mt-1 tracking-tight">
          {isFound ? 'Match Found!' : 'Searching for Match...'}
        </h1>
      </div>

      {/* Matiks-style "VS" Showdown Arena */}
      <div className="my-auto py-6">
        <div className="flex items-center justify-between gap-2">
          {/* Player Side (You) */}
          <div className="flex-1 flex flex-col items-center text-center p-4 rounded-3xl bg-surface border-2 border-line shadow-xs">
            <div className="w-20 h-20 rounded-full bg-sage/20 border-2 border-ink flex items-center justify-center overflow-hidden mb-3">
              <DoodleKnight size={58} />
            </div>
            <span className="text-xs uppercase font-black text-teal tracking-wider">
              You
            </span>
            <span className="text-base font-black text-ink mt-0.5">Player</span>
            <span className="text-xs text-mute mt-1 font-bold">Rating 1000</span>
          </div>

          {/* Center VS Emblem */}
          <div className="flex flex-col items-center justify-center shrink-0 px-1">
            <div className="w-12 h-12 rounded-full bg-parchment border-2 border-ink flex items-center justify-center shadow-xs">
              <span className="text-xs font-black text-ink tracking-tighter">VS</span>
            </div>
            <div className="flex -space-x-1 mt-1">
              <DoodleSword size={18} className="transform -rotate-45" />
              <DoodleSword size={18} className="transform rotate-45" />
            </div>
          </div>

          {/* Opponent Side */}
          <div className="flex-1 flex flex-col items-center text-center p-4 rounded-3xl bg-surface border-2 border-line shadow-xs">
            <div className="transform transition-transform duration-300">
              <DoodleAvatar
                type={opponentInfo.type}
                name={opponentInfo.name}
                size={80}
              />
            </div>
            <span
              className={`text-xs uppercase font-black tracking-wider ${
                isKnight ? 'text-terracotta' : 'text-teal'
              }`}
            >
              {isKnight ? 'Knight' : 'Squire'}
            </span>
            <span className="text-base font-black text-ink mt-0.5 truncate max-w-[100px]">
              {opponentInfo.name}
            </span>
            <span className="text-xs text-mute mt-1 font-bold">
              {isKnight ? `Rating ${opponentInfo.rating}` : 'Unranked'}
            </span>
          </div>
        </div>

        {/* Alpha 1 Computer Opponent Disclosure Badge */}
        <div className="mt-6 flex justify-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-line text-xs font-bold text-mute shadow-2xs">
            <span>🤖</span>
            <span>Computer Opponent ({isKnight ? 'Ranked Bot' : 'Practice Bot'})</span>
          </div>
        </div>
      </div>

      {/* Bottom Loading Progress Indicator */}
      <div className="w-full text-center pb-4">
        <div className="flex justify-center items-center gap-2 text-mute text-xs font-semibold">
          <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
          <span>Entering study window in a moment...</span>
        </div>
      </div>
    </div>
  );
}
