'use strict';

angular.module('osmmapscongestionApp')
	.controller('EdgeDeleteController', function($scope, $uibModalInstance, entity, Edge) {

        $scope.edge = entity;
        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.confirmDelete = function (id) {
            Edge.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };

    });
