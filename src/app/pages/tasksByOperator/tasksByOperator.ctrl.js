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

      $scope.setColor = function(status) {
          switch (status) {
              case "Concluído":
                  return 'success';
              case 'Pendente':
                  return 'warning';
              case 'Sem contato':
                  return 'danger';
              default:
                  return null;
          }
      };

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

        if (validateDate(taskToAdd) == true) {
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
                      watingTime: taskToAdd.watingTime == null ? 0 : taskToAdd.watingTime,
                      updateOn: taskToAdd.updateOn
                  }).then(function() {
                        // Update hospital with time
                        if (taskToAdd.status == 'Concluído') {
                            var hospitalRef = hospitalsRef.child(taskToAdd.hospital);
                            var hospital = $firebaseObject(hospitalRef);

                            hospital.$loaded().then(function () {
                                var watingTime = hospital.watingTime ? hospital.watingTime : {};
                                var updateOn = hospital.updateOn ? hospital.updateOn : {};
                                watingTime[taskToAdd.specialty] = taskToAdd.watingTime;
                                updateOn[taskToAdd.specialty] = taskToAdd.updateOn;
                                hospital.watingTime = watingTime;
                                hospital.updateOn = updateOn;
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
        }
    };

      function validateDate(taskToAdd) {
          var taskHour = parseInt(taskToAdd.timeRange.slice(0,2)); // Returns 06, 08, 10, ...
          var serverDate = new Date();
          var serverDateBeginning = new Date().setHours(0,0,0,0);
          var taskDate = new Date(taskToAdd.date).setHours(0,0,0,0);
          if (serverDateBeginning >= taskDate) {
              if (serverDateBeginning == taskDate){
                  // Task on same day
                  if (serverDate.getHours() >= taskHour) {
                      return true;
                  } else {
                      toastr.error("Não é possível fazer a tarefa de um horário posterior.", 'Erro');
                      return false;
                  }
              } else {
                  //Task on the past
                  return true;
              }
          } else {
              // Task on the future
              toastr.error("Não é possível fazer a tarefa de um dia posterior.", 'Erro');
              return false;
          }
      }

  }
})();