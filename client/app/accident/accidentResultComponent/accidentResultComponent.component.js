'use strict';

const angular = require('angular');

import './accidentResultComponent.less';
import templateUrl from './accidentResultComponent.template.html';

/*
 * Component accidentResultComponent
 *
 * @author luorongfang
 * @component accidentResultComponent
 * @param {!angular.$something} $something
 */
angular.module('shenmaApp')
    .component('accidentResultComponent', {
        bindings: {
            bearSituationArrList: '=',
            accidentInfo: '='
        },
        template: templateUrl,
        controller: ($scope) => {

        }
    })
