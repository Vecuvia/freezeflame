var Skills = {
  dodge: {
    tags: ["combat"],
    has_default: true,
    default: 0,
    derived_stat: function (mobile) {
      return Math.floor(mobile.stats.grace / 2) + 3;
    },
    stat: null,
    base_exp: 40,
    increase: 2
  },
  brawling: {
    tags: ["combat"],
    has_default: true,
    default: -2,
    derived_stat: null,
    stat: "grace",
    base_exp: 20,
    increase: 2
  },
  dagger: {
    tags: ["combat"],
    has_default: true,
    default: -2,
    derived_stat: null,
    stat: "grace",
    base_exp: 20,
    increase: 2
  },
  mace: {
    tags: ["combat"],
    has_default: true,
    default: -2,
    derived_stat: null,
    stat: "grace",
    base_exp: 20,
    increase: 2
  },
  sword: {
    tags: ["combat"],
    has_default: true,
    default: -2,
    derived_stat: null,
    stat: "grace",
    base_exp: 20,
    increase: 2
  },
  staff: {
    tags: ["combat"],
    has_default: true,
    default: -2,
    derived_stat: null,
    stat: "grace",
    base_exp: 20,
    increase: 2
  },
  dart: {
    tags: ["spell"],
    has_default: false,
    default: -2,
    derived_stat: null,
    stat: "mind",
    base_exp: 20,
    increase: 2
  },
  light: {
    tags: ["spell"],
    has_default: false,
    default: -2,
    derived_stat: null,
    stat: "mind",
    base_exp: 20,
    increase: 2
  },
  heal: {
    tags: ["spell"],
    has_default: false,
    default: 0,
    derived_stat: null,
    stat: "mind",
    base_exp: 20,
    increase: 2
  },
  "animate dead": {
    tags: ["spell"],
    has_default: false,
    default: -2,
    derived_stat: null,
    stat: "mind",
    base_exp: 20,
    increase: 2
  },
  dummySkill: {
    tags: [],
    has_default: true,
    default: -2,
    derived_stat: null,
    stat: "mind",
    base_exp: 20,
    increase: 2
  }
}