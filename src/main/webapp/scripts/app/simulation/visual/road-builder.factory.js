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
    .factory('ToolRoadBuilder', function (Road, Tool) {
        __extends(ToolRoadBuilder, Tool);

        function ToolRoadBuilder() {
            this.draw = __bind(this.draw, this);
            this.mouseout = __bind(this.mouseout, this);
            this.mousemove = __bind(this.mousemove, this);
            this.mouseup = __bind(this.mouseup, this);
            this.mousedown = __bind(this.mousedown, this);
            ToolRoadBuilder.__super__.constructor.apply(this, arguments);
            this.sourceIntersection = null;
            this.road = null;
            this.dualRoad = null;
        }

        ToolRoadBuilder.prototype.mousedown = function (e) {
            var cell, hoveredIntersection;
            cell = this.getCell(e);
            hoveredIntersection = this.getHoveredIntersection(cell);
            if (e.shiftKey && (hoveredIntersection != null)) {
                this.sourceIntersection = hoveredIntersection;
                return e.stopImmediatePropagation();
            }
        };

        ToolRoadBuilder.prototype.mouseup = function (e) {
            if (this.road != null) {
                this.visualizer.world.addRoad(this.road);
            }
            /*if (this.dualRoad != null) {
                this.visualizer.world.addRoad(this.dualRoad);
            }*/
            return this.road = this.dualRoad = this.sourceIntersection = null;
        };

        ToolRoadBuilder.prototype.mousemove = function (e) {
            var cell, hoveredIntersection;
            cell = this.getCell(e);
            hoveredIntersection = this.getHoveredIntersection(cell);
            if (this.sourceIntersection && hoveredIntersection && this.sourceIntersection.id !== hoveredIntersection.id) {
                if (this.road != null) {
                    this.road.target = hoveredIntersection;
                    return this.dualRoad.source = hoveredIntersection;
                } else {
                    this.road = new Road(this.sourceIntersection, hoveredIntersection);
                    return this.dualRoad = new Road(hoveredIntersection, this.sourceIntersection);
                }
            } else {
                return this.road = this.dualRoad = null;
            }
        };

        ToolRoadBuilder.prototype.mouseout = function (e) {
            return this.road = this.dualRoad = this.sourceIntersection = null;
        };

        ToolRoadBuilder.prototype.draw = function () {
            if (this.road != null) {
                this.visualizer.drawRoad(this.road, 0.4);
            }/*
            if (this.dualRoad != null) {
                return this.visualizer.drawRoad(this.dualRoad, 0.4);
            }*/
        };

        return ToolRoadBuilder;
    });
