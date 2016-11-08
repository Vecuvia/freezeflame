function dummy_ai (game, self, summoned) {}

function simple_ai (game, self, summoned) {
  var attacked;
  if (!summoned) {
    attacked = game.data.character;
    if (game.data.summons.length > 0) {
      attacked = find_weakest(game.data.summons);
    }
  } else {
    attacked = find_weakest(game.data.enemies);
  }
  if (attacked) {
    attack(game, self, attacked);
  }
}

var Monsters = {
  largeMaggot: {
    id: "largeMaggot",
    name: "large maggot",
    plural: "large maggots",
    article: "a",
    pronoun: "it",
    possessive_pronoun: "its",
    reflexive_pronoun: "itself",
    description: "An huge, pale, white maggot is crawling towards you. It opens its toothed maw as it coils, preparing to jump.",
    tags: ["dungeon", "vermin"],
    chances: 10,
    min_level: 1,
    max_level: 5,
    stats: {
      body: 2,
      grace: 9,
      mind: 1
    },
    hit_points: 2,
    mana_points: 1,
    skills: {
      brawling: {level: 2, exp: 0}
    },
    weapon: null,
    unarmed: {
      name: "maw",
      damage_min: 1,
      damage_max: 6
    },
    armour: null,
    skin: {
      name: "slimy skin",
      absorb: 0
    },
    shield: 0,
    amulet: null,
    target: null,
    knowledge: [],
    soul_chance: 2,
    soul: 1,
    gold_min: 0,
    gold_max: 0,
    drop_chance: 0,
    drops: [],
    ai: simple_ai,
    conditions: []
  },
  rat: {
    id: "rat",
    name: "rat",
    plural: "rats",
    article: "a",
    pronoun: "it",
    possessive_pronoun: "its",
    reflexive_pronoun: "itself",
    description: "A large black rat is standing in one of the corridors, frothing at the mouth as it stares at you with beady red eyes.",
    tags: ["dungeon", "vermin"],
    chances: 15,
    min_level: 0,
    max_level: 7,
    stats: {
      body: 4,
      grace: 10,
      mind: 3
    },
    hit_points: 4,
    mana_points: 3,
    skills: {
      brawling: {level: 2, exp: 0}
    },
    weapon: null,
    unarmed: {
      name: "teeth",
      damage_min: 1,
      damage_max: 6
    },
    armour: null,
    skin: {
      name: "hide",
      absorb: 0
    },
    shield: 0,
    amulet: null,
    target: null,
    knowledge: [],
    soul_chance: 5,
    soul: 1,
    gold_min: 0,
    gold_max: 0,
    drop_chance: 0,
    drops: [],
    ai: simple_ai,
    conditions: []
  },
  goblin: {
    id: "goblin",
    name: "goblin",
    plural: "goblins",
    article: "a",
    pronoun: "him",
    possessive_pronoun: "his",
    reflexive_pronoun: "himself",
    description: "A goblin comes out of the darkness of the dungeon, his short, stained blade raised menacingly.",
    tags: ["dungeon", "humanoid"],
    chances: 10,
    min_level: 3,
    max_level: 10,
    stats: {
      body: 7,
      grace: 11,
      mind: 8
    },
    hit_points: 7,
    mana_points: 8,
    skills: {
      sword: {level: 2, exp: 0}
    },
    weapon: {
      name: "short blade",
      skill: "sword",
      damage_min: 1,
      damage_max: 6,
      bonus: 0
    },
    unarmed: {
      name: "fists",
      damage_min: 1,
      damage_max: 6
    },
    armour: null,
    skin: {
      name: "skin",
      absorb: 0
    },
    shield: 0,
    amulet: null,
    target: null,
    knowledge: [],
    soul_chance: 10,
    soul: 3,
    gold_min: 1,
    gold_max: 5,
    drop_chance: 0,
    drops: [],
    ai: simple_ai,
    conditions: []
  },
  largeGoblin: {
    id: "largeGoblin",
    name: "large goblin",
    plural: "large goblins",
    article: "a",
    pronoun: "him",
    possessive_pronoun: "his",
    reflexive_pronoun: "himself",
    description: "A large, well-muscled goblin comes out of the darkness of the dungeon, his heavy, serrated blade raised menacingly.",
    tags: ["dungeon", "humanoid"],
    chances: 8,
    min_level: 4,
    max_level: 11,
    stats: {
      body: 9,
      grace: 10,
      mind: 8
    },
    hit_points: 9,
    mana_points: 8,
    skills: {
      sword: {level: 2, exp: 0}
    },
    weapon: {
      name: "short blade",
      skill: "sword",
      damage_min: 2,
      damage_max: 6,
      bonus: 0
    },
    unarmed: {
      name: "fists",
      damage_min: 1,
      damage_max: 6
    },
    armour: null,
    skin: {
      name: "skin",
      absorb: 0
    },
    shield: 0,
    amulet: null,
    target: null,
    knowledge: [],
    soul_chance: 10,
    soul: 4,
    gold_min: 3,
    gold_max: 10,
    drop_chance: 0,
    drops: [],
    ai: simple_ai,
    conditions: []
  },
  ratSkeleton: {
    id: "ratSkeleton",
    name: "rat skeleton",
    plural: "rat skeletons",
    article: "a",
    pronoun: "it",
    possessive_pronoun: "its",
    reflexive_pronoun: "itself",
    description: "The skeleton of a large rat stands in one of the corridors, blue light dancing in its eye sockets.",
    tags: ["dungeon", "undead", "animate dead"],
    chances: 5,
    min_level: 1,
    max_level: 10,
    stats: {
      body: 6,
      grace: 11,
      mind: 3
    },
    hit_points: 6,
    mana_points: 3,
    skills: {
      brawling: {level: 2, exp: 0}
    },
    weapon: null,
    unarmed: {
      name: "teeth",
      damage_min: 1,
      damage_max: 6
    },
    armour: null,
    skin: {
      name: "bones",
      absorb: 0
    },
    shield: 0,
    amulet: null,
    target: null,
    knowledge: [],
    soul_chance: 0,
    soul: 0,
    gold_min: 0,
    gold_max: 0,
    drop_chance: 0,
    drops: [],
    ai: simple_ai,
    conditions: []
  },
  goblinSkeleton: {
    id: "goblinSkeleton",
    name: "goblin skeleton",
    plural: "goblin skeletons",
    article: "a",
    pronoun: "it",
    possessive_pronoun: "its",
    reflexive_pronoun: "itself",
    description: "The skeleton of a goblin stands in one of the corridors, blue light dancing in its eye sockets.",
    tags: ["dungeon", "undead", "animate dead"],
    chances: 4,
    min_level: 3,
    max_level: 15,
    stats: {
      body: 9,
      grace: 11,
      mind: 3
    },
    hit_points: 9,
    mana_points: 3,
    skills: {
      brawling: {level: 2, exp: 0}
    },
    weapon: null,
    unarmed: {
      name: "fists",
      damage_min: 1,
      damage_max: 6
    },
    armour: null,
    skin: {
      name: "bones",
      absorb: 0
    },
    shield: 0,
    amulet: null,
    target: null,
    knowledge: [],
    soul_chance: 0,
    soul: 0,
    gold_min: 0,
    gold_max: 0,
    drop_chance: 0,
    drops: [],
    ai: simple_ai,
    conditions: []
  },
  dummyMonster: {
    id: "dummyMonster",
    name: "dummy",
    pronoun: "it",
    possessive_pronoun: "its",
    reflexive_pronoun: "itself",
    description: "It's a dummy monster that you'll never see in the game.",
    tags: ["tag"],
    chances: 0,
    min_level: 0,
    max_level: 0,
    stats: {
      body: 10,
      grace: 10,
      mind: 10
    },
    hit_points: 10,
    mana_points: 10,
    skills: {},
    weapon: null,
    unarmed: {
      name: "fists",
      damage_min: 0,
      damage_max: 0
    },
    armour: null,
    skin: {
      name: "straw",
      absorb: 0
    },
    shield: 0,
    amulet: null,
    target: null,
    knowledge: [],
    soul_chance: 0,
    soul: 0,
    gold_min: 0,
    gold_max: 0,
    drop_chance: 0,
    drops: [],
    ai: dummy_ai,
    conditions: []
  }
}