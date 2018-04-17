'use strict';

const angular = require('angular');

/*
 * @author vanpipy
 */
angular.module('shenmaApp')
    .factory('repairmentService', ($Http) => {
        return {
            queryRepairedList: (condition) => $Http.post('/api/repair/queryRepairList.do', condition),

            queryFleets: () => $Http.get('/api/common/queryFleets.do'),

            queryRepairmentDetail: (data) => $Http.post('/api/repair/queryRepairDetail.do', data),

            ensureTheDuty: (data) => $Http.post('/api/repair/confirmResp.do', data),

            handleRepairment: (data) => $Http.post('/api/repair/deal.do', data),

            handleRepairmentRecord: (data) => $Http.post('/api/repair/send.do', data),

            handleReturnRecord: (data) => $Http.post('/api/repair/back.do', data),

            rejectThis: (data) => $Http.post('/api/repair/reject.do', data),

            querySomeoneByJobNo: (data) => $Http.post('/api/common/findByJobNo.do', data),

            exportReport: (data) => $Http.post('/api/repair/export.do', data),

            queryWeeklyDetail: (data) => $Http.post('/api/departmentCheck/getWeeklyCheckInfo.do', data),
        };
    });
