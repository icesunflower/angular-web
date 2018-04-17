'use strict';
import templateUrl from './driverDetail.template.html';
const angular = require('angular');
angular.module('shenmaApp')
    .config(($stateProvider) => {
        $stateProvider
            .state({
                name: 'driverDetail',
                url: '/driverDetail',
                params: {'driverId': null},
                views: {
                    'content@': {
                        controller: 'driverDetailCtrl',
                        template: templateUrl
                    }
                }
            });
    });
