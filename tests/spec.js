/*global namespace, describe, it, setTimeout, console*/
/*jslint indent: 2, node: true*/

var Namespace = require('../lib/namespace.js');

(function () {

  "use strict";

  describe('Namespace.js', function () {

    var $ = new Namespace();
    
    describe('Modules', function () {
      it('should define modules', function (done) {
        $.module('test', function (test) {
          test.exports('out', function (message) {
            console.log(message);
          });
          
          test.exports('add', function (a, b) {
            return a + b;
          })
        });
        
        done();
      });
    });


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
    
    
    describe('Exports', function () {
      it('should export modules', function (done) {
        $.exports('inc', function (value) {
          return ++value;
        });
        
        done();
      });
    });
  });

}());