/**
 * Created by root on 28.05.2016.
 */
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); };},
    PI;

PI = Math.PI;

angular.module('osmmapscongestionApp')
    .factory('Visualizer', function (Point, Rect,
                                     Graphics, ToolMover,
                                     ToolIntersectionMover, ToolIntersectionBuilder,
                                     ToolRoadBuilder,
                                     ToolHighlighter,
                                     Zoomer,
                                     Settings) {
        function Visualizer(world) {
            this.world = world;
            this.draw = __bind(this.draw, this);
            this.$canvas = $('#canvas');
            this.canvas = this.$canvas[0];
            this.ctx = this.canvas.getContext('2d');
            this.carImage = new Image();
            this.carImage.src = 'images/car.png';
            this.updateCanvasSize();
            this.zoomer = new Zoomer(4, this, true);
            this.graphics = new Graphics(this.ctx);
            this.toolRoadbuilder = new ToolRoadBuilder(this, true);
            this.toolIntersectionBuilder = new ToolIntersectionBuilder(this, true);
            this.toolHighlighter = new ToolHighlighter(this, true);
            this.toolIntersectionMover = new ToolIntersectionMover(this, true);
            this.toolMover = new ToolMover(this, true);
            this._running = false;
            this.previousTime = 0;
            this.timeFactor = Settings.defaultTimeFactor;
            this.debug = false;
        }

        Visualizer.prototype.drawIntersection = function (intersection, alpha) {
            var color;
            color = intersection.color || Settings.colors.intersection;

          /*  if (intersection.roads.length === 2) {
                var vertices = intersection.rect.getVertices();

                this.graphics.drawTriangle(vertices[0], vertices[1], vertices[2]);
                this.ctx.lineWidth = 0.4;
                this.graphics.stroke(Settings.colors.roadMarking);
                return this.graphics.fill(color, alpha);
            }  */

            this.graphics.drawRect(intersection.rect);
            this.ctx.lineWidth = 0.4;
            this.graphics.stroke(Settings.colors.roadMarking);
            return this.graphics.fillRect(intersection.rect, color, alpha);
        };

        Visualizer.prototype.drawSignals = function (road) {
            var center, flipInterval, intersection, lights, lightsColors, phaseOffset, segment, sideId;
            lightsColors = [Settings.colors.redLight, Settings.colors.greenLight];
            intersection = road.target;
            segment = road.targetSide;
            sideId = road.targetSideId;
            lights = intersection.controlSignals.state[sideId];
            this.ctx.save();
            this.ctx.translate(segment.center.x, segment.center.y);
            this.ctx.rotate((sideId + 1) * PI / 2);
            this.ctx.scale(1 * segment.length, 1 * segment.length);

            this.graphics.drawTriangle(new Point(0.1, -0.2), new Point(0.2, -0.4), new Point(0.3, -0.2));
            if (lights[0]) {
                this.graphics.fill(Settings.colors.greenLight);
            } else this.graphics.fill(Settings.colors.redLight);

            this.graphics.drawTriangle(new Point(0.3, -0.1), new Point(0.5, 0), new Point(0.3, 0.1));
            if (lights[1]) {
                this.graphics.fill(Settings.colors.greenLight);
            } else this.graphics.fill(Settings.colors.redLight);

            this.graphics.drawTriangle(new Point(0.1, 0.2), new Point(0.2, 0.4), new Point(0.3, 0.2));
            if (lights[2]) {
                this.graphics.fill(Settings.colors.greenLight);
            } else this.graphics.fill(Settings.colors.redLight);

            this.ctx.restore();
            if (this.debug) {
                this.ctx.save();
                this.ctx.fillStyle = "black";
                this.ctx.font = "1px Arial";
                center = intersection.rect.center();
                flipInterval = Math.round(intersection.controlSignals.flipInterval * 100) / 100;
                phaseOffset = Math.round(intersection.controlSignals.phaseOffset * 100) / 100;
                this.ctx.fillText(flipInterval + ' ' + phaseOffset, center.x, center.y);
                return this.ctx.restore();
            }
        };

        Visualizer.prototype.drawRoad = function (road, alpha) {
            var dashSize, lane, leftLine, line, rightLine, sourceSide, targetSide, _i, _len, _ref;
            if ((road.source == null) || (road.target == null)) {
                throw Error('invalid road');
            }
            sourceSide = road.sourceSide;
            targetSide = road.targetSide;
            this.ctx.save();
            this.ctx.lineWidth = 0.4;
            leftLine = road.leftmostLane.leftBorder;
            this.graphics.drawSegment(leftLine);
            this.graphics.stroke(Settings.colors.roadMarking);
            rightLine = road.rightmostLane.rightBorder;
            this.graphics.drawSegment(rightLine);
            this.graphics.stroke(Settings.colors.roadMarking);
            this.ctx.restore();
            this.graphics.polyline(sourceSide.source, sourceSide.target, targetSide.source, targetSide.target);
            this.graphics.fill(Settings.colors.road, alpha);
            this.ctx.save();
            _ref = road.lanes.slice(1);
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                lane = _ref[_i];
                line = lane.rightBorder;
                dashSize = 1;
                this.graphics.drawSegment(line);
                this.ctx.lineWidth = 0.2;
                this.ctx.lineDashOffset = 1.5 * dashSize;
                this.ctx.setLineDash([dashSize]);
                this.graphics.stroke(Settings.colors.roadMarking);

                if (this.debug) {
//                    this.ctx.save();
                    this.ctx.fillStyle = "black";
                    this.ctx.font = "1px Arial";

                    var center = line.center;

                    this.ctx.fillText(road.id, center.x, center.y);
                }
            }

            return this.ctx.restore();
        };

        Visualizer.prototype.drawCar = function (car) {
            var angle, boundRect, center, curve, l, rect, style, _ref;
            angle = car.direction;
            center = car.coords;
            rect = new Rect(0, 0, 1.1 * car.length, 1.7 * car.width);
            rect.center(new Point(0, 0));
            boundRect = new Rect(0, 0, car.length, car.width);
            boundRect.center(new Point(0, 0));
            this.graphics.save();
            this.ctx.translate(center.x, center.y);
            this.ctx.rotate(angle);
            l = 0.90 - 0.30 * car.speed / car.maxSpeed;
            style = chroma(car.color, 0.8, l, 'hsl').hex();
            this.graphics.fillRect(boundRect, style);
            this.graphics.restore();
            if (this.debug) {
                this.ctx.save();
                this.ctx.fillStyle = "black";
                this.ctx.font = "1px Arial";
                this.ctx.fillText(car.id, center.x, center.y);
                if ((curve = (_ref = car.trajectory.temp) != null ? _ref.lane : void 0) != null) {
                    this.graphics.drawCurve(curve, 0.1, 'red');
                }
                return this.ctx.restore();
            }
        };

        Visualizer.prototype.drawGrid = function () {
            var box, gridSize, i, j, rect, sz, _i, _ref, _ref1, _results;
            gridSize = Settings.gridSize;
            box = this.zoomer.getBoundingBox();
            if (box.area() >= 2000 * gridSize * gridSize) {
                return;
            }
            sz = 0.4;
            _results = [];
            for (i = _i = _ref = box.left(), _ref1 = box.right(); gridSize > 0 ? _i <= _ref1 : _i >= _ref1; i = _i += gridSize) {
                _results.push((function () {
                    var _j, _ref2, _ref3, _results1;
                    _results1 = [];
                    for (j = _j = _ref2 = box.top(), _ref3 = box.bottom(); gridSize > 0 ? _j <= _ref3 : _j >= _ref3; j = _j += gridSize) {
                        rect = new Rect(i - sz / 2, j - sz / 2, sz, sz);
                        _results1.push(this.graphics.fillRect(rect, Settings.colors.gridPoint));
                    }
                    return _results1;
                }).call(this));
            }
            return _results;
        };

        Visualizer.prototype.updateCanvasSize = function () {
            if (this.$canvas.attr('width') !== $(window).width || this.$canvas.attr('height') !== $(window).height) {
                return this.$canvas.attr({
                    width: $(window).width(),
                    height: $(window).height()
                });
            }
        };

        Visualizer.prototype.draw = function (time) {
            var car, delta, id, intersection, road, _ref, _ref1, _ref2, _ref3;
            delta = (time - this.previousTime) || 0;
            if (delta > 30) {
                if (delta > 100) {
                    delta = 100;
                }
                this.previousTime = time;
                this.world.onTick(this.timeFactor * delta / 1000);
                this.updateCanvasSize();
                this.graphics.clear(Settings.colors.background);
                this.graphics.save();
                this.zoomer.transform();
                this.drawGrid();
                _ref = this.world.intersections.all();
                for (id in _ref) {
                    intersection = _ref[id];
                    this.drawIntersection(intersection, 0.9);
                }
                _ref1 = this.world.roads.all();
                for (id in _ref1) {
                    road = _ref1[id];
                    this.drawRoad(road, 0.9);
                }
                _ref2 = this.world.roads.all();
                for (id in _ref2) {
                    road = _ref2[id];
                    this.drawSignals(road);
                }
                _ref3 = this.world.cars.all();
                for (id in _ref3) {
                    car = _ref3[id];
                    this.drawCar(car);
                }
                this.toolIntersectionBuilder.draw();
                this.toolRoadbuilder.draw();
                this.toolHighlighter.draw();
                this.graphics.restore();
            }
            if (this.running) {
                return window.requestAnimationFrame(this.draw);
            }
        };

        Visualizer.property('running', {
            get: function () {
                return this._running;
            },
            set: function (running) {
                if (running) {
                    return this.start();
                } else {
                    return this.stop();
                }
            }
        });

        Visualizer.prototype.start = function () {
            if (!this._running) {
                this._running = true;
                return this.draw();
            }
        };

        Visualizer.prototype.stop = function () {
            return this._running = false;
        };

        return Visualizer;
    });
