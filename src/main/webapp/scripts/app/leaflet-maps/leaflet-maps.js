'use strict';

angular.module('osmmapscongestionApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('leaflet-maps', {
                parent: 'site',
                url: '/leaflet-maps',
                data: {
                    authorities: [],
                    pageTitle: 'Leaflet Maps'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/leaflet-maps/leaflet-maps.html',
                        controller: 'LeafletMapsController'
                    }
                }
            });
    });

/*

(function() {
  'use strict';

  angular
    .module('osmmapscongestionApp')
    .config(stateConfig);

  stateConfig.$inject = ['$stateProvider'];

  function stateConfig($stateProvider) {
    $stateProvider.state('leaflet-maps', {
      parent: 'app',
      url: '/leaflet-maps',
      data: {
        authorities: [],
        pageTitle: 'Leaflet maps'
      },
      views: {
        'content@': {
          templateUrl: 'scripts/app/leaflet-maps/leaflet-maps.html',
          controller: 'LeafletMapsController',
          controllerAs: 'vm'
        }
      },
      resolve: {}
    });
  }
})();

    */
