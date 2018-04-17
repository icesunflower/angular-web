
const angular = require('angular');
import bsForm from './bsFormComponent.template.html';
import './bsFormComponent.less';

angular.module('shenmaApp')
    .component('bsForm', {
        template: bsForm,
        controller: ($scope, $timeout, $location) => {
            $scope.size = 2;
            $scope.valid = {
                name: "er"
            };
            $scope.title23 = "title12345"
            $scope.submitted = false;

            $scope.validF = () => {
                if ($scope.valid_form.$valid) {
                    console.log('The form is valid.')
                } else {
                    $scope.valid_form.submitted = true;
                }
            };
            $scope.quation = {
                x: 3,
                outt: 5
            };

            $scope.change = function () {
                if ($scope.quation.x) {
                    $scope.quation.outt = parseInt($scope.quation.x) + 2
                } else {
                    $scope.quation.outt = ''
                }

            };

            $scope.mycity = '北京';
            $scope.Cities = [{ id: 1, name: '北京', group: '中国' }, { id: 2, name: '上海', group: '中国' }, { id: 3, name: '广州', group: '中国' }];

            $timeout(() => {
                $scope.myHref = 'http://www.baidu.com'
            }, 2000);

            $scope.showLocation = () => {
                debugger;
                // $location.path('bsDemo/about').replace();
                $location.search({ name: 'Aril', age: 24 })
            };

            const val1 = {
                name: "Aril",
                age: 18,
                eat: {
                    fruit: 'apple',
                    drink: 'juice'
                }
            };
            const val2 = {
                color: "green",
                age: 23,
                eat: {
                    food: 'biscut'
                }
            };

            $scope.extendValue = angular.merge({}, val1, val2);
            $scope.extendValue1 = { ...val1, ...val2 }

        }
    })
    .directive('ngFocus', () => {
        const FOCUS_CLASS = "ng-focused";
        return {
            restrict: 'A',
            require: 'ngModel',
            link: (scope, element, attrs, ctrl) => {
                ctrl.$focused = false;
                element.bind('focus', (evt) => {
                    element.addClass(FOCUS_CLASS);
                    scope.$apply(() => {
                        ctrl.$focused = true;
                    })
                }).bind('blur', () => {
                    element.removeClass(FOCUS_CLASS);
                    scope.$apply(() => {
                        ctrl.$focused = false;
                    })
                })
            }
        }
    })
    .directive('myTitle', () => {
        return {
            bingings: {
                title23: "="
            },
            replace: true,
            template: '<span>greeting: {{title23}}</span>'
        }
    })
    .directive('integer', () => {
        var INTEGER_REGEXP = /^-?\d+$/;
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$validators.integer = function (modelValue, viewValue) {
                    if (ctrl.$isEmpty(modelValue)) {
                        // consider empty models to be valid
                        return true;
                    }

                    if (INTEGER_REGEXP.test(viewValue)) {
                        // it is valid
                        return true;
                    }

                    // it is invalid
                    return false;
                };
            }
        };
    }
    )