'use strict';
const angular = require('angular');
angular.module('shenmaApp').controller('driverAddCtrl', ($timeout, Upload, $scope, driverArchiveService, $stateParams, $filter, $state) => {
    //first-page
    $scope.driverId = $stateParams.driverId;
    if (!$scope.driverId) {
        $state.go('driverList');
    }
    $scope.driverBasicInfo = {};
    $scope.driverBasicInfo.cooperationAgreementLife = '';//合作协议有效期
    // 获取司机档案基本信息
    function getBasic() {
        driverArchiveService.getBasicInfo({
            id: $scope.driverId
        }).then((res) => {
            if (res.data.status == 'SUCCESS') {
                $scope.driverBasicInfo = res.data.data;
                if (res.data.data.idCardValidDate) {
                    $scope.driverBasicInfo.idCardValidDate = parseInt(res.data.data.idCardValidDate);
                }
                if ($scope.driverBasicInfo.probationPeriod != undefined) {
                    $scope.driverBasicInfo.probationPeriod = $scope.driverBasicInfo.probationPeriod.toString();
                }
                if ($scope.driverBasicInfo.laborContractValidPeriod != undefined) {
                    $scope.driverBasicInfo.laborContractValidPeriod = $scope.driverBasicInfo.laborContractValidPeriod.toString();
                }
                if ($scope.driverBasicInfo.bloodType != undefined) {
                    $scope.driverBasicInfo.bloodType = $scope.driverBasicInfo.bloodType.toString();
                }
                if ($scope.driverBasicInfo.politicsStatus != undefined) {
                    $scope.driverBasicInfo.politicsStatus = $scope.driverBasicInfo.politicsStatus.toString();
                }
                if ($scope.driverBasicInfo.maritalStatus != undefined) {
                    $scope.driverBasicInfo.maritalStatus = $scope.driverBasicInfo.maritalStatus.toString();
                }
                if ($scope.driverBasicInfo.fertilityStatus != undefined) {
                    $scope.driverBasicInfo.fertilityStatus = $scope.driverBasicInfo.fertilityStatus.toString();
                }
                if ($scope.driverBasicInfo.highestEducation != undefined) {
                    $scope.driverBasicInfo.highestEducation = $scope.driverBasicInfo.highestEducation.toString();
                }
                if($scope.driverBasicInfo.idCardFrontPic !=undefined) {
                    $scope.hadIdCardBackPic = true;
                }
                if($scope.driverBasicInfo.idCardBackPic !=undefined) {
                    $scope.hadIdCardFrontPic = true;
                }
                // 判断driverType 去决定是否显示合作协议有效期
                if ($scope.driverBasicInfo.cooperationAgreementLife) {
                    $scope.driverBasicInfo.cooperationAgreementLife = $scope.driverBasicInfo.cooperationAgreementLife.toString();
                }
                if ($scope.driverBasicInfo.mainBean.driverType == 1) {
                    $scope.driverTypeSelf = true;
                } else {
                    $scope.driverTypeSelf = false;
                }
            }
        });
    }

    $scope.active = 0;
    getBasic();
    // 返回driverList
    $scope.goToDriverList = () => {
        $state.go('driverList');
    };
    $scope.tabValue = 0;
    $scope.$watch('tabValue', (newValue, oldValue) => {
        if (newValue != oldValue) {
            $scope.active = parseInt(newValue);
            $scope.driverOtherInfo.drivingLicenceFirstPic = '';
            $scope.driverOtherInfo.drivingLicenceSecondPic = '';
            $scope.driverBasicInfo.idCardFrontPic = '';
            $scope.driverBasicInfo.idCardBackPic = '';
            $scope.hadDrivingLicenceFirstPic = false;
            $scope.hadDrivingLicenceSecondPic = false;
            $scope.hadIdCardFrontPic = false;
            $scope.hadIdCardBackPic = false;
            if (newValue == 0) {
                getBasic();
            }else if (newValue == 1) {
                getOtherInfo();
            }else if (newValue == 2) {
                getResume();
            }
        }
    });
    $scope.show = function () {

    };
    // 合同有效期
    driverArchiveService.validityOfContract().then((res) => {
        if (res.data.status == 'SUCCESS') {
            $scope.validityOfContractList = res.data.data;
        }
    });
    // 试用期时间
    driverArchiveService.probationPeriod().then((res) => {
        if (res.data.status == 'SUCCESS') {
            $scope.probationPeriodList = res.data.data;
        }
    });
    // 血型
    driverArchiveService.bloodType().then((res) => {
        if (res.data.status == 'SUCCESS') {
            $scope.bloodTypeList = res.data.data;
        }
    });
    // 政治面貌
    driverArchiveService.politicsStatus().then((res) => {
        if (res.data.status == 'SUCCESS') {
            $scope.politicsStatusList = res.data.data;
        }
    });
    // 籍贯
    driverArchiveService.allProvinceList().then((res) => {
        if (res.data.status == 'SUCCESS') {
            $scope.allProvinceLists = res.data.data;
        }
    });
    // 婚姻状况
    driverArchiveService.maritalStatus().then((res) => {
        if (res.data.status == 'SUCCESS') {
            $scope.maritalStatusList = res.data.data;
        }
    });
    // 最高学历
    driverArchiveService.education().then((res) => {
        if (res.data.status == 'SUCCESS') {
            $scope.educationList = res.data.data;
        }
    });
    // 生日
    $scope.popup1 = {
        opened: false
    };
    $scope.open1 = () => {
        $scope.popup1.opened = true;
    };
    // 身份证有效期
    $scope.popup2 = {
        opened: false
    };
    $scope.open2 = () => {
        $scope.popup2.opened = true;
    };
    // 居住证有效期
    $scope.popup3 = {
        opened: false
    };
    $scope.open3 = () => {
        $scope.popup3.opened = true;
    };
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
    $scope.$watch('driverBasicInfo.mainBean.birthday', (newBornDate, oldBornDate) => {
        if (newBornDate != oldBornDate) {
            const birthday = $filter('date')(newBornDate, 'yyyy-MM-dd');
            $scope.age = getYear(birthday);
        }
    });
    $scope.$watch('driverBasicInfo.mainBean.name', () => {
        if ($scope.driverBasicInfo.mainBean.name.indexOf(' ') == -1) {
            $scope.errorName = false;
        }else {
            $scope.errorName = true;
        }
    });
    $scope.$watch('driverBasicInfo.probationPeriod + driverBasicInfo.laborContractValidPeriod +' +
    'driverBasicInfo.mainBean.archiveCode + driverBasicInfo.mainBean.sex + driverBasicInfo.mainBean.birthday +'+
    'driverBasicInfo.mainBean.idCardNumber + driverBasicInfo.mainBean.nativePlace + driverBasicInfo.mainBean.name +'+
    'driverBasicInfo.cooperationAgreementLife',() => {
        if ($scope.driverBasicInfo.mainBean.driverType == 1) {
            if ($scope.driverBasicInfo.probationPeriod && $scope.driverBasicInfo.laborContractValidPeriod &&
                $scope.driverBasicInfo.mainBean.archiveCode && $scope.driverBasicInfo.mainBean.sex &&
                $scope.driverBasicInfo.mainBean.birthday && $scope.driverBasicInfo.mainBean.idCardNumber &&
                $scope.driverBasicInfo.mainBean.nativePlace && $scope.driverBasicInfo.mainBean.name && $scope.driverBasicInfo.mainBean.name.indexOf(' ') == -1) {
                $scope.saveBaseInfoBtn = false;
            }else {
                $scope.saveBaseInfoBtn = true;
            }
        } else {
            if ($scope.driverBasicInfo.cooperationAgreementLife &&
                $scope.driverBasicInfo.mainBean.archiveCode && $scope.driverBasicInfo.mainBean.sex &&
                $scope.driverBasicInfo.mainBean.birthday && $scope.driverBasicInfo.mainBean.idCardNumber &&
                $scope.driverBasicInfo.mainBean.nativePlace && $scope.driverBasicInfo.mainBean.name && $scope.driverBasicInfo.mainBean.name.indexOf(' ') == -1) {
                $scope.saveBaseInfoBtn = false;
            }else {
                $scope.saveBaseInfoBtn = true;
            }
        }

    },true);
    // 上传图片身份证正面照
    $scope.uploadIdFront = (file) => {
        if (file) {
            $scope.showAlert = true;
            $scope.alertType = 'warning';
            $scope.alertMsg = '身份证正面照上传中...';
            Upload.upload({
                url: '/api/file/uploadImg.do',
                file: file,
            }).then((res) => {
                file = '';
                if (res.data.status == 'SUCCESS') {
                    $scope.hadIdCardFrontPic = true;
                    $scope.driverBasicInfo.idCardFrontPic = res.data.data;
                    $scope.alertType = 'success';
                    $scope.alertMsg = '身份证正面照上传成功！';
                }else {
                    $scope.alertType = 'danger';
                    $scope.alertMsg = res.data.errorMsg;
                }
                $timeout(() => {
                    $scope.showAlert = false;
                }, 1500);
            });
        }
    };
    // 上传图片身份证背面照
    $scope.uploadIdBack = (file) => {
        if (file) {
            $scope.showAlert = true;
            $scope.alertType = 'warning';
            $scope.alertMsg = '身份证背面照上传中...';
            Upload.upload({
                url: '/api/file/uploadImg.do',
                file: file,
            }).then((res) => {
                file = '';
                if (res.data.status == 'SUCCESS') {
                    $scope.hadIdCardBackPic = true;
                    $scope.driverBasicInfo.idCardBackPic = res.data.data;
                    $scope.alertType = 'success';
                    $scope.alertMsg = '身份证背面照上传成功！';
                }else {
                    $scope.alertType = 'danger';
                    $scope.alertMsg = res.data.errorMsg;
                }
                $timeout(() => {
                    $scope.showAlert = false;
                }, 1500);
            });
        }
    };
    $scope.driverBasicInfo = {};
    $scope.driverBasicInfo.mainBean = {};
    $scope.driverBasicInfo.laborContractValidPeriod = '';
    $scope.driverBasicInfo.probationPeriod = '';
    $scope.saveBaseInfo = () => {
        $scope.showAlert = true;
        $scope.alertType = 'warning';
        $scope.alertMsg = '保存中...';
        $scope.driverBasicInfo.cooperationAgreementLife = parseInt($scope.driverBasicInfo.cooperationAgreementLife);
        // 处理时间格式
        $scope.driverBasicInfo.mainBean.birthday = new Date($scope.driverBasicInfo.mainBean.birthday).getTime();
        if ($scope.driverBasicInfo.idCardValidDate) {
            $scope.driverBasicInfo.idCardValidDate = new Date($scope.driverBasicInfo.idCardValidDate).getTime();
        }
        if ($scope.driverBasicInfo.residencePermitValidDate) {
            $scope.driverBasicInfo.residencePermitValidDate = new Date($scope.driverBasicInfo.residencePermitValidDate).getTime();
        }
        driverArchiveService.addDriverBaseInfo($scope.driverBasicInfo).then((res) => {
            if (res.data.status == 'SUCCESS') {
                $scope.alertType = 'success';
                $scope.alertMsg = '保存基本信息成功';
                $scope.tabValue = 1;
            } else {
                $scope.alertType = 'danger';
                $scope.alertMsg = res.data.errorMsg;
            }
            $timeout(() => {
                $scope.showAlert = false;
            }, 1500);
        });
    };
    $scope.$watch('driverOtherInfo.getCardTime', (newDate, oldDate) => {
        if (newDate != oldDate) {
            const drivingExperience = $filter('date')(newDate, 'yyyy-MM-dd');
            $scope.drivingExperience = getYear(drivingExperience);
        }
    });
    // second-page
    // 上传驾驶证主页
    $scope.uploadLicenseFront = (file) => {
        if (file) {
            $scope.showAlert = true;
            $scope.alertType = 'warning';
            $scope.alertMsg = '驾驶证主页照上传中...';
            Upload.upload({
                url: '/api/file/uploadImg.do',
                file: file,
            }).then((res) => {
                file = '';
                if (res.data.status == 'SUCCESS') {
                    $scope.hadDrivingLicenceFirstPic = true;
                    $scope.driverOtherInfo.drivingLicenceFirstPic = res.data.data;
                    $scope.alertType = 'success';
                    $scope.alertMsg = '驾驶证主页照上传成功！';
                } else {
                    $scope.alertType = 'danger';
                    $scope.alertMsg = res.data.errorMsg;
                }
                $timeout(() => {
                    $scope.showAlert = false;
                }, 1500);
            });
        }
    };
    // 上传驾驶证附页
    $scope.uploadLicenseBack = (file) => {
        if (file) {
            $scope.showAlert = true;
            $scope.alertType = 'warning';
            $scope.alertMsg = '驾驶证附页照上传中...';
            Upload.upload({
                url: '/api/file/uploadImg.do',
                file: file,
            }).then((res) => {
                file = '';
                if (res.data.status == 'SUCCESS') {
                    $scope.hadDrivingLicenceSecondPic = true;
                    $scope.driverOtherInfo.drivingLicenceSecondPic = res.data.data;
                    $scope.alertType = 'success';
                    $scope.alertMsg = '驾驶证附页照上传成功！';
                } else {
                    $scope.alertType = 'danger';
                    $scope.alertMsg = res.data.errorMsg;
                }
                $timeout(() => {
                    $scope.showAlert = false;
                }, 1500);
            });
        }
    };
    $scope.driverOtherInfo = {};
    $scope.driverOtherInfo.domesticRelation = 0;
    $scope.driverOtherInfo.companyRelations = [];
    function addFirstFamily () {
        $scope.driverOtherInfo.familyMembers = [];
        const familyMember = {
            relation: '',
            name: '',
            mobilePhone: '',
            workUnit: ''
        };
        $scope.driverOtherInfo.familyMembers.push(familyMember);
    }
    // 增删家庭成员
    $scope.addFamily = () => {
        const i = $scope.driverOtherInfo.familyMembers.length-1;
        if ($scope.driverOtherInfo.familyMembers[i].mobilePhone == '' &&
        $scope.driverOtherInfo.familyMembers[i].name == '' &&
        $scope.driverOtherInfo.familyMembers[i].relation == '' &&
        $scope.driverOtherInfo.familyMembers[i].workUnit == '') {
            $scope.showAlert = true;
            $scope.alertType = 'danger';
            $scope.alertMsg = '请填写上一个家庭成员，再进行添加';
            $timeout(() => {
                $scope.showAlert = false;
            }, 1500);
        } else {
            const data = {
                relation: '',
                name: '',
                mobilePhone: '',
                workUnit: ''
            };
            $scope.driverOtherInfo.familyMembers.push(data);
        }
    };
    $scope.delMember = (index) => {
        if ($scope.driverOtherInfo.familyMembers.length > 1) {
            $scope.driverOtherInfo.familyMembers.splice(index, 1);
        }
    };
    // 获取司机档案其他信息
    function getOtherInfo() {
        driverArchiveService.getDriverOtherInfo({
            id: $scope.driverId
        }).then((res) => {
            if (res.data.status == 'SUCCESS') {
                $scope.driverOtherInfo = res.data.data;
                if ($scope.driverOtherInfo.drivingLicenceType != undefined) {
                    $scope.driverOtherInfo.drivingLicenceType = $scope.driverOtherInfo.drivingLicenceType.toString();
                }
                if ($scope.driverOtherInfo.drivingLicenceValidDate != undefined) {
                    $scope.driverOtherInfo.drivingLicenceValidDate = parseInt($scope.driverOtherInfo.drivingLicenceValidDate);
                }
                if (!$scope.driverOtherInfo.domesticRelation) {
                    $scope.driverOtherInfo.domesticRelation = 0;
                }
                // 家庭成员列表
                if (res.data.data.familyMembers) {
                    $scope.driverOtherInfo.familyMembers = res.data.data.familyMembers;
                }else {
                    addFirstFamily();
                }
                if (res.data.data.companyRelations) {
                    for (var i = 0; i < res.data.data.companyRelations.length; i++) {
                        res.data.data.companyRelations[i].showSelect = false;
                    }
                    $scope.driverOtherInfo.companyRelations = res.data.data.companyRelations;
                } else {
                    // 增删亲属关系
                    $scope.driverOtherInfo.companyRelations = [];
                }
                if($scope.driverOtherInfo.drivingLicenceFirstPic !=undefined) {
                    $scope.hadDrivingLicenceFirstPic = true;
                }
                if($scope.driverOtherInfo.drivingLicenceSecondPic !=undefined) {
                    $scope.hadDrivingLicenceSecondPic = true;
                }
                if ($scope.driverOtherInfo.domesticRelation == 1) {
                    $scope.showHaveOnDuty = true;
                }else {
                    $scope.showHaveOnDuty = false;
                }
            }
        });
        // 获取驾照类型
        driverArchiveService.driverLicense().then((res) => {
            if (res.data.status == 'SUCCESS') {
                $scope.driverLicenseList = res.data.data;
            }
        });
    }



    // 驾驶证领证时间
    $scope.popup4 = {
        opened: false
    };
    $scope.open4 = () => {
        $scope.popup4.opened = true;
    };
    // 驾驶证到期时间
    $scope.popup5 = {
        opened: false
    };
    $scope.open5 = () => {
        $scope.popup5.opened = true;
    };

    // 是否有亲属在职
    $scope.showOnDuty = () => {
        $scope.showHaveOnDuty = true;
    };
    $scope.hideOnDuty = () => {
        $scope.showHaveOnDuty = false;
    };
    // 增删亲属关系
    $scope.addRelationMember = () => {
        const data = {
            driverArchiveId: '',
            name: '',
            relation: '',
            firstLevelDepartment: '',
            secondLevelDepartment: '',
            employeeNumber: '',
            showSelect: false
        };
        $scope.driverOtherInfo.companyRelations.push(data);
    };
    $scope.delWorkMember = (index) => {
        $scope.driverOtherInfo.companyRelations.splice(index, 1);
    };

    // 查询是否有亲属在公司
    $scope.checkEmployee = (index,name) => {
        $scope.choiceMemberIndex = index;
        $scope.driverOtherInfo.companyRelations[index].showSelect = true;
        driverArchiveService.getRelationEmployee({
            name: name
        }).then((res) => {
            $scope.searchRelationsList = res.data.data;
        });
    };
    $scope.choiceMember = (item) => {
        $scope.driverOtherInfo.companyRelations[$scope.choiceMemberIndex].firstLevelDepartment = item.firstPartName;
        $scope.driverOtherInfo.companyRelations[$scope.choiceMemberIndex].secondLevelDepartment = item.nextPartName;
        $scope.driverOtherInfo.companyRelations[$scope.choiceMemberIndex].employeeNumber = item.jobNo;
    };
    $scope.$watch('driverOtherInfo.drivingLicenceType + driverOtherInfo.getCardTime +' +
    'driverOtherInfo.drivingLicenceNumber + driverOtherInfo.drivingLicenceValidDate +'+
    'driverOtherInfo.drivingLicenceFirstPic + driverOtherInfo.drivingLicenceSecondPic',() => {
        if ($scope.driverOtherInfo.drivingLicenceType && $scope.driverOtherInfo.getCardTime &&
            $scope.driverOtherInfo.drivingLicenceNumber && $scope.driverOtherInfo.drivingLicenceValidDate &&
            $scope.driverOtherInfo.drivingLicenceSecondPic && $scope.driverOtherInfo.drivingLicenceFirstPic) {
            $scope.saveOtherInfoBtn = false;
        }else {
            $scope.saveOtherInfoBtn = true;
        }
    },true);
    // 保存其他信息
    $scope.saveOtherInfo = () => {
        $scope.showAlert = true;
        $scope.alertType = 'warning';
        $scope.alertMsg = '保存中...';
        // 处理时间
        $scope.driverOtherInfo.getCardTime = new Date($scope.driverOtherInfo.getCardTime).getTime();
        $scope.driverOtherInfo.drivingLicenceValidDate = new Date($scope.driverOtherInfo.drivingLicenceValidDate).getTime();
        driverArchiveService.addDriverOtherInfo($scope.driverOtherInfo).then((res) => {
            if (res.data.status == 'SUCCESS') {
                $scope.alertType = 'success';
                $scope.alertMsg = '保存基本信息成功';
                $scope.tabValue = 2;
            }else {
                $scope.alertType = 'danger';
                $scope.alertMsg = res.data.errorMsg;
            }
            $timeout(() => {
                $scope.showAlert = false;
            }, 1500);
        });
    };

    // third-page
    const requestData = {
        driverArchiveId: $scope.driverId,
        workUnit: '',
        workTimeStart: '',
        workTimeEnd: '',
        position: '',
        monthlySalary: '',
        certifier: '',
        mobilePhone: '',
        leaveReason: '',
        openedStart: false,
        openedEnd: false
    };
    $scope.jobList = [];
    $scope.jobList.push(requestData);
    $scope.openWorkStart = (index) => {
        $scope.jobList[index].openedStart = true;
    };
    $scope.openWorkEnd = (index) => {
        $scope.jobList[index].openedEnd = true;
    };
    // 增加工作履历
    $scope.addJob = () => {
        if ($scope.jobList[$scope.jobList.length - 1].workUnit == '' &&
            $scope.jobList[$scope.jobList.length - 1].workTimeStart == '' &&
            $scope.jobList[$scope.jobList.length - 1].workTimeEnd == '' &&
            $scope.jobList[$scope.jobList.length - 1].position == '' &&
            $scope.jobList[$scope.jobList.length - 1].monthlySalary == '' &&
            $scope.jobList[$scope.jobList.length - 1].certifier == '' &&
            $scope.jobList[$scope.jobList.length - 1].mobilePhone == '' &&
            $scope.jobList[$scope.jobList.length - 1].leaveReason == '') {
            $scope.showAlert = true;
            $scope.alertType = 'danger';
            $scope.alertMsg = '请填写上一份履历，再进行添加';
            $timeout(() => {
                $scope.showAlert = false;
            }, 1500);
        } else {
            let requestData = {
                driverArchiveId: $scope.driverId,
                workUnit: '',
                workTimeStart: '',
                workTimeEnd: '',
                position: '',
                monthlySalary: '',
                certifier: '',
                mobilePhone: '',
                leaveReason: ''
            };
            $scope.jobList.push(requestData);
        }
    };
    // 获取工作履历
    function getResume() {
        driverArchiveService.getDriverResume({
            id: $scope.driverId
        }).then((res) => {
            if (res.data.status == 'SUCCESS') {
                if (res.data.data) {
                    $scope.jobList = res.data.data;
                    for (let i = 0; i < $scope.jobList.length; i++) {
                        $scope.jobList[i].workTimeStart = new Date($scope.jobList[i].workTimeStart);
                        $scope.jobList[i].workTimeEnd = new Date($scope.jobList[i].workTimeEnd);
                    }
                }
            }
        });
    }
    // 删除工作履历
    $scope.delJob = (index) => {
        $scope.jobList.splice(index, 1);
        if ($scope.jobList.length == '0') {
            let requestData = {
                driverArchiveId: $scope.driverId,
                workUnit: '',
                workTimeStart: '',
                workTimeEnd: '',
                position: '',
                monthlySalary: '',
                certifier: '',
                mobilePhone: '',
                leaveReason: ''
            };
            $scope.jobList.push(requestData);
        }
    };
    // save工作履历
    $scope.saveResume = () => {
        $scope.showAlert = true;
        $scope.alertType = 'warning';
        $scope.alertMsg = '保存中...';
        // 处理时间格式
        for (let i = 0; i < $scope.jobList.length; i++) {
            $scope.jobList[i].workTimeStart = new Date($scope.jobList[i].workTimeStart).getTime();
            $scope.jobList[i].workTimeEnd = new Date($scope.jobList[i].workTimeEnd).getTime();
        }
        driverArchiveService.addDriverJobResume($scope.jobList).then((res) => {
            if (res.data.status == 'SUCCESS') {
                $scope.alertType = 'success';
                $scope.alertMsg = '保存工作履历成功';
                $scope.tabValue = 0;
            } else {
                $scope.alertType = 'danger';
                $scope.alertMsg = res.data.errorMsg;
            }
            $timeout(() => {
                $scope.showAlert = false;
            }, 1500);
        });
    };
});
