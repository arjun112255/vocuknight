import { useParams, useNavigate } from 'react-router';
import { useMatchStore } from '../stores/match-store';
import DoodleAvatar from '../components/DoodleAvatar';
import {
  DoodleCrown,
  DoodleShield,
  DoodleChest,
  DoodleSword,
  DoodleHourglass,
  DoodleCastle,
} from '../components/doodles/DoodleItems';

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
      <div className="min-h-[100dvh] flex flex-col items-center justify-center p-5 safe-area bg-bg-base text-white">
        <p className="text-mute text-lg mb-4 font-bold">No match results available.</p>
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

  const isWin = result.winner === 'player';
  const isLoss = result.winner === 'opponent';
  const isKnight = opponentInfo.type === 'knight';

  const headingText = isWin
    ? 'VICTORY!'
    : isLoss
      ? `${opponentInfo.name.toUpperCase()} WON`
      : "IT'S A DRAW!";

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between safe-area max-w-[480px] mx-auto w-full px-5 py-5">
      <div className="overflow-y-auto pr-1">
        {/* Outcome Header & Mascot */}
        <div className="text-center pt-2 pb-5 border-b border-line">
          <div className="flex justify-center mb-3 doodle-sticker-glow">
            {isWin ? (
              <div className="relative">
                <DoodleCrown size={76} />
                <div className="absolute -bottom-2 -right-2">
                  <DoodleAvatar type={opponentInfo.type} name={opponentInfo.name} size={38} />
                </div>
              </div>
            ) : isLoss ? (
              <DoodleAvatar type={opponentInfo.type} name={opponentInfo.name} size={76} />
            ) : (
              <DoodleShield size={76} />
            )}
          </div>

          <h1
            className={`text-4xl sm:text-5xl font-black italic uppercase tracking-tight text-extrude-lg ${
              isWin ? 'text-white' : isLoss ? 'text-crimson' : 'text-cyan-glow'
            }`}
          >
            {headingText}
          </h1>

          {/* Final Live Scores */}
          <div className="inline-flex items-center gap-3 mt-3 px-5 py-2 rounded-2xl bg-surface border-2 border-line text-lg font-black italic uppercase text-white shadow-md">
            <span>YOU <span className="text-cyan-glow text-extrude-sm">{result.playerStats.score}</span></span>
            <span className="text-mute">·</span>
            <span><span className="text-amber text-extrude-sm">{result.opponentStats.score}</span> {opponentInfo.name}</span>
          </div>

          {/* Rating Change for Knight matches */}
          <div className="mt-3">
            {isKnight ? (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-card border border-line text-xs font-black italic uppercase shadow-md">
                <span className="text-mute">RATING</span>
                <span
                  className={
                    result.ratingDelta >= 0
                      ? 'text-ok font-black'
                      : 'text-bad font-black'
                  }
                >
                  {result.ratingDelta >= 0 ? `+${result.ratingDelta}` : result.ratingDelta}
                </span>
                <span className="text-white">→ {result.newRating}</span>
              </div>
            ) : (
              <span className="text-xs text-mute font-bold italic uppercase tracking-wider">
                Practice match · Deck rating unchanged
              </span>
            )}
          </div>
        </div>

        {/* Missed Cards Review Section */}
        <div className="py-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-black italic uppercase tracking-wider text-cyan-glow flex items-center gap-1.5">
              <span>WORDS TO REVIEW</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-surface-card text-white border border-line">
                {result.missedCards.length}
              </span>
            </h2>
          </div>

          {result.missedCards.length === 0 ? (
            <div className="p-5 rounded-2xl bg-ok-bg border-2 border-ok/40 text-center flex flex-col items-center shadow-lg">
              <DoodleChest size={48} className="mb-2" />
              <p className="font-black italic uppercase text-white text-lg text-extrude-sm">FLAWLESS DUEL!</p>
              <p className="text-xs text-cyan-light mt-1 font-semibold">Every card was answered correctly.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {result.missedCards.map((item) => (
                <div
                  key={item.card.id}
                  className="p-4 rounded-2xl bg-surface border-2 border-line text-left shadow-md"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-black italic uppercase text-lg text-white text-extrude-sm">
                      {item.card.word}
                    </span>

                    {/* Not Studied Tag */}
                    {!item.wasStudied && (
                      <span className="px-2.5 py-0.5 rounded-full bg-bad-bg border border-bad/50 text-crimson text-[10px] font-black italic uppercase tracking-wider">
                        NOT STUDIED
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-white/95 mt-1.5 leading-snug font-semibold">
                    <span className="font-black text-cyan-glow uppercase tracking-wider text-xs">Meaning: </span>
                    {item.correctAnswer}
                  </p>

                  {item.chosenAnswer && (
                    <p className="text-xs text-crimson mt-1 font-bold">
                      <span className="uppercase text-[11px]">Your choice: </span>
                      {item.chosenAnswer}
                    </p>
                  )}

                  <p className="text-xs text-mute italic mt-2 font-medium">
                    "{item.card.example}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons: EVERY clickable button has a doodle icon! */}
      <div className="pt-3 border-t border-line space-y-2.5">
        <button
          onClick={handleRematch}
          className="w-full bg-teal text-white border-2 border-cyan-glow font-black italic uppercase text-lg py-3.5 rounded-2xl min-h-12 flex items-center justify-center gap-3 active:scale-95 transition-transform motion-reduce:transition-none shadow-lg text-extrude"
        >
          <DoodleSword size={24} />
          <span>REMATCH</span>
        </button>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={handleChangeWindow}
            className="w-full bg-surface border-2 border-line text-white font-black italic uppercase text-xs py-3 rounded-xl min-h-12 flex items-center justify-center gap-2 active:scale-95 transition-transform motion-reduce:transition-none shadow-md hover:border-cyan-glow/50"
          >
            <DoodleHourglass size={18} />
            <span>Change Window</span>
          </button>
          <button
            onClick={handleBackToDeck}
            className="w-full bg-surface border-2 border-line text-white font-black italic uppercase text-xs py-3 rounded-xl min-h-12 flex items-center justify-center gap-2 active:scale-95 transition-transform motion-reduce:transition-none shadow-md hover:border-cyan-glow/50"
          >
            <DoodleCastle size={18} />
            <span>Back to Deck</span>
          </button>
        </div>
      </div>
    </div>
  );
}
