/**
 * Created by Administrator on 2018/4/9.
 */
const angular = require('angular');

import bsTable from './bsTableComponent.template.html';


angular.module('shenmaApp')
    .component('bsTable', {
        template: bsTable,
        controller: ($scope,$Http) => {
            $scope.loading = false;
            $scope.noData = false;
            $scope.status;
            $scope.table = {
                titles: ['车牌', '车型', '所属车队', '责任人', '联系电话', '状态', '事故时间', '操作'],
                body: []
            };
            $scope.pagination = {
                current: 1,
                pageSize: 10,
                total: 0,
            };

            // 获取事故列表
            function getAccidentList() {
                $scope.loading = true;
                $scope.table.body = [];
                $Http.get('./app/bsDemo/bsTableComponent/bstable.json', {}).then((res) => {
                    $scope.loading = false;
                    if (res.data.status === 'SUCCESS') {
                        if (res.data.data) {
                            if (res.data.data.rows) {
                                if (res.data.data.rows.length) {
                                    $scope.noData = false;
                                    $scope.table.body = res.data.data.rows;
                                    $scope.pagination.total = res.data.data.total;
                                } else {
                                    $scope.pagination.total = 0;
                                    $scope.noData = true;
                                }
                            } else {
                                $scope.pagination.total = 0;
                                $scope.noData = true;
                            }
                        } else {
                            $scope.pagination.total = 0;
                            $scope.noData = true;
                        }
                    }
                })
            }

            getAccidentList();


        }
    })