'use strict';
import tipModelTemplate from '../model/commonTipsModel.html';

angular.module('shenmaApp')
    .controller('accidentCreateController', ($scope, accidentService, $timeout, $uibModal, localStorageService, $filter) => {
        $scope.title = '新增事故记录';
        // 标记基本信息是否可以编辑
        $scope.basicinfoEdit = true;
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
        // 标记维修处理是否可编辑
        $scope.maintenanceEdit = false;
        // 显示维修管理
        $scope.showMaintenance = false;
        // 新增时基本信息为空
        $scope.accidentInfo = [];
        $scope.accidentResponsibilitylist = ['我方全责', '我方主责', '我方同责', '我方次责', '我方无责'];
        $scope.accidentResponsibilityArr = $scope.accidentResponsibilitylist.map((d, index) => ({ id: index, content: d }));

        // 状态
        $scope.statusList = ['待处理', '已处理', '维修中', '已维修', '已完成', '驳回待处理'];
        $scope.statusArr = $scope.statusList.map((d, index) => ({ id: index, content: d, checked: true }));

        // 保存后获取详情
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
                            if ($scope.accidentInfo.basicSituation.currentStatus === 2) {
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
                            } else {
                                $scope.showMaintenance = false;
                            }
                        } else {
                            $scope.showMaintenance = false;
                        }
                    }
                }
            })
        }
    });
