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

  .state('program', {
    url: '/program/{id}',
    templateUrl: '/program.html',
    controller: 'ProgramController',
    resolve: {
      coursePromise: ['$stateParams', 'courses', function($stateParams, courses){
        return courses.getForProgram($stateParams.id);
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


