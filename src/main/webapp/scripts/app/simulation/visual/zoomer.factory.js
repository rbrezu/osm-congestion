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
    },
    __slice = [].slice,
    min, max;

min = Math.min, max = Math.max;

angular.module('osmmapscongestionApp')
    .factory('Zoomer', function (Tool, Rect, Point, Settings) {
        __extends(Zoomer, Tool);

        function Zoomer() {
            var args, defaultZoom, visualizer;
            defaultZoom = arguments[0], visualizer = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
            this.defaultZoom = defaultZoom;
            this.visualizer = visualizer;
            this.mousewheel = __bind(this.mousewheel, this);
            Zoomer.__super__.constructor.apply(this, [this.visualizer].concat(__slice.call(args)));
            this.ctx = this.visualizer.ctx;
            this.canvas = this.ctx.canvas;
            this._scale = 1;
            this.screenCenter = new Point(this.canvas.width / 2, this.canvas.height / 2);
            this.center = new Point(this.canvas.width / 2, this.canvas.height / 2);
        }

        Zoomer.property('scale', {
            get: function () {
                return this._scale;
            },
            set: function (scale) {
                return this.zoom(scale, this.screenCenter);
            }
        });

        Zoomer.prototype.toCellCoords = function (point) {
            var centerOffset, gridSize, x, y;
            gridSize = Settings.gridSize;
            centerOffset = point.subtract(this.center).divide(this.scale);
            x = Math.floor(centerOffset.x / (this.defaultZoom * gridSize)) * gridSize;
            y = Math.floor(centerOffset.y / (this.defaultZoom * gridSize)) * gridSize;
            return new Rect(x, y, gridSize, gridSize);
        };

        Zoomer.prototype.getBoundingBox = function (cell1, cell2) {
            var x1, x2, xMax, xMin, y1, y2, yMax, yMin;
            if (cell1 == null) {
                cell1 = this.toCellCoords(new Point(0, 0));
            }
            if (cell2 == null) {
                cell2 = this.toCellCoords(new Point(this.canvas.width, this.canvas.height));
            }
            x1 = cell1.x;
            y1 = cell1.y;
            x2 = cell2.x;
            y2 = cell2.y;
            xMin = min(cell1.left(), cell2.left());
            xMax = max(cell1.right(), cell2.right());
            yMin = min(cell1.top(), cell2.top());
            yMax = max(cell1.bottom(), cell2.bottom());
            return new Rect(xMin, yMin, xMax - xMin, yMax - yMin);
        };

        Zoomer.prototype.transform = function () {
            var k;
            this.ctx.translate(this.center.x, this.center.y);
            k = this.scale * this.defaultZoom;
            return this.ctx.scale(k, k);
        };

        Zoomer.prototype.zoom = function (k, zoomCenter) {
            var offset;
            if (k == null) {
                k = 1;
            }
            offset = this.center.subtract(zoomCenter);
            this.center = zoomCenter.add(offset.mult(k / this._scale));
            return this._scale = k;
        };

        Zoomer.prototype.moveCenter = function (offset) {
            return this.center = this.center.add(offset);
        };

        Zoomer.prototype.mousewheel = function (e) {
            var offset, zoomFactor;
            offset = e.deltaY * e.deltaFactor;
            zoomFactor = Math.pow(2, 0.001 * offset);
            this.zoom(this.scale * zoomFactor, this.getPoint(e));
            return e.preventDefault();
        };

        return Zoomer;
    });
