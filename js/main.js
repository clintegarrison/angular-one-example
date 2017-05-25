'use strict'

var app = angular.module('myApp', []);

// app.run is basically the main method of Angular
app.run(function($rootScope) {
});

app.controller('PlayerController', ['$scope', function($scope) {
  $scope.playing = false;
  $scope.audio = document.createElement('audio');
  $scope.audio.src = './media/Appliance_Kiosk.wav';
  $scope.play = function() {
    $scope.audio.play();
    $scope.playing = true;
  };
  $scope.stop = function() {
    $scope.audio.pause();
    $scope.playing = false;
  };
  $scope.audio.addEventListener('ended', function() {
    $scope.$apply(function() {
      $scope.stop()
    });
  });
}]);

app.controller('RelatedController', ['$scope', function($scope) {
}]);
