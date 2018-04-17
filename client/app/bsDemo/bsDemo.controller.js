/**
 * Created by Administrator on 2018/4/8.
 */
const angular = require('angular');

import bsModel from './model/bsTipsModel.html';

angular.module('shenmaApp')
    .controller('bsDemoController', ($scope, $uibModal,$urlRouter) => {
     console.log($urlRouter)
        $scope.name = 'baosi';
        $scope.greeting = 'hello world!';
        $scope.season = "summer";
        $scope.desc = "";
        $scope.basicinfoEdit = false;
        $scope.hero = {
            name: 'sunwukong'
        };

        $scope.fruits = [
            {name: '苹果', value: 'apple'},
            {name: '香蕉', value: 'banana'},
        ];

        $scope.accidentInfo = {
            basicSituation: {
                occuredTime: '2018-04-08 01:01:02',
                carTypeName: "Audi",
                fleetName: "神马车队",
                historyInsurance: "无",
                accidentType: 0,
            }
        }

        $scope.log = (text) => {
            console.log('输出的内容为：' + text);
        };

        $scope.showModel = () => {
            $uibModal.open({
                size: 'lg',
                template: bsModel,
                controller: ($scope, $uibModalInstance) => {
                    $scope.tips = {
                        body: "this is a uibmodel",
                        sure: '确定',
                        cancel: "取消",
                    };

                    $scope.ok = () => {
                        $uibModalInstance.close();
                    };

                    $scope.cancel = () => {
                        $uibModalInstance.dismiss();
                    }
                }
            })
        }

    });