/**
 * Created by root on 28.05.2016.
 */
'use strict';

angular.module('osmmapscongestionApp')
    .factory('Lane', function(Segment) {
        function Lane(sourceSegment, targetSegment, road) {
            this.sourceSegment = sourceSegment;
            this.targetSegment = targetSegment;
            this.road = road;
            this.leftAdjacent = null;
            this.rightAdjacent = null;
            this.leftmostAdjacent = null;
            this.rightmostAdjacent = null;
            this.carsPositions = {};
            this.update();
        }

        Lane.prototype.toJSON = function () {
            var obj;
            obj = _.extend({}, this);
            delete obj.carsPositions;
            return obj;
        };

        Lane.property('sourceSideId', {
            get: function () {
                return this.road.sourceSideId;
            }
        });

        Lane.property('targetSideId', {
            get: function () {
                return this.road.targetSideId;
            }
        });

        Lane.property('isRightmost', {
            get: function () {
                return this === this.rightmostAdjacent;
            }
        });

        Lane.property('isLeftmost', {
            get: function () {
                return this === this.leftmostAdjacent;
            }
        });

        Lane.property('leftBorder', {
            get: function () {
                return new Segment(this.sourceSegment.source, this.targetSegment.target);
            }
        });

        Lane.property('rightBorder', {
            get: function () {
                return new Segment(this.sourceSegment.target, this.targetSegment.source);
            }
        });

        Lane.prototype.update = function () {
            this.middleLine = new Segment(this.sourceSegment.center, this.targetSegment.center);
            this.length = this.middleLine.length;
            return this.direction = this.middleLine.direction;
        };

        Lane.prototype.getTurnDirection = function (other) {
            return this.road.getTurnDirection(other.road);
        };

        Lane.prototype.getDirection = function () {
            return this.direction;
        };

        Lane.prototype.getPoint = function (a) {
            return this.middleLine.getPoint(a);
        };

        Lane.prototype.addCarPosition = function (carPosition) {
            if (carPosition.id in this.carsPositions) {
                throw Error('car is already here');
            }
            return this.carsPositions[carPosition.id] = carPosition;
        };

        Lane.prototype.removeCar = function (carPosition) {
            if (!(carPosition.id in this.carsPositions)) {
                throw Error('removing unknown car');
            }
            return delete this.carsPositions[carPosition.id];
        };

        Lane.prototype.getNext = function (carPosition) {
            var bestDistance, distance, id, next, o, _ref;
            if (carPosition.lane !== this) {
                throw Error('car is on other lane');
            }
            next = null;
            bestDistance = Infinity;
            _ref = this.carsPositions;
            for (id in _ref) {
                o = _ref[id];
                distance = o.position - carPosition.position;
                if (!o.free && (0 < distance && distance < bestDistance)) {
                    bestDistance = distance;
                    next = o;
                }
            }
            return next;
        };

        return Lane;
    });
