/**
 * Namespace.js
 * 
 * @version   0.0.1
 * @author    Saneyuki Tadokoro <post@saneyuki.gfunction.com>
 * @preserve  Copyright 2013 Saneyuki Tadokoro
 * @license   MIT License
*/

var overload = require('overload.js');

(function () {

  "use strict";

  var Namespace, modules;

  Namespace = module.exports = function () {
    this.__parent__ = null;
    this.__modules__ = {};
    this.__exports__ = {};
  };

  modules = Namespace.modules = {};

  Namespace.prototype = {
    
    module: overload.
    
      def([String, Object], function (moduleName, module) {
        modules[moduleName] = { exports: module };
        return this;
      }).
      
      
      def([String, Function], function (moduleName, factory) {
        var namespace = new Namespace();
        namespace.__parent__ = moduleName;
        
        factory(namespace);
        
        this.__modules__[moduleName] = {
          nests: namespace.__modules__,
          exports: namespace.__exports__
        };
        
        if (this.__parent__ === null)
          modules[moduleName] = this.__modules__[moduleName];
        
        return this;
      }).
      
      end(),


    imports: overload.

      def([Object], function (hash) {
        return { from: this.__imports$from.bind(this, hash) };
      }).


      def(String, function () {
        var i, selector, hash = {};

        for (i = 0; arguments[i]; i++) {
          selector = arguments[i];
          hash[selector] = selector;
        }

        return {
          as:   this.__imports$as.bind(this, arguments[0]),
          from: this.__imports$from.bind(this, hash)
        };
      }).

      end(),
      
      
    __exports: overload.
    
      def(String, function (selector) {
        if (selector === '*') {
          return { from: this.__exports$from.bind(this, selector) };
        }
        
        var i, hash = {};

        for (i = 0; arguments[i]; i++) {
          selector = arguments[i];
          hash[selector] = selector;
        }
        
        return { from: this.__exports$from(this, hash) };
      }).
      
      
      def([Object], function (hash) {
        return { from: this.__exports$from.bind(this, hash) };
      }).
      
      
      def([String, overload.all()], function (propName, value) {
        this.__exports__[propName] = value;
        return this;
      }).
      
      end(),


    __imports$as: function (name, rename) {
      var module = modules[name];

      if (module) this[rename] = module.exports;

      return this;
    },


    __imports$from: function (hash, moduleName) {
      var i, way, key, nests, exports;
      
      if (moduleName.match(/\/.+/)) {
        way = moduleName.split('/');
        
        for (i = 0; way.length - 1 > i; i++) {
          nests = nests ? nests[way[i]].nests : modules[way[i]].nests;
        }
        
        exports = nests.exports;
      }
      
      exports = modules[moduleName].exports;
      
      for (key in hash) {
        this[hash[key]] = exports[key];
      }

      return this;
    },
    
    
    __exports$from: function (hash, moduleName) {
      var key, module = modules[moduleName];

      if (module) {
        for (key in hash)
          this.__exports__[hash[key]] = module.exports[key];
      }
      
      return this;
    }
  };
  
  
  Namespace.prototype.__defineSetter__('exports', function (value) {
    this.__exports__ = this.__exports = value;
  });
  
  
  Namespace.prototype.__defineGetter__('exports', function (value) {
    return this.__exports;
  });

}());