# Vocuknight agent rules

Project: Vocuknight, a mobile-first PWA for English vocabulary. A match has a timed study window (1, 3, or 5 minutes), then a timed card duel against an opponent. Whoever answers the most cards correctly wins.
Source of truth: docs/PLAN.md. Read it before every task.
Override: this project is a web app (PWA). Use the stack below.
Reference: reference/wordduel.html holds a working prototype. Reuse its Elo logic, bot behavior, and answer UI as TypeScript modules. Its speed-bonus scoring and fixed 10-round format are replaced by the rules below.

## Stack
React, Vite, TypeScript, Tailwind CSS, React Router, Zustand, Dexie (IndexedDB), vite-plugin-pwa, Supabase, Vitest, Playwright.

## Game rules (the match engine implements these)
- There is no flashcard system, spaced repetition, or mastery tracking. Do not build them.
- Flow: choose a deck, press Play, pick a study window (1, 3, or 5 minutes) and an opponent type (Squire or Knight), connect to the opponent, study, countdown, duel, results.
- Match phases: Lobby, Study, Countdown (3 seconds), Duel (60 seconds), Results. Each phase is a state with its own timer.
- Study set size by window: 1 minute = 10 cards, 3 minutes = 20 cards, 5 minutes = 30 cards. Decks smaller than the set size use the whole deck.
- Study view: a scrollable stack of cards. Tapping a card flips it to show the definition and an example. A Ready button ends study early, and the duel starts when both sides are ready or the timer ends. Record which cards were flipped.
- Duel: cards come from the study set, one at a time, in the same order for both sides, and the set reshuffles when it runs out. Each card is a four-option question (word to meaning, or meaning to word).
- Scoring: one point per correct card. A wrong answer scores zero and moves on, with no extra penalty.
- Winner: most correct cards. Ties go to fewer wrong answers, then faster average answer time, then a draw.
- Squire = practice opponent: no rating change, slower pace (5 to 7 seconds per card), accuracy 55 to 70 percent, and the study set favors the player’s earlier missed cards.
- Knight = ranked opponent: changes the deck rating (Elo, one rating per deck), pace 2.5 to 5 seconds per card scaled by rating, accuracy = clamp(0.5 + (rating - 700) / 1200, 0.45, 0.92), and one random study set shared by both sides.
- Alpha 1 opponents are always computers, and the match intro labels them as computers.
- Results screen: winner, both scores, rating change for ranked matches, and the missed cards (word, correct meaning, example, chosen answer, and a Not studied tag for cards never flipped). Missed cards save to the deck’s missed list.

## Mobile-first rules
- Design at 360px width first, then scale up. Max content width 480px on larger screens.
- Touch targets are at least 48px. Answer buttons sit in the bottom half of the screen for thumb reach.
- Use 100dvh and env(safe-area-inset-*) for full-screen layouts.
- No feature depends on hover. All motion respects prefers-reduced-motion.
- Audio starts only after a user tap. Vibration is optional and feature-detected.
- The whole game works offline in Alpha 1.

## Architecture rules
- The match engine is framework-free TypeScript that talks to an Opponent adapter (BotOpponent now, RemoteOpponent in beta). Screens consume engine state and never contain match rules.
- All colors, fonts, and spacing come from theme tokens (minimalist doodle style).
- Every word record carries a language field.
- Write unit tests for study set selection, scoring and tie-breaks, Elo, bot behavior, and the phase state machine.

## Workflow
- Work on one task at a time and keep changes inside the task scope.
- Run the tests and the build before reporting a task as done.
- Keep API keys in a local .env file and never commit it. Keep .env listed in .gitignore.
- Commit after each finished task with a clear message.
