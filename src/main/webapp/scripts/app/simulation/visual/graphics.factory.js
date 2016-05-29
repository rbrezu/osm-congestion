/**
 * Created by root on 28.05.2016.
 */
'use strict';
var PI,
    __slice = [].slice;

PI = Math.PI;

angular.module('osmmapscongestionApp')
    .factory('Graphics', function () {
        function Graphics(ctx) {
            this.ctx = ctx;
        }

        Graphics.prototype.fillRect = function (rect, style, alpha) {
            var _alpha;
            if (style != null) {
                this.ctx.fillStyle = style;
            }
            _alpha = this.ctx.globalAlpha;
            if (alpha != null) {
                this.ctx.globalAlpha = alpha;
            }
            this.ctx.fillRect(rect.left(), rect.top(), rect.width(), rect.height());
            return this.ctx.globalAlpha = _alpha;
        };

        Graphics.prototype.drawRect = function (rect) {
            var point, vertices, _i, _len, _ref;
            vertices = rect.getVertices();
            this.ctx.beginPath();
            this.moveTo(vertices[0]);
            _ref = vertices.slice(1);
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                point = _ref[_i];
                this.lineTo(point);
            }
            return this.ctx.closePath();
        };

        Graphics.prototype.drawImage = function (image, rect) {
            return this.ctx.drawImage(image, rect.left(), rect.top(), rect.width(), rect.height());
        };

        Graphics.prototype.clear = function (color) {
            this.ctx.fillStyle = color;
            return this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        };

        Graphics.prototype.moveTo = function (point) {
            return this.ctx.moveTo(point.x, point.y);
        };

        Graphics.prototype.lineTo = function (point) {
            return this.ctx.lineTo(point.x, point.y);
        };

        Graphics.prototype.drawLine = function (source, target) {
            this.ctx.beginPath();
            this.moveTo(source);
            return this.lineTo(target);
        };

        Graphics.prototype.drawLines = function (pts) {
            this.ctx.moveTo(pts[0], pts[1]);
            for (var i = 2; i < pts.length; i += 2)
                this.ctx.lineTo(pts[i], pts[i + 1]);
        };

        Graphics.prototype.drawSegment = function (segment) {
            return this.drawLine(segment.source, segment.target);
        };

        Graphics.prototype.drawCurveSpline = function (pts, tension, isClosed, numOfSegments, showPoints) {
            showPoints = showPoints ? showPoints : true;

            this.ctx.beginPath();
            this.drawLines(
                this.getCurvePoints(pts, tension, isClosed, numOfSegments)
            );

            if (showPoints) {
                //this.ctx.strokeStyle="red";
                this.ctx.stroke();
                this.ctx.beginPath();
                for (var i = 0; i < pts.length - 1; i += 2)
                    this.ctx.rect(pts[i] - 2, pts[i + 1] - 2, 4, 4);
            }
        };

        Graphics.prototype.getCurvePoints = function (pts, tension, isClosed, numOfSegments) {
            // use input value if provided, or use a default value
            tension = (typeof tension != 'undefined') ? tension : 0.5;
            isClosed = isClosed ? isClosed : false;
            numOfSegments = numOfSegments ? numOfSegments : 16;

            var _pts = [], res = [],    // clone array
                x, y,           // our x,y coords
                t1x, t2x, t1y, t2y, // tension vectors
                c1, c2, c3, c4,     // cardinal points
                st, t, i;       // steps based on num. of segments

            // clone array so we don't change the original
            //
            _pts = pts.slice(0);

            // The algorithm require a previous and next point to the actual point array.
            // Check if we will draw closed or open curve.
            // If closed, copy end points to beginning and first points to end
            // If open, duplicate first points to befinning, end points to end
            if (isClosed) {
                _pts.unshift(pts[pts.length - 1]);
                _pts.unshift(pts[pts.length - 2]);
                _pts.unshift(pts[pts.length - 1]);
                _pts.unshift(pts[pts.length - 2]);
                _pts.push(pts[0]);
                _pts.push(pts[1]);
            }
            else {
                _pts.unshift(pts[1]);   //copy 1. point and insert at beginning
                _pts.unshift(pts[0]);
                _pts.push(pts[pts.length - 2]); //copy last point and append
                _pts.push(pts[pts.length - 1]);
            }

            // ok, lets start..

            // 1. loop goes through point array
            // 2. loop goes through each segment between the 2 pts + 1e point before and after
            for (i=2; i < (_pts.length - 4); i+=2) {
                for (t=0; t <= numOfSegments; t++) {

                    // calc tension vectors
                    t1x = (_pts[i+2] - _pts[i-2]) * tension;
                    t2x = (_pts[i+4] - _pts[i]) * tension;

                    t1y = (_pts[i+3] - _pts[i-1]) * tension;
                    t2y = (_pts[i+5] - _pts[i+1]) * tension;

                    // calc step
                    st = t / numOfSegments;

                    // calc cardinals
                    c1 =   2 * Math.pow(st, 3)  - 3 * Math.pow(st, 2) + 1;
                    c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2);
                    c3 =       Math.pow(st, 3)  - 2 * Math.pow(st, 2) + st;
                    c4 =       Math.pow(st, 3)  -     Math.pow(st, 2);

                    // calc x and y cords with common control vectors
                    x = c1 * _pts[i]    + c2 * _pts[i+2] + c3 * t1x + c4 * t2x;
                    y = c1 * _pts[i+1]  + c2 * _pts[i+3] + c3 * t1y + c4 * t2y;

                    //store points in array
                    res.push(x);
                    res.push(y);

                }
            }

            return res;
        };

        Graphics.prototype.drawCurve = function (curve, width, color) {
            var i, point, pointsNumber, _i;
            pointsNumber = 10;
            this.ctx.lineWidth = width;
            this.ctx.beginPath();
            this.moveTo(curve.getPoint(0));
            for (i = _i = 0; 0 <= pointsNumber ? _i <= pointsNumber : _i >= pointsNumber; i = 0 <= pointsNumber ? ++_i : --_i) {
                point = curve.getPoint(i / pointsNumber);
                this.lineTo(point);
            }
            if (curve.O) {
                this.moveTo(curve.O);
                this.ctx.arc(curve.O.x, curve.O.y, width, 0, 2 * PI);
            }
            if (curve.Q) {
                this.moveTo(curve.Q);
                this.ctx.arc(curve.Q.x, curve.Q.y, width, 0, 2 * PI);
            }
            if (color) {
                return this.stroke(color);
            }
        };

        Graphics.prototype.drawTriangle = function (p1, p2, p3) {
            this.ctx.beginPath();
            this.moveTo(p1);
            this.lineTo(p2);
            return this.lineTo(p3);
        };

        Graphics.prototype.fill = function (style, alpha) {
            var _alpha;
            this.ctx.fillStyle = style;
            _alpha = this.ctx.globalAlpha;
            if (alpha != null) {
                this.ctx.globalAlpha = alpha;
            }
            this.ctx.fill();
            return this.ctx.globalAlpha = _alpha;
        };

        Graphics.prototype.stroke = function (style) {
            this.ctx.strokeStyle = style;
            return this.ctx.stroke();
        };

        Graphics.prototype.polyline = function () {
            var point, points, _i, _len, _ref;
            points = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            if (points.length >= 1) {
                this.ctx.beginPath();
                this.moveTo(points[0]);
                _ref = points.slice(1);
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    point = _ref[_i];
                    this.lineTo(point);
                }
                return this.ctx.closePath();
            }
        };

        Graphics.prototype.save = function () {
            return this.ctx.save();
        };

        Graphics.prototype.restore = function () {
            return this.ctx.restore();
        };

        return Graphics;
    });
