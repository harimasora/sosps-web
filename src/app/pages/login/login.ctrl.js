(function () {
    'use strict';

    angular.module('BlurAdmin.pages.login')
        .controller('loginCtrl', loginCtrl);

    /** @ngInject */
    function loginCtrl($scope, Auth, $state) {

        $scope.loginWithEmailAndPassword = function () {
            Auth.$signInWithEmailAndPassword($scope.user.email, $scope.user.password).then(function(firebaseUser) {
                console.log("Signed in as:", firebaseUser.uid);
                $state.go('dashboard.home');
            }).catch(function(error) {
                console.error("Authentication failed:", error);
            });
        }


    }

})();