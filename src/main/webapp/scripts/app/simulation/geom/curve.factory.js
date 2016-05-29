/**
 * Created by root on 28.05.2016.
 */
'use strict';

angular.module('osmmapscongestionApp')
    .factory('Curve', function (Segment) {
        function Curve(A, B, O, Q) {
            this.A = A;
            this.B = B;
            this.O = O;
            this.Q = Q;
            this.AB = new Segment(this.A, this.B);
            this.AO = new Segment(this.A, this.O);
            this.OQ = new Segment(this.O, this.Q);
            this.QB = new Segment(this.Q, this.B);
            this._length = null;
        }

        Curve.property('length', {
            get: function () {
                var i, point, pointsNumber, prevoiusPoint, _i;
                if (this._length == null) {
                    pointsNumber = 10;
                    prevoiusPoint = null;
                    this._length = 0;
                    for (i = _i = 0; 0 <= pointsNumber ? _i <= pointsNumber : _i >= pointsNumber; i = 0 <= pointsNumber ? ++_i : --_i) {
                        point = this.getPoint(i / pointsNumber);
                        if (prevoiusPoint) {
                            this._length += point.subtract(prevoiusPoint).length;
                        }
                        prevoiusPoint = point;
                    }
                }
                return this._length;
            }
        });

        Curve.prototype.getPoint = function (a) {
            var p0, p1, p2, r0, r1;
            p0 = this.AO.getPoint(a);
            p1 = this.OQ.getPoint(a);
            p2 = this.QB.getPoint(a);
            r0 = (new Segment(p0, p1)).getPoint(a);
            r1 = (new Segment(p1, p2)).getPoint(a);
            return (new Segment(r0, r1)).getPoint(a);
        };

        Curve.prototype.getDirection = function (a) {
            var p0, p1, p2, r0, r1;
            p0 = this.AO.getPoint(a);
            p1 = this.OQ.getPoint(a);
            p2 = this.QB.getPoint(a);
            r0 = (new Segment(p0, p1)).getPoint(a);
            r1 = (new Segment(p1, p2)).getPoint(a);
            return (new Segment(r0, r1)).direction;
        };

        return Curve;
    });
