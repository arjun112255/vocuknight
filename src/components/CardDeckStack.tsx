import { useState, useRef, useEffect, useCallback } from 'react';
import { WordCard } from '../engine/types';
import { DoodleBook, DoodleScroll } from './doodles/DoodleItems';

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

  // Whenever navigating to a card, reset flip state unless it's already studied
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

  // Touch Swipe Handlers
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
    // Dampen vertical movement, prioritize horizontal swipe
    setDragOffset({ x: dx, y: dy * 0.2 });
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current) return;
    const dx = dragOffset.x;
    const threshold = 55;

    if (dx < -threshold && currentIndex < cardCount - 1) {
      // Swiped Left -> Next Card
      goToNext();
    } else if (dx > threshold && currentIndex > 0) {
      // Swiped Right -> Prev Card
      goToPrev();
    } else if (Math.abs(dx) < 8) {
      // Small movement = Tap to Flip
      handleFlip();
    }

    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);
    touchStartRef.current = null;
  };

  // Keyboard navigation
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

  // Dynamic transform during swipe drag
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
      {/* Deck Indicator & Progress */}
      <div className="flex items-center justify-between w-full px-2 mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-mute flex items-center gap-1.5">
          <DoodleScroll size={18} />
          Card {currentIndex + 1} of {cardCount}
        </span>
        <span
          className={`text-xs px-2.5 py-0.5 rounded-full font-bold transition-colors ${
            wasStudied
              ? 'bg-ok-bg text-ok border border-ok/30'
              : 'bg-parchment/60 text-ink/70 border border-line'
          }`}
        >
          {wasStudied ? '✓ Studied' : 'Not Flipped'}
        </span>
      </div>

      {/* 3D Physical Card Stack Container */}
      <div className="relative w-full h-[370px] perspective-1000 flex items-center justify-center">
        {/* Peek Card 2 (Bottom layer) */}
        {peekCard2 && (
          <div
            className="absolute w-full h-full rounded-3xl bg-parchment/40 border-2 border-line/80 deck-card-peek-2 pointer-events-none"
            aria-hidden="true"
          />
        )}

        {/* Peek Card 1 (Middle layer) */}
        {peekCard1 && (
          <div
            className="absolute w-full h-full rounded-3xl bg-surface border-2 border-line deck-card-peek-1 deck-card-shadow pointer-events-none"
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
            'relative w-full h-full rounded-3xl border-2 border-ink deck-card-shadow cursor-pointer',
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
          <div className="absolute inset-0 w-full h-full rounded-3xl bg-surface p-6 flex flex-col justify-between backface-hidden">
            {/* Top decorative row */}
            <div className="flex items-center justify-between text-mute">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-sage/20 text-teal-dark">
                {currentCard.partOfSpeech}
              </span>
              <DoodleBook size={24} />
            </div>

            {/* Center Word Display */}
            <div className="text-center my-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight break-words">
                {currentCard.word}
              </h2>
              <div className="w-12 h-1 bg-amber rounded-full mx-auto mt-4" />
            </div>

            {/* Bottom prompt */}
            <div className="text-center pt-2 border-t border-line/60">
              <span className="text-xs text-mute font-medium flex items-center justify-center gap-1.5">
                <span>Tap card to flip</span>
                <span className="text-teal">↻</span>
              </span>
            </div>
          </div>

          {/* BACK FACE (Definition & Example) */}
          <div className="absolute inset-0 w-full h-full rounded-3xl bg-paper p-6 flex flex-col justify-between backface-hidden rotate-y-180 border-2 border-teal/40">
            {/* Back Header */}
            <div className="flex items-center justify-between border-b border-line pb-2">
              <span className="text-lg font-bold text-ink">{currentCard.word}</span>
              <span className="text-xs font-semibold text-teal bg-teal/10 px-2 py-0.5 rounded-full">
                {currentCard.partOfSpeech}
              </span>
            </div>

            {/* Definition & Example */}
            <div className="my-auto space-y-3 text-left">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-dark block mb-1">
                  Definition
                </span>
                <p className="text-base text-ink leading-relaxed font-medium">
                  {currentCard.definition}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-parchment/50 border border-line">
                <span className="text-xs font-bold uppercase tracking-wider text-terracotta block mb-0.5">
                  Example
                </span>
                <p className="text-xs sm:text-sm text-ink/80 italic leading-snug">
                  "{currentCard.example}"
                </p>
              </div>
            </div>

            {/* Back Footer */}
            <div className="text-center pt-2 border-t border-line/60 flex items-center justify-between text-xs text-mute">
              <span>Swipe left for next ➔</span>
              <span className="text-ok font-bold">Studied ✓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Controls (Thumb Reach) */}
      <div className="flex items-center justify-between w-full mt-5 gap-3">
        <button
          type="button"
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className={[
            'flex-1 py-3 px-4 rounded-xl border-2 font-bold text-sm min-h-12 flex items-center justify-center gap-1.5',
            'transition-transform active:scale-95 motion-reduce:transition-none',
            currentIndex === 0
              ? 'border-line text-mute/40 bg-surface/50 cursor-not-allowed'
              : 'border-line bg-surface text-ink hover:border-teal active:bg-paper',
          ].join(' ')}
          aria-label="Previous card"
        >
          <span>◄</span>
          <span>Previous</span>
        </button>

        <button
          type="button"
          onClick={handleFlip}
          className="py-3 px-5 rounded-xl border-2 border-ink bg-parchment/60 font-bold text-sm min-h-12 flex items-center justify-center text-ink active:scale-95 transition-transform"
          aria-label="Flip card"
        >
          <span>↻ Flip</span>
        </button>

        <button
          type="button"
          onClick={goToNext}
          disabled={currentIndex === cardCount - 1}
          className={[
            'flex-1 py-3 px-4 rounded-xl border-2 font-bold text-sm min-h-12 flex items-center justify-center gap-1.5',
            'transition-transform active:scale-95 motion-reduce:transition-none',
            currentIndex === cardCount - 1
              ? 'border-line text-mute/40 bg-surface/50 cursor-not-allowed'
              : 'border-ink bg-teal text-white shadow-xs active:scale-95',
          ].join(' ')}
          aria-label="Next card"
        >
          <span>Next</span>
          <span>►</span>
        </button>
      </div>
    </div>
  );
}
