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
          icon: 'ion-stats-bars',
          order: 15,
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
