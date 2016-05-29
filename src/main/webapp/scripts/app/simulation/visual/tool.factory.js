/**
 * Created by root on 28.05.2016.
 */
'use strict';

var METHODS;

METHODS = ['click', 'mousedown', 'mouseup', 'mousemove', 'mouseout', 'mousewheel', 'contextmenu'];

angular.module('osmmapscongestionApp')
    .factory('Tool', function (Point, Rect) {
        function Tool(visualizer, autobind) {
            this.visualizer = visualizer;
            this.ctx = this.visualizer.ctx;
            this.canvas = this.ctx.canvas;
            this.isBound = false;
            if (autobind) {
                this.bind();
            }
        }

        Tool.prototype.bind = function () {
            var method, _i, _len, _results;
            this.isBound = true;
            _results = [];
            for (_i = 0, _len = METHODS.length; _i < _len; _i++) {
                method = METHODS[_i];
                if (this[method] != null) {
                    _results.push($(this.canvas).on(method, this[method]));
                }
            }
            return _results;
        };

        Tool.prototype.unbind = function () {
            var method, _i, _len, _results;
            this.isBound = false;
            _results = [];
            for (_i = 0, _len = METHODS.length; _i < _len; _i++) {
                method = METHODS[_i];
                if (this[method] != null) {
                    _results.push($(this.canvas).off(method, this[method]));
                }
            }
            return _results;
        };

        Tool.prototype.toggleState = function () {
            if (this.isBound) {
                return this.unbind();
            } else {
                return this.bind();
            }
        };

        Tool.prototype.draw = function () {
        };

        Tool.prototype.getPoint = function (e) {
            return new Point(e.pageX - this.canvas.offsetLeft, e.pageY - this.canvas.offsetTop);
        };

        Tool.prototype.getCell = function (e) {
            return this.visualizer.zoomer.toCellCoords(this.getPoint(e));
        };

        Tool.prototype.getHoveredIntersection = function (cell) {
            var id, intersection, intersections;
            intersections = this.visualizer.world.intersections.all();
            for (id in intersections) {
                intersection = intersections[id];
                if (intersection.rect.containsRect(cell)) {
                    return intersection;
                }
            }
        };

        return Tool;
    });
