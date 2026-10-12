/* Original classroom scaffolds. Traditional story titles are retelling prompts, not extracts. */
window.WRITING_PROMPTS={
 fairyTales:['Cinderella','Little Red Riding Hood','The Three Little Pigs','Goldilocks and the Three Bears','Jack and the Beanstalk','Hansel and Gretel','Rapunzel','Sleeping Beauty','Snow White','Rumpelstiltskin','The Frog Prince','The Gingerbread Man','The Ugly Duckling','The Emperor’s New Clothes','The Princess and the Pea','The Little Mermaid'],
 fables:['The Tortoise and the Hare','The Boy Who Cried Wolf','The Lion and the Mouse','The Ant and the Grasshopper'],
 settings:['a library after closing time','a train station in a storm','a village beside an enchanted forest','a school during a power cut','a space station far from Earth','a lighthouse on a remote island','a market just before sunset','a museum on a foggy morning','a campsite beside a river','a mountain village in winter','a castle with a missing tower','a quiet street where every clock has stopped'],
 characters:['a nervous apprentice','a curious traveller','a forgetful inventor','a determined student','a cautious explorer','a talking fox','a retired detective','a young gardener','a lonely robot','a messenger on their first delivery','a baker with a secret','a musician who has lost their confidence'],
 problems:['must return a mysterious parcel before midnight','finds a map that changes whenever they look away','hears a call for help but cannot find its source','accidentally swaps something precious for an ordinary object','must find a missing friend before a storm arrives','has promised to keep a secret that puts someone at risk','discovers that everyone else has forgotten the same important event','must solve a puzzle to open a locked box','loses the one object they need to complete an important task','needs help from someone they do not trust','must choose between taking a shortcut and keeping a promise','finds a note warning them not to go home'],
 goals:[
 {id:'guilty',label:'Make the character seem guilty',character:true,tip:'Use what the character does, avoids or notices. Let the reader infer guilt rather than simply naming it.'},
 {id:'nervous',label:'Make the character seem nervous',character:true,tip:'Choose small actions, hesitation or body language that suggest uncertainty.'},
 {id:'confident',label:'Make the character seem confident',character:true,tip:'Consider purposeful movement, deliberate actions and controlled phrasing.'},
 {id:'secretive',label:'Make the character seem secretive',character:true,tip:'Show what the character hides, checks or avoids saying.'},
 {id:'exhausted',label:'Make the character seem exhausted',character:true,tip:'Use movement, posture or sensory details to suggest tiredness.'},
 {id:'angry',label:'Make the character seem angry',character:true,tip:'Consider forceful verbs, restrained gestures or abrupt sentence rhythms.'},
 {id:'tense',label:'Create a tense tone',tip:'Choose details that suggest pressure or uncertainty. Try controlling pace and what the reader is allowed to know.'},
 {id:'eerie',label:'Create an eerie tone',tip:'Make a familiar detail slightly unsettling. Use sound, absence or unexpected stillness.'},
 {id:'hopeful',label:'Create a hopeful tone',tip:'Choose details that suggest possibility, relief or a change for the better.'},
 {id:'melancholic',label:'Create a melancholic tone',tip:'Use details and rhythms that suggest sadness, loss or longing.'},
 {id:'joyful',label:'Create a joyful tone',tip:'Choose lively verbs and details that suggest pleasure or delight.'},
 {id:'urgent',label:'Create a sense of urgency',tip:'Choose precise action verbs and consider shorter phrasing to increase pace.'},
 {id:'menacing',label:'Create a menacing tone',tip:'Suggest a threat through what is present, approaching or deliberately left unexplained.'}
 ],
 characterSentences:['The character walked into the room.','She opened the letter.','He looked across the field.','The character waited beside the door.','The character put the bag on the table.','The character answered the question.']
};
// Original summaries of common traditional versions; classes may know other endings.
window.WRITING_PROMPTS.retellingNotes={
'Cinderella':['A mistreated young woman hopes to attend a royal celebration.','Magical help lets her attend, but she must leave before midnight.','A lost slipper helps the prince find her; her circumstances change.'],
'Little Red Riding Hood':['A girl takes food to her grandmother.','A wolf deceives her and impersonates her grandmother.','The deception is discovered; in a common classroom version, help arrives.'],
'The Three Little Pigs':['Three pigs build homes from different materials.','A wolf destroys the less sturdy houses.','The pigs find safety in the brick house and defeat the wolf’s plan.'],
'Goldilocks and the Three Bears':['Three bears leave their house while their porridge cools.','Goldilocks enters, tries their belongings and falls asleep.','The bears return; Goldilocks wakes and runs away.'],
'Jack and the Beanstalk':['Jack exchanges a cow for magic beans.','A beanstalk leads to a giant’s home, where Jack takes valuable objects.','The giant pursues him; Jack cuts down the beanstalk and escapes.'],
'Hansel and Gretel':['Two children are abandoned in a forest.','A witch traps them in a house made of sweets.','They outwit the witch and find their way home.'],
'Rapunzel':['A young woman is kept in a tower by an enchantress.','A prince visits by climbing her long hair; their meetings are discovered.','After separation and hardship, Rapunzel and the prince reunite.'],
'Sleeping Beauty':['A princess receives gifts and a curse as a baby.','She pricks her finger and falls into an enchanted sleep.','The enchantment ends and the sleeping household wakes.'],
'Snow White':['A queen envies a young woman’s beauty.','Snow White finds refuge with seven dwarfs, but the queen brings a poisoned apple.','Snow White eventually awakens and the queen loses her power.'],
'Rumpelstiltskin':['A young woman is ordered to spin straw into gold.','A mysterious helper demands her future child as payment.','She discovers his name and avoids giving up her child.'],
'The Frog Prince':['A princess loses a golden ball in a pond.','A frog retrieves it in exchange for a promise of companionship.','The princess confronts her promise; the frog’s enchantment is broken.'],
'The Gingerbread Man':['A baked gingerbread figure comes to life and runs away.','People and animals chase him; he trusts a fox to help him cross water.','The fox tricks and eats him.'],
'The Ugly Duckling':['A young bird is mocked because he looks different.','He leaves and struggles to find belonging.','He discovers that he is a swan and finds acceptance.'],
'The Emperor’s New Clothes':['An emperor is persuaded to buy supposedly remarkable clothes.','Two cheats claim that only worthy people can see the fabric; adults pretend to see it.','A child points out that the emperor is wearing nothing.'],
'The Princess and the Pea':['A prince is searching for a princess.','A visitor is tested with a pea hidden under many mattresses.','Her discomfort persuades the household that she is a princess.'],
'The Little Mermaid':['A mermaid longs to join the human world.','She trades her voice for legs and faces a painful choice.','Endings vary: the Andersen story involves sacrifice and transformation; agree the version first.'],
'The Tortoise and the Hare':['A hare mocks a slow tortoise and agrees to a race.','The overconfident hare stops to rest while the tortoise continues.','The tortoise reaches the finish first.'],
'The Boy Who Cried Wolf':['A shepherd boy repeatedly raises a false alarm.','The villagers stop believing him.','When a wolf really comes, his warning is ignored.'],
'The Lion and the Mouse':['A lion spares a small mouse.','The lion later becomes trapped in a hunter’s net.','The mouse gnaws through the ropes and frees him.'],
'The Ant and the Grasshopper':['An ant stores food while a grasshopper enjoys the summer.','Winter comes and the grasshopper has no supplies.','The grasshopper asks for help; agree whether your version ends in refusal or assistance.']
};
window.WRITING_PROMPTS.sentenceReference=function(sentence,goal,difficulty){
 const base=sentence.replace(/[.!?]+$/,'');
 const endings={
 guilty:['Their eyes settled on the stain they had hoped nobody would notice.','They denied being there before anyone asked.'],
 nervous:['Their fingers worried the loose thread of a sleeve.','They counted each breath, trying to keep it steady.'],
 confident:['Their shoulders stayed level and their gaze did not waver.','They spoke without a moment’s hesitation.'],
 secretive:['One hand stayed over the folded note in their pocket.','They checked that nobody was listening before speaking.'],
 exhausted:['Their shoulders sagged with the effort of staying upright.','They tried to speak; even a single word felt heavy.'],
 angry:['Their jaw tightened until the words came out clipped and sharp.','Their sharp reply cut through the silence.'],
 tense:['Somewhere nearby, a lock clicked.','The stillness broke with a single knock.'],
 eerie:['The clock kept ticking, although its hands never moved.','A voice whispered a name from the empty corridor.'],
 hopeful:['Beyond the clouds, a thin line of sunlight appeared.','At last, there was a way forward.'],
 melancholic:['Everything was familiar except the absence of the person who once belonged there.','The silence lingered like the last note of a forgotten song.'],
 joyful:['Laughter burst out, bright and impossible to contain.','What a day to be alive!'],
 urgent:['There was no time left to wait.','A warning rang out and someone shouted, “Move!”'],
 menacing:['In the darkness, something waited.','The footsteps stopped just out of sight.']
 };
 const chosen=endings[goal?.id];
 const adapt=text=>{let result=text;if(/^She\b/.test(sentence))result=result.replace(/Their/g,'Her').replace(/their/g,'her').replace(/They/g,'She').replace(/they/g,'she');if(/^He\b/.test(sentence))result=result.replace(/Their/g,'His').replace(/their/g,'his').replace(/They/g,'He').replace(/they/g,'he');return result.charAt(0).toLowerCase()+result.slice(1);};
 const models=chosen?[
 {text:base+'; '+adapt(chosen[0]),why:'Keeps the starting sentence and adds a concrete detail or action. Ask which words suggest the goal and what the reader infers.'},
 {text:base+'; '+adapt(chosen[1]),why:'Keeps the starting sentence and tries a different image, voice or rhythm. Compare the effect rather than choosing the longest version.'}
 ]:[{text:base+', just as the lights went out.',why:'Adds a time clause that changes the circumstances and invites a question about what happens next.'},{text:'Without warning, '+base.charAt(0).toLowerCase()+base.slice(1)+'.',why:'Adds an opening phrase that frames the action as unexpected. Discuss whether that effect suits this scene.'}];
 return {type:'sentence',models,note:(goal?.id&&chosen?'Two possible directions towards “'+goal.label+'”. Each keeps the original action and adds a clause after a semicolon. Compare the effects, then try incorporating one detail with a phrase, verb or punctuation change.':'Two clause or phrase models. Adapt the content to your intended effect; these do not automatically fulfil a custom goal.')+(sentence.endsWith('.')?'':' Check how the punctuation and wording fit your starting sentence.')+' These are starting points for discussion, not prescribed answers. Check that new details fit the scene. Ask students to try a different structure rather than copying the semicolon pattern.',checks:['What was added or changed?','Which exact words create the effect?','Does it still make sense and remain grammatical?','Could fewer words achieve the same effect?']};
};
