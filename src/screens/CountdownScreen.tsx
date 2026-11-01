import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useMatchStore } from '../stores/match-store';
import DoodleAvatar from '../components/DoodleAvatar';

export default function CountdownScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { opponentInfo, engine } = useMatchStore();
  const [count, setCount] = useState(3);
  const hasNavigated = useRef(false);

  useEffect(() => {
    // 3 -> 2 -> 1 -> Navigate to Duel
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (count === 0 && !hasNavigated.current) {
      hasNavigated.current = true;
      navigate(`/duel/${id}`);
    }
  }, [count, id, navigate]);

  if (!opponentInfo || !engine) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center p-5 safe-area">
        <p className="text-mute text-lg mb-4">No active match found.</p>
        <button
          onClick={() => navigate(`/deck/${id ?? 'everyday-essentials'}`)}
          className="text-accent font-semibold min-h-12"
        >
          ← Back to deck
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-between safe-area max-w-[480px] mx-auto w-full px-5 py-12">
      {/* Top note */}
      <div className="text-center pt-6">
        <p className="text-xs uppercase tracking-widest text-mute font-semibold">
          Study Complete
        </p>
        <h1 className="text-xl font-bold text-ink mt-1">
          Prepare for the Duel
        </h1>
      </div>

      {/* Main Countdown Display */}
      <div className="flex flex-col items-center justify-center text-center my-auto">
        <div className="mb-6">
          <DoodleAvatar type={opponentInfo.type} name={opponentInfo.name} size={90} />
        </div>

        <p className="text-base text-mute font-medium mb-3">
          Facing <span className="font-bold text-ink">{opponentInfo.name}</span>
        </p>

        {/* Big Animated Count Number */}
        <div
          key={count}
          className="text-8xl font-black text-accent tracking-tighter motion-reduce:transition-none transform transition-transform duration-300 scale-100 animate-in"
        >
          {count > 0 ? count : '⚔️'}
        </div>

        <p className="text-sm text-mute mt-4">
          {count > 0 ? 'Cards begin immediately' : 'Duel!'}
        </p>
      </div>

      {/* Bottom hint */}
      <div className="text-center pb-6 text-xs text-mute/80">
        Answer as many cards as you can in 60 seconds
      </div>
    </div>
  );
}
