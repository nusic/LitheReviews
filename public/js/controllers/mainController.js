angular.module('myApp').controller('MainController',[
  '$scope',
  'courses',
  function ($scope, courses){
    $scope.courses = courses.courses;
  }
]);