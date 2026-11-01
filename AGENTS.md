# Vocuknight agent rules

Project: Vocuknight, a mobile-first PWA for English vocabulary (flashcards plus Squire and Knight duels).
Source of truth: docs/PLAN.md. Read it before every task.
Override: PLAN.md section 12 mentions Expo and React Native. This project is a web app (PWA), so use the stack below. Everything else in the plan stays valid.
Reference: reference/wordduel.html holds the working prototype of the scoring, timer, bot, and Elo logic. Port that logic into the app as TypeScript modules.

## Stack
React, Vite, TypeScript, Tailwind CSS, React Router, Zustand, Dexie (IndexedDB), vite-plugin-pwa, Supabase, Vitest, Playwright.

## Mobile-first rules
- Design at 360px width first, then scale up. Max content width 480px on larger screens.
- Touch targets are at least 48px. Answer buttons sit in the bottom half of the screen for thumb reach.
- Use 100dvh and env(safe-area-inset-*) for full-screen layouts.
- No feature depends on hover. All motion respects prefers-reduced-motion.
- Audio starts only after a user tap. Vibration is optional and feature-detected.
- Learning and bot duels work fully offline.

## Architecture rules
- The duel engine is framework-free TypeScript that talks to an Opponent adapter (BotOpponent now, RemoteOpponent in beta).
- Both duels (Squire and Knight) are open on every deck at any time. Mastery never blocks a duel.
- Squire duels never change the rating. Knight duels change the deck rating.
- All colors, fonts, and spacing come from theme tokens (minimalist doodle style).
- Every word record carries a language field.
- Write unit tests for scoring, Elo, bot behavior, and spaced repetition.

## Workflow
- Work on one task at a time and keep changes inside the task scope.
- Run the tests and the build before reporting a task as done.
- Keep API keys in a local .env file and never commit it. Keep .env listed in .gitignore.
- Commit after each finished task with a clear message.
