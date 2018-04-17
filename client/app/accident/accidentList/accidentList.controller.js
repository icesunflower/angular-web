'use strict';
import tipModelTemplate from '../model/commonTipsModel.html';

angular.module('shenmaApp')
    .controller('accidentListController', ($scope, accidentService, $timeout, localStorageService, $uibModal, $state, $filter) => {
        $scope.table = { titles: ['车牌', '车型', '所属车队', '责任人', '联系电话', '状态', '事故时间', '操作'], body: [] };
        $scope.pagination = { current: 1, pageSize: 10, total: 0 };
        $scope.loading = false;
        $scope.noData = false;
        $scope.status;

        // 时间控件
        $scope.datepicker = {
            startTime: '',
            endTime: '',
        };

        // 状态
        $scope.statusList = ['待处理', '已处理', '维修中', '已维修', '已完成', '驳回待处理'];
        $scope.statusArr = $scope.statusList.map((d, index) => ({ id: index, content: d, checked: true }));
        $scope.changeStatus = (id) => {
            $scope.status = [];
            angular.forEach($scope.statusArr, (item, key) => {
                if (id === item.id) {
                    item.checked = !item.checked;
                }
                if (item.checked) {
                    $scope.status.push(item.id);
                }
            })
        }

        // 获取车队
        function getFreetList() {
            accidentService.update('/api/common/queryFleets.do', {}).then((res) => {
                if (res.data.status === 'SUCCESS') {
                    if (res.data.data && res.data.data.length) {
                        $scope.fleetArr = res.data.data;
                    }
                }
            })
        }

        // 获取城市
        function getCityList() {
            accidentService.update('/api/common/queryCityByAuth.do', {}).then((res) => {
                if (res.data.status === 'SUCCESS') {
                    if (res.data.data && res.data.data.length) {
                        $scope.cityList = res.data.data;
                    }
                }
            })
        }

        // 新增事故
        $scope.addAccident = () => {
            debugger
            localStorageService.remove('reportId');
            $state.go('accidentCreate');
        }
        // 获取事故列表
        function getAccidentList() {
            $scope.loading = true;
            $scope.table.body = [];
            accidentService.query('/api/accident/getPageList.do', {
                cityCode: $scope.cityCode,
                licensePlateNo: $scope.licensePlateNo,
                currentStatus: $scope.status,
                fleetId: $scope.fleetId,
                occuredTimeStart: $scope.datepicker.startTime ? Date.parse($filter('date')($scope.datepicker.startTime, 'yyyy-MM-dd 00:00:00')) : null,
                occuredTimeEnd: $scope.datepicker.endTime ? Date.parse($filter('date')($scope.datepicker.endTime, 'yyyy-MM-dd 00:00:00')) + 86400000 - 1 : null,
                pageNo: $scope.pagination.current,
                rows: $scope.pagination.pageSize
            }).then((res) => {
                $scope.loading = false;
                if (res.data.status === 'SUCCESS') {
                    if (res.data.data) {
                        if (res.data.data.rows) {
                            if (res.data.data.rows.length) {
                                $scope.noData = false;
                                $scope.table.body = res.data.data.rows;
                                $scope.pagination.total = res.data.data.total;
                            } else {
                                $scope.pagination.total = 0;
                                $scope.noData = true;
                            }
                        } else {
                            $scope.pagination.total = 0;
                            $scope.noData = true;
                        }
                    } else {
                        $scope.pagination.total = 0;
                        $scope.noData = true;
                    }
                }
            })
        }

        // 查询
        $scope.queryAccidentList = () => {
            $scope.pagination.current = 1;
            getAccidentList();
        }

        // 导出表单
        $scope.exportFile = () => {
            accidentService.query('/api/accident/exportCasualtyExcel.do', {
                cityCode: $scope.cityCode,
                licensePlateNo: $scope.licensePlateNo,
                currentStatus: $scope.status,
                fleetId: $scope.fleetId,
                occuredTimeStart: $scope.datepicker.startTime ? Date.parse($filter('date')($scope.datepicker.startTime, 'yyyy-MM-dd 00:00:00')) : null,
                occuredTimeEnd: $scope.datepicker.endTime ? Date.parse($filter('date')($scope.datepicker.endTime, 'yyyy-MM-dd 00:00:00')) + 86400000 - 1 : null,
                pageNo: $scope.pagination.current,
                rows: $scope.pagination.pageSize
            }).then((res) => {
                $uibModal.open({
                    size: 'sm',
                    controller: ($scope, $uibModalInstance) => {
                        $scope.tips = {
                            body: '请到文件下载管理页面下载需要的文件',
                            sure: '确定',
                            cancel: '取消'
                        }
                        $scope.ok = () => {
                            $uibModalInstance.close();
                        }
                        $scope.cancel = () => {
                            $uibModalInstance.dismiss();
                        }
                    },
                    template: tipModelTemplate
                })
            })
        }

        $scope.pageChanged = () => getAccidentList();
        $scope.changeStatus();
        getCityList();
        getFreetList();
        getAccidentList();
    });
