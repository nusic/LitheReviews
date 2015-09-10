angular.module('myApp', ['ui.router', 'd3']);


angular.module('myApp').config([
'$stateProvider',
'$urlRouterProvider',
function ($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('home', {
    url: '/',
    templateUrl: '/index.html',
    controller: 'MainController',
    resolve: {
      coursePromise: ['courses', function(courses){
        return courses.getAll();
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
  });

  $urlRouterProvider.otherwise('/');
}]);


