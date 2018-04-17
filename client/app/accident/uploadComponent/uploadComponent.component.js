'use strict';

const angular = require('angular');

import './uploadComponent.less';
import templateUrl from './uploadComponent.template.html';

/*
 * Component uploadComponent
 *
 * @author luorongfang
 * @component uploadComponent
 * @param {!angular.$something} $something
 */
angular.module('shenmaApp')
    .component('uploadComponent', {
        bindings: {
            basicinfoEdit: '=',
            imgArr: '=',
            onDelete: '=',
            onOriginimg: '=',
            max: '=',
            isUploadImg: '='
        },
        template: templateUrl,
        controller: ($scope, Upload) => {
            if (!$scope.$ctrl.imgArr) {
                $scope.$ctrl.imgArr = [];
            }
            $scope.uploadImg = (file) => {
                if (file) {
                    Upload.upload({
                        url: '/api/file/uploadImg.do',
                        file: file,
                    }).then((res) => {
                        if (res.data.status === 'SUCCESS') {
                            if (res.data.data) {
                                $scope.$ctrl.imgArr.push(res.data.data);
                                if ($scope.$ctrl.imgArr.length >= $scope.$ctrl.max) {
                                    $scope.$ctrl.isUploadImg = false;
                                }
                            }
                        }
                    });
                }
            };
        }
    })
