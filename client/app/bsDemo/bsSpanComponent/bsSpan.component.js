/**
 * Created by Administrator on 2018/4/8.
 */

'use strict';

const angular = require('angular');
import templateUrl from './bsSpanComponent.template.html';
import './bsSpanComponent.less';
import './bsSpan.component.filter.js';

angular.module('shenmaApp')
    .component('bsSpan', {
        template: templateUrl,
        controller: ($scope, $parse, $filter) => {
            $scope.time = new Date();
            $scope.text = "";
            $scope.expr = 'parsemethod';
            $scope.sign = {
                name: '',
                email: '',
                username: '',
            }
            $scope.people = [
                {
                    name: 'Ari',
                    city: 'sichuan',
                },
                {
                    name: 'Nate',
                    city: 'guizhou,'
                }
            ];
            $scope.onLog = () => {
                $scope.$ctrl.onLog({text: $scope.text + " " + $scope.$ctrl.season});
            };

            $scope.$watch('text', function (newVal, oldVal, scope) {
                if (newVal !== oldVal) {
                    $scope.text1 = $filter('uppercase')(newVal);

                }
            });
        },
        bindings: {
            onLog: '&',
            season: "=",
            hero: '=',
        }
    })
    .directive('ensureUnique', () => {
        return {
            require: 'ngModel',
            link: (scope, ele, attrs, c) => {
                scope.$watch(attrs.ngModel, (n) => {
                    if (scope.sign.name === "baosi") {
                        c.$setValidity('unique', true);
                    }else {
                        c.$setValidity('unique', false);
                    }
                })
            }

        }
    })
;

