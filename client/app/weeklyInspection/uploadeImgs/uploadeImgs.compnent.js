'use strict';

/*
 * Component uploadeImgs
 *
 * @author jinluping
 * @component uploadeImgs
 */

import template from './uploadeImgs.template.html';

angular.module('shenmaApp').component('uploadeImgs', {
    bindings: {

    },
    template,
    controller: ($scope,Upload) => {
        $scope.uploadImg = (file) => {
            console.log(file);
            // $scope.showAlert = true;
            // $scope.alertType = 'warning';
            // $scope.alertMsg = '受损照上传中...';
            // Upload.upload({
            //     url: '/api/file/uploadImg.do',
            //     file: file,
            // }).then((res) => {
            //     if (res.data.status == 'SUCCESS') {
            //         $scope.driverBasicInfo.idCardBackPic = res.data.data;
            //         $scope.alertType = 'success';
            //         $scope.alertMsg = '身份证背面照上传成功！';
            //     } else {
            //         $scope.alertType = 'danger';
            //         $scope.alertMsg = res.data.errorMsg;
            //     }
            //     $timeout(() => {
            //         $scope.showAlert = false;
            //     }, 1500);
            // });
        };
        //ngf-multiple控制是否可以上传多张图片
 
    // for multiple files:
    $scope.upload =(files) => {
        console.log(files);
        if (files && files.length) {
          for (var i = 0; i < files.length; i++) {
            Upload.upload({url:'/api/file/uploadImg.do', data: {file: files[i]}});
          }
          // or send them all together for HTML5 browsers:
          Upload.upload({url:'/api/file/uploadImg.do', data: {file: files[i]}});
        }
      }
    }
});
