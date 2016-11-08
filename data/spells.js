var Spells = {
  dart: {
    cost: 1,
    check: function (game) {
      return in_combat(game);
    },
    cast: function (game) {
      var damage = random(1, 4) + stat_bonus(game.data.character, "mind");
      var target = game.data.enemies[game.data.character.target || 0];
      if (target.shield > 0) {
        game.print("You gather your magic in a blue dart of energy and throw it at the " + target.name + ", but it splashes harmlessly against " + target.possessive_pronoun + " shield.");
      } else {
        game.print("You gather your magic in a blue dart of energy and throw it at the " + target.name + ", dealing " + damage + " damage.");
        target.hit_points -= damage;
      }
    }
  },
  light: {
    cost: 1,
    check: function (game) {
      return true;
    },
    cast: function (game) {
      if (game.data.scene === "Fighting") {
        game.print("You snap your fingers, pouring even more magic into the light you summoned, making it glow briefly like the sun.");
        for (var i = 0; i < game.data.enemies.length; i++) {
          var mob = game.data.enemies[i];
          if (roll_under(mob.stats.body) < 0) {
            if (!has_condition(mob, "dazzled")) {
              game.print("The " + mob.name + " is dazzled by it.");
              mob.conditions.push("dazzled");
            }
          }
        }
      } else if (game.data.level > 0) {
        game.print("You snap your fingers, pouring even more magic into the light you summoned, making it glow briefly like the sun, piercing the darkness that envelops the dungeon.");
        random_encounter(game);
      } else {
        game.print("You snap your fingers, conjuring a small ball of light.");
      }
    }
  },
  heal: {
    cost: 2,
    check: function (game) {
      return true;
    },
    cast: function (game) {
      var healed = random(1, 6) + stat_bonus(game.data.character, "mind");
      game.print("You gather your magic about you and a white light envelops your body, soothing your pains and mending your wounds.");
      game.print("You regain " + healed + " hit points.");
      heal(game.data.character, healed);
    }
  },
  "animate dead": {
    cost: 8,
    check: function (game) {
      return out_of_combat(game);
    },
    cast: function (game) {
      game.print("You concentrate and project your magic outwards, seeking a suitable vessel for it.");
      var summon = shallow_clone(Monsters[random_monster(game, "animate dead")]);
      var animated_count = 0, oldest = null;
      for (var i = 0; i < game.data.summons.length; i++) {
        if (has_tag(game.data.summons[i], "animate_dead")) {
          if (oldest === null) {
            oldest = i;
          }
          animated_count++;
        }
      }
      if (animated_count > 3 + stat_bonus(game.data.character, "mind")) {
        var destroyed = game.data.summons[oldest];
        game.print("Your concentration wavers, and " + destroyed.article + " " + destroyed.name + " loses " + destroyed.possessive_pronoun + " animating force, reverting back to a pile of remains.");
        game.data.summons.splice(oldest, 1);
      }
      game.print(summon.article.capitalizeFirstLetter() + " " + summon.name + " rattles " + summon.reflexive_pronoun + " back together and stands up shakily to follow you.");
      game.data.summons.push(summon);
    }
  },
  recall: {
    cost: 4,
    check: function (game) {
      return true;
    },
    cast: function (game) {
      game.print("You gather your magic about you and, focusing on the image of your camp, <em>bend</em> the world around you.");
      game.goto("AtTheCamp");
      game.level = 0;
    }
  }
}