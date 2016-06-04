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
            this.ctx.beginPath();
            this.ctx.moveTo(pts[0], pts[1]);
            for (var i = 2; i < pts.length; i += 2)
                this.ctx.lineTo(pts[i], pts[i + 1]);

            return this.ctx.stroke();
        };

        Graphics.prototype.drawSegment = function (segment) {
            return this.drawLine(segment.source, segment.target);
        };

        Graphics.prototype.drawCurveSpline = function (pts, tension, isClosed, numOfSegments, showPoints) {
            showPoints = showPoints ? showPoints : true;

            this.drawLines(
                this.getCurvePoints(pts, tension, 25, false)
            );

            /*if (showPoints) {
                this.ctx.beginPath();
                for (var i = 0; i < pts.length - 1; i += 2)
                    this.ctx.rect(pts[i], pts[i + 1], 5, 5);

                this.ctx.strokeStyle = "red";
                this.ctx.stroke();
                this.ctx.fill();
            }*/
        };

        Graphics.prototype.getCurvePoints = function getCurvePoints(points, tension, numOfSeg, close) {
            // options or defaults
            tension = (typeof tension === 'number') ? tension : 0.5;
            numOfSeg = (typeof numOfSeg === 'number') ? numOfSeg : 25;

            var pts,															// for cloning point array
                i = 1,
                l = points.length,
                rPos = 0,
                rLen = (l - 2) * numOfSeg + 2 + (close ? 2 * numOfSeg : 0),
                res = new Float32Array(rLen),
                cache = new Float32Array((numOfSeg + 2) * 4),
                cachePtr = 4;

            pts = points.slice(0);

            if (close) {
                pts.unshift(points[l - 1]);										// insert end point as first point
                pts.unshift(points[l - 2]);
                pts.push(points[0], points[1]); 								// first point as last point
            }
            else {
                pts.unshift(points[1]);											// copy 1. point and insert at beginning
                pts.unshift(points[0]);
                pts.push(points[l - 2], points[l - 1]);							// duplicate end-points
            }

            // cache inner-loop calculations as they are based on t alone
            cache[0] = 1;														// 1,0,0,0

            for (; i < numOfSeg; i++) {

                var st = i / numOfSeg,
                    st2 = st * st,
                    st3 = st2 * st,
                    st23 = st3 * 2,
                    st32 = st2 * 3;

                cache[cachePtr++] = st23 - st32 + 1;							// c1
                cache[cachePtr++] = st32 - st23;								// c2
                cache[cachePtr++] = st3 - 2 * st2 + st;							// c3
                cache[cachePtr++] = st3 - st2;									// c4
            }

            cache[++cachePtr] = 1;												// 0,1,0,0

            // calc. points
            parse(pts, cache, l, tension);

            if (close) {
                //l = points.length;
                pts = [];
                pts.push(points[l - 4], points[l - 3],
                    points[l - 2], points[l - 1], 							// second last and last
                    points[0], points[1],
                    points[2], points[3]); 								// first and second
                parse(pts, cache, 4, tension);
            }

            function parse(pts, cache, l, tension) {

                for (var i = 2, t; i < l; i += 2) {

                    var pt1 = pts[i],
                        pt2 = pts[i + 1],
                        pt3 = pts[i + 2],
                        pt4 = pts[i + 3],

                        t1x = (pt3 - pts[i - 2]) * tension,
                        t1y = (pt4 - pts[i - 1]) * tension,
                        t2x = (pts[i + 4] - pt1) * tension,
                        t2y = (pts[i + 5] - pt2) * tension,
                        c = 0, c1, c2, c3, c4;

                    for (t = 0; t < numOfSeg; t++) {

                        c1 = cache[c++];
                        c2 = cache[c++];
                        c3 = cache[c++];
                        c4 = cache[c++];

                        res[rPos++] = c1 * pt1 + c2 * pt3 + c3 * t1x + c4 * t2x;
                        res[rPos++] = c1 * pt2 + c2 * pt4 + c3 * t1y + c4 * t2y;
                    }
                }
            }

            // add last point
            l = close ? 0 : points.length - 2;
            res[rPos++] = points[l++];
            res[rPos] = points[l];

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
