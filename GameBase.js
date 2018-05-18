const env = require('util-env');
const strings = require('util-strings');
const xhr = require('util-xhr');

const methods = {
  $debug: env.debug,
  $log: env.log,
  $xhrGet: xhr.get
}
/**
 * Base Game class
 */
cc.Class({
  extends: cc.Component,
  onLoad: function () {
    this._env = env;
    this._params = strings.parseQuery(location.query);
    this.init();
  },
  init () {
    const comps = this.node._components;
    for (let i in comps) {
      let comp = comps[i];
      if (!comp || comp.sceneScript !== true) continue;
      // inject methods into components whose scenceScript property is true
      Object.assign(comp, methods);
    }
  }
});
