'use strict';

/*
 * author vanpipy
 */
angular.module('shenmaApp')
    .factory('organizationService', ($Http) => {
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
            query: (url, config = {}) => $Http.post(url, config),

            update: (url, config = {}) => $Http.post(url, config),

            delete: (url, config = {}) => $Http.post(url, config),

            create: (url, config = {}) => $Http.post(url, config)
        };
    });
