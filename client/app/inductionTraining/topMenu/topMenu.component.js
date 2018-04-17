'use strict';

const angular = require('angular');

import './topMenu.less';
import templateUrl from './topMenu.template.html';

/*
 * Component topMenu
 *
 * @author luorongfang
 * @component topMenu
 */
angular.module('shenmaApp')
    .component('topMenu', {
        bindings: {
            cityCode: '=',
            cityList: '='
        },
        template: templateUrl,
        controller: ($scope, topService) => {
            $scope.$ctrl.cityCode = '';
            function queryCityList() {
                topService.update('/api/common/queryCityByAuth.do').then((res) => {
                    if (res.data.status === 'SUCCESS') {
                        if (res.data.data && res.data.data.length) {
                            $scope.$ctrl.cityList = res.data.data;
                            $scope.$ctrl.cityList.unshift({ id: '', cityCode: '', cityName: '全部' })
                        } else {
                            $scope.$ctrl.cityList = [{ id: '', cityCode: '', cityName: '全部' }];
                        }
                    } else {
                        $scope.$ctrl.cityList = [{ id: '', cityCode: '', cityName: '全部' }];
                    }
                    $scope.$ctrl.cityCode = $scope.$ctrl.cityList[0].cityCode;
                })
            }

            queryCityList();
        }
    })
