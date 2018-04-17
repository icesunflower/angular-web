
/*
 * @author vanpipy
 */
angular.module('shenmaApp')
    .factory('$Http', ($http, $uibModal) => {
        const methods = ['get', 'post', 'head', 'put', 'delete', 'jsonp', 'patch'];
        let modal;

        while (methods.length) {
            const key = methods.pop();
            Http[key] = (url, data, config) => {
                Http.req = angular.extend({ method: key.toUpperCase(), url, data }, config);
                return Http;
            };
        }

        Http.then = (success = () => {}, failure = () => {}) => {
            return $http(Http.req).then(response(success), response(failure));
        };

        function Http (req) {
            Http.req = angular.extend({}, req);
            Http.req.method = Http.req.method ? Http.req.method.toUpperCase() : 'GET';
            return Http;
        }

        function response (callback) {
            return (res) => {
                if (res.status >= 300 && res.status <= 401 || res.status == -1) {
                    if (modal) return;
                    modal = $uibModal.open({
                        size: 'md',
                        backdrop: 'static',
                        template: `
                            <h4 style="color: red; padding: 0 20px">您的登录状态已失效，请刷新页面重新登录。</h4>
                        `
                    });
                } else {
                    callback(res);
                }
            };
        }

        return Http;
    });
