// Generated by SugarLisp v0.6.0
var csp = require("js-csp");
var chan = csp.chan;
var timeout = csp.timeout;
var alts = csp.alts;

function* chain(left, right) {
  return yield csp.put(left, (1 + (yield csp.take(right))));
}

csp.go(function*() {
  var n = 100000;
  var leftmost = chan();
  var right = leftmost;
  var left = leftmost;
  for (var i = 0;
    (i < n); i++) {
    right = chan();
    csp.go(chain, [left, right]);
    left = right;
  };
  csp.go(function*() {
    return yield csp.put(right, 1);

  });
  console.log(yield csp.take(leftmost));

});