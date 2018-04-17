'use strict';

/*
 * @author vanpipy
 */
import template from './repairment.component.html';
import detailTemplate from './repairmentDetail.component.html';

angular.module('shenmaApp')
    .config(($stateProvider) => {
        $stateProvider
            .state({
                name: 'repairment',
                url: '/repairment/:role',
                views: {
                    'content@': {
                        controller: 'repairmentController',
                        template
                    }
                }
            })
            .state({
                name: 'repairment.detail',
                url: '/:id',
                views: {
                    'content@': {
                        controller: 'repairmentDetailController',
                        template: detailTemplate
                    }
                }
            });
    });
