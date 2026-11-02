import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useMatchStore } from '../stores/match-store';
import DoodleAvatar from '../components/DoodleAvatar';
import { DoodleTorch, DoodleCastle } from '../components/doodles/DoodleItems';

export default function CountdownScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { opponentInfo, engine } = useMatchStore();
  const [count, setCount] = useState(3);
  const hasNavigated = useRef(false);

  useEffect(() => {
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
      <div className="min-h-[100dvh] flex flex-col items-center justify-center p-5 safe-area bg-bg-base text-white">
        <p className="text-mute text-lg mb-4 font-bold">No active match found.</p>
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

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-between safe-area max-w-[480px] mx-auto w-full px-5 py-10">
      {/* Top Banner */}
      <div className="flex items-center gap-2 pt-4">
        <DoodleTorch size={28} />
        <span className="text-xs uppercase tracking-widest font-black italic text-cyan-glow">
          Study Complete · Prepare For Battle
        </span>
        <DoodleTorch size={28} className="transform -scale-x-100" />
      </div>

      {/* Main Countdown Display */}
      <div className="flex flex-col items-center justify-center text-center my-auto">
        <div className="mb-5 transform hover:scale-105 transition-transform doodle-sticker-glow">
          <DoodleAvatar type={opponentInfo.type} name={opponentInfo.name} size={90} />
        </div>

        <p className="text-xs uppercase tracking-wider text-mute font-black italic mb-2">
          DUELING <span className="text-white">{opponentInfo.name}</span>
        </p>

        {/* Animated Big Number */}
        <div
          key={count}
          className="text-8xl sm:text-9xl font-black italic text-white tracking-tighter motion-reduce:transition-none transform transition-transform duration-300 scale-100 text-extrude-lg"
        >
          {count > 0 ? count : '⚔️'}
        </div>

        <span className="text-sm font-black italic text-cyan-glow uppercase tracking-widest mt-4 text-extrude-sm">
          {count > 0 ? 'Cards begin immediately' : 'DUEL!'}
        </span>
      </div>

      {/* Bottom Hint */}
      <div className="text-center pb-4 text-xs font-black italic uppercase text-mute tracking-wider">
        60 Seconds · 1 Point per Correct Card
      </div>
    </div>
  );
}
