'use strict';

const angular = require('angular');

import './basicInfoComponent.less';
import templateUrl from './basicInfoComponent.template.html';
import templateUrlMap from '../bmapModel/bmap.template.html';
import tipModelTemplate from '../model/commonTipsModel.html';

/*
 * Component basicInfoComponent
 *
 * @author luorongfang
 * @component basicInfoComponent
 * @param {!angular.$something} $something
 */
angular.module('shenmaApp')
    .component('basicInfoComponent', {
        bindings: {
            basicinfoEdit: '=',
            safeytyinfoEdit: '=',
            showSafeytyinfoEdit: '=',
            showEdit: '=',
            reportId: '=',
            getDetil: '=',
            accidentInfo: '='
        },
        template: templateUrl,
        controller: ($scope, $uibModal, accidentService, localStorageService, $stateParams) => {
            $scope.carNoArr;
            $scope.noCar;
            $scope.showCar = false;
            $scope.staffNoArr;
            $scope.noStaff;
            $scope.showStaff = false;
            $scope.isUploadImg = true;
            $scope.max = 20;
            $scope.today = new Date();
            // 默认显示取消按钮
            $scope.showCancel = false;

            $scope.getAddressModel = () => {
                $uibModal.open({
                    size: 'lg',
                    template: templateUrlMap,
                    controller: 'bmapModelController'
                }).result.then((res) => {
                    $scope.$ctrl.accidentInfo.basicSituation.address = res.address;
                    $scope.$ctrl.accidentInfo.basicSituation.latitude = res.lat;
                    $scope.$ctrl.accidentInfo.basicSituation.longitude = res.lng;
                })
            }

            // 通过车牌号查询信息
            $scope.getCarInfoByNumber = () => {
                if ($scope.$ctrl.accidentInfo.basicSituation.licensePlateNo) {
                    resetCar();
                    accidentService.getItem('/api/common/getCarInfo.do', { carNo: $scope.$ctrl.accidentInfo.basicSituation.licensePlateNo, showInsurance: true }).then((res) => {
                        if (res.data.status === 'SUCCESS') {
                            $scope.showCar = true;
                            if (res.data.data) {
                                res.data.data.name = res.data.data.carNo;
                                res.data.data.JobNo = '';
                                $scope.carNoArr.push(res.data.data);
                            } else {
                                $scope.noCar = '该车牌不存在';
                                $scope.carNoArr = '';
                                $scope.$ctrl.accidentInfo.basicSituation.licensePlateNo = '';
                            }
                        }
                    })
                }
            }

            function resetCar() {
                $scope.carNoArr = [];
                $scope.$ctrl.accidentInfo.basicSituation.carTypeName = '';
                $scope.$ctrl.accidentInfo.basicSituation.fleetName = '';
                $scope.$ctrl.accidentInfo.basicSituation.historyInsurance = '';
                $scope.$ctrl.accidentInfo.basicSituation.carId = '';
                $scope.$ctrl.accidentInfo.basicSituation.areaCode = '';
                $scope.$ctrl.accidentInfo.basicSituation.fleetId = '';
                $scope.noCar = '';
                $scope.showCar = false;
            }

            function resetStaff() {
                $scope.staffNoArr = [];
                $scope.$ctrl.accidentInfo.basicSituation.jobNumber = '';
                $scope.$ctrl.accidentInfo.basicSituation.workPhone = '';
                $scope.$ctrl.accidentInfo.basicSituation.driverId = '';
                $scope.noStaff = '';
                $scope.showStaff = false;
            }

            // 改变车牌号时，清空车型，车队信息
            $scope.changeCarNo = () => {
                $scope.carNoArr = [];
                $scope.$ctrl.accidentInfo.basicSituation.carTypeName = '';
                $scope.$ctrl.accidentInfo.basicSituation.fleetName = '';
                $scope.$ctrl.accidentInfo.basicSituation.historyInsurance = '';
                $scope.$ctrl.accidentInfo.basicSituation.carId = '';
                $scope.$ctrl.accidentInfo.basicSituation.areaCode = '';
                $scope.$ctrl.accidentInfo.basicSituation.fleetId = '';
            }

            // 查员工信息
            $scope.getStaffInfo = () => {
                resetStaff();
                if ($scope.$ctrl.accidentInfo.basicSituation.driverName) {
                    accidentService.query('/api/common/findByJobNo.do', { data: $scope.$ctrl.accidentInfo.basicSituation.driverName }).then((res) => {
                        if (res.data.status === 'SUCCESS') {
                            $scope.showStaff = true;
                            if (res.data.data && res.data.data.length) {
                                $scope.staffNoArr = res.data.data;
                            } else {
                                $scope.noStaff = '该员工不存在';
                                $scope.staffNoArr = '';
                                $scope.$ctrl.accidentInfo.basicSituation.driverName = '';
                            }
                        }
                    })
                }
            }

            // 删除图片
            $scope.onDelete = (url) => {
                const arrImg = url.url.split('/');
                const fileName = arrImg[arrImg.length - 1];
                accidentService.deleteImg(fileName).then((res) => {
                    if (res.data.status === 'SUCCESS') {
                        angular.forEach($scope.$ctrl.accidentInfo.basicSituation.pics, (item, key) => {
                            if (url.url == item) {
                                $scope.$ctrl.accidentInfo.basicSituation.pics.splice($scope.$ctrl.accidentInfo.basicSituation.pics.indexOf(item), 1);
                            }
                        });
                        if ($scope.$ctrl.accidentInfo.basicSituation.pics) {
                            if ($scope.$ctrl.accidentInfo.basicSituation.pics.length >= $scope.max) {
                                $scope.isUploadImg = false;
                            } else {
                                $scope.isUploadImg = true;
                            }
                        } else {
                            $scope.isUploadImg = true;
                        }
                    } else {
                        $uibModal.open({
                            size: 'sm',
                            template: tipModelTemplate,
                            controller: ($scope, $uibModalInstance) => {
                                $scope.tips = {
                                    body: '删除失败，请稍后再试',
                                    sure: '确定',
                                    cancel: '取消'
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
            $scope.onOriginimg = (url) => {
                $scope.url = url.url;
                $uibModal.open({
                    size: 'lg',
                    resolve: {
                        url: () => {
                            return $scope.url;
                        }
                    },
                    template: `<div style="padding:15px;text-align:center"><img src="{{ url }}" style="display:inline-block;max-width:100%"/></div>`,
                    controller: ($scope, $uibModalInstance, url) => {
                        $scope.url = url;
                    }
                })
            }

            function saveBaseinfo() {
                // $scope.basicinfo1={ ...$scope.$ctrl.accidentInfo.basicSituation}
                $scope.basicinfo = {
                    id: $scope.$ctrl.accidentInfo.basicSituation.id,
                    carId: $scope.$ctrl.accidentInfo.basicSituation.carId,
                    cityCode: $scope.$ctrl.accidentInfo.basicSituation.areaCode,
                    licensePlateNo: $scope.$ctrl.accidentInfo.basicSituation.licensePlateNo,
                    driverName: $scope.$ctrl.accidentInfo.basicSituation.driverName,
                    driverId: $scope.$ctrl.accidentInfo.basicSituation.driverId,
                    jobNumber: $scope.$ctrl.accidentInfo.basicSituation.jobNumber,
                    occuredTime: new Date($scope.$ctrl.accidentInfo.basicSituation.occuredTime).getTime(),
                    carTypeName: $scope.$ctrl.accidentInfo.basicSituation.carTypeName,
                    fleetId: $scope.$ctrl.accidentInfo.basicSituation.fleetId,
                    fleetName: $scope.$ctrl.accidentInfo.basicSituation.fleetName,
                    workPhone: $scope.$ctrl.accidentInfo.basicSituation.workPhone,
                    accidentType: $scope.$ctrl.accidentInfo.basicSituation.accidentType,
                    latitude: $scope.$ctrl.accidentInfo.basicSituation.latitude,
                    longitude: $scope.$ctrl.accidentInfo.basicSituation.longitude,
                    address: $scope.$ctrl.accidentInfo.basicSituation.address,
                    accidentProcess: $scope.$ctrl.accidentInfo.basicSituation.accidentProcess,
                    pics: $scope.$ctrl.accidentInfo.basicSituation.pics
                }
                accidentService.query('/api/accident/add.do', $scope.basicinfo).then((res) => {
                    if (res.data.status === 'SUCCESS') {
                        $scope.canUpdateBsic = false;
                        $scope.$ctrl.reportId = res.data.data;
                        $scope.showCancel = false;
                        $scope.$ctrl.getDetil($scope.$ctrl.reportId);
                    } else {
                        $uibModal.open({
                            size: 'sm',
                            template: tipModelTemplate,
                            resolve: {
                                tips: () => {
                                    return res.data.errorMsg;
                                }
                            },
                            controller: ($scope, $uibModalInstance, tips) => {
                                $scope.tips = {
                                    body: tips,
                                    sure: '确定',
                                    cancel: '取消'
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

            // 修改按钮点击事件
            $scope.updateBtn = () => {
                $scope.canUpdateBsic = true;
                $scope.canUpdateSafeyty = false;
                $scope.showCar = false;
                $scope.showStaff = false;
                $scope.showCancel = true;
                $scope.$ctrl.getDetil($scope.$ctrl.reportId, $scope.canUpdateBsic, $scope.canUpdateSafeyty);
            }

            // 取消按钮点击事件
            $scope.cancelBtn = () => {
                $scope.canUpdateBsic = false;
                $scope.canUpdateSafeyty = false;
                $scope.showCar = false;
                $scope.showStaff = false;
                $scope.$ctrl.getDetil($scope.$ctrl.reportId, $scope.canUpdateBsic, $scope.canUpdateSafeyty);
            }
            $scope.saveBaseinfo = () => {
                saveBaseinfo();
            }
        }
    })
