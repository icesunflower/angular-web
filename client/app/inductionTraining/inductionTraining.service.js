'use strict';

/*
 * author luorongfang
 */
angular.module('shenmaApp')
    .factory('inductionTrainingpService', ($Http) => {
        const config = {};
        /*
         * @return Promise<any>
         *
         * @example
         * organizationService
         *      .method()
         *      .then(success<Function>, failure<Function>)
         *      .catch(error<Function>);
         */
        return {
            query: (url, config = {}) => $Http.get(url, config),

            update: (url, config = {}) => $Http.post(url, config),

            delete: () => $Http.delete('', config),

            orDelete: () => $Http.post('', config),

            create: () => $Http.post('', config)
        };
    });
