angular.module('myApp').controller('ProgramController',[
  '$scope',
  '$stateParams',
  'courses',
  function ($scope, $stateParams, courses){
    $scope.courses = courses.courses;
    $scope.program = $stateParams.id;
  }
]);