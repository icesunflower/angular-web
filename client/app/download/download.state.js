'use strict';

/*
 * auther vanpipy
 */

const template = require('./download.component.html');

angular.module('shenmaApp')
    .config(($stateProvider) => {
        $stateProvider
            .state({
                name: 'download',
                url: '/download',
                views: {
                    'content@': {
                        controller: 'downloadController',
                        template
                    }
                }
            });
    });
