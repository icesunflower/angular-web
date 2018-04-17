'use strict';

/*
 * auther vanpipy
 */

const template = require('./organization.component.html');

angular.module('shenmaApp')
    .config(($stateProvider) => {
        $stateProvider
            .state({
                name: 'organization',
                url: '/organization',
                views: {
                    'content@': {
                        controller: 'organizationController',
                        template
                    }
                }
            });
    });
