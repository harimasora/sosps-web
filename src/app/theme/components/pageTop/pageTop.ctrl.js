(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .controller('pageTopCtrl', pageTopCtrl);

    /** @ngInject */
    function pageTopCtrl($scope, Auth, $state, $firebaseObject) {

        var firebaseUser = Auth.$getAuth();

        var ref = firebase.database().ref("users");
        var profileRef = ref.child(firebaseUser.uid);
        $scope.profile = $firebaseObject(profileRef);


        $scope.signOut = function() {
            Auth.$signOut().then(function () {
                $state.go('login');
            });
        }

    }

})();