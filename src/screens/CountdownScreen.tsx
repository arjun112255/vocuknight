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
      <div className="min-h-[100dvh] flex flex-col items-center justify-center p-5 safe-area bg-[#060913] text-white">
        <p className="font-impact text-lg text-[#8E9DB8] mb-4">NO ACTIVE MATCH FOUND</p>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 rounded-xl bg-[#0E1528] border border-[#1E2D4E] font-impact uppercase text-sm text-[#38BDF8] flex items-center gap-2"
        >
          <DoodleCastle size={20} />
          <span>RETURN TO ARENA</span>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-between safe-area max-w-[480px] mx-auto w-full px-5 py-10 bg-[#060913]">
      {/* Top Banner */}
      <div className="flex items-center gap-2 pt-4">
        <DoodleTorch size={26} />
        <span className="font-impact uppercase text-xs tracking-widest text-[#38BDF8]">
          STUDY COMPLETE · PREPARE FOR BATTLE
        </span>
        <DoodleTorch size={26} className="transform -scale-x-100" />
      </div>

      {/* Main Countdown Display */}
      <div className="flex flex-col items-center justify-center text-center my-auto">
        <div className="mb-5 transform hover:scale-105 transition-transform doodle-sticker-glow">
          <DoodleAvatar type={opponentInfo.type} name={opponentInfo.name} size={90} />
        </div>

        <p className="font-impact uppercase text-xs tracking-wider text-[#8E9DB8] mb-2">
          DUELING <span className="text-white">{opponentInfo.name}</span>
        </p>

        {/* Animated Big Number */}
        <div
          key={count}
          className="text-8xl sm:text-9xl font-impact text-white tracking-tighter transform transition-transform duration-300 scale-100 text-extrude-lg"
        >
          {count > 0 ? count : '⚔️'}
        </div>

        <span className="font-impact uppercase text-sm text-[#38BDF8] tracking-widest mt-4">
          {count > 0 ? 'Cards begin immediately' : 'DUEL!'}
        </span>
      </div>

      {/* Bottom Hint */}
      <div className="text-center pb-4 font-impact uppercase text-xs text-[#8E9DB8] tracking-wider">
        60 Seconds · 1 Point per Correct Card
      </div>
    </div>
  );
}
