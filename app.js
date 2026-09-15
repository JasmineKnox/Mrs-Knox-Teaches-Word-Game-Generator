/* Mrs Knox Teaches: illustrated game chooser. No services, tracking or API keys. */
(() => {
'use strict';
const $ = id => document.getElementById(id);
const {banks, clues, categoryPools, plainSentences, storyConstraints} = window.GAME_DATA;
const games = [
  {id:'lastLetter',name:'Last-Letter Word Chain',description:'Begin each word with the final letter of the previous word.',rules:['Take turns in a set order. Say one valid word.','The next word starts with the final letter of that word. No repeats.','In learning mode, let students pass and rejoin rather than eliminate them.']},
  {id:'alphabet',name:'Alphabet Categories',description:'Find a word in the chosen category for each letter.',rules:['Choose a category and an alphabet range.','Give one answer for each letter. Every answer must fit the category.','Ask for a reason when a connection is unclear. Skip an impossible letter.']},
  {id:'startEnd',name:'Start-End Letter Challenge',description:'Find a word with the nominated starting and ending letters.',rules:['Show the starting and ending letters.','Everyone thinks or jots before sharing a word.','Check the spelling and meaning. Use the difficulty setting to add a challenge.']},
  {id:'wordReveal',name:'Word Reveal',description:'Identify a word from its letter pattern or a clue.',rules:['Keep the answer hidden while students consider the pattern or clue.','Allow thinking time before taking guesses.','Reveal the answer, then check its meaning or application.']},
  {id:'letterBank',name:'Letter Bank',description:'Build as many words as possible, or find the longest word.',rules:['Give students one minute to build words from the letter bank.','Use each tile no more than once within a word. Reset the tiles for the next word.','Agree whether to count valid words, reward length or check accurate use.']},
  {id:'wordTennis',name:'Word Tennis',description:'Alternate category words between teams. No repeats.',rules:['Choose a category. Teams take turns giving one answer.','Do not repeat earlier words. Rotate the spokesperson.','Use a five-second limit for familiar recall only; allow longer for explanation.']},
  {id:'oddOneOut',name:'Odd One Out',description:'Choose a different item and defend your reasoning.',rules:['Show four items and give everyone thinking time.','Choose an odd one out and explain the distinction.','Accept more than one answer when the reasoning is accurate.']},
  {id:'mysteryWord',name:'Mystery Word',description:'Give one clue each until the guesser identifies the word.',rules:['Turn the guesser away. Show the target to the class, then hide it.','In a set order, give one clue each. Do not say, spell or rhyme with the word, or repeat clues.','The guesser can guess after each clue. The teacher checks doubtful clues.','Optional Forbidden Word: in pairs, ban several obvious associated words as well.']},
  {id:'sentenceStretch',name:'Sentence Stretch',description:'Improve a plain sentence one deliberate change at a time.',rules:['Keep the starting sentence visible.','Take turns adding or changing one element. Keep it grammatical.','Explain what changed and how it affects meaning. Longer is not automatically better.']},
  {id:'oneWordStory',name:'One-Word Story',description:'Build a coherent story with one word from each student.',rules:['Take turns in a set order. Each person contributes exactly one word.','Listen and keep the story grammatical, coherent and classroom-safe.','Pause to repair a sentence when needed. Keep rounds short.']}
];
const labels = {easy:'Easy',medium:'Medium',hard:'Hard'};
let selectedGame = null;
let currentRound = null;
let answerVisible = false;
let projectedAnswerVisible = false;
let previousTerm = '';
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
function bankItems() {
  return $('focus').value==='custom' ? parseBank($('customWords').value) : banks[$('focus').value].map(term=>({term,clue:''}));
}
function clueFor(item) {return item.clue || clues[item.term.toLowerCase()] || '';}
function patternFor(term) {
  return term.split(/(\s+)/).map(part => /^\s+$/.test(part) ? '   ' : [...part].map((ch,i)=>/[a-z]/i.test(ch) && i!==0 && i!==part.length-1 ? '_' : ch.toUpperCase()).join(' ')).join('');
}
function structureHint(term) {return term.trim().split(/\s+/).map(w=>(w.match(/[a-z]/gi)||[]).length).join(' + ')+' letters';}
function status(message,error=false) {$('status').textContent=message;$('status').classList.toggle('error',error);}
function updateBank() {
  $('customWrap').hidden=$('focus').value!=='custom';
  const items=bankItems();
  $('bankStatus').textContent=`${items.length} unique terms loaded; ${items.filter(x=>clueFor(x)).length} have clues for Word Reveal.`;
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
    document.title=selectedGame.name+' | Mrs Knox Teaches';
    $('gameTitle').focus({preventScroll:true});
  } else {document.title='Word Game Generator | Mrs Knox Teaches';}
  window.scrollTo(0,0);
}
function buildRound(gameId,difficulty,focus,items) {
  if (!items.length) throw new Error('Add at least one term to your custom word bank, then generate a round.');
  const candidates=items.filter(x=>x.term!==previousTerm);
  const item=pick(candidates.length?candidates:items); previousTerm=item.term;
  const word=item.term;
  const focusName=focus==='custom'?'your current unit':$('focus').selectedOptions[0].text.toLowerCase();
  const category=focus==='custom'?'your current text or unit':pick(categoryPools[focus]);
  let prompt='',detail='',target='',secret=false,notice='';
  switch(gameId) {
    case 'lastLetter':
      prompt=`Start with: ${word}\n\nBegin each new word with the final letter of the previous word. No repeats.`;
      if (difficulty==='medium') prompt+=`\nUse vocabulary connected to ${focusName}.`;
      if (difficulty==='hard') prompt+='\nDefine each word, use it accurately or explain its connotations.';
      detail='Take turns in a set order. A student can pass and rejoin. Allow words beyond the supplied bank when needed to continue the chain.';
      break;
    case 'alphabet': {
      let range='Work from A to Z. Skip an impossible letter.';
      if (focus==='custom') {
        const letters=[...new Set(items.map(x=>(x.term.match(/[a-z]/i)||[''])[0].toUpperCase()).filter(Boolean))].sort();
        range='Use these starting letters: '+letters.join('  ')+'.';
      }
      prompt=`Category: ${category}\n\n${range}\nGive one valid answer for each letter.`;
      if (difficulty==='medium') prompt+=' Explain how each answer fits the category.';
      if (difficulty==='hard') prompt+=' Justify each answer with an example, sentence or textual connection.';
      detail='Use the category as the constraint. Teachers decide which answers fit; the generator does not mark responses.';
      break;
    }
    case 'startEnd': {
      const words=items.filter(x=>/^[a-z]{3,}$/i.test(x.term));
      if (!words.length) throw new Error('Start-End needs at least one single word of three or more letters. Add one to this bank, or choose a different game.');
      const answer=pick(words).term;
      const first=answer[0].toUpperCase(),last=answer.at(-1).toUpperCase();
      prompt=`Starts with ${first}  /  Ends with ${last}\n\nFind ${difficulty==='medium'?'the longest word you can':'a valid word'} with those starting and ending letters.`;
      if (difficulty==='medium') prompt+=' Be ready to spell or define it.';
      if (difficulty==='hard') prompt+=` Connect your word to ${focusName} and use it accurately.`;
      target=answer;detail='One possible answer is available under Teacher example. It is not necessarily the longest. Everyone thinks or jots before sharing.';
      break;
    }
    case 'wordReveal': {
      const clue=clueFor(item),pattern=patternFor(word);target=word;secret=true;
      if (difficulty==='easy') prompt=`${pattern}\n\nIdentify the word or term.`;
      if (difficulty==='medium') prompt=`${pattern}\n\n${clue?'Clue: '+clue:'Structure: '+structureHint(word)}\n\nIdentify the term and explain its meaning.`;
      if (difficulty==='hard') prompt=(clue?'Clue: '+clue:pattern)+ '\n\nIdentify the term, define it accurately and explain its relevance to the current unit or text.';
      detail='Optional support: '+structureHint(word)+(difficulty==='hard'?'\nLetter pattern: '+pattern:'');
      if (!clue && difficulty!=='easy') notice='No clue is stored for this term, so this round uses a letter pattern. Add a clue as: term | clue.';
      break;
    }
    case 'letterBank': {
      const words=items.filter(x=>/^[a-z]{3,10}$/i.test(x.term));
      if (!words.length) throw new Error('Letter Bank needs a single word of 3-10 letters. Add a shorter word to this bank, or choose another game.');
      const seed=pick(words).term;
      const tiles=seed.toUpperCase().split('');
      while(tiles.length<10) tiles.push(pick('AAEEIIOOUSTRN'.split('')));
      const letters=shuffle(tiles).join('  ');
      prompt=`${letters}\n\n${difficulty==='easy'?'Make as many valid words as you can in one minute.':'Build a word connected to '+focusName+'.'}\nUse each tile only once per word. Reset the tiles for the next word.`;
      if (difficulty==='medium') prompt+=' Explain the meaning or word class of your best answer.';
      if (difficulty==='hard') prompt+=' Use your strongest word in an accurate sentence.';
      target=seed;detail='The tiles include at least one word from the selected bank. The teacher checks other answers. Agree the scoring before starting.';
      break;
    }
    case 'wordTennis':
      prompt=`Category: ${category}\n\nTeams alternate one answer at a time. No repeats.`;
      if(difficulty==='medium')prompt+=' Each answer must clearly fit the category.';
      if(difficulty==='hard')prompt+=' Give one accurate use, example or effect with each answer.';
      detail='Rotate the spokesperson. Use five seconds only for familiar recall; allow longer for explanation. Teams can confer briefly.';
      break;
    case 'oddOneOut': {
      if(items.length<4)throw new Error('Odd One Out needs four different terms. Add more terms to your bank, then generate a round.');
      const words=shuffle(items).slice(0,4).map(x=>x.term);
      prompt=words.join('  /  ')+'\n\nWhich is the odd one out? Explain your reason.';
      if(difficulty==='medium')prompt+=' Name a meaningful category that connects the other items.';
      if(difficulty==='hard')prompt+=' Defend your choice with evidence, then consider a different defensible answer.';
      detail='This is an open-ended selection from the bank, not an automatically marked question. Check the set before using it; accept accurate alternative reasons.';
      notice='Open-ended set: the justification matters. Generate another set when needed.';
      break;
    }
    case 'mysteryWord':
      target=word;secret=true;
      prompt='Give one clue per person in a set order. The guesser may guess after each clue.\n\nDo not say, spell or rhyme with the word. Do not repeat a clue.';
      if(difficulty==='medium')prompt+='\nMove from broad category clues to precise distinguishing features.';
      if(difficulty==='hard')prompt+='\nMake each clue demonstrate understanding. After the guess, improve the strongest and weakest clues.';
      detail='Turn the guesser away before showing the target to the class. Hide it again before the guesser turns back. The teacher can reject a giveaway clue.\n\nForbidden Word variation: work in pairs and agree extra associated words the clue-giver cannot use.';
      break;
    case 'sentenceStretch': {
      const sentence=pick(plainSentences);
      prompt=sentence+'\n\n'+({easy:'Add one useful adjective, adverb or detail per turn.',medium:'Add or change a clause, phrase, punctuation choice or image per turn.',hard:'Reshape the voice, tone, pace, viewpoint or stylistic effect one deliberate change at a time.'}[difficulty]);
      prompt+=' Keep the sentence grammatical.';
      if(focus==='custom')prompt+=`\nConnect the sentence to this unit term: ${word}.`;
      detail='Keep the original sentence visible. Name what changed and why it works. Longer is not automatically better.';
      break;
    }
    case 'oneWordStory':
      prompt=pick(storyConstraints[difficulty])+'.\n\nContribute exactly one word per person. Listen carefully and keep the story grammatical and coherent.';
      if(focus==='custom')prompt+=`\nWork this word or phrase into the story: ${word}.`;
      prompt=prompt.replace(/\.\./g,'.');
      detail='Use a set order. Keep the story classroom-safe. Pause to repair grammar or cohesion, then continue. End the round before it becomes random.';
      break;
    default: throw new Error('Choose a game from the home page.');
  }
  return {gameId,difficulty,focus,prompt,detail,target,secret,notice};
}
function generateRound() {
  if(!selectedGame)return false;
  try {
    currentRound=buildRound(selectedGame.id,$('difficulty').value,$('focus').value,bankItems());
    answerVisible=false;
    $('prompt').textContent=currentRound.prompt;
    $('support').textContent=currentRound.detail;$('support').hidden=true;
    $('showSupport').textContent='Show extra support';$('showSupport').setAttribute('aria-expanded','false');
    $('roundMeta').textContent=labels[currentRound.difficulty]+' / '+$('focus').selectedOptions[0].text;
    $('roundNotice').textContent=currentRound.notice;$('roundNotice').hidden=!currentRound.notice;
    $('targetPanel').hidden=!currentRound.target;$('targetWord').textContent='';$('targetWord').hidden=true;
    $('targetLabel').textContent=currentRound.secret?(selectedGame.id==='mysteryWord'?'Class target':'Teacher answer'):'Teacher example';
    $('targetHelp').textContent=selectedGame.id==='mysteryWord'?'Turn the guesser away before showing the word. Hide it before they turn back.':'Hidden until you choose to reveal it. Copy classroom prompt never includes this answer.';
    $('toggleTarget').textContent=selectedGame.id==='mysteryWord'?'Show target to class':'Show answer';$('toggleTarget').setAttribute('aria-expanded','false');
    $('roundPanel').hidden=false;$('project').disabled=false;status('Round ready.');
    if($('projection').open)renderProjection();
    return true;
  } catch(error) {clearRound();status(error.message,true);return false;}
}
function toggleAnswer() {
  if(!currentRound || !currentRound.target)return;
  answerVisible=!answerVisible;
  $('targetWord').hidden=!answerVisible;$('targetWord').textContent=answerVisible?currentRound.target:'';
  $('toggleTarget').textContent=answerVisible?'Hide answer':(selectedGame.id==='mysteryWord'?'Show target to class':'Show answer');
  $('toggleTarget').setAttribute('aria-expanded',String(answerVisible));
}
async function copyPrompt() {
  if(!currentRound)return;
  const text=currentRound.prompt;
  try {
    if(!navigator.clipboard || !window.isSecureContext)throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(text);status('Classroom prompt copied.');
  } catch (_) {
    // A selectable-text fallback works even when browser clipboard access is denied.
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
  $('revealProjected').hidden=!currentRound.target;
  $('revealProjected').textContent=selectedGame.id==='mysteryWord'?'Show target to class':'Show answer';
}
function openProjection() {
  if(!currentRound)return;
  // Do not carry an already-revealed teacher answer into the projected view.
  renderProjection();$('projection').showModal();
}
function settingsChanged() {updateBank();clearRound();status('Settings changed. Generate a new round.');}
$('difficulty').addEventListener('change',settingsChanged);
$('focus').addEventListener('change',settingsChanged);
$('customWords').addEventListener('input',settingsChanged);
$('generate').addEventListener('click',generateRound);
$('toggleTarget').addEventListener('click',toggleAnswer);
$('copy').addEventListener('click',copyPrompt);
$('showSupport').addEventListener('click',()=>{const hidden=!$('support').hidden;$('support').hidden=hidden;$('showSupport').textContent=hidden?'Show extra support':'Hide extra support';$('showSupport').setAttribute('aria-expanded',String(!hidden));});
$('project').addEventListener('click',openProjection);
$('closeProjection').addEventListener('click',()=>$('projection').close());
$('nextProjected').addEventListener('click',()=>{if(!generateRound())$('projection').close();});
$('revealProjected').addEventListener('click',()=>{if(!currentRound)return;projectedAnswerVisible=!projectedAnswerVisible;$('projectionAnswer').hidden=!projectedAnswerVisible;$('projectionAnswer').textContent=projectedAnswerVisible?currentRound.target:'';$('revealProjected').textContent=projectedAnswerVisible?'Hide answer':'Show answer';});
$('surpriseLanding').addEventListener('click',()=>{location.hash='game/'+pick(games).id;});
window.addEventListener('hashchange',route);
renderCards();updateBank();route();
// Expose pure helpers for regression tests; nothing is sent over the network.
window.WordGames={games,parseBank,buildRound,patternFor};
})();
