/**
 * Created by Administrator on 2018/4/9.
 */
const angular = require('angular');

import bsInfoComponent from './bsInfoComponent.template.html';

angular.module('shenmaApp')
    .component('bsInfo', {
        template: bsInfoComponent,
        controller: ($scope, $timeout) => {
            $scope.currentLen = 0;
            $scope.desc = "";
            function currentLen() {
                let timer = false;
                $scope.$watch('desc', (newValue, oldValue) => {
                    if (newValue !== oldValue) {
                        if (timer) {
                            $timeout.cancel(timer)
                        }
                    }
                    $scope.timer = $timeout(() => {
                        if ($scope.desc) {
                            $scope.currentLen = $scope.desc.length;
                        } else {
                            $scope.currentLen = 0;
                        }
                    }, 500)
                })
            };
            currentLen();
        },
        bindings: {
            basicinfoEdit: "=",
            accidentInfo: "=",
        },
    });