(function () {
    'use strict';

    angular.module('BlurAdmin.pages.login')
        .controller('loginCtrl', loginCtrl);

    /** @ngInject */
    function loginCtrl($scope, Auth, $state, $firebaseObject) {

        $scope.loginWithEmailAndPassword = function () {
            Auth.$signInWithEmailAndPassword($scope.user.email, $scope.user.password).then(function(firebaseUser) {
                var userRef = firebase.database().ref('users').child(firebaseUser.uid);
                var user =  $firebaseObject(userRef);

                user.$loaded().then(function() {
                    if (user.accessLevel) {
                        var level = user.accessLevel;
                        if (level < 99 ) {
                            $state.go('dashboard.tasksByOperator');
                        } else {
                            $state.go('dashboard.home');
                        }
                    }
                });
            }).catch(function(error) {
                console.error("Authentication failed:", error);
            });
        }


    }

})();