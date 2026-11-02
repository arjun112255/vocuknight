import { Deck, WordCard } from '../engine/types';

// 1. Everyday Essentials (Daily life · A2 · 30 words)
const everydayWords: WordCard[] = [
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

// 2. Work & Business (Career · B1 · 30 words)
const businessWords: WordCard[] = [
  { id: 'lucrative', word: 'lucrative', definition: 'Producing a great deal of profit.', partOfSpeech: 'adjective', example: 'The merger proved to be a highly lucrative venture for both firms.', language: 'en' },
  { id: 'negotiate', word: 'negotiate', definition: 'Try to reach an agreement through discussion.', partOfSpeech: 'verb', example: 'They managed to negotiate a lower price for the office lease.', language: 'en' },
  { id: 'allocate', word: 'allocate', definition: 'Distribute resources for a specific purpose.', partOfSpeech: 'verb', example: 'The director will allocate budget funds to research and development.', language: 'en' },
  { id: 'audit', word: 'audit', definition: 'An official inspection of an organization\'s accounts.', partOfSpeech: 'noun', example: 'The annual financial audit revealed no accounting discrepancies.', language: 'en' },
  { id: 'venture', word: 'venture', definition: 'A risky or daring journey or business undertaking.', partOfSpeech: 'noun', example: 'Their new tech venture secured seed funding in the first quarter.', language: 'en' },
  { id: 'asset', word: 'asset', definition: 'A useful or valuable thing, person, or quality.', partOfSpeech: 'noun', example: 'Her fluency in three languages was a valuable asset to the company.', language: 'en' },
  { id: 'liability', word: 'liability', definition: 'A debt or financial obligation.', partOfSpeech: 'noun', example: 'The unpaid loans were recorded as a serious liability on the ledger.', language: 'en' },
  { id: 'leverage', word: 'leverage', definition: 'Use something to maximum advantage.', partOfSpeech: 'verb', example: 'The startup will leverage cloud technology to reduce infrastructure costs.', language: 'en' },
  { id: 'diversify', word: 'diversify', definition: 'Enlarge or vary the range of products or field of operation.', partOfSpeech: 'verb', example: 'Investors are advised to diversify their portfolios across sectors.', language: 'en' },
  { id: 'dividend', word: 'dividend', definition: 'A sum of money paid regularly by a company to shareholders.', partOfSpeech: 'noun', example: 'The board approved a quarterly dividend of fifty cents per share.', language: 'en' },
  { id: 'deficit', word: 'deficit', definition: 'The amount by which expenditures exceed income.', partOfSpeech: 'noun', example: 'Spending cuts were introduced to reduce the national budget deficit.', language: 'en' },
  { id: 'benchmark', word: 'benchmark', definition: 'A standard or point of reference for comparison.', partOfSpeech: 'noun', example: 'This product set the industry benchmark for speed and battery life.', language: 'en' },
  { id: 'compliance', word: 'compliance', definition: 'The action of complying with a wish, rule, or law.', partOfSpeech: 'noun', example: 'All operations must ensure strict compliance with safety regulations.', language: 'en' },
  { id: 'delegate', word: 'delegate', definition: 'Entrust a task or responsibility to another person.', partOfSpeech: 'verb', example: 'A good manager knows when to delegate complex duties to team leads.', language: 'en' },
  { id: 'optimize', word: 'optimize', definition: 'Make the best or most effective use of a situation or resource.', partOfSpeech: 'verb', example: 'We restructured the supply chain to optimize shipping times.', language: 'en' },
  { id: 'outsource', word: 'outsource', definition: 'Obtain goods or a service from an outside supplier.', partOfSpeech: 'verb', example: 'Many corporations outsource customer support to specialized agencies.', language: 'en' },
  { id: 'consolidate', word: 'consolidate', definition: 'Combine a number of things into a single coherent whole.', partOfSpeech: 'verb', example: 'The company plans to consolidate its regional offices into one headquarters.', language: 'en' },
  { id: 'stagnation', word: 'stagnation', definition: 'Lack of activity, growth, or development.', partOfSpeech: 'noun', example: 'Without innovation, the industry faced years of economic stagnation.', language: 'en' },
  { id: 'quarterly', word: 'quarterly', definition: 'Done, produced, or occurring once every three months.', partOfSpeech: 'adjective', example: 'The team prepared their quarterly earnings report for the executives.', language: 'en' },
  { id: 'stakeholder', word: 'stakeholder', definition: 'A person with an interest or concern in a business.', partOfSpeech: 'noun', example: 'Every major stakeholder attended the public consultation session.', language: 'en' },
  { id: 'syndicate', word: 'syndicate', definition: 'A group of individuals or organizations combined to promote a common interest.', partOfSpeech: 'noun', example: 'An investment syndicate provided funding for the commercial real estate project.', language: 'en' },
  { id: 'insolvent', word: 'insolvent', definition: 'Unable to pay debts owed.', partOfSpeech: 'adjective', example: 'The retailer became insolvent after months of declining foot traffic.', language: 'en' },
  { id: 'turnover', word: 'turnover', definition: 'The amount of money taken in over a given period.', partOfSpeech: 'noun', example: 'Annual turnover grew by twenty percent after opening the online storefront.', language: 'en' },
  { id: 'revenue', word: 'revenue', definition: 'Income generated from normal business operations.', partOfSpeech: 'noun', example: 'Advertising revenue climbed sharply after the app went viral.', language: 'en' },
  { id: 'milestone', word: 'milestone', definition: 'A significant stage or event in the development of something.', partOfSpeech: 'noun', example: 'Reaching one million active users was a massive milestone for the team.', language: 'en' },
  { id: 'appraisal', word: 'appraisal', definition: 'An act of assessing something or someone.', partOfSpeech: 'noun', example: 'She received a stellar annual performance appraisal from her supervisor.', language: 'en' },
  { id: 'incentive', word: 'incentive', definition: 'A thing that motivates or encourages someone to do something.', partOfSpeech: 'noun', example: 'Sales bonuses served as an effective incentive for the sales team.', language: 'en' },
  { id: 'breach', word: 'breach', definition: 'An act of breaking or failing to observe a law or agreement.', partOfSpeech: 'noun', example: 'Leaking the classified report was considered a serious breach of contract.', language: 'en' },
  { id: 'consensus', word: 'consensus', definition: 'A general agreement among members of a group.', partOfSpeech: 'noun', example: 'The committee finally reached a consensus after hours of debate.', language: 'en' },
  { id: 'feasibility', word: 'feasibility', definition: 'The state or degree of being easily or conveniently done.', partOfSpeech: 'noun', example: 'Engineers conducted a feasibility study before breaking ground on the bridge.', language: 'en' },
];

// 3. Feelings & Character (Emotions and personality · B1 · 30 words)
const characterWords: WordCard[] = [
  { id: 'empathetic', word: 'empathetic', definition: 'Showing an ability to understand and share the feelings of another.', partOfSpeech: 'adjective', example: 'An empathetic listener can make anyone feel understood and valued.', language: 'en' },
  { id: 'eccentric', word: 'eccentric', definition: 'Unconventional and slightly strange.', partOfSpeech: 'adjective', example: 'The eccentric inventor lived in a house filled with clocks and gears.', language: 'en' },
  { id: 'melancholic', word: 'melancholic', definition: 'Feeling or expressing pensive sadness.', partOfSpeech: 'adjective', example: 'The violin solo had a melancholic melody that touched every listener.', language: 'en' },
  { id: 'capricious', word: 'capricious', definition: 'Given to sudden and unaccountable changes of mood or behavior.', partOfSpeech: 'adjective', example: 'The weather in the mountains can be capricious and turn stormy quickly.', language: 'en' },
  { id: 'stoic', word: 'stoic', definition: 'Enduring pain or hardship without showing feelings or complaining.', partOfSpeech: 'adjective', example: 'He remained stoic even when hearing the devastating news.', language: 'en' },
  { id: 'vivacious', word: 'vivacious', definition: 'Attractively lively and animated.', partOfSpeech: 'adjective', example: 'Her vivacious laughter lit up the entire banquet hall.', language: 'en' },
  { id: 'petulant', word: 'petulant', definition: 'Childishly sulky or bad-tempered.', partOfSpeech: 'adjective', example: 'When he didn\'t get his way, he responded with petulant silence.', language: 'en' },
  { id: 'tranquil', word: 'tranquil', definition: 'Free from disturbance; calm and peaceful.', partOfSpeech: 'adjective', example: 'The tranquil lake mirrored the surrounding snow-capped pine trees.', language: 'en' },
  { id: 'arrogant', word: 'arrogant', definition: 'Having an exaggerated sense of one\'s own importance or abilities.', partOfSpeech: 'adjective', example: 'His arrogant attitude alienated many of his fellow knights.', language: 'en' },
  { id: 'timid', word: 'timid', definition: 'Showing a lack of courage or confidence; easily frightened.', partOfSpeech: 'adjective', example: 'The timid squire hesitated before stepping into the tournament arena.', language: 'en' },
  { id: 'altruistic', word: 'altruistic', definition: 'Showing a disinterested and selfless concern for the well-being of others.', partOfSpeech: 'adjective', example: 'Her altruistic deeds inspired an entire community to help the needy.', language: 'en' },
  { id: 'cynical', word: 'cynical', definition: 'Believing that people are motivated purely by self-interest.', partOfSpeech: 'adjective', example: 'He was too cynical to believe that the peace treaty would last.', language: 'en' },
  { id: 'irritable', word: 'irritable', definition: 'Having or showing a tendency to be easily annoyed.', partOfSpeech: 'adjective', example: 'Lack of sleep made the guard irritable during the morning watch.', language: 'en' },
  { id: 'complacent', word: 'complacent', definition: 'Showing smug or uncritical satisfaction with oneself.', partOfSpeech: 'adjective', example: 'The reigning champion became complacent and neglected daily training.', language: 'en' },
  { id: 'envious', word: 'envious', definition: 'Feeling or showing envy.', partOfSpeech: 'adjective', example: 'He grew envious of his rival\'s shining armor and swift steed.', language: 'en' },
  { id: 'sullen', word: 'sullen', definition: 'Bad-tempered and sulky; gloomy.', partOfSpeech: 'adjective', example: 'She sat in sullen silence after losing the archery match.', language: 'en' },
  { id: 'defiant', word: 'defiant', definition: 'Showing open resistance or bold disobedience.', partOfSpeech: 'adjective', example: 'The defiant prisoner refused to answer the inquisitor\'s demands.', language: 'en' },
  { id: 'humble', word: 'humble', definition: 'Having or showing a modest or low estimate of one\'s own importance.', partOfSpeech: 'adjective', example: 'Despite winning the duel, the champion remained humble and courteous.', language: 'en' },
  { id: 'vindictive', word: 'vindictive', definition: 'Having or showing a strong or unreasoning desire for revenge.', partOfSpeech: 'adjective', example: 'His vindictive remarks proved he had not forgiven the past slight.', language: 'en' },
  { id: 'serene', word: 'serene', definition: 'Calm, peaceful, and untroubled.', partOfSpeech: 'adjective', example: 'Her face was serene as she watched the morning mist clear over the meadow.', language: 'en' },
  { id: 'courageous', word: 'courageous', definition: 'Not deterred by danger or pain; brave.', partOfSpeech: 'adjective', example: 'The courageous knight charged forward to defend the castle gate.', language: 'en' },
  { id: 'apathetic', word: 'apathetic', definition: 'Showing or feeling no interest, enthusiasm, or concern.', partOfSpeech: 'adjective', example: 'Citizens remained apathetic about the upcoming local council vote.', language: 'en' },
  { id: 'inquisitive', word: 'inquisitive', definition: 'Curious or inquiring.', partOfSpeech: 'adjective', example: 'The inquisitive apprentice questioned every herbal formula in the grimoire.', language: 'en' },
  { id: 'compassionate', word: 'compassionate', definition: 'Feeling or showing sympathy and concern for others.', partOfSpeech: 'adjective', example: 'The compassionate healer tended to the wounded on both sides.', language: 'en' },
  { id: 'impetuous', word: 'impetuous', definition: 'Acting or done quickly and without thought or care.', partOfSpeech: 'adjective', example: 'His impetuous charge left his flank exposed to enemy archers.', language: 'en' },
  { id: 'fastidious', word: 'fastidious', definition: 'Very attentive to and concerned about accuracy and detail.', partOfSpeech: 'adjective', example: 'He was fastidious about polishing his shield until it shone like glass.', language: 'en' },
  { id: 'affable', word: 'affable', definition: 'Friendly, good-natured, or easy to talk to.', partOfSpeech: 'adjective', example: 'The tavern keeper was an affable companion who welcomed every weary traveler.', language: 'en' },
  { id: 'morose', word: 'morose', definition: 'Sullen and ill-tempered.', partOfSpeech: 'adjective', example: 'He retreated into a morose mood whenever the autumn rains fell.', language: 'en' },
  { id: 'undaunted', word: 'undaunted', definition: 'Not intimidated or discouraged by difficulty or danger.', partOfSpeech: 'adjective', example: 'Undaunted by the blizzard, the scouts pressed deeper into the pass.', language: 'en' },
  { id: 'boisterous', word: 'boisterous', definition: 'Noisy, energetic, and rowdy.', partOfSpeech: 'adjective', example: 'The feast grew boisterous as songs echoed from the great hall.', language: 'en' },
];

// 4. Academic Starters (Study · B2 · 30 words)
const academicWords: WordCard[] = [
  { id: 'hypothesis', word: 'hypothesis', definition: 'A proposed explanation made as a starting point for further investigation.', partOfSpeech: 'noun', example: 'The researcher formulated a hypothesis to test the effects of gravity on plant growth.', language: 'en' },
  { id: 'empirical', word: 'empirical', definition: 'Based on, concerned with, or verifiable by observation or experience.', partOfSpeech: 'adjective', example: 'The scientific paper relied solely on empirical data collected over five years.', language: 'en' },
  { id: 'methodology', word: 'methodology', definition: 'A system of methods used in a particular area of study or activity.', partOfSpeech: 'noun', example: 'The thesis clearly outlined the methodology used to analyze the historical manuscripts.', language: 'en' },
  { id: 'paradigm', word: 'paradigm', definition: 'A typical example or pattern of something; a distinct model.', partOfSpeech: 'noun', example: 'Quantum physics introduced a revolutionary paradigm to our understanding of light.', language: 'en' },
  { id: 'synthesize', word: 'synthesize', definition: 'Combine a number of things into a coherent whole.', partOfSpeech: 'verb', example: 'Students must synthesize arguments from three scholarly essays.', language: 'en' },
  { id: 'corroborate', word: 'corroborate', definition: 'Confirm or give support to a statement, theory, or finding.', partOfSpeech: 'verb', example: 'Fresh archaeological discoveries corroborate the ancient chronicler\'s account.', language: 'en' },
  { id: 'postulate', word: 'postulate', definition: 'Suggest or assume the existence, fact, or truth of something as a basis for reasoning.', partOfSpeech: 'verb', example: 'Astronomers postulate that dark matter comprises most of the universe\'s mass.', language: 'en' },
  { id: 'extrapolate', word: 'extrapolate', definition: 'Extend the application of a method or conclusion to an unknown situation.', partOfSpeech: 'verb', example: 'We can extrapolate future population figures from the current census data.', language: 'en' },
  { id: 'dichotomy', word: 'dichotomy', definition: 'A division or contrast between two things that are represented as entirely different.', partOfSpeech: 'noun', example: 'The lecture explored the false dichotomy between science and philosophy.', language: 'en' },
  { id: 'qualitative', word: 'qualitative', definition: 'Relating to, measuring, or measured by the quality of something rather than quantity.', partOfSpeech: 'adjective', example: 'The study gathered qualitative feedback through in-depth participant interviews.', language: 'en' },
  { id: 'quantitative', word: 'quantitative', definition: 'Relating to, measuring, or measured by the quantity of something rather than quality.', partOfSpeech: 'adjective', example: 'Quantitative analysis revealed a twelve percent increase in test scores.', language: 'en' },
  { id: 'annotate', word: 'annotate', definition: 'Add notes to a text giving explanation or comment.', partOfSpeech: 'verb', example: 'Scholars spent months trying to annotate the rare medieval codex.', language: 'en' },
  { id: 'precedent', word: 'precedent', definition: 'An earlier event or action that serves as an example or guide.', partOfSpeech: 'noun', example: 'The judge\'s ruling established an important legal precedent for privacy rights.', language: 'en' },
  { id: 'comprehensive', word: 'comprehensive', definition: 'Complete; including all or nearly all elements or aspects of something.', partOfSpeech: 'adjective', example: 'The museum catalog offers a comprehensive survey of Renaissance armor.', language: 'en' },
  { id: 'inference', word: 'inference', definition: 'A conclusion reached on the basis of evidence and reasoning.', partOfSpeech: 'noun', example: 'Detectives drew a logical inference from the footprints left near the gate.', language: 'en' },
  { id: 'rigorous', word: 'rigorous', definition: 'Extremely thorough, exhaustive, or accurate.', partOfSpeech: 'adjective', example: 'Every pharmaceutical product undergoes rigorous testing before approval.', language: 'en' },
  { id: 'discourse', word: 'discourse', definition: 'Written or spoken communication or debate.', partOfSpeech: 'noun', example: 'Civil discourse is vital for healthy democratic deliberation.', language: 'en' },
  { id: 'treatise', word: 'treatise', definition: 'A written work dealing formally and systematically with a subject.', partOfSpeech: 'noun', example: 'The philosopher published a three-volume treatise on human ethics.', language: 'en' },
  { id: 'assertion', word: 'assertion', definition: 'A confident and forceful statement of fact or belief.', partOfSpeech: 'noun', example: 'Her assertion that the artifact was authentic was backed by carbon dating.', language: 'en' },
  { id: 'caveat', word: 'caveat', definition: 'A warning or proviso of specific stipulations or conditions.', partOfSpeech: 'noun', example: 'The report approved the plan with the caveat that safety measures be upgraded.', language: 'en' },
  { id: 'plausible', word: 'plausible', definition: 'Seeming reasonable or probable.', partOfSpeech: 'adjective', example: 'The scientist offered a plausible mechanism for how the mineral formed.', language: 'en' },
  { id: 'anomaly', word: 'anomaly', definition: 'Something that deviates from what is standard, normal, or expected.', partOfSpeech: 'noun', example: 'The sudden spike in sensor temperature was recorded as a thermal anomaly.', language: 'en' },
  { id: 'coalesce', word: 'coalesce', definition: 'Come together to form one mass or whole.', partOfSpeech: 'verb', example: 'The individual factions decided to coalesce into a single unified front.', language: 'en' },
  { id: 'refute', word: 'refute', definition: 'Prove a statement or theory to be wrong or false.', partOfSpeech: 'verb', example: 'She presented documented records to refute the opponent\'s claim.', language: 'en' },
  { id: 'disseminate', word: 'disseminate', definition: 'Spread or disperse widely.', partOfSpeech: 'verb', example: 'The library made plans to disseminate digitized copies of rare books.', language: 'en' },
  { id: 'juxtapose', word: 'juxtapose', definition: 'Place or deal with close together for contrasting effect.', partOfSpeech: 'verb', example: 'The exhibition will juxtapose ancient swords alongside modern ceremonial sabers.', language: 'en' },
  { id: 'salient', word: 'salient', definition: 'Most noticeable or important.', partOfSpeech: 'adjective', example: 'He summarized the salient points of the treaty in a single page.', language: 'en' },
  { id: 'elucidate', word: 'elucidate', definition: 'Make something clear; explain.', partOfSpeech: 'verb', example: 'The professor used diagrams to elucidate the complex molecular process.', language: 'en' },
  { id: 'substantiate', word: 'substantiate', definition: 'Provide evidence to support or prove the truth of.', partOfSpeech: 'verb', example: 'They lacked sufficient archaeological evidence to substantiate the claim.', language: 'en' },
  { id: 'epistemology', word: 'epistemology', definition: 'The theory of knowledge, especially with regard to its methods and validity.', partOfSpeech: 'noun', example: 'The introductory philosophy class explored fundamental questions of epistemology.', language: 'en' },
];

// 5. Travel & Places (Travel · A2-B1 · 20 words)
const travelWords: WordCard[] = [
  { id: 'itinerary', word: 'itinerary', definition: 'A planned route or journey.', partOfSpeech: 'noun', example: 'Our two-week itinerary includes stops in Rome, Florence, and Venice.', language: 'en' },
  { id: 'voyage', word: 'voyage', definition: 'A long journey involving travel by sea or in space.', partOfSpeech: 'noun', example: 'The merchant vessel embarked on a perilous voyage across the ocean.', language: 'en' },
  { id: 'embark', word: 'embark', definition: 'Go on board a ship, aircraft, or other vehicle.', partOfSpeech: 'verb', example: 'Passengers were instructed to embark through the central gangway.', language: 'en' },
  { id: 'transit', word: 'transit', definition: 'The carrying of people or things from one place to another.', partOfSpeech: 'noun', example: 'The goods were damaged while in transit between the warehouse and the dock.', language: 'en' },
  { id: 'scenic', word: 'scenic', definition: 'Providing or relating to views of impressive or beautiful natural scenery.', partOfSpeech: 'adjective', example: 'They took the scenic coastal highway instead of the inland expressway.', language: 'en' },
  { id: 'destination', word: 'destination', definition: 'The place to which someone or something is going or being sent.', partOfSpeech: 'noun', example: 'After twelve hours on horseback, the riders finally reached their destination.', language: 'en' },
  { id: 'excursion', word: 'excursion', definition: 'A short journey or trip, especially one taken as a leisure activity.', partOfSpeech: 'noun', example: 'The school organized a weekend excursion to the medieval fortress.', language: 'en' },
  { id: 'hospitality', word: 'hospitality', definition: 'The friendly and generous reception and entertainment of guests or visitors.', partOfSpeech: 'noun', example: 'The mountain village is renowned for its warm hospitality and hearty stews.', language: 'en' },
  { id: 'heritage', word: 'heritage', definition: 'Valued objects and qualities passed down from previous generations.', partOfSpeech: 'noun', example: 'The historic abbey is protected as a UNESCO world heritage site.', language: 'en' },
  { id: 'desolate', word: 'desolate', definition: 'Deserted of people and in a state of bleak and dismal emptiness.', partOfSpeech: 'adjective', example: 'The rocky tundra appeared desolate under the cold winter sky.', language: 'en' },
  { id: 'bustling', word: 'bustling', definition: 'Full of energetic and noisy activity.', partOfSpeech: 'adjective', example: 'The bustling marketplace smelled of roasted spices and freshly baked bread.', language: 'en' },
  { id: 'picturesque', word: 'picturesque', definition: 'Visually attractive, especially in a quaint or pretty style.', partOfSpeech: 'adjective', example: 'The picturesque harbor was filled with brightly painted fishing boats.', language: 'en' },
  { id: 'navigate', word: 'navigate', definition: 'Plan and direct the course of a ship, aircraft, or other form of transport.', partOfSpeech: 'verb', example: 'Ancient sailors used constellations to navigate across open water.', language: 'en' },
  { id: 'nomad', word: 'nomad', definition: 'A member of a people having no permanent abode, who travel from place to place.', partOfSpeech: 'noun', example: 'The nomad guided his herd across the sprawling high plains.', language: 'en' },
  { id: 'lodging', word: 'lodging', definition: 'Temporary accommodation.', partOfSpeech: 'noun', example: 'The innkeeper offered comfortable lodging and a warm hearth for the night.', language: 'en' },
  { id: 'detour', word: 'detour', definition: 'A long or roundabout course taken to avoid something.', partOfSpeech: 'noun', example: 'A fallen oak forced travelers to take a scenic detour through the forest.', language: 'en' },
  { id: 'terrain', word: 'terrain', definition: 'A stretch of land, especially with regard to its physical features.', partOfSpeech: 'noun', example: 'The steep, rocky terrain made carriage travel impossible.', language: 'en' },
  { id: 'panoramic', word: 'panoramic', definition: 'With a view of an area in all directions.', partOfSpeech: 'adjective', example: 'The watchtower offered a panoramic view of the entire valley.', language: 'en' },
  { id: 'expedition', word: 'expedition', definition: 'A journey undertaken by a group of people with a particular purpose.', partOfSpeech: 'noun', example: 'The royal society funded an expedition to map the unexplored river.', language: 'en' },
  { id: 'wayfarer', word: 'wayfarer', definition: 'A person who travels on foot.', partOfSpeech: 'noun', example: 'The humble wayfarer stopped at the monastery fountain to quench his thirst.', language: 'en' },
];

export const SAMPLE_DECK: Deck = {
  id: 'everyday-essentials',
  title: 'Everyday Essentials',
  category: 'Daily life',
  level: 'A2',
  language: 'en',
  words: everydayWords,
};

export const WORK_DECK: Deck = {
  id: 'work-and-business',
  title: 'Work and Business',
  category: 'Career',
  level: 'B1',
  language: 'en',
  words: businessWords,
};

export const FEELINGS_DECK: Deck = {
  id: 'feelings-and-character',
  title: 'Feelings and Character',
  category: 'Personality',
  level: 'B1',
  language: 'en',
  words: characterWords,
};

export const ACADEMIC_DECK: Deck = {
  id: 'academic-starters',
  title: 'Academic Starters',
  category: 'Study',
  level: 'B2',
  language: 'en',
  words: academicWords,
};

export const TRAVEL_DECK: Deck = {
  id: 'travel-and-places',
  title: 'Travel and Places',
  category: 'Travel',
  level: 'A2 to B1',
  language: 'en',
  words: travelWords,
};

export const CURATED_DECKS: Deck[] = [
  SAMPLE_DECK,
  WORK_DECK,
  FEELINGS_DECK,
  ACADEMIC_DECK,
  TRAVEL_DECK,
];

// Combine all decks into a grand pool
const allCombinedWords: WordCard[] = [
  ...everydayWords,
  ...businessWords,
  ...characterWords,
  ...academicWords,
  ...travelWords,
];

export const RANDOM_DECK: Deck = {
  id: 'random-deck',
  title: 'Random Deck (All)',
  category: 'Grand Arena',
  level: 'All Levels',
  language: 'en',
  words: allCombinedWords,
};

const DECKS: Record<string, Deck> = {
  [SAMPLE_DECK.id]: SAMPLE_DECK,
  [WORK_DECK.id]: WORK_DECK,
  [FEELINGS_DECK.id]: FEELINGS_DECK,
  [ACADEMIC_DECK.id]: ACADEMIC_DECK,
  [TRAVEL_DECK.id]: TRAVEL_DECK,
  [RANDOM_DECK.id]: RANDOM_DECK,
};

/** Look up a deck by its ID. */
export function getDeckById(id: string): Deck | undefined {
  return DECKS[id];
}

/** Get all available individual decks. */
export function getAllCuratedDecks(): Deck[] {
  return CURATED_DECKS;
}
