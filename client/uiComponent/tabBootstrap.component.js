'use strict';

/*
 * @author vanpipy
 *
 * @param {Object} tabset
 * @param {Number} tabActived
 * @param {Number} tab.index
 * @param {String} tab.title
 * @param {Function} tab.select
 * @param {Boolean} tab.disabled
 */
angular.module('shenmaApp')
    .component('tabBootstrap', {
        bindings: {
            tabset: '=',
            tabActived: '='
        },
        template: `
            <div class="tab-panel">
                <uib-tabset active="$ctrl.tabActived">
                    <uib-tab index="tab.index" ng-repeat="tab in $ctrl.tabset" select="tab.select(tab.index)" disable="tab.disabled">
                        <uib-tab-heading>
                            {{ tab.title }}
                        </uib-tab-heading>
                    </uib-tab>
                </uib-tabset>
            </div>
        `
    });
