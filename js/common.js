var MAX_LEVEL = 25;
var STARTING_YEAR = 1022;
var DAYS_PER_YEAR = 360;
var STARTING_DAY = 1;
var STARTING_HOUR = 7;
var TOWN_STARTING_TOLL = 5;
var TOWN_STARTING_GOLD = 1000;

String.prototype.capitalizeFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

function handle (game, raw_command) {
  $(game.output).append($("<p>").append($("<em>").text(command)));
  var raw = raw_command.trim().toLowerCase();
  var splitPoint = raw.indexOf(" ");
  var command, param;
  if (splitPoint !== -1 ) {
    command = raw.slice(0, splitPoint);
    param = raw.slice(splitPoint + 1);
  } else {
    command = raw;
    param = "";
  }
  var played = false, take_no_time = false;
  if (game.data.playing) {
    if (command in CommandAliases) {
      command = CommandAliases[command];
    }
    if (command in Commands) {
      take_no_time = Commands[command](game, param);
      played = true;
    }
  }
  var scene = Scenes[game.data.scene];
  if (!played) {
    if (command in scene.aliases) {
      command = scene.aliases[command];
    }
    if (command in scene.commands) {
      take_no_time = scene.commands[command](game, param);
    } else {
      take_no_time = scene.default(game, raw_command);
    }
  }
  if (!take_no_time && scene === Scenes[game.data.scene]) {
    scene.post(game);
  }
}

function init_game_data (game) {
  game.data.year = STARTING_YEAR;
  game.data.day = STARTING_DAY;
  game.data.hour = STARTING_HOUR;
  game.data.weather = "clear";
  game.data.ground = null;
  game.data.character = {
    player: true,
    name: "",
    pronoun: "you",
    possessive_pronoun: "your",
    reflexive_pronoun: "yourself",
    stats: {
      body: 10,
      grace: 10,
      mind: 10
    },
    hit_points: 10,
    mana_points: 10,
    skills: {},
    items: [],
    gold: 0,
    killed: {},
    soul: 0,
    weapon: null,
    unarmed: {
      name: "fists",
      damage_min: 1,
      damage_max: 3
    },
    armour: null,
    skin: {
      name: "skin",
      absorb: 0
    },
    amulet: null,
    target: null,
    knowledge: [],
    conditions: ["natural_healing", "natural_regen"]
  };
  game.data.summons = [];
  game.data.enemies = [];
  game.data.camp = {
    items: []
  };
  game.data.town = {
    toll: TOWN_STARTING_TOLL,
    gold: TOWN_STARTING_GOLD
  };
  game.data.level = 0;
  game.data.max_level = 0;
}

function season (game) {
  return Math.floor((game.data.day + 45) / 90) % 4;
}

function describe_season (game) {
  switch (season(game)) {
    case 0: return "winter";
    case 1: return "spring";
    case 2: return "summer";
    case 3: return "autumn";
  }
}

function sunrise (game) {
  switch (season(game)) {
    case 0: return 8;
    case 1: return 7;
    case 2: return 6;
    case 3: return 7;
  }
}

function sunset (game) {
  switch (season(game)) {
    case 0: return 18;
    case 1: return 19;
    case 2: return 20;
    case 3: return 19;
  }
}

function is_day (game) {
  return game.data.hour >= sunrise(game) && game.data.hour <= sunset(game);
}

function sky_clear (game) {
  return game.data.weather === "clear" || game.data.weather === "overcast"
}

function describe_weather (game) {
  var out = "";
  if (is_day(game)) {
    if (sky_clear(game)) {
      if (game.data.hour >= 11 && game.data.hour <= 13) {
        out = "The sun is high in the " + game.data.weather + " sky";
      } else if (game.data.hour < 11) {
        out = "The sun is rising in the " + game.data.weather + " sky";
      } else {
        out = "The sun is setting in the " + game.data.weather + " sky";
      }
    } else {
      out = "The sun is hidden behind a thick layer of clouds"
    }
  } else {
    if (sky_clear(game)) {
      out = "The moon is high in the " + game.data.weather + " sky";
    } else {
      out = "The moon is hidden behind a thick layer of clouds";
    }
  }
  if (game.data.weather === "rainy") {
    out += ", and rain is pouring down";
  } else if (game.data.weather === "snowy") {
    out += ", and snow is drifting down";
  }
  out += ".";
  //TODO: describe the ground
  game.print(out);
}

function advance_time (game, hours) {
  for (var i = 0; i < hours; i++) {
    for (var j = 0; j < game.data.character.conditions.length; j++) {
      Conditions[game.data.character.conditions[j]].every_hour(game, game.data.character);
    }
    for (var j = 0; j < game.data.summons.length; j++) {
      var mob = game.data.summons[j];
      for (var k = 0; k < mob.conditions.length; k++) {
        Conditions[mob.conditions[k]].every_hour(game, mob);
      }
    }
    game.data.hour++;
    if (game.data.hour === sunrise(game) && has_tag(Scenes[game.data.scene], "outdoors")) {
      game.print("The sun rises from behind the mountains.");
    } else if (game.data.hour === sunset(game) && has_tag(Scenes[game.data.scene], "outdoors")) {
      game.print("The sun sets behind the mountains.");
    }
    if (random(1, 100) <= 4) {
      //TODO: change weather according to the seasons
    }
    if (game.data.hour > 24) {
      game.data.hour = 1;
      game.data.day++;
      if (game.data.day > DAYS_PER_YEAR) {
        game.data.day = 1;
        game.data.year++;
      }
    }
  }
}

function spell_known (mobile, spell) {
  return mobile.skills[spell] !== undefined;
}

function snippet_known (mobile, snippet) {
  return mobile.knowledge.includes(snippet);
}

function make_known (mobile, snippets) {
  for (var i = 0; i < snippets.length; i++) {
    var snippet = snippets[i];
    if (!mobile.knowledge.includes(snippet)) {
      mobile.knowledge.push(snippet);
    }
  }
}

function random (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function d6 () {
  return random(1, 6);
}

function stat_bonus (mobile, stat) {
  return Math.floor((mobile.stats[stat] - 10) / 2);
}

function skill_level (mobile, skill) {
  //console.log(mobile, skill);
  if (!(skill in mobile.skills)) {
    if (Skills[skill].has_default) {
      mobile.skills[skill] = {
        level: Skills[skill].default,
        exp: 0
      };
    } else {
      return null;
    }
  }
  var level = mobile.skills[skill].level, bonus = 0;
  for (var i = 0; i < mobile.conditions.length; i++) {
    bonus += Conditions[mobile.conditions[i]].skill_bonus(skill);
  }
  var stat;
  if (Skills[skill].derived_stat !== null) {
    stat = Skills[skill].derived_stat(mobile);
  } else {
    stat = mobile.stats[Skills[skill].stat];
  }
  return level + stat + bonus;
}

function weapon_skill (mobile) {
  if (mobile.weapon === null) {
    return "brawling";
  }
  return mobile.weapon.skill;
}

function weapon_damage (mobile) {
  if (mobile.weapon === null) {
    return random(mobile.unarmed.damage_min, mobile.unarmed.damage_max);
  }
  return random(mobile.weapon.damage_min, mobile.weapon.damage_max) + mobile.weapon.bonus;
}

function weapon_desc (mobile) {
  return mobile.weapon ? mobile.weapon.name : mobile.unarmed.name;
}

function armour_absorb (mobile) {
  return mobile.skin.absorb + (mobile.armour ? mobile.armour.absorb + mobile.armour.bonus : 0);
}

function armour_desc (mobile) {
  return mobile.armour ? mobile.armour.name : mobile.skin.name;
}

function costs_mana (game, mobile, amount) {
  if (mobile.mana_points >= amount) {
    mobile.mana_points -= amount;
    return true;
  } else {
    if (mobile.player) {
      game.print("You don't have enough mana.");
    }
    return false;
  }
}

function add_experience (game, mobile, skill, amount) {
  mobile.skills[skill].exp += amount;
  var to_next_level = Skills[skill].base_exp * Math.pow(Skills[skill].increase, mobile.skills[skill].level);
  while (mobile.skills[skill].exp >= to_next_level) {
    mobile.skills[skill].exp -= to_next_level;
    mobile.skills[skill].level++;
    to_next_level = Skills[skill].base_exp * Math.pow(Skills[skill].increase, mobile.skills[skill].level);
    if (mobile.player) {
      game.print("You feel more experienced in " + skill + ".");
    }
  }
}

function roll_under (target) {
  return target - (d6() + d6() + d6());
}

function skill_roll (game, mobile, skill) {
  var roll = d6() + d6() + d6();
  var level = skill_level(mobile, skill);
  if (level === null) {
    return null;
  }
  var result = {
    margin: level - roll,
    critical: false
  };
  switch (roll) {
    case 3:
      if (result.margin < 10) {
        result.margin = 10;
      }
      result.critical = true;
      break;
    case 18:
      if (result.margin > -10) {
        result.margin = -10;
      }
      result.critical = true;
      break;
  }
  if (result.critical) {
    add_experience(game, mobile, skill, Math.abs(result.margin));
  } else {
    add_experience(game, mobile, skill, 1);
  }
  return result;
}

function calculate_damage (defender, base_damage) {
  var effective_damage = base_damage, shield_loss = 0, armour = 0;
  if (defender.shield > 0) {
    shield_loss = Math.min(defender.shield, effective_damage);
    effective_damage -= shield_loss;
  }
  armour = Math.min(armour_absorb(defender), effective_damage);
  effective_damage -= armour;
  return {
    base: base_damage,
    effective: effective_damage,
    shield: shield_loss,
    armour: armour
  }
}

function injure (mobile, damage) {
  mobile.hit_points -= damage;
}

function attack (game, attacker, defender) {
  var attack = skill_roll(game, attacker, weapon_skill(attacker));
  if (attack.margin >= 0) {
    var defense = skill_roll(game, defender, "dodge");
    if (defense.margin >= 0) {
      //Defender dodges
      if (attacker.player) {
        game.print("You strike out at the " + defender.name + ", but " + defender.pronoun + " manages to dodge your attack.");
      } else {
        game.print("The " + attacker.name + " strikes out at " + (defender.player ? "you" : "the " + defender.name) + ", but " + defender.pronoun + " " + (defender.player ? "dodge" : "dodges") + " " + attacker.possessive_pronoun + " attack.");
      }
    } else {
      //Defender can't dodge
      var base_damage = Math.max(0, weapon_damage(attacker) + stat_bonus(attacker, "body") + Math.floor(attack.margin / 4));
      if (attack.critical) {
        base_damage *= 2;
      }
      var damage = calculate_damage(defender, base_damage);
      if (attacker.player) {
        game.print("You strike out at the " + defender.name + ", hitting for " + damage.base + " damage.");
      } else {
        game.print("The " + attacker.name + " strikes out at " + (defender.player ? "you" : "the " + defender.name) + ", hitting for " + damage.base + " damage.");
      }
      defender.shield -= damage.shield;
      if (defender.shield > 0) {
        game.print("The blow clatters ineffectually against " + defender.possessive_pronoun + " shield.");
      } else if (damage.shield > 0) {
        game.print("The blow hits " + defender.possessive_pronoun + " shield, shattering it.");
      }
      if (damage.armour > 0) {
        if (damage.effective <= 0) {
          game.print("The blow clatters ineffectually against " + defender.possessive_pronoun + " " + armour_desc(defender) + ".");
        } else {
          game.print("The blow hits " + defender.possessive_pronoun + " " + armour_desc(defender) + ", piercing it.");
        }
      }
      if (damage.effective > 0) { 
        defender.hit_points -= damage.effective;
        if (damage.effective !== damage.base) {
          if (defender.player) {
            game.print("You lose " + damage.effective + " hit points.");
          } else {
            game.print("The " + defender.name + " loses " + damage.effective + " hit points.");
          }
        }
      }
    }
  } else {
    //Attack misses
    if (attacker.player) {
      game.print("You strike out at the " + defender.name + ", but miss.");
    } else {
      game.print("The " + attacker.name + " strikes out at " + (defender.player ? "you" : "the " + defender.name) + ", but misses.");
    }
    if (attack.critical) {
      game.print("Further, " + attacker.pronoun + " " + (attacker.player ? "injure": "injures") + " " + attacker.reflexive_pronoun + ".");
    }
  }
}

function descend (game, safe) {
  game.data.level++;
  game.data.max_level = Math.max(game.data.level, game.data.max_level);
  game.data.level = Math.min(game.data.level, MAX_LEVEL);
  if (safe || !random_encounter(game)) {
    game.goto("Exploring");
  }
}

function ascend (game, safe) {
  game.data.level--;
  if (game.data.level === 0) {
    game.goto("AtTheEntrance");
  } else {
    if (safe || !random_encounter(game)) {
      game.goto("Exploring");
    }
  }
}

function found_chance (game, progressive) {
  progressive = progressive === undefined ? 1 : progressive;
  return (game.data.level * 3 + 25) / progressive;
}

function has_tag (object, tag) {
  return object.tags && object.tags.includes(tag);
}

function quality (object, what) {
  return object.qualities && object.qualities[what];
}

function shallow_clone (object) {
  var new_object = {};
  for (prop in object) {
    new_object[prop] = object[prop];
  }
  return new_object;
}

function random_out_of (game, list, tag) {
  var possible_objects = [];
  if (tag === undefined) {
    tag = "dungeon";
  }
  for (object in list) {
    if (has_tag(list[object], tag) && list[object].min_level <= game.data.level && list[object].max_level >= game.data.level) {
      possible_objects.push(object);
    }
  }
  return possible_objects[random(0, possible_objects.length - 1)];
}

function random_monster (game, tag) {
  return random_out_of(game, Monsters, tag);
}

function random_loot (game, tag) {
  return random_out_of(game, Items, tag);
}

function random_special (game, tag) {
  return random_out_of(game, Scenes, tag);
}

function find_weakest (list) {
  var min_hp = 1000, weakest = null;
  for (var i = 0; i < list.length; i++) {
    if (list[i].hit_points < min_hp) {
      min_hp = list[i].hit_points;
      weakest = list[i];
    }
  }
  return weakest;
}

function alive (mobile) {
  return mobile.hit_points > 0;
}

function clear_dead (list, callback) {
  var i = 0;
  while (i < list.length) {
    if (!alive(list[i])) {
      callback(list[i]);
      list.splice(i, 1);
    } else {
      i++;
    }
  }
}

function ordinal (number) {
  switch (number % 10) {
    case 1:
      return number + "st";
    case 2:
      return number + "nd";
    case 3:
      return number + "rd";
    default:
      return number + "th";
  }
}

function enemy_slain (game) {
  return function (mobile) {
    game.print("The " + mobile.name + " is dead.");
    if (random(1, 100) < mobile.soul_chance) {
      game.print("You manage to keep ahold of a fragment of " + mobile.pronoun + " soul.");
      game.data.character.soul += mobile.soul;
    }
    var gold = random(mobile.gold_min, mobile.gold_max);
    if (gold > 0) {
      game.print(gold + " gold coin" + (gold > 1 ? "s" : "") + " clatter to the floor.");
      game.data.character.gold += gold;
    }
    if (mobile.id in game.data.character.killed) {
      game.data.character.killed[mobile.id]++;
    } else {
      game.data.character.killed[mobile.id] = 1;
    }
  }
}

function summon_slain (game) {
  return function (mobile) {
    game.print("Your " + mobile.name + " is dead.");
  }
}

function in_combat (game) {
  if (game.data.scene === "Fighting") {
    return true;
  } else {
    game.print("You must be in combat to cast this spell.");
    return false;
  }
}

function out_of_combat (game) {
  if (game.data.scene !== "Fighting") {
    return true;
  } else {
    game.print("You must be out of combat to cast this spell.");
    return false;
  }
}

function has_condition (object, condition) {
  return object.conditions.includes(condition);
}

function add_to_inventory (game, mobile, item) {
  if (mobile.items.length <= mobile.stats.body) {
    mobile.items.push(item);
    return true;
  } else {
    if (mobile.player) {
      game.print("You can't carry any more items.");
    }
    return false;
  }
}

Locations = [
  "an old barrel",
  "a treasure chest",
  "a battered chest"
]

function random_location () {
  return Locations[random(0, Locations.length - 1)];
}

function unequip (game, mobile, slot) {
  if (mobile[slot] !== null) {
    if (mobile.player) {
      switch (slot) {
        case "weapon":
          game.print("You sheathe your " + mobile[slot].name + ".");
          break;
        case "armour":
          game.print("You take off your " + mobile[slot].name + ".");
          break;
        case "amulet":
          game.print("You remove your " + mobile[slot].name + ".");
          break;
      }
    }
    add_to_inventory(game, mobile, mobile[slot]);
    mobile[slot] = null;
  }
}

function equip (game, mobile, item) {
  unequip(game, mobile, item.kind);
  if (mobile.player) {
    switch (item.kind) {
      case "weapon":
        game.print("You wield your " + item.name + ".");
        break;
      case "armour":
        game.print("You don your " + item.name + ".");
        break;
      case "amulet":
        game.print("You wear your " + item.name + ".");
        break;
      default:
        game.print("You don't have that equipped.");
        return false;
    }
    mobile[item.kind] = item;
  }
  return true;
}

function magical_item (game, item) {
  if (random(1, 100) < 5 * game.data.level) {
    item.bonus = random(1, Math.floor(game.level / 4));
    item.gold += 500 * Math.pow(2, item.bonus);
    item.magical = true;
  }
}

function item_symbol (item) {
  switch (item.kind) {
    case "weapon": return "/";
    case "armour": return "[";
    case "amulet": return "(";
    case "food": return "%";
  }
}

function describe_item (item) {
  var bonus = "";
  if (item.bonus > 0) {
    bonus = " +" + item.bonus;
  } else if (item.bonus < 0) {
    bonus = " " + item.bonus;
  }
  return item.article + " " + item.name + bonus;
}

function describe_equip (mobile, slot) {
  if (mobile[slot] === null) {
    switch (slot) {
      case "weapon":
        return mobile.possessive_pronoun + " " + mobile.unarmed.name;
      case "armour":
        return mobile.possessive_pronoun + " " + mobile.skin.name;
      case "amulet":
        return "nothing";
    }
  } else {
    return describe_item(mobile[slot]);
  }
}

function regen (mobile, amount) {
  mobile.mana_points += amount;
  if (mobile.mana_points > mobile.stats.mind) {
    mobile.mana_points = mobile.stats.mind;
  }
}

function heal (mobile, amount) {
  mobile.hit_points += amount;
  if (mobile.hit_points > mobile.stats.body) {
    mobile.hit_points = mobile.stats.body;
  }
}

function heal_completely (mobile) {
  mobile.hit_points = mobile.stats.body;
  mobile.mana_points = mobile.stats.mind;
}

function describe_summons (game) {
  if (game.data.summons.length > 0 ) {
    game.print("Following nearby:");
    var summons_list = $("<ul>");
    for (var i = 0; i < game.data.summons.length; i++) {
      var mob = game.data.summons[i];
      summons_list.append($("<li>").html(mob.article + " " + mob.name));
    }
    $(game.output).append(summons_list);
  }
}

function random_encounter (game) {
  var found, so_far = 1;
  while (random(1, 100) <= found_chance(game, so_far)) {
    game.data.enemies.push(shallow_clone(Monsters[random_monster(game)]));
    found = true;
    so_far++;
  }
  if (found) {
    game.goto("Fighting");
    return true;
  } else {
    return false;
  }
}

function log_error (error) {
  console.log(error);
}

function improve_stat (mobile, stat, maximum) {
  if (maximum === undefined || mobile.stats[stat] + 1 <= maximum) {
    mobile.stats[stat]++;
  }
}

function can_pay (game, amount) {
  if (game.data.character >= amount) {
    game.data.character -= amount;
    return true;
  } else {
    game.print("You don't have enough money.");
    return false;
  }
}