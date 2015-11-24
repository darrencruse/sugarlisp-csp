// Generated by SugarLisp v0.5
var csp = require("js-csp");
var chan = csp.chan;
var timeout = csp.timeout;
var alts = csp.alts;

var ch = chan();

csp.go(function*() {
  var v = undefined;
  while (((v = yield csp.take(ch)) !== csp.CLOSED)) {
    console.log(v);
    (yield csp.take(timeout(300)));
    yield csp.put(ch, 2);

  };

});

csp.go(function*() {
  var v = undefined;
  yield csp.put(ch, 1);
  while (((v = yield csp.take(ch)) !== csp.CLOSED)) {
    console.log(v);
    (yield csp.take(timeout(200)));
    yield csp.put(ch, 3);

  };

});

csp.go(function*() {
  (yield csp.take(timeout(5000)));
  ch.close();

});