'use strict';
const angular = require('angular');
angular.module('shenmaApp').controller('driverListCtrl', ($timeout, $http, $state, $scope, $filter, driverArchiveService) => {
    // 权限城市
    driverArchiveService.cityList().then((res) => {
        if (res.data.status == 'SUCCESS') {
            $scope.cityList = res.data.data;
            if ($scope.cityList.length <= 1) {
                $scope.onlyOneSelect = true;
            }
            $scope.checkOnJobData.cityId = res.data.data[0].id.toString();
        }
    });
    $scope.showMore = () => {
        $scope.showMoreSearch = !$scope.showMoreSearch;
        $scope.checkOnJobData.personnel = '-1';
        $scope.checkOnJobData.archive = '';
        $scope.checkOnJobData.province = '';
        $scope.checkOnJobData.sex = '';
        $scope.checkOnJobData.driverType = '';
        $scope.checkOnJobData.inductionStart = '';
        $scope.checkOnJobData.inductionEnd = '';
        $scope.checkOnJobData.bornStart = '';
        $scope.checkOnJobData.bornEnd = '';
    };
    // 在职列表
    $scope.active = 0;
    // 查询条件初始化
    //初始化入职时间
    $scope.popup1 = {
        opened: false
    };
    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };
    $scope.popup2 = {
        opened: false
    };
    $scope.open2 = function() {
        $scope.popup2.opened = true;
    };
    $scope.popup3 = {
        opened: false
    };
    $scope.open3 = function() {
        $scope.popup3.opened = true;
    };
    $scope.popup4 = {
        opened: false
    };
    $scope.open4 = function() {
        $scope.popup4.opened = true;
    };
    $scope.popup5 = {
        opened: false
    };
    $scope.open5 = function() {
        $scope.popup5.opened = true;
    };
    $scope.popup6 = {
        opened: false
    };
    $scope.open6 = function() {
        $scope.popup6.opened = true;
    };
    // 人事状态
    // $scope.personnel = '-1';
    // 档案状态
    $scope.archiveStatusQuery = driverArchiveService.archiveStatus();
    $scope.archiveStatusQuery.then((res) => {
        if (res.data.status == 'SUCCESS') {
            $scope.archiveStatusList = res.data.data;
        }
    });
    // 籍贯
    $scope.allProvinceListQuery = driverArchiveService.allProvinceList();
    $scope.allProvinceListQuery.then((res) => {
        if (res.data.status == 'SUCCESS') {
            $scope.allProvinceList = res.data.data;
        }
    });
    // 在职司机分页
    $scope.bigCurrentPage = 1;
    $scope.maxSize = 5;
    $scope.pageSize = 20;
    // 在职司机list
    $scope.checkOnJobData = {
        personnel: '-1',
        archive: '',
        province: '',
        sex: '',
        driverType: '',
        inductionStart: '',
        inductionEnd: '',
        bornStart: '',
        bornEnd: '',
        cityId: '',
        employeeName: '',
        employeeNumber: ''
    };
    function onJob() {
        $scope.loadingText = '数据正在加载中...';
        $scope.loadingImg = true;
        $scope.jobingListData = {
            page: $scope.bigCurrentPage,
            rows: $scope.pageSize,
            tabIndex: 0,
            personnelStatus: 0,
            archiveStatus: $scope.checkOnJobData.archive,
            nativePlace: $scope.checkOnJobData.province,
            driverType: $scope.checkOnJobData.driverType,
            sex: $scope.checkOnJobData.sex,
            hireDateStart: new Date($scope.checkOnJobData.inductionStart).getTime(),
            hireDateEnd: new Date($scope.checkOnJobData.inductionEnd).getTime() + 86399999,
            birthdayStart: new Date($scope.checkOnJobData.bornStart).getTime(),
            birthdayEnd: new Date($scope.checkOnJobData.bornEnd).getTime() + 86399999,
            workCityId: $scope.checkOnJobData.cityId
        };
        $scope.jobingListQuery = driverArchiveService.jobingList($scope.jobingListData);
        $scope.jobingListQuery.then((res) => {
            if (res.data.status == 'SUCCESS') {
                $scope.jobingList = res.data.data.rows;
                if ($scope.jobingList.length == 0) {
                    $scope.loadingText = '您查询的条件没有对应员工，请修改查询条件';
                }else {
                    $scope.loadingImg = false;
                    $scope.showTable = true;
                }
                $scope.bigTotalItems = res.data.data.total;
                $scope.total1 = res.data.data.total;
                $scope.numPages = res.data.data.totalPages;
                $scope.jobingList.forEach((item) => {
                    if (item.personnelStatus == '0' && item.archiveStatus == '0') {
                        item.showDetail = false;
                    } else {
                        item.showDetail = true;
                    }
                });
            }else {
                $scope.loadingText = '数据查询失败';
            }
        });
    }
    $scope.$watch('checkOnJobData.cityId', (newCode, oldeCode) => {
        if (newCode && newCode != oldeCode) {
            onJob();
            departed();
            departing();
        }
    });
    // 翻页
    $scope.changeOnJobList = (bigCurrentPage) => {
        $scope.showTable = false;
        $scope.loadingImg = true;
        $scope.bigCurrentPage = bigCurrentPage;
        onJob();
    };
    $scope.showAlert = false;
    $scope.download = () => {
        if (!$scope.bornStart) {
            $scope.born1 = '';
        }else {
            $scope.born1 = new Date($scope.checkOnJobData.bornStart).getTime();
        }
        if (!$scope.bornEnd) {
            $scope.born2 = '';
        } else {
            $scope.born2 = parseInt(new Date($scope.checkOnJobData.bornEnd).getTime() + 86399999);
        }
        if (!$scope.inductionStart) {
            $scope.induction1 = '';
        } else {
            $scope.induction1 = new Date($scope.checkOnJobData.inductionStart).getTime();
        }
        if (!$scope.inductionStart) {
            $scope.induction2 = '';
        } else {
            $scope.induction2 = parseInt(new Date($scope.checkOnJobData.inductionEnd).getTime() + 86399999);
        }
        if (!$scope.province) {
            $scope.province = '';
        }
        if (!$scope.driverType) {
            $scope.driverType = '';
        }
        if (!$scope.personnel) {
            $scope.personnel = '';
        }
        if (!$scope.sex) {
            $scope.sex = '';
        }
        if (!$scope.archive) {
            $scope.archive = '';
        }
        const downloadData = {
            tabIndex: '0',
            personnelStatus: $scope.checkOnJobData.personnel,
            archiveStatus: $scope.checkOnJobData.archive,
            nativePlace: $scope.checkOnJobData.province,
            driverType: $scope.checkOnJobData.driverType,
            sex: $scope.checkOnJobData.sex,
            hireDateStart: $scope.induction1,
            hireDateEnd: $scope.induction2,
            birthdayStart: $scope.born1,
            birthdayEnd: $scope.born2,
            workCityId: $scope.checkOnJobData.cityId,
        };
        $scope.downloadQuery = driverArchiveService.downLoad(downloadData);
        $scope.downloadQuery.then(() => {
            $scope.showAlert = true;
            $scope.alertMsg = '请到文件下载管理页面下载需要的文件';
            $timeout(() => {
                $scope.showAlert = false;
            }, 1500);
        });
        // window.open('http://10.28.13.71:8095/driverArchive/exportOnJobDrivers.do?' + downloadParameter);
        // window.open('https://erpweb.vvip-u.com/driverArchive/exportOnJobDrivers.do?' + downloadParameter);
    };
    // 查询
    $scope.checkOnJob = () => {
        $scope.showTable = false;
        $scope.loadingImg = true;
        onJob();
    };
    // 综合查询
    $scope.searchCondition = () => {
        $scope.loadingText = '数据正在加载中...';
        $scope.loadingImg = true;
        $scope.jobingListData = {
            page: 1,
            rows: 20,
            tabIndex: 1,
            workCityId: $scope.checkOnJobData.cityId,
            mutiCondition: $scope.checkOnJobData.mutiCondition
        };
        driverArchiveService.jobingList($scope.jobingListData).then((res) => {
            if (res.data.status == 'SUCCESS') {
                $scope.jobingList = res.data.data.rows;
                if ($scope.jobingList.length == 0) {
                    $scope.loadingText = '您查询的条件没有对应员工，请修改查询条件';
                }else {
                    $scope.loadingImg = false;
                    $scope.showTable = true;
                }
                $scope.bigTotalItems = res.data.data.total;
                $scope.jobingList.forEach((item, index) => {
                    if (item.personnelStatus == '0' && item.archiveStatus == '0') {
                        item.showDetail = false;
                    } else {
                        item.showDetail = true;
                    }
                });
            }else {
                $scope.loadingText = '数据查询失败';
            }
        });
    };
    // 离职司机list
    $scope.bigCurrentPage2 = 1;
    $scope.pageSize2 = 20;

    function departed() {
        $scope.loadingImg2 = true;
        $scope.loadingText2 = '数据正在加载中...';
        $scope.showTable2 = false;
        $scope.departedListData = {
            personnelStatus: '2',
            workCityId: $scope.checkOnJobData.cityId,
            page: $scope.bigCurrentPage2,
            rows: $scope.pageSize2,
            name: $scope.checkOnJobData.employeeName,
            mobilePhone: $scope.checkOnJobData.employeeNumber
        };
        $scope.departedListQuery = driverArchiveService.departedList($scope.departedListData);
        $scope.departedListQuery.then((res) => {
            if (res.data.status == 'SUCCESS') {
                $scope.bigTotalItems2 = res.data.data.total;
                $scope.numPages2 = res.data.data.totalPages;
                $scope.departedList = res.data.data.rows;
                if ($scope.departedList.length == 0) {
                    $scope.loadingText2 = '您查询的条件没有对应员工，请修改查询条件';
                }else {
                    $scope.loadingImg2 = false;
                    $scope.showTable2 = true;
                }
            }else {
                $scope.loadingText2 = '数据查询失败';
            }
        });
    }
    $scope.changeDepartedList = (bigCurrentPage2) => {
        $scope.bigCurrentPage2 = bigCurrentPage2;
        departed();
    };
    $scope.checkDeparted = () => {
        departed();
    };
    $scope.downloaddeparted = () => {
        const downloadData = {
            personnelStatus: '2',
            workCityId: $scope.checkOnJobData.cityId,
            name: $scope.checkOnJobData.employeeName,
            mobilePhone: $scope.checkOnJobData.employeeNumber
        };
        $scope.downloadQuery = driverArchiveService.downloaddeparted(downloadData);
        $scope.downloadQuery.then(() => {
            $scope.showAlert = true;
            $scope.alertMsg = '请到文件下载管理页面下载需要的文件';
            $timeout(() => {
                $scope.showAlert = false;
            }, 1500);
        });
    };
    // 离职申请中员工
    $scope.bigCurrentPage3 = 1;
    $scope.pageSize3 =20;
    $scope.checkDepartingData = {};
    function departing() {
        $scope.loadingText3 = '数据正在加载中...';
        $scope.loadingImg3 = true;
        $scope.showTable3 = false;
        $scope.departingListData = {
            page: $scope.bigCurrentPage3,
            rows: $scope.pageSize3,
            personnelStatus: 1,
            appResignationTimeStart: new Date($scope.checkDepartingData.startTime).getTime(),
            appResignationTimeEnd: new Date($scope.checkDepartingData.endTime).getTime() + 86399999,
            workCityId: $scope.checkOnJobData.cityId,
            name: $scope.checkDepartingData.employeeName,
            mobilePhone: $scope.checkDepartingData.employeeNumber
        };
        $scope.departingListQuery = driverArchiveService.jobingList($scope.departingListData);
        $scope.departingListQuery.then((res) => {
            if (res.data.status == 'SUCCESS') {
                $scope.departingList = res.data.data.rows;
                if ($scope.departingList.length == 0) {
                    $scope.loadingText = '您查询的条件没有对应员工，请修改查询条件';
                    $scope.showTable3 = false;
                }else {
                    $scope.loadingImg3 = false;
                    $scope.showTable3 = true;
                }
                $scope.bigTotalItems3 = res.data.data.total;
                $scope.numPages = res.data.data.totalPages;
                $scope.departingList.forEach((item) => {
                    if (item.personnelStatus == '0' && item.archiveStatus == '0') {
                        item.showDetail = false;
                    } else {
                        item.showDetail = true;
                    }
                });
            }else {
                $scope.loadingText = '数据查询失败';
            }
        });
    }
    $scope.checkDeparting = () => {
        departing();
    };
    $scope.changeDepartingList = (bigCurrentPage3) => {
        $scope.bigCurrentPage3 = bigCurrentPage3;
        departing();
    };
});
