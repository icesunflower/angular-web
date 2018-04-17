'use strict';

import templateBomb from './../bombBox/bombBox.template.html';

angular.module('shenmaApp').controller('addWeeklyInspectionCtrl', ($scope, $uibModal, $state, $stateParams, $filter, weeklyInspectionService, accidentService, Upload) => {

    $scope.weeklyCarNo = $stateParams.carNo;
    $scope.addweeklyType = true;
    const nowDate = new Date();
    $scope.newfillin = {
        rummagerName: null,
        testingTime: nowDate,
        insuranceDes: null,
        checkDes: null
    };
    $scope.ifRemaks = true;
    $scope.inspectType = true;
    //新增维修处理数据
    $scope.repairType = false;
    $scope.repairHandle = {
        repairId: null,
        totalAmount: null,
        driverAmount: null,
        companyAmount: null,
        otherAmount: null,
        otherUnderTaker: null,
        repairRemark: null
    }
    $scope.sendData = {
        repairDate: null,
        repairAddress: null
    }
    $scope.imgPreservation = false;
    // $scope.repairPreservation = false;
    //编辑新增车损，第一页
    $scope.ifcanEdit = true;
    //复选框
    $scope.selTitle = {
        insurc: '证照保险',
        checkP: '运行检查',
        lossList: '车身车损情况（如之前周检已经记录，请勿重复勾选）'
    };
    $scope.singleData = {
        title: '维修处理',
        remarks: ''
    };
    //弹框
    $scope.damagedPhotos = () => {
        weeklyInspectionService.weeklydetQuery('/api/departmentCheck/queryMalfunctionPicsByCarNo.do', {
            'carNo': $scope.weeklyCarNo
        }).then((res) => {
            const damageImgList = res.data.data;
            opendamageImg(damageImgList);
        });
    }

    function opendamageImg(data) {
        $uibModal.open({
            size: 'md',
            template: `
                <div>
                    <div class="modal-header">
                        <h4 class="modal-title" style="text-align:center;">车损图片
                            <span type="button" ng-click="$dismiss()" style="float:right;position:relative;top:3px;right:10px;cursor:pointer;">
                                <span>X</span>
                            </span>
                        </h4>
                    </div>
                    <div class="modal-body" style="max-height:500px;overflow-y:scroll;">
                        <div>
                            <h4>故障：</h4>
                            <div ng-repeat="item in showdamageImg.malfunction">
                                <h5>{{item.categoryName}}：</h5>
                                <img ng-repeat="itemImg in item.pics" ng-src={{itemImg.picUrl}} alt="" class="img-thumbnail" style="width:80px;height:80px;margin-left:15px;">
                            </div>
                        </div>
                        <div>
                            <h4>月检：</h4>
                            <div ng-repeat="item in showdamageImg.weeklyCheck">
                                <h5>{{item.categoryName}}：</h5>
                                <img ng-repeat="itemImg in item.pics" ng-src={{itemImg.picUrl}} alt="" class="img-thumbnail" style="width:80px;height:80px;margin-left:15px;">
                            </div>
                        </div>
                        <div>
                            <h4>事故：</h4>
                            <div ng-repeat="item in showdamageImg.accident">
                                <h5>事故发生时间：{{item.reportDate}}</h5>
                                <img ng-repeat="itemImg in item.pics" ng-src={{itemImg.picUrl}} alt="" class="img-thumbnail" style="width:80px;height:80px;margin-left:15px;">
                            </div>
                        </div>
                    </div>
                </div>`,
            controller: ($scope) => {
                $scope.showdamageImg = data;
            }
        });
    }

    //获取新增信息
    function addInfo() {
        weeklyInspectionService.weeklydetQuery('/api/departmentCheck/getBaseInfo.do', {
            'carNo': $scope.weeklyCarNo
        }).then((res) => {
            $scope.addInfoData = res.data.data;
        });
    }
    addInfo();

    function updateAddInfo(type) {
        const readdInfoData = angular.extend({}, $scope.addInfoData, $scope.newfillin);
        if (!readdInfoData.rummagerName) {
            alert('检查人不能为空');
            return false;
        }
        if (!readdInfoData.testingTime) {
            alert('本次月检时间不能为空');
            return false;
        }
        const updateAddData = {
            carNo: $scope.weeklyCarNo,
            carId: readdInfoData.carId,
            carTypeName: readdInfoData.carTypeName,
            fleetId: readdInfoData.fId,
            fleetName: readdInfoData.fleetName,
            rummagerName: readdInfoData.rummagerName,
            rummagerPhone: null,
            testingTime: readdInfoData.testingTime,
            insuranceProblems: readdInfoData.insuranceList,
            insuranceDes: readdInfoData.insuranceDes,
            checkProblems: readdInfoData.checkList,
            checkDes: readdInfoData.checkDes
        };
        weeklyInspectionService.weeklyBasicUpload('/api/departmentCheck/addBaseInfo.do', updateAddData).then((res) => {
            // 跳转
            if (res.data.status == "SUCCESS") {
                if (type == 0) {
                    $state.go('vehicleList.inspectionDetail', {
                        carNo: $scope.weeklyCarNo
                    });
                } else {
                    $scope.addweeklyType = false;
                    $scope.inspectType = false;
                    $scope.weeklyId = res.data.data.id;
                }
            } else {
                alert('保存失败');
            }
        });
    }
    //保存基本信息（第一页）
    $scope.updataInfo = () => {
        updateAddInfo(0);
    }
    $scope.newupdataInfo = () => {
        updateAddInfo(1);
    }

    //第二页
    //点击多选
    $scope.losschecked = [];
    $scope.losscheckedData = {};
    $scope.forchecchange = (who) => {
        let flag = false,
            id = who.id;
        if ($scope.losschecked.length) {
            $scope.losschecked[0].isTab = false;
        }
        if (who.checked) {
            $scope.losschecked.push(who);
            $scope.losscheckedData[id] = {
                basicinfoEdit: true,
                imgArr: [],
                repairId: 0,
                repairType: false,
                imgPreservation: true,
                repairTypeName: "暂缓维修"
            };
        } else {
            angular.forEach($scope.losschecked, (item, key) => {
                if (id == item.id) {
                    item.isTab = false;
                    $scope.losschecked.splice($scope.losschecked.indexOf(item), 1);
                    delete $scope.losscheckedData[id];
                }
            })
        };
        angular.forEach($scope.losschecked, (item, key) => {
            if (item.isTab) {
                flag = true;
            }
        });
        if ($scope.losschecked.length && !flag) {
            $scope.damageId = $scope.losschecked[0].id;
            $scope.losschecked[0].isTab = true;
        }
        $scope.carDamageMore = ($scope.losschecked.length ? true : false);
    }
    //选择哪个事故
    $scope.chooseCont = (which) => {
        $scope.damageId = which.id;
        $scope.imgPreservation = true;
        angular.forEach($scope.losschecked, (item, key) => {
            item.isTab = false;
        });
        which.isTab = true;
    }

    //上传图片
    $scope.uploadImg = (file) => {
        if (file) {
            Upload.upload({
                url: '/api/file/uploadImg.do',
                file: file,
            }).then((res) => {
                if (res.data.status === 'SUCCESS') {
                    if (res.data.data) {
                        $scope.losscheckedData[$scope.damageId].imgArr.push(res.data.data);
                        if ($scope.losscheckedData[$scope.damageId].imgArr.length >= 3) {
                            $scope.losscheckedData[$scope.damageId].basicinfoEdit = false;
                        }
                    }
                }
            });
        }
    };

    // 删除图片
    $scope.deleteImg = (url) => {
        const arrImg = url.split('/');
        const fileName = arrImg[arrImg.length - 1];
        accidentService.deleteImg(fileName).then((res) => {
            if (res.data.status === 'SUCCESS') {
                angular.forEach($scope.losscheckedData[$scope.damageId].imgArr, (item, key) => {
                    if (url == item) {
                        $scope.losscheckedData[$scope.damageId].imgArr.splice($scope.losscheckedData[$scope.damageId].imgArr.indexOf(item), 1)
                        if ($scope.losscheckedData[$scope.damageId].imgArr.length < 3) {
                            $scope.losscheckedData[$scope.damageId].basicinfoEdit = true;
                        }
                    }
                })
            } else {
                $uibModal.open({
                    size: 'sm',
                    template: tipModelTemplate,
                    controller: ($scope, $uibModalInstance) => {
                        $scope.tips = {
                            body: '删除失败，请稍后再试',
                            sure: '确定',
                            cancel: '取消',
                        }
                        $scope.ok = () => {
                            $uibModalInstance.close();
                        }
                        $scope.cancel = () => {
                            $uibModalInstance.dismiss();
                        }
                    }
                })
            }
        })
    }
    //查看大图
    $scope.imgModel = (url) => {
        $scope.url = url;
        $uibModal.open({
            size: 'lg',
            resolve: {
                url: () => {
                    return $scope.url
                }
            },
            template: `<div style="padding:15px;text-align:center"><img style="width: 100%;" src="{{ url }}"/></div>`,
            controller: ($scope, $uibModalInstance, url) => {
                $scope.url = url;
            }
        })
    }
    //保存图片
    $scope.upCardamageImg = () => {
        if ($scope.losscheckedData[$scope.damageId].imgArr.length >= 1) {
            confirmPic();
        } else {
            alert('图片不能为空');
            return false;
        }
    }
    //保存图片确认
    function confirmPic() {
        $uibModal.open({
            size: 'sm',
            template: `
                <div>
                    <div class="modal-body">
                        <p>保存后，该条车损记录不可编辑且会上报维修。是否确认保存？</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" ng-click="upvoidPic()">确认</button>
                        <button type="button" class="btn btn-default" ng-click="$dismiss()">取消</button>
                    </div>
                </div>`,
            controller: ($scope) => {
                $scope.upvoidPic = () => {
                    $scope.$dismiss();
                    updamagePic();
                }
            }
        })
    }
    //图片备注
    $scope.changeLimitnumPic = () => {
        if ($scope.losscheckedData[$scope.damageId].reportDesc) {
            $scope.losscheckedData[$scope.damageId].limitNumPic = $scope.losscheckedData[$scope.damageId].reportDesc.length;
        } else {
            $scope.losscheckedData[$scope.damageId].limitNumPic = 0;
        }
    }
    //维修处理备注
    $scope.changeLimitnumRep = () => {
        if ($scope.losscheckedData[$scope.damageId].repairRemark) {
            $scope.losscheckedData[$scope.damageId].limitNumRep = $scope.losscheckedData[$scope.damageId].repairRemark.length;
        } else {
            $scope.losscheckedData[$scope.damageId].limitNumRep = 0;
        }
    }

    //上传车损照片
    function updamagePic() {
        const newaddInfoData = angular.extend({}, $scope.addInfoData, $scope.newfillin);
        const damagePicData = {
            reportType: 1,
            dataId: $scope.weeklyId,
            reportUserId: null,
            reportUserName: null,
            phone: null,
            cid: $scope.damageId,
            reportAddr: null,
            reportDesc: $scope.losscheckedData[$scope.damageId].reportDesc,
            reportDate: null,
            carId: newaddInfoData.carId,
            licensePlateNo: newaddInfoData.carNo,
            carTypeName: newaddInfoData.carTypeName,
            fleetId: newaddInfoData.fId,
            fleetName: newaddInfoData.fleetName,
            cityCode: newaddInfoData.areaCode,
            uploadPics: $scope.losscheckedData[$scope.damageId].imgArr
        };
        weeklyInspectionService.weeklyBasicUpload('/api/repair/saveRepair.do', damagePicData).then((res) => {
            console.log(res);
            if (res.data.status == "SUCCESS") {
                uplosscheckeds($scope.losschecked);
                $scope.losscheckedData[$scope.damageId].imgPreservation = false;
                angular.forEach($scope.addInfoData.lossList, (item, key) => {
                    if (item.id == $scope.damageId) {
                        item.ifEdit = true;
                    }
                })
            } else {
                alert('保存失败');
            }
        })
    }

    function uplosscheckeds(whos) {
        const uplossData = {
            id: $scope.weeklyId,
            lossProblemNum: null,
            lossProblems: whos,
            lossDes: null
        };
        weeklyInspectionService.weeklyBasicUpload('/api/departmentCheck/saveCarDamaged.do', uplossData).then((res) => {
            if (res.data.status == "SUCCESS") {
                alert('保存成功');
            }
        })
    }
    //返回周检详情页
    $scope.gobackweekly = () => {
        const forcarno = $scope.weeklyCarNo;
        $uibModal.open({
            size: 'sm',
            template: `
                <div>
                    <div class="modal-body">
                        <p>返回后将不能编辑新增记录</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" ng-click="upvoid()">确认</button>
                        <button type="button" class="btn btn-default" ng-click="$dismiss()">取消</button>
                    </div>
                </div>`,
            controller: ($scope) => {
                $scope.upvoid = () => {
                    $scope.$dismiss();
                    $state.go('vehicleList.inspectionDetail', {
                        'carNo': forcarno
                    });
                }
            }
        })
    }
    //更多车损详情处理
    $scope.carDamageMore = false;
});
