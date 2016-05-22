'use strict';

angular.module('osmmapscongestionApp').controller('EdgeDialogController',
    ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'Edge',
        function($scope, $stateParams, $uibModalInstance, entity, Edge) {

        $scope.edge = entity;
        $scope.load = function(id) {
            Edge.get({id : id}, function(result) {
                $scope.edge = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('osmmapscongestionApp:edgeUpdate', result);
            $uibModalInstance.close(result);
            $scope.isSaving = false;
        };

        var onSaveError = function (result) {
            $scope.isSaving = false;
        };

        $scope.save = function () {
            $scope.isSaving = true;
            if ($scope.edge.id != null) {
                Edge.update($scope.edge, onSaveSuccess, onSaveError);
            } else {
                Edge.save($scope.edge, onSaveSuccess, onSaveError);
            }
        };

        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
}]);
