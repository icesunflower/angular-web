'use strict';

const angular = require('angular');

import './titleComponent.less';
import disabledReportModal from './disabledReportModal.html';
/*
 * Component titleComponent
 *
 * @author luorongfang
 * @component titleComponent
 * @param {!angular.$something} $something
 */
angular.module('shenmaApp')
    .component('titleComponent', {
        bindings: {
            title: '=',
            statusName: '=',
            reportId: '=',
            accidentInfo: '='
        },
        template: '<h2 class="accident-title clearfix"> <a href="javascript: window.history.go(-1)" class="back"></a><span class="title">{{ $ctrl.title }} </span><button type="button" class="btn btn-blue btn-sm btn-status" ng-show="$ctrl.statusName">{{ $ctrl.statusName }}</button></h2>',
        controller: ($scope, $uibModal, accidentService, $state) => {}
    })
