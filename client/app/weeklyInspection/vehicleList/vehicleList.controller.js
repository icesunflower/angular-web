'use strict';

angular.module('shenmaApp').controller('vehicleListCtrl', ($scope, $uibModal, weeklyInspectionService) => {
    $scope.noData = false;
    $scope.bigTotalItems = 0;
    $scope.vehicleListData = {
        areaCode: null,
        carType: null,
        fleetId: null,
        licensePlateNo: null,
        rows: "10",
        pageNo: 1,
        ownership: 0
    };


    //切换所有权
    $scope.checkownership = (which) => {
        $scope.vehicleListData.ownership = which;
        vehicleListQuery();
    }


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


    //获取车辆列表
    function vehicleListQuery() {
        $scope.tableList = [];
        $scope.noData = false;
        const _data = {
            areaCode: $scope.vehicleListData.areaCode,
            carType: $scope.vehicleListData.carType,
            fleetId: $scope.vehicleListData.fleetId,
            licensePlateNo: $scope.vehicleListData.licensePlateNo,
            rows: $scope.vehicleListData.rows,
            pageNo: $scope.vehicleListData.pageNo,
            ownership: $scope.vehicleListData.ownership
        };
        weeklyInspectionService.carlistQuery(_data).then((res) => {
            if (res.data.status == 'SUCCESS') {
                if (res.data.data.rows && res.data.data.rows.length) {
                    $scope.tableList = res.data.data.rows;
                    $scope.bigTotalItems = res.data.data.total;
                } else {
                    $scope.noData = true;
                    $scope.bigTotalItems = 0;
                }

            }

        })
    }
    vehicleListQuery();

    //打开新增车辆
    function OpenInfo() {
        const allcityList = $scope.cityList;
        const allfleetList = $scope.fleetList;
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
                            <div class="form-group">
                                <label><span class="panelmarkers">*</span>是否车队运营：</label>
                                <label class="radio-inline">
                                <input type="radio" name="inlineRadioOptions" value="1" ng-model="openDatas.fleets"> 是
                                </label>
                                <label class="radio-inline">
                                <input type="radio" name="inlineRadioOptions" value="2" ng-model="openDatas.fleets"> 否
                                </label>
                                <span ng-show="openDatas.fletsNo" class="prompt">此项必选</span>
                            </div>
                            <div ng-show="openDatas.fleets==1" class="form-group">
                                <label><span class="panelmarkers">*</span>所属车队：</label>
                                <select class="form-control width-full" ng-model="openDatas.fleetId" ng-options="m.fleetId as m.fleetName for m in allfleetLists">
                                    <option value="" selected hidden></option>
                                </select>
                                <span ng-show="openDatas.fletNo" class="prompt">此项必选</span>
                            </div>
                            <p ng-show="openDatas.fleets==2">如之后需要将该车辆派发到车队，请在“车辆管辖”-“更改管辖者”中派发</p>
                        </div>
                        <div class="footer">
                            <button type="button" class="btn btn-success btn-search" ng-click="confirm()">{{btnText}}</button>
                            <button type="button" class="btn btn-danger btn-search" ng-click="$dismiss()">取消</button>
                        </div>
                    </div>
                </div>
            `,
            controller: ($scope) => {
                $scope.title = "新增车辆";
                $scope.btnText = "确认";
                $scope.allcityLists = allcityList;
                $scope.allfleetLists = allfleetList;
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
                    ctiNo: false,
                    fletNo: false,
                    fleets: null,
                    fletsNo: false
                }

                $scope.confirm = () => {
                    saveCar($scope.openDatas, $scope);
                }
            }
        });
    }
    //新增车辆信息
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
        if (data.fleets == 1) {
            data.fletsNo = false;
            if (!data.fleetId) {
                data.fletNo = true;
                return false;
            } else {
                data.fletNo = false;
            }
        } else if (data.fleets == 2) {
            data.fletsNo = false;
        } else {
            data.fletsNo = true;
            return false;
        }

        const addData = {
            areaCode: data.areaCode,
            fleetId: data.fleetId,
            licensePlateNo: data.licensePlateNo,
            carType: data.carType,
            carColorType: data.carColorType,
            obdDeviceId: data.obdDeviceId,
            vin: data.vin,
            obdDeviceType: data.obdDeviceType,
            engineNo: data.engineNo,
        }
        weeklyInspectionService.saveCar(addData).then((res) => {
            if (res.data.status == "SUCCESS") {
                x.$dismiss();
                vehicleListQuery();
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
    $scope.queryValuePre = () => {
        $scope.vehicleListData.pageNo = 1;
        vehicleListQuery();
    }
    $scope.changePage = () => {
        vehicleListQuery();
    }
    $scope.addnewCar = () => {
        OpenInfo();
    }

});
