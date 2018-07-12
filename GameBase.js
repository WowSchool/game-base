const env = require('util-env');
const strings = require('util-strings');

const methods = {
  $debug: env.debug,
  $log: env.log,
  /**
   * Instantiate a cc.Node from a Prefab
   * @param {String} dir directory name in assets/resources/<dir>
   * @param {String} name prefab name in <dir>
   */
  addPrefabToScene (dir, name = dir, compName = name) {
    return this.instantiatePrefab(dir, name).then(node => {
      const scene = cc.director.getScene();
      const canvas = scene.children[0];
      node.x = canvas.width / 2;
      node.y = canvas.height / 2;
      node.active = false;
      const comp = node.addComponent(name);
      scene.addChild(node);
      return comp;
    });
  },
  /**
   * Instantiate a cc.Node from a Prefab
   * @param {String} dir directory name in assets/resources/<dir>
   * @param {String} name prefab name in <dir>
   */
  instantiatePrefab (dir, name = dir) {
    return new Promise((resolve, reject) => {
      cc.loader.loadRes(`${dir}/${name}`, function (err, prefab) {
        if (err) {
          reject(err);
        } else {
          const node = cc.instantiate(prefab);
          resolve(node);
        }
      });
    });
  }
}
/**
 * Base Game class
 */
cc.Class({
  extends: cc.Component,
  properties: {
    collisionSystem: false,
    debugCollision: false
  },
  onLoad: function () {
    this._env = env;
    this._params = strings.parseQuery(location.query);

    const collisionManager = cc.director.getCollisionManager()
    collisionManager.enabled = this.collisionSystem;
    collisionManager.enabledDebugDraw = this.debugCollision;

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
