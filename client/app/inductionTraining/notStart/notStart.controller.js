import updateStaffInfoTemplate from './updateStaffInfoModal.html';
import uploadFileTemplate from './uploadFileModal.html';
import staffLeaveTemplate from './staffLeaveModal.html';
import setDriverTrainDateTemplate from './setDriverTrainDateModal.html';
import commonTipsTemplate from '../commonModel/commonTipsModel.html';

angular.module('shenmaApp')
    .controller('notStartController', ($scope, inductionTrainingpService, $timeout, $uibModal) => {
        $scope.status = 0;
        $scope.noData = false;
        $scope.loading = false;
        $scope.checkedAll = false;

        function getWaitTrainList() {
            var getWaitTrainListData = {
                cityCode: $scope.authCitys,
                nameOrPhone: $scope.nameOrPhone
            };
            $scope.noData = false;
            $scope.loading = true;
            $scope.waitTrainList = [];
            inductionTrainingpService.update('/api/driverImport/queryWaitTrainDrivers.do', getWaitTrainListData).then((res) => {
                $scope.loading = false;
                if (res.data.status === 'SUCCESS') {
                    if (res.data.data) {
                        if (res.data.data.rows && res.data.data.rows.length) {
                            $scope.waitTrainList = res.data.data.rows;
                        } else {
                            $scope.noData = true;
                        }
                    } else {
                        $scope.noData = true;
                    }
                }
            });
        }

        function getReadyInformList() {
            var getReadyInformListData = {
                cityCode: $scope.authCitys,
                nameOrPhone: $scope.nameOrPhone
            };
            $scope.noData = false;
            $scope.loading = true;
            $scope.waitTrainList = [];
            inductionTrainingpService.update('/api/driverImport/queryReadyInformDrivers.do', getReadyInformListData).then((res) => {
                $scope.loading = false;
                if (res.data.status === 'SUCCESS') {
                    if (res.data.data.rows && res.data.data.rows.length) {
                        $scope.waitTrainList = res.data.data.rows;
                    } else {
                        $scope.noData = true;
                    }
                }
            });
        }

        function queryListByStatus() {
            if ($scope.cityCode) {
                $scope.authCitys = $scope.cityCode;
            } else {
                $scope.authCitys = undefined;
            }
            $scope.waitTrainList = [];
            if ($scope.status === 0) {
                getWaitTrainList();
            } else if ($scope.status === 1) {
                getReadyInformList();
            }
        }

        // 根据通知状态查询
        $scope.queryTrainList = (index) => {
            $scope.status = index;
            $scope.nameOrPhone = null;
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
                    $scope.authCitys = $scope.cityCode;
                    if ($scope.timer) {
                        $timeout.cancel($scope.timer);
                    }
                    $scope.timer = $timeout(() => {
                        queryListByStatus();
                    }, 100);
                }
            });
        }

        // 导入员工
        $scope.uploadFile = () => {
            var cityList = $scope.cityList.slice(1);
            $uibModal.open({
                animation: true,
                template: uploadFileTemplate,
                controller: "uploadFileModalInstanceCtrl",
                size: 'md',
                resolve: {
                    cityList: function() {
                        return cityList;
                    }
                }
            }).result.then(() => {
                queryListByStatus();
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
                queryListByStatus();
            })
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
                controller: "staffLeaveModalInstanceCtrl",
                size: 'md',
                resolve: {
                    ids: function() {
                        return info;
                    }
                }
            }).result.then(() => {
                queryListByStatus();
            })
        }

        //通知员工参加培训
        $scope.informDriverToTrain = (id) => {
            var informDriverToTrainData = {
                drivers: [{
                    id: id
                }]
            }
            inductionTrainingpService.update('/api/driverImport/informDriverToTrain.do', informDriverToTrainData).then((res) => {
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
                        queryListByStatus();
                    }, () => {
                        queryListByStatus();
                    })
            });
        }

        //全选
        $scope.checkAll = function() {
            angular.forEach($scope.waitTrainList, function(item) {
                item.checked = $scope.checkedAll;
            });
        };

        $scope.$watch('waitTrainList', function(newVal, oldVal) {
            if (newVal === oldVal) return;
            $scope.trainingList = [];
            angular.forEach($scope.waitTrainList, function(item, key) {
                if (item.checked) {
                    if ($scope.trainingList.indexOf({ id: item.id, taskId: item.taskId }) === -1) {
                        $scope.trainingList.push({ id: item.id, taskId: item.taskId })
                    }
                }
            });
            $scope.checkedAll = ($scope.trainingList.length === $scope.waitTrainList.length && $scope.waitTrainList.length !== 0);
        }, true);

        //批量设置培训时间
        $scope.setDriverTrainDate = () => {
            $uibModal.open({
                animation: true,
                template: setDriverTrainDateTemplate,
                controller: "setDriverTrainDateModalInstanceCtrl",
                size: 'md',
                resolve: {
                    trainingList: function() {
                        return $scope.trainingList;
                    }
                }
            }).result.then(() => {
                queryListByStatus();
            })
        }

        queryListByStatus();
        cityUpdate();

    })
    .controller('updateStaffInfoModalInstanceCtrl', ($scope, $uibModalInstance, $filter, inductionTrainingpService, staffInfo, $timeout) => {
        $scope.staffInfo = staffInfo;
        $scope.limitLen = $scope.staffInfo.resideAddress.length;
        $scope.dateFormat = 'yyyy-MM-dd';
        $scope.datepicker = {
            startTime: Date.parse($scope.staffInfo.employTime),
            startOpened: false,
            startOptions: {}
        };
        $scope.open = function() { $scope.datepicker.startOpened = true; };
        $scope.genderList = [{
            content: '男',
            checked: false
        }, {
            content: '女',
            checked: false
        }];
        $scope.responseStatus = {
            title: '保存中...',
            isLoading: false,
            isLoadingSuccess: false,
            isLoadingError: false,
        }
        $scope.changeGender = (content) => {
            angular.forEach($scope.genderList, (item, key) => {
                if ($scope.genderList[key].content === content) {
                    $scope.genderList[key].checked = true;
                    $scope.staffInfo.gender = $scope.genderList[key].content
                } else {
                    $scope.genderList[key].checked = false;
                }
            })
        }

        function limitLenUpdate() {
            $scope.timer = void 0;
            $scope.$watch('staffInfo.resideAddress', (newValue, oldValue) => {
                if (newValue !== oldValue) {
                    if ($scope.timer) {
                        $timeout.cancel($scope.timer);
                    }
                    $scope.timer = $timeout(() => {
                        if ($scope.staffInfo.resideAddress) {
                            $scope.limitLen = $scope.staffInfo.resideAddress.length;
                        }
                    }, 100);
                }
            });
        }

        $scope.ok = () => {
            var updateData = {
                id: $scope.staffInfo.id,
                driverName: $scope.staffInfo.driverName,
                contactPhone: $scope.staffInfo.contactPhone,
                idNo: $scope.staffInfo.idNo,
                employTime: $filter('date')($scope.datepicker.startTime, 'yyyy-MM-dd'),
                resideAddress: $scope.staffInfo.resideAddress,
                gender: $scope.staffInfo.gender,
                urgencyPhone: $scope.staffInfo.urgencyPhone,
                taskId: $scope.staffInfo.taskId
            }
            $scope.responseStatus.isLoading = true;
            $scope.responseStatus.isLoadingSuccess = true;
            inductionTrainingpService.update('/api/driverImport/saveDriverInfo.do', updateData).then((res) => {
                if (res.data.status === 'SUCCESS') {
                    $scope.responseStatus.title = '保存成功';
                    $timeout(() => {
                        $uibModalInstance.close();
                    }, 1000);
                } else {
                    $scope.responseStatus.isLoadingSuccess = false;
                    $scope.responseStatus.isLoadingError = true;
                    if (res.data.errorMsg) {
                        $scope.responseStatus.title = res.data.errorMsg;
                    } else {
                        $scope.responseStatus.title = '保存失败，请稍后再试';
                    }
                    $timeout(() => {
                        $scope.responseStatus.isLoading = false;
                    }, 3000);
                    // alert(res.errorMsg)
                }
            });
        };
        $scope.cancel = () => {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.changeGender($scope.staffInfo.gender);
        limitLenUpdate();
    })
    .controller('uploadFileModalInstanceCtrl', ($scope, $uibModal, $uibModalInstance, FileUploader, inductionTrainingpService, cityList) => {
        $scope.cityListUpload = cityList;
        if ($scope.cityListUpload) {
            $scope.cityId = $scope.cityListUpload[0].id;
        }
        const uploader = $scope.uploader = new FileUploader({
            // headers: {
            //     //'Content-Type': 'multipart/form-data',
            //     'Request-Version': '1.2',
            //     // 'Authorization': localStorageService.get('_user')
            // },
            url: '/api/file/uploadDriverImport.do',
            // responseType: 'arraybuffer'
        });

        $scope.upload = () => uploader.uploadItem(0);
        $scope.response = { status: '', message: '' };

        uploader.onAfterAddingFile = () => {
            if (uploader.queue.length > 1) {
                uploader.removeFromQueue(0);
                $scope.showError = false;
                $scope.showSuccess = false;
            }
        };

        uploader.onBeforeUploadItem = (item) => {
            item.formData.push({ cityId: $scope.cityId });
        };

        // 下载模板
        $scope.open = () => {
            window.open('https://oslkhjr14.bkt.clouddn.com/driver_train_import_template_v1.xlsx')
        }

        //导入
        uploader.onSuccessItem = (fileItem, response) => {
            if (response.status === 'SUCCESS') {
                $uibModal.open({
                    size: 'sm',
                    controller: ($scope, $uibModalInstance) => {
                        $scope.tips = {
                            body: response.errorMsg,
                        };
                        $scope.ok = () => {
                            $uibModalInstance.close();
                        };
                    },
                    template: commonTipsTemplate,
                }).result.then(() => {
                    $uibModalInstance.close();
                    if (response.data) {
                        window.open(response.data);
                    }
                }, () => {
                    $uibModalInstance.close();
                    if (response.data) {
                        window.open(response.data);
                    }
                })
            } else {
                $uibModal.open({
                    size: 'sm',
                    controller: ($scope, $uibModalInstance) => {
                        $scope.tips = {
                            body: response.errorMsg,
                        };
                        $scope.ok = () => {
                            $uibModalInstance.close();
                        };
                    },
                    template: commonTipsTemplate,
                })
            }
        };

        $scope.ok = () => {
            $uibModalInstance.close();
        };
        $scope.cancel = () => {
            $uibModalInstance.dismiss('cancel');
        };
    })
    .controller('staffLeaveModalInstanceCtrl', ($scope, $uibModalInstance, inductionTrainingpService, ids, $timeout) => {
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
            $scope.staffLeaveData = {
                leaveReason: $scope.leaveReason,
                drivers: [{
                    id: $scope.ids.id,
                    taskId: $scope.ids.taskId
                }]
            }
            if ($scope.ids.taskId) {
                readyInformLeave();
            } else {
                noInformLeave();
            }
        };

        function noInformLeave() {
            $scope.responseStatus.isLoading = true;
            $scope.responseStatus.isLoadingSuccess = true;
            inductionTrainingpService.update('/api/driverImport/noInformLeave.do', $scope.staffLeaveData).then((res) => {
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
                    // alert(res.errorMsg)
                }
            });
        }

        function readyInformLeave() {
            $scope.responseStatus.isLoading = true;
            $scope.responseStatus.isLoadingSuccess = true;
            inductionTrainingpService.update('/api/driverImport/readyInformLeave.do', $scope.staffLeaveData).then((res) => {
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
                    // alert(res.errorMsg)
                }
            });
        }
        $scope.cancel = () => {
            $uibModalInstance.dismiss('cancel');
        };

        limitLenUpdate();
    })
    .controller('setDriverTrainDateModalInstanceCtrl', ($scope, $uibModalInstance, $filter, inductionTrainingpService, trainingList, $timeout) => {
        $scope.responseStatus = {
            title: '保存中...',
            isLoading: false,
            isLoadingSuccess: false,
            isLoadingError: false,
        }
        $scope.dateFormat = 'yyyy-MM-dd';
        $scope.datepicker = {
            startTime: '',
            startOpened: false,
        };
        $scope.trainingList = trainingList;
        $scope.open = function() { $scope.datepicker.startOpened = true; };
        $scope.ok = () => {
            var setDriverTrainDateData = {
                trainDate: $filter('date')($scope.datepicker.startTime, 'yyyy-MM-dd'),
                drivers: $scope.trainingList
            }
            $scope.responseStatus.isLoading = true;
            $scope.responseStatus.isLoadingSuccess = true;
            inductionTrainingpService.update('/api/driverImport/saveDriverTrainDate.do', setDriverTrainDateData).then((res) => {
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
    })
