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
    const threshold = 50;

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

  const dragRotation = dragOffset.x * 0.05;
  const cardStyle = isDragging
    ? {
        transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotate(${dragRotation}deg)`,
        transition: 'none',
      }
    : slideDirection === 'left'
      ? {
          transform: 'translate3d(-120%, 0, 0) rotate(-12deg)',
          transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }
      : slideDirection === 'right'
        ? {
            transform: 'translate3d(120%, 0, 0) rotate(12deg)',
            transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
          }
        : undefined;

  return (
    <div className="flex flex-col items-center w-full max-w-[360px] mx-auto select-none font-barriecito">
      {/* Deck Indicator */}
      <div className="flex items-center justify-between w-full px-2 mb-3">
        <span className="text-sm tracking-wider text-[#38BDF8] flex items-center gap-1.5">
          <DoodleScroll size={18} />
          Card {currentIndex + 1} of {cardCount}
        </span>
        <span
          className={`text-xs px-3 py-1 rounded-full transition-colors ${
            wasStudied
              ? 'bg-[#005F73]/40 text-[#38BDF8] border border-[#0A9396]/60'
              : 'bg-[#0E1528] text-[#8E9DB8] border border-[#1C2B4B]'
          }`}
        >
          {wasStudied ? '✓ Studied' : 'Not Flipped'}
        </span>
      </div>

      {/* 3D Physical Card Stack */}
      <div className="relative w-full h-[370px] perspective-1000 flex items-center justify-center">
        {/* Peek Card 2 */}
        {peekCard2 && (
          <div
            className="absolute w-full h-full rounded-[24px] bg-[#0A1020] border border-[#16223B] deck-card-peek-2 pointer-events-none"
            aria-hidden="true"
          />
        )}

        {/* Peek Card 1 */}
        {peekCard1 && (
          <div
            className="absolute w-full h-full rounded-[24px] bg-[#0E1628] border border-[#1C2C4E] deck-card-peek-1 deck-card-shadow pointer-events-none"
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
            'relative w-full h-full rounded-[24px] border border-[#38BDF8]/40 deck-card-shadow cursor-pointer',
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
          <div className="absolute inset-0 w-full h-full rounded-[24px] bg-[#0E1528] p-6 flex flex-col justify-between backface-hidden border border-[#1C2C4E]">
            {/* Top row */}
            <div className="flex items-center justify-between">
              <span className="text-xs tracking-wider px-3 py-1 rounded-full bg-[#005F73]/40 text-[#38BDF8] border border-[#0A9396]/40 capitalize">
                {currentCard.partOfSpeech}
              </span>
              <DoodleBook size={28} />
            </div>

            {/* Center Word Display */}
            <div className="text-center my-auto">
              <h2 className="text-4xl sm:text-5xl text-white tracking-wide break-words text-extrude">
                {currentCard.word}
              </h2>
              <div className="w-16 h-1 bg-[#38BDF8] rounded-full mx-auto mt-4" />
            </div>

            {/* Bottom prompt */}
            <div className="text-center pt-3 border-t border-[#1C2C4E]">
              <span className="text-xs text-[#8E9DB8] flex items-center justify-center gap-2">
                <span>Tap Card to Flip</span>
                <span className="text-[#38BDF8] text-base">↻</span>
              </span>
            </div>
          </div>

          {/* BACK FACE (Definition & Example) */}
          <div className="absolute inset-0 w-full h-full rounded-[24px] bg-[#111A30] p-6 flex flex-col justify-between backface-hidden rotate-y-180 border border-[#38BDF8]/60">
            {/* Back Header */}
            <div className="flex items-center justify-between border-b border-[#1C2C4E] pb-2">
              <span className="text-2xl text-white">
                {currentCard.word}
              </span>
              <span className="text-xs text-[#38BDF8] bg-[#005F73]/40 px-2.5 py-0.5 rounded-full border border-[#0A9396]/40 capitalize">
                {currentCard.partOfSpeech}
              </span>
            </div>

            {/* Definition & Example */}
            <div className="my-auto space-y-3 text-left">
              <div>
                <span className="text-xs tracking-wider text-[#38BDF8] block mb-1">
                  Definition
                </span>
                <p className="font-body text-sm font-semibold text-white leading-relaxed">
                  {currentCard.definition}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#0A1020] border border-[#1C2C4E]">
                <span className="text-xs tracking-wider text-[#EE9B00] block mb-1">
                  Example
                </span>
                <p className="font-body text-xs text-[#BAE6FD] leading-relaxed italic">
                  "{currentCard.example}"
                </p>
              </div>
            </div>

            {/* Back Footer */}
            <div className="text-center pt-2 border-t border-[#1C2C4E] flex items-center justify-between text-xs text-[#8E9DB8]">
              <span>Swipe left for next ➔</span>
              <span className="text-[#10B981]">Studied ✓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="flex items-center justify-between w-full mt-5 gap-2.5">
        <button
          type="button"
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className={[
            'flex-1 py-3 px-3 rounded-xl border text-sm min-h-[48px] flex items-center justify-center gap-1.5 transition-all active:scale-95',
            currentIndex === 0
              ? 'border-[#18233C] text-white/30 bg-[#0A1020] cursor-not-allowed'
              : 'border-[#1C2C4E] bg-[#0E1528] text-white hover:border-[#38BDF8] active:bg-[#121B32]',
          ].join(' ')}
          aria-label="Previous card"
        >
          <DoodleScroll size={18} />
          <span>Prev</span>
        </button>

        <button
          type="button"
          onClick={handleFlip}
          className="py-3 px-4 rounded-xl border border-[#38BDF8]/50 bg-[#0E1528] text-sm min-h-[48px] flex items-center justify-center gap-1.5 text-[#38BDF8] active:scale-95 transition-all hover:bg-[#121B32]"
          aria-label="Flip card"
        >
          <DoodleBook size={18} />
          <span>Flip</span>
        </button>

        <button
          type="button"
          onClick={goToNext}
          disabled={currentIndex === cardCount - 1}
          className={[
            'flex-1 py-3 px-3 rounded-xl border text-sm min-h-[48px] flex items-center justify-center gap-1.5 transition-all active:scale-95',
            currentIndex === cardCount - 1
              ? 'border-[#18233C] text-white/30 bg-[#0A1020] cursor-not-allowed'
              : 'border-[#38BDF8]/60 bg-[#0A9396] text-white shadow-md hover:bg-[#005F73]',
          ].join(' ')}
          aria-label="Next card"
        >
          <DoodleSword size={18} />
          <span>Next</span>
        </button>
      </div>
    </div>
  );
}
