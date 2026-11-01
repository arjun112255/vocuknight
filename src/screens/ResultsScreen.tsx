import { useParams, useNavigate } from 'react-router';
import { useMatchStore } from '../stores/match-store';
import DoodleAvatar from '../components/DoodleAvatar';

export default function ResultsScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    result,
    opponentInfo,
    restartMatch,
    reset,
  } = useMatchStore();

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
          className="text-accent font-semibold min-h-12"
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
    ? 'You Won!'
    : isLoss
      ? `${opponentInfo.name} Won`
      : "It's a Draw!";

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between safe-area max-w-[480px] mx-auto w-full px-5 py-6">
      <div className="overflow-y-auto pr-1">
        {/* Outcome Header & Mascot */}
        <div className="text-center pt-2 pb-6 border-b border-line">
          <div className="flex justify-center mb-3">
            <DoodleAvatar type={opponentInfo.type} name={opponentInfo.name} size={84} />
          </div>

          <h1 className="text-3xl font-extrabold text-ink tracking-tight">
            {headingText}
          </h1>

          {/* Final Scores */}
          <div className="text-lg font-bold text-ink mt-2">
            You <span className="text-accent">{result.playerStats.score}</span> ·{' '}
            <span className="text-opponent">{result.opponentStats.score}</span> {opponentInfo.name}
          </div>

          {/* Rating Change for Knight matches */}
          <div className="mt-3">
            {isKnight ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-line text-sm font-semibold">
                <span>Rating</span>
                <span
                  className={
                    result.ratingDelta >= 0
                      ? 'text-ok font-bold'
                      : 'text-bad font-bold'
                  }
                >
                  {result.ratingDelta >= 0 ? `+${result.ratingDelta}` : result.ratingDelta}
                </span>
                <span className="text-mute">→ {result.newRating}</span>
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
          <h2 className="text-sm font-bold uppercase tracking-wider text-mute mb-3">
            Words to Review ({result.missedCards.length})
          </h2>

          {result.missedCards.length === 0 ? (
            <div className="p-5 rounded-2xl bg-ok-bg border border-ok/30 text-center">
              <p className="font-bold text-ok text-base">Perfect Match!</p>
              <p className="text-xs text-ok/80 mt-1">Every card was answered correctly.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {result.missedCards.map((item) => (
                <div
                  key={item.card.id}
                  className="p-4 rounded-xl bg-surface border border-line text-left"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-lg text-ink">
                      {item.card.word}
                    </span>

                    {/* Not Studied Tag for cards never flipped during study */}
                    {!item.wasStudied && (
                      <span className="px-2 py-0.5 rounded-md bg-bad-bg border border-bad/30 text-bad text-xs font-semibold">
                        Not studied
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-ink/90 mt-1 leading-snug">
                    <span className="font-medium text-ok">Meaning: </span>
                    {item.correctAnswer}
                  </p>

                  {item.chosenAnswer && (
                    <p className="text-xs text-bad mt-1">
                      <span className="font-medium">Your answer: </span>
                      {item.chosenAnswer}
                    </p>
                  )}

                  <p className="text-xs text-mute italic mt-2">
                    "{item.card.example}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons in bottom half for thumb reach */}
      <div className="pt-4 border-t border-line space-y-2.5">
        <button
          onClick={handleRematch}
          className="w-full bg-accent text-white font-bold text-base py-3.5 rounded-xl min-h-12 active:scale-[0.98] transition-transform motion-reduce:transition-none"
        >
          Rematch
        </button>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={handleChangeWindow}
            className="w-full bg-surface border-2 border-line text-ink font-semibold text-sm py-3 rounded-xl min-h-12 active:scale-[0.98] transition-transform motion-reduce:transition-none"
          >
            Change window
          </button>
          <button
            onClick={handleBackToDeck}
            className="w-full bg-surface border-2 border-line text-ink font-semibold text-sm py-3 rounded-xl min-h-12 active:scale-[0.98] transition-transform motion-reduce:transition-none"
          >
            Back to deck
          </button>
        </div>
      </div>
    </div>
  );
}
