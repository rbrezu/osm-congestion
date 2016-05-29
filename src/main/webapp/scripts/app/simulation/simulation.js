/**
 * Created by root on 24.05.2016.
 */
'use strict';

angular.module('osmmapscongestionApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('simulation', {
                //parent: 'site',
                url: '/simulation',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'Simulation'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/simulation/simulation.html',
                        controller: 'SimulationController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            });
    });

