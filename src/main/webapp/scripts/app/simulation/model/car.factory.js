/**
 * Created by root on 28.05.2016.
 */
'use strict';

var pow = Math.pow, random = Math.random;

angular.module('osmmapscongestionApp')
    .factory('Car', function (Trajectory) {
        function Car(lane, position) {
            this.id = _.uniqueId('car');
            this.color = (300 + 240 * this.speed | 0) % 360;
            this._speed = 0;
            this.width = 1.7 + random() * 0.2;
            this.length = 3 + 2 * random();
            this.maxSpeed = 30;
            this.s0 = 2;
            this.timeHeadway = 1.5;
            this.maxAcceleration = 1;
            this.maxDeceleration = 3;
            this.trajectory = new Trajectory(this, lane, position);
            this.alive = true;
            this.preferedLane = null;
        }

        Car.property('coords', {
            get: function () {
                return this.trajectory.coords;
            }
        });

        Car.property('speed', {
            get: function () {
                return this._speed;
            },
            set: function (speed) {
                if (speed < 0) {
                    speed = 0;
                }
                if (speed > this.maxSpeed) {
                    speed = this.maxSpeed;
                }
                return this._speed = speed;
            }
        });

        Car.property('direction', {
            get: function () {
                return this.trajectory.direction;
            }
        });

        Car.prototype.release = function () {
            return this.trajectory.release();
        };

        Car.prototype.getAcceleration = function () {
            var a, b, breakGap, busyRoadCoeff, coeff, deltaSpeed, distanceGap, distanceToNextCar, freeRoadCoeff, intersectionCoeff, nextCarDistance, safeDistance, safeIntersectionDistance, timeGap, _ref;
            nextCarDistance = this.trajectory.nextCarDistance;
            distanceToNextCar = max(nextCarDistance.distance, 0);
            a = this.maxAcceleration;
            b = this.maxDeceleration;
            deltaSpeed = (this.speed - ((_ref = nextCarDistance.car) != null ? _ref.speed : void 0)) || 0;
            freeRoadCoeff = pow(this.speed / this.maxSpeed, 4);
            distanceGap = this.s0;
            timeGap = this.speed * this.timeHeadway;
            breakGap = this.speed * deltaSpeed / (2 * sqrt(a * b));
            safeDistance = distanceGap + timeGap + breakGap;
            busyRoadCoeff = pow(safeDistance / distanceToNextCar, 2);
            safeIntersectionDistance = 1 + timeGap + pow(this.speed, 2) / (2 * b);
            intersectionCoeff = pow(safeIntersectionDistance / this.trajectory.distanceToStopLine, 2);
            coeff = 1 - freeRoadCoeff - busyRoadCoeff - intersectionCoeff;
            return this.maxAcceleration * coeff;
        };

        Car.prototype.move = function (delta) {
            var acceleration, currentLane, preferedLane, step, turnNumber;
            acceleration = this.getAcceleration();
            this.speed += acceleration * delta;
            if (!this.trajectory.isChangingLanes && this.nextLane) {
                currentLane = this.trajectory.current.lane;
                turnNumber = currentLane.getTurnDirection(this.nextLane);
                preferedLane = (function () {
                    switch (turnNumber) {
                        case 0:
                            return currentLane.leftmostAdjacent;
                        case 2:
                            return currentLane.rightmostAdjacent;
                        default:
                            return currentLane;
                    }
                })();
                if (preferedLane !== currentLane) {
                    this.trajectory.changeLane(preferedLane);
                }
            }
            step = this.speed * delta + 0.5 * acceleration * pow(delta, 2);
            if (this.trajectory.nextCarDistance.distance < step) {
                console.log('bad IDM');
            }
            if (this.trajectory.timeToMakeTurn(step)) {
                if (this.nextLane == null) {
                    return this.alive = false;
                }
            }
            return this.trajectory.moveForward(step);
        };

        Car.prototype.pickNextRoad = function () {
            var currentLane, intersection, nextRoad, possibleRoads;
            intersection = this.trajectory.nextIntersection;
            currentLane = this.trajectory.current.lane;
            possibleRoads = intersection.roads.filter(function (x) {
                return x.target !== currentLane.road.source;
            });
            if (possibleRoads.length === 0) {
                return null;
            }
            return nextRoad = _.sample(possibleRoads);
        };

        Car.prototype.pickNextLane = function () {
            var laneNumber, nextRoad, turnNumber;
            if (this.nextLane) {
                throw Error('next lane is already chosen');
            }
            this.nextLane = null;
            nextRoad = this.pickNextRoad();
            if (!nextRoad) {
                return null;
            }
            turnNumber = this.trajectory.current.lane.road.getTurnDirection(nextRoad);
            laneNumber = (function () {
                switch (turnNumber) {
                    case 0:
                        return nextRoad.lanesNumber - 1;
                    case 1:
                        return _.random(0, nextRoad.lanesNumber - 1);
                    case 2:
                        return 0;
                }
            })();
            this.nextLane = nextRoad.lanes[laneNumber];
            if (!this.nextLane) {
                throw Error('can not pick next lane');
            }
            return this.nextLane;
        };

        Car.prototype.popNextLane = function () {
            var nextLane;
            nextLane = this.nextLane;
            this.nextLane = null;
            this.preferedLane = null;
            return nextLane;
        };

        return Car;
    });
