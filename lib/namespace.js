/**
 * Namespace.js
 * 
 * @version   0.0.1
 * @author    Saneyuki Tadokoro <post@saneyuki.gfunction.com>
 * @preserve  Copyright 2013 Saneyuki Tadokoro
 * @license   MIT License
*/
/*global overload, module*/
/*jslint indent: 2, node: true, plusplus: true*/

var overload = require('overload.js');

(function () {

  "use strict";

  var Namespace, modules;


  function bind(toBind, thisObject) {
    var arg, Nop, bound;

    if (Function.prototype.bind) {
      arg = [].slice.call(arguments, 1);
      return Function.prototype.bind.apply(toBind, arg);
    }

    // Using compatible bind method from MDN
    arg = [].slice.call(arguments, 2);
    Nop = function () {};

    bound = function () {
      var thisArg, args;

      thisArg = this instanceof Nop && thisObject ? this : thisObject;
      args = arg.concat([].slice.call(arguments));

      return toBind.apply(thisArg, args);
    };

    Nop.prototype = toBind.prototype;
    bound.prototype = new Nop();

    return bound;
  }


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
      }).
      
      
      def([String, Function], function (moduleName, factory) {
        var namespace = new Namespace();
        namespace.__parent__ = moduleName;
        
        factory(namespace);
        
        this.__modules__[moduleName] = {
          nests: namespace.__module__,
          exports: namespace.__exports__
        };
        
        if (this.__parent__ === null) {
          modules[moduleName] = this.__modules__[moduleName];
        }
      }).
      
      end(),


    imports: overload.

      def([Object], function (hash) {
        return {
          from: bind(this.__imports$from, this, hash)
        };
      }).


      def(String, function () {
        var i, selector, hash = {};

        for (i = 0; arguments[i]; i++) {
          selector = arguments[i];
          hash[selector] = selector;
        }

        return {
          as:   bind(this.__imports$as, this, arguments[0]),
          from: bind(this.__imports$from, this, hash)
        };
      }).

      end(),
      
      
    __exports: overload.
    
      def(String, function (selector) {
        if (selector === '*') {
          return {
            from: bind(this.__exports$from, this, selector)
          };
        }
        
        var i, selector, hash = {};

        for (i = 0; arguments[i]; i++) {
          selector = arguments[i];
          hash[selector] = selector;
        }
        
        return {
          from: bind(this.__exports$from, this, hash)
        };
      }).
      
      
      def([Object], function (hash) {
        return {
          from: bind(this.__exports$from, this, hash)
        };
      }).
      
      
      def([String, overload.all()], function (propName, value) {
        this.__exports__[propName] = value;
      }).
      
      end(),


    __imports$as: function (name, rename) {
      var module = modules[name];

      if (module) {
        this[rename] = module.exports;
      }

      return this;
    },


    __imports$from: function (hash, moduleName) {
      var key, module = modules[moduleName];

      if (module) {
        for (key in hash) {
          this[hash[key]] = module.exports[key];
        }
      }

      return this;
    },
    
    
    __exports$from: function (hash, moduleName) {
      var key, module = modules[moduleName];

      if (module) {
        for (key in hash) {
          this.__exports__[hash[key]] = module.exports[key];
        }
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