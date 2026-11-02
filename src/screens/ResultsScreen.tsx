import { useParams, useNavigate } from 'react-router';
import { useMatchStore } from '../stores/match-store';
import DoodleAvatar from '../components/DoodleAvatar';
import { DoodleCrown, DoodleShield, DoodleChest } from '../components/doodles/DoodleItems';

export default function ResultsScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { result, opponentInfo, restartMatch, reset } = useMatchStore();

  const handleRematch = () => {
    restartMatch();
    navigate(`/matchmaking/${id}`);
  };

  const handleChangeWindow = () => {
    navigate(`/play/${id}`);
  };

  const handleBackToDeck = () => {
    reset();
    navigate(`/deck/${id}`);
  };

  if (!result || !opponentInfo) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center p-5 safe-area">
        <p className="text-mute text-lg mb-4">No match results available.</p>
        <button
          onClick={() => navigate(`/deck/${id ?? 'everyday-essentials'}`)}
          className="text-teal font-semibold min-h-12"
        >
          ← Back to deck
        </button>
      </div>
    );
  }

  const isWin = result.winner === 'player';
  const isLoss = result.winner === 'opponent';
  const isKnight = opponentInfo.type === 'knight';

  const headingText = isWin
    ? 'Victory!'
    : isLoss
      ? `${opponentInfo.name} Won`
      : "It's a Draw!";

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between safe-area max-w-[480px] mx-auto w-full px-5 py-5">
      <div className="overflow-y-auto pr-1">
        {/* Outcome Header & Mascot */}
        <div className="text-center pt-2 pb-5 border-b border-line">
          <div className="flex justify-center mb-3">
            {isWin ? (
              <div className="relative">
                <DoodleCrown size={72} />
                <div className="absolute -bottom-2 -right-2">
                  <DoodleAvatar type={opponentInfo.type} name={opponentInfo.name} size={36} />
                </div>
              </div>
            ) : isLoss ? (
              <DoodleAvatar type={opponentInfo.type} name={opponentInfo.name} size={72} />
            ) : (
              <DoodleShield size={72} />
            )}
          </div>

          <h1
            className={`text-4xl font-black tracking-tight ${
              isWin ? 'text-teal' : isLoss ? 'text-wine' : 'text-ink'
            }`}
          >
            {headingText}
          </h1>

          {/* Final Live Scores */}
          <div className="inline-flex items-center gap-3 mt-3 px-4 py-1.5 rounded-2xl bg-surface border-2 border-line text-lg font-black text-ink shadow-2xs">
            <span>You <span className="text-teal">{result.playerStats.score}</span></span>
            <span className="text-mute">·</span>
            <span><span className="text-amber">{result.opponentStats.score}</span> {opponentInfo.name}</span>
          </div>

          {/* Rating Change for Knight matches */}
          <div className="mt-3">
            {isKnight ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-line text-xs font-bold shadow-2xs">
                <span className="text-mute">Rating</span>
                <span
                  className={
                    result.ratingDelta >= 0
                      ? 'text-ok font-black'
                      : 'text-bad font-black'
                  }
                >
                  {result.ratingDelta >= 0 ? `+${result.ratingDelta}` : result.ratingDelta}
                </span>
                <span className="text-ink">→ {result.newRating}</span>
              </div>
            ) : (
              <span className="text-xs text-mute font-medium">
                Practice match · Deck rating unchanged
              </span>
            )}
          </div>
        </div>

        {/* Missed Cards Section */}
        <div className="py-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-ink flex items-center gap-1.5">
              <span>Words to Review</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-line text-mute">
                {result.missedCards.length}
              </span>
            </h2>
          </div>

          {result.missedCards.length === 0 ? (
            <div className="p-5 rounded-2xl bg-ok-bg border-2 border-ok/30 text-center flex flex-col items-center">
              <DoodleChest size={48} className="mb-2" />
              <p className="font-black text-ok text-base">Flawless Duel!</p>
              <p className="text-xs text-ink/70 mt-1">Every card was answered correctly.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {result.missedCards.map((item) => (
                <div
                  key={item.card.id}
                  className="p-3.5 rounded-2xl bg-surface border-2 border-line text-left shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-black text-base text-ink">
                      {item.card.word}
                    </span>

                    {/* Not Studied Tag for cards never flipped during study */}
                    {!item.wasStudied && (
                      <span className="px-2 py-0.5 rounded-full bg-crimson/10 border border-crimson/30 text-crimson text-[10px] font-black tracking-wider uppercase">
                        Not studied
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-ink/90 mt-1 leading-snug">
                    <span className="font-bold text-teal">Meaning: </span>
                    {item.correctAnswer}
                  </p>

                  {item.chosenAnswer && (
                    <p className="text-[11px] text-crimson mt-1 font-medium">
                      <span>Your choice: </span>
                      {item.chosenAnswer}
                    </p>
                  )}

                  <p className="text-[11px] text-mute italic mt-1.5">
                    "{item.card.example}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons in Bottom Half for Thumb Reach */}
      <div className="pt-3 border-t border-line space-y-2">
        <button
          onClick={handleRematch}
          className="w-full bg-teal text-white border-2 border-ink font-black text-base py-3.5 rounded-2xl min-h-12 active:scale-95 transition-transform motion-reduce:transition-none shadow-xs"
        >
          REMATCH
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleChangeWindow}
            className="w-full bg-surface border-2 border-line text-ink font-bold text-xs py-3 rounded-xl min-h-12 active:scale-95 transition-transform motion-reduce:transition-none shadow-2xs"
          >
            Change Window
          </button>
          <button
            onClick={handleBackToDeck}
            className="w-full bg-surface border-2 border-line text-ink font-bold text-xs py-3 rounded-xl min-h-12 active:scale-95 transition-transform motion-reduce:transition-none shadow-2xs"
          >
            Back to Deck
          </button>
        </div>
      </div>
    </div>
  );
}
