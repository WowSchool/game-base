const env = require('util-env');
const strings = require('util-strings');
const xhr = require('util-xhr');
/**
 * Base Game class
 */
cc.Class({
  extends: cc.Component,
  onLoad: function () {
    this._env = env;
    this._params = strings.parseQuery(location.query);
    this.$debug('Loading ...');
  },
  $debug: env.debug,
  $log: env.log,
  $xhrGet: xhr.get
});
