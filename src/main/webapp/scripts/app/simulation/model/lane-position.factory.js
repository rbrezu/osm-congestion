/**
 * Created by root on 28.05.2016.
 */
'use strict';

angular.module('osmmapscongestionApp')
    .factory('LanePosition', function () {
        function LanePosition(car, lane, position) {
            this.car = car;
            this.position = position;
            this.id = _.uniqueId('laneposition');
            this.free = true;
            this.lane = lane;
        }

        LanePosition.property('lane', {
            get: function () {
                return this._lane;
            },
            set: function (lane) {
                this.release();
                return this._lane = lane;
            }
        });

        LanePosition.property('relativePosition', {
            get: function () {
                return this.position / this.lane.length;
            }
        });

        LanePosition.prototype.acquire = function () {
            var _ref;
            if (((_ref = this.lane) != null ? _ref.addCarPosition : void 0) != null) {
                this.free = false;
                return this.lane.addCarPosition(this);
            }
        };

        LanePosition.prototype.release = function () {
            var _ref;
            if (!this.free && ((_ref = this.lane) != null ? _ref.removeCar : void 0)) {
                this.free = true;
                return this.lane.removeCar(this);
            }
        };

        LanePosition.prototype.getNext = function () {
            if (this.lane && !this.free) {
                return this.lane.getNext(this);
            }
        };

        LanePosition.property('nextCarDistance', {
            get: function () {
                var frontPosition, next, rearPosition, result;
                next = this.getNext();
                if (next) {
                    rearPosition = next.position - next.car.length / 2;
                    frontPosition = this.position + this.car.length / 2;
                    return result = {
                        car: next.car,
                        distance: rearPosition - frontPosition
                    };
                }
                return result = {
                    car: null,
                    distance: Infinity
                };
            }
        });

        return LanePosition;
    });
