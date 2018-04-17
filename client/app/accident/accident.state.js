const angular = require('angular');
import './accident.less';
import templateList from './accidentList/accidentList.template.html';
import templateCreate from './accidentCreate/accidentCreate.template.html';
import templateDetailForSafetyDerpartment from './accidentDetailForSafetyDerpartment/accidentDetailForSafetyDerpartment.template.html';
import templateDetailForUser from './accidentDetailForUser/accidentDetailForUser.template.html';
import templateDetailForFleet from './accidentDetailForFleet/accidentDetailForFleet.template.html';

angular.module('shenmaApp')
    .config(($stateProvider) => {
        $stateProvider
            .state('accidentList', {
                url: '/accidentList',
                views: {
                    'content@': {
                        controller: 'accidentListController',
                        template: templateList
                    }
                }
            })
            .state('accidentCreate', {
                url: '/accidentCreate',
                views: {
                    'content@': {
                        controller: 'accidentCreateController',
                        template: templateCreate
                    }
                }
            })
            .state('accidentDetailForSafetyDerpartment', {
                url: '/accidentDetailForSafetyDerpartment/:id',
                views: {
                    'content@': {
                        controller: 'accidentDetailForSafetyDerpartmentController',
                        template: templateDetailForSafetyDerpartment
                    }
                }
            })
            .state('accidentDetailForUser', {
                url: '/accidentDetailForUser/:id',
                views: {
                    'content@': {
                        controller: 'accidentDetailForUserController',
                        template: templateDetailForUser
                    }
                }
            })
            .state('accidentDetailForFleet', {
                url: '/accidentDetailForFleet/:id',
                views: {
                    'content@': {
                        controller: 'accidentDetailForFleetController',
                        template: templateDetailForFleet
                    }
                }
            })
    })
