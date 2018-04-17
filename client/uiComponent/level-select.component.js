'use strict';

angular.module('shenmaApp')
    .component('levelSelect', {
        bindings: {
            selected: '=',
            levels: '=',
            height: '<'
        },
        template: `
            <div class="level-select">
                <div class="level-selected" ng-click="toggleSelect()" ng-style="heightStyle">{{ $ctrl.selected.name }}</div>
                <ul ng-show="displaySelect">
                    <li ng-repeat="option in $ctrl.levels track by $index"
                        ng-click="select(option)"
                        ng-style="heightStyle"
                        style="text-indent: {{ option.indent * 10 }}px">{{ option.name }}</li>
                </ul>
            </div>
        `,
        controller: ($scope) => {
            $scope.toggleSelect = () => $scope.displaySelect = !$scope.displaySelect;
            $scope.select = (option, index) => {
                $scope.$ctrl.selected = option;
                $scope.toggleSelect();
            };

            if ($scope.$ctrl.height) {
                $scope.heightStyle = { height: $scope.$ctrl.height + 'px', lineHeight: $scope.$ctrl.height + 'px' };
            }
        }
    });
