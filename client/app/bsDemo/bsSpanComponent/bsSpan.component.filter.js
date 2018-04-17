/**
 * Created by Administrator on 2018/4/10.
 */

const angular = require('angular');

angular.module('shenmaApp')
    .filter('capitalize', () => {
        return function (input) {
            if(input.length > 0 ){
                return input[0].toUpperCase() + input.slice(1)
            }
        }
    })