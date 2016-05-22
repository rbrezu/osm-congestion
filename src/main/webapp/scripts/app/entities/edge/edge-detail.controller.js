'use strict';

angular.module('osmmapscongestionApp')
    .controller('EdgeDetailController', function ($scope, $rootScope, $stateParams, entity, Edge) {
        $scope.edge = entity;
        $scope.load = function (id) {
            Edge.get({id: id}, function(result) {
                $scope.edge = result;
            });
        };
        var unsubscribe = $rootScope.$on('osmmapscongestionApp:edgeUpdate', function(event, result) {
            $scope.edge = result;
        });
        $scope.$on('$destroy', unsubscribe);

    });
