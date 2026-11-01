import { useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useMatchStore } from '../stores/match-store';
import StudyCard from '../components/StudyCard';

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
  // Calculate remaining seconds from engine timer if available, fallback to total
  const secondsLeft =
    timeRemainingMs > 0 ? Math.ceil(timeRemainingMs / 1000) : totalSeconds;

  const hasNavigated = useRef(false);

  // Navigate to countdown when phase transitions to countdown, or when timer hits zero
  useEffect(() => {
    if ((phase === 'countdown' || (phase === 'study' && isReady && isOpponentReady)) && !hasNavigated.current) {
      hasNavigated.current = true;
      navigate(`/countdown/${id}`);
    }
  }, [phase, isReady, isOpponentReady, id, navigate]);

  const handleReady = useCallback(() => {
    markReady();
    // If opponent is already ready or in Alpha 1 mode, ready initiates transition
    hasNavigated.current = true;
    navigate(`/countdown/${id}`);
  }, [markReady, id, navigate]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Guard: if no study set is loaded, redirect back.
  if (studySet.length === 0) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center p-4">
        <p className="text-mute text-lg mb-4">No study set loaded.</p>
        <button
          onClick={() => navigate(`/deck/${id}`)}
          className="text-accent font-semibold min-h-12"
        >
          Back to deck
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col safe-area">
      {/* Sticky header: timer + progress + ready button */}
      <div className="sticky top-0 z-10 bg-paper/95 backdrop-blur-sm border-b border-line shadow-2xs">
        <div className="max-w-[480px] mx-auto w-full px-5 py-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-ink tabular-nums">
                {formatTime(secondsLeft)}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-line text-mute font-medium">
                {flippedCardIds.size}/{studySet.length} studied
              </span>
            </div>
            {/* Opponent study status */}
            <p className="text-xs text-mute mt-0.5">
              {opponentInfo?.name ?? 'Opponent'}:{' '}
              <span className={isOpponentReady ? 'text-ok font-semibold' : 'text-mute italic'}>
                {isOpponentReady ? '✓ Ready' : 'Studying...'}
              </span>
            </p>
          </div>

          <button
            onClick={handleReady}
            disabled={isReady}
            className={[
              'px-5 py-2.5 rounded-xl min-h-12 font-semibold transition-all motion-reduce:transition-none',
              isReady
                ? 'bg-ok-bg text-ok border border-ok/40 cursor-default'
                : 'bg-accent text-white active:scale-[0.97]',
            ].join(' ')}
          >
            {isReady ? 'Ready ✓' : 'Ready'}
          </button>
        </div>

        {/* Timer progress bar */}
        <div className="h-1 bg-line">
          <div
            className="h-full bg-accent transition-all duration-300 ease-linear motion-reduce:transition-none"
            style={{ width: `${Math.min(100, (secondsLeft / totalSeconds) * 100)}%` }}
          />
        </div>
      </div>

      {/* Scrollable card stack */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[480px] mx-auto w-full px-5 py-5 space-y-4">
          {studySet.map((card) => (
            <StudyCard
              key={card.id}
              card={card}
              isFlipped={flippedCardIds.has(card.id)}
              onFlip={flipCard}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
