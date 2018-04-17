'use strict';
import tipModelTemplate from '../model/commonTipsModel.html';

angular.module('shenmaApp')
    .controller('accidentDetailForSafetyDerpartmentController', ($scope, accidentService, commonService, $timeout, $uibModal, $stateParams, $filter) => {
        $scope.title = '事故记录详情';
        //安全部意见编辑按钮
        $scope.updateBtn = true;
        // 标记基本信息是否可编辑
        $scope.basicinfoEdit = false;
        // 是否显示基本修改按钮
        $scope.showEdit = false;
        // 标记安全部意见是否可编辑
        $scope.safeytyinfoEdit = false;
        // 是否显示安全部意见修改按钮
        $scope.showSafeytyinfoEdit = false;
        //是否为安全部
        $scope.isSafeytyDepartment = true;
        //报修按钮
        $scope.repairBtnName = '立即报修';
        // 是否显示送修记录和回场记录
        $scope.showRepairBack = true;
        // 是否显示报案时间
        $scope.showReoprtTime = false;
        //显示事故处理结果
        $scope.showResult = false;
        // 事故处理结果保存按钮
        $scope.resultEdit = true;
        $scope.accidentInfo = [];

        $scope.today = new Date();
        if ($stateParams.id) {
            $scope.reportId = $stateParams.id;
        }

        $scope.bearSituationArr = ['启用商业险', '启用交强险', '行程管家现金承担', '公司现金承担'];
        $scope.bearSituationArrList = $scope.bearSituationArr.map((d, index) => ({ id: index, content: d, checked: false }));

        // 状态
        $scope.statusList = ['待处理', '已处理', '维修中', '已维修', '已完成', '驳回待处理'];
        $scope.statusArr = $scope.statusList.map((d, index) => ({ id: index, content: d, checked: true }));

        // 事故责任
        $scope.accidentResponsibilitylist = ['我方全责', '我方主责', '我方同责', '我方次责', '我方无责'];
        $scope.accidentResponsibilityArr = $scope.accidentResponsibilitylist.map((d, index) => ({ id: index,  content: d }));

        // 获取详情
        $scope.getDetil = (id, canUpdateBsic, canUpdateSafeyty) => {
            accidentService.getDetail(id).then((res) => {
                if (res.data.status === 'SUCCESS') {
                    if (res.data.data) {
                        $scope.accidentInfo = res.data.data;
                        if ($scope.accidentInfo.basicSituation && $scope.accidentInfo.basicSituation.id) {
                            $scope.reportId = $scope.accidentInfo.basicSituation.id;
                            if ($scope.accidentInfo.basicSituation.currentStatus === 0) {
                                if (canUpdateBsic) {
                                    $scope.basicinfoEdit = true;
                                    $scope.showEdit = false;
                                    $scope.safeytyinfoEdit = false;
                                    $scope.showSafeytyinfoEdit = false;
                                } else {
                                    $scope.showEdit = true;
                                    $scope.basicinfoEdit = false;
                                    $scope.safeytyinfoEdit = true;
                                }
                            }
                            if ($scope.accidentInfo.basicSituation.currentStatus === 1 || $scope.accidentInfo.basicSituation.currentStatus === 5) {
                                if (canUpdateBsic) {
                                    $scope.basicinfoEdit = true;
                                    $scope.showEdit = false;
                                    $scope.safeytyinfoEdit = false;
                                    $scope.showSafeytyinfoEdit = false;
                                } else if (canUpdateSafeyty) {
                                    $scope.basicinfoEdit = false;
                                    $scope.showEdit = false;
                                    $scope.safeytyinfoEdit = true;
                                    $scope.showSafeytyinfoEdit = false;
                                } else {
                                    $scope.showEdit = true;
                                    $scope.basicinfoEdit = false;
                                    $scope.safeytyinfoEdit = false;
                                    $scope.showSafeytyinfoEdit = true;
                                }
                            }
                            if ($scope.accidentInfo.basicSituation.currentStatus === 5) {
                                $scope.repairBtnName = '再次报修';
                            }
                            if ($scope.accidentInfo.basicSituation.currentStatus === 2) {
                                $scope.showEdit = false;
                                $scope.basicinfoEdit = false;
                                $scope.safeytyinfoEdit = false;
                                $scope.showSafeytyinfoEdit = false;
                            }
                            if ($scope.accidentInfo.basicSituation.currentStatus === 3) {
                                $scope.resultEdit = true;
                                $scope.showResult = true;
                                $scope.showEdit = false;
                                $scope.basicinfoEdit = false;
                                $scope.safeytyinfoEdit = false;
                                $scope.showSafeytyinfoEdit = false;
                            }
                            if ($scope.accidentInfo.basicSituation.currentStatus === 4) {
                                $scope.resultEdit = false;
                                $scope.showResult = true;
                                $scope.showEdit = false;
                                $scope.basicinfoEdit = false;
                                $scope.safeytyinfoEdit = false;
                                $scope.showSafeytyinfoEdit = false;
                            }
                            if ($scope.accidentInfo.basicSituation.occuredTime) {
                                $scope.accidentInfo.basicSituation.occuredTime = $filter('date')($scope.accidentInfo.basicSituation.occuredTime, 'yyyy-MM-dd HH:mm:s');
                            }
                            if ($scope.accidentInfo.basicSituation.currentStatus === 0) {
                                $scope.statusName = $scope.statusArr[0].content;
                            } else if ($scope.accidentInfo.basicSituation.currentStatus === 1) {
                                $scope.statusName = $scope.statusArr[1].content;
                            } else if ($scope.accidentInfo.basicSituation.currentStatus === 2) {
                                $scope.statusName = $scope.statusArr[2].content;
                            } else if ($scope.accidentInfo.basicSituation.currentStatus === 3) {
                                $scope.statusName = $scope.statusArr[3].content;
                            } else if ($scope.accidentInfo.basicSituation.currentStatus === 4) {
                                $scope.statusName = $scope.statusArr[4].content;
                            } else if ($scope.accidentInfo.basicSituation.currentStatus === 5) {
                                $scope.statusName = $scope.statusArr[5].content;
                            }
                        }

                        if ($scope.accidentInfo.securityDepartmentSuggestion) {
                            if (!$scope.accidentInfo.securityDepartmentSuggestion.injurySituation) {
                                $scope.accidentInfo.securityDepartmentSuggestion.injury = 0;
                            } else {
                                $scope.accidentInfo.securityDepartmentSuggestion.injury = 1;
                            }
                        } else {
                            if ($scope.accidentResponsibilityArr.length < 6) {
                                $scope.accidentResponsibilityArr.unshift({ id: '', content: '请选择事故责任' });
                            }
                            $scope.accidentInfo.securityDepartmentSuggestion = {
                                injury: 0,
                                accidentResponsible: $scope.accidentResponsibilityArr[0].id
                            }
                        }

                        if ($scope.accidentInfo.repairDetail) {
                            if ($scope.accidentInfo.repairDetail.repair) {
                                $scope.showMaintenance = true;
                                // 安全部显示维修处理状态
                                $scope.showRepairName = true;
                                // 待送修显示车队处理意见
                                if ($scope.accidentInfo.repairDetail.repair.currentStatus === 1 || $scope.accidentInfo.repairDetail.repair.currentStatus === 2 || $scope.accidentInfo.repairDetail.repair.currentStatus === 4) {
                                    $scope.showFleetSuggestion = true;
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
                            $scope.resultEdit = false;
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
                        } else {
                            $scope.resultEdit = true;
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

        $scope.changeBearSituation = (id) => {
            $scope.bearSituations = [];
            $scope.bearSituation = '';
            angular.forEach($scope.bearSituationArrList, (item, key) => {
                if (id === item.id) {
                    item.checked = !item.checked;
                }
                if (item.checked) {
                    $scope.bearSituations.push(item.id);
                    $scope.bearSituation = $scope.bearSituations.join(',');
                }
                if ($scope.bearSituationArrList[0].checked || $scope.bearSituationArrList[1].checked) {
                    $scope.showReoprtTime = true;
                } else {
                    $scope.showReoprtTime = false;
                    $scope.reportTime = '';
                }
            })
        }

        // 编辑事故处理结果
        $scope.updateResult = () => {
            $scope.updateResultBtn = false;
            $scope.resultUpdate = true;
            $scope.resultEdit = true;
        }

        // 取消事故处理结果编辑
        $scope.cancelResult = () => {
            $scope.getDetil($scope.reportId);
            $scope.resultEdit = false;
        }

        $scope.changeCarRepairCost = () => {
            $scope.carRepairCost = commonService.numAdd($scope.driverCarCost ? $scope.driverCarCost : 0, $scope.companyCarCost ? $scope.companyCarCost : 0, $scope.otherCarCost ? $scope.otherCarCost : 0);
        }
        $scope.changePeopleCost = () => {
            $scope.peopleCost = commonService.numAdd($scope.driverPeopleCost ? $scope.driverPeopleCost : 0, $scope.companyPeopleCost ? $scope.companyPeopleCost : 0, $scope.otherPeopleCost ? $scope.otherPeopleCost : 0);
        }

        // 保存事故处理结果
        function saveUpdateResult() {
            accidentService.query('/api/accident/addResult.do', {
                accidentId: $scope.reportId,
                bearSituation: $scope.bearSituation,
                reportTime: $scope.reportTime ? Date.parse($filter('date')($scope.reportTime, 'yyyy-MM-dd HH:00:00')) : null,
                carRepairCost: commonService.numMulti($scope.carRepairCost, 100),
                driverCarCost: commonService.numMulti($scope.driverCarCost, 100),
                companyCarCost: commonService.numMulti($scope.companyCarCost, 100),
                otherCar: $scope.otherCar,
                otherCarCost: commonService.numMulti($scope.otherCarCost ? $scope.otherCarCost : 0, 100),
                peopleCost: commonService.numMulti($scope.peopleCost, 100),
                driverPeopleCost: commonService.numMulti($scope.driverPeopleCost, 100),
                companyPeopleCost: commonService.numMulti($scope.companyPeopleCost, 100),
                otherPeople: $scope.otherPeople,
                otherPeopleCost: commonService.numMulti($scope.otherPeopleCost ? $scope.otherPeopleCost : 0, 100),
                remark: $scope.remark
            }).then((res) => {
                if (res.data.status === 'SUCCESS') {
                    $scope.updateResultBtn = false;
                    $scope.resultEdit = false;
                    $scope.getDetil($scope.reportId);
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
        $scope.saveUpdateResult = () => {
            $uibModal.open({
                size: 'sm',
                template: tipModelTemplate,
                controller: ($scope, $uibModalInstance) => {
                    $scope.tips = {
                        body: '该模块保存后，不可再次编辑。是否确认保存？',
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
                saveUpdateResult();
            })
        }
    });
