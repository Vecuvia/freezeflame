var Items = {
  dagger: {
    id: "dagger",
    tags: ["dungeon"],
    chances: 25,
    min_level: 1,
    max_level: 25,
    gold: 10,
    article: "a",
    name: "dagger",
    kind: "weapon",
    skill: "dagger",
    magical: false,
    bonus: 0,
    damage_min: 1,
    damage_max: 4,
    use: equip,
    variant: function (game, self) {
      magical_item(game, self);
    }
  },
  club: {
    id: "dagger",
    tags: ["dungeon"],
    chances: 30,
    min_level: 1,
    max_level: 25,
    gold: 5,
    article: "a",
    name: "club",
    kind: "weapon",
    skill: "mace",
    magical: false,
    bonus: 0,
    damage_min: 1,
    damage_max: 6,
    use: equip,
    variant: function (game, self) {
      magical_item(game, self);
    }
  },
  shortsword: {
    id: "shortsword",
    tags: ["dungeon"],
    chances: 15,
    min_level: 1,
    max_level: 25,
    gold: 50,
    article: "a",
    name: "shortsword",
    kind: "weapon",
    skill: "sword",
    magical: false,
    bonus: 0,
    damage_min: 2,
    damage_max: 7,
    use: equip,
    variant: function (game, self) {
      magical_item(game, self);
    }
  },
  longsword: {
    id: "longsword",
    tags: ["dungeon"],
    chances: 10,
    min_level: 1,
    max_level: 25,
    gold: 100,
    article: "a",
    name: "long sword",
    kind: "weapon",
    skill: "sword",
    magical: false,
    bonus: 0,
    damage_min: 3,
    damage_max: 8,
    use: equip,
    variant: function (game, self) {
      magical_item(game, self);
    }
  },
  leatherJerkin: {
    id: "leatherJerkin",
    tags: ["dungeon"],
    chances: 15,
    min_level: 1,
    max_level: 12,
    gold: 25,
    article: "a",
    name: "leather jerkin",
    kind: "armour",
    magical: false,
    bonus: 0,
    absorb: 1,
    use: equip,
    variant: function (game, self) {
      magical_item(game, self);
    }
  },
  boiledLeather: {
    id: "boiledLeather",
    tags: ["dungeon"],
    chances: 10,
    min_level: 1,
    max_level: 15,
    gold: 50,
    article: "a",
    name: "boiled leather cuirass",
    kind: "armour",
    magical: false,
    bonus: 0,
    absorb: 2,
    use: equip,
    variant: function (game, self) {
      magical_item(game, self);
    }
  },
  dummyItem: {
    id: "dummyItem",
    tags: ["tag"],
    chances: 0,
    min_level: 0,
    max_level: 0,
    gold: 0,
    article: "a",
    name: "dummy item",
    kind: "other",
    magical: false,
    use: function (game, mobile, self) {
      return true;
    },
    variant: function (self) {}
  }
}