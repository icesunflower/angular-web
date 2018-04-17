'use strict';

/*
 * author luorongfang
 */
angular.module('shenmaApp')
    .factory('insuranceService', ($Http) => {
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

            update: (url, config = {}) => $Http.post(url, config),

            delete: () => $Http.delete('', config),

            orDelete: () => $Http.post('', config),

            create: () => $Http.post('', config)
        };
    });