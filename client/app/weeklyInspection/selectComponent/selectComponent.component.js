'use strict';

/*
 * Component selectComponent
 *
 * @author jinluping
 * @component selectComponent
 * @params : title(抬头),compdata(.text:复选框内容,.checked:选中与否),remarks(备注内容),ifsingle(单选)
 */

import template from './selectComponent.template.html';
angular.module('shenmaApp').component('selectComp', {
    bindings: {
        title: '<',
        compdata: '=',
        remarks: '=',
        ifsingle: '<',
        checkChange: '&',
        ifEdit: '=',
        ifRemaks: '=',
    },
    template,
    controller: ($scope, $timeout) => {
        //多选
        $scope.checkChange = (which) => {
            $scope.$ctrl.checkChange({
                who: which
            });
        }

    }
});
