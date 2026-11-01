import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useMatchStore } from '../stores/match-store';

export default function DuelScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    currentQuestion,
    playerScore,
    opponentScore,
    opponentInfo,
    submitAnswer,
    phase,
    timeRemainingMs,
    engine,
  } = useMatchStore();

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'ok' | 'bad' | null>(null);
  const hasNavigated = useRef(false);

  // Remaining seconds (60 seconds down to 0)
  const secondsLeft = Math.max(0, Math.ceil(timeRemainingMs / 1000));

  // Navigate to results when phase is results or time hits zero
  useEffect(() => {
    if ((phase === 'results' || (timeRemainingMs === 0 && playerScore + opponentScore > 0)) && !hasNavigated.current) {
      hasNavigated.current = true;
      navigate(`/results/${id}`);
    }
  }, [phase, timeRemainingMs, playerScore, opponentScore, id, navigate]);

  const handleSelectOption = useCallback(
    (index: number) => {
      if (!currentQuestion || selectedIdx !== null) return;

      setSelectedIdx(index);
      const isRight = index === currentQuestion.correctIndex;
      setFeedback(isRight ? 'ok' : 'bad');

      // Submit immediately to match engine
      submitAnswer(index);

      // Brief visual touch feedback before resetting for next question
      setTimeout(() => {
        setSelectedIdx(null);
        setFeedback(null);
      }, 140);
    },
    [currentQuestion, selectedIdx, submitAnswer],
  );

  // Keyboard accessibility: 1, 2, 3, 4 keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        handleSelectOption(idx);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSelectOption]);

  if (!opponentInfo || !engine) {
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

  const totalPoints = playerScore + opponentScore;
  const leadPercent = totalPoints > 0 ? (playerScore / totalPoints) * 100 : 50;

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between safe-area max-w-[480px] mx-auto w-full px-5 py-4">
      {/* Top Header: Scoreboard + Tug of War + 60s Timer */}
      <div>
        {/* Live Scores */}
        <div className="flex items-end justify-between mb-2">
          <div>
            <span className="text-xs text-mute font-medium">You</span>
            <div className="text-3xl font-extrabold text-accent tabular-nums leading-none">
              {playerScore}
            </div>
          </div>

          <div className="text-center">
            <span className="text-sm font-bold text-ink tabular-nums px-3 py-1 rounded-full bg-line/60">
              {secondsLeft}s
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs text-mute font-medium">{opponentInfo.name}</span>
            <div className="text-3xl font-extrabold text-opponent tabular-nums leading-none">
              {opponentScore}
            </div>
          </div>
        </div>

        {/* Tug-of-War bar */}
        <div className="h-2 rounded-full bg-opponent/30 overflow-hidden mb-2">
          <div
            className="h-full bg-accent transition-all duration-300 ease-out"
            style={{ width: `${leadPercent}%` }}
          />
        </div>

        {/* 60-Second Timer Line */}
        <div className="h-1 bg-line rounded-full overflow-hidden">
          <div
            className="h-full bg-ink transition-all duration-200 ease-linear motion-reduce:transition-none"
            style={{ width: `${(secondsLeft / 60) * 100}%` }}
          />
        </div>
      </div>

      {/* Center Prompt Area */}
      <div className="my-auto py-6 text-center">
        {currentQuestion ? (
          <div>
            <span className="text-xs uppercase tracking-wider text-mute font-semibold">
              {currentQuestion.type === 'word_to_meaning'
                ? 'Choose the meaning'
                : 'Choose the word'}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-ink mt-3 break-words leading-snug">
              {currentQuestion.prompt}
            </h1>
          </div>
        ) : (
          <div className="text-mute">Preparing next card...</div>
        )}
      </div>

      {/* Bottom Half: 4 Answer Buttons (Thumb zone reach) */}
      <div className="grid grid-cols-1 gap-3 pb-6">
        {currentQuestion?.options.map((option, idx) => {
          const isSelected = selectedIdx === idx;
          const isRight = idx === currentQuestion.correctIndex;

          let btnColor = 'bg-surface border-line text-ink';
          if (isSelected) {
            btnColor = isRight
              ? 'bg-ok-bg border-ok text-ok'
              : 'bg-bad-bg border-bad text-bad';
          }

          return (
            <button
              key={`${idx}-${option}`}
              onClick={() => handleSelectOption(idx)}
              disabled={selectedIdx !== null}
              className={[
                'w-full text-left p-4 rounded-xl border-2 min-h-12 font-medium',
                'flex items-center gap-3 transition-colors active:scale-[0.98] motion-reduce:transition-none',
                btnColor,
              ].join(' ')}
              aria-label={`Option ${idx + 1}: ${option}`}
            >
              <span className="w-6 h-6 rounded-md bg-line/60 text-mute text-xs flex items-center justify-center font-bold shrink-0">
                {idx + 1}
              </span>
              <span className="text-sm md:text-base leading-snug flex-1">
                {option}
              </span>
              {isSelected && feedback && (
                <span className="text-base font-bold shrink-0">
                  {isRight ? '✓' : '✗'}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
