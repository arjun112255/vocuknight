import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getDeckById } from '../data/sample-deck';
import { useMatchStore } from '../stores/match-store';
import DoodleAvatar from '../components/DoodleAvatar';

export default function MatchmakingScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const deck = getDeckById(id!);
  const { opponentInfo, startStudy, engine } = useMatchStore();
  const [isFound, setIsFound] = useState(false);

  useEffect(() => {
    // Reveal opponent quickly after 600ms, then transition after 2s
    const foundTimer = setTimeout(() => {
      setIsFound(true);
    }, 600);

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
          className="text-accent font-semibold min-h-12 flex items-center"
        >
          ← Back to deck
        </button>
      </div>
    );
  }

  const isKnight = opponentInfo.type === 'knight';

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-between safe-area max-w-[480px] mx-auto w-full px-5 py-10">
      {/* Header status */}
      <div className="text-center pt-8">
        <p className="text-xs uppercase tracking-widest text-mute font-semibold">
          {deck.title}
        </p>
        <h1 className="text-2xl font-extrabold text-ink mt-2">
          {isFound ? 'Opponent Found!' : 'Searching for Opponent...'}
        </h1>
      </div>

      {/* Opponent Card & Doodle Avatar */}
      <div className="flex flex-col items-center justify-center text-center my-auto">
        <div className="transform transition-transform duration-500 ease-out active:scale-95">
          <DoodleAvatar type={opponentInfo.type} name={opponentInfo.name} size={110} />
        </div>

        <h2 className="text-3xl font-extrabold text-ink mt-5">
          {opponentInfo.name}
        </h2>

        {/* Visible Computer Opponent disclosure required by Alpha 1 rules */}
        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-line/50 border border-line text-xs font-semibold text-mute">
          <span>🤖</span>
          <span>Computer Opponent</span>
        </div>

        {/* Opponent details */}
        <p className="text-sm text-mute mt-3 font-medium">
          {isKnight ? (
            <>
              Knight · <span className="text-opponent font-bold">Ranked</span> (Rating {opponentInfo.rating})
            </>
          ) : (
            <>
              Squire · <span className="text-accent font-bold">Practice</span> (Unranked)
            </>
          )}
        </p>
      </div>

      {/* Footer loading status */}
      <div className="w-full text-center pb-4">
        <div className="flex justify-center items-center gap-2 text-mute text-sm">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span>Entering study window...</span>
        </div>
      </div>
    </div>
  );
}
