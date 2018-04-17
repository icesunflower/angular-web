'use strict';

angular.module('shenmaApp').controller('inspectionDetailCtrl', ($scope, $stateParams, $filter, $uibModal, $location, weeklyInspectionService) => {
    $scope.weeklyCarNo = $stateParams.carNo;
    $scope.weeklyownership = $stateParams.ownershipId;
    $scope.noData = false;
    $scope.bigTotalItems = 0;
    $scope.weeklyListData = {
        "rows": 5,
        "pageNo": '1', //第一页
        "carNo": $scope.weeklyCarNo,
    };
    //周检详情id
    $scope.whichweeklyId = null;
    //周检编辑按钮
    $scope.btnweeklyEdit = '修改';
    $scope.ifcanEdit = false;
    //复选框
    $scope.selTitle = {
        insurc: '证照保险',
        checkP: '运行检查'
    };
    $scope.selCompInsurc = [];
    $scope.selCompCheck = [];
    //时间设置
    const nowDate = new Date();
    $scope.dateFormat = 'yyyy-MM-dd';
    $scope.datepicker = {
        startDate: null,
        endDate: null,
    };
    //获取周检列表
    function weeklyListQuery() {
        const update = {};
        update.startDate = Date.parse($filter('date')($scope.datepicker.startDate, 'yyyy-MM-dd HH:00'));
        update.endDate = Date.parse($filter('date')($scope.datepicker.endDate, 'yyyy-MM-dd HH:00'));
        $scope.tableList = [];
        $scope.noData = false;
        const weeklylistQueryData = angular.extend($scope.weeklyListData, update);
        weeklyInspectionService.listQuery('/api/departmentCheck/getWeeklyCheckBeanPage.do', weeklylistQueryData).then((res) => {
            if (res.data.status == 'SUCCESS') {
                if (res.data.data.rows && res.data.data.rows.length) {
                    $scope.tableList = res.data.data.rows;
                    $scope.bigTotalItems = res.data.data.total;
                    viewDetails($scope.tableList[0]);
                    carDamage($scope.tableList[0].id);
                    $scope.nowcarId = $scope.tableList[0].id; //现在查看的周检详情id
                    if (($scope.weeklyListData.pageNo == "1") && ($scope.bigTotalItems > 0)) { //能否编辑
                        $scope.showEditbtn = true;
                        $scope.showAddbtn = true;
                        $scope.btnweeklyEdit = '修改';
                        $scope.ifcanEdit = false;
                    } else {
                        $scope.showEditbtn = false;
                        $scope.showAddbtn = false;
                        $scope.ifcanEdit = false;
                    }
                    angular.forEach($scope.tableList, (item) => { //选中改变颜色
                        item.isshow = false;
                    });
                    $scope.tableList[0].isshow = true;
                } else {
                    $scope.noData = true;
                    $scope.bigTotalItems = 0;
                }
            }
        });
    }
    weeklyListQuery();

    $scope.queryValuePre = () => {
        $scope.weeklyListData.pageNo = "1";
        weeklyListQuery();
    }
    $scope.changePage = () => {
        weeklyListQuery();
    }

    //根据ID获取周检详情
    function viewDetails(whichData) {
        $scope.whichweeklyId = whichData.id;
        $scope.nowShowTime = whichData.testingTime;
        $scope.selCompInsurc = [];
        $scope.selCompCheck = [];
        weeklyInspectionService.weeklydetQuery('/api/departmentCheck/getWeeklyCheckInfo.do', {
            id: whichData.id
        }).then((res) => {
            $scope.basicInfo = res.data.data;
            $scope.selCompInsurc = eval('(' + $scope.basicInfo.insuranceProblems + ')');
            $scope.selCompCheck = eval('(' + $scope.basicInfo.checkProblems + ')');
        })
    }

    $scope.forviewDetails = (data, _key) => {
        viewDetails(data);
        carDamage(data.id);
        $scope.nowcarId = data.id; //现在查看的周检详情id
        angular.forEach($scope.tableList, (item) => { //选中改变颜色
            item.isshow = false;
        });
        $scope.tableList[_key].isshow = true;
        //判断能否编辑按钮
        if ((_key == '0') && ($scope.weeklyListData.pageNo == '1')) {
            $scope.showEditbtn = true;
            $scope.showAddbtn = true;
            $scope.btnweeklyEdit = '修改';
            $scope.ifcanEdit = false;
        } else {
            $scope.showEditbtn = false;
            $scope.showAddbtn = false;
            $scope.ifcanEdit = false;
        }
    }
    $scope.subbasic = () => {
        if ($scope.btnweeklyEdit == "修改") {
            $scope.ifcanEdit = true;
            $scope.btnweeklyEdit = '保存';
            $scope.showAddbtn = false;
        } else {
            uploadBasic();
            $scope.showAddbtn = true;
        }
    }

    function uploadBasic() {
        const _insuranceProblems = [],
            _checkProblems = [],
            aSelCompInsurc = $scope.selCompInsurc,
            aSelCompCheck = $scope.selCompCheck;

        for (var i = 0; i < aSelCompInsurc.length; i++) {
            const selin = {};
            selin.id = aSelCompInsurc[i].id;
            selin.categoryName = aSelCompInsurc[i].categoryName;
            selin.checked = aSelCompInsurc[i].checked;
            _insuranceProblems.push(selin);
        }
        for (var i = 0; i < aSelCompCheck.length; i++) {
            const selch = {};
            selch.id = aSelCompCheck[i].id;
            selch.categoryName = aSelCompCheck[i].categoryName;
            selch.checked = aSelCompCheck[i].checked;
            _checkProblems.push(selch);
        }

        const newbasicInfo = angular.extend({}, $scope.basicInfo);
        const weeklyBasicData = {
            id: $scope.whichweeklyId,
            rummagerName: newbasicInfo.rummagerName,
            testingTime: newbasicInfo.testingTime,
            insuranceProblems: JSON.stringify(_insuranceProblems),
            insuranceDes: newbasicInfo.insuranceDes,
            checkProblems: JSON.stringify(_checkProblems),
            checkDes: newbasicInfo.checkDes
        };
        weeklyInspectionService.weeklyBasicUpload('/api/departmentCheck/updateBaseInfo.do', weeklyBasicData).then((res) => {
            $scope.btnweeklyEdit = '修改';
            $scope.ifcanEdit = false;
            weeklyListQuery();
        });
    }

    //根据weeklyCheckId获取车损情况
    function carDamage(whichDataId) {
        $scope.cardamageDetail = [];
        const weeklyCheckId = {
            'dataId': whichDataId
        };
        weeklyInspectionService.weeklyBasicUpload('/api/repair/queryRepairsByCheckId.do', weeklyCheckId).then((res) => {
            $scope.cardamageDetail = res.data.data;
        })
    }

    //跳转维修详情
    $scope.gorepairment = (id) => {
        $location.path('/repairment/commonWeekly/' + id);
    }

});
