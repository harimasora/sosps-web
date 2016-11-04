/**
 * @author harimasora
 * created on 31.10.2016
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.tasks')
    .controller('TasksByOperatorCtrl', TasksByOperatorCtrl);

  /** @ngInject */
  function TasksByOperatorCtrl($scope, $firebaseArray, $firebaseObject, $uibModal, toastr, currentAuth) {

    var tasksRef = firebase.database().ref().child('humanOperators').child(currentAuth.uid).child('tasks');
    $scope.tasks = $firebaseArray(tasksRef);

    var allTasksRef = firebase.database().ref().child('taskList');

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

    $scope.save = function() {
      var taskToAdd = $scope.task;
      taskToAdd.updateOn = firebase.database.ServerValue.TIMESTAMP;

      $scope.tasks.$save(taskToAdd)
        .then(function() {
          // Update All Tasks List

          allTasksRef.child(taskToAdd.$id).set({
            operator: currentAuth.uid,
            hospital: taskToAdd.hospital,
            specialty: taskToAdd.specialty,
            date: taskToAdd.date,
            status: taskToAdd.status,
            timeRange: taskToAdd.timeRange,
            watingTime: taskToAdd.watingTime,
            updateOn: taskToAdd.updateOn
          }).then(function() {
              // Update hospital with time
              if (taskToAdd.status == 'Concluído') {
                var hospitalRef = hospitalsRef.child(taskToAdd.hospital);
                var hospital = $firebaseObject(hospitalRef);

                hospital.$loaded().then(function () {
                  hospital.watingTime = taskToAdd.watingTime;
                  hospital.updateOn = taskToAdd.updateOn;
                  hospital.$save().then(function () {
                    $scope.modalInstance.close('Create Button Clicked');
                    toastr.success('Suas informações foram salvas com sucesso!');
                  })
                })
              } else {
                $scope.modalInstance.close('Create Button Clicked');
                toastr.success('Suas informações foram salvas com sucesso!');
              }
            })
            .catch(function() {
              toastr.error("Suas informações não foram salvas.", 'Erro');
            });

        })
        .catch(function() {
          toastr.error("Suas informações não foram salvas.", 'Erro');
        })
    };

  }
})();