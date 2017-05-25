'use strict'

var app = angular.module('myApp', []);

// app.run is basically the main method of Angular
app.run(function($rootScope) {
});

app.controller('PlayerController', ['$scope','$http', function($scope,$http) {
  var apiKey = 'MDExODQ2OTg4MDEzNzQ5OTM4Nzg5MzFiZA001',
      nprUrl = 'http://api.npr.org/query?id=61&fields=relatedLink,title,byline,text,audio,image,pullQuote,all&output=JSON';

  // Hidden our previous section's content
  // construct our http request
  $http({
    method: 'JSONP',
    url: nprUrl + '&apiKey=' + apiKey + '&callback=JSON_CALLBACK'
  }).success(function(data, status) {
      console.log(data);
      $scope.programs = data.list.story;
  }).error(function(data, status) {
    // Some error occurred
  });




  $scope.playing = false;
  var audio = document.createElement('audio');
  $scope.audio = audio;

  $scope.play = function(program) {
    if ($scope.playing) audio.pause();
    var url = program.audio[0].format.mp4.$text;
    audio.src = url;

    var playPromise = $scope.audio.play();

    if (playPromise !== undefined) {
      playPromise.then(function() {
        console.log('yay')
      }).catch(function(error) {
        console.log('Chrome is blocking auto play', error)
      });
    }
    // Store the state of the player as playing
    $scope.playing = true;
  }

  $scope.actuallyPlay = function(){
    $scope.audio.play();
  }


}]);

app.controller('RelatedController', ['$scope', function($scope) {
}]);


app.controller('ClockController', function($scope) {
  var updateClock = function() {
    $scope.clock = new Date();
  };
  var timer = setInterval(function() {
    $scope.$apply(updateClock);
  }, 1000);
  updateClock();
});


app.controller('ClickCounterController', function($scope) {
  $scope.counter = 0;
  $scope.add = function(amount) { $scope.counter += amount; };
  $scope.subtract = function(amount) { $scope.counter -= amount; };
});
