(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .controller('pageTopCtrl', pageTopCtrl);

    /** @ngInject */
    function pageTopCtrl($scope, Auth, $state) {

        $scope.signOut = function() {
            Auth.$signOut().then(function () {
                $state.go('login');
            });
        }

    }

})();