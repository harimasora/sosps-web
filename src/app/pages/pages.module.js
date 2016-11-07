/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages', [
    'ui.router',

    'BlurAdmin.pages.dashboard',
    'BlurAdmin.pages.home',
    'BlurAdmin.pages.hospitals',
    'BlurAdmin.pages.operators',
    'BlurAdmin.pages.healthOperators',
    'BlurAdmin.pages.tasks',
    'BlurAdmin.pages.tasksByOperator',
    'BlurAdmin.pages.ui',
    'BlurAdmin.pages.components',
    'BlurAdmin.pages.form',
    'BlurAdmin.pages.tables',
    'BlurAdmin.pages.charts',
    'BlurAdmin.pages.maps',
    'BlurAdmin.pages.login',
    'BlurAdmin.pages.profile',
  ])

      .run(["$rootScope", "$state", "toastr", function($rootScope, $state, toastr) {
        $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
          // We can catch the error thrown when the $requireSignIn promise is rejected
          // and redirect the user back to the home page
          if (error === "AUTH_REQUIRED") {
            $state.go("login");
            toastr.error("É preciso realizar login para acessar esta página.", 'Acesso Negado');
          }
          if (error === "NO_ADMIN_ACCESS") {
            toastr.error("Você não possui permissão para acessar esta página.", 'Acesso Negado');
          }
        });
      }])

      .config(routeConfig)

      .factory("Auth", ["$firebaseAuth",
        function($firebaseAuth) {
          return $firebaseAuth();
        }
      ])

      .factory('Rights', function ($q) {
        var ref = firebase.database().ref();

        return {
          hasOperatorAccess: function (user) {
            var deferred = $q.defer();
            ref.child("users").child(user.uid).once('value').then(function (snapshot) {
              if (snapshot.val()) {
                if (snapshot.val().accessLevel >= 50) {
                  deferred.resolve(true);
                } else {
                  deferred.reject("NO_OPERATOR_ACCESS");
                }
              }
              else{
                deferred.reject("NO_OPERATOR_ACCESS");
              }
            });
            return deferred.promise;
          },
          hasAdminAccess: function (user) {
            var deferred = $q.defer();
            ref.child("users").child(user.uid).once('value').then(function (snapshot) {
              if (snapshot.val()) {
                if (snapshot.val().accessLevel == 99) {
                  deferred.resolve(true);
                } else {
                  deferred.reject("NO_ADMIN_ACCESS");
                }
              }
              else{
                deferred.reject("NO_ADMIN_ACCESS");
              }
            });
            return deferred.promise;
          }
        };
      });

  /** @ngInject */
  function routeConfig($urlRouterProvider, baSidebarServiceProvider) {
    $urlRouterProvider.otherwise('/dashboard/home');

    //baSidebarServiceProvider.addStaticItem({
    //  title: 'Pages',
    //  icon: 'ion-document',
    //  subMenu: [{
    //    title: 'Sign In',
    //    fixedHref: 'auth.html',
    //    blank: true
    //  }, {
    //    title: 'Sign Up',
    //    fixedHref: 'reg.html',
    //    blank: true
    //  }, {
    //    title: 'User Profile',
    //    stateRef: 'profile'
    //  }, {
    //    title: '404 Page',
    //    fixedHref: '404.html',
    //    blank: true
    //  }]
    //});
    //baSidebarServiceProvider.addStaticItem({
    //  title: 'Menu Level 1',
    //  icon: 'ion-ios-more',
    //  subMenu: [{
    //    title: 'Menu Level 1.1',
    //    disabled: true
    //  }, {
    //    title: 'Menu Level 1.2',
    //    subMenu: [{
    //      title: 'Menu Level 1.2.1',
    //      disabled: true
    //    }]
    //  }]
    //});
  }

})();
