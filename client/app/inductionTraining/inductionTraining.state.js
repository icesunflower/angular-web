const angular = require('angular');

import './inductionTraining.less';
import template from './inductionTraining.template.html';
import templateUrlNotStart from './notStart/notStart.template.html';
import templateUrlInProgress from './inProgress/inProgress.template.html';
import templateUrlQualified from './qualified/qualified.template.html';
import templateUrlUnQualified from './unQualified/unQualified.template.html';
import templateUrlDimission from './dimission/dimission.template.html';

angular.module('shenmaApp')
    .config(($stateProvider) => {
        $stateProvider
            .state('inductionTraining', {
                url: '/inductionTraining',
                views: {
                    'content@': {
                        controller: 'inductionTrainingController',
                        template: template
                    }
                }
            })
            .state('inductionTraining.notStart', {
                // parent:'/inductionTraining',
                url: '/notStart',
                controller: 'notStartController',
                template: templateUrlNotStart
            })
            .state('inductionTraining.inProgress', {
                // parent:'/inductionTraining',
                url: '/inProgress',
                controller: 'inProgressController',
                template: templateUrlInProgress
            })
            .state('inductionTraining.qualified', {
                // parent:'/inductionTraining',
                url: '/qualified',
                controller: 'qualifiedController',
                template: templateUrlQualified
            })
            .state('inductionTraining.unQualified', {
                // parent:'/inductionTraining',
                url: '/unQualified',
                controller: 'unQualifiedController',
                template: templateUrlUnQualified
            })
            .state('inductionTraining.dimission', {
                // parent:'/inductionTraining',
                url: '/dimission?leaveNodeId',
                controller: 'dimissionController',
                template: templateUrlDimission
            })
    })
