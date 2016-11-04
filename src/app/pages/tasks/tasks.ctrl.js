/**
 * @author harimasora
 * created on 31.10.2016
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.tasks')
    .controller('TasksCtrl', TasksCtrl);

  /** @ngInject */
  function TasksCtrl($scope, $firebaseArray, $firebaseObject, $uibModal, toastr) {

    var tasksRef = firebase.database().ref().child('taskList');
    $scope.tasks = $firebaseArray(tasksRef);

    var hospitalsRef = firebase.database().ref().child('hospitals');
    $scope.hospitals = $firebaseArray(hospitalsRef);

    var operatorsRef = firebase.database().ref().child('humanOperators');
    $scope.operators = $firebaseArray(operatorsRef);

    var specialtiesRef = firebase.database().ref().child('specialties');
    $scope.specialties = $firebaseArray(specialtiesRef);

    $scope.smartTablePageSize = 10;

    $scope.open = function (page, size, item) {

      $scope.task = item;

      return $scope.modalInstance = $uibModal.open({
        animation: true,
        templateUrl: page,
        size: size,
        scope: $scope
      });
    };

    $scope.add = function () {
      $scope.task.done = false;
      $scope.task.date = $scope.task.date.getTime();
      $scope.tasks.$add($scope.task)
        .then(function (ref) {
          var operatorTaskRef = operatorsRef.child($scope.task.operator).child('tasks').child(ref.key);
          $scope.operatorTask = $firebaseObject(operatorTaskRef);

          $scope.operatorTask.$loaded()
            .then(function() {
              // Remove unnecessary key
              $scope.task.operator = null;

              // Add task to operator
              $scope.operatorTask.hospital = $scope.task.hospital;
              $scope.operatorTask.specialty = $scope.task.specialty;
              $scope.operatorTask.date = $scope.task.date;
              $scope.operatorTask.done = $scope.task.status;
              $scope.operatorTask.done = $scope.task.timeRange;

              $scope.operatorTask.$save()
                .then(function() {
                  $scope.modalInstance.close('Create Button Clicked');
                  toastr.success('Suas informações foram salvas com sucesso!');
                })
                .catch(function() {
                  toastr.error("Suas informações não foram salvas.", 'Erro');
                })
            })
        })
        .catch(function() {
          toastr.error("Suas informações não foram salvas.", 'Erro');
        })
    };

    $scope.save = function() {
      $scope.tasks.$save($scope.task)
        .then(function(ref) {
          var operatorTaskRef = operatorsRef.child($scope.task.operator).child('tasks').child(ref.key);
          $scope.operatorTask = $firebaseObject(operatorTaskRef);

          $scope.operatorTask.$loaded()
            .then(function() {
              // Remove unnecessary key
              $scope.task.operator = null;

              // Add task to operator
              $scope.operatorTask.hospital = $scope.task.hospital;
              $scope.operatorTask.specialty = $scope.task.specialty;
              $scope.operatorTask.date = $scope.task.date;
              $scope.operatorTask.done = $scope.task.status;
              $scope.operatorTask.done = $scope.task.timeRange;

              $scope.operatorTask.$save()
                .then(function() {
                  $scope.modalInstance.close('Create Button Clicked');
                  toastr.success('Suas informações foram salvas com sucesso!');
                })
                .catch(function() {
                  toastr.error("Suas informações não foram salvas.", 'Erro');
                })
            })
        })
        .catch(function() {
          toastr.error("Suas informações não foram salvas.", 'Erro');
        })
    };

    $scope.remove = function() {
      var id = $scope.task.$id;
      $scope.tasks.$remove($scope.task)
        .then(function() {
          var operatorTaskRef = operatorsRef.child($scope.task.operator).child('tasks').child(id);
          $scope.operatorTask = $firebaseObject(operatorTaskRef);

          $scope.operatorTask.$loaded()
            .then(function() {

              $scope.operatorTask.$remove()
                .then(function() {
                  $scope.modalInstance.close('Remove Button Clicked');
                  toastr.error('Item deletado!', 'Aviso');
                })
                .catch(function() {
                  toastr.error("Suas informações não foram salvas.", 'Erro');
                })
            })
        })
        .catch(function() {
          toastr.error("Suas informações não foram salvas.", 'Erro');
        })
    };

    $scope.openDatePopup = function() {
      $scope.datePopup.opened = true;
    };
    $scope.datePopup = {
      opened: false
    };

  }
})();