'use strict';

const angular = require('angular');

import './textareaComponent.less';
import templateUrl from './textareaComponent.template.html';

/*
 * Component textareaComponent
 *
 * @author luorongfang
 * @component textareaComponent
 * @param {!angular.$something} $something
 */
angular.module('shenmaApp')
    .component('textareaComponent', {
        bindings: {
            desc: '=',
            limit: '=',
            required: '=',
            placeholder: '='
        },
        template: templateUrl,
        controller: ($scope, $timeout) => {
            $scope.currentLen = 0;
            // 监听字数
            function currentLen() {
                $scope.timer = void 0;
                $scope.$watch('$ctrl.desc', (newValue, oldValue) => {
                    if (newValue !== oldValue) {
                        if ($scope.timer) {
                            $timeout.cancel($scope.timer);
                        }
                        $scope.timer = $timeout(() => {
                            if ($scope.$ctrl.desc) {
                                $scope.currentLen = $scope.$ctrl.desc.length;
                            } else {
                                $scope.currentLen = 0;
                            }
                        }, 500);
                    }
                });
            }
            currentLen();
        }
    })
