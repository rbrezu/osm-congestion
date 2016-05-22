'use strict';

angular.module('osmmapscongestionApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('edge', {
                parent: 'entity',
                url: '/edges',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'osmmapscongestionApp.edge.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/edge/edges.html',
                        controller: 'EdgeController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('edge');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
            .state('edge.detail', {
                parent: 'entity',
                url: '/edge/{id}',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'osmmapscongestionApp.edge.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/edge/edge-detail.html',
                        controller: 'EdgeDetailController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('edge');
                        return $translate.refresh();
                    }],
                    entity: ['$stateParams', 'Edge', function($stateParams, Edge) {
                        return Edge.get({id : $stateParams.id});
                    }]
                }
            })
            .state('edge.new', {
                parent: 'edge',
                url: '/new',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/edge/edge-dialog.html',
                        controller: 'EdgeDialogController',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {
                                    length: null,
                                    speedMax: null,
                                    type: null,
                                    name: null,
                                    isOneway: null,
                                    weight: null,
                                    way_id: null,
                                    nodeStart: null,
                                    nodeEnd: null,
                                    id: null
                                };
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('edge', null, { reload: true });
                    }, function() {
                        $state.go('edge');
                    })
                }]
            })
            .state('edge.edit', {
                parent: 'edge',
                url: '/{id}/edit',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/edge/edge-dialog.html',
                        controller: 'EdgeDialogController',
                        size: 'lg',
                        resolve: {
                            entity: ['Edge', function(Edge) {
                                return Edge.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('edge', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            })
            .state('edge.delete', {
                parent: 'edge',
                url: '/{id}/delete',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/edge/edge-delete-dialog.html',
                        controller: 'EdgeDeleteController',
                        size: 'md',
                        resolve: {
                            entity: ['Edge', function(Edge) {
                                return Edge.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('edge', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            });
    });
