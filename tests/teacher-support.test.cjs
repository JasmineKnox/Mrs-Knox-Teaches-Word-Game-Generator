const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),nodes=new Map(),events={};
function node(tag='div'){return {tag,children:[],listeners:{},style:{},value:'general',textContent:'',hidden:false,open:false,classList:{toggle(){}},append(...x){this.children.push(...x)},replaceChildren(...x){this.children=x},setAttribute(){},addEventListener(k,fn){this.listeners[k]=fn},focus(){},showModal(){this.open=true},close(){this.open=false}};}
const el=id=>{if(!nodes.has(id))nodes.set(id,node());return nodes.get(id)};
let copied='';
const context={console,location:{hash:''},navigator:{clipboard:{async writeText(s){copied=s}}},isSecureContext:true,document:{getElementById:el,createElement:node,querySelector:()=>node()},addEventListener(k,fn){events[k]=fn},scrollTo(){}};
context.window=context;vm.createContext(context);
for(const file of ['data.js','word-clues.js','odd-one-out.js','letter-dictionary.js','literary-links.js','teacher-support.js','app.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
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
 context.location.hash='#game/startEnd';events.hashchange();el('generate').listeners.click();assert.equal(el('teacherReference').hidden,true);
 console.log(JSON.stringify({result:'PASS',dictionaryEntries:dict.length,fullTileSeeds:Object.keys(T.seedClues).length,checks:'complete solver, repeated tiles, alphabet groups, LitCharts links, custom banks, clue/projection/copy/reset flows'}));
})().catch(e=>{console.error(e);process.exitCode=1});
