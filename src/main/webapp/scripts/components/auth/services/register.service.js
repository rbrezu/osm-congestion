'use strict';

angular.module('osmmapscongestionApp')
    .factory('Register', function ($resource) {
        return $resource('api/register', {}, {
        });
    });


