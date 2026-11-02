import { useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useMatchStore } from '../stores/match-store';
import CardDeckStack from '../components/CardDeckStack';
import { DoodleHourglass, DoodleTorch, DoodleCastle } from '../components/doodles/DoodleItems';

export default function StudyView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    studyWindow,
    studySet,
    flippedCardIds,
    flipCard,
    markReady,
    isReady,
    isOpponentReady,
    opponentInfo,
    phase,
    timeRemainingMs,
  } = useMatchStore();

  const totalSeconds = studyWindow * 60;
  const secondsLeft =
    timeRemainingMs > 0 ? Math.ceil(timeRemainingMs / 1000) : totalSeconds;

  const hasNavigated = useRef(false);

  useEffect(() => {
    if (
      (phase === 'countdown' || (phase === 'study' && isReady && isOpponentReady)) &&
      !hasNavigated.current
    ) {
      hasNavigated.current = true;
      navigate(`/countdown/${id}`);
    }
  }, [phase, isReady, isOpponentReady, id, navigate]);

  const handleReady = useCallback(() => {
    markReady();
    hasNavigated.current = true;
    navigate(`/countdown/${id}`);
  }, [markReady, id, navigate]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (studySet.length === 0) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center p-4 safe-area bg-[#060913] text-white font-barriecito">
        <p className="text-xl text-[#8E9DB8] mb-4">No Study Set Loaded</p>
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

  const studiedCount = flippedCardIds.size;
  const totalCards = studySet.length;

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between safe-area max-w-[480px] mx-auto w-full px-4 py-3 bg-[#060913] font-barriecito">
      {/* Top Header */}
      <div className="ios-matte-card rounded-[22px] p-3.5 shadow-lg">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Timer & Studied badge */}
          <div className="flex items-center gap-2.5">
            <DoodleHourglass size={30} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl text-white tabular-nums tracking-tight">
                  {formatTime(secondsLeft)}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#0E1528] border border-[#38BDF8]/40 text-[#38BDF8]">
                  {studiedCount}/{totalCards} Studied
                </span>
              </div>
              <p className="font-body text-xs text-[#8E9DB8] mt-0.5">
                {opponentInfo?.name ?? 'Opponent'}:{' '}
                <span
                  className={
                    isOpponentReady ? 'text-[#38BDF8] font-semibold' : 'text-[#8E9DB8] italic'
                  }
                >
                  {isOpponentReady ? '✓ Ready' : 'Studying...'}
                </span>
              </p>
            </div>
          </div>

          {/* Right: Ready Button with Doodle Torch */}
          <button
            onClick={handleReady}
            disabled={isReady}
            className={[
              'px-4 py-2.5 rounded-xl min-h-[48px] text-base flex items-center gap-2 transition-all active:scale-95 shadow-md',
              isReady
                ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 cursor-default'
                : 'bg-[#0A9396] text-white border border-[#38BDF8]/50 hover:bg-[#005F73]',
            ].join(' ')}
          >
            <DoodleTorch size={18} />
            <span>{isReady ? 'Ready ✓' : 'Ready'}</span>
          </button>
        </div>

        {/* Depletion Bar */}
        <div className="h-1.5 bg-[#0A1020] rounded-full overflow-hidden mt-3 border border-[#18233C]">
          <div
            className="h-full bg-[#38BDF8] transition-all duration-300 ease-linear"
            style={{ width: `${Math.min(100, (secondsLeft / totalSeconds) * 100)}%` }}
          />
        </div>
      </div>

      {/* Main Center Area: Swipeable Card Deck Stack */}
      <div className="my-auto py-3 w-full flex items-center justify-center">
        <CardDeckStack
          cards={studySet}
          flippedCardIds={flippedCardIds}
          onFlip={flipCard}
        />
      </div>

      {/* Bottom Hint */}
      <div className="text-center pb-1 text-xs text-[#8E9DB8] tracking-wider">
        Swipe cards or tap arrows to browse · Tap to flip
      </div>
    </div>
  );
}
