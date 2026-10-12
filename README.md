# Mrs Knox Teaches Word Game Generator

Prototype browser-based generator for the ETAQ word-games workshop.

## Prototype goals

- No login, API key or student data required.
- Runs entirely in the browser.
- Choose a game, difficulty and English focus, then generate a round.
- Supports a teacher-supplied custom word bank.
- Includes quick project/copy/reveal controls for classroom use.

## Testing via GitHub Pages

Once `index.html` is present, enable GitHub Pages in **Settings > Pages** and choose **Deploy from a branch**, using the `main` branch and `/ (root)` folder.

Expected public URL:

`https://jasmineknox.github.io/Mrs-Knox-Teaches-Word-Game-Generator/`

This first version is intentionally plain so the game logic can be tested before visual branding is added.

## Teacher reference

Alphabet Categories includes suggestions grouped A–Z. Literary terms link directly
to the matching LitCharts explanation. Narrow categories leave genuine gaps; text-specific
categories provide setup guidance and work with a teacher-supplied custom bank.

Letter Bank uses 8, 9 or 10 tiles, with a familiar full-tile word in each round.
The collapsed teacher reference lists every matching word in its built-in dictionary
(2+ letters), grouped longest first, and provides original meaning clues. “Use clue”
shows the clue without the answer in the classroom prompt area and projection mode.
Teacher references never appear in copied prompts or projection mode. New rounds
and setting changes reset the reference, clue and answer visibility.

The dictionary is a 2–10-letter subset of the public-domain ENABLE list, compiled
by Alan Beale and Mendel Cooper, obtained from
https://github.com/dolph/dictionary/blob/master/enable1.txt. Common profanity/slurs
are omitted and selected Australian spellings added. It includes uncommon words
and inflections and is not an exhaustive dictionary of English. Teachers can
accept additional verified words and agree which unfamiliar words count.

Run checks: `node tests/rounds.test.cjs` and `node tests/teacher-support.test.cjs`.

## Story and sentence scaffolds

One-Word Story offers an original story with the existing optional constraint,
a familiar-story retelling (16 fairy tales, four fables, a random choice or your
own title), or a random setting, main character and problem.

Sentence Stretch offers optional tone and characterisation goals, a random goal
or your own goal. Generated sentences for characterisation goals feature a
character; a teacher-supplied starting sentence is always retained. Extra support
suggests how to create the effect through language rather than labelling it.
The goal or story scaffold is included in projection and copied prompts.

## Word Tennis and Start–End teacher options

Word Tennis has 50 authored, familiar suggestions for each broad built-in category.
Narrow categories (e.g. conjunctions, appeals and sentence types) list their
valid suggestions without inventing entries to reach 50. Text-specific categories
retain guidance for the current class text; custom banks show up to 50 supplied
terms. Relevant literary terms link to LitCharts.

Start–End draws from 21 authored letter pairs, each with 20 familiar word options
chosen for Year 9. These lists are cross-checking aids, not exclusive answer keys
or a statistical frequency ranking. Both references stay collapsed by default
and are excluded from copied prompts and projection mode.
