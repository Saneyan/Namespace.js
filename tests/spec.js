/*global namespace, describe, it, setTimeout, console*/
/*jslint indent: 2, node: true*/

var Namespace = require('../lib/namespace.js');

(function () {

  "use strict";

  describe('Namespace.js', function () {

    var $ = new Namespace();

    Namespace.modules.test = {
      out: function (message) {
        console.log(message);
      },

      add: function (a, b) {
        return a + b;
      }
    };

    describe('Imports', function () {

      it('should import modules', function (done) {
        $.imports('add', 'out').from('test')
          .imports('test').as('tmod')
          .imports({ add: 'a', out: 'o' }).from('test');

        $.out($.add(1, 1));
        $.o($.a(5, 2));
        $.tmod.out($.tmod.add(9, 3));

        done();
      });
    });
  });

}());