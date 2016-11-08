var Game = function (name, output, input, handle_command, starting_scene, loading_scene) {
  var self = this;
  self.name = name;
  self.output = output;
  self.input = input;
  self.handle_command = handle_command;
  self.data = {
    scene: null,
    stack: []
  };
  self.print = function (text, tag) {
    if (tag === undefined) {
      tag = "<p>";
    }
    $(self.output).append($(tag).html(text));
  };
  self.goto = function (name) {
    if (self.data.scene !== null) {
      self.data.stack.push(self.data.scene);
    }
    self.data.scene = name;
    Scenes[self.data.scene].describe(self);
  };
  self.back = function () {
    var stack_size = self.data.stack.length;
    if (stack_size > 0) {
      var scene = self.data.stack[stack_size - 1];
      self.goto(scene);
    } else {
      log_error("Error: trying to go `back` with no history");
    }
  };
  self.start = function () {
    $(input).focus();
    $(input).on("keydown", function (event) {
      if (event.keyCode === 13) {
        self.handle_command(self, event.target.value);
        event.target.value = "";
        window.scrollTo(0, document.body.scrollHeight);
      }
    });
    if (localStorage[name + "-save"]) {
      self.goto(loading_scene);
    } else {
      self.goto(starting_scene);
    }
  };
};