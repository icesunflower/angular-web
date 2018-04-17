'use strict';

angular.module('shenmaApp')
    .component('selectAccident', {
        bindings: {
            driverName: '=',
            driverId: '=',
            jobNumber: '=',
            workPhone: '=',
            areaCode: '=',
            carNo: '=',
            carId: '=',
            carTypeName: '=',
            fleetName: '=',
            fleetId: '=',
            historyInsurance: '=',
            displaySelect: '=',
            itemList: '=',
            msg: '='
        },
        template: `
            <div class="select-component" ng-show="$ctrl.displaySelect">{{itemList}}
                <ul>
                    <li ng-show="!$ctrl.itemList" ng-click="close()">{{ $ctrl.msg }}</li>
                    <li ng-show="$ctrl.itemList" ng-repeat="item in $ctrl.itemList" ng-click="select(item)">{{ item.JobNo }} {{item.name}}</li>
                </ul>
            </div>
        `,
        controller: ($scope) => {
            $scope.select = (item) => {
                $scope.$ctrl.carId = item.carId;
                $scope.$ctrl.areaCode = item.areaCode;
                $scope.$ctrl.carNo = item.carNo;
                $scope.$ctrl.carTypeName = item.carTypeName;
                $scope.$ctrl.fleetName = item.fleetName;
                $scope.$ctrl.fleetId = item.fId;
                $scope.$ctrl.historyInsurance = item.historyInsurance;
                $scope.$ctrl.driverName = item.name;
                $scope.$ctrl.driverId = item.id;
                $scope.$ctrl.jobNumber = item.JobNo;
                $scope.$ctrl.workPhone = item.workPhone;
                $scope.$ctrl.displaySelect = false;
            };
            $scope.close = () => {
                $scope.$ctrl.displaySelect = false;
                $scope.$ctrl.selected = '';
            }
        }
    });
