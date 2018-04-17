'use strict';

/*
 * @author vanpipy
 */
import './repairment.less';
import RepairList from './RepairList.interface';

angular.module('shenmaApp')
    .controller('repairmentController', ($scope, $state, $stateParams, $filter, $uibModal, repairmentService, organizationService) => {
        const allValidStatus = RepairList.allStatusIndexs();
        const role = $stateParams.role;

        $scope.isCaptain = role === 'captain';
        $scope.active = 5;
        $scope.tabs = allValidStatus.map(addSelect);
        $scope.table = { body: [] };
        $scope.table.titles = [
            RepairList.titleOfWaitingToDealWith,
            RepairList.titleOfWaitingRepairment,
            RepairList.titleOfRepaired,
            RepairList.titleOfRejected,
            RepairList.titleOfRetrun,
            RepairList.titleOfAll,
        ];

        if ($scope.isCaptain) {
            $scope.table.titles[5] = RepairList.titleOfCaptain;
        }

        $scope.tableTitles = $scope.table.titles[$scope.active].title;
        $scope.tableBody = [];
        $scope.tableKeys = $scope.table.titles[$scope.active].keys;

        $scope.pagination = { current: 1, size: 20, total: 0, maxSize: 5,  };
        $scope.fleets = [{ fleetName: '全部' }];
        $scope.cities = [{ cityName: '全部' }];
        $scope.adviseForRepairings = [{ name: '全部' }, { name: '暂缓维修', suggestionType: 0}, { name: '立即送修', suggestionType: 1 }];
        $scope.adviseOfDeal = [{ name: '全部' }, { name: '未处理', dealStatus: 0 }, { name: '已处理', dealStatus: 1 }];
        $scope.reportTypes = [{ name: '全部' }, { name: '事故', reportType: 2 }, { name: '故障', reportType: 0 }, { name: '月检', reportType: 1 }];
        $scope.reportTime = { start: {}, end: {} };
        $scope.repairedTime = { start: {}, end: {} };

        $scope.originalConditionsNeedSelected = {
            cityCode: $scope.cities[0],
            fleetId: $scope.fleets[0],
            suggestionType: $scope.adviseForRepairings[0],
            dealStatus: $scope.adviseOfDeal[0],
            reportType: $scope.reportTypes[0],
        };

        $scope.conditionsNeedSelected = angular.extend({}, $scope.originalConditionsNeedSelected);
        $scope.conditions = {
            startReportDate: null,
            endReportDate: null,
            startRepairDate: null,
            endRepairDate: null,
            currentStatus: null,
            multipleStatus: null
        };

        $scope.conditionMaps = {};
        $scope.displayWithTabPanel = (validIndexs) => {
            return validIndexs.indexOf($scope.active) > -1;
        };

        $scope.query = () => queryRecords();

        $scope.export = () => {
            correctConditionBody();

            if ($scope.isCaptain) {
                $scope.conditions.currentStatus = null;
                $scope.conditions.multipleStatus = [1,2,4];
            }

            if ($scope.active == 5) {
                if ($scope.conditions.cityCode
                        || $scope.conditions.fleetId
                        || $scope.conditions.reportType
                        || $scope.conditions.startReportDate
                        || $scope.conditions.endReportDate
                        || $scope.conditions.licensePlateNo) {
                    repairmentService.exportReport($scope.conditions).then((result) => {
                        result.data.status === 'SUCCESS' ?  simpleModal('导出成功，请到文件列表下载') : simpleModal('导出失败');
                    });
                } else {
                    simpleModal('请设置任一条件，再导出表单');
                }
            } else {
                if ($scope.conditions.fleetId
                        || $scope.conditions.startRepairDate
                        || $scope.conditions.endRepairDate
                        || $scope.conditions.licensePlateNo) {
                    repairmentService.exportReport($scope.conditions).then((result) => {
                        result.data.status === 'SUCCESS' ?  simpleModal('导出成功，请到文件列表下载') : simpleModal('导出失败');
                    });
                } else {
                    simpleModal('请设置任一条件，再导出表单');
                }
            }
        };

        $scope.locateToDetail = (detail) => {
            if ($scope.isCaptain) {
                if (detail.reportTypeName === '事故申报') {
                    $state.go('accidentDetailForFleet', { id: detail.dataId });
                } else if (detail.reportTypeName === '月检') {
                    $state.go('repairment.detail', { id: detail.id, role: 'captainWeekly' });
                } else {
                    $state.go('repairment.detail', { id: detail.id, role: 'captain' });
                }
            } else {
                if (detail.reportTypeName === '事故申报') {
                    $state.go('accidentDetailForUser', { id: detail.dataId });
                } else if (detail.reportTypeName === '月检') {
                    $state.go('repairment.detail', { id: detail.id, role: 'commonWeekly' });
                } else {
                    $state.go('repairment.detail', { id: detail.id, role: 'common' });
                }
            }
        };

        $scope.fillTargetWord = (detail) => {
            if ($scope.isCaptain) {
                if (detail.dealStatus == 0) {
                    return ['确立责任人', '确立责任人', '填写车队意见'][detail.reportType];
                } else {
                    return '查看详情';
                }
            } else {
                return '查看详情';
            }
        };

        queryFleets();
        queryCities();

        function queryRecords () {
            correctConditionBody();

            if ($scope.isCaptain) {
                $scope.conditions.currentStatus = null;
                $scope.conditions.multipleStatus = [1,2,4];
            }

            repairmentService.queryRepairedList(
                angular.extend({ pageNo: $scope.pagination.current, rows: $scope.pagination.size }, $scope.conditions)
            ).then(response);
        }

        function queryFleets () {
            repairmentService.queryFleets().then((res) => {
                $scope.fleets = $scope.fleets.concat(res.data.data);
                $scope.conditions.fleetId = $scope.fleets[0];
            });
        }

        function queryCities () {
            organizationService.query('/api/common/queryCityByAuth.do').then((res) => {
                if (res.data.status === 'SUCCESS') {
                    res.data.data.map((d) => $scope.cities.push(d));
                }
            });
        }

        function response (result) {
            if (result.data.status === 'SUCCESS') {
                $scope.pagination.total = result.data.data.total;
                $scope.tableBody = result.data.data.rows;
            } else {
                $scope.tableBody = [];
            }
        }

        function tabSelect (index) {
            $scope.tableTitles = $scope.table.titles[index].title;
            $scope.tableKeys = $scope.table.titles[index].keys;
            $scope.conditions.currentStatus = index < 5 ? index : null;
            $scope.conditionsNeedSelected = angular.extend({}, $scope.originalConditionsNeedSelected);
            queryRecords();
        }

        function addSelect (tab) {
            tab.select = tabSelect;
            return tab;
        }

        function simpleModal (content) {
            return $uibModal.open({ size: 'sm', template: '<div style="padding: 10px; text-align: center">'+ content +'</div>' });
        }

        function correctConditionBody () {
            const conditionsNeedSelected = angular.extend({}, $scope.conditionsNeedSelected);
            angular.forEach(conditionsNeedSelected, (value, key) => RepairList.fixTheParams(conditionsNeedSelected, key, value));
            $scope.conditions = angular.extend($scope.conditions, conditionsNeedSelected);

            RepairList.filterEmptyString($scope.conditions, ['licensePlateNo']);

            $scope.conditions.startReportDate = RepairList.modifyTheDate($scope.reportTime.start.date);
            $scope.conditions.endReportDate = RepairList.modifyTheDate($scope.reportTime.end.date, 'end');
            $scope.conditions.startRepairDate = RepairList.modifyTheDate($scope.repairedTime.start.date);
            $scope.conditions.endRepairDate = RepairList.modifyTheDate($scope.repairedTime.end.date, 'end');
        }
    });
