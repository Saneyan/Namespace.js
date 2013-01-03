/*global namespace, describe, it, setTimeout, console*/
/*jslint indent: 2, node: true*/

var Namespace = require('../lib/namespace.js'),
  assert = require('assert');


(function () {

  "use strict";

  describe('Namespace.js', function () {
    describe('Exports method', function () {
      
      Namespace.modules.keyboard = {
        exports: {
          press: function (str) { return str === 'a' ? 97 : 0; },
          enableA20: function () { console.log('Enabled A20 Line!'); }
        }
      };
        
      Namespace.modules.ide = {
        exports: {
          read: function (sector) { return sector === 0 ? 'MBR' : 'DATA'; },
          write: function (sector, data) { console.log('Wrote ' + data + ' to ' + sector); }
        }
      };
      
      var ns = new Namespace();
      
      it('should export a value', function () {
        ns.exports('value', 'a');
        assert(ns.__exports__.value, 'a');
      });
      
      it('should re-export module\'s exports', function () {
        ns.exports('press').from('keyboard');
        assert(ns.__exports__.press('a'), 97);
      });
      
      it('should re-export and rename module\'s exports', function (done) {
        ns.exports({ enableA20: 'eat' }).from('keyboard');
        ns.__exports__.eat();
        done();
      });
      
      it('should re-export another module\'s exports', function () {
        ns.exports('*').from('ide');
        ns.__exports__.write(2, 'a bootloader');
        assert(ns.__exports__.read(0), 'MBR');
      });
      
      it('should export a single dynamic value', function () {
        ns.exports = 'a';
        assert(ns.__exports__, 'a');
      });
    });
    
    
    var $ = new Namespace();
    
    describe('Module method', function () {
      it('should define a module using factory', function (done) {
        $.module('standard', function (std) {
          std.exports('out', function (message) {
            console.log(message);
          });
        });
        
        done();
      });
      
      it('should define a module by object', function (done) {
        var math = {
          add: function (a, b) {
            return a + b;
          },
          
          div: function (a, b) {
            return a - b;
          }
        };
        
        $.module('math', math);
        
        done();
      });
      
      it('should define a nested module', function (done) {
        $.module('test', function (test) {
          test.module('tools', function (tools) {
            tools.exports('toJSON', function (object) {
              return JSON.stringify(object);
            });
            
            tools.exports('parseJSON', function (str) {
              return JSON.parse(str);
            });
          });
        });
        
        done();
      });
    });


    describe('Imports method', function () {
      it('should bind module\'s exports', function () {
        $.imports('add', 'div').from('math');
        assert($.add(3, 5), 8);
        assert($.div(9, 2), 7);
      });
      
      it('should bind and rename module\'s exports', function () {
        $.imports({ add: 'a', div: 'div' }).from('math');
        assert($.add(100, 254), 354);
        assert($.div(90345, 249), 90096);
      });
      
      it('should bind nested module\'s exports', function () {
        $.imports('toJSON', 'parseJSON').from('test/tools');
        assert($.parseJSON($.toJSON({ key: 'value' })).hasOwnProperty('key'), true);
      });
      
      it('should bind and rename a module', function (done) {
        $.imports('standard').as('std');
        $.std.out('hello');
        
        done();
      });
    });
  });

}());