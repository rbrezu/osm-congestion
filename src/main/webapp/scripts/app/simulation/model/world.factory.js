/**
 * Created by root on 28.05.2016.
 */
'use strict';

var random,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

random = Math.random;

angular.module('osmmapscongestionApp')
    .factory('World', function (Car, Intersection, Pool, Rect, Road, Settings) {
        function World() {
            this.onTick = __bind(this.onTick, this);
            this.set({});
        }

        World.property('instantSpeed', {
            get: function () {
                var speeds;
                speeds = _.map(this.cars.all(), function (car) {
                    return car.speed;
                });
                if (speeds.length === 0) {
                    return 0;
                }
                return (_.reduce(speeds, function (a, b) {
                        return a + b;
                    })) / speeds.length;
            }
        });

        World.prototype.set = function (obj) {
            if (obj == null) {
                obj = {};
            }
            this.intersections = new Pool(Intersection, obj.intersections);
            this.roads = new Pool(Road, obj.roads);
            this.cars = new Pool(Car, obj.cars);
            this.carsNumber = 0;
            return this.time = 0;
        };

        World.prototype.save = function () {
            var data;
            data = _.extend({}, this);
            delete data.cars;
            return localStorage.world = JSON.stringify(data);
        };

        World.prototype.load = function (data) {
            var id, intersection, road, _ref, _ref1, _results;
            data = data || localStorage.world;
            data = data && JSON.parse(data);
            if (data == null) {
                return;
            }
            this.clear();
            this.carsNumber = data.carsNumber || 0;
            _ref = data.intersections;
            for (id in _ref) {
                intersection = _ref[id];
                this.addIntersection(Intersection.copy(intersection));
            }
            _ref1 = data.roads;
            _results = [];
            for (id in _ref1) {
                road = _ref1[id];
                road = Road.copy(road);
                road.source = this.getIntersection(road.source);
                road.target = this.getIntersection(road.target);
                _results.push(this.addRoad(road));
            }
            return _results;
        };

        World.prototype.generateMap = function (minX, maxX, minY, maxY) {
            var gridSize, intersection, intersectionsNumber, map, previous, rect, step, x, y, _i, _j, _k, _l;
            if (minX == null) {
                minX = -2;
            }
            if (maxX == null) {
                maxX = 2;
            }
            if (minY == null) {
                minY = -2;
            }
            if (maxY == null) {
                maxY = 2;
            }

            this.clear();
            intersectionsNumber = (0.8 * (maxX - minX + 1) * (maxY - minY + 1)) | 0;
            map = {};
            gridSize = Settings.gridSize;
            step = 5 * gridSize;
            this.carsNumber = 100;
            while (intersectionsNumber > 0) {
                x = _.random(minX, maxX);
                y = _.random(minY, maxY);
                if (map[[x, y]] == null) {
                    rect = new Rect(step * x, step * y, gridSize, gridSize);
                    intersection = new Intersection(rect);
                    this.addIntersection(map[[x, y]] = intersection);
                    intersectionsNumber -= 1;
                }
            }
            for (x = _i = minX; minX <= maxX ? _i <= maxX : _i >= maxX; x = minX <= maxX ? ++_i : --_i) {
                previous = null;
                for (y = _j = minY; minY <= maxY ? _j <= maxY : _j >= maxY; y = minY <= maxY ? ++_j : --_j) {
                    intersection = map[[x, y]];
                    if (intersection != null) {
                        if (random() < 0.9) {
                            if (previous != null) {
                                this.addRoad(new Road(intersection, previous));
                            }
                            if (previous != null) {
                                this.addRoad(new Road(previous, intersection));
                            }
                        }
                        previous = intersection;
                    }
                }
            }
            for (y = _k = minY; minY <= maxY ? _k <= maxY : _k >= maxY; y = minY <= maxY ? ++_k : --_k) {
                previous = null;
                for (x = _l = minX; minX <= maxX ? _l <= maxX : _l >= maxX; x = minX <= maxX ? ++_l : --_l) {
                    intersection = map[[x, y]];
                    if (intersection != null) {
                        if (random() < 0.9) {
                            if (previous != null) {
                                this.addRoad(new Road(intersection, previous));
                            }
                            if (previous != null) {
                                this.addRoad(new Road(previous, intersection));
                            }
                        }
                        previous = intersection;
                    }
                }
            }
            return null;
        };

        World.prototype.clear = function () {
            return this.set({});
        };

        World.prototype.onTick = function (delta) {
            var car, id, intersection, _ref, _ref1, _results;
            if (delta > 1) {
                throw Error('delta > 1');
            }
            this.time += delta;
            this.refreshCars();
            _ref = this.intersections.all();
            for (id in _ref) {
                intersection = _ref[id];
                intersection.controlSignals.onTick(delta);
            }
            _ref1 = this.cars.all();
            _results = [];
            for (id in _ref1) {
                car = _ref1[id];
                car.move(delta);
                if (!car.alive) {
                    _results.push(this.removeCar(car));
                } else {
                    _results.push(void 0);
                }
            }
            return _results;
        };

        World.prototype.refreshCars = function () {
            if (this.cars.length < this.carsNumber) {
                this.addRandomCar();
            }
            if (this.cars.length > this.carsNumber) {
                return this.removeRandomCar();
            }
        };

        World.prototype.addRoad = function (road) {
            this.roads.put(road);
            road.source.roads.push(road);
            road.target.inRoads.push(road);
            return road.update();
        };

        World.prototype.getRoad = function (id) {
            return this.roads.get(id);
        };

        World.prototype.addCar = function (car) {
            return this.cars.put(car);
        };

        World.prototype.getCar = function (id) {
            return this.cars.get(id);
        };

        World.prototype.removeCar = function (car) {
            return this.cars.pop(car);
        };

        World.prototype.addIntersection = function (intersection) {
            return this.intersections.put(intersection);
        };

        World.prototype.getIntersection = function (id) {
            return this.intersections.get(id);
        };

        World.prototype.addRandomCar = function () {
            var lane, road;
            road = _.sample(this.roads.all());
            if (road != null) {
                lane = _.sample(road.lanes);
                if (lane != null) {
                    return this.addCar(new Car(lane));
                }
            }
        };

        World.prototype.removeRandomCar = function () {
            var car;
            car = _.sample(this.cars.all());
            if (car != null) {
                return this.removeCar(car);
            }
        };

        return World;
    });
