
var utils = require('sugarlisp-core/utils');

module.exports = {
  extends: "statements",
  onuse: "sugarlisp-csp/usejscsp.js",
  syntax: require('./syntax'),
  keywords: utils.merge(require('./keywords'),
                       require('./macros.js'))
};
