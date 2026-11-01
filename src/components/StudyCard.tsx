import { WordCard } from '../engine/types';

interface StudyCardProps {
  card: WordCard;
  isFlipped: boolean;
  onFlip: (id: string) => void;
}

export default function StudyCard({ card, isFlipped, onFlip }: StudyCardProps) {
  const handleClick = () => {
    if (!isFlipped) {
      onFlip(card.id);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleClick();
      }}
      className={[
        'w-full text-left rounded-2xl p-5 min-h-[120px]',
        'bg-surface border-2 transition-all duration-300 motion-reduce:transition-none',
        isFlipped ? 'border-accent/40' : 'border-line active:scale-[0.98]',
      ].join(' ')}
      aria-label={
        isFlipped
          ? `${card.word}: ${card.definition}`
          : `${card.word}. Tap to reveal definition.`
      }
    >
      {isFlipped ? (
        <div
          className="motion-reduce:!animate-none"
          style={{
            perspective: '600px',
            animation: 'flip-in 0.3s ease-out',
          }}
        >
          <p className="text-lg font-bold text-ink">{card.word}</p>
          <p className="text-sm text-accent/60 mb-2">{card.partOfSpeech}</p>
          <p className="text-ink/80 leading-relaxed">{card.definition}</p>
          <p className="text-sm text-mute italic mt-3">"{card.example}"</p>
        </div>
      ) : (
        <div className="flex flex-col justify-center">
          <p className="text-2xl font-bold text-ink">{card.word}</p>
          <p className="text-sm text-mute mt-1">{card.partOfSpeech}</p>
          <p className="text-xs text-mute/60 mt-4">Tap to flip</p>
        </div>
      )}
    </button>
  );
}
