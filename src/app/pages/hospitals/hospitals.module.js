(function () {
  'use strict';

  angular.module('BlurAdmin.pages.hospitals', [])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
      .state('dashboard.hospitals', {
        url: '/hospitals',
        templateUrl: 'app/pages/hospitals/hospitals.html',
        title: 'Hospitais',
        controller: 'HospitalsCtrl',
        sidebarMeta: {
          icon: 'ion-medkit',
          order: 5,
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
