/**
 * @author harimasora
 * created on 31.10.2016
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users')
      .controller('UsersCtrl', UsersCtrl);

    /** @ngInject */
    function UsersCtrl($scope, $firebaseArray) {

        var ref = firebase.database().ref().child('users');
        $scope.users = $firebaseArray(ref);

        $scope.smartTablePageSize = 10;
    }
})();