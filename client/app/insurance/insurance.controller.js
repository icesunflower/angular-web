'use strict';
import createInsurance from "./createInsurance.html"
import tipModelTemplate from '../accident/model/commonTipsModel.html';

angular.module('shenmaApp')
    .controller('insuranceController', ($scope, insuranceService, $timeout, $uibModal, $stateParams) => {
        $scope.compulsoryTimes = 0;
        $scope.commercialTimes = 0;
        $scope.tableCurrent = {
            title:['事故发生时间', '事故类型'],
            bodys:{
                compulsoryList:[],
                commercialList:[]
            }
        }
        $scope.tableHistory = {
            title:['保险单号', '起保日期', '到期日期', '保费金额', '投保保险公司', '周期内报案次数'],
            bodys:{
                hisCompulsoryInsuranceList:[],
                hisCommercialInsuranceList:[]
            }
        }
        if ($stateParams.id) {
            $scope.carNo = $stateParams.id;
        }
        //管辖者
        $scope.ownership = $stateParams.ownershipId;
        function getInsuranceDetail() {
            insuranceService.query('/api/insurance/insuranceDetailInfo.do', {
                data: $scope.carNo
            }).then((res) => {
                if (res.data.status === 'SUCCESS') {
                    if (res.data.data) {
                        if (res.data.data.compulsoryList) {
                            $scope.compulsoryList = res.data.data.compulsoryList;
                            if ($scope.compulsoryList.length) {
                                $scope.compulsoryTimes = $scope.compulsoryList.length;
                            }
                        }
                        if (res.data.data.commercialList) {
                            $scope.commercialList = res.data.data.commercialList;
                            if ($scope.commercialList.length) {
                                $scope.commercialTimes = $scope.commercialList.length;
                            }
                        }
                        if (res.data.data.currentCompulsoryInsurance) {
                            $scope.currentCompulsoryInsurance = res.data.data.currentCompulsoryInsurance;
                        }
                        if (res.data.data.currentCommercialInsurance) {
                            $scope.currentCommercialInsurance = res.data.data.currentCommercialInsurance;
                        }
                        if (res.data.data.hisCompulsoryInsuranceList) {
                            $scope.tableHistory.bodys.hisCompulsoryInsuranceList = res.data.data.hisCompulsoryInsuranceList;
                        }
                        if (res.data.data.hisCommercialInsuranceList) {
                            $scope.tableHistory.bodys.hisCommercialInsuranceList = res.data.data.hisCommercialInsuranceList;
                        }
                        if ($scope.currentCompulsoryInsurance) {
                            if ($scope.currentCompulsoryInsurance.compulsoryInsuranceAmount) {
                                $scope.currentCompulsoryInsurance.compulsoryInsuranceAmount = $scope.currentCompulsoryInsurance.compulsoryInsuranceAmount/100;
                            } else {
                                $scope.currentCompulsoryInsurance.compulsoryInsuranceAmount = 0;
                            }
                        }
                        if ($scope.currentCommercialInsurance) {
                            if ($scope.currentCommercialInsurance.commercialInsuranceAmount) {
                                $scope.currentCommercialInsurance.commercialInsuranceAmount = $scope.currentCommercialInsurance.commercialInsuranceAmount/100;
                            } else {
                                $scope.currentCommercialInsurance.commercialInsuranceAmount = 0;
                            }
                        }
                        angular.forEach($scope.tableHistory.bodys.hisCompulsoryInsuranceList, (item, key) => {
                            if (item.compulsoryInsuranceAmount) {
                                item.compulsoryInsuranceAmount = item.compulsoryInsuranceAmount/100;
                            } else {
                                item.compulsoryInsuranceAmount = 0;
                            }
                        })
                        angular.forEach($scope.tableHistory.bodys.hisCommercialInsuranceList, (item, key) => {
                            if (item.commercialInsuranceAmount) {
                                item.commercialInsuranceAmount = item.commercialInsuranceAmount/100;
                            } else {
                                item.commercialInsuranceAmount = 0;
                            }
                        })
                    }
                }
            })
        }
        $scope.createInsurance = () => {
            $uibModal.open({
                animation: true,
                size: 'md',
                template: createInsurance,
                controller: 'createInsuranceController',
                resolve: {
                    carNo:() => {
                        return $scope.carNo;
                    }
                }
            }).result.then(() => {
                getInsuranceDetail();
            })
        }

        getInsuranceDetail();
    })
    .controller('createInsuranceController', ($scope, insuranceService, $uibModal, $uibModalInstance, carNo) => {
        $scope.carNo = carNo;
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
            $scope.datepicker.startOptions.maxDate = $scope.datepicker.endTime ? $scope.datepicker.endTime : null;
            $scope.datepicker.endOptions.minDate = $scope.datepicker.startTime ? $scope.datepicker.startTime : null;
        }
        $scope.open = function() { $scope.datepicker.startOpened = true; };
        $scope.openEnd = function() { $scope.datepicker.endOpened = true; };
        $scope.insuranceTypeArr = ['交强险', '商业险'];
        $scope.insuranceTypeArrList = $scope.insuranceTypeArr.map((d, index) => ({
            id: index + 1, content:d
        }))
        $scope.insuranceType = $scope.insuranceTypeArrList[0].id;

        $scope.commercialTypeBodyDamageChecked = {
            checked: false
        }
        $scope.commercialTypeThreePartyChecked = {
            checked: false
        }
        $scope.commercialTypeSetChecked = {
            checked: false
        }
        $scope.commercialTypeDeductibleChecked = {
            checked: false
        }
        $scope.changeInsuranceType = (id) => {
            if (id == 0) {
                $scope.commercialTypeBodyDamageChecked.checked = !$scope.commercialTypeBodyDamageChecked.checked;
            } else if (id == 1) {
                $scope.commercialTypeThreePartyChecked.checked = !$scope.commercialTypeThreePartyChecked.checked;
            } else if (id == 2) {
                $scope.commercialTypeSetChecked.checked = !$scope.commercialTypeSetChecked.checked;
            } else if (id == 3) {
                $scope.commercialTypeDeductibleChecked.checked = !$scope.commercialTypeDeductibleChecked.checked;
            }
            if ($scope.commercialTypeBodyDamageChecked.checked) {
                $scope.commercialTypeBodyDamage = 1;
            } else {
                $scope.commercialTypeBodyDamage = 0;
            }
            if ($scope.commercialTypeThreePartyChecked.checked) {
                $scope.commercialTypeThreeParty = 1;
            } else {
                $scope.commercialTypeThreeParty = 0;
            }
            if ($scope.commercialTypeSetChecked.checked) {
                $scope.commercialTypeSet = 1;
            } else {
                $scope.commercialTypeSet = 0;
            }
            if ($scope.commercialTypeDeductibleChecked.checked) {
                $scope.commercialTypeDeductible = 1;
            } else {
                $scope.commercialTypeDeductible = 0;
            }
        }
        function saveInsurance() {
            if ($scope.insuranceType == 1) {
                var data = {
                    typeName: $scope.insuranceType,
                    carNo: $scope.carNo,
                    compulsoryInsuranceNo: $scope.insuranceNo,
                    compulsoryInsuranceStartTime: Date.parse($scope.datepicker.startTime),
                    compulsoryInsuranceEndTime: Date.parse($scope.datepicker.endTime),
                    compulsoryInsuranceAmount: $scope.insuranceAmount*100,
                    compulsoryInsuranceCompany: $scope.insuranceCompany
                }
            } else if ($scope.insuranceType == 2) {
                var data = {
                    typeName: $scope.insuranceType,
                    carNo: $scope.carNo,
                    commercialInsuranceNo: $scope.insuranceNo,
                    commercialInsuranceStartTime: Date.parse($scope.datepicker.startTime),
                    commercialInsuranceEndTime: Date.parse($scope.datepicker.endTime),
                    commercialInsuranceAmount: $scope.insuranceAmount*100,
                    commercialInsuranceCompany: $scope.insuranceCompany,
                    commercialTypeBodyDamage: $scope.commercialTypeBodyDamage,//商业险车损险
                    commercialTypeThreeParty: $scope.commercialTypeThreeParty,//商业险三者险
                    commercialTypeSet: $scope.commercialTypeSet,//商业险座位险
                    commercialTypeDeductible: $scope.commercialTypeDeductible,//商业险不计免赔
                }
            }
            insuranceService.query('/api/insurance/insertInsurance.do', data).then((res) => {
                if (res.data.status === 'SUCCESS') {
                    $uibModalInstance.close();
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
                                sure:'确定',
                                cancel:'取消'
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
        $scope.ok = () => {
            $uibModal.open({
                size: 'sm',
                template: tipModelTemplate,
                controller: ($scope, $uibModalInstance) => {
                    $scope.tips = {
                        body: '该记录生成后，不可编辑，是否确认新增。',
                        sure:'是',
                        cancel:'否'
                    }
                    $scope.ok = () => {
                       $uibModalInstance.close();
                    }
                    $scope.cancel = () => {
                       $uibModalInstance.dismiss();
                    }
                }
            }).result.then((res) => {
                saveInsurance();
            })
        };
        $scope.cancel = () => {
            $uibModalInstance.dismiss('cancel');
        };
    })