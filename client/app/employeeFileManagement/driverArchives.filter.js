'use strict';
const angular = require('angular');
angular.module('shenmaApp')
    .filter('archiveStatus', () => {
        return (status) => {
            if (status == '1') {
                return true;
            } else {
                return false;
            }
        };
    })
    .filter('toString', () => {
        return (value) => {
            return String(value);
        };
    })
    .filter('placeholder', () => {
        return (value) => {
            if (value == '' || value == undefined || value == null) {
                return '- -';
            }else {
                return value;
            }
        };
    });
