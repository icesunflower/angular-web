'use strict';

import RepairDetail from './RepairDetail.interface';
import RepairDetailBasic from './RepairDetailBasic.interface';
import RepairDetailDeal from './RepairDetailDeal.interface';
import RepairDetailSend from './RepairDetailSend.interface';
import RepairDetailBack from './RepairDetailBack.interface';

/*
 * @author vanpipy
 */
angular.module('shenmaApp')
    .controller('repairmentDetailController', ($scope, $state, $stateParams, $uibModal, repairmentService, $timeout, weeklyInspectionService) => {
        const isCaptain = () => /captain/.test($stateParams.role);
        const today = moment(new Date());
        $scope.today = today;
        $scope.weekly = /Weekly/.test($stateParams.role);
        $scope.isCaptain = isCaptain();

        $scope.sendTime = { date: today };
        $scope.returnTime = { date: today };
        $scope.advises = ['暂缓维修', '立即维修'];
        $scope.repairIdForSelect = $scope.advises[0];
        $scope.currentStatus = -1;
        $scope.itsOwnership = 1;

        $scope.textArea = {
            upperBound: 50,
            limit: (validWords, key) => {
                if (validWords && validWords.length > $scope.textArea.upperBound) {
                    $scope.body[key] = validWords.slice(0, $scope.textArea.upperBound);
                }
            }
        };

        $scope.limit15 = (word) => {
            if (word && word.length > 15) {
                $scope.send.repairAddress = word.slice(0, 15);
            }
        };

        $scope.sumByPretotal = (value, key) => {
            value = number(value);
            if (value < 0) {
                $scope.deal[key] = '';
            } else {
                $scope.deal.estimateTotalCost = number($scope.deal.estimateDriverCost) + number($scope.deal.estimateCompanyCost) + number($scope.deal.estimateOtherCost);
            }
        };

        $scope.sumByTotal = (value, key) => {
            value = number(value);
            if (value < 0) {
                $scope.back[key] = '';
            } else {
                $scope.back.totalCost = number($scope.back.driverCost) + number($scope.back.companyCost) + number($scope.back.otherCost);
            }
        };

        $scope.handleEnsureDuty = () => {
            const parentScope = $scope;
            let _body = {};
            RepairDetail.fixDutyManRequestBody($scope.basic);

            if ($scope.basic.otherResponsibleId) {
                _body = RepairDetail.filter(['repairId', 'otherResp', 'confirmRespRemark'], $scope.basic);
            } else {
                $scope.basic.respId = $scope.dutyMan.selected.id;
                $scope.basic.respName = $scope.dutyMan.selected.name;
                _body = RepairDetail.filter(['repairId', 'respId', 'respName', 'confirmRespRemark'], $scope.basic);
            }

            if ($scope.currentStatus == 4) {
                $uibModal.open({
                    size: 'sm',
                    template: `
                        <div style="padding: 10px">
                            <p>由于该记录维修状态是“已回场”，此模块保存后将不可编辑，是否确认保存。</p>
                            <div class="margin-top" style="text-align: right">
                                <button class="btn btn-default btn-sm" ng-click="cancel()">否</button>
                                <button class="btn btn-primary btn-sm margin-left" ng-click="ensure()">是</button>
                            </div>
                        </div>
                    `,
                    controller: ($scope) => {
                        $scope.ensure = () => {
                            $scope.$dismiss();
                            repairmentService.ensureTheDuty(_body).then(response);
                        };

                        $scope.cancel = () => {
                            $scope.$dismiss();
                            parentScope.basic.respId = undefined;
                            parentScope.basic.otherResp = undefined;
                        };
                    }
                });
            } else {
                repairmentService.ensureTheDuty(_body).then(response);
            }
        };

        $scope.handleRepairment = () => {
            $scope.deal.repairId = $scope.basic.id;
            $scope.deal.suggestionType = $scope.advises.indexOf($scope.repairIdForSelect);
            repairmentService.handleRepairment($scope.deal).then(response);
        };

        $scope.handleRepairmentRecord = () => {
            $scope.send.repairId = $scope.basic.id;
            $scope.send.repairDate = $scope.sendTime.date._d.getTime();
            repairmentService.handleRepairmentRecord($scope.send).then(response);
        };

        $scope.handleReturnRecord = () => {
            const parentScope = $scope;
            $scope.back.repairId = $scope.basic.id;
            $scope.back.backDate = $scope.returnTime.date._d.getTime();
            $uibModal.open({
                size: 'sm',
                controller: ($scope) => {
                    $scope.submit = () => {
                        $scope.$dismiss();
                        repairmentService.handleReturnRecord(parentScope.back).then(response);
                    };
                },
                template: `
                    <div style="padding: 10px">
                        <div>保存回场记录后，维修管理模块将不可编辑。请确认是否保存。</div>
                        <div style="text-align: right; margin-top: 20px;">
                            <button class="btn btn-primary btn-sm" style="margin-right: 5px" ng-click="submit()">是</button>
                            <button class="btn btn-default btn-sm" ng-click="$dismiss()">否</button>
                        </div>
                    </div>
                `
            });
        };

        $scope.ensureDuty = {
            edit: false,
            disabled: !isCaptain(),
            save: $scope.handleEnsureDuty
        };

        $scope.adviseForRepairment = {
            edit: false,
            disabled: isCaptain(),
            save: $scope.handleRepairment
        };

        $scope.repairmentRecord = {
            edit: false,
            disabled: isCaptain(),
            save: $scope.handleRepairmentRecord
        };

        $scope.returnRecord = {
            edit: false,
            disabled: isCaptain(),
            save: $scope.handleReturnRecord
        };

        $scope.handleEditor = (formKey, scopeKey, event) => {
            event ? event.preventDefault(): 0;
            $scope[scopeKey + 'cache'] = angular.extend({}, $scope[scopeKey]);
            $scope[formKey].edit = true;
            $scope.currentEditor = formKey;
        };

        $scope.handleEditorForSaving = (key) => {
            if ($scope[key + 'Form'].$valid) {
                $scope[key].edit = false;
                $scope.currentEditor = $scope.currentStatus == 4 ? 'nothing' : 'all';
                $scope[key].save();
            }
        };

        $scope.handleEditorCancel = (formKey, scopeKey, event) => {
            $scope[formKey].edit = false;
            $scope[scopeKey] = $scope[scopeKey + 'cache'];
            $scope.currentEditor = $scope.currentStatus == 4 ? 'nothing' : 'all';
            $scope.sumByPretotal();
        };

        $scope.handleRejected = (key) => {
            const _id = $scope.basic.id;
            $scope[key].edit = false;
            $uibModal.open({
                size: 'sm',
                controller: ($scope, $timeout, $uibModalStack) => {
                    $scope.submit = () => {
                        repairmentService.rejectThis({ repairId: _id, rejectCause: $scope.rejectCause }).then(response);
                        $timeout(() => $uibModalStack.dismissAll(), 1000);
                        $timeout(() => $state.go($state.current, $stateParams, { reload: true }), 1500);
                    };
                    $scope.limit50 = (words, key) => $scope[key] = words.length > 50 ? words.slice(0, 50) : $scope[key];
                },
                template: `
                    <div style="padding: 10px">
                        <div>是否驳回该上报，驳回后该记录将不能编辑</div>
                        <form name="modalForm" novalidate>
                            <textarea class="form-control margin-top-large" required
                                style="resize: none"
                                ng-model="rejectCause" name="rejectCause"
                                ng-change="limit50(rejectCause, 'rejectCause')"
                                placeholder="请输入驳回原因(必填)"></textarea>
                            <div style="text-align: right; margin-top: 20px;">
                                <button class="btn btn-primary btn-sm" style="margin-right: 5px" ng-click="submit()" ng-disabled="!modalForm.$valid">确认</button>
                                <button class="btn btn-default btn-sm" ng-click="$dismiss()">取消</button>
                            </div>
                        </form>
                    </div>
                `
            });
        };

        $scope.checkPicture = (url) => {
            hintModal('<img src="'+ url +'" style="width: 100%">', 'md');
        };

        $scope.dutyMan = {
            selected: {},
            all: [],
            refresh: (jobNo) => {
                querySomeone(jobNo);
            }
        };

        $scope.tryToFillForm = () => {
            const parentScope = $scope;
            $uibModal.open({
                size: 'sm',
                backdrop: 'static',
                controller: ($scope) => {
                    $scope.submit = () => {
                        $scope.$dismiss();
                        parentScope.currentStatus = 0;
                    };
                },
                template: `
                    <div style="padding: 10px">
                        <div>是否进行维修，维修后，将不能驳回该记录。</div>
                        <div style="text-align: right; margin-top: 20px;">
                            <button class="btn btn-primary btn-sm" style="margin-right: 5px" ng-click="submit()">确认</button>
                        </div>
                    </div>
                `

            });
        };

        $scope.hidePartWithCurrentStatus = (groupArray) => groupArray.indexOf($scope.currentStatus) > -1;

        $scope.currentEditor = 'all';
        $scope.activateEditor = (which) => {
            if ($scope.currentEditor === 'all') {
                return false;
            } else {
                return !$scope[which].edit;
            }
        };

        $scope.detectReponsibleEditStatus = (currentStatus) => {
            if (currentStatus == 4) {
                if ($scope.basic.respId || $scope.basic.otherResp) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        };

        queryDetail();

        function response (result) {
            result.data.status === 'SUCCESS' ? hintModal('保存成功') : hintModal(result.data.errorMsg);
            queryDetail();
        }

        function queryDetail () {
            repairmentService.queryRepairmentDetail({ id: $stateParams.id }).then((result) => {
                if (result.data.status === 'SUCCESS') {
                    RepairDetail.reflect(result.data.data);
                    RepairDetailBasic.reflect(RepairDetail.getAttr('repair'));
                    RepairDetailDeal.reflect(RepairDetail.getAttr('repairDeal'));
                    RepairDetailSend.reflect(RepairDetail.getAttr('repairSend'));
                    RepairDetailBack.reflect(RepairDetail.getAttr('repairBack'));

                    $scope.basic = RepairDetailBasic.getResult();
                    $scope.deal = RepairDetailDeal.getResult();
                    $scope.send = RepairDetailSend.getResult();
                    $scope.back = RepairDetailBack.getResult();
                    $scope.currentStatus = $scope.basic.currentStatus == 0 ? -1 : $scope.basic.currentStatus;
                    $scope.currentEditor = $scope.currentStatus == 4 ? 'nothing' : 'all';

                    if (RepairDetail.isOtherResp($scope.basic)) {
                        $scope.dutyMan.selected.name = '';
                        $scope.basic.otherResponsibleId = true;
                    } else {
                        $scope.dutyMan.selected.name = $scope.basic.respName;
                        $scope.dutyMan.selected.respId = $scope.basic.respId;
                        $scope.basic.otherResponsibleId = false;
                    }

                    RepairDetailDeal.fixRepairIdForSelect($scope, $scope.advises);
                    RepairDetailSend.fixTheTime($scope.sendTime, moment($scope.send.repairDate));
                    RepairDetailBack.fixTheTime($scope.returnTime, moment($scope.back.backDate));

                    $scope.basic.rummagerName = result.data.data.checkUserName;
                    $scope.deal.ownership = $scope.basic.ownership;

                    weeklyInspectionService.carSingleinfo($scope.basic.carId).then((result) => {
                        $scope.itsOwnership = result.data.data.ownership == 2 ? 0 : result.data.data.ownership;
                    });
                }
            });
        }

        function querySomeone (jobNo) {
            repairmentService.querySomeoneByJobNo({ data: jobNo }).then((result) => {
                if (result.data.status === 'SUCCESS' && result.data.data) {
                    $scope.dutyMan.all = result.data.data;
                } else {
                    $scope.dutyMan.all = [{ name: '请输入正确的工号' }];
                }
            });
        }

        function hintModal (message, sizeClass = 'sm') {
            return $uibModal.open({
                size: sizeClass,
                template: '<div style="padding: 10px; text-align: center">'+ message +'</div>',
                controller: ($scope, $timeout) => {
                    const timer = $timeout(() => {
                        $scope.$dismiss();
                        $timeout.cancel(timer);
                    }, 2000);
                }
            });
        }

        function number (string) {
            return string && string !== '-' ? Number(string) : 0;
        }
    });
