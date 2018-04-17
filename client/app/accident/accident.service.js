'use strict';

/*
 * author luorongfang
 */
angular.module('shenmaApp')
    .factory('accidentService', ($Http, $http, $httpParamSerializerJQLike) => {
        const config = {};
        /*
         * @return Promise<any>
         *
         * @example
         * accidentService
         *      .method()
         *      .then(success<Function>, failure<Function>)
         *      .catch(error<Function>);
         */
        return {
            query: (url, config = {}) => $Http.post(url, config),

            update: (url, config = {}) => $Http.get(url, config),

            getItem: (url, data) => {
                const promise = $http({
                    method: 'POST',
                    url: url,
                    data: $httpParamSerializerJQLike(data),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });
                return promise
            },

            deleteImg: (fileName) => {
                return $Http.get(`/api/file/deleteImg.do?fileName=${fileName}`);
            },

            getDetail: (id) => {
                return $Http.get(`/api/accident/getDetail.do?id=${id}`);
            },
        };
    });
