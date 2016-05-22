 'use strict';

angular.module('osmmapscongestionApp')
    .factory('notificationInterceptor', function ($q, AlertService) {
        return {
            response: function(response) {
                var alertKey = response.headers('X-osmmapscongestionApp-alert');
                if (angular.isString(alertKey)) {
                    AlertService.success(alertKey, { param : response.headers('X-osmmapscongestionApp-params')});
                }
                return response;
            }
        };
    });
