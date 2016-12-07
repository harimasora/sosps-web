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

    $scope.addBulkAll = function () {

      function switchOperator(id) {
        if (id == '1R0iVjzhcCaF5HUNMSyDHSaVC7N2') {
          return 'QMzF0Gv8q7QWhEHomD5EjEgTD4B3'
        } else {
          return '1R0iVjzhcCaF5HUNMSyDHSaVC7N2'
        }
      }

      var idA = '1R0iVjzhcCaF5HUNMSyDHSaVC7N2';
      var idB = 'QMzF0Gv8q7QWhEHomD5EjEgTD4B3';

      var hospitalsPSAdulto = $scope.specialties.$getRecord('PSAdulto').hospitals;
      var hospitalsPSPediatria = $scope.specialties.$getRecord('PSPediatria').hospitals;
      var operator = idA; // Initial specialty

      var timesArr = ['06h às 08h', '08h às 10h', '10h às 12h', '12h às 14h', '15h às 17h', '17h às 19h', '19h às 21h', '21h às 23h'];

      $scope.task.status = 'Pendente';
      $scope.task.date = $scope.task.date.getTime();

      // Need both hospitals specialties arrays
      if (hospitalsPSAdulto && hospitalsPSPediatria) {

        // Transform them into an hospital ids array
        hospitalsPSAdulto = Object.keys(hospitalsPSAdulto);
        hospitalsPSPediatria = Object.keys(hospitalsPSPediatria);

        for(var t=0; t<timesArr.length; t++) {
          var time = timesArr[t];
          for(var a=0; a<hospitalsPSAdulto.length; a++){
            var adultoId = hospitalsPSAdulto[a];
            var adultoTaskToAdd = $scope.task;
            adultoTaskToAdd.specialty = 'PSAdulto';
            adultoTaskToAdd.hospital = adultoId;
            adultoTaskToAdd.operator = operator;
            adultoTaskToAdd.timeRange = time;
            $scope.tasks.$add(adultoTaskToAdd)
              .then(function (ref) {
                var adultoTaskToOperator = $scope.tasks.$getRecord(ref.key);
                operatorsRef.child(adultoTaskToOperator.operator).child('tasks').child(adultoTaskToOperator.$id).set({
                  hospital: adultoTaskToOperator.hospital,
                  specialty: adultoTaskToOperator.specialty,
                  date: adultoTaskToOperator.date,
                  status: adultoTaskToOperator.status,
                  timeRange: adultoTaskToOperator.timeRange
                }).then(function() {
                    toastr.success('Suas informações foram salvas com sucesso!');
                  })
                  .catch(function(error) {
                    console.log(error);
                    toastr.error("Suas informações não foram salvas.", 'Erro');
                  })
              })
              .catch(function(error) {
                console.log(error);
                toastr.error("Suas informações não foram salvas.", 'Erro');
              })
          }
          operator = switchOperator(operator);
          for(var p=0; p<hospitalsPSPediatria.length; p++){
            var pediatriaId = hospitalsPSPediatria[p];
            var pediatriaTaskToAdd = $scope.task;
            pediatriaTaskToAdd.specialty = 'PSPediatria';
            pediatriaTaskToAdd.hospital = pediatriaId;
            pediatriaTaskToAdd.operator = operator;
            pediatriaTaskToAdd.timeRange = time;
            //Add tasks
            $scope.tasks.$add(pediatriaTaskToAdd)
              .then(function (ref) {
                var pediatriaTaskToOperator = $scope.tasks.$getRecord(ref.key);
                operatorsRef.child(pediatriaTaskToOperator.operator).child('tasks').child(pediatriaTaskToOperator.$id).set({
                  hospital: pediatriaTaskToOperator.hospital,
                  specialty: pediatriaTaskToOperator.specialty,
                  date: pediatriaTaskToOperator.date,
                  status: pediatriaTaskToOperator.status,
                  timeRange: pediatriaTaskToOperator.timeRange
                }).then(function() {
                    toastr.success('Suas informações foram salvas com sucesso!');
                  })
                  .catch(function(error) {
                    console.log(error);
                    toastr.error("Suas informações não foram salvas.", 'Erro');
                  })
              })
              .catch(function(error) {
                console.log(error);
                toastr.error("Suas informações não foram salvas.", 'Erro');
              })
          }
        }
        $scope.modalInstance.close('Create Button Clicked');
      } else {
        toastr.error("É necessário haver hospitais cadastrados em Infantil e Adulto", 'Erro');
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