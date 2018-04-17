import staffLeaveTemplate from '../notStart/staffLeaveModal.html';
import updateStaffInfoTemplate from '../notStart/updateStaffInfoModal.html';

angular.module('shenmaApp')
    .controller('qualifiedController', ($scope, inductionTrainingpService, $timeout, $uibModal) => {
        $scope.status = 0;
        $scope.bigTotalItems = 0;
        $scope.currentPage = 1;
        $scope.pageSize = 20;
        $scope.noData = false;
        $scope.loading = false;

        // 查询待入职
        function getWaitEntryList() {
            if ($scope.cityCode) {
                $scope.authCitys = $scope.cityCode;
            } else {
                $scope.authCitys = undefined;
            }
            var getWaitEntryData = {
                cityCode: $scope.authCitys,
                nameOrPhone: $scope.nameOrPhone,
                pageNo: $scope.currentPage,
                rows: $scope.pageSize
            };
            $scope.noData = false;
            $scope.loading = true;
            $scope.waitEntryList = [];
            inductionTrainingpService.update('/api/driverImport/queryWaitEntryDrivers.do', getWaitEntryData).then((res) => {
                $scope.loading = false;
                if (res.data.status === 'SUCCESS') {
                    if (res.data.data.rows && res.data.data.rows.length) {
                        $scope.waitEntryList = res.data.data.rows;
                        $scope.bigTotalItems = res.data.data.total;
                    } else {
                        $scope.bigTotalItems = 0;
                        $scope.noData = true;
                    }
                }
            });
        }

        // 监听城市并查询列表
        function cityUpdate() {
            $scope.timer = void 0;
            $scope.$watch('cityCode', (newValue, oldValue) => {
                if (newValue !== oldValue) {
                    $scope.currentPage = 1;
                    $scope.authCitys = $scope.cityCode
                    if ($scope.timer) {
                        $timeout.cancel($scope.timer);
                    }
                    $scope.timer = $timeout(() => {
                        getWaitEntryList();
                    }, 100);
                }
            });
        }

        // 监听城市并查询列表
        function pageUpdate() {
            $scope.timer = void 0;
            $scope.$watch('currentPage', (newValue, oldValue) => {
                if (newValue && newValue !== oldValue) {
                    if ($scope.timer) {
                        $timeout.cancel($scope.timer);
                    }
                    $scope.timer = $timeout(() => {
                        getWaitEntryList();
                    }, 100);
                }
            });
        }

        $scope.changeStatus = function(index) {
            $scope.status = index;
            if ($scope.status === 0) {
                $scope.currentPage = 1;
                getWaitEntryList();
            }
        }

        // 离职
        $scope.staffLeave = (id, taskId) => {
            var info = {
                id: id,
                taskId: taskId
            };
            $uibModal.open({
                animation: true,
                template: staffLeaveTemplate,
                controller: "staffLeaveModalCtrl",
                size: 'md',
                resolve: {
                    ids: function() {
                        return info;
                    }
                }
            }).result.then(() => {
                getWaitEntryList();
            })
        }

        // 修改员工信息
        $scope.updateStaffInfo = (item) => {
            var info = angular.extend({}, item);
            $uibModal.open({
                animation: true,
                template: updateStaffInfoTemplate,
                controller: "updateStaffInfoModalInstanceCtrl",
                size: 'md',
                resolve: {
                    staffInfo: function() {
                        return info;
                    }
                }
            }).result.then(() => {
                getWaitEntryList();
            })
        }

        getWaitEntryList();
        cityUpdate();
        pageUpdate();

    })
    .controller('staffLeaveModalCtrl', ($scope, $uibModalInstance, inductionTrainingpService, ids, $timeout) => {
        $scope.limitLen = 0;
        $scope.ids = ids;
        $scope.responseStatus = {
            title: '保存中...',
            isLoading: false,
            isLoadingSuccess: false,
            isLoadingError: false,
        }

        function limitLenUpdate() {
            $scope.timer = void 0;
            $scope.$watch('leaveReason', (newValue, oldValue) => {
                if (newValue !== oldValue) {
                    if ($scope.timer) {
                        $timeout.cancel($scope.timer);
                    }
                    $scope.timer = $timeout(() => {
                        if ($scope.leaveReason) {
                            $scope.limitLen = $scope.leaveReason.length;
                        }
                    }, 100);
                }
            });
        }
        $scope.ok = () => {
            var staffLeaveData = {
                leaveReason: $scope.leaveReason,
                drivers: [{
                    id: $scope.ids.id,
                    taskId: $scope.ids.taskId
                }]
            }
            $scope.responseStatus.isLoading = true;
            $scope.responseStatus.isLoadingSuccess = true;
            inductionTrainingpService.update('/api/driverImport/afterTrainQualifyLeave.do', staffLeaveData).then((res) => {
                if (res.data.status === 'SUCCESS') {
                    $scope.responseStatus.title = '保存成功';
                    $timeout(() => {
                        $uibModalInstance.close();
                    }, 1000);
                } else {
                    $scope.responseStatus.isLoadingSuccess = false;
                    $scope.responseStatus.isLoadingError = true;
                    $scope.responseStatus.title = '保存失败，请稍后再试';
                    $timeout(() => {
                        $scope.responseStatus.isLoading = false;
                    }, 3000);
                }
            });
        };

        $scope.cancel = () => {
            $uibModalInstance.dismiss('cancel');
        };

        limitLenUpdate();
    })
