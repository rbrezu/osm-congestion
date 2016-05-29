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
    .factory('ToolIntersectionBuilder', function (Intersection, Tool) {
        __extends(ToolIntersectionBuilder, Tool);

        function ToolIntersectionBuilder() {
            this.draw = __bind(this.draw, this);
            this.mouseout = __bind(this.mouseout, this);
            this.mousemove = __bind(this.mousemove, this);
            this.mouseup = __bind(this.mouseup, this);
            this.mousedown = __bind(this.mousedown, this);
            ToolIntersectionBuilder.__super__.constructor.apply(this, arguments);
            this.tempIntersection = null;
            this.mouseDownPos = null;
        }

        ToolIntersectionBuilder.prototype.mousedown = function (e) {
            this.mouseDownPos = this.getCell(e);
            if (e.shiftKey) {
                this.tempIntersection = new Intersection(this.mouseDownPos);
                return e.stopImmediatePropagation();
            }
        };

        ToolIntersectionBuilder.prototype.mouseup = function () {
            if (this.tempIntersection) {
                this.visualizer.world.addIntersection(this.tempIntersection);
                this.tempIntersection = null;
            }
            return this.mouseDownPos = null;
        };

        ToolIntersectionBuilder.prototype.mousemove = function (e) {
            var rect;
            if (this.tempIntersection) {
                rect = this.visualizer.zoomer.getBoundingBox(this.mouseDownPos, this.getCell(e));
                return this.tempIntersection.rect = rect;
            }
        };

        ToolIntersectionBuilder.prototype.mouseout = function () {
            this.mouseDownPos = null;
            return this.tempIntersection = null;
        };

        ToolIntersectionBuilder.prototype.draw = function () {
            if (this.tempIntersection) {
                return this.visualizer.drawIntersection(this.tempIntersection, 0.4);
            }
        };

        return ToolIntersectionBuilder;
    });
