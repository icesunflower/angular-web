const angular = require('angular');
import './insurance.less';
import templateInsurance from './insurance.template.html';


angular.module('shenmaApp')
    .config(($stateProvider) => {
        $stateProvider
            .state('insurance', {
                url: '/insurance/:id/:ownershipId',
                views: {
                    'content@': {
                        controller: 'insuranceController',
                        template: templateInsurance
                    }
                }
            })
    })