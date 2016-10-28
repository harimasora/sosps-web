/**
 * @author harimasora
 * created on 26.10.2016
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.dashboard')
        .controller('DashboardTableCtrl', DashboardTableCtrl);

    /** @ngInject */
    function DashboardTableCtrl($scope, $firebaseArray, $uibModal) {

        var ref = firebase.database().ref().child('healthOperators');
        $scope.hospitals = $firebaseArray(ref);

        $scope.smartTablePageSize = 10;

        $scope.open = function (page, size, hospital) {

            $scope.hospital = hospital;

            $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                scope: $scope,
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
        };

    }
})();