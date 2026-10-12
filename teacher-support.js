/* Teacher references and original read-aloud clues. Answers never enter student prompts. */
(() => {
'use strict';
const split = text => text.split('|');
const samples = {
animals:split('ant|bear|cat|dog|elephant|fox|giraffe|horse|iguana|jellyfish|kangaroo|lion|monkey|newt|octopus|penguin|quokka|rabbit|snake|tiger|urchin|vulture|wombat|X-ray tetra|yak|zebra'),
foods:split('apple|bread|carrot|dumpling|egg|fish|grapes|honey|ice cream|jam|kiwifruit|lemon|mango|noodles|orange|pasta|quiche|rice|strawberry|tomato|udon|vanilla|watermelon|xigua|yoghurt|zucchini'),
places:split('Australia|Brisbane|Canberra|Darwin|England|France|Greece|Hobart|India|Japan|Kenya|Logan|Melbourne|New Zealand|Oman|Perth|Queensland|Rome|Sydney|Tasmania|Uganda|Vietnam|Wales|Xi’an|Yemen|Zimbabwe'),
objects:split('album|bottle|chair|desk|envelope|fork|globe|hat|inkpot|jar|key|lamp|mirror|notebook|oven|pencil|quilt|ruler|spoon|table|umbrella|vase|watch|xylophone|yoyo|zip'),
emotions:split('anger|boredom|contentment|disappointment|excitement|fear|gratitude|happiness|irritation|joy|loneliness|misery|nervousness|optimism|pride|quiet contentment|regret|sadness|terror|unease|vulnerability|worry|yearning|zest'),
actions:split('ask|build|climb|dance|explore|fly|grow|help|imagine|jump|kick|listen|move|notice|open|paint|question|run|sing|think|use|visit|walk|yawn|zoom'),
adjectives:split('anxious|brave|calm|daring|eager|fierce|gentle|hopeful|imaginative|joyful|kind|loyal|mysterious|nervous|optimistic|patient|quiet|restless|stubborn|thoughtful|uncertain|vigilant|weary|youthful|zealous'),
adverbs:split('angrily|boldly|calmly|deliberately|eagerly|fiercely|gently|happily|instantly|joyfully|kindly|loudly|mysteriously|nervously|openly|patiently|quietly|rapidly|slowly|thoughtfully|urgently|vividly|wearily|yearningly|zealously'),
conjunctions:split('although|and|as|because|before|but|even though|for|if|nor|once|or|provided that|since|so|than|though|unless|until|when|whereas|whether|while|yet'),
'sentence types':split('complex sentence|compound sentence|compound-complex sentence|declarative sentence|exclamative sentence|imperative sentence|interrogative sentence|simple sentence'),
'persuasive techniques':split('alliteration|analogy|anaphora|anecdote|antithesis|direct address|emotive language|ethos|expert opinion|hyperbole|inclusive language|logos|metaphor|pathos|parallelism|repetition|rhetorical question|statistics|tricolon'),
appeals:split('appeal to authority|appeal to fairness|appeal to fear|appeal to shared values|emotional appeal|ethical appeal|logical appeal'),
'high-modality words':split('absolutely|always|certainly|definitely|essential|inevitably|must|necessary|never|undoubtedly|will'),
'emotive words':split('abandoned|betrayed|cruel|devastated|exploited|frightened|grief|heartbroken|innocent|joy|lonely|mistreated|neglected|outraged|precious|rejected|suffering|terrified|unjust|vulnerable|wounded'),
'character traits':split('ambitious|brave|compassionate|determined|envious|foolish|generous|honest|impulsive|jealous|kind|loyal|manipulative|naive|optimistic|proud|quiet|reckless|selfish|thoughtful|unreliable|vain|wise|xenophobic|yielding|zealous'),
'mood words':split('anxious|bleak|cheerful|dark|eerie|foreboding|gloomy|hopeful|intimate|joyful|lonely|melancholic|nostalgic|ominous|peaceful|quiet|reflective|sombre|tense|unsettling|violent|wistful|yearning'),
'Gothic conventions':split('ancestral secrets|bleak landscapes|castles|darkness|eerie settings|fear|ghosts|haunting|isolation|madness|nightmares|omens|ruins|supernatural events|terror|uncertainty|villains'),
'setting words':split('abandoned|bustling|cold|desolate|eerie|foggy|gloomy|humid|isolated|leafy|misty|noisy|overgrown|peaceful|quiet|remote|shadowy|tropical|underground|vast|windswept'),
'sensory verbs':split('ache|buzz|crackle|drip|echo|flicker|glitter|hum|itch|jingle|knock|linger|murmur|numb|ooze|prickle|quiver|rustle|shimmer|tingle|vibrate|whisper|yelp'),
'dialogue verbs':split('asked|begged|confessed|declared|exclaimed|gasped|hissed|insisted|joked|muttered|offered|pleaded|questioned|replied|said|teased|urged|vowed|whispered|yelled'),
concepts:split('ambition|belonging|courage|discovery|ethics|freedom|grief|humanity|identity|justice|knowledge|loyalty|morality|nature|oppression|power|responsibility|survival|trust|unity|vulnerability|wisdom|xenophobia|yearning')
};
const literary=split('acrostic|allegory|alliteration|allusion|anaphora|antithesis|assonance|blank verse|cacophony|caesura|characterisation|chiasmus|connotation|consonance|couplet|denotation|diction|dramatic irony|enjambment|epigraph|epistrophe|ethos|euphony|extended metaphor|figurative language|foreshadowing|free verse|hyperbole|iamb|imagery|irony|juxtaposition|kenning|litotes|logos|metaphor|metonymy|motif|onomatopoeia|oxymoron|paradox|parallelism|pathetic fallacy|pathos|personification|pun|quatrain|refrain|repetition|rhetorical question|rhyme|sibilance|simile|soliloquy|symbolism|synecdoche|tone|understatement|verbal irony|zeugma');
samples['literary devices']=literary;
samples['language features']=[...literary,'dialogue','exposition','point of view'];
samples.nouns=samples.objects;
samples.verbs=samples.actions;
samples['analytical verbs']=window.GAME_DATA.banks.analytical;
const textCategories=new Set(['characters','settings','events','relationships','quotations']);
const textNotes={
 characters:'Use names from the text your class is studying. For example, a Frankenstein bank could include Alphonse Frankenstein, Elizabeth Lavenza, Henry Clerval, Justine Moritz, Robert Walton and Victor Frankenstein.',
 settings:'Use places from your class text. For Frankenstein, examples include the Arctic, Geneva and Ingolstadt. Decide whether broad settings and named locations both count.',
 events:'Use accurate event labels from your class text. For Frankenstein, possible examples include “creation of the creature” and “destruction of the second creature”. Agree how to alphabetise event labels.',
 relationships:'Use relationship labels that students can justify with textual evidence: allies, enemies, family, friends, mentor and rival. Decide whether students must name the characters too.',
 quotations:'Use exact quotations checked against your class edition. Agree whether to sort by the quotation’s first word or its first significant word. Add a custom bank if you want a ready-made list.'
};
const seedClues={
mountain:'a very high landform that climbers might try to reach the top of',
painting:'a picture made using colour applied with a brush',
question:'something you ask when you want an answer',
learning:'the process of developing new knowledge or skills',
notebook:'a book with pages for recording ideas or classwork',
sunshine:'light that reaches us from the Sun',
computer:'an electronic device used to process information and run programs',
hospital:'a place where people receive medical treatment',
elephant:'a large animal with a trunk and tusks',
dinosaur:'a prehistoric reptile; a tyrannosaurus is one example',
kindness:'the quality of caring about others and treating them well',
football:'a sport played with a ball; the rules depend on the code',
midnight:'the moment when one day ends and the next begins',
together:'with one another rather than separately',
treasure:'valuable objects that a pirate might hide in a chest',
creative:'able to produce original ideas or imaginative work',
stranger:'a person you do not know',
surprise:'something unexpected that catches you off guard',
discovery:'finding something that was not known before',
adventure:'an exciting experience involving risk or unfamiliar situations',
waterfall:'a place where a river drops over a steep edge',
knowledge:'information and understanding gained through learning or experience',
dangerous:'likely to cause harm or injury',
butterfly:'an insect with colourful wings that begins life as a caterpillar',
education:'the process of teaching and learning',
challenge:'a difficult task that tests your abilities',
pineapple:'a tropical fruit with a spiky skin and a leafy crown',
different:'not the same as something else',
wonderful:'extremely good or enjoyable',
character:'a person in a story, play or film',
friendship:'the relationship between people who like and support each other',
playground:'an outdoor area where children can use swings, slides or climbing frames',
television:'a device used to watch broadcast programs',
earthquake:'a sudden movement of the ground caused by activity in the Earth',
strawberry:'a small red fruit with seeds on the outside',
generation:'people born and living at roughly the same time',
dictionary:'a reference book or resource that explains the meanings of words',
understand:'to grasp the meaning of something',
confidence:'belief in your ability to do something successfully',
basketball:'a sport in which players shoot a ball through a raised hoop',
reflection:'an image seen in a mirror, or careful thought about an experience',
remarkable:'unusual enough to deserve attention'
};
const extraClues={cat:'a small animal that purrs',dog:'a pet that barks',tea:'a drink brewed from leaves',eat:'to take food into your body',read:'to make meaning from written words',write:'to record words on a page',rain:'water falling from clouds',train:'a vehicle that runs on rails',stone:'a small piece of rock',note:'a short written reminder',story:'an account of events, real or imagined',water:'a liquid we need to drink',silent:'making no sound',listen:'to pay attention to sound',planet:'a large body that orbits a star',garden:'a place where flowers or vegetables are grown',forest:'a large area filled with trees',winter:'the coldest season',summer:'the warmest season',teacher:'someone whose job is to help others learn',rainbow:'coloured bands sometimes seen after rain',thunder:'the loud sound heard during a storm',journey:'travel from one place to another',freedom:'the ability to act or choose without being unduly restricted'};
const clueBank={...window.GAME_DATA.clues,...extraClues,...seedClues};
function canBuild(word,letters){
 const available={};for(const ch of letters.toLowerCase())available[ch]=(available[ch]||0)+1;
 for(const ch of word.toLowerCase()){if(!available[ch])return false;available[ch]--;}
 return true;
}
function matchingWords(letters){return window.LETTER_DICTIONARY.filter(word=>canBuild(word,letters)).sort((a,b)=>b.length-a.length||a.localeCompare(b,'en-AU'));}
function alphabetSuggestions(category,items=[]){
 const list=items.length?items.map(x=>x.term):(samples[category]||[]);
 const groups=Array.from({length:26},(_,i)=>({letter:String.fromCharCode(65+i),terms:[]}));
 for(const term of list){const first=term.match(/[a-z]/i)?.[0].toUpperCase();if(first)groups[first.charCodeAt(0)-65].terms.push({term,url:window.LITERARY_LINKS[term.toLowerCase()]||''});}
 return {groups,note:items.length?'Suggestions from your supplied word bank. Accept other accurate responses unless you agreed a closed bank.':(textNotes[category]?textNotes[category]+' Choose “My own category / word bank” to enter examples for your class text.':'')||'Suggested answers, not an exclusive answer key. A blank letter means no example is stored; skip it or accept an accurate student suggestion. Some categories naturally have very few possible letters.'};
}
function makeLetterBank(count,previousSeed){
 const pool=Object.keys(seedClues).filter(w=>w.length===count&&w!==previousSeed);
 const seed=pool[Math.floor(Math.random()*pool.length)];
 const words=matchingWords(seed);
 const hints=words.filter(w=>clueBank[w]).slice(0,12).map(word=>({word,length:word.length,clue:`There is a ${word.length}-letter word. Think about ${clueBank[word]}.`,initial:word[0].toUpperCase()}));
 return {seed,words,hints};
}
function tennisSuggestions(category,items=[]){
 const reference=alphabetSuggestions(category,items);
 const list=items.length?items.map(x=>x.term):(window.TEACHER_WORD_OPTIONS.tennis[category]||reference.groups.flatMap(g=>g.terms.map(x=>x.term)));
 const terms=[...new Set(list)].slice(0,50).map(term=>({term,url:window.LITERARY_LINKS[term.toLowerCase()]||''}));
 const note=items.length?'Examples from your supplied bank. Other accurate answers are welcome unless you agreed to use only this bank.':terms.length>=50?'50 familiar suggestions for this category. Accept other accurate answers; this is not an exclusive answer key.':terms.length?'This is a narrow category, so fewer than 50 distinct suggestions are listed. Accept other accurate answers; do not treat related words as separate techniques or sentence types.':reference.note;
 return {terms,note};
}
window.TEACHER_SUPPORT={alphabetSuggestions,tennisSuggestions,makeLetterBank,matchingWords,canBuild,seedClues,textCategories};
})();
