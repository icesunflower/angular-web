'use strict';
import commonTipsTemplate from '../inductionTraining/commonModel/commonTipsModel.html';
angular.module('shenmaApp')
    .controller('downloadController', ($scope, downloadService, $uibModal) => {
        $scope.table = { titles: ['序号', '创建时间', '名称', '状态', '说明', '操作'], body: [] };
        $scope.pagination = { current: 1, pageSize: 10, total: 0 };
        $scope.loading = false;
        $scope.noData = false;

        $scope.delete = (file) => {
            downloadService.delete(file.id).then((res) => {
                if (res.data.status === 'SUCCESS') {
                    $scope.tips = '删除成功';
                } else {
                    $scope.tips = '删除失败，请稍后再试';
                }
                $uibModal.open({
                    size: 'sm',
                    resolve: {
                        tips: () => {
                            return $scope.tips;
                        }
                    },
                    controller: ($scope, $uibModalInstance, tips) => {
                        $scope.tips = {
                            body: tips
                        }
                        $scope.ok = () => {
                            $uibModalInstance.close();
                        };
                    },
                    template: commonTipsTemplate,
                }).result.then(() => {
                    queryFiles();
                }, () => {
                    queryFiles();
                })
            });
        };

        $scope.pageChanged = () => queryFiles();

        function queryFiles() {
            $scope.table.body = [];
            $scope.loading = true;
            downloadService.update('/api/common/getDownLoadList.do', { pageNo: $scope.pagination.current, rows: $scope.pagination.pageSize }).then((res) => {
                $scope.loading = false;
                if (res.data.status === 'SUCCESS') {
                    if (res.data.data.rows && res.data.data.rows.length) {
                        $scope.table.body = res.data.data.rows;
                        $scope.pagination.total = res.data.data.total;
                        angular.forEach($scope.table.body, (item, key) => {
                            if (item.states === 'PROCESSING') {
                                item.states = '处理中';
                            } else if (item.states === 'FINISHED') {
                                item.states = '已完成';
                            } else if (item.states === 'FAILURE') {
                                item.states = '失败';
                            } else if (item.states === 'DELETE') {
                                item.states = '已删除';
                            }
                            if (item.downUrl) {
                                var downUrl = item.downUrl.split(':');
                                downUrl[0] = downUrl[0] + 's';
                                item.downUrl = downUrl.join(':');
                            }
                        })
                    } else {
                        $scope.noData = true;
                        $scope.pagination.total = 0;
                    }
                }
            })
        }

        queryFiles();
    });
