'use strict';

/*
 * author luorongfang
 */
angular.module('shenmaApp')
    .factory('commonService', () => {
        /*
         * @return Promise<any>
         *
         * @example
         * commonService
         *      .method()
         */
        return {
            numAdd: (num1, num2, num3) => {
                var baseNum, baseNum1, baseNum2, baseNum3;
                baseNum1 = num1.toString().split(".")[1] ? num1.toString().split(".")[1].length : 0;
                baseNum2 = num2.toString().split(".")[1] ? num2.toString().split(".")[1].length : 0;
                baseNum3 = num3.toString().split(".")[1] ? num3.toString().split(".")[1].length : 0;
                baseNum = Math.pow(10, Math.max(baseNum1, baseNum2, baseNum3));
                return (num1 * baseNum + num2 * baseNum + num3 * baseNum) / baseNum;
            },

            numMulti: (num1, num2) => {
                var baseNum = 0;
                baseNum += num1.toString().split(".")[1] ? num1.toString().split(".")[1].length : 0;
                baseNum += num2.toString().split(".")[1] ? num2.toString().split(".")[1].length : 0;
                return Number(num1.toString().replace(".", "")) * Number(num2.toString().replace(".", "")) / Math.pow(10, baseNum);
            },

            filterCost: (cost) => {
                return cost ? cost / 100 : 0;
            }
        };
    });
