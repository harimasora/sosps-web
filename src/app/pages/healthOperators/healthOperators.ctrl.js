/**
 * @author harimasora
 * created on 31.10.2016
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.healthOperators')
    .controller('HealthOperatorsCtrl', HealthOperatorsCtrl);

  /** @ngInject */
  function HealthOperatorsCtrl($scope, $firebaseArray, $uibModal, toastr) {

    var ref = firebase.database().ref().child('healthOperators');
    $scope.healthOperators = $firebaseArray(ref);

    $scope.smartTablePageSize = 10;

    $scope.open = function (page, size, item) {

      $scope.healthOperator = item;

      return $scope.modalInstance = $uibModal.open({
        animation: true,
        templateUrl: page,
        size: size,
        scope: $scope
      });
    };

    $scope.add = function () {
      $scope.healthOperators.$add($scope.healthOperator)
        .then(function () {
          $scope.modalInstance.close('Create Button Clicked');
          toastr.success('Suas informações foram salvas com sucesso!');
        })
        .catch(function() {
          toastr.error("Suas informações não foram salvas.", 'Erro');
        })
    };

    $scope.save = function() {
      $scope.healthOperators.$save($scope.healthOperator)
        .then(function() {
          $scope.modalInstance.close('Save Button Clicked');
          toastr.success('Suas informações foram salvas com sucesso!');
        })
        .catch(function() {
          toastr.error("Suas informações não foram salvas.", 'Erro');
        })
    };

    $scope.remove = function() {
      $scope.healthOperators.$remove($scope.healthOperator)
        .then(function() {
          $scope.modalInstance.close('Remove Button Clicked');
          toastr.error('Item deletado!', 'Aviso');
        })
        .catch(function() {
          toastr.error("Suas informações não foram salvas.", 'Erro');
        })
    };

  }
})();