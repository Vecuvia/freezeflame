var Scenes = {
  StartingScene: {
    tags: ["system"],
    describe: function (game) {
      game.print("Freezeflame", "<h1>");
      game.print("You are a wizard - you pore over old tomes, study things man was not meant to know and summon powers that would make lesser people quake in their boots.");
      game.print("At least, you would if you knew how, but at the moment you are just another lowly apprentice.");
      game.print("Recently, you heard of the discovery of Freezeflame, the dungeon of Kidra, an old an infamous wizard that lived nearby three centuries ago, and you decided - against all counsel - to explore it, looking for his amulet, that was said to give extraordinary magical power to those who held it.");
      game.print("Press [ENTER] to continue...");
    },
    aliases: {},
    commands: {},
    default: function (game, command) {},
    post: function (game) {
      init_game_data(game);
      game.goto("GetName");
    }
  },
  LoadingScene: {
    tags: ["system"],
    describe: function (game) {
      game.print("A saved game was found. Do you want to load it?");
    },
    aliases: {
      y: "yes",
      n: "no"
    },
    commands: {
      yes: function (game, param) {
        try {
          game.data = JSON.parse(localStorage[game.name + "-save"]);
          Scenes[game.data.scene].describe(game);
        } catch (e) {
          if (e instanceof SyntaxError || e instanceof TypeError) {
            game.print("Saved game corrupted.");
            game.data = {
              scene: null,
              stack: []
            }
            game.goto("StartingScene");
          } else {
            log_error(e);
          }
        }
      },
      no: function (game, param) {
        game.goto("StartingScene");
      }
    },
    default: function (game, command) {},
    post: function (game) {}
  },
  GetName: {
    tags: ["system"],
    describe: function (game) {
      game.print("Character Creation", "<h2>");
      game.print("What's your name?");
    },
    aliases: {},
    commands: {},
    default: function (game, command) {
      if (command.length > 0) {
        game.data.character.name = command;
        game.goto("GetTalent");
      }
    },
    post: function (game) {}
  },
  GetTalent: {
    tags: ["system"],
    describe: function (game) {
      game.print("Are you <strong>stronger</strong>, <strong>faster</strong> or <strong>smarter</strong> than your peers?");
    },
    aliases: {},
    commands: {
      stronger: function (game, param) {
        game.data.character.stats.body += 2;
        game.goto("GetStudies");
      },
      faster: function (game, param) {
        game.data.character.stats.grace += 2;
        game.goto("GetStudies");
      },
      smarter: function (game, param) {
        game.data.character.stats.mind += 2;
        game.goto("GetStudies");
      }
    },
    default: function (game, command) {},
    post: function (game) {}
  },
  GetStudies: {
    tags: ["system"],
    describe: function (game) {
      game.print("What did you concentrate on during your studies? Did you learn <strong>healing</strong> magic, dabble in <strong>necromancy</strong> or study <strong>gates</strong>?");
    },
    aliases: {},
    commands: {
      healing: function (game, param) {
        game.data.character.skills.heal = {level: 2, exp: 0};
        game.goto("Arriving");
      },
      necromancy: function (game, param) {
        game.data.character.skills["animate dead"] = {level: 2, exp: 0};
        game.goto("Arriving");
      },
      gates: function (game, params) {
        game.data.character.skills.recall = {level: 2, exp: 0};
        game.goto("Arriving");
      }
    },
    default: function (game, command) {},
    post: function (game) {}
  },
  Arriving: {
    tags: ["system"],
    describe: function (game) {
      game.print("After saying goodbye to your few friends, you left your <em>town</em> behind you and started walking down the road to the <em>dungeon</em>.");
      game.print("You walked and walked and walked, until your feet blistered and night fell, but you finally got there, setting up your <em>camp</em> at some distance from the entrance, well hidden from the <strong>road</strong>.");
      make_known(game.data.character, ["town", "dungeon", "camp"]);
      game.data.character.skills.dart = {level: 2, exp:0};
      game.data.character.skills.light = {level: 2, exp:0};
      game.data.playing = true;
      game.goto("AtTheEntrance");
    },
    aliases: {},
    commands: {},
    default: function (game, params) {},
    post: function (game) {}
  },
  AtTheEntrance: {
    tags: ["system", "outdoors"],
    describe: function (game) {
      game.print("You stand before the huge doors to the <strong>dungeon</strong>, ready to push them open. You could return to your <strong>camp</strong> or go back on the <strong>road</strong>.");
      describe_weather(game);
      describe_summons(game);
    },
    aliases: {},
    commands: {
      road: function (game, param) {
        game.print("You go back on the road.");
        game.goto("OnTheRoad");
      },
      dungeon: function (game, param) {
        game.print("You stand your ground, spit on your hands and place them on the huge wooden doors to the dungeon. You push, and slowly they start moving.");
        game.goto("Descending");
      },
      camp: function (game, param) {
        game.print("You walk back to your camp.");
        game.goto("AtTheCamp");
      }
    },
    default: function (game, params) {},
    post: function (game) {}
  },
  AtTheCamp: {
    tags: ["system", "outdoors"],
    describe: function (game) {
      game.print("You stand in the middle of your camp. There is a fire pit in the middle, in front of your tent, with a small pile of firewood nearby. You could go back to the <strong>dungeon</strong> or enter your tent to <strong>rest</strong> for a while.");
      describe_weather(game);
      describe_summons(game);
      if (game.data.camp.items.length > 0) {
        game.print("Lying around your camp for you to <strong>get</strong> you can see:");
        var inventory_list = $("<ol>");
        for (var i = 0; i < game.data.camp.items.length; i++) {
          var item = game.data.camp.items[i];
          inventory_list.append($("<li>").html(
            item_symbol(item) + " " + describe_item(item)
          ));
        }
        $(game.output).append(inventory_list);
      }
    },
    aliases: {},
    commands: {
      dungeon: function (game, param) {
        game.print("You walk back to the entrance.");
        game.goto("AtTheEntrance");
      },
      rest: function (game, param) {
        game.print("You enter your tent and are sleeping as soon as your head hits your pillow. You wake up in the morning, feeling healthy and well rested.");
        advance_time(game, 8);
      },
      get: function (game, param) {
        var item_index = parseInt(param) - 1;
        var item = game.data.camp.items[item_index];
        if (item) {
          if (add_to_inventory(game, game.data.character, item)) {
            game.print("You pick up the " + item.name + ".");
            game.data.camp.items.splice(item_index, 1);
          }
        } else {
          game.print("You don't see that here.");
        }
      }
    },
    default: function (game, param) {},
    post: function (game) {}
  },
  OnTheRoad: {
    tags: ["system", "outdoors"],
    describe: function (game) {
      game.print("You are standing on a dirt road, trees surrounding you on all sides, a trail through the woods leading to the <strong>dungeon</strong>. The road goes deeper in the <strong>forest</strong>, but you could back to the <strong>town</strong>.");
      describe_weather(game);
      describe_summons(game);
    },
    aliases: {},
    commands: {
      dungeon: function (game, param) {
        game.print("You walk back to the entrance to the dungeon.");
        game.goto("AtTheEntrance");
      },
      forest: function (game, param) {
        game.print("You walk to the north, the road quickly dwindling to a mere trail and then disappearing completely.");
        game.goto("InTheForest");
      },
      town: function (game, param) {
        game.print("You start walking to the south, in direction of the town. You walk and walk and walk and walk, until you finally arrive at the gates.");
        advance_time(game, 12);
        game.goto("AtTheTownGates");
      }
    },
    default: function (game, param) {},
    post: function (game) {}
  },
  InTheForest: {
    tags: ["system", "outdoors"],
    describe: function (game) {
      game.print("Tall, ancient trees surround you on all sides, and you can hear animal noises coming from deeper in the forest. You can go back to the <strong>road</strong>.");
      describe_weather(game);
      describe_summons(game);
    },
    aliases: {},
    commands: {
      road: function (game, param) {
        game.print("You find your way back to trail, following it until you reach the road.");
        game.goto("OnTheRoad");
      }
    },
    default: function (game, params) {},
    post: function (game) {}
  },
  AtTheTownGates: {
    tags: ["system", "outdoors"],
    describe: function (game) {
      game.print("You stand on the road just before the town gates. The two <strong>guards</strong> standing outside look at you suspiciously. You can go back towards the <strong>dungeon</strong> or <strong>enter</strong> the town.");
      describe_weather(game);
      describe_summons(game);
    },
    aliases: {},
    commands: {
      guards: function (game, param) {
        //TODO
      },
      dungeon: function (game, param) {
        game.print("You start walking to the north, in direction of the dungeon. You walk and walk and walk and walk, until you finally arrive next to the trail.");
        advance_time(game, 12);
        game.goto("OnTheRoad");
      },
      enter: function (game, param) {
        if (game.data.summons.length > 0) {
          game.print("One of the guard steps forwards, and eyeing your following says: \"No summons within the town walls.\"");
          game.print("You acquiesce, signaling " + (game.data.summons.length > 1 ? "them" : "your " + game.data.summons[0].name) + " to stand down.");
        }
        game.print("\"The toll is " + game.data.town.toll + " gold coins, to be paid upon entrance.\"");
        if (can_pay(game, game.data.town.toll)) {
          game.print("You pay the toll and the guards step aside, letting you through the gates.");
          game.data.town.gold += game.data.town.toll;
          game.goto("TownPlaza");
        } else {
          game.print("\"No money, no passage, sorry.\" says the nearby guard, shaking his head.");
        }
      }
    },
    default: function (game, param) {},
    post: function (game) {}
  },
  TownPlaza: {
    tags: ["system", "outdoors"],
    describe: function (game) {
      game.print("You stand in the middle of the town plaza, familiar locations surrounding you: the <strong>marketplace</strong>, the <strong>mages</strong> guild and the Boar's head <strong>inn</strong>. You can go back to the <strong>gates</strong>.");
      describe_weather(game);
    },
    aliases: {
      market: "marketplace",
      boar: "inn"
    },
    commands: {
      marketplace: function (game, param) {
        game.goto("You stroll down the plaza to the center of the marketplace.");
        game.goto("Marketplace");
      },
      mages: function (game, param) {
        game.goto("You walk to the doors to the mages guild.");
        game.goto("AtTheGuildDoors");
      },
      inn: function (game, param) {
        game.goto("You walk to the Boar's head inn and, pushing its door, enter.");
        game.goto("BoarsHeadInn");
      },
      gates: function (game, param) {
        game.goto("You walk out of the gates to the road outside.");
        game.goto("AtTheTownGates");
      }
    },
    default: function (game, param) {},
    post: function (game) {}
  },
  Marketplace: { /* TODO */ },
  AtTheGuildDoors: { /* TODO */},
  BoarsHeadInn: { /* TODO */},
  Descending: {
    tags: ["system"],
    describe: function (game) {
      game.print("As soon as you pass through them, the doors close behind you with a slam.");
      game.print("You snap your fingers, conjuring a small ball of light to guide your step, and start walking down the stairs to the dungeon proper, small <em>skeletons</em> crunching under your feet as you go.");
      make_known(game.data.character, ["skeletons"]);
      descend(game);
    },
    aliases: {},
    commands: {},
    default: function (game, params) {},
    post: function (game) {}
  },
  Exploring: {
    tags: ["system"],
    describe: function (game) {
      game.print("You are currently standing on the " + ordinal(game.data.level) + " level of the dungeon.");
      describe_summons(game);
      game.print("You could <strong>explore</strong> it, <strong>ascend</strong> back to the surface or <strong>descend</strong> further in its depths.");
    },
    aliases: {},
    commands: {
      explore: function (game, param) {
        game.print("You look around in the shadows surrounding you, trying to find something.");
        advance_time(game, 1);
        // Chance of items
        if (random(1, 100) <= found_chance(game, 1)) {
          if (random(1, 2) === 1) {
            var loot = shallow_clone(Items[random_loot(game)]);
            loot.variant(game, loot);
            console.log(loot);
            game.print("You find " + loot.article + " " + loot.name + " stashed away inside " + random_location());
            add_to_inventory(game, game.data.character, loot);
          } else {
            var booty = random(1, game.data.level * 5) * random(1, game.data.level * 2) + random(0, game.data.level * 5);
            game.print("You find " + booty + " gold coin" + (booty > 1?"s":"") + " stashed away inside " + random_location());
            game.data.character.gold += booty;
          }
        }
        // Chance of random encounter
        if (random(1, 100) <= 5) {
          game.goto(random_special(game));
        } else {
          random_encounter(game);
        }
      },
      ascend: function (game, param) {
        game.print("You trudge up the stairs.");
        advance_time(game, 1);
        ascend(game);
      },
      descend: function (game, param) {
        game.print("You trudge down the stairs.");
        advance_time(game, 1);
        descend(game);
      }
    },
    default: function (game, params) {},
    post: function (game) {}
  },
  Fighting: {
    tags: ["system"],
    describe: function (game) {
      for (var i = 0; i < game.data.enemies.length; i++) {
        game.print(game.data.enemies[i].description);
      }
      game.print("You can <strong>attack</strong>, <strong>cast</strong> a spell or try to <strong>flee</strong>.");
    },
    aliases: {},
    commands: {
      attack: function (game, param) {
        if (param) {
          var new_target = parseInt(param);
          if (new_target && new_target >= 0 && new_target < game.data.enemies.length) {
            game.character.target = new_target;
          }
        } else if (game.data.character.target === null || game.data.character.target >= game.data.enemies.length) {
          game.data.character.target = 0;
        }
        attack(game, game.data.character, game.data.enemies[game.data.character.target]);
      },
      flee: function (game, param) {
        var i = 0;
        while (i < game.data.enemies.length) {
          var mob = game.data.enemies[i];
          if (roll_under(game.data.character.stats.grace) > roll_under(mob.stats.grace)) {
            game.print("You manage to leave the " + mob.name + " behind.");
            game.data.enemies.splice(i, 1);
          } else {
            i++;
          }
        }
      }
    },
    default: function (game, params) {},
    post: function (game) {
      for (var i = 0; i < game.data.character.conditions.length; i++) {
        Conditions[game.data.character.conditions[i]].every_turn(game, game.data.character);
      }
      clear_dead(game.data.enemies, enemy_slain(game));
      for (var i = 0; i < game.data.summons.length; i++) {
        var mob = game.data.summons[i];
        Monsters[mob.id].ai(game, mob, true);
        for (var j = 0; j < mob.conditions.length; j++) {
          Conditions[mob.conditions[i]].every_turn(game, mob);
        }
        clear_dead(game.data.enemies, enemy_slain(game));
      }
      for (var i = 0; i < game.data.enemies.length; i++) {
        var mob = game.data.enemies[i];
        Monsters[mob.id].ai(game, mob, false);
        for (var j = 0; j < mob.conditions.length; j++) {
          Conditions[mob.conditions[i]].every_turn(game, mob);
        }
        clear_dead(game.data.summons, summon_slain(game));
      }
      if (game.data.enemies.length === 0) {
        game.back();
      } else if (!alive(game.data.character)) {
        game.goto("Dead");
      }
    }
  },
  Dead: {
    tags: ["system"],
    describe: function (game) {
      game.print("You fall to the ground, bleeding out, your life force slowly seeping out of your wounds. You can feel your soul detaching from your body and before long you leave it completely behind.");
      game.print("You start to dissolve in the aether, slowly losing consciousness of your being, until you are just a wisp of memories amongst many.")
      game.print("This is the end of " + game.data.character.name + ".");
      game.print("You are dead.", "<h1>");
      game.data.playing = false;
    },
    aliases: {},
    commands: {},
    default: function (game, params) {},
    post: function (game) {}
  },
  MagicalFountain: {
    tags: ["dungeon"],
    chances: 8,
    min_level: 1,
    max_level: 25,
    describe: function (game) {
      game.print("While walking through the corridors of the dungeon you stumble upon a strangely intact room, a tinkling, softly glowing <strong>fountain</strong> standing in the middle of it. You could <strong>drink</strong> from it or <strong>leave</strong> it alone.");
    },
    aliases: {},
    commands: {
      fountain: function (game, param) {
        game.print("It's a simple affair, barely more than a low basin, constantly emptying and being refilled by a silvery pipe.");
      },
      drink: function (game, param) {
        game.print("You bend down and take some of the water of the fountain in your cupped hands, before drinking the glowing liquid.");
        if (random(1, 100) < 90) {
          game.print("You feel refreshed as your wounds knit back together and new energies course through your body.");
          if (random(1, 100) < game.data.level * 2) {
            var stat = random(1, 3);
            switch (stat) {
              case 1:
                game.print("You stand a bit straighter as your muscles swell up under your " + (game.data.character.armour ? game.data.character.armour.name : "robes") +".");
                improve_stat(game.data.character, "body", 10 + Math.floor(game.data.level / 3) + 2);
                break;
              case 2:
                game.print("Your posture changes slightly as you feel limber. The world around you slows down a bit.");
                improve_stat(game.data.character, "agility", 10 + Math.floor(game.data.level / 3) + 2);
                break;
              case 3:
                game.print("You analyze the aftertaste of the water, realizing your mind feels sharper.");
                improve_stat(game.data.character, "mind", 10 + Math.floor(game.data.level / 3) + 2);
                break;
            }
          }
          heal_completely(game.data.character);
          game.print("Buoyed by this, you walk back into the dungeon.");
          game.back();
        } else {
          var damage = random(1, game.data.level + 1);
          game.print("Pain wracks through your body, and seeping wounds open all over it.");
          game.print("You lost " + damage + " hit points.");
          injure(game.data.character, damage);
          if (!alive(game.data.character)) {
            game.goto("Dead");
            return;
          } else {
            game.print("You scramble backwards out of the room and flee into the dungeon.");
            game.back();
          }
        }
      },
      leave: function (game, param) {
        game.print("You leave the glowing fountain alone and go back to your exploration of the dungeon.");
        game.back();
      }
    },
    default: function (game, params) {},
    post: function (game) {}
  },
  FoundDjinn: {
    tags: ["dungeon"],
    chances: 5,
    min_level: 15,
    max_level: 25,
    describe: function (game) {
      game.print("You stumble upon a sealed room, and, after breaking down the door you find yourself faced with a swirling vortex of air trapped within a summoning circle.");
      game.print("As soon as you step through the door the vortex coalesces into the strong form of a djinn.");
      game.print("\"Is <em>strength</em> what you want? Is <em>grace</em> what you need? Is <em>wisdom</em> what you seek? Or maybe you wish for <em>riches</em> the like was never seen before.\"");
      game.print("\"Whatever is your innermost desire, just free me, <strong>wish</strong> for it and your will be done.\"");
      game.print("You could always <strong>leave</strong> the djinn alone.");
    },
    aliases: {},
    commands: {
      leave: function (game, param) {
        game.print("You leave the room, closing the door again behind you. You can hear the curses of the djinn following you down the corridor.");
        game.back();
      },
      wish: function (game, param) {
        game.print("You step forwards and, scuffing the circle with your feet, say \"I wish for " + param + "\"");
        switch (param) {
          case "strength":
            game.print("The djinn claspes his hands and you feel your muscles swell. \"Strength is yours.\"");
            improve_stat(game.data.character, "body");
            break;
          case "agility":
          case "grace":
            game.print("The djinn claspes his hands and you feel mush faster. \"Grace is yours.\"");
            improve_stat(game.data.character, "grace");
            break;
          case "knowledge":
          case "wisdom":
            game.print("The djinn claspes his hands and you feel your mind fill up knowledge. \"Wisdom is yours.\"");
            improve_stat(game.data.character, "mind");
            break;
          case "gold":
          case "wealth":
          case "riches":
            game.print("The djinn claspes his hands and suddenly a shower of gold coins appears at your feet. \"I hope this will be enough, master.\"");
            game.data.character.gold += 1000;
            break;
          default:
            game.print("The djinn shakes his head sorrowfully. \"I can't fullfill this wish.\"");
            break;
        }
        game.print("Said that, the djinn turns back into a vortex and sweeps out of the room, leaving you alone.");
        game.back();
      }
    },
    default: function (game, params) {},
    post: function (game) {}
  },
  SampleScene: {
    tags: ["tag"],
    chances: 0,
    min_level: 1,
    max_level: 25,
    describe: function (game) {
      game.print("");
    },
    aliases: {},
    commands: {},
    default: function (game, params) {},
    post: function (game) {}
  }
}