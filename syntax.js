var reader = require('sugarlisp-core/reader'),
    sl = require('sugarlisp-core/types'),
    debug = require('debug')('sugarlisp:csp:syntax');

// go routines
// (can be used lispy style or paren free with {})
exports['go'] = function(source, text) {

  // the parsing that follows is only for sugarscript
  if(this.extension === "slisp") {
    return reader.retry_match;
  }

  var goToken = source.next_token('go');
  var goAtom = sl.atom("go", {token: goToken});
  var list = sl.list(goAtom);

  // is it function call style e.g. go(chain(left,right)) ?
  if(source.on('(')) {
    list.push(reader.read_wrapped_delimited_list(source, '(', ')'));
  }
  else {
    // this handles e.g. go {..}, go funcname, etc.
    list.push(reader.read(source));
  }

  list.__parenoptional = true;
  return list;
};


// channel put/take

// go style left arrow
exports['<-'] = reader.operator({
  prefix: reader.prefix(8, {altprefix:'chtake'}),
  infix: reader.infix(7.5, {altprefix:'chput'})
});

// "tadpole" style with two directions
// (to keep them straight remember the channel always goes on the right)

// channel take e.g. var t <~ ch
exports['<~'] = reader.prefix(7.5, {altprefix:'chtake'});

// channel put e.g. "msg" ~> ch
exports['~>'] = reader.infix(7.5);

exports['<-alts'] = reader.symbol;
exports['<~alts'] = reader.symbol;

// examples often use go's simple no-condition for {...}
exports['for'] = function(source) {
  // is this the no-condition for {...} ?
  if(source.on(/for\s*{/)) {
    // note: The "fors" keyword transpiler is in the "statements"
    //   dialect which they should #use *before* they #use "csp"
    //   because we fall back to them.
    var forToken = source.next_token('for');
    var list = sl.list(sl.atom("for", {token: forToken}));
    // push an empty condition - this generates a "for (;;)"
    list.pushFromArray(["","",""]);
    // push the body
    list.push(reader.read_delimited_list(source, '{', '}', [sl.atom("begin")]));
    return list;
  }

  // this was not the empty condition for {...}
  // let the next "for" syntax handler down take it:
  return reader.retry_match;
};
