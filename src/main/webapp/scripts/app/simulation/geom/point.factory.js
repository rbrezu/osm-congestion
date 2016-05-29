/**
 * Created by root on 28.05.2016.
 */
'use strict';

var sqrt = Math.sqrt, atan2 = Math.atan2;

angular.module('osmmapscongestionApp')
    .factory('Point', function () {
        function Point(x, y) {
            this.x = x != null ? x : 0;
            this.y = y != null ? y : 0;
        }

        Point.property('length', {
            get: function () {
                return sqrt(this.x * this.x + this.y * this.y);
            }
        });

        Point.property('direction', {
            get: function () {
                return atan2(this.y, this.x);
            }
        });

        Point.property('normalized', {
            get: function () {
                return new Point(this.x / this.length, this.y / this.length);
            }
        });

        Point.prototype.add = function (o) {
            return new Point(this.x + o.x, this.y + o.y);
        };

        Point.prototype.subtract = function (o) {
            return new Point(this.x - o.x, this.y - o.y);
        };

        Point.prototype.mult = function (k) {
            return new Point(this.x * k, this.y * k);
        };

        Point.prototype.divide = function (k) {
            return new Point(this.x / k, this.y / k);
        };

        return Point;
    });
