'use strict';

/*
 * Component basicInspection
 *
 * @author jinluping
 * @component basicInspection
 */

import template from './basicInspection.template.html';
import templateBomb from './../bombBox/bombBox.template.html';


angular.module('shenmaApp').component('basicInspection', {
    bindings: {

    },
    template,
    controller: ($scope,$uibModal) => {
        //初始化周检时间-默认false
        $scope.popup1 = {
            opened: false
        };
        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };

        $scope.today = function () {
            $scope.dt = new Date();
        };
        $scope.today();


        // $scope.dateOptions = {
        //     dateDisabled: disabled,
        //     formatYear: 'yy',
        //     maxDate: new Date(2020, 5, 22),
        //     minDate: new Date(),
        //     startingDay: 1
        // };

        //弹框
        $scope.damagedPhotos = () => {
            $uibModal.open({
                size: 'md',
                template: templateBomb,
                controller: () => {}
            });
        }
    }
});
