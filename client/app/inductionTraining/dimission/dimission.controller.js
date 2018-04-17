angular.module('shenmaApp')
    .controller('dimissionController', function($scope, $stateParams, inductionTrainingpService, $timeout, $uibModal, $filter) {
        $scope.currentPage = 1;
        $scope.pageSize = 20;
        $scope.bigTotalItems = 0;
        $scope.noData = false;
        $scope.loading = false;

        // 离职节点
        $scope.leaveNodeArr = ['全部', '待培训', '培训合格'];
        if ($stateParams.leaveNodeId) {
            $scope.leaveNode = $scope.leaveNodeArr[2];
        } else {
            $scope.leaveNode = $scope.leaveNodeArr[0];
        }

        // 时间控件
        $scope.dateFormat = 'yyyy/MM/dd';
        $scope.datepicker = {
            startTime: '',
            startOpened: false,
            endTime: '',
            startOptions: {},
            endOpened: false,
            endOptions: {}
        };
        $scope.change = function() {
            $scope.datepicker.startOptions.maxDate = $scope.datepicker.endTime ? $scope.datepicker.endTime : null
            $scope.datepicker.endOptions.minDate = $scope.datepicker.startTime ? $scope.datepicker.startTime : null
        }
        $scope.open = function() { $scope.datepicker.startOpened = true; };
        $scope.openEnd = function() { $scope.datepicker.endOpened = true; };

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
                        $scope.queryLeaveList();
                    }, 100);
                }
            });
        }

        // 监听翻页并获取订单数据
        function pageUpdate() {
            $scope.timer = void 0;
            $scope.$watch('currentPage', (newValue, oldValue) => {
                if (newValue !== oldValue) {
                    if ($scope.timer) {
                        $timeout.cancel($scope.timer);
                    }
                    $scope.timer = $timeout(() => {
                        getLeaveList();
                    }, 100);
                }
            });
        }

        // 查询离职培训日期
        function getTrainDateForLeaveList() {
            inductionTrainingpService.update('/api/driverImport/queryTrainDateForLeaveList.do', {}).then((res) => {
                if (res.data.status === 'SUCCESS') {
                    if (res.data.data && res.data.data.length) {
                        $scope.dateForLeaveList = res.data.data;
                        $scope.dateForLeaveList.unshift('全部');
                    } else {
                        $scope.dateForLeaveList = ['全部'];
                    }

                } else {
                    $scope.dateForLeaveList = ['全部'];
                }
                $scope.trainDate = $scope.dateForLeaveList[0];
            })
        }

        // 查询离职
        function getLeaveList() {
            if ($scope.cityCode) {
                $scope.authCitys = $scope.cityCode;
            } else {
                $scope.authCitys = undefined;
            }
            if ($scope.leaveNode === '全部') {
                $scope.leaveNodeVal = null;
            } else {
                $scope.leaveNodeVal = $scope.leaveNode;
            }
            if ($scope.trainDate === '全部') {
                $scope.trainDateVal = null;
            } else {
                $scope.trainDateVal = $scope.trainDate;
            }
            var getLeaveListData = {
                cityCode: $scope.authCitys,
                leaveNode: $scope.leaveNodeVal,
                empStartTime: $filter('date')($scope.datepicker.startTime, 'yyyy-MM-dd'),
                empEndTime: $filter('date')($scope.datepicker.endTime, 'yyyy-MM-dd'),
                trainDate: $scope.trainDateVal,
                pageNo: $scope.currentPage,
                rows: $scope.pageSize
            };
            $scope.noData = false;
            $scope.loading = true;
            $scope.leaveList = [];
            inductionTrainingpService.update('/api/driverImport/queryLeaveDrivers.do', getLeaveListData).then((res) => {
                $scope.loading = false;
                if (res.data.status === 'SUCCESS') {
                    if (res.data.data.rows && res.data.data.rows.length) {
                        $scope.leaveList = res.data.data.rows;
                        $scope.bigTotalItems = res.data.data.total;
                    } else {
                        $scope.noData = true;
                        $scope.bigTotalItems = 0;
                    }
                }
            });
        }

        $scope.queryLeaveList = () => {
            $scope.currentPage = 1;
            getLeaveList();
        }

        getTrainDateForLeaveList();
        getLeaveList();
        cityUpdate();
        pageUpdate();

    })
