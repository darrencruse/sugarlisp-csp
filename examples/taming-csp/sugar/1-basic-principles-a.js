// Generated by SugarLisp v0.6.0
var csp = require("js-csp");
var chan = csp.chan;
var timeout = csp.timeout;
var alts = csp.alts;

var ch = chan();

csp.go(function*() {
  while (yield csp.put(ch, 1)) {
    yield csp.take(timeout(250));
  };

});

csp.go(function*() {
  while (yield csp.put(ch, 2)) {
    yield csp.take(timeout(300));
  };

});

csp.go(function*() {
  while (yield csp.put(ch, 3)) {
    yield csp.take(timeout(1000));
  };

});

csp.go(function*() {
  for (var v = 0; v < 10; v++) {
    console.log(yield csp.take(ch));
  };
  return ch.close();

});