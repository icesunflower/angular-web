'use strict';
import tipModelTemplate from '../model/commonTipsModel.html';

angular.module('shenmaApp')
    .controller('accidentDetailForFleetController', ($scope, accidentService, commonService, $timeout, $uibModal, $stateParams, $filter) => {
        $scope.title = '事故记录详情';
        //安全部意见编辑按钮
        $scope.updateBtn = false;
        // 标记基本信息是否可编辑
        $scope.basicinfoEdit = false;
        //标记处理意见是否可编辑
        $scope.maintenanceEdit = false;
        // 是否显示送修记录和回场记录
        $scope.showRepairBack = true;
        //车队处理意见保存按钮
        $scope.suggestionEdit = true;
        //车队处理意见编辑按钮
        $scope.updateSuggestionBtn = false;
        // 车队处理意见是否在编辑状态
        $scope.suggestionCanUpdate = false;
        if ($stateParams.id) {
            $scope.reportId = $stateParams.id;
        }
        $scope.bearSituationArr = ['启用商业险', '启用交强险', '行程管家现金承担', '公司现金承担'];
        $scope.bearSituationArrList = $scope.bearSituationArr.map((d, index) => ({ id: index, content: d, checked: false }))

        // 保存后获取详情
        $scope.getDetil = (id) => {
            accidentService.getDetail(id).then((res) => {
                if (res.data.status === 'SUCCESS') {
                    if (res.data.data) {
                        $scope.accidentInfo = res.data.data;
                        if ($scope.accidentInfo.basicSituation && $scope.accidentInfo.basicSituation.id) {
                            if ($scope.accidentInfo.basicSituation.occuredTime) {
                                $scope.accidentInfo.basicSituation.occuredTime = $filter('date')($scope.accidentInfo.basicSituation.occuredTime, 'yyyy-MM-dd HH:mm:s');
                            }
                        }
                        if ($scope.accidentInfo.repairDetail) {
                            if ($scope.accidentInfo.repairDetail.repair) {
                                $scope.showMaintenance = true;
                                if ($scope.accidentInfo.repairDetail.repair.id) {
                                    $scope.repairmentId = $scope.accidentInfo.repairDetail.repair.id;
                                }

                                // 待送修显示车队处理意见
                                if ($scope.accidentInfo.repairDetail.repair.currentStatus === 1 || $scope.accidentInfo.repairDetail.repair.currentStatus === 2 || $scope.accidentInfo.repairDetail.repair.currentStatus === 4) {
                                    // 显示车队长页面数据
                                    $scope.showFleetPage = true;
                                    $scope.showFleetSuggestion = true;
                                    if ($scope.accidentInfo.teamSuggestion) {
                                        $scope.suggestionEdit = false;
                                        $scope.suggestId = $scope.accidentInfo.teamSuggestion.id;
                                        if ($scope.accidentInfo.basicSituation.currentStatus === 4) {
                                            $scope.updateSuggestionBtn = false;
                                        } else {
                                            if ($scope.suggestionCanUpdate) {
                                                $scope.suggestionEdit = true;
                                                $scope.updateSuggestionBtn = false;
                                                $scope.suggestionCancel = true;
                                            } else {
                                                $scope.suggestionEdit = false;
                                                $scope.updateSuggestionBtn = true;
                                                $scope.suggestionCancel = false;
                                            }
                                        }
                                    } else {
                                        $scope.suggestionEdit = true;
                                    }
                                }
                            } else {
                                $scope.showMaintenance = false;
                            }
                            if ($scope.accidentInfo.repairDetail.repairDeal) {
                                if ($scope.accidentInfo.repairDetail.repairDeal.suggestionType === 0) {
                                    $scope.accidentInfo.repairDetail.repairDeal.repairName = '暂缓维修';
                                } else if ($scope.accidentInfo.repairDetail.repairDeal.suggestionType === 1) {
                                    $scope.accidentInfo.repairDetail.repairDeal.repairName = '立即维修';
                                }
                                $scope.accidentInfo.repairDetail.repairDeal.estimateTotalCost = commonService.filterCost($scope.accidentInfo.repairDetail.repairDeal.estimateTotalCost);
                                $scope.accidentInfo.repairDetail.repairDeal.estimateDriverCost = commonService.filterCost($scope.accidentInfo.repairDetail.repairDeal.estimateDriverCost);
                                $scope.accidentInfo.repairDetail.repairDeal.estimateCompanyCost = commonService.filterCost($scope.accidentInfo.repairDetail.repairDeal.estimateCompanyCost);
                                $scope.accidentInfo.repairDetail.repairDeal.estimateOtherCost = commonService.filterCost($scope.accidentInfo.repairDetail.repairDeal.estimateOtherCost);
                            }
                            if ($scope.accidentInfo.repairDetail.repairSend) {
                                if ($scope.accidentInfo.repairDetail.repairSend.repairDate) {
                                    $scope.accidentInfo.repairDetail.repairSend.repairDate = $filter('date')($scope.accidentInfo.repairDetail.repairSend.repairDate, 'yyyy-MM-dd HH:mm:ss');
                                }
                            }
                            if ($scope.accidentInfo.repairDetail.repairBack) {
                                if ($scope.accidentInfo.repairDetail.repairBack.backDate) {
                                    $scope.accidentInfo.repairDetail.repairBack.backDate = $filter('date')($scope.accidentInfo.repairDetail.repairBack.backDate, 'yyyy-MM-dd HH:mm:ss');
                                }
                            }
                        } else {
                            $scope.showMaintenance = false;
                        }
                        if ($scope.accidentInfo.result) {
                            $scope.showResult = true;
                            if ($scope.accidentInfo.result.bearSituation) {
                                angular.forEach($scope.bearSituationArrList, (item, key) => {
                                    for (var i = 0; i < $scope.accidentInfo.result.bearSituation.length; i++) {
                                        if ($scope.accidentInfo.result.bearSituation[i] == item.id) {
                                            item.checked = true;
                                        }
                                    }
                                })
                            }
                            $scope.accidentInfo.result.carRepairCost = commonService.filterCost($scope.accidentInfo.result.carRepairCost);
                            $scope.accidentInfo.result.driverCarCost = commonService.filterCost($scope.accidentInfo.result.driverCarCost);
                            $scope.accidentInfo.result.companyCarCost = commonService.filterCost($scope.accidentInfo.result.companyCarCost);
                            $scope.accidentInfo.result.otherCarCost = commonService.filterCost($scope.accidentInfo.result.otherCarCost);
                            $scope.accidentInfo.result.peopleCost = commonService.filterCost($scope.accidentInfo.result.peopleCost);
                            $scope.accidentInfo.result.companyPeopleCost = commonService.filterCost($scope.accidentInfo.result.companyPeopleCost);
                            $scope.accidentInfo.result.driverPeopleCost = commonService.filterCost($scope.accidentInfo.result.driverPeopleCost);
                            $scope.accidentInfo.result.otherPeopleCost = commonService.filterCost($scope.accidentInfo.result.otherPeopleCost);
                        }
                    }
                }
            })
        }

        // 获取驳回历史
        function getRejectHistory() {
            accidentService.query('/api/repair/queryRejectList.do', {
                dataId: $scope.reportId,
                reportType: 2,
            }).then((res) => {
                if (res.data.status === 'SUCCESS') {
                    if (res.data.data && res.data.data.length) {
                        $scope.showRejectHistory = true;
                    } else {
                        $scope.showRejectHistory = false;
                    }
                }
            })
        }

        if ($scope.reportId) {
            $scope.basicinfoEdit = false;
            $scope.getDetil($scope.reportId);
            getRejectHistory();
        }

        // 编辑车队长意见
        $scope.updateSuggestion = () => {
            $scope.suggestionCanUpdate = true;
            $scope.suggestionCancel = true;
            $scope.getDetil($scope.reportId);
        }

        // 取消车队长意见编辑
        $scope.cancelSuggestion = () => {
            $scope.suggestionCanUpdate = false;
            $scope.getDetil($scope.reportId);
        }

        // 保存车队处理意见
        function saveSuggestion() {
            accidentService.query('/api/accident/addFleetOpinion.do', {
                id: $scope.suggestId,
                repairId: $scope.repairmentId,
                accidentId: $scope.reportId,
                penaltyResult: $scope.accidentInfo.teamSuggestion.penaltyResult,
                longtermMeasures: $scope.accidentInfo.teamSuggestion.longtermMeasures,
                immediateMeasures: $scope.accidentInfo.teamSuggestion.immediateMeasures
            }).then((res) => {
                if (res.data.status === 'SUCCESS') {
                    $scope.suggestionCanUpdate = false;
                    $scope.suggestionCancel = false;
                    $scope.getDetil($scope.reportId);
                    simpleModal('保存成功');
                } else {
                    simpleModal(res.data.errorMsg);
                }
            })
        }
        $scope.saveUpdateSuggestion = () => {
            if ($scope.accidentInfo.basicSituation.currentStatus === 4) {
                $uibModal.open({
                    size: 'sm',
                    template: tipModelTemplate,
                    controller: ($scope, $uibModalInstance) => {
                        $scope.tips = {
                            body: '由于该事故记录状态是“已完成”，此模块保存后将不可编辑，是否确认保存。',
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
                    saveSuggestion();
                })
            } else {
                saveSuggestion();
            }
        }

        function simpleModal (content) {
            const modal = $uibModal.open({ size: 'sm', template: '<div style="padding: 5px; text-align: center">'+ content +'</div>'});
            $timeout(() => modal.close(), 500);
        }
    });
