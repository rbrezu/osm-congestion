'use strict';

angular.module('osmmapscongestionApp')
    .factory('Edge', function ($resource, DateUtils) {
        return $resource('api/edges/:id', {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    });
