/**
 * @author harimasora
 * created on 31.10.2016
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.operators')
    .controller('OperatorsCtrl', OperatorsCtrl);

  /** @ngInject */
  function OperatorsCtrl($scope, $firebaseArray, $uibModal, toastr) {

    var ref = firebase.database().ref().child('healthOperators');
    $scope.operators = $firebaseArray(ref);

    $scope.smartTablePageSize = 10;

    $scope.open = function (page, size, hospital) {

      $scope.operator = hospital;

      return $scope.modalInstance = $uibModal.open({
        animation: true,
        templateUrl: page,
        size: size,
        scope: $scope
      });
    };

    $scope.add = function () {
      $scope.operators.$add($scope.operator)
        .then(function () {
          $scope.modalInstance.close('Create Button Clicked');
          toastr.success('Suas informações foram salvas com sucesso!');
        })
        .catch(function() {
          toastr.error("Suas informações não foram salvas.", 'Erro');
        })
    };

    $scope.save = function() {
      $scope.operators.$save($scope.operator)
        .then(function() {
          $scope.modalInstance.close('Save Button Clicked');
          toastr.success('Suas informações foram salvas com sucesso!');
        })
        .catch(function() {
          toastr.error("Suas informações não foram salvas.", 'Erro');
        })
    };

    $scope.remove = function() {
      $scope.operators.$remove($scope.operator)
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