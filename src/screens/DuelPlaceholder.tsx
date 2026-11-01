import { useNavigate } from 'react-router';
import { useMatchStore } from '../stores/match-store';

export default function DuelPlaceholder() {
  const navigate = useNavigate();
  const { studySet, flippedCardIds, reset } = useMatchStore();

  const handleBack = () => {
    reset();
    navigate('/');
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-5 safe-area">
      <div className="max-w-[480px] w-full text-center">
        <h1 className="text-3xl font-extrabold text-ink">⚔️ Duel coming next</h1>
        <p className="text-lg text-mute mt-4">
          You studied{' '}
          <span className="font-bold text-accent">{flippedCardIds.size}</span>{' '}
          of{' '}
          <span className="font-bold text-ink">{studySet.length}</span> cards
        </p>

        <button
          onClick={handleBack}
          className="mt-8 bg-accent text-white font-bold text-lg py-4 px-8 rounded-2xl min-h-12 active:scale-[0.98] transition-transform motion-reduce:transition-none"
        >
          Back to deck
        </button>
      </div>
    </div>
  );
}
