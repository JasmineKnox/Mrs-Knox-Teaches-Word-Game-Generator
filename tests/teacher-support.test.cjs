const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),nodes=new Map(),events={};
function node(tag='div'){return {tag,children:[],listeners:{},style:{},value:'general',textContent:'',hidden:false,open:false,classList:{toggle(){}},append(...x){this.children.push(...x)},replaceChildren(...x){this.children=x},setAttribute(){},addEventListener(k,fn){this.listeners[k]=fn},focus(){},showModal(){this.open=true},close(){this.open=false}};}
const el=id=>{if(!nodes.has(id))nodes.set(id,node());return nodes.get(id)};
let copied='';
const context={console,location:{hash:''},navigator:{clipboard:{async writeText(s){copied=s}}},isSecureContext:true,document:{getElementById:el,createElement:node,querySelector:()=>node()},addEventListener(k,fn){events[k]=fn},scrollTo(){}};
context.window=context;vm.createContext(context);
for(const file of ['data.js','word-clues.js','odd-one-out.js','letter-dictionary.js','literary-links.js','teacher-word-options.js','teacher-support.js','writing-prompts.js','app.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
const T=context.TEACHER_SUPPORT,W=context.WordGames;
assert(T.canBuild('letter','LETTERBANK'));assert(!T.canBuild('letter','LETRBANK'));assert(!T.canBuild('banana','BANAN'));
const dict=context.LETTER_DICTIONARY;
assert.equal(new Set(dict).size,dict.length);
assert(dict.includes('colour'));assert(dict.includes('centre'));
for(const count of [8,9,10])for(const seed of Object.keys(T.seedClues).filter(w=>w.length===count)){
 const words=T.matchingWords(seed);
 assert(words.includes(seed),`Missing seed ${seed}`);
 // Independently compare every dictionary entry using frequency counts.
 const counts=s=>[...s].reduce((a,c)=>(a[c]=(a[c]||0)+1,a),{}),bank=counts(seed);
 const expected=dict.filter(w=>Object.entries(counts(w)).every(([c,n])=>n<=(bank[c]||0))).sort((a,b)=>b.length-a.length||a.localeCompare(b,'en-AU'));
 assert.deepEqual(Array.from(words),Array.from(expected));
}
for(const category of new Set(Object.values(context.GAME_DATA.categoryPools).flat())){
 const ref=T.alphabetSuggestions(category);assert.equal(ref.groups.length,26);
 for(const group of ref.groups)for(const item of group.terms){assert.equal(item.term.match(/[a-z]/i)[0].toUpperCase(),group.letter);if(item.url)assert(item.url.startsWith('https://www.litcharts.com/literary-devices-and-terms/'));}
}
const literary=T.alphabetSuggestions('literary devices');assert(literary.groups.flatMap(g=>g.terms).every(x=>x.url));
const custom=T.alphabetSuggestions('My text',[{term:'Victor Frankenstein'},{term:'Elizabeth Lavenza'}]);assert.equal(custom.groups[21].terms[0].term,'Victor Frankenstein');
const writing=context.WRITING_PROMPTS;
for(const title of [...writing.fairyTales,...writing.fables]){
 const r=W.buildRound('oneWordStory','easy','general',[],{storyMode:'retell',retelling:title,storyConstraint:'BAD HIDDEN VALUE'});
 assert(r.prompt.includes('Retell: '+title));assert(r.prompt.includes('exactly one word'));assert(!r.prompt.includes('BAD HIDDEN VALUE'));
}
assert(W.buildRound('oneWordStory','easy','general',[],{storyMode:'retell',retelling:'custom',customStory:'A class story'}).prompt.includes('Retell: A class story'));
assert.throws(()=>W.buildRound('oneWordStory','easy','general',[],{storyMode:'retell',retelling:'custom',customStory:''}),/story title/);
for(let i=0;i<20;i++){
 const r=W.buildRound('oneWordStory','easy','general',[],{storyMode:'scaffold',storyConstraint:'BAD HIDDEN VALUE'});
 assert(writing.settings.some(x=>r.prompt.includes('Setting: '+x)));assert(writing.characters.some(x=>r.prompt.includes('Main character: '+x)));assert(writing.problems.some(x=>r.prompt.includes(x)));assert(!r.prompt.includes('BAD HIDDEN VALUE'));
}
for(const goal of writing.goals){
 const r=W.buildRound('sentenceStretch','medium','general',[],{sentenceGoal:goal.id});
 assert(r.prompt.includes('Your goal: '+goal.label));assert(r.prompt.includes('explain how'));assert(r.detail.includes(goal.tip));
 if(goal.character)assert(writing.characterSentences.some(x=>r.prompt.startsWith(x)));
}
assert(W.buildRound('sentenceStretch','easy','general',[],{sentence:'The character walked into the room.',sentenceGoal:'guilty'}).prompt.includes('Make the character seem guilty'));
assert(W.buildRound('sentenceStretch','easy','general',[],{sentenceGoal:'custom',customGoal:'Make the room feel welcoming'}).prompt.includes('Make the room feel welcoming'));
assert.throws(()=>W.buildRound('sentenceStretch','easy','general',[],{sentenceGoal:'custom'}),/writing goal/);
const options=context.TEACHER_WORD_OPTIONS;
for(const [pair,words] of Object.entries(options.pairs)){
 assert.equal(words.length,20);assert.equal(new Set(words).size,20);assert(words.every(w=>w[0]+w.at(-1)===pair));
}
for(const [category,words] of Object.entries(options.tennis)){
 assert.equal(new Set(words).size,words.length);
 const ref=T.tennisSuggestions(category);assert.equal(ref.terms.length,words.length);
 if(!['appeals','high-modality words'].includes(category))assert.equal(words.length,50);
}
const customTennis=T.tennisSuggestions('Class topic',[{term:'student choice'},{term:'another example'}]);assert.equal(customTennis.terms.length,2);assert(customTennis.note.includes('supplied bank'));
for(let i=0;i<60;i++){
 const r=W.buildRound('startEnd');assert.equal(r.teacher.terms.length,20);assert(r.teacher.terms.some(x=>x.term===r.target));
 const pair=r.prompt.match(/Starts with ([A-Z])  \/  Ends with ([A-Z])/);assert(r.teacher.terms.every(x=>x.term.startsWith(pair[1].toLowerCase())&&x.term.endsWith(pair[2].toLowerCase())));
}
const descendants=n=>[n,...n.children.flatMap(descendants)];
(async()=>{
 context.location.hash='#game/letterBank';events.hashchange();el('letterCount').value='9';el('generate').listeners.click();
 assert.equal(el('teacherReference').hidden,false);assert.equal(el('teacherReference').open,false);
 assert.equal(el('targetWord').hidden,true);assert.equal(el('studentClue').hidden,true);
 const hintButton=descendants(el('teacherReferenceContent')).find(x=>x.tag==='button'&&x.textContent==='Use clue');
 assert(hintButton);hintButton.listeners.click();assert.match(el('studentClue').textContent,/9-letter word/);
 el('project').listeners.click();assert.equal(el('projectionClue').textContent,el('studentClue').textContent);assert.equal(el('projectionAnswer').hidden,true);
 await el('copy').listeners.click();assert.equal(copied,el('prompt').textContent);assert(!copied.includes('Think about'));
 el('nextProjected').listeners.click();assert.equal(el('projectionClue').hidden,true);assert.equal(el('studentClue').hidden,true);assert.equal(el('teacherReference').open,false);
 context.location.hash='#game/alphabet';events.hashchange();el('category').value='literary devices';el('generate').listeners.click();
 const links=descendants(el('teacherReferenceContent')).filter(x=>x.tag==='a');assert(links.length>40);assert(links.some(x=>x.href.endsWith('/characterization')));
 context.location.hash='#game/oneWordStory';el('storyMode').value='original';events.hashchange();
 assert.equal(el('storyControl').hidden,false);assert.equal(el('retellingControl').hidden,true);
 el('storyMode').value='retell';el('retelling').value='Cinderella';el('storyMode').listeners.change();
 assert.equal(el('storyControl').hidden,true);assert.equal(el('storyConstraint').disabled,true);assert.equal(el('retellingControl').hidden,false);
 el('generate').listeners.click();assert(el('prompt').textContent.includes('Retell: Cinderella'));
 el('storyMode').value='scaffold';el('storyMode').listeners.change();assert.equal(el('retellingControl').hidden,true);
 el('generate').listeners.click();assert(el('prompt').textContent.includes('Setting:'));
 context.location.hash='#game/sentenceStretch';el('sentenceGoal').value='guilty';el('sentenceInput').value='The character walked into the room.';events.hashchange();
 el('generate').listeners.click();assert(el('prompt').textContent.includes('Make the character seem guilty'));
 el('project').listeners.click();assert.equal(el('projectionPrompt').textContent,el('prompt').textContent);
 context.location.hash='#game/startEnd';events.hashchange();el('generate').listeners.click();assert.equal(el('teacherReference').hidden,false);assert.equal(el('teacherReference').open,false);assert.equal(descendants(el('teacherReferenceContent')).filter(n=>n.tag==='li').length,20);
 context.location.hash='#game/wordTennis';events.hashchange();el('category').value='animals';el('generate').listeners.click();assert.equal(descendants(el('teacherReferenceContent')).filter(n=>n.tag==='li').length,50);
 await el('copy').listeners.click();assert.equal(copied,el('prompt').textContent);assert(!copied.includes('guinea pig'));
 el('project').listeners.click();assert.equal(el('projectionPrompt').textContent,copied);assert.equal(el('projectionAnswer').hidden,true);
 context.location.hash='#game/sentenceStretch';events.hashchange();el('generate').listeners.click();assert.equal(el('teacherReference').hidden,true);
 console.log(JSON.stringify({result:'PASS',dictionaryEntries:dict.length,fullTileSeeds:Object.keys(T.seedClues).length,checks:'complete solver, repeated tiles, alphabet groups, LitCharts links, custom banks, clue/projection/copy/reset flows, retellings, story randomiser, writing goals and control visibility, 50-word tennis lists, 20-word letter-pair lists'}));
})().catch(e=>{console.error(e);process.exitCode=1});
