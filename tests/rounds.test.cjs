// Run from the repository root: node tests/rounds.test.cjs
// Logic regressions only. Browser layout and click tests are separate.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const nodes=new Map();
function node(){return {children:[],style:{},value:'general',textContent:'',classList:{toggle(){}},append(...x){this.children.push(...x)},replaceChildren(...x){this.children=x},setAttribute(){},addEventListener(){},focus(){}};}
const el=id=>{if(!nodes.has(id))nodes.set(id,node());return nodes.get(id)};
const context={console,location:{hash:''},document:{getElementById:el,createElement:node,querySelector:()=>node()},addEventListener(){},scrollTo(){}};
context.window=context;vm.createContext(context);
for(const file of ['data.js','word-clues.js','odd-one-out.js','app.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
const D=context.GAME_DATA,W=context.WordGames;
assert.equal(el('gameCards').children.length,10);
for(const word of ['assumption','perspective','representation','value','belief']){assert(!D.banks.analytical.includes(word));assert(D.banks.textstudy.includes(word));}
assert(D.banks.analytical.includes('assumes'));assert(D.banks.analytical.includes('challenges'));
assert(!JSON.stringify(D).includes('challanges'));
let sets=0,rounds=0;
for(const [focus,bank] of Object.entries(D.banks)){
  assert.equal(new Set(bank).size,bank.length);
  assert(bank.every(word=>D.clues[word]));
  for(const level of ['easy','medium','hard']){
    for(const set of D.oddOneOutSets[focus][level]){
      sets++;assert.equal(new Set(set.words).size,4);assert(set.words.includes(set.answer));assert(set.reason.length>30);
      if(focus==='analytical')assert(set.words.every(w=>bank.includes(w)));
      if(level==='hard')assert(set.alternative.length>30);
    }
    for(let i=0;i<5;i++)for(const game of W.games){
      const r=W.buildRound(game.id,level,focus,bank.map(term=>({term,clue:''})),{letterCount:8+i%3});rounds++;
      assert(r.prompt.length>10&&!r.prompt.includes('undefined'));
      if(game.id==='oddOneOut')assert(r.target.startsWith('Suggested choice:')&&!r.prompt.includes('Suggested choice:'));
      if(game.id==='letterBank'){
        const letters=r.prompt.split('\n')[0].split(/\s+/);assert.equal(letters.length,8+i%3);
        for(const ch of r.target.toUpperCase()){const at=letters.indexOf(ch);assert(at>=0);letters.splice(at,1)}
      }
      if(game.id==='startEnd'){
        const pair=r.prompt.match(/Starts with ([A-Z])  \/  Ends with ([A-Z])/);
        assert.equal(r.target[0].toUpperCase(),pair[1]);assert.equal(r.target.at(-1).toUpperCase(),pair[2]);
      }
    }
  }
}
for(const game of ['startEnd','letterBank','sentenceStretch','oneWordStory'])assert.equal(W.buildRound(game,'hard','custom',[]).focus,'general');
const custom=W.parseBank('assumption; challenges; positions; assumes; assumption');assert.equal(custom.length,4);
assert.equal(W.buildRound('oddOneOut','medium','custom',custom).target,'');
assert.throws(()=>W.buildRound('oddOneOut','easy','custom',custom.slice(0,3)),/four different/);
for(const game of ['alphabet','wordTennis'])assert(W.buildRound(game,'hard','custom',[],{category:'Animal adaptations'}).prompt.includes('Animal adaptations'));
assert(W.buildRound('sentenceStretch','medium','custom',[],{sentence:'The boat stopped.'}).prompt.startsWith('The boat stopped.'));
assert(W.buildRound('oneWordStory','hard','custom',[],{storyConstraint:'Set in space'}).prompt.includes('Set in space'));
assert.throws(()=>W.buildRound('letterBank','easy','general',[],{letterCount:7}),/8, 9 or 10/);
console.log(JSON.stringify({result:'PASS',authoredSets:sets,generatedRounds:rounds}));
