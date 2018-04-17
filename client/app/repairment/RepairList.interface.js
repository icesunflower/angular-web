'use strict';

import Reflect from '../../interface/Reflect';

class RepairList extends Reflect {
    constructor() {
        super();
        this.titleOfAll = {
            title: ['车型', '车牌', '当前管辖者', '所属车队', '上报人', '联系电话', '上报类型', '维修状态', '上报时间', '责任人'],
            keys: ['carTypeName', 'licensePlateNo', 'ownershipName', 'fleetName', 'reportUserName', 'phone', 'reportTypeName', 'currentStatusName', 'reportDateStr', 'respName'] };
        this.titleOfWaitingRepairment = {
            title: ['车型', '车牌', '当前管辖者', '所属车队', '上报人', '上报类型', '维修意见', '预估维修费', '上报时间'],
            keys: ['carTypeName', 'licensePlateNo', 'ownershipName', 'fleetName', 'reportUserName', 'reportTypeName', 'suggestionTypeName', 'estimateTotalCost', 'reportDateStr'] };
        this.titleOfRepaired = {
            title: ['车型', '车牌', '当前管辖者', '所属车队', '上报类型', '送修时间', '送修点'],
            keys: ['carTypeName', 'licensePlateNo', 'ownershipName', 'fleetName', 'reportTypeName', 'repairDateStr', 'repairAddress'] };
        this.titleOfWaitingToDealWith = {
            title: ['车型', '车牌', '当前管辖者', '所属车队', '上报人', '联系电话', '上报类型', '上报时间'],
            keys: ['carTypeName', 'licensePlateNo', 'ownershipName', 'fleetName', 'reportUserName', 'phone', 'reportTypeName', 'reportDateStr'] };
        this.titleOfRetrun = {
            title: ['车型', '车牌', '当前管辖者', '所属车队', '送修时间', '回场时间', '维修费'],
            keys: ['carTypeName', 'licensePlateNo', 'ownershipName', 'fleetName', 'repairDateStr', 'backDateStr', 'totalCost'] };
        this.titleOfRejected = {
            title: ['车型', '车牌', '当前管辖者', '所属车队', '上报人', '联系电话', '上报类型', '上报时间'],
            keys: ['carTypeName', 'licensePlateNo', 'ownershipName', 'fleetName', 'reportUserName', 'phone', 'reportTypeName', 'reportDateStr'] };
        this.titleOfCaptain = {
            title: ['车型', '车牌', '当前管辖者', '所属车队', '上报人', '上报类型', '处理状态', '维修状态', '上报时间', '责任人'],
            keys: ['carTypeName', 'licensePlateNo', 'ownershipName', 'fleetName', 'reportUserName', 'reportTypeName', 'dealStatusName', 'currentStatusName', 'reportDateStr', 'respName'] };
    }

    allStatusIndexs() {
        const all = ['待处理', '待送修', '已送修', '已驳回', '已回场', '全部'].map((title, index) => ({ title, index }));
        all.unshift( all.pop() );
        all.push( all.splice(4, 1)[0] );
        return all;
    }

    fixTheParams(scopeConditions, name, keys) {
        scopeConditions[name] = keys[name];
    }

    existDateOrNot(date) {
        return date ? date.format('YYYY/MM/DD') : date;
    }

    modifyTheDate(date, point) {
        const _date = this.existDateOrNot(date);
        return _date ? new Date(`${_date} ${point === 'end' ? '23:59:59' : '00:00:00'}`).getTime() : _date;
    }

    filterEmptyString(object, keys) {
        keys.map(k => typeof object[k] === 'string' && object[k].length === 0 ? object[k] = undefined : 0);
    }
}

export default new RepairList();
