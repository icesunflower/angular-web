'use strict';

/*
 * author vanpipy
 */
angular.module('shenmaApp')
    .factory('downloadService', ($Http) => {
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
            update: (url, config = {}) => $Http.post(url, config),
            delete: (id) => {
                const url = `/api/common/deleteExportFile.do?id=${id}`;
                return $Http.get(url);
            },
        };
    });
