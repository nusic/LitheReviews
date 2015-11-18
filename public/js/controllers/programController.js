angular.module('myApp').controller('ProgramController',[
  '$scope',
  '$stateParams',
  'courses',
  function ($scope, $stateParams, courses){
    $scope.courses = courses.courses;
    $scope.program = $stateParams.id;
    $scope.courses_url = 'http://kdb-5.liu.se/liu/lith/studiehandboken/action.lasso?'
	    + '&-response=lot_response.lasso'
	    + '&-op=eq&kp_budget_year=' + (new Date).getFullYear()
	    + '&-op=eq&kp_programkod=' + $scope.program
	    + '&-op=eq&kp_programprofil=' + $scope.program
  }
]);