/**
 * Created by Administrator on 2018/4/8.
 */

const angular = require('angular');
import templateBsDemo from './bsDemo.template.html';
import bsHome from './tpls/home/home.html';
import bsAbout from './tpls/home/about.html';
import './bsDemo.less';

angular.module('shenmaApp')
    .config(($stateProvider) => {
        $stateProvider
            .state('bsDemo', {
                url: '/bsDemo?id',
                views: {
                    'content@': {
                        controller: ["$stateParams",function($stateParams){
                            console.log("dd"+$stateParams.id);// 1  这里实现传参
                        }],
                        template: templateBsDemo,
                    }
                }
            })
            .state('bsDemo.home', {
                url: '/home',
                views: {
                    'content@': {
                        template:bsHome ,
                        controller:'homeController'
                    }
                }
            })
            .state('bsDemo.about', {
                url: '/about',
                views: {
                    'about' : {
                        template:bsAbout
                    },
                    'columnOne': {
                        template:'<div>this is columnOne content</div>' ,
                    },
                    'columnTwo': {
                        template:'<div>this is columnTwo content</div>' ,
                    }
                },

            })
    });




