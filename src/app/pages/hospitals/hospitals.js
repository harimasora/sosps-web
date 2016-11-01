/**
 * @author harimasora
 * created on 26.10.2016
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.hospitals')
        .controller('HospitalsCtrl', HospitalsCtrl);

    /** @ngInject */
    function HospitalsCtrl($scope, $firebaseArray, $uibModal, toastr) {

        var ref = firebase.database().ref().child('hospitals');
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

        $scope.add = function () {
            $scope.hospitals.$add($scope.hospital)
                .then(function (ref) {
                  $scope.hospital = $scope.hospitals.$getRecord(ref.key);
                  //Upload image (if any) then save
                  $scope.uploadFile();
                })
                .catch(function() {
                    toastr.error("Suas informações não foram salvas.", 'Erro');
                })
        };

        $scope.save = function() {
            //Upload image (if any) then save
            $scope.uploadFile();
        };

        $scope.remove = function() {
            $scope.hospitals.$remove($scope.hospital)
                .then(function() {
                    $scope.modalInstance.close('Remove Button Clicked');
                    toastr.error('Item deletado!', 'Aviso');
                })
                .catch(function() {
                    toastr.error("Suas informações não foram salvas.", 'Erro');
                })
        };

        var _validFileExtensions = [".jpg", ".jpeg", ".bmp", ".gif", ".png"];
        $scope.uploadFile = function() {
          var sFileName = $("#inputPhoto").val();
          if (sFileName.length > 0) {
            var blnValid = false;
            for (var j = 0; j < _validFileExtensions.length; j++) {
              var sCurExtension = _validFileExtensions[j];
              if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
                blnValid = true;
                var filesSelected = document.getElementById("inputPhoto").files;
                if (filesSelected.length > 0) {
                  var fileToLoad = filesSelected[0];

                  var fileReader = new FileReader();

                  fileReader.onload = function(fileLoadedEvent) {
                    var textAreaFileContents = document.getElementById(
                      "textAreaFileContents"
                    );


                    hospitalPhoto($scope.hospital.$id).put(fileToLoad)
                      .then(function() {
                        hospitalPhoto($scope.hospital.$id).getDownloadURL()
                          .then(function(url) {
                            $scope.hospital.photoUrl = url;
                            $scope.hospitals.$save($scope.hospital)
                              .then(function() {
                                $scope.modalInstance.close('Save Button Clicked');
                                toastr.success('Suas informações foram salvas com sucesso!');
                              })
                              .catch(function() {
                                toastr.error("Suas informações não foram salvas.", 'Erro');
                              })
                          });
                      });
                  };

                  fileReader.readAsDataURL(fileToLoad);
                }
                break;
              }
            }

            if (!blnValid) {
              alert('File is not valid');
              return false;
            }
          } else {
            $scope.hospitals.$save($scope.hospital)
              .then(function() {
                $scope.modalInstance.close('Save Button Clicked');
                toastr.success('Suas informações foram salvas com sucesso!');
              })
              .catch(function() {
                toastr.error("Suas informações não foram salvas.", 'Erro');
              })
          }


          return true;
        };

        function hospitalPhoto(uid) {
          return firebase.storage().ref('hospitalsPhotos').child(uid).child('photo.png');
        }

    }
})();