angular.module('myApp', ['ui.router', 'd3', 'ngAnimate']);


angular.module('myApp').config([
'$stateProvider',
'$urlRouterProvider',
'$locationProvider',
function ($stateProvider, $urlRouterProvider, $locationProvider) {
  $stateProvider
    .state('home', {
    url: '/',
    templateUrl: '/index.html',
    controller: 'MainController',
  })

  .state('programme', {
    url: '/programme/{id}',
    templateUrl: '/programme.html',
    controller: 'ProgrammeController',
    resolve: {
      coursePromise: ['$stateParams', 'courses', function($stateParams, courses){
        return courses.getForProgramme($stateParams.id);
      }]
    }
  })

  .state('courses', {
    url: '/courses/{id}',
    templateUrl: '/courses.html',
    controller: 'CourseController',
    resolve: {
      course: ['$stateParams', 'courses', function ($stateParams, courses){
        return courses.get($stateParams.id);
      }]
    }
  })

  .state('/login', {});
  
  $urlRouterProvider.otherwise('/');
}]);


