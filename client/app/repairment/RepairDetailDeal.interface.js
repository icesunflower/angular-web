'use strict';

import Reflect from '../../interface/Reflect';

class RepairDetailDeal extends Reflect {
    fixRepairIdForSelect(scope, names) {
        scope.repairIdForSelect = this.suggestionType ? names[this.suggestionType] : names[0];
    }
}

export default new RepairDetailDeal([
    'createTime',
    'createdBy',
    'delFlag',
    'estimateCompanyCost',
    'estimateDriverCost',
    'estimateOther',
    'estimateOtherCost',
    'estimateTotalCost',
    'id',
    'remark',
    'repairId',
    'suggestionType',
    'version'
]);
