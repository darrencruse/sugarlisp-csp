
var utils = require('sugarlisp-core/utils');

module.exports = {
  name: "csp",
  onuse: "sugarlisp-csp/usejscsp.js",
  lextab: require('./lextab'),
  readtab: require('./readtab'),
  gentab: utils.merge(require('./gentab'),
                      require('./macros.js'))
};
