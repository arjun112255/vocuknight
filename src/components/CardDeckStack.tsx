import { useState, useRef, useEffect, useCallback } from 'react';
import { WordCard } from '../engine/types';
import { DoodleBook, DoodleScroll, DoodleSword } from './doodles/DoodleItems';

interface CardDeckStackProps {
  cards: WordCard[];
  flippedCardIds: Set<string>;
  onFlip: (id: string) => void;
}

export default function CardDeckStack({
  cards,
  flippedCardIds,
  onFlip,
}: CardDeckStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const cardCount = cards.length;
  const currentCard = cards[currentIndex];

  useEffect(() => {
    setIsFlipped(false);
    setSlideDirection(null);
  }, [currentIndex]);

  const handleFlip = useCallback(() => {
    if (!currentCard) return;
    setIsFlipped((prev) => {
      const next = !prev;
      if (next) {
        onFlip(currentCard.id);
      }
      return next;
    });
  }, [currentCard, onFlip]);

  const goToNext = useCallback(() => {
    if (currentIndex < cardCount - 1) {
      setSlideDirection('left');
      setTimeout(() => {
        setCurrentIndex((i) => i + 1);
        setDragOffset({ x: 0, y: 0 });
      }, 180);
    }
  }, [currentIndex, cardCount]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setSlideDirection('right');
      setTimeout(() => {
        setCurrentIndex((i) => i - 1);
        setDragOffset({ x: 0, y: 0 });
      }, 180);
    }
  }, [currentIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    setDragOffset({ x: dx, y: dy * 0.2 });
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current) return;
    const dx = dragOffset.x;
    const threshold = 55;

    if (dx < -threshold && currentIndex < cardCount - 1) {
      goToNext();
    } else if (dx > threshold && currentIndex > 0) {
      goToPrev();
    } else if (Math.abs(dx) < 8) {
      handleFlip();
    }

    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);
    touchStartRef.current = null;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToNext();
      else if (e.key === 'ArrowLeft') goToPrev();
      else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleFlip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev, handleFlip]);

  if (!currentCard) return null;

  const peekCard1 = cards[currentIndex + 1];
  const peekCard2 = cards[currentIndex + 2];
  const wasStudied = flippedCardIds.has(currentCard.id);

  const dragRotation = dragOffset.x * 0.06;
  const cardStyle = isDragging
    ? {
        transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotate(${dragRotation}deg)`,
        transition: 'none',
      }
    : slideDirection === 'left'
      ? {
          transform: 'translate3d(-120%, 0, 0) rotate(-14deg)',
          transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }
      : slideDirection === 'right'
        ? {
            transform: 'translate3d(120%, 0, 0) rotate(14deg)',
            transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
          }
        : undefined;

  return (
    <div className="flex flex-col items-center w-full max-w-[360px] mx-auto select-none">
      {/* Deck Indicator */}
      <div className="flex items-center justify-between w-full px-2 mb-3">
        <span className="text-xs font-black italic uppercase tracking-wider text-cyan-glow flex items-center gap-1.5">
          <DoodleScroll size={20} />
          CARD {currentIndex + 1} OF {cardCount}
        </span>
        <span
          className={`text-xs px-3 py-1 rounded-full font-black italic uppercase transition-colors ${
            wasStudied
              ? 'bg-ok/20 text-ok border border-ok/40'
              : 'bg-surface-card text-mute border border-line'
          }`}
        >
          {wasStudied ? '✓ STUDIED' : 'NOT FLIPPED'}
        </span>
      </div>

      {/* 3D Physical Card Stack */}
      <div className="relative w-full h-[370px] perspective-1000 flex items-center justify-center">
        {/* Peek Card 2 */}
        {peekCard2 && (
          <div
            className="absolute w-full h-full rounded-3xl bg-surface border-2 border-line deck-card-peek-2 pointer-events-none"
            aria-hidden="true"
          />
        )}

        {/* Peek Card 1 */}
        {peekCard1 && (
          <div
            className="absolute w-full h-full rounded-3xl bg-surface-card border-2 border-line deck-card-peek-1 deck-card-shadow pointer-events-none"
            aria-hidden="true"
          />
        )}

        {/* Top Active Card */}
        <div
          onClick={handleFlip}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={cardStyle}
          className={[
            'relative w-full h-full rounded-3xl border-2 border-cyan-glow/50 deck-card-shadow cursor-pointer',
            'transition-transform duration-500 preserve-3d',
            isFlipped ? 'rotate-y-180' : '',
          ].join(' ')}
          role="button"
          tabIndex={0}
          aria-label={
            isFlipped
              ? `${currentCard.word}: ${currentCard.definition}`
              : `${currentCard.word}. Tap to flip, swipe to advance.`
          }
        >
          {/* FRONT FACE (Word) */}
          <div className="absolute inset-0 w-full h-full rounded-3xl bg-surface p-6 flex flex-col justify-between backface-hidden border border-line">
            {/* Top row */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-black italic uppercase tracking-wider px-3 py-1 rounded-full bg-teal-dark/50 text-cyan-glow border border-cyan-glow/40">
                {currentCard.partOfSpeech}
              </span>
              <DoodleBook size={28} />
            </div>

            {/* Center Word Display */}
            <div className="text-center my-auto">
              <h2 className="text-3xl sm:text-4xl font-black italic uppercase text-white tracking-tight break-words text-extrude-lg">
                {currentCard.word}
              </h2>
              <div className="w-16 h-1.5 bg-cyan-glow rounded-full mx-auto mt-4" />
            </div>

            {/* Bottom prompt */}
            <div className="text-center pt-3 border-t border-line">
              <span className="text-xs text-mute font-black italic uppercase flex items-center justify-center gap-2">
                <span>TAP CARD TO FLIP</span>
                <span className="text-cyan-glow text-base">↻</span>
              </span>
            </div>
          </div>

          {/* BACK FACE (Definition & Example) */}
          <div className="absolute inset-0 w-full h-full rounded-3xl bg-surface-card p-6 flex flex-col justify-between backface-hidden rotate-y-180 border-2 border-cyan-glow">
            {/* Back Header */}
            <div className="flex items-center justify-between border-b border-line pb-2">
              <span className="text-xl font-black italic uppercase text-white text-extrude-sm">
                {currentCard.word}
              </span>
              <span className="text-xs font-black italic uppercase text-cyan-glow bg-teal-dark/60 px-2.5 py-1 rounded-full border border-cyan-glow/30">
                {currentCard.partOfSpeech}
              </span>
            </div>

            {/* Definition & Example */}
            <div className="my-auto space-y-3 text-left">
              <div>
                <span className="text-xs font-black italic uppercase tracking-wider text-cyan-glow block mb-1">
                  Definition
                </span>
                <p className="text-base font-bold text-white leading-relaxed">
                  {currentCard.definition}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-surface border border-line">
                <span className="text-xs font-black italic uppercase tracking-wider text-amber block mb-1">
                  Example
                </span>
                <p className="text-xs sm:text-sm text-cyan-bright font-medium italic leading-snug">
                  "{currentCard.example}"
                </p>
              </div>
            </div>

            {/* Back Footer */}
            <div className="text-center pt-2 border-t border-line flex items-center justify-between text-xs font-black italic uppercase text-mute">
              <span>SWIPE LEFT FOR NEXT ➔</span>
              <span className="text-ok">STUDIED ✓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Buttons: EVERY button has a doodle icon! */}
      <div className="flex items-center justify-between w-full mt-5 gap-2.5">
        <button
          type="button"
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className={[
            'flex-1 py-3 px-3 rounded-xl border-2 font-black italic uppercase text-xs min-h-12 flex items-center justify-center gap-1.5',
            'transition-transform active:scale-95 motion-reduce:transition-none',
            currentIndex === 0
              ? 'border-line text-mute/30 bg-surface/30 cursor-not-allowed'
              : 'border-line bg-surface text-white hover:border-cyan-glow active:bg-surface-card',
          ].join(' ')}
          aria-label="Previous card"
        >
          <DoodleScroll size={18} />
          <span>PREV</span>
        </button>

        <button
          type="button"
          onClick={handleFlip}
          className="py-3 px-4 rounded-xl border-2 border-cyan-glow/50 bg-surface-card font-black italic uppercase text-xs min-h-12 flex items-center justify-center gap-1.5 text-cyan-glow active:scale-95 transition-transform"
          aria-label="Flip card"
        >
          <DoodleBook size={18} />
          <span>FLIP</span>
        </button>

        <button
          type="button"
          onClick={goToNext}
          disabled={currentIndex === cardCount - 1}
          className={[
            'flex-1 py-3 px-3 rounded-xl border-2 font-black italic uppercase text-xs min-h-12 flex items-center justify-center gap-1.5',
            'transition-transform active:scale-95 motion-reduce:transition-none',
            currentIndex === cardCount - 1
              ? 'border-line text-mute/30 bg-surface/30 cursor-not-allowed'
              : 'border-cyan-glow bg-teal text-white shadow-md active:scale-95 text-extrude-sm',
          ].join(' ')}
          aria-label="Next card"
        >
          <DoodleSword size={18} />
          <span>NEXT</span>
        </button>
      </div>
    </div>
  );
}
