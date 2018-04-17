'use strict';

import Reflect from '../../interface/Reflect';

class RepairDetailBack extends Reflect {
    fixTheTime(scopeReturnTime, result) {
        scopeReturnTime.date = result;
    }
}

export default new RepairDetailBack([
    'backDate',
    'companyCost',
    'createTime',
    'createdBy',
    'delFlag',
    'driverCost',
    'id',
    'other',
    'otherCost',
    'remark',
    'repairId',
    'totalCost',
    'version',
    'ownership'
]);
