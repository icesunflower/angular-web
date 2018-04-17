'use strict';

import template from './vehicleList/vehicleList.template.html';
import vehicleInfoTemp from './vehicleList/vehicleInfo.template.html';
import inspectionDetailTemp from './inspectionDetail/inspectionDetail.template.html';
import maintenanceDetailTemp from './maintenanceDetails/maintenanceDetails.template.html';
import addWeeklyTemp from './addWeeklyInspection/addWeeklyInspection.template.html';
import addNewdamageTemp from './inspectionDetail/addNewdamage.template.html';

angular.module('shenmaApp').config(($stateProvider) => {
    $stateProvider.state({
        name: 'vehicleList',
        url: '/vehicleList',
        views: {
            'content@': {
                controller: 'vehicleListCtrl',
                template
            }
        }
    }).state({
        name: 'vehicleList.inspectionDetail',
        url: '/inspectionDetail/:carNo/:ownershipId',
        views: {
            'content@': {
                controller: 'inspectionDetailCtrl',
                template: inspectionDetailTemp
            }
        }
    }).state({
        name: 'vehicleList.vehicleInfo',
        url: '/vehicleInfo/:id/:ownershipId',
        views: {
            'content@': {
                controller: 'vehicleInfoCtrl',
                template: vehicleInfoTemp
            }
        }
    }).state({
        name: 'vehicleList.inspectionDetail.maintenanceDetail',
        url: '/maintenanceDetail',
        views: {
            'content@': {
                controller: 'maintenanceDetailCtrl',
                template: maintenanceDetailTemp
            }
        }
    }).state({
        name: 'addWeeklyInspection',
        url: '/addWeeklyInspection/:carNo',
        views: {
            'content@': {
                controller: 'addWeeklyInspectionCtrl',
                template: addWeeklyTemp
            }
        }
    }).state({
        name: 'addNewdamage',
        url: '/addNewdamage/:carNo/:weeklyId',
        views: {
            'content@': {
                controller: 'addNewdamageCtrl',
                template: addNewdamageTemp
            }
        }
    })
});
