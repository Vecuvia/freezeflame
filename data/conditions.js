var Conditions = {
  dazzled: {
    skill_bonus: function (skill) {
      if (has_tag(skill, "combat")) {
        return -1;
      }
      return 0;
    },
    every_turn: function (game, mobile) {
      if (random(1, 100) < 33) {
        mobile.conditions = mobile.conditions.filter(function (element) {
          return element !== "dazzled";
        });
        if (mobile.player) {
          game.print("You blink - you are not dazzled anymore.");
        } else {
          game.print("The " + mobile.name + " blinks - " + mobile.pronoun + " is not dazzled anymore.");
        }
      }
    },
    every_hour: function (game, mobile) {}
  },
  natural_healing: {
    skill_bonus: function (skill) { return 0; },
    every_turn: function (game, mobile) {},
    every_hour: function (game, mobile) {
      if (random(1, 100) < 4 + stat_bonus(mobile, "body")) {
        heal(mobile, Math.floor(mobile.stats.body / 10) || 1);
      }
    }
  },
  natural_regen: {
    skill_bonus: function (skill) { return 0; },
    every_turn: function (game, mobile) {},
    every_hour: function (game, mobile) {
      regen(mobile, Math.floor(mobile.stats.mind / 10) || 1);
    }
  },
}