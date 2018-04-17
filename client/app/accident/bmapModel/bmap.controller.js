'use strict';

const angular = require('angular');

import './bmap.less';

angular.module('shenmaApp')
    .controller('bmapModelController', ($scope, $uibModalInstance) => {
        var map;
        var marker;

        function newAddressMap() {
            map = new BMap.Map('map'); //创建地图实例
            var point = new BMap.Point(104.06, 30.67); //创建点坐标
            map.centerAndZoom(point, 13); //初始化地图，设置中心点和地图级别
            map.enableScrollWheelZoom(true); //使用滚轮缩放
            marker = new BMap.Marker(point); // 创建标注
            map.addOverlay(marker); // 将标注添加到地图中
            marker.enableDragging(); //设置可拖拽
            getAutocomplete();
            moveMap();
        }
        //百度自动联想关键字
        function getAutocomplete() {
            var ac = new BMap.Autocomplete( //建立一个自动完成的对象
                {
                    "input": "suggestId",
                    "location": map
                });
            ac.addEventListener("onconfirm", (e) => { //鼠标点击下拉列表后的事件
                var _value = e.item.value;
                $scope.myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
                setPlace();
            });
        }
        //地图标注
        function setPlace() {
            map.clearOverlays(); //清除地图上所有覆盖物
            function myFun() {
                var gc = new BMap.Geocoder();
                $scope.pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
                gc.getLocation($scope.pp, (res) => {});
                map.centerAndZoom($scope.pp, 18); //pp经纬度
                map.addOverlay(new BMap.Marker($scope.pp)); //添加标注
            }

            var local = new BMap.LocalSearch(map, { //智能搜索
                onSearchComplete: myFun
            });
            local.search($scope.myValue); //myValue详细地址
        }

        //通过移动地图获取位置信息
        function moveMap() {
            function Geocoder(center) {
                $scope.accidentAddress = '';
                $scope.myValue = '';
                var gc = new BMap.Geocoder();
                gc.getLocation(center, (rs) => {
                    if (rs.surroundingPois[0] != undefined) {
                        var addPois = rs.surroundingPois[0];
                        $scope.myValue = rs.address + "(" + addPois.title + ")";
                    } else {
                        $scope.myValue = rs.address;
                    }
                    document.getElementById("suggestId").value = $scope.myValue;
                    map.centerAndZoom($scope.pp); //pp经纬度
                    map.addOverlay(new BMap.Marker($scope.pp)); //添加标注
                });
            }

            map.addEventListener("dragend", () => {
                $scope.pp = map.getCenter();
                map.clearOverlays(); //清除地图上所有覆盖物
                Geocoder($scope.pp);
            });
        }

        setTimeout(newAddressMap, 100); //加载地图
        $scope.getAddress = () => {
            $scope.address = {
                address: $scope.myValue,
                lat: $scope.pp.lat,
                lng: $scope.pp.lng,
            }
            $uibModalInstance.close($scope.address);
        };
    })
