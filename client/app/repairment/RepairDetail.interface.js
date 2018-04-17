'use strict';

import Reflect from '../../interface/Reflect';

class RepairDetail extends Reflect {
    fixDutyManRequestBody(scopeBasic) {
        scopeBasic.repairId = scopeBasic.id;
    }

    /*
     * Once the respId is empty, define it as the other responsible person.
     */
    isOtherResp(scopeBasic) {
        return !!scopeBasic.otherResp;
    }

    filter(filterKeysArray, result) {
        let rs = {}, i = 0, l = filterKeysArray.length;
        while (i < l) {
            rs[filterKeysArray[i]] = result[filterKeysArray[i]];
            i++;
        }
        return rs;
    }
}

export default new RepairDetail([
    'repair', //基本情况
    'repairDeal', //维修处理
    'repairSend', //送修信息
    'repairBack', //回场信息
]);
