'use strict';

import { compose, curry } from 'compose-parallel';

import './organization.less';
import employeeTemplate from './employeeTemplate.html';
import departmentTemplate from './departmentTemplate.html';

angular.module('shenmaApp')
    .controller('organizationController', ($scope, $templateCache, $uibModal, organizationService, organizationUtil) => {
        const whether = curry((done, undo) => (condition) => condition ? done : undo);
        const nodeInterface = { name: '', parent: null, children: [], temporary: true, employNumber: 0 };

        $templateCache.put('children.html', `
            <div ng-mouseenter="company.hover = true" ng-mouseleave="company.hover = false">
                <i class="fa fa-lg fa-fw"
                    ng-show="company.children.length > 0"
                    ng-class="{ 'fa-caret-down': !company.isOpen, 'fa-caret-right': company.isOpen }"
                    ng-click="toggle(company)"></i>
                <i class="fa fa-lg fa-fw" ng-show="company.children.length == 0" ng-class="{ 'fa-angle-right': company.children.length == 0 }"></i>
                <input ng-click="displayDetail(company)" ng-change="limit(company, company.name)" ng-model="company.name"
                    ng-class="{ 'action': company.edit }" ng-readonly="!company.edit" title="{{ company.name }}">
                <span ng-if="company.employNumber > 0">&#91{{ company.employNumber }}&#93</span>
                <span ng-show="company.hover || company.edit">
                    <i class="fa fa-pencil-square-o fa-fw action" title="编辑" ng-click="edit(company)" ng-show="!company.edit"></i>
                    <i class="fa fa-floppy-o fa-fw action" title="保存" ng-click="save(company, company.parent, $index)" ng-show="company.edit"></i>
                    <i class="fa fa-plus-square-o fa-fw action" title="添加" ng-click="add(company)" ng-show="company.name && !company.edit"></i>
                    <i class="fa fa-trash fa-fw action" title="删除" ng-click="remove(company, company.parent, $index)" style="color: red" ng-show="!company.edit || company.name.length == 0"></i>
                </span>
                <span style="color: red">{{ company.error }}</span>
            </div>
            <ul ng-hide="company.hideChildren">
                <li ng-repeat="company in company.children track by $index" ng-include="'children.html'"></li>
            </ul>
        `);

        $scope.pagination = { current: 1, total: 0, size: 20 };
        $scope.hideBody = true;
        $scope.table = { titles: ['姓名', '工号', '联系电话', '邮箱', '操作'], result: [] };
        $scope.workingCity = { selected: {}, all: [] };
        $scope.company = [{ name: 'company', children: []}, { name: 'companyone', children: [] }];
        $scope.all = { name: 'all', children: $scope.company };
        organizationUtil.setParentNode($scope.all.children, $scope.all);
        $scope.all = [$scope.all];

        $scope.displayDetail = (node) => {
            if (!node.edit && node.name && node.name.length) {
                $scope.hideBody = false;
                $scope.table.title = node.name;
                $scope.table.departmentId = node.id;

                queryEmployee($scope, node.id);
            }
        };

        $scope.hideDetail = () => {
            $scope.hideBody = true;
        };

        let activeNode = [];
        $scope.edit = (node) => {
            node.edit = !node.edit;
            node._cache = { name: node.name };

            if (node.edit && node.name.length > 0) {
                if (activeNode.length === 0) {
                    activeNode.push(node);
                } else {
                    const oldCreatingNode = activeNode.shift();
                    const parentNode = oldCreatingNode.parent.children;
                    if (oldCreatingNode.name.length > 0) {
                        oldCreatingNode.edit = false;
                    } else {
                        parentNode.splice(parentNode.length - 1, 1);
                    }
                    activeNode.push(node);
                }
            }
        };

        $scope.save = (node, parentNode, index) => {
            debugger
            if (node.name.length === 0) {
                if (node.temporary) {
                    node.error = '部门名称不能为空';
                    return;
                } else {
                    node.name = node._cache.name;
                }
            } else {
                if (node.id) {
                    if (node._cache.name !== node.name) {
                        organizationService.update('/api/organizePart/updateOrganizePart.do', {
                            employNumber : node.employNumber,
                            id : node.id,
                            isEnd : node.isEnd,
                            parentId : node.parentId,
                            partName : node.name,
                            partNo : node.partNo,
                            version : node.version
                        }).then(_response(() => {
                            queryDepartments($scope);
                        }));
                    }
                } else {
                    organizationService.create('/api/organizePart/addOrganizePart.do', {
                        partName: node.name,
                        parentId: node.parent.id
                    }).then(_response(() => {
                        queryDepartments($scope);
                    }, () => {
                        parentNode.children.splice(index, 1);
                    }));
                }
            }

            node.edit = false;
            activeNode.shift();
        };

        $scope.add = (node) => {
            const newNode = angular.extend({}, nodeInterface);
            newNode.parent = node;

            //FIXME: Here is something to fix the new create queue length greater than 1.
            //Refactor it later.
            if (activeNode.length === 0) {
                activeNode.push(newNode);
            } else {
                const oldCreatingNode = activeNode.shift();
                const parentNode = oldCreatingNode.parent.children;
                if (oldCreatingNode.name.length > 0) {
                    oldCreatingNode.edit = false;
                } else {
                    parentNode.splice(parentNode.length - 1, 1);
                }
                activeNode.push(newNode);
            }

            node.children.push(newNode);
        };

        $scope.remove = (node, parentNode, index) => {
            const zeroEmployeeBy = whether(RemovingModal, blockRemovingModal);
            const resultFn = zeroEmployeeBy(node.employNumber === 0 && organizationUtil.countAllEmployee(node.children) === 0);
            resultFn(node, parentNode, index);

            if (node.name.length === 0) {
                activeNode.shift();
            }
        };

        $scope.toggle = (node) => {
            node.hideChildren = !node.hideChildren;
            node.isOpen = !node.isOpen;
        };

        const employeeEditStatus = whether(modifyEmployee, createEmployee);
        $scope.employeeModified = (employee) => {
            const action = curry(employeeEditStatus(employee));
            const resultFn = compose(employeeEditModal($scope, employeeTemplate), action(employee));
            resultFn($scope.workingCity);
        };

        $scope.departmentModified = (employee) => {
            const parentScope = $scope;
            $uibModal.open({
                size: 'md',
                template: departmentTemplate,
                controller: ($scope) => {
                    $scope.result = { name: employee.name, employee: employee };
                    $scope.workingDepartment = {
                        all: parentScope.treeForselect,
                        selected: parentScope.treeForselect[ parentScope.treeForselectIndex.indexOf(employee.organizePartId) ]
                    };

                    $scope.submit = () => {
                        debugger;
                        organizationService.update('/api/employee/modifPartForEmployee.do', {
                            id: $scope.result.employee.id,
                            organizePartId: $scope.workingDepartment.selected.id,
                            version: $scope.result.employee.version
                        }).then(_response(() => {
                            $scope.$dismiss();
                            queryEmployee(parentScope, employee.organizePartId);
                            queryDepartments(parentScope);
                        }));
                    };
                }
            });
        };

        $scope.pageChanged = () => {
            queryEmployee($scope, $scope.table.departmentId);
        };

        $scope.limit = (node, name) => {
            if (name.length > 20) {
                node.name = name.slice(0, 20);
            }
        };

        queryDepartments($scope);

        organizationService.query('/api/common/queryCityWithoutAuth.do').then((res) => {
            $scope.workingCity.all = res.data.status === 'SUCCESS' ? res.data.data : [];
            $scope.workingCity.codes = $scope.workingCity.all.map(d => d.cityCode);
        });

        function queryDepartments (scope) {
            organizationService.query('/api/organizePart/getOrganizePartTree.do').then((res) => {
                if (res.data.status === 'SUCCESS') {
                    scope.originalTree = res.data.data;
                    scope.originalTreeIndex = scope.originalTree.map(d => d.id);
                    scope.company = organizationUtil.reMapTreeNode(res.data.data);
                    scope.all = scope.company;
                    scope.treeForselect = organizationUtil.orderByGroup(scope.originalTree);
                    scope.treeForselectIndex = scope.treeForselect.map(d => d.id);
                }
            });
        }

        function queryEmployee (scope, departmentId) {
            organizationService.query('/api/organizePart/listEmployees.do', {
                organizepartid: departmentId, pageNo: scope.pagination.current, rows: 20
            }).then((res) => {
                if (res.data.status === 'SUCCESS') {
                    $scope.table.result = res.data.data.rows;
                    $scope.pagination.total = res.data.data.total;
                } else {
                    $scope.table.result = [];
                    $scope.pagination.total = 0;
                }
            });
        }

        function _response (success = () => {}, failure = () => {}) {
            return (res) => {
                if (res.data.status === 'SUCCESS') {
                    success(res.data);
                    $uibModal.open({
                        size: 'sm',
                        template: generateModalWrap('<span style="color: green">操作成功</span>', 'center'),
                        controller: autoCloseController
                    });
                } else {
                    failure(res.data);
                    $uibModal.open({
                        size: 'sm',
                        template: generateModalWrap(`<span style="color: red;">${res.data.errorMsg}</span>`),
                        controller: autoCloseController
                    });
                }
            };
        }

        function autoCloseController ($scope, $timeout) {
            const timer = $timeout(() => {
                $scope.$dismiss();
                $timeout.cancel(timer);
            }, 1000);
        }

        function generateModalWrap (html, align = 'left') {
            return '<div style="padding: 10px; text-align: '+ align +'">'+ html +'</div>';
        }

        function deletePromptHtml (word) {
            return '<p style="margin-top: 10px">'+ word +'</p>'+
                '<p style="text-align: right; margin-bottom: 10px">'+
                    '<button class="btn btn-primary btn-sm" ng-click="ensure()">确认</button>'+
                    '<button class="btn btn-default btn-sm" ng-click="$dismiss()" style="margin-left: 10px">取消</button>'+
                '</p>';
        }

        function blockRemovingModal () {
            $uibModal.open({
                size: 'sm',
                template: generateModalWrap('该部门或其下级部门有员工存在。请先移除员工，才能删除该部门。'+
                        '<p style="text-align: right; margin: 10px 0"><button class="btn btn-primary btn-sm" ng-click="$dismiss()">确定</button></p>')
            });
        }

        function RemovingModal (node, parentNode, index) {
            if (node.id) {
                const hintWord = whether('删除该部门，将会删除其所有子部门，是否确认删除?', '是否确认删除?');
                const deleteHint = compose(generateModalWrap, deletePromptHtml, hintWord);
                $uibModal.open({
                    size: 'sm',
                    template: deleteHint(node.children.length > 0),
                    controller: ($scope) => {
                        $scope.ensure = () => {
                            organizationService.delete('/api/organizePart/removeOrganizePart.do', { id: node.id }).then(_response(() => {
                                $scope.$dismiss();
                                parentNode.children.splice(index, 1);
                            }));
                        };
                    }
                });
            } else {
                parentNode.children.splice(index, 1);
            }
        }

        function createEmployee (employee, workingCity) {
            workingCity.disabled = false;
            workingCity.selected = workingCity.all[0];
            return { title: '添加员工', employee, workingCity, departmentId: $scope.table.departmentId };
        }

        function modifyEmployee (employee, workingCity) {
            workingCity.disabled = true;
            workingCity.selected = workingCity.all[workingCity.codes.indexOf(employee.areaCode)];
            return { title: '修改员工', employee: angular.extend({}, employee), workingCity, departmentId: $scope.table.departmentId };
        }

        function employeeEditModal (scope, template) {
            return (info) => {
                $uibModal.open({
                    size: 'md',
                    template,
                    backdrop: 'static',
                    controller: ($scope) => {
                        $scope.title = info.title;
                        $scope.employee = info.employee;
                        $scope.workingCity = info.workingCity;
                        $scope.submit = (employee) => {
                            if (!$scope.form.$valid) return;
                            $scope.submitting = true;
                            if ($scope.workingCity.disabled) {
                                organizationService.update('/api/employee/updateEmployee.do', employee).then(_response(() => {
                                    $scope.$dismiss();
                                    $scope.submitting = false;
                                    queryEmployee(scope, info.departmentId);
                                }, () => { $scope.submitting = false; }));
                            } else {
                                employee.areaCode = $scope.workingCity.selected.cityCode;
                                employee.organizePartId = info.departmentId;
                                if (employee.position == 2 && !employee.workPhone) { return; }
                                organizationService.create('/api/employee/addEmployee.do', employee).then(_response(() => {
                                    $scope.$dismiss();
                                    $scope.submitting = false;
                                    queryEmployee(scope, info.departmentId);
                                }, () => { $scope.submitting = false; }));
                            }
                        };
                    }
                });
            };
        }
    });
