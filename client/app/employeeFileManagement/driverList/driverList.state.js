'use strict';
import templateUrl from './driverList.template.html';
const angular = require('angular');
angular.module('shenmaApp')
    .config(($stateProvider) => {
        $stateProvider
            .state({
                name: 'driverList',
                url: '/driverList',
                views: {
                    'content@': {
                        controller: 'driverListCtrl',
                        template: templateUrl
                    }
                }
            });
    });
