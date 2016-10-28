/**
 * @author harimasora
 * created on 26.10.2916
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.dashboard')
        .directive('dashboardTable', dashboardTable);

    /** @ngInject */
    function dashboardTable() {
        return {
            restrict: 'EA',
            controller: 'DashboardTableCtrl',
            templateUrl: 'app/pages/dashboard/dashboardTable/dashboardTable.html'
        };
    }
})();