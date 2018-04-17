'use strict';

const angular = require('angular');

import './rejectComponent.less';
import rejectTem from './rejectComponent.template.html';
import rejectHistoryModal from './rejectHistoryModal.html';

/*
 * Component rejectComponent
 *
 * @author luorongfang
 * @component rejectComponent
 * @param {!angular.$something} $something
 */
angular.module('shenmaApp')
    .component('rejectComponent', {
        bindings: {
            reportId: '='
        },
        template: rejectTem,
        controller: ($scope, $uibModal, accidentService) => {
            $scope.queryRejectHistor = () => {
                $uibModal.open({
                    size: 'md',
                    template: rejectHistoryModal,
                    resolve: {
                        id: () => {
                            return $scope.$ctrl.reportId;
                        }
                    },
                    controller: ($scope, $uibModalInstance, $timeout, id) => {
                        $scope.table = { titles: ['上报时间', '驳回时间', '驳回原因'], body: [] };

                        function getRejectHistory() {
                            accidentService.query('/api/repair/queryRejectList.do', {
                                dataId: id,
                                reportType: 2,
                            }).then((res) => {
                                if (res.data.status === 'SUCCESS') {
                                    if (res.data.data) {
                                        $scope.table.body = res.data.data;
                                    }
                                }
                            })
                        }

                        $scope.cancel = () => {
                            $uibModalInstance.dismiss();
                        }
                        getRejectHistory();
                    }
                }).result.then(() => {
                    $state.go('accidentList');
                })
            }
        }
    })
