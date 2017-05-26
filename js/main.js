'use strict'

var app = angular.module('myApp', []);

// app.run is basically the main method of Angular
app.run(function($rootScope) {
});

app.factory('nprService', ['$http', function($http) {
    var doRequest = function() {
      var apiKey = 'MDExODQ2OTg4MDEzNzQ5OTM4Nzg5MzFiZA001',
          nprUrl = 'http://api.npr.org/query?id=61&fields=relatedLink,title,byline,text,audio,image,pullQuote,all&output=JSON';

      return $http({
        method: 'JSONP',
        url: nprUrl + '&apiKey=' + apiKey + '&callback=JSON_CALLBACK'
      });
    }

    return {
      programs: function() { return doRequest(); }
    };
  }]);

app.controller('PlayerController', ['$scope','nprService','playerService',
  function($scope,nprService,playerService) {

  nprService.programs()
    .success(function(data, status) {
      $scope.programs = data.list.story;
    });

   $scope.player = playerService;


}]);

// Services are singletons
app.factory('audioService', ['$document',
  function($document) {
  var audio = $document[0].createElement('audio');
  return audio;
}]);

app.factory('playerService', ['audioService','$rootScope',
  function(audioService,$rootScope) {
  var player = {
    playing: false,
    current: null,
    ready: false,

    currentTime: function() {
      return audioService.currentTime;
    },
    currentDuration: function() {
      return parseInt(audioService.duration);
    },

    play: function(program) {
      // If we are playing, stop the current playback
      if (player.playing) player.stop();
      var url = program.audio[0].format.mp4.$text; // from the npr API
      player.current = program; // Store the current program
      //audioService.src = url; //Chrome doesn't like this?
      audioService.src = './media/Appliance_Kiosk.wav';
      var playPromise = audioService.play(); // Start playback of the url
      if (playPromise !== undefined) {
        playPromise.then(function() {
          console.log('audio started')
          player.playing = true
        }).catch(function(error) {
          console.log('Chrome is blocking auto play', error)
        });
      }
    },

    stop: function() {
      if (player.playing) {
        audioService.pause(); // stop playback
        // Clear the state of the player
        player.ready = player.playing = false;
        player.current = null;
      }
    }
  };

  audioService.addEventListener('ended', function() {
    console.log('audio ended');
    $rootScope.$apply(player.stop());
  });

  audioService.addEventListener('timeupdate', function(evt) {
    $rootScope.$apply(function() {
      player.progress = player.currentTime();
      player.progress_percent = player.progress / player.currentDuration();
    });
  });

  audioService.addEventListener('canplay', function(evt) {
    $rootScope.$apply(function() {
      player.ready = true;
    });
  });

  return player;
}]);


app.controller('ClockController',
  function($scope) {
  var updateClock = function() {
    $scope.clock = new Date();
  };
  var timer = setInterval(function() {
    $scope.$apply(updateClock);
  }, 1000);
  updateClock();
});


app.controller('ClickCounterController',
  function($scope) {
  $scope.counter = 0;
  $scope.add = function(amount) { $scope.counter += amount; };
  $scope.subtract = function(amount) { $scope.counter -= amount; };
});

app.directive('nprLink', function() {
  return {
    restrict: 'EA',
    require: ['^ngModel'],
    replace: true,
    scope: {
      ngModel: '=',
      player: '='
    },
    templateUrl: '/views/nprListItem',
    link: function(scope, ele, attr) {
      scope.duration = scope.ngModel.audio[0].duration.$text;
    }
  }
});

app.controller('RelatedController', ['$scope', 'playerService',
  function($scope, playerService) {
  $scope.player = playerService;

  $scope.$watch('player.current', function(program) {
    if (program) {
      $scope.related = [];
      angular.forEach(program.relatedLink, function(link) {
        $scope.related.push({
          link: link.link[0].$text,
          caption: link.caption.$text
        });
      });
    }
  });
}]);
