(function () {
  'use strict';

  angular.module('BlurAdmin.pages.operators', [])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
      .state('dashboard.operators', {
        url: '/operators',
        templateUrl: 'app/pages/operators/operators.html',
        title: 'Operadores',
        controller: 'OperatorsCtrl',
        sidebarMeta: {
          icon: 'ion-ios-people',
          order: 10,
        },
        resolve: {
          // controller will not be loaded until $requireSignIn resolves
          // Auth refers to our $firebaseAuth wrapper in the factory below
          "currentAuth": ["Auth", function(Auth) {
            // $requireSignIn returns a promise so the resolve waits for it to complete
            // If the promise is rejected, it will throw a $stateChangeError (see above)
            return Auth.$requireSignIn();
          }],
          "waitForAuth": ["Auth", function (Auth) {
            // $requireAuth returns a promise so the resolve waits for it to complete
            // If the promise is rejected, it will throw a $stateChangeError (see above)
            return Auth.$waitForSignIn();
          }],
          //Here i check if a user has admin rights, note that i pass currentAuth and waitForAuth to this function to make sure those are resolves before this function
          "canAccess": function (currentAuth, waitForAuth, Rights) {
            return Rights.hasAdminAccess(currentAuth);
          }
        }
      });
  }

})();
