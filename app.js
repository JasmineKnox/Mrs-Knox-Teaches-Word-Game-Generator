/* Mrs Knox Teaches: illustrated game chooser. No services, tracking or API keys. */
(() => {
'use strict';
const $ = id => document.getElementById(id);
const {banks, clues, categoryPools, plainSentences, storyConstraints, oddOneOutSets} = window.GAME_DATA;
const games = [
  {id:'lastLetter',name:'Last-Letter Word Chain',description:'Begin each word with the final letter of the previous word.',rules:['Take turns in a set order. Say one valid word.','The next word starts with the final letter of that word. No repeats.','In learning mode, let students pass and rejoin rather than eliminate them.']},
  {id:'alphabet',name:'Alphabet Categories',description:'Find a word in the chosen category for each letter.',rules:['Choose a category and an alphabet range.','Give one answer for each letter. Every answer must fit the category.','Ask for a reason when a connection is unclear. Skip an impossible letter.']},
  {id:'startEnd',name:'Start-End Letter Challenge',description:'Find a word with the nominated starting and ending letters.',rules:['Show the starting and ending letters.','Everyone thinks or jots before sharing a word.','Check the spelling and meaning. Award the longest correctly spelt word, or accept any valid answer.']},
  {id:'wordReveal',name:'Word Reveal',description:'Identify a word from its letter pattern or a clue.',rules:['Keep the answer hidden while students consider the pattern or clue.','Allow thinking time before taking guesses.','Reveal the answer, then check its meaning or application.']},
  {id:'letterBank',name:'Letter Bank',description:'Build as many words as possible, or find the longest word.',rules:['Give students one minute to build words from the letter bank.','Use each tile no more than once within a word. Reset the tiles for the next word.','Agree whether to count valid words, reward length or check accurate use.']},
  {id:'wordTennis',name:'Word Tennis',description:'Alternate category words between teams. No repeats.',rules:['Choose a category. Teams take turns giving one answer.','Do not repeat earlier words. Rotate the spokesperson.','Use a five-second limit for familiar recall only; allow longer for explanation.']},
  {id:'oddOneOut',name:'Odd One Out',description:'Choose a different item and defend your reasoning.',rules:['Show four items and give everyone thinking time.','Choose an odd one out and explain the distinction.','Accept more than one answer when the reasoning is accurate.','Built-in sets have suggested reasoning. Custom banks make open-ended sets that need a teacher check.']},
  {id:'mysteryWord',name:'Mystery Word',description:'Give one clue each until the guesser identifies the word.',rules:['Turn the guesser away. Show the target to the class, then hide it.','In a set order, give one clue each. Do not say, spell or rhyme with the word, or repeat clues.','The guesser can guess after each clue. The teacher checks doubtful clues.','Optional Forbidden Word: in pairs, ban several obvious associated words as well.']},
  {id:'sentenceStretch',name:'Sentence Stretch',description:'Improve a plain sentence one deliberate change at a time.',rules:['Keep the starting sentence visible.','Take turns adding or changing one element. Keep it grammatical.','Explain what changed and how it affects meaning. Longer is not automatically better.']},
  {id:'oneWordStory',name:'One-Word Story',description:'Build a coherent story with one word from each student.',rules:['Take turns in a set order. Each person contributes exactly one word.','Listen and keep the story grammatical, coherent and classroom-safe.','Pause to repair a sentence when needed. Keep rounds short.']}
];
// Each game exposes only settings that affect its round. Hidden choices are ignored.
const controls = {
  lastLetter:{bank:true,bankLabel:'Starting word bank'},
  alphabet:{category:true},
  startEnd:{},
  wordReveal:{bank:true,bankLabel:'Word bank',level:'reveal'},
  letterBank:{letters:true},
  wordTennis:{category:true},
  oddOneOut:{bank:true,bankLabel:'Topic',level:'odd'},
  mysteryWord:{bank:true,bankLabel:'Word bank'},
  sentenceStretch:{level:'writing',sentence:true},
  oneWordStory:{story:true}
};
const bankNames={general:'General vocabulary',grammar:'Grammar terms',persuasive:'Persuasive language',literary:'Literary terms',analytical:'Analytical verbs',creative:'Creative writing',textstudy:'Text study',custom:'My own word bank'};
const levelOptions={
  reveal:{label:'Clue display',values:[['easy','Letter pattern'],['medium','Letter pattern + clue'],['hard','Clue only']]},
  odd:{label:'Set complexity',values:[['easy','Easy - clear distinction'],['medium','Medium - closer categories'],['hard','Hard - different defensible readings']]},
  writing:{label:'Change to practise',values:[['easy','Vocabulary and detail'],['medium','Clauses, punctuation and imagery'],['hard','Voice, tone and pace']]}
};
const randomWords='garden forest planet window river pencil rabbit kitten silver winter summer basket orange purple school teacher reading learning writing painting rainbow thunder journey blanket candle feather shadow whisper cricket captain picture holiday shelter mountain waterfall triangle question puzzle ticket pocket lantern horizon meadow ocean notebook adventure discovery freedom'.split(' ');
const storyChoices=[...new Set([...storyConstraints.medium,...storyConstraints.hard])];
let previousPair='';
let previousSeed='';
const labels = {easy:'Easy',medium:'Medium',hard:'Hard'};
let selectedGame = null;
let currentRound = null;
let answerVisible = false;
let projectedAnswerVisible = false;
let previousTerm = '';
const previousOddSets = new Map();
const pick = values => values[Math.floor(Math.random() * values.length)];
function shuffle(values) {
  const copy = [...values];
  for (let i=copy.length-1;i>0;i--) {const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}
  return copy;
}
function parseBank(raw) {
  const entries=[];
  const seen=new Set();
  // Delimiters in a supplied clue are not treated as new terms.
  for (const line of raw.split(/\r?\n/)) {
    const rows=line.includes('|') ? [line] : line.split(/[,;]/);
    for (const row of rows) {
      const [first,...rest]=row.split('|');
      const term=(first||'').trim().replace(/\s+/g,' ');
      const key=term.toLocaleLowerCase('en-AU');
      if (!term || seen.has(key)) continue;
      seen.add(key);
      entries.push({term,clue:rest.join('|').trim()});
    }
  }
  return entries;
}
function bankItems(focus='general') {
  return focus==='custom' ? parseBank($('customWords').value) : (banks[focus]||[]).map(term=>({term,clue:''}));
}
function selectedControls() {return controls[selectedGame?.id]||{};}
function usesCustomBank() {
  const c=selectedControls();
  return Boolean((c.bank && $('focus').value==='custom') || (c.category && $('category').value==='custom'));
}
function setField(wrapper,id,show) {$(wrapper).hidden=!show;$(id).disabled=!show;}
function configureControls() {
  const c=selectedControls();
  setField('difficultyControl','difficulty',Boolean(c.level));
  setField('focusControl','focus',Boolean(c.bank));
  setField('categoryControl','category',Boolean(c.category));
  setField('letterCountControl','letterCount',Boolean(c.letters));
  setField('sentenceControl','sentenceInput',Boolean(c.sentence));
  setField('storyControl','storyConstraint',Boolean(c.story));
  if(c.level) {
    const spec=levelOptions[c.level],old=$('difficulty').value;
    $('difficultyLabel').textContent=spec.label;
    $('difficulty').replaceChildren(...spec.values.map(([value,text])=>{const o=document.createElement('option');o.value=value;o.textContent=text;return o;}));
    $('difficulty').value=spec.values.some(x=>x[0]===old)?old:'easy';
  }
  $('focusLabel').textContent=c.bankLabel||'Word bank';
  $('setupTitle').textContent=selectedGame?.id==='startEnd'?'Generate a letter pair':'Set up your round';
  $('generate').textContent=({startEnd:'Generate letter pair',letterBank:'Generate letters',lastLetter:'Generate starting word'}[selectedGame?.id]||'Generate round');
  const visible=Object.values(c).filter(x=>x===true).length+(c.level?1:0);
  $('controlGrid').classList.toggle('single-control',visible<=1);
  $('controlGrid').hidden=visible===0;
  updateBank();
}
function populateGameOptions() {
  const seen=new Set();
  for(const [focus,categories] of Object.entries(categoryPools)) {
    const group=document.createElement('optgroup');group.label=bankNames[focus];
    for(const text of categories) {
      if(seen.has(text))continue;seen.add(text);
      const o=document.createElement('option');o.value=text;o.textContent=text[0].toUpperCase()+text.slice(1);group.append(o);
    }
    if(group.children.length)$('category').append(group);
  }
  const custom=document.createElement('option');custom.value='custom';custom.textContent='My own category / word bank';$('category').append(custom);
  for(const choice of storyChoices) {
    const o=document.createElement('option');o.value=choice;o.textContent=choice;$('storyConstraint').append(o);
  }
}
function roundSettings() {
  const c=selectedControls();
  const difficulty=c.level?$('difficulty').value:'easy';
  let focus=c.bank?$('focus').value:'general';
  if(c.category && $('category').value==='custom')focus='custom';
  const options={};
  if(c.letters)options.letterCount=Number($('letterCount').value);
  if(c.sentence)options.sentence=$('sentenceInput').value.trim();
  if(c.story)options.storyConstraint=$('storyConstraint').value;
  if(c.category)options.category=$('category').value==='custom'?$('customCategory').value.trim():$('category').value;
  const items=(c.bank||(c.category&&focus==='custom'))?bankItems(focus):[];
  return {difficulty,focus,items,options};
}
function clueFor(item) {return item.clue || clues[item.term.toLowerCase()] || '';}
function patternFor(term) {
  return term.split(/(\s+)/).map(part => /^\s+$/.test(part) ? '   ' : [...part].map((ch,i)=>/[a-z]/i.test(ch) && i!==0 && i!==part.length-1 ? '_' : ch.toUpperCase()).join(' ')).join('');
}
function structureHint(term) {return term.trim().split(/\s+/).map(w=>(w.match(/[a-z]/gi)||[]).length).join(' + ')+' letters';}
function status(message,error=false) {$('status').textContent=message;$('status').classList.toggle('error',error);}
function updateBank() {
  const custom=usesCustomBank();
  $('customWrap').hidden=!custom;$('customWords').disabled=!custom;
  const categoryCustom=Boolean(selectedControls().category&&$('category').value==='custom');
  setField('customCategoryControl','customCategory',categoryCustom);
  $('customWordsLabel').textContent=categoryCustom?'Word bank (optional)':'Custom word bank';
  $('clueHelp').hidden=selectedGame?.id!=='wordReveal';
  const items=custom?bankItems('custom'):[];
  $('bankStatus').textContent=`${items.length} unique terms loaded`+(selectedGame?.id==='wordReveal'?`; ${items.filter(x=>clueFor(x)).length} have clues for Word Reveal.`:'.');
}
function clearRound() {
  currentRound=null; answerVisible=false;
  $('roundPanel').hidden=true; $('project').disabled=true;
  $('targetWord').textContent=''; $('targetWord').hidden=true;
  $('support').textContent=''; $('support').hidden=true;
  $('prompt').textContent='';
}
function setArtwork(element,index) {
  element.style.backgroundPosition=`${index%2===0?'0%':'100%'} ${Math.floor(index/2)*25}%`;
}
function renderCards() {
  games.forEach((game,index)=>{
    const link=document.createElement('a');
    link.className='game-card'; link.href='#game/'+game.id;
    link.setAttribute('aria-label',`${index+1}. ${game.name}. ${game.description}`);
    const art=document.createElement('div');art.className='game-art';art.setAttribute('aria-hidden','true');setArtwork(art,index);
    const heading=document.createElement('div');heading.className='card-heading';
    const number=document.createElement('span');number.className='card-number';number.textContent=index+1;number.setAttribute('aria-hidden','true');
    const title=document.createElement('h2');title.textContent=game.name;
    const description=document.createElement('p');description.className='card-description';description.textContent=game.description;
    heading.append(number,title);link.append(art,heading,description);$('gameCards').append(link);
  });
}
function route() {
  if($('projection').open)$('projection').close();
  const id=location.hash.replace(/^#game\//,'');
  selectedGame=games.find(x=>x.id===id)||null;
  $('landing').hidden=Boolean(selectedGame);$('gameView').hidden=!selectedGame;
  clearRound();status('');
  if (selectedGame) {
    $('gameTitle').textContent=selectedGame.name;
    $('gameDescription').textContent=selectedGame.description;
    setArtwork($('selectedArt'),games.indexOf(selectedGame));
    $('gameRules').replaceChildren(...selectedGame.rules.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
    document.querySelector('.rules').open=false;
    configureControls();
    document.title=selectedGame.name+' | Mrs Knox Teaches';
    $('gameTitle').focus({preventScroll:true});
  } else {document.title='Word Game Generator | Mrs Knox Teaches';}
  window.scrollTo(0,0);
}
function buildRound(gameId,difficulty='easy',focus='general',items=[],options={}) {
  const c=controls[gameId];
  if(!c)throw new Error('Choose a game from the home page.');
  // Do not let hidden difficulty, focus or an empty custom bank affect unrelated games.
  if(!c.level)difficulty='easy';
  if(!levelOptions[c.level]?.values.some(x=>x[0]===difficulty))difficulty='easy';
  if(!c.bank && !c.category)focus='general';
  if(c.bank && !items.length)throw new Error('Add at least one term to your custom word bank, then generate a round.');
  const candidates=items.filter(x=>x.term!==previousTerm);
  const item=items.length?pick(candidates.length?candidates:items):null;
  if(item)previousTerm=item.term;
  const word=item?.term||'';
  const focusName=focus==='custom'?'your current unit':bankNames[focus]?.toLowerCase()||'general vocabulary';
  let category='';
  if(c.category) {
    category=(options.category||'').trim();
    if(!category && focus==='custom') {
      if(!items.length)throw new Error('Enter a category name or add some words to your custom bank.');
      category='your current text or unit';
    }
    if(!category)category=pick(categoryPools[focus]||categoryPools.general);
  }
  let prompt='',detail='',target='',secret=false,notice='',meta='';
  if(c.bank)meta=bankNames[focus]||focus;
  if(c.level)meta=[levelOptions[c.level].values.find(x=>x[0]===difficulty)[1],meta].filter(Boolean).join(' / ');
  if(c.category)meta=category;
  switch(gameId) {
    case 'lastLetter':
      prompt=`Start with: ${word}\n\nBegin each new word with the final letter of the previous word. No repeats.`;
      detail='The bank supplies a starting word; it does not restrict the whole chain. Take turns in a set order. A student can pass and rejoin. For extra challenge, agree a category or ask for a definition or example.';
      break;
    case 'alphabet': {
      let range='Work from A to Z. Skip an impossible letter.';
      if (focus==='custom' && items.length) {
        const letters=[...new Set(items.map(x=>(x.term.match(/[a-z]/i)||[''])[0].toUpperCase()).filter(Boolean))].sort();
        if(letters.length)range='Use these starting letters: '+letters.join('  ')+'.';
      }
      prompt=`Category: ${category}\n\n${range}\nGive one valid answer for each letter.`;

      detail='Use the category as the constraint. Teachers decide which answers fit. For extra challenge, ask for a definition, sentence or textual connection. The generator does not mark responses.';
      break;
    }
    case 'startEnd': {
      const candidates=randomWords.filter(w=>(w[0]+w.at(-1))!==previousPair);
      const answer=pick(candidates.length?candidates:randomWords);
      const first=answer[0].toUpperCase(),last=answer.at(-1).toUpperCase();
      previousPair=answer[0]+answer.at(-1);
      prompt=`Starts with ${first}  /  Ends with ${last}\n\nFind a word with those starting and ending letters. Think or jot before sharing.`;
      target=answer;detail='The pair comes from a real, familiar word, shown under Teacher example. Other answers are welcome. Award the longest correctly spelt word or accept any valid word; agree this before starting.';
      break;
    }
    case 'wordReveal': {
      const clue=clueFor(item),pattern=patternFor(word);target=word;secret=true;
      if (difficulty==='easy') prompt=`${pattern}\n\nIdentify the word or term.`;
      if (difficulty==='medium') prompt=`${pattern}\n\n${clue?'Clue: '+clue:'Structure: '+structureHint(word)}\n\nIdentify the term and explain its meaning.`;
      if (difficulty==='hard') prompt=(clue?'Clue: '+clue:pattern)+ '\n\nIdentify the term and explain its meaning.';
      detail='Optional support: '+structureHint(word)+(difficulty==='hard'?'\nLetter pattern: '+pattern:'');
      if (!clue && difficulty!=='easy') notice='No clue is stored for this term, so this round uses a letter pattern. Add a clue as: term | clue.';
      break;
    }
    case 'letterBank': {
      const count=Number(options.letterCount??10);
      if(![8,9,10].includes(count))throw new Error('Choose a bank of 8, 9 or 10 letters.');
      const pool=randomWords.filter(w=>w.length>=5&&w.length<=count&&w!==previousSeed);
      const seed=pick(pool);previousSeed=seed;
      const tiles=seed.toUpperCase().split('');
      while(tiles.length<count)tiles.push(pick('AAEEIIOOUSTRN'.split('')));
      prompt=`${shuffle(tiles).join('  ')}\n\nMake as many valid words as you can, or find the longest word.\nUse each tile only once per word. Reset the tiles for the next word.`;
      target=seed;meta=count+' letters';detail='Allow about one minute. The tiles contain at least one familiar word, shown under Teacher example, but it is not necessarily the longest. Agree whether to score the most words or the longest word before playing.';
      break;
    }
    case 'wordTennis':
      prompt=`Category: ${category}\n\nTeams alternate one answer at a time. No repeats.`;
      detail='Rotate the spokesperson. Use five seconds only for familiar recall; allow longer for explanation. Teams can confer briefly. For extra challenge, require an accurate definition, use or example.';
      break;
    case 'oddOneOut': {
      if (focus==='custom') {
        if(items.length<4)throw new Error('Odd One Out needs four different terms. Add more terms to your bank, then generate a round.');
        const words=shuffle(items).slice(0,4).map(x=>x.term);
        prompt=words.join('  /  ')+'\n\nWhich is the odd one out? Explain your reason.';
        detail='This custom-bank selection is open-ended. No answer or category is inferred from the terms. Check the set before using it; accept accurate alternative reasons.';
        notice='Custom-bank set: check that a meaningful distinction is possible.';
      } else {
        const pool=oddOneOutSets?.[focus]?.[difficulty];
        if(!pool?.length)throw new Error('No authored Odd One Out sets are available for this focus and difficulty. Choose another focus or use a custom bank.');
        const key=focus+'/'+difficulty;
        const available=pool.filter(set=>set!==previousOddSets.get(key));
        const set=pick(available.length?available:pool);
        previousOddSets.set(key,set);
        prompt=shuffle(set.words).join('  /  ')+'\n\nWhich is the odd one out? Explain your reason.';
        if(focus==='analytical')prompt+=' Treat each item as a verb in an analytical sentence. Compare its meaning, not its spelling.';
        target='Suggested choice: '+set.answer+'\n\n'+set.reason+(set.alternative?'\n\nAnother defensible approach: '+set.alternative:'');
        secret=true;
        detail='These are authored sets, separate from the general word banks. Reveal Suggested reasoning to see one possible distinction. Accept other answers when the student explains an accurate, consistent criterion.';
        notice='Suggested reasoning is hidden until you choose to reveal it.';
      }
      if(difficulty==='medium')prompt+=' Name a meaningful category that connects the other items.';
      if(difficulty==='hard')prompt+=' Defend your choice with evidence, then consider a different defensible answer.';
      break;
    }
    case 'mysteryWord':
      target=word;secret=true;
      prompt='Give one clue per person in a set order. The guesser may guess after each clue.\n\nDo not say, spell or rhyme with the word. Do not repeat a clue.';
      detail='Turn the guesser away before showing the target to the class. Hide it again before the guesser turns back. Start with a broad category, then give precise distinguishing features. The teacher can reject a giveaway clue.\n\nForbidden Word variation: work in pairs and agree extra associated words the clue-giver cannot use.';
      break;
    case 'sentenceStretch': {
      const sentence=String(options.sentence||'').trim()||pick(plainSentences);
      prompt=sentence+'\n\n'+({easy:'Add one useful adjective, adverb or detail per turn.',medium:'Add or change a clause, phrase, punctuation choice or image per turn.',hard:'Reshape the voice, tone, pace, viewpoint or stylistic effect one deliberate change at a time.'}[difficulty]);
      prompt+=' Keep the sentence grammatical.';
      detail='Keep the original sentence visible. Name what changed and why it works. Longer is not automatically better.';
      break;
    }
    case 'oneWordStory': {
      const choice=options.storyConstraint||'none';
      const constraint=choice==='random'?pick(storyChoices):choice;
      if(constraint!=='none'&&!storyChoices.includes(constraint))throw new Error('Choose a story constraint from the menu.');
      prompt=(constraint==='none'?'Build a coherent classroom-safe story.':'Constraint: '+constraint+'.')+'\n\nContribute exactly one word per person. Listen carefully and keep the story grammatical and coherent.';
      detail='Use a set order. Keep the story classroom-safe. Pause to repair grammar or cohesion, then continue. End the round before it becomes random.';
      meta=constraint==='none'?'No added constraint':constraint;
      break;
    }
    default: throw new Error('Choose a game from the home page.');
  }
  return {gameId,difficulty,focus,prompt,detail,target,secret,notice,meta};
}
function answerLabel() {return currentRound?.gameId==='oddOneOut'?'reasoning':'answer';}
function generateRound() {
  if(!selectedGame)return false;
  try {
    const settings=roundSettings();
    currentRound=buildRound(selectedGame.id,settings.difficulty,settings.focus,settings.items,settings.options);
    answerVisible=false;
    $('prompt').textContent=currentRound.prompt;
    $('support').textContent=currentRound.detail;$('support').hidden=true;
    $('showSupport').textContent='Show extra support';$('showSupport').setAttribute('aria-expanded','false');
    $('roundMeta').textContent=currentRound.meta;
    $('roundNotice').textContent=currentRound.notice;$('roundNotice').hidden=!currentRound.notice;
    $('targetPanel').hidden=!currentRound.target;$('targetWord').textContent='';$('targetWord').hidden=true;
    $('targetWord').style.whiteSpace='pre-wrap';
    $('targetWord').style.fontSize=selectedGame.id==='oddOneOut'?'18px':'';
    $('targetWord').style.fontWeight=selectedGame.id==='oddOneOut'?'400':'';
    $('targetLabel').textContent=selectedGame.id==='oddOneOut'?'Suggested reasoning':currentRound.secret?(selectedGame.id==='mysteryWord'?'Class target':'Teacher answer'):'Teacher example';
    $('targetHelp').textContent=selectedGame.id==='mysteryWord'?'Turn the guesser away before showing the word. Hide it before they turn back.':selectedGame.id==='oddOneOut'?'One possible explanation, not an exclusive answer key. Hidden until you choose to reveal it.':'Hidden until you choose to reveal it. Copy classroom prompt never includes this answer.';
    $('toggleTarget').textContent=selectedGame.id==='mysteryWord'?'Show target to class':'Show '+answerLabel();$('toggleTarget').setAttribute('aria-expanded','false');
    $('roundPanel').hidden=false;$('project').disabled=false;status('Round ready.');
    if($('projection').open)renderProjection();
    return true;
  } catch(error) {clearRound();status(error.message,true);return false;}
}
function toggleAnswer() {
  if(!currentRound || !currentRound.target)return;
  answerVisible=!answerVisible;
  $('targetWord').hidden=!answerVisible;$('targetWord').textContent=answerVisible?currentRound.target:'';
  $('toggleTarget').textContent=answerVisible?'Hide '+answerLabel():(selectedGame.id==='mysteryWord'?'Show target to class':'Show '+answerLabel());
  $('toggleTarget').setAttribute('aria-expanded',String(answerVisible));
}
async function copyPrompt() {
  if(!currentRound)return;
  const text=currentRound.prompt;
  try {
    if(!navigator.clipboard || !window.isSecureContext)throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(text);status('Classroom prompt copied.');
  } catch (_) {
    const range=document.createRange();range.selectNodeContents($('prompt'));
    const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);
    status('Prompt selected. Use Copy from your browser or keyboard.');
  }
}
function renderProjection() {
  if(!currentRound)return;
  projectedAnswerVisible=false;
  $('projectionTitle').textContent=selectedGame.name;
  $('projectionPrompt').textContent=currentRound.prompt;
  $('projectionAnswer').textContent='';$('projectionAnswer').hidden=true;
  $('projectionAnswer').style.whiteSpace='pre-wrap';
  $('projectionAnswer').style.fontSize=selectedGame.id==='oddOneOut'?'24px':'';
  $('revealProjected').hidden=!currentRound.target;
  $('revealProjected').textContent=selectedGame.id==='mysteryWord'?'Show target to class':'Show '+answerLabel();
}
function openProjection() {
  if(!currentRound)return;
  renderProjection();$('projection').showModal();
}
function settingsChanged() {updateBank();clearRound();status('Settings changed. Generate a new round.');}
$('difficulty').addEventListener('change',settingsChanged);
$('focus').addEventListener('change',settingsChanged);
$('customWords').addEventListener('input',settingsChanged);
for(const id of ['category','letterCount','storyConstraint'])$(id).addEventListener('change',settingsChanged);
for(const id of ['sentenceInput','customCategory'])$(id).addEventListener('input',settingsChanged);
$('generate').addEventListener('click',generateRound);
$('toggleTarget').addEventListener('click',toggleAnswer);
$('copy').addEventListener('click',copyPrompt);
$('showSupport').addEventListener('click',()=>{const hidden=!$('support').hidden;$('support').hidden=hidden;$('showSupport').textContent=hidden?'Show extra support':'Hide extra support';$('showSupport').setAttribute('aria-expanded',String(!hidden));});
$('project').addEventListener('click',openProjection);
$('closeProjection').addEventListener('click',()=>$('projection').close());
$('nextProjected').addEventListener('click',()=>{if(!generateRound())$('projection').close();});
$('revealProjected').addEventListener('click',()=>{if(!currentRound)return;projectedAnswerVisible=!projectedAnswerVisible;$('projectionAnswer').hidden=!projectedAnswerVisible;$('projectionAnswer').textContent=projectedAnswerVisible?currentRound.target:'';$('revealProjected').textContent=(projectedAnswerVisible?'Hide ':'Show ')+answerLabel();});
$('surpriseLanding').addEventListener('click',()=>{location.hash='game/'+pick(games).id;});
window.addEventListener('hashchange',route);
populateGameOptions();renderCards();route();
window.WordGames={games,controls,levelOptions,parseBank,buildRound,patternFor,roundSettings};
})();
