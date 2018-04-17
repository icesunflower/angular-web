'use strict';
import templateUrl from './driverAdd.template.html';
const angular = require('angular');
angular.module('shenmaApp')
    .config(($stateProvider) => {
        $stateProvider
            .state({
                name: 'driverAdd',
                url: '/driverAdd',
                params: {'driverId': null},
                views: {
                    'content@': {
                        controller: 'driverAddCtrl',
                        template: templateUrl
                    }
                }
            });
    });
