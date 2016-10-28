/**
 * @author harimasora
 * created on 26.10.2016
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.dashboard')
        .controller('DashboardTableCtrl', DashboardTableCtrl);

    /** @ngInject */
    function DashboardTableCtrl($scope, $filter, editableOptions, editableThemes, $firebaseObject, $firebaseArray) {

        var ref = firebase.database().ref().child('healthOperators');
        var hospitals = $firebaseArray(ref);

        $scope.hospitals = hospitals;

        $scope.smartTablePageSize = 10;

    }
})();