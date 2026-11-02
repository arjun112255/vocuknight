import { useState } from 'react';
import { useNavigate } from 'react-router';
import TopNav from '../components/TopNav';
import { RANDOM_DECK, CURATED_DECKS } from '../data/sample-deck';
import { useMatchStore } from '../stores/match-store';
import { StudyWindow, OpponentType, Deck } from '../engine/types';
import {
  DoodleHourglass,
  DoodleSword,
  DoodleCrown,
  DoodleBook,
  DoodleTorch,
  DoodleShield,
  DoodleCastle,
  DoodleScroll,
  DoodleGear,
} from '../components/doodles/DoodleItems';
import { DoodleKnight, DoodleSquire } from '../components/doodles/DoodleCharacters';

export default function HomeScreen() {
  const navigate = useNavigate();
  const { createEngine } = useMatchStore();

  // Random deck options state
  const [randomWindow, setRandomWindow] = useState<StudyWindow>(3);
  const [randomOpponent, setRandomOpponent] = useState<OpponentType>('knight');

  // Selected deck modal / setup state
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [deckWindow, setDeckWindow] = useState<StudyWindow>(3);
  const [deckOpponent, setDeckOpponent] = useState<OpponentType>('knight');

  // Settings sheet open state
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);

  // Start Random Match
  const handleStartRandomMatch = () => {
    createEngine(RANDOM_DECK, randomWindow, randomOpponent);
    navigate(`/matchmaking/${RANDOM_DECK.id}`);
  };

  // Start Specific Deck Match
  const handleStartDeckMatch = (deck: Deck) => {
    createEngine(deck, deckWindow, deckOpponent);
    navigate(`/matchmaking/${deck.id}`);
  };

  // Map deck to doodle icon
  const getDeckDoodle = (deckId: string) => {
    switch (deckId) {
      case 'everyday-essentials':
        return <DoodleShield size={28} />;
      case 'work-and-business':
        return <DoodleCastle size={28} />;
      case 'feelings-and-character':
        return <DoodleCrown size={28} />;
      case 'academic-starters':
        return <DoodleBook size={28} />;
      case 'travel-and-places':
        return <DoodleHourglass size={28} />;
      default:
        return <DoodleScroll size={28} />;
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#060913] text-white safe-area">
      {/* Top Horizontal Navigation Bar */}
      <TopNav
        activeTab="play"
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {/* Main Container - Mobile First Max 480px */}
      <main className="flex-1 w-full max-w-[480px] mx-auto px-4 py-5 flex flex-col gap-6">
        {/* Arena Header */}
        <div className="text-center pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#005F73]/30 border border-[#0A9396]/40 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" />
            <span className="font-impact uppercase text-xs tracking-widest text-[#38BDF8]">
              ARENA READY
            </span>
          </div>
          <h1 className="font-impact uppercase text-3xl sm:text-4xl text-white tracking-tight leading-none text-extrude-sm">
            VOCABULARY DUEL
          </h1>
          <p className="font-impact uppercase text-xs text-[#38BDF8] mt-1.5 tracking-wider">
            TIMED STUDY · 60s CARD DUEL · REAL-TIME OPPONENT
          </p>
        </div>

        {/* ================= OPTION 1: RANDOM DECK ================= */}
        <section className="ios-matte-card rounded-[24px] p-5 relative overflow-hidden transition-all duration-300 hover:border-[#38BDF8]/40">
          {/* Card Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#005F73]/30 border border-[#0A9396]/40 flex items-center justify-center p-1.5 shadow-md shrink-0">
                <DoodleCrown size={34} />
              </div>
              <div>
                <span className="inline-block font-impact uppercase text-[11px] tracking-wider text-[#38BDF8] bg-[#0E1B36] px-2 py-0.5 rounded-full border border-[#1E305C]">
                  ALL DECKS MIXED · 140 CARDS
                </span>
                <h2 className="font-impact uppercase text-2xl text-white tracking-wide leading-tight mt-0.5">
                  RANDOM DECK
                </h2>
              </div>
            </div>
          </div>

          <p className="font-body text-xs text-[#8E9DB8] mb-4 leading-relaxed">
            Words pooled from every realm across the kingdom. Quick, chaotic, and tests your complete vocabulary under pressure.
          </p>

          {/* Option Controls: 1. Study Window */}
          <div className="mb-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-impact uppercase text-xs tracking-wider text-[#38BDF8] flex items-center gap-1.5">
                <DoodleHourglass size={14} />
                STUDY WINDOW
              </span>
              <span className="font-impact uppercase text-[11px] text-white/70">
                {randomWindow === 1 ? '10 Cards' : randomWindow === 3 ? '20 Cards' : '30 Cards'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {([1, 3, 5] as StudyWindow[]).map((w) => {
                const isSelected = randomWindow === w;
                return (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setRandomWindow(w)}
                    className={[
                      'py-2 px-2 rounded-xl font-impact uppercase text-center border min-h-[46px] transition-all duration-150 flex flex-col items-center justify-center active:scale-95',
                      isSelected
                        ? 'bg-[#0A9396]/25 border-[#38BDF8] text-white shadow-[0_0_10px_rgba(56,189,248,0.25)]'
                        : 'bg-[#090F1E] border-[#1C2B4B] text-white/70 hover:border-[#38BDF8]/40 hover:text-white',
                    ].join(' ')}
                  >
                    <span className="text-sm leading-none">{w} MIN</span>
                    <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-[#38BDF8]' : 'text-[#8E9DB8]'}`}>
                      {w === 1 ? '10 cards' : w === 3 ? '20 cards' : '30 cards'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Option Controls: 2. Opponent Tier */}
          <div className="mb-5">
            <span className="font-impact uppercase text-xs tracking-wider text-[#38BDF8] flex items-center gap-1.5 mb-2">
              <DoodleShield size={14} />
              OPPONENT TIER
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Squire (Practice) */}
              <button
                type="button"
                onClick={() => setRandomOpponent('squire')}
                className={[
                  'p-2.5 rounded-xl text-left border min-h-[52px] transition-all duration-150 flex items-center gap-2.5 active:scale-95',
                  randomOpponent === 'squire'
                    ? 'bg-[#005F73]/25 border-[#38BDF8] text-white shadow-[0_0_10px_rgba(56,189,248,0.25)]'
                    : 'bg-[#090F1E] border-[#1C2B4B] text-white/70 hover:border-[#38BDF8]/40 hover:text-white',
                ].join(' ')}
              >
                <DoodleSquire size={28} />
                <div className="overflow-hidden">
                  <span className="block font-impact uppercase text-sm leading-tight text-white">
                    SQUIRE
                  </span>
                  <span className="block font-body text-[10px] text-[#8E9DB8] truncate">
                    Casual · No rating loss
                  </span>
                </div>
              </button>

              {/* Knight (Ranked) */}
              <button
                type="button"
                onClick={() => setRandomOpponent('knight')}
                className={[
                  'p-2.5 rounded-xl text-left border min-h-[52px] transition-all duration-150 flex items-center gap-2.5 active:scale-95',
                  randomOpponent === 'knight'
                    ? 'bg-[#EE9B00]/20 border-[#EE9B00] text-white shadow-[0_0_10px_rgba(238,155,0,0.25)]'
                    : 'bg-[#090F1E] border-[#1C2B4B] text-white/70 hover:border-[#EE9B00]/40 hover:text-white',
                ].join(' ')}
              >
                <DoodleKnight size={28} />
                <div className="overflow-hidden">
                  <span className="block font-impact uppercase text-sm leading-tight text-white">
                    KNIGHT
                  </span>
                  <span className="block font-body text-[10px] text-[#EE9B00] truncate">
                    Ranked · Elo stakes
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Action Button: Start Random Match */}
          <button
            type="button"
            onClick={handleStartRandomMatch}
            className="w-full py-3.5 px-4 rounded-xl font-impact uppercase text-lg min-h-[52px] flex items-center justify-center gap-2.5 bg-[#0A9396] text-white border border-[#38BDF8]/60 shadow-[0_4px_16px_rgba(10,147,150,0.4)] transition-all duration-150 hover:bg-[#005F73] active:scale-[0.98]"
            aria-label="Start Random Deck Match"
          >
            <DoodleTorch size={22} />
            <span>START RANDOM DUEL ({randomWindow} MIN)</span>
          </button>
        </section>

        {/* ================= OPTION 2: SELECT DECK ================= */}
        <section className="ios-matte-card rounded-[24px] p-5 relative overflow-hidden transition-all duration-300 hover:border-[#EE9B00]/40">
          {/* Card Header */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#CA6702]/25 border border-[#EE9B00]/40 flex items-center justify-center p-1.5 shadow-md shrink-0">
                <DoodleBook size={34} />
              </div>
              <div>
                <span className="inline-block font-impact uppercase text-[11px] tracking-wider text-[#EE9B00] bg-[#1E1910] px-2 py-0.5 rounded-full border border-[#422C10]">
                  5 THEMATIC REALMS
                </span>
                <h2 className="font-impact uppercase text-2xl text-white tracking-wide leading-tight mt-0.5">
                  SELECT DECK
                </h2>
              </div>
            </div>
          </div>

          <p className="font-body text-xs text-[#8E9DB8] mb-4 leading-relaxed">
            Choose a focused vocabulary domain to sharpen specific skills before facing the arena.
          </p>

          {/* Curated Deck List */}
          <div className="flex flex-col gap-2.5">
            {CURATED_DECKS.map((deck) => (
              <button
                key={deck.id}
                type="button"
                onClick={() => {
                  setSelectedDeck(deck);
                  setDeckWindow(3);
                  setDeckOpponent('knight');
                }}
                className="w-full p-3 rounded-2xl bg-[#090F1E] border border-[#1C2B4B] hover:border-[#38BDF8]/60 hover:bg-[#0E172C] transition-all duration-150 flex items-center justify-between gap-3 text-left group active:scale-[0.98] min-h-[58px]"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-xl bg-[#060A14] border border-[#1E2D4E] flex items-center justify-center p-1 shrink-0 group-hover:border-[#38BDF8] transition-colors">
                    {getDeckDoodle(deck.id)}
                  </div>
                  <div className="overflow-hidden">
                    <span className="block font-impact uppercase text-base text-white tracking-wide truncate group-hover:text-[#38BDF8] transition-colors">
                      {deck.title}
                    </span>
                    <span className="block font-body text-[11px] text-[#8E9DB8] truncate">
                      {deck.category} · Level {deck.level} · {deck.words.length} cards
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0E1628] border border-[#1E2D4E] group-hover:border-[#38BDF8] transition-colors">
                  <DoodleSword size={16} />
                  <span className="font-impact uppercase text-xs text-white group-hover:text-[#38BDF8]">
                    PLAY
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* ================= MODAL: SPECIFIC DECK SETUP ================= */}
      {selectedDeck && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-[480px] bg-[#0E1528] border border-[#1E2E50] rounded-t-[28px] sm:rounded-[28px] p-5 shadow-2xl flex flex-col gap-4 animate-in slide-in-from-bottom duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#1C2B4B]">
              <div className="flex items-center gap-2.5">
                {getDeckDoodle(selectedDeck.id)}
                <div>
                  <h3 className="font-impact uppercase text-xl text-white leading-none">
                    {selectedDeck.title}
                  </h3>
                  <span className="font-body text-xs text-[#38BDF8]">
                    {selectedDeck.category} · {selectedDeck.words.length} Words
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedDeck(null)}
                className="w-8 h-8 rounded-full bg-[#18233C] border border-[#2A3A60] flex items-center justify-center text-white/70 hover:text-white font-bold"
                aria-label="Close setup modal"
              >
                ✕
              </button>
            </div>

            {/* Study Window */}
            <div>
              <span className="font-impact uppercase text-xs tracking-wider text-[#38BDF8] flex items-center gap-1.5 mb-2">
                <DoodleHourglass size={14} />
                STUDY WINDOW
              </span>
              <div className="grid grid-cols-3 gap-2">
                {([1, 3, 5] as StudyWindow[]).map((w) => {
                  const isSelected = deckWindow === w;
                  return (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setDeckWindow(w)}
                      className={[
                        'py-2 px-1 rounded-xl font-impact uppercase text-center border min-h-[46px] transition-all flex flex-col items-center justify-center active:scale-95',
                        isSelected
                          ? 'bg-[#0A9396]/25 border-[#38BDF8] text-white shadow-[0_0_10px_rgba(56,189,248,0.25)]'
                          : 'bg-[#090F1E] border-[#1C2B4B] text-white/70 hover:border-[#38BDF8]/40 hover:text-white',
                      ].join(' ')}
                    >
                      <span className="text-sm leading-none">{w} MIN</span>
                      <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-[#38BDF8]' : 'text-[#8E9DB8]'}`}>
                        {w === 1 ? '10 cards' : w === 3 ? '20 cards' : `${Math.min(30, selectedDeck.words.length)} cards`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Opponent Tier */}
            <div>
              <span className="font-impact uppercase text-xs tracking-wider text-[#38BDF8] flex items-center gap-1.5 mb-2">
                <DoodleShield size={14} />
                OPPONENT TIER
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setDeckOpponent('squire')}
                  className={[
                    'p-2.5 rounded-xl text-left border min-h-[50px] transition-all flex items-center gap-2 active:scale-95',
                    deckOpponent === 'squire'
                      ? 'bg-[#005F73]/25 border-[#38BDF8] text-white shadow-[0_0_10px_rgba(56,189,248,0.25)]'
                      : 'bg-[#090F1E] border-[#1C2B4B] text-white/70 hover:border-[#38BDF8]/40',
                  ].join(' ')}
                >
                  <DoodleSquire size={26} />
                  <div>
                    <span className="block font-impact uppercase text-sm leading-tight text-white">SQUIRE</span>
                    <span className="block font-body text-[10px] text-[#8E9DB8]">Practice</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDeckOpponent('knight')}
                  className={[
                    'p-2.5 rounded-xl text-left border min-h-[50px] transition-all flex items-center gap-2 active:scale-95',
                    deckOpponent === 'knight'
                      ? 'bg-[#EE9B00]/20 border-[#EE9B00] text-white shadow-[0_0_10px_rgba(238,155,0,0.25)]'
                      : 'bg-[#090F1E] border-[#1C2B4B] text-white/70 hover:border-[#EE9B00]/40',
                  ].join(' ')}
                >
                  <DoodleKnight size={26} />
                  <div>
                    <span className="block font-impact uppercase text-sm leading-tight text-white">KNIGHT</span>
                    <span className="block font-body text-[10px] text-[#EE9B00]">Ranked Elo</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Start Duel Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleStartDeckMatch(selectedDeck)}
                className="w-full py-3.5 px-4 rounded-xl font-impact uppercase text-lg min-h-[52px] flex items-center justify-center gap-2 bg-[#0A9396] text-white border border-[#38BDF8]/60 shadow-[0_4px_16px_rgba(10,147,150,0.4)] transition-all hover:bg-[#005F73] active:scale-[0.98]"
              >
                <DoodleSword size={22} />
                <span>START DUEL ({deckWindow} MIN)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: SETTINGS SHEET ================= */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-[480px] bg-[#0E1528] border border-[#1E2E50] rounded-t-[28px] sm:rounded-[28px] p-5 shadow-2xl flex flex-col gap-4 animate-in slide-in-from-bottom duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#1C2B4B]">
              <div className="flex items-center gap-2.5">
                <DoodleGear size={26} />
                <h3 className="font-impact uppercase text-2xl text-white leading-none">
                  SETTINGS
                </h3>
              </div>
              <button
                onClick={() => setSettingsOpen(false)}
                className="w-8 h-8 rounded-full bg-[#18233C] border border-[#2A3A60] flex items-center justify-center text-white/70 hover:text-white font-bold"
                aria-label="Close settings"
              >
                ✕
              </button>
            </div>

            {/* Settings Groups (iOS style) */}
            <div className="flex flex-col gap-3">
              {/* Audio */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#090F1E] border border-[#1C2B4B]">
                <div>
                  <span className="block font-impact uppercase text-sm text-white">SOUND EFFECTS</span>
                  <span className="block font-body text-xs text-[#8E9DB8]">Audio starts after user tap</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={[
                    'w-12 h-7 rounded-full p-0.5 transition-colors duration-200 border',
                    soundEnabled ? 'bg-[#0A9396] border-[#38BDF8]' : 'bg-[#1C2B4B] border-transparent',
                  ].join(' ')}
                >
                  <div
                    className={[
                      'w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200',
                      soundEnabled ? 'translate-x-5' : 'translate-x-0',
                    ].join(' ')}
                  />
                </button>
              </div>

              {/* Haptics */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#090F1E] border border-[#1C2B4B]">
                <div>
                  <span className="block font-impact uppercase text-sm text-white">HAPTIC VIBRATION</span>
                  <span className="block font-body text-xs text-[#8E9DB8]">Tactile feedback on mobile</span>
                </div>
                <button
                  type="button"
                  onClick={() => setHapticsEnabled(!hapticsEnabled)}
                  className={[
                    'w-12 h-7 rounded-full p-0.5 transition-colors duration-200 border',
                    hapticsEnabled ? 'bg-[#0A9396] border-[#38BDF8]' : 'bg-[#1C2B4B] border-transparent',
                  ].join(' ')}
                >
                  <div
                    className={[
                      'w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200',
                      hapticsEnabled ? 'translate-x-5' : 'translate-x-0',
                    ].join(' ')}
                  />
                </button>
              </div>

              {/* Theme & Elo Stats */}
              <div className="p-3.5 rounded-xl bg-[#090F1E] border border-[#1C2B4B] flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-impact uppercase text-white/70">THEME</span>
                  <span className="font-impact uppercase text-[#38BDF8]">OCEAN SUNSET MEDIEVAL</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-impact uppercase text-white/70">PLAYER ELO</span>
                  <span className="font-impact uppercase text-[#EE9B00]">1000 INITIAL</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-impact uppercase text-white/70">VERSION</span>
                  <span className="font-impact uppercase text-[#8E9DB8]">BETA 1.0</span>
                </div>
              </div>
            </div>

            <p className="font-body text-[11px] text-[#8E9DB8] text-center italic">
              Full account, sync, and multiplayer settings will expand in Beta 2.
            </p>

            <button
              type="button"
              onClick={() => setSettingsOpen(false)}
              className="w-full py-3 rounded-xl font-impact uppercase text-base min-h-[46px] bg-[#141F38] border border-[#24355A] text-white hover:bg-[#1A284A] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <DoodleShield size={18} />
              <span>RETURN TO ARENA</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
