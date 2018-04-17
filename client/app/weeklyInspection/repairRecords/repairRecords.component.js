'use strict';

/*
 * Component repairRecords
 *
 * @author jinluping
 * @component repairRecords
 */

import template from './repairRecords.template.html';

angular.module('shenmaApp').component('repairRecords', {
    bindings: {

    },
    template,
    controller: ($scope) => {
        $scope.iftime =true;
        $scope.iftext =true;
        $scope.ifcost =true;
        $scope.ifremarks =true;
    }
});
