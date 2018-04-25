const env = {
  a: !!location.hostname.match(/^(a[0-9]+)-/),
  local: !!location.hostname.match(/^(test)-/),
  prod: !!!location.hostname.match(/^(a[0-9]+|test)-/),
  lang: (window.navigator.language || window.browserLanguage)
};

/**
 * Base Game class
 */
cc.Class({
  extends: cc.Component,
  properties: {},
  onLoad: function () {
    this._env = env;
    this._params = parseQuery(location.query);
    this.$debug('Loading ...');
  },
  $debug: function () {
    if (this._env.prod) return;
    console.log.apply(console, arguments);
  },
  $log: function () {
    console.log.apply(console, arguments);
  },
  $xhrGet: xhrGet
});

/**
 * HTTP request throught XHR
 * @param  {String} url
 * @param  {Object} opts {timeout,dataType}
 * @return {Promise}
 */
function xhrGet (url, opts) {
  if (typeof opts === 'undefined') opts = {};

  const xhr = cc.loader.getXMLHttpRequest();
  xhr.open('GET', url, true);
  if (cc.sys.isNative) xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");

  // set timeout
  xhr.timeout = 60000;
  if (!isNaN(parseInt(opts.timeout))) xhr.timeout = opts.timeout;

  // set
  xhr.send();
  return new Promise(function (resolve, reject) {
    xhr.onreadystatechange = function () {
      try {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            var result = xhr.responseText;
            if (opts.dateType === 'json') {
              result = JSON.parse(result)
            }
            resolve(result);
          } else {
            reject(xhr);
          }
        }
      } catch (e) {
        reject(e);
      }
    }
  })
}

/**
 * Parse query string
 * @param {string} query
 */
function parseQuery (query) {
  var res = {};
  query = query.trim().replace(/^(\?|#|&)/, '');
  if (!query) return res;

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
  return res;
}
