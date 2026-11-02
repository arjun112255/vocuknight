import { useState, useEffect, useRef, useCallback } from 'react';
import { SAMPLE_DECK, WORK_DECK, ACADEMIC_DECK, FEELINGS_DECK, RANDOM_DECK } from '../data/sample-deck';

interface WordItem {
  word: string;
  pos: string;
  def: string;
  example: string;
  distractors: string[];
}

// Default Matiks deck as provided by user specification
const DEFAULT_MATIKS_DECK: WordItem[] = [
  {
    word: 'ELOQUENT',
    pos: 'ADJECTIVE',
    def: 'Fluent, forceful, and persuasive in speech or writing.',
    example: '"The founder delivered an eloquent pitch that secured the term sheet."',
    distractors: [
      'Hesitant and uncertain when addressing a crowd.',
      'Strictly adhering to outdated bureaucratic rules.',
      'Lacking logical structure or factual evidence.',
    ],
  },
  {
    word: 'ZEALOUS',
    pos: 'ADJECTIVE',
    def: 'Showing great energy or enthusiasm in pursuit of a cause.',
    example: '"The zealous volunteer worked late into the night to finish the sprint."',
    distractors: [
      'Completely indifferent to competitive outcomes.',
      'Exhausted from prolonged mental exertion.',
      'Secretive and unwilling to share information.',
    ],
  },
  {
    word: 'QUALITATIVE',
    pos: 'ADJECTIVE',
    def: 'Relating to, measuring, or measured by the quality of something rather than its quantity.',
    example: '"User interviews provided deep qualitative insights beyond raw retention metrics."',
    distractors: [
      'Calculated strictly using automated financial ratios.',
      'Occurring at irregular and unpredictable intervals.',
      'Temporary and easily reversed under pressure.',
    ],
  },
  {
    word: 'VIVACIOUS',
    pos: 'ADJECTIVE',
    def: 'Attractively lively, animated, and high-spirited.',
    example: '"Her vivacious commentary kept the live stream audience engaged for hours."',
    distractors: [
      'Melancholic and slow to respond in conversation.',
      'Overly formal and rigid in social settings.',
      'Harsh and abrasive toward opposing viewpoints.',
    ],
  },
  {
    word: 'PRAGMATIC',
    pos: 'ADJECTIVE',
    def: 'Dealing with things sensibly and realistically in a way based on practical considerations.',
    example: '"We took a pragmatic approach to shipping the MVP before perfecting every animation."',
    distractors: [
      'Driven purely by abstract theoretical ideals.',
      'Reckless and dismissive of obvious operational risks.',
      'Ornamental and designed solely for visual prestige.',
    ],
  },
];

// Helper to convert rich sample decks into WordItem with real distractors
function convertDeckToItems(deck: typeof RANDOM_DECK, limit: number): WordItem[] {
  const words = deck.words.slice(0, limit);
  return words.map((w, idx) => {
    // Pick 3 distractors from other words in the deck
    const others = deck.words.filter((_, i) => i !== idx);
    const shuffled = [...others].sort(() => Math.random() - 0.5);
    const distractors = shuffled.slice(0, 3).map((o) => o.definition);
    return {
      word: w.word.toUpperCase(),
      pos: w.partOfSpeech.toUpperCase(),
      def: w.definition,
      example: `"${w.example}"`,
      distractors: distractors.length === 3 ? distractors : [
        'Occurring at irregular and unpredictable intervals.',
        'Strictly adhering to outdated bureaucratic rules.',
        'Lacking logical structure or factual evidence.',
      ],
    };
  });
}

type ScreenType = 'lobby' | 'matchmaking' | 'study' | 'countdown' | 'battle';

export default function MatiksArena() {
  // Screen state
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('lobby');

  // Domain & Setup state
  const [activeTheme, setActiveTheme] = useState<'yellow' | 'blue' | 'green' | 'purple'>('yellow');
  const [selectedDomainName, setSelectedDomainName] = useState('ALL DECKS MIXED');
  const [studySeconds, setStudySeconds] = useState(60);
  const [studyCardTarget, setStudyCardTarget] = useState(10);
  const [matchModeTitle, setMatchModeTitle] = useState('KNIGHT RANKED // ALL DECKS MIXED');
  const [matchFound, setMatchFound] = useState(false);

  // Deck state
  const [currentDeck, setCurrentDeck] = useState<WordItem[]>(DEFAULT_MATIKS_DECK);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studiedSet, setStudiedSet] = useState<Set<number>>(new Set([0]));
  const [studyTimeRemaining, setStudyTimeRemaining] = useState(60);

  // Countdown state
  const [countdownNum, setCountdownNum] = useState<number | string>(3);

  // Battle state
  const [battleIndex, setBattleIndex] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [battleSeconds, setBattleSeconds] = useState(60);
  const [shuffledOptions, setShuffledOptions] = useState<{ text: string; correct: boolean }[]>([]);
  const [answeredState, setAnsweredState] = useState<{ selectedText: string; isCorrect: boolean } | null>(null);

  // Quest stats
  const [quest1Complete, setQuest1Complete] = useState(false);
  const [dailyChallengesCompleted, setDailyChallengesCompleted] = useState(0);

  const studyIntervalRef = useRef<number | null>(null);
  const battleIntervalRef = useRef<number | null>(null);

  // Helper to format MM:SS
  const formatTimer = (sec: number) => {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  // Domain selection
  const selectDomain = (theme: 'yellow' | 'blue' | 'green' | 'purple', domainName: string) => {
    setActiveTheme(theme);
    setSelectedDomainName(domainName);
  };

  // Study window toggle
  const setStudyWindowConfig = (seconds: number, cards: number) => {
    setStudySeconds(seconds);
    setStudyCardTarget(cards);
  };

  // Load appropriate deck when entering match
  const loadDeckForMode = (mode: string) => {
    let chosenDeck: WordItem[] = DEFAULT_MATIKS_DECK;
    if (mode.includes('WORK') || mode.includes('BUSINESS')) {
      chosenDeck = convertDeckToItems(WORK_DECK, studyCardTarget);
    } else if (mode.includes('ACADEMIC')) {
      chosenDeck = convertDeckToItems(ACADEMIC_DECK, studyCardTarget);
    } else if (mode.includes('EVERYDAY')) {
      chosenDeck = convertDeckToItems(SAMPLE_DECK, studyCardTarget);
    } else if (mode.includes('RHETORIC') || mode.includes('LOGIC')) {
      chosenDeck = convertDeckToItems(FEELINGS_DECK, studyCardTarget);
    } else {
      // Mixed / Random
      chosenDeck = convertDeckToItems(RANDOM_DECK, studyCardTarget);
    }
    if (chosenDeck.length === 0) {
      chosenDeck = DEFAULT_MATIKS_DECK;
    }
    setCurrentDeck(chosenDeck);
    return chosenDeck;
  };

  // 1. Start Matchmaking
  const startMatchmaking = (modeTitle: string) => {
    setMatchModeTitle(modeTitle);
    setMatchFound(false);
    setCurrentScreen('matchmaking');
    loadDeckForMode(modeTitle);

    setTimeout(() => {
      setMatchFound(true);
    }, 700);

    setTimeout(() => {
      startStudyPhase();
    }, 1600);
  };

  // 2. Start Study Phase
  const startStudyPhase = useCallback(() => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setStudiedSet(new Set([0]));
    setCurrentScreen('study');

    if (studyIntervalRef.current) clearInterval(studyIntervalRef.current);
    let remaining = studySeconds;
    setStudyTimeRemaining(remaining);

    studyIntervalRef.current = window.setInterval(() => {
      remaining--;
      setStudyTimeRemaining(remaining);
      if (remaining <= 0) {
        if (studyIntervalRef.current) clearInterval(studyIntervalRef.current);
        triggerCountdown();
      }
    }, 1000);
  }, [studySeconds]);

  // Flashcard Flip
  const flipCard = () => {
    setIsFlipped((prev) => !prev);
    setStudiedSet((prev) => new Set(prev).add(currentCardIndex));
  };

  // Next / Prev card
  const nextCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => {
      const nextIdx = (prev + 1) % currentDeck.length;
      setStudiedSet((s) => new Set(s).add(nextIdx));
      return nextIdx;
    });
  };

  const prevCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + currentDeck.length) % currentDeck.length);
  };

  // 3. Trigger 3-2-1 Countdown
  const triggerCountdown = () => {
    if (studyIntervalRef.current) clearInterval(studyIntervalRef.current);
    setCurrentScreen('countdown');
    let count = 3;
    setCountdownNum(3);

    const cd = window.setInterval(() => {
      count--;
      if (count > 0) {
        setCountdownNum(count);
      } else {
        clearInterval(cd);
        startBattlePhase();
      }
    }, 800);
  };

  // 4. Start Live Battle Phase
  const startBattlePhase = () => {
    setBattleIndex(0);
    setPlayerScore(0);
    setBotScore(0);
    setBattleSeconds(60);
    setAnsweredState(null);
    setCurrentScreen('battle');

    // Build first round options
    renderBattleRound(0, currentDeck);

    if (battleIntervalRef.current) clearInterval(battleIntervalRef.current);
    let remaining = 60;
    battleIntervalRef.current = window.setInterval(() => {
      remaining--;
      setBattleSeconds(remaining);
      if (remaining <= 0) {
        if (battleIntervalRef.current) clearInterval(battleIntervalRef.current);
        endBattle();
      }
    }, 1000);
  };

  // Render battle round options for a specific index
  const renderBattleRound = (idx: number, deck: WordItem[]) => {
    if (idx >= deck.length) {
      endBattle();
      return;
    }
    const item = deck[idx];
    const choices = [
      { text: item.def, correct: true },
      ...item.distractors.map((d) => ({ text: d, correct: false })),
    ].sort(() => Math.random() - 0.5);

    setShuffledOptions(choices);
    setAnsweredState(null);
  };

  // Handle Battle Answer
  const handleAnswer = (choice: { text: string; correct: boolean }) => {
    if (answeredState !== null) return; // prevent multiple clicks

    setAnsweredState({ selectedText: choice.text, isCorrect: choice.correct });

    if (choice.correct) {
      setPlayerScore((p) => p + 20);
    }

    // Bot sim response
    if (Math.random() > 0.35) {
      setBotScore((b) => b + 20);
    }

    setTimeout(() => {
      const nextIdx = battleIndex + 1;
      setBattleIndex(nextIdx);
      renderBattleRound(nextIdx, currentDeck);
    }, 650);
  };

  // End Battle
  const endBattle = () => {
    if (battleIntervalRef.current) clearInterval(battleIntervalRef.current);
    setQuest1Complete(true);
    setDailyChallengesCompleted((prev) => Math.min(5, prev + 1));
    setCurrentScreen('lobby');
  };

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentScreen === 'study') {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          flipCard();
        } else if (e.key === 'ArrowRight') {
          nextCard();
        } else if (e.key === 'ArrowLeft') {
          prevCard();
        }
      } else if (currentScreen === 'battle' && answeredState === null) {
        if (['1', '2', '3', '4'].includes(e.key)) {
          const optIdx = parseInt(e.key, 10) - 1;
          if (shuffledOptions[optIdx]) {
            handleAnswer(shuffledOptions[optIdx]);
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentScreen, currentCardIndex, currentDeck, answeredState, shuffledOptions]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (studyIntervalRef.current) clearInterval(studyIntervalRef.current);
      if (battleIntervalRef.current) clearInterval(battleIntervalRef.current);
    };
  }, []);

  const currentStudyCard = currentDeck[currentCardIndex] || currentDeck[0] || DEFAULT_MATIKS_DECK[0];
  const currentBattleCard = currentDeck[battleIndex] || currentDeck[0] || DEFAULT_MATIKS_DECK[0];

  return (
    <div className="app-shell">
      {/* ==========================================
           1. MATIKS PERMANENT LEFT SIDENAV
           ========================================== */}
      <aside className="sidenav">
        <div className="brand-logo">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
          VOCUKNIGHT
        </div>

        <nav className="nav-list">
          <button
            className={`nav-item ${currentScreen === 'lobby' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('lobby')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
              <path d="M13 19l6-6" />
              <path d="M16 16l4 4" />
              <path d="M19 21l2-2" />
            </svg>
            ARENA
          </button>
          <button className="nav-item" onClick={() => setCurrentScreen('lobby')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="M7 8h10" />
              <path d="M7 12h6" />
            </svg>
            QUESTS
          </button>
          <button className="nav-item" onClick={() => startMatchmaking('RANKED KNIGHT DUEL')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
            COMPETE
          </button>
          <button className="nav-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            LEXICON FEED
          </button>
          <button className="nav-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="6" />
              <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
            </svg>
            KNIGHT PRO
          </button>
        </nav>

        <div className="pro-banner">
          <div className="pro-banner-title">VOCUKNIGHT</div>
          <span className="pro-badge">PRO</span>
          <div className="pro-user">PLAYER // 1083 ELO</div>
          <div className="pro-sub">Upgrade to unlock Etymology Duels</div>
        </div>
      </aside>

      {/* ==========================================
           2. CENTER MAIN ARENA STAGE
           ========================================== */}
      <main className="main-stage">
        {/* SCREEN 1: ARENA LOBBY */}
        {currentScreen === 'lobby' && (
          <section id="screen-lobby" className="screen active">
            {/* Top Active Rivals Bar */}
            <div className="rivals-strip">
              <div className="rival-avatar-item">
                <div className="avatar-ring you">YOU</div>
                <span className="rival-name">YOU</span>
              </div>
              <div className="rival-avatar-item" onClick={() => startMatchmaking('RIVAL MATCH // TOVA')}>
                <div className="avatar-ring">
                  TV<span className="status-dot"></span>
                </div>
                <span className="rival-name">TOVA_BOT</span>
              </div>
              <div className="rival-avatar-item" onClick={() => startMatchmaking('RIVAL MATCH // KAIROS')}>
                <div className="avatar-ring">
                  KR<span className="status-dot"></span>
                </div>
                <span className="rival-name">KAIROS</span>
              </div>
              <div className="rival-avatar-item" onClick={() => startMatchmaking('RIVAL MATCH // VEX_99')}>
                <div className="avatar-ring">
                  VX<span className="status-dot"></span>
                </div>
                <span className="rival-name">VEX_99</span>
              </div>
              <div className="rival-avatar-item" onClick={() => startMatchmaking('RIVAL MATCH // ZENITH')}>
                <div className="avatar-ring">
                  ZN<span className="status-dot"></span>
                </div>
                <span className="rival-name">ZENITH</span>
              </div>
            </div>

            {/* Daily Challenges Banner */}
            <div className="daily-challenge-card">
              <div className="timer-pill">● 04:12:54</div>
              <h2 className="display-title">DAILY CHALLENGES</h2>
              <p className="card-subtitle">Complete vocabulary sprints to earn Knight ELO & shards</p>
              <div className="progress-track">
                <span className="progress-pill" id="daily-progress-pill">
                  {dailyChallengesCompleted}/5
                </span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9FEF00"
                  strokeWidth="2"
                  style={{ marginRight: '8px' }}
                >
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                </svg>
              </div>
            </div>

            {/* Square Category Selector Tiles (Matiks Style) */}
            <div className="section-label">DUEL DOMAINS</div>
            <div className="category-grid">
              <div
                className={`cat-tile-wrap ${activeTheme === 'yellow' ? 'active' : ''}`}
                data-theme="yellow"
                onClick={() => selectDomain('yellow', 'ALL DECKS MIXED')}
              >
                <div className="cat-tile">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                  </svg>
                  <span className="cat-rating-pill">1083</span>
                </div>
                <span className="cat-label">ALL MIXED</span>
              </div>

              <div
                className={`cat-tile-wrap ${activeTheme === 'blue' ? 'active' : ''}`}
                data-theme="blue"
                onClick={() => selectDomain('blue', 'WORK & BUSINESS')}
              >
                <div className="cat-tile">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="2" y="7" width="20" height="14" rx="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                  <span className="cat-rating-pill">1040</span>
                </div>
                <span className="cat-label">BUSINESS</span>
              </div>

              <div
                className={`cat-tile-wrap ${activeTheme === 'green' ? 'active' : ''}`}
                data-theme="green"
                onClick={() => selectDomain('green', 'ACADEMIC & GRE')}
              >
                <div className="cat-tile">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                  </svg>
                  <span className="cat-rating-pill">1120</span>
                </div>
                <span className="cat-label">ACADEMIC</span>
              </div>

              <div
                className={`cat-tile-wrap ${activeTheme === 'purple' ? 'active' : ''}`}
                data-theme="purple"
                onClick={() => selectDomain('purple', 'RHETORIC & LOGIC')}
              >
                <div className="cat-tile">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  <span className="cat-rating-pill">985</span>
                </div>
                <span className="cat-label">RHETORIC</span>
              </div>
            </div>

            {/* Study Window Bar */}
            <div className="config-banner">
              <div className="config-info">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FACC15" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>
                  <strong>STUDY WINDOW:</strong> Timed flashcard review before your 60s live rapid-fire duel
                </span>
              </div>
              <div className="config-controls">
                <button
                  className={`chip-btn ${studySeconds === 60 ? 'active' : ''}`}
                  onClick={() => setStudyWindowConfig(60, 10)}
                >
                  1 MIN • 10 CARDS
                </button>
                <button
                  className={`chip-btn ${studySeconds === 180 ? 'active' : ''}`}
                  onClick={() => setStudyWindowConfig(180, 20)}
                >
                  3 MIN • 20 CARDS
                </button>
                <button
                  className={`chip-btn ${studySeconds === 300 ? 'active' : ''}`}
                  onClick={() => setStudyWindowConfig(300, 30)}
                >
                  5 MIN • 30 CARDS
                </button>
              </div>
            </div>

            {/* 2-Column Matiks Bento Duel Cards */}
            <div className="bento-duels">
              {/* Card 1: Squire Sprint Duel */}
              <div className="duel-card" onClick={() => startMatchmaking(`SQUIRE CASUAL // ${selectedDomainName}`)}>
                <span className="duel-tag" id="domain-tag-1">
                  {selectedDomainName}
                </span>
                <div className="duel-card-body">
                  <div className="duel-title">
                    SPRINT
                    <br />
                    DUELS
                  </div>
                  <div className="duel-desc">SQUIRE TIER • CASUAL • NO RATING LOSS</div>
                </div>
                <span className="duel-arrow">›</span>
                <svg className="duel-wireframe" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" />
                  <line x1="50" y1="5" x2="50" y2="95" />
                  <line x1="5" y1="25" x2="95" y2="75" />
                </svg>
              </div>

              {/* Card 2: Ranked Knight Duel */}
              <div className="duel-card" onClick={() => startMatchmaking(`KNIGHT RANKED // ${selectedDomainName}`)}>
                <span className="duel-tag ranked" id="domain-tag-2">
                  RANKED • ELO STAKES
                </span>
                <div className="duel-card-body">
                  <div className="duel-title">
                    FASTEST FINGERS
                    <br />
                    DUELS
                  </div>
                  <div className="duel-desc">KNIGHT TIER • BE FIRST TO ANSWER EACH CARD</div>
                </div>
                <span className="duel-arrow" style={{ color: 'var(--lime)' }}>
                  ›
                </span>
                <svg className="duel-wireframe" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="50" cy="50" r="42" />
                  <ellipse cx="50" cy="50" rx="42" ry="16" />
                  <ellipse cx="50" cy="50" rx="16" ry="42" />
                </svg>
              </div>
            </div>

            {/* 5 Thematic Realms (Matiks Today's Quest Row Format) */}
            <div className="section-label">THEMATIC REALMS // DIRECT DRILLS</div>
            <div className="realms-list">
              <div className="realm-row">
                <div className="realm-left">
                  <div className="realm-icon-box">A2</div>
                  <div>
                    <div className="realm-name">Everyday Essentials</div>
                    <div className="realm-meta">DAILY LIFE • LEVEL A2 • 30 CARDS</div>
                  </div>
                </div>
                <button className="play-now-btn" onClick={() => startMatchmaking('EVERYDAY ESSENTIALS')}>
                  Play Now
                </button>
              </div>

              <div className="realm-row">
                <div className="realm-left">
                  <div className="realm-icon-box" style={{ color: 'var(--blue)' }}>
                    B1
                  </div>
                  <div>
                    <div className="realm-name">Work and Business</div>
                    <div className="realm-meta">CAREER • LEVEL B1 • 30 CARDS</div>
                  </div>
                </div>
                <button className="play-now-btn" onClick={() => startMatchmaking('WORK & BUSINESS')}>
                  Play Now
                </button>
              </div>

              <div className="realm-row">
                <div className="realm-left">
                  <div className="realm-icon-box" style={{ color: 'var(--yellow)' }}>
                    B2
                  </div>
                  <div>
                    <div className="realm-name">Academic Starters</div>
                    <div className="realm-meta">STUDY • LEVEL B2 • 30 CARDS</div>
                  </div>
                </div>
                <button className="play-now-btn" onClick={() => startMatchmaking('ACADEMIC STARTERS')}>
                  Play Now
                </button>
              </div>

              <div className="realm-row">
                <div className="realm-left">
                  <div className="realm-icon-box" style={{ color: 'var(--purple)' }}>
                    B1
                  </div>
                  <div>
                    <div className="realm-name">Feelings and Character</div>
                    <div className="realm-meta">PERSONALITY • LEVEL B1 • 30 CARDS</div>
                  </div>
                </div>
                <button className="play-now-btn" onClick={() => startMatchmaking('FEELINGS & CHARACTER')}>
                  Play Now
                </button>
              </div>

              <div className="realm-row">
                <div className="realm-left">
                  <div className="realm-icon-box" style={{ color: 'var(--lime)' }}>
                    A2
                  </div>
                  <div>
                    <div className="realm-name">Travel and Places</div>
                    <div className="realm-meta">TRAVEL • LEVEL A2-B1 • 20 CARDS</div>
                  </div>
                </div>
                <button className="play-now-btn" onClick={() => startMatchmaking('TRAVEL & PLACES')}>
                  Play Now
                </button>
              </div>
            </div>
          </section>
        )}

        {/* SCREEN 2: MATCHMAKING */}
        {currentScreen === 'matchmaking' && (
          <section id="screen-matchmaking" className="screen active">
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <div className="section-label" id="match-mode-label">
                {matchModeTitle}
              </div>
              <h1
                className="display-title"
                style={{ fontSize: '48px', color: matchFound ? 'var(--lime)' : 'var(--text-primary)' }}
                id="match-status-title"
              >
                {matchFound ? 'MATCH FOUND!' : 'SEARCHING FOR RIVAL...'}
              </h1>
            </div>

            <div className="versus-box">
              <div className="fighter-card you">
                <div className="avatar-ring you" style={{ margin: '0 auto 14px', width: '72px', height: '72px' }}>
                  YOU
                </div>
                <div className="section-label" style={{ color: 'var(--lime)', marginBottom: '4px' }}>
                  CHALLENGER
                </div>
                <div className="display-title">PLAYER</div>
                <div className="realm-meta">RATING // 1083 ELO</div>
              </div>

              <div className="vs-badge">VS</div>

              <div className="fighter-card">
                <div className="avatar-ring" style={{ margin: '0 auto 14px', width: '72px', height: '72px' }}>
                  TV
                </div>
                <div className="section-label" style={{ marginBottom: '4px' }}>
                  SQUIRE BOT
                </div>
                <div className="display-title">TOVA</div>
                <div className="realm-meta">RATING // 1050 ELO</div>
              </div>
            </div>
          </section>
        )}

        {/* SCREEN 3: TIMED STUDY PHASE */}
        {currentScreen === 'study' && (
          <section id="screen-study" className="screen active">
            <div className="hud-bar">
              <div>
                <div className="hud-timer" id="study-timer-display">
                  {formatTimer(studyTimeRemaining)}
                </div>
                <div className="realm-meta" id="study-count-label">
                  {studiedSet.size}/{currentDeck.length} STUDIED • TOVA: STUDYING...
                </div>
              </div>
              <button className="btn-lime" onClick={triggerCountdown}>
                READY FOR DUEL ›
              </button>
            </div>

            <div className="section-label" id="card-index-label">
              CARD {currentCardIndex + 1} OF {currentDeck.length} // CLICK CARD TO FLIP
            </div>

            <div className={`flashcard-stage ${isFlipped ? 'flipped' : ''}`} id="flashcard" onClick={flipCard}>
              <div className="flashcard-inner">
                {/* Front */}
                <div className="flashcard-face">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="duel-tag" id="card-pos">
                      {currentStudyCard.pos}
                    </span>
                    <span className="realm-meta">TAP TO VIEW DEFINITION</span>
                  </div>
                  <div className="word-display" id="card-word">
                    {currentStudyCard.word}
                  </div>
                  <div style={{ textAlign: 'center' }} className="realm-meta">
                    PRESS [SPACE] OR CLICK TO FLIP
                  </div>
                </div>
                {/* Back */}
                <div className="flashcard-face flashcard-back">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="duel-tag ranked" id="card-word-back">
                      {currentStudyCard.word}
                    </span>
                    <span className="realm-meta" style={{ color: 'var(--lime)' }}>
                      ✓ STUDIED
                    </span>
                  </div>
                  <div>
                    <div className="section-label">DEFINITION</div>
                    <p style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }} id="card-def">
                      {currentStudyCard.def}
                    </p>
                    <div className="section-label">EXAMPLE IN CONTEXT</div>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontStyle: 'italic' }} id="card-example">
                      {currentStudyCard.example}
                    </p>
                  </div>
                  <div className="realm-meta">CLICK TO FLIP BACK</div>
                </div>
              </div>
            </div>

            <div className="study-controls">
              <button className="btn-ghost" onClick={prevCard}>
                ← PREV
              </button>
              <button className="btn-ghost" onClick={flipCard}>
                FLIP CARD
              </button>
              <button className="btn-lime" onClick={nextCard}>
                NEXT CARD →
              </button>
            </div>
          </section>
        )}

        {/* SCREEN 4: 3-2-1 COUNTDOWN */}
        {currentScreen === 'countdown' && (
          <section id="screen-countdown" className="screen active">
            <div style={{ textAlign: 'center', padding: '90px 20px' }}>
              <div className="section-label" style={{ color: 'var(--lime)' }}>
                STUDY COMPLETE • PREPARE FOR BATTLE
              </div>
              <div className="display-title" style={{ fontSize: '140px', color: 'var(--yellow)', lineHeight: 1 }} id="countdown-num">
                {countdownNum}
              </div>
              <p className="card-subtitle" style={{ fontSize: '15px', marginTop: '12px' }}>
                DUELING TOVA — CARDS BEGIN IMMEDIATELY
              </p>
            </div>
          </section>
        )}

        {/* SCREEN 5: LIVE 60S CARD DUEL */}
        {currentScreen === 'battle' && (
          <section id="screen-battle" className="screen active">
            <div className="hud-bar">
              <div>
                <div className="section-label" style={{ marginBottom: '2px', color: 'var(--lime)' }}>
                  YOU
                </div>
                <div className="display-title" style={{ fontSize: '36px' }} id="player-score">
                  {playerScore}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div className="hud-timer" id="battle-timer">
                  {battleSeconds}s
                </div>
                <div className="realm-meta" id="battle-progress-text">
                  ROUND {battleIndex + 1} OF {currentDeck.length}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="section-label" style={{ marginBottom: '2px', color: 'var(--yellow)' }}>
                  TOVA
                </div>
                <div className="display-title" style={{ fontSize: '36px' }} id="bot-score">
                  {botScore}
                </div>
              </div>
            </div>

            <div className="daily-challenge-card" style={{ textAlign: 'center', padding: '40px 24px' }}>
              <span className="duel-tag" style={{ marginBottom: '12px' }}>
                SELECT THE EXACT DEFINITION
              </span>
              <div className="word-display" id="battle-word">
                {currentBattleCard.word}
              </div>
            </div>

            <div className="options-grid" id="battle-options">
              {shuffledOptions.map((choice, idx) => {
                let btnClass = 'option-btn';
                if (answeredState !== null) {
                  if (choice.text === answeredState.selectedText) {
                    btnClass += answeredState.isCorrect ? ' correct' : ' wrong';
                  } else if (choice.correct) {
                    btnClass += ' correct';
                  }
                }
                return (
                  <button
                    key={`${idx}-${choice.text}`}
                    className={btnClass}
                    disabled={answeredState !== null}
                    onClick={() => handleAnswer(choice)}
                  >
                    {choice.text}
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* ==========================================
           3. MATIKS RIGHT QUEST RAIL
           ========================================== */}
      <aside className="right-rail">
        <div className="section-label">DAILY QUESTS</div>

        <div className="quest-mini-card">
          <div className="quest-mini-title">Complete 1 Sprint Vocabulary Duel</div>
          <div className="mini-bar-wrap">
            <div className="mini-bar">
              <div className="mini-bar-fill" id="quest-1-bar" style={{ width: quest1Complete ? '100%' : '0%' }}></div>
            </div>
            <span className="mini-bar-stat" id="quest-1-stat">
              {quest1Complete ? '1 / 1' : '0 / 1'}
            </span>
          </div>
        </div>

        <div className="quest-mini-card">
          <div className="quest-mini-title">Flip & Study 10 Arena Flashcards</div>
          <div className="mini-bar-wrap">
            <div className="mini-bar">
              <div
                className="mini-bar-fill"
                id="quest-2-bar"
                style={{ width: `${Math.min(100, studiedSet.size * 10)}%` }}
              ></div>
            </div>
            <span className="mini-bar-stat" id="quest-2-stat">
              {studiedSet.size} / 10
            </span>
          </div>
        </div>

        <div className="quest-mini-card">
          <div className="quest-mini-title">Win a Ranked Knight Tier Match</div>
          <div className="mini-bar-wrap">
            <div className="mini-bar">
              <div
                className="mini-bar-fill"
                style={{ width: playerScore > botScore && quest1Complete ? '100%' : '0%' }}
              ></div>
            </div>
            <span className="mini-bar-stat">
              {playerScore > botScore && quest1Complete ? '1 / 1' : '0 / 1'}
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
}
