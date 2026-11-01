# Vocuknight: Development Plan

Alpha 1 ships five English vocabulary decks with duels against computer opponents; beta brings in real players.

Platform note: Vocuknight is built as a mobile-first web app (PWA). Sections 12.1 and 13 reflect that stack. AGENTS.md holds the working rules for the build agents.

## 1. Product summary

Vocuknight is a deck-based vocabulary app. Every deck offers flashcard learning and two kinds of duel: a practice duel against a Squire and a ranked duel against a Knight.

A player picks a deck (for example, Deck 1 with 30 words), studies it with flashcards, and can start either duel at any moment, including halfway through learning. After each duel, a review window lists every word the player missed. When the review ends, the app offers a similar deck to learn and duel next.

**Core promise:** every duel turns into learning, because missed words flow straight into the player’s review queue.

**Starting scope:** English vocabulary. The data model carries a language field from day one so that other languages arrive later as new content.

**Design theme:** minimalist doodle. Paper-white backgrounds, hand-drawn ink lines, and a small doodle knight mascot.

## 2. Release plan: Alpha 1 and beta

Alpha 1 is a single-player product that validates the learning loop and the duel feel. Beta adds real people once the loop works.

| Area | Alpha 1 | Beta |
|---|---|---|
| Decks | 5 curated English decks | The same 5 decks plus new decks from tester feedback (10 by public launch) |
| Duel a Squire | Practice duel against a computer opponent | Same |
| Duel a Knight | Ranked duel against a computer-controlled Knight scaled to the player’s deck rating | Ranked duel against a real player on the same deck, with a Knight bot or ghost when the queue is empty |
| Learning | Flashcards, spaced repetition, mastery tracking | Same |
| Social | None | Friend duel links, leaderboards, weekly tournament |
| Backend | Accounts, deck content, and progress sync | Adds a real-time duel server and matchmaking |
| Audience | 30 to 50 invited testers | Marketing-driven closed beta, then public launch |

Out of scope for Alpha 1: real-time multiplayer, chat, payments, and languages other than English.

## 3. Core loop

The loop runs from deck choice to duel to review and back to a new deck. Duels are open at every step, so a player can test a half-learned deck against a Squire or a Knight whenever they like.

1. **Choose a deck** from the deck library (categories, levels, and sizes vary).
2. **Learn** the deck with flashcards.
3. **Duel at any time:** Duel a Squire for practice or Duel a Knight for a ranked match.
4. **Review mistakes** in a dedicated window after the duel.
5. **Move on** to a similar deck, a rematch, or a harder deck.

Each deck shows a mastery meter that fills as words are mastered, and one of three states: *Not started*, *Learning*, or *Mastered*. A deck earns the *Conquered* badge when its mastery reaches 100 percent and the player has won one Knight duel on it. No state blocks a duel.

## 4. Duel options: Squire and Knight

Every deck screen carries three buttons: **Learn**, **Duel a Squire**, and **Duel a Knight**.

| | Duel a Squire | Duel a Knight |
|---|---|---|
| Purpose | Practice and learning | Ranked competition |
| Available | From the first minute of any deck | From the first minute of any deck |
| Opponent in Alpha 1 | Friendly computer opponent | Computer-controlled Knight scaled to the player’s deck rating |
| Opponent in beta | Same computer opponent | Real player on the same deck; Knight bot or ghost if the queue is empty |
| Round timer | 12 seconds | 8 seconds |
| Question mix | Weighted toward words the player has not mastered | Uniform across the deck |
| Opponent accuracy | 55 to 70 percent, slower answers | Scales with rating, from 45 to 92 percent |
| Rating | No change | Moves the deck rating |
| Rewards | XP and stars | XP, stars, and rank progress |

The Squire exists for low-pressure learning, and the Knight exists for the competitive path. In Alpha 1 the match intro labels the Knight as a computer opponent so testers know who they face. In beta, real opponents carry a Player tag. Words a player has not studied yet appear in the review window with a *New* tag.

## 5. Key design decisions

| Topic | Decision | Reason |
|---|---|---|
| Duel access | Both duels are open on every deck at any time | Players learn by playing, and no gate delays the first duel |
| Opponent tiers | Squire for practice without rating risk; Knight for ranked play | Low-pressure practice and a competitive path sit side by side |
| Alpha opponents | Computer opponents only | Validates the learning loop and duel feel before real-time infrastructure is built |
| Beta opponents | Real players for Knight duels, with bot or ghost fallback | Marketing builds the first human pool |
| Beta matchmaking pool | One pool per deck and deck version, matched by deck rating | Opponents share the same word set and similar skill |
| Rating | Elo-style, one per deck, changed by Knight duels only | Squire duels stay pressure-free |
| Duel questions | Drawn only from the chosen deck | Every question traces back to a deck word |
| Duel length | 10 rounds for decks of 20 words or more; 5 to 8 rounds for smaller decks | Variable deck sizes need a length rule |
| Opponent interface | The duel engine talks to an opponent adapter: BotOpponent in Alpha 1, RemoteOpponent in beta | Beta swaps the opponent without rebuilding screens |
| Match authority | Alpha 1: the device runs the match. Beta: the server controls timing, questions, and scoring | Bots need no cheating protection; human matches do |

## 6. Learning phase

### 6.1 Flashcard session
- Card front shows the word, with audio and an example sentence available on tap.
- Card back shows the definition, part of speech, and a second example.
- The player marks each card *Got it* or *Again*. Cards marked *Again* return later in the same session.
- A session finishes when every card has been marked *Got it* at least once.
- A **Duel a Squire** shortcut sits at the end of every session, and the deck screen keeps both duel buttons visible throughout.

### 6.2 Mastery tracking
A word counts as mastered after two correct recalls on separate days. Recalls come from flashcards, the optional mastery check, and duels. The deck’s mastery meter shows the share of mastered words. Mastery drives badges and shapes the Squire question mix, and it never blocks a duel.

### 6.3 Optional mastery check
A solo quiz over the whole deck for players who want a quick progress read. Each correct word counts as one recall toward mastery, and each miss returns to the flashcard queue.

### 6.4 Spaced repetition
A simple box system schedules each word: correct answers move it to a longer interval, and misses move it back to box 1. Duel mistakes feed the same system, so a missed word returns in the next review session.

## 7. Duel mode

### 7.1 Match format
- Both sides receive identical questions in identical order.
- Round timers follow the opponent tier: 12 seconds for a Squire duel, 8 seconds for a Knight duel (tune with playtests).
- Scoring: 100 points for a correct answer plus up to 100 for speed. Wrong answers and timeouts score zero.
- The score bar shows both totals live.
- A match picks 10 words at random from the deck (5 to 8 for decks under 20 words). Squire duels weight the pick toward unmastered words.

### 7.2 Question types
| Type | Phase |
|---|---|
| Word to meaning (pick the definition) | Alpha 1 |
| Meaning to word (pick the word) | Alpha 1 |
| Fill the blank in a sentence | Beta |
| Listen and pick the word | Beta |
| Typed recall | Later |

Distractors come from the same deck, preferring words in the same part of speech and a similar length.

### 7.3 Computer opponents in Alpha 1
Both tiers share one BotOpponent engine with different profiles.

- **Accuracy:** Squire profiles sit at 55 to 70 percent. Knight profiles follow the formula from the Wordduel prototype: accuracy = clamp(0.5 + (rating − 700) / 1200, 0.45, 0.92).
- **Response time:** drawn from a skewed distribution, faster at higher ratings, with occasional timeouts.
- **Mistakes:** wrong answers pick plausible distractors, and short streaks of mistakes occur.
- **Rating:** a Knight bot starts within 120 points of the player’s deck rating, so matches stay close.
- **Identity:** a roster of about 20 named doodle characters keeps opponents varied.

### 7.4 Matchmaking in beta
1. The player taps **Duel a Knight** on a deck and joins that deck’s queue.
2. The server looks for an opponent in the same deck pool with a rating inside a window that widens every few seconds.
3. After about 8 seconds, the server offers a fallback: a Knight bot or a **ghost**, which replays the recorded answers and timings of a real earlier match.
4. Fallback matches carry a visible label and a reduced rating change.
5. Each player’s deck mastery shows as a badge on the match intro, so both sides see how familiar the opponent is with the deck.

### 7.5 Fair play in beta
- The server holds answer keys until each round closes.
- Round timers run on the server clock.
- Players who leave a match early forfeit it.
- Reports and a simple anomaly check (answers consistently faster than human reaction time) feed a review queue.

## 8. Mistake review window

After every duel, Squire or Knight, a review screen opens with:

- The list of missed words, each with definition, example sentence, and the answer the player chose.
- A separate group for words tagged *New*, which the player had not studied yet.
- A one-tap quiz on only those words.
- A button that returns missed words to the spaced repetition queue.
- Next actions: **Rematch**, **Play a similar deck**, or **Back to deck library**.

Similar deck suggestions use category, level, and size, in that order. After a Squire win, the screen also offers a **Duel a Knight** shortcut on the same deck.

## 9. Content system

### 9.1 Decks
- A deck has a title, category, level (CEFR A1 to C2), cover doodle, and a word list of any size.
- Alpha 1 ships 5 decks. Sizes range from 20 to 40 words so the variable-size logic gets tested from the start.
- Beta adds decks from tester feedback, with a public launch target of 10.

Proposed Alpha 1 lineup (to confirm):

| Deck | Category | Level | Words |
|---|---|---|---|
| Everyday Essentials | Daily life | A2 | 30 |
| Work and Business | Career | B1 | 30 |
| Feelings and Character | Emotions and personality | B1 | 30 |
| Academic Starters | Study | B2 | 40 |
| Travel and Places | Travel | A2 to B1 | 20 |

### 9.2 Word record
Word, part of speech, definition, two example sentences, pronunciation (IPA and audio file), level, tags, and optional distractor hints.

### 9.3 Versioning
Every deck edit creates a new deck version. Ratings and beta matchmaking pools stay tied to the version they were played on. Minor fixes (typos) update in place; word swaps create a new version and a new pool.

### 9.4 Sourcing and licensing
- Draft word lists from CEFR-leveled sources and public corpora.
- Definitions and examples can come from Wiktionary (CC BY-SA) and Tatoeba (CC BY); attribution pages are required.
- Check the license of every commercial word list before use.
- Every deck passes an editor review before publication.

## 10. Progression and engagement

- **Rank ladder:** Cadet, Guard, Captain, Champion, Paladin, driven by deck ratings from Knight duels. Rank names avoid Squire and Knight, which label opponents.
- **Squire stars:** each Squire win on a deck earns stars that fill the deck’s shield.
- **Deck badges:** the shield fills with mastery, and the *Conquered* badge marks 100 percent mastery plus one Knight win.
- **Daily quest:** one flashcard session or one duel.
- **Streaks** with a weekly freeze.
- **Beta only:** friend duels through invite links, leaderboards, and a weekly tournament on a featured deck.

## 11. Design direction: minimalist doodle

### 11.1 Visual language
- **Canvas:** warm paper white with a faint dot grid. A dark chalkboard variant serves dark mode.
- **Lines:** a single ink color for outlines, drawn with a slightly wobbly stroke. Shapes come from a sketch library (rough.js or an SVG turbulence filter) so edges feel hand-drawn.
- **Color:** two highlighter accents on the ink-and-paper base, one for the player and one for the opponent.
- **Mascot:** a small doodle knight with a handful of expressions (cheering, thinking, defeated, victorious) used in loading, results, and empty states.
- **Opponents:** the Squire is a small doodle with a wooden sword, and the Knight wears doodle armor with a visor. Computer opponents draw from a roster of about 20 characters.
- **Illustrations:** each deck has a one-color cover doodle.

### 11.2 Typography
A hand-lettered display face for titles and scores, paired with a clean, highly legible body face for words and definitions. Learning content stays easy to read at a glance.

### 11.3 Motion and sound
- Cards flip with a quick paper-turn animation.
- Correct answers get an ink-stamp check, and wrong answers get a small scribble.
- Victory plays a short sword flourish. Sound effects are optional and off by default for quiet environments.
- All motion respects the reduced-motion setting.

### 11.4 Screens
Home (continue where you left off), deck library, deck screen (Learn, Duel a Squire, Duel a Knight, mastery meter), flashcard session, optional mastery check, duel intro, duel, results, mistake review, and profile with ranks. Beta adds the matchmaking wait screen and friend invite.

## 12. Technical architecture

### 12.1 Stack by release

| Layer | Alpha 1 | Beta addition |
|---|---|---|
| Client | Mobile-first PWA: React, Vite, and TypeScript, installable from the browser | Same |
| Styling | Tailwind CSS plus doodle theme tokens | Same |
| State and offline data | Zustand and Dexie (IndexedDB), with a service worker from vite-plugin-pwa | Same |
| Auth, database, storage | Supabase (Postgres, Row Level Security, Storage for audio) | Same |
| Duel engine | On-device TypeScript module with a BotOpponent | Server-authoritative Colyseus rooms on Fly.io or Railway, with a RemoteOpponent |
| Matchmaking | None | Redis queues, one sorted set per deck and version |
| Hosting | Vercel or Cloudflare Pages (HTTPS and preview links) | Same |
| Tests | Vitest for logic, Playwright for flows | Same |
| Analytics and crashes | PostHog and Sentry | Same |
| Offline | Learning and bot duels work offline | Human duels need a connection |

A lighter route for the first beta test is Supabase Realtime channels with a server function acting as referee. Move to Colyseus when concurrent matches grow.

### 12.2 Data model
- **users** (id, name, avatar)
- **decks** (id, title, category, level, language, version, status)
- **words** (id, text, pos, definition, examples, audio_url, level, language)
- **deck_words** (deck_id, version, word_id, position)
- **user_deck_progress** (user_id, deck_id, version, mastery_pct, state, stars, conquered_at)
- **user_word_state** (user_id, word_id, box, due_at, recalls, lapses)
- **ratings** (user_id, deck_id, rating, matches, wins)
- **matches** (id, deck_id, version, tier, opponent_type, player_a, player_b, scores, started_at, ended_at)
- **match_rounds** (match_id, round, word_id, question_type, answers, timings)
- **reports** (id, match_id, reporter, reason)

`tier` takes the values *squire* or *knight*. `opponent_type` takes *bot*, *human*, or *ghost*. Alpha 1 computes ratings on the device and syncs them. Beta moves rating math to the server and seeds each beta rating from the alpha rating, compressed toward 1000.

### 12.3 Alpha 1 duel engine
- The engine owns rounds, timers, and scoring, and talks to an opponent adapter.
- BotOpponent implements the adapter with a profile (accuracy, response-time curve, rating). The Wordduel prototype in reference/wordduel.html already holds the scoring, timer, and Elo logic to reuse.
- Beta adds RemoteOpponent, which relays server messages through the same adapter, so duel screens stay unchanged.
- Finished matches write to `matches` and `match_rounds`, and missed words write to `user_word_state`.

### 12.4 Beta duel server flow
1. The client requests a Knight match for a deck.
2. The matchmaker pairs players by deck rating or assigns a fallback opponent.
3. The room sends round prompts with a server timestamp.
4. Clients send answers, and the server scores them by server-measured time.
5. The room broadcasts scores each round and sends the final result with rating changes.
6. The match record is saved, and missed words are written to `user_word_state`.

### 12.5 Offline and reliability
Flashcards, mastery checks, and bot duels work offline and sync later. In beta, human duels give a dropped connection a 10-second reconnect window.

## 13. Roadmap

Alpha 1 takes about 13 weeks, and beta starts in week 14. Estimates assume one full-stack developer plus part-time design; a second developer compresses the multiplayer phase. Gates sit at the end of Phase 4 (Alpha 1) and Phase 6 (closed beta).

| Phase | Weeks | Deliverables | Exit gate |
|---|---|---|---|
| 0. Foundations | 1 | Repo, Vite app shell, Supabase project, design tokens, 2 sample decks | App loads a deck on a phone |
| 1. Learning loop | 2 to 4 | Deck library, flashcards, spaced repetition, mastery meter, progress storage | A tester can learn a deck end to end |
| 2. Duel engine with Squire and Knight bots | 5 to 7 | Opponent adapter, BotOpponent profiles, Squire and Knight buttons on the deck screen, scoring, deck ratings, results, mistake review, similar-deck suggestion | Both duel tiers play start to finish on any deck |
| 3. Content and polish | 8 to 10 | 5 decks, doodle art pass, sounds, onboarding, accessibility pass | Every deck editor-reviewed; usability test passes |
| 4. Alpha 1 release | 11 to 13 | Web app live for 30 to 50 invited testers, analytics dashboard, bot tuning, bug fixing | Alpha 1 targets in section 15 met for two weeks |
| 5. Multiplayer foundation | 14 to 19 | Colyseus server, matchmaking pools, ghosts, reconnects, server-side ratings, friend invite links, RemoteOpponent | 20 simultaneous test duels run without desync |
| 6. Closed beta | 20 to 26 | Waitlist and marketing campaign (section 14), analytics, tuning, new decks from feedback | Beta targets in section 15 met for two weeks |
| 7. Public launch | 27 onward | Store listings or web launch, weekly tournaments, creator and teacher decks | Stable pools on the featured decks |

## 14. Beta marketing and player acquisition

Beta marketing has one job: concentrate enough players on a few decks that a Knight duel finds a human opponent within about 10 seconds.

- **Pre-beta:** a waitlist page with deck previews and short doodle-knight clips goes live during Alpha 1. Alpha testers become seed players and referrers.
- **Channels:** language-learning communities (subreddits and Discord servers), study groups and student communities, short-form video of duels and “beat the Knight” challenges, and partnerships with creators and teachers.
- **Sharing mechanics:** friend duel links, shareable result cards, a referral reward (a Knight skin), and a weekly tournament.
- **Traffic concentration:** a daily featured deck and scheduled duel hours (two evening windows) raise the chance of a live opponent. Ghosts and Knight bots cover the gaps.
- **Planning number (approximate):** about 100 daily active players per featured deck keeps evening queues short. Confirm the figure with beta data.
- **Funnel to track:** waitlist signup, install, first duel, and the share of Knight duels played against humans.

## 15. Success metrics

Targets are proposals to tune after the first test cohort.

| Metric | Alpha 1 target | Beta target |
|---|---|---|
| Day 1 and Day 7 retention | 35 percent and 12 percent | 40 percent and 15 percent |
| Full flashcard pass on a deck (testers who start one) | 60 percent | 50 percent of new users |
| First duel within the first session | 70 percent | 70 percent |
| Share of testers who try a Knight duel | 30 percent or more | 50 percent or more |
| Duel completion rate | 90 percent | 90 percent |
| Review completion after a duel | 60 percent | 60 percent |
| Rematch or next-deck rate | 50 percent | 50 percent |
| Tester fun rating (survey, 1 to 5) | 4.0 | 4.0 |
| Median wait for a human opponent | Not applicable | Under 10 seconds on top decks |
| Share of fallback matches | Not applicable | Under 40 percent by end of beta |

## 16. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Computer opponents feel artificial or repetitive | Human-like timing and mistakes, a roster of about 20 characters, and tuning from playtest feedback |
| Testers lose trust if a bot looks like a person | Label the Knight as a computer opponent in Alpha 1 |
| Alpha 1 results reflect bot behavior and may differ from human play | Use Alpha 1 to validate the learning loop and interface; set beta metrics separately |
| Open duels let unprepared players meet strong opponents in beta | Rating-based matching, a deck mastery badge on the match intro, and a Squire suggestion on decks the player has just started |
| Thin human pools in beta | Concentrate marketing on 1 or 2 featured decks, schedule duel hours, and use ghosts and Knight bots |
| Alpha ratings drift away from human skill | Compress alpha ratings toward 1000 when seeding beta ratings |
| Content quality varies across decks | Editor review, in-app word reports, and versioned fixes |
| Licensing issues with word lists | Use openly licensed sources and keep an attribution file |
| Real-time infrastructure cost and complexity in beta | Start with one region, cap room counts, and instrument load early |
| Scope growth toward other languages | Keep a language field in the schema and add languages after English retention proves out |

## 17. Decisions to confirm

1. **Squire and Knight meaning:** this plan reads a Squire as a practice computer opponent and a Knight as the ranked opponent (a computer in Alpha 1, a real player in beta). Confirm or adjust.
2. **Knight labeling in Alpha 1:** the plan shows the Knight as a computer opponent so testers know who they face.
3. **Squire rating effect:** the plan gives Squire duels no rating change.
4. **Five Alpha 1 decks:** confirm the lineup in section 9.1.
5. **Alpha 1 distribution:** decided, a mobile-first PWA hosted on Vercel or Cloudflare Pages.
6. **Team size and timeline:** the roadmap assumes one developer.
7. **Monetization:** options include a free tier with limited decks and a premium pass for all decks, tournaments, and cosmetic knight skins.

## 18. Immediate next steps

1. Confirm the open decisions in section 17.
2. Write the first two decks in full.
3. Sketch the doodle style on three screens (deck screen with both duel buttons, flashcard, duel) to lock the visual direction.
4. Start Phase 0, reusing the scoring, timer, and Elo logic from the Wordduel prototype.
