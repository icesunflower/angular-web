'use strict';
const angular = require('angular');
const ajaxHeader = {
    'X-Requested-With': 'XMLHttpRequest'
};
angular.module('shenmaApp')
    .service('driverArchiveService', ($Http) => {
        return {
            // 城市列表
            cityList: () => {
                const promise = $Http({
                    method: 'get',
                    url: '/api/common/getUserLimitCityList.do',
                    headers: ajaxHeader
                });
                return promise;
            },
            // 血型
            bloodType: () => {
                const promise = $Http({
                    method: 'get',
                    url: '/api/common/getBloodTypeList.do',
                    headers: ajaxHeader
                });
                return promise;
            },
            // 人事状态
            jobStatus: () => {
                const promise = $Http({
                    method: 'get',
                    url: '/api/common/getPersonnelStatusList.do',
                    headers: ajaxHeader
                });
                return promise;
            },
            // 所有省份
            allProvinceList: () => {
                const promise = $Http({
                    method: 'get',
                    url: '/api/common/getAllProvinceList.do',
                    headers: ajaxHeader
                });
                return promise;
            },
            // 档案状态
            archiveStatus: () => {
                const promise = $Http({
                    method: 'get',
                    url: '/api/common/getArchiveStatusList.do',
                    headers: ajaxHeader
                });
                return promise;
            },
            // 驾驶证类型
            driverLicense: () => {
                const promise = $Http({
                    method: 'get',
                    url: '/api/common/getDrivingLicenceTypeList.do',
                    headers: ajaxHeader
                });
                return promise;
            },
            // 最高学历
            education: () => {
                const promise = $Http({
                    method: 'get',
                    url: '/api/common/getHighestEducationList.do',
                    headers: ajaxHeader
                });
                return promise;
            },
            // 户籍性质
            houseHold: () => {
                const promise = $Http({
                    method: 'get',
                    url: '/api/common/getHouseholdTypeList.do',
                    headers: ajaxHeader
                });
                return promise;
            },
            // 合同有效期
            validityOfContract: () => {
                const promise = $Http({
                    method: 'get',
                    url: '/api/common/getLaborContractValidPeriodList.do',
                    headers: ajaxHeader
                });
                return promise;
            },
            // 婚姻状况
            maritalStatus: () => {
                const promise = $Http({
                    method: 'get',
                    url: '/api/common/getMaritalStatusList.do',
                    headers: ajaxHeader
                });
                return promise;
            },
            // 政治面貌
            politicsStatus: () => {
                const promise = $Http({
                    method: 'get',
                    url: '/api/common/getPoliticsStatusList.do',
                    headers: ajaxHeader
                });
                return promise;
            },
            // 试用期时间
            probationPeriod: () => {
                const promise = $Http({
                    method: 'get',
                    url: '/api/common/getProbationPeriodList.do',
                    headers: ajaxHeader
                });
                return promise;
            },
            // 离职司机列表
            departedList: (data) => {
                const promise = $Http({
                    method: 'post',
                    data: data,
                    url: '/api/driverArchive/getResignationListPage.do',
                    headers: ajaxHeader
                });
                return promise;
            },
            // 在职司机列表
            jobingList: (data) => {
                const promise = $Http({
                    method: 'post',
                    data: data,
                    url: '/api/driverArchive/getOnJobListPage.do',
                    headers: ajaxHeader
                });
                return promise;
            },
            // 添加档案详情/基本信息
            addDriverBaseInfo: (data) => {
                const promise = $Http({
                    method: 'post',
                    data: data,
                    url: '/api/driverArchive/addBasicInfo.do',
                    headers: ajaxHeader
                });
                return promise;
            },
            // 添加档案详情/其他信息
            addDriverOtherInfo: (data) => {
                const promise = $Http({
                    method: 'post',
                    data: data,
                    url: '/api/driverArchive/addExt.do',
                    headers: ajaxHeader
                });
                return promise;
            },
            // 添加档案详情/工作履历
            addDriverJobResume: (data) => {
                const promise = $Http({
                    method: 'post',
                    data: data,
                    url: '/api/driverArchive/addResume.do',
                    headers: ajaxHeader
                });
                return promise;
            },
            // 确认离职
            confirmLeave: (data) => {
                const promise = $Http({
                    method: 'post',
                    data: data,
                    url: '/api/driverArchive/confirmResignation.do',
                    headers: ajaxHeader
                });
                return promise;
            },
            // 获取档案详情/基本信息
            getBasicInfo: (data) => {
                const promise = $Http({
                    method: 'post',
                    data: data,
                    url: '/api/driverArchive/getBasicInfo.do',
                    headers: ajaxHeader
                });
                return promise;
            },
            // 获取档案详情/其他信息
            getDriverOtherInfo: (data) => {
                const promise = $Http({
                    method: 'post',
                    data: data,
                    url: '/api/driverArchive/getExt.do',
                    headers: ajaxHeader
                });
                return promise;
            },
            // 获取档案详情/工作履历
            getDriverResume: (data) => {
                const promise = $Http({
                    method: 'post',
                    data: data,
                    url: '/api/driverArchive/getResume.do',
                    headers: ajaxHeader
                });
                return promise;
            },
            // 查看员工动态
            getDriverStatus: (data) => {
                const promise = $Http({
                    method: 'post',
                    data: data,
                    url: '/api/employeeWorkDynamic/get.do',
                    headers: ajaxHeader
                });
                return promise;
            },
            // 查看工作动态
            getDriverWorkStatus: (data) => {
                const promise = $Http({
                    method: 'post',
                    data: data,
                    url: '/api/employeeWorkDynamic/getWorkDynamic.do',
                    headers: ajaxHeader
                });
                return promise;
            },
            // 查找亲属员工
            getRelationEmployee: (data) => {
                const promise = $Http({
                    method: 'post',
                    data: data,
                    url: '/api/employee/getEmployeesByName.do',
                    headers: ajaxHeader
                });
                return promise;
            },
            // 保存图片
            savePic: (data) => {
                const promise = $Http({
                    method: 'post',
                    data: data,
                    url: '/api/file/uploadImg.do',
                    headers: ajaxHeader
                });
                return promise;
            },
            //导出在职员工
            downLoad: (data) => {
                const promise = $Http({
                    method: 'post',
                    data: data,
                    url: '/api/driverArchive/exportOnJobDrivers.do',
                    headers: ajaxHeader
                });
                return promise;
            },
            //导出在职员工
            downloadDeparting: (data) => {
                const promise = $Http({
                    method: 'post',
                    data: data,
                    url: '/api/driverArchive/exportResignedDrivers.do',
                    headers: ajaxHeader
                });
                return promise;
            }
        };
    });
