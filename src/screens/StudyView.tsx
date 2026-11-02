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
      <div className="min-h-[100dvh] flex flex-col items-center justify-center p-4 safe-area bg-bg-base text-white">
        <p className="text-mute text-lg mb-4 font-bold">No study set loaded.</p>
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

  const studiedCount = flippedCardIds.size;
  const totalCards = studySet.length;

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between safe-area max-w-[480px] mx-auto w-full px-4 py-3">
      {/* Top Header */}
      <div className="bg-surface/90 backdrop-blur-md rounded-2xl border-2 border-line p-3.5 shadow-lg">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Timer & Studied badge */}
          <div className="flex items-center gap-2.5">
            <DoodleHourglass size={32} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black italic text-white tabular-nums tracking-tight text-extrude-sm">
                  {formatTime(secondsLeft)}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-surface-card border border-cyan-glow/40 font-black italic uppercase text-cyan-glow">
                  {studiedCount}/{totalCards} STUDIED
                </span>
              </div>
              <p className="text-xs font-semibold text-mute mt-0.5">
                {opponentInfo?.name ?? 'Opponent'}:{' '}
                <span
                  className={
                    isOpponentReady ? 'text-cyan-bright font-black italic' : 'text-mute italic'
                  }
                >
                  {isOpponentReady ? '✓ READY' : 'STUDYING...'}
                </span>
              </p>
            </div>
          </div>

          {/* Right: Ready Button with Doodle Torch */}
          <button
            onClick={handleReady}
            disabled={isReady}
            className={[
              'px-4 py-2.5 rounded-xl min-h-12 font-black italic uppercase text-xs flex items-center gap-2 transition-all active:scale-95 motion-reduce:transition-none shadow-md',
              isReady
                ? 'bg-ok/20 text-ok border border-ok/40 cursor-default'
                : 'bg-teal text-white border-2 border-cyan-glow active:bg-teal-dark text-extrude-sm',
            ].join(' ')}
          >
            <DoodleTorch size={20} />
            <span>{isReady ? 'READY ✓' : 'READY'}</span>
          </button>
        </div>

        {/* Depletion Bar */}
        <div className="h-1.5 bg-line rounded-full overflow-hidden mt-3">
          <div
            className="h-full bg-cyan-glow transition-all duration-300 ease-linear motion-reduce:transition-none"
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
      <div className="text-center pb-1 text-xs font-semibold text-mute/80 uppercase tracking-wider">
        Swipe cards or tap arrows to browse · Tap to flip
      </div>
    </div>
  );
}
