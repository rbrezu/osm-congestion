'use strict';

angular.module('osmmapscongestionApp')
    .controller('D3GraphController', function ($scope) {
        window.onresize = function () {
            $scope.$apply();
        };

        $scope.data = [
            {name: "Greg", score: 98},
            {name: "Julie", score: 23},
            {name: "Frank", score: 12},
            {name: "Anne", score: 5}
        ];

        var svg = d3.select(element[0])
            .append("svg")
            .style('width', '100%');

        $scope.$watch(function () {
            return angular.element($window)[0].innerWidth;
        }, function () {
            $scope.render($scope.data);
        });

        $scope.render = function (data) {
            svg.selectAll('*').remove();
            if (!data) return;

            var width = d3.select(element[0]).node().offsetWidth - margin;

        };

    });
