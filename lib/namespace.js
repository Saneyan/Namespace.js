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


  Namespace = module.exports = function () {};

  modules = Namespace.modules = {};

  Namespace.prototype = {

    as: function (name, rename) {
      var module = modules[name];

      if (module) {
        this[rename] = module;
      }

      return this;
    },


    from: function (hash, moduleName) {
      var key, module = modules[moduleName];

      if (module) {
        for (key in hash) {
          this[hash[key]] = module[key];
        }
      }

      return this;
    },


    imports: overload.

      def([Object], function (hash) {
        return {
          from: bind(this.from, this, hash)
        };
      }).


      def(String, function () {
        var i, selector, hash = {};

        for (i = 0; arguments[i]; i++) {
          selector = arguments[i];
          hash[selector] = selector;
        }

        return {
          as:   bind(this.as, this, arguments[0]),
          from: bind(this.from, this, hash)
        };
      }).

      end()
  };

}());