(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.openGraph = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  exports.__esModule = true;
  function parseMetaFromDocument() {
    var elems = document.querySelectorAll('meta[property]');
    var result = [];

    for (var _iterator = elems, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var el = _ref;

      result.push({
        property: el.getAttribute('property'),
        content: el.content
      });
    }

    return result;
  }

  function parseFromDocument() {
    return parse(parseMetaFromDocument());
  }

  function parse(meta) {
    var appends = {
      'og:image': 'url',
      'og:video': 'url',
      'og:audio': 'url',
      'og:locale': 'current',
      'music:album': 'url',
      'music:song': 'url',
      'video:actor': 'url'
    };

    var arrays = [['og:image', 'url'], ['og:video', 'url'], ['og:audio', 'url'], ['music:album', 'url'], ['music:song', 'url'], ['video:actor', 'url'], 'og:locale:alternate', 'music:musician', 'music:creator', 'video:director', 'video:writer', 'video:tag', 'article:author', 'article:tag', 'book:author', 'book:tag'];

    var result = {};
    var currentArrayElement = void 0;

    var _loop = function _loop(m) {
      var content = m.content;
      var property = m.property;

      if (appends[property]) property += ':' + appends[property];

      var path = property.split(':');
      var node = void 0;
      var i = 0;

      var matched = arrays.find(function (a) {
        return a instanceof Array && property.startsWith(a[0]) && path[path.length - 1] !== a[1];
      });
      if (matched) {
        if (!currentArrayElement || currentArrayElement.path !== matched[0]) return 'continue';
        node = currentArrayElement.node;
        i = currentArrayElement.path.split(':').length;
      } else {
        node = result;
        currentArrayElement = null;
      }

      var _loop2 = function _loop2() {
        var p = path[i];
        var currentPath = path.slice(0, i + 1).join(':');
        var isArray = arrays.some(function (a) {
          return (a instanceof Array ? a[0] : a) === currentPath;
        });

        if (isArray) {
          if (!node[p]) node[p] = [];

          if (i === path.length - 1) {
            node[p].push(content);
          } else {
            var newNode = {};
            node[p].push(newNode);
            node = newNode;

            currentArrayElement = {
              path: currentPath,
              node: node
            };
          }
        } else {
          if (i === path.length - 1) {
            node[p] = content;
          } else {
            if (!node[p]) node[p] = {};
            node = node[p];
          }
        }
      };

      for (; i < path.length; i++) {
        _loop2();
      }
    };

    for (var _iterator2 = meta, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
      var _ref2;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref2 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref2 = _i2.value;
      }

      var m = _ref2;

      var _ret = _loop(m);

      if (_ret === 'continue') continue;
    }

    return Object.keys(result).length ? result : null;
  }

  exports.parse = parse;
  exports.parseFromDocument = parseFromDocument;
  exports.parseMetaFromDocument = parseMetaFromDocument;
});