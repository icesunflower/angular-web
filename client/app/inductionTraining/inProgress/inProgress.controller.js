import setTrainResultTemplate from './setTrainResultModel.html';
import commonTipsTemplate from '../commonModel/commonTipsModel.html';
import setIntentionSiteTemplate from './setIntentionSiteModel.html';

angular.module('shenmaApp')
    .controller('inProgressController', ($scope, inductionTrainingpService, $timeout, $uibModal) => {
        $scope.status = 0;
        $scope.noData = false;
        $scope.loading = false;
        $scope.checkedAll = false;
        $scope.trainDate = '全部';

        function getTrainDate() {
            inductionTrainingpService.update('/api/driverImport/queryTrainDateList.do', {}).then((res) => {
                if (res.data.status === 'SUCCESS') {
                    if (res.data.data && res.data.data.length) {
                        $scope.trainDateList = res.data.data;
                        $scope.trainDateList.unshift('全部');
                    } else {
                        $scope.trainDateList = ['全部'];
                    }
                } else {
                    $scope.trainDateList = ['全部'];
                }
                $scope.trainDate = $scope.trainDateList[0];
            });
        }

        function getTrainingList() {
            if ($scope.cityCode) {
                $scope.authCitys = $scope.cityCode;
            } else {
                $scope.authCitys = undefined;
            }
            if ($scope.trainDate === '全部') {
                $scope.trainDateVal = undefined;
            } else {
                $scope.trainDateVal = $scope.trainDate;
            }
            var getTrainingListData = {
                cityCode: $scope.authCitys,
                nameOrPhone: $scope.nameOrPhone,
                trainDate: $scope.trainDateVal
            };
            $scope.trainingList = [];
            $scope.noData = false;
            $scope.loading = true;
            inductionTrainingpService.update('/api/driverImport/queryTrainingDrivers.do', getTrainingListData).then((res) => {
                $scope.loading = false;
                if (res.data.status === 'SUCCESS') {
                    if (res.data.data.rows && res.data.data.rows.length) {
                        $scope.trainingList = res.data.data.rows;
                    } else {
                        $scope.noData = true;
                    }
                }
            });
        }

        // 根据通知状态查询
        $scope.queryTrainList = (index) => {
            $scope.status = index;
            queryListByStatus();
        }

        // 根据手机号或员工姓名查询
        $scope.searchByPhone = () => {
            queryListByStatus();
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
                        getTrainingList();
                    }, 100);
                }
            });
        }

        // 监听培训日期并查询列表
        function trainDateUpdate() {
            $scope.timer = void 0;
            $scope.$watch('trainDate', (newValue, oldValue) => {
                if (newValue !== oldValue) {
                    if ($scope.timer) {
                        $timeout.cancel($scope.timer);
                    }
                    $scope.timer = $timeout(() => {
                        getTrainingList();
                    }, 100);
                }
            });
        }

        //全选
        $scope.checkAll = function() {
            angular.forEach($scope.trainingList, function(item) {
                item.checked = $scope.checkedAll;
            });
        };

        $scope.$watch('trainingList', function(newVal, oldVal) {
            if (newVal === oldVal) return;
            $scope.trainResultList = [];
            $scope.staffList = [];
            angular.forEach($scope.trainingList, (item, key) => {
                if (item.checked) {
                    if ($scope.trainResultList.indexOf({ id: item.id, taskId: item.taskId }) === -1) {
                        $scope.trainResultList.push({ id: item.id, taskId: item.taskId });
                    }
                    if ($scope.staffList.indexOf({ id: item.id, contactPhone: item.contactPhone, driverName: item.driverName, cityCode: item.cityCode }) === -1) {
                        $scope.staffList.push({ id: item.id, contactPhone: item.contactPhone, driverName: item.driverName, cityCode: item.cityCode });
                    }
                }
            })
            $scope.checkedAll = ($scope.trainResultList.length === $scope.trainingList.length && $scope.trainingList.length !== 0);
        }, true);

        //批量设置培训结果
        $scope.setTrainResult = () => {
            var trainResultList = {
                trainResultList: $scope.trainResultList,
                staffList: $scope.staffList
            }
            $uibModal.open({
                animation: true,
                template: setTrainResultTemplate,
                controller: "setTrainResultModalInstanceCtrl",
                size: 'md',
                resolve: {
                    trainResultList: function() {
                        return trainResultList;
                    }
                }
            }).result.then(() => {
                getTrainingList();
            })
        }

        //设置员工培训结果
        $scope.setTrainResultByUnit = (result, id, taskId, cityCode) => {
            var setTrainResultData = {
                trainResult: result,
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
                inductionTrainingpService.update('/api/driverImport/saveDriverTrainResult.do', setTrainResultData).then((res) => {
                    if (res.data.status === 'SUCCESS') {
                        $scope.tips = '操作成功';
                        if (setTrainResultData.trainResult === '合格') {
                            setIntentionSiteByUnit(id, cityCode);
                        } else {
                            tipModal($scope.tips);
                        }
                    } else {
                        $scope.tips = '操作失败，请稍后再试';
                        tipModal($scope.tips);
                    }
                });
            })
        }

        // 操作提示
        function tipModal(tips) {
            $uibModal.open({
                size: 'sm',
                resolve: {
                    tips: () => {
                        return tips
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
            }).result.then(() => {
                getTrainingList();
            }, () => {
                getTrainingList();
            })
        }

        // 单个设置意向场站
        function setIntentionSiteByUnit(id, cityCode) {
            $scope.setIntentionSiteData = [{
                id: id,
                cityCode: cityCode,
                byUnit: true
            }]
            $uibModal.open({
                animation: true,
                template: setIntentionSiteTemplate,
                controller: "setIntentionSiteModalInstanceCtrl",
                size: 'md',
                resolve: {
                    staffList: function() {
                        return  $scope.setIntentionSiteData;
                    }
                }
            }).result.then(() => {
                getTrainingList();
            })
        }

        getTrainDate();
        getTrainingList();
        cityUpdate();
        trainDateUpdate();

    })
    .controller('setTrainResultModalInstanceCtrl', ($scope, $uibModal, $uibModalInstance, $filter, inductionTrainingpService, trainResultList, $timeout) => {
        $scope.trainResultList = trainResultList.trainResultList;
        $scope.staffList = trainResultList.staffList;
        $scope.trainResultArr = ['合格', '不合格'];
        $scope.trainResult = $scope.trainResultArr[0];
        $scope.responseStatus = {
            title: '保存中...',
            isLoading: false,
            isLoadingSuccess: false,
            isLoadingError: false,
        }

        $scope.ok = () => {
            var setTrainResultData = {
                trainResult: $scope.trainResult,
                drivers: $scope.trainResultList
            }
            $scope.responseStatus.isLoading = true;
            $scope.responseStatus.isLoadingSuccess = true;
            inductionTrainingpService.update('/api/driverImport/saveDriverTrainResult.do', setTrainResultData).then((res) => {
                if (res.data.status === 'SUCCESS') {
                    $scope.responseStatus.title = '保存成功';
                    if ($scope.trainResult === '合格') {
                        $uibModalInstance.close();
                        setIntentionSites();
                    } else {
                        $timeout(() => {
                            $uibModalInstance.close();
                        }, 1000);
                    }
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

        // 批量设置意向场站
        function setIntentionSites() {
            $uibModal.open({
                animation: true,
                template: setIntentionSiteTemplate,
                controller: "setIntentionSiteModalInstanceCtrl",
                size: 'md',
                resolve: {
                    staffList: function() {
                        return $scope.staffList;
                    }
                }
            })
        }
    })
    .controller('setIntentionSiteModalInstanceCtrl', ($scope, $uibModalInstance, inductionTrainingpService, staffList, $timeout) => {
        $scope.staffList = staffList;
        $scope.setIntentionSiteList = '';
        $scope.intentionSite = '';
        $scope.responseStatus = {
            title: '保存中...',
            isLoading: false,
            isLoadingSuccess: false,
            isLoadingError: false,
        }

        // 获取场站列表
        function getCarSites() {
            inductionTrainingpService.query('/api/driverImport/queryCarSites.do').then((res) => {
                if (res.data.status === 'SUCCESS') {
                    if (res.data.data) {
                        angular.forEach($scope.staffList, (item, value) => {
                            item.siteList = res.data.data[item.cityCode];
                            if (item.siteList) {
                                if (item.siteList.length > 1 && item.siteList[0].id) {
                                    item.siteList.unshift({id: '', siteName:'下拉选择'});
                                }
                            }
                            item.intentionSite = item.siteList[0].id;
                        })
                    }
                }
            })
        }

        $scope.ok = () => {
            var staffArr = [];
            angular.forEach($scope.staffList, (value, key) => {
                if ($scope.staffList[key]) {
                    if ($scope.staffList[key].intentionSite) {
                        staffArr[key] = {
                            id: $scope.staffList[key].id,
                            intentionSiteId: $scope.staffList[key].intentionSite
                        }
                    }
                }
            });
            $scope.responseStatus.isLoading = false;
            $scope.responseStatus.isLoadingSuccess = true;
            if (staffArr.length) {
                inductionTrainingpService.update('/api/driverImport/updateIntentionSite.do', staffArr).then((res) => {
                    $scope.responseStatus.isLoading = true;
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
            } else {
                $uibModalInstance.close();
            }
        };

        $scope.cancel = () => {
            $uibModalInstance.dismiss('cancel');
        };

        getCarSites();
    })

