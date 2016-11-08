# Freezeflame

- [ ] Refactor damage dealing/showing code to be more accessible and versatile
      (for example, to more easily create spells/specials that skip shield or
       armour)
- [x] Create `wield`, `don`, `sheathe` and `doff` functions
- [x] Add saved games and implement saving and loading
- [x] Implement inventory management
- [x] Add camp and rest
  - [ ] Possibly require food to rest
  - [ ] Require satiation to rest properly
- [x] Describe summons function
- [u] `grimory`/`spells` command
- [x] `stats`/`sheet`/`score` command
      2016-11-05T17:26 FIXED
- [ ] `help` command
  - [ ] Helpfiles with aliases
- [x] `slain`/`killed` command
      2016-11-05T06:14 FIXED
- [ ] Replace "skin" with "old robes" for the player, or otherwise show it 
      as such in the inventory listing. #cosmetic
- [x] Fix loop when fleeing with more than two monsters in combat
      2016-11-05T06:04 FIXED - I was re-initializing the variable `i` to 0
      inside the for loop, thus causing the crash
- [x] Scene stack and `game.back()` function for easy fights outside the 
       **Exploring** scene.
      2016-11-05T12:44 FIXED
- [x] Random encounter when casting **light** in the dungeon
      2016-11-05T12:16 FIXED
- [x] Getting loot back from the camp
      2016-11-05T13:02 FIXED
- [ ] Summoning and necromancy
  - [x] Rat skeleton at the first level
  - [x] Goblin skeleton at the third level
        2016-11-05T14:46 FIXED
  - [ ] Orc skeleton at the fifth level
  - [ ] Ogre skeleton at the eight level
- [ ] More spells
  - [x] Animate dead spell
        2016-11-05T14:12 FIXED
  - [x] Heal spell
        2016-11-05T14:32 FIXED
  - [ ] Fireball spell
  - [ ] Recall spell
  - [ ] Read thoughts spell (steals snippets of knowledge/skills from mobs)
  - [ ] Slay vermin spell
  - [ ] Destroy undead spell
- [x] Rewrite attack/monsters AI to be side-independent
      2016-11-05T13:27 FIXED
- [ ] More monsters
  - [x] Rat
        2016-11-05T13:27 FIXED
  - [x] Goblin
        2016-11-05T13:39 FIXED
  - [x] Large goblin 
        2016-11-05T14:35 FIXED
  - [ ] Goblin shaman (spellcaster)
  - [ ] Orc
  - [ ] Ogre
  - [ ] Skeleton
  - [ ] Zombie
- [ ] More items
- [x] More combat skills
      2016-11-05T06:38 FIXED
- [ ] Special scenes #important
  - [x] Magic fountain (heal completely/damages the player, small chance of 
         increasing one of the stats)
        2016-11-05T14:04 FIXED
  - [ ] Library (find spellbooks and chance to learn new spells/snippets)
  - [x] Djinn (a wish can be used to improve one of the stats or get money)
        2016-11-05T14:11 FIXED
  - [ ] Trainer (pay money, increase one of your skills)
  - [ ] Pit that brings you one level down, dealing damage unless a mind and
         dodge roll is made.
  - [ ] Stumble upon the remains of some adventurer (items taken from bones 
         file or radom suit of armour and weapon)
- [ ] Slow transformations
  - [ ] Necromancers get pale skin, become skeletal and slowly lose body
  - [ ] Demon summoners get progressively more demoniac - claws, spaded tail
- [ ] Enchantment
- [ ] Going back to the town
  - [ ] Random encounters on the road (bandits & the like)
- [ ] Doing stuff in the town
  - [ ] Selling your loot
    - [ ] Limited amount of money going about in the town
    - [ ] `sell`/`buy` command in the marketplace
  - [ ] Joining other guilds
  - [ ] Learning other skills
  - [ ] Pickpocketing and justice system
- [ ] Pack animals
  - [ ] `load`/`unload` command
- [ ] Summons decay with time (they start with a counter that decreases by
       1 every hour passed, until it reaches 0)
- [ ] Bones files
- [x] Make textbox focus on page load
      2016-11-05T12:39 FIXED
- [x] Natural healing and regen for the player
      2016-11-05T13:02 FIXED - handled as a pair of conditions
- [x] Time advancement
      2016-11-05T13:40 FIXED
- [ ] Add monster drops
- [ ] Add vendor trash
- [x] Add chance of random encounter while ascending/descending
      2016-11-06T11:39 FIXED
- [x] Weather #cosmetic
      2016-11-05T20:04 FIXED
- [ ] Ground description #cosmetic
- [x] Try to use jQuery instead of Zepto to see if it works on HTML Viewer
      2016-11-05T11:53 DONE without any success at all
- [ ] More generic mobs
- [ ] Conversation trees
- [ ] Knowledge snippets aliases
- [ ] Moon phases