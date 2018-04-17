'use strict';

const angular = require('angular');

import './safetyDerpartmentComponent.less';
import templateUrl from './safetyDerpartmentComponent.template.html';
import tipModelTemplate from '../model/commonTipsModel.html';

/*
 * Component safetyDerpartmentComponent
 *
 * @author luorongfang
 * @component safetyDerpartmentComponent
 * @param {!angular.$something} $something
 */
angular.module('shenmaApp')
    .component('safetyDerpartmentComponent', {
        bindings: {
            reportId: '=',
            basicinfoEdit: '=',
            showEdit: '=',
            safeytyinfoEdit: '=',
            isSafeytyDepartment: '=',
            showSafeytyinfoEdit: '=',
            repairBtnName: '=',
            getDetil: '=',
            accidentInfo: '=',
            accidentResponsibilityArr: '=',
            showMaintenance: '='
        },
        template: templateUrl,
        controller: ($scope, accidentService, $uibModal) => {
            // 默认显示取消按钮
            $scope.showCancel = false;
            // 修改按钮点击事件
            $scope.updateBtn = () => {
                $scope.canUpdateBsic = false;
                $scope.canUpdateSafeyty = true;
                $scope.showCancel = true;
                $scope.$ctrl.getDetil($scope.$ctrl.reportId, $scope.canUpdateBsic, $scope.canUpdateSafeyty);
            }

            // 取消按钮点击事件
            $scope.cancelBtn = () => {
                $scope.canUpdateBsic = false;
                $scope.canUpdateSafeyty = false;
                $scope.$ctrl.getDetil($scope.$ctrl.reportId, $scope.canUpdateBsic, $scope.canUpdateSafeyty);
            }
            $scope.changeInjury = function() {
                if ($scope.$ctrl.accidentInfo.securityDepartmentSuggestion.injury == 0) {
                    $scope.$ctrl.accidentInfo.securityDepartmentSuggestion.injurySituation = '';
                }
            }
            // 保存安全部意见
            $scope.saveSuggestion = () => {
                if ($scope.$ctrl.accidentInfo.securityDepartmentSuggestion.injury == 0) {
                    $scope.$ctrl.accidentInfo.securityDepartmentSuggestion.injurySituation = '';
                }
                accidentService.query('/api/accident/addSecuritySuggestion.do', {
                    accidentId: $scope.$ctrl.reportId,
                    id: $scope.$ctrl.accidentInfo.securityDepartmentSuggestion.id,
                    accidentResponsible: $scope.$ctrl.accidentInfo.securityDepartmentSuggestion.accidentResponsible,
                    injurySituation: $scope.$ctrl.accidentInfo.securityDepartmentSuggestion.injurySituation,
                    reasonAnalysis: $scope.$ctrl.accidentInfo.securityDepartmentSuggestion.reasonAnalysis,
                    securityRemark: $scope.$ctrl.accidentInfo.securityDepartmentSuggestion.securityRemark
                }).then((res) => {
                    if (res.data.status === 'SUCCESS') {
                        $scope.canUpdateSafeyty = false;
                        $scope.showCancel = false;
                        $scope.$ctrl.getDetil($scope.$ctrl.reportId);
                    }
                })
            }

            //上报维修
            function sendMaintenance() {
                accidentService.getItem('/api/accident/repairNow.do', { accidentId: $scope.$ctrl.reportId }).then((res) => {
                    if (res.data.status === 'SUCCESS') {
                        $scope.$ctrl.basicinfoEdit = false;
                        $scope.$ctrl.isSafeytyDepartment = false;
                        $scope.$ctrl.safeytyinfoEdit = false;
                        $scope.showCancel = false;
                        $scope.$ctrl.getDetil($scope.$ctrl.reportId);
                    } else {
                        $uibModal.open({
                            size: 'sm',
                            template: tipModelTemplate,
                            resolve: {
                                tips: () => {
                                    return res.data.errorMsg;
                                }
                            },
                            controller: ($scope, $uibModalInstance, tips) => {
                                $scope.tips = {
                                    body: tips,
                                    sure: '确定',
                                    cancel: '取消'
                                }
                                $scope.ok = () => {
                                    $uibModalInstance.close();
                                }
                                $scope.cancel = () => {
                                    $uibModalInstance.dismiss();
                                }
                            }
                        })
                    }
                })
            }
            $scope.maintenance = () => {
                $uibModal.open({
                    size: 'sm',
                    template: tipModelTemplate,
                    controller: ($scope, $uibModalInstance) => {
                        $scope.tips = {
                            body: '该事故将上报至维修管理，上报后不可修改。请确认是否上报。',
                            sure: '是',
                            cancel: '否'
                        }
                        $scope.ok = () => {
                            $uibModalInstance.close();
                        }
                        $scope.cancel = () => {
                            $uibModalInstance.dismiss();
                        }
                    }
                }).result.then((res) => {
                    sendMaintenance();
                })
            }
        }
    })
