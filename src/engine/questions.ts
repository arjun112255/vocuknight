import { Deck, DuelQuestion, QuestionType, WordCard } from './types';
import { shuffle } from './study-set';

/**
 * Selects 3 distractor cards from the deck for a given target card,
 * prioritizing matching part of speech and similar word length.
 */
export function selectDistractors(target: WordCard, deckWords: readonly WordCard[]): WordCard[] {
  const candidates = deckWords.filter((w) => w.id !== target.id);

  if (candidates.length <= 3) {
    return [...candidates];
  }

  // Score each candidate based on part-of-speech match and length similarity.
  // Jitter allows equal-tier candidates to shuffle randomly.
  const scored = candidates.map((cand) => {
    let score = 0;
    if (cand.partOfSpeech.toLowerCase() === target.partOfSpeech.toLowerCase()) {
      score += 20;
    }
    const lenDiff = Math.abs(cand.word.length - target.word.length);
    score += Math.max(0, 10 - lenDiff);

    return { cand, totalScore: score + Math.random() };
  });

  scored.sort((a, b) => b.totalScore - a.totalScore);

  return scored.slice(0, 3).map((s) => s.cand);
}

/**
 * Creates a single 4-option DuelQuestion for a target card.
 */
export function createDuelQuestion(
  target: WordCard,
  deckWords: readonly WordCard[],
  type: QuestionType = 'word_to_meaning',
): DuelQuestion {
  const distractors = selectDistractors(target, deckWords);
  const isWordToMeaning = type === 'word_to_meaning';

  const prompt = isWordToMeaning ? target.word : target.definition;
  const correctChoice = isWordToMeaning ? target.definition : target.word;

  // Build 4 option candidates
  const optionCards = shuffle([target, ...distractors]);
  const options = optionCards.map((c) => (isWordToMeaning ? c.definition : c.word));
  const correctIndex = options.indexOf(correctChoice);

  return {
    card: target,
    type,
    prompt,
    options,
    correctIndex,
    distractors,
  };
}

/**
 * Generator that yields questions from the study set in an endless,
 * reshuffling stream with identical card order for both sides.
 */
export class DuelQuestionStream {
  private studySet: WordCard[];
  private deck: Deck;
  private cachedQuestions: DuelQuestion[] = [];
  private order: WordCard[] = [];

  constructor(studySet: WordCard[], deck: Deck) {
    this.studySet = [...studySet];
    this.deck = deck;
  }

  /**
   * Returns the question for a given card index.
   * If not yet generated, generates it and caches it so both player
   * and opponent retrieve the identical question for the same index.
   */
  getQuestion(index: number): DuelQuestion {
    while (index >= this.cachedQuestions.length) {
      const nextIdx = this.cachedQuestions.length;
      // When current cycle exhausted, reshuffle studySet and continue
      const cycleIndex = nextIdx % this.studySet.length;
      if (cycleIndex === 0) {
        this.order.push(...shuffle(this.studySet));
      }

      const card = this.order[nextIdx];
      const type: QuestionType = nextIdx % 2 === 0 ? 'word_to_meaning' : 'meaning_to_word';
      const question = createDuelQuestion(card, this.deck.words, type);
      this.cachedQuestions.push(question);
    }

    return this.cachedQuestions[index];
  }
}
