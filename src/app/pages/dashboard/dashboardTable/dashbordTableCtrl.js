/**
 * @author harimasora
 * created on 26.10.2016
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.dashboard')
        .controller('DashboardTableCtrl', DashboardTableCtrl);

    /** @ngInject */
    function DashboardTableCtrl($scope, $firebaseArray, $uibModal, toastr) {

        var ref = firebase.database().ref().child('healthOperators');
        $scope.hospitals = $firebaseArray(ref);

        $scope.smartTablePageSize = 10;

        $scope.open = function (page, size, hospital) {

            $scope.hospital = hospital;

            return $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                scope: $scope
            });
        };

        $scope.save = function() {
            $scope.hospitals.$save($scope.hospital)
                .then(function() {
                    $scope.modalInstance.close('Save Button Clicked');
                    toastr.success('Suas informações foram salvas com sucesso!');
                })
                .catch(function() {
                    toastr.error("Suas informações não foram salvas.", 'Erro');
                })
        }

    }
})();