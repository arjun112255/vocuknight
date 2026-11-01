import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useMatchStore } from '../stores/match-store';
import StudyCard from '../components/StudyCard';

export default function StudyView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { studyWindow, studySet, flippedCardIds, flipCard, markReady, isReady } =
    useMatchStore();

  const totalSeconds = studyWindow * 60;
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const hasNavigated = useRef(false);

  // Countdown timer — pauses when already ready.
  useEffect(() => {
    if (isReady) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isReady]);

  // Navigate to duel placeholder when timer expires or player taps Ready.
  useEffect(() => {
    if ((timeLeft === 0 || isReady) && !hasNavigated.current) {
      hasNavigated.current = true;
      navigate('/duel-placeholder');
    }
  }, [timeLeft, isReady, navigate]);

  const handleReady = useCallback(() => {
    markReady();
  }, [markReady]);

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
      <div className="sticky top-0 z-10 bg-paper/95 backdrop-blur-sm border-b border-line">
        <div className="max-w-[480px] mx-auto w-full px-5 py-3 flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-ink tabular-nums">
              {formatTime(timeLeft)}
            </span>
            <span className="text-sm text-mute ml-2">
              {flippedCardIds.size} / {studySet.length} studied
            </span>
          </div>
          <button
            onClick={handleReady}
            className="bg-accent text-white font-semibold px-5 py-2.5 rounded-xl min-h-12 active:scale-[0.97] transition-transform motion-reduce:transition-none"
          >
            Ready
          </button>
        </div>

        {/* Timer progress bar */}
        <div className="h-1 bg-line">
          <div
            className="h-full bg-accent transition-all duration-1000 ease-linear motion-reduce:transition-none"
            style={{ width: `${(timeLeft / totalSeconds) * 100}%` }}
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
