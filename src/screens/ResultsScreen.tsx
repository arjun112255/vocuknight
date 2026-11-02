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
    if (id === 'random-deck') {
      navigate('/');
    } else {
      navigate(`/play/${id}`);
    }
  };

  const handleBackToDeck = () => {
    reset();
    navigate('/');
  };

  if (!result || !opponentInfo) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center p-5 safe-area bg-[#060913] text-white font-barriecito">
        <p className="text-xl text-[#8E9DB8] mb-4">No Match Results Available</p>
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

  const isWin = result.winner === 'player';
  const isLoss = result.winner === 'opponent';
  const isKnight = opponentInfo.type === 'knight';

  const headingText = isWin
    ? 'Victory!'
    : isLoss
      ? `${opponentInfo.name} Won`
      : "It's a Draw!";

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between safe-area max-w-[480px] mx-auto w-full px-5 py-5 bg-[#060913] font-barriecito">
      <div className="overflow-y-auto pr-1">
        {/* Outcome Header & Mascot */}
        <div className="text-center pt-2 pb-5 border-b border-[#18233C]">
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
            className={`text-5xl sm:text-6xl tracking-tight text-extrude-lg ${
              isWin ? 'text-white' : isLoss ? 'text-[#EF4444]' : 'text-[#38BDF8]'
            }`}
          >
            {headingText}
          </h1>

          {/* Final Live Scores */}
          <div className="inline-flex items-center gap-3 mt-3 px-5 py-2 rounded-2xl bg-[#0E1528] border border-[#1C2C4E] text-xl text-white shadow-md">
            <span>You <span className="text-[#38BDF8]">{result.playerStats.score}</span></span>
            <span className="text-[#8E9DB8]">·</span>
            <span><span className="text-[#EE9B00]">{result.opponentStats.score}</span> {opponentInfo.name}</span>
          </div>

          {/* Rating Change for Knight matches */}
          <div className="mt-3">
            {isKnight ? (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0E1528] border border-[#1C2C4E] text-xs shadow-md">
                <span className="text-[#8E9DB8]">Rating</span>
                <span
                  className={
                    result.ratingDelta >= 0
                      ? 'text-[#10B981] font-bold'
                      : 'text-[#EF4444] font-bold'
                  }
                >
                  {result.ratingDelta >= 0 ? `+${result.ratingDelta}` : result.ratingDelta}
                </span>
                <span className="text-white">→ {result.newRating}</span>
              </div>
            ) : (
              <span className="text-xs text-[#8E9DB8] tracking-wider">
                Practice match · Deck rating unchanged
              </span>
            )}
          </div>
        </div>

        {/* Missed Cards Review Section */}
        <div className="py-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm tracking-wider text-[#38BDF8] flex items-center gap-1.5">
              <span>Words to Review</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#0E1528] text-white border border-[#1C2C4E]">
                {result.missedCards.length}
              </span>
            </h2>
          </div>

          {result.missedCards.length === 0 ? (
            <div className="p-5 rounded-2xl bg-[#064E3B]/25 border border-[#10B981]/40 text-center flex flex-col items-center shadow-lg">
              <DoodleChest size={48} className="mb-2" />
              <p className="text-white text-2xl">Flawless Duel!</p>
              <p className="font-body text-xs text-[#38BDF8] mt-1 font-semibold">Every card was answered correctly.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {result.missedCards.map((item) => (
                <div
                  key={item.card.id}
                  className="p-4 rounded-2xl ios-matte-card text-left shadow-md"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-2xl text-white">
                      {item.card.word}
                    </span>

                    {/* Not Studied Tag */}
                    {!item.wasStudied && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#7F1D1D]/40 border border-[#EF4444]/40 text-[#EF4444] text-[11px] tracking-wider">
                        Not Studied
                      </span>
                    )}
                  </div>

                  <p className="font-body text-sm text-white/95 mt-1.5 leading-snug font-semibold">
                    <span className="font-barriecito tracking-wider text-xs text-[#38BDF8]">Meaning: </span>
                    {item.correctAnswer}
                  </p>

                  {item.chosenAnswer && (
                    <p className="font-body text-xs text-[#EF4444] mt-1 font-bold">
                      <span className="font-barriecito text-xs">Your choice: </span>
                      {item.chosenAnswer}
                    </p>
                  )}

                  <p className="font-body text-xs text-[#8E9DB8] italic mt-2">
                    "{item.card.example}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons: EVERY clickable button has a doodle icon! */}
      <div className="pt-3 border-t border-[#18233C] space-y-2.5">
        <button
          onClick={handleRematch}
          className="w-full bg-[#0A9396] text-white border border-[#38BDF8]/60 text-2xl py-3.5 rounded-2xl min-h-[52px] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg hover:bg-[#005F73]"
        >
          <DoodleSword size={22} />
          <span>Rematch</span>
        </button>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={handleChangeWindow}
            className="w-full bg-[#0E1528] border border-[#1C2C4E] text-white text-sm py-3 rounded-xl min-h-[46px] flex items-center justify-center gap-2 active:scale-95 transition-all hover:border-[#38BDF8]/50"
          >
            <DoodleHourglass size={16} />
            <span>Change Window</span>
          </button>
          <button
            onClick={handleBackToDeck}
            className="w-full bg-[#0E1528] border border-[#1C2C4E] text-white text-sm py-3 rounded-xl min-h-[46px] flex items-center justify-center gap-2 active:scale-95 transition-all hover:border-[#38BDF8]/50"
          >
            <DoodleCastle size={16} />
            <span>Arena Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}
