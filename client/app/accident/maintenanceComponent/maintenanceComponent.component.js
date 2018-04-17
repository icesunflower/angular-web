'use strict';

const angular = require('angular');

import './maintenanceComponent.less';
import templateUrl from './maintenanceComponent.template.html';

/*
 * Component maintenanceComponent
 *
 * @author luorongfang
 * @component maintenanceComponent
 * @param {!angular.$something} $something
 */
angular.module('shenmaApp')
    .component('maintenanceComponent', {
        bindings: {
            maintenanceEdit: '=',
            reportId: '=',
            accidentInfo: '=',
            getDetil: '=',
            showRepairBack: '=',
            repairId: '=',
            showMaintenance: '=',
            repairName: '='
        },
        template: templateUrl
    })
