'use strict';

const angular = require('angular');

import './checkComponent.less';
import templateUrl from './checkComponent.template.html';

/*
 * Component checkComponent
 *
 * @author luorongfang
 * @component checkComponent
 */
angular.module('shenmaApp')
    .component('checkComponent', {
        bindings: {
            itemChecked: '='
        },
        template: templateUrl,
        controller: ($scope) => {
            $scope.changeChecked = (checked) => {
                $scope.$ctrl.itemChecked = !checked
            }
        }
    })
