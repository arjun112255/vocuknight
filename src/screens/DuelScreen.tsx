import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useMatchStore } from '../stores/match-store';
import {
  DoodleHourglass,
  DoodleSword,
  DoodleShield,
  DoodleScroll,
  DoodleBook,
  DoodleCastle,
} from '../components/doodles/DoodleItems';

const OPTION_DOODLES = [DoodleSword, DoodleShield, DoodleScroll, DoodleBook];

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

  const secondsLeft = Math.max(0, Math.ceil(timeRemainingMs / 1000));

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

      submitAnswer(index);

      setTimeout(() => {
        setSelectedIdx(null);
        setFeedback(null);
      }, 150);
    },
    [currentQuestion, selectedIdx, submitAnswer],
  );

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
      <div className="min-h-[100dvh] flex flex-col items-center justify-center p-5 safe-area bg-bg-base text-white">
        <p className="text-mute text-lg mb-4 font-bold">No active duel found.</p>
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

  const totalPoints = playerScore + opponentScore;
  const leadPercent = totalPoints > 0 ? (playerScore / totalPoints) * 100 : 50;

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between safe-area max-w-[480px] mx-auto w-full px-4 py-4">
      {/* Top Header: Live Battle HUD */}
      <div className="bg-surface/90 backdrop-blur-md rounded-2xl border-2 border-line p-3.5 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          {/* Player Score */}
          <div className="flex flex-col">
            <span className="text-[10px] font-black italic uppercase tracking-wider text-cyan-glow">
              YOU
            </span>
            <span className="text-3xl font-black italic text-cyan-glow tabular-nums leading-none text-extrude-sm">
              {playerScore}
            </span>
          </div>

          {/* 60s Timer Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-card border border-line">
            <DoodleHourglass size={20} />
            <span className="text-sm font-black italic text-white tabular-nums text-extrude-sm">
              {secondsLeft}S
            </span>
          </div>

          {/* Opponent Score */}
          <div className="flex flex-col text-right">
            <span className="text-[10px] font-black italic uppercase tracking-wider text-amber truncate max-w-[90px]">
              {opponentInfo.name}
            </span>
            <span className="text-3xl font-black italic text-amber tabular-nums leading-none text-extrude-sm">
              {opponentScore}
            </span>
          </div>
        </div>

        {/* Split Tug-of-War Bar */}
        <div className="h-2 rounded-full bg-amber/30 overflow-hidden relative">
          <div
            className="h-full bg-cyan-glow transition-all duration-300 ease-out"
            style={{ width: `${leadPercent}%` }}
          />
        </div>

        {/* Linear 60s Timer Line */}
        <div className="h-1 bg-line rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-white transition-all duration-200 ease-linear motion-reduce:transition-none"
            style={{ width: `${(secondsLeft / 60) * 100}%` }}
          />
        </div>
      </div>

      {/* Center Prompt Area */}
      <div className="my-auto py-4 px-2 text-center w-full">
        {currentQuestion ? (
          <div className="p-6 rounded-3xl bg-surface border-2 border-line shadow-xl">
            <span className="text-[10px] uppercase font-black italic tracking-widest px-3 py-1 rounded-full bg-teal-dark/50 text-cyan-glow border border-cyan-glow/40">
              {currentQuestion.type === 'word_to_meaning'
                ? 'CHOOSE DEFINITION'
                : 'CHOOSE VOCABULARY WORD'}
            </span>

            <h1 className="text-3xl sm:text-4xl font-black italic uppercase text-white mt-4 break-words leading-tight text-extrude-lg">
              {currentQuestion.prompt}
            </h1>
          </div>
        ) : (
          <div className="text-mute font-black italic uppercase">Summoning next card...</div>
        )}
      </div>

      {/* Bottom Half: 4 Tactile Answer Buttons (Each with a Doodle Icon!) */}
      <div className="grid grid-cols-1 gap-2.5 pb-2">
        {currentQuestion?.options.map((option, idx) => {
          const isSelected = selectedIdx === idx;
          const isRight = idx === currentQuestion.correctIndex;
          const OptionIcon = OPTION_DOODLES[idx % OPTION_DOODLES.length];

          let btnClass = 'bg-surface border-line text-white hover:border-cyan-glow/60';
          if (isSelected) {
            btnClass = isRight
              ? 'bg-ok-bg border-ok text-ok ring-2 ring-ok'
              : 'bg-bad-bg border-bad text-bad ring-2 ring-bad';
          }

          return (
            <button
              key={`${idx}-${option}`}
              onClick={() => handleSelectOption(idx)}
              disabled={selectedIdx !== null}
              className={[
                'w-full text-left p-3.5 rounded-2xl border-2 min-h-12 font-bold shadow-md',
                'flex items-center gap-3 transition-all active:scale-[0.98] motion-reduce:transition-none',
                btnClass,
              ].join(' ')}
              aria-label={`Option ${idx + 1}: ${option}`}
            >
              {/* Doodle icon for every button */}
              <div className="w-8 h-8 rounded-lg bg-surface-card border border-line flex items-center justify-center shrink-0">
                <OptionIcon size={20} />
              </div>

              <span className="w-6 h-6 rounded-md bg-line/60 text-cyan-glow text-xs flex items-center justify-center font-black italic shrink-0">
                {idx + 1}
              </span>

              <span className="text-sm sm:text-base leading-snug font-bold text-white flex-1">
                {option}
              </span>

              {isSelected && feedback && (
                <span className="text-lg font-black shrink-0">
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
