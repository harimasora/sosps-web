(function () {
    'use strict';

    angular.module('BlurAdmin.pages.login', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                title: 'login',
                templateUrl: 'app/pages/login/login.html',
                controller: 'loginCtrl',
              sidebarMeta: {
                icon: 'ion-log-in',
                order: 1
              },
                resolve: {
                    // controller will not be loaded until $waitForSignIn resolves
                    // Auth refers to our $firebaseAuth wrapper in the factory below
                    "currentAuth": ["Auth", function(Auth) {
                        // $waitForSignIn returns a promise so the resolve waits for it to complete
                        return Auth.$waitForSignIn();
                    }]
                }
            });
    }

})();