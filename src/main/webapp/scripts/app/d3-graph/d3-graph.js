'use strict';

angular.module('osmmapscongestionApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('d3-graph', {
                parent: 'site',
                url: '/d3-graph',
                data: {
                    authorities: [],
                    pageTitle: 'D3 Graph'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/d3-graph/d3-graph.html',
                        controller: 'D3GraphController'
                    }
                }
            });
    });
