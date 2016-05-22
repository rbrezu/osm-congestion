'use strict';

angular.module('osmmapscongestionApp')
    .controller('EdgeController', function ($scope, $state, Edge, ParseLinks) {

        $scope.edges = [];
        $scope.predicate = 'id';
        $scope.reverse = true;
        $scope.page = 1;
        $scope.loadAll = function() {
            Edge.query({page: $scope.page - 1, size: 20, sort: [$scope.predicate + ',' + ($scope.reverse ? 'asc' : 'desc'), 'id']}, function(result, headers) {
                $scope.links = ParseLinks.parse(headers('link'));
                $scope.totalItems = headers('X-Total-Count');
                $scope.edges = result;
            });
        };
        $scope.loadPage = function(page) {
            $scope.page = page;
            $scope.loadAll();
        };
        $scope.loadAll();


        $scope.refresh = function () {
            $scope.loadAll();
            $scope.clear();
        };

        $scope.clear = function () {
            $scope.edge = {
                length: null,
                speedMax: null,
                type: null,
                name: null,
                isOneway: null,
                weight: null,
                way_id: null,
                id: null
            };
        };
    });
