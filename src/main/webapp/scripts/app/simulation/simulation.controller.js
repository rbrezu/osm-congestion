'use strict';

angular.module('osmmapscongestionApp')
    .controller('SimulationController', function ($scope, World, Visualizer, Settings) {
        var canvas, gui, guiVisualizer, guiWorld;
        canvas = $('<canvas />', {
            id: 'canvas'
        });
        $(".well").append(canvas);
        window.world = new World();
        //world.load();
        if (world.intersections.length === 0) {
            world.generateMap(-4, 4, -4, 4);
            world.carsNumber = 100;
        }
        window.visualizer = new Visualizer(world);
        visualizer.start();

        /*var myPoints = [100,100, 400,300, 1000,100]; //minimum two points
        var tension = 1;
        visualizer.graphics.drawCurveSpline(myPoints, 0.5, false, 26, true); */

        gui = new dat.GUI();
        guiWorld = gui.addFolder('world');
        guiWorld.open();
        guiWorld.add(world, 'save');
        guiWorld.add(world, 'load');
        guiWorld.add(world, 'clear');
        guiWorld.add(world, 'generateMap');
        guiVisualizer = gui.addFolder('visualizer');
        guiVisualizer.open();
        guiVisualizer.add(visualizer, 'running').listen();
        guiVisualizer.add(visualizer, 'debug').listen();
        guiVisualizer.add(visualizer.zoomer, 'scale', 0.1, 2).listen();
        guiVisualizer.add(visualizer, 'timeFactor', 0.1, 10).listen();
        guiWorld.add(world, 'carsNumber').min(0).max(10000).step(1).listen();
        guiWorld.add(world, 'instantSpeed').step(0.00001).listen();

        $scope.$on("$destroy", function() {
            if (gui)
                gui.destroy();
        });

        return gui.add(Settings, 'lightsFlipInterval', 0, 400, 0.01).listen();
    });
