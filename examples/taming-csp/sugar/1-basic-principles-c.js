// Generated by SugarLisp v0.6.5
var csp = require("js-csp");
var chan = csp.chan;
var timeout = csp.timeout;
var alts = csp.alts;

var ch = chan();

csp.go(function*() {
  yield csp.put(ch, 5);
  return ch.close();

});

csp.go(function*() {
  yield csp.take(timeout(1000));
  console.log(yield csp.take(ch));

});