angular.module('shenmaApp')
    .factory('topService', ($Http) => {
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
            query: () => $Http.get('', config),

            update: (url, config = {}) => $Http.post(url, config),

            delete: () => $Http.delete('', config),

            orDelete: () => $Http.post('', config),

            create: () => $Http.post('', config)
        };
    });
