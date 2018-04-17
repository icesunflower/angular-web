'use strict';

import './styles/styles.less';

window.moment = require('moment');
const angular = require('angular');
const uiAngular = require('angular-ui-bootstrap');
const uiRouter = require('angular-ui-router');
const ngAnimate = require('angular-animate');
const ngResource = require('angular-resource');
const loadingBar = require('angular-loading-bar');
const storage = require('angular-local-storage');
const ngSanitize = require('angular-sanitize');
const ngUploadFile = require('angular-file-upload');
const uploadFile = require('ng-file-upload');
const localStorage = require('angular-local-storage');
const angularMomentPicker = require('angular-moment-picker');
const uiSelect = require('ui-select');

window.moment.locale('zh-cn');
/*
ng的运行机制:
config阶段是给了ng上下文一个针对constant与provider修改其内部属性的一个阶段
而run阶段是在config之后的在运行独立的代码块，通常写法runBlock
ng启动阶段是 config-->run-->compile/link
*/
angular.module('shenmaApp', [
    uiAngular,
    'ui.router',
    ngAnimate,
    ngResource,
    loadingBar,
    storage,
    ngSanitize,
    'angularFileUpload',
    uploadFile,
    'moment-picker',
    'LocalStorageModule',
    'ui.select'
]).config((cfpLoadingBarProvider, $urlRouterProvider, $stateProvider, localStorageServiceProvider, momentPickerProvider) => {
    cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
    cfpLoadingBarProvider.latencyThreshold = 50;

    $urlRouterProvider.otherwise('/');
    $stateProvider.state({
        name: 'app',
        url: '/',
        views: {
            'content@': {
                template: ''
            }
        }
    });

    momentPickerProvider.options({
        /* Picker properties */
        locale:        'zh-cn',
        format:        'L LTS',
        minView:       'decade',
        maxView:       'minute',
        startView:     'day',
        autoclose:     true,
        today:         true,
        keyboard:      false,
        /* Extra: Views properties */
        leftArrow:     '&larr;',
        rightArrow:    '&rarr;',
        yearsFormat:   'YYYY',
        monthsFormat:  'MMM',
        daysFormat:    'D',
        hoursFormat:   'HH:[00]',
        minutesFormat: window.moment.localeData().longDateFormat('LT').replace(/[aA]/, ''),
        secondsFormat: 'ss',
        minutesStep:   1,
        secondsStep:   1
    });
    localStorageServiceProvider
    .setPrefix('cache') //设置一个前缀，以避免在应用程序的其他部分覆盖任何本地存储变量。
    .setDefaultToCookie(false);  //如果不支持localStorage，则库将默认为cookie可以被禁用。
}).run(($rootScope, $anchorScroll, $location) => {
    $rootScope.$on('$stateChangeStart', (event, state, stateParams, fromState, fromStateParams) => {
        $location.hash('main');
        $anchorScroll();
    });
});

require('./service');
require('./app');
require('./uiComponent');
