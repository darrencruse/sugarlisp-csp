// Generated by SugarLisp v0.6.5
var csp = require("js-csp");
var chan = csp.chan;
var timeout = csp.timeout;
var alts = csp.alts;

var boring = require("./boring");

function fanIn(input1, input2) {
  var ch = chan();
  csp.go(function*() {
    for (;;) {
      var r = yield csp.alts([
        input1,
        input2
      ]);
      yield csp.put(ch, r.value);
    };

  });
  return ch;
}

csp.go(function*() {
  var ch = fanIn(boring("Joe"), boring("Ann"));
  for (var i = 0;
    (i < 10); ++i) {
    console.log(yield csp.take(ch));
  };
  console.log("You are boring; I'm leaving.");
  return process.exit();

});