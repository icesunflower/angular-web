'use strict';

const angular = require('angular');

import './responseComponent.less';
import templateUrl from './responseComponent.template.html';

/*
 * Component responseComponent
 *
 * @author luorongfang
 * @component responseComponent
 */
angular.module('shenmaApp')
    .component('responseComponent', {
        bindings: {
            status: '='
        },
        template: templateUrl,
        controller: ($scope) => {

        }
    })
