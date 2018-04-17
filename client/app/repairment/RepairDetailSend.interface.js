'use strict';

import Reflect from '../../interface/Reflect';

class RepairDetailSend extends Reflect {
    fixTheTime(scopeSendTime, result) {
        scopeSendTime.date = result;
    }
}

export default new RepairDetailSend([
    'createTime',
    'createdBy',
    'delFlag',
    'id',
    'remark',
    'repairAddress',
    'repairDate',
    'repairId',
    'version'
]);
