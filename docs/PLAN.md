# Vocuknight: Development Plan (v2, study-window format)

Alpha 1 ships five English vocabulary decks with a timed study window and a card duel against a computer opponent; beta brings in real players.

Platform note: Vocuknight is built as a mobile-first web app (PWA). Section 10 holds the stack, and AGENTS.md holds the working rules for the build agents.

Change note: this version removes the flashcard learning system, spaced repetition, and mastery tracking. Learning now happens inside each match, during a 1, 3, or 5 minute study window.

## 1. Product summary

Vocuknight is a head-to-head vocabulary game with the quick, competitive feel of Matiks. A player picks a deck, presses Play, and chooses a 1, 3, or 5 minute study window. The app connects them to an opponent (a computer opponent in Alpha 1). Both players study the same set of Vocuknight cards during the window. When the window ends, the duel starts, and whoever answers the most cards correctly wins. A results screen then shows the cards the player missed.

**Core promise:** every match is a short, fair race, and every race ends with a clear list of cards to learn next time.

**Starting scope:** English vocabulary. The data model carries a language field from day one so that other languages arrive later as new content.

**Design theme:** minimalist doodle. Paper-white backgrounds, hand-drawn ink lines, and a small doodle knight mascot.

**Vocuknight card:** one vocabulary entry. The front shows the word. The back shows the definition, part of speech, and an example sentence.

## 2. Release plan: Alpha 1 and beta

Alpha 1 is a single-player product that validates the match format. Beta adds real people once the format works.

| Area | Alpha 1 | Beta |
|---|---|---|
| Decks | 5 curated English decks | The same 5 decks plus new decks from tester feedback (10 by public launch) |
| Study window | 1, 3, or 5 minutes, identical for both sides | Same |
| Opponent | Computer opponent: a Squire (practice) or a Knight (ranked) | Real player for ranked matches, with a Knight bot or ghost when the queue is empty |
| Social | None | Friend match links, leaderboards, weekly tournament |
| Backend | Accounts, deck content, and results sync | Adds a real-time match server and matchmaking |
| Audience | 30 to 50 invited testers | Marketing-driven closed beta, then public launch |

Out of scope for Alpha 1: real-time multiplayer, chat, payments, flashcard review systems, and languages other than English.

## 3. Core loop and match flow

1. **Choose a deck** from the deck library.
2. **Press Play** on the deck screen, then pick a study window (1, 3, or 5 minutes) and an opponent type (Squire or Knight).
3. **Connect:** a short matchmaking screen shows the opponent’s name and doodle avatar. Alpha 1 labels computer opponents as computers.
4. **Study window:** both players browse the same set of cards while a countdown runs.
5. **Duel:** after a 3-second countdown, cards appear one at a time. Whoever answers the most cards correctly when the duel timer ends wins.
6. **Results:** winner, both scores, rating change for ranked matches, and the list of missed cards.
7. **Next:** Rematch, change the window, play a similar deck, or return to the library.

Match phases run in this order: Lobby, Study, Countdown, Duel, Results. The match engine treats each phase as a state with its own timer.

## 4. Match format

### 4.1 Study window

| Window | Cards in the study set |
|---|---|
| 1 minute | 10 |
| 3 minutes | 20 |
| 5 minutes | 30 |

- If a deck holds fewer words than the study set size, the set contains the whole deck. Every deck holds at least 10 words.
- The study view shows the set as a scrollable stack of cards. Tapping a card flips it to show the definition and example sentence. Players browse in any order.
- A countdown timer sits at the top of the screen. A **Ready** button lets a player finish early, and the duel starts when both sides are ready or the timer ends.
- The opponent’s status (studying or ready) shows on screen.
- The app records which cards each player flipped, so the results screen can mark missed cards the player never opened.
- In ranked matches, the server or engine picks one random study set shared by both players. In practice matches, the set favors cards the player missed earlier on that deck.

### 4.2 Duel

- A 3-second countdown precedes the duel.
- Cards come from the study set, one at a time, in the same order for both sides. When the set runs out, it reshuffles.
- Each card is a four-option question. The player taps an answer, and the next card appears right away.
- A correct answer adds one point. A wrong answer adds zero and moves on, with no penalty beyond the lost time.
- The duel lasts 60 seconds (proposed, tune with playtests).
- Both live scores show at the top of the screen.
- **Winner:** the player with the most correct cards. Ties go to the player with fewer wrong answers, then to the player with the faster average answer time. A tie after those checks counts as a draw.

### 4.3 Question types

| Type | Phase |
|---|---|
| Word to meaning (pick the definition) | Alpha 1 |
| Meaning to word (pick the word) | Alpha 1 |
| Fill the blank in a sentence | Beta |
| Listen and pick the word | Beta |
| Typed recall | Later |

Distractors come from the same deck, preferring words in the same part of speech and a similar length.

### 4.4 Opponent types: Squire and Knight

| | Squire (practice) | Knight (ranked) |
|---|---|---|
| Opponent in Alpha 1 | Friendly computer opponent | Computer-controlled Knight scaled to the player’s deck rating |
| Opponent in beta | Same computer opponent | Real player on the same deck and window; Knight bot or ghost if the queue is empty |
| Study set | Favors the player’s earlier missed cards | One random set shared by both players |
| Opponent pace | 5 to 7 seconds per card | 2.5 to 5 seconds per card, scaled by rating |
| Opponent accuracy | 55 to 70 percent | Scales with rating, from 45 to 92 percent |
| Rating | No change | Moves the deck rating |
| Rewards | XP and stars | XP, stars, and rank progress |

In Alpha 1 the matchmaking screen labels the Knight as a computer opponent so testers know who they face. In beta, real opponents carry a Player tag.

### 4.5 Computer opponents in Alpha 1

Both opponent types share one BotOpponent engine with different profiles.

- **Accuracy:** Squire profiles sit at 55 to 70 percent. Knight profiles follow the formula from the Wordduel prototype: accuracy = clamp(0.5 + (rating − 700) / 1200, 0.45, 0.92).
- **Pace:** time per card is drawn from a skewed distribution within the range for the opponent type, with occasional slow cards.
- **Study behavior:** the bot shows a studying status and readies at a random moment between 70 and 100 percent of the window.
- **Mistakes:** wrong answers pick plausible distractors, and short streaks of mistakes occur.
- **Rating:** a Knight bot starts within 120 points of the player’s deck rating, so matches stay close.
- **Identity:** a roster of about 20 named doodle characters keeps opponents varied.

### 4.6 Matchmaking in beta

1. The player taps Play with a deck, a window length, and the Knight option.
2. The server looks for an opponent in the same pool (deck, version, and window) with a rating inside a window that widens every few seconds.
3. After about 8 seconds, the server offers a fallback: a Knight bot or a **ghost**, which replays the recorded answers and timings of a real earlier match.
4. Fallback matches carry a visible label and a reduced rating change.
5. Both players enter the same study lobby and see each other’s status.

### 4.7 Fair play in beta

- The server picks the study set and the duel card order, and holds answer keys until each answer arrives.
- All timers (study, countdown, duel) run on the server clock.
- Players who leave a match early forfeit it.
- Reports and a simple anomaly check (answers consistently faster than human reaction time) feed a review queue.

## 5. Results and missed cards

The results screen shows:

- The winner, both scores, accuracy, and the rating change for ranked matches.
- The list of missed cards, each with the word, the correct meaning, the example sentence, and the answer the player chose. Cards the player never opened during study carry a *Not studied* tag.
- Next actions: **Rematch**, **Change window**, **Play a similar deck**, or **Back to deck library**.

Missed cards save to the deck’s missed list. Squire matches draw from that list when building the study set. Similar deck suggestions use category, level, and size, in that order.

## 6. Key design decisions

| Topic | Decision | Reason |
|---|---|---|
| Learning method | A timed study window inside every match | Matches stay short, and learning has a deadline that creates focus |
| Study window options | 1, 3, or 5 minutes, which set the study set size to 10, 20, or 30 cards | Players choose how deep to go |
| Winning rule | Most correct cards in the duel wins | Simple to understand and quick to read on screen |
| Opponent types | Squire for practice without rating risk; Knight for ranked play | Low-pressure practice and a competitive path sit side by side |
| Alpha opponents | Computer opponents only | Validates the match format before real-time infrastructure is built |
| Beta opponents | Real players for Knight matches, with bot or ghost fallback | Marketing builds the first human pool |
| Beta matchmaking pool | One pool per deck, deck version, and window length, matched by deck rating | Opponents share the same cards and similar skill |
| Rating | Elo-style, one per deck, changed by Knight matches only | Squire matches stay pressure-free |
| Question source | Drawn only from the study set | Every question traces back to a card both players could study |
| Opponent interface | The match engine talks to an opponent adapter: BotOpponent in Alpha 1, RemoteOpponent in beta | Beta swaps the opponent without rebuilding screens |
| Match authority | Alpha 1: the device runs the match. Beta: the server controls timing, study sets, and scoring | Bots need no cheating protection; human matches do |

## 7. Content system

### 7.1 Decks
- A deck has a title, category, level (CEFR A1 to C2), cover doodle, and a word list of 10 or more words.
- Alpha 1 ships 5 decks. Sizes range from 20 to 40 words so the study set logic gets tested from the start.
- Beta adds decks from tester feedback, with a public launch target of 10.

Proposed Alpha 1 lineup (to confirm):

| Deck | Category | Level | Words |
|---|---|---|---|
| Everyday Essentials | Daily life | A2 | 30 |
| Work and Business | Career | B1 | 30 |
| Feelings and Character | Emotions and personality | B1 | 30 |
| Academic Starters | Study | B2 | 40 |
| Travel and Places | Travel | A2 to B1 | 20 |

### 7.2 Word record
Word, part of speech, definition, two example sentences, pronunciation (IPA and audio file), level, tags, and optional distractor hints.

### 7.3 Versioning
Every deck edit creates a new deck version. Ratings and beta matchmaking pools stay tied to the version they were played on. Minor fixes (typos) update in place; word swaps create a new version and a new pool.

### 7.4 Sourcing and licensing
- Draft word lists from CEFR-leveled sources and public corpora.
- Definitions and examples can come from Wiktionary (CC BY-SA) and Tatoeba (CC BY); attribution pages are required.
- Check the license of every commercial word list before use.
- Every deck passes an editor review before publication.

## 8. Progression and engagement

- **Rank ladder:** Cadet, Guard, Captain, Champion, Paladin, driven by deck ratings from Knight matches. Rank names avoid Squire and Knight, which label opponents.
- **Squire stars:** each Squire win on a deck earns stars that fill the deck’s shield.
- **Deck stats:** matches, wins, and best score for each window length.
- **Daily quest:** play one match.
- **Streaks** with a weekly freeze.
- **Beta only:** friend match links, leaderboards, and a weekly tournament on a featured deck.

## 9. Design direction: minimalist doodle

### 9.1 Visual language
- **Canvas:** warm paper white with a faint dot grid. A dark chalkboard variant serves dark mode.
- **Lines:** a single ink color for outlines, drawn with a slightly wobbly stroke. Shapes come from a sketch library (rough.js or an SVG turbulence filter) so edges feel hand-drawn.
- **Color:** two highlighter accents on the ink-and-paper base, one for the player and one for the opponent.
- **Mascot:** a small doodle knight with a handful of expressions (cheering, thinking, defeated, victorious) used in loading, results, and empty states.
- **Opponents:** the Squire is a small doodle with a wooden sword, and the Knight wears doodle armor with a visor. Computer opponents draw from a roster of about 20 characters.
- **Illustrations:** each deck has a one-color cover doodle.

### 9.2 Typography
A hand-lettered display face for titles and scores, paired with a clean, highly legible body face for words and definitions. Cards stay easy to read at a glance.

### 9.3 Motion and sound
- Cards flip with a quick paper-turn animation during study.
- Correct answers get an ink-stamp check, and wrong answers get a small scribble.
- The duel countdown and the victory moment have short sound cues. Sound effects are optional and off by default for quiet environments.
- All motion respects the reduced-motion setting.

### 9.4 Screens
Home, deck library, deck screen (Play button, window picker, opponent toggle), matchmaking, study window, countdown, duel, results with missed cards, and profile with ranks. Beta adds the friend match invite.

## 10. Technical architecture

### 10.1 Stack by release

| Layer | Alpha 1 | Beta addition |
|---|---|---|
| Client | Mobile-first PWA: React, Vite, and TypeScript, installable from the browser | Same |
| Styling | Tailwind CSS plus doodle theme tokens | Same |
| State and offline data | Zustand and Dexie (IndexedDB), with a service worker from vite-plugin-pwa | Same |
| Auth, database, storage | Supabase (Postgres, Row Level Security, Storage for audio) | Same |
| Match engine | On-device TypeScript module with a BotOpponent | Server-authoritative Colyseus rooms on Fly.io or Railway, with a RemoteOpponent |
| Matchmaking | None | Redis queues, one sorted set per deck, version, and window |
| Hosting | Vercel or Cloudflare Pages (HTTPS and preview links) | Same |
| Tests | Vitest for logic, Playwright for flows | Same |
| Analytics and crashes | PostHog and Sentry | Same |
| Offline | Everything works offline, since opponents are computers | Human matches need a connection |

A lighter route for the first beta test is Supabase Realtime channels with a server function acting as referee. Move to Colyseus when concurrent matches grow.

### 10.2 Data model
- **users** (id, name, avatar)
- **decks** (id, title, category, level, language, version, status)
- **words** (id, text, pos, definition, examples, audio_url, level, language)
- **deck_words** (deck_id, version, word_id, position)
- **user_deck_stats** (user_id, deck_id, version, matches, wins, stars, best_1m, best_3m, best_5m)
- **user_card_stats** (user_id, word_id, seen_count, correct_count, wrong_count, last_missed_at)
- **ratings** (user_id, deck_id, rating, matches, wins)
- **matches** (id, deck_id, version, tier, window_secs, opponent_type, player_a, player_b, study_set, scores, winner, started_at, ended_at)
- **match_answers** (match_id, player, seq, word_id, question_type, answer, correct, ms)
- **reports** (id, match_id, reporter, reason)

`tier` takes the values *squire* or *knight*. `opponent_type` takes *bot*, *human*, or *ghost*. `study_set` holds the word ids of the cards in the match. Alpha 1 computes ratings on the device and syncs them. Beta moves rating math to the server and seeds each beta rating from the alpha rating, compressed toward 1000.

### 10.3 Alpha 1 match engine
- The engine owns the phases (Lobby, Study, Countdown, Duel, Results), their timers, and scoring, and talks to an opponent adapter.
- BotOpponent implements the adapter with a profile (accuracy, pace, ready time, rating). The Wordduel prototype in reference/wordduel.html holds Elo logic, bot behavior, and answer handling to reuse. Its speed-bonus scoring and fixed round count do not apply here, since a match scores one point per correct card in a timed duel.
- Beta adds RemoteOpponent, which relays server messages through the same adapter, so match screens stay unchanged.
- Finished matches write to `matches` and `match_answers`, and missed cards write to `user_card_stats`.

### 10.4 Beta match server flow
1. The client requests a Knight match for a deck and window.
2. The matchmaker pairs players by deck rating or assigns a fallback opponent.
3. The room picks the study set and starts the study timer, broadcasting each side’s status.
4. When both sides are ready or the timer ends, the room starts the countdown and the duel timer.
5. Clients send answers, and the server scores them and broadcasts live counts.
6. The room sends the final result with rating changes, and the match record is saved.

### 10.5 Offline and reliability
In Alpha 1 the whole game works offline and syncs results later. In beta, human matches give a dropped connection a 10-second reconnect window.

## 11. Roadmap

Alpha 1 takes about 13 weeks, and beta starts in week 14. Estimates assume one full-stack developer plus part-time design; a second developer compresses the multiplayer phase. Gates sit at the end of Phase 4 (Alpha 1) and Phase 6 (closed beta).

| Phase | Weeks | Deliverables | Exit gate |
|---|---|---|---|
| 0. Foundations | 1 | Repo, Vite app shell, Supabase project, design tokens, 2 sample decks | App loads a deck on a phone |
| 1. Decks and study window | 2 to 4 | Deck library, deck screen, Play setup (window picker and opponent toggle), study view with timer and card flip, local storage | A tester can open a deck, pick a window, and study cards |
| 2. Match engine with bots | 5 to 7 | Phase state machine, opponent adapter, BotOpponent profiles, countdown, timed duel, count scoring, deck ratings, results screen with missed cards | A full match plays start to finish against both opponent types |
| 3. Content and polish | 8 to 10 | 5 decks, doodle art pass, sounds, onboarding, accessibility pass | Every deck editor-reviewed; usability test passes |
| 4. Alpha 1 release | 11 to 13 | Web app live for 30 to 50 invited testers, analytics dashboard, bot tuning, bug fixing | Alpha 1 targets in section 13 met for two weeks |
| 5. Multiplayer foundation | 14 to 19 | Colyseus server, matchmaking pools, ghosts, reconnects, server-side ratings, friend match links, RemoteOpponent | 20 simultaneous test matches run without desync |
| 6. Closed beta | 20 to 26 | Waitlist and marketing campaign (section 12), analytics, tuning, new decks from feedback | Beta targets in section 13 met for two weeks |
| 7. Public launch | 27 onward | Web launch, weekly tournaments, creator and teacher decks | Stable pools on the featured decks |

## 12. Beta marketing and player acquisition

Beta marketing has one job: concentrate enough players on a few decks and windows that a ranked match finds a human opponent within about 10 seconds.

- **Pre-beta:** a waitlist page with deck previews and short doodle-knight clips goes live during Alpha 1. Alpha testers become seed players and referrers.
- **Hook:** a full match fits in one to six minutes, which suits short-form video of duels and “beat the Knight” challenges.
- **Channels:** language-learning communities (subreddits and Discord servers), study groups and student communities, and partnerships with creators and teachers.
- **Sharing mechanics:** friend match links, shareable result cards, a referral reward (a Knight skin), and a weekly tournament.
- **Traffic concentration:** a daily featured deck and window, plus scheduled match hours (two evening windows), raise the chance of a live opponent. Ghosts and Knight bots cover the gaps.
- **Planning number (approximate):** about 100 daily active players per featured deck keeps evening queues short. Confirm the figure with beta data.
- **Funnel to track:** waitlist signup, install, first match, and the share of ranked matches played against humans.

## 13. Success metrics

Targets are proposals to tune after the first test cohort.

| Metric | Alpha 1 target | Beta target |
|---|---|---|
| Day 1 and Day 7 retention | 35 percent and 12 percent | 40 percent and 15 percent |
| First match within the first session | 70 percent | 70 percent |
| Study window completed (not abandoned) | 85 percent | 85 percent |
| Match completion rate | 90 percent | 90 percent |
| Share of testers who try a Knight match | 30 percent or more | 50 percent or more |
| Results screen viewed with missed cards opened | 60 percent | 60 percent |
| Rematch or next-deck rate | 50 percent | 50 percent |
| Window choice split (1, 3, 5 minutes) | Track only | Track only |
| Tester fun rating (survey, 1 to 5) | 4.0 | 4.0 |
| Median wait for a human opponent | Not applicable | Under 10 seconds on top decks |
| Share of fallback matches | Not applicable | Under 40 percent by end of beta |

## 14. Risks and mitigations

| Risk | Mitigation |
|---|---|
| The study window feels like waiting | Offer the 1-minute option, add a Ready button, and show the opponent’s status |
| Computer opponents feel artificial or repetitive | Human-like pace and mistakes, a roster of about 20 characters, and tuning from playtest feedback |
| Testers lose trust if a bot looks like a person | Label computer opponents in Alpha 1 |
| Alpha 1 results reflect bot behavior and may differ from human play | Use Alpha 1 to validate the match format and interface; set beta metrics separately |
| Beta pools split across decks and window lengths | Concentrate marketing on 1 or 2 featured decks and windows, schedule match hours, and use ghosts and Knight bots |
| The 60-second duel rewards luck on a small study set | Reshuffle the set and tune duel length and set sizes from playtests |
| Players skip studying and guess | Keep the Ready button available, since the match score and rating provide the feedback |
| Alpha ratings drift away from human skill | Compress alpha ratings toward 1000 when seeding beta ratings |
| Content quality varies across decks | Editor review, in-app card reports, and versioned fixes |
| Licensing issues with word lists | Use openly licensed sources and keep an attribution file |
| Real-time infrastructure cost and complexity in beta | Start with one region, cap room counts, and instrument load early |
| Scope growth toward other languages | Keep a language field in the schema and add languages after English retention proves out |

## 15. Decisions to confirm

1. **Match flow:** this plan reads the idea as Play, then connect to an opponent, then a shared study window, then the duel. Confirm or adjust.
2. **Study set sizes:** 10, 20, and 30 cards for the 1, 3, and 5 minute windows.
3. **Duel length:** 60 seconds, counting correct cards. The alternative is one pass through the study set.
4. **Squire and Knight:** kept as the practice and ranked opponent types chosen at the Play step.
5. **Wrong answers:** no penalty beyond lost time.
6. **Five Alpha 1 decks:** confirm the lineup in section 7.1.
7. **Team size and timeline:** the roadmap assumes one developer.
8. **Monetization:** options include a free tier with limited decks and a premium pass for all decks, tournaments, and cosmetic knight skins.

## 16. Immediate next steps

1. Confirm the open decisions in section 15.
2. Write the first two decks in full.
3. Sketch the doodle style on three screens (deck screen with Play setup, study window, duel) to lock the visual direction.
4. Start Phase 0, reusing the Elo and bot logic from the Wordduel prototype.
