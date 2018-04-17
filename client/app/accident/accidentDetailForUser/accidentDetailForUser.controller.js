'use strict';
import tipModelTemplate from '../model/commonTipsModel.html';
import rejectModal from '../titleComponent/disabledReportModal.html';

angular.module('shenmaApp')
    .controller('accidentDetailForUserController', ($scope, accidentService, commonService, $timeout, $uibModal, $stateParams, $filter) => {
        $scope.title = '事故记录详情';
        //安全部意见编辑按钮
        $scope.updateBtn = false;
        // 标记基本信息是否可编辑
        $scope.basicinfoEdit = false;
        //标记处理意见是否可编辑
        $scope.maintenanceEdit = false;
        //处理意见编辑按钮
        $scope.maintenanceUpdateBtn = false;
        //处理意见取消按钮
        $scope.maintenanceCancel = false;
        //送修记录显示保存按钮
        $scope.repairEdit = true;
        //送修记录修改按钮
        $scope.repairUpdateBtn = false;
        //送修记录是否可编辑
        $scope.repairUpdate = false;
        //送修记录取消按钮
        $scope.repairCancel = false;
        //回场记录显示保存按钮
        $scope.backEdit = true;

        $scope.itsOwnership = 1;

        if ($stateParams.id) {
            $scope.reportId = $stateParams.id;
        }

        $scope.bearSituationArr = ['启用商业险', '启用交强险', '行程管家现金承担', '公司现金承担'];
        $scope.bearSituationArrList = $scope.bearSituationArr.map((d, index) => ({ id: index, content: d, checked: false }));
        $scope.repairList = ['暂缓维修', '立即维修'];
        $scope.repairArr = $scope.repairList.map((d, index) => ({ id: index, content: d }));
        $scope.repairArr.unshift({ id: '', content: '请选择维修意见' });

        // 保存后获取详情
        $scope.getDetil = (id) => {
            accidentService.getDetail(id).then((res) => {
                if (res.data.status === 'SUCCESS') {
                    if (res.data.data) {
                        $scope.accidentInfo = res.data.data;
                        if ($scope.accidentInfo.basicSituation && $scope.accidentInfo.basicSituation.id) {
                            if ($scope.accidentInfo.basicSituation.occuredTime) {
                                $scope.accidentInfo.basicSituation.occuredTime = $filter('date')($scope.accidentInfo.basicSituation.occuredTime, 'yyyy-MM-dd HH:mm:ss');
                            }
                        }
                        if ($scope.accidentInfo.basicSituation.currentStatus == 2 || $scope.accidentInfo.basicSituation.currentStatus == 3 || $scope.accidentInfo.basicSituation.currentStatus == 4 || $scope.accidentInfo.basicSituation.currentStatus == 5) {
                            // 报修后显示机务部页面
                            $scope.showUserPage = true;
                            $scope.showMaintenance = true;
                            if ($scope.accidentInfo.repairDetail) {
                                if ($scope.accidentInfo.repairDetail.repair) {
                                    if ($scope.accidentInfo.repairDetail.repair.id) {
                                        $scope.repairmentId = $scope.accidentInfo.repairDetail.repair.id;
                                    }

                                    // 待送修显示车队处理意见
                                    if ($scope.accidentInfo.repairDetail.repair.currentStatus === 1 || $scope.accidentInfo.repairDetail.repair.currentStatus === 2 || $scope.accidentInfo.repairDetail.repair.currentStatus === 4) {
                                        $scope.showFleetSuggestion = true;
                                    }

                                    // 维修管理
                                    if ($scope.accidentInfo.repairDetail.repair.currentStatus === 0) {
                                        $scope.maintenanceEdit = false;
                                        $scope.maintenanceUpdateBtn = false;
                                        $scope.maintenanceCancel = false;
                                    }
                                    if ($scope.accidentInfo.repairDetail.repair.currentStatus === 1) {
                                        // 编辑维修处理意见
                                        if ($scope.maintenanceCanUpdate) {
                                            $scope.maintenanceEdit = true;
                                            $scope.maintenanceUpdateBtn = false;
                                            $scope.maintenanceCancel = true;
                                            $scope.repairEdit = false;
                                            $scope.repairCancel = false;
                                        } else {
                                            $scope.maintenanceEdit = false;
                                            $scope.maintenanceUpdateBtn = true;
                                            $scope.maintenanceCancel = false;
                                            $scope.repairEdit = true;
                                            $scope.repairCancel = false;
                                        }
                                    }
                                    if ($scope.accidentInfo.repairDetail.repair.currentStatus === 2) {
                                        // 编辑维修处理意见
                                        if ($scope.maintenanceCanUpdate) {
                                            $scope.maintenanceEdit = true;
                                            $scope.maintenanceUpdateBtn = false;
                                            $scope.maintenanceCancel = true;
                                            $scope.repairEdit = false;
                                            $scope.repairUpdateBtn = false;
                                            $scope.repairCancel = false;
                                            $scope.backEdit = false;
                                            // 编辑送修记录意见
                                        } else if ($scope.repairCanUpdate) {
                                            $scope.maintenanceEdit = false;
                                            $scope.maintenanceUpdateBtn = false;
                                            $scope.maintenanceCancel = false;
                                            $scope.repairEdit = true;
                                            $scope.repairUpdateBtn = false;
                                            $scope.repairCancel = true;
                                            $scope.backEdit = false;
                                        } else {
                                            $scope.maintenanceEdit = false;
                                            $scope.maintenanceUpdateBtn = true;
                                            $scope.maintenanceCancel = false;
                                            $scope.repairEdit = false;
                                            $scope.repairUpdateBtn = true;
                                            $scope.repairCancel = false;
                                            $scope.backEdit = true;
                                        }
                                    }
                                    if ($scope.accidentInfo.repairDetail.repair.currentStatus === 4) {
                                        $scope.maintenanceEdit = false;
                                        $scope.maintenanceUpdateBtn = false;
                                        $scope.maintenanceCancel = false;
                                        $scope.repairEdit = false;
                                        $scope.repairUpdateBtn = false;
                                        $scope.repairCancel = false;
                                        $scope.backEdit = false;
                                    }
                                }
                                if ($scope.accidentInfo.repairDetail.repairDeal) {
                                    if ($scope.accidentInfo.repairDetail.repairDeal.suggestionType === 0) {
                                        $scope.accidentInfo.repairDetail.repairDeal.repairName = '暂缓维修';
                                    } else if ($scope.accidentInfo.repairDetail.repairDeal.suggestionType === 1) {
                                        $scope.accidentInfo.repairDetail.repairDeal.repairName = '立即维修';
                                    }
                                    if ($scope.accidentInfo.repairDetail.repairDeal.id) {
                                        $scope.repairDetailId = $scope.accidentInfo.repairDetail.repairDeal.id;
                                    }
                                    $scope.accidentInfo.repairDetail.repairDeal.estimateTotalCost = commonService.filterCost($scope.accidentInfo.repairDetail.repairDeal.estimateTotalCost);
                                    $scope.accidentInfo.repairDetail.repairDeal.estimateDriverCost = commonService.filterCost($scope.accidentInfo.repairDetail.repairDeal.estimateDriverCost);
                                    $scope.accidentInfo.repairDetail.repairDeal.estimateCompanyCost = commonService.filterCost($scope.accidentInfo.repairDetail.repairDeal.estimateCompanyCost);
                                    $scope.accidentInfo.repairDetail.repairDeal.estimateOtherCost = commonService.filterCost($scope.accidentInfo.repairDetail.repairDeal.estimateOtherCost);
                                } else {
                                    $scope.accidentInfo.repairDetail.repairDeal = {
                                        suggestionType: $scope.repairArr[0].id
                                    }
                                }
                                if ($scope.accidentInfo.repairDetail.repairSend) {
                                    if ($scope.accidentInfo.repairDetail.repairSend.id) {
                                        $scope.repairSend = $scope.accidentInfo.repairDetail.repairSend.id;
                                    }
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

                        if ($scope.accidentInfo.repairDetail.carInfo.ownership == 2) {
                            $scope.itsOwnership = 1;
                            $scope.accidentInfo.repairDetail.repairDeal.ownership = 0;
                        } else {
                            $scope.itsOwnership =  $scope.accidentInfo.repairDetail.carInfo.ownership;
                            $scope.accidentInfo.repairDetail.repairDeal.ownership = $scope.itsOwnership;
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

        // 进行维修
        $scope.maintenance = () => {
            $uibModal.open({
                size: 'sm',
                template: tipModelTemplate,
                controller: ($scope, $uibModalInstance) => {
                    $scope.tips = {
                        body: '是否进行维修，维修后，将不能驳回该记录。',
                        sure: '确认',
                        cancel: '取消'
                    }
                    $scope.ok = () => {
                        $uibModalInstance.close();
                    }
                    $scope.cancel = () => {
                        $uibModalInstance.dismiss();
                    }
                }
            }).result.then(() => {
                //标记处理意见是否可编辑
                $scope.maintenanceEdit = true;
            })
        }

        // 驳回
        $scope.reject = () => {
            $uibModal.open({
                size: 'sm',
                template: rejectModal,
                resolve: {
                    id: () => {
                        return $scope.repairmentId;
                    }
                },
                controller: ($scope, $uibModalInstance, $timeout, id) => {
                    $scope.responseStatus = {
                        title: '保存中...',
                        isLoading: false,
                        isLoadingSuccess: false,
                        isLoadingError: false,
                    }
                    $scope.placeholder = '请输入驳回原因（必填）';
                    $scope.ok = () => {
                        $scope.responseStatus.isLoading = true;
                        $scope.responseStatus.isLoadingSuccess = true;
                        accidentService.query('/api/repair/reject.do', {
                            repairId: id,
                            rejectCause: $scope.rejectCause
                        }).then((res) => {
                            if (res.data.status === 'SUCCESS') {
                                $scope.responseStatus.title = '操作成功';
                                $timeout(() => {
                                    $uibModalInstance.close();
                                }, 1000);
                            } else {
                                $scope.responseStatus.isLoadingSuccess = false;
                                $scope.responseStatus.isLoadingError = true;
                                $scope.responseStatus.title = '操作失败，请稍后再试';
                                $timeout(() => {
                                    $scope.responseStatus.isLoading = false;
                                }, 3000);
                            }
                        })
                    }
                    $scope.cancel = () => {
                        $uibModalInstance.dismiss();
                    }
                }
            }).result.then(() => {
                $scope.getDetil($scope.reportId);
                getRejectHistory();
            })
        }

        if ($scope.reportId) {
            $scope.basicinfoEdit = false;
            $scope.getDetil($scope.reportId);
            getRejectHistory();
        }

        $scope.amountSumrepairedUpdate = () => {
            $scope.accidentInfo.repairDetail.repairDeal.estimateTotalCost = commonService.numAdd($scope.accidentInfo.repairDetail.repairDeal.estimateDriverCost ? $scope.accidentInfo.repairDetail.repairDeal.estimateDriverCost : 0, $scope.accidentInfo.repairDetail.repairDeal.estimateCompanyCost ? $scope.accidentInfo.repairDetail.repairDeal.estimateCompanyCost : 0, $scope.accidentInfo.repairDetail.repairDeal.estimateOtherCost ? $scope.accidentInfo.repairDetail.repairDeal.estimateOtherCost : 0);
        }

        // 编辑维修处理
        $scope.update = () => {
            $scope.maintenanceCanUpdate = true;
            $scope.maintenanceCancel = true;
            $scope.getDetil($scope.reportId);

        }

        // 取消维修处理编辑
        $scope.cancel = () => {
            $scope.maintenanceCanUpdate = false;
            $scope.getDetil($scope.reportId);
        }

        // 保存维修处理
        $scope.updateMaintenance = () => {
            accidentService.query('/api/repair/deal.do', {
                id: $scope.repairDetailId,
                repairId: $scope.repairmentId,
                suggestionType: $scope.accidentInfo.repairDetail.repairDeal.suggestionType,
                estimateTotalCost: commonService.numMulti($scope.accidentInfo.repairDetail.repairDeal.estimateTotalCost ? $scope.accidentInfo.repairDetail.repairDeal.estimateTotalCost : 0, 100),
                estimateDriverCost: commonService.numMulti($scope.accidentInfo.repairDetail.repairDeal.estimateDriverCost ? $scope.accidentInfo.repairDetail.repairDeal.estimateDriverCost : 0, 100),
                estimateCompanyCost: commonService.numMulti($scope.accidentInfo.repairDetail.repairDeal.estimateCompanyCost ? $scope.accidentInfo.repairDetail.repairDeal.estimateCompanyCost : 0, 100),
                estimateOther: $scope.accidentInfo.repairDetail.repairDeal.estimateOther,
                estimateOtherCost: commonService.numMulti($scope.accidentInfo.repairDetail.repairDeal.estimateOtherCost ? $scope.accidentInfo.repairDetail.repairDeal.estimateOtherCost : 0, 100),
                remark: $scope.accidentInfo.repairDetail.repairDeal.remark,
                ownership: $scope.accidentInfo.repairDetail.repairDeal.ownership
            }).then((res) => {
                if (res.data.status === 'SUCCESS') {
                    $scope.maintenanceCanUpdate = false;
                    $scope.repairCanUpdate = false;
                    $scope.getDetil($scope.reportId);
                    simpleModal('保存成功');
                } else {
                    simpleModal(res.data.errorMsg);
                }
            })
        }

        // 编辑送修记录
        $scope.updateRepair = () => {
            $scope.repairCanUpdate = true;
            $scope.repairCancel = true;
            $scope.getDetil($scope.reportId);

        }

        // 取消送修记录编辑
        $scope.cancelRepair = () => {
            $scope.repairCanUpdate = false;
            $scope.getDetil($scope.reportId);
        }

        // 保存送修记录
        $scope.saveRepairInfo = () => {
            accidentService.query('/api/repair/send.do', {
                id: $scope.repairSend,
                repairId: $scope.repairmentId,
                repairDate: Date.parse($scope.accidentInfo.repairDetail.repairSend.repairDate),
                repairAddress: $scope.accidentInfo.repairDetail.repairSend.repairAddress
            }).then((res) => {
                if (res.data.status === 'SUCCESS') {
                    $scope.maintenanceCanUpdate = false;
                    $scope.repairCanUpdate = false;
                    $scope.getDetil($scope.reportId);
                    simpleModal('保存成功');
                } else {
                    simpleModal(res.data.errorMsg);
                }
            })
        }

        // 保存回场记录
        $scope.saveBackInfo = () => {
            accidentService.query('/api/repair/back.do', {
                repairId: $scope.repairmentId,
                backDate: Date.parse($scope.accidentInfo.repairDetail.repairBack.backDate),
                remark: $scope.accidentInfo.repairDetail.repairBack.remark
            }).then((res) => {
                if (res.data.status === 'SUCCESS') {
                    // 回场记录保存后所有模块不可编辑
                    $scope.maintenanceCanUpdate = false;
                    $scope.repairCanUpdate = false;
                    $scope.getDetil($scope.reportId);
                    simpleModal('保存成功');
                } else {
                    simpleModal(res.data.errorMsg);
                }
            })
        }

        function simpleModal (content) {
            const modal = $uibModal.open({ size: 'sm', template: '<div style="padding: 5px; text-align: center">'+ content +'</div>'});
            $timeout(() => modal.close(), 500);
        }
    });
