(function () {
  'use strict';

  angular.module('BlurAdmin.pages.tasks', [])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
      .state('dashboard.tasks', {
        url: '/tasks',
        templateUrl: 'app/pages/tasks/tasks.html',
        title: 'Tarefas',
        controller: 'TasksCtrl',
        sidebarMeta: {
          icon: 'ion-ios-paper',
          order: 15,
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
