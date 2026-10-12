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

const examples={
 noun:'The noun “courage” names an idea rather than a physical object.',verb:'In “The leaves trembled”, “trembled” is a verb expressing action.',adjective:'In “a narrow path”, “narrow” modifies the noun “path”.',adverb:'In “She spoke quietly”, “quietly” modifies “spoke”.',pronoun:'In “Mia arrived. She waved”, “she” replaces “Mia”.',preposition:'In “under the table”, “under” shows a spatial relationship.',conjunction:'“Because” joins the clauses in “We stayed inside because it rained”.',clause:'“The rain stopped” is a clause with a subject and verb.',phrase:'“Beside the old bridge” is a prepositional phrase.',object:'In “Mia opened the door”, “the door” is the object.',subject:'In “The dog barked”, “the dog” is the subject.',tense:'“Walked” places the action in the past; “walks” uses present tense.',modality:'“We must act” expresses stronger obligation than “We could act”.',syntax:'Compare “Only Mia noticed” with “Mia only noticed”: word order changes the emphasis.',punctuation:'A dash can mark an interruption: “I thought I knew—then the lights went out.”',nominalisation:'“Decide” becomes “decision”: “They decided” becomes “Their decision”.',
 metaphor:'“The classroom was a furnace” compares it directly to something intensely hot.',simile:'“The classroom was like a furnace” makes a comparison using “like”.',personification:'“The wind clawed at the door” gives the wind an animate action.',symbolism:'A locked gate can represent exclusion as well as being a physical barrier.',imagery:'“Smoke stung her eyes” evokes a sensory experience.',juxtaposition:'Placing a lavish banquet beside a hungry family highlights inequality.',foreshadowing:'A cracked rope described early can hint at a later fall.',allusion:'Calling an ambitious invention “a Pandora’s box” refers to the Greek myth.',irony:'A character who boasts of perfect honesty while lying creates an ironic contrast.',motif:'Repeated references to cages can develop a pattern of confinement.',characterisation:'A character who returns a lost wallet is characterised through action.',setting:'A deserted railway platform at midnight establishes place and time.', 'narrative voice':'“Of course I had a plan. It was just a terrible one” suggests a self-mocking narrator.',diction:'Choosing “slithered” instead of “moved” can make an action seem sinister.',contrast:'A calm opening followed by chaotic action creates contrast.',
 'rhetorical question':'“How many more warnings do we need?” invites reflection rather than a spoken answer.', 'inclusive language':'“We can protect our community” includes the audience in a shared group.', 'emotive language':'“These families have been abandoned” encourages an emotional response.',repetition:'“We will listen. We will learn. We will act” repeats a phrase for emphasis.',statistics:'“In our class survey, 18 of 25 students preferred option A” uses a numerical finding.', 'expert opinion':'A speaker might cite a qualified engineer’s assessment of a bridge’s safety.',anecdote:'A speaker could begin with a brief account of missing the last bus to illustrate a transport problem.',imperative:'“Check your sources” directly instructs the audience.',appeal:'“Everyone deserves a safe place to learn” appeals to fairness.',contention:'“The school should extend library opening hours” states a central position.',audience:'A speech to a school council may address decision-makers differently from a speech to classmates.',purpose:'A writer may aim to persuade readers to support longer library opening hours.',tone:'“What a brilliant idea—another meeting” can create a sarcastic tone.',
 dialogue:'“Wait,” Mia said. “Did you hear that?” represents spoken exchange.',flashback:'A present-day scene can shift to a character’s first day at school.', 'sensory detail':'“The bread’s warm crust crackled beneath her fingers” evokes touch and sound.',pace:'“She ran. Stumbled. Kept going” uses brief units to accelerate the reading rhythm.',viewpoint:'“I could see the gate” presents events from a first-person position.',conflict:'A character wants to tell the truth but fears hurting a friend.',tension:'A locked door and approaching footsteps can create uncertainty about what happens next.',voice:'“Honestly, who puts a castle there?” gives a narrator a conversational voice.',mystery:'A missing key and an unexplained footprint create questions for the reader.',symbol:'A broken watch might stand for a character’s inability to move beyond the past.',character:'The detective who investigates the missing key is a character.',event:'The discovery of the missing key is an event in the narrative.',relationship:'The friendship between two characters can change when one breaks a promise.',quotation:'Quote exact wording from your class edition, then explain how it supports your claim.',concept:'Belonging is a concept that can be explored through a character’s exclusion.',representation:'A narrative can represent a town as welcoming through its people’s actions.',perspective:'Two narrators can give different perspectives on the same event.',theme:'Repeated choices about loyalty can develop a theme about the cost of friendship.', 'turning point':'A confession that changes the investigation’s direction can be a turning point.', 'genre convention':'An unexplained disappearance is a familiar convention of mystery fiction.',assumption:'An argument may assume that every student has reliable internet access.',value:'A character who sacrifices comfort to keep a promise demonstrates a value of loyalty.',belief:'A character may believe that telling the truth is always the right choice.'
};
Object.assign(examples,{invites:'“The unanswered question invites readers to reconsider the narrator’s reliability.”',assumes:'“The argument assumes that its audience values independence.”',contrasts:'“The writer contrasts the crowded city with the isolated farm.”',constructs:'“The descriptions of barred windows construct the house as a prison.”',positions:'“The narrator’s sympathetic account positions readers to support the accused character.”',supports:'“The repeated references to locked doors support an interpretation of confinement.”',endorses:'“The celebratory ending endorses the character’s decision to speak honestly.”',asserts:'“The speaker asserts that access to education is a right.”',questions:'“The character’s refusal questions the expectation of unquestioning obedience.”',conceals:'“The limited viewpoint conceals the visitor’s identity.”',discloses:'“The final letter discloses the reason for the character’s departure.”',exposes:'“The contrast between promises and actions exposes the leader’s hypocrisy.”'});
const generalExamples={journey:'The journey home took longer after the bridge closed.',forest:'A narrow track led deep into the forest.',courage:'It took courage to admit the mistake.',memory:'The song brought back a childhood memory.',storm:'The storm forced everyone indoors.',friendship:'Their friendship survived a difficult disagreement.',shadow:'A shadow moved across the wall.',discovery:'The discovery of a hidden room changed the investigation.',challenge:'Crossing the river was their next challenge.',change:'The change in the weather delayed the trip.',freedom:'The character wanted the freedom to choose their own future.',danger:'The broken railing put visitors in danger.',hope:'The distant lights gave them hope.',silence:'The silence ended when someone knocked.',choice:'She faced a choice between honesty and comfort.',power:'The council had the power to approve the proposal.',home:'After weeks away, he was glad to return home.',secret:'They agreed to keep the surprise a secret.',truth:'The witness finally told the truth.'};
function wordReference(item,focus){
 const key=item.term.toLowerCase(),definition=item.clue||window.GAME_DATA.clues[key]||clueBank[key]||'';
 const example=examples[key]||generalExamples[key]||(focus==='analytical'?`In an analytical sentence: “The repeated image ${key} the character’s isolation.” Check that this verb fits the evidence and the claim.`:'');
 return {definition,example,url:window.LITERARY_LINKS[key]||'',note:definition?'Original teaching summary; check the meaning in the context of your class text.':'No verified meaning is stored for this custom term. Add one as “term | meaning” and supply a checked example from your unit.'};
}
function mysteryReference(item,focus){
 const ref=wordReference(item,focus),parts=item.term.toLowerCase().split(/\W+/).filter(Boolean);
 const broad=({general:'Think of an idea, place, experience or thing.',grammar:'Think of a term we use to describe how language works.',persuasive:'Think of a term connected to persuasion or a speaker’s choices.',literary:'Think of a term connected to how a literary text creates meaning.',analytical:'Think of a verb you could use when explaining a text.',creative:'Think of a term connected to crafting a story.',textstudy:'Think of a term we use when discussing a text.'}[focus]||'Think of a term from our current topic.');
 const specific=ref.definition&&!parts.some(p=>new RegExp('\\b'+p+'\\b','i').test(ref.definition))?ref.definition:'';
 const forbidden=[...new Set((ref.definition.match(/[a-z]+/gi)||[]).map(x=>x.toLowerCase()).filter(x=>x.length>4&&!parts.includes(x)&&!['something','someone','through','another','between','rather','their','which','where','about','within','using','expresses','typically'].includes(x)))].slice(0,3);
 return {type:'mystery',...ref,hints:[broad,...(specific?[specific]:[])],forbidden,note:'Read clues from broad to specific. Optional Forbidden Word: agree the listed associated words before play; only the target and its forms are banned by default. If a clue is already used, move on. Do not spell, rhyme with or say the target.'};
}
function chainReference(word){
 const terms=[...new Set(Object.values(window.TEACHER_WORD_OPTIONS.tennis).flat().concat(...Object.values(samples)))].filter(x=>/^[a-z]+$/.test(x)&&x.length>2);
 return {type:'chain',nextLetter:word.slice(-1).toUpperCase(),groups:Array.from({length:26},(_,i)=>{const letter=String.fromCharCode(65+i);return {letter,terms:terms.filter(w=>w.startsWith(letter.toLowerCase())).slice(0,12).map(term=>({term,url:''}))};}),note:'Familiar next-word suggestions for an unrestricted chain. Start with the final letter of the latest spoken word; this list does not track used words. Cross out repeats and check any agreed category. A blank letter has no stored suggestion.'};
}
window.TEACHER_SUPPORT={alphabetSuggestions,tennisSuggestions,makeLetterBank,matchingWords,canBuild,seedClues,textCategories,wordReference,mysteryReference,chainReference};

})();
