'use strict';

/*
 * author jinluping
 */

const angular = require('angular');
const ajaxHeader = {
    'X-Requested-With': 'XMLHttpRequest'
};
angular.module('shenmaApp').factory('weeklyInspectionService', ($Http, $httpParamSerializerJQLike) => {
    return {
        //table列表
        listQuery: (url, config = {}) => $Http.post(url, config),
        //获取城市
        cityList: () => $Http.get('/api/common/queryCityByAuth.do'),
        //获取车队列表
        fleetsList: () => $Http.get('/api/common/queryFleets.do'),
        //获取车辆类型
        carTypeList: () => $Http.get('/api/car/queryCarTypes.do'),
        //获取车辆类型
        carColorList: () => $Http.get('/api/car/queryCarColor.do'),
        //获取单个车辆信息
        carSingleinfo: (data) => $Http.get('/api/car/queryCarInfo.do?id=' + data),
        //更改车队
        saveFleet: (config) => $Http.post('/api/car/changeFleet.do', config),
        //新增&修改车辆信息
        saveCar: (data) => {
            const promise = $Http({
                method: 'POST',
                url: '/api/car/saveCar.do',
                data: $httpParamSerializerJQLike(data),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            return promise;
        },
        //获取管辖者变化记录
        changeRecord: (data) => $Http.get('/api/car/queryCarOperateStatus.do?carId=' + data),
        //更改管辖者
        saveOwnership: (config) => $Http.post('/api/car/changeOperateStatus.do', config),
        //查询车辆列表
        carlistQuery: (config = {}) => $Http.post('/api/car/queryCarPage.do', config),
        //周检详情
        weeklydetQuery: (url, data) => {
            const promise = $Http({
                method: 'POST',
                url: url,
                data: $httpParamSerializerJQLike(data),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            return promise;
        },
        //修改周检基本信息
        weeklyBasicUpload: (url, config) => $Http.post(url, config),
    };
});
