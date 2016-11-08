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
      $scope.task.status = 'Pendente';
      $scope.task.date = $scope.task.date.getTime();

      var taskToAdd = $scope.task;

      $scope.tasks.$add(taskToAdd)
        .then(function (ref) {
          operatorsRef.child(taskToAdd.operator).child('tasks').child(ref.key).set({
            hospital: taskToAdd.hospital,
            specialty: taskToAdd.specialty,
            date: taskToAdd.date,
            status: taskToAdd.status,
            timeRange: taskToAdd.timeRange
          }).then(function() {
              $scope.modalInstance.close('Create Button Clicked');
              toastr.success('Suas informações foram salvas com sucesso!');
            })
            .catch(function() {
              toastr.error("Suas informações não foram salvas.", 'Erro');
            });
        })
        .catch(function() {
          toastr.error("Suas informações não foram salvas.", 'Erro');
        })
    };

    $scope.addBulk = function () {
      var selectedSpecialty = $scope.specialties.$getRecord($scope.task.specialty);

      $scope.task.status = 'Pendente';
      $scope.task.date = $scope.task.date.getTime();

      if (selectedSpecialty.hospitals) {
        var keys = Object.keys(selectedSpecialty.hospitals);

        for (var i=0; i<keys.length; i++) {
          var hospitalId = keys[i];
          var taskToAdd = $scope.task;
          taskToAdd.hospital = hospitalId;

          $scope.tasks.$add(taskToAdd)
            .then(function (ref) {
              var taskToOperator = $scope.tasks.$getRecord(ref.key);
              operatorsRef.child(taskToOperator.operator).child('tasks').child(taskToOperator.$id).set({
                hospital: taskToOperator.hospital,
                specialty: taskToOperator.specialty,
                date: taskToOperator.date,
                status: taskToOperator.status,
                timeRange: taskToOperator.timeRange
              }).then(function() {
                  toastr.success('Suas informações foram salvas com sucesso!');
                })
                .catch(function() {
                  toastr.error("Suas informações não foram salvas.", 'Erro');
                })
            })
            .catch(function() {
              toastr.error("Suas informações não foram salvas.", 'Erro');
            })
        }

        $scope.modalInstance.close('Create Button Clicked');
      }
    };

    $scope.save = function() {
      var taskToAdd = $scope.task;
      $scope.tasks.$save(taskToAdd)
        .then(function(ref) {
          operatorsRef.child(taskToAdd.operator).child('tasks').child(ref.key).set({
            hospital: taskToAdd.hospital,
            specialty: taskToAdd.specialty,
            date: taskToAdd.date,
            status: taskToAdd.status,
            timeRange: taskToAdd.timeRange
          }).then(function() {
              $scope.modalInstance.close('Create Button Clicked');
              toastr.success('Suas informações foram salvas com sucesso!');
            })
            .catch(function() {
              toastr.error("Suas informações não foram salvas.", 'Erro');
            });

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