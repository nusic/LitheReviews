angular.module('myApp').controller('ProgrammeController',[
  '$scope',
  '$stateParams',
  'courses',
  function ($scope, $stateParams, courses){
    $scope.courses = courses.courses;
    $scope.programme = $stateParams.id;
  }
]);