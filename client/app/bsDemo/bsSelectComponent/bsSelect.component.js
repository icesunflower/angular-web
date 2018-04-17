/**
 * Created by Administrator on 2018/4/8.
 */

const angular = require('angular');
import bsSelect from './bsSelectComponent.template.html';

angular.module('shenmaApp')
    .component('bsSelect', {
        template: bsSelect,
        controller: ($scope) => {
            $scope.fruits = $scope.$ctrl.allValues;
        },
        bindings: {
            allValues: "="
        },
    })