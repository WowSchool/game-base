/* 不要动修改这个文件! */
const env = {
  a: !!location.hostname.match(/^(a[0-9]+)-/),
  local: !!location.hostname.match(/^(test)-/),
  prod: !!!location.hostname.match(/^(a[0-9]+|test)-/),
  lang: (window.navigator.language || window.browserLanguage)
}

cc.Class({
  extends: cc.Component,
  properties: {
  },
  onLoad () {
    this._env = env;
    this._params = parseQuery(location.query);
    console.log('Loading ...')
  },
  $debug () {
    if (this._env.prod) return
    console.log.apply(console, arguments)
  },
  $log () {
    console.log.apply(console, arguments)
  }
});

/**
 * Parse query string
 * @param {string} query 
 */
function parseQuery (query) {
  var res = {};
  query = query.trim().replace(/^(\?|#|&)/, '');
  if (!query) return res

  query.split('&').forEach(function (param) {
    var parts = param.replace(/\+/g, ' ').split('=');
    var key = decodeURIComponent(parts.shift());
    var val = parts.length > 0
      ? decodeURIComponent(parts.join('='))
      : null;

    if (res[key] === undefined) {
      res[key] = val;
    } else if (Array.isArray(res[key])) {
      res[key].push(val);
    } else {
      res[key] = [res[key], val];
    }
  });
  return res
}
