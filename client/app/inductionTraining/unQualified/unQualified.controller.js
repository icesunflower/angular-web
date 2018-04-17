import setRepeatTrainModelTemplate from './setRepeatTrainModel.html';
import commonTipsTemplate from '../commonModel/commonTipsModel.html';

angular.module('shenmaApp')
    .controller('unQualifiedController', ($scope, inductionTrainingpService, $timeout, $uibModal) => {
        $scope.noData = false;
        $scope.loading = false;
        $scope.currentPage = 1;
        $scope.pageSize = 20;
        $scope.bigTotalItems = 0;
        $scope.checkedAll = false;

        // 查询不合格
        function getTrainNotPass() {
            if ($scope.cityCode) {
                $scope.authCitys = $scope.cityCode;
            } else {
                $scope.authCitys = undefined;
            }
            var getTrainNotPassData = {
                cityCode: $scope.authCitys,
                nameOrPhone: $scope.nameOrPhone,
                pageNo: $scope.currentPage,
                rows: $scope.pageSize
            };
            $scope.noData = false;
            $scope.loading = true;
            $scope.notPassDataList = [];
            inductionTrainingpService.update('/api/driverImport/queryTrainNotPassDrivers.do', getTrainNotPassData).then((res) => {
                $scope.loading = false;
                if (res.data.status === 'SUCCESS') {
                    if (res.data.data.rows && res.data.data.rows.length) {
                        $scope.notPassDataList = res.data.data.rows;
                        $scope.bigTotalItems = res.data.data.total;
                    } else {
                        $scope.bigTotalItems = 0;
                        $scope.noData = true;
                    }
                }
            });
        }

        // 根据手机号或员工姓名查询
        $scope.searchByPhone = () => {
            $scope.currentPage = 1;
            getTrainNotPass();
        }

        // 监听城市并查询列表
        function cityUpdate() {
            $scope.timer = void 0;
            $scope.$watch('cityCode', (newValue, oldValue) => {
                if (newValue !== oldValue) {
                    $scope.authCitys = $scope.cityCode
                    if ($scope.timer) {
                        $timeout.cancel($scope.timer);
                    }
                    $scope.timer = $timeout(() => {
                        getTrainNotPass();
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
                        getTrainNotPass();
                    }, 100);
                }
            });
        }

        //全选
        $scope.checkAll = function() {
            angular.forEach($scope.notPassDataList, function(item) {
                item.checked = $scope.checkedAll;
            });
        };

        $scope.$watch('notPassDataList', function(newVal, oldVal) {
            if (newVal === oldVal) return;
            $scope.repeatTrainList = [];
            angular.forEach($scope.notPassDataList, (item, key) => {
                if (item.checked) {
                    if ($scope.repeatTrainList.indexOf({ id: item.id, taskId: item.taskId }) === -1) {
                        $scope.repeatTrainList.push({ id: item.id, taskId: item.taskId })
                    }
                }
            })
            $scope.checkedAll = ($scope.repeatTrainList.length === $scope.notPassDataList.length && $scope.notPassDataList.length !== 0);
        }, true);

        // /批量设置复训
        $scope.setRepeatTrain = () => {
            $uibModal.open({
                animation: true,
                template: setRepeatTrainModelTemplate,
                controller: "setRepeatTrainModalInstanceCtrl",
                size: 'md',
                resolve: {
                    repeatTrainList: function() {
                        return $scope.repeatTrainList;
                    }
                }
            }).result.then(() => {
                getTrainNotPass();
            })
        }

        //设置员工复训
        $scope.setRepeatTrainByUnit = (id, taskId) => {
            var setRepeatTrainData = {
                drivers: [{
                    id: id,
                    taskId: taskId
                }]
            }
            $uibModal.open({
                size: 'sm',
                controller: ($scope, $uibModalInstance) => {
                    $scope.tips = {
                        body: '请确认是否操作'
                    }
                    $scope.conform = true;
                    $scope.ok = () => {
                        $uibModalInstance.close();
                    };
                    $scope.cancel = () => {
                        $uibModalInstance.dismiss();
                    };
                },
                template: commonTipsTemplate,
            }).result.then(() => {
                inductionTrainingpService.update('/api/driverImport/saveRepeatTrain.do', setRepeatTrainData).then((res) => {
                    if (res.data.status === 'SUCCESS') {
                        $scope.tips = '操作成功';
                    } else {
                        $scope.tips = '操作失败，请稍后再试';
                    }
                    $uibModal.open({
                        size: 'sm',
                        resolve: {
                            tips: () => {
                                return $scope.tips
                            }
                        },
                        controller: ($scope, $uibModalInstance, tips) => {
                            $scope.tips = {
                                body: tips
                            }
                            $scope.ok = () => {
                                $uibModalInstance.close();
                            };
                        },
                        template: commonTipsTemplate,
                    })
                    .result.then(() => {
                        getTrainNotPass();
                    }, () => {
                        getTrainNotPass();
                    })
                });
            })
        }

        getTrainNotPass();
        cityUpdate();
        pageUpdate();

    })
    .controller('setRepeatTrainModalInstanceCtrl', ($scope, $uibModalInstance, $filter, inductionTrainingpService, repeatTrainList, $timeout) => {
        $scope.repeatTrainList = repeatTrainList;
        $scope.responseStatus = {
            title: '操作中...',
            isLoading: false,
            isLoadingSuccess: false,
            isLoadingError: false,
        }
        $scope.ok = () => {
            var setRepeatTrainData = {
                drivers: $scope.repeatTrainList
            }
            $scope.responseStatus.isLoading = true;
            $scope.responseStatus.isLoadingSuccess = true;
            inductionTrainingpService.update('/api/driverImport/saveRepeatTrain.do', setRepeatTrainData).then((res) => {
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
            });
        };
        $scope.cancel = () => {
            $uibModalInstance.dismiss('cancel');
        };
    })
