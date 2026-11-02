import { useState } from 'react';
import { useNavigate } from 'react-router';
import { DoodleKnight } from './doodles/DoodleCharacters';
import { DoodleSwords, DoodleGear } from './doodles/DoodleItems';

interface TopNavProps {
  activeTab?: 'play' | 'settings';
  onOpenSettings?: () => void;
}

export default function TopNav({ activeTab = 'play', onOpenSettings }: TopNavProps) {
  const navigate = useNavigate();
  const [hoveredTab, setHoveredTab] = useState<'play' | 'settings' | null>(null);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#060913]/90 border-b border-[#18233C] px-4 py-3">
      <div className="max-w-[480px] mx-auto flex items-center justify-between">
        {/* Leftmost corner: Knight Doodle Sticker + Title */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 text-left active:scale-95 transition-transform group"
          aria-label="Vocuknight Home"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#0E172C] border border-[#1E2E50] flex items-center justify-center p-1 shadow-md group-hover:border-[#38BDF8] transition-colors">
            <DoodleKnight size={32} />
          </div>
          <div>
            <span className="block font-canto text-2xl font-bold leading-none tracking-normal text-white">
              Vocuknight
            </span>
            <span className="block font-sundays text-[10px] tracking-[0.25em] text-[#38BDF8] mt-0.5">
              ARENA
            </span>
          </div>
        </button>

        {/* Horizontal Navigation Menu (Phone First) */}
        <nav className="flex items-center gap-2">
          {/* PLAY Button: changes to Teal/Cyan accent on hover/active */}
          <button
            onClick={() => navigate('/')}
            onMouseEnter={() => setHoveredTab('play')}
            onMouseLeave={() => setHoveredTab(null)}
            className={[
              'flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-sundays text-xs tracking-[0.16em] border transition-all duration-200 min-h-[44px]',
              hoveredTab === 'play' || (activeTab === 'play' && hoveredTab === null)
                ? 'bg-[#0A9396]/20 border-[#0A9396] text-[#38BDF8] shadow-[0_0_12px_rgba(10,147,150,0.35)]'
                : 'bg-[#0E1528] border-[#1C2B4B] text-white/90 hover:border-[#0A9396]/60',
            ].join(' ')}
            aria-label="Play Game Modes"
          >
            <DoodleSwords size={18} />
            <span>PLAY</span>
          </button>

          {/* SETTINGS Button: changes to Amber/Terracotta accent on hover/active */}
          <button
            onClick={onOpenSettings}
            onMouseEnter={() => setHoveredTab('settings')}
            onMouseLeave={() => setHoveredTab(null)}
            className={[
              'flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-sundays text-xs tracking-[0.16em] border transition-all duration-200 min-h-[44px]',
              hoveredTab === 'settings' || (activeTab === 'settings' && hoveredTab === null)
                ? 'bg-[#EE9B00]/20 border-[#EE9B00] text-[#EE9B00] shadow-[0_0_12px_rgba(238,155,0,0.35)]'
                : 'bg-[#0E1528] border-[#1C2B4B] text-white/90 hover:border-[#EE9B00]/60',
            ].join(' ')}
            aria-label="Open Settings"
          >
            <DoodleGear size={18} />
            <span>SETTINGS</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
