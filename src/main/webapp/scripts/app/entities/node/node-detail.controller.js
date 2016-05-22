'use strict';

angular.module('osmmapscongestionApp')
    .controller('NodeDetailController', function ($scope, $rootScope, $stateParams, entity, Node) {
        $scope.node = entity;
        $scope.load = function (id) {
            Node.get({id: id}, function(result) {
                $scope.node = result;
            });
        };
        var unsubscribe = $rootScope.$on('osmmapscongestionApp:nodeUpdate', function(event, result) {
            $scope.node = result;
        });
        $scope.$on('$destroy', unsubscribe);

    });
