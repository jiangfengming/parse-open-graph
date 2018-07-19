(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.openGraph = {})));
}(this, (function (exports) { 'use strict';

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

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
  function parseFromDocument(options) {
    return parse(parseMetaFromDocument(), options);
  }
  function parse(meta, _temp) {
    var _ref2 = _temp === void 0 ? {} : _temp,
        _ref2$alias = _ref2.alias,
        alias = _ref2$alias === void 0 ? {} : _ref2$alias,
        _ref2$arrays = _ref2.arrays,
        arrays = _ref2$arrays === void 0 ? [] : _ref2$arrays;

    alias = _extends({
      'og:locale': 'og:locale:_',
      'og:image': 'og:image:url',
      'og:video': 'og:video:url',
      'og:audio': 'og:audio:url',
      'music:album': 'music:album:url',
      'music:song': 'music:song:url',
      'video:actor': 'video:actor:url'
    }, alias);
    arrays = ['og:image', 'og:video', 'og:audio', 'music:album', 'music:song', 'video:actor', 'og:locale:alternate', 'music:musician', 'music:creator', 'video:director', 'video:writer', 'video:tag', 'article:author', 'article:tag', 'book:author', 'book:tag'].concat(arrays);
    var result = {};

    for (var _iterator2 = meta, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
      var _ref3;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref3 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref3 = _i2.value;
      }

      var m = _ref3;
      var content = m.content;
      var property = m.property;
      if (alias[property]) property = alias[property];
      var path = property.split(':');
      var node = result;
      var i = 0;

      for (; i < path.length; i++) {
        var p = path[i];
        var currentPath = path.slice(0, i + 1).join(':');

        if (arrays.includes(currentPath)) {
          if (!node[p]) node[p] = [];
          var array = node[p];

          if (i === path.length - 1) {
            // string array
            array.push(content);
          } else {
            // object array
            if (array.length) {
              var existing = array[array.length - 1];

              if (!existing[path[i + 1]] || arrays.includes(path.slice(0, i + 2).join(':'))) {
                node = existing;
                continue;
              }
            }

            var newNode = {};
            node[p].push(newNode);
            node = newNode;
          }
        } else {
          if (i === path.length - 1) {
            node[p] = content;
          } else {
            if (!node[p]) node[p] = {};
            node = node[p];
          }
        }
      }
    }

    return Object.keys(result).length ? result : null;
  }
  var index = {
    parse: parse,
    parseFromDocument: parseFromDocument,
    parseMetaFromDocument: parseMetaFromDocument
  };

  exports.parseMetaFromDocument = parseMetaFromDocument;
  exports.parseFromDocument = parseFromDocument;
  exports.parse = parse;
  exports.default = index;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
