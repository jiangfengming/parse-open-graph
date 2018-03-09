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
    global.parseOpenGraph = mod.exports;
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
    var objs = {
      'og:image': 'og:image:url',
      'og:video': 'og:video:url',
      'og:audio': 'og:audio:url',
      'og:locale': 'og:locale:value',
      'music:album': 'music:album:url',
      'music:song': 'music:song:url',
      'video:actor': 'video:actor:url'
    };

    var objKeys = Object.keys(objs);
    var objValues = Object.values(objs);

    var arrays = ['og:image', 'og:video', 'og:audio', 'og:locale:alternate', 'music:album', 'music:song', 'music:musician', 'music:creator', 'video:actor', 'video:director', 'video:writer', 'video:tag', 'article:author', 'article:tag', 'book:author', 'book:tag'];

    var result = {};
    var currentObj = void 0;

    var _loop = function _loop(m) {
      var content = m.content;
      var property = m.property;

      if (objs[property]) property = objs[property];

      var path = property.split(':');

      if (!objValues.includes(property) && objKeys.some(function (s) {
        return property.startsWith(s);
      })) {
        if (currentObj) {
          currentObj[path.pop()] = content;
        }
      } else {
        var node = result;

        for (var i = 0; i < path.length; i++) {
          var p = path[i];

          var isArray = arrays.includes(path.slice(0, i + 1).join(':'));

          if (i === path.length - 1) {
            if (isArray) {
              if (!node[p]) node[p] = [];
              node[p].push(content);
            } else {
              node[p] = content;
            }
          } else {
            if (isArray) {
              if (!node[p]) node[p] = [];
              var newNode = {};
              node[p].push(newNode);
              node = newNode;
            } else {
              if (!node[p]) node[p] = {};
              node = node[p];
            }
          }
        }

        if (objValues.includes(property)) {
          currentObj = node;
        }
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

      _loop(m);
    }

    return result;
  }

  exports.parse = parse;
  exports.parseFromDocument = parseFromDocument;
  exports.parseMetaFromDocument = parseMetaFromDocument;
});