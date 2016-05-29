/**
 * Created by root on 28.05.2016.
 */
'use strict';

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1;},
    random = Math.random;

angular.module('osmmapscongestionApp')
    .factory('ControlSignals', function(Settings) {
        function ControlSignals(intersection) {
            this.intersection = intersection;
            this.onTick = __bind(this.onTick, this);
            this.flipMultiplier = random();
            this.phaseOffset = 100 * random();
            this.time = this.phaseOffset;
            this.stateNum = 0;
        }

        ControlSignals.copy = function(controlSignals, intersection) {
            var result;
            if (controlSignals == null) {
                return new ControlSignals(intersection);
            }
            result = Object.create(ControlSignals.prototype);
            result.flipMultiplier = controlSignals.flipMultiplier;
            result.time = result.phaseOffset = controlSignals.phaseOffset;
            result.stateNum = 0;
            result.intersection = intersection;
            return result;
        };

        ControlSignals.prototype.toJSON = function() {
            var obj;
            return obj = {
                flipMultiplier: this.flipMultiplier,
                phaseOffset: this.phaseOffset
            };
        };

        ControlSignals.prototype.states = [
            ['L', '', 'L', ''],
            ['FR', '', 'FR', ''],
            ['', 'L', '', 'L'],
            ['', 'FR', '', 'FR']];

        ControlSignals.STATE = [
            {
                RED: 0,
                GREEN: 1
            }
        ];

        ControlSignals.property('flipInterval', {
            get: function() {
                return (0.1 + 0.05 * this.flipMultiplier) * Settings.lightsFlipInterval;
            }
        });

        ControlSignals.prototype._decode = function(str) {
            var state;
            state = [0, 0, 0];
            if (__indexOf.call(str, 'L') >= 0) {
                state[0] = 1;
            }
            if (__indexOf.call(str, 'F') >= 0) {
                state[1] = 1;
            }
            if (__indexOf.call(str, 'R') >= 0) {
                state[2] = 1;
            }
            return state;
        };

        ControlSignals.property('state', {
            get: function() {
                var stringState, x, _i, _len, _results;
                stringState = this.states[this.stateNum % this.states.length];
                if (this.intersection.roads.length <= 2) {
                    stringState = ['LFR', 'LFR', 'LFR', 'LFR'];
                }
                _results = [];
                for (_i = 0, _len = stringState.length; _i < _len; _i++) {
                    x = stringState[_i];
                    _results.push(this._decode(x));
                }
                return _results;
            }
        });

        ControlSignals.prototype.flip = function() {
            return this.stateNum += 1;
        };

        ControlSignals.prototype.onTick = function(delta) {
            this.time += delta;
            if (this.time > this.flipInterval) {
                this.flip();
                return this.time -= this.flipInterval;
            }
        };

        return ControlSignals;

    });
