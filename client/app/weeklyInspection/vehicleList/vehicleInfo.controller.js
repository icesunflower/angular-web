'use strict';

angular.module('shenmaApp').controller('vehicleInfoCtrl', ($scope, $state, $stateParams, $uibModal, weeklyInspectionService) => {
    $scope.weeklycarId = $stateParams.id;
    $scope.weeklyownership = $stateParams.ownershipId;
    $scope.titleName = $scope.weeklyownership != 0 ? $scope.weeklyownership != 1 ? "退出管辖" : "机务管辖" : "车队运营"
    $scope.editType = true;

    //切换编辑方式,0:车辆信息,1:车辆管辖
    $scope.checkType = (which) => {
        if (which == 1) {
            $scope.editType = false;
            changeRecordInfo();
        } else {
            $scope.editType = true;
            vehicleInfo();
        }
    }

    //获取车辆信息
    function vehicleInfo() {
        weeklyInspectionService.carSingleinfo($scope.weeklycarId).then((res) => {
            if (res.data.status == "SUCCESS") {
                $scope.carDatas = res.data.data;
            } else {}
        })
    }
    vehicleInfo();
    //获取城市列表
    function getCityList() {
        weeklyInspectionService.cityList().then((res) => {
            $scope.cityList = res.data.data;
        })
    }
    getCityList();

    //获取车队列表
    function getFleetList() {
        weeklyInspectionService.fleetsList().then((res) => {
            $scope.fleetList = res.data.data;
        })
    }
    getFleetList();

    //获取车队类型列表
    function getcarTypeList() {
        weeklyInspectionService.carTypeList().then((res) => {
            $scope.carTypesList = res.data.data;
        })
    }
    getcarTypeList();

    //获取车辆颜色列表
    function getcarColorList() {
        weeklyInspectionService.carColorList().then((res) => {
            $scope.carColorList = res.data.data;
        })
    }
    getcarColorList();

    //打开更换车队
    $scope.modifyFleet = () => {
        const allfleetList = $scope.fleetList;
        const _fleetId = $scope.carDatas.fleetId;
        $uibModal.open({
            size: 'md',
            template: `
                <div class="viewbox">
                    <div class="modal-header">
                        <div class="viewbox-title">更换车队</div>
                        <div class="viewbox-close" ng-click="$dismiss()">x</div>
                    </div>
                    <div class="modal-body">
                        <div class="form-inline">
                            <div class="form-group">
                                <label><span class="panelmarkers">*</span>所属车队：</label>
                                <select class="form-control width-full" ng-model="openDatas.fleetId" ng-options="m.fleetId as m.fleetName for m in allfleetLists">
                                    <option value="" selected hidden></option>
                                </select>
                                <span ng-show="openDatas.fletNo" class="prompt">此项必选</span>
                            </div>
                        </div>
                        <div class="footer">
                            <button type="button" class="btn btn-success btn-search" ng-click="confirm()">确认</button>
                            <button type="button" class="btn btn-danger btn-search" ng-click="$dismiss()">取消</button>
                        </div>
                    </div>
                </div>
            `,
            controller: ($scope) => {
                $scope.allfleetLists = allfleetList;
                $scope.openDatas = {
                    fletNo: false,
                    fleetId: _fleetId
                };
                $scope.confirm = () => {
                    saveFleet($scope.openDatas, $scope);
                }
            }
        });
    };
    $scope.modifyCar = () => {
        OpenInfo($scope.carDatas);
    }

    //更改车队
    function saveFleet(data, x) {
        if (!data.fleetId) {
            data.fletNo = true;
            return false;
        } else {
            data.fletNo = false;
        }
        const modifyData = {
            id: $scope.weeklycarId,
            fleetId: data.fleetId
        };
        weeklyInspectionService.saveFleet(modifyData).then((res) => {
            if (res.data.status == "SUCCESS") {
                x.$dismiss();
                vehicleInfo();
            } else {
                afterRes(res.data.errorMsg);
            }
        })
    }

    //打开修改车辆
    function OpenInfo(data) {
        const openData = data;
        const allcityList = $scope.cityList;
        const allcarTypeList = $scope.carTypesList;
        const allcarColorList = $scope.carColorList;
        $uibModal.open({
            size: 'md',
            template: `
                <div class="viewbox">
                    <div class="modal-header">
                        <div class="viewbox-title">{{title}}</div>
                        <div class="viewbox-close" ng-click="$dismiss()">x</div>
                    </div>
                    <div class="modal-body">
                        <div class="form-inline">
                            <div class="form-group">
                                <label for="vehiclenumb"><span class="panelmarkers">*</span>车牌号：</label>
                                <input type="text" class="form-control width-full" id="vehiclenumb" maxlength="8" placeholder="请填写7-8位车牌号" ng-model="openDatas.licensePlateNo">
                                <span ng-show="openDatas.LicNo" class="prompt">请填写正确车牌号</span>
                            </div>
                            <div class="form-group">
                                <label for="carnumb"><span class="panelmarkers">*</span>车架号：</label>
                                <input type="text" class="form-control width-full" id="carnumb" maxlength="20" placeholder="最长20位" ng-model="openDatas.vin">
                                <span ng-show="openDatas.vinNo" class="prompt">此项必填</span>
                            </div>
                            <div class="form-group">
                                <label for="carnumb"><span class="panelmarkers">*</span>发动机编号：</label>
                                <input type="text" class="form-control width-full" id="carnumb" maxlength="30" placeholder="最长30位" ng-model="openDatas.engineNo">
                                <span ng-show="openDatas.engNo" class="prompt">此项必填</span>
                            </div>
                            <div class="form-group">
                                <label><span class="panelmarkers">*</span>车辆类型：</label>
                                <select class="form-control width-full" ng-model="openDatas.carType" ng-options="m.id as m.carTypeName for m in allcarTypeLists">
                                    <option value="" selected hidden></option>
                                </select>
                                <span ng-show="openDatas.typNo" class="prompt">此项必选</span>
                            </div>
                            <div class="form-group">
                                <label><span class="panelmarkers">*</span>车辆颜色：</label>
                                <select class="form-control width-full" ng-model="openDatas.carColorType" ng-options="m.id as m.codeName for m in allcarColorLists">
                                    <option value="" selected hidden></option>
                                </select>
                                <span ng-show="openDatas.colrNo" class="prompt">此项必选</span>
                            </div>
                            <div class="form-group">
                                <label>OBD设备类型：</label>
                                <select class="form-control width-full" ng-model="openDatas.obdDeviceType" ng-options="m.id as m.name for m in allobdDeviceType">
                                    <option value="" selected hidden></option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="panelrole">OBD设备编号：</label>
                                <input type="text" class="form-control width-full" id="panelrole" maxlength="20" placeholder="最长20位" ng-model="openDatas.obdDeviceId">
                            </div>
                            <div class="form-group">
                                <label><span class="panelmarkers">*</span>归属城市：</label>
                                <select class="form-control width-full" ng-model="openDatas.areaCode" ng-options="m.cityCode as m.cityName for m in allcityLists">
                                    <option value="" selected hidden></option>
                                </select>
                                <span ng-show="openDatas.ctiNo" class="prompt">此项必选</span>
                            </div>
                        </div>
                        <div class="footer">
                            <button type="button" class="btn btn-success btn-search" ng-click="confirm()">{{btnText}}</button>
                            <button type="button" class="btn btn-danger btn-search" ng-click="$dismiss()">取消</button>
                        </div>
                    </div>
                </div>
            `,
            controller: ($scope) => {
                $scope.title = "修改车辆";
                $scope.btnText = "确认";
                $scope.allcityLists = allcityList;
                $scope.allcarTypeLists = allcarTypeList;
                $scope.allcarColorLists = allcarColorList;
                $scope.allobdDeviceType = [{
                    id: 1,
                    name: '车葫芦'
                }, {
                    id: 2,
                    name: '云盒'
                }]
                $scope.openDatas = {
                    LicNo: false,
                    vinNo: false,
                    engNo: false,
                    typNo: false,
                    colrNo: false,
                    ctiNo: false
                }
                angular.extend($scope.openDatas, openData);

                $scope.confirm = () => {
                    saveCar($scope.openDatas, $scope);
                }
            }
        });
    }
    //修改车辆信息
    function saveCar(data, x) {
        if (!data.licensePlateNo || data.licensePlateNo.length < 7) {
            data.LicNo = true;
            return false;
        } else {
            data.LicNo = false;
        }
        if (!data.vin) {
            data.vinNo = true;
            return false;
        } else {
            data.vinNo = false;
        }
        if (!data.engineNo) {
            data.engNo = true;
            return false;
        } else {
            data.engNo = false;
        }
        if (data.carType == null && data.carType !== 0) {
            data.typNo = true;
            return false;
        } else {
            data.typNo = false;
        }
        if (!data.carColorType) {
            data.colrNo = true;
            return false;
        } else {
            data.colrNo = false;
        }
        if (!data.areaCode) {
            data.ctiNo = true;
            return false;
        } else {
            data.ctiNo = false;
        }
        const modifyData = {
            id: data.id,
            areaCode: data.areaCode,
            licensePlateNo: data.licensePlateNo,
            carType: data.carType,
            carColorType: data.carColorType,
            obdDeviceId: data.obdDeviceId,
            vin: data.vin,
            obdDeviceType: data.obdDeviceType,
            engineNo: data.engineNo,
        }
        weeklyInspectionService.saveCar(modifyData).then((res) => {
            if (res.data.status == "SUCCESS") {
                x.$dismiss();
                vehicleInfo();
            } else {
                afterRes(res.data.errorMsg);
            }
        })
    }

    //获取管辖者变更
    function changeRecordInfo() {
        weeklyInspectionService.changeRecord($scope.weeklycarId).then((res) => {
            if (res.data.status == "SUCCESS") {
                $scope.recordInfo = res.data.data;
            } else {}
        })
    }
    //更换管辖者
    $scope.changeOwnership = () => {
        const Ownership = $scope.weeklyownership;
        const allfleetList = $scope.fleetList;
        $uibModal.open({
            size: 'md',
            template: `
                    <div class="viewbox">
                        <div class="modal-header">
                            <div class="viewbox-title">更改管辖者</div>
                            <div class="viewbox-close" ng-click="$dismiss()">x</div>
                        </div>
                        <div class="modal-body">
                            <div class="form-inline">
                                <div class="form-group">
                                    <label><span class="panelmarkers">*</span>选择管辖者：</label>
                                    <select class="form-control width-full" ng-model="openDatas.ownership" ng-options="m.id as m.ownerName for m in allownership">
                                        <option value="" selected hidden></option>
                                    </select>
                                    <span ng-show="openDatas.ownerNo" class="prompt">此项必选</span>
                                </div>
                                <div ng-show="ownership==1&&(openDatas.ownership==0)" class="form-group">
                                    <label>所属车队：</label>
                                    <select class="form-control width-full" ng-model="openDatas.fleetId" ng-options="m.fleetId as m.fleetName for m in allfleetLists">
                                        <option value="" selected hidden></option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>备注：</label>
                                    <div class="textarea-num small-textarea">
                                        <textarea class="form-control form-width" ng-model="openDatas.reason"
                                            ng-change="changeLimitnum()" name="remarks" maxLength="50" rows="5" cols="60" required></textarea>
                                        <div class="limit">
                                            {{limitNum?limitNum:0}}/50
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="footer">
                                <button type="button" class="btn btn-success btn-search" ng-click="confirm()">确认</button>
                            </div>
                        </div>
                    </div>
                `,
            controller: ($scope) => {
                $scope.ownership = Ownership;
                $scope.allfleetLists = allfleetList;
                if ($scope.ownership == 0) {
                    $scope.allownership = [{
                        id: 1,
                        ownerName: '机务管辖'
                    }, {
                        id: 2,
                        ownerName: '退出管辖'
                    }]
                }
                if ($scope.ownership == 1) {
                    $scope.allownership = [{
                        id: 0,
                        ownerName: '车队运营'
                    }, {
                        id: 2,
                        ownerName: '退出管辖'
                    }]
                }

                $scope.openDatas = {
                    ownerNo: false
                };
                $scope.changeLimitnum = () => {
                    if ($scope.openDatas.reason) {
                        $scope.limitNum = $scope.openDatas.reason.length;
                    } else {
                        $scope.limitNum = 0;
                    }
                }
                $scope.confirm = () => {
                    saveOwnership($scope.openDatas, $scope);
                }

            }
        });
    }

    function saveOwnership(data, x) {
        if (data.ownership == null && data.ownership !== 0) {
            data.ownerNo = true;
            return false;
        } else {
            data.ownerNo = false;
        }
        const modifyData = {
            id: $scope.weeklycarId,
            ownership: data.ownership,
            fleetId: data.fleetId,
            reason: data.reason
        };
        weeklyInspectionService.saveOwnership(modifyData).then((res) => {
            if (res.data.status == "SUCCESS") {
                x.$dismiss();
                $state.go('vehicleList.vehicleInfo', {
                    id: $scope.weeklycarId,
                    ownershipId: modifyData.ownership
                });
            } else {
                afterRes(res.data.errorMsg);
            }
        })
    }
    //添加后的展示
    function afterRes(res) {
        $uibModal.open({
            size: 'sm',
            template: `<div class="padding-top padding-bottom padding-left padding-right">${res}</div>`
        });
    }
    //返回
    $scope.govehiceList = () => {
        $state.go('vehicleList');
    }
});
