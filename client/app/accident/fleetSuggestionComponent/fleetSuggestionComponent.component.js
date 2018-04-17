'use strict';

const angular = require('angular');
import './fleetSuggestionComponent.less';
import templateUrl from './fleetSuggestionComponent.template.html';

/*
 * Component fleetSuggestionComponent
 *
 * @author luorongfang
 * @component fleetSuggestionComponent
 * @param {!angular.$something} $something
 */
angular.module('shenmaApp')
    .component('fleetSuggestionComponent', {
        bindings: {
            title: '=',
            accidentInfo: '='
        },
        template: templateUrl
    })
