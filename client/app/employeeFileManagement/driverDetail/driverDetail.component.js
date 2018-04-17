'use strict';
const angular = require('angular');
angular.module('shenmaApp').controller('driverDetailCtrl', ($filter, $timeout, $state, $scope, $uibModal, $stateParams, driverArchiveService) => {
    // 计算年龄
    function getYear(str) {
        var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
        if (r == null) return false;
        var d = new Date(r[1], r[3] - 1, r[4]);
        if (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]) {
            var Y = new Date().getFullYear();
            return  Y - r[1] + 1;
        }
    }
    $scope.resignationBtn = true;
    $scope.$watch('resignationTime', (newTime, oldTime) => {
        if ($scope.resignationTime) {
            $scope.resignationBtn = false;
        } else {
            $scope.resignationBtn = true;
        }
    });
    $scope.canModify = true;
    $scope.backToList = () => {
        $state.go('driverList');
    };
    $scope.driverBasicInfo = {};
    // 获取司机档案id
    $scope.driverId = $stateParams.driverId;
    if (!$scope.driverId) {
        // $state.go('driverList');
    }

    // 获取司机档案基本信息
    driverArchiveService.getBasicInfo({
        id: $scope.driverId
    }).then((res) => {
        if (res.data.status == 'SUCCESS') {
            $scope.driverBasicInfo = res.data.data;
            // 判断是否离职
            if (res.data.data.mainBean.personnelStatus == '2') {
                $scope.departed = true;
            } else {
                $scope.departed = false;
            }
            // 工作动态
            driverArchiveService.getDriverWorkStatus({
                jobNumber: $scope.driverBasicInfo.mainBean.jobNumber
            }).then((res) => {
                if (res.data.status == 'SUCCESS') {
                    $scope.jobStatusList = res.data.data;
                }
            });
            // 计算预计转正时间和合同到期时间
            const dueTime = new Date($scope.driverBasicInfo.mainBean.hireDate);
            if ($scope.driverBasicInfo.cooperationAgreementLife) {
                $scope.dueTime = dueTime.getFullYear() + $scope.driverBasicInfo.cooperationAgreementLife + '-' + parseFloat(dueTime.getMonth() + 1) + '-' + $filter('date')(dueTime, 'dd');
            }
            // const dueTime = new Date(1504195200000);
            const dueTimeMonth = '-' + parseFloat(dueTime.getMonth()+ 1) + '-' + dueTime.getDate();
            if ($scope.driverBasicInfo.laborContractValidPeriod == '0') {
                $scope.dueTime = dueTime.getFullYear()+ 1 + dueTimeMonth;
            } else if ($scope.driverBasicInfo.laborContractValidPeriod == '1'){
                $scope.dueTime = dueTime.getFullYear()+ 2 + dueTimeMonth;
            } else if ($scope.driverBasicInfo.laborContractValidPeriod == '2'){
                $scope.dueTime = dueTime.getFullYear()+ 3 + dueTimeMonth;
            } else if ($scope.driverBasicInfo.laborContractValidPeriod == '3'){
                $scope.dueTime = dueTime.getFullYear()+ 5 + dueTimeMonth;
            } else if ($scope.driverBasicInfo.laborContractValidPeriod == '4'){
                $scope.dueTime = dueTime.getFullYear()+ 10 + '-' + dueTimeMonth;
            }
            if ($scope.driverBasicInfo.probationPeriod == '0') {
                if (parseFloat(dueTime.getMonth()+ 2) > 12) {
                    $scope.turnTime = new Date(dueTime.getFullYear() + 1 + '-' + parseFloat(dueTime.getMonth() - 10) + '-' + dueTime.getDate()).getTime() - 86400000;
                }else {
                    $scope.turnTime = new Date(dueTime.getFullYear() + '-' + parseFloat(dueTime.getMonth()+ 2) + '-' + dueTime.getDate()).getTime() - 86400000;
                }
            }else if ($scope.driverBasicInfo.probationPeriod == '1') {
                if (parseFloat(dueTime.getMonth()+ 4) > 12) {
                    $scope.turnTime = new Date(dueTime.getFullYear() + 1 + '-' + parseFloat(dueTime.getMonth() - 8) + '-' + dueTime.getDate()).getTime() - 86400000;
                }else {
                    $scope.turnTime = new Date(dueTime.getFullYear() + '-' + parseFloat(dueTime.getMonth()+ 4) + '-' + dueTime.getDate()).getTime() - 86400000;
                }
            }else if ($scope.driverBasicInfo.probationPeriod == '2') {
                if (parseFloat(dueTime.getMonth()+ 7) > 12) {
                    $scope.turnTime = new Date(dueTime.getFullYear() + 1 + '-' + parseFloat(dueTime.getMonth() - 5 ) + '-' + dueTime.getDate()).getTime() - 86400000;
                }else {
                    $scope.turnTime = new Date(dueTime.getFullYear() + '-' + parseFloat(dueTime.getMonth() + 7) + '-' + dueTime.getDate()).getTime() - 86400000;
                }
            }
            if (res.data.data.mainBean.personnelStatus == '1') {
                // 离职申请中
                $scope.quitBox = true;
                $scope.hideFixed = true;
            } else if (res.data.data.mainBean.personnelStatus == '2') {
                // 已离职
                $scope.hideFixed = true;
            } else {
                $scope.quitBox = false;
                $scope.hideFixed = false;
            }
        }
        if (res.data.data.mainBean.birthday) {
            const birthday = $filter('date')($scope.driverBasicInfo.mainBean.birthday, 'yyyy-MM-dd');
            $scope.age = getYear(birthday);
        }else {
            $scope.age = '- -';
        }
    });
    // 获取司机档案其他信息
    driverArchiveService.getDriverOtherInfo({
        id: $scope.driverId
    }).then((res) => {
        if (res.data.status == 'SUCCESS') {
            $scope.driverOtherInfo = res.data.data;
            if ($scope.driverOtherInfo.getCardTime) {
                const driverLicenseDay = $filter('date')($scope.driverOtherInfo.getCardTime, 'yyyy-MM-dd');
                $scope.driverYear = getYear(driverLicenseDay);
            }else {
                $scope.driverYear = '- -';
            }
            // 家庭成员列表
            $scope.driverOtherInfo.familyMembers = res.data.data.familyMembers;
        }
    });
    // 获取工作履历
    driverArchiveService.getDriverResume({
        id: $scope.driverId
    }).then((res) => {
        if (res.data.status == 'SUCCESS') {
            $scope.jobList = res.data.data;
        }
    });
    $scope.openDetail = true;
    $scope.showBaseInfo = true;
    $scope.switchDetail = () => {
        $scope.openDetail = !$scope.openDetail;
        $scope.showBaseInfo = !$scope.showBaseInfo;
    };
    $scope.openStatus = false;
    $scope.showStatus = false;
    $scope.switchJobStatus = () => {
        $scope.openStatus = !$scope.openStatus;
        $scope.showStatus = !$scope.showStatus;
    };
    // 查看图片
    $scope.showIdCard = (title) => {
        const data = {
            title: title,
            picFront: '',
            picBack: ''
        };
        if (title == 'id') {
            if (typeof $scope.driverBasicInfo.idCardFrontPic == 'undefined') {
                $scope.driverBasicInfo.idCardFrontPic = '';
            }
            if (typeof $scope.driverBasicInfo.idCardBackPic == 'undefined') {
                $scope.driverBasicInfo.idCardBackPic = '';
            }
            data.picFront = $scope.driverBasicInfo.idCardFrontPic;
            data.picBack = $scope.driverBasicInfo.idCardBackPic;
        } else {
            data.picFront = $scope.driverOtherInfo.drivingLicenceFirstPic;
            data.picBack = $scope.driverOtherInfo.drivingLicenceSecondPic;
        }
        $uibModal.open({
            animate: true,
            templateUrl: 'pictureViewModal.html',
            controller: 'pictureViewCtrl',
            size: 'lg',
            resolve: {
                data: () => {
                    return data;
                }
            }
        });
    };
    // 是否存在亲属关系
    $scope.showRelation = true;

    // 确认离职
    $scope.popup = {
        opened: false
    };
    $scope.open = () => {
        $scope.popup.opened = true;
    };
    $scope.makeSureQuit = () => {
        $scope.showAlert = true;
        $scope.quitMsg = {
            id: $scope.driverId,
            jobNumber: $scope.driverBasicInfo.mainBean.jobNumber,
            resignationTime: new Date($scope.resignationTime).getTime()
        };
        driverArchiveService.confirmLeave($scope.quitMsg).then((res) => {
            if (res.data.status == 'SUCCESS') {
                $scope.alertType = 'success';
                $scope.alertMsg = '离职成功！';
                $timeout(() => {
                    $state.go('driverList');
                },2000)
            } else {
                $scope.alertType = 'danger';
                if (res.data.errorMsg) {
                    $scope.alertMsg = res.data.errorMsg;
                } else {
                    $scope.alertMsg = '离职失败！';
                }
            }
            $timeout(() => {
                $scope.showAlert = false;
            }, 1000);
        });
    };
})
.controller('pictureViewCtrl', (data, $scope) => {
    if (data.title == 'id') {
        $scope.picTitle1 = '身份证正面';
        $scope.picTitle2 = '身份证正面';
        $scope.picFront = data.picFront;
        $scope.picBack = data.picBack;
    } else {
        $scope.picTitle1 = '驾驶证主页';
        $scope.picTitle2 = '驾驶证附页';
        $scope.picFront = data.picFront;
        $scope.picBack = data.picBack;
    }

});
