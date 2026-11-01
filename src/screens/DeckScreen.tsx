import { useParams, useNavigate } from 'react-router';
import { getDeckById } from '../data/sample-deck';

export default function DeckScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const deck = getDeckById(id!);

  if (!deck) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center p-4">
        <p className="text-mute text-lg">Deck not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col safe-area">
      {/* Centre content */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-[480px] mx-auto w-full px-5">
        <div className="text-center">
          <p className="text-sm text-mute uppercase tracking-wider">
            {deck.category} · {deck.level}
          </p>
          <h1 className="text-4xl font-extrabold text-ink mt-3 leading-tight">
            {deck.title}
          </h1>
          <p className="text-mute mt-4">{deck.words.length} cards</p>
        </div>
      </div>

      {/* Play button in the bottom half for thumb reach */}
      <div className="max-w-[480px] mx-auto w-full px-5 pb-8">
        <button
          onClick={() => navigate(`/play/${id}`)}
          className="w-full bg-accent text-white font-bold text-lg py-4 rounded-2xl min-h-12 active:scale-[0.98] transition-transform motion-reduce:transition-none"
        >
          Play
        </button>
      </div>
    </div>
  );
}
