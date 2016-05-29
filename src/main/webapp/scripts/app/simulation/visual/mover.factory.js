/**
 * Created by root on 28.05.2016.
 */
'use strict';
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

angular.module('osmmapscongestionApp')
    .factory('ToolMover', function (Tool) {
        __extends(Mover, Tool);

        function Mover() {
            this.mouseout = __bind(this.mouseout, this);
            this.mousemove = __bind(this.mousemove, this);
            this.mouseup = __bind(this.mouseup, this);
            this.mousedown = __bind(this.mousedown, this);
            Mover.__super__.constructor.apply(this, arguments);
            this.startPosition = null;
        }

        Mover.prototype.contextmenu = function () {
            return false;
        };

        Mover.prototype.mousedown = function (e) {
            this.startPosition = this.getPoint(e);
            return e.stopImmediatePropagation();
        };

        Mover.prototype.mouseup = function () {
            return this.startPosition = null;
        };

        Mover.prototype.mousemove = function (e) {
            var offset;
            if (this.startPosition) {
                offset = this.getPoint(e).subtract(this.startPosition);
                this.visualizer.zoomer.moveCenter(offset);
                return this.startPosition = this.getPoint(e);
            }
        };

        Mover.prototype.mouseout = function () {
            return this.startPosition = null;
        };

        return Mover;
    });
