/**
 * Created by root on 28.05.2016.
 */
'use strict';
var __bind = function (fn, me) {
        return function () {
            return fn.apply(me, arguments);
        };
    },
    __hasProp = {}.hasOwnProperty,
    __extends = function (child, parent) {
        for (var key in parent) {
            if (__hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
            this.constructor = child;
        }

        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    };

angular.module('osmmapscongestionApp')
    .factory('ToolHighlighter', function (Tool, Settings) {
        __extends(ToolHighlighter, Tool);

        function ToolHighlighter() {
            this.draw = __bind(this.draw, this);
            this.mouseout = __bind(this.mouseout, this);
            this.mousemove = __bind(this.mousemove, this);
            ToolHighlighter.__super__.constructor.apply(this, arguments);
            this.hoveredCell = null;
        }

        ToolHighlighter.prototype.mousemove = function (e) {
            var cell, hoveredIntersection, id, intersection, _ref;
            cell = this.getCell(e);
            hoveredIntersection = this.getHoveredIntersection(cell);
            this.hoveredCell = cell;
            _ref = this.visualizer.world.intersections.all();
            for (id in _ref) {
                intersection = _ref[id];
                intersection.color = null;
            }
            if (hoveredIntersection != null) {
                return hoveredIntersection.color = Settings.colors.hoveredIntersection;
            }
        };

        ToolHighlighter.prototype.mouseout = function () {
            return this.hoveredCell = null;
        };

        ToolHighlighter.prototype.draw = function () {
            var color;
            if (this.hoveredCell) {
                color = Settings.colors.hoveredGrid;
                return this.visualizer.graphics.fillRect(this.hoveredCell, color, 0.5);
            }
        };

        return ToolHighlighter;
    });



