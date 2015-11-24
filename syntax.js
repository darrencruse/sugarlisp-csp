var reader = require('sugarlisp-core/reader'),
    corerfuncs = require('sugarlisp-core/readfuncs'),
    ssrfuncs = require('sugarlisp-sugarscript/readfuncs'),
    sl = require('sugarlisp-core/types'),
    debug = require('debug')('sugarlisp:csp:syntax');

// go routines
// (can be used lispy style or paren free with {})
exports['go'] = function(source, text) {

  var goToken = source.next_token('go');
  var goAtom = sl.atom("go", {token: goToken});
  var list = sl.list(goAtom);

  // is it function call style e.g. go(chain(left,right)) ?
  if(source.on('(')) {
    list.push(ssrfuncs.read_wrapped_delimited_list(source, '(', ')'));
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
    var list = sl.list(sl.atom("fors", {token: forToken}));
    // push an empty condition - this generates a "for (;;)"
    list.pushFromArray(["","",""]);
    // push the body
    list.push(corerfuncs.read_delimited_list(source, '{', '}', [sl.atom("do")]));
    return list;
  }

  // this was not the empty condition for {...}
  // let the next "for" syntax handler down take it:
  return reader.retry_match;
};

/*
FOR REFERENCE ONLY WILL DELETE

example switch in js:

selected = <-alts([messages, signals], {default: true});
switch(selected.channel) {
  case messages:
    console.log("received message", selected.value);
    break;
  case signals:
    console.log("received signal", selected.value);
    break;
  default:
    console.log("no activity");
    break;
}

example select statement from go:

select {
case i1 = <-c1:
	print("received ", i1, " from c1\n")
case c2 <- i2:
	print("sent ", i2, " to c2\n")
case i3, ok := (<-c3):  // same as: i3, ok := <-c3
	if ok {
		print("received ", i3, " from c3\n")
	} else {
		print("c3 is closed\n")
	}
case a[f()] = <-c4:
	// same as:
	// case t := <-c4
	//	a[f()] = t
default:
	print("no communication\n")
}
*/
