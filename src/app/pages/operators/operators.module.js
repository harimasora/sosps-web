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
          icon: 'ion-stats-bars',
          order: 10,
        },
        resolve: {
          // controller will not be loaded until $requireSignIn resolves
          // Auth refers to our $firebaseAuth wrapper in the factory below
          "currentAuth": ["Auth", function(Auth) {
            // $requireSignIn returns a promise so the resolve waits for it to complete
            // If the promise is rejected, it will throw a $stateChangeError (see above)
            return Auth.$requireSignIn();
          }]
        }
      });
  }

})();
