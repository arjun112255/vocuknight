import { useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useMatchStore } from '../stores/match-store';
import CardDeckStack from '../components/CardDeckStack';
import { DoodleHourglass } from '../components/doodles/DoodleItems';

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

  // Navigate to countdown when phase transitions to countdown, or when both are ready / timer ends
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
      <div className="min-h-[100dvh] flex flex-col items-center justify-center p-4 safe-area">
        <p className="text-mute text-lg mb-4">No study set loaded.</p>
        <button
          onClick={() => navigate(`/deck/${id ?? 'everyday-essentials'}`)}
          className="text-teal font-semibold min-h-12"
        >
          ← Back to deck
        </button>
      </div>
    );
  }

  const studiedCount = flippedCardIds.size;
  const totalCards = studySet.length;

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between safe-area max-w-[480px] mx-auto w-full px-4 py-3">
      {/* Top Header: Timer + Opponent Readiness + Ready Button */}
      <div className="bg-surface/90 backdrop-blur-md rounded-2xl border-2 border-line p-3.5 shadow-xs">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Timer & Studied badge */}
          <div className="flex items-center gap-2.5">
            <DoodleHourglass size={32} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-ink tabular-nums tracking-tight">
                  {formatTime(secondsLeft)}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-parchment/60 border border-line font-bold text-ink">
                  {studiedCount}/{totalCards} studied
                </span>
              </div>
              <p className="text-xs text-mute mt-0.5">
                {opponentInfo?.name ?? 'Opponent'}:{' '}
                <span
                  className={
                    isOpponentReady ? 'text-teal font-bold' : 'text-mute italic'
                  }
                >
                  {isOpponentReady ? '✓ Ready' : 'Studying...'}
                </span>
              </p>
            </div>
          </div>

          {/* Right: Ready Button */}
          <button
            onClick={handleReady}
            disabled={isReady}
            className={[
              'px-4 py-2.5 rounded-xl min-h-12 font-bold text-sm transition-all active:scale-95 motion-reduce:transition-none shadow-xs',
              isReady
                ? 'bg-ok-bg text-ok border border-ok/40 cursor-default'
                : 'bg-teal text-white border-2 border-ink active:bg-teal-dark',
            ].join(' ')}
          >
            {isReady ? 'Ready ✓' : 'Ready'}
          </button>
        </div>

        {/* Linear Timer Depletion Bar */}
        <div className="h-1.5 bg-line rounded-full overflow-hidden mt-3">
          <div
            className="h-full bg-teal transition-all duration-300 ease-linear motion-reduce:transition-none"
            style={{ width: `${Math.min(100, (secondsLeft / totalSeconds) * 100)}%` }}
          />
        </div>
      </div>

      {/* Main Center Area: Swipeable Card Deck Stack */}
      <div className="my-auto py-4 w-full flex items-center justify-center">
        <CardDeckStack
          cards={studySet}
          flippedCardIds={flippedCardIds}
          onFlip={flipCard}
        />
      </div>

      {/* Bottom Hint */}
      <div className="text-center pb-1 text-xs text-mute/80">
        Swipe cards or tap arrows to navigate · Tap to flip
      </div>
    </div>
  );
}
