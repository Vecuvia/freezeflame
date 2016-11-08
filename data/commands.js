var CommandAliases = {
  invoke: "cast",
  chant: "cast",
  ponder: "think",
  remember: "think",
  equip: "use",
  unequip: "remove",
  i: "inventory",
  inv: "inventory",
  killed: "slain",
  score: "sheet",
  stats: "sheet"
};

var Commands = {
  cast: function (game, param) {
    if (Spells[param] && spell_known(game.data.character, param)) {
      if (costs_mana(game, game.data.character, Spells[param].cost) && Spells[param].check(game)) {
        if (skill_roll(game, game.data.character, param)) {
          Spells[param].cast(game);
        } else {
          game.print("Your try summoning your magic, but your spell fizzles in a shower of sparks.");
        }
      }
    } else {
      game.print("You don't know that spell.");
    }
  },
  think: function (game, param) {
    if (Knowledge[param] && snippet_known(game.data.character, param)) {
      game.print(Knowledge[param]);
    } else {
      game.print("You don't know anything about it.");
    }
    return true;
  },
  look: function (game, param) {
    Scenes[game.data.scene].describe(game);
    return true; //Takes no time
  },
  use: function (game, param) {
    var item_index = parseInt(param) - 1;
    var item = game.data.character.items[item_index];
    if (item) {
      if (Items[item.id].use(game, game.data.character, item)) {
        game.data.character.items.splice(item_index, 1);
      }
    } else {
      game.print("You aren't carrying that.");
    }
  },
  drop: function (game, param) {
    var item_index = parseInt(param) - 1;
    var item = game.data.character.items[item_index];
    if (item) {
      game.print("You leave the " + item.name + " behind.");
      game.data.character.items.splice(item_index, 1);
      if (game.data.scene === "AtTheCamp") {
        game.data.camp.items.push(item);
      }
    } else {
      game.print("You aren't carrying that.");
    }
  },
  remove: function (game, param) {
    unequip(game, game.data.character, param);
  },
  inventory: function (game, param) {
    game.print("Inventory", "<h3>");
    game.print("You have " + game.data.character.gold + " gold coin" + (game.data.character.gold > 1?"s":"") + ".");
    game.print("You are wielding " + describe_equip(game.data.character, "weapon") + ".");
    game.print("You are wearing " + describe_equip(game.data.character, "armour") + ".");
    game.print("Around your neck is " + describe_equip(game.data.character, "amulet") + ".");
    var inventory_list = $("<ol>");
    for (var i = 0; i < game.data.character.items.length; i++) {
      var item = game.data.character.items[i];
      inventory_list.append($("<li>").html(
        item_symbol(item) + " " + describe_item(item)
      ));
    }
    $(game.output).append(inventory_list);
    return true;
  },
  sheet: function (game, param) {
    game.print(game.data.character.name, "<h3>");
    var character_sheet = $("<table>");
    character_sheet.addClass("character-sheet");
    character_sheet.append($("<tr>").append(
      $("<th>").html("Body"),
      $("<td>").html(game.data.character.stats.body),
      $("<td>").html("(" + game.data.character.hit_points + " HP)")
    ));
    character_sheet.append($("<tr>").append(
      $("<th>").html("Grace"),
      $("<td>").html(game.data.character.stats.grace)
    ));
    character_sheet.append($("<tr>").append(
      $("<th>").html("Mind"),
      $("<td>").html(game.data.character.stats.mind),
      $("<td>").html("(" + game.data.character.mana_points + " MP)")
    ));
    $(game.output).append(character_sheet);
    game.print("Skills and spells", "<h4>");
    var skill_list = $("<ul>");
    for (skill in game.data.character.skills) {
      var skill_object = game.data.character.skills[skill];
      var level = skill_object.level;
      var to_next = Math.floor(skill_object.exp / (Skills[skill].base_exp * Math.pow(Skills[skill].increase, level)) * 100);
      skill_list.append($("<li>").html(
        skill + (Skills[skill].stat ? " (" + Skills[skill].stat + (level >= 0 ? "+" : "") + level + ")" : "") + " - " + skill_level(game.data.character, skill) + " [" + to_next + "%]"
      ));
    }
    $(game.output).append(skill_list);
    return true;
  },
  slain: function (game, param) {
    game.print("Monsters slain", "<h3>");
    var monster_list = $("<ul>");
    for (monster in game.data.character.killed) {
      var killed = game.data.character.killed[monster];
      monster_list.append($("<li>").html(
        killed + " " + (killed > 1 ? Monsters[monster].plural : Monsters[monster].name)
      ));
    }
    $(game.output).append(monster_list);
    return true;
  },
  save: function (game, param) {
    localStorage[game.name + "-save"] = JSON.stringify(game.data);
    game.print("Saved.");
    return true;
  }
};

Commands.debug = function (game, param) {
  switch (param) {
    case "combat loop":
      for (var i=0; i < 2; i++) {
        game.data.enemies.push(shallow_clone(Monsters[random_monster(game)]));
      }
      game.goto("Fighting");
      break;
    default:
      break;
  }
};