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
      <div className="min-h-[100dvh] flex flex-col items-center justify-center p-5 safe-area bg-[#060913] text-white font-barriecito">
        <p className="text-xl text-[#8E9DB8] mb-4">No Active Duel Found</p>
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

  const totalPoints = playerScore + opponentScore;
  const leadPercent = totalPoints > 0 ? (playerScore / totalPoints) * 100 : 50;

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between safe-area max-w-[480px] mx-auto w-full px-4 py-4 bg-[#060913] font-barriecito">
      {/* Top Header: Live Battle HUD */}
      <div className="ios-matte-card rounded-[22px] p-3.5 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          {/* Player Score */}
          <div className="flex flex-col">
            <span className="text-sm tracking-wider text-[#38BDF8]">
              You
            </span>
            <span className="text-4xl text-[#38BDF8] tabular-nums leading-none">
              {playerScore}
            </span>
          </div>

          {/* 60s Timer Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#090F1E] border border-[#1C2C4E]">
            <DoodleHourglass size={18} />
            <span className="text-base text-white tabular-nums tracking-wide">
              {secondsLeft}s
            </span>
          </div>

          {/* Opponent Score */}
          <div className="flex flex-col text-right">
            <span className="text-sm tracking-wider text-[#EE9B00] truncate max-w-[90px]">
              {opponentInfo.name}
            </span>
            <span className="text-4xl text-[#EE9B00] tabular-nums leading-none">
              {opponentScore}
            </span>
          </div>
        </div>

        {/* Tug-of-War Bar */}
        <div className="h-2 rounded-full bg-[#EE9B00]/25 overflow-hidden relative">
          <div
            className="h-full bg-[#38BDF8] transition-all duration-300 ease-out"
            style={{ width: `${leadPercent}%` }}
          />
        </div>

        {/* 60s Depletion Bar */}
        <div className="h-1 bg-[#090F1E] rounded-full overflow-hidden mt-2 border border-[#18233C]">
          <div
            className="h-full bg-white transition-all duration-200 ease-linear"
            style={{ width: `${(secondsLeft / 60) * 100}%` }}
          />
        </div>
      </div>

      {/* Center Prompt Area */}
      <div className="my-auto py-4 px-1 text-center w-full">
        {currentQuestion ? (
          <div className="ios-matte-card rounded-[24px] p-6 shadow-xl">
            <span className="text-xs tracking-widest px-3 py-1 rounded-full bg-[#005F73]/40 text-[#38BDF8] border border-[#0A9396]/40">
              {currentQuestion.type === 'word_to_meaning'
                ? 'Choose the Correct Meaning'
                : 'Choose the Matching Word'}
            </span>

            <h1 className="text-3xl sm:text-4xl text-white mt-4 break-words leading-tight text-extrude">
              {currentQuestion.prompt}
            </h1>
          </div>
        ) : (
          <div className="text-base text-[#8E9DB8]">Summoning next card...</div>
        )}
      </div>

      {/* Bottom Half: 4 Tactile Answer Buttons */}
      <div className="grid grid-cols-1 gap-2.5 pb-2">
        {currentQuestion?.options.map((option, idx) => {
          const isSelected = selectedIdx === idx;
          const isRight = idx === currentQuestion.correctIndex;
          const OptionIcon = OPTION_DOODLES[idx % OPTION_DOODLES.length];

          let btnClass = 'bg-[#0E1528] border-[#1C2C4E] text-white hover:border-[#38BDF8]/60';
          if (isSelected) {
            btnClass = isRight
              ? 'bg-[#10B981]/20 border-[#10B981] text-[#10B981]'
              : 'bg-[#EF4444]/20 border-[#EF4444] text-[#EF4444]';
          }

          return (
            <button
              key={`${idx}-${option}`}
              onClick={() => handleSelectOption(idx)}
              disabled={selectedIdx !== null}
              className={[
                'w-full text-left p-3 rounded-2xl border min-h-[54px]',
                'flex items-center gap-3 transition-all active:scale-[0.98]',
                btnClass,
              ].join(' ')}
              aria-label={`Option ${idx + 1}: ${option}`}
            >
              {/* Doodle icon for every button */}
              <div className="w-8 h-8 rounded-xl bg-[#090F1E] border border-[#1C2C4E] flex items-center justify-center shrink-0">
                <OptionIcon size={20} />
              </div>

              <span className="w-6 h-6 rounded-lg bg-[#141F38] text-[#38BDF8] text-sm flex items-center justify-center shrink-0">
                {idx + 1}
              </span>

              <span className="text-base sm:text-lg leading-snug text-white flex-1">
                {option}
              </span>

              {isSelected && feedback && (
                <span className="text-xl shrink-0">
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
