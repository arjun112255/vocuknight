import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useMatchStore } from '../stores/match-store';
import { DoodleHourglass } from '../components/doodles/DoodleItems';

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
    if (
      (phase === 'results' || (timeRemainingMs === 0 && playerScore + opponentScore > 0)) &&
      !hasNavigated.current
    ) {
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

      // Submit answer immediately to engine
      submitAnswer(index);

      // Fast, tactile visual touch feedback before next card loads
      setTimeout(() => {
        setSelectedIdx(null);
        setFeedback(null);
      }, 150);
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
        <p className="text-mute text-lg mb-4">No active duel found.</p>
        <button
          onClick={() => navigate(`/deck/${id ?? 'everyday-essentials'}`)}
          className="text-teal font-semibold min-h-12 flex items-center"
        >
          ← Back to deck
        </button>
      </div>
    );
  }

  const totalPoints = playerScore + opponentScore;
  const leadPercent = totalPoints > 0 ? (playerScore / totalPoints) * 100 : 50;

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between safe-area max-w-[480px] mx-auto w-full px-4 py-4">
      {/* Top Header: Matiks-Style Live Battle Scoreboard */}
      <div className="bg-surface/90 backdrop-blur-md rounded-2xl border-2 border-line p-3.5 shadow-xs">
        {/* Live Scores & Timer Pill */}
        <div className="flex items-center justify-between mb-2">
          {/* Player Score */}
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-wider text-teal">
              You
            </span>
            <span className="text-3xl font-black text-teal tabular-nums leading-none">
              {playerScore}
            </span>
          </div>

          {/* Center 60s Timer Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-parchment/60 border border-line">
            <DoodleHourglass size={18} />
            <span className="text-sm font-black text-ink tabular-nums">
              {secondsLeft}s
            </span>
          </div>

          {/* Opponent Score */}
          <div className="flex flex-col text-right">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber truncate max-w-[90px]">
              {opponentInfo.name}
            </span>
            <span className="text-3xl font-black text-amber tabular-nums leading-none">
              {opponentScore}
            </span>
          </div>
        </div>

        {/* Dynamic Split Tug-of-War Bar */}
        <div className="h-2 rounded-full bg-amber/30 overflow-hidden relative">
          <div
            className="h-full bg-teal transition-all duration-300 ease-out"
            style={{ width: `${leadPercent}%` }}
          />
        </div>

        {/* Linear 60s Timer Line */}
        <div className="h-1 bg-line rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-ink transition-all duration-200 ease-linear motion-reduce:transition-none"
            style={{ width: `${(secondsLeft / 60) * 100}%` }}
          />
        </div>
      </div>

      {/* Center Prompt Area: High-Contrast Floating Question Card */}
      <div className="my-auto py-4 px-2 text-center w-full">
        {currentQuestion ? (
          <div className="p-6 rounded-3xl bg-surface border-2 border-line shadow-sm">
            <span className="text-[10px] uppercase font-black tracking-widest px-2.5 py-0.5 rounded-full bg-sage/20 text-teal-dark border border-sage/40">
              {currentQuestion.type === 'word_to_meaning'
                ? 'Choose Definition'
                : 'Choose Vocabulary Word'}
            </span>

            <h1 className="text-3xl sm:text-4xl font-black text-ink mt-4 break-words leading-tight">
              {currentQuestion.prompt}
            </h1>
          </div>
        ) : (
          <div className="text-mute font-medium">Summoning next card...</div>
        )}
      </div>

      {/* Bottom Half: 4 Tactile Answer Buttons (Thumb Zone Reach) */}
      <div className="grid grid-cols-1 gap-2.5 pb-2">
        {currentQuestion?.options.map((option, idx) => {
          const isSelected = selectedIdx === idx;
          const isRight = idx === currentQuestion.correctIndex;

          let btnClass = 'bg-surface border-line text-ink hover:border-teal/60';
          if (isSelected) {
            btnClass = isRight
              ? 'bg-ok-bg border-ok text-ok'
              : 'bg-bad-bg border-bad text-bad';
          }

          return (
            <button
              key={`${idx}-${option}`}
              onClick={() => handleSelectOption(idx)}
              disabled={selectedIdx !== null}
              className={[
                'w-full text-left p-3.5 rounded-2xl border-2 min-h-12 font-medium shadow-2xs',
                'flex items-center gap-3 transition-all active:scale-[0.98] motion-reduce:transition-none',
                btnClass,
              ].join(' ')}
              aria-label={`Option ${idx + 1}: ${option}`}
            >
              <span className="w-7 h-7 rounded-lg bg-parchment/70 border border-line text-ink text-xs flex items-center justify-center font-black shrink-0">
                {idx + 1}
              </span>
              <span className="text-sm sm:text-base leading-snug font-semibold flex-1">
                {option}
              </span>
              {isSelected && feedback && (
                <span className="text-base font-black shrink-0">
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
