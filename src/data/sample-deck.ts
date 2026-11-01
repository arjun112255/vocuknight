import { Deck, WordCard } from '../engine/types';

const words: WordCard[] = [
  { id: 'ephemeral', word: 'ephemeral', definition: 'Lasting a very short time.', partOfSpeech: 'adjective', example: 'The ephemeral beauty of cherry blossoms draws crowds every spring.', language: 'en' },
  { id: 'benevolent', word: 'benevolent', definition: 'Kind and generous.', partOfSpeech: 'adjective', example: 'The benevolent donor funded scholarships for dozens of students.', language: 'en' },
  { id: 'candid', word: 'candid', definition: 'Honest and straightforward.', partOfSpeech: 'adjective', example: 'Her candid feedback helped the team improve the product quickly.', language: 'en' },
  { id: 'meticulous', word: 'meticulous', definition: 'Showing great attention to detail.', partOfSpeech: 'adjective', example: 'The meticulous editor caught every typo in the manuscript.', language: 'en' },
  { id: 'ubiquitous', word: 'ubiquitous', definition: 'Found everywhere.', partOfSpeech: 'adjective', example: 'Smartphones have become ubiquitous in modern daily life.', language: 'en' },
  { id: 'pragmatic', word: 'pragmatic', definition: 'Dealing with things in a practical way.', partOfSpeech: 'adjective', example: 'She took a pragmatic approach to solving the budget crisis.', language: 'en' },
  { id: 'eloquent', word: 'eloquent', definition: 'Fluent and persuasive in speech.', partOfSpeech: 'adjective', example: 'The senator delivered an eloquent speech that moved the audience.', language: 'en' },
  { id: 'ambiguous', word: 'ambiguous', definition: 'Open to more than one meaning.', partOfSpeech: 'adjective', example: 'The ambiguous instructions left everyone confused about the next step.', language: 'en' },
  { id: 'resilient', word: 'resilient', definition: 'Able to recover quickly from difficulty.', partOfSpeech: 'adjective', example: 'After the setback, the resilient team rebuilt the project from scratch.', language: 'en' },
  { id: 'frugal', word: 'frugal', definition: 'Careful about spending money.', partOfSpeech: 'adjective', example: 'His frugal habits allowed him to retire early.', language: 'en' },
  { id: 'lucid', word: 'lucid', definition: 'Clearly expressed and easy to understand.', partOfSpeech: 'adjective', example: 'The professor gave a lucid explanation of quantum mechanics.', language: 'en' },
  { id: 'obsolete', word: 'obsolete', definition: 'No longer used; out of date.', partOfSpeech: 'adjective', example: 'Floppy disks became obsolete once USB drives arrived.', language: 'en' },
  { id: 'scrutinize', word: 'scrutinize', definition: 'Examine closely and carefully.', partOfSpeech: 'verb', example: 'The auditor will scrutinize every transaction from the past year.', language: 'en' },
  { id: 'tenacious', word: 'tenacious', definition: 'Holding firmly to a goal; persistent.', partOfSpeech: 'adjective', example: 'The tenacious climber reached the summit despite the storm.', language: 'en' },
  { id: 'verbose', word: 'verbose', definition: 'Using more words than needed.', partOfSpeech: 'adjective', example: 'His verbose emails often buried the key point in paragraphs of detail.', language: 'en' },
  { id: 'zealous', word: 'zealous', definition: 'Full of energy for a cause.', partOfSpeech: 'adjective', example: 'The zealous volunteer worked late into the night to finish the project.', language: 'en' },
  { id: 'aloof', word: 'aloof', definition: 'Distant and unfriendly.', partOfSpeech: 'adjective', example: 'She seemed aloof at first, but was actually quite shy.', language: 'en' },
  { id: 'arduous', word: 'arduous', definition: 'Requiring great effort.', partOfSpeech: 'adjective', example: 'The arduous hike took eight hours through rough terrain.', language: 'en' },
  { id: 'bolster', word: 'bolster', definition: 'Support or strengthen.', partOfSpeech: 'verb', example: 'New evidence helped bolster the defence\'s case in court.', language: 'en' },
  { id: 'copious', word: 'copious', definition: 'Abundant in quantity.', partOfSpeech: 'adjective', example: 'She took copious notes during every lecture.', language: 'en' },
  { id: 'diligent', word: 'diligent', definition: 'Careful and hard-working.', partOfSpeech: 'adjective', example: 'The diligent student reviewed her notes every evening.', language: 'en' },
  { id: 'elusive', word: 'elusive', definition: 'Difficult to find or catch.', partOfSpeech: 'adjective', example: 'The elusive fox evaded the hunters for weeks.', language: 'en' },
  { id: 'fervent', word: 'fervent', definition: 'Showing intense feeling.', partOfSpeech: 'adjective', example: 'He made a fervent plea for peace at the conference.', language: 'en' },
  { id: 'gregarious', word: 'gregarious', definition: 'Fond of company; sociable.', partOfSpeech: 'adjective', example: 'The gregarious host made sure every guest felt welcome.', language: 'en' },
  { id: 'hinder', word: 'hinder', definition: 'Make it difficult for something to happen.', partOfSpeech: 'verb', example: 'Heavy traffic will hinder your commute during rush hour.', language: 'en' },
  { id: 'impartial', word: 'impartial', definition: 'Treating all sides equally.', partOfSpeech: 'adjective', example: 'A good judge must remain impartial throughout the trial.', language: 'en' },
  { id: 'jovial', word: 'jovial', definition: 'Cheerful and friendly.', partOfSpeech: 'adjective', example: 'The jovial uncle always had a joke ready at family dinners.', language: 'en' },
  { id: 'lethargic', word: 'lethargic', definition: 'Sluggish and without energy.', partOfSpeech: 'adjective', example: 'The hot afternoon made everyone feel lethargic and sleepy.', language: 'en' },
  { id: 'mundane', word: 'mundane', definition: 'Dull and ordinary.', partOfSpeech: 'adjective', example: 'She longed for adventure to escape her mundane routine.', language: 'en' },
  { id: 'nostalgia', word: 'nostalgia', definition: 'Sentimental longing for the past.', partOfSpeech: 'noun', example: 'The old photographs filled her with nostalgia for her childhood.', language: 'en' },
];

export const SAMPLE_DECK: Deck = {
  id: 'everyday-essentials',
  title: 'Everyday Essentials',
  category: 'Daily life',
  level: 'A2',
  language: 'en',
  words,
};

const DECKS: Record<string, Deck> = {
  [SAMPLE_DECK.id]: SAMPLE_DECK,
};

/** Look up a deck by its ID. */
export function getDeckById(id: string): Deck | undefined {
  return DECKS[id];
}
